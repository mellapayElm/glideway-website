"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { 
  MapPin, Navigation, Car, Clock, DollarSign, Star, Phone, MessageCircle,
  Power, TrendingUp, Wallet, Calendar, ChevronRight, ChevronUp, ChevronDown,
  User, Bell, Check, X, AlertCircle, Zap, Navigation2, Route, Fuel,
  Home, Settings, FileText, HelpCircle, LogOut, Loader2, Send, Menu,
  Play, Pause, CircleDollarSign, Target, Award, Timer, Activity, BarChart3
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { GlidewayLogo } from "@/components/glideway-logo"

type DriverView = "home" | "trip" | "earnings" | "performance" | "settings"
type DriverStatus = "offline" | "online" | "busy"

interface TripRequest {
  id: string
  rider: string
  rating: number
  pickup: string
  dropoff: string
  distance: string
  duration: string
  fare: number
  driverPayout: number
  surge: number
}

export default function DriverDashboard() {
  const [currentView, setCurrentView] = useState<DriverView>("home")
  const [driverStatus, setDriverStatus] = useState<DriverStatus>("offline")
  const [showMenu, setShowMenu] = useState(false)
  const [incomingTrip, setIncomingTrip] = useState<TripRequest | null>(null)
  const [currentTrip, setCurrentTrip] = useState<TripRequest | null>(null)
  const [tripPhase, setTripPhase] = useState<"none" | "toPickup" | "inProgress" | "completed">("none")
  const [acceptCountdown, setAcceptCountdown] = useState(15)
  const [driverLocation, setDriverLocation] = useState({ lat: 34.0522, lng: -118.2437, heading: 0 })
  const [todayStats, setTodayStats] = useState({
    earnings: 245.80,
    trips: 12,
    online: "6h 32m",
    rating: 4.95,
    acceptance: 94,
    cancellation: 2
  })

  // Simulate incoming trip requests when online
  useEffect(() => {
    if (driverStatus === "online" && !incomingTrip && !currentTrip) {
      const timeout = setTimeout(() => {
        setIncomingTrip({
          id: `GW-${10000 + Math.floor(Math.random() * 1000)}`,
          rider: "Sarah M.",
          rating: 4.8,
          pickup: "123 Main St, Los Angeles, CA",
          dropoff: "LAX Airport Terminal 4",
          distance: "8.2 mi",
          duration: "22 min",
          fare: 28.50,
          driverPayout: 22.80,
          surge: 1.0
        })
        setAcceptCountdown(15)
      }, 5000)
      return () => clearTimeout(timeout)
    }
  }, [driverStatus, incomingTrip, currentTrip])

  // Countdown for trip acceptance
  useEffect(() => {
    if (incomingTrip && acceptCountdown > 0) {
      const interval = setInterval(() => {
        setAcceptCountdown(prev => prev - 1)
      }, 1000)
      return () => clearInterval(interval)
    } else if (acceptCountdown === 0 && incomingTrip) {
      setIncomingTrip(null)
    }
  }, [incomingTrip, acceptCountdown])

  // Simulate driver location updates during trip
  useEffect(() => {
    if (tripPhase === "toPickup" || tripPhase === "inProgress") {
      const interval = setInterval(() => {
        setDriverLocation(prev => ({
          lat: prev.lat + (Math.random() - 0.5) * 0.002,
          lng: prev.lng + (Math.random() - 0.5) * 0.002,
          heading: prev.heading + (Math.random() - 0.5) * 15
        }))
      }, 2000)
      return () => clearInterval(interval)
    }
  }, [tripPhase])

  const acceptTrip = () => {
    if (incomingTrip) {
      setCurrentTrip(incomingTrip)
      setIncomingTrip(null)
      setDriverStatus("busy")
      setTripPhase("toPickup")
      setCurrentView("trip")
    }
  }

  const declineTrip = () => {
    setIncomingTrip(null)
  }

  const arrivedAtPickup = () => {
    setTripPhase("inProgress")
  }

  const completeTrip = () => {
    setTripPhase("completed")
    setTodayStats(prev => ({
      ...prev,
      earnings: prev.earnings + (currentTrip?.driverPayout || 0),
      trips: prev.trips + 1
    }))
    setTimeout(() => {
      setCurrentTrip(null)
      setTripPhase("none")
      setDriverStatus("online")
      setCurrentView("home")
    }, 3000)
  }

  const toggleOnline = () => {
    if (driverStatus === "offline") {
      setDriverStatus("online")
    } else if (driverStatus === "online") {
      setDriverStatus("offline")
    }
  }

  const menuItems = [
    { icon: <Home className="w-5 h-5" />, label: "Dashboard", view: "home" as DriverView },
    { icon: <Wallet className="w-5 h-5" />, label: "Earnings", view: "earnings" as DriverView },
    { icon: <BarChart3 className="w-5 h-5" />, label: "Performance", view: "performance" as DriverView },
    { icon: <FileText className="w-5 h-5" />, label: "Documents", view: "settings" as DriverView },
    { icon: <Settings className="w-5 h-5" />, label: "Settings", view: "settings" as DriverView },
  ]

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-[#0a0a0a]/95 backdrop-blur-lg border-b border-gray-800">
        <div className="flex items-center justify-between px-4 py-3">
          <button onClick={() => setShowMenu(true)} className="p-2 hover:bg-gray-800 rounded-lg">
            <Menu className="w-6 h-6" />
          </button>
          
          <div className="flex items-center gap-2">
            <GlidewayLogo className="w-8 h-8" />
            <span className="font-bold text-lg">Glide<span className="text-emerald-500">Way</span></span>
            <span className="px-2 py-0.5 bg-emerald-500/20 text-emerald-400 text-xs font-medium rounded">DRIVER</span>
          </div>
          
          <div className="flex items-center gap-2">
            <button className="p-2 hover:bg-gray-800 rounded-lg relative">
              <Bell className="w-6 h-6" />
              <span className="absolute top-1 right-1 w-2 h-2 bg-emerald-500 rounded-full" />
            </button>
          </div>
        </div>

        {/* Status Bar */}
        <div className="px-4 pb-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className={`w-3 h-3 rounded-full ${
              driverStatus === "online" ? "bg-emerald-500 animate-pulse" :
              driverStatus === "busy" ? "bg-yellow-500" :
              "bg-gray-500"
            }`} />
            <span className="text-sm font-medium capitalize">{driverStatus}</span>
            {driverStatus !== "offline" && (
              <span className="text-xs text-gray-500">| {todayStats.online}</span>
            )}
          </div>
          <button
            onClick={toggleOnline}
            disabled={driverStatus === "busy"}
            className={`flex items-center gap-2 px-4 py-2 rounded-full font-medium text-sm transition-all ${
              driverStatus === "offline" 
                ? "bg-emerald-500 text-black hover:bg-emerald-400"
                : driverStatus === "online"
                ? "bg-red-500/20 text-red-400 border border-red-500/50 hover:bg-red-500/30"
                : "bg-gray-700 text-gray-400 cursor-not-allowed"
            }`}
          >
            <Power className="w-4 h-4" />
            {driverStatus === "offline" ? "Go Online" : driverStatus === "online" ? "Go Offline" : "In Trip"}
          </button>
        </div>
      </header>

      {/* Slide-out Menu */}
      <AnimatePresence>
        {showMenu && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowMenu(false)}
              className="fixed inset-0 bg-black/60 z-50"
            />
            <motion.div
              initial={{ x: -300 }}
              animate={{ x: 0 }}
              exit={{ x: -300 }}
              className="fixed left-0 top-0 bottom-0 w-72 bg-[#111] z-50 border-r border-gray-800"
            >
              <div className="p-6 border-b border-gray-800">
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 rounded-full bg-emerald-500/20 flex items-center justify-center text-xl font-bold text-emerald-500">
                    JD
                  </div>
                  <div>
                    <h3 className="font-semibold text-white">John Driver</h3>
                    <div className="flex items-center gap-1 text-sm">
                      <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                      <span className="text-white">{todayStats.rating}</span>
                    </div>
                    <p className="text-xs text-gray-500">Toyota Camry 2022</p>
                  </div>
                </div>
              </div>
              
              <nav className="p-4 space-y-1">
                {menuItems.map((item, i) => (
                  <button
                    key={i}
                    onClick={() => { setCurrentView(item.view); setShowMenu(false); }}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                      currentView === item.view 
                        ? "bg-emerald-500/20 text-emerald-400" 
                        : "text-gray-300 hover:bg-gray-800 hover:text-white"
                    }`}
                  >
                    {item.icon}
                    <span>{item.label}</span>
                  </button>
                ))}
              </nav>

              <div className="absolute bottom-20 left-4 right-4">
                <Card className="bg-gradient-to-br from-emerald-500/20 to-blue-500/20 border-emerald-500/30">
                  <CardContent className="p-4">
                    <p className="text-emerald-400 font-medium mb-1">Weekly Bonus</p>
                    <p className="text-white text-2xl font-bold">$125</p>
                    <p className="text-xs text-gray-400 mt-1">Complete 50 trips to earn</p>
                    <div className="mt-2 h-2 bg-gray-800 rounded-full overflow-hidden">
                      <div className="h-full bg-emerald-500 rounded-full" style={{ width: "76%" }} />
                    </div>
                    <p className="text-xs text-gray-500 mt-1">38/50 trips completed</p>
                  </CardContent>
                </Card>
              </div>

              <button 
                onClick={() => setShowMenu(false)}
                className="absolute bottom-4 left-4 right-4 flex items-center justify-center gap-2 py-3 text-red-400 hover:bg-red-500/10 rounded-lg transition-colors"
              >
                <LogOut className="w-5 h-5" />
                Sign Out
              </button>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Incoming Trip Request Modal */}
      <AnimatePresence>
        {incomingTrip && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/80 z-50 flex items-end justify-center"
          >
            <motion.div
              initial={{ y: 300 }}
              animate={{ y: 0 }}
              exit={{ y: 300 }}
              className="w-full max-w-lg bg-[#111] rounded-t-3xl border-t border-gray-800"
            >
              {/* Countdown Ring */}
              <div className="flex justify-center -mt-12">
                <div className="relative w-24 h-24">
                  <svg className="w-24 h-24 -rotate-90">
                    <circle cx="48" cy="48" r="44" fill="none" stroke="#1f2937" strokeWidth="8" />
                    <circle 
                      cx="48" cy="48" r="44" fill="none" 
                      stroke="#10B981" strokeWidth="8"
                      strokeDasharray={276.46}
                      strokeDashoffset={276.46 * (1 - acceptCountdown / 15)}
                      className="transition-all duration-1000"
                    />
                  </svg>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-2xl font-bold text-white">{acceptCountdown}</span>
                  </div>
                </div>
              </div>

              <div className="p-6 space-y-4">
                <div className="text-center">
                  <p className="text-emerald-500 font-medium text-sm uppercase">New Trip Request</p>
                  <div className="flex items-center justify-center gap-2 mt-2">
                    <span className="text-3xl font-bold text-white">${incomingTrip.driverPayout.toFixed(2)}</span>
                    {incomingTrip.surge > 1 && (
                      <span className="px-2 py-1 bg-yellow-500/20 text-yellow-400 text-xs font-medium rounded">
                        {incomingTrip.surge}x Surge
                      </span>
                    )}
                  </div>
                  <p className="text-gray-500 text-sm mt-1">{incomingTrip.distance} • {incomingTrip.duration}</p>
                </div>

                {/* Rider Info */}
                <div className="flex items-center justify-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-gray-800 flex items-center justify-center text-lg font-bold text-white">
                    {incomingTrip.rider.charAt(0)}
                  </div>
                  <div>
                    <p className="font-medium text-white">{incomingTrip.rider}</p>
                    <div className="flex items-center gap-1">
                      <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                      <span className="text-sm text-gray-400">{incomingTrip.rating}</span>
                    </div>
                  </div>
                </div>

                {/* Route */}
                <div className="p-4 bg-[#0a0a0a] rounded-xl space-y-3">
                  <div className="flex items-start gap-3">
                    <div className="w-3 h-3 rounded-full bg-emerald-500 mt-1" />
                    <div>
                      <p className="text-xs text-gray-500">PICKUP</p>
                      <p className="text-white text-sm">{incomingTrip.pickup}</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-3 h-3 rounded-full bg-red-500 mt-1" />
                    <div>
                      <p className="text-xs text-gray-500">DROP-OFF</p>
                      <p className="text-white text-sm">{incomingTrip.dropoff}</p>
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex gap-3">
                  <Button
                    onClick={declineTrip}
                    variant="outline"
                    className="flex-1 h-14 border-gray-700 text-white hover:bg-gray-800"
                  >
                    <X className="w-5 h-5 mr-2" />
                    Decline
                  </Button>
                  <Button
                    onClick={acceptTrip}
                    className="flex-1 h-14 bg-emerald-500 text-black font-bold hover:bg-emerald-400"
                  >
                    <Check className="w-5 h-5 mr-2" />
                    Accept
                  </Button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Content */}
      <main className="pt-28 pb-24">
        <AnimatePresence mode="wait">
          {/* HOME VIEW */}
          {currentView === "home" && (
            <motion.div
              key="home"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="p-4 space-y-4"
            >
              {/* Today's Stats */}
              <div className="grid grid-cols-2 gap-3">
                <Card className="bg-gradient-to-br from-emerald-500/20 to-emerald-500/5 border-emerald-500/30">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between mb-2">
                      <CircleDollarSign className="w-5 h-5 text-emerald-500" />
                      <TrendingUp className="w-4 h-4 text-emerald-400" />
                    </div>
                    <p className="text-2xl font-bold text-white">${todayStats.earnings.toFixed(2)}</p>
                    <p className="text-xs text-gray-400">Today&apos;s Earnings</p>
                  </CardContent>
                </Card>

                <Card className="bg-[#111] border-gray-800">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between mb-2">
                      <Car className="w-5 h-5 text-blue-500" />
                      <span className="text-xs text-emerald-400">+3 vs avg</span>
                    </div>
                    <p className="text-2xl font-bold text-white">{todayStats.trips}</p>
                    <p className="text-xs text-gray-400">Trips Today</p>
                  </CardContent>
                </Card>

                <Card className="bg-[#111] border-gray-800">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between mb-2">
                      <Star className="w-5 h-5 text-yellow-500" />
                    </div>
                    <p className="text-2xl font-bold text-white">{todayStats.rating}</p>
                    <p className="text-xs text-gray-400">Rating</p>
                  </CardContent>
                </Card>

                <Card className="bg-[#111] border-gray-800">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between mb-2">
                      <Target className="w-5 h-5 text-purple-500" />
                    </div>
                    <p className="text-2xl font-bold text-white">{todayStats.acceptance}%</p>
                    <p className="text-xs text-gray-400">Acceptance Rate</p>
                  </CardContent>
                </Card>
              </div>

              {/* Map / Waiting Screen */}
              <Card className="bg-[#111] border-gray-800 overflow-hidden">
                <div className="aspect-video bg-[#0a0a0a] relative">
                  {driverStatus === "offline" ? (
                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                      <Power className="w-12 h-12 text-gray-600 mb-3" />
                      <p className="text-gray-500 font-medium">You&apos;re Offline</p>
                      <p className="text-gray-600 text-sm">Go online to start receiving trips</p>
                    </div>
                  ) : (
                    <>
                      {/* Simulated map with driver location */}
                      <div className="absolute inset-0 p-4">
                        <div className="absolute top-4 left-4 px-3 py-1.5 bg-emerald-500 text-black text-xs font-medium rounded-full flex items-center gap-1.5">
                          <span className="w-2 h-2 bg-black rounded-full animate-pulse" />
                          Live GPS
                        </div>
                        <div className="absolute top-4 right-4 p-2 bg-[#111] rounded-lg border border-gray-800 text-xs space-y-0.5">
                          <p className="text-gray-500">Lat: {driverLocation.lat.toFixed(4)}</p>
                          <p className="text-gray-500">Lng: {driverLocation.lng.toFixed(4)}</p>
                          <p className="text-emerald-400">Heading: {Math.round(driverLocation.heading)}°</p>
                        </div>
                        <div className="absolute inset-0 flex items-center justify-center">
                          <div className="relative">
                            <div className="w-12 h-12 rounded-full bg-emerald-500 flex items-center justify-center animate-pulse">
                              <Navigation2 className="w-6 h-6 text-black" style={{ transform: `rotate(${driverLocation.heading}deg)` }} />
                            </div>
                            <div className="absolute -inset-4 border-2 border-emerald-500/30 rounded-full animate-ping" />
                          </div>
                        </div>
                      </div>
                      <div className="absolute bottom-4 left-4 right-4">
                        <div className="p-3 bg-[#111]/90 backdrop-blur rounded-lg border border-gray-800">
                          <p className="text-center text-gray-400 text-sm">
                            <Loader2 className="w-4 h-4 inline mr-2 animate-spin" />
                            Searching for trips near you...
                          </p>
                        </div>
                      </div>
                    </>
                  )}
                </div>
              </Card>

              {/* Quick Stats */}
              <div className="grid grid-cols-3 gap-3">
                <div className="p-3 bg-[#111] rounded-xl border border-gray-800 text-center">
                  <Timer className="w-5 h-5 text-gray-500 mx-auto mb-1" />
                  <p className="text-white font-medium">{todayStats.online}</p>
                  <p className="text-xs text-gray-500">Online Time</p>
                </div>
                <div className="p-3 bg-[#111] rounded-xl border border-gray-800 text-center">
                  <Route className="w-5 h-5 text-gray-500 mx-auto mb-1" />
                  <p className="text-white font-medium">48.2 mi</p>
                  <p className="text-xs text-gray-500">Distance</p>
                </div>
                <div className="p-3 bg-[#111] rounded-xl border border-gray-800 text-center">
                  <Fuel className="w-5 h-5 text-gray-500 mx-auto mb-1" />
                  <p className="text-white font-medium">$12.40</p>
                  <p className="text-xs text-gray-500">Est. Fuel</p>
                </div>
              </div>

              {/* Recent Trips */}
              <div>
                <h3 className="text-sm font-medium text-gray-400 mb-3">RECENT TRIPS</h3>
                <div className="space-y-2">
                  {[
                    { rider: "Sarah M.", pickup: "Downtown LA", dropoff: "LAX", payout: 22.80, time: "1h ago" },
                    { rider: "Mike T.", pickup: "Santa Monica", dropoff: "Hollywood", payout: 18.50, time: "3h ago" },
                  ].map((trip, i) => (
                    <Card key={i} className="bg-[#111] border-gray-800">
                      <CardContent className="p-3 flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center text-sm font-medium text-white">
                            {trip.rider.charAt(0)}
                          </div>
                          <div>
                            <p className="text-white font-medium text-sm">{trip.pickup} → {trip.dropoff}</p>
                            <p className="text-xs text-gray-500">{trip.rider} • {trip.time}</p>
                          </div>
                        </div>
                        <p className="text-emerald-500 font-bold">+${trip.payout.toFixed(2)}</p>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            </motion.div>
          )}

          {/* ACTIVE TRIP VIEW */}
          {currentView === "trip" && currentTrip && (
            <motion.div
              key="trip"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="h-[calc(100vh-180px)]"
            >
              {/* Map */}
              <div className="h-1/2 bg-[#111] relative">
                <div className="absolute inset-4 rounded-xl border border-gray-800 bg-[#0a0a0a] overflow-hidden">
                  <div className="absolute top-4 left-4 px-3 py-1.5 bg-emerald-500 text-black text-xs font-medium rounded-full flex items-center gap-1.5 z-10">
                    <span className="w-2 h-2 bg-black rounded-full animate-pulse" />
                    Navigation Active
                  </div>
                  
                  {/* GPS Data */}
                  <div className="absolute top-4 right-4 p-3 bg-[#111] rounded-lg border border-gray-800 text-xs space-y-1 z-10">
                    <p className="text-gray-400">Speed: <span className="text-emerald-400">32 mph</span></p>
                    <p className="text-gray-400">ETA: <span className="text-white font-medium">4 min</span></p>
                    <p className="text-gray-400">Distance: <span className="text-white">1.2 mi</span></p>
                  </div>

                  {/* Simulated route */}
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="relative">
                      {/* Driver */}
                      <div className="absolute -left-16 w-8 h-8 rounded-full bg-emerald-500 flex items-center justify-center">
                        <Car className="w-4 h-4 text-black" />
                      </div>
                      {/* Route line */}
                      <div className="w-32 h-1 bg-gradient-to-r from-emerald-500 to-gray-600" />
                      {/* Destination */}
                      <div className={`absolute -right-4 w-8 h-8 rounded-full ${tripPhase === "toPickup" ? "bg-emerald-500" : "bg-red-500"} flex items-center justify-center`}>
                        <MapPin className="w-4 h-4 text-black" />
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Trip Details */}
              <div className="p-4 space-y-4">
                {/* Phase Indicator */}
                <div className="text-center">
                  <p className={`font-medium text-sm uppercase ${
                    tripPhase === "toPickup" ? "text-emerald-500" :
                    tripPhase === "inProgress" ? "text-blue-500" :
                    "text-yellow-500"
                  }`}>
                    {tripPhase === "toPickup" ? "Heading to Pickup" :
                     tripPhase === "inProgress" ? "Trip in Progress" :
                     "Trip Completed"}
                  </p>
                  <p className="text-xl font-bold text-white mt-1">
                    {tripPhase === "toPickup" ? "4 min to pickup" : 
                     tripPhase === "inProgress" ? "18 min remaining" :
                     "Trip Complete!"}
                  </p>
                </div>

                {/* Rider Card */}
                <Card className="bg-[#111] border-gray-800">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-full bg-gray-800 flex items-center justify-center text-lg font-bold text-white">
                          {currentTrip.rider.charAt(0)}
                        </div>
                        <div>
                          <p className="font-semibold text-white">{currentTrip.rider}</p>
                          <div className="flex items-center gap-1">
                            <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                            <span className="text-sm text-gray-400">{currentTrip.rating}</span>
                          </div>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <button className="w-10 h-10 rounded-full bg-emerald-500/20 flex items-center justify-center text-emerald-500">
                          <Phone className="w-5 h-5" />
                        </button>
                        <button className="w-10 h-10 rounded-full bg-emerald-500/20 flex items-center justify-center text-emerald-500">
                          <MessageCircle className="w-5 h-5" />
                        </button>
                      </div>
                    </div>

                    {/* Route */}
                    <div className="p-3 bg-[#0a0a0a] rounded-lg space-y-2">
                      <div className="flex items-start gap-3">
                        <div className="w-2 h-2 rounded-full bg-emerald-500 mt-1.5" />
                        <div>
                          <p className="text-xs text-gray-500">PICKUP</p>
                          <p className="text-white text-sm">{currentTrip.pickup}</p>
                        </div>
                      </div>
                      <div className="flex items-start gap-3">
                        <div className="w-2 h-2 rounded-full bg-red-500 mt-1.5" />
                        <div>
                          <p className="text-xs text-gray-500">DROP-OFF</p>
                          <p className="text-white text-sm">{currentTrip.dropoff}</p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Earnings Preview */}
                <div className="flex items-center justify-between p-4 bg-emerald-500/10 border border-emerald-500/30 rounded-xl">
                  <div>
                    <p className="text-xs text-gray-400">YOUR PAYOUT</p>
                    <p className="text-2xl font-bold text-emerald-400">${currentTrip.driverPayout.toFixed(2)}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-gray-400">{currentTrip.distance} • {currentTrip.duration}</p>
                    <p className="text-sm text-gray-500">Trip #{currentTrip.id}</p>
                  </div>
                </div>

                {/* Action Button */}
                {tripPhase === "toPickup" && (
                  <Button 
                    onClick={arrivedAtPickup}
                    className="w-full h-14 bg-emerald-500 text-black font-bold text-lg hover:bg-emerald-400"
                  >
                    <MapPin className="w-5 h-5 mr-2" />
                    Arrived at Pickup
                  </Button>
                )}
                {tripPhase === "inProgress" && (
                  <Button 
                    onClick={completeTrip}
                    className="w-full h-14 bg-emerald-500 text-black font-bold text-lg hover:bg-emerald-400"
                  >
                    <Check className="w-5 h-5 mr-2" />
                    Complete Trip
                  </Button>
                )}
                {tripPhase === "completed" && (
                  <div className="text-center p-4 bg-emerald-500/20 rounded-xl border border-emerald-500/50">
                    <Check className="w-10 h-10 text-emerald-500 mx-auto mb-2" />
                    <p className="text-emerald-400 font-bold">Trip Completed!</p>
                    <p className="text-gray-400 text-sm">+${currentTrip.driverPayout.toFixed(2)} added to your earnings</p>
                  </div>
                )}
              </div>
            </motion.div>
          )}

          {/* EARNINGS VIEW */}
          {currentView === "earnings" && (
            <motion.div
              key="earnings"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="p-4 space-y-4"
            >
              <h2 className="text-xl font-bold text-white">Earnings</h2>

              {/* Period Selector */}
              <div className="flex gap-2 p-1 bg-[#111] rounded-xl">
                {["Today", "Week", "Month"].map((period) => (
                  <button 
                    key={period}
                    className={`flex-1 py-2 rounded-lg text-sm font-medium ${
                      period === "Today" 
                        ? "bg-emerald-500 text-black" 
                        : "text-gray-400 hover:text-white"
                    }`}
                  >
                    {period}
                  </button>
                ))}
              </div>

              {/* Earnings Summary */}
              <Card className="bg-gradient-to-br from-emerald-500/20 to-emerald-600/10 border-emerald-500/30">
                <CardContent className="p-6 text-center">
                  <p className="text-gray-400 text-sm">Total Earnings</p>
                  <p className="text-4xl font-bold text-white mt-1">${todayStats.earnings.toFixed(2)}</p>
                  <p className="text-emerald-400 text-sm mt-2">+$42.50 from yesterday</p>
                </CardContent>
              </Card>

              {/* Breakdown */}
              <Card className="bg-[#111] border-gray-800">
                <CardHeader className="pb-2">
                  <CardTitle className="text-white text-lg">Breakdown</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex justify-between items-center py-2 border-b border-gray-800">
                    <span className="text-gray-400">Trip Earnings</span>
                    <span className="text-white font-medium">$198.40</span>
                  </div>
                  <div className="flex justify-between items-center py-2 border-b border-gray-800">
                    <span className="text-gray-400">Tips</span>
                    <span className="text-white font-medium">$32.00</span>
                  </div>
                  <div className="flex justify-between items-center py-2 border-b border-gray-800">
                    <span className="text-gray-400">Bonuses</span>
                    <span className="text-emerald-400 font-medium">+$15.40</span>
                  </div>
                  <div className="flex justify-between items-center py-2">
                    <span className="text-white font-medium">Net Earnings</span>
                    <span className="text-emerald-400 font-bold text-lg">${todayStats.earnings.toFixed(2)}</span>
                  </div>
                </CardContent>
              </Card>

              {/* Cash Out */}
              <Button className="w-full h-12 bg-emerald-500 text-black font-semibold">
                <Wallet className="w-5 h-5 mr-2" />
                Cash Out - Available: ${(todayStats.earnings * 0.85).toFixed(2)}
              </Button>
            </motion.div>
          )}

          {/* PERFORMANCE VIEW */}
          {currentView === "performance" && (
            <motion.div
              key="performance"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="p-4 space-y-4"
            >
              <h2 className="text-xl font-bold text-white">Performance</h2>

              <div className="grid grid-cols-2 gap-3">
                <Card className="bg-[#111] border-gray-800">
                  <CardContent className="p-4 text-center">
                    <Star className="w-8 h-8 text-yellow-500 mx-auto mb-2" />
                    <p className="text-2xl font-bold text-white">{todayStats.rating}</p>
                    <p className="text-xs text-gray-400">Rating</p>
                  </CardContent>
                </Card>

                <Card className="bg-[#111] border-gray-800">
                  <CardContent className="p-4 text-center">
                    <Target className="w-8 h-8 text-emerald-500 mx-auto mb-2" />
                    <p className="text-2xl font-bold text-white">{todayStats.acceptance}%</p>
                    <p className="text-xs text-gray-400">Acceptance</p>
                  </CardContent>
                </Card>

                <Card className="bg-[#111] border-gray-800">
                  <CardContent className="p-4 text-center">
                    <X className="w-8 h-8 text-red-500 mx-auto mb-2" />
                    <p className="text-2xl font-bold text-white">{todayStats.cancellation}%</p>
                    <p className="text-xs text-gray-400">Cancellation</p>
                  </CardContent>
                </Card>

                <Card className="bg-[#111] border-gray-800">
                  <CardContent className="p-4 text-center">
                    <Award className="w-8 h-8 text-purple-500 mx-auto mb-2" />
                    <p className="text-2xl font-bold text-white">Gold</p>
                    <p className="text-xs text-gray-400">Driver Tier</p>
                  </CardContent>
                </Card>
              </div>

              {/* Recent Reviews */}
              <Card className="bg-[#111] border-gray-800">
                <CardHeader>
                  <CardTitle className="text-white text-lg">Recent Reviews</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {[
                    { rider: "Sarah M.", rating: 5, comment: "Great driver, very professional!", date: "Today" },
                    { rider: "Mike T.", rating: 5, comment: "Smooth ride, clean car.", date: "Yesterday" },
                    { rider: "Emma W.", rating: 4, comment: "Good experience overall.", date: "2 days ago" },
                  ].map((review, i) => (
                    <div key={i} className="p-3 bg-[#0a0a0a] rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <p className="text-white font-medium">{review.rider}</p>
                        <div className="flex items-center gap-1">
                          {[...Array(5)].map((_, j) => (
                            <Star key={j} className={`w-3 h-3 ${j < review.rating ? "text-yellow-500 fill-yellow-500" : "text-gray-700"}`} />
                          ))}
                        </div>
                      </div>
                      <p className="text-gray-400 text-sm">&quot;{review.comment}&quot;</p>
                      <p className="text-gray-600 text-xs mt-1">{review.date}</p>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 bg-[#111] border-t border-gray-800 z-40">
        <div className="flex items-center justify-around py-2">
          {[
            { icon: <Home className="w-6 h-6" />, label: "Home", view: "home" as DriverView },
            { icon: <Wallet className="w-6 h-6" />, label: "Earnings", view: "earnings" as DriverView },
            { icon: <Activity className="w-6 h-6" />, label: "Activity", view: "performance" as DriverView },
            { icon: <User className="w-6 h-6" />, label: "Account", view: "settings" as DriverView },
          ].map((item) => (
            <button
              key={item.label}
              onClick={() => setCurrentView(item.view)}
              className={`flex flex-col items-center py-2 px-4 ${
                currentView === item.view ? "text-emerald-500" : "text-gray-500"
              }`}
            >
              {item.icon}
              <span className="text-xs mt-1">{item.label}</span>
            </button>
          ))}
        </div>
      </nav>
    </div>
  )
}
