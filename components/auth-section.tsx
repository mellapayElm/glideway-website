"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { 
  Mail, Lock, User, Phone, Eye, EyeOff, ChevronRight, ChevronLeft,
  MapPin, CreditCard, Building, Globe, Shield, CheckCircle2, AlertCircle,
  Loader2, UserPlus, Heart, FileText, Key, Smartphone, Wallet, Landmark,
  ShieldCheck, Lock as LockIcon, Fingerprint, AlertTriangle, Gift
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { GlidewayLogo } from "@/components/glideway-logo"

type AuthMode = "login" | "register"
type RegistrationStep = 1 | 2 | 3 | 4 | 5
type PaymentMethod = "card" | "wallet" | "bank"

interface FormData {
  // Step 1: Personal Info
  firstName: string
  middleName: string
  lastName: string
  email: string
  phone: string
  dateOfBirth: string
  // Step 2: Create Password
  password: string
  confirmPassword: string
  securityQuestion: string
  securityAnswer: string
  enableTwoFactor: boolean
  // Step 3: Home Address
  streetAddress: string
  apartment: string
  city: string
  state: string
  zipCode: string
  country: string
  // Step 4: Payment Method
  paymentMethod: PaymentMethod
  cardNumber: string
  cardName: string
  expiryDate: string
  cvv: string
  bankName: string
  accountNumber: string
  routingNumber: string
  walletEmail: string
  // Step 5: Emergency Contact & Consent
  emergencyName: string
  emergencyPhone: string
  emergencyRelation: string
  agreeTerms: boolean
  agreePrivacy: boolean
  agreePaymentStorage: boolean
  agreeLocationAccess: boolean
  agreeMarketing: boolean
}

interface FormErrors {
  [key: string]: string
}

const securityQuestions = [
  "What was the name of your first pet?",
  "What city were you born in?",
  "What is your mother's maiden name?",
  "What was the name of your elementary school?",
  "What is your favorite movie?",
  "What street did you grow up on?"
]

