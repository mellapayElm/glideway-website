"use client"

import { useState } from "react"
import { ChevronLeft, Mail } from "lucide-react"

interface PhoneLoginScreenProps {
  onBack?: () => void
  onContinue?: (phone: string) => void
}

export function PhoneLoginScreen({ onBack, onContinue }: PhoneLoginScreenProps) {
  const [phone, setPhone] = useState("")
  const [loginMethod, setLoginMethod] = useState<"phone" | "email" | null>(null)
  const [email, setEmail] = useState("")

  const formatPhoneNumber = (value: string) => {
    const digits = value.replace(/\D/g, "")
    if (digits.length <= 3) return digits
    if (digits.length <= 6) return `(${digits.slice(0, 3)}) ${digits.slice(3)}`
    return `(${digits.slice(0, 3)}) ${digits.slice(3, 6)}-${digits.slice(6, 10)}`
  }

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatPhoneNumber(e.target.value)
    setPhone(formatted)
  }

  const handlePhoneSubmit = () => {
    const digits = phone.replace(/\D/g, "")
    if (digits.length === 10) {
      onContinue?.(`+1${digits}`)
    }
  }

  const handleEmailSubmit = () => {
    if (email.includes("@")) {
      onContinue?.(email)
    }
  }

  return (
    <div className="w-full min-h-screen bg-gradient-to-br from-gray-950 via-gray-900 to-gray-950 flex flex-col">
      {/* Status Bar */}
      <div className="bg-gray-900 text-white px-4 py-2 flex items-center justify-between text-xs font-medium border-b border-gray-800">
        <span>12:32</span>
        <div className="flex items-center gap-1">
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
            <path d="M1 9l2 2c4.97-4.97 13.03-4.97 18 0l2-2C16.93 2.93 7.08 2.93 1 9zm8 8l3 3 3-3c-1.65-1.66-4.34-1.66-6 0zm-4-4l2 2c2.76-2.76 7.24-2.76 10 0l2-2C15.14 9.14 8.87 9.14 5 13z"/>
          </svg>
          <svg className="w-5 h-4" fill="currentColor" viewBox="0 0 24 24">
            <rect x="2" y="7" width="18" height="10" rx="2" stroke="currentColor" strokeWidth="1" fill="none"/>
            <rect x="20" y="10" width="2" height="4" rx="0.5" fill="currentColor"/>
            <rect x="4" y="9" width="12" height="6" rx="1" fill="currentColor"/>
          </svg>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-y-auto px-6 py-8">
        {/* Back Button */}
        {loginMethod && (
          <button
            onClick={() => setLoginMethod(null)}
            className="flex items-center gap-2 text-lime-400 hover:text-lime-300 mb-6 transition-colors"
          >
            <ChevronLeft className="w-5 h-5" />
            <span className="text-sm font-medium">Back</span>
          </button>
        )}

        {!loginMethod ? (
          <>
            {/* Header */}
            <div className="mb-8">
              <h1 className="text-3xl font-bold text-white mb-2">Welcome back</h1>
              <p className="text-gray-400">Choose how you'd like to sign in</p>
            </div>

            {/* Phone Option */}
            <button
              onClick={() => setLoginMethod("phone")}
              className="w-full bg-gray-800 hover:bg-gray-700 border border-gray-700 hover:border-lime-400/50 rounded-lg p-4 mb-3 transition-all text-left group"
            >
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-lime-400/20 rounded-full flex items-center justify-center group-hover:bg-lime-400/30 transition-colors">
                  <svg className="w-6 h-6 text-lime-400" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M17 10.5V7c0-.55-.45-1-1-1H4c-.55 0-1 .45-1 1v10c0 .55.45 1 1 1h12c.55 0 1-.45 1-1v-3.5l4 4v-11l-4 4z"/>
                  </svg>
                </div>
                <div>
                  <h3 className="text-white font-semibold">Phone Number</h3>
                  <p className="text-gray-400 text-sm">Sign in with your phone</p>
                </div>
              </div>
            </button>

            {/* Email Option */}
            <button
              onClick={() => setLoginMethod("email")}
              className="w-full bg-gray-800 hover:bg-gray-700 border border-gray-700 hover:border-lime-400/50 rounded-lg p-4 mb-3 transition-all text-left group"
            >
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-lime-400/20 rounded-full flex items-center justify-center group-hover:bg-lime-400/30 transition-colors">
                  <Mail className="w-6 h-6 text-lime-400" />
                </div>
                <div>
                  <h3 className="text-white font-semibold">Email</h3>
                  <p className="text-gray-400 text-sm">Sign in with your email</p>
                </div>
              </div>
            </button>

            {/* Divider */}
            <div className="flex items-center gap-4 my-6">
              <div className="flex-1 h-px bg-gray-700" />
              <span className="text-gray-500 text-sm">or</span>
              <div className="flex-1 h-px bg-gray-700" />
            </div>

            {/* Google Sign In */}
            <button className="w-full bg-white hover:bg-gray-100 text-gray-900 font-semibold py-4 px-6 rounded-lg transition-colors mb-3 flex items-center justify-center gap-2">
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
              </svg>
              Continue with Google
            </button>

            {/* Find Account */}
            <button className="w-full text-lime-400 hover:text-lime-300 font-medium py-3 transition-colors">
              Find my account
            </button>
          </>
        ) : loginMethod === "phone" ? (
          <>
            {/* Phone Login Form */}
            <div className="mb-8">
              <h1 className="text-3xl font-bold text-white mb-2">Enter your mobile number</h1>
              <p className="text-gray-400">We'll send you a verification code</p>
            </div>

            {/* Phone Input */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-300 mb-3">Mobile Number</label>
              <div className="flex gap-3">
                {/* Country Selector */}
                <div className="relative">
                  <button className="flex items-center gap-2 bg-gray-800 border border-gray-700 rounded-lg px-3 py-4 hover:border-gray-600 transition-colors">
                    <span className="text-2xl">🇺🇸</span>
                    <svg className="w-4 h-4 text-gray-400" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M7 10l5 5 5-5z"/>
                    </svg>
                  </button>
                </div>

                {/* Phone Input */}
                <input
                  type="tel"
                  value={phone}
                  onChange={handlePhoneChange}
                  placeholder="(201) 555-0123"
                  className="flex-1 bg-gray-800 border border-gray-700 rounded-lg px-4 py-4 text-white placeholder-gray-500 focus:outline-none focus:border-lime-400 transition-colors"
                />
              </div>
              <p className="text-xs text-gray-500 mt-2">+1 will be added automatically</p>
            </div>

            {/* Continue Button */}
            <button
              onClick={handlePhoneSubmit}
              disabled={phone.replace(/\D/g, "").length !== 10}
              className="w-full bg-lime-400 hover:bg-lime-500 disabled:bg-gray-700 disabled:cursor-not-allowed text-gray-950 font-bold py-4 px-6 rounded-lg transition-all duration-300 mb-4"
            >
              Continue
            </button>

            {/* Divider */}
            <div className="flex items-center gap-4 my-6">
              <div className="flex-1 h-px bg-gray-700" />
              <span className="text-gray-500 text-sm">or</span>
              <div className="flex-1 h-px bg-gray-700" />
            </div>

            {/* Google Option */}
            <button className="w-full bg-white hover:bg-gray-100 text-gray-900 font-semibold py-4 px-6 rounded-lg transition-colors mb-3 flex items-center justify-center gap-2">
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
              </svg>
              Continue with Google
            </button>

            {/* Find Account */}
            <button className="w-full text-lime-400 hover:text-lime-300 font-medium py-3 transition-colors flex items-center justify-center gap-2">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M15.5 1h-8C6.12 1 5 2.12 5 3.5v17C5 21.88 6.12 23 7.5 23h8c1.38 0 2.5-1.12 2.5-2.5v-17C18 2.12 16.88 1 15.5 1zm-4 21c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5zm4.5-4H7V4h9v14z"/>
              </svg>
              Find my account
            </button>
          </>
        ) : (
          <>
            {/* Email Login Form */}
            <div className="mb-8">
              <h1 className="text-3xl font-bold text-white mb-2">Enter your email</h1>
              <p className="text-gray-400">We'll send you a sign-in link</p>
            </div>

            {/* Email Input */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-300 mb-3">Email Address</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-4 text-white placeholder-gray-500 focus:outline-none focus:border-lime-400 transition-colors"
              />
            </div>

            {/* Continue Button */}
            <button
              onClick={handleEmailSubmit}
              disabled={!email.includes("@")}
              className="w-full bg-lime-400 hover:bg-lime-500 disabled:bg-gray-700 disabled:cursor-not-allowed text-gray-950 font-bold py-4 px-6 rounded-lg transition-all duration-300 mb-4"
            >
              Continue
            </button>

            {/* Divider */}
            <div className="flex items-center gap-4 my-6">
              <div className="flex-1 h-px bg-gray-700" />
              <span className="text-gray-500 text-sm">or</span>
              <div className="flex-1 h-px bg-gray-700" />
            </div>

            {/* Google Option */}
            <button className="w-full bg-white hover:bg-gray-100 text-gray-900 font-semibold py-4 px-6 rounded-lg transition-colors mb-3 flex items-center justify-center gap-2">
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
              </svg>
              Continue with Google
            </button>

            {/* Find Account */}
            <button className="w-full text-lime-400 hover:text-lime-300 font-medium py-3 transition-colors flex items-center justify-center gap-2">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M15.5 1h-8C6.12 1 5 2.12 5 3.5v17C5 21.88 6.12 23 7.5 23h8c1.38 0 2.5-1.12 2.5-2.5v-17C18 2.12 16.88 1 15.5 1zm-4 21c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5zm4.5-4H7V4h9v14z"/>
              </svg>
              Find my account
            </button>
          </>
        )}

        {/* Legal Text */}
        <div className="mt-12 pt-6 border-t border-gray-800">
          <p className="text-xs text-gray-500 leading-relaxed">
            By continuing, you agree to calls, including by autodialer, WhatsApp, or texts from GlideWay and its affiliates. Text &quot;STOP&quot; to opt out.
          </p>
        </div>
      </div>
    </div>
  )
}
