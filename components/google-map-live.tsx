"use client"

import { useEffect, useRef, useState } from "react"
import { Loader2 } from "lucide-react"
import { loadGoogleMaps } from "@/lib/google-maps-loader"

type Props = {
  pickup?: { lat: number; lng: number }
  dropoff?: { lat: number; lng: number }
  driver?: { lat: number; lng: number; heading?: number }
  showRoute?: boolean
  height?: number | string
  className?: string
}

const DEFAULT_CENTER = { lat: 34.0522, lng: -118.2437 }

export default function GoogleMapLive({ 
  pickup, 
  dropoff, 
  driver,
  showRoute = true,
  height = 400,
  className = ""
}: Props) {
  const mapRef = useRef<HTMLDivElement | null>(null)
  const mapInstanceRef = useRef<google.maps.Map | null>(null)
  const pickupMarkerRef = useRef<google.maps.Marker | null>(null)
  const dropoffMarkerRef = useRef<google.maps.Marker | null>(null)
  const driverMarkerRef = useRef<google.maps.Marker | null>(null)
  const directionsRendererRef = useRef<google.maps.DirectionsRenderer | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Initialize map
  useEffect(() => {
    const initMap = async () => {
      if (!mapRef.current) return

      try {
        await loadGoogleMaps()
        
        if (!window.google?.maps) {
          setError("Google Maps failed to load")
          setIsLoading(false)
          return
        }

        const center = pickup || dropoff || driver || DEFAULT_CENTER

        const map = new window.google.maps.Map(mapRef.current, {
          center,
          zoom: 14,
          disableDefaultUI: false,
          zoomControl: true,
          mapTypeControl: false,
          streetViewControl: false,
          fullscreenControl: true,
        })

        mapInstanceRef.current = map

        // Create directions renderer
        directionsRendererRef.current = new window.google.maps.DirectionsRenderer({
          map,
          suppressMarkers: true,
          polylineOptions: {
            strokeColor: "#22c55e",
            strokeWeight: 5,
          },
        })

        setIsLoading(false)
      } catch (err) {
        console.error("[v0] Map initialization error:", err)
        setError("Failed to initialize map")
        setIsLoading(false)
      }
    }

    initMap()
  }, [])

  // Update markers
  useEffect(() => {
    if (!mapInstanceRef.current || !window.google?.maps) return

    const map = mapInstanceRef.current

    // Pickup marker
    if (pickup) {
      if (pickupMarkerRef.current) {
        pickupMarkerRef.current.setPosition(pickup)
      } else {
        pickupMarkerRef.current = new window.google.maps.Marker({
          position: pickup,
          map,
          icon: {
            path: window.google.maps.SymbolPath.CIRCLE,
            scale: 12,
            fillColor: "#22c55e",
            fillOpacity: 1,
            strokeColor: "#ffffff",
            strokeWeight: 3,
          },
          title: "Pickup",
        })
      }
    }

    // Dropoff marker
    if (dropoff) {
      if (dropoffMarkerRef.current) {
        dropoffMarkerRef.current.setPosition(dropoff)
      } else {
        dropoffMarkerRef.current = new window.google.maps.Marker({
          position: dropoff,
          map,
          icon: {
            path: window.google.maps.SymbolPath.CIRCLE,
            scale: 12,
            fillColor: "#ef4444",
            fillOpacity: 1,
            strokeColor: "#ffffff",
            strokeWeight: 3,
          },
          title: "Dropoff",
        })
      }
    }

    // Driver marker
    if (driver) {
      if (driverMarkerRef.current) {
        driverMarkerRef.current.setPosition(driver)
      } else {
        driverMarkerRef.current = new window.google.maps.Marker({
          position: driver,
          map,
          icon: {
            path: "M12 2L4.5 20.3l.7.7L12 18l6.8 3 .7-.7L12 2z",
            scale: 1.5,
            fillColor: "#3b82f6",
            fillOpacity: 1,
            strokeColor: "#ffffff",
            strokeWeight: 2,
            rotation: driver.heading || 0,
            anchor: new window.google.maps.Point(12, 12),
          },
          title: "Driver",
        })
      }
    }

    // Draw route
    if (showRoute && pickup && dropoff && directionsRendererRef.current) {
      const directionsService = new window.google.maps.DirectionsService()
      directionsService.route(
        {
          origin: pickup,
          destination: dropoff,
          travelMode: window.google.maps.TravelMode.DRIVING,
        },
        (result, status) => {
          if (status === "OK" && result) {
            directionsRendererRef.current?.setDirections(result)
          }
        }
      )
    }

    // Fit bounds
    if (pickup || dropoff) {
      const bounds = new window.google.maps.LatLngBounds()
      if (pickup) bounds.extend(pickup)
      if (dropoff) bounds.extend(dropoff)
      if (driver) bounds.extend(driver)
      map.fitBounds(bounds, 50)
    }
  }, [pickup, dropoff, driver, showRoute])

  if (error) {
    return (
      <div 
        className={`flex items-center justify-center bg-gray-100 ${className}`}
        style={{ height }}
      >
        <p className="text-gray-500">{error}</p>
      </div>
    )
  }

  return (
    <div className={`relative ${className}`} style={{ height }}>
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-100 z-10">
          <Loader2 className="w-8 h-8 text-green-500 animate-spin" />
        </div>
      )}
      <div ref={mapRef} className="w-full h-full" />
      
      {/* Legend */}
      <div className="absolute bottom-4 left-4 bg-white/95 backdrop-blur-sm rounded-lg px-3 py-2 shadow-lg flex items-center gap-4 text-sm">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-green-500" />
          <span className="text-gray-700">Pickup</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-red-500" />
          <span className="text-gray-700">Dropoff</span>
        </div>
        {driver && (
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-blue-500" />
            <span className="text-gray-700">Driver</span>
          </div>
        )}
      </div>
    </div>
  )
}
