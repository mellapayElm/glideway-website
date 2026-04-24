"use client"

import { useState, useEffect, useRef, useCallback } from "react"

// Ride type options with colors
const RIDE_TYPES = [
  { id: "economy", name: "Economy", icon: "🚗", price: 1.0, color: "#22c55e", time: "3 min" },
  { id: "comfort", name: "Comfort", icon: "🚙", price: 1.5, color: "#3b82f6", time: "5 min" },
  { id: "xl", name: "XL", icon: "🚐", price: 2.0, color: "#8b5cf6", time: "7 min" },
  { id: "premium", name: "Premium", icon: "✨", price: 2.5, color: "#f59e0b", time: "4 min" },
]

interface PlaceSuggestion {
  placeId: string
  description: string
  mainText: string
  secondaryText: string
}

// The new correct API key
const GOOGLE_MAPS_API_KEY = "AIzaSyAc7vlAT_grULZzlCdRB_LfdANiOt9mDP4"

export function GlideWayRide() {
  const [pickup, setPickup] = useState("")
  const [dropoff, setDropoff] = useState("")
  const [selectedRide, setSelectedRide] = useState("economy")
  const [scheduleType, setScheduleType] = useState("now")
  const [scheduledTime, setScheduledTime] = useState("")
  const [promoCode, setPromoCode] = useState("")
  const [driverNote, setDriverNote] = useState("")
  const [estimatedFare, setEstimatedFare] = useState(0)
  const [estimatedDistance, setEstimatedDistance] = useState(0)
  const [isSearching, setIsSearching] = useState(false)
  const [mapLoaded, setMapLoaded] = useState(false)
  const [mapError, setMapError] = useState<string | null>(null)
  const mapRef = useRef<HTMLDivElement>(null)
  const mapInstanceRef = useRef<google.maps.Map | null>(null)

  // Autocomplete state
  const [pickupSuggestions, setPickupSuggestions] = useState<PlaceSuggestion[]>([])
  const [dropoffSuggestions, setDropoffSuggestions] = useState<PlaceSuggestion[]>([])
  const [showPickupSuggestions, setShowPickupSuggestions] = useState(false)
  const [showDropoffSuggestions, setShowDropoffSuggestions] = useState(false)
  const [pickupLoading, setPickupLoading] = useState(false)
  const [dropoffLoading, setDropoffLoading] = useState(false)
  const autocompleteServiceRef = useRef<google.maps.places.AutocompleteService | null>(null)
  const sessionTokenRef = useRef<google.maps.places.AutocompleteSessionToken | null>(null)
  const pickupDebounceRef = useRef<NodeJS.Timeout | null>(null)
  const dropoffDebounceRef = useRef<NodeJS.Timeout | null>(null)
  const pickupRef = useRef<HTMLDivElement>(null)
  const dropoffRef = useRef<HTMLDivElement>(null)

  // Initialize Google Maps
  useEffect(() => {
    const initMap = async () => {
      if (!mapRef.current) return
      
      try {
        // Remove any existing Google Maps scripts to force reload with correct key
        const existingScripts = document.querySelectorAll('script[src*="maps.googleapis.com"]')
        
        // Only load if not already loaded with our key
        if (!window.google?.maps) {
          const script = document.createElement("script")
          script.src = `https://maps.googleapis.com/maps/api/js?key=${GOOGLE_MAPS_API_KEY}&libraries=places&v=weekly`
          script.async = true
          script.defer = true
          
          await new Promise<void>((resolve, reject) => {
            script.onload = () => resolve()
            script.onerror = () => reject(new Error("Failed to load Google Maps"))
            document.head.appendChild(script)
          })
        }

        // Create map instance
        const map = new window.google.maps.Map(mapRef.current, {
          center: { lat: 38.8339, lng: -104.8214 }, // Colorado Springs
          zoom: 13,
          mapTypeControl: false,
          streetViewControl: false,
          fullscreenControl: true,
          zoomControl: true,
          styles: [
            { featureType: "poi", elementType: "labels", stylers: [{ visibility: "off" }] },
            { featureType: "transit", elementType: "labels", stylers: [{ visibility: "off" }] },
          ],
        })

        mapInstanceRef.current = map
        setMapLoaded(true)

        // Initialize Places AutocompleteService
        if (window.google.maps.places) {
          autocompleteServiceRef.current = new window.google.maps.places.AutocompleteService()
          sessionTokenRef.current = new window.google.maps.places.AutocompleteSessionToken()
        }

        // Try to get user location
        if (navigator.geolocation) {
          navigator.geolocation.getCurrentPosition(
            (position) => {
              const userLoc = {
                lat: position.coords.latitude,
                lng: position.coords.longitude,
              }
              map.setCenter(userLoc)
            },
            () => {} // Ignore errors
          )
        }
      } catch (err) {
        setMapError(err instanceof Error ? err.message : "Map failed to load")
      }
    }

    initMap()
  }, [])

  // Close suggestions on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (pickupRef.current && !pickupRef.current.contains(e.target as Node)) {
        setShowPickupSuggestions(false)
      }
      if (dropoffRef.current && !dropoffRef.current.contains(e.target as Node)) {
        setShowDropoffSuggestions(false)
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  // Fetch place suggestions
  const fetchSuggestions = useCallback((
    query: string,
    setSuggestions: (s: PlaceSuggestion[]) => void,
    setLoading: (b: boolean) => void
  ) => {
    if (!autocompleteServiceRef.current || query.length < 2) {
      setSuggestions([])
      return
    }

    setLoading(true)
    autocompleteServiceRef.current.getPlacePredictions(
      {
        input: query,
        sessionToken: sessionTokenRef.current ?? undefined,
        componentRestrictions: { country: "us" },
      },
      (predictions, status) => {
        setLoading(false)
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

  // Debounced pickup input handler
  const handlePickupChange = (value: string) => {
    setPickup(value)
    setShowPickupSuggestions(true)
    if (pickupDebounceRef.current) clearTimeout(pickupDebounceRef.current)
    pickupDebounceRef.current = setTimeout(() => {
      fetchSuggestions(value, setPickupSuggestions, setPickupLoading)
    }, 300)
  }

  // Debounced dropoff input handler
  const handleDropoffChange = (value: string) => {
    setDropoff(value)
    setShowDropoffSuggestions(true)
    if (dropoffDebounceRef.current) clearTimeout(dropoffDebounceRef.current)
    dropoffDebounceRef.current = setTimeout(() => {
      fetchSuggestions(value, setDropoffSuggestions, setDropoffLoading)
    }, 300)
  }

  // Select a suggestion
  const selectSuggestion = (
    suggestion: PlaceSuggestion,
    setValue: (s: string) => void,
    setShow: (b: boolean) => void
  ) => {
    setValue(suggestion.description)
    setShow(false)
    // Refresh session token after selection
    if (window.google?.maps?.places) {
      sessionTokenRef.current = new window.google.maps.places.AutocompleteSessionToken()
    }
  }

  // Calculate fare estimate in real-time
  useEffect(() => {
    if (pickup && dropoff) {
      // Simulate distance calculation (in production, use Distance Matrix API)
      const randomDistance = 3 + Math.random() * 15
      setEstimatedDistance(randomDistance)
      
      const rideType = RIDE_TYPES.find(r => r.id === selectedRide)
      const baseFare = 2.50
      const perMile = rideType?.price || 1.0
      const fare = baseFare + (randomDistance * perMile)
      
      // Apply promo discount
      let finalFare = fare
      if (promoCode.toUpperCase() === "GLIDE10") {
        finalFare = fare * 0.9
      } else if (promoCode.toUpperCase() === "FIRST20") {
        finalFare = fare * 0.8
      }
      
      setEstimatedFare(finalFare)
    } else {
      setEstimatedFare(0)
      setEstimatedDistance(0)
    }
  }, [pickup, dropoff, selectedRide, promoCode])

  // Handle search
  const handleSearch = () => {
    if (!pickup || !dropoff) {
      return
    }
    setIsSearching(true)
    setTimeout(() => {
      setIsSearching(false)
    }, 2000)
  }

  // Get current location
  const getCurrentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const lat = position.coords.latitude
          const lng = position.coords.longitude
          setPickup(`${lat.toFixed(4)}, ${lng.toFixed(4)}`)
          
          // Center map on user location
          if (mapInstanceRef.current) {
            mapInstanceRef.current.setCenter({ lat, lng })
            mapInstanceRef.current.setZoom(15)
          }
        },
        () => {
          setPickup("Location unavailable - please enter manually")
        }
      )
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-blue-50 to-white">
      {/* Header */}
      <div className="bg-gradient-to-r from-green-600 to-green-700 text-white py-6 px-4 shadow-lg">
        <div className="max-w-6xl mx-auto flex items-center gap-4">
          <div className="w-14 h-14 bg-white rounded-xl flex items-center justify-center shadow-md">
            <span className="text-3xl">🚗</span>
          </div>
          <div>
            <h1 className="text-2xl font-bold tracking-tight">GlideWay</h1>
            <p className="text-green-100 text-sm">Ride smoothly, safely, and easily</p>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto p-4 lg:p-8">
        <div className="grid lg:grid-cols-2 gap-8">
          
          {/* Left Column - Booking Form */}
          <div className="space-y-6">
            <div className="bg-white rounded-2xl shadow-xl p-6 border border-gray-100">
              <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                <span className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                  <span className="text-green-600">📍</span>
                </span>
                Book Your Ride
              </h2>

              {/* Pickup Location */}
              <div className="mb-4" ref={pickupRef}>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Pickup Location
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 w-3 h-3 bg-green-500 rounded-full z-10" />
                  <input
                    type="text"
                    value={pickup}
                    onChange={(e) => handlePickupChange(e.target.value)}
                    onFocus={() => pickup.length >= 2 && setShowPickupSuggestions(true)}
                    placeholder="Enter pickup address"
                    autoComplete="off"
                    className="w-full pl-10 pr-10 py-3 border-2 border-gray-200 rounded-xl focus:border-green-500 focus:ring-2 focus:ring-green-200 outline-none transition-all text-gray-900 placeholder-gray-400"
                  />
                  {pickupLoading && (
                    <span className="absolute right-3 top-1/2 -translate-y-1/2">
                      <svg className="animate-spin w-4 h-4 text-green-500" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                      </svg>
                    </span>
                  )}
                  {/* Pickup suggestions dropdown */}
                  {showPickupSuggestions && pickupSuggestions.length > 0 && (
                    <ul className="absolute z-50 left-0 right-0 top-full mt-1 bg-white border border-gray-200 rounded-xl shadow-2xl overflow-hidden max-h-64 overflow-y-auto">
                      {pickupSuggestions.map((s) => (
                        <li
                          key={s.placeId}
                          onMouseDown={() => selectSuggestion(s, setPickup, setShowPickupSuggestions)}
                          className="flex items-start gap-3 px-4 py-3 hover:bg-green-50 cursor-pointer border-b border-gray-50 last:border-0 transition-colors"
                        >
                          <svg className="w-5 h-5 mt-0.5 text-green-500 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                          </svg>
                          <div className="min-w-0">
                            <p className="font-semibold text-gray-900 text-sm truncate">{s.mainText}</p>
                            <p className="text-gray-500 text-xs truncate">{s.secondaryText}</p>
                          </div>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
                <button
                  onClick={getCurrentLocation}
                  className="mt-2 flex items-center gap-2 text-green-600 hover:text-green-700 text-sm font-medium transition-colors"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  Use Current Location
                </button>
              </div>

              {/* Dropoff Location */}
              <div className="mb-6" ref={dropoffRef}>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Dropoff Location
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 w-3 h-3 bg-red-500 rounded-sm z-10" />
                  <input
                    type="text"
                    value={dropoff}
                    onChange={(e) => handleDropoffChange(e.target.value)}
                    onFocus={() => dropoff.length >= 2 && setShowDropoffSuggestions(true)}
                    placeholder="Enter destination address"
                    autoComplete="off"
                    className="w-full pl-10 pr-10 py-3 border-2 border-gray-200 rounded-xl focus:border-green-500 focus:ring-2 focus:ring-green-200 outline-none transition-all text-gray-900 placeholder-gray-400"
                  />
                  {dropoffLoading && (
                    <span className="absolute right-3 top-1/2 -translate-y-1/2">
                      <svg className="animate-spin w-4 h-4 text-green-500" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                      </svg>
                    </span>
                  )}
                  {/* Dropoff suggestions dropdown */}
                  {showDropoffSuggestions && dropoffSuggestions.length > 0 && (
                    <ul className="absolute z-50 left-0 right-0 top-full mt-1 bg-white border border-gray-200 rounded-xl shadow-2xl overflow-hidden max-h-64 overflow-y-auto">
                      {dropoffSuggestions.map((s) => (
                        <li
                          key={s.placeId}
                          onMouseDown={() => selectSuggestion(s, setDropoff, setShowDropoffSuggestions)}
                          className="flex items-start gap-3 px-4 py-3 hover:bg-green-50 cursor-pointer border-b border-gray-50 last:border-0 transition-colors"
                        >
                          <svg className="w-5 h-5 mt-0.5 text-red-500 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                          </svg>
                          <div className="min-w-0">
                            <p className="font-semibold text-gray-900 text-sm truncate">{s.mainText}</p>
                            <p className="text-gray-500 text-xs truncate">{s.secondaryText}</p>
                          </div>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              </div>

              {/* Schedule Options */}
              <div className="mb-6">
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  When do you need a ride?
                </label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    onClick={() => setScheduleType("now")}
                    className={`py-3 px-4 rounded-xl font-semibold transition-all ${
                      scheduleType === "now"
                        ? "bg-green-500 text-white shadow-md"
                        : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                    }`}
                  >
                    Now
                  </button>
                  <button
                    onClick={() => setScheduleType("later")}
                    className={`py-3 px-4 rounded-xl font-semibold transition-all ${
                      scheduleType === "later"
                        ? "bg-green-500 text-white shadow-md"
                        : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                    }`}
                  >
                    Schedule Later
                  </button>
                </div>
                {scheduleType === "later" && (
                  <input
                    type="datetime-local"
                    value={scheduledTime}
                    onChange={(e) => setScheduledTime(e.target.value)}
                    className="mt-3 w-full p-3 border-2 border-gray-200 rounded-xl focus:border-green-500 outline-none"
                  />
                )}
              </div>

              {/* Ride Types */}
              <div className="mb-6">
                <label className="block text-sm font-semibold text-gray-700 mb-3">
                  Choose your ride
                </label>
                <div className="grid grid-cols-2 gap-3">
                  {RIDE_TYPES.map((ride) => (
                    <button
                      key={ride.id}
                      onClick={() => setSelectedRide(ride.id)}
                      className={`p-4 rounded-xl border-2 transition-all text-left ${
                        selectedRide === ride.id
                          ? "border-green-500 bg-green-50 shadow-md"
                          : "border-gray-200 hover:border-gray-300"
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div 
                          className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl"
                          style={{ backgroundColor: `${ride.color}20` }}
                        >
                          {ride.icon}
                        </div>
                        <div>
                          <p className="font-bold text-gray-900">{ride.name}</p>
                          <p className="text-sm text-gray-500">{ride.time} away</p>
                        </div>
                      </div>
                      {selectedRide === ride.id && (
                        <div className="mt-2 text-xs font-semibold text-green-600 bg-green-100 px-2 py-1 rounded-full inline-block">
                          Selected
                        </div>
                      )}
                    </button>
                  ))}
                </div>
              </div>

              {/* Promo Code */}
              <div className="mb-4">
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Promo Code (Optional)
                </label>
                <input
                  type="text"
                  value={promoCode}
                  onChange={(e) => setPromoCode(e.target.value)}
                  placeholder="Enter promo code"
                  className="w-full p-3 border-2 border-gray-200 rounded-xl focus:border-green-500 outline-none text-gray-900 placeholder-gray-400"
                />
                {promoCode && (promoCode.toUpperCase() === "GLIDE10" || promoCode.toUpperCase() === "FIRST20") && (
                  <p className="mt-1 text-sm text-green-600 font-medium">
                    {promoCode.toUpperCase() === "GLIDE10" ? "10% discount applied!" : "20% discount applied!"}
                  </p>
                )}
              </div>

              {/* Driver Note */}
              <div className="mb-6">
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Note for Driver (Optional)
                </label>
                <textarea
                  value={driverNote}
                  onChange={(e) => setDriverNote(e.target.value)}
                  placeholder="Gate code, pickup instructions, accessibility needs..."
                  rows={2}
                  className="w-full p-3 border-2 border-gray-200 rounded-xl focus:border-green-500 outline-none resize-none text-gray-900 placeholder-gray-400"
                />
              </div>

              {/* Search Button */}
              <button
                onClick={handleSearch}
                disabled={!pickup || !dropoff || isSearching}
                className={`w-full py-4 rounded-xl font-bold text-lg transition-all ${
                  pickup && dropoff && !isSearching
                    ? "bg-gray-900 text-white hover:bg-gray-800 shadow-lg"
                    : "bg-gray-300 text-gray-500 cursor-not-allowed"
                }`}
              >
                {isSearching ? (
                  <span className="flex items-center justify-center gap-2">
                    <svg className="animate-spin w-5 h-5" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                    </svg>
                    Finding your ride...
                  </span>
                ) : (
                  "Search Ride"
                )}
              </button>
            </div>
          </div>

          {/* Right Column - Map & Fare Estimate */}
          <div className="space-y-6">
            {/* Fare Estimate */}
            {estimatedFare > 0 && (
              <div className="bg-gradient-to-r from-green-500 to-green-600 rounded-2xl shadow-xl p-6 text-white">
                <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                  <span className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center">
                    💰
                  </span>
                  Fare Estimate
                </h3>
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-white/10 rounded-xl p-4">
                    <p className="text-green-100 text-sm">Distance</p>
                    <p className="text-2xl font-bold">{estimatedDistance.toFixed(1)} mi</p>
                  </div>
                  <div className="bg-white/10 rounded-xl p-4">
                    <p className="text-green-100 text-sm">Estimated Fare</p>
                    <p className="text-2xl font-bold">${estimatedFare.toFixed(2)}</p>
                  </div>
                </div>
                <p className="mt-4 text-sm text-green-100">
                  * Final fare may vary based on traffic and route
                </p>
              </div>
            )}

            {/* Google Maps */}
            <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100">
              <div className="h-80 relative bg-gray-100">
                {/* Google Maps Container */}
                <div ref={mapRef} className="w-full h-full" />

                {/* Loading State */}
                {!mapLoaded && !mapError && (
                  <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-green-100 via-blue-50 to-green-50">
                    <div className="text-center">
                      <svg className="animate-spin w-10 h-10 mx-auto mb-3 text-green-500" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                      </svg>
                      <p className="text-gray-600 font-medium">Loading map...</p>
                    </div>
                  </div>
                )}

                {/* Error State */}
                {mapError && (
                  <div className="absolute inset-0 flex items-center justify-center bg-red-50">
                    <div className="text-center p-4">
                      <svg className="w-12 h-12 mx-auto mb-3 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                      </svg>
                      <p className="text-red-600 font-semibold mb-1">Map Error</p>
                      <p className="text-red-500 text-sm">{mapError}</p>
                    </div>
                  </div>
                )}

                {/* GlideWay Attribution */}
                <div className="absolute bottom-2 right-2 bg-white/95 px-2 py-1 rounded text-xs text-gray-600 shadow-sm z-10">
                  GlideWay Maps
                </div>
              </div>
              
              <div className="p-4 bg-green-50 border-t border-green-100">
                <p className="text-sm text-green-700 font-medium flex items-center gap-2">
                  <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                  3 drivers nearby - Average pickup: 4 min
                </p>
              </div>
            </div>

            {/* Safety Card */}
            <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl shadow-xl p-6 text-white">
              <h3 className="text-lg font-semibold mb-3">Your Safety Matters</h3>
              <ul className="space-y-2 text-sm">
                <li className="flex items-center gap-2">
                  <svg className="w-4 h-4 text-green-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  All drivers background checked
                </li>
                <li className="flex items-center gap-2">
                  <svg className="w-4 h-4 text-green-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  Real-time trip tracking
                </li>
                <li className="flex items-center gap-2">
                  <svg className="w-4 h-4 text-green-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  24/7 customer support
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
