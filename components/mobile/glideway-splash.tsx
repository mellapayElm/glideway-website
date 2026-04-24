"use client"

import { useState, useEffect } from "react"
import { ArrowRight, MapPin, Shield, Zap } from "lucide-react"
import { GlidewayLogo } from "@/components/glideway-logo"

interface GlideWaySplashProps {
  onGetStarted?: () => void
  onLogin?: () => void
}

export function GlideWaySplash({ onGetStarted, onLogin }: GlideWaySplashProps) {
  const [showContent, setShowContent] = useState(false)

  // Trigger animation on mount
  useEffect(() => {
    const timer = setTimeout(() => {
      setShowContent(true)
    }, 100)
    return () => clearTimeout(timer)
  }, [])

  return (
    <div className="w-full min-h-screen bg-gradient-to-br from-gray-950 via-gray-900 to-gray-950 flex flex-col items-center justify-center overflow-hidden relative">
      {/* Background gradient elements - dark theme with lime accents */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-lime-500/10 rounded-full blur-3xl" />
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-lime-500/5 rounded-full blur-3xl" />
      </div>

      {/* Content */}
      <div className="relative z-10 px-6 py-12 max-w-md w-full flex flex-col items-center text-center h-screen overflow-y-auto flex-shrink-0">
        {/* Top spacing */}
        <div className="h-8" />

        {/* Logo Animation */}
        <div className={`mb-12 transition-all duration-1000 ${showContent ? "scale-100 opacity-100" : "scale-75 opacity-0"}`}>
          <GlidewayLogo variant="icon" size="lg" className="w-24 h-24" />
        </div>

        {/* Main Heading */}
        <div className={`transition-all duration-1000 delay-200 ${showContent ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0"}`}>
          <h1 className="text-4xl font-bold text-white mb-2 leading-tight">
            Welcome to <span className="text-lime-400">GlideWay</span>
          </h1>
          <p className="text-xl font-semibold text-lime-400 mb-8">Your Ride. Your Way.</p>
        </div>

        {/* Tagline */}
        <div className={`transition-all duration-1000 delay-300 ${showContent ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0"}`}>
          <p className="text-lg text-gray-200 mb-6 font-medium leading-relaxed">
            Ride Smoothly. Arrive Safely.
          </p>
          <p className="text-sm text-gray-400 mb-8 italic">
            May every ride be safe, peaceful, and smooth.
          </p>
        </div>

        {/* Trust Statement */}
        <div className={`transition-all duration-1000 delay-400 ${showContent ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0"}`}>
          <p className="text-gray-300 mb-12 leading-relaxed text-sm">
            We are honored to serve you with excellence and trust. From your first tap to your final destination, we&apos;re here to serve you with excellence.
          </p>
        </div>

        {/* Features Grid */}
        <div className={`grid grid-cols-3 gap-3 mb-12 w-full transition-all duration-1000 delay-500 ${showContent ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0"}`}>
          <div className="flex flex-col items-center p-3 bg-gray-800/50 rounded-xl border border-gray-700 hover:border-lime-500/30 transition-colors">
            <MapPin className="w-5 h-5 text-lime-400 mb-2" />
            <span className="text-xs font-semibold text-gray-300">Real-time Tracking</span>
          </div>
          <div className="flex flex-col items-center p-3 bg-gray-800/50 rounded-xl border border-gray-700 hover:border-lime-500/30 transition-colors">
            <Shield className="w-5 h-5 text-lime-400 mb-2" />
            <span className="text-xs font-semibold text-gray-300">Your Safety</span>
          </div>
          <div className="flex flex-col items-center p-3 bg-gray-800/50 rounded-xl border border-gray-700 hover:border-lime-500/30 transition-colors">
            <Zap className="w-5 h-5 text-lime-400 mb-2" />
            <span className="text-xs font-semibold text-gray-300">Quick & Easy</span>
          </div>
        </div>

        {/* CTA Buttons */}
        <div className={`flex flex-col gap-3 w-full transition-all duration-1000 delay-600 ${showContent ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0"}`}>
          <button 
            onClick={onGetStarted}
            className="w-full bg-lime-400 hover:bg-lime-500 text-gray-950 font-bold py-4 px-6 rounded-xl transition-all duration-300 transform hover:scale-105 shadow-lg flex items-center justify-center gap-2 group"
          >
            Get Started
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </button>
          <button 
            onClick={onLogin}
            className="w-full bg-gray-800 hover:bg-gray-700 text-white font-bold py-4 px-6 rounded-xl transition-all duration-300 border border-gray-600 hover:border-lime-400/50"
          >
            I Already Have an Account
          </button>
        </div>

        {/* Trust Badges */}
        <div className={`mt-10 flex gap-6 justify-center transition-all duration-1000 delay-700 ${showContent ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0"}`}>
          <div className="text-center">
            <div className="text-xl font-bold text-lime-400">4.9★</div>
            <div className="text-xs text-gray-400">Rating</div>
          </div>
          <div className="h-10 w-px bg-gray-700" />
          <div className="text-center">
            <div className="text-xl font-bold text-lime-400">50K+</div>
            <div className="text-xs text-gray-400">Users</div>
          </div>
          <div className="h-10 w-px bg-gray-700" />
          <div className="text-center">
            <div className="text-xl font-bold text-lime-400">24/7</div>
            <div className="text-xs text-gray-400">Support</div>
          </div>
        </div>

        <div className="h-8" />
      </div>
    </div>
  )
}
