"use client"

import { useState, useEffect, useRef, useCallback } from "react"
import { Search, Calendar, Users, MapPin, Clock, Navigation, Plus, X } from "lucide-react"
import dynamic from "next/dynamic"
import { searchAddresses, reverseGeocode, calculateDistance, estimateRideCost } from "@/lib/map-utils"

// Dynamic import to avoid SSR issues with Leaflet
const LeafletMap = dynamic(() => import("./leaflet-map").then((mod) => mod.LeafletMap), { ssr: false })

const RIDE_TYPES = [
  { id: "economy", name: "Economy", price: "$26.96", time: "in 8 min", seats: 4, description: "Affordable rides" },
  { id: "comfort", name: "Comfort", price: "$29.96", time: "in 7 min", seats: 4, description: "Newer cars" },
  { id: "xl", name: "XL", price: "$35.96", time: "in 10 min", seats: 6, description: "Fits 6 passengers" },
  { id: "premium", name: "Premium", price: "$45.96", time: "in 6 min", seats: 4, description: "High-end vehicles" },
]

const SHORTCUTS = [
  { id: "work", icon: "briefcase", label: "Work", address: "" },
  { id: "home", icon: "home", label: "Home", address: "" },
]

interface PlaceSuggestion {
  address: string
  lat: number
  lng: number
  displayName: string
}

interface ActiveRide {
  id: string
  status: "searching" | "driver_assigned" | "arriving" | "in_trip" | "completed"
  driver?: {
    name: string
    rating: number
    photo: string
    vehicle: string
    plate: string
    phone: string
  }
  pickup: string
  dropoff: string
  fare: number
  eta: number
}

interface HomeScreenProps {
  activeRide: ActiveRide | null
  setActiveRide: (ride: ActiveRide | null) => void
  isTracking: boolean
  setIsTracking: (tracking: boolean) => void
}

