"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { 
  Mail, Lock, Eye, EyeOff, Phone, User, 
  ChevronRight, Shield, CheckCircle2, AlertCircle, 
  Loader2, ShieldCheck
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import Link from "next/link"

type AuthMode = "login" | "register"

export default function AppLogin() {
  const [mode, setMode] = useState<AuthMode>("login")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)

  // Login state
  const [loginEmail, setLoginEmail] = useState("")
  const [loginPassword, setLoginPassword] = useState("")

  // Registration state
  const [registerData, setRegisterData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
  })

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setIsLoading(true)

    // Basic validation
    if (!loginEmail || !loginPassword) {
      setError("Please fill in all fields")
      setIsLoading(false)
      return
    }

    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: loginEmail,
          password: loginPassword,
          userType: "RIDER"
        })
      })

      const data = await response.json()

      if (data.success) {
        localStorage.setItem("glideway_token", data.token)
        localStorage.setItem("glideway_user", JSON.stringify(data.user))
        setSuccess("Login successful! Redirecting...")
        setTimeout(() => {
          window.location.href = "/rider"
        }, 1000)
      } else {
        setError(data.error || "Invalid credentials")
      }
    } catch {
      setError("Network error. Please try again.")
    }

    setIsLoading(false)
  }

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setIsLoading(true)

    // Validation
    if (!registerData.firstName || !registerData.lastName || !registerData.email || !registerData.phone || !registerData.password) {
      setError("Please fill in all required fields")
      setIsLoading(false)
      return
    }

    if (registerData.password.length < 8) {
      setError("Password must be at least 8 characters")
      setIsLoading(false)
      return
    }

    if (registerData.password !== registerData.confirmPassword) {
      setError("Passwords do not match")
      setIsLoading(false)
      return
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(registerData.email)) {
      setError("Please enter a valid email address")
      setIsLoading(false)
      return
    }

    try {
      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...registerData,
          userType: "RIDER"
        })
      })

      const data = await response.json()

      if (data.success) {
        localStorage.setItem("glideway_token", data.token)
        localStorage.setItem("glideway_user", JSON.stringify(data.user))
        setSuccess("Account created successfully! Redirecting...")
        setTimeout(() => {
          window.location.href = "/rider"
        }, 1500)
      } else {
        setError(data.error || "Registration failed")
      }
    } catch {
      setError("Network error. Please try again.")
    }

    setIsLoading(false)
  }

  const updateRegisterField = (field: string, value: string) => {
    setRegisterData(prev => ({ ...prev, [field]: value }))
    setError("")
  }

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
            <img src="/logo.png" alt="GlideWay Logo" className="h-12 w-auto object-contain mx-auto mb-4" />
            <p className="text-sm text-gray-400">
              {mode === "login" ? "Welcome back! Sign in to continue" : "Create your account"}
            </p>
          </div>

          {/* Mode Tabs */}
          <div className="flex bg-[#1a1a1a] rounded-lg p-1 mb-6">
            <button
              onClick={() => { setMode("login"); setError(""); setSuccess(""); }}
              className={`flex-1 py-2 rounded-md text-sm font-medium transition-all ${
                mode === "login" ? "bg-emerald-500 text-white" : "text-gray-400 hover:text-white"
              }`}
            >
              Login
            </button>
            <button
              onClick={() => { setMode("register"); setError(""); setSuccess(""); }}
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
                <AlertCircle className="w-4 h-4 text-red-500 flex-shrink-0" />
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
                <CheckCircle2 className="w-4 h-4 text-emerald-500 flex-shrink-0" />
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

              {/* Demo Credentials */}
              <div className="mt-4 p-3 bg-emerald-500/5 border border-emerald-500/20 rounded-lg">
                <p className="text-xs text-emerald-400 font-medium mb-2">Demo Credentials:</p>
                <p className="text-xs text-gray-400">Email: demo@glideway.com</p>
                <p className="text-xs text-gray-400">Password: demo1234</p>
              </div>
            </form>
          )}

          {/* REGISTRATION FORM */}
          {mode === "register" && (
            <form onSubmit={handleRegister} className="space-y-4">
              <div className="text-center mb-4">
                <User className="w-12 h-12 text-emerald-500 mx-auto mb-2" />
                <h3 className="text-lg font-semibold text-white">Create Account</h3>
                <p className="text-sm text-gray-400">Fill in your details to get started</p>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="relative">
                  <Input
                    placeholder="First Name *"
                    value={registerData.firstName}
                    onChange={(e) => updateRegisterField("firstName", e.target.value)}
                    className="bg-[#1a1a1a] border-[#333] text-white"
                    required
                  />
                </div>
                <div className="relative">
                  <Input
                    placeholder="Last Name *"
                    value={registerData.lastName}
                    onChange={(e) => updateRegisterField("lastName", e.target.value)}
                    className="bg-[#1a1a1a] border-[#333] text-white"
                    required
                  />
                </div>
              </div>

              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                <Input
                  type="email"
                  placeholder="Email address *"
                  value={registerData.email}
                  onChange={(e) => updateRegisterField("email", e.target.value)}
                  className="pl-10 bg-[#1a1a1a] border-[#333] text-white"
                  required
                />
              </div>

              <div className="relative">
                <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                <Input
                  type="tel"
                  placeholder="Phone number *"
                  value={registerData.phone}
                  onChange={(e) => updateRegisterField("phone", e.target.value)}
                  className="pl-10 bg-[#1a1a1a] border-[#333] text-white"
                  required
                />
              </div>

              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                <Input
                  type={showPassword ? "text" : "password"}
                  placeholder="Password (min 8 characters) *"
                  value={registerData.password}
                  onChange={(e) => updateRegisterField("password", e.target.value)}
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

              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                <Input
                  type={showConfirmPassword ? "text" : "password"}
                  placeholder="Confirm password *"
                  value={registerData.confirmPassword}
                  onChange={(e) => updateRegisterField("confirmPassword", e.target.value)}
                  className="pl-10 pr-10 bg-[#1a1a1a] border-[#333] text-white"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-white"
                >
                  {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>

              <div className="flex items-start gap-2 text-sm text-gray-400">
                <input type="checkbox" className="mt-1 rounded bg-[#1a1a1a] border-[#333]" required />
                <span>
                  I agree to the{" "}
                  <Link href="#" className="text-emerald-500 hover:underline">Terms of Service</Link>
                  {" "}and{" "}
                  <Link href="#" className="text-emerald-500 hover:underline">Privacy Policy</Link>
                </span>
              </div>

              <Button
                type="submit"
                disabled={isLoading}
                className="w-full bg-emerald-500 hover:bg-emerald-600 text-white"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin mr-2" />
                    Creating Account...
                  </>
                ) : (
                  <>
                    Create Account
                    <ChevronRight className="w-4 h-4 ml-2" />
                  </>
                )}
              </Button>
            </form>
          )}

          {/* Security Footer */}
          <div className="mt-6 pt-4 border-t border-[#222] flex items-center justify-center gap-2 text-xs text-gray-500">
            <Shield className="w-3 h-3" />
            <span>Your data is protected with bank-level security</span>
          </div>

          {/* Back to Home */}
          <div className="mt-4 text-center">
            <Link href="/" className="text-sm text-gray-400 hover:text-emerald-500">
              Back to Home
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
