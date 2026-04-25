"use client"

import dynamic from "next/dynamic"
import { useEffect, useState } from "react"
import { MapPin, Locate, Navigation } from "lucide-react"
import { Button } from "@/components/ui/button"
import { searchAddresses, reverseGeocode, calculateDistance } from "@/lib/map-utils"

// Dynamic import to avoid SSR issues
const LeafletMapInner = dynamic(
  () => import("./leaflet-map-inner"),
  { ssr: false, loading: () => <div className="w-full h-full bg-gray-100 animate-pulse flex items-center justify-center"><span className="text-gray-500">Loading map...</span></div> }
)

interface LatLng {
  lat: number
  lng: number
}

interface LeafletBookingMapProps {
  pickup?: string
  dropoff?: string
  pickupCoords?: LatLng
  dropoffCoords?: LatLng
  onPickupChange?: (address: string, coords?: LatLng) => void
  onDropoffChange?: (address: string, coords?: LatLng) => void
  className?: string
  height?: string | number
  showControls?: boolean
}

export function LeafletBookingMap({
  pickup = "",
  dropoff = "",
  pickupCoords,
  dropoffCoords,
  onPickupChange,
  onDropoffChange,
  className = "",
  height = 400,
  showControls = true,
}: LeafletBookingMapProps) {
  const [userLocation, setUserLocation] = useState<LatLng | null>(null)
  const [isLocating, setIsLocating] = useState(false)
  const [distance, setDistance] = useState<number | null>(null)

  // Get user location on mount
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          const loc = { lat: pos.coords.latitude, lng: pos.coords.longitude }
          setUserLocation(loc)
        },
        () => {
          // Default location
          setUserLocation({ lat: 38.8339, lng: -104.8214 })
        }
      )
    }
  }, [])

  // Calculate distance when both locations are set
  useEffect(() => {
    if (pickupCoords && dropoffCoords) {
      const dist = calculateDistance(
        pickupCoords.lat,
        pickupCoords.lng,
        dropoffCoords.lat,
        dropoffCoords.lng
      )
      setDistance(dist)
    } else {
      setDistance(null)
    }
  }, [pickupCoords, dropoffCoords])

  const handleUseCurrentLocation = async () => {
    setIsLocating(true)
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        async (pos) => {
          const coords = { lat: pos.coords.latitude, lng: pos.coords.longitude }
          const address = await reverseGeocode(coords.lat, coords.lng)
          onPickupChange?.(address, coords)
          setIsLocating(false)
        },
        () => {
          setIsLocating(false)
        }
      )
    } else {
      setIsLocating(false)
    }
  }

  return (
    <div className={`relative ${className}`} style={{ height }}>
      {/* Map */}
      <LeafletMapInner
        pickupLat={pickupCoords?.lat || userLocation?.lat || 38.8339}
        pickupLng={pickupCoords?.lng || userLocation?.lng || -104.8214}
        dropoffLat={dropoffCoords?.lat}
        dropoffLng={dropoffCoords?.lng}
        pickupAddress={pickup}
        dropoffAddress={dropoff}
      />

      {/* Legend */}
      <div className="absolute bottom-4 left-4 bg-white/95 backdrop-blur-sm rounded-lg px-3 py-2 shadow-lg flex items-center gap-4 text-sm z-[1000]">
        <div className="flex items-center gap-1.5">
          <div className="w-3 h-3 bg-lime-500 rounded-full" />
          <span className="text-gray-700">Pickup</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-3 h-3 bg-red-500 rounded-full" />
          <span className="text-gray-700">Dropoff</span>
        </div>
        {distance && (
          <div className="flex items-center gap-1.5 text-blue-600 font-medium">
            <Navigation className="w-3 h-3" />
            <span>{distance.toFixed(1)} mi</span>
          </div>
        )}
      </div>

      {/* Controls */}
      {showControls && (
        <div className="absolute top-4 right-4 flex flex-col gap-2 z-[1000]">
          <Button
            variant="secondary"
            size="icon"
            className="bg-white shadow-lg hover:bg-gray-50"
            onClick={handleUseCurrentLocation}
            disabled={isLocating}
          >
            <Locate className={`w-4 h-4 ${isLocating ? "animate-pulse text-lime-500" : "text-gray-700"}`} />
          </Button>
        </div>
      )}
    </div>
  )
}

export default LeafletBookingMap
