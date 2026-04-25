'use client'

import { useEffect, useState } from 'react'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'

interface LeafletMapProps {
  pickupLat?: number
  pickupLng?: number
  dropoffLat?: number
  dropoffLng?: number
  pickupAddress?: string
  dropoffAddress?: string
}

export function LeafletMap({
  pickupLat = 40.7128,
  pickupLng = -74.006,
  dropoffLat,
  dropoffLng,
  pickupAddress = 'Pickup',
  dropoffAddress = 'Dropoff',
}: LeafletMapProps) {
  const [map, setMap] = useState<L.Map | null>(null)

  useEffect(() => {
    // Initialize map
    const mapInstance = L.map('map', {
      center: [pickupLat, pickupLng],
      zoom: 14,
      zoomControl: true,
      attributionControl: true,
    })

    // Add OpenStreetMap tiles
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© OpenStreetMap contributors',
      maxZoom: 19,
    }).addTo(mapInstance)

    // Add pickup marker (green)
    const pickupIcon = L.divIcon({
      html: `
        <div style="
          width: 40px;
          height: 40px;
          background: #7CFF3A;
          border: 3px solid white;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: 0 2px 8px rgba(0,0,0,0.3);
          font-weight: bold;
          color: #1a1a1a;
          font-size: 18px;
        ">
          📍
        </div>
      `,
      className: 'pickup-marker',
      iconSize: [40, 40],
      iconAnchor: [20, 40],
      popupAnchor: [0, -40],
    })

    L.marker([pickupLat, pickupLng], { icon: pickupIcon })
      .bindPopup(pickupAddress)
      .addTo(mapInstance)

    // Add dropoff marker if provided (red)
    if (dropoffLat && dropoffLng) {
      const dropoffIcon = L.divIcon({
        html: `
          <div style="
            width: 40px;
            height: 40px;
            background: #FF6B6B;
            border: 3px solid white;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            box-shadow: 0 2px 8px rgba(0,0,0,0.3);
            font-weight: bold;
            color: white;
            font-size: 18px;
          ">
            📍
          </div>
        `,
        className: 'dropoff-marker',
        iconSize: [40, 40],
        iconAnchor: [20, 40],
        popupAnchor: [0, -40],
      })

      L.marker([dropoffLat, dropoffLng], { icon: dropoffIcon })
        .bindPopup(dropoffAddress)
        .addTo(mapInstance)

      // Draw route line between pickup and dropoff
      L.polyline(
        [
          [pickupLat, pickupLng],
          [dropoffLat, dropoffLng],
        ],
        {
          color: '#7CFF3A',
          weight: 4,
          opacity: 0.8,
          dashArray: '5, 5',
        }
      ).addTo(mapInstance)

      // Fit bounds to show both markers
      const bounds = L.latLngBounds([
        [pickupLat, pickupLng],
        [dropoffLat, dropoffLng],
      ])
      mapInstance.fitBounds(bounds, { padding: [50, 50] })
    } else {
      // Center on pickup only
      mapInstance.setView([pickupLat, pickupLng], 14)
    }

    setMap(mapInstance)

    return () => {
      mapInstance.remove()
    }
  }, [pickupLat, pickupLng, dropoffLat, dropoffLng, pickupAddress, dropoffAddress])

  return (
    <div id="map" style={{ width: '100%', height: '100%', borderRadius: '12px' }} />
  )
}
