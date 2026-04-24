"use client"

import { useState, useEffect, useRef, useCallback } from "react"
import { GlidewayLogo } from "@/components/glideway-logo"

const GOOGLE_MAPS_API_KEY = "AIzaSyAc7vlAT_grULZzlCdRB_LfdANiOt9mDP4"

const RIDE_TYPES = [
  { id: "economy", name: "Economy", icon: "🚗", multiplier: 1.0, time: "3 min", seats: 4 },
  { id: "comfort", name: "Comfort", icon: "🚙", multiplier: 1.5, time: "5 min", seats: 4 },
  { id: "xl", name: "XL", icon: "🚐", multiplier: 2.0, time: "7 min", seats: 6 },
  { id: "premium", name: "Premium", icon: "✨", multiplier: 2.5, time: "4 min", seats: 4 },
]

const SAVED_PLACES = [
  { id: "home", name: "Home", address: "123 Main St, Colorado Springs", icon: "🏠" },
  { id: "work", name: "Work", address: "456 Business Ave, Colorado Springs", icon: "💼" },
]

interface PlaceSuggestion {
  placeId: string
  description: string
  mainText: string
  secondaryText: string
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
  const [pickup, setPickup] = useState("")
  const [dropoff, setDropoff] = useState("")
  const [selectedRide, setSelectedRide] = useState("economy")
  const [scheduleType, setScheduleType] = useState<"now" | "later">("now")
  const [showRideOptions, setShowRideOptions] = useState(false)
  const [estimatedFare, setEstimatedFare] = useState(0)
  const [promoCode, setPromoCode] = useState("")
  const [promoApplied, setPromoApplied] = useState(false)
  const [driverNote, setDriverNote] = useState("")
  const [orderForOther, setOrderForOther] = useState(false)
  const [otherPersonPhone, setOtherPersonPhone] = useState("")
  
  // Autocomplete state
  const [pickupSuggestions, setPickupSuggestions] = useState<PlaceSuggestion[]>([])
  const [dropoffSuggestions, setDropoffSuggestions] = useState<PlaceSuggestion[]>([])
  const [showPickupSuggestions, setShowPickupSuggestions] = useState(false)
  const [showDropoffSuggestions, setShowDropoffSuggestions] = useState(false)
  const [activeInput, setActiveInput] = useState<"pickup" | "dropoff" | null>(null)
  
  // Map state
  const [mapLoaded, setMapLoaded] = useState(false)
  const mapRef = useRef<HTMLDivElement>(null)
  const mapInstanceRef = useRef<google.maps.Map | null>(null)
  const autocompleteServiceRef = useRef<google.maps.places.AutocompleteService | null>(null)
  const debounceRef = useRef<NodeJS.Timeout | null>(null)

  // Load Google Maps
  useEffect(() => {
    const loadMaps = async () => {
      if (window.google?.maps) {
        initMap()
        return
      }

      const script = document.createElement("script")
      script.src = `https://maps.googleapis.com/maps/api/js?key=${GOOGLE_MAPS_API_KEY}&libraries=places&v=weekly`
      script.async = true
      script.onload = () => initMap()
      document.head.appendChild(script)
    }

    const initMap = () => {
      if (!mapRef.current || !window.google?.maps) return

      const map = new window.google.maps.Map(mapRef.current, {
        center: { lat: 38.8339, lng: -104.8214 },
        zoom: 14,
        disableDefaultUI: true,
        zoomControl: false,
        styles: [
          { featureType: "poi", stylers: [{ visibility: "off" }] },
          { featureType: "transit", stylers: [{ visibility: "off" }] },
        ],
      })

      mapInstanceRef.current = map
      setMapLoaded(true)

      if (window.google.maps.places) {
        autocompleteServiceRef.current = new window.google.maps.places.AutocompleteService()
      }

      // Get user location
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (pos) => {
            const loc = { lat: pos.coords.latitude, lng: pos.coords.longitude }
            map.setCenter(loc)
          },
          () => {}
        )
      }
    }

