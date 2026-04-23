"use client"

import { useState, useRef, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { 
  Mail, Lock, Eye, EyeOff, Phone, User, MapPin, CreditCard, 
  ChevronRight, ChevronLeft, Shield, CheckCircle2, AlertCircle, 
  Loader2, Heart, FileText, Smartphone, Apple, Chrome, RefreshCw,
  ShieldCheck, KeyRound, Fingerprint, MessageSquare, Clock, Check,
  Building, Globe, Wallet, Landmark, AlertTriangle, Car
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import Link from "next/link"

type AuthMode = "login" | "register"
type RegisterStep = 1 | 2 | 3 | 4 | 5 | 6 | 7

export default function AppLogin() {
  const [mode, setMode] = useState<AuthMode>("login")
  const [step, setStep] = useState<RegisterStep>(1)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [verificationId, setVerificationId] = useState("")
  const [otpSent, setOtpSent] = useState(false)
  const [otpVerified, setOtpVerified] = useState(false)
  const [emailVerified, setEmailVerified] = useState(false)
  const [countdown, setCountdown] = useState(0)
  const [passwordStrength, setPasswordStrength] = useState(0)

  // OTP Input refs
  const otpRefs = [
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
  ]
  const [otpValues, setOtpValues] = useState(["", "", "", "", "", ""])

  // Login state
  const [loginEmail, setLoginEmail] = useState("")
  const [loginPassword, setLoginPassword] = useState("")

  // Registration state
  const [formData, setFormData] = useState({
    // Step 1: Personal Info
    firstName: "",
    middleName: "",
    lastName: "",
    phone: "",
    // Step 2: OTP Verification (handled separately)
    // Step 3: Email
    email: "",
    // Step 4: Address
    streetAddress: "",
    apartment: "",
    city: "",
    state: "",
    zipCode: "",
    country: "United States",
    // Step 5: Password
    password: "",
    confirmPassword: "",
    // Step 6: Payment
    paymentMethod: "card" as "card" | "wallet" | "bank",
    cardNumber: "",
    cardExpiry: "",
    cardCvv: "",
    cardName: "",
    bankName: "",
    bankRouting: "",
    bankAccount: "",
    walletEmail: "",
    // Step 7: Emergency & Consent
    emergencyName: "",
    emergencyPhone: "",
    emergencyRelation: "",
    agreeTerms: false,
    agreePrivacy: false,
    agreePaymentStorage: false,
    agreeLocation: false,
    agreeMarketing: false,
  })

  // Countdown timer
  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000)
      return () => clearTimeout(timer)
    }
  }, [countdown])

  // Password strength calculator
  useEffect(() => {
    const password = formData.password
    let strength = 0
    if (password.length >= 8) strength++
    if (password.length >= 12) strength++
    if (/[a-z]/.test(password)) strength++
    if (/[A-Z]/.test(password)) strength++
    if (/[0-9]/.test(password)) strength++
    if (/[!@#$%^&*(),.?":{}|<>]/.test(password)) strength++
    setPasswordStrength(Math.min(strength, 5))
  }, [formData.password])

  const updateField = (field: string, value: string | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    setError("")
  }

  // Handle OTP input
  const handleOtpChange = (index: number, value: string) => {
    if (value.length > 1) value = value.slice(-1)
    if (!/^\d*$/.test(value)) return

    const newOtp = [...otpValues]
    newOtp[index] = value
    setOtpValues(newOtp)

    if (value && index < 5) {
      otpRefs[index + 1].current?.focus()
    }
  }

  const handleOtpKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === "Backspace" && !otpValues[index] && index > 0) {
      otpRefs[index - 1].current?.focus()
    }
  }

  // API Calls
  const initiateRegistration = async () => {
    setIsLoading(true)
    setError("")
    
    try {
      const response = await fetch("/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "INITIATE_REGISTRATION",
          phone: formData.phone,
          email: formData.email || `temp-${Date.now()}@glideway.com`,
          firstName: formData.firstName,
          lastName: formData.lastName
        })
      })

      const data = await response.json()
      
      if (data.success) {
        setVerificationId(data.verificationId)
        setOtpSent(true)
        setCountdown(600) // 10 minutes
        setStep(2)
        setSuccess("Verification code sent to your phone!")
      } else {
        setError(data.error)
      }
    } catch (err) {
      setError("Network error. Please try again.")
    }
    
    setIsLoading(false)
  }

  const verifyOtp = async () => {
    const code = otpValues.join("")
    if (code.length !== 6) {
      setError("Please enter the complete 6-digit code")
      return
    }

    setIsLoading(true)
    setError("")

    try {
      const response = await fetch("/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "VERIFY_OTP",
          verificationId,
          code
        })
      })

      const data = await response.json()

      if (data.success) {
        setOtpVerified(true)
        setStep(3)
        setSuccess("Phone verified successfully!")
      } else {
        setError(data.error)
        if (data.attemptsRemaining !== undefined) {
          setError(`${data.error}. ${data.attemptsRemaining} attempts remaining.`)
        }
      }
    } catch (err) {
      setError("Network error. Please try again.")
    }

    setIsLoading(false)
  }

  const resendOtp = async () => {
    if (countdown > 540) return // Must wait at least 60 seconds

    setIsLoading(true)
    try {
      const response = await fetch("/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "RESEND_OTP",
          verificationId
        })
      })

      const data = await response.json()
      if (data.success) {
        setOtpValues(["", "", "", "", "", ""])
        setCountdown(600)
        setSuccess("New code sent!")
      } else {
        setError(data.error)
      }
    } catch (err) {
      setError("Network error")
    }
    setIsLoading(false)
  }

  const completeRegistration = async () => {
    if (!formData.agreeTerms || !formData.agreePrivacy || !formData.agreePaymentStorage) {
      setError("Please accept all required agreements")
      return
    }

    setIsLoading(true)
    setError("")

    try {
      const response = await fetch("/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "COMPLETE_REGISTRATION",
          verificationId,
          ...formData
        })
      })

      const data = await response.json()

      if (data.success) {
        // Store token
        localStorage.setItem("glideway_token", data.token)
        localStorage.setItem("glideway_user", JSON.stringify(data.user))
        
        setSuccess("Account created successfully!")
        setTimeout(() => {
          window.location.href = "/rider"
        }, 1500)
      } else {
        setError(data.error)
      }
    } catch (err) {
      setError("Network error. Please try again.")
    }

    setIsLoading(false)
  }

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setIsLoading(true)

    try {
      const response = await fetch("/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "LOGIN",
          email: loginEmail,
          password: loginPassword,
          userType: "RIDER"
        })
      })

      const data = await response.json()

      if (data.success) {
        localStorage.setItem("glideway_token", data.token)
        localStorage.setItem("glideway_user", JSON.stringify(data.user))
        window.location.href = "/rider"
      } else {
        setError(data.error)
      }
    } catch (err) {
      setError("Network error. Please try again.")
    }

    setIsLoading(false)
  }

  const handleNextStep = () => {
    setError("")
    setSuccess("")

    if (step === 1) {
      if (!formData.firstName || !formData.lastName || !formData.phone) {
        setError("Please fill in all required fields")
        return
      }
      if (!/^\+?[\d\s\-\(\)]{10,}$/.test(formData.phone)) {
        setError("Please enter a valid phone number")
        return
      }
      initiateRegistration()
      return
    }

    if (step === 2) {
      verifyOtp()
      return
    }

    if (step === 3) {
      if (!formData.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
        setError("Please enter a valid email address")
        return
      }
      setStep(4)
      return
    }

    if (step === 4) {
      if (!formData.streetAddress || !formData.city || !formData.state || !formData.zipCode) {
        setError("Please fill in all address fields")
        return
      }
      setStep(5)
      return
    }

    if (step === 5) {
      if (formData.password.length < 8) {
        setError("Password must be at least 8 characters")
        return
      }
      if (formData.password !== formData.confirmPassword) {
        setError("Passwords do not match")
        return
      }
      if (passwordStrength < 3) {
        setError("Please create a stronger password")
        return
      }
      setStep(6)
      return
    }

    if (step === 6) {
      if (formData.paymentMethod === "card") {
        if (!formData.cardNumber || !formData.cardExpiry || !formData.cardCvv || !formData.cardName) {
          setError("Please fill in all payment details")
          return
        }
      }
      setStep(7)
      return
    }

    if (step === 7) {
      completeRegistration()
    }
  }

  const stepTitles = [
    "Personal Info",
    "Verify Phone",
    "Email Address",
    "Home Address",
    "Create Password",
    "Payment Method",
    "Final Step"
  ]

  const strengthColors = ["bg-red-500", "bg-orange-500", "bg-yellow-500", "bg-lime-500", "bg-green-500"]
  const strengthLabels = ["Very Weak", "Weak", "Fair", "Good", "Strong"]

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0a0a0a] via-[#0d1f0d] to-[#0a0a0a] flex items-center justify-center p-4">
      {/* Security Badge */}
      <div className="fixed top-4 left-1/2 -translate-x-1/2 flex items-center gap-2 bg-emerald-500/10 border border-emerald-500/20 rounded-full px-4 py-2 z-50">
        <ShieldCheck className="w-4 h-4 text-emerald-500" />
        <span className="text-xs text-emerald-400">256-bit SSL Encrypted</span>
        <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
      </div>

      <Card className="w-full max-w-md bg-[#111]/90 border-[#222] backdrop-blur-xl">
        <CardContent className="p-6">
          {/* Logo */}
          <div className="text-center mb-6">
            <div className="inline-flex items-center gap-2 mb-2">
              <div className="w-10 h-10 bg-emerald-500 rounded-xl flex items-center justify-center">
                <span className="text-white font-bold text-lg">G</span>
              </div>
              <span className="text-xl font-bold text-white">GlideWay</span>
            </div>
            <p className="text-sm text-gray-400">
              {mode === "login" ? "Welcome back! Sign in to continue" : "Create your account"}
            </p>
          </div>

          {/* Mode Tabs */}
          <div className="flex bg-[#1a1a1a] rounded-lg p-1 mb-6">
            <button
              onClick={() => { setMode("login"); setStep(1); setError(""); }}
              className={`flex-1 py-2 rounded-md text-sm font-medium transition-all ${
                mode === "login" ? "bg-emerald-500 text-white" : "text-gray-400 hover:text-white"
              }`}
            >
              Login
            </button>
            <button
              onClick={() => { setMode("register"); setStep(1); setError(""); }}
              className={`flex-1 py-2 rounded-md text-sm font-medium transition-all ${
                mode === "register" ? "bg-emerald-500 text-white" : "text-gray-400 hover:text-white"
              }`}
            >
              Register
            </button>
          </div>

          {/* Error/Success Messages */}
          <AnimatePresence>
            {error && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="mb-4 p-3 bg-red-500/10 border border-red-500/20 rounded-lg flex items-center gap-2"
              >
                <AlertCircle className="w-4 h-4 text-red-500" />
                <span className="text-sm text-red-400">{error}</span>
              </motion.div>
            )}
            {success && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="mb-4 p-3 bg-emerald-500/10 border border-emerald-500/20 rounded-lg flex items-center gap-2"
              >
                <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                <span className="text-sm text-emerald-400">{success}</span>
              </motion.div>
            )}
          </AnimatePresence>

          {/* LOGIN FORM */}
          {mode === "login" && (
            <form onSubmit={handleLogin} className="space-y-4">
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                <Input
                  type="email"
                  placeholder="Email address"
                  value={loginEmail}
                  onChange={(e) => setLoginEmail(e.target.value)}
                  className="pl-10 bg-[#1a1a1a] border-[#333] text-white"
                  required
                />
              </div>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                <Input
                  type={showPassword ? "text" : "password"}
                  placeholder="Password"
                  value={loginPassword}
                  onChange={(e) => setLoginPassword(e.target.value)}
                  className="pl-10 pr-10 bg-[#1a1a1a] border-[#333] text-white"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-white"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>

              <div className="flex justify-between items-center text-sm">
                <label className="flex items-center gap-2 text-gray-400">
                  <input type="checkbox" className="rounded bg-[#1a1a1a] border-[#333]" />
                  Remember me
                </label>
                <Link href="#" className="text-emerald-500 hover:underline">Forgot password?</Link>
              </div>

              <Button
                type="submit"
                disabled={isLoading}
                className="w-full bg-emerald-500 hover:bg-emerald-600 text-white"
              >
                {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : "Sign In"}
              </Button>

              {/* Social Login */}
              <div className="relative my-4">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-[#333]" />
                </div>
                <div className="relative flex justify-center text-xs">
                  <span className="px-2 bg-[#111] text-gray-500">or continue with</span>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <Button variant="outline" type="button" className="bg-[#1a1a1a] border-[#333] hover:bg-[#222]">
                  <Apple className="w-4 h-4" />
                </Button>
                <Button variant="outline" type="button" className="bg-[#1a1a1a] border-[#333] hover:bg-[#222]">
                  <Chrome className="w-4 h-4" />
                </Button>
                <Button variant="outline" type="button" className="bg-[#1a1a1a] border-[#333] hover:bg-[#222]">
                  <Phone className="w-4 h-4" />
                </Button>
              </div>
            </form>
          )}

          {/* REGISTRATION FORM */}
          {mode === "register" && (
            <div className="space-y-4">
              {/* Progress Bar */}
              <div className="mb-6">
                <div className="flex justify-between text-xs text-gray-500 mb-2">
                  <span>Step {step} of 7</span>
                  <span>{stepTitles[step - 1]}</span>
                </div>
                <div className="h-2 bg-[#1a1a1a] rounded-full overflow-hidden">
                  <motion.div
                    className="h-full bg-gradient-to-r from-emerald-500 to-emerald-400"
                    initial={{ width: 0 }}
                    animate={{ width: `${(step / 7) * 100}%` }}
                  />
                </div>
              </div>

              <AnimatePresence mode="wait">
                {/* Step 1: Personal Info */}
                {step === 1 && (
                  <motion.div
                    key="step1"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="space-y-4"
                  >
                    <div className="text-center mb-4">
                      <User className="w-12 h-12 text-emerald-500 mx-auto mb-2" />
                      <h3 className="text-lg font-semibold text-white">Personal Information</h3>
                      <p className="text-sm text-gray-400">Enter your full legal name</p>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div className="relative">
                        <Input
                          placeholder="First Name *"
                          value={formData.firstName}
                          onChange={(e) => updateField("firstName", e.target.value)}
                          className="bg-[#1a1a1a] border-[#333] text-white"
                        />
                      </div>
                      <div className="relative">
                        <Input
                          placeholder="Middle Name"
                          value={formData.middleName}
                          onChange={(e) => updateField("middleName", e.target.value)}
                          className="bg-[#1a1a1a] border-[#333] text-white"
                        />
                      </div>
                    </div>

                    <Input
                      placeholder="Last Name *"
                      value={formData.lastName}
                      onChange={(e) => updateField("lastName", e.target.value)}
                      className="bg-[#1a1a1a] border-[#333] text-white"
                    />

                    <div className="relative">
                      <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                      <Input
                        type="tel"
                        placeholder="Mobile Phone Number *"
                        value={formData.phone}
                        onChange={(e) => updateField("phone", e.target.value)}
                        className="pl-10 bg-[#1a1a1a] border-[#333] text-white"
                      />
                    </div>

                    <div className="p-3 bg-blue-500/10 border border-blue-500/20 rounded-lg">
                      <div className="flex items-start gap-2">
                        <MessageSquare className="w-4 h-4 text-blue-400 mt-0.5" />
                        <p className="text-xs text-blue-300">
                          We will send a 6-digit verification code to this number via SMS.
                        </p>
                      </div>
                    </div>
                  </motion.div>
                )}

                {/* Step 2: OTP Verification */}
                {step === 2 && (
                  <motion.div
                    key="step2"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="space-y-4"
                  >
                    <div className="text-center mb-4">
                      <div className="w-16 h-16 bg-emerald-500/20 rounded-full flex items-center justify-center mx-auto mb-3">
                        <Smartphone className="w-8 h-8 text-emerald-500" />
                      </div>
                      <h3 className="text-lg font-semibold text-white">Verify Your Phone</h3>
                      <p className="text-sm text-gray-400">
                        Enter the 6-digit code sent to {formData.phone}
                      </p>
                    </div>

                    {/* OTP Input */}
                    <div className="flex justify-center gap-2">
                      {otpValues.map((value, index) => (
                        <Input
                          key={index}
                          ref={otpRefs[index]}
                          type="text"
                          inputMode="numeric"
                          maxLength={1}
                          value={value}
                          onChange={(e) => handleOtpChange(index, e.target.value)}
                          onKeyDown={(e) => handleOtpKeyDown(index, e)}
                          className="w-12 h-14 text-center text-xl font-bold bg-[#1a1a1a] border-[#333] text-white focus:border-emerald-500"
                        />
                      ))}
                    </div>

                    {/* Countdown */}
                    {countdown > 0 && (
                      <div className="text-center text-sm text-gray-400">
                        <Clock className="w-4 h-4 inline mr-1" />
                        Code expires in {Math.floor(countdown / 60)}:{(countdown % 60).toString().padStart(2, "0")}
                      </div>
                    )}

                    {/* Resend */}
                    <button
                      onClick={resendOtp}
                      disabled={countdown > 540 || isLoading}
                      className="w-full text-sm text-emerald-500 hover:underline disabled:text-gray-500 disabled:no-underline flex items-center justify-center gap-2"
                    >
                      <RefreshCw className="w-4 h-4" />
                      {countdown > 540 ? `Resend available in ${countdown - 540}s` : "Resend Code"}
                    </button>

                    <div className="p-3 bg-amber-500/10 border border-amber-500/20 rounded-lg">
                      <div className="flex items-start gap-2">
                        <AlertTriangle className="w-4 h-4 text-amber-400 mt-0.5" />
                        <p className="text-xs text-amber-300">
                          Did not receive the code? Check your spam folder or request a new code.
                        </p>
                      </div>
                    </div>
                  </motion.div>
                )}

                {/* Step 3: Email */}
                {step === 3 && (
                  <motion.div
                    key="step3"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="space-y-4"
                  >
                    <div className="text-center mb-4">
                      <Mail className="w-12 h-12 text-emerald-500 mx-auto mb-2" />
                      <h3 className="text-lg font-semibold text-white">Email Address</h3>
                      <p className="text-sm text-gray-400">For receipts and account recovery</p>
                    </div>

                    <div className="flex items-center gap-2 p-2 bg-emerald-500/10 border border-emerald-500/20 rounded-lg mb-4">
                      <Check className="w-4 h-4 text-emerald-500" />
                      <span className="text-sm text-emerald-400">Phone verified: {formData.phone}</span>
                    </div>

                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                      <Input
                        type="email"
                        placeholder="Email Address *"
                        value={formData.email}
                        onChange={(e) => updateField("email", e.target.value)}
                        className="pl-10 bg-[#1a1a1a] border-[#333] text-white"
                      />
                    </div>
                  </motion.div>
                )}

                {/* Step 4: Address */}
                {step === 4 && (
                  <motion.div
                    key="step4"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="space-y-4"
                  >
                    <div className="text-center mb-4">
                      <MapPin className="w-12 h-12 text-emerald-500 mx-auto mb-2" />
                      <h3 className="text-lg font-semibold text-white">Home Address</h3>
                      <p className="text-sm text-gray-400">For faster pickup suggestions</p>
                    </div>

                    <Input
                      placeholder="Street Address *"
                      value={formData.streetAddress}
                      onChange={(e) => updateField("streetAddress", e.target.value)}
                      className="bg-[#1a1a1a] border-[#333] text-white"
                    />

                    <Input
                      placeholder="Apartment, Suite, Unit (Optional)"
                      value={formData.apartment}
                      onChange={(e) => updateField("apartment", e.target.value)}
                      className="bg-[#1a1a1a] border-[#333] text-white"
                    />

                    <div className="grid grid-cols-2 gap-3">
                      <Input
                        placeholder="City *"
                        value={formData.city}
                        onChange={(e) => updateField("city", e.target.value)}
                        className="bg-[#1a1a1a] border-[#333] text-white"
                      />
                      <Input
                        placeholder="State *"
                        value={formData.state}
                        onChange={(e) => updateField("state", e.target.value)}
                        className="bg-[#1a1a1a] border-[#333] text-white"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <Input
                        placeholder="ZIP Code *"
                        value={formData.zipCode}
                        onChange={(e) => updateField("zipCode", e.target.value)}
                        className="bg-[#1a1a1a] border-[#333] text-white"
                      />
                      <Input
                        placeholder="Country"
                        value={formData.country}
                        onChange={(e) => updateField("country", e.target.value)}
                        className="bg-[#1a1a1a] border-[#333] text-white"
                      />
                    </div>
                  </motion.div>
                )}

                {/* Step 5: Password */}
                {step === 5 && (
                  <motion.div
                    key="step5"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="space-y-4"
                  >
                    <div className="text-center mb-4">
                      <KeyRound className="w-12 h-12 text-emerald-500 mx-auto mb-2" />
                      <h3 className="text-lg font-semibold text-white">Create Password</h3>
                      <p className="text-sm text-gray-400">Make it strong and secure</p>
                    </div>

                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                      <Input
                        type={showPassword ? "text" : "password"}
                        placeholder="Password *"
                        value={formData.password}
                        onChange={(e) => updateField("password", e.target.value)}
                        className="pl-10 pr-10 bg-[#1a1a1a] border-[#333] text-white"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500"
                      >
                        {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>

                    {/* Password Strength */}
                    {formData.password && (
                      <div className="space-y-2">
                        <div className="flex gap-1">
                          {[0, 1, 2, 3, 4].map((i) => (
                            <div
                              key={i}
                              className={`h-1 flex-1 rounded ${
                                i < passwordStrength ? strengthColors[passwordStrength - 1] : "bg-[#333]"
                              }`}
                            />
                          ))}
                        </div>
                        <p className={`text-xs ${
                          passwordStrength < 3 ? "text-red-400" : passwordStrength < 4 ? "text-yellow-400" : "text-green-400"
                        }`}>
                          {passwordStrength > 0 ? strengthLabels[passwordStrength - 1] : "Enter password"}
                        </p>
                      </div>
                    )}

                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                      <Input
                        type={showConfirmPassword ? "text" : "password"}
                        placeholder="Confirm Password *"
                        value={formData.confirmPassword}
                        onChange={(e) => updateField("confirmPassword", e.target.value)}
                        className="pl-10 pr-10 bg-[#1a1a1a] border-[#333] text-white"
                      />
                      <button
                        type="button"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500"
                      >
                        {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>

                    {formData.confirmPassword && formData.password !== formData.confirmPassword && (
                      <p className="text-xs text-red-400">Passwords do not match</p>
                    )}

                    <div className="p-3 bg-[#1a1a1a] rounded-lg space-y-1">
                      <p className="text-xs text-gray-400">Password must contain:</p>
                      <div className="grid grid-cols-2 gap-1 text-xs">
                        <div className={formData.password.length >= 8 ? "text-green-400" : "text-gray-500"}>
                          {formData.password.length >= 8 ? "✓" : "○"} 8+ characters
                        </div>
                        <div className={/[A-Z]/.test(formData.password) ? "text-green-400" : "text-gray-500"}>
                          {/[A-Z]/.test(formData.password) ? "✓" : "○"} Uppercase
                        </div>
                        <div className={/[a-z]/.test(formData.password) ? "text-green-400" : "text-gray-500"}>
                          {/[a-z]/.test(formData.password) ? "✓" : "○"} Lowercase
                        </div>
                        <div className={/[0-9]/.test(formData.password) ? "text-green-400" : "text-gray-500"}>
                          {/[0-9]/.test(formData.password) ? "✓" : "○"} Number
                        </div>
                        <div className={/[!@#$%^&*(),.?":{}|<>]/.test(formData.password) ? "text-green-400" : "text-gray-500"}>
                          {/[!@#$%^&*(),.?":{}|<>]/.test(formData.password) ? "✓" : "○"} Special char
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}

                {/* Step 6: Payment */}
                {step === 6 && (
                  <motion.div
                    key="step6"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="space-y-4"
                  >
                    <div className="text-center mb-4">
                      <CreditCard className="w-12 h-12 text-emerald-500 mx-auto mb-2" />
                      <h3 className="text-lg font-semibold text-white">Payment Method</h3>
                      <p className="text-sm text-gray-400">Add a payment method for rides</p>
                    </div>

                    {/* Payment Method Tabs */}
                    <div className="grid grid-cols-3 gap-2">
                      {[
                        { id: "card", icon: CreditCard, label: "Card" },
                        { id: "wallet", icon: Wallet, label: "Wallet" },
                        { id: "bank", icon: Landmark, label: "Bank" },
                      ].map((method) => (
                        <button
                          key={method.id}
                          onClick={() => updateField("paymentMethod", method.id)}
                          className={`p-3 rounded-lg border flex flex-col items-center gap-1 transition-all ${
                            formData.paymentMethod === method.id
                              ? "bg-emerald-500/20 border-emerald-500 text-emerald-400"
                              : "bg-[#1a1a1a] border-[#333] text-gray-400 hover:border-[#444]"
                          }`}
                        >
                          <method.icon className="w-5 h-5" />
                          <span className="text-xs">{method.label}</span>
                        </button>
                      ))}
                    </div>

                    {formData.paymentMethod === "card" && (
                      <div className="space-y-3">
                        <Input
                          placeholder="Card Number *"
                          value={formData.cardNumber}
                          onChange={(e) => updateField("cardNumber", e.target.value)}
                          className="bg-[#1a1a1a] border-[#333] text-white"
                          maxLength={19}
                        />
                        <div className="grid grid-cols-2 gap-3">
                          <Input
                            placeholder="MM/YY *"
                            value={formData.cardExpiry}
                            onChange={(e) => updateField("cardExpiry", e.target.value)}
                            className="bg-[#1a1a1a] border-[#333] text-white"
                            maxLength={5}
                          />
                          <Input
                            type="password"
                            placeholder="CVV *"
                            value={formData.cardCvv}
                            onChange={(e) => updateField("cardCvv", e.target.value)}
                            className="bg-[#1a1a1a] border-[#333] text-white"
                            maxLength={4}
                          />
                        </div>
                        <Input
                          placeholder="Name on Card *"
                          value={formData.cardName}
                          onChange={(e) => updateField("cardName", e.target.value)}
                          className="bg-[#1a1a1a] border-[#333] text-white"
                        />
                      </div>
                    )}

                    {formData.paymentMethod === "wallet" && (
                      <div className="space-y-3">
                        <Input
                          type="email"
                          placeholder="PayPal / Wallet Email *"
                          value={formData.walletEmail}
                          onChange={(e) => updateField("walletEmail", e.target.value)}
                          className="bg-[#1a1a1a] border-[#333] text-white"
                        />
                      </div>
                    )}

                    {formData.paymentMethod === "bank" && (
                      <div className="space-y-3">
                        <Input
                          placeholder="Bank Name *"
                          value={formData.bankName}
                          onChange={(e) => updateField("bankName", e.target.value)}
                          className="bg-[#1a1a1a] border-[#333] text-white"
                        />
                        <Input
                          placeholder="Routing Number *"
                          value={formData.bankRouting}
                          onChange={(e) => updateField("bankRouting", e.target.value)}
                          className="bg-[#1a1a1a] border-[#333] text-white"
                        />
                        <Input
                          placeholder="Account Number *"
                          value={formData.bankAccount}
                          onChange={(e) => updateField("bankAccount", e.target.value)}
                          className="bg-[#1a1a1a] border-[#333] text-white"
                        />
                      </div>
                    )}

                    <div className="flex items-center gap-2 p-3 bg-[#1a1a1a] rounded-lg">
                      <Shield className="w-5 h-5 text-emerald-500" />
                      <p className="text-xs text-gray-400">
                        Your payment information is encrypted and securely stored via WorldPay PCI-DSS compliant systems.
                      </p>
                    </div>
                  </motion.div>
                )}

                {/* Step 7: Emergency Contact & Consent */}
                {step === 7 && (
                  <motion.div
                    key="step7"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="space-y-4"
                  >
                    <div className="text-center mb-4">
                      <Heart className="w-12 h-12 text-emerald-500 mx-auto mb-2" />
                      <h3 className="text-lg font-semibold text-white">Almost Done!</h3>
                      <p className="text-sm text-gray-400">Emergency contact and agreements</p>
                    </div>

                    <div className="p-3 bg-[#1a1a1a] rounded-lg space-y-3">
                      <p className="text-sm text-white font-medium">Emergency Contact (Optional)</p>
                      <Input
                        placeholder="Contact Name"
                        value={formData.emergencyName}
                        onChange={(e) => updateField("emergencyName", e.target.value)}
                        className="bg-[#222] border-[#333] text-white"
                      />
                      <div className="grid grid-cols-2 gap-3">
                        <Input
                          placeholder="Phone"
                          value={formData.emergencyPhone}
                          onChange={(e) => updateField("emergencyPhone", e.target.value)}
                          className="bg-[#222] border-[#333] text-white"
                        />
                        <Input
                          placeholder="Relationship"
                          value={formData.emergencyRelation}
                          onChange={(e) => updateField("emergencyRelation", e.target.value)}
                          className="bg-[#222] border-[#333] text-white"
                        />
                      </div>
                    </div>

                    <div className="space-y-3">
                      <p className="text-sm text-white font-medium">Required Agreements</p>
                      
                      <label className="flex items-start gap-3 p-3 bg-[#1a1a1a] rounded-lg cursor-pointer">
                        <input
                          type="checkbox"
                          checked={formData.agreeTerms}
                          onChange={(e) => updateField("agreeTerms", e.target.checked)}
                          className="mt-1 rounded bg-[#222] border-[#333]"
                        />
                        <span className="text-sm text-gray-300">
                          I agree to the <Link href="#" className="text-emerald-500 underline">Terms of Service</Link> and <Link href="#" className="text-emerald-500 underline">Privacy Policy</Link>. *
                        </span>
                      </label>

                      <label className="flex items-start gap-3 p-3 bg-[#1a1a1a] rounded-lg cursor-pointer">
                        <input
                          type="checkbox"
                          checked={formData.agreePrivacy}
                          onChange={(e) => updateField("agreePrivacy", e.target.checked)}
                          className="mt-1 rounded bg-[#222] border-[#333]"
                        />
                        <span className="text-sm text-gray-300">
                          I consent to the collection and processing of my personal data as described in the Privacy Policy. *
                        </span>
                      </label>

                      <label className="flex items-start gap-3 p-3 bg-[#1a1a1a] rounded-lg cursor-pointer">
                        <input
                          type="checkbox"
                          checked={formData.agreePaymentStorage}
                          onChange={(e) => updateField("agreePaymentStorage", e.target.checked)}
                          className="mt-1 rounded bg-[#222] border-[#333]"
                        />
                        <span className="text-sm text-gray-300">
                          I understand that my payment information will be securely stored for ride payments. *
                        </span>
                      </label>

                      <label className="flex items-start gap-3 p-3 bg-[#1a1a1a] rounded-lg cursor-pointer">
                        <input
                          type="checkbox"
                          checked={formData.agreeLocation}
                          onChange={(e) => updateField("agreeLocation", e.target.checked)}
                          className="mt-1 rounded bg-[#222] border-[#333]"
                        />
                        <span className="text-sm text-gray-300">
                          I allow GlideWay to access my location for ride services.
                        </span>
                      </label>

                      <label className="flex items-start gap-3 p-3 bg-[#1a1a1a] rounded-lg cursor-pointer">
                        <input
                          type="checkbox"
                          checked={formData.agreeMarketing}
                          onChange={(e) => updateField("agreeMarketing", e.target.checked)}
                          className="mt-1 rounded bg-[#222] border-[#333]"
                        />
                        <span className="text-sm text-gray-300">
                          I would like to receive promotional offers and updates (optional).
                        </span>
                      </label>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Navigation Buttons */}
              <div className="flex gap-3 pt-4">
                {step > 1 && (
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setStep((step - 1) as RegisterStep)}
                    className="flex-1 border-[#333] text-white hover:bg-[#222]"
                    disabled={isLoading}
                  >
                    <ChevronLeft className="w-4 h-4 mr-1" />
                    Back
                  </Button>
                )}
                <Button
                  onClick={handleNextStep}
                  disabled={isLoading}
                  className={`flex-1 bg-emerald-500 hover:bg-emerald-600 text-white ${step === 1 ? "w-full" : ""}`}
                >
                  {isLoading ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : step === 7 ? (
                    "Create Account"
                  ) : (
                    <>
                      Continue
                      <ChevronRight className="w-4 h-4 ml-1" />
                    </>
                  )}
                </Button>
              </div>
            </div>
          )}

          {/* Driver Registration CTA */}
          <div className="mt-6 pt-4 border-t border-[#222]">
            <p className="text-xs text-center text-gray-500 mb-3">Want to earn with GlideWay?</p>
            <Link href="/driver/register">
              <div className="flex items-center justify-between p-4 rounded-xl border border-emerald-500/30 bg-emerald-500/5 hover:bg-emerald-500/10 hover:border-emerald-500/50 transition-all cursor-pointer group">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-emerald-500/20 flex items-center justify-center shrink-0">
                    <Car className="w-5 h-5 text-emerald-400" />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-white">Become a Driver</p>
                    <p className="text-xs text-gray-400">11-step process · 10 min · Admin approval</p>
                  </div>
                </div>
                <ChevronRight className="w-5 h-5 text-emerald-400 group-hover:translate-x-1 transition-transform" />
              </div>
            </Link>
          </div>
        </CardContent>
      </Card>

      {/* Back to Website Link */}
      <div className="fixed bottom-4 left-1/2 -translate-x-1/2">
        <Link href="/" className="text-sm text-gray-500 hover:text-white transition-colors">
          Back to GlideWay Website
        </Link>
      </div>
    </div>
  )
}
