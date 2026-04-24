"use client"

import { useState } from "react"
import { ChevronLeft, ChevronDown, Mail, Search, X, Truck } from "lucide-react"
import { GlidewayLogo } from "@/components/glideway-logo"

// Country data with flags and dial codes
const COUNTRIES = [
  { code: "US", name: "United States", dial: "+1", flag: "🇺🇸" },
  { code: "CA", name: "Canada", dial: "+1", flag: "🇨🇦" },
  { code: "GB", name: "United Kingdom", dial: "+44", flag: "🇬🇧" },
  { code: "AU", name: "Australia", dial: "+61", flag: "🇦🇺" },
  { code: "DE", name: "Germany", dial: "+49", flag: "🇩🇪" },
  { code: "FR", name: "France", dial: "+33", flag: "🇫🇷" },
  { code: "ES", name: "Spain", dial: "+34", flag: "🇪🇸" },
  { code: "IT", name: "Italy", dial: "+39", flag: "🇮🇹" },
  { code: "MX", name: "Mexico", dial: "+52", flag: "🇲🇽" },
  { code: "BR", name: "Brazil", dial: "+55", flag: "🇧🇷" },
  { code: "AR", name: "Argentina", dial: "+54", flag: "🇦🇷" },
  { code: "CO", name: "Colombia", dial: "+57", flag: "🇨🇴" },
  { code: "PE", name: "Peru", dial: "+51", flag: "🇵🇪" },
  { code: "CL", name: "Chile", dial: "+56", flag: "🇨🇱" },
  { code: "IN", name: "India", dial: "+91", flag: "🇮🇳" },
  { code: "CN", name: "China", dial: "+86", flag: "🇨🇳" },
  { code: "JP", name: "Japan", dial: "+81", flag: "🇯🇵" },
  { code: "KR", name: "South Korea", dial: "+82", flag: "🇰🇷" },
  { code: "PH", name: "Philippines", dial: "+63", flag: "🇵🇭" },
  { code: "VN", name: "Vietnam", dial: "+84", flag: "🇻🇳" },
  { code: "TH", name: "Thailand", dial: "+66", flag: "🇹🇭" },
  { code: "ID", name: "Indonesia", dial: "+62", flag: "🇮🇩" },
  { code: "MY", name: "Malaysia", dial: "+60", flag: "🇲🇾" },
  { code: "SG", name: "Singapore", dial: "+65", flag: "🇸🇬" },
  { code: "AE", name: "UAE", dial: "+971", flag: "🇦🇪" },
  { code: "SA", name: "Saudi Arabia", dial: "+966", flag: "🇸🇦" },
  { code: "EG", name: "Egypt", dial: "+20", flag: "🇪🇬" },
  { code: "NG", name: "Nigeria", dial: "+234", flag: "🇳🇬" },
  { code: "ZA", name: "South Africa", dial: "+27", flag: "🇿🇦" },
  { code: "KE", name: "Kenya", dial: "+254", flag: "🇰🇪" },
  { code: "GH", name: "Ghana", dial: "+233", flag: "🇬🇭" },
  { code: "NL", name: "Netherlands", dial: "+31", flag: "🇳🇱" },
  { code: "BE", name: "Belgium", dial: "+32", flag: "🇧🇪" },
  { code: "SE", name: "Sweden", dial: "+46", flag: "🇸🇪" },
  { code: "NO", name: "Norway", dial: "+47", flag: "🇳🇴" },
  { code: "DK", name: "Denmark", dial: "+45", flag: "🇩🇰" },
  { code: "FI", name: "Finland", dial: "+358", flag: "🇫🇮" },
  { code: "PL", name: "Poland", dial: "+48", flag: "🇵🇱" },
  { code: "CZ", name: "Czech Republic", dial: "+420", flag: "🇨🇿" },
  { code: "AT", name: "Austria", dial: "+43", flag: "🇦🇹" },
  { code: "CH", name: "Switzerland", dial: "+41", flag: "🇨🇭" },
  { code: "PT", name: "Portugal", dial: "+351", flag: "🇵🇹" },
  { code: "IE", name: "Ireland", dial: "+353", flag: "🇮🇪" },
  { code: "NZ", name: "New Zealand", dial: "+64", flag: "🇳🇿" },
  { code: "RU", name: "Russia", dial: "+7", flag: "🇷🇺" },
  { code: "TR", name: "Turkey", dial: "+90", flag: "🇹🇷" },
  { code: "IL", name: "Israel", dial: "+972", flag: "🇮🇱" },
  { code: "PK", name: "Pakistan", dial: "+92", flag: "🇵🇰" },
  { code: "BD", name: "Bangladesh", dial: "+880", flag: "🇧🇩" },
]

interface PhoneLoginScreenProps {
  onBack?: () => void
  onContinue?: (phone: string) => void
  onBecomeDriver?: () => void
}

