"use client"

import { useState, useEffect, useRef, useCallback } from "react"
import { Search, MapPin, Clock, Navigation, Plus, X, Home, Briefcase } from "lucide-react"
import { loadGoogleMaps } from "@/lib/google-maps-loader"

const RIDE_TYPES = [
  { id: "economy", name: "Economy", price: "$12.50", time: "3 min away", seats: 4 },
  { id: "comfort", name: "Comfort", price: "$18.75", time: "5 min away", seats: 4 },
  { id: "xl", name: "XL", price: "$25.00", time: "7 min away", seats: 6 },
  { id: "premium", name: "Premium", price: "$35.00", time: "4 min away", seats: 4 },
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
  const [pickup, setPickup] = useState("Pickup location")
  const [dropoff, setDropoff] = useState("")
  const [selectedRide, setSelectedRide] = useState("economy")
  const [showLocationSearch, setShowLocationSearch] = useState(false)
  const [searchType, setSearchType] = useState<"pickup" | "dropoff">("dropoff")
  const [searchQuery, setSearchQuery] = useState("")
  const [suggestions, setSuggestions] = useState<PlaceSuggestion[]>([])
  const [showRideOptions, setShowRideOptions] = useState(false)
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null)
  const [mapRef, setMapRef] = useState<HTMLDivElement | null>(null)
  const [mapInstance, setMapInstance] = useState<google.maps.Map | null>(null)
  
  const debounceRef = useRef<NodeJS.Timeout | null>(null)

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
          setUserLocation({ lat: 38.8339, lng: -104.8214 })
        }
      )
    } else {
      setUserLocation({ lat: 38.8339, lng: -104.8214 })
    }
  }, [])

  // Initialize Google Maps
  useEffect(() => {
    const initMap = async () => {
      if (!mapRef || !userLocation) return
      
      try {
        await loadGoogleMaps()
        if (!window.google?.maps) return

        const map = new window.google.maps.Map(mapRef, {
          center: userLocation,
          zoom: 15,
          disableDefaultUI: true,
          zoomControl: true,
          styles: [
            { elementType: "geometry", stylers: [{ color: "#f5f5f5" }] },
            { elementType: "labels.text.fill", stylers: [{ color: "#616161" }] },
            { featureType: "road", elementType: "geometry", stylers: [{ color: "#ffffff" }] },
            { featureType: "water", elementType: "geometry", stylers: [{ color: "#c9e4f6" }] },
          ],
        })

        new window.google.maps.Marker({
          position: userLocation,
          map,
          icon: {
            path: window.google.maps.SymbolPath.CIRCLE,
            scale: 10,
            fillColor: "#22c55e",
            fillOpacity: 1,
            strokeColor: "#ffffff",
            strokeWeight: 3,
          },
        })

        setMapInstance(map)

        // Reverse geocode for address
        const geocoder = new window.google.maps.Geocoder()
        geocoder.geocode({ location: userLocation }, (results, status) => {
          if (status === "OK" && results?.[0]) {
            setPickup(results[0].formatted_address.split(",")[0])
          }
        })
      } catch (error) {
        console.error("[v0] Failed to initialize Google Maps:", error)
      }
    }

    initMap()
  }, [mapRef, userLocation])

  // Search places
  const searchPlaces = useCallback(async (query: string) => {
    if (query.length < 2) {
      setSuggestions([])
      return
    }

    if (debounceRef.current) clearTimeout(debounceRef.current)

    debounceRef.current = setTimeout(async () => {
      try {
        await loadGoogleMaps()
        if (!window.google?.maps) return

        const service = new window.google.maps.places.AutocompleteService()
        service.getPlacePredictions(
          { input: query, componentRestrictions: { country: "us" } },
          (predictions, status) => {
            if (status === "OK" && predictions) {
              setSuggestions(
                predictions.map((p) => ({
                  placeId: p.place_id,
                  description: p.description,
                  mainText: p.structured_formatting.main_text,
                  secondaryText: p.structured_formatting.secondary_text,
                }))
              )
            }
          }
        )
      } catch (error) {
        console.error("[v0] Search failed:", error)
      }
    }, 300)
  }, [])

  // Handle place selection
  const handleSelectPlace = useCallback((suggestion: PlaceSuggestion) => {
    if (searchType === "pickup") {
      setPickup(suggestion.mainText)
    } else {
      setDropoff(suggestion.mainText)
      setShowRideOptions(true)
    }
    setShowLocationSearch(false)
    setSuggestions([])
    setSearchQuery("")
  }, [searchType])

  // Book ride
  const handleBookRide = () => {
    if (!pickup || !dropoff) return
    setIsTracking(true)
    const ride = RIDE_TYPES.find(r => r.id === selectedRide)
    setActiveRide({
      id: `GW-${Date.now()}`,
      status: "searching",
      pickup,
      dropoff,
      fare: parseFloat(ride?.price.replace("$", "") || "12.50"),
      eta: 4,
    })
  }

  // Cancel ride
  const handleCancelRide = () => {
    setIsTracking(false)
    setActiveRide(null)
    setShowRideOptions(false)
    setDropoff("")
  }

  // Active ride tracking view
  if (isTracking && activeRide) {
    return (
      <div className="flex flex-col h-full bg-white">
        {/* Map */}
        <div className="flex-1 relative bg-gray-100">
          <div ref={setMapRef} className="absolute inset-0" />
        </div>

        {/* Ride Card */}
        <div className="bg-white border-t border-gray-200 rounded-t-3xl -mt-6 relative z-10 shadow-lg">
          <div className="w-12 h-1 bg-gray-300 rounded-full mx-auto mt-3" />
          
          <div className="p-5">
            <div className="text-center mb-4">
              <h3 className="text-lg font-bold text-gray-900">
                {activeRide.status === "searching" ? "Finding your driver..." : "Driver is on the way!"}
              </h3>
              <p className="text-green-600 font-medium">ETA: {activeRide.eta} minutes</p>
            </div>

            {activeRide.driver && (
              <div className="flex items-center gap-4 bg-gray-50 rounded-xl p-4 mb-4">
                <div className="w-14 h-14 bg-green-100 rounded-full flex items-center justify-center text-xl font-bold text-green-600">
                  MJ
                </div>
                <div className="flex-1">
                  <p className="font-semibold text-gray-900">{activeRide.driver.name}</p>
                  <p className="text-sm text-gray-500">{activeRide.driver.vehicle}</p>
                </div>
                <div className="text-right">
                  <p className="font-bold text-gray-900">{activeRide.driver.plate}</p>
                </div>
              </div>
            )}

            <div className="space-y-3 mb-4">
              <div className="flex items-center gap-3">
                <div className="w-3 h-3 bg-green-500 rounded-full" />
                <p className="text-sm text-gray-700 truncate flex-1">{activeRide.pickup}</p>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-3 h-3 bg-red-500 rounded-full" />
                <p className="text-sm text-gray-700 truncate flex-1">{activeRide.dropoff}</p>
              </div>
            </div>

            <button 
              onClick={handleCancelRide}
              className="w-full bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium py-3 rounded-xl transition-colors"
            >
              Cancel Ride
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="flex flex-col h-full bg-white relative">
      {/* Google Map */}
      <div className="h-[45%] relative bg-gray-100">
        <div ref={setMapRef} className="absolute inset-0" />
      </div>

      {/* Bottom Sheet */}
      <div className="flex-1 bg-white rounded-t-3xl -mt-6 relative z-10 shadow-lg overflow-hidden">
        <div className="w-12 h-1 bg-gray-300 rounded-full mx-auto mt-3" />
        
        <div className="p-5 overflow-y-auto h-full pb-20">
          {/* Where to? Header */}
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Where to?</h2>
          
          {/* Quick Place Buttons */}
          <div className="flex gap-2 mb-6">
            <button className="flex items-center gap-2 bg-gray-100 hover:bg-gray-200 rounded-full px-4 py-2 transition-colors">
              <Home className="w-4 h-4 text-amber-500" />
              <span className="text-sm font-medium text-gray-700">Home</span>
            </button>
            <button className="flex items-center gap-2 bg-gray-100 hover:bg-gray-200 rounded-full px-4 py-2 transition-colors">
              <Briefcase className="w-4 h-4 text-blue-500" />
              <span className="text-sm font-medium text-gray-700">Work</span>
            </button>
            <button className="flex items-center gap-2 bg-gray-100 hover:bg-gray-200 rounded-full px-4 py-2 transition-colors">
              <Plus className="w-4 h-4 text-gray-500" />
              <span className="text-sm font-medium text-gray-700">Add</span>
            </button>
          </div>

          {/* Pickup Location */}
          <div className="flex items-center gap-3 border border-gray-200 rounded-xl px-4 py-3 mb-3">
            <div className="w-3 h-3 bg-green-500 rounded-full" />
            <button 
              onClick={() => {
                setSearchType("pickup")
                setShowLocationSearch(true)
              }}
              className="flex-1 text-left text-gray-700"
            >
              {pickup}
            </button>
            <Navigation className="w-5 h-5 text-green-500" />
          </div>

          {/* Dropoff Location */}
          <div className="flex items-center gap-3 border border-gray-200 rounded-xl px-4 py-3 mb-6">
            <div className="w-3 h-3 bg-red-500 rounded-full" />
            <button 
              onClick={() => {
                setSearchType("dropoff")
                setShowLocationSearch(true)
              }}
              className="flex-1 text-left text-gray-400"
            >
              {dropoff || "Enter destination address"}
            </button>
          </div>

          {/* Ride Now / Schedule Buttons */}
          <div className="flex gap-3 mb-6">
            <button 
              onClick={() => dropoff && setShowRideOptions(true)}
              className="flex-1 bg-green-500 hover:bg-green-600 text-white font-semibold py-3 rounded-xl transition-colors"
            >
              Ride Now
            </button>
            <button className="flex-1 bg-white hover:bg-gray-50 border border-gray-300 text-gray-700 font-medium py-3 rounded-xl transition-colors">
              Schedule
            </button>
          </div>

          {/* Ride Options */}
          {showRideOptions && (
            <div className="space-y-3">
              {RIDE_TYPES.map((ride) => (
                <button
                  key={ride.id}
                  onClick={() => setSelectedRide(ride.id)}
                  className={`w-full flex items-center gap-4 p-4 rounded-xl border-2 transition-all ${
                    selectedRide === ride.id
                      ? "border-green-500 bg-green-50"
                      : "border-gray-200 hover:border-gray-300"
                  }`}
                >
                  <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center text-2xl">
                    {ride.id === "economy" ? "🚗" : ride.id === "comfort" ? "🚙" : ride.id === "xl" ? "🚐" : "✨"}
                  </div>
                  <div className="flex-1 text-left">
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-gray-900">{ride.name}</span>
                      <span className="text-xs text-gray-500">{ride.seats} seats</span>
                    </div>
                    <p className="text-sm text-gray-500">{ride.time}</p>
                  </div>
                  <span className="font-bold text-gray-900">{ride.price}</span>
                </button>
              ))}

              <button 
                onClick={handleBookRide}
                className="w-full bg-green-500 hover:bg-green-600 text-white font-bold py-4 rounded-xl transition-colors mt-4"
              >
                Confirm {RIDE_TYPES.find(r => r.id === selectedRide)?.name}
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Location Search Modal */}
      {showLocationSearch && (
        <div className="absolute inset-0 bg-white z-50 flex flex-col">
          {/* Header */}
          <div className="p-4 border-b border-gray-200">
            <div className="flex items-center gap-3 mb-4">
              <button
                onClick={() => {
                  setShowLocationSearch(false)
                  setSuggestions([])
                  setSearchQuery("")
                }}
                className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center"
              >
                <X className="w-5 h-5 text-gray-600" />
              </button>
              <h2 className="text-lg font-bold text-gray-900">
                {searchType === "pickup" ? "Set pickup location" : "Where to?"}
              </h2>
            </div>

            {/* Search Input */}
            <div className="flex items-center gap-3 bg-gray-100 rounded-xl px-4 py-3">
              <Search className="w-5 h-5 text-gray-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value)
                  searchPlaces(e.target.value)
                }}
                placeholder="Search for a place"
                className="flex-1 bg-transparent text-gray-900 placeholder-gray-500 focus:outline-none"
                autoFocus
              />
            </div>
          </div>

          {/* Suggestions */}
          <div className="flex-1 overflow-y-auto">
            {suggestions.map((suggestion) => (
              <button
                key={suggestion.placeId}
                onClick={() => handleSelectPlace(suggestion)}
                className="w-full flex items-center gap-4 p-4 hover:bg-gray-50 border-b border-gray-100"
              >
                <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center">
                  <MapPin className="w-5 h-5 text-gray-500" />
                </div>
                <div className="flex-1 text-left">
                  <p className="font-medium text-gray-900">{suggestion.mainText}</p>
                  <p className="text-sm text-gray-500">{suggestion.secondaryText}</p>
                </div>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
