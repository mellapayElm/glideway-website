"use client"

import { useEffect, useRef, useState, useCallback } from "react"
import { Loader } from "@googlemaps/js-api-loader"
import { MapPin, Navigation, Car, Clock, Route, Locate, Loader2 } from "lucide-react"

interface LatLng {
  lat: number
  lng: number
}

interface BookingMapPanelProps {
  pickup: string
  dropoff: string
  onPickupChange: (address: string, coords?: LatLng) => void
  onDropoffChange: (address: string, coords?: LatLng) => void
  onRouteInfo?: (info: { distanceMi: number; durationMin: number }) => void
  className?: string
}

const DEFAULT_CENTER = { lat: 34.0522, lng: -118.2437 } // Los Angeles

export function BookingMapPanel({
  pickup,
  dropoff,
  onPickupChange,
  onDropoffChange,
  onRouteInfo,
  className = "",
}: BookingMapPanelProps) {
  const mapRef = useRef<HTMLDivElement>(null)
  const pickupInputRef = useRef<HTMLInputElement>(null)
  const dropoffInputRef = useRef<HTMLInputElement>(null)
  const mapInstanceRef = useRef<google.maps.Map | null>(null)
  const markersRef = useRef<{ pickup?: google.maps.Marker; dropoff?: google.maps.Marker }>({})
  const directionsRendererRef = useRef<google.maps.DirectionsRenderer | null>(null)
  const autocompletePickupRef = useRef<google.maps.places.Autocomplete | null>(null)
  const autocompleteDropoffRef = useRef<google.maps.places.Autocomplete | null>(null)
  const pickupCoordsRef = useRef<LatLng | null>(null)
  const dropoffCoordsRef = useRef<LatLng | null>(null)

  const [isLoading, setIsLoading] = useState(true)
  const [mapsError, setMapsError] = useState<string | null>(null)
  const [routeInfo, setRouteInfo] = useState<{ distanceMi: number; durationMin: number } | null>(null)
  const [locating, setLocating] = useState(false)

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
          }
        }
      }
    )
  }, [onRouteInfo])

  // Place a named marker on the map
  const placeMarker = useCallback((
    type: "pickup" | "dropoff",
    coords: LatLng
  ) => {
    const map = mapInstanceRef.current
    if (!map) return

    if (markersRef.current[type]) {
      markersRef.current[type]!.setPosition(coords)
    } else {
      markersRef.current[type] = new google.maps.Marker({
        position: coords,
        map,
        title: type === "pickup" ? "Pickup" : "Drop-off",
        icon: {
          path: google.maps.SymbolPath.CIRCLE,
          fillColor: type === "pickup" ? "#22c55e" : "#ef4444",
          fillOpacity: 1,
          strokeColor: "#ffffff",
          strokeWeight: 3,
          scale: 11,
        },
        zIndex: type === "pickup" ? 100 : 99,
      })
    }

    // Fit bounds if both markers exist
    if (markersRef.current.pickup && markersRef.current.dropoff) {
      const bounds = new google.maps.LatLngBounds()
      bounds.extend(markersRef.current.pickup.getPosition()!)
      bounds.extend(markersRef.current.dropoff.getPosition()!)
      map.fitBounds(bounds, { padding: 70 })
    } else {
      map.panTo(coords)
      map.setZoom(14)
    }
  }, [])

  // Initialize map + autocomplete
  useEffect(() => {
    let mounted = true

    async function init() {
      const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY
      if (!apiKey) {
        setMapsError("Google Maps API key missing. Add NEXT_PUBLIC_GOOGLE_MAPS_API_KEY to your environment.")
        setIsLoading(false)
        return
      }

      try {
        const loader = new Loader({ apiKey, version: "weekly", libraries: ["places", "geometry"] })
        await loader.load()
        if (!mounted || !mapRef.current) return

        // Build map
        const map = new google.maps.Map(mapRef.current, {
          center: DEFAULT_CENTER,
          zoom: 12,
          disableDefaultUI: false,
          mapTypeControl: false,
          streetViewControl: false,
          fullscreenControl: false,
          styles: [
            { elementType: "geometry", stylers: [{ color: "#0f172a" }] },
            { elementType: "labels.text.stroke", stylers: [{ color: "#0f172a" }] },
            { elementType: "labels.text.fill", stylers: [{ color: "#94a3b8" }] },
            { featureType: "road", elementType: "geometry", stylers: [{ color: "#1e293b" }] },
            { featureType: "road", elementType: "geometry.stroke", stylers: [{ color: "#0f172a" }] },
            { featureType: "road.highway", elementType: "geometry", stylers: [{ color: "#334155" }] },
            { featureType: "road.highway", elementType: "geometry.stroke", stylers: [{ color: "#1e293b" }] },
            { featureType: "road.highway", elementType: "labels.text.fill", stylers: [{ color: "#cbd5e1" }] },
            { featureType: "water", elementType: "geometry", stylers: [{ color: "#0c4a6e" }] },
            { featureType: "water", elementType: "labels.text.fill", stylers: [{ color: "#38bdf8" }] },
            { featureType: "poi", elementType: "geometry", stylers: [{ color: "#1e293b" }] },
            { featureType: "poi", elementType: "labels.text.fill", stylers: [{ color: "#64748b" }] },
            { featureType: "poi.park", elementType: "geometry", stylers: [{ color: "#14532d" }] },
            { featureType: "transit", elementType: "geometry", stylers: [{ color: "#1e293b" }] },
            { featureType: "administrative", elementType: "geometry", stylers: [{ color: "#334155" }] },
            { featureType: "administrative.country", elementType: "labels.text.fill", stylers: [{ color: "#94a3b8" }] },
            { featureType: "administrative.locality", elementType: "labels.text.fill", stylers: [{ color: "#cbd5e1" }] },
          ],
        })
        mapInstanceRef.current = map

        // Directions renderer
        const renderer = new google.maps.DirectionsRenderer({
          map,
          suppressMarkers: true,
          polylineOptions: {
            strokeColor: "#22c55e",
            strokeWeight: 5,
            strokeOpacity: 0.85,
          },
        })
        directionsRendererRef.current = renderer

        // Pickup autocomplete
        if (pickupInputRef.current) {
          const acPickup = new google.maps.places.Autocomplete(pickupInputRef.current, {
            types: ["geocode", "establishment"],
          })
          acPickup.addListener("place_changed", () => {
            const place = acPickup.getPlace()
            if (place.geometry?.location) {
              const coords = { lat: place.geometry.location.lat(), lng: place.geometry.location.lng() }
              pickupCoordsRef.current = coords
              onPickupChange(place.formatted_address || place.name || "", coords)
              placeMarker("pickup", coords)
              drawRoute()
            }
          })
          autocompletePickupRef.current = acPickup
        }

        // Dropoff autocomplete
        if (dropoffInputRef.current) {
          const acDropoff = new google.maps.places.Autocomplete(dropoffInputRef.current, {
            types: ["geocode", "establishment"],
          })
          acDropoff.addListener("place_changed", () => {
            const place = acDropoff.getPlace()
            if (place.geometry?.location) {
              const coords = { lat: place.geometry.location.lat(), lng: place.geometry.location.lng() }
              dropoffCoordsRef.current = coords
              onDropoffChange(place.formatted_address || place.name || "", coords)
              placeMarker("dropoff", coords)
              drawRoute()
            }
          })
          autocompleteDropoffRef.current = acDropoff
        }

        setIsLoading(false)
      } catch {
        if (mounted) {
          setMapsError("Failed to load Google Maps. Please check your API key.")
          setIsLoading(false)
        }
      }
    }

    init()
    return () => { mounted = false }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // Use device GPS for pickup
  const handleLocateMe = () => {
    if (!navigator.geolocation) return
    setLocating(true)
    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const coords = { lat: pos.coords.latitude, lng: pos.coords.longitude }
        pickupCoordsRef.current = coords
        placeMarker("pickup", coords)

        // Reverse geocode
        if (mapInstanceRef.current) {
          const geocoder = new google.maps.Geocoder()
          geocoder.geocode({ location: coords }, (results, status) => {
            const address = status === google.maps.GeocoderStatus.OK
              ? results?.[0]?.formatted_address ?? "Current Location"
              : "Current Location"
            onPickupChange(address, coords)
            if (pickupInputRef.current) pickupInputRef.current.value = address
            drawRoute()
          })
        }
        setLocating(false)
      },
      () => setLocating(false),
      { enableHighAccuracy: true }
    )
  }

  return (
    <div className={`flex flex-col gap-0 rounded-2xl overflow-hidden border border-slate-700/60 bg-slate-900 ${className}`}>
      {/* Address Inputs */}
      <div className="p-4 space-y-3 bg-slate-900/95 border-b border-slate-700/60">
        {/* Pickup */}
        <div className="relative flex items-center gap-3">
          <div className="flex flex-col items-center gap-1 shrink-0">
            <span className="w-3 h-3 rounded-full bg-emerald-500 block shadow-lg shadow-emerald-500/50" />
            <span className="w-0.5 h-4 bg-slate-600 block" />
          </div>
          <div className="relative flex-1">
            <input
              ref={pickupInputRef}
              defaultValue={pickup}
              placeholder="Enter pickup location"
              className="w-full h-11 bg-slate-800 border border-slate-700 rounded-xl text-sm text-white placeholder-slate-500 px-4 pr-10 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500/70 transition-all"
              onChange={(e) => onPickupChange(e.target.value)}
            />
            <button
              onClick={handleLocateMe}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-emerald-400 transition-colors"
              title="Use current location"
            >
              {locating ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Locate className="w-4 h-4" />
              )}
            </button>
          </div>
        </div>

        {/* Drop-off */}
        <div className="relative flex items-center gap-3">
          <div className="flex flex-col items-center gap-1 shrink-0">
            <span className="w-0.5 h-1 bg-slate-600 block" />
            <span className="w-3 h-3 rounded-full bg-red-500 block shadow-lg shadow-red-500/50" />
          </div>
          <div className="relative flex-1">
            <input
              ref={dropoffInputRef}
              defaultValue={dropoff}
              placeholder="Enter drop-off location"
              className="w-full h-11 bg-slate-800 border border-slate-700 rounded-xl text-sm text-white placeholder-slate-500 px-4 focus:outline-none focus:ring-2 focus:ring-red-500/40 focus:border-red-500/60 transition-all"
              onChange={(e) => onDropoffChange(e.target.value)}
            />
          </div>
        </div>
      </div>

      {/* Google Map */}
      <div className="relative" style={{ height: 340 }}>
        {/* Loading Overlay */}
        {isLoading && (
          <div className="absolute inset-0 bg-slate-900 flex flex-col items-center justify-center z-10 gap-3">
            <div className="w-8 h-8 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin" />
            <span className="text-sm text-slate-400">Loading map...</span>
          </div>
        )}

        {/* Error State */}
        {mapsError && (
          <div className="absolute inset-0 bg-slate-900 flex flex-col items-center justify-center z-10 p-6 text-center gap-3">
            <MapPin className="w-10 h-10 text-slate-600" />
            <p className="text-sm text-slate-400">{mapsError}</p>
          </div>
        )}

        {/* Map Canvas */}
        <div ref={mapRef} className="w-full h-full" />

        {/* Legend */}
        {!isLoading && !mapsError && (
          <div className="absolute bottom-3 left-3 bg-slate-900/90 backdrop-blur-sm rounded-xl px-3 py-2 border border-slate-700/60 flex items-center gap-4">
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 block" />
              <span className="text-[11px] text-slate-300">Pickup</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-red-500 block" />
              <span className="text-[11px] text-slate-300">Drop-off</span>
            </div>
          </div>
        )}
      </div>

      {/* Route Stats Bar */}
      {routeInfo && (
        <div className="grid grid-cols-3 border-t border-slate-700/60 bg-slate-900/80">
          <div className="flex flex-col items-center justify-center py-3 border-r border-slate-700/60">
            <Route className="w-4 h-4 text-blue-400 mb-1" />
            <span className="text-[10px] text-slate-500">Distance</span>
            <span className="text-sm font-bold text-white">{routeInfo.distanceMi.toFixed(1)} mi</span>
          </div>
          <div className="flex flex-col items-center justify-center py-3 border-r border-slate-700/60">
            <Clock className="w-4 h-4 text-purple-400 mb-1" />
            <span className="text-[10px] text-slate-500">Duration</span>
            <span className="text-sm font-bold text-white">{routeInfo.durationMin} min</span>
          </div>
          <div className="flex flex-col items-center justify-center py-3">
            <Car className="w-4 h-4 text-emerald-400 mb-1" />
            <span className="text-[10px] text-slate-500">ETA</span>
            <span className="text-sm font-bold text-white">~{routeInfo.durationMin + 3} min</span>
          </div>
        </div>
      )}
    </div>
  )
}