export function PhoneLoginScreen({ onBack, onContinue, onBecomeDriver }: PhoneLoginScreenProps) {
  const [phone, setPhone] = useState("")
  const [loginMethod, setLoginMethod] = useState<"phone" | "email" | "find" | null>(null)
  const [email, setEmail] = useState("")
  const [selectedCountry, setSelectedCountry] = useState(COUNTRIES[0])
  const [showCountryPicker, setShowCountryPicker] = useState(false)
  const [countrySearch, setCountrySearch] = useState("")
  const [isGoogleLoading, setIsGoogleLoading] = useState(false)
  const [findAccountQuery, setFindAccountQuery] = useState("")

  const formatPhoneNumber = (value: string, dialCode: string) => {
    const digits = value.replace(/\D/g, "")
    // US/Canada format
    if (dialCode === "+1") {
      if (digits.length <= 3) return digits
      if (digits.length <= 6) return `(${digits.slice(0, 3)}) ${digits.slice(3)}`
      return `(${digits.slice(0, 3)}) ${digits.slice(3, 6)}-${digits.slice(6, 10)}`
    }
    // Generic international format
    return digits
  }

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatPhoneNumber(e.target.value, selectedCountry.dial)
    setPhone(formatted)
  }

  const handlePhoneSubmit = () => {
    const digits = phone.replace(/\D/g, "")
    if (digits.length >= 7) {
      onContinue?.(`${selectedCountry.dial}${digits}`)
    }
  }

  const handleEmailSubmit = () => {
    if (email.includes("@")) {
      onContinue?.(email)
    }
  }

  const handleGoogleSignIn = () => {
    setIsGoogleLoading(true)
    // Simulate Google OAuth
    setTimeout(() => {
      setIsGoogleLoading(false)
      onContinue?.("google-user@gmail.com")
    }, 1500)
  }

  const handleFindAccount = () => {
    if (findAccountQuery.length > 0) {
      // Simulate account lookup
      alert(`Looking up account for: ${findAccountQuery}`)
    }
  }

  const filteredCountries = COUNTRIES.filter(c => 
    c.name.toLowerCase().includes(countrySearch.toLowerCase()) ||
    c.code.toLowerCase().includes(countrySearch.toLowerCase()) ||
    c.dial.includes(countrySearch)
  )

  // Country Picker Modal
  if (showCountryPicker) {
    return (
      <div className="w-full min-h-screen bg-gray-950 flex flex-col">
        {/* Header */}
        <div className="bg-gray-900 border-b border-gray-800 px-4 py-4 flex items-center gap-3">
          <button 
            onClick={() => setShowCountryPicker(false)}
            className="w-10 h-10 flex items-center justify-center hover:bg-gray-800 rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-white" />
          </button>
          <h2 className="text-lg font-semibold text-white">Select Country</h2>
        </div>

        {/* Search */}
        <div className="p-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
            <input
              type="text"
              value={countrySearch}
              onChange={(e) => setCountrySearch(e.target.value)}
              placeholder="Search countries..."
              className="w-full bg-gray-800 border border-gray-700 rounded-lg pl-10 pr-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-lime-400"
            />
          </div>
        </div>

        {/* Country List */}
        <div className="flex-1 overflow-y-auto">
          {filteredCountries.map((country) => (
            <button
              key={country.code}
              onClick={() => {
                setSelectedCountry(country)
                setShowCountryPicker(false)
                setCountrySearch("")
              }}
              className={`w-full flex items-center gap-4 px-4 py-3 hover:bg-gray-800 transition-colors border-b border-gray-800 ${
                selectedCountry.code === country.code ? "bg-lime-400/10" : ""
              }`}
            >
              <span className="text-2xl">{country.flag}</span>
              <div className="flex-1 text-left">
                <p className="text-white font-medium">{country.name}</p>
                <p className="text-gray-500 text-sm">{country.dial}</p>
              </div>
              {selectedCountry.code === country.code && (
                <div className="w-5 h-5 bg-lime-400 rounded-full flex items-center justify-center">
                  <svg className="w-3 h-3 text-gray-950" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/>
                  </svg>
                </div>
              )}
            </button>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="w-full min-h-screen bg-gradient-to-br from-gray-950 via-gray-900 to-gray-950 flex flex-col">
      {/* Status Bar */}
      <div className="bg-gray-900 text-white px-4 py-2 flex items-center justify-between text-xs font-medium border-b border-gray-800">
        <span>9:41</span>
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
      <div className="flex-1 overflow-y-auto px-6 py-6">
        {/* Back Button */}
        {loginMethod && (
          <button
            onClick={() => setLoginMethod(null)}
            className="flex items-center gap-2 text-lime-400 hover:text-lime-300 mb-4 transition-colors"
          >
            <ChevronLeft className="w-5 h-5" />
            <span className="text-sm font-medium">Back</span>
          </button>
        )}

        {!loginMethod ? (
          <>
            {/* Logo */}
            <div className="flex justify-center mb-6">
              <div className="w-24">
                <GlidewayLogo variant="icon" size="lg" />
              </div>
            </div>

            {/* Header */}
            <div className="mb-6 text-center">
              <h1 className="text-2xl font-bold text-white mb-2">Welcome to GlideWay</h1>
              <p className="text-gray-400 text-sm">Sign in to continue</p>
            </div>

            {/* Phone Option */}
            <button
              onClick={() => setLoginMethod("phone")}
              className="w-full bg-gray-800 hover:bg-gray-700 border border-gray-700 hover:border-lime-400/50 rounded-lg p-4 mb-3 transition-all text-left group"
            >
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-lime-400/20 rounded-full flex items-center justify-center group-hover:bg-lime-400/30 transition-colors">
                  <svg className="w-6 h-6 text-lime-400" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M6.62 10.79c1.44 2.83 3.76 5.14 6.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1-9.39 0-17-7.61-17-17 0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.11.35.03.74-.25 1.02l-2.2 2.2z"/>
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
            <div className="flex items-center gap-4 my-5">
              <div className="flex-1 h-px bg-gray-700" />
              <span className="text-gray-500 text-sm">or</span>
              <div className="flex-1 h-px bg-gray-700" />
            </div>

            {/* Google Sign In */}
            <button 
              onClick={handleGoogleSignIn}
              disabled={isGoogleLoading}
              className="w-full bg-white hover:bg-gray-100 disabled:bg-gray-200 text-gray-900 font-semibold py-4 px-6 rounded-lg transition-colors mb-3 flex items-center justify-center gap-2"
            >
              {isGoogleLoading ? (
                <div className="w-5 h-5 border-2 border-gray-400 border-t-gray-900 rounded-full animate-spin" />
              ) : (
                <svg className="w-5 h-5" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                </svg>
              )}
              {isGoogleLoading ? "Signing in..." : "Continue with Google"}
            </button>

            {/* Find Account */}
            <button 
              onClick={() => setLoginMethod("find")}
              className="w-full border-2 border-lime-400 text-lime-400 hover:bg-lime-400/10 font-medium py-3.5 px-6 rounded-lg transition-colors flex items-center justify-center gap-2"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M15.5 1h-8C6.12 1 5 2.12 5 3.5v17C5 21.88 6.12 23 7.5 23h8c1.38 0 2.5-1.12 2.5-2.5v-17C18 2.12 16.88 1 15.5 1zm-4 21c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5zm4.5-4H7V4h9v14z"/>
              </svg>
              Find my account
            </button>

            {/* Become a Driver */}
            <div className="mt-6 pt-6 border-t border-gray-800">
              <button
                onClick={onBecomeDriver}
                className="w-full bg-gray-800/50 hover:bg-gray-800 border border-gray-700 hover:border-lime-400/30 rounded-lg p-4 transition-all text-left group"
              >
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-lime-400/10 rounded-full flex items-center justify-center group-hover:bg-lime-400/20 transition-colors">
                    <Truck className="w-6 h-6 text-lime-400" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-white font-semibold">Become a Driver</h3>
                    <p className="text-gray-400 text-sm">Earn money on your schedule</p>
                  </div>
                  <ChevronDown className="w-5 h-5 text-gray-400 -rotate-90" />
                </div>
              </button>
            </div>

            {/* Legal Text */}
            <div className="mt-6">
              <p className="text-xs text-gray-500 leading-relaxed text-center">
                By continuing, you agree to our{" "}
                <a href="/terms" className="text-lime-400 hover:underline">Terms of Service</a>
                {" "}and{" "}
                <a href="/privacy" className="text-lime-400 hover:underline">Privacy Policy</a>
              </p>
            </div>
          </>
        ) : loginMethod === "phone" ? (
          <>
            {/* Phone Login Form */}
            <div className="mb-6">
              <h1 className="text-2xl font-bold text-white mb-2">Enter your mobile number</h1>
              <p className="text-gray-400 text-sm">We&apos;ll send you a verification code</p>
            </div>

            {/* Phone Input */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-300 mb-3">Mobile Number</label>
              <div className="flex gap-3">
                {/* Country Selector */}
                <button 
                  onClick={() => setShowCountryPicker(true)}
                  className="flex items-center gap-2 bg-gray-800 border border-gray-700 rounded-lg px-3 py-4 hover:border-lime-400/50 transition-colors min-w-[90px]"
                >
                  <span className="text-2xl">{selectedCountry.flag}</span>
                  <ChevronDown className="w-4 h-4 text-gray-400" />
                </button>

                {/* Phone Input */}
                <input
                  type="tel"
                  value={phone}
                  onChange={handlePhoneChange}
                  placeholder={selectedCountry.dial === "+1" ? "(201) 555-0123" : "Enter number"}
                  className="flex-1 bg-gray-800 border border-gray-700 rounded-lg px-4 py-4 text-white placeholder-gray-500 focus:outline-none focus:border-lime-400 transition-colors"
                />
              </div>
              <p className="text-xs text-gray-500 mt-2">{selectedCountry.dial} will be added automatically</p>
            </div>

            {/* Continue Button */}
            <button
              onClick={handlePhoneSubmit}
              disabled={phone.replace(/\D/g, "").length < 7}
              className="w-full bg-lime-400 hover:bg-lime-500 disabled:bg-gray-700 disabled:cursor-not-allowed text-gray-950 font-bold py-4 px-6 rounded-lg transition-all duration-300 mb-4"
            >
              Continue
            </button>

            {/* Divider */}
            <div className="flex items-center gap-4 my-5">
              <div className="flex-1 h-px bg-gray-700" />
              <span className="text-gray-500 text-sm">or</span>
              <div className="flex-1 h-px bg-gray-700" />
            </div>

            {/* Google Option */}
            <button 
              onClick={handleGoogleSignIn}
              disabled={isGoogleLoading}
              className="w-full bg-white hover:bg-gray-100 text-gray-900 font-semibold py-4 px-6 rounded-lg transition-colors mb-3 flex items-center justify-center gap-2"
            >
              {isGoogleLoading ? (
                <div className="w-5 h-5 border-2 border-gray-400 border-t-gray-900 rounded-full animate-spin" />
              ) : (
                <svg className="w-5 h-5" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                </svg>
              )}
              {isGoogleLoading ? "Signing in..." : "Continue with Google"}
            </button>

            {/* Find Account */}
            <button 
              onClick={() => setLoginMethod("find")}
              className="w-full border-2 border-lime-400 text-lime-400 hover:bg-lime-400/10 font-medium py-3.5 px-6 rounded-lg transition-colors flex items-center justify-center gap-2"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M15.5 1h-8C6.12 1 5 2.12 5 3.5v17C5 21.88 6.12 23 7.5 23h8c1.38 0 2.5-1.12 2.5-2.5v-17C18 2.12 16.88 1 15.5 1zm-4 21c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5zm4.5-4H7V4h9v14z"/>
              </svg>
              Find my account
            </button>
          </>
        ) : loginMethod === "email" ? (
          <>
            {/* Email Login Form */}
            <div className="mb-6">
              <h1 className="text-2xl font-bold text-white mb-2">Enter your email</h1>
              <p className="text-gray-400 text-sm">We&apos;ll send you a sign-in link</p>
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
            <div className="flex items-center gap-4 my-5">
              <div className="flex-1 h-px bg-gray-700" />
              <span className="text-gray-500 text-sm">or</span>
              <div className="flex-1 h-px bg-gray-700" />
            </div>

            {/* Google Option */}
            <button 
              onClick={handleGoogleSignIn}
              disabled={isGoogleLoading}
              className="w-full bg-white hover:bg-gray-100 text-gray-900 font-semibold py-4 px-6 rounded-lg transition-colors mb-3 flex items-center justify-center gap-2"
            >
              {isGoogleLoading ? (
                <div className="w-5 h-5 border-2 border-gray-400 border-t-gray-900 rounded-full animate-spin" />
              ) : (
                <svg className="w-5 h-5" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                </svg>
              )}
              {isGoogleLoading ? "Signing in..." : "Continue with Google"}
            </button>
          </>
        ) : (
          <>
            {/* Find Account Form */}
            <div className="mb-6">
              <h1 className="text-2xl font-bold text-white mb-2">Find your account</h1>
              <p className="text-gray-400 text-sm">Enter your phone number or email</p>
            </div>

            {/* Search Input */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-300 mb-3">Phone or Email</label>
              <div className="relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                <input
                  type="text"
                  value={findAccountQuery}
                  onChange={(e) => setFindAccountQuery(e.target.value)}
                  placeholder="Enter phone or email"
                  className="w-full bg-gray-800 border border-gray-700 rounded-lg pl-12 pr-4 py-4 text-white placeholder-gray-500 focus:outline-none focus:border-lime-400 transition-colors"
                />
              </div>
            </div>

            {/* Search Button */}
            <button
              onClick={handleFindAccount}
              disabled={findAccountQuery.length === 0}
              className="w-full bg-lime-400 hover:bg-lime-500 disabled:bg-gray-700 disabled:cursor-not-allowed text-gray-950 font-bold py-4 px-6 rounded-lg transition-all duration-300"
            >
              Search
            </button>
          </>
        )}
      </div>
    </div>
  )
}
