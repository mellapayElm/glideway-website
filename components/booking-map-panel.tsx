"use client"

import { useEffect, useRef, useState, useCallback } from "react"
import { Loader } from "@googlemaps/js-api-loader"
import { MapPin, Clock, Route, Locate, X, ChevronRight, Car, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"

interface LatLng {
  lat: number
  lng: number
}

interface BookingMapPanelProps {
  pickup?: string
  dropoff?: string
  onPickupChange?: (address: string, coords?: LatLng) => void
  onDropoffChange?: (address: string, coords?: LatLng) => void
  onRouteInfo?: (info: { distanceMi: number; durationMin: number }) => void
  onSearch?: () => void
  className?: string
  height?: string | number
  fullScreen?: boolean
}

// Colorado Springs default
const DEFAULT_CENTER = { lat: 38.8339, lng: -104.8214 }

// Light/Clean map styles - similar to Uber's clean look
const LIGHT_MAP_STYLES: google.maps.MapTypeStyle[] = [
  { elementType: "geometry", stylers: [{ color: "#f5f5f5" }] },
  { elementType: "labels.icon", stylers: [{ visibility: "off" }] },
  { elementType: "labels.text.fill", stylers: [{ color: "#616161" }] },
  { elementType: "labels.text.stroke", stylers: [{ color: "#f5f5f5" }] },
  { featureType: "administrative.land_parcel", elementType: "labels.text.fill", stylers: [{ color: "#bdbdbd" }] },
  { featureType: "poi", elementType: "geometry", stylers: [{ color: "#eeeeee" }] },
  { featureType: "poi", elementType: "labels.text.fill", stylers: [{ color: "#757575" }] },
  { featureType: "poi.park", elementType: "geometry", stylers: [{ color: "#c8e6c9" }] },
  { featureType: "poi.park", elementType: "labels.text.fill", stylers: [{ color: "#4caf50" }] },
  { featureType: "road", elementType: "geometry", stylers: [{ color: "#ffffff" }] },
  { featureType: "road.arterial", elementType: "labels.text.fill", stylers: [{ color: "#757575" }] },
  { featureType: "road.highway", elementType: "geometry", stylers: [{ color: "#dadada" }] },
  { featureType: "road.highway", elementType: "labels.text.fill", stylers: [{ color: "#616161" }] },
  { featureType: "road.local", elementType: "labels.text.fill", stylers: [{ color: "#9e9e9e" }] },
  { featureType: "transit.line", elementType: "geometry", stylers: [{ color: "#e5e5e5" }] },
  { featureType: "transit.station", elementType: "geometry", stylers: [{ color: "#eeeeee" }] },
  { featureType: "water", elementType: "geometry", stylers: [{ color: "#c9c9c9" }] },
  { featureType: "water", elementType: "labels.text.fill", stylers: [{ color: "#9e9e9e" }] },
]

export function BookingMapPanel({
  pickup = "",
  dropoff = "",
  onPickupChange,
  onDropoffChange,
  onRouteInfo,
  onSearch,
  className = "",
  height = 500,
  fullScreen = false,
}: BookingMapPanelProps) {
  const mapRef = useRef<HTMLDivElement>(null)
  const pickupInputRef = useRef<HTMLInputElement>(null)
  const dropoffInputRef = useRef<HTMLInputElement>(null)
  const mapInstanceRef = useRef<google.maps.Map | null>(null)
  const markersRef = useRef<{ pickup?: google.maps.Marker; dropoff?: google.maps.Marker }>({})
  const directionsRendererRef = useRef<google.maps.DirectionsRenderer | null>(null)
  const pickupAutocompleteRef = useRef<google.maps.places.Autocomplete | null>(null)
  const dropoffAutocompleteRef = useRef<google.maps.places.Autocomplete | null>(null)
  const pickupCoordsRef = useRef<LatLng | null>(null)
  const dropoffCoordsRef = useRef<LatLng | null>(null)

  const [isLoading, setIsLoading] = useState(true)
  const [mapsError, setMapsError] = useState<string | null>(null)
  const [mapsLoaded, setMapsLoaded] = useState(false)
  const [pickupValue, setPickupValue] = useState(pickup)
  const [dropoffValue, setDropoffValue] = useState(dropoff)
  const [routeInfo, setRouteInfo] = useState<{ distanceMi: number; durationMin: number } | null>(null)
  const [isLocating, setIsLocating] = useState(false)

  // Draw route between pickup and dropoff
  const drawRoute = useCallback(() => {
    const map = mapInstanceRef.current
    const renderer = directionsRendererRef.current
    if (!map || !renderer || !pickupCoordsRef.current || !dropoffCoordsRef.current) return

    const svc = new google.maps.DirectionsService()
    svc.route(
      {
        origin: pickupCoordsRef.current,
        destination: dropoffCoordsRef.current,
        travelMode: google.maps.TravelMode.DRIVING,
      },
      (result, status) => {
        if (status === google.maps.DirectionsStatus.OK && result) {
          renderer.setDirections(result)
          const leg = result.routes[0]?.legs[0]
          if (leg) {
            const distanceMi = (leg.distance?.value ?? 0) / 1609.34
            const durationMin = Math.round((leg.duration?.value ?? 0) / 60)
            setRouteInfo({ distanceMi, durationMin })
            onRouteInfo?.({ distanceMi, durationMin })

            // Fit bounds to show full route
            const bounds = new google.maps.LatLngBounds()
            bounds.extend(pickupCoordsRef.current!)
            bounds.extend(dropoffCoordsRef.current!)
            map.fitBounds(bounds, { padding: 100 })
          }
        }
      }
    )
  }, [onRouteInfo])

  // Place marker on map
  const placeMarker = useCallback((type: "pickup" | "dropoff", coords: LatLng) => {
    const map = mapInstanceRef.current
    if (!map) return

    if (markersRef.current[type]) {
      markersRef.current[type]!.setPosition(coords)
    } else {
      markersRef.current[type] = new google.maps.Marker({
        position: coords,
        map,
        title: type === "pickup" ? "Pickup" : "Dropoff",
        icon: {
          path: google.maps.SymbolPath.CIRCLE,
          fillColor: type === "pickup" ? "#000000" : "#000000",
          fillOpacity: 1,
          strokeColor: "#ffffff",
          strokeWeight: 3,
          scale: 8,
        },
        zIndex: type === "pickup" ? 100 : 99,
        animation: google.maps.Animation.DROP,
      })
    }

    // Pan to marker or fit bounds if both exist
    if (markersRef.current.pickup && markersRef.current.dropoff) {
      const bounds = new google.maps.LatLngBounds()
      bounds.extend(markersRef.current.pickup.getPosition()!)
      bounds.extend(markersRef.current.dropoff.getPosition()!)
      map.fitBounds(bounds, { padding: 100 })
    } else {
      map.panTo(coords)
      map.setZoom(15)
    }
  }, [])

  // Initialize Google Maps
  useEffect(() => {
    let mounted = true

    async function init() {
      const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY
      
      if (!apiKey) {
        setMapsError("Add NEXT_PUBLIC_GOOGLE_MAPS_API_KEY to your environment variables")
        setIsLoading(false)
        return
      }

      try {
        const loader = new Loader({
          apiKey,
          version: "weekly",
          libraries: ["places", "geometry"],
        })

        await loader.load()
        if (!mounted || !mapRef.current) return

        setMapsLoaded(true)

        const map = new google.maps.Map(mapRef.current, {
          center: DEFAULT_CENTER,
          zoom: 13,
          styles: LIGHT_MAP_STYLES,
          disableDefaultUI: true,
          zoomControl: true,
          zoomControlOptions: {
            position: google.maps.ControlPosition.RIGHT_BOTTOM,
          },
        })
        mapInstanceRef.current = map

        // Directions renderer with black route
        const renderer = new google.maps.DirectionsRenderer({
          map,
          suppressMarkers: true,
          polylineOptions: {
            strokeColor: "#000000",
            strokeWeight: 4,
            strokeOpacity: 0.9,
          },
        })
        directionsRendererRef.current = renderer

        setIsLoading(false)
      } catch {
        if (mounted) {
          setMapsError("Failed to load Google Maps")
          setIsLoading(false)
        }
      }
    }

    init()
    return () => { mounted = false }
  }, [])

  // Setup autocomplete after maps loaded
  useEffect(() => {
    if (!mapsLoaded) return

    // Pickup autocomplete
    if (pickupInputRef.current && !pickupAutocompleteRef.current) {
      const ac = new google.maps.places.Autocomplete(pickupInputRef.current, {
        types: ["geocode", "establishment"],
        componentRestrictions: { country: "us" },
      })
      ac.addListener("place_changed", () => {
        const place = ac.getPlace()
        if (place.geometry?.location) {
          const coords = { lat: place.geometry.location.lat(), lng: place.geometry.location.lng() }
          const address = place.formatted_address || place.name || ""
          pickupCoordsRef.current = coords
          setPickupValue(address)
          onPickupChange?.(address, coords)
          placeMarker("pickup", coords)
          drawRoute()
        }
      })
      pickupAutocompleteRef.current = ac
    }

    // Dropoff autocomplete
    if (dropoffInputRef.current && !dropoffAutocompleteRef.current) {
      const ac = new google.maps.places.Autocomplete(dropoffInputRef.current, {
        types: ["geocode", "establishment"],
        componentRestrictions: { country: "us" },
      })
      ac.addListener("place_changed", () => {
        const place = ac.getPlace()
        if (place.geometry?.location) {
          const coords = { lat: place.geometry.location.lat(), lng: place.geometry.location.lng() }
          const address = place.formatted_address || place.name || ""
          dropoffCoordsRef.current = coords
          setDropoffValue(address)
          onDropoffChange?.(address, coords)
          placeMarker("dropoff", coords)
          drawRoute()
        }
      })
      dropoffAutocompleteRef.current = ac
    }
  }, [mapsLoaded, onPickupChange, onDropoffChange, placeMarker, drawRoute])

  // Use GPS for pickup
  const handleLocateMe = useCallback(() => {
    if (!navigator.geolocation || !mapsLoaded) return

    setIsLocating(true)
    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const coords = { lat: pos.coords.latitude, lng: pos.coords.longitude }
        pickupCoordsRef.current = coords
        placeMarker("pickup", coords)

        // Reverse geocode
        const geocoder = new google.maps.Geocoder()
        geocoder.geocode({ location: coords }, (results, status) => {
          const address = status === google.maps.GeocoderStatus.OK && results?.[0]
            ? results[0].formatted_address
            : "Current Location"
          setPickupValue(address)
          onPickupChange?.(address, coords)
          if (pickupInputRef.current) pickupInputRef.current.value = address
          drawRoute()
          setIsLocating(false)
        })
      },
      () => setIsLocating(false),
      { enableHighAccuracy: true }
    )
  }, [mapsLoaded, onPickupChange, placeMarker, drawRoute])

  // Clear input
  const clearInput = (type: "pickup" | "dropoff") => {
    if (type === "pickup") {
      setPickupValue("")
      pickupCoordsRef.current = null
      onPickupChange?.("")
      if (pickupInputRef.current) pickupInputRef.current.value = ""
      if (markersRef.current.pickup) {
        markersRef.current.pickup.setMap(null)
        markersRef.current.pickup = undefined
      }
    } else {
      setDropoffValue("")
      dropoffCoordsRef.current = null
      onDropoffChange?.("")
      if (dropoffInputRef.current) dropoffInputRef.current.value = ""
      if (markersRef.current.dropoff) {
        markersRef.current.dropoff.setMap(null)
        markersRef.current.dropoff = undefined
      }
    }
    directionsRendererRef.current?.setDirections({ routes: [] })
    setRouteInfo(null)
  }

  const canSearch = pickupValue.trim() && dropoffValue.trim()

  return (
    <div
      className={`relative w-full overflow-hidden rounded-2xl ${className}`}
      style={{ height: fullScreen ? "100vh" : height }}
    >
      {/* Full Map Background */}
      <div ref={mapRef} className="absolute inset-0 w-full h-full" />

      {/* Loading Overlay */}
      {isLoading && (
        <div className="absolute inset-0 bg-gray-100 flex flex-col items-center justify-center z-30 gap-3">
          <div className="w-10 h-10 border-3 border-black border-t-transparent rounded-full animate-spin" />
          <span className="text-sm text-gray-500">Loading map...</span>
        </div>
      )}

      {/* Error Overlay */}
      {mapsError && (
        <div className="absolute inset-0 bg-gray-100 flex flex-col items-center justify-center z-30 p-8 text-center">
          <div className="w-16 h-16 rounded-full bg-gray-200 flex items-center justify-center mb-4">
            <MapPin className="w-8 h-8 text-gray-400" />
          </div>
          <p className="text-gray-700 font-medium mb-2">{mapsError}</p>
          <p className="text-gray-500 text-sm max-w-xs">
            Add NEXT_PUBLIC_GOOGLE_MAPS_API_KEY to your environment variables
          </p>
        </div>
      )}

      {/* Floating Booking Card - Uber Style WHITE THEME */}
      <div className="absolute top-4 left-4 z-20 w-full max-w-sm">
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-200">
          {/* Header */}
          <div className="p-5 pb-4">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Get a ride</h2>

            {/* Location Inputs */}
            <div className="space-y-3">
              {/* Pickup */}
              <div className="flex items-start gap-3">
                <div className="flex flex-col items-center pt-3">
                  <div className="w-3 h-3 rounded-full bg-black" />
                  <div className="w-0.5 h-10 bg-gray-300 mt-1" />
                </div>
                <div className="flex-1 relative">
                  <input
                    ref={pickupInputRef}
                    type="text"
                    placeholder="Pickup location"
                    defaultValue={pickup}
                    onChange={(e) => setPickupValue(e.target.value)}
                    className="w-full h-12 px-4 pr-20 bg-gray-100 border border-gray-200 rounded-xl text-gray-900 placeholder:text-gray-400 text-sm focus:outline-none focus:border-gray-400 focus:ring-2 focus:ring-gray-200 transition-all"
                  />
                  <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-1">
                    {pickupValue && (
                      <button
                        onClick={() => clearInput("pickup")}
                        className="p-1.5 hover:bg-gray-200 rounded-full transition-colors"
                      >
                        <X className="w-4 h-4 text-gray-500" />
                      </button>
                    )}
                    <button
                      onClick={handleLocateMe}
                      disabled={isLocating}
                      className="p-1.5 hover:bg-gray-200 rounded-full transition-colors"
                      title="Use my location"
                    >
                      {isLocating ? (
                        <Loader2 className="w-4 h-4 text-black animate-spin" />
                      ) : (
                        <Locate className="w-4 h-4 text-gray-500 hover:text-black" />
                      )}
                    </button>
                  </div>
                </div>
              </div>

              {/* Dropoff */}
              <div className="flex items-start gap-3">
                <div className="flex flex-col items-center pt-3">
                  <div className="w-3 h-3 rounded-sm bg-black" />
                </div>
                <div className="flex-1 relative">
                  <input
                    ref={dropoffInputRef}
                    type="text"
                    placeholder="Dropoff location"
                    defaultValue={dropoff}
                    onChange={(e) => setDropoffValue(e.target.value)}
                    className="w-full h-12 px-4 pr-10 bg-gray-100 border border-gray-200 rounded-xl text-gray-900 placeholder:text-gray-400 text-sm focus:outline-none focus:border-gray-400 focus:ring-2 focus:ring-gray-200 transition-all"
                  />
                  {dropoffValue && (
                    <button
                      onClick={() => clearInput("dropoff")}
                      className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 hover:bg-gray-200 rounded-full transition-colors"
                    >
                      <X className="w-4 h-4 text-gray-500" />
                    </button>
                  )}
                </div>
              </div>
            </div>

            {/* Route Info */}
            {routeInfo && (
              <div className="mt-4 p-3 bg-gray-50 rounded-xl border border-gray-100">
                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-2 text-gray-600">
                    <Route className="w-4 h-4 text-blue-500" />
                    <span>{routeInfo.distanceMi.toFixed(1)} mi</span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-600">
                    <Clock className="w-4 h-4 text-purple-500" />
                    <span>{routeInfo.durationMin} min</span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-600">
                    <Car className="w-4 h-4 text-green-500" />
                    <span>~{routeInfo.durationMin + 3} min</span>
                  </div>
                </div>
              </div>
            )}

            {/* Search Button */}
            <Button
              onClick={onSearch}
              disabled={!canSearch}
              className={`w-full h-12 mt-4 text-base font-semibold rounded-xl transition-all ${
                canSearch
                  ? "bg-black hover:bg-gray-800 text-white"
                  : "bg-gray-200 text-gray-400 cursor-not-allowed"
              }`}
            >
              <span className="flex items-center gap-2">
                Search
                <ChevronRight className="w-5 h-5" />
              </span>
            </Button>
          </div>

          {/* Quick Suggestions */}
          {!pickupValue && (
            <div className="border-t border-gray-100">
              <button
                onClick={handleLocateMe}
                className="w-full flex items-center gap-3 p-4 hover:bg-gray-50 transition-colors text-left"
              >
                <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center">
                  <Locate className="w-5 h-5 text-gray-700" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-900">Allow location access</p>
                  <p className="text-xs text-gray-500">It provides your pickup address</p>
                </div>
              </button>
              <button className="w-full flex items-center gap-3 p-4 hover:bg-gray-50 transition-colors text-left border-t border-gray-100">
                <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center">
                  <MapPin className="w-5 h-5 text-gray-700" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-900">Set location on map</p>
                  <p className="text-xs text-gray-500">Tap anywhere on the map</p>
                </div>
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Map Legend */}
      {(pickupCoordsRef.current || dropoffCoordsRef.current) && !isLoading && !mapsError && (
        <div className="absolute bottom-4 left-4 z-20 bg-white rounded-xl px-4 py-2 shadow-lg border border-gray-200">
          <div className="flex items-center gap-4 text-xs">
            <div className="flex items-center gap-1.5">
              <div className="w-3 h-3 rounded-full bg-black border-2 border-white shadow" />
              <span className="text-gray-600">Pickup</span>
            </div>
            <div className="flex items-center gap-1.5">
              <div className="w-3 h-3 rounded-sm bg-black border-2 border-white shadow" />
              <span className="text-gray-600">Dropoff</span>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
