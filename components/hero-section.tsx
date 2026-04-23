"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { 
  MapPin, Clock, Shield, ChevronRight, Star, Users, 
  Sparkles, Car, CreditCard, Navigation, Heart, Zap,
  CheckCircle2, Globe, Phone
} from "lucide-react"
import { Button } from "@/components/ui/button"
import Link from "next/link"

export function HeroSection() {
  const [currentTagline, setCurrentTagline] = useState(0)

  const taglines = [
    { text: "Elegant mobility. Trusted service.", highlight: "Premium experience." },
    { text: "Move with peace.", highlight: "Ride with purpose." },
    { text: "Smooth rides.", highlight: "Trusted journeys." },
    { text: "Where every ride", highlight: "flows." },
  ]

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTagline(t => (t + 1) % taglines.length)
    }, 4000)
    return () => clearInterval(timer)
  }, [])

  const stats = [
    { icon: Users, value: "50K+", label: "Active Riders", color: "text-emerald-400" },
    { icon: Star, value: "4.9", label: "App Rating", color: "text-amber-400" },
    { icon: Globe, value: "100+", label: "Cities", color: "text-blue-400" },
    { icon: Clock, value: "24/7", label: "Support", color: "text-violet-400" },
  ]

  const trustBadges = [
    { icon: Shield, label: "Secure Payments" },
    { icon: MapPin, label: "Live GPS Tracking" },
    { icon: Clock, label: "Always On Time" },
  ]

  return (
    <section
      id="home"
      className="relative min-h-screen flex items-center justify-center overflow-hidden pt-16"
    >
      {/* Animated gradient background */}
      <div className="absolute inset-0 bg-[#030303]">
        <motion.div
          className="absolute inset-0"
          style={{
            background: "radial-gradient(ellipse 100% 80% at 50% 20%, rgba(16, 185, 129, 0.08) 0%, transparent 60%)",
          }}
          animate={{ opacity: [0.5, 0.8, 0.5] }}
          transition={{ duration: 8, repeat: Infinity }}
        />
        <motion.div
          className="absolute inset-0"
          style={{
            background: "radial-gradient(ellipse 60% 50% at 20% 80%, rgba(59, 130, 246, 0.05) 0%, transparent 50%)",
          }}
          animate={{ opacity: [0.3, 0.6, 0.3] }}
          transition={{ duration: 10, repeat: Infinity }}
        />
        <motion.div
          className="absolute inset-0"
          style={{
            background: "radial-gradient(ellipse 60% 50% at 80% 60%, rgba(139, 92, 246, 0.04) 0%, transparent 50%)",
          }}
          animate={{ opacity: [0.4, 0.7, 0.4] }}
          transition={{ duration: 12, repeat: Infinity }}
        />
      </div>

      {/* Subtle grid pattern */}
      <div
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: `linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px),
                           linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)`,
          backgroundSize: "80px 80px",
        }}
      />

      {/* Floating particles */}
      {[...Array(20)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-1 h-1 rounded-full bg-emerald-400/30"
          style={{
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
          }}
          animate={{
            y: [0, -30, 0],
            opacity: [0.2, 0.5, 0.2],
          }}
          transition={{
            duration: 3 + Math.random() * 2,
            repeat: Infinity,
            delay: Math.random() * 2,
          }}
        />
      ))}

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center">
          {/* Premium badge */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-3 px-5 py-2.5 rounded-full mb-8 backdrop-blur-sm"
            style={{ 
              background: "linear-gradient(135deg, rgba(16, 185, 129, 0.15) 0%, rgba(16, 185, 129, 0.05) 100%)",
              border: "1px solid rgba(16, 185, 129, 0.3)" 
            }}
          >
            <span className="relative flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500" />
            </span>
            <span className="text-sm font-semibold text-emerald-400">Premium Ride Service</span>
            <Sparkles className="w-4 h-4 text-emerald-400" />
          </motion.div>

          {/* Main Heading with gradient */}
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-black mb-4 tracking-tight"
          >
            <span className="block text-white">Ride Smoothly,</span>
            <span className="block bg-gradient-to-r from-emerald-400 via-emerald-500 to-teal-500 bg-clip-text text-transparent">
              Glide Easily
            </span>
          </motion.h1>

          {/* Main subtitle */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-lg sm:text-xl max-w-2xl mx-auto mb-6 text-gray-400 text-pretty"
          >
            Experience premium rides with real-time tracking, secure payments, and
            professional drivers. Your journey starts with a single tap.
          </motion.p>

          {/* Rotating taglines */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="h-8 mb-10 flex items-center justify-center"
          >
            <AnimatePresence mode="wait">
              <motion.p
                key={currentTagline}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.3 }}
                className="text-sm sm:text-base font-medium"
              >
                <span className="text-gray-500">{taglines[currentTagline].text}</span>{" "}
                <span className="text-emerald-400">{taglines[currentTagline].highlight}</span>
              </motion.p>
            </AnimatePresence>
          </motion.div>

          {/* CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16"
          >
            <Link href="/app/login">
              <Button
                size="lg"
                className="group h-14 px-8 text-lg font-semibold bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 shadow-xl shadow-emerald-500/25 border-0"
              >
                <Car className="w-5 h-5 mr-2" />
                Book a Ride
                <ChevronRight className="w-5 h-5 ml-1 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
            <Link href="/driver/register">
              <Button
                size="lg"
                variant="outline"
                className="h-14 px-8 text-lg font-semibold border-2 border-gray-700 text-white hover:bg-white/5 hover:border-gray-600"
              >
                <Users className="w-5 h-5 mr-2" />
                Become a Driver
              </Button>
            </Link>
          </motion.div>

          {/* Stats cards */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="grid grid-cols-2 sm:grid-cols-4 gap-4 max-w-3xl mx-auto mb-12"
          >
            {stats.map((stat, i) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.5 + i * 0.1 }}
                whileHover={{ scale: 1.05, y: -4 }}
                className="relative p-5 rounded-2xl backdrop-blur-sm cursor-pointer group"
                style={{
                  background: "linear-gradient(135deg, rgba(255,255,255,0.05) 0%, rgba(255,255,255,0.02) 100%)",
                  border: "1px solid rgba(255,255,255,0.08)",
                }}
              >
                <motion.div
                  className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity"
                  style={{
                    background: "linear-gradient(135deg, rgba(16, 185, 129, 0.1) 0%, transparent 100%)",
                  }}
                />
                <stat.icon className={`w-6 h-6 ${stat.color} mx-auto mb-2`} />
                <p className="text-2xl font-bold text-white">{stat.value}</p>
                <p className="text-xs text-gray-500">{stat.label}</p>
              </motion.div>
            ))}
          </motion.div>

          {/* Trust badges */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.7 }}
            className="flex flex-wrap items-center justify-center gap-6"
          >
            {trustBadges.map((badge, i) => (
              <motion.div
                key={badge.label}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.8 + i * 0.1 }}
                className="flex items-center gap-2 text-gray-500"
              >
                <badge.icon className="w-4 h-4 text-emerald-500" />
                <span className="text-sm">{badge.label}</span>
              </motion.div>
            ))}
          </motion.div>

          {/* Bottom tagline bar */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1 }}
            className="mt-16 pt-8 border-t border-white/5"
          >
            <div className="flex flex-wrap items-center justify-center gap-6 text-sm">
              <span className="flex items-center gap-2 text-gray-600">
                <Heart className="w-4 h-4 text-red-400" />
                <span>Move with peace</span>
              </span>
              <span className="text-gray-700">|</span>
              <span className="flex items-center gap-2 text-gray-600">
                <Zap className="w-4 h-4 text-amber-400" />
                <span>Ride with purpose</span>
              </span>
              <span className="text-gray-700">|</span>
              <span className="flex items-center gap-2 text-gray-600">
                <Shield className="w-4 h-4 text-emerald-400" />
                <span>Trusted journeys</span>
              </span>
              <span className="text-gray-700">|</span>
              <span className="flex items-center gap-2 text-gray-600">
                <Navigation className="w-4 h-4 text-blue-400" />
                <span>Where every ride flows</span>
              </span>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        className="absolute bottom-8 left-1/2 -translate-x-1/2"
        animate={{ y: [0, 8, 0] }}
        transition={{ duration: 2, repeat: Infinity }}
      >
        <div className="w-6 h-10 rounded-full border-2 border-white/20 flex items-start justify-center pt-2">
          <motion.div
            className="w-1.5 h-1.5 rounded-full bg-emerald-400"
            animate={{ y: [0, 12, 0], opacity: [1, 0.5, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
          />
        </div>
      </motion.div>
    </section>
  )
}
