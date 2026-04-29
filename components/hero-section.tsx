"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import {
  MapPin, Clock, Shield, ChevronRight, Star, Users,
  Sparkles, Car, Navigation, Heart, Zap, Globe,
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
      setCurrentTagline((t) => (t + 1) % taglines.length)
    }, 4000)
    return () => clearInterval(timer)
  }, [])

  const stats = [
    { icon: Users, value: "50K+", label: "Active Riders", color: "text-emerald-600" },
    { icon: Star, value: "4.9", label: "App Rating", color: "text-amber-500" },
    { icon: Globe, value: "100+", label: "Cities", color: "text-blue-500" },
    { icon: Clock, value: "24/7", label: "Support", color: "text-violet-500" },
  ]

  const trustBadges = [
    { icon: Shield, label: "Secure Payments" },
    { icon: MapPin, label: "Live GPS Tracking" },
    { icon: Clock, label: "Always On Time" },
  ]

  return (
    <section
      id="home"
      className="relative min-h-screen flex items-center justify-center overflow-hidden pt-16 bg-white"
    >
      {/* Soft green radial glow top-center */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse 80% 55% at 50% -5%, rgba(34,197,94,0.12) 0%, transparent 70%)",
        }}
      />
      {/* Subtle green tint bottom-left */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse 50% 40% at 0% 100%, rgba(34,197,94,0.07) 0%, transparent 60%)",
        }}
      />

      {/* Subtle dot grid */}
      <div
        className="absolute inset-0 opacity-[0.04] pointer-events-none"
        style={{
          backgroundImage: "radial-gradient(circle, #22c55e 1px, transparent 1px)",
          backgroundSize: "40px 40px",
        }}
      />

      {/* Floating accent dots */}
      {[...Array(16)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-1.5 h-1.5 rounded-full bg-emerald-400/25"
          style={{
            left: `${(i * 6.25) % 100}%`,
            top: `${(i * 13 + 10) % 90}%`,
          }}
          animate={{ y: [0, -20, 0], opacity: [0.2, 0.5, 0.2] }}
          transition={{ duration: 3 + (i % 3), repeat: Infinity, delay: i * 0.2 }}
        />
      ))}

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center">

          {/* Premium badge */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-3 px-5 py-2.5 rounded-full mb-8 bg-emerald-50 border border-emerald-200"
          >
            <span className="relative flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500" />
            </span>
            <span className="text-sm font-semibold text-emerald-700">Premium Ride Service</span>
            <Sparkles className="w-4 h-4 text-emerald-500" />
          </motion.div>

          {/* Main heading */}
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-black mb-4 tracking-tight text-balance"
          >
            <span className="block text-gray-900">Ride Smoothly,</span>
            <span className="block text-emerald-500">
              Glide Easily
            </span>
          </motion.h1>

          {/* Subtitle */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-lg sm:text-xl max-w-2xl mx-auto mb-6 text-gray-500 text-pretty leading-relaxed"
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
                <span className="text-gray-400">{taglines[currentTagline].text}</span>{" "}
                <span className="text-emerald-500 font-semibold">{taglines[currentTagline].highlight}</span>
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
                className="group h-14 px-8 text-lg font-semibold bg-emerald-500 hover:bg-emerald-600 text-white shadow-lg shadow-emerald-200 border-0 rounded-xl transition-all"
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
                className="h-14 px-8 text-lg font-semibold border-2 border-emerald-200 text-emerald-700 hover:bg-emerald-50 rounded-xl transition-all"
              >
                <Users className="w-5 h-5 mr-2" />
                Become a Driver
              </Button>
            </Link>
          </motion.div>

          {/* Stats */}
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
                className="p-5 rounded-2xl bg-white border border-gray-100 shadow-sm hover:shadow-md hover:border-emerald-100 transition-all cursor-pointer"
              >
                <stat.icon className={`w-6 h-6 ${stat.color} mx-auto mb-2`} />
                <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                <p className="text-xs text-gray-400">{stat.label}</p>
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
                className="flex items-center gap-2 text-gray-400"
              >
                <badge.icon className="w-4 h-4 text-emerald-500" />
                <span className="text-sm font-medium">{badge.label}</span>
              </motion.div>
            ))}
          </motion.div>

          {/* Bottom bar */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1 }}
            className="mt-16 pt-8 border-t border-gray-100"
          >
            <div className="flex flex-wrap items-center justify-center gap-6 text-sm">
              <span className="flex items-center gap-2 text-gray-400">
                <Heart className="w-4 h-4 text-rose-400" />
                Move with peace
              </span>
              <span className="text-gray-200">|</span>
              <span className="flex items-center gap-2 text-gray-400">
                <Zap className="w-4 h-4 text-amber-400" />
                Ride with purpose
              </span>
              <span className="text-gray-200">|</span>
              <span className="flex items-center gap-2 text-gray-400">
                <Shield className="w-4 h-4 text-emerald-500" />
                Trusted journeys
              </span>
              <span className="text-gray-200">|</span>
              <span className="flex items-center gap-2 text-gray-400">
                <Navigation className="w-4 h-4 text-blue-400" />
                Where every ride flows
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
        <div className="w-6 h-10 rounded-full border-2 border-emerald-200 flex items-start justify-center pt-2">
          <motion.div
            className="w-1.5 h-1.5 rounded-full bg-emerald-500"
            animate={{ y: [0, 12, 0], opacity: [1, 0.4, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
          />
        </div>
      </motion.div>
    </section>
  )
}
