"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { 
  MapPin, Shield, Clock, Star, ChevronRight, Sparkles,
  Car, CreditCard, Navigation, Users, Heart, Zap
} from "lucide-react"
import { Button } from "@/components/ui/button"
import Link from "next/link"

export default function AppSplash() {
  const [currentSlide, setCurrentSlide] = useState(0)
  const [showSplash, setShowSplash] = useState(true)
  const [progress, setProgress] = useState(0)

  // Splash screen loading
  useEffect(() => {
    const timer = setInterval(() => {
      setProgress(p => {
        if (p >= 100) {
          clearInterval(timer)
          setTimeout(() => setShowSplash(false), 500)
          return 100
        }
        return p + 2
      })
    }, 40)
    return () => clearInterval(timer)
  }, [])

  // Auto-advance slides
  useEffect(() => {
    if (!showSplash) {
      const timer = setInterval(() => {
        setCurrentSlide(s => (s + 1) % slides.length)
      }, 5000)
      return () => clearInterval(timer)
    }
  }, [showSplash])

  const slides = [
    {
      icon: Car,
      title: "Ride Smoothly",
      subtitle: "Glide Easily",
      description: "Experience premium rides with real-time tracking, secure payments, and professional drivers.",
      gradient: "from-emerald-500 to-teal-600",
      bgGlow: "rgba(16, 185, 129, 0.15)",
    },
    {
      icon: Shield,
      title: "Elegant Mobility",
      subtitle: "Trusted Service",
      description: "Move with peace. Ride with purpose. Your safety is our highest priority.",
      gradient: "from-blue-500 to-indigo-600",
      bgGlow: "rgba(59, 130, 246, 0.15)",
    },
    {
      icon: Navigation,
      title: "Smooth Rides",
      subtitle: "Trusted Journeys",
      description: "Where every ride flows. Professional drivers ready to take you anywhere.",
      gradient: "from-violet-500 to-purple-600",
      bgGlow: "rgba(139, 92, 246, 0.15)",
    },
    {
      icon: Sparkles,
      title: "Premium Experience",
      subtitle: "Every Time",
      description: "Your journey starts with a single tap. Book in seconds, ride in comfort.",
      gradient: "from-amber-500 to-orange-600",
      bgGlow: "rgba(245, 158, 11, 0.15)",
    },
  ]

  const features = [
    { icon: MapPin, label: "Live GPS Tracking", color: "text-emerald-400" },
    { icon: Shield, label: "Secure Payments", color: "text-blue-400" },
    { icon: Clock, label: "24/7 Available", color: "text-violet-400" },
    { icon: Star, label: "Top-Rated Drivers", color: "text-amber-400" },
  ]

  return (
    <div className="min-h-screen bg-[#050505] overflow-hidden">
      <AnimatePresence mode="wait">
        {showSplash ? (
          // Splash Loading Screen
          <motion.div
            key="splash"
            initial={{ opacity: 1 }}
            exit={{ opacity: 0, scale: 1.1 }}
            transition={{ duration: 0.5 }}
            className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-[#050505]"
          >
            {/* Animated background */}
            <div className="absolute inset-0">
              <motion.div
                className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[600px] rounded-full blur-3xl"
                style={{ background: "rgba(16, 185, 129, 0.1)" }}
                animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.5, 0.3] }}
                transition={{ duration: 3, repeat: Infinity }}
              />
              <motion.div
                className="absolute bottom-1/4 left-1/3 w-[400px] h-[400px] rounded-full blur-3xl"
                style={{ background: "rgba(16, 185, 129, 0.05)" }}
                animate={{ scale: [1.1, 1, 1.1], opacity: [0.2, 0.4, 0.2] }}
                transition={{ duration: 4, repeat: Infinity }}
              />
            </div>

            {/* Logo */}
            <motion.div
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.5, type: "spring" }}
              className="relative z-10 mb-8"
            >
              <div className="w-28 h-28 rounded-3xl bg-gradient-to-br from-emerald-500 to-emerald-600 flex items-center justify-center shadow-2xl shadow-emerald-500/30">
                <span className="text-5xl font-black text-white">G</span>
              </div>
              <motion.div
                className="absolute inset-0 rounded-3xl"
                style={{ border: "2px solid rgba(16, 185, 129, 0.5)" }}
                animate={{ scale: [1, 1.2, 1], opacity: [1, 0, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
              />
            </motion.div>

            {/* Brand name */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="text-center mb-12"
            >
              <h1 className="text-4xl font-bold text-white mb-2">
                Glide<span className="text-emerald-400">Way</span>
              </h1>
              <p className="text-gray-500 text-sm">Where every ride flows</p>
            </motion.div>

            {/* Progress bar */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="w-48"
            >
              <div className="h-1 bg-gray-800 rounded-full overflow-hidden">
                <motion.div
                  className="h-full bg-gradient-to-r from-emerald-500 to-emerald-400 rounded-full"
                  style={{ width: `${progress}%` }}
                />
              </div>
              <p className="text-center text-xs text-gray-600 mt-2">Loading...</p>
            </motion.div>
          </motion.div>
        ) : (
          // Welcome Onboarding
          <motion.div
            key="onboarding"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="min-h-screen flex flex-col"
          >
            {/* Background glow based on current slide */}
            <motion.div
              key={currentSlide}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 pointer-events-none"
            >
              <div
                className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[600px] rounded-full blur-3xl"
                style={{ background: slides[currentSlide].bgGlow }}
              />
            </motion.div>

            {/* Top bar */}
            <div className="relative z-10 flex items-center justify-between p-4 pt-12">
              <div className="flex items-center gap-2">
                <div className="w-10 h-10 rounded-xl bg-emerald-500 flex items-center justify-center">
                  <span className="text-xl font-bold text-white">G</span>
                </div>
                <span className="text-lg font-bold text-white">GlideWay</span>
              </div>
              <Link href="/app/login">
                <Button variant="ghost" size="sm" className="text-gray-400 hover:text-white">
                  Skip
                </Button>
              </Link>
            </div>

            {/* Slide content */}
            <div className="relative z-10 flex-1 flex flex-col items-center justify-center px-6 pb-8">
              <AnimatePresence mode="wait">
                <motion.div
                  key={currentSlide}
                  initial={{ opacity: 0, x: 50 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -50 }}
                  transition={{ duration: 0.4 }}
                  className="text-center max-w-md"
                >
                  {/* Icon */}
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: "spring", delay: 0.1 }}
                    className={`w-24 h-24 rounded-3xl bg-gradient-to-br ${slides[currentSlide].gradient} flex items-center justify-center mx-auto mb-8 shadow-2xl`}
                  >
                    {(() => {
                      const Icon = slides[currentSlide].icon
                      return <Icon className="w-12 h-12 text-white" />
                    })()}
                  </motion.div>

                  {/* Title */}
                  <h2 className="text-4xl font-bold text-white mb-2">
                    {slides[currentSlide].title}
                  </h2>
                  <h3 className={`text-3xl font-bold bg-gradient-to-r ${slides[currentSlide].gradient} bg-clip-text text-transparent mb-6`}>
                    {slides[currentSlide].subtitle}
                  </h3>

                  {/* Description */}
                  <p className="text-gray-400 text-lg leading-relaxed mb-8">
                    {slides[currentSlide].description}
                  </p>

                  {/* Feature pills */}
                  <div className="flex flex-wrap justify-center gap-2 mb-8">
                    {features.map((feature, i) => (
                      <motion.div
                        key={feature.label}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 + i * 0.1 }}
                        className="flex items-center gap-2 px-3 py-2 rounded-full bg-white/5 border border-white/10"
                      >
                        <feature.icon className={`w-4 h-4 ${feature.color}`} />
                        <span className="text-xs text-gray-300">{feature.label}</span>
                      </motion.div>
                    ))}
                  </div>
                </motion.div>
              </AnimatePresence>

              {/* Slide indicators */}
              <div className="flex items-center gap-2 mb-8">
                {slides.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setCurrentSlide(i)}
                    className={`h-2 rounded-full transition-all duration-300 ${
                      i === currentSlide ? "w-8 bg-emerald-500" : "w-2 bg-gray-600 hover:bg-gray-500"
                    }`}
                  />
                ))}
              </div>

              {/* CTA Buttons */}
              <div className="w-full max-w-sm space-y-3">
                <Link href="/app/login" className="block">
                  <Button className="w-full h-14 text-lg font-semibold bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 shadow-lg shadow-emerald-500/25">
                    Get Started
                    <ChevronRight className="w-5 h-5 ml-2" />
                  </Button>
                </Link>
                <Link href="/app/login" className="block">
                  <Button variant="outline" className="w-full h-12 border-gray-700 text-gray-300 hover:bg-white/5">
                    I already have an account
                  </Button>
                </Link>
              </div>
            </div>

            {/* Bottom taglines */}
            <div className="relative z-10 pb-8 px-6">
              <div className="flex flex-wrap justify-center gap-4 text-xs text-gray-500">
                <span className="flex items-center gap-1">
                  <Heart className="w-3 h-3 text-red-400" />
                  Move with peace
                </span>
                <span className="flex items-center gap-1">
                  <Zap className="w-3 h-3 text-amber-400" />
                  Ride with purpose
                </span>
                <span className="flex items-center gap-1">
                  <Shield className="w-3 h-3 text-emerald-400" />
                  Trusted journeys
                </span>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
