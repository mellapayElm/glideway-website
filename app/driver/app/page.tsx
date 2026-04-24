"use client"

import { useState, useEffect, useCallback } from "react"
import { motion, AnimatePresence } from "framer-motion"
import Link from "next/link"
import { 
  MapPin, Navigation, Car, Clock, DollarSign, Star, Phone, MessageCircle,
  Shield, History, Settings, User, Bell, ChevronRight, ChevronDown, ChevronUp,
  Check, AlertCircle, Zap, Users, Power, Loader2, Send, Menu, Map,
  Navigation2, Compass, Route, Timer, TrendingUp, Activity, Radio,
  Wifi, Signal, Battery, X, Home, CreditCard, HelpCircle, LogOut,
  Target, Crosshair, Locate, RotateCw, Building, Plane, Volume2, VolumeX,
  Sun, Moon, Thermometer, Droplets, Wind, CheckCircle, XCircle, ArrowRight,
  Calendar, Gift, Award, Briefcase, FileText, Camera, Upload, AlertTriangle
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { GlidewayLogo } from "@/components/glideway-logo"
import { Switch } from "@/components/ui/switch"

type DriverStatus = "offline" | "online" | "busy"
type TripStatus = "idle" | "incoming" | "accepted" | "navigating_pickup" | "waiting_rider" | "in_trip" | "completed"

interface TripRequest {
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
  estimatedDistance: number
  estimatedDuration: number
  surgeMultiplier: number
  expiresIn: number
}

interface EarningsData {
  today: number
  thisWeek: number
  thisMonth: number
  tripsToday: number
  tripsThisWeek: number
  hoursOnline: number
  acceptance: number
  cancellation: number
  rating: number
}

export default function DriverApp() {
  const [driverStatus, setDriverStatus] = useState<DriverStatus>("offline")
  const [tripStatus, setTripStatus] = useState<TripStatus>("idle")
  const [showMenu, setShowMenu] = useState(false)
  const [showEarnings, setShowEarnings] = useState(false)
  const [soundEnabled, setSoundEnabled] = useState(true)
  const [currentTrip, setCurrentTrip] = useState<TripRequest | null>(null)
  const [tripTimer, setTripTimer] = useState(15)
  const [navigationStarted, setNavigationStarted] = useState(false)

  // GPS State
  const [gpsData, setGpsData] = useState({
    lat: 34.0522, lng: -118.2437, accuracy: 4, speed: 0, heading: 45
  })
  const [gpsStatus, setGpsStatus] = useState<"locked" | "acquiring" | "weak">("locked")

  // Earnings Data
  const [earnings, setEarnings] = useState<EarningsData>({
    today: 187.50,
    thisWeek: 892.40,
    thisMonth: 3248.75,
    tripsToday: 12,
    tripsThisWeek: 58,
    hoursOnline: 6.5,
    acceptance: 94,
    cancellation: 2,
    rating: 4.92
  })

  // Demo trip request
  const demoTrip: TripRequest = {
    id: "GW-" + Math.floor(10000 + Math.random() * 90000),
    rider: {
      name: "Sarah M.",
      rating: 4.85,
      trips: 127,
    },
    pickup: {
      address: "456 Oak Street, Los Angeles",
      lat: 34.0550,
      lng: -118.2500,
      distance: 0.8,
      eta: 3
    },
    dropoff: {
      address: "LAX Airport Terminal 4",
      lat: 33.9425,
      lng: -118.4081
    },
    rideType: "Comfort",
    estimatedFare: 34.50,
    estimatedDistance: 12.4,
    estimatedDuration: 28,
    surgeMultiplier: 1.0,
    expiresIn: 15
  }

  // Simulate GPS updates
  useEffect(() => {
    const interval = setInterval(() => {
      setGpsData(prev => ({
        ...prev,
        lat: prev.lat + (Math.random() - 0.5) * 0.0001,
        lng: prev.lng + (Math.random() - 0.5) * 0.0001,
        accuracy: 3 + Math.random() * 4,
        heading: prev.heading + (Math.random() - 0.5) * 5
      }))
    }, 3000)
    return () => clearInterval(interval)
  }, [])

  // Simulate incoming ride when online
  useEffect(() => {
    if (driverStatus === "online" && tripStatus === "idle") {
      const timeout = setTimeout(() => {
        setCurrentTrip(demoTrip)
        setTripStatus("incoming")
        setTripTimer(15)
      }, 5000)
      return () => clearTimeout(timeout)
    }
  }, [driverStatus, tripStatus])

  // Trip request countdown
  useEffect(() => {
    if (tripStatus === "incoming" && tripTimer > 0) {
      const interval = setInterval(() => {
        setTripTimer(prev => {
          if (prev <= 1) {
            // Auto decline if timer expires
            setTripStatus("idle")
            setCurrentTrip(null)
            return 15
          }
          return prev - 1
        })
      }, 1000)
      return () => clearInterval(interval)
    }
  }, [tripStatus, tripTimer])

  const goOnline = () => {
    setDriverStatus("online")
    setTripStatus("idle")
  }

  const goOffline = () => {
    setDriverStatus("offline")
    setTripStatus("idle")
    setCurrentTrip(null)
  }

  const acceptTrip = () => {
    setTripStatus("accepted")
    setDriverStatus("busy")
    setTimeout(() => {
      setTripStatus("navigating_pickup")
      setNavigationStarted(true)
    }, 2000)
  }

  const declineTrip = () => {
    setTripStatus("idle")
    setCurrentTrip(null)
  }

  const arrivedAtPickup = () => {
    setTripStatus("waiting_rider")
  }

  const startTrip = () => {
    setTripStatus("in_trip")
  }

  const completeTrip = () => {
    setTripStatus("completed")
    setEarnings(prev => ({
      ...prev,
      today: prev.today + (currentTrip?.estimatedFare || 0) * 0.80,
      tripsToday: prev.tripsToday + 1
    }))
    setTimeout(() => {
      setTripStatus("idle")
      setDriverStatus("online")
      setCurrentTrip(null)
      setNavigationStarted(false)
    }, 3000)
  }

  // Menu items
  const menuItems = [
    { icon: <Home className="w-5 h-5" />, label: "Home", action: () => setShowMenu(false) },
    { icon: <TrendingUp className="w-5 h-5" />, label: "Earnings", action: () => { setShowEarnings(true); setShowMenu(false) } },
    { icon: <History className="w-5 h-5" />, label: "Trip History", action: () => {} },
    { icon: <CreditCard className="w-5 h-5" />, label: "Payouts", action: () => {} },
    { icon: <FileText className="w-5 h-5" />, label: "Documents", action: () => {} },
    { icon: <Star className="w-5 h-5" />, label: "Ratings", action: () => {} },
    { icon: <Gift className="w-5 h-5" />, label: "Bonuses", action: () => {} },
    { icon: <Award className="w-5 h-5" />, label: "Achievements", action: () => {} },
    { icon: <HelpCircle className="w-5 h-5" />, label: "Support", action: () => {} },
    { icon: <Settings className="w-5 h-5" />, label: "Settings", action: () => {} },
  ]

  // Status indicator color
  const getStatusColor = () => {
    switch (driverStatus) {
      case "online": return "bg-emerald-500"
      case "busy": return "bg-blue-500"
      default: return "bg-slate-500"
    }
  }

  const getStatusText = () => {
    switch (driverStatus) {
      case "online": return "Online - Waiting for trips"
      case "busy": return "On a trip"
      default: return "Offline"
    }
  }

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-slate-900/95 backdrop-blur-sm border-b border-slate-800">
        <div className="flex items-center justify-between px-4 py-3">
          <button onClick={() => setShowMenu(true)} className="p-2 -ml-2">
            <Menu className="w-6 h-6 text-slate-300" />
          </button>
          
          <div className="flex items-center gap-2">
            <div className={`w-2.5 h-2.5 rounded-full ${getStatusColor()} ${driverStatus === "online" ? "animate-pulse" : ""}`} />
            <span className="text-sm font-medium text-white">{getStatusText()}</span>
          </div>

          <button
            onClick={() => setSoundEnabled(!soundEnabled)}
            className="p-2 -mr-2"
          >
            {soundEnabled ? (
              <Volume2 className="w-5 h-5 text-emerald-400" />
            ) : (
              <VolumeX className="w-5 h-5 text-slate-500" />
            )}
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 relative">
        {/* Map Background Placeholder */}
        <div className="absolute inset-0 bg-gradient-to-b from-slate-800 to-slate-900">
          <div className="absolute inset-0 opacity-20">
            {/* Grid pattern for map placeholder */}
            <div className="w-full h-full" style={{
              backgroundImage: "linear-gradient(to right, #334155 1px, transparent 1px), linear-gradient(to bottom, #334155 1px, transparent 1px)",
              backgroundSize: "50px 50px"
            }} />
          </div>
          
          {/* GPS Status Overlay */}
          <div className="absolute top-4 left-4 right-4">
            <div className="bg-slate-900/90 backdrop-blur-sm rounded-xl p-3 border border-slate-700/50">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <div className={`w-2 h-2 rounded-full ${gpsStatus === "locked" ? "bg-emerald-500" : "bg-yellow-500"} animate-pulse`} />
                  <span className="text-xs font-medium text-slate-300">GPS {gpsStatus === "locked" ? "Locked" : "Acquiring"}</span>
                </div>
                <span className="text-xs text-slate-500">{gpsData.accuracy.toFixed(1)}m accuracy</span>
              </div>
              <div className="grid grid-cols-3 gap-2 text-center">
                <div className="bg-slate-800/50 rounded-lg p-2">
                  <Compass className="w-4 h-4 mx-auto text-blue-400 mb-1" />
                  <div className="text-xs text-slate-400">Heading</div>
                  <div className="text-sm font-bold text-white">{Math.round(gpsData.heading)}</div>
                </div>
                <div className="bg-slate-800/50 rounded-lg p-2">
                  <Activity className="w-4 h-4 mx-auto text-emerald-400 mb-1" />
                  <div className="text-xs text-slate-400">Speed</div>
                  <div className="text-sm font-bold text-white">{Math.round(gpsData.speed)} mph</div>
                </div>
                <div className="bg-slate-800/50 rounded-lg p-2">
                  <Signal className="w-4 h-4 mx-auto text-purple-400 mb-1" />
                  <div className="text-xs text-slate-400">Signal</div>
                  <div className="text-sm font-bold text-white">Strong</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Offline State */}
        {driverStatus === "offline" && (
          <div className="absolute inset-0 flex items-center justify-center bg-slate-950/80 backdrop-blur-sm">
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="text-center px-6"
            >
              <div className="w-24 h-24 mx-auto rounded-full bg-slate-800 border-4 border-slate-700 flex items-center justify-center mb-6">
                <Power className="w-12 h-12 text-slate-500" />
              </div>
              <h2 className="text-2xl font-bold text-white mb-2">You are Offline</h2>
              <p className="text-slate-400 mb-8">Go online to start receiving trip requests</p>
              <Button
                onClick={goOnline}
                size="lg"
                className="bg-emerald-600 hover:bg-emerald-700 text-white px-12 py-6 text-lg rounded-full"
              >
                <Power className="w-6 h-6 mr-2" />
                Go Online
              </Button>
            </motion.div>
          </div>
        )}

        {/* Online - Waiting for Trips */}
        {driverStatus === "online" && tripStatus === "idle" && (
          <div className="absolute bottom-0 left-0 right-0 p-4">
            <motion.div
              initial={{ y: 100, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              className="bg-slate-900/95 backdrop-blur-sm rounded-2xl border border-slate-700 p-4"
            >
              {/* Quick Stats */}
              <div className="grid grid-cols-3 gap-4 mb-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-emerald-400">${earnings.today.toFixed(2)}</div>
                  <div className="text-xs text-slate-400">Today</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-white">{earnings.tripsToday}</div>
                  <div className="text-xs text-slate-400">Trips</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-white">{earnings.hoursOnline}h</div>
                  <div className="text-xs text-slate-400">Online</div>
                </div>
              </div>

              {/* Waiting Animation */}
              <div className="flex items-center justify-center gap-3 py-4">
                <div className="w-2 h-2 bg-emerald-500 rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
                <div className="w-2 h-2 bg-emerald-500 rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
                <div className="w-2 h-2 bg-emerald-500 rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
                <span className="text-sm text-slate-400 ml-2">Searching for trips nearby...</span>
              </div>

              {/* Go Offline Button */}
              <Button
                onClick={goOffline}
                variant="outline"
                className="w-full border-slate-600 text-slate-300 hover:bg-slate-800"
              >
                <Power className="w-4 h-4 mr-2" />
                Go Offline
              </Button>
            </motion.div>
          </div>
        )}

        {/* Incoming Trip Request */}
        {tripStatus === "incoming" && currentTrip && (
          <motion.div
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            className="absolute inset-0 bg-slate-950 z-50"
          >
            <div className="h-full flex flex-col">
              {/* Timer Header */}
              <div className="bg-emerald-600 p-4 text-center">
                <div className="text-4xl font-bold text-white mb-1">{tripTimer}</div>
                <div className="text-emerald-100 text-sm">seconds to accept</div>
              </div>

              {/* Trip Details */}
              <div className="flex-1 overflow-auto p-4 space-y-4">
                {/* Rider Info */}
                <div className="flex items-center gap-4 p-4 bg-slate-800/50 rounded-xl">
                  <div className="w-14 h-14 rounded-full bg-gradient-to-br from-emerald-500 to-emerald-700 flex items-center justify-center text-white text-xl font-bold">
                    {currentTrip.rider.name.charAt(0)}
                  </div>
                  <div className="flex-1">
                    <div className="font-semibold text-white">{currentTrip.rider.name}</div>
                    <div className="flex items-center gap-2 text-sm text-slate-400">
                      <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                      <span>{currentTrip.rider.rating}</span>
                      <span>({currentTrip.rider.trips} trips)</span>
                    </div>
                  </div>
                </div>

                {/* Pickup Location */}
                <div className="p-4 bg-slate-800/50 rounded-xl">
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-full bg-emerald-500/20 flex items-center justify-center flex-shrink-0">
                      <div className="w-3 h-3 rounded-full bg-emerald-500" />
                    </div>
                    <div className="flex-1">
                      <div className="text-xs text-slate-500 mb-1">PICKUP</div>
                      <div className="text-white font-medium">{currentTrip.pickup.address}</div>
                      <div className="text-sm text-emerald-400 mt-1">
                        {currentTrip.pickup.distance} mi away - {currentTrip.pickup.eta} min
                      </div>
                    </div>
                  </div>
                </div>

                {/* Dropoff Location */}
                <div className="p-4 bg-slate-800/50 rounded-xl">
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-full bg-red-500/20 flex items-center justify-center flex-shrink-0">
                      <div className="w-3 h-3 rounded-full bg-red-500" />
                    </div>
                    <div className="flex-1">
                      <div className="text-xs text-slate-500 mb-1">DROPOFF</div>
                      <div className="text-white font-medium">{currentTrip.dropoff.address}</div>
                    </div>
                  </div>
                </div>

                {/* Trip Stats */}
                <div className="grid grid-cols-3 gap-3">
                  <div className="bg-slate-800/50 rounded-xl p-3 text-center">
                    <Route className="w-5 h-5 mx-auto text-blue-400 mb-1" />
                    <div className="text-lg font-bold text-white">{currentTrip.estimatedDistance} mi</div>
                    <div className="text-xs text-slate-500">Distance</div>
                  </div>
                  <div className="bg-slate-800/50 rounded-xl p-3 text-center">
                    <Clock className="w-5 h-5 mx-auto text-purple-400 mb-1" />
                    <div className="text-lg font-bold text-white">{currentTrip.estimatedDuration} min</div>
                    <div className="text-xs text-slate-500">Duration</div>
                  </div>
                  <div className="bg-slate-800/50 rounded-xl p-3 text-center">
                    <DollarSign className="w-5 h-5 mx-auto text-emerald-400 mb-1" />
                    <div className="text-lg font-bold text-emerald-400">${currentTrip.estimatedFare.toFixed(2)}</div>
                    <div className="text-xs text-slate-500">Est. Fare</div>
                  </div>
                </div>

                {/* Ride Type Badge */}
                <div className="flex items-center justify-center gap-2 py-2">
                  <Car className="w-5 h-5 text-emerald-400" />
                  <span className="text-white font-medium">{currentTrip.rideType}</span>
                  {currentTrip.surgeMultiplier > 1 && (
                    <span className="px-2 py-0.5 bg-orange-500/20 text-orange-400 text-xs rounded-full">
                      {currentTrip.surgeMultiplier}x Surge
                    </span>
                  )}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="p-4 bg-slate-900 border-t border-slate-800">
                <div className="grid grid-cols-2 gap-3">
                  <Button
                    onClick={declineTrip}
                    variant="outline"
                    size="lg"
                    className="border-red-500/50 text-red-400 hover:bg-red-500/10"
                  >
                    <X className="w-5 h-5 mr-2" />
                    Decline
                  </Button>
                  <Button
                    onClick={acceptTrip}
                    size="lg"
                    className="bg-emerald-600 hover:bg-emerald-700 text-white"
                  >
                    <Check className="w-5 h-5 mr-2" />
                    Accept
                  </Button>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* Navigating to Pickup / In Trip */}
        {(tripStatus === "navigating_pickup" || tripStatus === "waiting_rider" || tripStatus === "in_trip") && currentTrip && (
          <div className="absolute bottom-0 left-0 right-0 p-4">
            <motion.div
              initial={{ y: 100, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              className="bg-slate-900/95 backdrop-blur-sm rounded-2xl border border-slate-700 overflow-hidden"
            >
              {/* Status Header */}
              <div className={`p-4 ${
                tripStatus === "navigating_pickup" ? "bg-blue-600" :
                tripStatus === "waiting_rider" ? "bg-yellow-600" :
                "bg-emerald-600"
              }`}>
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-white font-semibold">
                      {tripStatus === "navigating_pickup" && "Navigating to pickup"}
                      {tripStatus === "waiting_rider" && "Waiting for rider"}
                      {tripStatus === "in_trip" && "Trip in progress"}
                    </div>
                    <div className="text-white/80 text-sm">{currentTrip.id}</div>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold text-white">${currentTrip.estimatedFare.toFixed(2)}</div>
                    <div className="text-white/80 text-xs">Est. Earnings</div>
                  </div>
                </div>
              </div>

              {/* Rider Info */}
              <div className="p-4 border-b border-slate-800">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-emerald-500 to-emerald-700 flex items-center justify-center text-white text-lg font-bold">
                      {currentTrip.rider.name.charAt(0)}
                    </div>
                    <div>
                      <div className="font-semibold text-white">{currentTrip.rider.name}</div>
                      <div className="flex items-center gap-1 text-sm text-slate-400">
                        <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                        {currentTrip.rider.rating}
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button size="icon" variant="outline" className="border-slate-700 hover:bg-slate-800">
                      <Phone className="w-4 h-4 text-emerald-400" />
                    </Button>
                    <Button size="icon" variant="outline" className="border-slate-700 hover:bg-slate-800">
                      <MessageCircle className="w-4 h-4 text-blue-400" />
                    </Button>
                  </div>
                </div>
              </div>

              {/* Destination */}
              <div className="p-4">
                <div className="flex items-start gap-3 mb-4">
                  <div className={`w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 ${
                    tripStatus === "in_trip" ? "bg-red-500/20" : "bg-emerald-500/20"
                  }`}>
                    <div className={`w-2 h-2 rounded-full ${
                      tripStatus === "in_trip" ? "bg-red-500" : "bg-emerald-500"
                    }`} />
                  </div>
                  <div>
                    <div className="text-xs text-slate-500 mb-0.5">
                      {tripStatus === "in_trip" ? "DROPOFF" : "PICKUP"}
                    </div>
                    <div className="text-white text-sm">
                      {tripStatus === "in_trip" ? currentTrip.dropoff.address : currentTrip.pickup.address}
                    </div>
                  </div>
                </div>

                {/* Action Button */}
                {tripStatus === "navigating_pickup" && (
                  <Button
                    onClick={arrivedAtPickup}
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white"
                  >
                    <MapPin className="w-4 h-4 mr-2" />
                    Arrived at Pickup
                  </Button>
                )}
                {tripStatus === "waiting_rider" && (
                  <Button
                    onClick={startTrip}
                    className="w-full bg-yellow-600 hover:bg-yellow-700 text-white"
                  >
                    <Navigation className="w-4 h-4 mr-2" />
                    Start Trip
                  </Button>
                )}
                {tripStatus === "in_trip" && (
                  <Button
                    onClick={completeTrip}
                    className="w-full bg-emerald-600 hover:bg-emerald-700 text-white"
                  >
                    <CheckCircle className="w-4 h-4 mr-2" />
                    Complete Trip
                  </Button>
                )}
              </div>
            </motion.div>
          </div>
        )}

        {/* Trip Completed */}
        {tripStatus === "completed" && currentTrip && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="absolute inset-0 bg-slate-950/95 z-50 flex items-center justify-center p-6"
          >
            <div className="text-center">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", damping: 10 }}
                className="w-24 h-24 mx-auto rounded-full bg-emerald-500/20 flex items-center justify-center mb-6"
              >
                <CheckCircle className="w-12 h-12 text-emerald-500" />
              </motion.div>
              <h2 className="text-2xl font-bold text-white mb-2">Trip Completed!</h2>
              <div className="text-4xl font-bold text-emerald-400 mb-4">
                +${(currentTrip.estimatedFare * 0.80).toFixed(2)}
              </div>
              <p className="text-slate-400 mb-6">You earned on this trip</p>
              <div className="flex justify-center gap-4 text-sm text-slate-400">
                <span>{currentTrip.estimatedDistance} mi</span>
                <span>-</span>
                <span>{currentTrip.estimatedDuration} min</span>
              </div>
            </div>
          </motion.div>
        )}
      </main>

      {/* Side Menu */}
      <AnimatePresence>
        {showMenu && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/60 z-50"
              onClick={() => setShowMenu(false)}
            />
            <motion.div
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "spring", damping: 25 }}
              className="fixed left-0 top-0 bottom-0 w-80 bg-slate-900 z-50 overflow-y-auto"
            >
              {/* Profile Header */}
              <div className="p-6 bg-gradient-to-br from-emerald-900/50 to-slate-900">
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-16 h-16 rounded-full bg-gradient-to-br from-emerald-500 to-emerald-700 flex items-center justify-center text-white text-2xl font-bold">
                    JD
                  </div>
                  <div>
                    <div className="font-semibold text-white text-lg">John Driver</div>
                    <div className="flex items-center gap-1 text-sm text-slate-300">
                      <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                      {earnings.rating} rating
                    </div>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-slate-800/50 rounded-lg p-3 text-center">
                    <div className="text-xl font-bold text-emerald-400">${earnings.thisWeek.toFixed(0)}</div>
                    <div className="text-xs text-slate-400">This Week</div>
                  </div>
                  <div className="bg-slate-800/50 rounded-lg p-3 text-center">
                    <div className="text-xl font-bold text-white">{earnings.tripsThisWeek}</div>
                    <div className="text-xs text-slate-400">Trips</div>
                  </div>
                </div>
              </div>

              {/* Menu Items */}
              <div className="py-4">
                {menuItems.map((item, index) => (
                  <button
                    key={index}
                    onClick={item.action}
                    className="w-full flex items-center gap-4 px-6 py-3 text-slate-300 hover:bg-slate-800 hover:text-white transition-colors"
                  >
                    {item.icon}
                    <span>{item.label}</span>
                  </button>
                ))}
              </div>

              {/* Logout */}
              <div className="p-4 border-t border-slate-800">
                <Link href="/">
                  <Button variant="outline" className="w-full border-slate-700 text-slate-300 hover:bg-slate-800">
                    <LogOut className="w-4 h-4 mr-2" />
                    Sign Out
                  </Button>
                </Link>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Earnings Modal */}
      <AnimatePresence>
        {showEarnings && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/60 z-50"
              onClick={() => setShowEarnings(false)}
            />
            <motion.div
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{ type: "spring", damping: 25 }}
              className="fixed bottom-0 left-0 right-0 bg-slate-900 rounded-t-3xl z-50 max-h-[85vh] overflow-y-auto"
            >
              <div className="p-6">
                <div className="w-12 h-1 bg-slate-700 rounded-full mx-auto mb-6" />
                <h2 className="text-xl font-bold text-white mb-6">Earnings</h2>

                {/* Period Stats */}
                <div className="grid grid-cols-3 gap-4 mb-6">
                  <div className="bg-slate-800/50 rounded-xl p-4 text-center">
                    <div className="text-2xl font-bold text-emerald-400">${earnings.today.toFixed(2)}</div>
                    <div className="text-xs text-slate-400">Today</div>
                  </div>
                  <div className="bg-slate-800/50 rounded-xl p-4 text-center">
                    <div className="text-2xl font-bold text-white">${earnings.thisWeek.toFixed(2)}</div>
                    <div className="text-xs text-slate-400">This Week</div>
                  </div>
                  <div className="bg-slate-800/50 rounded-xl p-4 text-center">
                    <div className="text-2xl font-bold text-white">${earnings.thisMonth.toFixed(2)}</div>
                    <div className="text-xs text-slate-400">This Month</div>
                  </div>
                </div>

                {/* Performance Stats */}
                <h3 className="text-sm font-semibold text-slate-400 mb-3">PERFORMANCE</h3>
                <div className="space-y-3 mb-6">
                  <div className="flex items-center justify-between p-3 bg-slate-800/50 rounded-lg">
                    <span className="text-slate-300">Acceptance Rate</span>
                    <span className="font-semibold text-emerald-400">{earnings.acceptance}%</span>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-slate-800/50 rounded-lg">
                    <span className="text-slate-300">Cancellation Rate</span>
                    <span className="font-semibold text-white">{earnings.cancellation}%</span>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-slate-800/50 rounded-lg">
                    <span className="text-slate-300">Rating</span>
                    <div className="flex items-center gap-1">
                      <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                      <span className="font-semibold text-white">{earnings.rating}</span>
                    </div>
                  </div>
                </div>

                <Button
                  onClick={() => setShowEarnings(false)}
                  className="w-full bg-emerald-600 hover:bg-emerald-700 text-white"
                >
                  Close
                </Button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  )
}
