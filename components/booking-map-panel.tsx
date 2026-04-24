"use client"

import { useEffect, useRef, useState } from "react"
import { MapPin, Locate, X } from "lucide-react"
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
  className?: string
  height?: string | number
}

// Colorado Springs default
const DEFAULT_CENTER = { lat: 38.8339, lng: -104.8214 }

// Light map styles
const LIGHT_MAP_STYLES: google.maps.MapTypeStyle[] = [
  { elementType: "geometry", stylers: [{ color: "#f5f5f5" }] },
  { elementType: "labels.text.fill", stylers: [{ color: "#616161" }] },
  { featureType: "water", elementType: "geometry", stylers: [{ color: "#c9c9c9" }] },
]

// Global script loading state
let googleMapsPromise: Promise<void> | null = null

function loadGoogleMaps(apiKey: string): Promise<void> {
  if (googleMapsPromise) return googleMapsPromise
  if (typeof window !== "undefined" && window.google?.maps) {
    return Promise.resolve()
  }

  googleMapsPromise = new Promise((resolve, reject) => {
    const existingScript = document.querySelector(
      `script[src*="maps.googleapis.com/maps/api/js"][src*="key=${apiKey}"]`
    )
    
    if (existingScript) {
      const checkGoogle = setInterval(() => {
        if (window.google?.maps) {
          clearInterval(checkGoogle)
          resolve()
        }
      }, 100)
      return
    }

    const script = document.createElement("script")
    script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=places,geometry,marker&v=weekly`
    script.async = true
    script.defer = true
    script.onload = () => {
      console.log("[GlideWay] Google Maps loaded")
      resolve()
    }
    script.onerror = () => reject(new Error("Failed to load Google Maps"))
    document.head.appendChild(script)
  })

  return googleMapsPromise
}

export function BookingMapPanel({
  pickup,
  dropoff,
  onPickupChange,
  onDropoffChange,
  className = "",
  height = "500px",
}: BookingMapPanelProps) {
  const mapRef = useRef<HTMLDivElement>(null)
  const mapInstanceRef = useRef<google.maps.Map | null>(null)
  const pickupInputRef = useRef<HTMLInputElement>(null)
  const dropoffInputRef = useRef<HTMLInputElement>(null)

  const [pickupValue, setPickupValue] = useState(pickup || "")
  const [dropoffValue, setDropoffValue] = useState(dropoff || "")
  const [mapsLoaded, setMapsLoaded] = useState(false)
  const [isLocating, setIsLocating] = useState(false)
  const [mapsError, setMapsError] = useState("")

  // Initialize map
  useEffect(() => {
    if (!mapRef.current) return

    let mounted = true
    const init = async () => {
      try {
        const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY
        if (!apiKey) {
          setMapsError("Google Maps API key not configured")
          return
        }

        await loadGoogleMaps(apiKey)
        if (!mounted || !mapRef.current) return

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
        setMapsLoaded(true)
      } catch (err) {
        if (mounted) {
          setMapsError("Failed to load Google Maps")
          console.error("[GlideWay] Maps error:", err)
        }
      }
    }

    init()
    return () => { mounted = false }
  }, [])

  // Handle location request
  const handleLocateMe = () => {
    if (!navigator.geolocation || !mapInstanceRef.current) return

    setIsLocating(true)
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const { latitude, longitude } = pos.coords
        const coords = { lat: latitude, lng: longitude }
        setPickupValue(`Current Location (${latitude.toFixed(4)}, ${longitude.toFixed(4)})`)
        onPickupChange?.(`Current Location`, coords)
        mapInstanceRef.current?.setCenter(coords)
        setIsLocating(false)
      },
      () => {
        setIsLocating(false)
        setMapsError("Unable to get your location")
      }
    )
  }

  return (
    <div className={`flex flex-col gap-4 ${className}`}>
      {/* Inputs */}
      <div className="space-y-3">
        {/* Pickup Input */}
        <div className="relative">
          <div className="flex items-center gap-2 p-3 bg-white border border-gray-200 rounded-lg">
            <MapPin className="w-5 h-5 text-green-500 flex-shrink-0" />
            <input
              ref={pickupInputRef}
              type="text"
              placeholder="Enter pickup location"
              value={pickupValue}
              onChange={(e) => {
                setPickupValue(e.target.value)
                onPickupChange?.(e.target.value)
              }}
              className="flex-1 bg-transparent outline-none text-sm"
            />
            {pickupValue && (
              <button
                onClick={() => {
                  setPickupValue("")
                  onPickupChange?.("")
                }}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>

        {/* Dropoff Input */}
        <div className="relative">
          <div className="flex items-center gap-2 p-3 bg-white border border-gray-200 rounded-lg">
            <MapPin className="w-5 h-5 text-red-500 flex-shrink-0" />
            <input
              ref={dropoffInputRef}
              type="text"
              placeholder="Enter dropoff location"
              value={dropoffValue}
              onChange={(e) => {
                setDropoffValue(e.target.value)
                onDropoffChange?.(e.target.value)
              }}
              className="flex-1 bg-transparent outline-none text-sm"
            />
            {dropoffValue && (
              <button
                onClick={() => {
                  setDropoffValue("")
                  onDropoffChange?.("")
                }}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>

        {/* Locate Me Button */}
        <Button
          onClick={handleLocateMe}
          disabled={isLocating}
          variant="outline"
          className="w-full"
        >
          <Locate className="w-4 h-4 mr-2" />
          {isLocating ? "Getting location..." : "Use my location"}
        </Button>

        {mapsError && (
          <div className="p-3 bg-red-50 border border-red-200 rounded text-sm text-red-700">
            {mapsError}
          </div>
        )}
      </div>

      {/* Map */}
      <div
        ref={mapRef}
        style={{ height }}
        className="rounded-lg border border-gray-200 overflow-hidden bg-gray-100"
      />
    </div>
  )
}
