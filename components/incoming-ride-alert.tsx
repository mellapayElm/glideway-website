"use client"

import { useState, useEffect, useCallback, useRef } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { 
  MapPin, Navigation, Car, Clock, DollarSign, Star, Phone, 
  Check, X, Route, User, Zap, Shield, AlertCircle, Volume2, 
  VolumeX, Vibrate, Map, ChevronDown, ChevronUp, Wallet
} from "lucide-react"
import { Button } from "@/components/ui/button"

interface RideRequest {
  id: string
  rider: {
    name: string
    rating: number
    trips: number
    photo?: string
  }
  pickup: {
    address: string
    lat: number
    lng: number
    distance: number
    eta: number
  }
  dropoff: {
    address: string
    lat: number
    lng: number
  }
  rideType: string
  estimatedFare: number
  driverPayout: number
  estimatedDistance: number
  estimatedDuration: number
  surgeMultiplier: number
  matchScore?: number
  matchReasons?: string[]
}

interface IncomingRideAlertProps {
  request: RideRequest
  countdown: number
  onAccept: () => void
  onDecline: () => void
  soundEnabled: boolean
  onToggleSound: () => void
}

export function IncomingRideAlert({
  request,
  countdown,
  onAccept,
  onDecline,
  soundEnabled,
  onToggleSound
}: IncomingRideAlertProps) {
  const [showDetails, setShowDetails] = useState(false)
  const [isVibrating, setIsVibrating] = useState(true)
  const audioRef = useRef<HTMLAudioElement | null>(null)
  const vibrationRef = useRef<NodeJS.Timeout | null>(null)

  // Play alert sound
  useEffect(() => {
    if (soundEnabled) {
      // Create audio context for alert sound
      try {
        const AudioContext = window.AudioContext || (window as any).webkitAudioContext
        const audioCtx = new AudioContext()
        
        // Create oscillator for alert tone
        const playTone = () => {
          const oscillator = audioCtx.createOscillator()
          const gainNode = audioCtx.createGain()
          
          oscillator.connect(gainNode)
          gainNode.connect(audioCtx.destination)
          
          oscillator.frequency.value = 880 // A5 note
          oscillator.type = "sine"
          
          gainNode.gain.setValueAtTime(0.3, audioCtx.currentTime)
          gainNode.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.3)
          
          oscillator.start(audioCtx.currentTime)
          oscillator.stop(audioCtx.currentTime + 0.3)
        }
        
        // Play initial alert
        playTone()
        
        // Repeat every 2 seconds while alert is active
        const interval = setInterval(() => {
          if (countdown > 0) {
            playTone()
          }
        }, 2000)
        
        return () => {
          clearInterval(interval)
          audioCtx.close()
        }
      } catch (e) {
        console.warn("Audio not supported:", e)
      }
    }
  }, [soundEnabled, countdown])

  // Vibration pattern
  useEffect(() => {
    if (isVibrating && "vibrate" in navigator) {
      // Vibration pattern: vibrate 200ms, pause 100ms, vibrate 200ms
      const pattern = [200, 100, 200, 100, 200]
      
      const vibrate = () => {
        if (countdown > 0) {
          navigator.vibrate(pattern)
        }
      }
      
      vibrate()
      vibrationRef.current = setInterval(vibrate, 2000)
      
      return () => {
        if (vibrationRef.current) {
          clearInterval(vibrationRef.current)
        }
        navigator.vibrate(0) // Stop vibration
      }
    }
  }, [isVibrating, countdown])

  // Urgency color based on countdown
  const getCountdownColor = () => {
    if (countdown > 15) return "from-emerald-600 to-emerald-700"
    if (countdown > 10) return "from-emerald-600 to-yellow-600"
    if (countdown > 5) return "from-yellow-600 to-orange-600"
    return "from-orange-600 to-red-600"
  }

  const getCountdownTextColor = () => {
    if (countdown > 10) return "text-emerald-100"
    if (countdown > 5) return "text-yellow-100"
    return "text-red-100"
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[100] bg-slate-950"
    >
      <div className="h-full flex flex-col">
        {/* Pulsing Header with Timer */}
        <motion.div 
          className={`bg-gradient-to-r ${getCountdownColor()} p-6 text-center relative overflow-hidden`}
          animate={{ 
            boxShadow: countdown <= 5 
              ? ["0 0 0px rgba(239, 68, 68, 0)", "0 0 30px rgba(239, 68, 68, 0.5)", "0 0 0px rgba(239, 68, 68, 0)"]
              : undefined
          }}
          transition={{ duration: 0.5, repeat: Infinity }}
        >
          {/* Pulse effect */}
          <motion.div
            className="absolute inset-0 bg-white/10"
            animate={{ opacity: [0, 0.3, 0] }}
            transition={{ duration: 1, repeat: Infinity }}
          />
          
          <div className="relative">
            <motion.div 
              className="text-6xl font-bold text-white mb-2"
              animate={{ scale: [1, 1.05, 1] }}
              transition={{ duration: 0.5, repeat: Infinity }}
            >
              {countdown}
            </motion.div>
            <div className={`text-sm font-medium ${getCountdownTextColor()}`}>
              {countdown > 10 ? "New ride request" : countdown > 5 ? "Respond now" : "Time running out!"}
            </div>
          </div>

          {/* Sound/Vibration Controls */}
          <div className="absolute top-4 right-4 flex gap-2">
            <button
              onClick={onToggleSound}
              className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center text-white hover:bg-white/30 transition-colors"
            >
              {soundEnabled ? <Volume2 className="w-5 h-5" /> : <VolumeX className="w-5 h-5" />}
            </button>
            <button
              onClick={() => setIsVibrating(!isVibrating)}
              className={`w-10 h-10 rounded-full flex items-center justify-center text-white transition-colors ${
                isVibrating ? "bg-white/20 hover:bg-white/30" : "bg-white/10"
              }`}
            >
              <Vibrate className="w-5 h-5" />
            </button>
          </div>
        </motion.div>

        {/* Trip Details - Scrollable */}
        <div className="flex-1 overflow-auto p-4 space-y-4">
          {/* Driver Payout - Prominent Display */}
          <motion.div 
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.1 }}
            className="bg-gradient-to-r from-emerald-900/50 to-emerald-800/50 rounded-2xl p-6 text-center border border-emerald-700/50"
          >
            <div className="text-sm text-emerald-400 mb-1">Your Earnings</div>
            <div className="text-4xl font-bold text-white mb-2">
              ${request.driverPayout?.toFixed(2) || (request.estimatedFare * 0.8).toFixed(2)}
            </div>
            <div className="flex items-center justify-center gap-4 text-sm text-slate-400">
              <span>{request.estimatedDistance} mi</span>
              <span>•</span>
              <span>{request.estimatedDuration} min</span>
              {request.surgeMultiplier > 1 && (
                <>
                  <span>•</span>
                  <span className="text-orange-400 flex items-center gap-1">
                    <Zap className="w-4 h-4" />
                    {request.surgeMultiplier}x Surge
                  </span>
                </>
              )}
            </div>
          </motion.div>

          {/* Rider Info */}
          <motion.div 
            initial={{ x: -20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.15 }}
            className="flex items-center gap-4 p-4 bg-slate-800/50 rounded-xl border border-slate-700/50"
          >
            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-blue-500 to-blue-700 flex items-center justify-center text-white text-2xl font-bold">
              {request.rider.name.charAt(0)}
            </div>
            <div className="flex-1">
              <div className="font-semibold text-white text-lg">{request.rider.name}</div>
              <div className="flex items-center gap-3 text-sm text-slate-400">
                <span className="flex items-center gap-1">
                  <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                  {request.rider.rating}
                </span>
                <span>{request.rider.trips} trips</span>
              </div>
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold text-emerald-400">{request.pickup.eta} min</div>
              <div className="text-xs text-slate-500">to pickup</div>
            </div>
          </motion.div>

          {/* Pickup Location */}
          <motion.div 
            initial={{ x: -20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="p-4 bg-slate-800/50 rounded-xl border border-slate-700/50"
          >
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-full bg-emerald-500/20 flex items-center justify-center flex-shrink-0 mt-1">
                <div className="w-4 h-4 rounded-full bg-emerald-500 animate-pulse" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-xs text-emerald-400 font-medium uppercase">Pickup</span>
                  <span className="text-xs text-slate-500">•</span>
                  <span className="text-xs text-slate-500">{request.pickup.distance} mi away</span>
                </div>
                <div className="text-white font-medium truncate">{request.pickup.address}</div>
              </div>
            </div>
          </motion.div>

          {/* Route Line */}
          <div className="flex justify-center">
            <div className="w-0.5 h-6 bg-gradient-to-b from-emerald-500 to-red-500" />
          </div>

          {/* Dropoff Location */}
          <motion.div 
            initial={{ x: -20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.25 }}
            className="p-4 bg-slate-800/50 rounded-xl border border-slate-700/50"
          >
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-full bg-red-500/20 flex items-center justify-center flex-shrink-0 mt-1">
                <div className="w-4 h-4 rounded-full bg-red-500" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-xs text-red-400 font-medium uppercase mb-1">Dropoff</div>
                <div className="text-white font-medium truncate">{request.dropoff.address}</div>
              </div>
            </div>
          </motion.div>

          {/* Trip Stats Grid */}
          <motion.div 
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="grid grid-cols-4 gap-2"
          >
            <div className="bg-slate-800/50 rounded-xl p-3 text-center border border-slate-700/50">
              <Route className="w-5 h-5 mx-auto text-blue-400 mb-1" />
              <div className="text-lg font-bold text-white">{request.estimatedDistance}</div>
              <div className="text-[10px] text-slate-500 uppercase">Miles</div>
            </div>
            <div className="bg-slate-800/50 rounded-xl p-3 text-center border border-slate-700/50">
              <Clock className="w-5 h-5 mx-auto text-purple-400 mb-1" />
              <div className="text-lg font-bold text-white">{request.estimatedDuration}</div>
              <div className="text-[10px] text-slate-500 uppercase">Minutes</div>
            </div>
            <div className="bg-slate-800/50 rounded-xl p-3 text-center border border-slate-700/50">
              <DollarSign className="w-5 h-5 mx-auto text-emerald-400 mb-1" />
              <div className="text-lg font-bold text-white">${request.estimatedFare.toFixed(0)}</div>
              <div className="text-[10px] text-slate-500 uppercase">Fare</div>
            </div>
            <div className="bg-slate-800/50 rounded-xl p-3 text-center border border-slate-700/50">
              <Car className="w-5 h-5 mx-auto text-yellow-400 mb-1" />
              <div className="text-sm font-bold text-white">{request.rideType}</div>
              <div className="text-[10px] text-slate-500 uppercase">Type</div>
            </div>
          </motion.div>

          {/* Expandable Details */}
          <motion.button
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.35 }}
            onClick={() => setShowDetails(!showDetails)}
            className="w-full flex items-center justify-center gap-2 py-2 text-slate-400 hover:text-white transition-colors"
          >
            <span className="text-sm">{showDetails ? "Hide details" : "View trip details"}</span>
            {showDetails ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </motion.button>

          <AnimatePresence>
            {showDetails && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="overflow-hidden"
              >
                <div className="space-y-3 pb-4">
                  {/* Fare Breakdown */}
                  <div className="bg-slate-800/50 rounded-xl p-4 border border-slate-700/50">
                    <div className="text-sm font-medium text-white mb-3">Fare Breakdown</div>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-slate-400">Base fare</span>
                        <span className="text-white">$2.50</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-400">Distance ({request.estimatedDistance} mi)</span>
                        <span className="text-white">${(request.estimatedDistance * 1.50).toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-400">Time ({request.estimatedDuration} min)</span>
                        <span className="text-white">${(request.estimatedDuration * 0.35).toFixed(2)}</span>
                      </div>
                      {request.surgeMultiplier > 1 && (
                        <div className="flex justify-between text-orange-400">
                          <span>Surge ({request.surgeMultiplier}x)</span>
                          <span>+${((request.estimatedFare * (request.surgeMultiplier - 1)) * 0.8).toFixed(2)}</span>
                        </div>
                      )}
                      <div className="border-t border-slate-700 pt-2 flex justify-between font-semibold">
                        <span className="text-emerald-400">Your payout</span>
                        <span className="text-emerald-400">${(request.estimatedFare * 0.8).toFixed(2)}</span>
                      </div>
                    </div>
                  </div>

                  {/* Match Reasons */}
                  {request.matchReasons && request.matchReasons.length > 0 && (
                    <div className="bg-slate-800/50 rounded-xl p-4 border border-slate-700/50">
                      <div className="text-sm font-medium text-white mb-3">Why you matched</div>
                      <div className="flex flex-wrap gap-2">
                        {request.matchReasons.map((reason, i) => (
                          <span key={i} className="px-2 py-1 bg-emerald-500/20 text-emerald-400 text-xs rounded-full">
                            {reason}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Action Buttons - Fixed at bottom */}
        <div className="p-4 bg-slate-900 border-t border-slate-800 safe-area-bottom">
          <div className="grid grid-cols-2 gap-4">
            <Button
              onClick={onDecline}
              variant="outline"
              size="lg"
              className="h-16 border-2 border-red-500/50 text-red-400 hover:bg-red-500/10 hover:border-red-500 text-lg font-semibold transition-all"
            >
              <X className="w-6 h-6 mr-2" />
              Decline
            </Button>
            <motion.div
              animate={{ scale: [1, 1.02, 1] }}
              transition={{ duration: 0.5, repeat: Infinity }}
            >
              <Button
                onClick={onAccept}
                size="lg"
                className="w-full h-16 bg-emerald-600 hover:bg-emerald-700 text-white text-lg font-semibold shadow-lg shadow-emerald-600/30"
              >
                <Check className="w-6 h-6 mr-2" />
                Accept
              </Button>
            </motion.div>
          </div>
          
          {/* Swipe hint */}
          <div className="text-center mt-3 text-xs text-slate-500">
            Tap Accept to start navigating to pickup
          </div>
        </div>
      </div>
    </motion.div>
  )
}
