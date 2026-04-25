"use client"

import { useEffect, useRef } from "react"
import L from "leaflet"
import "leaflet/dist/leaflet.css"

interface LeafletMapInnerProps {
  pickupLat: number
  pickupLng: number
  dropoffLat?: number
  dropoffLng?: number
  pickupAddress?: string
  dropoffAddress?: string
  className?: string
}

// Fix for default marker icons in Leaflet with webpack
const createIcon = (color: string) => {
  return L.divIcon({
    className: "custom-marker",
    html: `<div style="
      width: 24px;
      height: 24px;
      background: ${color};
      border: 3px solid white;
      border-radius: 50%;
      box-shadow: 0 2px 8px rgba(0,0,0,0.3);
    "></div>`,
    iconSize: [24, 24],
    iconAnchor: [12, 12],
    popupAnchor: [0, -12],
  })
}

const pickupIcon = createIcon("#84cc16") // lime-500
const dropoffIcon = createIcon("#ef4444") // red-500

export default function LeafletMapInner({
  pickupLat,
  pickupLng,
  dropoffLat,
  dropoffLng,
  pickupAddress = "Pickup",
  dropoffAddress = "Dropoff",
  className = "",
}: LeafletMapInnerProps) {
  const mapRef = useRef<L.Map | null>(null)
  const mapContainerRef = useRef<HTMLDivElement>(null)
  const pickupMarkerRef = useRef<L.Marker | null>(null)
  const dropoffMarkerRef = useRef<L.Marker | null>(null)
  const routeLineRef = useRef<L.Polyline | null>(null)

  // Initialize map
  useEffect(() => {
    if (!mapContainerRef.current || mapRef.current) return

    const map = L.map(mapContainerRef.current, {
      center: [pickupLat, pickupLng],
      zoom: 14,
      zoomControl: true,
    })

    // Use OpenStreetMap tiles (free, no API key)
    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
      maxZoom: 19,
    }).addTo(map)

    mapRef.current = map

    // Add pickup marker
    pickupMarkerRef.current = L.marker([pickupLat, pickupLng], { icon: pickupIcon })
      .addTo(map)
      .bindPopup(pickupAddress)

    return () => {
      if (mapRef.current) {
        mapRef.current.remove()
        mapRef.current = null
      }
    }
  }, [])

  // Update markers when locations change
  useEffect(() => {
    if (!mapRef.current) return

    // Update pickup marker
    if (pickupMarkerRef.current) {
      pickupMarkerRef.current.setLatLng([pickupLat, pickupLng])
      pickupMarkerRef.current.setPopupContent(pickupAddress)
    }

    // Update dropoff marker
    if (dropoffLat && dropoffLng) {
      if (dropoffMarkerRef.current) {
        dropoffMarkerRef.current.setLatLng([dropoffLat, dropoffLng])
        dropoffMarkerRef.current.setPopupContent(dropoffAddress)
      } else {
        dropoffMarkerRef.current = L.marker([dropoffLat, dropoffLng], { icon: dropoffIcon })
          .addTo(mapRef.current)
          .bindPopup(dropoffAddress)
      }

      // Draw route line
      if (routeLineRef.current) {
        routeLineRef.current.setLatLngs([
          [pickupLat, pickupLng],
          [dropoffLat, dropoffLng],
        ])
      } else {
        routeLineRef.current = L.polyline(
          [
            [pickupLat, pickupLng],
            [dropoffLat, dropoffLng],
          ],
          {
            color: "#84cc16",
            weight: 4,
            opacity: 0.8,
            dashArray: "10, 10",
          }
        ).addTo(mapRef.current)
      }

      // Fit bounds to show both markers
      const bounds = L.latLngBounds(
        [pickupLat, pickupLng],
        [dropoffLat, dropoffLng]
      )
      mapRef.current.fitBounds(bounds, { padding: [50, 50] })
    } else {
      // Remove dropoff marker and route if no dropoff
      if (dropoffMarkerRef.current) {
        dropoffMarkerRef.current.remove()
        dropoffMarkerRef.current = null
      }
      if (routeLineRef.current) {
        routeLineRef.current.remove()
        routeLineRef.current = null
      }
      
      // Center on pickup
      mapRef.current.setView([pickupLat, pickupLng], 14)
    }
  }, [pickupLat, pickupLng, dropoffLat, dropoffLng, pickupAddress, dropoffAddress])

  return (
    <div
      ref={mapContainerRef}
      className={`w-full h-full ${className}`}
      style={{ minHeight: "200px" }}
    />
  )
}
