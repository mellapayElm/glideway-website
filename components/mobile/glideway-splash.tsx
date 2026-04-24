"use client"

import { useState } from "react"
import { ArrowRight, MapPin, Shield, Zap } from "lucide-react"
import { GlidewayLogo } from "@/components/glideway-logo"

export function GlideWaySplash() {
  const [showContent, setShowContent] = useState(false)

  return (
    <div className="w-full min-h-screen bg-gradient-to-br from-emerald-50 via-white to-emerald-50 flex flex-col items-center justify-center overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-emerald-200/20 rounded-full blur-3xl" />
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-emerald-200/20 rounded-full blur-3xl" />
      </div>

      {/* Content */}
      <div className="relative z-10 px-6 py-12 max-w-md w-full flex flex-col items-center text-center">
        {/* Logo Animation */}
        <div className={`mb-8 transition-all duration-1000 ${showContent ? "scale-100 opacity-100" : "scale-75 opacity-0"}`}>
          <GlidewayLogo variant="icon" size="lg" />
        </div>

        {/* Main Heading */}
        <div className={`transition-all duration-1000 delay-200 ${showContent ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0"}`}>
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-2 leading-tight">
            Welcome to <span className="text-emerald-500">GlideWay</span>
          </h1>
          <p className="text-2xl font-semibold text-emerald-600 mb-6">Your Ride. Your Way.</p>
        </div>

        {/* Tagline */}
        <div className={`transition-all duration-1000 delay-300 ${showContent ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0"}`}>
          <p className="text-lg text-gray-700 mb-8 leading-relaxed">
            Ride Smoothly. Arrive Safely.
          </p>
          <p className="text-sm text-gray-600 mb-8 italic">
            May every ride be safe, peaceful, and smooth.
          </p>
        </div>

        {/* Trust Statement */}
        <div className={`transition-all duration-1000 delay-400 ${showContent ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0"}`}>
          <p className="text-gray-700 mb-12 leading-relaxed">
            We are honored to serve you with excellence and trust. From your first tap to your final destination, we're here to serve you with excellence.
          </p>
        </div>

        {/* Features Grid */}
        <div className={`grid grid-cols-3 gap-4 mb-12 w-full transition-all duration-1000 delay-500 ${showContent ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0"}`}>
          <div className="flex flex-col items-center p-4 bg-white rounded-2xl shadow-md border border-emerald-100">
            <MapPin className="w-6 h-6 text-emerald-500 mb-2" />
            <span className="text-xs font-semibold text-gray-700">Real-time Tracking</span>
          </div>
          <div className="flex flex-col items-center p-4 bg-white rounded-2xl shadow-md border border-emerald-100">
            <Shield className="w-6 h-6 text-emerald-500 mb-2" />
            <span className="text-xs font-semibold text-gray-700">Your Safety</span>
          </div>
          <div className="flex flex-col items-center p-4 bg-white rounded-2xl shadow-md border border-emerald-100">
            <Zap className="w-6 h-6 text-emerald-500 mb-2" />
            <span className="text-xs font-semibold text-gray-700">Quick & Easy</span>
          </div>
        </div>

        {/* CTA Buttons */}
        <div className={`flex flex-col gap-4 w-full transition-all duration-1000 delay-600 ${showContent ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0"}`}>
          <button className="w-full bg-emerald-500 hover:bg-emerald-600 text-white font-bold py-4 px-6 rounded-2xl transition-all duration-300 transform hover:scale-105 shadow-lg flex items-center justify-center gap-2 group">
            Get Started
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </button>
          <button className="w-full bg-white hover:bg-gray-50 text-emerald-600 font-bold py-4 px-6 rounded-2xl transition-all duration-300 border-2 border-emerald-500 hover:shadow-md">
            I Already Have an Account
          </button>
        </div>

        {/* Trust Badges */}
        <div className={`mt-12 flex gap-6 justify-center transition-all duration-1000 delay-700 ${showContent ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0"}`}>
          <div className="text-center">
            <div className="text-2xl font-bold text-emerald-600">4.9★</div>
            <div className="text-xs text-gray-600">Rating</div>
          </div>
          <div className="h-12 w-px bg-gray-300" />
          <div className="text-center">
            <div className="text-2xl font-bold text-emerald-600">50K+</div>
            <div className="text-xs text-gray-600">Trusted Users</div>
          </div>
          <div className="h-12 w-px bg-gray-300" />
          <div className="text-center">
            <div className="text-2xl font-bold text-emerald-600">24/7</div>
            <div className="text-xs text-gray-600">Support</div>
          </div>
        </div>
      </div>

      {/* Trigger animation on mount */}
      <script suppressHydrationWarning>{`
        if (typeof window !== 'undefined') {
          setTimeout(() => {
            document.querySelector('[data-splash]')?.click();
          }, 100);
        }
      `}</script>
      <button 
        data-splash 
        onClick={() => setShowContent(true)} 
        className="hidden"
      />
    </div>
  )
}
