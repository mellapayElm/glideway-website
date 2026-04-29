"use client"

import { useState, useEffect } from "react"
import { Clock } from "lucide-react"

interface OTPVerificationProps {
  phoneNumber: string
  onVerify: (code: string) => void
  onResend: () => void
  isLoading?: boolean
}

export function OTPVerification({ phoneNumber, onVerify, onResend, isLoading = false }: OTPVerificationProps) {
  const [otp, setOtp] = useState(["", "", "", "", "", ""])
  const [timeLeft, setTimeLeft] = useState(300) // 5 minutes
  const [error, setError] = useState("")

  useEffect(() => {
    if (timeLeft <= 0) return
    const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000)
    return () => clearTimeout(timer)
  }, [timeLeft])

  const handleDigitChange = (index: number, value: string) => {
    if (!/^\d?$/.test(value)) return

    const newOtp = [...otp]
    newOtp[index] = value

    setOtp(newOtp)
    setError("")

    // Auto-focus next input
    if (value && index < 5) {
      const nextInput = document.getElementById(`otp-${index + 1}`)
      nextInput?.focus()
    }
  }

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      const prevInput = document.getElementById(`otp-${index - 1}`)
      prevInput?.focus()
    }
  }

  const handleVerify = () => {
    const code = otp.join("")
    if (code.length !== 6) {
      setError("Please enter all 6 digits")
      return
    }
    onVerify(code)
  }

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, "0")}`
  }

  return (
    <div className="w-full max-w-md mx-auto">
      {/* Header */}
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Verify Your Phone</h2>
        <p className="text-gray-600">Enter the 6-digit code sent to {phoneNumber}</p>
      </div>

      {/* OTP Inputs */}
      <div className="flex gap-3 justify-center mb-6">
        {otp.map((digit, index) => (
          <input
            key={index}
            id={`otp-${index}`}
            type="text"
            inputMode="numeric"
            maxLength={1}
            value={digit}
            onChange={(e) => handleDigitChange(index, e.target.value)}
            onKeyDown={(e) => handleKeyDown(index, e)}
            disabled={isLoading}
            className="w-12 h-14 text-center text-2xl font-bold border-2 border-green-200 rounded-lg focus:border-green-500 focus:ring-2 focus:ring-green-100 outline-none transition-all bg-white text-gray-900 disabled:bg-gray-50 disabled:cursor-not-allowed"
          />
        ))}
      </div>

      {/* Error Message */}
      {error && (
        <div className="flex items-center gap-2 bg-red-50 border border-red-200 rounded-lg p-3 mb-6">
          <div className="w-5 h-5 bg-red-500 rounded-full flex items-center justify-center text-white text-xs font-bold">
            !
          </div>
          <p className="text-red-700 text-sm font-medium">{error}</p>
        </div>
      )}

      {/* Timer */}
      <div className="flex items-center justify-center gap-2 mb-6 text-gray-600">
        <Clock className="w-4 h-4" />
        <span className="text-sm font-medium">Code expires in {formatTime(timeLeft)}</span>
      </div>

      {/* Verify Button */}
      <button
        onClick={handleVerify}
        disabled={isLoading || otp.some(d => !d)}
        className="w-full bg-green-500 hover:bg-green-600 disabled:bg-gray-300 disabled:cursor-not-allowed text-white font-bold py-3 px-6 rounded-lg transition-colors duration-200 mb-4"
      >
        {isLoading ? "Verifying..." : "Verify & Continue"}
      </button>

      {/* Resend Link */}
      <div className="text-center">
        <p className="text-gray-600 text-sm mb-2">Didn&apos;t receive the code?</p>
        <button
          onClick={onResend}
          disabled={timeLeft > 180 || isLoading}
          className="text-green-600 hover:text-green-700 font-semibold text-sm disabled:text-gray-400 disabled:cursor-not-allowed transition-colors"
        >
          Resend Code
        </button>
      </div>
    </div>
  )
}
