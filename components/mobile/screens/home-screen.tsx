"use client"

import { useState, useEffect, useRef, useCallback } from "react"
import { Search, Calendar, Users, MapPin, Clock, Navigation, Plus, X } from "lucide-react"
import { loadGoogleMaps } from "@/lib/google-maps-loader"

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
  const [greeting, setGreeting] = useState("Good Morning")
  const [pickup, setPickup] = useState("Current location")
  const [dropoff, setDropoff] = useState("")
  const [selectedRide, setSelectedRide] = useState("economy")
  const [showLocationSearch, setShowLocationSearch] = useState(false)
  const [searchType, setSearchType] = useState<"pickup" | "dropoff">("dropoff")
  const [searchQuery, setSearchQuery] = useState("")
  const [suggestions, setSuggestions] = useState<PlaceSuggestion[]>([])
  const [showRideOptions, setShowRideOptions] = useState(false)
  const [mapLoaded, setMapLoaded] = useState(false)
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null)
  const [savedShortcuts, setSavedShortcuts] = useState(SHORTCUTS)
  
  const mapRef = useRef<HTMLDivElement>(null)
  const mapInstanceRef = useRef<google.maps.Map | null>(null)
  const autocompleteServiceRef = useRef<google.maps.places.AutocompleteService | null>(null)
  const placesServiceRef = useRef<google.maps.places.PlacesService | null>(null)
  const geocoderRef = useRef<google.maps.Geocoder | null>(null)
  const pickupMarkerRef = useRef<google.maps.Marker | null>(null)
  const dropoffMarkerRef = useRef<google.maps.Marker | null>(null)
  const routeRef = useRef<google.maps.DirectionsRenderer | null>(null)
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

  // Initialize Google Maps
  useEffect(() => {
    const initMap = async () => {
      try {
        await loadGoogleMaps()
        
        if (!mapRef.current || !window.google?.maps) return

        const center = userLocation || { lat: 38.8339, lng: -104.8214 }
        
        const map = new window.google.maps.Map(mapRef.current, {
          center,
          zoom: 15,
          disableDefaultUI: true,
          zoomControl: false,
          styles: [
            { elementType: "geometry", stylers: [{ color: "#1d2c4d" }] },
            { elementType: "labels.text.fill", stylers: [{ color: "#8ec3b9" }] },
            { elementType: "labels.text.stroke", stylers: [{ color: "#1a3646" }] },
            { featureType: "road", elementType: "geometry", stylers: [{ color: "#304a7d" }] },
            { featureType: "road", elementType: "geometry.stroke", stylers: [{ color: "#255763" }] },
            { featureType: "road.highway", elementType: "geometry", stylers: [{ color: "#2c6675" }] },
            { featureType: "water", elementType: "geometry", stylers: [{ color: "#17263c" }] },
            { featureType: "poi", elementType: "labels", stylers: [{ visibility: "off" }] },
          ],
        })

        mapInstanceRef.current = map
        autocompleteServiceRef.current = new window.google.maps.places.AutocompleteService()
        placesServiceRef.current = new window.google.maps.places.PlacesService(map)
        geocoderRef.current = new window.google.maps.Geocoder()
        
        // Add user location marker
        pickupMarkerRef.current = new window.google.maps.Marker({
          position: center,
          map,
          icon: {
            path: window.google.maps.SymbolPath.CIRCLE,
            scale: 10,
            fillColor: "#7CFF3A",
            fillOpacity: 1,
            strokeColor: "#fff",
            strokeWeight: 3,
          },
        })

        // Initialize directions renderer
        routeRef.current = new window.google.maps.DirectionsRenderer({
          map,
          suppressMarkers: true,
          polylineOptions: {
            strokeColor: "#7CFF3A",
            strokeWeight: 5,
          },
        })

        // Reverse geocode to get address
        if (geocoderRef.current) {
          geocoderRef.current.geocode({ location: center }, (results, status) => {
            if (status === "OK" && results?.[0]) {
              setPickup(results[0].formatted_address)
            }
          })
        }

        setMapLoaded(true)
      } catch (error) {
        console.error("[v0] Failed to initialize Google Maps:", error)
        setMapLoaded(true) // Show UI even if map fails
      }
    }

    if (userLocation) {
      initMap()
    }
  }, [userLocation])

  // Search for places
  const searchPlaces = useCallback((query: string) => {
    if (!autocompleteServiceRef.current || query.length < 2) {
      setSuggestions([])
      return
    }

    if (debounceRef.current) {
      clearTimeout(debounceRef.current)
    }

    debounceRef.current = setTimeout(() => {
      autocompleteServiceRef.current?.getPlacePredictions(
        {
          input: query,
          componentRestrictions: { country: "us" },
          types: ["geocode", "establishment"],
        },
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
          } else {
            setSuggestions([])
          }
        }
      )
    }, 300)
  }, [])

  // Handle place selection
  const handleSelectPlace = useCallback((suggestion: PlaceSuggestion) => {
    if (!placesServiceRef.current || !mapInstanceRef.current) {
      // Fallback if Maps not loaded
      if (searchType === "pickup") {
        setPickup(suggestion.description)
      } else {
        setDropoff(suggestion.description)
        setShowRideOptions(true)
      }
      setShowLocationSearch(false)
      setSuggestions([])
      setSearchQuery("")
      return
    }

    placesServiceRef.current.getDetails(
      { placeId: suggestion.placeId, fields: ["geometry", "formatted_address"] },
      (place, status) => {
        if (status === "OK" && place?.geometry?.location) {
          const location = place.geometry.location
          const address = place.formatted_address || suggestion.description

          if (searchType === "pickup") {
            setPickup(address)
            pickupMarkerRef.current?.setPosition(location)
            mapInstanceRef.current?.panTo(location)
          } else {
            setDropoff(address)
            
            // Add or update dropoff marker
            if (dropoffMarkerRef.current) {
              dropoffMarkerRef.current.setPosition(location)
            } else if (window.google?.maps) {
              dropoffMarkerRef.current = new window.google.maps.Marker({
                position: location,
                map: mapInstanceRef.current,
                icon: {
                  path: window.google.maps.SymbolPath.CIRCLE,
                  scale: 10,
                  fillColor: "#FF6B6B",
                  fillOpacity: 1,
                  strokeColor: "#fff",
                  strokeWeight: 3,
                },
              })
            }

            // Draw route
            if (pickupMarkerRef.current && routeRef.current && window.google?.maps) {
              const directionsService = new window.google.maps.DirectionsService()
              directionsService.route(
                {
                  origin: pickupMarkerRef.current.getPosition()!,
                  destination: location,
                  travelMode: window.google.maps.TravelMode.DRIVING,
                },
                (result, routeStatus) => {
                  if (routeStatus === "OK" && result) {
                    routeRef.current?.setDirections(result)
                    
                    // Fit bounds to show entire route
                    const bounds = new window.google.maps.LatLngBounds()
                    bounds.extend(pickupMarkerRef.current!.getPosition()!)
                    bounds.extend(location)
                    mapInstanceRef.current?.fitBounds(bounds, { top: 50, bottom: 300, left: 50, right: 50 })
                  }
                }
              )
            }
            
            setShowRideOptions(true)
          }

          setShowLocationSearch(false)
          setSuggestions([])
          setSearchQuery("")
        }
      }
    )
  }, [searchType])

  // Handle ride booking
  const handleBookRide = () => {
    if (!pickup || !dropoff) return

    const rideType = RIDE_TYPES.find(r => r.id === selectedRide)
    const fare = parseFloat(rideType?.price.replace("$", "") || "26.96")

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
    
    // Clear route and dropoff marker
    if (routeRef.current) {
      routeRef.current.setDirections({ routes: [] } as google.maps.DirectionsResult)
    }
    if (dropoffMarkerRef.current) {
      dropoffMarkerRef.current.setMap(null)
      dropoffMarkerRef.current = null
    }
  }

  // Render active ride tracking
  if (isTracking && activeRide) {
    return (
      <div className="flex flex-col h-full bg-gray-950">
        {/* Map */}
        <div ref={mapRef} className="flex-1 relative">
          {!mapLoaded && (
            <div className="absolute inset-0 bg-gray-900 flex items-center justify-center">
              <div className="animate-spin w-8 h-8 border-2 border-lime-400 border-t-transparent rounded-full" />
            </div>
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
      {/* Map Background */}
      <div ref={mapRef} className="absolute inset-0">
        {!mapLoaded && (
          <div className="absolute inset-0 bg-gray-900 flex items-center justify-center">
            <div className="animate-spin w-8 h-8 border-2 border-lime-400 border-t-transparent rounded-full" />
          </div>
        )}
      </div>

      {/* Content Overlay */}
      <div className="relative z-10 flex flex-col h-full">
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

        {/* Bottom Sheet */}
        <div className={`bg-gray-900/95 backdrop-blur-sm border-t border-gray-800 rounded-t-3xl transition-all duration-300 ${showRideOptions ? "max-h-[70vh]" : "max-h-[50vh]"}`}>
          <div className="w-12 h-1 bg-gray-700 rounded-full mx-auto mt-3" />
          
          <div className="p-4 overflow-y-auto max-h-[calc(100%-20px)]">
            {/* Quick Actions */}
            <div className="flex gap-3 mb-4">
              <button className="flex-1 flex items-center justify-center gap-2 bg-gray-800 hover:bg-gray-700 border border-gray-700 rounded-xl px-4 py-3 transition-colors">
                <Calendar className="w-5 h-5 text-lime-400" />
                <span className="text-white font-medium">Schedule</span>
              </button>
              <button className="flex-1 flex items-center justify-center gap-2 bg-gray-800 hover:bg-gray-700 border border-gray-700 rounded-xl px-4 py-3 transition-colors">
                <Users className="w-5 h-5 text-lime-400" />
                <span className="text-white font-medium">Change rider</span>
              </button>
            </div>

            {/* Shortcuts */}
            <div className="space-y-2 mb-4">
              {savedShortcuts.map((shortcut) => (
                <button
                  key={shortcut.id}
                  onClick={() => {
                    setSearchType("dropoff")
                    setShowLocationSearch(true)
                  }}
                  className="w-full flex items-center gap-4 bg-gray-800/50 hover:bg-gray-700/60 border border-gray-700 rounded-xl px-4 py-3 transition-all"
                >
                  <div className="w-10 h-10 bg-gray-700 rounded-xl flex items-center justify-center">
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
                    <p className="text-xs text-gray-500">{shortcut.address || "Add shortcut"}</p>
                  </div>
                  {!shortcut.address && <Plus className="w-5 h-5 text-gray-500" />}
                </button>
              ))}
            </div>

            {/* Ride Options */}
            {showRideOptions && (
              <>
                <div className="flex items-center gap-4 my-4">
                  <div className="flex-1 h-px bg-gray-800" />
                  <span className="text-gray-500 text-xs font-medium">Select a ride</span>
                  <div className="flex-1 h-px bg-gray-800" />
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
