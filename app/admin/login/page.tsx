"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import {
  Lock, Mail, Eye, EyeOff, Shield, AlertCircle, Loader2,
  Fingerprint, Key, Building2, CheckCircle2, ChevronRight, User
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import Link from "next/link"

export default function ManagementPortalLogin() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const [tfaCode, setTfaCode] = useState("")
  const [step, setStep] = useState<"credentials" | "tfa">("credentials")
  const [rememberDevice, setRememberDevice] = useState(false)

  const handleCredentials = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    if (!email || !password) { setError("Both fields are required."); return }
    setIsLoading(true)
    
    try {
      const response = await fetch("/api/auth/admin-login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password })
      })
      
      const data = await response.json()
      
      if (data.success) {
        localStorage.setItem("glideway_admin_token", data.token)
        localStorage.setItem("glideway_admin_user", JSON.stringify(data.user))
        setStep("tfa")
      } else {
        setError(data.error || "Invalid credentials")
      }
    } catch {
      setError("Network error. Please try again.")
    }
    
    setIsLoading(false)
  }

  const handleTfa = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    if (tfaCode.length !== 6) { setError("Enter the 6-digit code from your authenticator app."); return }
    setIsLoading(true)
    
    // For demo purposes, accept any 6-digit code
    // In production, this would verify against TOTP
    await new Promise(r => setTimeout(r, 800))
    setIsLoading(false)
    window.location.href = "/admin"
  }

  return (
    <div className="min-h-screen bg-[#050505] flex flex-col">
      {/* Top security bar */}
      <div className="bg-[#0d1a0d] border-b border-[#1a3a1a] px-6 py-2 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          <span className="text-xs text-emerald-400 font-mono">SECURE SESSION  •  256-BIT TLS ENCRYPTED</span>
        </div>
        <span className="text-xs text-gray-500 font-mono">glidewayride.com/admin</span>
      </div>

      <div className="flex flex-1 items-center justify-center p-4">
        {/* Background glows */}
        <div className="pointer-events-none fixed inset-0 overflow-hidden">
          <div className="absolute top-1/3 left-1/4 w-[500px] h-[500px] bg-emerald-500/4 rounded-full blur-3xl" />
          <div className="absolute bottom-1/3 right-1/4 w-[400px] h-[400px] bg-emerald-500/3 rounded-full blur-3xl" />
          <div className="absolute inset-0 opacity-[0.015]"
            style={{ backgroundImage: "linear-gradient(#1f1f1f 1px, transparent 1px), linear-gradient(90deg, #1f1f1f 1px, transparent 1px)", backgroundSize: "40px 40px" }} />
        </div>

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="relative w-full max-w-[440px]"
        >
          {/* Logo + Brand */}
          <div className="text-center mb-8">
            <div className="flex items-center justify-center mb-5">
              <span className="text-3xl font-bold tracking-tight"><span className="text-white">GLIDE</span><span className="text-emerald-400">WAY</span></span>
            </div>
            <h1 className="text-2xl font-bold text-white tracking-tight">GlideWay</h1>
            <p className="text-emerald-400 text-sm font-semibold tracking-widest uppercase mt-1">Management Portal</p>
            <p className="text-gray-500 text-xs mt-2">Authorized staff access only</p>
          </div>

          {/* Card */}
          <div className="bg-[#0f0f0f] border border-[#1e1e1e] rounded-2xl overflow-hidden shadow-2xl">
            {/* Step indicator */}
            <div className="flex border-b border-[#1e1e1e]">
              {[
                { label: "Credentials", key: "credentials" },
                { label: "Verification", key: "tfa" },
              ].map((s, i) => (
                <div key={s.key} className={`flex-1 flex items-center justify-center gap-2 py-3 text-xs font-medium transition-colors
                  ${step === s.key ? "text-emerald-400 bg-emerald-500/5 border-b-2 border-emerald-500" : "text-gray-600"}`}>
                  <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold
                    ${step === s.key ? "bg-emerald-500/20 text-emerald-400" : i === 0 && step === "tfa" ? "bg-emerald-500/20 text-emerald-400" : "bg-[#1a1a1a] text-gray-600"}`}>
                    {i === 0 && step === "tfa" ? <CheckCircle2 className="w-3 h-3" /> : i + 1}
                  </span>
                  {s.label}
                </div>
              ))}
            </div>

            <div className="p-8">
              <AnimatePresence mode="wait">
                {step === "credentials" ? (
                  <motion.form
                    key="credentials"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    onSubmit={handleCredentials}
                    className="space-y-5"
                  >
                    <div>
                      <p className="text-white font-semibold text-lg mb-1">Welcome back</p>
                      <p className="text-gray-500 text-sm">Enter your staff credentials to continue.</p>
                    </div>

                    {error && (
                      <div className="flex items-center gap-2 p-3 rounded-lg bg-red-500/10 border border-red-500/20">
                        <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
                        <span className="text-sm text-red-400">{error}</span>
                      </div>
                    )}

                    <div className="space-y-1">
                      <label className="text-sm font-medium text-gray-300">Staff Email Address</label>
                      <div className="relative">
                        <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                        <Input
                          type="email"
                          placeholder="you@glidewayride.com"
                          value={email}
                          onChange={e => setEmail(e.target.value)}
                          className="pl-10 h-12 bg-[#0a0a0a] border-[#2a2a2a] text-white placeholder:text-gray-600 focus:border-emerald-500 rounded-xl"
                          required
                        />
                      </div>
                    </div>

                    <div className="space-y-1">
                      <label className="text-sm font-medium text-gray-300">Password</label>
                      <div className="relative">
                        <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                        <Input
                          type={showPassword ? "text" : "password"}
                          placeholder="••••••••••••"
                          value={password}
                          onChange={e => setPassword(e.target.value)}
                          className="pl-10 pr-11 h-12 bg-[#0a0a0a] border-[#2a2a2a] text-white placeholder:text-gray-600 focus:border-emerald-500 rounded-xl"
                          required
                        />
                        <button type="button" onClick={() => setShowPassword(v => !v)}
                          className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300 transition-colors">
                          {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </button>
                      </div>
                    </div>

                    <div className="flex items-center justify-between">
                      <label className="flex items-center gap-2 cursor-pointer select-none">
                        <input type="checkbox" checked={rememberDevice} onChange={e => setRememberDevice(e.target.checked)}
                          className="w-4 h-4 rounded border-gray-600 accent-emerald-500" />
                        <span className="text-sm text-gray-400">Remember this device for 30 days</span>
                      </label>
                      <button type="button" className="text-xs text-emerald-400 hover:underline">Reset password</button>
                    </div>

                    <Button type="submit" disabled={isLoading}
                      className="w-full h-12 bg-emerald-600 hover:bg-emerald-500 text-white font-semibold rounded-xl transition-all">
                      {isLoading
                        ? <><Loader2 className="w-4 h-4 mr-2 animate-spin" />Authenticating...</>
                        : <><Key className="w-4 h-4 mr-2" />Sign In <ChevronRight className="w-4 h-4 ml-1" /></>}
                    </Button>

                    <div className="flex items-start gap-3 p-3 rounded-xl bg-[#0a0a0a] border border-[#1e1e1e]">
                      <Shield className="w-4 h-4 text-emerald-500 mt-0.5 shrink-0" />
                      <p className="text-xs text-gray-500 leading-relaxed">
                        This portal is restricted to authorized GlideWay operations staff. All sessions are logged. Unauthorized access is a violation of company policy and may be subject to legal action.
                      </p>
                    </div>

                    {/* Demo Credentials */}
                    <div className="p-3 rounded-xl bg-emerald-500/5 border border-emerald-500/20">
                      <p className="text-xs text-emerald-400 font-medium mb-2">Demo Credentials:</p>
                      <p className="text-xs text-gray-400">Email: admin@glideway.com</p>
                      <p className="text-xs text-gray-400">Password: admin1234</p>
                      <p className="text-xs text-gray-400 mt-1">2FA Code: Any 6 digits (e.g., 123456)</p>
                    </div>
                  </motion.form>
                ) : (
                  <motion.form
                    key="tfa"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    onSubmit={handleTfa}
                    className="space-y-5"
                  >
                    <div className="text-center">
                      <div className="w-16 h-16 rounded-full bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center mx-auto mb-4">
                        <Fingerprint className="w-8 h-8 text-emerald-400" />
                      </div>
                      <p className="text-white font-semibold text-lg">Two-Factor Authentication</p>
                      <p className="text-gray-500 text-sm mt-1">Enter any 6-digit code to continue (demo mode).</p>
                    </div>

                    {/* Demo Mode Notice */}
                    <div className="flex items-center gap-2 p-3 rounded-xl bg-amber-500/10 border border-amber-500/30">
                      <Shield className="w-4 h-4 text-amber-400 shrink-0" />
                      <p className="text-xs text-amber-300">
                        <span className="font-semibold">Demo Mode:</span> Enter any 6 digits (e.g., 123456) to proceed.
                      </p>
                    </div>

                    {error && (
                      <div className="flex items-center gap-2 p-3 rounded-lg bg-red-500/10 border border-red-500/20">
                        <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
                        <span className="text-sm text-red-400">{error}</span>
                      </div>
                    )}

                    <div className="flex items-center gap-2 p-3 rounded-xl bg-emerald-500/5 border border-emerald-500/20">
                      <User className="w-4 h-4 text-emerald-400 shrink-0" />
                      <p className="text-sm text-emerald-300 font-medium">{email}</p>
                    </div>

                    <div className="space-y-1">
                      <label className="text-sm font-medium text-gray-300">Verification Code</label>
                      <Input
                        type="text"
                        inputMode="numeric"
                        placeholder="123456"
                        value={tfaCode.replace(/(\d{3})(\d{1,3})/, "$1 $2")}
                        onChange={e => setTfaCode(e.target.value.replace(/\D/g, "").slice(0, 6))}
                        className="h-14 text-center text-2xl tracking-[0.4em] font-mono bg-[#0a0a0a] border-[#2a2a2a] text-white placeholder:text-gray-700 focus:border-emerald-500 rounded-xl"
                        maxLength={7}
                      />
                      <p className="text-xs text-emerald-400 text-center">Enter any 6 digits to continue</p>
                    </div>

                    <Button type="submit" disabled={isLoading || tfaCode.length < 6}
                      className="w-full h-12 bg-emerald-600 hover:bg-emerald-500 text-white font-semibold rounded-xl disabled:opacity-40">
                      {isLoading
                        ? <><Loader2 className="w-4 h-4 mr-2 animate-spin" />Verifying...</>
                        : <><CheckCircle2 className="w-4 h-4 mr-2" />Verify &amp; Enter Dashboard</>}
                    </Button>

                    <div className="flex items-center justify-between text-xs">
                      <button type="button" onClick={() => setStep("credentials")} className="text-gray-500 hover:text-white transition-colors">
                        Back to login
                      </button>
                    </div>
                  </motion.form>
                )}
              </AnimatePresence>
            </div>
          </div>

          <p className="text-center text-xs text-gray-600 mt-6">
            Not a staff member?{" "}
            <Link href="/" className="text-emerald-400 hover:underline">Return to public website</Link>
          </p>
        </motion.div>
      </div>
    </div>
  )
}