    loadMaps()
  }, [])

  // Fetch suggestions
  const fetchSuggestions = useCallback((
    query: string,
    setSuggestions: (s: PlaceSuggestion[]) => void
  ) => {
    if (!autocompleteServiceRef.current || query.length < 2) {
      setSuggestions([])
      return
    }

    autocompleteServiceRef.current.getPlacePredictions(
      { input: query, componentRestrictions: { country: "us" } },
      (predictions, status) => {
        if (status === window.google.maps.places.PlacesServiceStatus.OK && predictions) {
          setSuggestions(
            predictions.map((p) => ({
              placeId: p.place_id,
              description: p.description,
              mainText: p.structured_formatting.main_text,
              secondaryText: p.structured_formatting.secondary_text,
            }))
          )
        } else {
          setSuggestions([])
        }
      }
    )
  }, [])

  const handleInputChange = (value: string, type: "pickup" | "dropoff") => {
    if (type === "pickup") {
      setPickup(value)
      setShowPickupSuggestions(true)
    } else {
      setDropoff(value)
      setShowDropoffSuggestions(true)
    }

    if (debounceRef.current) clearTimeout(debounceRef.current)
    debounceRef.current = setTimeout(() => {
      fetchSuggestions(
        value,
        type === "pickup" ? setPickupSuggestions : setDropoffSuggestions
      )
    }, 300)
  }

  const selectSuggestion = (suggestion: PlaceSuggestion, type: "pickup" | "dropoff") => {
    if (type === "pickup") {
      setPickup(suggestion.description)
      setShowPickupSuggestions(false)
    } else {
      setDropoff(suggestion.description)
      setShowDropoffSuggestions(false)
    }
    setActiveInput(null)
  }

  // Calculate fare
  useEffect(() => {
    if (pickup && dropoff) {
      const baseFare = 5
      const distance = 3 + Math.random() * 10
      const rideType = RIDE_TYPES.find(r => r.id === selectedRide)
      let fare = (baseFare + distance * 1.5) * (rideType?.multiplier || 1)
      if (promoApplied) fare *= 0.9
      setEstimatedFare(Math.round(fare * 100) / 100)
      setShowRideOptions(true)
    }
  }, [pickup, dropoff, selectedRide, promoApplied])

  const handleBookRide = () => {
    if (!pickup || !dropoff) return

    setIsTracking(true)
    setActiveRide({
      id: `ride-${Date.now()}`,
      status: "searching",
      pickup,
      dropoff,
      fare: estimatedFare,
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

  const useCurrentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          setPickup(`${pos.coords.latitude.toFixed(4)}, ${pos.coords.longitude.toFixed(4)}`)
          if (mapInstanceRef.current) {
            mapInstanceRef.current.setCenter({
              lat: pos.coords.latitude,
              lng: pos.coords.longitude,
            })
          }
        },
        () => setPickup("Location unavailable")
      )
    }
  }

  const applyPromo = () => {
    if (promoCode.toUpperCase() === "GLIDE10") {
      setPromoApplied(true)
    }
  }

  // Live tracking view
  if (isTracking && activeRide) {
    return (
      <LiveTrackingView 
        ride={activeRide} 
        setActiveRide={setActiveRide}
        setIsTracking={setIsTracking}
      />
    )
  }

  return (
    <div className="flex flex-col h-full">
      {/* Map */}
      <div className="relative flex-1">
        <div ref={mapRef} className="w-full h-full bg-gray-200" />
        
        {!mapLoaded && (
          <div className="absolute inset-0 flex items-center justify-center bg-emerald-50">
            <div className="text-center">
              <svg className="animate-spin w-8 h-8 mx-auto mb-2 text-emerald-500" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
              </svg>
              <p className="text-gray-600 text-sm">Loading map...</p>
            </div>
          </div>
        )}

        {/* Logo and Header */}
        <div className="absolute top-3 left-3 z-20 bg-black/70 rounded-xl p-2 shadow-lg backdrop-blur-sm">
          <GlidewayLogo variant="icon" size="sm" />
        </div>

        {/* Nearby drivers indicator */}
        <div className="absolute top-3 right-3 bg-white rounded-full px-3 py-1.5 shadow-lg flex items-center gap-2 z-20">
          <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
          <span className="text-xs font-medium text-gray-700">4 drivers nearby</span>
        </div>

        {/* Center pin */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-full z-10">
          <div className="w-8 h-8 bg-emerald-500 rounded-full flex items-center justify-center shadow-lg">
            <div className="w-3 h-3 bg-white rounded-full" />
          </div>
          <div className="w-1 h-4 bg-emerald-500 mx-auto -mt-1" />
        </div>
      </div>

      {/* Booking Panel */}
      <div className="bg-white rounded-t-3xl shadow-2xl -mt-6 relative z-20">
        <div className="w-12 h-1 bg-gray-300 rounded-full mx-auto mt-3 mb-4" />
        
        <div className="px-4 pb-4 max-h-[60vh] overflow-y-auto">
          {/* Header */}
          <h2 className="text-lg font-bold text-gray-900 mb-4">Where to?</h2>

          {/* Saved Places */}
          <div className="flex gap-2 mb-4 overflow-x-auto pb-2">
            {SAVED_PLACES.map((place) => (
              <button
                key={place.id}
                onClick={() => setDropoff(place.address)}
                className="flex items-center gap-2 px-3 py-2 bg-gray-100 rounded-full whitespace-nowrap hover:bg-emerald-50 transition-colors"
              >
                <span>{place.icon}</span>
                <span className="text-sm font-medium text-gray-700">{place.name}</span>
              </button>
            ))}
            <button className="flex items-center gap-2 px-3 py-2 bg-gray-100 rounded-full whitespace-nowrap">
              <span className="text-emerald-600">+</span>
              <span className="text-sm font-medium text-gray-700">Add</span>
            </button>
          </div>

          {/* Location Inputs */}
          <div className="space-y-3 mb-4">
            {/* Pickup */}
            <div className="relative">
              <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl border-2 border-transparent focus-within:border-emerald-500 transition-colors">
                <div className="w-3 h-3 bg-emerald-500 rounded-full shrink-0" />
                <input
                  type="text"
                  value={pickup}
                  onChange={(e) => handleInputChange(e.target.value, "pickup")}
                  onFocus={() => setActiveInput("pickup")}
                  placeholder="Pickup location"
                  className="flex-1 bg-transparent outline-none text-gray-900 placeholder-gray-400"
                />
                <button 
                  onClick={useCurrentLocation}
                  className="text-emerald-600 p-1"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  </svg>
                </button>
              </div>
              
              {/* Pickup Suggestions */}
              {showPickupSuggestions && pickupSuggestions.length > 0 && (
                <div className="absolute z-50 left-0 right-0 top-full mt-1 bg-white border border-gray-200 rounded-xl shadow-xl overflow-hidden">
                  {pickupSuggestions.map((s) => (
                    <button
                      key={s.placeId}
                      onClick={() => selectSuggestion(s, "pickup")}
                      className="w-full flex items-start gap-3 p-3 hover:bg-emerald-50 text-left border-b border-gray-50 last:border-0"
                    >
                      <svg className="w-5 h-5 text-emerald-500 shrink-0 mt-0.5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      </svg>
                      <div className="min-w-0">
                        <p className="font-medium text-gray-900 text-sm truncate">{s.mainText}</p>
                        <p className="text-gray-500 text-xs truncate">{s.secondaryText}</p>
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Dropoff */}
            <div className="relative">
              <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl border-2 border-transparent focus-within:border-emerald-500 transition-colors">
                <div className="w-3 h-3 bg-red-500 rounded-sm shrink-0" />
                <input
                  type="text"
                  value={dropoff}
                  onChange={(e) => handleInputChange(e.target.value, "dropoff")}
                  onFocus={() => setActiveInput("dropoff")}
                  placeholder="Where to?"
                  className="flex-1 bg-transparent outline-none text-gray-900 placeholder-gray-400"
                />
              </div>
              
              {/* Dropoff Suggestions */}
              {showDropoffSuggestions && dropoffSuggestions.length > 0 && (
                <div className="absolute z-50 left-0 right-0 top-full mt-1 bg-white border border-gray-200 rounded-xl shadow-xl overflow-hidden">
                  {dropoffSuggestions.map((s) => (
                    <button
                      key={s.placeId}
                      onClick={() => selectSuggestion(s, "dropoff")}
                      className="w-full flex items-start gap-3 p-3 hover:bg-emerald-50 text-left border-b border-gray-50 last:border-0"
                    >
                      <svg className="w-5 h-5 text-red-500 shrink-0 mt-0.5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      </svg>
                      <div className="min-w-0">
                        <p className="font-medium text-gray-900 text-sm truncate">{s.mainText}</p>
                        <p className="text-gray-500 text-xs truncate">{s.secondaryText}</p>
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Schedule Options */}
          <div className="flex gap-2 mb-4">
            <button
              onClick={() => setScheduleType("now")}
              className={`flex-1 py-2 px-3 rounded-lg text-sm font-medium transition-colors ${
                scheduleType === "now"
                  ? "bg-emerald-500 text-white"
                  : "bg-gray-100 text-gray-700"
              }`}
            >
              Ride Now
            </button>
            <button
              onClick={() => setScheduleType("later")}
              className={`flex-1 py-2 px-3 rounded-lg text-sm font-medium transition-colors ${
                scheduleType === "later"
                  ? "bg-emerald-500 text-white"
                  : "bg-gray-100 text-gray-700"
              }`}
            >
              Schedule
            </button>
          </div>

          {/* Ride Options */}
          {showRideOptions && (
            <>
              <div className="space-y-2 mb-4">
                {RIDE_TYPES.map((ride) => (
                  <button
                    key={ride.id}
                    onClick={() => setSelectedRide(ride.id)}
                    className={`w-full flex items-center gap-3 p-3 rounded-xl transition-all ${
                      selectedRide === ride.id
                        ? "bg-emerald-50 border-2 border-emerald-500"
                        : "bg-gray-50 border-2 border-transparent"
                    }`}
                  >
                    <span className="text-2xl">{ride.icon}</span>
                    <div className="flex-1 text-left">
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-gray-900">{ride.name}</span>
                        <span className="text-xs text-gray-500">{ride.seats} seats</span>
                      </div>
                      <span className="text-xs text-gray-500">{ride.time} away</span>
                    </div>
                    <span className="font-bold text-gray-900">
                      ${((5 + 5 * 1.5) * ride.multiplier * (promoApplied ? 0.9 : 1)).toFixed(2)}
                    </span>
                  </button>
                ))}
              </div>

              {/* Promo Code */}
              <div className="flex gap-2 mb-4">
                <input
                  type="text"
                  value={promoCode}
                  onChange={(e) => setPromoCode(e.target.value)}
                  placeholder="Promo code"
                  className="flex-1 px-3 py-2 bg-gray-50 rounded-lg text-sm outline-none focus:ring-2 focus:ring-emerald-500"
                />
                <button
                  onClick={applyPromo}
                  className={`px-4 py-2 rounded-lg text-sm font-medium ${
                    promoApplied
                      ? "bg-emerald-100 text-emerald-700"
                      : "bg-emerald-500 text-white"
                  }`}
                >
                  {promoApplied ? "Applied!" : "Apply"}
                </button>
              </div>

              {/* Driver Note */}
              <input
                type="text"
                value={driverNote}
                onChange={(e) => setDriverNote(e.target.value)}
                placeholder="Note for driver (optional)"
                className="w-full px-3 py-2 bg-gray-50 rounded-lg text-sm mb-4 outline-none focus:ring-2 focus:ring-emerald-500"
              />

              {/* Order for someone else */}
              <div className="flex items-center gap-3 mb-4">
                <button
                  onClick={() => setOrderForOther(!orderForOther)}
                  className={`w-5 h-5 rounded border-2 flex items-center justify-center ${
                    orderForOther
                      ? "bg-emerald-500 border-emerald-500"
                      : "border-gray-300"
                  }`}
                >
                  {orderForOther && (
                    <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" strokeWidth={3} viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                  )}
                </button>
                <span className="text-sm text-gray-700">Order for someone else</span>
              </div>

              {orderForOther && (
                <input
                  type="tel"
                  value={otherPersonPhone}
                  onChange={(e) => setOtherPersonPhone(e.target.value)}
                  placeholder="Their phone number"
                  className="w-full px-3 py-2 bg-gray-50 rounded-lg text-sm mb-4 outline-none focus:ring-2 focus:ring-emerald-500"
                />
              )}

              {/* Fare Estimate */}
              <div className="bg-emerald-50 rounded-xl p-3 mb-4">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Estimated fare</span>
                  <span className="text-xl font-bold text-emerald-600">
                    ${estimatedFare.toFixed(2)}
                  </span>
                </div>
                {promoApplied && (
                  <p className="text-xs text-emerald-600 mt-1">10% discount applied!</p>
                )}
              </div>

              {/* Book Button */}
              <button
                onClick={handleBookRide}
                disabled={!pickup || !dropoff}
                className="w-full py-4 bg-emerald-500 text-white font-bold rounded-xl disabled:opacity-50 disabled:cursor-not-allowed hover:bg-emerald-600 transition-colors"
              >
                Book {RIDE_TYPES.find(r => r.id === selectedRide)?.name}
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  )
}

// Live Tracking Component
function LiveTrackingView({ 
  ride, 
  setActiveRide,
  setIsTracking 
}: { 
  ride: ActiveRide
  setActiveRide: (ride: ActiveRide | null) => void
  setIsTracking: (tracking: boolean) => void
}) {
  const [showChat, setShowChat] = useState(false)
  const [showSafety, setShowSafety] = useState(false)
  const [shareTrip, setShareTrip] = useState(false)
  const [tipAmount, setTipAmount] = useState(0)

  const statusMessages = {
    searching: "Finding your driver...",
    driver_assigned: "Driver on the way",
    arriving: "Driver arriving soon",
    in_trip: "On your way",
    completed: "Trip completed",
  }

  const cancelRide = () => {
    setActiveRide(null)
    setIsTracking(false)
  }

  // Simulate status changes
  useEffect(() => {
    if (ride.status === "driver_assigned") {
      const timer = setTimeout(() => {
        setActiveRide({ ...ride, status: "arriving", eta: 1 })
      }, 5000)
      return () => clearTimeout(timer)
    }
    if (ride.status === "arriving") {
      const timer = setTimeout(() => {
        setActiveRide({ ...ride, status: "in_trip", eta: 12 })
      }, 3000)
      return () => clearTimeout(timer)
    }
  }, [ride, setActiveRide])

  return (
    <div className="flex flex-col h-full bg-gray-50">
      {/* Map area */}
      <div className="flex-1 bg-emerald-100 relative">
        <div className="absolute inset-0 flex items-center justify-center">
          <p className="text-emerald-700 font-medium">Live tracking map</p>
        </div>
        
        {/* Back button */}
        <button
          onClick={cancelRide}
          className="absolute top-4 left-4 w-10 h-10 bg-white rounded-full shadow-lg flex items-center justify-center"
        >
          <svg className="w-5 h-5 text-gray-700" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
          </svg>
        </button>

        {/* Safety button */}
        <button
          onClick={() => setShowSafety(true)}
          className="absolute top-4 right-4 w-10 h-10 bg-red-500 rounded-full shadow-lg flex items-center justify-center"
        >
          <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
          </svg>
        </button>

        {/* Share trip button */}
        <button
          onClick={() => setShareTrip(true)}
          className="absolute top-4 right-16 w-10 h-10 bg-white rounded-full shadow-lg flex items-center justify-center"
        >
          <svg className="w-5 h-5 text-gray-700" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
          </svg>
        </button>
      </div>

      {/* Bottom Panel */}
      <div className="bg-white rounded-t-3xl shadow-2xl -mt-6 relative z-20">
        <div className="w-12 h-1 bg-gray-300 rounded-full mx-auto mt-3 mb-4" />
        
        <div className="px-4 pb-6">
          {/* Status */}
          <div className="flex items-center gap-3 mb-4">
            <div className={`w-3 h-3 rounded-full ${
              ride.status === "searching" ? "bg-yellow-500 animate-pulse" :
              ride.status === "completed" ? "bg-emerald-500" : "bg-emerald-500 animate-pulse"
            }`} />
            <div>
              <p className="font-bold text-gray-900">{statusMessages[ride.status]}</p>
              {ride.eta && ride.status !== "completed" && (
                <p className="text-sm text-gray-500">ETA: {ride.eta} min</p>
              )}
            </div>
          </div>

          {/* Driver Info */}
          {ride.driver && (
            <div className="bg-gray-50 rounded-xl p-4 mb-4">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-12 h-12 bg-emerald-200 rounded-full flex items-center justify-center text-xl">
                  {ride.driver.name[0]}
                </div>
                <div className="flex-1">
                  <p className="font-semibold text-gray-900">{ride.driver.name}</p>
                  <div className="flex items-center gap-1">
                    <svg className="w-4 h-4 text-yellow-500" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                    <span className="text-sm text-gray-600">{ride.driver.rating}</span>
                  </div>
                </div>
                <div className="flex gap-2">
                  <button 
                    onClick={() => setShowChat(true)}
                    className="w-10 h-10 bg-emerald-100 rounded-full flex items-center justify-center"
                  >
                    <svg className="w-5 h-5 text-emerald-600" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                    </svg>
                  </button>
                  <a 
                    href={`tel:${ride.driver.phone}`}
                    className="w-10 h-10 bg-emerald-100 rounded-full flex items-center justify-center"
                  >
                    <svg className="w-5 h-5 text-emerald-600" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                    </svg>
                  </a>
                </div>
              </div>
              <div className="text-sm text-gray-600">
                <p className="font-medium">{ride.driver.vehicle}</p>
                <p className="text-gray-500">{ride.driver.plate}</p>
              </div>
            </div>
          )}

          {/* Trip Details */}
          <div className="space-y-3 mb-4">
            <div className="flex items-start gap-3">
              <div className="w-3 h-3 bg-emerald-500 rounded-full mt-1.5 shrink-0" />
              <div>
                <p className="text-xs text-gray-500">Pickup</p>
                <p className="text-sm font-medium text-gray-900">{ride.pickup}</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-3 h-3 bg-red-500 rounded-sm mt-1.5 shrink-0" />
              <div>
                <p className="text-xs text-gray-500">Dropoff</p>
                <p className="text-sm font-medium text-gray-900">{ride.dropoff}</p>
              </div>
            </div>
          </div>

          {/* Fare */}
          <div className="flex justify-between items-center py-3 border-t border-gray-100">
            <span className="text-gray-600">Estimated fare</span>
            <span className="text-xl font-bold text-emerald-600">${ride.fare.toFixed(2)}</span>
          </div>

          {/* Tip options (show after ride) */}
          {ride.status === "completed" && (
            <div className="mt-4">
              <p className="text-sm font-medium text-gray-700 mb-2">Add a tip</p>
              <div className="flex gap-2">
                {[2, 5, 10].map((amount) => (
                  <button
                    key={amount}
                    onClick={() => setTipAmount(amount)}
                    className={`flex-1 py-2 rounded-lg text-sm font-medium ${
                      tipAmount === amount
                        ? "bg-emerald-500 text-white"
                        : "bg-gray-100 text-gray-700"
                    }`}
                  >
                    ${amount}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Cancel button */}
          {ride.status !== "in_trip" && ride.status !== "completed" && (
            <button
              onClick={cancelRide}
              className="w-full mt-4 py-3 text-red-600 font-medium text-sm"
            >
              Cancel ride
            </button>
          )}
        </div>
      </div>

      {/* Chat Modal */}
      {showChat && (
        <div className="absolute inset-0 bg-black/50 z-50 flex items-end">
          <div className="bg-white w-full rounded-t-3xl p-4 max-h-[80vh]">
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-bold text-lg">Chat with {ride.driver?.name}</h3>
              <button onClick={() => setShowChat(false)} className="p-2">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <div className="h-48 bg-gray-50 rounded-xl mb-4 flex items-center justify-center">
              <p className="text-gray-500 text-sm">No messages yet</p>
            </div>
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="Type a message..."
                className="flex-1 px-4 py-3 bg-gray-100 rounded-xl outline-none"
              />
              <button className="w-12 h-12 bg-emerald-500 rounded-xl flex items-center justify-center">
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Safety Modal */}
      {showSafety && (
        <div className="absolute inset-0 bg-black/50 z-50 flex items-end">
          <div className="bg-white w-full rounded-t-3xl p-4">
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-bold text-lg text-red-600">Safety Center</h3>
              <button onClick={() => setShowSafety(false)} className="p-2">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <div className="space-y-3">
              <button className="w-full p-4 bg-red-50 rounded-xl flex items-center gap-3 text-left">
                <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
                <div>
                  <p className="font-semibold text-red-600">Call 911</p>
                  <p className="text-sm text-red-500">Emergency services</p>
                </div>
              </button>
              <button className="w-full p-4 bg-gray-50 rounded-xl flex items-center gap-3 text-left">
                <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
                </svg>
                <div>
                  <p className="font-semibold text-gray-900">Share trip status</p>
                  <p className="text-sm text-gray-500">With trusted contacts</p>
                </div>
              </button>
              <button className="w-full p-4 bg-gray-50 rounded-xl flex items-center gap-3 text-left">
                <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192l-3.536 3.536M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-5 0a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
                <div>
                  <p className="font-semibold text-gray-900">Report an issue</p>
                  <p className="text-sm text-gray-500">Get help from support</p>
                </div>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
