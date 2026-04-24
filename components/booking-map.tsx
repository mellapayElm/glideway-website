"use client"

import { useEffect, useRef, useState } from "react"
import { Plus, Minus } from "lucide-react"

interface BookingMapProps {
  pickup?: { lat: number; lng: number } | null
  dropoff?: { lat: number; lng: number } | null
  onPickupSelect?: (lat: number, lng: number) => void
  onDropoffSelect?: (lat: number, lng: number) => void
  height?: string
}

// Default to Colorado Springs
const DEFAULT_CENTER = { lat: 38.8339, lng: -104.8214 }

// Light/clean map styles
const MAP_STYLES: google.maps.MapTypeStyle[] = [
  { elementType: "geometry", stylers: [{ color: "#f5f5f5" }] },
  { elementType: "labels.icon", stylers: [{ visibility: "off" }] },
  { elementType: "labels.text.fill", stylers: [{ color: "#616161" }] },
  { elementType: "labels.text.stroke", stylers: [{ color: "#f5f5f5" }] },
  { featureType: "poi", elementType: "geometry", stylers: [{ color: "#eeeeee" }] },
  { featureType: "poi", elementType: "labels.text.fill", stylers: [{ color: "#757575" }] },
  { featureType: "road", elementType: "geometry", stylers: [{ color: "#ffffff" }] },
  { featureType: "road.highway", elementType: "geometry", stylers: [{ color: "#dadada" }] },
  { featureType: "road.highway", elementType: "labels.text.fill", stylers: [{ color: "#616161" }] },
  { featureType: "water", elementType: "geometry", stylers: [{ color: "#c9c9c9" }] },
]

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
    script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=places,geometry`
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
  height = "500px"
}: BookingMapProps) {
  const mapRef = useRef<HTMLDivElement>(null)
  const mapInstanceRef = useRef<google.maps.Map | null>(null)
  const pickupMarkerRef = useRef<google.maps.marker.AdvancedMarkerElement | null>(null)
  const dropoffMarkerRef = useRef<google.maps.marker.AdvancedMarkerElement | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [mapMode, setMapMode] = useState<"pickup" | "dropoff" | null>(null)

  useEffect(() => {
    if (!mapRef.current) return

    const initializeMap = async () => {
      try {
        await loadGoogleMapsScript()

        if (!mapRef.current) return

        const map = new google.maps.Map(mapRef.current, {
          center: DEFAULT_CENTER,
          zoom: 13,
          styles: MAP_STYLES,
          disableDefaultUI: true,
          zoomControl: true,
          zoomControlOptions: {
            position: google.maps.ControlPosition.RIGHT_BOTTOM,
          },
        })

        mapInstanceRef.current = map
        setIsLoading(false)

        // Map click handler for selecting locations
        map.addListener("click", async (event: google.maps.MapMouseEvent) => {
          if (!event.latLng) return

          const lat = event.latLng.lat()
          const lng = event.latLng.lng()

          if (mapMode === "pickup") {
            onPickupSelect?.(lat, lng)
            addPickupMarker(lat, lng, map)
          } else if (mapMode === "dropoff") {
            onDropoffSelect?.(lat, lng)
            addDropoffMarker(lat, lng, map)
          }
        })
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load map")
        setIsLoading(false)
      }
    }

    initializeMap()
  }, [onPickupSelect, onDropoffSelect])

  // Update markers when props change
  useEffect(() => {
    if (!mapInstanceRef.current) return

    if (pickup) {
      addPickupMarker(pickup.lat, pickup.lng, mapInstanceRef.current)
    }
    if (dropoff) {
      addDropoffMarker(dropoff.lat, dropoff.lng, mapInstanceRef.current)
    }
  }, [pickup, dropoff])

  const addPickupMarker = (lat: number, lng: number, map: google.maps.Map) => {
    // Remove existing marker
    if (pickupMarkerRef.current) {
      pickupMarkerRef.current.map = null
    }

    const pickupDiv = document.createElement("div")
    pickupDiv.innerHTML = `
      <div class="flex items-center justify-center w-10 h-10 bg-green-500 rounded-full border-2 border-white shadow-lg">
        <svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4v.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
        </svg>
      </div>
    `

    pickupMarkerRef.current = new google.maps.marker.AdvancedMarkerElement({
      map,
      position: { lat, lng },
      content: pickupDiv,
    })
  }

  const addDropoffMarker = (lat: number, lng: number, map: google.maps.Map) => {
    // Remove existing marker
    if (dropoffMarkerRef.current) {
      dropoffMarkerRef.current.map = null
    }

    const dropoffDiv = document.createElement("div")
    dropoffDiv.innerHTML = `
      <div class="flex items-center justify-center w-10 h-10 bg-red-500 rounded-full border-2 border-white shadow-lg">
        <svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
        </svg>
      </div>
    `

    dropoffMarkerRef.current = new google.maps.marker.AdvancedMarkerElement({
      map,
      position: { lat, lng },
      content: dropoffDiv,
    })
  }

  const handleZoom = (direction: "in" | "out") => {
    if (!mapInstanceRef.current) return
    const currentZoom = mapInstanceRef.current.getZoom()
    if (currentZoom) {
      mapInstanceRef.current.setZoom(
        direction === "in" ? currentZoom + 1 : currentZoom - 1
      )
    }
  }

  if (error) {
    return (
      <div
        style={{ height }}
        className="bg-gray-100 rounded-lg flex items-center justify-center"
      >
        <div className="text-center">
          <p className="text-gray-600 mb-2">Unable to load map</p>
          <p className="text-sm text-gray-500">{error}</p>
        </div>
      </div>
    )
  }

  return (
    <div className="relative" style={{ height }}>
      <div ref={mapRef} className="w-full h-full rounded-lg overflow-hidden" />

      {/* Loading indicator */}
      {isLoading && (
        <div className="absolute inset-0 bg-gray-100 bg-opacity-50 flex items-center justify-center rounded-lg">
          <div className="text-center">
            <div className="w-8 h-8 border-4 border-gray-300 border-t-blue-600 rounded-full animate-spin mx-auto mb-2"></div>
            <p className="text-sm text-gray-600">Loading map...</p>
          </div>
        </div>
      )}

      {/* Mode indicator and zoom controls */}
      {!isLoading && (
        <>
          {/* Map mode buttons */}
          <div className="absolute top-4 left-4 space-y-2">
            <button
              onClick={() => setMapMode(mapMode === "pickup" ? null : "pickup")}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all ${
                mapMode === "pickup"
                  ? "bg-green-500 text-white"
                  : "bg-white text-gray-700 hover:shadow-md"
              }`}
            >
              <div className="w-3 h-3 rounded-full bg-green-500 border-2 border-current"></div>
              Pickup
            </button>
            <button
              onClick={() => setMapMode(mapMode === "dropoff" ? null : "dropoff")}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all ${
                mapMode === "dropoff"
                  ? "bg-red-500 text-white"
                  : "bg-white text-gray-700 hover:shadow-md"
              }`}
            >
              <div className="w-3 h-3 rounded-full bg-red-500 border-2 border-current"></div>
              Dropoff
            </button>
          </div>

          {/* Zoom controls */}
          <div className="absolute right-4 bottom-4 space-y-1">
            <button
              onClick={() => handleZoom("in")}
              className="bg-white p-2 rounded-lg shadow-md hover:shadow-lg transition-shadow"
              aria-label="Zoom in"
            >
              <Plus className="w-5 h-5" />
            </button>
            <button
              onClick={() => handleZoom("out")}
              className="bg-white p-2 rounded-lg shadow-md hover:shadow-lg transition-shadow"
              aria-label="Zoom out"
            >
              <Minus className="w-5 h-5" />
            </button>
          </div>

          {/* Instructions */}
          {mapMode && (
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 pointer-events-none">
              <div className="bg-black bg-opacity-75 text-white px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap">
                Click on map to set {mapMode} location
              </div>
            </div>
          )}
        </>
      )}
    </div>
  )
}
