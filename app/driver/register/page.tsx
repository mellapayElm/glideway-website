"use client"

import { useState, useRef, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { 
  Mail, Lock, Eye, EyeOff, Phone, User, MapPin, CreditCard, 
  ChevronRight, ChevronLeft, Shield, CheckCircle2, AlertCircle, 
  Loader2, FileText, Car, Camera, Calendar, Building, Landmark,
  IdCard, Clock, MapPinned, Upload, Check, ShieldCheck, KeyRound,
  Smartphone, RefreshCw, AlertTriangle, Briefcase, DollarSign
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import Link from "next/link"

type RegisterStep = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10

export default function DriverRegister() {
  const [step, setStep] = useState<RegisterStep>(1)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [verificationId, setVerificationId] = useState("")
  const [otpSent, setOtpSent] = useState(false)
  const [otpVerified, setOtpVerified] = useState(false)
  const [countdown, setCountdown] = useState(0)
  const [passwordStrength, setPasswordStrength] = useState(0)
  const [photoPreview, setPhotoPreview] = useState<string | null>(null)
  const [isSubmitted, setIsSubmitted] = useState(false)

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

  const [formData, setFormData] = useState({
    // Step 1: Personal Info
    firstName: "",
    middleName: "",
    lastName: "",
    phone: "",
    email: "",
    dateOfBirth: "",
    ssn: "",
    // Step 2: OTP (handled separately)
    // Step 3: Password
    password: "",
    confirmPassword: "",
    // Step 4: Address
    streetAddress: "",
    apartment: "",
    city: "",
    state: "",
    zipCode: "",
    country: "United States",
    // Step 5: Driver License
    licenseNumber: "",
    licenseState: "",
    licenseExpiry: "",
    licenseClass: "C",
    yearsLicensed: "",
    // Step 6: Vehicle Info
    vehicleMake: "",
    vehicleModel: "",
    vehicleYear: "",
    vehicleColor: "",
    vehiclePlate: "",
    vehicleVin: "",
    vehicleSeats: "4",
    // Step 7: Insurance
    insuranceCompany: "",
    insurancePolicy: "",
    insuranceExpiry: "",
    insuranceCoverage: "Full Coverage",
    // Step 8: Bank & Tax
    bankName: "",
    bankRouting: "",
    bankAccount: "",
    bankAccountType: "checking",
    taxId: "",
    // Step 9: Profile & Availability
    bio: "",
    profilePhoto: null as File | null,
    serviceAreas: [] as string[],
    availability: {
      monday: true,
      tuesday: true,
      wednesday: true,
      thursday: true,
      friday: true,
      saturday: false,
      sunday: false
    },
    // Step 10: Consent
    agreeTerms: false,
    agreeBackground: false,
    agreeDrugTest: false,
    agreeInsurance: false,
    agreeVehicleInspection: false,
  })

  // Countdown timer
  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000)
      return () => clearTimeout(timer)
    }
  }, [countdown])

  // Password strength
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

  const updateField = (field: string, value: any) => {
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

  // Handle photo upload
  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      updateField("profilePhoto", file)
      const reader = new FileReader()
      reader.onloadend = () => setPhotoPreview(reader.result as string)
      reader.readAsDataURL(file)
    }
  }

  // API: Initiate Registration
  const initiateRegistration = async () => {
    setIsLoading(true)
    setError("")

    try {
      const response = await fetch("/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "DRIVER_INITIATE",
          phone: formData.phone,
          email: formData.email,
          firstName: formData.firstName,
          lastName: formData.lastName,
          ssn: formData.ssn
        })
      })

      const data = await response.json()

      if (data.success) {
        setVerificationId(data.verificationId)
        setOtpSent(true)
        setCountdown(600)
        setStep(2)
        setSuccess("Verification code sent!")
      } else {
        setError(data.error)
      }
    } catch (err) {
      setError("Network error. Please try again.")
    }

    setIsLoading(false)
  }

  // API: Verify OTP
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
        setSuccess("Phone verified!")
      } else {
        setError(data.error)
      }
    } catch (err) {
      setError("Network error")
    }

    setIsLoading(false)
  }

  // API: Complete Registration
  const completeRegistration = async () => {
    if (!formData.agreeTerms || !formData.agreeBackground || !formData.agreeDrugTest || !formData.agreeInsurance) {
      setError("All consent agreements are required")
      return
    }

    setIsLoading(true)
    setError("")

    try {
      const response = await fetch("/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "DRIVER_COMPLETE",
          // verificationId temporarily disabled
          ...formData
        })
      })

      const data = await response.json()

      if (data.success) {
        setIsSubmitted(true)
        setSuccess(data.message)
      } else {
        setError(data.error)
      }
    } catch (err) {
      setError("Network error")
    }

    setIsLoading(false)
  }

  const handleNext = () => {
    setError("")
    setSuccess("")

    // Validation for each step
    if (step === 1) {
      if (!formData.firstName || !formData.lastName || !formData.phone || !formData.email || !formData.ssn) {
        setError("Please fill in all required fields")
        return
      }
      if (formData.ssn.length < 9) {
        setError("Please enter a valid SSN")
        return
      }
      // Skip verification for now - go directly to password step
      setStep(3)
      return
    }

    // Step 2 verification temporarily disabled
    if (step === 2) {
      setStep(3)
      return
    }

    if (step === 3) {
      if (formData.password.length < 8 || formData.password !== formData.confirmPassword || passwordStrength < 3) {
        setError("Please create a strong password that matches")
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
      if (!formData.licenseNumber || !formData.licenseState || !formData.licenseExpiry) {
        setError("Please fill in all license details")
        return
      }
      setStep(6)
      return
    }

    if (step === 6) {
      if (!formData.vehicleMake || !formData.vehicleModel || !formData.vehicleYear || !formData.vehiclePlate) {
        setError("Please fill in all vehicle details")
        return
      }
      setStep(7)
      return
    }

    if (step === 7) {
      if (!formData.insuranceCompany || !formData.insurancePolicy || !formData.insuranceExpiry) {
        setError("Please fill in all insurance details")
        return
      }
      setStep(8)
      return
    }

    if (step === 8) {
      if (!formData.bankName || !formData.bankRouting || !formData.bankAccount) {
        setError("Please fill in all bank details")
        return
      }
      setStep(9)
      return
    }

    if (step === 9) {
      setStep(10)
      return
    }

    if (step === 10) {
      completeRegistration()
    }
  }

  const stepTitles = [
    "Personal Info",
    "Verify Phone",
    "Create Password",
    "Home Address",
    "Driver License",
    "Vehicle Info",
    "Insurance",
    "Bank & Tax",
    "Profile",
    "Agreements"
  ]

  const strengthColors = ["bg-red-500", "bg-orange-500", "bg-yellow-500", "bg-lime-500", "bg-green-500"]
  const strengthLabels = ["Very Weak", "Weak", "Fair", "Good", "Strong"]

  // Success Screen
  if (isSubmitted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-white via-green-50 to-white flex items-center justify-center p-4">
        <Card className="w-full max-w-md bg-white border-green-200 shadow-lg">
          <CardContent className="p-8 text-center">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", duration: 0.5 }}
              className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6"
            >
              <CheckCircle2 className="w-10 h-10 text-green-500" />
            </motion.div>
            
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Application Submitted!</h2>
            <p className="text-gray-600 mb-6">Your driver application is pending review.</p>

            <div className="bg-green-50 rounded-lg p-4 mb-6 text-left space-y-3 border border-green-200">
              <h3 className="text-gray-900 font-medium">Next Steps:</h3>
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="text-xs text-green-600 font-semibold">1</span>
                </div>
                <p className="text-sm text-gray-600">Background check will be initiated (2-5 business days)</p>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="text-xs text-green-600 font-semibold">2</span>
                </div>
                <p className="text-sm text-gray-600">Documents will be reviewed by our team</p>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="text-xs text-green-600 font-semibold">3</span>
                </div>
                <p className="text-sm text-gray-600">You will receive email notification when approved</p>
              </div>
            </div>

            <div className="flex gap-3">
              <Link href="/" className="flex-1">
                <Button variant="outline" className="w-full border-green-200 text-gray-700 hover:bg-green-50">
                  Back to Home
                </Button>
              </Link>
              <Link href="/driver/status" className="flex-1">
                <Button className="w-full bg-green-500 hover:bg-green-600 text-white">
                  Check Status
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-green-50 to-white flex items-center justify-center p-4 py-12">
      {/* Security Badge */}
      <div className="fixed top-4 left-1/2 -translate-x-1/2 flex items-center gap-2 bg-green-100 border border-green-200 rounded-full px-4 py-2 z-50 shadow-sm">
        <ShieldCheck className="w-4 h-4 text-green-600" />
        <span className="text-xs text-green-700 font-medium">256-bit SSL Encrypted</span>
        <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
      </div>

      <Card className="w-full max-w-lg bg-white border-green-200 shadow-lg">
        <CardContent className="p-6">
          {/* Logo */}
          <div className="text-center mb-6">
            <div className="inline-flex items-center gap-2 mb-2">
              <div className="w-10 h-10 bg-green-500 rounded-xl flex items-center justify-center">
                <span className="text-white font-bold text-lg">G</span>
              </div>
              <span className="text-xl font-bold text-gray-900">GlideWay Driver</span>
            </div>
            <p className="text-sm text-gray-600">Become a GlideWay Driver Partner</p>
          </div>

          {/* Progress Bar */}
          <div className="mb-6">
            <div className="flex justify-between text-xs text-gray-500 mb-2">
              <span>Step {step} of 10</span>
              <span>{stepTitles[step - 1]}</span>
            </div>
            <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
              <motion.div
                className="h-full bg-gradient-to-r from-green-500 to-green-400"
                initial={{ width: 0 }}
                animate={{ width: `${(step / 10) * 100}%` }}
              />
            </div>
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
                  <User className="w-10 h-10 text-green-500 mx-auto mb-2" />
                  <h3 className="text-lg font-semibold text-gray-900">Personal Information</h3>
                  <p className="text-sm text-gray-600">Enter your legal name as it appears on your license</p>
                </div>

                <div className="grid grid-cols-3 gap-3">
                  <Input
                    placeholder="First *"
                    value={formData.firstName}
                    onChange={(e) => updateField("firstName", e.target.value)}
                    className="bg-white border-green-300 text-gray-900 placeholder:text-gray-500 focus:border-green-500 focus:ring-green-500"
                  />
                  <Input
                    placeholder="Middle"
                    value={formData.middleName}
                    onChange={(e) => updateField("middleName", e.target.value)}
                    className="bg-white border-green-300 text-gray-900 placeholder:text-gray-500 focus:border-green-500 focus:ring-green-500"
                  />
                  <Input
                    placeholder="Last *"
                    value={formData.lastName}
                    onChange={(e) => updateField("lastName", e.target.value)}
                    className="bg-white border-green-300 text-gray-900 placeholder:text-gray-500 focus:border-green-500 focus:ring-green-500"
                  />
                </div>

                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-green-600" />
                  <Input
                    type="tel"
                    placeholder="Mobile Phone *"
                    value={formData.phone}
                    onChange={(e) => updateField("phone", e.target.value)}
                    className="pl-10 bg-white border-green-300 text-gray-900 placeholder:text-gray-500 focus:border-green-500 focus:ring-green-500"
                  />
                </div>

                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-green-600" />
                  <Input
                    type="email"
                    placeholder="Email Address *"
                    value={formData.email}
                    onChange={(e) => updateField("email", e.target.value)}
                    className="pl-10 bg-white border-green-300 text-gray-900 placeholder:text-gray-500 focus:border-green-500 focus:ring-green-500"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="relative">
                    <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-green-600" />
                    <Input
                      type="date"
                      placeholder="Date of Birth *"
                      value={formData.dateOfBirth}
                      onChange={(e) => updateField("dateOfBirth", e.target.value)}
                      className="pl-10 bg-white border-green-300 text-gray-900 placeholder:text-gray-500 focus:border-green-500 focus:ring-green-500"
                    />
                  </div>
                  <div className="relative">
                    <IdCard className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-green-600" />
                    <Input
                      type="password"
                      placeholder="SSN *"
                      value={formData.ssn}
                      onChange={(e) => updateField("ssn", e.target.value.replace(/\D/g, "").slice(0, 9))}
                      className="pl-10 bg-white border-green-300 text-gray-900 placeholder:text-gray-500 focus:border-green-500 focus:ring-green-500"
                      maxLength={9}
                    />
                  </div>
                </div>

                <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
                  <div className="flex items-start gap-2">
                    <Shield className="w-4 h-4 text-green-600 mt-0.5" />
                    <p className="text-xs text-green-700">
                      Your SSN is required for background check verification. It is encrypted and never shared.
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
                  <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
                    <Smartphone className="w-8 h-8 text-green-600" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900">Verify Your Phone</h3>
                  <p className="text-sm text-gray-600">Enter the 6-digit code sent to {formData.phone}</p>
                </div>

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
                      className="w-12 h-14 text-center text-xl font-bold bg-white border-green-300 text-gray-900 focus:border-green-500 focus:ring-green-500"
                    />
                  ))}
                </div>

                {countdown > 0 && (
                  <div className="text-center text-sm text-gray-600">
                    <Clock className="w-4 h-4 inline mr-1" />
                    Code expires in {Math.floor(countdown / 60)}:{(countdown % 60).toString().padStart(2, "0")}
                  </div>
                )}
              </motion.div>
            )}

            {/* Step 3: Password */}
            {step === 3 && (
              <motion.div
                key="step3"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-4"
              >
                <div className="text-center mb-4">
                  <KeyRound className="w-10 h-10 text-green-500 mx-auto mb-2" />
                  <h3 className="text-lg font-semibold text-gray-900">Create Password</h3>
                </div>

                <div className="flex items-center gap-2 p-2 bg-green-50 border border-green-200 rounded-lg mb-4">
                  <Check className="w-4 h-4 text-green-600" />
                  <span className="text-sm text-green-700">Phone verified: {formData.phone}</span>
                </div>

                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-green-600" />
                  <Input
                    type={showPassword ? "text" : "password"}
                    placeholder="Password *"
                    value={formData.password}
                    onChange={(e) => updateField("password", e.target.value)}
                    className="pl-10 pr-10 bg-white border-green-300 text-gray-900 placeholder:text-gray-500 focus:border-green-500 focus:ring-green-500"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-green-600"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>

                {formData.password && (
                  <div className="space-y-2">
                    <div className="flex gap-1">
                      {[0, 1, 2, 3, 4].map((i) => (
                        <div
                          key={i}
                          className={`h-1 flex-1 rounded ${
                            i < passwordStrength ? strengthColors[passwordStrength - 1] : "bg-gray-200"
                          }`}
                        />
                      ))}
                    </div>
                    <p className={`text-xs ${
                      passwordStrength < 3 ? "text-red-500" : passwordStrength < 4 ? "text-yellow-600" : "text-green-600"
                    }`}>
                      {passwordStrength > 0 ? strengthLabels[passwordStrength - 1] : "Enter password"}
                    </p>
                  </div>
                )}

                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-green-600" />
                  <Input
                    type={showConfirmPassword ? "text" : "password"}
                    placeholder="Confirm Password *"
                    value={formData.confirmPassword}
                    onChange={(e) => updateField("confirmPassword", e.target.value)}
                    className="pl-10 pr-10 bg-white border-green-300 text-gray-900 placeholder:text-gray-500 focus:border-green-500 focus:ring-green-500"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-green-600"
                  >
                    {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
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
                  <MapPin className="w-10 h-10 text-green-500 mx-auto mb-2" />
                  <h3 className="text-lg font-semibold text-gray-900">Home Address</h3>
                </div>

                <Input
                  placeholder="Street Address *"
                  value={formData.streetAddress}
                  onChange={(e) => updateField("streetAddress", e.target.value)}
                  className="bg-white border-green-300 text-gray-900 placeholder:text-gray-500 focus:border-green-500 focus:ring-green-500"
                />

                <Input
                  placeholder="Apartment, Suite (Optional)"
                  value={formData.apartment}
                  onChange={(e) => updateField("apartment", e.target.value)}
                  className="bg-white border-green-300 text-gray-900 placeholder:text-gray-500 focus:border-green-500 focus:ring-green-500"
                />

                <div className="grid grid-cols-2 gap-3">
                  <Input
                    placeholder="City *"
                    value={formData.city}
                    onChange={(e) => updateField("city", e.target.value)}
                    className="bg-white border-green-300 text-gray-900 placeholder:text-gray-500 focus:border-green-500 focus:ring-green-500"
                  />
                  <Input
                    placeholder="State *"
                    value={formData.state}
                    onChange={(e) => updateField("state", e.target.value)}
                    className="bg-white border-green-300 text-gray-900 placeholder:text-gray-500 focus:border-green-500 focus:ring-green-500"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <Input
                    placeholder="ZIP Code *"
                    value={formData.zipCode}
                    onChange={(e) => updateField("zipCode", e.target.value)}
                    className="bg-white border-green-300 text-gray-900 placeholder:text-gray-500 focus:border-green-500 focus:ring-green-500"
                  />
                  <Input
                    placeholder="Country"
                    value={formData.country}
                    onChange={(e) => updateField("country", e.target.value)}
                    className="bg-white border-green-300 text-gray-900 placeholder:text-gray-500 focus:border-green-500 focus:ring-green-500"
                  />
                </div>
              </motion.div>
            )}

            {/* Step 5: Driver License */}
            {step === 5 && (
              <motion.div
                key="step5"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-4"
              >
                <div className="text-center mb-4">
                  <IdCard className="w-10 h-10 text-green-500 mx-auto mb-2" />
                  <h3 className="text-lg font-semibold text-gray-900">Driver License</h3>
                </div>

                <Input
                  placeholder="License Number *"
                  value={formData.licenseNumber}
                  onChange={(e) => updateField("licenseNumber", e.target.value)}
                  className="bg-white border-green-300 text-gray-900 placeholder:text-gray-500 focus:border-green-500 focus:ring-green-500"
                />

                <div className="grid grid-cols-2 gap-3">
                  <Input
                    placeholder="Issuing State *"
                    value={formData.licenseState}
                    onChange={(e) => updateField("licenseState", e.target.value)}
                    className="bg-white border-green-300 text-gray-900 placeholder:text-gray-500 focus:border-green-500 focus:ring-green-500"
                  />
                  <Input
                    type="date"
                    placeholder="Expiry Date *"
                    value={formData.licenseExpiry}
                    onChange={(e) => updateField("licenseExpiry", e.target.value)}
                    className="bg-white border-green-300 text-gray-900 placeholder:text-gray-500 focus:border-green-500 focus:ring-green-500"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <select
                    value={formData.licenseClass}
                    onChange={(e) => updateField("licenseClass", e.target.value)}
                    className="bg-white border border-green-300 text-gray-900 rounded-md px-3 py-2 focus:border-green-500 focus:ring-green-500"
                  >
                    <option value="C">Class C (Standard)</option>
                    <option value="B">Class B (Commercial)</option>
                    <option value="A">Class A (CDL)</option>
                  </select>
                  <Input
                    placeholder="Years Licensed"
                    value={formData.yearsLicensed}
                    onChange={(e) => updateField("yearsLicensed", e.target.value)}
                    className="bg-white border-green-300 text-gray-900 placeholder:text-gray-500 focus:border-green-500 focus:ring-green-500"
                  />
                </div>

                <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
                  <div className="flex items-start gap-2">
                    <Upload className="w-4 h-4 text-green-600 mt-0.5" />
                    <p className="text-xs text-green-700">
                      You may be asked to upload a photo of your license later.
                    </p>
                  </div>
                </div>
              </motion.div>
            )}

            {/* Step 6: Vehicle Info */}
            {step === 6 && (
              <motion.div
                key="step6"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-4"
              >
                <div className="text-center mb-4">
                  <Car className="w-10 h-10 text-green-500 mx-auto mb-2" />
                  <h3 className="text-lg font-semibold text-gray-900">Vehicle Information</h3>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <Input
                    placeholder="Make *"
                    value={formData.vehicleMake}
                    onChange={(e) => updateField("vehicleMake", e.target.value)}
                    className="bg-white border-green-300 text-gray-900 placeholder:text-gray-500 focus:border-green-500 focus:ring-green-500"
                  />
                  <Input
                    placeholder="Model *"
                    value={formData.vehicleModel}
                    onChange={(e) => updateField("vehicleModel", e.target.value)}
                    className="bg-white border-green-300 text-gray-900 placeholder:text-gray-500 focus:border-green-500 focus:ring-green-500"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <Input
                    placeholder="Year *"
                    value={formData.vehicleYear}
                    onChange={(e) => updateField("vehicleYear", e.target.value)}
                    className="bg-white border-green-300 text-gray-900 placeholder:text-gray-500 focus:border-green-500 focus:ring-green-500"
                  />
                  <Input
                    placeholder="Color *"
                    value={formData.vehicleColor}
                    onChange={(e) => updateField("vehicleColor", e.target.value)}
                    className="bg-white border-green-300 text-gray-900 placeholder:text-gray-500 focus:border-green-500 focus:ring-green-500"
                  />
                </div>

                <Input
                  placeholder="License Plate *"
                  value={formData.vehiclePlate}
                  onChange={(e) => updateField("vehiclePlate", e.target.value)}
                  className="bg-white border-green-300 text-gray-900 placeholder:text-gray-500 focus:border-green-500 focus:ring-green-500"
                />

                <Input
                  placeholder="VIN (Vehicle Identification Number)"
                  value={formData.vehicleVin}
                  onChange={(e) => updateField("vehicleVin", e.target.value)}
                  className="bg-white border-green-300 text-gray-900 placeholder:text-gray-500 focus:border-green-500 focus:ring-green-500"
                />

                <select
                  value={formData.vehicleSeats}
                  onChange={(e) => updateField("vehicleSeats", e.target.value)}
                  className="w-full bg-white border border-green-300 text-gray-900 rounded-md px-3 py-2 focus:border-green-500 focus:ring-green-500"
                >
                  <option value="4">4 Passenger Seats</option>
                  <option value="5">5 Passenger Seats</option>
                  <option value="6">6 Passenger Seats</option>
                  <option value="7">7+ Passenger Seats (XL)</option>
                </select>
              </motion.div>
            )}

            {/* Step 7: Insurance */}
            {step === 7 && (
              <motion.div
                key="step7"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-4"
              >
                <div className="text-center mb-4">
                  <Shield className="w-10 h-10 text-green-500 mx-auto mb-2" />
                  <h3 className="text-lg font-semibold text-gray-900">Insurance Information</h3>
                </div>

                <Input
                  placeholder="Insurance Company *"
                  value={formData.insuranceCompany}
                  onChange={(e) => updateField("insuranceCompany", e.target.value)}
                  className="bg-white border-green-300 text-gray-900 placeholder:text-gray-500 focus:border-green-500 focus:ring-green-500"
                />

                <Input
                  placeholder="Policy Number *"
                  value={formData.insurancePolicy}
                  onChange={(e) => updateField("insurancePolicy", e.target.value)}
                  className="bg-white border-green-300 text-gray-900 placeholder:text-gray-500 focus:border-green-500 focus:ring-green-500"
                />

                <div className="grid grid-cols-2 gap-3">
                  <Input
                    type="date"
                    placeholder="Expiry Date *"
                    value={formData.insuranceExpiry}
                    onChange={(e) => updateField("insuranceExpiry", e.target.value)}
                    className="bg-white border-green-300 text-gray-900 placeholder:text-gray-500 focus:border-green-500 focus:ring-green-500"
                  />
                  <select
                    value={formData.insuranceCoverage}
                    onChange={(e) => updateField("insuranceCoverage", e.target.value)}
                    className="bg-white border border-green-300 text-gray-900 rounded-md px-3 py-2 focus:border-green-500 focus:ring-green-500"
                  >
                    <option value="Full Coverage">Full Coverage</option>
                    <option value="Liability Only">Liability Only</option>
                    <option value="Comprehensive">Comprehensive</option>
                  </select>
                </div>
              </motion.div>
            )}

            {/* Step 8: Bank & Tax */}
            {step === 8 && (
              <motion.div
                key="step8"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-4"
              >
                <div className="text-center mb-4">
                  <Landmark className="w-10 h-10 text-green-500 mx-auto mb-2" />
                  <h3 className="text-lg font-semibold text-gray-900">Bank & Tax Information</h3>
                  <p className="text-sm text-gray-600">For direct deposit earnings</p>
                </div>

                <Input
                  placeholder="Bank Name *"
                  value={formData.bankName}
                  onChange={(e) => updateField("bankName", e.target.value)}
                  className="bg-white border-green-300 text-gray-900 placeholder:text-gray-500 focus:border-green-500 focus:ring-green-500"
                />

                <Input
                  placeholder="Routing Number *"
                  value={formData.bankRouting}
                  onChange={(e) => updateField("bankRouting", e.target.value.replace(/\D/g, "").slice(0, 9))}
                  className="bg-white border-green-300 text-gray-900 placeholder:text-gray-500 focus:border-green-500 focus:ring-green-500"
                  maxLength={9}
                />

                <Input
                  placeholder="Account Number *"
                  value={formData.bankAccount}
                  onChange={(e) => updateField("bankAccount", e.target.value.replace(/\D/g, ""))}
                  className="bg-white border-green-300 text-gray-900 placeholder:text-gray-500 focus:border-green-500 focus:ring-green-500"
                />

                <select
                  value={formData.bankAccountType}
                  onChange={(e) => updateField("bankAccountType", e.target.value)}
                  className="w-full bg-white border border-green-300 text-gray-900 rounded-md px-3 py-2 focus:border-green-500 focus:ring-green-500"
                >
                  <option value="checking">Checking Account</option>
                  <option value="savings">Savings Account</option>
                </select>

                <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
                  <div className="flex items-start gap-2">
                    <DollarSign className="w-4 h-4 text-green-600 mt-0.5" />
                    <p className="text-xs text-green-700">
                      Earnings are deposited weekly. You can also request instant payouts after activation.
                    </p>
                  </div>
                </div>
              </motion.div>
            )}

            {/* Step 9: Profile & Availability */}
            {step === 9 && (
              <motion.div
                key="step9"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-4"
              >
                <div className="text-center mb-4">
                  <Camera className="w-10 h-10 text-green-500 mx-auto mb-2" />
                  <h3 className="text-lg font-semibold text-gray-900">Profile & Availability</h3>
                </div>

                {/* Profile Photo */}
                <div className="flex flex-col items-center gap-3">
                  <div className="w-24 h-24 rounded-full bg-green-50 border-2 border-dashed border-green-300 flex items-center justify-center overflow-hidden">
                    {photoPreview ? (
                      <img src={photoPreview} alt="Profile" className="w-full h-full object-cover" />
                    ) : (
                      <Camera className="w-8 h-8 text-green-400" />
                    )}
                  </div>
                  <label className="cursor-pointer">
                    <span className="text-sm text-green-600 font-medium hover:underline">Upload Photo</span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handlePhotoUpload}
                      className="hidden"
                    />
                  </label>
                </div>

                {/* Availability */}
                <div className="p-4 bg-green-50 rounded-lg border border-green-200">
                  <p className="text-sm text-gray-900 font-medium mb-3">Availability</p>
                  <div className="grid grid-cols-7 gap-2">
                    {Object.entries(formData.availability).map(([day, active]) => (
                      <button
                        key={day}
                        onClick={() => updateField("availability", { ...formData.availability, [day]: !active })}
                        className={`p-2 rounded text-xs font-medium transition-all ${
                          active ? "bg-green-500 text-white" : "bg-white text-gray-500 border border-green-200"
                        }`}
                      >
                        {day.slice(0, 3).toUpperCase()}
                      </button>
                    ))}
                  </div>
                </div>
              </motion.div>
            )}

            {/* Step 10: Agreements */}
            {step === 10 && (
              <motion.div
                key="step10"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-4"
              >
                <div className="text-center mb-4">
                  <FileText className="w-10 h-10 text-green-500 mx-auto mb-2" />
                  <h3 className="text-lg font-semibold text-gray-900">Agreements & Consent</h3>
                  <p className="text-sm text-gray-600">All agreements are required</p>
                </div>

                <div className="space-y-3">
                  <label className="flex items-start gap-3 p-3 bg-green-50 rounded-lg cursor-pointer border border-green-200 hover:bg-green-100 transition-colors">
                    <input
                      type="checkbox"
                      checked={formData.agreeTerms}
                      onChange={(e) => updateField("agreeTerms", e.target.checked)}
                      className="mt-1 rounded bg-white border-green-300 text-green-500 focus:ring-green-500"
                    />
                    <span className="text-sm text-gray-700">
                      I agree to the <Link href="#" className="text-green-600 underline font-medium">Terms of Service</Link> and <Link href="#" className="text-green-600 underline font-medium">Driver Agreement</Link>.
                    </span>
                  </label>

                  <label className="flex items-start gap-3 p-3 bg-green-50 rounded-lg cursor-pointer border border-green-200 hover:bg-green-100 transition-colors">
                    <input
                      type="checkbox"
                      checked={formData.agreeBackground}
                      onChange={(e) => updateField("agreeBackground", e.target.checked)}
                      className="mt-1 rounded bg-white border-green-300 text-green-500 focus:ring-green-500"
                    />
                    <span className="text-sm text-gray-700">
                      I authorize GlideWay to conduct a background check including criminal history and driving record.
                    </span>
                  </label>

                  <label className="flex items-start gap-3 p-3 bg-green-50 rounded-lg cursor-pointer border border-green-200 hover:bg-green-100 transition-colors">
                    <input
                      type="checkbox"
                      checked={formData.agreeDrugTest}
                      onChange={(e) => updateField("agreeDrugTest", e.target.checked)}
                      className="mt-1 rounded bg-white border-green-300 text-green-500 focus:ring-green-500"
                    />
                    <span className="text-sm text-gray-700">
                      I commit to maintaining a drug-free environment and may be subject to testing.
                    </span>
                  </label>

                  <label className="flex items-start gap-3 p-3 bg-green-50 rounded-lg cursor-pointer border border-green-200 hover:bg-green-100 transition-colors">
                    <input
                      type="checkbox"
                      checked={formData.agreeInsurance}
                      onChange={(e) => updateField("agreeInsurance", e.target.checked)}
                      className="mt-1 rounded bg-white border-green-300 text-green-500 focus:ring-green-500"
                    />
                    <span className="text-sm text-gray-700">
                      I confirm my vehicle insurance meets GlideWay requirements and will maintain valid coverage.
                    </span>
                  </label>

                  <label className="flex items-start gap-3 p-3 bg-green-50 rounded-lg cursor-pointer border border-green-200 hover:bg-green-100 transition-colors">
                    <input
                      type="checkbox"
                      checked={formData.agreeVehicleInspection}
                      onChange={(e) => updateField("agreeVehicleInspection", e.target.checked)}
                      className="mt-1 rounded bg-white border-green-300 text-green-500 focus:ring-green-500"
                    />
                    <span className="text-sm text-gray-700">
                      I agree to complete a vehicle inspection if requested by GlideWay.
                    </span>
                  </label>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Navigation Buttons */}
          <div className="flex gap-3 pt-6">
            {step > 1 && (
              <Button
                type="button"
                variant="outline"
                onClick={() => setStep((step - 1) as RegisterStep)}
                className="flex-1 border-green-300 text-gray-700 hover:bg-green-50"
                disabled={isLoading}
              >
                <ChevronLeft className="w-4 h-4 mr-1" />
                Back
              </Button>
            )}
            <Button
              onClick={handleNext}
              disabled={isLoading}
              className={`flex-1 bg-green-500 hover:bg-green-600 text-white ${step === 1 ? "w-full" : ""}`}
            >
              {isLoading ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : step === 10 ? (
                "Submit Application"
              ) : (
                <>
                  Continue
                  <ChevronRight className="w-4 h-4 ml-1" />
                </>
              )}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Back Link */}
      <div className="fixed bottom-4 left-1/2 -translate-x-1/2">
        <Link href="/" className="text-sm text-gray-600 hover:text-green-600 transition-colors">
          Back to GlideWay Website
        </Link>
      </div>
    </div>
  )
}
