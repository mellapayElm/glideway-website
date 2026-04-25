"use client"

import { useEffect, useRef } from "react"
import L from "leaflet"
import "leaflet/dist/leaflet.css"

type Props = {
  pickup?: { lat: number; lng: number }
  dropoff?: { lat: number; lng: number }
  driver?: { lat: number; lng: number; heading?: number; speedKph?: number }
  showRoute?: boolean
  height?: number | string
  className?: string
}

// Default to Los Angeles if no location provided
const DEFAULT_CENTER = { lat: 34.0522, lng: -118.2437 }

// Create custom marker icons
const createIcon = (color: string, size: number = 24) => {
  return L.divIcon({
    className: "custom-marker",
    html: `<div style="
      width: ${size}px;
      height: ${size}px;
      background: ${color};
      border: 3px solid white;
      border-radius: 50%;
      box-shadow: 0 2px 8px rgba(0,0,0,0.3);
    "></div>`,
    iconSize: [size, size],
    iconAnchor: [size / 2, size / 2],
  })
}

const createDriverIcon = (heading: number = 0) => {
  return L.divIcon({
    className: "driver-marker",
    html: `<div style="
      width: 40px;
      height: 40px;
      background: #3b82f6;
      border: 3px solid white;
      border-radius: 50%;
      box-shadow: 0 2px 12px rgba(59,130,246,0.5);
      display: flex;
      align-items: center;
      justify-content: center;
      transform: rotate(${heading}deg);
    ">
      <svg width="20" height="20" viewBox="0 0 24 24" fill="white">
        <path d="M18.92 6.01C18.72 5.42 18.16 5 17.5 5h-11c-.66 0-1.21.42-1.42 1.01L3 12v8c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-1h12v1c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-8l-2.08-5.99zM6.5 16c-.83 0-1.5-.67-1.5-1.5S5.67 13 6.5 13s1.5.67 1.5 1.5S7.33 16 6.5 16zm11 0c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5zM5 11l1.5-4.5h11L19 11H5z"/>
      </svg>
    </div>`,
    iconSize: [40, 40],
    iconAnchor: [20, 20],
  })
}

const pickupIcon = createIcon("#22c55e", 24)
const dropoffIcon = createIcon("#ef4444", 24)

export default function LeafletMapLive({
  pickup,
  dropoff,
  driver,
  showRoute = true,
  height = 400,
  className = "",
}: Props) {
  const mapContainerRef = useRef<HTMLDivElement>(null)
  const mapRef = useRef<L.Map | null>(null)
  const pickupMarkerRef = useRef<L.Marker | null>(null)
  const dropoffMarkerRef = useRef<L.Marker | null>(null)
  const driverMarkerRef = useRef<L.Marker | null>(null)
  const routeLineRef = useRef<L.Polyline | null>(null)

  // Initialize map
  useEffect(() => {
    if (!mapContainerRef.current || mapRef.current) return

    const center = pickup || dropoff || driver || DEFAULT_CENTER
    const map = L.map(mapContainerRef.current, {
      center: [center.lat, center.lng],
      zoom: 14,
      zoomControl: true,
    })

    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
      maxZoom: 19,
    }).addTo(map)

    mapRef.current = map

    return () => {
      if (mapRef.current) {
        mapRef.current.remove()
        mapRef.current = null
      }
    }
  }, [])

  // Update markers
  useEffect(() => {
    if (!mapRef.current) return

    const bounds: L.LatLngExpression[] = []

    // Pickup marker
    if (pickup) {
      if (pickupMarkerRef.current) {
        pickupMarkerRef.current.setLatLng([pickup.lat, pickup.lng])
      } else {
        pickupMarkerRef.current = L.marker([pickup.lat, pickup.lng], { icon: pickupIcon })
          .addTo(mapRef.current)
          .bindPopup("Pickup Location")
      }
      bounds.push([pickup.lat, pickup.lng])
    }

    // Dropoff marker
    if (dropoff) {
      if (dropoffMarkerRef.current) {
        dropoffMarkerRef.current.setLatLng([dropoff.lat, dropoff.lng])
      } else {
        dropoffMarkerRef.current = L.marker([dropoff.lat, dropoff.lng], { icon: dropoffIcon })
          .addTo(mapRef.current)
          .bindPopup("Dropoff Location")
      }
      bounds.push([dropoff.lat, dropoff.lng])
    }

    // Driver marker
    if (driver) {
      const driverIconInstance = createDriverIcon(driver.heading || 0)
      if (driverMarkerRef.current) {
        driverMarkerRef.current.setLatLng([driver.lat, driver.lng])
        driverMarkerRef.current.setIcon(driverIconInstance)
      } else {
        driverMarkerRef.current = L.marker([driver.lat, driver.lng], { icon: driverIconInstance })
          .addTo(mapRef.current)
          .bindPopup(`Driver${driver.speedKph ? ` - ${driver.speedKph} km/h` : ""}`)
      }
      bounds.push([driver.lat, driver.lng])
    }

    // Route line
    if (showRoute && pickup && dropoff) {
      const routePoints: L.LatLngExpression[] = [
        [pickup.lat, pickup.lng],
        ...(driver ? [[driver.lat, driver.lng] as L.LatLngExpression] : []),
        [dropoff.lat, dropoff.lng],
      ]

      if (routeLineRef.current) {
        routeLineRef.current.setLatLngs(routePoints)
      } else {
        routeLineRef.current = L.polyline(routePoints, {
          color: "#22c55e",
          weight: 4,
          opacity: 0.8,
        }).addTo(mapRef.current)
      }
    }

    // Fit bounds
    if (bounds.length > 1) {
      mapRef.current.fitBounds(bounds as L.LatLngBoundsExpression, { padding: [50, 50] })
    } else if (bounds.length === 1) {
      mapRef.current.setView(bounds[0] as L.LatLngExpression, 14)
    }
  }, [pickup, dropoff, driver, showRoute])

  return (
    <div
      ref={mapContainerRef}
      className={`w-full rounded-lg overflow-hidden ${className}`}
      style={{ height: typeof height === "number" ? `${height}px` : height }}
    />
  )
}
