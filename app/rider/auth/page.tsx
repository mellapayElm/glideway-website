"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import Link from "next/link"
import { useRouter } from "next/navigation"
import {
  Phone, Mail, Lock, User, Eye, EyeOff, ArrowRight, ArrowLeft,
  Shield, CheckCircle, Loader2, Fingerprint, Apple, Chrome
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

type AuthMode = "login" | "register" | "verify" | "forgot"

export default function RiderAuthPage() {
  const router = useRouter()
  const [mode, setMode] = useState<AuthMode>("login")
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [otpSent, setOtpSent] = useState(false)
  const [otp, setOtp] = useState(["", "", "", "", "", ""])

  // Form fields
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: ""
  })

  const [errors, setErrors] = useState<Record<string, string>>({})

  const validateForm = () => {
    const newErrors: Record<string, string> = {}
    
    if (mode === "register") {
      if (!formData.firstName.trim()) newErrors.firstName = "First name is required"
      if (!formData.lastName.trim()) newErrors.lastName = "Last name is required"
      if (!formData.phone.trim()) newErrors.phone = "Phone number is required"
      if (formData.password !== formData.confirmPassword) {
        newErrors.confirmPassword = "Passwords do not match"
      }
    }
    
    if (!formData.email.trim()) newErrors.email = "Email is required"
    else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = "Invalid email format"
    
    if (!formData.password.trim()) newErrors.password = "Password is required"
    else if (formData.password.length < 8) newErrors.password = "Password must be at least 8 characters"

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!validateForm()) return

    setIsLoading(true)
    
    // Simulate API call
    await new Promise(r => setTimeout(r, 2000))
    
    if (mode === "register") {
      setMode("verify")
      setOtpSent(true)
    } else if (mode === "login") {
      // Redirect to rider app
      router.push("/rider")
    }
    
    setIsLoading(false)
  }

  const handleOtpChange = (index: number, value: string) => {
    if (value.length > 1) return
    const newOtp = [...otp]
    newOtp[index] = value
    setOtp(newOtp)
    
    // Auto-focus next input
    if (value && index < 5) {
      const nextInput = document.getElementById(`otp-${index + 1}`)
      nextInput?.focus()
    }
  }

  const verifyOtp = async () => {
    setIsLoading(true)
    await new Promise(r => setTimeout(r, 1500))
    router.push("/rider")
  }

  const resendOtp = async () => {
    setIsLoading(true)
    await new Promise(r => setTimeout(r, 1000))
    setIsLoading(false)
  }

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col">
      {/* Header */}
      <header className="p-4">
        <div className="flex items-center justify-between">
          {mode !== "login" ? (
            <button
              onClick={() => setMode("login")}
              className="p-2 -ml-2 text-slate-400 hover:text-white"
            >
              <ArrowLeft className="w-6 h-6" />
            </button>
          ) : (
            <Link href="/" className="p-2 -ml-2 text-slate-400 hover:text-white">
              <ArrowLeft className="w-6 h-6" />
            </Link>
          )}
          <span className="text-lg font-bold tracking-tight"><span className="text-white">GLIDE</span><span className="text-lime-400">WAY</span></span>
          <div className="w-10" />
        </div>
      </header>

      <main className="flex-1 px-6 py-8">
        <AnimatePresence mode="wait">
          {/* Login Form */}
          {mode === "login" && (
            <motion.div
              key="login"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
            >
              <h1 className="text-3xl font-bold text-white mb-2">Welcome Back</h1>
              <p className="text-slate-400 mb-8">Sign in to continue booking rides</p>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="text-sm text-slate-400 mb-1 block">Email</label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
                    <Input
                      type="email"
                      placeholder="your@email.com"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="pl-10 bg-slate-800 border-slate-700 text-white h-12"
                    />
                  </div>
                  {errors.email && <p className="text-red-400 text-xs mt-1">{errors.email}</p>}
                </div>

                <div>
                  <label className="text-sm text-slate-400 mb-1 block">Password</label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
                    <Input
                      type={showPassword ? "text" : "password"}
                      placeholder="Enter password"
                      value={formData.password}
                      onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                      className="pl-10 pr-10 bg-slate-800 border-slate-700 text-white h-12"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500"
                    >
                      {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  </div>
                  {errors.password && <p className="text-red-400 text-xs mt-1">{errors.password}</p>}
                </div>

                <button
                  type="button"
                  onClick={() => setMode("forgot")}
                  className="text-sm text-emerald-400 hover:underline"
                >
                  Forgot password?
                </button>

                <Button
                  type="submit"
                  disabled={isLoading}
                  className="w-full bg-emerald-600 hover:bg-emerald-700 text-white h-12"
                >
                  {isLoading ? (
                    <Loader2 className="w-5 h-5 animate-spin" />
                  ) : (
                    <>
                      Sign In
                      <ArrowRight className="w-5 h-5 ml-2" />
                    </>
                  )}
                </Button>
              </form>

              {/* Divider */}
              <div className="flex items-center gap-4 my-6">
                <div className="flex-1 h-px bg-slate-700" />
                <span className="text-sm text-slate-500">or continue with</span>
                <div className="flex-1 h-px bg-slate-700" />
              </div>

              {/* Social Login */}
              <div className="grid grid-cols-2 gap-3 mb-8">
                <Button variant="outline" className="border-slate-700 text-white hover:bg-slate-800 h-12">
                  <Apple className="w-5 h-5 mr-2" />
                  Apple
                </Button>
                <Button variant="outline" className="border-slate-700 text-white hover:bg-slate-800 h-12">
                  <Chrome className="w-5 h-5 mr-2" />
                  Google
                </Button>
              </div>

              {/* Biometric */}
              <Button
                variant="outline"
                className="w-full border-slate-700 text-white hover:bg-slate-800 h-12 mb-6"
              >
                <Fingerprint className="w-5 h-5 mr-2 text-emerald-400" />
                Use Face ID / Fingerprint
              </Button>

              {/* Register Link */}
              <p className="text-center text-slate-400">
                Don&apos;t have an account?{" "}
                <button
                  onClick={() => setMode("register")}
                  className="text-emerald-400 font-medium hover:underline"
                >
                  Sign Up
                </button>
              </p>
            </motion.div>
          )}

          {/* Register Form */}
          {mode === "register" && (
            <motion.div
              key="register"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
            >
              <h1 className="text-3xl font-bold text-white mb-2">Create Account</h1>
              <p className="text-slate-400 mb-8">Join GlideWoy for safe, reliable rides</p>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-sm text-slate-400 mb-1 block">First Name</label>
                    <Input
                      placeholder="John"
                      value={formData.firstName}
                      onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                      className="bg-slate-800 border-slate-700 text-white h-12"
                    />
                    {errors.firstName && <p className="text-red-400 text-xs mt-1">{errors.firstName}</p>}
                  </div>
                  <div>
                    <label className="text-sm text-slate-400 mb-1 block">Last Name</label>
                    <Input
                      placeholder="Doe"
                      value={formData.lastName}
                      onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                      className="bg-slate-800 border-slate-700 text-white h-12"
                    />
                    {errors.lastName && <p className="text-red-400 text-xs mt-1">{errors.lastName}</p>}
                  </div>
                </div>

                <div>
                  <label className="text-sm text-slate-400 mb-1 block">Phone Number</label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
                    <Input
                      type="tel"
                      placeholder="+1 (555) 123-4567"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      className="pl-10 bg-slate-800 border-slate-700 text-white h-12"
                    />
                  </div>
                  {errors.phone && <p className="text-red-400 text-xs mt-1">{errors.phone}</p>}
                </div>

                <div>
                  <label className="text-sm text-slate-400 mb-1 block">Email</label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
                    <Input
                      type="email"
                      placeholder="your@email.com"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="pl-10 bg-slate-800 border-slate-700 text-white h-12"
                    />
                  </div>
                  {errors.email && <p className="text-red-400 text-xs mt-1">{errors.email}</p>}
                </div>

                <div>
                  <label className="text-sm text-slate-400 mb-1 block">Password</label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
                    <Input
                      type={showPassword ? "text" : "password"}
                      placeholder="Create password"
                      value={formData.password}
                      onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                      className="pl-10 pr-10 bg-slate-800 border-slate-700 text-white h-12"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500"
                    >
                      {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  </div>
                  {errors.password && <p className="text-red-400 text-xs mt-1">{errors.password}</p>}
                </div>

                <div>
                  <label className="text-sm text-slate-400 mb-1 block">Confirm Password</label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
                    <Input
                      type="password"
                      placeholder="Confirm password"
                      value={formData.confirmPassword}
                      onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                      className="pl-10 bg-slate-800 border-slate-700 text-white h-12"
                    />
                  </div>
                  {errors.confirmPassword && <p className="text-red-400 text-xs mt-1">{errors.confirmPassword}</p>}
                </div>

                <div className="flex items-start gap-3 p-3 bg-slate-800/50 rounded-lg">
                  <Shield className="w-5 h-5 text-emerald-400 flex-shrink-0 mt-0.5" />
                  <p className="text-xs text-slate-400">
                    By signing up, you agree to our Terms of Service and Privacy Policy. 
                    Your information is encrypted and secure.
                  </p>
                </div>

                <Button
                  type="submit"
                  disabled={isLoading}
                  className="w-full bg-emerald-600 hover:bg-emerald-700 text-white h-12"
                >
                  {isLoading ? (
                    <Loader2 className="w-5 h-5 animate-spin" />
                  ) : (
                    <>
                      Create Account
                      <ArrowRight className="w-5 h-5 ml-2" />
                    </>
                  )}
                </Button>
              </form>

              <p className="text-center text-slate-400 mt-6">
                Already have an account?{" "}
                <button
                  onClick={() => setMode("login")}
                  className="text-emerald-400 font-medium hover:underline"
                >
                  Sign In
                </button>
              </p>
            </motion.div>
          )}

          {/* OTP Verification */}
          {mode === "verify" && (
            <motion.div
              key="verify"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="text-center"
            >
              <div className="w-20 h-20 mx-auto rounded-full bg-emerald-500/20 flex items-center justify-center mb-6">
                <Phone className="w-10 h-10 text-emerald-400" />
              </div>
              <h1 className="text-3xl font-bold text-white mb-2">Verify Phone</h1>
              <p className="text-slate-400 mb-8">
                We sent a 6-digit code to<br />
                <span className="text-white font-medium">{formData.phone || "+1 (555) ***-**67"}</span>
              </p>

              {/* OTP Inputs */}
              <div className="flex justify-center gap-2 mb-6">
                {otp.map((digit, index) => (
                  <input
                    key={index}
                    id={`otp-${index}`}
                    type="text"
                    inputMode="numeric"
                    maxLength={1}
                    value={digit}
                    onChange={(e) => handleOtpChange(index, e.target.value)}
                    className="w-12 h-14 text-center text-xl font-bold bg-slate-800 border-2 border-slate-700 rounded-lg text-white focus:border-emerald-500 focus:outline-none"
                  />
                ))}
              </div>

              <Button
                onClick={verifyOtp}
                disabled={otp.some(d => !d) || isLoading}
                className="w-full bg-emerald-600 hover:bg-emerald-700 text-white h-12 mb-4"
              >
                {isLoading ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  <>
                    Verify
                    <CheckCircle className="w-5 h-5 ml-2" />
                  </>
                )}
              </Button>

              <p className="text-slate-400 text-sm">
                Didn&apos;t receive the code?{" "}
                <button
                  onClick={resendOtp}
                  className="text-emerald-400 font-medium hover:underline"
                  disabled={isLoading}
                >
                  Resend
                </button>
              </p>
            </motion.div>
          )}

          {/* Forgot Password */}
          {mode === "forgot" && (
            <motion.div
              key="forgot"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
            >
              <h1 className="text-3xl font-bold text-white mb-2">Reset Password</h1>
              <p className="text-slate-400 mb-8">
                Enter your email and we&apos;ll send you a link to reset your password
              </p>

              <div className="mb-6">
                <label className="text-sm text-slate-400 mb-1 block">Email</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
                  <Input
                    type="email"
                    placeholder="your@email.com"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="pl-10 bg-slate-800 border-slate-700 text-white h-12"
                  />
                </div>
              </div>

              <Button
                disabled={isLoading}
                className="w-full bg-emerald-600 hover:bg-emerald-700 text-white h-12"
              >
                {isLoading ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  <>
                    Send Reset Link
                    <ArrowRight className="w-5 h-5 ml-2" />
                  </>
                )}
              </Button>

              <p className="text-center text-slate-400 mt-6">
                Remember your password?{" "}
                <button
                  onClick={() => setMode("login")}
                  className="text-emerald-400 font-medium hover:underline"
                >
                  Sign In
                </button>
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </div>
  )
}
