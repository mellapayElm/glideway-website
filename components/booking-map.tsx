"use client"

import { useEffect, useRef, useState } from "react"
import { MapPin, Navigation, Loader2 } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"

interface BookingMapProps {
  pickup?: { lat: number; lng: number } | null
  dropoff?: { lat: number; lng: number } | null
  onPickupSelect?: (lat: number, lng: number, address?: string) => void
  onDropoffSelect?: (lat: number, lng: number, address?: string) => void
  height?: string
}

// Default to Colorado Springs
const DEFAULT_CENTER = { lat: 38.8339, lng: -104.8214 }

let scriptLoaded = false
let scriptLoading: Promise<void> | null = null

function loadGoogleMapsScript(): Promise<void> {
  if (scriptLoaded && window.google?.maps) {
    return Promise.resolve()
  }

  if (scriptLoading) {
    return scriptLoading
  }

  scriptLoading = new Promise((resolve, reject) => {
    if (window.google?.maps) {
      scriptLoaded = true
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
          scriptLoaded = true
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
      scriptLoaded = true
      resolve()
    }
    
    script.onerror = () => {
      scriptLoading = null
      reject(new Error("Failed to load Google Maps API"))
    }

    document.head.appendChild(script)
  })

  return scriptLoading
}

export function BookingMap({
  pickup,
  dropoff,
  onPickupSelect,
  onDropoffSelect,
  height = "600px"
}: BookingMapProps) {
  const mapRef = useRef<HTMLDivElement>(null)
  const mapInstanceRef = useRef<google.maps.Map | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [mode, setMode] = useState<"pickup" | "dropoff" | null>(null)
  const pickupMarkerRef = useRef<google.maps.Marker | null>(null)
  const dropoffMarkerRef = useRef<google.maps.Marker | null>(null)

  // Initialize map
  useEffect(() => {
    async function initMap() {
      try {
        setLoading(true)
        setError(null)

        await loadGoogleMapsScript()

        if (!mapRef.current || !window.google?.maps) {
          setError("Google Maps not available")
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
        })

        mapInstanceRef.current = map

        // Add click listener
        map.addListener("click", (e: google.maps.MapMouseEvent) => {
          if (!mode || !e.latLng) return

          const lat = e.latLng.lat()
          const lng = e.latLng.lng()

          if (mode === "pickup") {
            onPickupSelect?.(lat, lng)
            addPickupMarker(lat, lng)
          } else {
            onDropoffSelect?.(lat, lng)
            addDropoffMarker(lat, lng)
          }
        })

        setLoading(false)
      } catch (err) {
        console.error("[v0] Map error:", err)
        setError(err instanceof Error ? err.message : "Failed to load map")
        setLoading(false)
      }
    }

    initMap()
  }, [mode, onPickupSelect, onDropoffSelect])

  // Add/update pickup marker
  const addPickupMarker = (lat: number, lng: number) => {
    if (!mapInstanceRef.current) return

    if (pickupMarkerRef.current) {
      pickupMarkerRef.current.setMap(null)
    }

    pickupMarkerRef.current = new window.google.maps.Marker({
      position: { lat, lng },
      map: mapInstanceRef.current,
      title: "Pickup",
      icon: {
        path: window.google.maps.SymbolPath.CIRCLE,
        scale: 10,
        fillColor: "#22c55e",
        fillOpacity: 1,
        strokeColor: "#ffffff",
        strokeWeight: 2,
      },
    })

    mapInstanceRef.current.panTo({ lat, lng })
  }

  // Add/update dropoff marker
  const addDropoffMarker = (lat: number, lng: number) => {
    if (!mapInstanceRef.current) return

    if (dropoffMarkerRef.current) {
      dropoffMarkerRef.current.setMap(null)
    }

    dropoffMarkerRef.current = new window.google.maps.Marker({
      position: { lat, lng },
      map: mapInstanceRef.current,
      title: "Dropoff",
      icon: {
        path: window.google.maps.SymbolPath.CIRCLE,
        scale: 10,
        fillColor: "#ef4444",
        fillOpacity: 1,
        strokeColor: "#ffffff",
        strokeWeight: 2,
      },
    })

    mapInstanceRef.current.panTo({ lat, lng })
  }

  // Update markers when props change
  useEffect(() => {
    if (pickup) {
      addPickupMarker(pickup.lat, pickup.lng)
    }
  }, [pickup])

  useEffect(() => {
    if (dropoff) {
      addDropoffMarker(dropoff.lat, dropoff.lng)
    }
  }, [dropoff])

  return (
    <div className="w-full flex flex-col rounded-lg overflow-hidden" style={{ height }}>
      {/* Controls */}
      <div className="bg-white border-b border-gray-200 p-4 flex gap-3">
        <Button
          size="sm"
          onClick={() => setMode(mode === "pickup" ? null : "pickup")}
          variant={mode === "pickup" ? "default" : "outline"}
          className="gap-2"
        >
          <MapPin className="w-4 h-4" />
          Pickup
        </Button>
        <Button
          size="sm"
          onClick={() => setMode(mode === "dropoff" ? null : "dropoff")}
          variant={mode === "dropoff" ? "default" : "outline"}
          className="gap-2"
        >
          <Navigation className="w-4 h-4" />
          Dropoff
        </Button>
      </div>

      {/* Map Container */}
      <div className="flex-1 relative bg-gray-100">
        <div ref={mapRef} className="w-full h-full" />

        {loading && (
          <div className="absolute inset-0 flex items-center justify-center bg-white/80">
            <div className="text-center">
              <Loader2 className="w-8 h-8 animate-spin mx-auto mb-2 text-gray-600" />
              <p className="text-sm text-gray-600">Loading map...</p>
            </div>
          </div>
        )}

        {error && (
          <div className="absolute inset-0 flex items-center justify-center bg-white/90">
            <div className="text-center p-4">
              <p className="text-red-600 font-semibold mb-1">Map Error</p>
              <p className="text-sm text-gray-600">{error}</p>
            </div>
          </div>
        )}

        {mode && (
          <div className="absolute top-4 left-4 bg-blue-50 border border-blue-200 rounded-lg px-3 py-2 text-sm text-blue-700">
            Click on map to set {mode} location
          </div>
        )}

        {/* Map Attribution */}
        <div className="absolute bottom-4 right-4 bg-white/95 px-2 py-1 rounded text-xs text-gray-600">
          GlideWay Maps
        </div>
      </div>
    </div>
  )
}
