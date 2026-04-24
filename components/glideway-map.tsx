"use client"

import { useEffect, useRef, useState } from "react"
import { Loader2, MapPin } from "lucide-react"

let mapScriptLoaded = false
let mapScriptLoading: Promise<void> | null = null

function loadGoogleMapsScript(): Promise<void> {
  if (mapScriptLoaded && window.google?.maps) {
    return Promise.resolve()
  }

  if (mapScriptLoading) {
    return mapScriptLoading
  }

  mapScriptLoading = new Promise((resolve, reject) => {
    if (window.google?.maps) {
      mapScriptLoaded = true
      resolve()
      return
    }

    const existingScript = document.querySelector(
      'script[src*="maps.googleapis.com/maps/api/js"]'
    )
    
    if (existingScript) {
      const checkInterval = setInterval(() => {
        if (window.google?.maps) {
          clearInterval(checkInterval)
          mapScriptLoaded = true
          resolve()
        }
      }, 100)
      return
    }

    const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY
    if (!apiKey) {
      reject(new Error("Google Maps API key not configured"))
      return
    }

    const script = document.createElement("script")
    script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&v=weekly`
    script.async = true
    script.defer = true
    
    script.onload = () => {
      mapScriptLoaded = true
      resolve()
    }
    
    script.onerror = () => {
      mapScriptLoading = null
      reject(new Error("Failed to load Google Maps API"))
    }

    document.head.appendChild(script)
  })

  return mapScriptLoading
}

interface GlideWayMapProps {
  onPickupSelect?: (lat: number, lng: number) => void
  onDropoffSelect?: (lat: number, lng: number) => void
}

export function GlideWayMap({ onPickupSelect, onDropoffSelect }: GlideWayMapProps) {
  const mapRef = useRef<HTMLDivElement>(null)
  const mapInstanceRef = useRef<google.maps.Map | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [mode, setMode] = useState<"pickup" | "dropoff" | null>(null)
  const pickupMarkerRef = useRef<google.maps.Marker | null>(null)
  const dropoffMarkerRef = useRef<google.maps.Marker | null>(null)

  // Default to Colorado Springs
  const DEFAULT_CENTER = { lat: 38.8339, lng: -104.8214 }

  // Initialize map
  useEffect(() => {
    async function initMap() {
      try {
        setLoading(true)
        setError(null)

        await loadGoogleMapsScript()

        if (!mapRef.current || !window.google?.maps) {
          setError("Google Maps library not available")
          setLoading(false)
          return
        }

        // Create map
        const map = new window.google.maps.Map(mapRef.current, {
          center: DEFAULT_CENTER,
          zoom: 13,
          mapTypeId: "roadmap",
          zoomControl: true,
          fullscreenControl: true,
          streetViewControl: true,
          mapTypeControl: true,
          scaleControl: true,
        })

        mapInstanceRef.current = map

        // Add click listener for location selection
        map.addListener("click", (e: google.maps.MapMouseEvent) => {
          if (!mode || !e.latLng) return

          const lat = e.latLng.lat()
          const lng = e.latLng.lng()

          if (mode === "pickup") {
            onPickupSelect?.(lat, lng)
            addPickupMarker(lat, lng)
          } else if (mode === "dropoff") {
            onDropoffSelect?.(lat, lng)
            addDropoffMarker(lat, lng)
          }
        })

        // Try to get user's current location
        if (navigator.geolocation) {
          navigator.geolocation.getCurrentPosition(
            (position) => {
              const userLocation = {
                lat: position.coords.latitude,
                lng: position.coords.longitude,
              }
              map.setCenter(userLocation)
            },
            (error) => {
              console.log("[v0] Geolocation not available:", error.message)
            }
          )
        }

        setLoading(false)
      } catch (err) {
        console.error("[v0] Map initialization error:", err)
        setError(err instanceof Error ? err.message : "Failed to initialize map")
        setLoading(false)
      }
    }

    initMap()
  }, [mode, onPickupSelect, onDropoffSelect])

  // Add pickup marker
  const addPickupMarker = (lat: number, lng: number) => {
    if (!mapInstanceRef.current || !window.google?.maps) return

    if (pickupMarkerRef.current) {
      pickupMarkerRef.current.setMap(null)
    }

    pickupMarkerRef.current = new window.google.maps.Marker({
      position: { lat, lng },
      map: mapInstanceRef.current,
      title: "Pickup Location",
      icon: {
        path: window.google.maps.SymbolPath.CIRCLE,
        scale: 12,
        fillColor: "#22c55e",
        fillOpacity: 1,
        strokeColor: "#ffffff",
        strokeWeight: 3,
      },
    })

    mapInstanceRef.current.panTo({ lat, lng })
  }

  // Add dropoff marker
  const addDropoffMarker = (lat: number, lng: number) => {
    if (!mapInstanceRef.current || !window.google?.maps) return

    if (dropoffMarkerRef.current) {
      dropoffMarkerRef.current.setMap(null)
    }

    dropoffMarkerRef.current = new window.google.maps.Marker({
      position: { lat, lng },
      map: mapInstanceRef.current,
      title: "Dropoff Location",
      icon: {
        path: window.google.maps.SymbolPath.CIRCLE,
        scale: 12,
        fillColor: "#ef4444",
        fillOpacity: 1,
        strokeColor: "#ffffff",
        strokeWeight: 3,
      },
    })

    mapInstanceRef.current.panTo({ lat, lng })
  }

  return (
    <div className="w-full h-full flex flex-col bg-gray-100 relative">
      {/* Map Controls */}
      <div className="absolute top-4 left-4 z-10 flex gap-2">
        <button
          onClick={() => setMode(mode === "pickup" ? null : "pickup")}
          className={`px-4 py-2 rounded-lg font-semibold flex items-center gap-2 transition-all ${
            mode === "pickup"
              ? "bg-green-500 text-white"
              : "bg-blue-500 text-white hover:bg-blue-600"
          }`}
        >
          <MapPin className="w-4 h-4" />
          {mode === "pickup" ? "Set Pickup" : "Pickup"}
        </button>
        <button
          onClick={() => setMode(mode === "dropoff" ? null : "dropoff")}
          className={`px-4 py-2 rounded-lg font-semibold flex items-center gap-2 transition-all ${
            mode === "dropoff"
              ? "bg-red-500 text-white"
              : "bg-gray-700 text-white hover:bg-gray-800"
          }`}
        >
          <MapPin className="w-4 h-4" />
          {mode === "dropoff" ? "Set Dropoff" : "Dropoff"}
        </button>
      </div>

      {/* Map Container */}
      <div ref={mapRef} className="w-full h-full" />

      {/* Loading State */}
      {loading && (
        <div className="absolute inset-0 bg-white/80 flex items-center justify-center z-50">
          <div className="text-center">
            <Loader2 className="w-8 h-8 animate-spin mx-auto mb-2 text-blue-500" />
            <p className="text-gray-700 font-semibold">Loading map...</p>
          </div>
        </div>
      )}

      {/* Error State */}
      {error && (
        <div className="absolute inset-0 bg-red-50/80 flex items-center justify-center z-50">
          <div className="text-center p-6 bg-white rounded-lg shadow-lg">
            <p className="text-red-600 font-semibold mb-2">Map Error</p>
            <p className="text-gray-600 text-sm">{error}</p>
            <p className="text-gray-500 text-xs mt-2">
              Ensure Google Maps API is enabled in Google Cloud Console
            </p>
          </div>
        </div>
      )}

      {/* Mode Indicator */}
      {mode && (
        <div className="absolute bottom-4 left-4 bg-blue-100 text-blue-900 px-4 py-2 rounded-lg text-sm font-semibold z-10">
          Click on map to set {mode} location
        </div>
      )}

      {/* Map Attribution */}
      <div className="absolute bottom-4 right-4 bg-white/95 px-3 py-1.5 rounded text-xs text-gray-600 z-5">
        GlideWay Maps
      </div>
    </div>
  )
}