export function HomeScreen({ activeRide, setActiveRide, isTracking, setIsTracking }: HomeScreenProps) {
  const [greeting, setGreeting] = useState("Good Morning")
  const [pickup, setPickup] = useState("Current location")
  const [dropoff, setDropoff] = useState("")
  const [selectedRide, setSelectedRide] = useState("economy")
  const [showLocationSearch, setShowLocationSearch] = useState(false)
  const [searchType, setSearchType] = useState<"pickup" | "dropoff">("dropoff")
  const [searchQuery, setSearchQuery] = useState("")
  const [suggestions, setSuggestions] = useState<PlaceSuggestion[]>([])
  const [showRideOptions, setShowRideOptions] = useState(false)
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null)
  const [pickupLocation, setPickupLocation] = useState<{ lat: number; lng: number } | null>(null)
  const [dropoffLocation, setDropoffLocation] = useState<{ lat: number; lng: number } | null>(null)
  const [savedShortcuts, setSavedShortcuts] = useState(SHORTCUTS)
  const [estimatedCost, setEstimatedCost] = useState("$26.96")
  const [estimatedTime, setEstimatedTime] = useState("8 min")
  
  const debounceRef = useRef<NodeJS.Timeout | null>(null)

  // Set greeting based on time of day
  useEffect(() => {
    const hour = new Date().getHours()
    if (hour < 12) setGreeting("Good Morning")
    else if (hour < 17) setGreeting("Good Afternoon")
    else setGreeting("Good Evening")
  }, [])

  // Get user location
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          })
        },
        () => {
          // Default to Colorado Springs on error
          setUserLocation({ lat: 38.8339, lng: -104.8214 })
        }
      )
    } else {
      setUserLocation({ lat: 38.8339, lng: -104.8214 })
    }
  }, [])

  // Initialize map and reverse geocode user location
  useEffect(() => {
    const initializeUserLocation = async () => {
      if (userLocation) {
        setPickupLocation(userLocation)
        // Reverse geocode to get address
        const address = await reverseGeocode(userLocation.lat, userLocation.lng)
        setPickup(address)
      }
    }
    initializeUserLocation()
  }, [userLocation])

  // Search for addresses using Nominatim (free)
  const searchPlaces = useCallback(async (query: string) => {
    if (query.length < 2) {
      setSuggestions([])
      return
    }

    if (debounceRef.current) {
      clearTimeout(debounceRef.current)
    }

    debounceRef.current = setTimeout(async () => {
      const results = await searchAddresses(query)
      setSuggestions(results)
    }, 300)
  }, [])

  // Handle place selection
  const handleSelectPlace = useCallback((suggestion: PlaceSuggestion) => {
    if (searchType === "pickup") {
      setPickup(suggestion.address)
      setPickupLocation({ lat: suggestion.lat, lng: suggestion.lng })
    } else {
      setDropoff(suggestion.address)
      setDropoffLocation({ lat: suggestion.lat, lng: suggestion.lng })
      
      // Calculate distance and cost
      if (pickupLocation) {
        const distance = calculateDistance(pickupLocation.lat, pickupLocation.lng, suggestion.lat, suggestion.lng)
        const cost = estimateRideCost(distance, selectedRide)
        setEstimatedCost(`$${cost.toFixed(2)}`)
        setEstimatedTime(`${Math.ceil(distance * 2)} min`)
      }
      
      setShowRideOptions(true)
    }
    setShowLocationSearch(false)
    setSuggestions([])
    setSearchQuery("")
  }, [searchType, pickupLocation])

  // Handle ride booking
  const handleBookRide = () => {
    if (!pickup || !dropoff) return

    const rideType = RIDE_TYPES.find(r => r.id === selectedRide)
    const fare = parseFloat(estimatedCost.replace("$", ""))

    setIsTracking(true)
    setActiveRide({
      id: `ride-${Date.now()}`,
      status: "searching",
      pickup,
      dropoff,
      fare,
      eta: 5,
    })

    // Simulate finding driver
    setTimeout(() => {
      setActiveRide(prev => prev ? {
        ...prev,
        status: "driver_assigned",
        driver: {
          name: "Michael Johnson",
          rating: 4.9,
          photo: "/driver.jpg",
          vehicle: "Toyota Camry (White)",
          plate: "ABC-1234",
          phone: "+1 (555) 123-4567",
        },
        eta: 4,
      } : null)
    }, 3000)
  }

  // Cancel ride
  const handleCancelRide = () => {
    setIsTracking(false)
    setActiveRide(null)
    setShowRideOptions(false)
    setDropoff("")
    setDropoffLocation(null)
  }

  // Render active ride tracking
  if (isTracking && activeRide) {
    return (
      <div className="flex flex-col h-full bg-gray-950">
        {/* Map with Fallback */}
        <div className="flex-1 relative">
          {/* Fallback background */}
          <div className="absolute inset-0 bg-gradient-to-br from-gray-900 via-gray-950 to-gray-900">
            <div className="absolute inset-0 opacity-30">
              <svg className="w-full h-full" viewBox="0 0 400 400" preserveAspectRatio="xMidYMid slice">
                <defs>
                  <pattern id="trackingGrid" width="40" height="40" patternUnits="userSpaceOnUse">
                    <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#1f2937" strokeWidth="1"/>
                  </pattern>
                </defs>
                <rect width="100%" height="100%" fill="url(#trackingGrid)" />
                <path d="M 50 150 Q 150 100 200 200 T 350 250" stroke="#7CFF3A" strokeWidth="4" fill="none" strokeDasharray="10,5"/>
                <circle cx="80" cy="140" r="10" fill="#7CFF3A"/>
                <circle cx="320" cy="260" r="10" fill="#ef4444"/>
              </svg>
            </div>
          </div>
          {/* Leaflet Map container */}
          {userLocation && (
            <LeafletMap
              pickupLat={pickupLocation?.lat || userLocation.lat}
              pickupLng={pickupLocation?.lng || userLocation.lng}
              dropoffLat={dropoffLocation?.lat}
              dropoffLng={dropoffLocation?.lng}
              pickupAddress={pickup}
              dropoffAddress={dropoff}
            />
          )}
        </div>

        {/* Ride Status Card */}
        <div className="bg-gray-900 border-t border-gray-800 rounded-t-3xl -mt-6 relative z-10">
          <div className="w-12 h-1 bg-gray-700 rounded-full mx-auto mt-3" />
          
          <div className="p-4">
            <div className="text-center mb-4">
              <h3 className="text-lg font-bold text-white">
                {activeRide.status === "searching" ? "Finding your driver..." : "Driver is on the way!"}
              </h3>
              <p className="text-lime-400 font-medium">ETA: {activeRide.eta} minutes</p>
            </div>

            {activeRide.driver && (
              <div className="flex items-center gap-4 bg-gray-800 rounded-xl p-4 mb-4">
                <div className="w-14 h-14 bg-gray-700 rounded-full flex items-center justify-center text-xl font-bold text-white">
                  MJ
                </div>
                <div className="flex-1">
                  <p className="font-semibold text-white">{activeRide.driver.name}</p>
                  <p className="text-sm text-gray-400">{activeRide.driver.vehicle}</p>
                  <p className="text-lime-400 text-sm">Rating: {activeRide.driver.rating}</p>
                </div>
                <div className="text-right">
                  <p className="font-bold text-white">{activeRide.driver.plate}</p>
                </div>
              </div>
            )}

            <div className="space-y-3 mb-4">
              <div className="flex items-center gap-3">
                <div className="w-3 h-3 bg-lime-400 rounded-full" />
                <p className="text-sm text-gray-300 truncate flex-1">{activeRide.pickup}</p>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-3 h-3 bg-red-400 rounded-full" />
                <p className="text-sm text-gray-300 truncate flex-1">{activeRide.dropoff}</p>
              </div>
            </div>

            <button 
              onClick={handleCancelRide}
              className="w-full bg-gray-800 hover:bg-gray-700 text-white font-medium py-3 rounded-xl transition-colors"
            >
              Cancel Ride
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="flex flex-col h-full bg-gray-950 relative overflow-hidden">
      {/* Map Background / Fallback */}
      <div className="absolute inset-0 bg-gradient-to-br from-gray-900 via-gray-950 to-gray-900">
        {/* Decorative map-like pattern as fallback */}
        <div className="absolute inset-0 opacity-30">
          <svg className="w-full h-full" viewBox="0 0 400 600" preserveAspectRatio="xMidYMid slice">
            {/* Grid lines to simulate map streets */}
            <defs>
              <pattern id="mapGrid" width="40" height="40" patternUnits="userSpaceOnUse">
                <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#1f2937" strokeWidth="1"/>
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#mapGrid)" />
            {/* Simulated roads */}
            <path d="M 0 200 Q 100 180 200 200 T 400 200" stroke="#374151" strokeWidth="8" fill="none"/>
            <path d="M 150 0 Q 170 150 150 300 T 170 600" stroke="#374151" strokeWidth="6" fill="none"/>
            <path d="M 50 400 Q 200 350 400 420" stroke="#374151" strokeWidth="4" fill="none"/>
            {/* User location indicator */}
            <circle cx="200" cy="250" r="12" fill="#7CFF3A" opacity="0.8"/>
            <circle cx="200" cy="250" r="24" fill="#7CFF3A" opacity="0.2"/>
            <circle cx="200" cy="250" r="40" fill="#7CFF3A" opacity="0.1"/>
          </svg>
        </div>
        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-gray-950/80 via-transparent to-gray-950/90" />
      </div>
      
      {/* Leaflet Map container */}
      {userLocation && (
        <LeafletMap
          pickupLat={pickupLocation?.lat || userLocation.lat}
          pickupLng={pickupLocation?.lng || userLocation.lng}
          dropoffLat={dropoffLocation?.lat}
          dropoffLng={dropoffLocation?.lng}
          pickupAddress={pickup}
          dropoffAddress={dropoff}
        />
      )}

      {/* Content Overlay */}
      <div className="relative z-[5] flex flex-col h-full">
        {/* Header */}
        <div className="p-4">
          <h1 className="text-3xl font-bold text-white mb-4">{greeting}</h1>
          
          {/* Search Box */}
          <button
            onClick={() => {
              setSearchType("dropoff")
              setShowLocationSearch(true)
            }}
            className="w-full bg-gray-800/90 backdrop-blur-sm border border-gray-700 rounded-xl px-4 py-4 flex items-center gap-3 hover:border-lime-400/50 transition-colors"
          >
            <Search className="w-5 h-5 text-gray-400" />
            <span className="text-gray-400 text-left flex-1">
              {dropoff || "Where are you going?"}
            </span>
          </button>
        </div>

        {/* Spacer */}
        <div className="flex-1" />

        {/* Bottom Sheet - Booking Form */}
        <div className={`bg-gray-900/95 backdrop-blur-sm border-t border-gray-800 rounded-t-3xl transition-all duration-300 ${showRideOptions ? "max-h-[75vh]" : "max-h-[55vh]"}`}>
          <div className="w-12 h-1 bg-gray-700 rounded-full mx-auto mt-3" />
          
          <div className="p-4 overflow-y-auto max-h-[calc(100%-20px)]">
            {/* Title */}
            <h2 className="text-2xl font-bold text-white mb-6">Book Your Ride</h2>
            
            {/* Pickup Location Section */}
            <div className="mb-6">
              <label className="text-sm font-medium text-gray-400 mb-2 block">Pickup Location</label>
              <div className="flex gap-2 mb-2">
                <button
                  onClick={() => {
                    if (userLocation) {
                      setPickupLocation(userLocation)
                      reverseGeocode(userLocation.lat, userLocation.lng).then((addr) => {
                        setPickup(addr)
                      })
                    }
                  }}
                  className="flex-1 flex items-center justify-center gap-2 bg-lime-400/10 hover:bg-lime-400/20 border border-lime-400/30 rounded-lg px-3 py-2 transition-colors"
                >
                  <Navigation className="w-4 h-4 text-lime-400" />
                  <span className="text-sm font-medium text-lime-400">Use Current Location</span>
                </button>
              </div>
              <div className="bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-gray-300 text-sm">
                {pickup || "Your location"}
              </div>
            </div>
            
            {/* Dropoff Location Section */}
            <div className="mb-6">
              <label className="text-sm font-medium text-gray-400 mb-2 block">Dropoff Location</label>
              <button
                onClick={() => {
                  setSearchType("dropoff")
                  setShowLocationSearch(true)
                }}
                className="w-full bg-gray-800 hover:bg-gray-700 border border-gray-700 rounded-lg px-4 py-3 flex items-center gap-3 transition-colors"
              >
                <MapPin className="w-5 h-5 text-gray-400" />
                <span className="text-gray-400 text-left flex-1">
                  {dropoff || "Enter destination"}
                </span>
              </button>
            </div>
            
            {/* When do you need a ride? */}
            <div className="mb-6">
              <label className="text-sm font-medium text-gray-400 mb-3 block">When do you need a ride?</label>
              <div className="flex gap-3">
                <button
                  onClick={() => {}}
                  className="flex-1 bg-lime-400 hover:bg-lime-500 text-gray-950 font-medium py-3 rounded-lg transition-colors"
                >
                  Now
                </button>
                <button
                  onClick={() => {}}
                  className="flex-1 bg-gray-800 hover:bg-gray-700 border border-gray-700 text-white font-medium py-3 rounded-lg transition-colors flex items-center justify-center gap-2"
                >
                  <Clock className="w-4 h-4" />
                  Schedule Later
                </button>
              </div>
            </div>
            
            {/* Saved Places Section */}
            {!showRideOptions && (
              <>
                <p className="text-xs font-medium text-gray-500 mb-2">SAVED PLACES</p>
                <div className="space-y-2 mb-4">
                  {savedShortcuts.map((shortcut) => (
                <button
                  key={shortcut.id}
                  onClick={() => {
                    setDropoff(shortcut.address || shortcut.label)
                    setDropoffLocation(shortcut.coordinates || undefined)
                    if (pickupLocation && shortcut.coordinates) {
                      const distance = calculateDistance(
                        pickupLocation.lat,
                        pickupLocation.lng,
                        shortcut.coordinates.lat,
                        shortcut.coordinates.lng
                      )
                      const cost = estimateRideCost(distance, selectedRide)
                      setEstimatedCost(`$${cost.toFixed(2)}`)
                      setEstimatedTime(`${Math.ceil(distance * 2)} min`)
                    }
                    setShowRideOptions(true)
                  }}
                  className="w-full flex items-center gap-4 bg-gray-800/50 hover:bg-gray-700/60 border border-gray-700 rounded-xl px-4 py-3 transition-all"
                >
                  <div className="w-10 h-10 bg-gray-700 rounded-xl flex items-center justify-center flex-shrink-0">
                    {shortcut.icon === "briefcase" ? (
                      <svg className="w-5 h-5 text-amber-400" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M20 7h-4V5c0-1.1-.9-2-2-2h-4c-1.1 0-2 .9-2 2v2H4c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V9c0-1.1-.9-2-2-2zm-6 0h-4V5h4v2z"/>
                      </svg>
                    ) : (
                      <svg className="w-5 h-5 text-lime-400" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z"/>
                      </svg>
                    )}
                  </div>
                  <div className="flex-1 text-left">
                    <p className="font-medium text-white text-sm">{shortcut.label}</p>
                    <p className="text-xs text-gray-500">{shortcut.address || "Add shortcut"}</p>
                  </div>
                  {!shortcut.address && <Plus className="w-5 h-5 text-gray-500 flex-shrink-0" />}
                </button>
              ))}
                </div>
              </>
            )}

            {/* Ride Options */}
            {showRideOptions && (
              <>
                <div className="flex items-center gap-4 my-4">
                  <div className="flex-1 h-px bg-gray-800" />
                  <span className="text-gray-500 text-xs font-medium">SELECT A RIDE</span>
                  <div className="flex-1 h-px bg-gray-800" />
                </div>
                </div>

                <div className="space-y-2 mb-4">
                  {RIDE_TYPES.map((ride) => (
                    <button
                      key={ride.id}
                      onClick={() => setSelectedRide(ride.id)}
                      className={`w-full rounded-xl p-3 transition-all border ${
                        selectedRide === ride.id
                          ? "bg-lime-400/20 border-lime-400"
                          : "bg-gray-800/50 border-gray-700 hover:bg-gray-700/60"
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-14 h-10 bg-gray-700 rounded-lg flex items-center justify-center text-2xl">
                          {ride.id === "economy" ? "🚗" : ride.id === "comfort" ? "🚙" : ride.id === "xl" ? "🚐" : "✨"}
                        </div>
                        <div className="flex-1 text-left">
                          <div className="flex items-center gap-2">
                            <h3 className="font-semibold text-white">{ride.name}</h3>
                            <span className="text-xs text-gray-400 flex items-center gap-1">
                              <Users className="w-3 h-3" />{ride.seats}
                            </span>
                          </div>
                          <div className="flex items-center gap-2 text-xs text-gray-400">
                            <Clock className="w-3 h-3" />
                            <span>{ride.time}</span>
                          </div>
                        </div>
                        <div className="font-bold text-white text-lg">{ride.price}</div>
                      </div>
                    </button>
                  ))}
                </div>

                {/* Confirm Button */}
                <button 
                  onClick={handleBookRide}
                  className="w-full bg-lime-400 hover:bg-lime-500 text-gray-950 font-bold py-4 rounded-xl transition-all duration-300 transform hover:scale-[1.02] active:scale-[0.98]"
                >
                  Confirm {RIDE_TYPES.find(r => r.id === selectedRide)?.name}
                </button>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Location Search Modal */}
      {showLocationSearch && (
        <div className="absolute inset-0 bg-gray-950 z-50 flex flex-col">
          {/* Header */}
          <div className="p-4 border-b border-gray-800">
            <div className="flex items-center gap-3 mb-4">
              <button
                onClick={() => {
                  setShowLocationSearch(false)
                  setSuggestions([])
                  setSearchQuery("")
                }}
                className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center"
              >
                <X className="w-5 h-5 text-white" />
              </button>
              <h2 className="text-lg font-bold text-white">
                {searchType === "pickup" ? "Set pickup location" : "Where to?"}
              </h2>
            </div>

            {/* Location inputs */}
            <div className="space-y-2">
              <button
                onClick={() => setSearchType("pickup")}
                className={`w-full flex items-center gap-3 bg-gray-800 rounded-xl px-4 py-3 border ${searchType === "pickup" ? "border-lime-400" : "border-transparent"}`}
              >
                <div className="w-3 h-3 bg-lime-400 rounded-full" />
                <span className="text-gray-300 text-left flex-1 truncate">{pickup || "Current location"}</span>
              </button>
              
              <div className={`flex items-center gap-3 bg-gray-800 rounded-xl px-4 py-3 border ${searchType === "dropoff" ? "border-lime-400" : "border-transparent"}`}>
                <div className="w-3 h-3 bg-red-400 rounded-full" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => {
                    setSearchQuery(e.target.value)
                    setSearchType("dropoff")
                    searchPlaces(e.target.value)
                  }}
                  placeholder="Enter destination"
                  className="flex-1 bg-transparent text-white placeholder-gray-500 focus:outline-none"
                  autoFocus
                />
              </div>
            </div>
          </div>

          {/* Suggestions */}
          <div className="flex-1 overflow-y-auto">
            {suggestions.length > 0 ? (
              <div className="p-2">
                {suggestions.map((suggestion) => (
                  <button
                    key={suggestion.placeId}
                    onClick={() => handleSelectPlace(suggestion)}
                    className="w-full flex items-center gap-4 p-3 hover:bg-gray-800 rounded-xl transition-colors"
                  >
                    <div className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center">
                      <MapPin className="w-5 h-5 text-gray-400" />
                    </div>
                    <div className="flex-1 text-left">
                      <p className="font-medium text-white">{suggestion.mainText}</p>
                      <p className="text-sm text-gray-500">{suggestion.secondaryText}</p>
                    </div>
                  </button>
                ))}
              </div>
            ) : searchQuery.length < 2 ? (
              <div className="p-4">
                <p className="text-sm text-gray-500 mb-4">Saved places</p>
                {savedShortcuts.map((shortcut) => (
                  <button
                    key={shortcut.id}
                    className="w-full flex items-center gap-4 p-3 hover:bg-gray-800 rounded-xl transition-colors"
                  >
                    <div className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center">
                      {shortcut.icon === "briefcase" ? (
                        <svg className="w-5 h-5 text-amber-400" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M20 7h-4V5c0-1.1-.9-2-2-2h-4c-1.1 0-2 .9-2 2v2H4c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V9c0-1.1-.9-2-2-2zm-6 0h-4V5h4v2z"/>
                        </svg>
                      ) : (
                        <svg className="w-5 h-5 text-lime-400" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z"/>
                        </svg>
                      )}
                    </div>
                    <div className="flex-1 text-left">
                      <p className="font-medium text-white">{shortcut.label}</p>
                      <p className="text-sm text-gray-500">{shortcut.address || "Set location"}</p>
                    </div>
                  </button>
                ))}
                
                {/* Use current location */}
                <button
                  onClick={() => {
                    setShowLocationSearch(false)
                  }}
                  className="w-full flex items-center gap-4 p-3 hover:bg-gray-800 rounded-xl transition-colors mt-2"
                >
                  <div className="w-10 h-10 bg-lime-400/20 rounded-full flex items-center justify-center">
                    <Navigation className="w-5 h-5 text-lime-400" />
                  </div>
                  <div className="flex-1 text-left">
                    <p className="font-medium text-white">Use current location</p>
                    <p className="text-sm text-gray-500">Your GPS location</p>
                  </div>
                </button>
              </div>
            ) : (
              <div className="p-8 text-center">
                <p className="text-gray-500">No results found</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
