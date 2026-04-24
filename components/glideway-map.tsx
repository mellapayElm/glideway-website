"use client"

import { useEffect, useRef, useState } from "react"
import { Loader2, MapPin } from "lucide-react"

let mapScriptLoaded = false
let mapScriptLoadPromise: Promise<void> | null = null

function loadGoogleMapsScript(): Promise<void> {
  // If already loaded, return immediately
  if (mapScriptLoaded && window.google?.maps) {
    return Promise.resolve()
  }

  // If loading, return the existing promise
  if (mapScriptLoadPromise) {
    return mapScriptLoadPromise
  }

  // Create new loading promise
  mapScriptLoadPromise = new Promise((resolve, reject) => {
    // Double-check it's not already loaded
    if (window.google?.maps) {
      mapScriptLoaded = true
      resolve()
      return
    }

    const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY
    console.log("[v0] Google Maps API Key:", apiKey ? "✓ Set" : "✗ Missing")
    
    if (!apiKey) {
      reject(new Error("Google Maps API key not configured"))
      return
    }

    // Create script tag
    const script = document.createElement("script")
    script.type = "text/javascript"
    script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&v=weekly`
    script.async = true
    script.defer = true

    script.onload = () => {
      mapScriptLoaded = true
      mapScriptLoadPromise = null
      console.log("[v0] Google Maps script loaded successfully")
      resolve()
    }

    script.onerror = () => {
      mapScriptLoadPromise = null
      reject(new Error("Failed to load Google Maps API"))
    }

    document.head.appendChild(script)
  })

  return mapScriptLoadPromise
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

  const DEFAULT_CENTER = { lat: 38.8339, lng: -104.8214 }

  // Initialize map
  useEffect(() => {
    async function initMap() {
      try {
        setLoading(true)
        setError(null)

        await loadGoogleMapsScript()

        if (!mapRef.current) {
          setError("Map container not found")
          setLoading(false)
          return
        }

        if (!window.google?.maps) {
          setError("Google Maps library failed to load")
          setLoading(false)
          return
        }

        // Create map instance
        const map = new window.google.maps.Map(mapRef.current, {
          center: DEFAULT_CENTER,
          zoom: 13,
          mapTypeId: "roadmap",
          zoomControl: true,
          fullscreenControl: true,
          streetViewControl: false,
          mapTypeControl: false,
          scaleControl: true,
        })

        mapInstanceRef.current = map
        console.log("[v0] Google Maps initialized successfully")

        // Add click listener
        map.addListener("click", (e: google.maps.MapMouseEvent) => {
          if (!mode || !e.latLng) return

          const lat = e.latLng.lat()
          const lng = e.latLng.lng()

          console.log("[v0] Location selected:", { mode, lat, lng })

          if (mode === "pickup") {
            onPickupSelect?.(lat, lng)
          } else if (mode === "dropoff") {
            onDropoffSelect?.(lat, lng)
          }

          map.panTo({ lat, lng })
        })

        // Try geolocation
        if (navigator.geolocation) {
          navigator.geolocation.getCurrentPosition(
            (position) => {
              const userLoc = {
                lat: position.coords.latitude,
                lng: position.coords.longitude,
              }
              console.log("[v0] User location:", userLoc)
              map.setCenter(userLoc)
            },
            (error) => {
              console.log("[v0] Geolocation unavailable:", error.message)
            }
          )
        }

        setLoading(false)
      } catch (err) {
        const errMsg = err instanceof Error ? err.message : "Unknown error"
        console.error("[v0] Map init failed:", errMsg)
        setError(errMsg)
        setLoading(false)
      }
    }

    initMap()
  }, [mode, onPickupSelect, onDropoffSelect])

  return (
    <div className="w-full h-full flex flex-col relative bg-gray-50 rounded-lg overflow-hidden">
      {/* Map Container */}
      <div ref={mapRef} className="w-full h-full" />

      {/* Top Controls */}
      <div className="absolute top-4 left-4 z-10 flex gap-2">
        <button
          onClick={() => setMode(mode === "pickup" ? null : "pickup")}
          className={`px-4 py-2 rounded-lg font-semibold flex items-center gap-2 transition-all shadow-md ${
            mode === "pickup"
              ? "bg-green-500 text-white"
              : "bg-white text-gray-700 hover:bg-green-50 border border-green-200"
          }`}
        >
          <MapPin className="w-4 h-4" />
          {mode === "pickup" ? "Setting Pickup" : "Pickup"}
        </button>
        <button
          onClick={() => setMode(mode === "dropoff" ? null : "dropoff")}
          className={`px-4 py-2 rounded-lg font-semibold flex items-center gap-2 transition-all shadow-md ${
            mode === "dropoff"
              ? "bg-red-500 text-white"
              : "bg-white text-gray-700 hover:bg-red-50 border border-red-200"
          }`}
        >
          <MapPin className="w-4 h-4" />
          {mode === "dropoff" ? "Setting Dropoff" : "Dropoff"}
        </button>
      </div>

      {/* Loading State */}
      {loading && (
        <div className="absolute inset-0 bg-white/90 flex items-center justify-center z-50 rounded-lg">
          <div className="text-center">
            <Loader2 className="w-10 h-10 animate-spin mx-auto mb-3 text-green-500" />
            <p className="text-gray-700 font-semibold">Loading map...</p>
            <p className="text-gray-500 text-sm mt-1">Using API key</p>
          </div>
        </div>
      )}

      {/* Error State */}
      {error && (
        <div className="absolute inset-0 bg-red-50/95 flex items-center justify-center z-50 rounded-lg">
          <div className="text-center p-6 max-w-xs">
            <MapPin className="w-12 h-12 text-red-600 mx-auto mb-3" />
            <p className="text-red-700 font-semibold mb-2">Map Failed to Load</p>
            <p className="text-red-600 text-sm">{error}</p>
            <p className="text-red-500 text-xs mt-2 leading-relaxed">
              Verify that the Google Maps API key is active and Maps JavaScript API is enabled in Google Cloud Console.
            </p>
          </div>
        </div>
      )}

      {/* Mode Indicator */}
      {mode && !error && (
        <div className="absolute bottom-20 left-4 bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-semibold z-10 shadow-lg">
          👆 Click on map to set {mode} location
        </div>
      )}

      {/* Map Attribution */}
      <div className="absolute bottom-4 right-4 bg-white/95 px-3 py-1.5 rounded text-xs text-gray-600 z-5 shadow-sm">
        GlideWay Maps
      </div>
    </div>
  )
}
