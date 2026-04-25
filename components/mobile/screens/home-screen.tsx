"use client"

import { useState, useEffect, useRef, useCallback } from "react"
import { MapPin, Navigation, Clock, Users, Plus, X, Home, Briefcase, Search } from "lucide-react"
import { loadGoogleMaps } from "@/lib/google-maps-loader"

interface PlaceSuggestion {
  placeId: string
  description: string
  mainText: string
  secondaryText: string
}

interface RideType {
  id: string
  name: string
  price: number
  eta: string
  capacity: number
  icon: string
}

const RIDE_TYPES: RideType[] = [
  { id: "economy", name: "Economy", price: 12.50, eta: "3 min", capacity: 4, icon: "🚗" },
  { id: "comfort", name: "Comfort", price: 18.75, eta: "5 min", capacity: 4, icon: "🚙" },
  { id: "xl", name: "XL", price: 25.00, eta: "7 min", capacity: 6, icon: "🚐" },
  { id: "premium", name: "Premium", price: 35.00, eta: "4 min", capacity: 4, icon: "✨" },
]

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
  const mapRef = useRef<HTMLDivElement>(null)
  const mapInstanceRef = useRef<google.maps.Map | null>(null)
  const pickupMarkerRef = useRef<google.maps.Marker | null>(null)
  const dropoffMarkerRef = useRef<google.maps.Marker | null>(null)
  const searchTimeoutRef = useRef<NodeJS.Timeout | null>(null)

  const [mapLoaded, setMapLoaded] = useState(false)
  const [pickup, setPickup] = useState("")
  const [dropoff, setDropoff] = useState("")
  const [pickupCoords, setPickupCoords] = useState<{ lat: number; lng: number } | null>(null)
  const [dropoffCoords, setDropoffCoords] = useState<{ lat: number; lng: number } | null>(null)
  const [selectedRide, setSelectedRide] = useState("economy")
  const [showRideOptions, setShowRideOptions] = useState(false)
  const [showLocationSearch, setShowLocationSearch] = useState(false)
  const [searchType, setSearchType] = useState<"pickup" | "dropoff">("pickup")
  const [searchQuery, setSearchQuery] = useState("")
  const [suggestions, setSuggestions] = useState<PlaceSuggestion[]>([])
  const [scheduleMode, setScheduleMode] = useState<"now" | "later">("now")

  const [greeting] = useState(() => {
    const hour = new Date().getHours()
    if (hour < 12) return "Good Morning"
    if (hour < 17) return "Good Afternoon"
    return "Good Evening"
  })

  // Initialize Google Maps
  useEffect(() => {
    const initMap = async () => {
      try {
        await loadGoogleMaps()
        
        if (!mapRef.current || !window.google?.maps) return

        // Get user location
        navigator.geolocation?.getCurrentPosition(
          (position) => {
            const userCoords = {
              lat: position.coords.latitude,
              lng: position.coords.longitude,
            }
            setPickupCoords(userCoords)
            
            const map = new window.google.maps.Map(mapRef.current!, {
              center: userCoords,
              zoom: 15,
              disableDefaultUI: true,
              zoomControl: false,
              mapTypeControl: false,
              streetViewControl: false,
              fullscreenControl: false,
              styles: [
                { featureType: "poi", elementType: "labels", stylers: [{ visibility: "off" }] },
              ],
            })

            mapInstanceRef.current = map
            
            // Add pickup marker
            pickupMarkerRef.current = new window.google.maps.Marker({
              position: userCoords,
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

            // Reverse geocode to get address
            const geocoder = new window.google.maps.Geocoder()
            geocoder.geocode({ location: userCoords }, (results, status) => {
              if (status === "OK" && results?.[0]) {
                setPickup(results[0].formatted_address)
              } else {
                setPickup("Current Location")
              }
            })

            setMapLoaded(true)
          },
          () => {
            // Fallback to Colorado Springs if location fails
            const defaultCoords = { lat: 38.8339, lng: -104.8214 }
            const map = new window.google.maps.Map(mapRef.current!, {
              center: defaultCoords,
              zoom: 13,
              disableDefaultUI: true,
              styles: [
                { featureType: "poi", elementType: "labels", stylers: [{ visibility: "off" }] },
              ],
            })
            mapInstanceRef.current = map
            setMapLoaded(true)
          }
        )
      } catch (error) {
        console.error("Failed to load Google Maps:", error)
      }
    }

    initMap()
  }, [])

  // Update markers when coordinates change
  useEffect(() => {
    if (!mapInstanceRef.current || !window.google?.maps) return

    // Update pickup marker
    if (pickupCoords) {
      if (pickupMarkerRef.current) {
        pickupMarkerRef.current.setPosition(pickupCoords)
      } else {
        pickupMarkerRef.current = new window.google.maps.Marker({
          position: pickupCoords,
          map: mapInstanceRef.current,
          icon: {
            path: window.google.maps.SymbolPath.CIRCLE,
            scale: 10,
            fillColor: "#22c55e",
            fillOpacity: 1,
            strokeColor: "#ffffff",
            strokeWeight: 3,
          },
        })
      }
    }

    // Update dropoff marker
    if (dropoffCoords) {
      if (dropoffMarkerRef.current) {
        dropoffMarkerRef.current.setPosition(dropoffCoords)
      } else {
        dropoffMarkerRef.current = new window.google.maps.Marker({
          position: dropoffCoords,
          map: mapInstanceRef.current,
          icon: {
            path: window.google.maps.SymbolPath.CIRCLE,
            scale: 10,
            fillColor: "#ef4444",
            fillOpacity: 1,
            strokeColor: "#ffffff",
            strokeWeight: 3,
          },
        })
      }

      // Fit bounds to show both markers
      if (pickupCoords) {
        const bounds = new window.google.maps.LatLngBounds()
        bounds.extend(pickupCoords)
        bounds.extend(dropoffCoords)
        mapInstanceRef.current.fitBounds(bounds, 50)
      }
    }
  }, [pickupCoords, dropoffCoords])

  // Search for places using Google Places API
  const searchPlaces = useCallback(async (query: string) => {
    if (!window.google?.maps || query.length < 2) {
      setSuggestions([])
      return
    }

    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current)
    }

    searchTimeoutRef.current = setTimeout(() => {
      const autocompleteService = new window.google.maps.places.AutocompleteService()
      autocompleteService.getPlacePredictions(
        { input: query, componentRestrictions: { country: "us" } },
        (predictions, status) => {
          if (status === "OK" && predictions) {
            setSuggestions(
              predictions.map((p) => ({
                placeId: p.place_id,
                description: p.description,
                mainText: p.structured_formatting.main_text,
                secondaryText: p.structured_formatting.secondary_text || "",
              }))
            )
          }
        }
      )
    }, 300)
  }, [])

  // Handle place selection
  const handleSelectPlace = useCallback((suggestion: PlaceSuggestion) => {
    const placesService = new window.google.maps.places.PlacesService(
      document.createElement("div")
    )
    placesService.getDetails(
      { placeId: suggestion.placeId, fields: ["geometry", "formatted_address"] },
      (place, status) => {
        if (status === "OK" && place?.geometry?.location) {
          const coords = {
            lat: place.geometry.location.lat(),
            lng: place.geometry.location.lng(),
          }
          const address = place.formatted_address || suggestion.description

          if (searchType === "pickup") {
            setPickup(address)
            setPickupCoords(coords)
          } else {
            setDropoff(address)
            setDropoffCoords(coords)
            setShowRideOptions(true)
          }

          mapInstanceRef.current?.panTo(coords)
          setShowLocationSearch(false)
          setSuggestions([])
          setSearchQuery("")
        }
      }
    )
  }, [searchType])

  // Use current location for pickup
  const useCurrentLocation = useCallback(() => {
    navigator.geolocation?.getCurrentPosition(
      (position) => {
        const coords = {
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        }
        setPickupCoords(coords)
        mapInstanceRef.current?.panTo(coords)
        mapInstanceRef.current?.setZoom(15)

        if (window.google?.maps) {
          const geocoder = new window.google.maps.Geocoder()
          geocoder.geocode({ location: coords }, (results, status) => {
            if (status === "OK" && results?.[0]) {
              setPickup(results[0].formatted_address)
            } else {
              setPickup("Current Location")
            }
          })
        }
        setShowLocationSearch(false)
      }
    )
  }, [])

  // Open location search modal
  const openLocationSearch = (type: "pickup" | "dropoff") => {
    setSearchType(type)
    setSearchQuery(type === "pickup" ? pickup : dropoff)
    setShowLocationSearch(true)
  }

  return (
    <div className="flex-1 flex flex-col bg-white relative overflow-hidden">
      {/* Google Map */}
      <div className="flex-1 relative">
        <div
          ref={mapRef}
          className="absolute inset-0"
          style={{ background: mapLoaded ? "transparent" : "#f3f4f6" }}
        />
        {!mapLoaded && (
          <div className="absolute inset-0 flex items-center justify-center bg-gray-100">
            <div className="text-center">
              <div className="w-8 h-8 border-4 border-green-500 border-t-transparent rounded-full animate-spin mx-auto mb-2" />
              <p className="text-gray-500 text-sm">Loading map...</p>
            </div>
          </div>
        )}
      </div>

      {/* Bottom Sheet */}
      <div className="bg-white rounded-t-3xl shadow-2xl relative z-10" style={{ marginTop: "-24px" }}>
        <div className="flex justify-center pt-3 pb-2">
          <div className="w-12 h-1.5 bg-gray-300 rounded-full" />
        </div>

        <div className="px-5 pb-6">
          {/* Header */}
          <h2 className="text-xl font-bold text-gray-900 mb-4">Where to?</h2>

          {/* Saved Places */}
          <div className="flex gap-3 mb-4">
            <button className="flex items-center gap-2 px-4 py-2 bg-gray-100 rounded-full">
              <Home className="w-4 h-4 text-amber-500" />
              <span className="text-sm font-medium text-gray-700">Home</span>
            </button>
            <button className="flex items-center gap-2 px-4 py-2 bg-gray-100 rounded-full">
              <Briefcase className="w-4 h-4 text-blue-500" />
              <span className="text-sm font-medium text-gray-700">Work</span>
            </button>
            <button className="flex items-center gap-2 px-4 py-2 bg-gray-100 rounded-full">
              <Plus className="w-4 h-4 text-gray-500" />
              <span className="text-sm font-medium text-gray-700">Add</span>
            </button>
          </div>

          {/* Pickup Location */}
          <button
            onClick={() => openLocationSearch("pickup")}
            className="w-full flex items-center gap-4 p-4 bg-gray-50 rounded-xl mb-3"
          >
            <div className="w-3 h-3 bg-green-500 rounded-full" />
            <div className="flex-1 text-left">
              <p className={`${pickup ? "text-gray-900" : "text-gray-400"}`}>
                {pickup || "Pickup location"}
              </p>
            </div>
            <Navigation className="w-5 h-5 text-green-500" />
          </button>

          {/* Dropoff Location */}
          <button
            onClick={() => openLocationSearch("dropoff")}
            className="w-full flex items-center gap-4 p-4 bg-gray-50 rounded-xl mb-4"
          >
            <div className="w-3 h-3 bg-red-500 rounded-full" />
            <div className="flex-1 text-left">
              <p className={`${dropoff ? "text-gray-900" : "text-gray-400"}`}>
                {dropoff || "Enter destination address"}
              </p>
            </div>
          </button>

          {/* Schedule Options */}
          <div className="flex gap-3 mb-4">
            <button
              onClick={() => setScheduleMode("now")}
              className={`flex-1 py-3 rounded-xl font-medium transition-all ${
                scheduleMode === "now"
                  ? "bg-green-500 text-white"
                  : "bg-gray-100 text-gray-700"
              }`}
            >
              Ride Now
            </button>
            <button
              onClick={() => setScheduleMode("later")}
              className={`flex-1 py-3 rounded-xl font-medium transition-all flex items-center justify-center gap-2 ${
                scheduleMode === "later"
                  ? "bg-green-500 text-white"
                  : "bg-gray-100 text-gray-700"
              }`}
            >
              <Clock className="w-4 h-4" />
              Schedule
            </button>
          </div>

          {/* Ride Options */}
          {showRideOptions && (
            <>
              <div className="flex items-center gap-4 my-4">
                <div className="flex-1 h-px bg-gray-200" />
                <span className="text-gray-500 text-xs font-medium">SELECT A RIDE</span>
                <div className="flex-1 h-px bg-gray-200" />
              </div>

              <div className="space-y-2 mb-4">
                {RIDE_TYPES.map((ride) => (
                  <button
                    key={ride.id}
                    onClick={() => setSelectedRide(ride.id)}
                    className={`w-full flex items-center gap-4 p-4 rounded-xl border-2 transition-all ${
                      selectedRide === ride.id
                        ? "border-green-500 bg-green-50"
                        : "border-gray-100 bg-white"
                    }`}
                  >
                    <div className="w-12 h-12 bg-gray-100 rounded-xl flex items-center justify-center text-2xl">
                      {ride.icon}
                    </div>
                    <div className="flex-1 text-left">
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-gray-900">{ride.name}</span>
                        <div className="flex items-center gap-1 text-gray-500 text-sm">
                          <Users className="w-3 h-3" />
                          <span>{ride.capacity}</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-1 text-gray-500 text-sm">
                        <Clock className="w-3 h-3" />
                        <span>in {ride.eta}</span>
                      </div>
                    </div>
                    <span className="text-lg font-bold text-gray-900">${ride.price.toFixed(2)}</span>
                  </button>
                ))}
              </div>

              {/* Book Button */}
              <button className="w-full py-4 bg-green-500 hover:bg-green-600 text-white font-semibold rounded-xl transition-colors">
                Book {RIDE_TYPES.find(r => r.id === selectedRide)?.name} - ${RIDE_TYPES.find(r => r.id === selectedRide)?.price.toFixed(2)}
              </button>
            </>
          )}
        </div>
      </div>

      {/* Location Search Modal */}
      {showLocationSearch && (
        <div className="absolute inset-0 bg-white z-50 flex flex-col">
          {/* Header */}
          <div className="flex items-center gap-4 p-4 border-b border-gray-200">
            <button
              onClick={() => {
                setShowLocationSearch(false)
                setSuggestions([])
                setSearchQuery("")
              }}
              className="w-10 h-10 flex items-center justify-center"
            >
              <X className="w-6 h-6 text-gray-500" />
            </button>
            <h2 className="text-lg font-semibold text-gray-900">
              Set {searchType === "pickup" ? "pickup" : "dropoff"} location
            </h2>
          </div>

          {/* Search Input */}
          <div className="p-4 border-b border-gray-200">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value)
                  searchPlaces(e.target.value)
                }}
                placeholder="Search for a location"
                className="w-full pl-12 pr-4 py-3 bg-gray-100 rounded-xl focus:ring-2 focus:ring-green-500 focus:bg-white"
                autoFocus
              />
            </div>
          </div>

          {/* Use Current Location */}
          {searchType === "pickup" && (
            <button
              onClick={useCurrentLocation}
              className="flex items-center gap-4 p-4 border-b border-gray-100 hover:bg-gray-50"
            >
              <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                <Navigation className="w-5 h-5 text-green-600" />
              </div>
              <div className="text-left">
                <p className="font-medium text-gray-900">Use current location</p>
                <p className="text-sm text-gray-500">Your GPS location</p>
              </div>
            </button>
          )}

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
