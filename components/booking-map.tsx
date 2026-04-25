"use client"

import { useState, useEffect, useRef, useCallback } from "react"
import { MapPin, Navigation, Loader2, X, Locate } from "lucide-react"
import { loadGoogleMaps } from "@/lib/google-maps-loader"

interface BookingMapProps {
  pickup?: { lat: number; lng: number } | null
  dropoff?: { lat: number; lng: number } | null
  onPickupSelect?: (lat: number, lng: number, address?: string) => void
  onDropoffSelect?: (lat: number, lng: number, address?: string) => void
  height?: string
}

const DEFAULT_CENTER = { lat: 38.8339, lng: -104.8214 }

export default function BookingMap({
  pickup,
  dropoff,
  onPickupSelect,
  onDropoffSelect,
  height = "400px",
}: BookingMapProps) {
  const mapRef = useRef<HTMLDivElement>(null)
  const mapInstanceRef = useRef<google.maps.Map | null>(null)
  const pickupMarkerRef = useRef<google.maps.Marker | null>(null)
  const dropoffMarkerRef = useRef<google.maps.Marker | null>(null)
  const [pickupAddress, setPickupAddress] = useState("")
  const [dropoffAddress, setDropoffAddress] = useState("")
  const [pickupCoords, setPickupCoords] = useState<{ lat: number; lng: number } | null>(pickup || null)
  const [dropoffCoords, setDropoffCoords] = useState<{ lat: number; lng: number } | null>(dropoff || null)
  const [pickupSuggestions, setPickupSuggestions] = useState<any[]>([])
  const [dropoffSuggestions, setDropoffSuggestions] = useState<any[]>([])
  const [activeField, setActiveField] = useState<"pickup" | "dropoff" | null>(null)
  const [isLocating, setIsLocating] = useState(false)

  const debounceRef = useRef<NodeJS.Timeout | null>(null)

  // Initialize map
  useEffect(() => {
    const initMap = async () => {
      try {
        await loadGoogleMaps()

        if (!mapRef.current || !window.google?.maps) {
          console.error("[v0] Google Maps not available")
          return
        }

        const center = pickupCoords || DEFAULT_CENTER

        const map = new window.google.maps.Map(mapRef.current, {
          center,
          zoom: 15,
          disableDefaultUI: false,
          zoomControl: true,
          fullscreenControl: false,
        })

        mapInstanceRef.current = map

        // Add pickup marker
        pickupMarkerRef.current = new window.google.maps.Marker({
          position: center,
          map,
          title: "Pickup",
          icon: "http://maps.google.com/mapfiles/ms/icons/green-dot.png",
        })

        // Add dropoff marker if provided
        if (dropoffCoords) {
          dropoffMarkerRef.current = new window.google.maps.Marker({
            position: dropoffCoords,
            map,
            title: "Dropoff",
            icon: "http://maps.google.com/mapfiles/ms/icons/red-dot.png",
          })

          // Draw line
          new window.google.maps.Polyline({
            path: [center, dropoffCoords],
            geodesic: true,
            strokeColor: "#4285F4",
            strokeOpacity: 0.7,
            strokeWeight: 3,
            map,
          })

          // Fit bounds
          const bounds = new window.google.maps.LatLngBounds()
          bounds.extend(center)
          bounds.extend(dropoffCoords)
          map.fitBounds(bounds)
        }
      } catch (error) {
        console.error("[v0] Map initialization error:", error)
      }
    }

    initMap()
  }, [pickupCoords, dropoffCoords])

  // Get user location on load
  useEffect(() => {
    if (navigator.geolocation && !pickupCoords) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          const coords = { lat: pos.coords.latitude, lng: pos.coords.longitude }
          setPickupCoords(coords)
          onPickupSelect?.(coords.lat, coords.lng, "Current Location")
        },
        () => {
          setPickupCoords(DEFAULT_CENTER)
        }
      )
    }
  }, [])

  // Search addresses
  const handleSearch = useCallback((query: string, field: "pickup" | "dropoff") => {
    if (query.length < 2) {
      if (field === "pickup") setPickupSuggestions([])
      else setDropoffSuggestions([])
      return
    }

    if (debounceRef.current) clearTimeout(debounceRef.current)

    debounceRef.current = setTimeout(async () => {
      try {
        await loadGoogleMaps()
        if (!window.google?.maps) return

        const service = new window.google.maps.places.AutocompleteService()
        service.getPlacePredictions(
          { input: query, componentRestrictions: { country: "us" } },
          (predictions, status) => {
            if (status === "OK" && predictions) {
              if (field === "pickup") setPickupSuggestions(predictions)
              else setDropoffSuggestions(predictions)
            }
          }
        )
      } catch (error) {
        console.error("[v0] Search error:", error)
      }
    }, 300)
  }, [])

  // Select suggestion
  const handleSelectSuggestion = async (prediction: any, field: "pickup" | "dropoff") => {
    try {
      await loadGoogleMaps()
      if (!window.google?.maps || !mapInstanceRef.current) return

      const service = new window.google.maps.places.PlacesService(mapInstanceRef.current)
      service.getDetails(
        { placeId: prediction.place_id, fields: ["geometry", "formatted_address"] },
        (place, status) => {
          if (status === "OK" && place?.geometry?.location) {
            const coords = {
              lat: place.geometry.location.lat(),
              lng: place.geometry.location.lng(),
            }
            const address = place.formatted_address || ""

            if (field === "pickup") {
              setPickupAddress(address)
              setPickupCoords(coords)
              setPickupSuggestions([])
              onPickupSelect?.(coords.lat, coords.lng, address)
              pickupMarkerRef.current?.setPosition(coords)
              mapInstanceRef.current?.panTo(coords)
            } else {
              setDropoffAddress(address)
              setDropoffCoords(coords)
              setDropoffSuggestions([])
              onDropoffSelect?.(coords.lat, coords.lng, address)

              if (dropoffMarkerRef.current) {
                dropoffMarkerRef.current.setPosition(coords)
              } else {
                dropoffMarkerRef.current = new window.google.maps.Marker({
                  position: coords,
                  map: mapInstanceRef.current,
                  title: "Dropoff",
                  icon: "http://maps.google.com/mapfiles/ms/icons/red-dot.png",
                })
              }
            }

            setActiveField(null)
          }
        }
      )
    } catch (error) {
      console.error("[v0] Selection error:", error)
    }
  }

  const handleLocateMe = async () => {
    if (!navigator.geolocation) return
    setIsLocating(true)

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const coords = { lat: pos.coords.latitude, lng: pos.coords.longitude }
        setPickupCoords(coords)
        setPickupAddress("Current Location")
        onPickupSelect?.(coords.lat, coords.lng, "Current Location")
        setIsLocating(false)
      },
      () => setIsLocating(false)
    )
  }

  return (
    <div className="space-y-4">
      {/* Pickup Input */}
      <div className="relative">
        <div className="flex items-center gap-2 p-3 bg-white border border-gray-200 rounded-lg focus-within:border-lime-500">
          <div className="w-3 h-3 bg-lime-500 rounded-full" />
          <input
            type="text"
            placeholder="Pickup location"
            value={pickupAddress}
            onChange={(e) => {
              setPickupAddress(e.target.value)
              handleSearch(e.target.value, "pickup")
            }}
            onFocus={() => setActiveField("pickup")}
            className="flex-1 bg-transparent outline-none text-sm"
          />
          {pickupAddress && (
            <button onClick={() => setPickupAddress("")}>
              <X className="w-4 h-4 text-gray-400" />
            </button>
          )}
        </div>
        {activeField === "pickup" && pickupSuggestions.length > 0 && (
          <div className="absolute z-50 top-full left-0 right-0 mt-1 bg-white border rounded-lg shadow-lg max-h-48 overflow-y-auto">
            {pickupSuggestions.map((s, i) => (
              <button
                key={i}
                onClick={() => handleSelectSuggestion(s, "pickup")}
                className="w-full flex items-center gap-2 p-3 hover:bg-gray-50 text-left text-sm border-b last:border-0"
              >
                <MapPin className="w-4 h-4 text-gray-400" />
                <div>
                  <div className="font-medium">{s.structured_formatting.main_text}</div>
                  <div className="text-xs text-gray-500">{s.structured_formatting.secondary_text}</div>
                </div>
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Dropoff Input */}
      <div className="relative">
        <div className="flex items-center gap-2 p-3 bg-white border border-gray-200 rounded-lg focus-within:border-red-500">
          <div className="w-3 h-3 bg-red-500 rounded-full" />
          <input
            type="text"
            placeholder="Dropoff location"
            value={dropoffAddress}
            onChange={(e) => {
              setDropoffAddress(e.target.value)
              handleSearch(e.target.value, "dropoff")
            }}
            onFocus={() => setActiveField("dropoff")}
            className="flex-1 bg-transparent outline-none text-sm"
          />
          {dropoffAddress && (
            <button onClick={() => setDropoffAddress("")}>
              <X className="w-4 h-4 text-gray-400" />
            </button>
          )}
        </div>
        {activeField === "dropoff" && dropoffSuggestions.length > 0 && (
          <div className="absolute z-50 top-full left-0 right-0 mt-1 bg-white border rounded-lg shadow-lg max-h-48 overflow-y-auto">
            {dropoffSuggestions.map((s, i) => (
              <button
                key={i}
                onClick={() => handleSelectSuggestion(s, "dropoff")}
                className="w-full flex items-center gap-2 p-3 hover:bg-gray-50 text-left text-sm border-b last:border-0"
              >
                <MapPin className="w-4 h-4 text-gray-400" />
                <div>
                  <div className="font-medium">{s.structured_formatting.main_text}</div>
                  <div className="text-xs text-gray-500">{s.structured_formatting.secondary_text}</div>
                </div>
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Locate Button */}
      <button
        onClick={handleLocateMe}
        disabled={isLocating}
        className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg font-medium disabled:opacity-50"
      >
        {isLocating ? (
          <>
            <Loader2 className="w-4 h-4 animate-spin" />
            Getting location...
          </>
        ) : (
          <>
            <Locate className="w-4 h-4" />
            Use my location
          </>
        )}
      </button>

      {/* Map */}
      <div style={{ height }} className="rounded-lg overflow-hidden border border-gray-200">
        <div ref={mapRef} style={{ width: "100%", height: "100%" }} />
      </div>
    </div>
  )
}