export function AuthSection() {
  const [authMode, setAuthMode] = useState<AuthMode>("register")
  const [registrationStep, setRegistrationStep] = useState<RegistrationStep>(1)
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)
  const [errors, setErrors] = useState<FormErrors>({})
  const [passwordStrength, setPasswordStrength] = useState(0)
  
  const [formData, setFormData] = useState<FormData>({
    firstName: "",
    middleName: "",
    lastName: "",
    email: "",
    phone: "",
    dateOfBirth: "",
    password: "",
    confirmPassword: "",
    securityQuestion: "",
    securityAnswer: "",
    enableTwoFactor: true,
    streetAddress: "",
    apartment: "",
    city: "",
    state: "",
    zipCode: "",
    country: "United States",
    paymentMethod: "card",
    cardNumber: "",
    cardName: "",
    expiryDate: "",
    cvv: "",
    bankName: "",
    accountNumber: "",
    routingNumber: "",
    walletEmail: "",
    emergencyName: "",
    emergencyPhone: "",
    emergencyRelation: "",
    agreeTerms: false,
    agreePrivacy: false,
    agreePaymentStorage: false,
    agreeLocationAccess: false,
    agreeMarketing: false
  })

  // Login form data
  const [loginData, setLoginData] = useState({
    email: "",
    password: "",
    rememberMe: false
  })

  // Calculate password strength
  useEffect(() => {
    const password = formData.password
    let strength = 0
    if (password.length >= 8) strength += 1
    if (password.length >= 12) strength += 1
    if (/[A-Z]/.test(password)) strength += 1
    if (/[a-z]/.test(password)) strength += 1
    if (/[0-9]/.test(password)) strength += 1
    if (/[^A-Za-z0-9]/.test(password)) strength += 1
    setPasswordStrength(Math.min(strength, 5))
  }, [formData.password])

  const updateFormData = (field: keyof FormData, value: string | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    if (errors[field]) {
      setErrors(prev => {
        const newErrors = { ...prev }
        delete newErrors[field]
        return newErrors
      })
    }
  }

  const formatPhone = (value: string) => {
    const numbers = value.replace(/\D/g, "")
    if (numbers.length <= 3) return numbers
    if (numbers.length <= 6) return `(${numbers.slice(0, 3)}) ${numbers.slice(3)}`
    return `(${numbers.slice(0, 3)}) ${numbers.slice(3, 6)}-${numbers.slice(6, 10)}`
  }

  const formatCardNumber = (value: string) => {
    const numbers = value.replace(/\D/g, "")
    return numbers.replace(/(\d{4})/g, "$1 ").trim().slice(0, 19)
  }

  const formatExpiry = (value: string) => {
    const numbers = value.replace(/\D/g, "")
    if (numbers.length <= 2) return numbers
    return `${numbers.slice(0, 2)}/${numbers.slice(2, 4)}`
  }

  const validateStep = (step: RegistrationStep): boolean => {
    const newErrors: FormErrors = {}
    
    switch (step) {
      case 1:
        if (!formData.firstName.trim()) newErrors.firstName = "First name is required"
        if (!formData.lastName.trim()) newErrors.lastName = "Last name is required"
        if (!formData.email.trim()) newErrors.email = "Email is required"
        else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) newErrors.email = "Invalid email format"
        if (!formData.phone.trim()) newErrors.phone = "Phone number is required"
        else if (formData.phone.replace(/\D/g, "").length < 10) newErrors.phone = "Invalid phone number"
        if (!formData.dateOfBirth) newErrors.dateOfBirth = "Date of birth is required"
        break
      case 2:
        if (!formData.password) newErrors.password = "Password is required"
        else if (formData.password.length < 8) newErrors.password = "Password must be at least 8 characters"
        else if (passwordStrength < 3) newErrors.password = "Password is too weak"
        if (formData.password !== formData.confirmPassword) newErrors.confirmPassword = "Passwords do not match"
        if (!formData.securityQuestion) newErrors.securityQuestion = "Please select a security question"
        if (!formData.securityAnswer.trim()) newErrors.securityAnswer = "Security answer is required"
        break
      case 3:
        if (!formData.streetAddress.trim()) newErrors.streetAddress = "Street address is required"
        if (!formData.city.trim()) newErrors.city = "City is required"
        if (!formData.state.trim()) newErrors.state = "State is required"
        if (!formData.zipCode.trim()) newErrors.zipCode = "ZIP code is required"
        break
      case 4:
        if (formData.paymentMethod === "card") {
          if (!formData.cardNumber.trim()) newErrors.cardNumber = "Card number is required"
          else if (formData.cardNumber.replace(/\s/g, "").length < 16) newErrors.cardNumber = "Invalid card number"
          if (!formData.cardName.trim()) newErrors.cardName = "Cardholder name is required"
          if (!formData.expiryDate.trim()) newErrors.expiryDate = "Expiry date is required"
          if (!formData.cvv.trim()) newErrors.cvv = "CVV is required"
        } else if (formData.paymentMethod === "bank") {
          if (!formData.bankName.trim()) newErrors.bankName = "Bank name is required"
          if (!formData.accountNumber.trim()) newErrors.accountNumber = "Account number is required"
          if (!formData.routingNumber.trim()) newErrors.routingNumber = "Routing number is required"
        } else if (formData.paymentMethod === "wallet") {
          if (!formData.walletEmail.trim()) newErrors.walletEmail = "Wallet email is required"
        }
        break
      case 5:
        if (!formData.agreeTerms) newErrors.agreeTerms = "You must agree to the Terms of Service"
        if (!formData.agreePrivacy) newErrors.agreePrivacy = "You must agree to the Privacy Policy"
        if (!formData.agreePaymentStorage) newErrors.agreePaymentStorage = "You must agree to payment storage"
        if (!formData.agreeLocationAccess) newErrors.agreeLocationAccess = "Location access is required for ride services"
        break
    }
    
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleNextStep = () => {
    if (validateStep(registrationStep)) {
      setRegistrationStep((registrationStep + 1) as RegistrationStep)
    }
  }

  const handlePrevStep = () => {
    if (registrationStep > 1) {
      setRegistrationStep((registrationStep - 1) as RegistrationStep)
    }
  }

  const handleSubmitRegistration = async () => {
    if (!validateStep(5)) return
    
    setIsLoading(true)
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 2000))
    setIsLoading(false)
    setIsSuccess(true)
  }

  const handleLogin = async () => {
    setIsLoading(true)
    await new Promise(resolve => setTimeout(resolve, 1500))
    setIsLoading(false)
    // Redirect to rider app
    window.location.href = "/rider"
  }

  const getPasswordStrengthColor = () => {
    if (passwordStrength <= 1) return "bg-red-500"
    if (passwordStrength <= 2) return "bg-orange-500"
    if (passwordStrength <= 3) return "bg-yellow-500"
    if (passwordStrength <= 4) return "bg-lime-500"
    return "bg-green-500"
  }

  const getPasswordStrengthText = () => {
    if (passwordStrength <= 1) return "Very Weak"
    if (passwordStrength <= 2) return "Weak"
    if (passwordStrength <= 3) return "Fair"
    if (passwordStrength <= 4) return "Strong"
    return "Very Strong"
  }

  const stepTitles = [
    "Personal Information",
    "Create Secure Password",
    "Home Address",
    "Payment Method",
    "Consent & Emergency Contact"
  ]

  // Success screen
  if (isSuccess) {
    return (
      <section id="register" className="py-20 bg-gradient-to-b from-[#0a0a0a] to-[#0f1a0f]">
        <div className="max-w-lg mx-auto px-4">
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="text-center"
          >
            <div className="w-24 h-24 rounded-full bg-gradient-to-br from-green-500 to-emerald-600 mx-auto flex items-center justify-center mb-6">
              <CheckCircle2 className="w-12 h-12 text-white" />
            </div>
            <h2 className="text-3xl font-bold text-white mb-4">Welcome to GlideWay!</h2>
            <p className="text-gray-400 mb-8">
              Your account has been created successfully. You can now book your first ride.
            </p>
            <div className="space-y-3">
              <Button 
                onClick={() => window.location.href = "/rider"}
                className="w-full bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white py-6 text-lg"
              >
                Open GlideWay App
                <ChevronRight className="w-5 h-5 ml-2" />
              </Button>
              <Button 
                variant="outline"
                onClick={() => {
                  setIsSuccess(false)
                  setAuthMode("login")
                }}
                className="w-full border-gray-700 text-gray-300 hover:bg-gray-800"
              >
                Go to Login
              </Button>
            </div>
          </motion.div>
        </div>
      </section>
    )
  }

  return (
    <section id="register" className="py-20 bg-gradient-to-b from-[#0a0a0a] to-[#0f1a0f]">
      <div className="max-w-6xl mx-auto px-4">
        {/* Section Header */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-green-500/10 border border-green-500/20 mb-6">
            <ShieldCheck className="w-4 h-4 text-green-500" />
            <span className="text-sm font-medium text-green-500">Secure Registration</span>
          </div>
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
            {authMode === "login" ? "Welcome Back" : "Join GlideWay Today"}
          </h2>
          <p className="text-gray-400 max-w-2xl mx-auto">
            {authMode === "login" 
              ? "Sign in to your account to book rides and manage your trips"
              : "Create your secure account in just a few simple steps"}
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-8 items-start">
          {/* Main Form Card */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            <Card className="bg-[#111111] border-gray-800 overflow-hidden">
              {/* Two-Layer Security Header */}
              <div className="bg-gradient-to-r from-green-600/20 to-emerald-600/20 border-b border-green-500/20 px-6 py-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-green-500/20 flex items-center justify-center">
                      <Shield className="w-5 h-5 text-green-500" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-green-400">256-bit SSL Encryption</p>
                      <p className="text-xs text-gray-500">Your data is protected</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Fingerprint className="w-4 h-4 text-green-500" />
                    <LockIcon className="w-4 h-4 text-green-500" />
                  </div>
                </div>
              </div>

              {/* Auth Mode Toggle */}
              <div className="p-6 border-b border-gray-800">
                <div className="flex bg-[#1a1a1a] rounded-lg p-1">
                  <button
                    onClick={() => { setAuthMode("login"); setRegistrationStep(1) }}
                    className={`flex-1 py-3 px-4 rounded-md text-sm font-medium transition-all ${
                      authMode === "login"
                        ? "bg-green-500 text-black"
                        : "text-gray-400 hover:text-white"
                    }`}
                  >
                    Sign In
                  </button>
                  <button
                    onClick={() => setAuthMode("register")}
                    className={`flex-1 py-3 px-4 rounded-md text-sm font-medium transition-all ${
                      authMode === "register"
                        ? "bg-green-500 text-black"
                        : "text-gray-400 hover:text-white"
                    }`}
                  >
                    Create Account
                  </button>
                </div>
              </div>

              <CardContent className="p-6">
                <AnimatePresence mode="wait">
                  {authMode === "login" ? (
                    /* LOGIN FORM */
                    <motion.div
                      key="login"
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      className="space-y-6"
                    >
                      <div className="text-center mb-6">
                        <GlidewayLogo className="w-16 h-16 mx-auto mb-4" />
                        <h3 className="text-xl font-semibold text-white">Sign In to GlideWay</h3>
                        <p className="text-gray-500 text-sm">Enter your credentials to continue</p>
                      </div>

                      <div className="space-y-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-300 mb-2">
                            Email Address
                          </label>
                          <div className="relative">
                            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                            <Input
                              type="email"
                              placeholder="you@example.com"
                              value={loginData.email}
                              onChange={(e) => setLoginData({...loginData, email: e.target.value})}
                              className="pl-10 bg-[#1a1a1a] border-gray-700 text-white h-12"
                            />
                          </div>
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-300 mb-2">
                            Password
                          </label>
                          <div className="relative">
                            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                            <Input
                              type={showPassword ? "text" : "password"}
                              placeholder="Enter your password"
                              value={loginData.password}
                              onChange={(e) => setLoginData({...loginData, password: e.target.value})}
                              className="pl-10 pr-10 bg-[#1a1a1a] border-gray-700 text-white h-12"
                            />
                            <button
                              type="button"
                              onClick={() => setShowPassword(!showPassword)}
                              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-white"
                            >
                              {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                            </button>
                          </div>
                        </div>

                        <div className="flex items-center justify-between">
                          <label className="flex items-center gap-2 cursor-pointer">
                            <input
                              type="checkbox"
                              checked={loginData.rememberMe}
                              onChange={(e) => setLoginData({...loginData, rememberMe: e.target.checked})}
                              className="w-4 h-4 rounded border-gray-600 bg-[#1a1a1a] text-green-500 focus:ring-green-500"
                            />
                            <span className="text-sm text-gray-400">Remember me</span>
                          </label>
                          <a href="#" className="text-sm text-green-500 hover:text-green-400">
                            Forgot password?
                          </a>
                        </div>
                      </div>

                      <Button 
                        onClick={handleLogin}
                        disabled={isLoading}
                        className="w-full bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white py-6 text-lg"
                      >
                        {isLoading ? (
                          <>
                            <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                            Signing In...
                          </>
                        ) : (
                          <>
                            Sign In
                            <ChevronRight className="w-5 h-5 ml-2" />
                          </>
                        )}
                      </Button>
                    </motion.div>
                  ) : (
                    /* REGISTRATION FORM */
                    <motion.div
                      key="register"
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                    >
                      {/* Progress Steps */}
                      <div className="mb-8">
                        <div className="flex items-center justify-between mb-4">
                          {[1, 2, 3, 4, 5].map((step) => (
                            <div key={step} className="flex items-center">
                              <div className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold transition-all ${
                                step < registrationStep
                                  ? "bg-green-500 text-black"
                                  : step === registrationStep
                                    ? "bg-green-500/20 text-green-500 border-2 border-green-500"
                                    : "bg-gray-800 text-gray-500"
                              }`}>
                                {step < registrationStep ? (
                                  <CheckCircle2 className="w-5 h-5" />
                                ) : (
                                  step
                                )}
                              </div>
                              {step < 5 && (
                                <div className={`w-8 md:w-16 h-1 mx-1 ${
                                  step < registrationStep ? "bg-green-500" : "bg-gray-800"
                                }`} />
                              )}
                            </div>
                          ))}
                        </div>
                        <p className="text-center text-sm text-gray-400">
                          Step {registrationStep} of 5: <span className="text-green-500">{stepTitles[registrationStep - 1]}</span>
                        </p>
                      </div>

                      <AnimatePresence mode="wait">
                        {/* STEP 1: Personal Information */}
                        {registrationStep === 1 && (
                          <motion.div
                            key="step1"
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                            className="space-y-4"
                          >
                            <div className="flex items-center gap-3 mb-6">
                              <div className="w-12 h-12 rounded-xl bg-green-500/20 flex items-center justify-center">
                                <User className="w-6 h-6 text-green-500" />
                              </div>
                              <div>
                                <h3 className="text-lg font-semibold text-white">Personal Information</h3>
                                <p className="text-sm text-gray-500">Enter your full legal name as it appears on your ID</p>
                              </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                              <div>
                                <label className="block text-sm font-medium text-gray-300 mb-2">
                                  First Name <span className="text-red-500">*</span>
                                </label>
                                <Input
                                  placeholder="John"
                                  value={formData.firstName}
                                  onChange={(e) => updateFormData("firstName", e.target.value)}
                                  className={`bg-[#1a1a1a] border-gray-700 text-white h-12 ${errors.firstName ? "border-red-500" : ""}`}
                                />
                                {errors.firstName && <p className="text-red-500 text-xs mt-1">{errors.firstName}</p>}
                              </div>
                              <div>
                                <label className="block text-sm font-medium text-gray-300 mb-2">
                                  Middle Name
                                </label>
                                <Input
                                  placeholder="Michael"
                                  value={formData.middleName}
                                  onChange={(e) => updateFormData("middleName", e.target.value)}
                                  className="bg-[#1a1a1a] border-gray-700 text-white h-12"
                                />
                              </div>
                            </div>

                            <div>
                              <label className="block text-sm font-medium text-gray-300 mb-2">
                                Last Name <span className="text-red-500">*</span>
                              </label>
                              <Input
                                placeholder="Smith"
                                value={formData.lastName}
                                onChange={(e) => updateFormData("lastName", e.target.value)}
                                className={`bg-[#1a1a1a] border-gray-700 text-white h-12 ${errors.lastName ? "border-red-500" : ""}`}
                              />
                              {errors.lastName && <p className="text-red-500 text-xs mt-1">{errors.lastName}</p>}
                            </div>

                            <div>
                              <label className="block text-sm font-medium text-gray-300 mb-2">
                                Email Address <span className="text-red-500">*</span>
                              </label>
                              <div className="relative">
                                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                                <Input
                                  type="email"
                                  placeholder="john.smith@example.com"
                                  value={formData.email}
                                  onChange={(e) => updateFormData("email", e.target.value)}
                                  className={`pl-10 bg-[#1a1a1a] border-gray-700 text-white h-12 ${errors.email ? "border-red-500" : ""}`}
                                />
                              </div>
                              {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
                            </div>

                            <div>
                              <label className="block text-sm font-medium text-gray-300 mb-2">
                                Mobile Phone Number <span className="text-red-500">*</span>
                              </label>
                              <div className="relative">
                                <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                                <Input
                                  type="tel"
                                  placeholder="(555) 123-4567"
                                  value={formData.phone}
                                  onChange={(e) => updateFormData("phone", formatPhone(e.target.value))}
                                  className={`pl-10 bg-[#1a1a1a] border-gray-700 text-white h-12 ${errors.phone ? "border-red-500" : ""}`}
                                />
                              </div>
                              {errors.phone && <p className="text-red-500 text-xs mt-1">{errors.phone}</p>}
                            </div>

                            <div>
                              <label className="block text-sm font-medium text-gray-300 mb-2">
                                Date of Birth <span className="text-red-500">*</span>
                              </label>
                              <Input
                                type="date"
                                value={formData.dateOfBirth}
                                onChange={(e) => updateFormData("dateOfBirth", e.target.value)}
                                className={`bg-[#1a1a1a] border-gray-700 text-white h-12 ${errors.dateOfBirth ? "border-red-500" : ""}`}
                              />
                              {errors.dateOfBirth && <p className="text-red-500 text-xs mt-1">{errors.dateOfBirth}</p>}
                            </div>
                          </motion.div>
                        )}

                        {/* STEP 2: Create Secure Password */}
                        {registrationStep === 2 && (
                          <motion.div
                            key="step2"
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                            className="space-y-4"
                          >
                            <div className="flex items-center gap-3 mb-6">
                              <div className="w-12 h-12 rounded-xl bg-green-500/20 flex items-center justify-center">
                                <Key className="w-6 h-6 text-green-500" />
                              </div>
                              <div>
                                <h3 className="text-lg font-semibold text-white">Create Secure Password</h3>
                                <p className="text-sm text-gray-500">Set up your account security</p>
                              </div>
                            </div>

                            <div>
                              <label className="block text-sm font-medium text-gray-300 mb-2">
                                Password <span className="text-red-500">*</span>
                              </label>
                              <div className="relative">
                                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                                <Input
                                  type={showPassword ? "text" : "password"}
                                  placeholder="Create a strong password"
                                  value={formData.password}
                                  onChange={(e) => updateFormData("password", e.target.value)}
                                  className={`pl-10 pr-10 bg-[#1a1a1a] border-gray-700 text-white h-12 ${errors.password ? "border-red-500" : ""}`}
                                />
                                <button
                                  type="button"
                                  onClick={() => setShowPassword(!showPassword)}
                                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-white"
                                >
                                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                                </button>
                              </div>
                              {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password}</p>}
                              
                              {/* Password Strength Meter */}
                              <div className="mt-3">
                                <div className="flex gap-1 mb-2">
                                  {[1, 2, 3, 4, 5].map((level) => (
                                    <div
                                      key={level}
                                      className={`h-2 flex-1 rounded ${
                                        level <= passwordStrength ? getPasswordStrengthColor() : "bg-gray-700"
                                      }`}
                                    />
                                  ))}
                                </div>
                                <p className="text-xs text-gray-500">
                                  Password strength: <span className={passwordStrength >= 4 ? "text-green-500" : passwordStrength >= 3 ? "text-yellow-500" : "text-red-500"}>{getPasswordStrengthText()}</span>
                                </p>
                              </div>
                            </div>

                            <div>
                              <label className="block text-sm font-medium text-gray-300 mb-2">
                                Confirm Password <span className="text-red-500">*</span>
                              </label>
                              <div className="relative">
                                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                                <Input
                                  type={showConfirmPassword ? "text" : "password"}
                                  placeholder="Confirm your password"
                                  value={formData.confirmPassword}
                                  onChange={(e) => updateFormData("confirmPassword", e.target.value)}
                                  className={`pl-10 pr-10 bg-[#1a1a1a] border-gray-700 text-white h-12 ${errors.confirmPassword ? "border-red-500" : ""}`}
                                />
                                <button
                                  type="button"
                                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-white"
                                >
                                  {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                                </button>
                              </div>
                              {errors.confirmPassword && <p className="text-red-500 text-xs mt-1">{errors.confirmPassword}</p>}
                            </div>

                            <div>
                              <label className="block text-sm font-medium text-gray-300 mb-2">
                                Security Question <span className="text-red-500">*</span>
                              </label>
                              <select
                                value={formData.securityQuestion}
                                onChange={(e) => updateFormData("securityQuestion", e.target.value)}
                                className={`w-full bg-[#1a1a1a] border border-gray-700 text-white h-12 rounded-md px-3 ${errors.securityQuestion ? "border-red-500" : ""}`}
                              >
                                <option value="">Select a security question</option>
                                {securityQuestions.map((q, i) => (
                                  <option key={i} value={q}>{q}</option>
                                ))}
                              </select>
                              {errors.securityQuestion && <p className="text-red-500 text-xs mt-1">{errors.securityQuestion}</p>}
                            </div>

                            <div>
                              <label className="block text-sm font-medium text-gray-300 mb-2">
                                Security Answer <span className="text-red-500">*</span>
                              </label>
                              <Input
                                placeholder="Your answer"
                                value={formData.securityAnswer}
                                onChange={(e) => updateFormData("securityAnswer", e.target.value)}
                                className={`bg-[#1a1a1a] border-gray-700 text-white h-12 ${errors.securityAnswer ? "border-red-500" : ""}`}
                              />
                              {errors.securityAnswer && <p className="text-red-500 text-xs mt-1">{errors.securityAnswer}</p>}
                            </div>

                            <div className="p-4 bg-green-500/10 border border-green-500/20 rounded-lg">
                              <label className="flex items-start gap-3 cursor-pointer">
                                <input
                                  type="checkbox"
                                  checked={formData.enableTwoFactor}
                                  onChange={(e) => updateFormData("enableTwoFactor", e.target.checked)}
                                  className="w-5 h-5 mt-0.5 rounded border-gray-600 bg-[#1a1a1a] text-green-500 focus:ring-green-500"
                                />
                                <div>
                                  <div className="flex items-center gap-2">
                                    <Smartphone className="w-4 h-4 text-green-500" />
                                    <span className="text-sm font-medium text-white">Enable Two-Factor Authentication</span>
                                  </div>
                                  <p className="text-xs text-gray-400 mt-1">
                                    Add an extra layer of security to your account with SMS verification
                                  </p>
                                </div>
                              </label>
                            </div>
                          </motion.div>
                        )}

                        {/* STEP 3: Home Address */}
                        {registrationStep === 3 && (
                          <motion.div
                            key="step3"
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                            className="space-y-4"
                          >
                            <div className="flex items-center gap-3 mb-6">
                              <div className="w-12 h-12 rounded-xl bg-green-500/20 flex items-center justify-center">
                                <MapPin className="w-6 h-6 text-green-500" />
                              </div>
                              <div>
                                <h3 className="text-lg font-semibold text-white">Home Address</h3>
                                <p className="text-sm text-gray-500">Your primary address for ride pickups</p>
                              </div>
                            </div>

                            <div>
                              <label className="block text-sm font-medium text-gray-300 mb-2">
                                Street Address <span className="text-red-500">*</span>
                              </label>
                              <Input
                                placeholder="123 Main Street"
                                value={formData.streetAddress}
                                onChange={(e) => updateFormData("streetAddress", e.target.value)}
                                className={`bg-[#1a1a1a] border-gray-700 text-white h-12 ${errors.streetAddress ? "border-red-500" : ""}`}
                              />
                              {errors.streetAddress && <p className="text-red-500 text-xs mt-1">{errors.streetAddress}</p>}
                            </div>

                            <div>
                              <label className="block text-sm font-medium text-gray-300 mb-2">
                                Apartment, Suite, Unit (Optional)
                              </label>
                              <div className="relative">
                                <Building className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                                <Input
                                  placeholder="Apt 4B"
                                  value={formData.apartment}
                                  onChange={(e) => updateFormData("apartment", e.target.value)}
                                  className="pl-10 bg-[#1a1a1a] border-gray-700 text-white h-12"
                                />
                              </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                              <div>
                                <label className="block text-sm font-medium text-gray-300 mb-2">
                                  City <span className="text-red-500">*</span>
                                </label>
                                <Input
                                  placeholder="Los Angeles"
                                  value={formData.city}
                                  onChange={(e) => updateFormData("city", e.target.value)}
                                  className={`bg-[#1a1a1a] border-gray-700 text-white h-12 ${errors.city ? "border-red-500" : ""}`}
                                />
                                {errors.city && <p className="text-red-500 text-xs mt-1">{errors.city}</p>}
                              </div>
                              <div>
                                <label className="block text-sm font-medium text-gray-300 mb-2">
                                  State <span className="text-red-500">*</span>
                                </label>
                                <Input
                                  placeholder="CA"
                                  value={formData.state}
                                  onChange={(e) => updateFormData("state", e.target.value)}
                                  className={`bg-[#1a1a1a] border-gray-700 text-white h-12 ${errors.state ? "border-red-500" : ""}`}
                                />
                                {errors.state && <p className="text-red-500 text-xs mt-1">{errors.state}</p>}
                              </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                              <div>
                                <label className="block text-sm font-medium text-gray-300 mb-2">
                                  ZIP Code <span className="text-red-500">*</span>
                                </label>
                                <Input
                                  placeholder="90001"
                                  value={formData.zipCode}
                                  onChange={(e) => updateFormData("zipCode", e.target.value)}
                                  className={`bg-[#1a1a1a] border-gray-700 text-white h-12 ${errors.zipCode ? "border-red-500" : ""}`}
                                />
                                {errors.zipCode && <p className="text-red-500 text-xs mt-1">{errors.zipCode}</p>}
                              </div>
                              <div>
                                <label className="block text-sm font-medium text-gray-300 mb-2">
                                  Country
                                </label>
                                <div className="relative">
                                  <Globe className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                                  <select
                                    value={formData.country}
                                    onChange={(e) => updateFormData("country", e.target.value)}
                                    className="w-full pl-10 bg-[#1a1a1a] border border-gray-700 text-white h-12 rounded-md"
                                  >
                                    <option value="United States">United States</option>
                                    <option value="Canada">Canada</option>
                                    <option value="Mexico">Mexico</option>
                                  </select>
                                </div>
                              </div>
                            </div>
                          </motion.div>
                        )}

                        {/* STEP 4: Payment Method */}
                        {registrationStep === 4 && (
                          <motion.div
                            key="step4"
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                            className="space-y-4"
                          >
                            <div className="flex items-center gap-3 mb-6">
                              <div className="w-12 h-12 rounded-xl bg-green-500/20 flex items-center justify-center">
                                <CreditCard className="w-6 h-6 text-green-500" />
                              </div>
                              <div>
                                <h3 className="text-lg font-semibold text-white">Payment Method</h3>
                                <p className="text-sm text-gray-500">Add a secure payment method for rides</p>
                              </div>
                            </div>

                            {/* Payment Method Selection */}
                            <div className="grid grid-cols-3 gap-3 mb-6">
                              {[
                                { id: "card", icon: CreditCard, label: "Card" },
                                { id: "wallet", icon: Wallet, label: "Wallet" },
                                { id: "bank", icon: Landmark, label: "Bank" }
                              ].map(({ id, icon: Icon, label }) => (
                                <button
                                  key={id}
                                  onClick={() => updateFormData("paymentMethod", id as PaymentMethod)}
                                  className={`p-4 rounded-xl border-2 transition-all ${
                                    formData.paymentMethod === id
                                      ? "border-green-500 bg-green-500/10"
                                      : "border-gray-700 bg-[#1a1a1a] hover:border-gray-600"
                                  }`}
                                >
                                  <Icon className={`w-6 h-6 mx-auto mb-2 ${
                                    formData.paymentMethod === id ? "text-green-500" : "text-gray-400"
                                  }`} />
                                  <p className={`text-sm font-medium ${
                                    formData.paymentMethod === id ? "text-green-500" : "text-gray-400"
                                  }`}>{label}</p>
                                </button>
                              ))}
                            </div>

                            {/* Card Payment Form */}
                            {formData.paymentMethod === "card" && (
                              <div className="space-y-4">
                                <div>
                                  <label className="block text-sm font-medium text-gray-300 mb-2">
                                    Card Number <span className="text-red-500">*</span>
                                  </label>
                                  <div className="relative">
                                    <CreditCard className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                                    <Input
                                      placeholder="1234 5678 9012 3456"
                                      value={formData.cardNumber}
                                      onChange={(e) => updateFormData("cardNumber", formatCardNumber(e.target.value))}
                                      className={`pl-10 bg-[#1a1a1a] border-gray-700 text-white h-12 font-mono ${errors.cardNumber ? "border-red-500" : ""}`}
                                    />
                                  </div>
                                  {errors.cardNumber && <p className="text-red-500 text-xs mt-1">{errors.cardNumber}</p>}
                                </div>

                                <div>
                                  <label className="block text-sm font-medium text-gray-300 mb-2">
                                    Cardholder Name <span className="text-red-500">*</span>
                                  </label>
                                  <Input
                                    placeholder="JOHN M SMITH"
                                    value={formData.cardName}
                                    onChange={(e) => updateFormData("cardName", e.target.value.toUpperCase())}
                                    className={`bg-[#1a1a1a] border-gray-700 text-white h-12 ${errors.cardName ? "border-red-500" : ""}`}
                                  />
                                  {errors.cardName && <p className="text-red-500 text-xs mt-1">{errors.cardName}</p>}
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                  <div>
                                    <label className="block text-sm font-medium text-gray-300 mb-2">
                                      Expiry Date <span className="text-red-500">*</span>
                                    </label>
                                    <Input
                                      placeholder="MM/YY"
                                      value={formData.expiryDate}
                                      onChange={(e) => updateFormData("expiryDate", formatExpiry(e.target.value))}
                                      className={`bg-[#1a1a1a] border-gray-700 text-white h-12 ${errors.expiryDate ? "border-red-500" : ""}`}
                                    />
                                    {errors.expiryDate && <p className="text-red-500 text-xs mt-1">{errors.expiryDate}</p>}
                                  </div>
                                  <div>
                                    <label className="block text-sm font-medium text-gray-300 mb-2">
                                      CVV <span className="text-red-500">*</span>
                                    </label>
                                    <Input
                                      type="password"
                                      placeholder="***"
                                      maxLength={4}
                                      value={formData.cvv}
                                      onChange={(e) => updateFormData("cvv", e.target.value.replace(/\D/g, ""))}
                                      className={`bg-[#1a1a1a] border-gray-700 text-white h-12 ${errors.cvv ? "border-red-500" : ""}`}
                                    />
                                    {errors.cvv && <p className="text-red-500 text-xs mt-1">{errors.cvv}</p>}
                                  </div>
                                </div>
                              </div>
                            )}

                            {/* Digital Wallet Form */}
                            {formData.paymentMethod === "wallet" && (
                              <div className="space-y-4">
                                <div>
                                  <label className="block text-sm font-medium text-gray-300 mb-2">
                                    PayPal / Venmo Email <span className="text-red-500">*</span>
                                  </label>
                                  <div className="relative">
                                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                                    <Input
                                      type="email"
                                      placeholder="wallet@example.com"
                                      value={formData.walletEmail}
                                      onChange={(e) => updateFormData("walletEmail", e.target.value)}
                                      className={`pl-10 bg-[#1a1a1a] border-gray-700 text-white h-12 ${errors.walletEmail ? "border-red-500" : ""}`}
                                    />
                                  </div>
                                  {errors.walletEmail && <p className="text-red-500 text-xs mt-1">{errors.walletEmail}</p>}
                                </div>
                              </div>
                            )}

                            {/* Bank Account Form */}
                            {formData.paymentMethod === "bank" && (
                              <div className="space-y-4">
                                <div>
                                  <label className="block text-sm font-medium text-gray-300 mb-2">
                                    Bank Name <span className="text-red-500">*</span>
                                  </label>
                                  <Input
                                    placeholder="Chase, Bank of America, etc."
                                    value={formData.bankName}
                                    onChange={(e) => updateFormData("bankName", e.target.value)}
                                    className={`bg-[#1a1a1a] border-gray-700 text-white h-12 ${errors.bankName ? "border-red-500" : ""}`}
                                  />
                                  {errors.bankName && <p className="text-red-500 text-xs mt-1">{errors.bankName}</p>}
                                </div>

                                <div>
                                  <label className="block text-sm font-medium text-gray-300 mb-2">
                                    Account Number <span className="text-red-500">*</span>
                                  </label>
                                  <Input
                                    type="password"
                                    placeholder="Account number"
                                    value={formData.accountNumber}
                                    onChange={(e) => updateFormData("accountNumber", e.target.value)}
                                    className={`bg-[#1a1a1a] border-gray-700 text-white h-12 ${errors.accountNumber ? "border-red-500" : ""}`}
                                  />
                                  {errors.accountNumber && <p className="text-red-500 text-xs mt-1">{errors.accountNumber}</p>}
                                </div>

                                <div>
                                  <label className="block text-sm font-medium text-gray-300 mb-2">
                                    Routing Number <span className="text-red-500">*</span>
                                  </label>
                                  <Input
                                    placeholder="9 digit routing number"
                                    value={formData.routingNumber}
                                    onChange={(e) => updateFormData("routingNumber", e.target.value.replace(/\D/g, "").slice(0, 9))}
                                    className={`bg-[#1a1a1a] border-gray-700 text-white h-12 ${errors.routingNumber ? "border-red-500" : ""}`}
                                  />
                                  {errors.routingNumber && <p className="text-red-500 text-xs mt-1">{errors.routingNumber}</p>}
                                </div>
                              </div>
                            )}

                            {/* Security Notice */}
                            <div className="p-4 bg-[#1a1a1a] border border-gray-700 rounded-lg">
                              <div className="flex items-start gap-3">
                                <Shield className="w-5 h-5 text-green-500 mt-0.5" />
                                <div>
                                  <p className="text-sm font-medium text-white">WorldPay Secure Payment</p>
                                  <p className="text-xs text-gray-400 mt-1">
                                    Your payment information is encrypted and processed securely through WorldPay. We never store your full card details.
                                  </p>
                                </div>
                              </div>
                            </div>
                          </motion.div>
                        )}

                        {/* STEP 5: Emergency Contact & Consent */}
                        {registrationStep === 5 && (
                          <motion.div
                            key="step5"
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                            className="space-y-4"
                          >
                            <div className="flex items-center gap-3 mb-6">
                              <div className="w-12 h-12 rounded-xl bg-green-500/20 flex items-center justify-center">
                                <Heart className="w-6 h-6 text-green-500" />
                              </div>
                              <div>
                                <h3 className="text-lg font-semibold text-white">Emergency Contact & Consent</h3>
                                <p className="text-sm text-gray-500">Add an emergency contact and review terms</p>
                              </div>
                            </div>

                            {/* Emergency Contact */}
                            <div className="p-4 bg-[#1a1a1a] border border-gray-700 rounded-lg mb-6">
                              <h4 className="text-sm font-medium text-white mb-4 flex items-center gap-2">
                                <Heart className="w-4 h-4 text-red-500" />
                                Emergency Contact (Optional but Recommended)
                              </h4>
                              <div className="space-y-4">
                                <div>
                                  <label className="block text-xs font-medium text-gray-400 mb-1">Full Name</label>
                                  <Input
                                    placeholder="Jane Smith"
                                    value={formData.emergencyName}
                                    onChange={(e) => updateFormData("emergencyName", e.target.value)}
                                    className="bg-[#0f0f0f] border-gray-600 text-white h-10 text-sm"
                                  />
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                  <div>
                                    <label className="block text-xs font-medium text-gray-400 mb-1">Phone Number</label>
                                    <Input
                                      placeholder="(555) 123-4567"
                                      value={formData.emergencyPhone}
                                      onChange={(e) => updateFormData("emergencyPhone", formatPhone(e.target.value))}
                                      className="bg-[#0f0f0f] border-gray-600 text-white h-10 text-sm"
                                    />
                                  </div>
                                  <div>
                                    <label className="block text-xs font-medium text-gray-400 mb-1">Relationship</label>
                                    <select
                                      value={formData.emergencyRelation}
                                      onChange={(e) => updateFormData("emergencyRelation", e.target.value)}
                                      className="w-full bg-[#0f0f0f] border border-gray-600 text-white h-10 rounded-md px-3 text-sm"
                                    >
                                      <option value="">Select</option>
                                      <option value="spouse">Spouse</option>
                                      <option value="parent">Parent</option>
                                      <option value="sibling">Sibling</option>
                                      <option value="child">Child</option>
                                      <option value="friend">Friend</option>
                                      <option value="other">Other</option>
                                    </select>
                                  </div>
                                </div>
                              </div>
                            </div>

                            {/* Required Consents */}
                            <div className="space-y-3">
                              <h4 className="text-sm font-medium text-white flex items-center gap-2">
                                <FileText className="w-4 h-4 text-green-500" />
                                Terms & Agreements
                              </h4>

                              {/* Terms of Service */}
                              <div className={`p-4 rounded-lg border ${errors.agreeTerms ? "border-red-500 bg-red-500/10" : "border-gray-700 bg-[#1a1a1a]"}`}>
                                <label className="flex items-start gap-3 cursor-pointer">
                                  <input
                                    type="checkbox"
                                    checked={formData.agreeTerms}
                                    onChange={(e) => updateFormData("agreeTerms", e.target.checked)}
                                    className="w-5 h-5 mt-0.5 rounded border-gray-600 bg-[#0f0f0f] text-green-500 focus:ring-green-500"
                                  />
                                  <div>
                                    <span className="text-sm text-white">
                                      I agree to the <a href="#" className="text-green-500 hover:underline">Terms of Service</a> <span className="text-red-500">*</span>
                                    </span>
                                    <p className="text-xs text-gray-500 mt-1">
                                      By checking this box, you agree to be bound by our terms and conditions for using GlideWay services.
                                    </p>
                                  </div>
                                </label>
                              </div>

                              {/* Privacy Policy */}
                              <div className={`p-4 rounded-lg border ${errors.agreePrivacy ? "border-red-500 bg-red-500/10" : "border-gray-700 bg-[#1a1a1a]"}`}>
                                <label className="flex items-start gap-3 cursor-pointer">
                                  <input
                                    type="checkbox"
                                    checked={formData.agreePrivacy}
                                    onChange={(e) => updateFormData("agreePrivacy", e.target.checked)}
                                    className="w-5 h-5 mt-0.5 rounded border-gray-600 bg-[#0f0f0f] text-green-500 focus:ring-green-500"
                                  />
                                  <div>
                                    <span className="text-sm text-white">
                                      I agree to the <a href="#" className="text-green-500 hover:underline">Privacy Policy</a> <span className="text-red-500">*</span>
                                    </span>
                                    <p className="text-xs text-gray-500 mt-1">
                                      We collect and process your data to provide ride services, improve safety, and personalize your experience.
                                    </p>
                                  </div>
                                </label>
                              </div>

                              {/* Payment Storage */}
                              <div className={`p-4 rounded-lg border ${errors.agreePaymentStorage ? "border-red-500 bg-red-500/10" : "border-gray-700 bg-[#1a1a1a]"}`}>
                                <label className="flex items-start gap-3 cursor-pointer">
                                  <input
                                    type="checkbox"
                                    checked={formData.agreePaymentStorage}
                                    onChange={(e) => updateFormData("agreePaymentStorage", e.target.checked)}
                                    className="w-5 h-5 mt-0.5 rounded border-gray-600 bg-[#0f0f0f] text-green-500 focus:ring-green-500"
                                  />
                                  <div>
                                    <span className="text-sm text-white">
                                      I understand that my payment information will be securely stored for ride payments <span className="text-red-500">*</span>
                                    </span>
                                    <p className="text-xs text-gray-500 mt-1">
                                      Your payment details are encrypted and stored securely through WorldPay for convenient future payments.
                                    </p>
                                  </div>
                                </label>
                              </div>

                              {/* Location Access */}
                              <div className={`p-4 rounded-lg border ${errors.agreeLocationAccess ? "border-red-500 bg-red-500/10" : "border-gray-700 bg-[#1a1a1a]"}`}>
                                <label className="flex items-start gap-3 cursor-pointer">
                                  <input
                                    type="checkbox"
                                    checked={formData.agreeLocationAccess}
                                    onChange={(e) => updateFormData("agreeLocationAccess", e.target.checked)}
                                    className="w-5 h-5 mt-0.5 rounded border-gray-600 bg-[#0f0f0f] text-green-500 focus:ring-green-500"
                                  />
                                  <div>
                                    <span className="text-sm text-white">
                                      I grant GlideWay access to my location for ride services <span className="text-red-500">*</span>
                                    </span>
                                    <p className="text-xs text-gray-500 mt-1">
                                      Location access is required for accurate pickup, navigation, safety features, and estimated arrival times.
                                    </p>
                                  </div>
                                </label>
                              </div>

                              {/* Marketing (Optional) */}
                              <div className="p-4 rounded-lg border border-gray-700 bg-[#1a1a1a]">
                                <label className="flex items-start gap-3 cursor-pointer">
                                  <input
                                    type="checkbox"
                                    checked={formData.agreeMarketing}
                                    onChange={(e) => updateFormData("agreeMarketing", e.target.checked)}
                                    className="w-5 h-5 mt-0.5 rounded border-gray-600 bg-[#0f0f0f] text-green-500 focus:ring-green-500"
                                  />
                                  <div>
                                    <span className="text-sm text-white">
                                      I would like to receive promotional offers and updates (Optional)
                                    </span>
                                    <p className="text-xs text-gray-500 mt-1">
                                      Get exclusive discounts, ride credits, and news about new features.
                                    </p>
                                  </div>
                                </label>
                              </div>
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>

                      {/* Navigation Buttons */}
                      <div className="flex gap-3 mt-8">
                        {registrationStep > 1 && (
                          <Button
                            variant="outline"
                            onClick={handlePrevStep}
                            className="flex-1 border-gray-700 text-gray-300 hover:bg-gray-800 py-6"
                          >
                            <ChevronLeft className="w-5 h-5 mr-2" />
                            Back
                          </Button>
                        )}
                        
                        {registrationStep < 5 ? (
                          <Button
                            onClick={handleNextStep}
                            className="flex-1 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white py-6"
                          >
                            Continue
                            <ChevronRight className="w-5 h-5 ml-2" />
                          </Button>
                        ) : (
                          <Button
                            onClick={handleSubmitRegistration}
                            disabled={isLoading}
                            className="flex-1 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white py-6"
                          >
                            {isLoading ? (
                              <>
                                <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                                Creating Account...
                              </>
                            ) : (
                              <>
                                <UserPlus className="w-5 h-5 mr-2" />
                                Create My Account
                              </>
                            )}
                          </Button>
                        )}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </CardContent>
            </Card>
          </motion.div>

          {/* Right Side - Security Info & Ad Window */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="space-y-6"
          >
            {/* Security Features */}
            <Card className="bg-[#111111] border-gray-800">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <Shield className="w-5 h-5 text-green-500" />
                  Your Security is Our Priority
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {[
                  { icon: LockIcon, title: "256-bit Encryption", desc: "Bank-level security for all data" },
                  { icon: Fingerprint, title: "Two-Factor Auth", desc: "Optional SMS verification" },
                  { icon: ShieldCheck, title: "WorldPay Secure", desc: "PCI-DSS compliant payments" },
                  { icon: AlertTriangle, title: "Fraud Protection", desc: "Real-time monitoring" }
                ].map(({ icon: Icon, title, desc }, i) => (
                  <div key={i} className="flex items-start gap-3">
                    <div className="w-10 h-10 rounded-lg bg-green-500/10 flex items-center justify-center">
                      <Icon className="w-5 h-5 text-green-500" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-white">{title}</p>
                      <p className="text-xs text-gray-500">{desc}</p>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Vendor Ad Window */}
            <Card className="bg-gradient-to-br from-[#1a1a1a] to-[#0f1a0f] border-gray-800 overflow-hidden">
              <div className="absolute top-2 right-2 px-2 py-0.5 bg-gray-800 rounded text-[10px] text-gray-500">
                Advertisement
              </div>
              <CardContent className="p-6">
                <div className="text-center">
                  <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-500 to-purple-600 mx-auto flex items-center justify-center mb-4">
                    <Gift className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-lg font-semibold text-white mb-2">Special Offer!</h3>
                  <p className="text-sm text-gray-400 mb-4">
                    Get 20% off your first 5 rides when you sign up today!
                  </p>
                  <div className="inline-block px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg">
                    <span className="text-white font-bold">Code: NEWRIDER20</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Trust Badges */}
            <div className="grid grid-cols-3 gap-4">
              {[
                { value: "50K+", label: "Active Riders" },
                { value: "4.9", label: "App Rating" },
                { value: "24/7", label: "Support" }
              ].map(({ value, label }, i) => (
                <div key={i} className="text-center p-4 bg-[#111111] border border-gray-800 rounded-xl">
                  <p className="text-xl font-bold text-green-500">{value}</p>
                  <p className="text-xs text-gray-500">{label}</p>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}


