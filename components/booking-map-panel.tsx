"use client"

import { useEffect, useRef, useState } from "react"
import { loadGoogleMaps } from "@/lib/google-maps-loader"

interface BookingMapPanelProps {
  pickup?: string
  dropoff?: string
  pickupCoords?: { lat: number; lng: number }
  dropoffCoords?: { lat: number; lng: number }
}

export function BookingMapPanel({
  pickupCoords,
  dropoffCoords,
}: BookingMapPanelProps) {
  const mapContainer = useRef<HTMLDivElement>(null)
  const mapRef = useRef<google.maps.Map | null>(null)
  const [mapLoaded, setMapLoaded] = useState(false)

  useEffect(() => {
    const initMap = async () => {
      try {
        await loadGoogleMaps()

        if (!mapContainer.current || !window.google?.maps) {
          console.error("[v0] Google Maps not available")
          return
        }

        // Use provided coordinates or default to Denver
        const center = pickupCoords || { lat: 38.8339, lng: -104.8214 }

        // Create map
        const map = new window.google.maps.Map(mapContainer.current, {
          zoom: 15,
          center: center,
          mapTypeControl: true,
          fullscreenControl: true,
          streetViewControl: false,
        })

        mapRef.current = map

        // Add pickup marker if coordinates provided
        if (pickupCoords) {
          new window.google.maps.Marker({
            position: pickupCoords,
            map: map,
            title: "Pickup Location",
            icon: "http://maps.google.com/mapfiles/ms/icons/green-dot.png",
          })
        }

        // Add dropoff marker and draw route if both coordinates provided
        if (dropoffCoords) {
          new window.google.maps.Marker({
            position: dropoffCoords,
            map: map,
            title: "Dropoff Location",
            icon: "http://maps.google.com/mapfiles/ms/icons/red-dot.png",
          })

          // Draw route line
          if (pickupCoords) {
            new window.google.maps.Polyline({
              path: [pickupCoords, dropoffCoords],
              geodesic: true,
              strokeColor: "#4285F4",
              strokeOpacity: 0.7,
              strokeWeight: 3,
              map: map,
            })

            // Fit both markers in view
            const bounds = new window.google.maps.LatLngBounds()
            bounds.extend(pickupCoords)
            bounds.extend(dropoffCoords)
            map.fitBounds(bounds)
          }
        }

        setMapLoaded(true)
      } catch (error) {
        console.error("[v0] Map initialization error:", error)
      }
    }

    initMap()
  }, [pickupCoords, dropoffCoords])

  return (
    <div
      ref={mapContainer}
      style={{
        width: "100%",
        height: "100%",
        minHeight: "400px",
        backgroundColor: "#f0f0f0",
      }}
    />
  )
}
