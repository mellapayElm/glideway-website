"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { 
  Car, Clock, MapPin, Search, Loader2, User, Star, 
  X, CheckCircle, AlertCircle, Radio, Navigation, Phone,
  MessageCircle, Shield, Zap
} from "lucide-react"
import { Button } from "@/components/ui/button"

interface DriverInfo {
  id: string
  name: string
  rating: number
  vehicleType: string
  totalTrips: number
  distanceToPickup: number
  etaToPickup: number
  matchReasons?: string[]
  vehicleModel?: string
  vehiclePlate?: string
  photo?: string
}

interface DriverSearchOverlayProps {
  isSearching: boolean
  driverFound: boolean
  driver?: DriverInfo
  searchRadius: number
  onCancel: () => void
  onContactDriver?: () => void
  tripDetails?: {
    pickup: string
    dropoff: string
    estimatedFare: number
    estimatedDuration: number
  }
}

export function DriverSearchOverlay({
  isSearching,
  driverFound,
  driver,
  searchRadius,
  onCancel,
  onContactDriver,
  tripDetails
}: DriverSearchOverlayProps) {
  const [searchPhase, setSearchPhase] = useState(0)
  const [driversChecked, setDriversChecked] = useState(0)

  // Simulate search phases
  useEffect(() => {
    if (isSearching) {
      const phases = [
        "Finding nearby drivers...",
        "Checking driver availability...",
        "Calculating best match...",
        "Sending request to driver..."
      ]
      
      let phase = 0
      const interval = setInterval(() => {
        phase = (phase + 1) % phases.length
        setSearchPhase(phase)
        setDriversChecked(prev => prev + Math.floor(Math.random() * 3) + 1)
      }, 2000)

      return () => clearInterval(interval)
    } else {
      setSearchPhase(0)
      setDriversChecked(0)
    }
  }, [isSearching])

  const searchMessages = [
    "Finding nearby drivers...",
    "Checking driver availability...",
    "Calculating best match...",
    "Sending request to driver..."
  ]

  if (!isSearching && !driverFound) return null

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-slate-950/95 z-50 flex items-center justify-center p-4"
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          className="w-full max-w-md"
        >
          {/* Searching State */}
          {isSearching && !driverFound && (
            <div className="text-center space-y-8">
              {/* Animated Search Radar */}
              <div className="relative w-48 h-48 mx-auto">
                {/* Outer rings */}
                <motion.div
                  className="absolute inset-0 rounded-full border-2 border-emerald-500/30"
                  animate={{ scale: [1, 1.5, 1], opacity: [0.5, 0, 0.5] }}
                  transition={{ duration: 2, repeat: Infinity }}
                />
                <motion.div
                  className="absolute inset-4 rounded-full border-2 border-emerald-500/40"
                  animate={{ scale: [1, 1.4, 1], opacity: [0.6, 0, 0.6] }}
                  transition={{ duration: 2, repeat: Infinity, delay: 0.3 }}
                />
                <motion.div
                  className="absolute inset-8 rounded-full border-2 border-emerald-500/50"
                  animate={{ scale: [1, 1.3, 1], opacity: [0.7, 0, 0.7] }}
                  transition={{ duration: 2, repeat: Infinity, delay: 0.6 }}
                />
                
                {/* Center car icon */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <motion.div
                    className="w-20 h-20 rounded-full bg-emerald-600 flex items-center justify-center"
                    animate={{ scale: [1, 1.1, 1] }}
                    transition={{ duration: 1, repeat: Infinity }}
                  >
                    <Car className="w-10 h-10 text-white" />
                  </motion.div>
                </div>

                {/* Simulated driver dots */}
                {[0, 1, 2, 3, 4].map((i) => (
                  <motion.div
                    key={i}
                    className="absolute w-3 h-3 rounded-full bg-blue-400"
                    style={{
                      top: `${30 + Math.random() * 40}%`,
                      left: `${20 + Math.random() * 60}%`
                    }}
                    animate={{ 
                      opacity: [0.3, 1, 0.3],
                      scale: [0.8, 1.2, 0.8]
                    }}
                    transition={{ 
                      duration: 1.5 + Math.random(), 
                      repeat: Infinity,
                      delay: i * 0.2
                    }}
                  />
                ))}
              </div>

              {/* Search Status */}
              <div className="space-y-4">
                <h2 className="text-2xl font-bold text-white">
                  {searchMessages[searchPhase]}
                </h2>
                <div className="flex items-center justify-center gap-2 text-slate-400">
                  <Radio className="w-4 h-4 text-emerald-400 animate-pulse" />
                  <span>Searching within {searchRadius} miles</span>
                </div>
                <div className="text-sm text-slate-500">
                  {driversChecked} drivers checked
                </div>
              </div>

              {/* Trip Summary */}
              {tripDetails && (
                <div className="bg-slate-800/50 rounded-xl p-4 text-left space-y-3">
                  <div className="flex items-start gap-3">
                    <div className="w-3 h-3 rounded-full bg-emerald-500 mt-1.5" />
                    <div className="flex-1">
                      <div className="text-xs text-slate-500">PICKUP</div>
                      <div className="text-white text-sm truncate">{tripDetails.pickup}</div>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-3 h-3 rounded-full bg-red-500 mt-1.5" />
                    <div className="flex-1">
                      <div className="text-xs text-slate-500">DROPOFF</div>
                      <div className="text-white text-sm truncate">{tripDetails.dropoff}</div>
                    </div>
                  </div>
                  <div className="flex justify-between pt-2 border-t border-slate-700">
                    <span className="text-slate-400">Est. fare</span>
                    <span className="text-emerald-400 font-semibold">${tripDetails.estimatedFare.toFixed(2)}</span>
                  </div>
                </div>
              )}

              {/* Cancel Button */}
              <Button
                onClick={onCancel}
                variant="outline"
                className="border-slate-600 text-slate-300 hover:bg-slate-800"
              >
                <X className="w-4 h-4 mr-2" />
                Cancel Search
              </Button>
            </div>
          )}

          {/* Driver Found State */}
          {driverFound && driver && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-6"
            >
              {/* Success Header */}
              <div className="text-center space-y-2">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", damping: 10 }}
                  className="w-16 h-16 rounded-full bg-emerald-500 mx-auto flex items-center justify-center"
                >
                  <CheckCircle className="w-8 h-8 text-white" />
                </motion.div>
                <h2 className="text-2xl font-bold text-white">Driver Found!</h2>
                <p className="text-slate-400">Your driver is on the way</p>
              </div>

              {/* Driver Card */}
              <div className="bg-slate-800/50 rounded-2xl p-6 space-y-4">
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 rounded-full bg-gradient-to-br from-blue-500 to-blue-700 flex items-center justify-center text-white text-2xl font-bold">
                    {driver.name.charAt(0)}
                  </div>
                  <div className="flex-1">
                    <div className="font-semibold text-white text-lg">{driver.name}</div>
                    <div className="flex items-center gap-2 text-sm text-slate-400">
                      <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                      <span>{driver.rating}</span>
                      <span className="text-slate-600">|</span>
                      <span>{driver.totalTrips.toLocaleString()} trips</span>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold text-emerald-400">{driver.etaToPickup}</div>
                    <div className="text-xs text-slate-500">min away</div>
                  </div>
                </div>

                {/* Vehicle Info */}
                <div className="flex items-center gap-3 p-3 bg-slate-700/50 rounded-xl">
                  <Car className="w-5 h-5 text-slate-400" />
                  <div className="flex-1">
                    <div className="text-white text-sm font-medium">
                      {driver.vehicleModel || `${driver.vehicleType} Vehicle`}
                    </div>
                    <div className="text-xs text-slate-500">
                      {driver.vehiclePlate || "License plate visible on arrival"}
                    </div>
                  </div>
                  <div className="px-2 py-1 bg-emerald-500/20 rounded text-emerald-400 text-xs font-medium uppercase">
                    {driver.vehicleType}
                  </div>
                </div>

                {/* Match Reasons */}
                {driver.matchReasons && driver.matchReasons.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {driver.matchReasons.map((reason, i) => (
                      <span key={i} className="px-2 py-1 bg-blue-500/20 text-blue-400 text-xs rounded-full">
                        {reason}
                      </span>
                    ))}
                  </div>
                )}

                {/* Action Buttons */}
                <div className="grid grid-cols-2 gap-3 pt-2">
                  <Button
                    variant="outline"
                    className="border-slate-600 text-white hover:bg-slate-700"
                    onClick={onContactDriver}
                  >
                    <Phone className="w-4 h-4 mr-2" />
                    Call
                  </Button>
                  <Button
                    variant="outline"
                    className="border-slate-600 text-white hover:bg-slate-700"
                    onClick={onContactDriver}
                  >
                    <MessageCircle className="w-4 h-4 mr-2" />
                    Message
                  </Button>
                </div>
              </div>

              {/* Safety Info */}
              <div className="flex items-center gap-3 p-3 bg-emerald-500/10 rounded-xl border border-emerald-500/20">
                <Shield className="w-5 h-5 text-emerald-400" />
                <span className="text-sm text-slate-300">
                  Share your trip with family for safety
                </span>
              </div>

              {/* Cancel Option */}
              <div className="text-center">
                <button
                  onClick={onCancel}
                  className="text-sm text-slate-500 hover:text-slate-300 transition-colors"
                >
                  Cancel ride
                </button>
              </div>
            </motion.div>
          )}
        </motion.div>
      </motion.div>
    </AnimatePresence>
  )
}
