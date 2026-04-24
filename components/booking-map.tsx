"use client"

import { useEffect, useRef, useState } from "react"
import { Plus, Minus, MapPin, Clock, Navigation } from "lucide-react"
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

// Professional map styling (similar to Uber/Google Maps)
const MAP_STYLES: google.maps.MapTypeStyle[] = [
  { elementType: "geometry", stylers: [{ color: "#f5f5f5" }] },
  { elementType: "labels.icon", stylers: [{ visibility: "on" }] },
  { elementType: "labels.text.fill", stylers: [{ color: "#616161" }] },
  { elementType: "labels.text.stroke", stylers: [{ color: "#f5f5f5" }] },
  { featureType: "administrative.country", elementType: "geometry.stroke", stylers: [{ color: "#cccccc" }] },
  { featureType: "poi", elementType: "geometry", stylers: [{ color: "#eeeeee" }] },
  { featureType: "poi", elementType: "labels.text.fill", stylers: [{ color: "#757575" }] },
  { featureType: "poi.business", elementType: "geometry", stylers: [{ color: "#eeeeee" }] },
  { featureType: "poi.park", elementType: "geometry", stylers: [{ color: "#c8e6c9" }] },
  { featureType: "road", elementType: "geometry", stylers: [{ color: "#ffffff" }] },
  { featureType: "road", elementType: "geometry.stroke", stylers: [{ color: "#e0e0e0" }] },
  { featureType: "road.arterial", elementType: "geometry", stylers: [{ color: "#fafafa" }] },
  { featureType: "road.highway", elementType: "geometry", stylers: [{ color: "#f9c5a9" }] },
  { featureType: "road.highway", elementType: "geometry.stroke", stylers: [{ color: "#e26d55" }] },
  { featureType: "road.highway", elementType: "labels.text.fill", stylers: [{ color: "#616161" }] },
  { featureType: "road.local", elementType: "labels.text.fill", stylers: [{ color: "#9e9e9e" }] },
  { featureType: "transit.line", elementType: "geometry", stylers: [{ color: "#e5e5e5" }] },
  { featureType: "transit.station", elementType: "geometry", stylers: [{ color: "#eeeeee" }] },
  { featureType: "water", elementType: "geometry", stylers: [{ color: "#c9c9c9" }] },
  { featureType: "water", elementType: "labels.text.fill", stylers: [{ color: "#9e9e9e" }] },
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
    script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=places,geometry&v=weekly`
    script.async = true
    script.defer = true
    
    script.onload = () => {
      scriptLoaded = true
      resolve()
    }
    
    script.onerror = () => {
      scriptLoading = null
      reject(new Error("Failed to load Google Maps API - check that Maps JavaScript API is enabled in Google Cloud Console"))
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
  const pickupMarkerRef = useRef<google.maps.Marker | null>(null)
  const dropoffMarkerRef = useRef<google.maps.Marker | null>(null)
  const geocoderRef = useRef<google.maps.Geocoder | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [selectedMode, setSelectedMode] = useState<"pickup" | "dropoff" | null>(null)
  const [searchInput, setSearchInput] = useState("")

  // Initialize map
  useEffect(() => {
    async function initializeMap() {
      try {
        setLoading(true)
        await loadGoogleMapsScript()

        if (!mapRef.current) return

        // Create map instance
        const map = new google.maps.Map(mapRef.current, {
          center: DEFAULT_CENTER,
          zoom: 14,
          styles: MAP_STYLES,
          disableDefaultUI: false,
          zoomControl: true,
          mapTypeControl: false,
          fullscreenControl: true,
          streetViewControl: true,
          rotateControl: false,
          scaleControl: true,
          zoomControlOptions: {
            position: google.maps.ControlPosition.RIGHT_BOTTOM,
          },
        })

        mapInstanceRef.current = map
        geocoderRef.current = new google.maps.Geocoder()

        // Try to get user's current location
        if (navigator.geolocation) {
          navigator.geolocation.getCurrentPosition(
            (position) => {
              const userLocation = {
                lat: position.coords.latitude,
                lng: position.coords.longitude,
              }
              map.setCenter(userLocation)
            },
            (error) => {
              console.log("[v0] Geolocation error:", error.message)
            }
          )
        }

        // Map click handler for location selection
        map.addListener("click", (e: google.maps.MapMouseEvent) => {
          if (selectedMode && e.latLng) {
            const lat = e.latLng.lat()
            const lng = e.latLng.lng()

            // Reverse geocode to get address
            if (geocoderRef.current) {
              geocoderRef.current.geocode(
                { location: { lat, lng } },
                (results, status) => {
                  if (status === google.maps.GeocoderStatus.OK && results?.[0]) {
                    const address = results[0].formatted_address
                    if (selectedMode === "pickup") {
                      onPickupSelect?.(lat, lng, address)
                      updatePickupMarker(lat, lng)
                    } else {
                      onDropoffSelect?.(lat, lng, address)
                      updateDropoffMarker(lat, lng)
                    }
                  }
                }
              )
            }
          }
        })

        setLoading(false)
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load Google Maps")
        setLoading(false)
      }
    }

    initializeMap()
  }, [onPickupSelect, onDropoffSelect])

  // Update pickup marker
  const updatePickupMarker = (lat: number, lng: number) => {
    if (!mapInstanceRef.current) return

    if (pickupMarkerRef.current) {
      pickupMarkerRef.current.setMap(null)
    }

    pickupMarkerRef.current = new google.maps.Marker({
      position: { lat, lng },
      map: mapInstanceRef.current,
      title: "Pickup Location",
      icon: {
        path: google.maps.SymbolPath.CIRCLE,
        scale: 10,
        fillColor: "#22c55e",
        fillOpacity: 1,
        strokeColor: "#ffffff",
        strokeWeight: 3,
      },
    })

    mapInstanceRef.current.panTo({ lat, lng })
  }

  // Update dropoff marker
  const updateDropoffMarker = (lat: number, lng: number) => {
    if (!mapInstanceRef.current) return

    if (dropoffMarkerRef.current) {
      dropoffMarkerRef.current.setMap(null)
    }

    dropoffMarkerRef.current = new google.maps.Marker({
      position: { lat, lng },
      map: mapInstanceRef.current,
      title: "Dropoff Location",
      icon: {
        path: google.maps.SymbolPath.CIRCLE,
        scale: 10,
        fillColor: "#ef4444",
        fillOpacity: 1,
        strokeColor: "#ffffff",
        strokeWeight: 3,
      },
    })

    mapInstanceRef.current.panTo({ lat, lng })
  }

  // Update markers when props change
  useEffect(() => {
    if (pickup) {
      updatePickupMarker(pickup.lat, pickup.lng)
    }
  }, [pickup])

  useEffect(() => {
    if (dropoff) {
      updateDropoffMarker(dropoff.lat, dropoff.lng)
    }
  }, [dropoff])

  // Search handler
  const handleSearch = async (query: string, type: "pickup" | "dropoff") => {
    if (!query || !geocoderRef.current || !mapInstanceRef.current) return

    try {
      const results = await new Promise<google.maps.GeocoderResult[]>((resolve, reject) => {
        geocoderRef.current!.geocode({ address: query }, (results, status) => {
          if (status === google.maps.GeocoderStatus.OK && results) {
            resolve(results)
          } else {
            reject(new Error("Address not found"))
          }
        })
      })

      if (results[0]?.geometry?.location) {
        const location = results[0].geometry.location
        const lat = location.lat()
        const lng = location.lng()
        const address = results[0].formatted_address

        if (type === "pickup") {
          onPickupSelect?.(lat, lng, address)
          updatePickupMarker(lat, lng)
        } else {
          onDropoffSelect?.(lat, lng, address)
          updateDropoffMarker(lat, lng)
        }

        mapInstanceRef.current.fitBounds(results[0].geometry.bounds!)
      }
    } catch (err) {
      console.error("[v0] Search error:", err)
    }
  }

  if (error) {
    return (
      <div className={`w-full flex items-center justify-center bg-gray-100 rounded-lg`} style={{ height }}>
        <div className="text-center p-8">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Map Failed to Load</h3>
          <p className="text-gray-600 mb-4">{error}</p>
          <p className="text-sm text-gray-500">Please ensure the Google Maps API is properly configured in your Google Cloud Console.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="w-full flex flex-col" style={{ height }}>
      {/* Search Bar */}
      <div className="bg-white border-b border-gray-200 p-4 shadow-sm">
        <div className="flex gap-2">
          <div className="flex-1 flex gap-2">
            <div className="flex-1">
              <Input
                type="text"
                placeholder="Search pickup location..."
                value={selectedMode === "pickup" ? searchInput : ""}
                onChange={(e) => setSearchInput(e.target.value)}
                onKeyPress={(e) => {
                  if (e.key === "Enter" && selectedMode === "pickup") {
                    handleSearch(searchInput, "pickup")
                  }
                }}
                className="w-full"
              />
            </div>
            <Button
              size="sm"
              onClick={() => {
                setSelectedMode("pickup")
                if (searchInput) handleSearch(searchInput, "pickup")
              }}
              variant={selectedMode === "pickup" ? "default" : "outline"}
              className="gap-2"
            >
              <MapPin className="w-4 h-4" />
              Pickup
            </Button>
          </div>
          <div className="flex-1 flex gap-2">
            <div className="flex-1">
              <Input
                type="text"
                placeholder="Search dropoff location..."
                value={selectedMode === "dropoff" ? searchInput : ""}
                onChange={(e) => setSearchInput(e.target.value)}
                onKeyPress={(e) => {
                  if (e.key === "Enter" && selectedMode === "dropoff") {
                    handleSearch(searchInput, "dropoff")
                  }
                }}
                className="w-full"
              />
            </div>
            <Button
              size="sm"
              onClick={() => {
                setSelectedMode("dropoff")
                if (searchInput) handleSearch(searchInput, "dropoff")
              }}
              variant={selectedMode === "dropoff" ? "default" : "outline"}
              className="gap-2"
            >
              <Navigation className="w-4 h-4" />
              Dropoff
            </Button>
          </div>
        </div>
        <p className="text-xs text-gray-500 mt-2">
          {selectedMode 
            ? `Click on the map to set ${selectedMode} location`
            : "Select pickup or dropoff mode to use map selection"
          }
        </p>
      </div>

      {/* Map Container */}
      <div className="flex-1 relative bg-gray-100">
        <div ref={mapRef} className="w-full h-full" />
        
        {loading && (
          <div className="absolute inset-0 bg-white/50 flex items-center justify-center">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto mb-4" />
              <p className="text-gray-600">Loading map...</p>
            </div>
          </div>
        )}

        {/* Map Attribution */}
        <div className="absolute bottom-4 right-4 bg-white/95 px-3 py-1.5 rounded text-xs text-gray-600 shadow-sm">
          GlideWay Maps
        </div>
      </div>
    </div>
  )
}
