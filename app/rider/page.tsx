"use client"

import { useState, useEffect, useCallback } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { 
  MapPin, Navigation, Car, Clock, DollarSign, Star, Phone, MessageCircle,
  CreditCard, Shield, History, Settings, User, Bell, ChevronRight, ChevronDown,
  Plus, Search, X, Check, AlertCircle, Zap, Users, Crown, Truck, Heart,
  Home, Calendar, Gift, HelpCircle, LogOut, Loader2, Send, Menu, Map,
  Navigation2, Compass, Route, Fuel, Timer, TrendingUp, Activity, Radio,
  Wifi, Signal, Battery, Cloud, Sun, CloudRain, Wind, Thermometer, Eye,
  Target, Crosshair, Locate, RotateCw, ChevronUp, Info, AlertTriangle,
  Building, Plane, Music, PartyPopper, Ticket, Coffee, ShoppingBag
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { GlidewayLogo } from "@/components/glideway-logo"
import Link from "next/link"
import { BookingMapPanel } from "@/components/booking-map-panel"

type AppView = "home" | "booking" | "tracking" | "history" | "profile" | "support" | "map-details"
type RideType = "economy" | "comfort" | "premium" | "xl"

interface GPSData {
  lat: number
  lng: number
  accuracy: number
  speed: number
  heading: number
  altitude: number
  timestamp: number
}

interface RouteOption {
  id: string
  name: string
  distance: number
  duration: number
  trafficDelay: number
  tollCost: number
  fuelCost: number
  recommended: boolean
}

interface ZoneDemand {
  zone: string
  level: "low" | "normal" | "high" | "surge"
  multiplier: number
  waitTime: number
  driversNearby: number
}

interface WeatherData {
  condition: string
  temp: number
  humidity: number
  windSpeed: number
  icon: React.ReactNode
}

interface RideOption {
  id: RideType
  name: string
  icon: React.ReactNode
  description: string
  eta: string
  basePrice: number
  finalPrice: number
  priceRange: string
  multiplier: number
  savings: number
}

interface Location {
  lat: number
  lng: number
  address: string
  placeId?: string
  type?: "home" | "work" | "favorite" | "recent" | "airport" | "event"
}

interface PricingBreakdown {
  baseFare: number
  distanceFare: number
  timeFare: number
  surgePricing: number
  tollFees: number
  airportFee: number
  bookingFee: number
  driverPayout: number
  companyMargin: number
  taxes: number
  total: number
  competitorUber: number
  competitorLyft: number
  competitorTaxi: number
  yourSavings: number
}

export default function RiderApp() {
  const [currentView, setCurrentView] = useState<AppView>("home")
  const [pickup, setPickup] = useState("")
  const [dropoff, setDropoff] = useState("")
  const [selectedRide, setSelectedRide] = useState<RideType>("comfort")
  const [isBooking, setIsBooking] = useState(false)
  const [rideStatus, setRideStatus] = useState<"idle" | "searching" | "matched" | "arriving" | "inProgress" | "completed">("idle")
  const [showMenu, setShowMenu] = useState(false)
  const [showPricingDetails, setShowPricingDetails] = useState(false)
  const [showRouteOptions, setShowRouteOptions] = useState(false)
  const [showMapDetails, setShowMapDetails] = useState(false)
  const [selectedRouteId, setSelectedRouteId] = useState("fastest")

  // GPS State
  const [gpsData, setGpsData] = useState<GPSData>({
    lat: 34.0522, lng: -118.2437, accuracy: 5, speed: 0, heading: 0, altitude: 71, timestamp: Date.now()
  })
  const [gpsStatus, setGpsStatus] = useState<"acquiring" | "locked" | "weak" | "unavailable">("locked")
  const [isGpsRefreshing, setIsGpsRefreshing] = useState(false)

  // Driver & Trip Data
  const [driverLocation, setDriverLocation] = useState({ lat: 34.0522, lng: -118.2437, heading: 120, speed: 45 })
  const [tripDistance, setTripDistance] = useState(4.2)
  const [tripDuration, setTripDuration] = useState(12)
  const [trafficCondition, setTrafficCondition] = useState<"light" | "moderate" | "heavy">("moderate")
  const [eta, setEta] = useState(3)

  // Zone & Demand Data
  const [currentZone, setCurrentZone] = useState<ZoneDemand>({
    zone: "Downtown LA", level: "normal", multiplier: 1.0, waitTime: 3, driversNearby: 12
  })

  // Weather Data
  const [weather, setWeather] = useState<WeatherData>({
    condition: "Sunny", temp: 72, humidity: 45, windSpeed: 8, icon: <Sun className="w-5 h-5 text-yellow-400" />
  })

  // Messaging
  const [messages, setMessages] = useState<Array<{ from: "rider" | "driver" | "system"; text: string; time: string }>>([
    { from: "system", text: "Your driver is on the way.", time: "2:34 PM" }
  ])
  const [newMessage, setNewMessage] = useState("")

  // Address Suggestions
  const [showPickupSuggestions, setShowPickupSuggestions] = useState(false)
  const [showDropoffSuggestions, setShowDropoffSuggestions] = useState(false)

  // Route Options
  const [routeOptions, setRouteOptions] = useState<RouteOption[]>([
    { id: "fastest", name: "Fastest Route", distance: 4.2, duration: 12, trafficDelay: 2, tollCost: 0, fuelCost: 1.20, recommended: true },
    { id: "cheapest", name: "Cheapest Route", distance: 5.1, duration: 18, trafficDelay: 0, tollCost: 0, fuelCost: 1.45, recommended: false },
    { id: "shortest", name: "Shortest Route", distance: 3.8, duration: 15, trafficDelay: 5, tollCost: 2.50, fuelCost: 1.08, recommended: false },
  ])

  // Saved Locations
  const savedLocations: Location[] = [
    { lat: 34.0195, lng: -118.4912, address: "1234 Ocean Ave, Santa Monica", type: "home" },
    { lat: 34.0407, lng: -118.2468, address: "555 S Grand Ave, Los Angeles", type: "work" },
    { lat: 33.9425, lng: -118.4081, address: "LAX Airport Terminal 4", type: "airport" },
    { lat: 34.0736, lng: -118.2400, address: "Dodger Stadium", type: "event" },
  ]

  // Address Autocomplete Suggestions
  const addressSuggestions = [
    { address: "123 Main Street, Los Angeles, CA", placeId: "place1" },
    { address: "456 Broadway, Los Angeles, CA", placeId: "place2" },
    { address: "789 Sunset Blvd, Hollywood, CA", placeId: "place3" },
    { address: "321 Venice Beach Boardwalk, Venice, CA", placeId: "place4" },
    { address: "555 Downtown Center, Los Angeles, CA", placeId: "place5" },
  ]

  // Pricing Breakdown
  const [pricingBreakdown, setPricingBreakdown] = useState<PricingBreakdown>({
    baseFare: 2.50,
    distanceFare: 8.40, // $2/mile * 4.2 miles
    timeFare: 2.40, // $0.20/min * 12 min
    surgePricing: 0,
    tollFees: 0,
    airportFee: 0,
    bookingFee: 1.75,
    driverPayout: 12.04, // 80% of fare
    companyMargin: 3.01, // 20% of fare
    taxes: 1.20,
    total: 16.25,
    competitorUber: 18.50,
    competitorLyft: 17.80,
    competitorTaxi: 22.00,
    yourSavings: 2.25
  })

  // Simulate GPS updates
  useEffect(() => {
    const interval = setInterval(() => {
      setGpsData(prev => ({
        ...prev,
        lat: prev.lat + (Math.random() - 0.5) * 0.0001,
        lng: prev.lng + (Math.random() - 0.5) * 0.0001,
        accuracy: 3 + Math.random() * 5,
        timestamp: Date.now()
      }))
    }, 5000)
    return () => clearInterval(interval)
  }, [])

  // Simulate driver movement during ride
  useEffect(() => {
    if (rideStatus === "arriving" || rideStatus === "inProgress") {
      const interval = setInterval(() => {
        setDriverLocation(prev => ({
          lat: prev.lat + (Math.random() - 0.5) * 0.002,
          lng: prev.lng + (Math.random() - 0.5) * 0.002,
          heading: prev.heading + (Math.random() - 0.5) * 20,
          speed: 25 + Math.random() * 30
        }))
        setEta(prev => Math.max(0, prev - 0.5))
      }, 3000)
      return () => clearInterval(interval)
    }
  }, [rideStatus])

  // Simulate traffic updates
  useEffect(() => {
    const interval = setInterval(() => {
      const conditions: Array<"light" | "moderate" | "heavy"> = ["light", "moderate", "heavy"]
      setTrafficCondition(conditions[Math.floor(Math.random() * 3)])
    }, 30000)
    return () => clearInterval(interval)
  }, [])

  // Calculate pricing based on distance, time, and demand
  const calculatePricing = useCallback((distance: number, duration: number, rideType: RideType, surgeMultiplier: number) => {
    const baseRates = {
      economy: { base: 2.00, perMile: 1.50, perMin: 0.15 },
      comfort: { base: 2.50, perMile: 2.00, perMin: 0.20 },
      premium: { base: 5.00, perMile: 3.50, perMin: 0.35 },
      xl: { base: 3.50, perMile: 2.50, perMin: 0.25 }
    }
    
    const rates = baseRates[rideType]
    const baseFare = rates.base
    const distanceFare = distance * rates.perMile
    const timeFare = duration * rates.perMin
    const surgePricing = (baseFare + distanceFare + timeFare) * (surgeMultiplier - 1)
    const bookingFee = 1.75
    const subtotal = baseFare + distanceFare + timeFare + surgePricing + bookingFee
    const taxes = subtotal * 0.08
    const total = subtotal + taxes
    
    // GlideWay is 2-3% cheaper than competitors
    const uberPrice = total * 1.12
    const lyftPrice = total * 1.08
    const taxiPrice = total * 1.35
    
    return {
      baseFare,
      distanceFare,
      timeFare,
      surgePricing,
      tollFees: 0,
      airportFee: 0,
      bookingFee,
      driverPayout: total * 0.80,
      companyMargin: total * 0.20,
      taxes,
      total,
      competitorUber: uberPrice,
      competitorLyft: lyftPrice,
      competitorTaxi: taxiPrice,
      yourSavings: uberPrice - total
    }
  }, [])

  // Update pricing when inputs change
  useEffect(() => {
    if (pickup && dropoff) {
      const newPricing = calculatePricing(tripDistance, tripDuration, selectedRide, currentZone.multiplier)
      setPricingBreakdown(newPricing)
    }
  }, [pickup, dropoff, selectedRide, tripDistance, tripDuration, currentZone.multiplier, calculatePricing])

  const refreshGPS = async () => {
    setIsGpsRefreshing(true)
    setGpsStatus("acquiring")
    await new Promise(r => setTimeout(r, 2000))
    setGpsData(prev => ({
      ...prev,
      accuracy: 2 + Math.random() * 3,
      timestamp: Date.now()
    }))
    setGpsStatus("locked")
    setIsGpsRefreshing(false)
  }

  const rideOptions: RideOption[] = [
    { 
      id: "economy", name: "Economy", icon: <Car className="w-6 h-6" />, 
      description: "Affordable daily rides", eta: `${Math.round(currentZone.waitTime)}-${Math.round(currentZone.waitTime + 2)} min`, 
      basePrice: 14.50, finalPrice: calculatePricing(tripDistance, tripDuration, "economy", currentZone.multiplier).total,
      priceRange: "$12-15", multiplier: 1, savings: 2.05
    },
    { 
      id: "comfort", name: "Comfort", icon: <Crown className="w-6 h-6" />, 
      description: "Extra space & premium", eta: `${Math.round(currentZone.waitTime - 1)}-${Math.round(currentZone.waitTime + 1)} min`, 
      basePrice: 19.75, finalPrice: calculatePricing(tripDistance, tripDuration, "comfort", currentZone.multiplier).total,
      priceRange: "$18-22", multiplier: 1.35, savings: 2.85
    },
    { 
      id: "premium", name: "Premium", icon: <Star className="w-6 h-6" />, 
      description: "Luxury vehicles", eta: `${Math.round(currentZone.waitTime + 2)}-${Math.round(currentZone.waitTime + 5)} min`, 
      basePrice: 32.00, finalPrice: calculatePricing(tripDistance, tripDuration, "premium", currentZone.multiplier).total,
      priceRange: "$28-35", multiplier: 2.2, savings: 4.20
    },
    { 
      id: "xl", name: "XL", icon: <Users className="w-6 h-6" />, 
      description: "Groups & luggage", eta: `${Math.round(currentZone.waitTime + 1)}-${Math.round(currentZone.waitTime + 3)} min`, 
      basePrice: 27.90, finalPrice: calculatePricing(tripDistance, tripDuration, "xl", currentZone.multiplier).total,
      priceRange: "$25-30", multiplier: 1.9, savings: 3.50
    }
  ]

  const handleBookRide = async () => {
    if (!pickup || !dropoff) return
    setIsBooking(true)
    setRideStatus("searching")
    
    await new Promise(r => setTimeout(r, 3000))
    setRideStatus("matched")
    setCurrentView("tracking")
    
    await new Promise(r => setTimeout(r, 2000))
    setRideStatus("arriving")
    setIsBooking(false)
  }

  const sendMessage = () => {
    if (!newMessage.trim()) return
    setMessages(prev => [...prev, { from: "rider", text: newMessage, time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) }])
    setNewMessage("")
    setTimeout(() => {
      setMessages(prev => [...prev, { from: "driver", text: "Got it, arriving now.", time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) }])
    }, 2000)
  }

  const selectedRideData = rideOptions.find(r => r.id === selectedRide)!

  // Sidebar Menu
  const menuItems = [
    { icon: <User className="w-5 h-5" />, label: "Profile", action: () => setCurrentView("profile") },
    { icon: <History className="w-5 h-5" />, label: "Ride History", action: () => setCurrentView("history") },
    { icon: <CreditCard className="w-5 h-5" />, label: "Payment Methods", action: () => {} },
    { icon: <Gift className="w-5 h-5" />, label: "Promotions", action: () => {} },
    { icon: <Heart className="w-5 h-5" />, label: "Saved Places", action: () => {} },
    { icon: <Shield className="w-5 h-5" />, label: "Safety", action: () => {} },
    { icon: <HelpCircle className="w-5 h-5" />, label: "Support", action: () => setCurrentView("support") },
    { icon: <Settings className="w-5 h-5" />, label: "Settings", action: () => {} },
  ]

  // GPS Status Component
  const GPSStatusBar = () => (
    <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-3 mb-4 border border-slate-700/50">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <div className={`w-2.5 h-2.5 rounded-full ${gpsStatus === "locked" ? "bg-green-500 animate-pulse" : gpsStatus === "acquiring" ? "bg-yellow-500 animate-pulse" : "bg-red-500"}`} />
          <span className="text-xs font-medium text-slate-300">
            GPS {gpsStatus === "locked" ? "Locked" : gpsStatus === "acquiring" ? "Acquiring..." : "Weak Signal"}
          </span>
        </div>
        <Button
          variant="ghost"
          size="sm"
          className="h-7 px-2 text-xs text-slate-400 hover:text-white"
          onClick={refreshGPS}
          disabled={isGpsRefreshing}
        >
          <RotateCw className={`w-3.5 h-3.5 mr-1 ${isGpsRefreshing ? "animate-spin" : ""}`} />
          Refresh
        </Button>
      </div>
      <div className="grid grid-cols-4 gap-2 text-center">
        <div className="bg-slate-900/50 rounded-lg p-2">
          <Crosshair className="w-4 h-4 mx-auto mb-1 text-emerald-400" />
          <div className="text-[10px] text-slate-500">Accuracy</div>
          <div className="text-xs font-bold text-white">{gpsData.accuracy.toFixed(1)}m</div>
        </div>
        <div className="bg-slate-900/50 rounded-lg p-2">
          <Compass className="w-4 h-4 mx-auto mb-1 text-blue-400" />
          <div className="text-[10px] text-slate-500">Heading</div>
          <div className="text-xs font-bold text-white">{Math.round(gpsData.heading)}°</div>
        </div>
        <div className="bg-slate-900/50 rounded-lg p-2">
          <Activity className="w-4 h-4 mx-auto mb-1 text-purple-400" />
          <div className="text-[10px] text-slate-500">Speed</div>
          <div className="text-xs font-bold text-white">{Math.round(gpsData.speed)} mph</div>
        </div>
        <div className="bg-slate-900/50 rounded-lg p-2">
          <Signal className="w-4 h-4 mx-auto mb-1 text-yellow-400" />
          <div className="text-[10px] text-slate-500">Signal</div>
          <div className="text-xs font-bold text-white">Strong</div>
        </div>
      </div>
    </div>
  )

  // Smart Map Visualization
  const SmartMapView = () => (
    <BookingMapPanel
      pickup={pickup}
      dropoff={dropoff}
      onPickupChange={(addr, coords) => {
        setPickup(addr)
      }}
      onDropoffChange={(addr, coords) => {
        setDropoff(addr)
      }}
      onRouteInfo={({ distanceMi, durationMin }) => {
        setTripDistance(parseFloat(distanceMi.toFixed(1)))
        setTripDuration(durationMin)
        setEta(durationMin + 3)
      }}
    />
  )

  // Keep legacy stats bar below booking panel — rendered separately in BookingView
  const MapStatsBar = () => (
    <div className="grid grid-cols-4 gap-px bg-slate-700 rounded-xl overflow-hidden mt-0">
        <div className="bg-slate-800 p-3 text-center">
          <Route className="w-4 h-4 mx-auto mb-1 text-blue-400" />
          <div className="text-xs text-slate-400">Distance</div>
          <div className="text-sm font-bold text-white">{tripDistance} mi</div>
        </div>
        <div className="bg-slate-800 p-3 text-center">
          <Clock className="w-4 h-4 mx-auto mb-1 text-purple-400" />
          <div className="text-xs text-slate-400">Duration</div>
          <div className="text-sm font-bold text-white">{tripDuration} min</div>
        </div>
        <div className="bg-slate-800 p-3 text-center">
          <Timer className="w-4 h-4 mx-auto mb-1 text-emerald-400" />
          <div className="text-xs text-slate-400">ETA</div>
          <div className="text-sm font-bold text-white">{eta} min</div>
        </div>
        <div className="bg-slate-800 p-3 text-center">
          <Fuel className="w-4 h-4 mx-auto mb-1 text-orange-400" />
          <div className="text-xs text-slate-400">Fuel Est.</div>
          <div className="text-sm font-bold text-white">${pricingBreakdown.distanceFare.toFixed(2)}</div>
        </div>
      </div>
  )

  // Pricing Breakdown Modal
  const PricingBreakdownModal = () => (
    <AnimatePresence>
      {showPricingDetails && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/80 z-50 flex items-end justify-center"
          onClick={() => setShowPricingDetails(false)}
        >
          <motion.div
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{ type: "spring", damping: 25 }}
            className="bg-slate-900 w-full max-w-lg rounded-t-3xl p-6 max-h-[85vh] overflow-y-auto"
            onClick={e => e.stopPropagation()}
          >
            <div className="w-12 h-1 bg-slate-700 rounded-full mx-auto mb-6" />
            
            <h2 className="text-xl font-bold text-white mb-2">Fare Breakdown</h2>
            <p className="text-sm text-slate-400 mb-6">Transparent pricing with no hidden fees</p>

            {/* Fare Items */}
            <div className="space-y-3 mb-6">
              <div className="flex justify-between items-center py-2 border-b border-slate-800">
                <span className="text-slate-300">Base Fare</span>
                <span className="font-medium text-white">${pricingBreakdown.baseFare.toFixed(2)}</span>
              </div>
              <div className="flex justify-between items-center py-2 border-b border-slate-800">
                <span className="text-slate-300">Distance ({tripDistance} mi × $2.00)</span>
                <span className="font-medium text-white">${pricingBreakdown.distanceFare.toFixed(2)}</span>
              </div>
              <div className="flex justify-between items-center py-2 border-b border-slate-800">
                <span className="text-slate-300">Time ({tripDuration} min × $0.20)</span>
                <span className="font-medium text-white">${pricingBreakdown.timeFare.toFixed(2)}</span>
              </div>
              {pricingBreakdown.surgePricing > 0 && (
                <div className="flex justify-between items-center py-2 border-b border-slate-800">
                  <span className="text-red-400">Surge Pricing ({currentZone.multiplier}x)</span>
                  <span className="font-medium text-red-400">+${pricingBreakdown.surgePricing.toFixed(2)}</span>
                </div>
              )}
              <div className="flex justify-between items-center py-2 border-b border-slate-800">
                <span className="text-slate-300">Booking Fee</span>
                <span className="font-medium text-white">${pricingBreakdown.bookingFee.toFixed(2)}</span>
              </div>
              <div className="flex justify-between items-center py-2 border-b border-slate-800">
                <span className="text-slate-300">Taxes & Fees</span>
                <span className="font-medium text-white">${pricingBreakdown.taxes.toFixed(2)}</span>
              </div>
            </div>

            {/* Total */}
            <div className="bg-gradient-to-r from-emerald-900/50 to-emerald-800/30 rounded-xl p-4 mb-6">
              <div className="flex justify-between items-center">
                <span className="text-lg font-bold text-white">Total</span>
                <span className="text-2xl font-bold text-emerald-400">${pricingBreakdown.total.toFixed(2)}</span>
              </div>
            </div>

            {/* Competitor Comparison */}
            <h3 className="text-sm font-semibold text-slate-400 mb-3">COMPARE & SAVE</h3>
            <div className="space-y-2 mb-6">
              <div className="flex justify-between items-center bg-slate-800/50 rounded-lg p-3">
                <span className="text-slate-300">Uber</span>
                <div className="flex items-center gap-2">
                  <span className="line-through text-slate-500">${pricingBreakdown.competitorUber.toFixed(2)}</span>
                  <span className="text-xs px-2 py-0.5 bg-emerald-500/20 text-emerald-400 rounded-full">Save ${(pricingBreakdown.competitorUber - pricingBreakdown.total).toFixed(2)}</span>
                </div>
              </div>
              <div className="flex justify-between items-center bg-slate-800/50 rounded-lg p-3">
                <span className="text-slate-300">Lyft</span>
                <div className="flex items-center gap-2">
                  <span className="line-through text-slate-500">${pricingBreakdown.competitorLyft.toFixed(2)}</span>
                  <span className="text-xs px-2 py-0.5 bg-emerald-500/20 text-emerald-400 rounded-full">Save ${(pricingBreakdown.competitorLyft - pricingBreakdown.total).toFixed(2)}</span>
                </div>
              </div>
              <div className="flex justify-between items-center bg-slate-800/50 rounded-lg p-3">
                <span className="text-slate-300">Taxi</span>
                <div className="flex items-center gap-2">
                  <span className="line-through text-slate-500">${pricingBreakdown.competitorTaxi.toFixed(2)}</span>
                  <span className="text-xs px-2 py-0.5 bg-emerald-500/20 text-emerald-400 rounded-full">Save ${(pricingBreakdown.competitorTaxi - pricingBreakdown.total).toFixed(2)}</span>
                </div>
              </div>
            </div>

            {/* Driver Payout Transparency */}
            <div className="bg-blue-900/30 rounded-xl p-4 border border-blue-800/50">
              <div className="flex items-center gap-2 mb-2">
                <Shield className="w-5 h-5 text-blue-400" />
                <span className="font-semibold text-white">Driver Earnings</span>
              </div>
              <p className="text-sm text-slate-400">Your driver earns <span className="text-emerald-400 font-bold">${pricingBreakdown.driverPayout.toFixed(2)}</span> (80% of fare). We believe in fair driver pay.</p>
            </div>

            <Button
              className="w-full mt-6 bg-emerald-600 hover:bg-emerald-700 text-white"
              onClick={() => setShowPricingDetails(false)}
            >
              Got it
            </Button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )

  // Route Options Modal
  const RouteOptionsModal = () => (
    <AnimatePresence>
      {showRouteOptions && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/80 z-50 flex items-end justify-center"
          onClick={() => setShowRouteOptions(false)}
        >
          <motion.div
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{ type: "spring", damping: 25 }}
            className="bg-slate-900 w-full max-w-lg rounded-t-3xl p-6"
            onClick={e => e.stopPropagation()}
          >
            <div className="w-12 h-1 bg-slate-700 rounded-full mx-auto mb-6" />
            
            <h2 className="text-xl font-bold text-white mb-2">Choose Your Route</h2>
            <p className="text-sm text-slate-400 mb-6">Select the best route for your trip</p>

            <div className="space-y-3">
              {routeOptions.map(route => (
                <button
                  key={route.id}
                  className={`w-full p-4 rounded-xl border transition-all ${
                    selectedRouteId === route.id 
                      ? "bg-emerald-900/30 border-emerald-500" 
                      : "bg-slate-800/50 border-slate-700 hover:border-slate-600"
                  }`}
                  onClick={() => setSelectedRouteId(route.id)}
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-white">{route.name}</span>
                      {route.recommended && (
                        <span className="text-[10px] px-2 py-0.5 bg-emerald-500/20 text-emerald-400 rounded-full">RECOMMENDED</span>
                      )}
                    </div>
                    {selectedRouteId === route.id && (
                      <Check className="w-5 h-5 text-emerald-400" />
                    )}
                  </div>
                  <div className="grid grid-cols-4 gap-2 text-center">
                    <div>
                      <div className="text-xs text-slate-500">Distance</div>
                      <div className="text-sm font-medium text-white">{route.distance} mi</div>
                    </div>
                    <div>
                      <div className="text-xs text-slate-500">Duration</div>
                      <div className="text-sm font-medium text-white">{route.duration} min</div>
                    </div>
                    <div>
                      <div className="text-xs text-slate-500">Traffic</div>
                      <div className="text-sm font-medium text-yellow-400">+{route.trafficDelay} min</div>
                    </div>
                    <div>
                      <div className="text-xs text-slate-500">Tolls</div>
                      <div className="text-sm font-medium text-white">${route.tollCost.toFixed(2)}</div>
                    </div>
                  </div>
                </button>
              ))}
            </div>

            <Button
              className="w-full mt-6 bg-emerald-600 hover:bg-emerald-700 text-white"
              onClick={() => setShowRouteOptions(false)}
            >
              Confirm Route
            </Button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )

  // Home View
  const HomeView = () => (
    <div className="space-y-4">
      {/* GPS Status */}
      <GPSStatusBar />

      {/* Quick Search Card */}
      <Card className="bg-slate-800/50 border-slate-700/50 backdrop-blur-sm">
        <CardContent className="p-4">
          <h2 className="text-lg font-bold text-white mb-4">Where to?</h2>
          
          {/* Pickup Input */}
          <div className="relative mb-3">
            <div className="absolute left-3 top-1/2 transform -translate-y-1/2 w-3 h-3 bg-emerald-500 rounded-full" />
            <Input
              value={pickup}
              onChange={(e) => {
                setPickup(e.target.value)
                setShowPickupSuggestions(true)
              }}
              onFocus={() => setShowPickupSuggestions(true)}
              placeholder="Pickup location"
              className="pl-8 bg-slate-900/50 border-slate-700 text-white placeholder:text-slate-500"
            />
            <Button
              variant="ghost"
              size="sm"
              className="absolute right-1 top-1/2 transform -translate-y-1/2 h-8 text-emerald-400"
              onClick={refreshGPS}
            >
              <Locate className="w-4 h-4" />
            </Button>
            
            {/* Pickup Suggestions */}
            <AnimatePresence>
              {showPickupSuggestions && pickup && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="absolute top-full left-0 right-0 mt-1 bg-slate-800 rounded-lg border border-slate-700 overflow-hidden z-20"
                >
                  {addressSuggestions.slice(0, 3).map((suggestion, i) => (
                    <button
                      key={i}
                      className="w-full px-4 py-3 text-left hover:bg-slate-700 flex items-center gap-3"
                      onClick={() => {
                        setPickup(suggestion.address)
                        setShowPickupSuggestions(false)
                      }}
                    >
                      <MapPin className="w-4 h-4 text-slate-400" />
                      <span className="text-sm text-white truncate">{suggestion.address}</span>
                    </button>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Dropoff Input */}
          <div className="relative mb-4">
            <div className="absolute left-3 top-1/2 transform -translate-y-1/2 w-3 h-3 bg-red-500 rounded-full" />
            <Input
              value={dropoff}
              onChange={(e) => {
                setDropoff(e.target.value)
                setShowDropoffSuggestions(true)
              }}
              onFocus={() => setShowDropoffSuggestions(true)}
              placeholder="Where to?"
              className="pl-8 bg-slate-900/50 border-slate-700 text-white placeholder:text-slate-500"
            />
            
            {/* Dropoff Suggestions */}
            <AnimatePresence>
              {showDropoffSuggestions && dropoff && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="absolute top-full left-0 right-0 mt-1 bg-slate-800 rounded-lg border border-slate-700 overflow-hidden z-20"
                >
                  {addressSuggestions.slice(0, 3).map((suggestion, i) => (
                    <button
                      key={i}
                      className="w-full px-4 py-3 text-left hover:bg-slate-700 flex items-center gap-3"
                      onClick={() => {
                        setDropoff(suggestion.address)
                        setShowDropoffSuggestions(false)
                        setCurrentView("booking")
                      }}
                    >
                      <MapPin className="w-4 h-4 text-slate-400" />
                      <span className="text-sm text-white truncate">{suggestion.address}</span>
                    </button>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Saved Places */}
          <div className="flex gap-2 overflow-x-auto pb-2">
            {savedLocations.map((loc, i) => (
              <button
                key={i}
                className="flex items-center gap-2 px-3 py-2 bg-slate-900/50 rounded-lg border border-slate-700 hover:border-emerald-500/50 transition-colors shrink-0"
                onClick={() => {
                  setDropoff(loc.address)
                  setCurrentView("booking")
                }}
              >
                {loc.type === "home" && <Home className="w-4 h-4 text-blue-400" />}
                {loc.type === "work" && <Building className="w-4 h-4 text-purple-400" />}
                {loc.type === "airport" && <Plane className="w-4 h-4 text-emerald-400" />}
                {loc.type === "event" && <Ticket className="w-4 h-4 text-orange-400" />}
                <span className="text-xs text-white capitalize">{loc.type}</span>
              </button>
            ))}
            <button className="flex items-center gap-2 px-3 py-2 bg-slate-900/50 rounded-lg border border-dashed border-slate-600 hover:border-emerald-500/50 transition-colors shrink-0">
              <Plus className="w-4 h-4 text-slate-400" />
              <span className="text-xs text-slate-400">Add</span>
            </button>
          </div>
        </CardContent>
      </Card>

      {/* Zone & Demand Info */}
      <Card className="bg-gradient-to-r from-emerald-900/30 to-blue-900/30 border-emerald-800/50">
        <CardContent className="p-4">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <Activity className="w-5 h-5 text-emerald-400" />
              <span className="font-semibold text-white">Live Zone Status</span>
            </div>
            <span className={`text-xs px-2 py-1 rounded-full ${
              currentZone.level === "low" ? "bg-blue-500/20 text-blue-400" :
              currentZone.level === "normal" ? "bg-green-500/20 text-green-400" :
              currentZone.level === "high" ? "bg-yellow-500/20 text-yellow-400" :
              "bg-red-500/20 text-red-400"
            }`}>
              {currentZone.level.toUpperCase()} DEMAND
            </span>
          </div>
          <div className="grid grid-cols-3 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-white">{currentZone.driversNearby}</div>
              <div className="text-xs text-slate-400">Drivers Nearby</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-white">{currentZone.waitTime} min</div>
              <div className="text-xs text-slate-400">Avg Wait Time</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-emerald-400">{currentZone.multiplier}x</div>
              <div className="text-xs text-slate-400">Pricing</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Recent Rides */}
      <Card className="bg-slate-800/50 border-slate-700/50">
        <CardContent className="p-4">
          <div className="flex items-center justify-between mb-3">
            <span className="font-semibold text-white">Recent Rides</span>
            <Button variant="link" className="text-emerald-400 p-0 h-auto text-sm" onClick={() => setCurrentView("history")}>
              See All
            </Button>
          </div>
          <div className="space-y-3">
            {[
              { dest: "LAX Airport Terminal 4", date: "Today, 2:30 PM", price: 32.50, inProgress: true },
              { dest: "Downtown LA Office", date: "Yesterday, 9:00 AM", price: 18.75, inProgress: false },
            ].map((ride, i) => (
              <div key={i} className="space-y-2">
                <button
                  className="w-full flex items-center gap-3 p-3 bg-slate-900/50 rounded-lg hover:bg-slate-800 transition-colors"
                  onClick={() => {
                    setDropoff(ride.dest)
                    setCurrentView("booking")
                  }}
                >
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center ${ride.inProgress ? "bg-emerald-600" : "bg-slate-700"}`}>
                    {ride.inProgress ? <Navigation className="w-5 h-5 text-white" /> : <Clock className="w-5 h-5 text-slate-400" />}
                  </div>
                  <div className="flex-1 text-left">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium text-white">{ride.dest}</span>
                      {ride.inProgress && (
                        <span className="text-[10px] px-2 py-0.5 bg-emerald-500/20 text-emerald-400 rounded-full animate-pulse">LIVE</span>
                      )}
                    </div>
                    <div className="text-xs text-slate-500">{ride.date}</div>
                  </div>
                  <div className="text-sm font-semibold text-emerald-400">${ride.price}</div>
                </button>
                {ride.inProgress && (
                  <Link href="/rider/live-trip">
                    <Button className="w-full bg-gradient-to-r from-emerald-600 to-blue-600 hover:from-emerald-700 hover:to-blue-700 text-white text-sm h-9">
                      <Map className="w-4 h-4 mr-2" />
                      View Live GPS Tracking
                    </Button>
                  </Link>
                )}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Promo Banner */}
      <Card className="bg-gradient-to-r from-purple-900/50 to-pink-900/50 border-purple-700/50 overflow-hidden">
        <CardContent className="p-4 relative">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
              <Gift className="w-6 h-6 text-white" />
            </div>
            <div className="flex-1">
              <div className="font-semibold text-white">Save 20% on your next ride!</div>
              <div className="text-xs text-purple-300">Use code: GLIDE20</div>
            </div>
            <ChevronRight className="w-5 h-5 text-purple-400" />
          </div>
        </CardContent>
      </Card>
    </div>
  )

  // Booking View
  const BookingView = () => (
    <div className="space-y-4">
      {/* Back Button */}
      <Button
        variant="ghost"
        size="sm"
        className="text-slate-400 hover:text-white -ml-2"
        onClick={() => setCurrentView("home")}
      >
        <ChevronRight className="w-4 h-4 rotate-180 mr-1" />
        Back
      </Button>

      {/* Smart Map */}
      <SmartMapView />

      {/* Route Options Button */}
      <Button
        variant="outline"
        className="w-full border-slate-700 text-white hover:bg-slate-800"
        onClick={() => setShowRouteOptions(true)}
      >
        <Route className="w-4 h-4 mr-2 text-blue-400" />
        {routeOptions.find(r => r.id === selectedRouteId)?.name || "Choose Route"}
        <ChevronDown className="w-4 h-4 ml-auto" />
      </Button>

      {/* Ride Type Selection */}
      <Card className="bg-slate-800/50 border-slate-700/50">
        <CardContent className="p-4">
          <h3 className="font-semibold text-white mb-3">Select Ride Type</h3>
          <div className="space-y-2">
            {rideOptions.map(ride => (
              <button
                key={ride.id}
                className={`w-full p-3 rounded-xl flex items-center gap-3 transition-all ${
                  selectedRide === ride.id 
                    ? "bg-emerald-900/30 border-2 border-emerald-500" 
                    : "bg-slate-900/50 border border-slate-700 hover:border-slate-600"
                }`}
                onClick={() => setSelectedRide(ride.id)}
              >
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                  selectedRide === ride.id ? "bg-emerald-600" : "bg-slate-700"
                }`}>
                  {ride.icon}
                </div>
                <div className="flex-1 text-left">
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-white">{ride.name}</span>
                    {ride.id === "comfort" && (
                      <span className="text-[10px] px-1.5 py-0.5 bg-emerald-500/20 text-emerald-400 rounded">POPULAR</span>
                    )}
                  </div>
                  <div className="text-xs text-slate-400">{ride.description} • {ride.eta}</div>
                </div>
                <div className="text-right">
                  <div className="font-bold text-white">${ride.finalPrice.toFixed(2)}</div>
                  <div className="text-[10px] text-emerald-400">Save ${ride.savings.toFixed(2)}</div>
                </div>
              </button>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Pricing Summary */}
      <Card className="bg-slate-800/50 border-slate-700/50">
        <CardContent className="p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-slate-400">Estimated Fare</span>
            <Button
              variant="link"
              className="text-emerald-400 p-0 h-auto text-sm"
              onClick={() => setShowPricingDetails(true)}
            >
              View Breakdown
            </Button>
          </div>
          <div className="flex items-center justify-between">
            <div>
              <span className="text-3xl font-bold text-white">${pricingBreakdown.total.toFixed(2)}</span>
              <div className="text-xs text-emerald-400 mt-1">2-3% lower than competitors</div>
            </div>
            <div className="text-right">
              <div className="text-sm text-slate-400">Driver earns</div>
              <div className="text-lg font-semibold text-emerald-400">${pricingBreakdown.driverPayout.toFixed(2)}</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Payment Method */}
      <Card className="bg-slate-800/50 border-slate-700/50">
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-blue-600 to-blue-800 flex items-center justify-center">
                <CreditCard className="w-5 h-5 text-white" />
              </div>
              <div>
                <div className="text-sm font-medium text-white">•••• 4242</div>
                <div className="text-xs text-slate-500">Visa • WorldPay Secure</div>
              </div>
            </div>
            <Button variant="link" className="text-emerald-400 p-0 h-auto text-sm">
              Change
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Book Button */}
      <Button
        className="w-full h-14 bg-gradient-to-r from-emerald-600 to-emerald-500 hover:from-emerald-700 hover:to-emerald-600 text-white text-lg font-semibold rounded-xl shadow-lg shadow-emerald-500/30"
        onClick={handleBookRide}
        disabled={isBooking || !pickup || !dropoff}
      >
        {isBooking ? (
          <>
            <Loader2 className="w-5 h-5 mr-2 animate-spin" />
            Finding your driver...
          </>
        ) : (
          <>
            Book {selectedRideData.name} • ${pricingBreakdown.total.toFixed(2)}
            <ChevronRight className="w-5 h-5 ml-2" />
          </>
        )}
      </Button>
    </div>
  )

  // Tracking View
  const TrackingView = () => (
    <div className="space-y-4">
      {/* Status Header */}
      <div className="text-center mb-2">
        <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full ${
          rideStatus === "matched" ? "bg-blue-500/20 text-blue-400" :
          rideStatus === "arriving" ? "bg-emerald-500/20 text-emerald-400" :
          rideStatus === "inProgress" ? "bg-purple-500/20 text-purple-400" :
          "bg-yellow-500/20 text-yellow-400"
        }`}>
          <div className="w-2 h-2 rounded-full bg-current animate-pulse" />
          <span className="font-medium">
            {rideStatus === "matched" && "Driver Found!"}
            {rideStatus === "arriving" && `Driver arriving in ${Math.ceil(eta)} min`}
            {rideStatus === "inProgress" && "Trip in Progress"}
          </span>
        </div>
      </div>

      {/* Live Map */}
      <SmartMapView />

      {/* Driver Info Card */}
      <Card className="bg-slate-800/50 border-slate-700/50">
        <CardContent className="p-4">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-emerald-500 to-emerald-700 flex items-center justify-center text-white text-2xl font-bold">
              JD
            </div>
            <div className="flex-1">
              <div className="font-semibold text-white text-lg">John Driver</div>
              <div className="text-sm text-slate-400">Toyota Camry • ABC 123</div>
              <div className="flex items-center gap-1 mt-1">
                <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                <span className="text-sm text-white">4.92</span>
                <span className="text-xs text-slate-500">(2,341 rides)</span>
              </div>
            </div>
            <div className="flex gap-2">
              <Button size="icon" variant="outline" className="rounded-full border-slate-600">
                <Phone className="w-5 h-5 text-emerald-400" />
              </Button>
              <Button size="icon" variant="outline" className="rounded-full border-slate-600">
                <MessageCircle className="w-5 h-5 text-blue-400" />
              </Button>
            </div>
          </div>

          {/* Trip Progress */}
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <div className="w-3 h-3 rounded-full bg-emerald-500" />
              <div className="flex-1 h-1 bg-slate-700 rounded-full overflow-hidden">
                <div className="h-full bg-gradient-to-r from-emerald-500 to-blue-500" style={{ width: rideStatus === "arriving" ? "30%" : "60%" }} />
              </div>
              <div className="w-3 h-3 rounded-full bg-red-500" />
            </div>
            <div className="flex justify-between text-xs text-slate-400">
              <span>Pickup</span>
              <span>Drop-off</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Chat Section */}
      <Card className="bg-slate-800/50 border-slate-700/50">
        <CardContent className="p-4">
          <div className="flex items-center gap-2 mb-3">
            <MessageCircle className="w-5 h-5 text-blue-400" />
            <span className="font-semibold text-white">Chat with Driver</span>
          </div>
          <div className="h-32 overflow-y-auto space-y-2 mb-3">
            {messages.map((msg, i) => (
              <div key={i} className={`flex ${msg.from === "rider" ? "justify-end" : "justify-start"}`}>
                <div className={`max-w-[80%] px-3 py-2 rounded-xl text-sm ${
                  msg.from === "rider" 
                    ? "bg-emerald-600 text-white" 
                    : msg.from === "driver"
                    ? "bg-slate-700 text-white"
                    : "bg-blue-900/50 text-blue-300"
                }`}>
                  {msg.text}
                </div>
              </div>
            ))}
          </div>
          <div className="flex gap-2">
            <Input
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              placeholder="Message your driver..."
              className="bg-slate-900/50 border-slate-700 text-white"
              onKeyPress={(e) => e.key === "Enter" && sendMessage()}
            />
            <Button size="icon" className="bg-emerald-600 hover:bg-emerald-700" onClick={sendMessage}>
              <Send className="w-4 h-4" />
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Fare Summary */}
      <Card className="bg-gradient-to-r from-emerald-900/30 to-blue-900/30 border-emerald-800/50">
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-sm text-slate-400">Estimated Fare</div>
              <div className="text-2xl font-bold text-white">${pricingBreakdown.total.toFixed(2)}</div>
            </div>
            <div className="px-3 py-1 bg-emerald-500/20 rounded-lg">
              <span className="text-emerald-400 font-medium">AUTHORIZED</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )

  // History View
  const HistoryView = () => (
    <div className="space-y-4">
      <Button
        variant="ghost"
        size="sm"
        className="text-slate-400 hover:text-white -ml-2"
        onClick={() => setCurrentView("home")}
      >
        <ChevronRight className="w-4 h-4 rotate-180 mr-1" />
        Back
      </Button>

      <h2 className="text-xl font-bold text-white">Ride History</h2>

      <div className="space-y-3">
        {[
          { id: "GW-10234", dest: "LAX Airport", date: "Today, 2:30 PM", price: 32.50, status: "in_progress", driver: "John D." },
          { id: "GW-10198", dest: "Downtown Office", date: "Yesterday", price: 18.75, status: "completed", driver: "Sarah M." },
          { id: "GW-10156", dest: "Santa Monica Pier", date: "Dec 18", price: 24.00, status: "completed", driver: "Mike R." },
          { id: "GW-10102", dest: "Hollywood Bowl", date: "Dec 15", price: 28.50, status: "cancelled", driver: "---" },
        ].map((ride) => (
          <Card key={ride.id} className="bg-slate-800/50 border-slate-700/50 overflow-hidden">
            <CardContent className="p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs text-slate-500">{ride.id}</span>
                <span className={`text-xs px-2 py-0.5 rounded-full ${
                  ride.status === "completed" ? "bg-emerald-500/20 text-emerald-400" : 
                  ride.status === "in_progress" ? "bg-blue-500/20 text-blue-400" :
                  "bg-red-500/20 text-red-400"
                }`}>
                  {ride.status === "in_progress" ? "in progress" : ride.status}
                </span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-slate-700 flex items-center justify-center">
                  <MapPin className="w-5 h-5 text-slate-400" />
                </div>
                <div className="flex-1">
                  <div className="font-medium text-white">{ride.dest}</div>
                  <div className="text-xs text-slate-500">{ride.date} • {ride.driver}</div>
                </div>
                <div className="text-lg font-bold text-emerald-400">${ride.price}</div>
              </div>
              {/* Show "Track Live" button for in-progress rides */}
              {ride.status === "in_progress" && (
                <Link href="/rider/live-trip" className="block mt-3">
                  <Button className="w-full bg-gradient-to-r from-emerald-600 to-blue-600 hover:from-emerald-700 hover:to-blue-700 text-white">
                    <Navigation className="w-4 h-4 mr-2" />
                    Track Live with GPS
                  </Button>
                </Link>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )

  // Profile View
  const ProfileView = () => (
    <div className="space-y-4">
      <Button
        variant="ghost"
        size="sm"
        className="text-slate-400 hover:text-white -ml-2"
        onClick={() => setCurrentView("home")}
      >
        <ChevronRight className="w-4 h-4 rotate-180 mr-1" />
        Back
      </Button>

      <div className="text-center py-6">
        <div className="w-24 h-24 rounded-full bg-gradient-to-br from-emerald-500 to-emerald-700 flex items-center justify-center text-white text-3xl font-bold mx-auto mb-4">
          JR
        </div>
        <h2 className="text-xl font-bold text-white">John Rider</h2>
        <p className="text-sm text-slate-400">john.rider@email.com</p>
        <div className="flex items-center justify-center gap-1 mt-2">
          <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
          <span className="text-white">4.95 rating</span>
        </div>
      </div>

      <Card className="bg-slate-800/50 border-slate-700/50">
        <CardContent className="p-0">
          {[
            { icon: <User className="w-5 h-5" />, label: "Personal Info" },
            { icon: <CreditCard className="w-5 h-5" />, label: "Payment Methods" },
            { icon: <Shield className="w-5 h-5" />, label: "Safety" },
            { icon: <Bell className="w-5 h-5" />, label: "Notifications" },
            { icon: <Settings className="w-5 h-5" />, label: "Settings" },
          ].map((item, i) => (
            <button
              key={i}
              className="w-full flex items-center gap-3 p-4 hover:bg-slate-700/50 transition-colors border-b border-slate-700 last:border-0"
            >
              <span className="text-emerald-400">{item.icon}</span>
              <span className="text-white flex-1 text-left">{item.label}</span>
              <ChevronRight className="w-5 h-5 text-slate-500" />
            </button>
          ))}
        </CardContent>
      </Card>

      <Button variant="outline" className="w-full border-red-500/50 text-red-400 hover:bg-red-500/10">
        <LogOut className="w-4 h-4 mr-2" />
        Sign Out
      </Button>
    </div>
  )

  // Support View
  const SupportView = () => (
    <div className="space-y-4">
      <Button
        variant="ghost"
        size="sm"
        className="text-slate-400 hover:text-white -ml-2"
        onClick={() => setCurrentView("home")}
      >
        <ChevronRight className="w-4 h-4 rotate-180 mr-1" />
        Back
      </Button>

      <h2 className="text-xl font-bold text-white">Help & Support</h2>

      <Card className="bg-slate-800/50 border-slate-700/50">
        <CardContent className="p-0">
          {[
            { icon: <HelpCircle className="w-5 h-5" />, label: "FAQs" },
            { icon: <MessageCircle className="w-5 h-5" />, label: "Chat with Support" },
            { icon: <Phone className="w-5 h-5" />, label: "Call Support" },
            { icon: <AlertCircle className="w-5 h-5" />, label: "Report an Issue" },
            { icon: <Shield className="w-5 h-5" />, label: "Safety Center" },
          ].map((item, i) => (
            <button
              key={i}
              className="w-full flex items-center gap-3 p-4 hover:bg-slate-700/50 transition-colors border-b border-slate-700 last:border-0"
            >
              <span className="text-emerald-400">{item.icon}</span>
              <span className="text-white flex-1 text-left">{item.label}</span>
              <ChevronRight className="w-5 h-5 text-slate-500" />
            </button>
          ))}
        </CardContent>
      </Card>

      <Card className="bg-emerald-900/30 border-emerald-800/50">
        <CardContent className="p-4">
          <div className="flex items-center gap-3">
            <Phone className="w-8 h-8 text-emerald-400" />
            <div>
              <div className="text-sm text-slate-400">Emergency Line</div>
              <div className="text-lg font-bold text-white">1-800-GLIDEWAY</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 via-slate-900 to-slate-950">
      {/* Header */}
      <div className="sticky top-0 z-40 bg-slate-900/95 backdrop-blur-sm border-b border-slate-800">
        <div className="flex items-center justify-between p-4">
          <Button variant="ghost" size="icon" className="text-white" onClick={() => setShowMenu(true)}>
            <Menu className="w-6 h-6" />
          </Button>
          <GlidewayLogo />
          <Button variant="ghost" size="icon" className="text-white relative">
            <Bell className="w-6 h-6" />
            <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full" />
          </Button>
        </div>
      </div>

      {/* Main Content */}
      <div className="p-4 pb-24">
        {currentView === "home" && <HomeView />}
        {currentView === "booking" && <BookingView />}
        {currentView === "tracking" && <TrackingView />}
        {currentView === "history" && <HistoryView />}
        {currentView === "profile" && <ProfileView />}
        {currentView === "support" && <SupportView />}
      </div>

      {/* Bottom Navigation */}
      {currentView !== "tracking" && (
        <div className="fixed bottom-0 left-0 right-0 bg-slate-900/95 backdrop-blur-sm border-t border-slate-800 z-40">
          <div className="flex items-center justify-around py-3">
            {[
              { icon: <Home className="w-6 h-6" />, label: "Home", view: "home" as AppView },
              { icon: <History className="w-6 h-6" />, label: "History", view: "history" as AppView },
              { icon: <User className="w-6 h-6" />, label: "Profile", view: "profile" as AppView },
              { icon: <HelpCircle className="w-6 h-6" />, label: "Support", view: "support" as AppView },
            ].map((item) => (
              <button
                key={item.view}
                className={`flex flex-col items-center gap-1 px-4 py-2 rounded-xl transition-colors ${
                  currentView === item.view 
                    ? "text-emerald-400" 
                    : "text-slate-500 hover:text-slate-300"
                }`}
                onClick={() => setCurrentView(item.view)}
              >
                {item.icon}
                <span className="text-[10px] font-medium">{item.label}</span>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Sidebar Menu */}
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
              className="fixed left-0 top-0 bottom-0 w-80 bg-slate-900 border-r border-slate-800 z-50 p-6"
            >
              <div className="flex items-center gap-3 mb-8">
                <div className="w-14 h-14 rounded-full bg-gradient-to-br from-emerald-500 to-emerald-700 flex items-center justify-center text-white text-xl font-bold">
                  JR
                </div>
                <div>
                  <div className="font-semibold text-white">John Rider</div>
                  <div className="text-sm text-slate-400">4.95 rating</div>
                </div>
                <Button variant="ghost" size="icon" className="ml-auto text-slate-400" onClick={() => setShowMenu(false)}>
                  <X className="w-5 h-5" />
                </Button>
              </div>

              <div className="space-y-1">
                {menuItems.map((item, i) => (
                  <button
                    key={i}
                    className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-slate-300 hover:bg-slate-800 hover:text-white transition-colors"
                    onClick={() => {
                      item.action()
                      setShowMenu(false)
                    }}
                  >
                    {item.icon}
                    <span>{item.label}</span>
                  </button>
                ))}
              </div>

              <div className="absolute bottom-6 left-6 right-6">
                <Card className="bg-gradient-to-r from-emerald-900/50 to-blue-900/50 border-emerald-800/50">
                  <CardContent className="p-4">
                    <div className="text-sm font-medium text-white mb-1">GlideWay Premium</div>
                    <div className="text-xs text-slate-400 mb-3">Priority support & exclusive discounts</div>
                    <Button size="sm" className="w-full bg-emerald-600 hover:bg-emerald-700">
                      Upgrade Now
                    </Button>
                  </CardContent>
                </Card>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Modals */}
      <PricingBreakdownModal />
      <RouteOptionsModal />
    </div>
  )
}
