"use client"

import { useState, useEffect, useRef, useCallback } from "react"
import { MapPin, Locate, X, Search, Navigation } from "lucide-react"
import { Button } from "@/components/ui/button"
import dynamic from "next/dynamic"
import { searchAddresses, reverseGeocode, calculateDistance } from "@/lib/map-utils"

// Dynamic import to avoid SSR issues
const LeafletMapInner = dynamic(() => import("./leaflet-map-inner"), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full bg-gray-100 animate-pulse flex items-center justify-center">
      <span className="text-gray-500">Loading map...</span>
    </div>
  ),
})

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

export function BookingMapPanel({
  pickup,
  dropoff,
  onPickupChange,
  onDropoffChange,
  className = "",
  height = "500px",
}: BookingMapPanelProps) {
  const [pickupValue, setPickupValue] = useState(pickup || "")
  const [dropoffValue, setDropoffValue] = useState(dropoff || "")
  const [pickupCoords, setPickupCoords] = useState<LatLng | null>(null)
  const [dropoffCoords, setDropoffCoords] = useState<LatLng | null>(null)
  const [isLocating, setIsLocating] = useState(false)
  const [pickupSuggestions, setPickupSuggestions] = useState<Array<{ address: string; lat: number; lng: number }>>([])
  const [dropoffSuggestions, setDropoffSuggestions] = useState<Array<{ address: string; lat: number; lng: number }>>([])
  const [activeField, setActiveField] = useState<"pickup" | "dropoff" | null>(null)
  const [distance, setDistance] = useState<number | null>(null)

  const debounceRef = useRef<NodeJS.Timeout | null>(null)

  // Get initial user location
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        async (pos) => {
          const coords = { lat: pos.coords.latitude, lng: pos.coords.longitude }
          setPickupCoords(coords)
          const address = await reverseGeocode(coords.lat, coords.lng)
          setPickupValue(address)
          onPickupChange?.(address, coords)
        },
        () => {
          setPickupCoords(DEFAULT_CENTER)
        }
      )
    }
  }, [])

  // Calculate distance when both locations are set
  useEffect(() => {
    if (pickupCoords && dropoffCoords) {
      const dist = calculateDistance(pickupCoords.lat, pickupCoords.lng, dropoffCoords.lat, dropoffCoords.lng)
      setDistance(dist)
    } else {
      setDistance(null)
    }
  }, [pickupCoords, dropoffCoords])

  // Search for addresses
  const handleSearch = useCallback(async (query: string, field: "pickup" | "dropoff") => {
    if (query.length < 2) {
      if (field === "pickup") setPickupSuggestions([])
      else setDropoffSuggestions([])
      return
    }

    if (debounceRef.current) clearTimeout(debounceRef.current)

    debounceRef.current = setTimeout(async () => {
      const results = await searchAddresses(query)
      if (field === "pickup") setPickupSuggestions(results)
      else setDropoffSuggestions(results)
    }, 300)
  }, [])

  // Handle suggestion selection
  const handleSelectSuggestion = (suggestion: { address: string; lat: number; lng: number }, field: "pickup" | "dropoff") => {
    const coords = { lat: suggestion.lat, lng: suggestion.lng }
    if (field === "pickup") {
      setPickupValue(suggestion.address)
      setPickupCoords(coords)
      setPickupSuggestions([])
      onPickupChange?.(suggestion.address, coords)
    } else {
      setDropoffValue(suggestion.address)
      setDropoffCoords(coords)
      setDropoffSuggestions([])
      onDropoffChange?.(suggestion.address, coords)
    }
    setActiveField(null)
  }

  // Handle locate me
  const handleLocateMe = async () => {
    if (!navigator.geolocation) return

    setIsLocating(true)
    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const coords = { lat: pos.coords.latitude, lng: pos.coords.longitude }
        const address = await reverseGeocode(coords.lat, coords.lng)
        setPickupValue(address)
        setPickupCoords(coords)
        onPickupChange?.(address, coords)
        setIsLocating(false)
      },
      () => {
        setIsLocating(false)
      }
    )
  }

  return (
    <div className={`flex flex-col gap-4 ${className}`}>
      {/* Inputs */}
      <div className="space-y-3">
        {/* Pickup Input */}
        <div className="relative">
          <div className="flex items-center gap-2 p-3 bg-white border border-gray-200 rounded-lg focus-within:border-lime-500 focus-within:ring-1 focus-within:ring-lime-500">
            <div className="w-3 h-3 bg-lime-500 rounded-full flex-shrink-0" />
            <input
              type="text"
              placeholder="Enter pickup location"
              value={pickupValue}
              onChange={(e) => {
                setPickupValue(e.target.value)
                handleSearch(e.target.value, "pickup")
              }}
              onFocus={() => setActiveField("pickup")}
              className="flex-1 bg-transparent outline-none text-sm"
            />
            {pickupValue && (
              <button
                onClick={() => {
                  setPickupValue("")
                  setPickupCoords(null)
                  setPickupSuggestions([])
                  onPickupChange?.("")
                }}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
          {/* Pickup Suggestions */}
          {activeField === "pickup" && pickupSuggestions.length > 0 && (
            <div className="absolute z-50 top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg max-h-60 overflow-y-auto">
              {pickupSuggestions.map((suggestion, idx) => (
                <button
                  key={idx}
                  onClick={() => handleSelectSuggestion(suggestion, "pickup")}
                  className="w-full flex items-center gap-3 p-3 hover:bg-gray-50 text-left"
                >
                  <MapPin className="w-4 h-4 text-gray-400 flex-shrink-0" />
                  <span className="text-sm truncate">{suggestion.address}</span>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Dropoff Input */}
        <div className="relative">
          <div className="flex items-center gap-2 p-3 bg-white border border-gray-200 rounded-lg focus-within:border-red-500 focus-within:ring-1 focus-within:ring-red-500">
            <div className="w-3 h-3 bg-red-500 rounded-full flex-shrink-0" />
            <input
              type="text"
              placeholder="Enter dropoff location"
              value={dropoffValue}
              onChange={(e) => {
                setDropoffValue(e.target.value)
                handleSearch(e.target.value, "dropoff")
              }}
              onFocus={() => setActiveField("dropoff")}
              className="flex-1 bg-transparent outline-none text-sm"
            />
            {dropoffValue && (
              <button
                onClick={() => {
                  setDropoffValue("")
                  setDropoffCoords(null)
                  setDropoffSuggestions([])
                  onDropoffChange?.("")
                }}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
          {/* Dropoff Suggestions */}
          {activeField === "dropoff" && dropoffSuggestions.length > 0 && (
            <div className="absolute z-50 top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg max-h-60 overflow-y-auto">
              {dropoffSuggestions.map((suggestion, idx) => (
                <button
                  key={idx}
                  onClick={() => handleSelectSuggestion(suggestion, "dropoff")}
                  className="w-full flex items-center gap-3 p-3 hover:bg-gray-50 text-left"
                >
                  <MapPin className="w-4 h-4 text-gray-400 flex-shrink-0" />
                  <span className="text-sm truncate">{suggestion.address}</span>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Locate Me Button */}
        <Button onClick={handleLocateMe} disabled={isLocating} variant="outline" className="w-full">
          <Locate className="w-4 h-4 mr-2" />
          {isLocating ? "Getting location..." : "Use my location"}
        </Button>

        {/* Distance indicator */}
        {distance && (
          <div className="flex items-center justify-center gap-2 p-2 bg-lime-50 border border-lime-200 rounded-lg">
            <Navigation className="w-4 h-4 text-lime-600" />
            <span className="text-sm font-medium text-lime-700">Distance: {distance.toFixed(1)} miles</span>
          </div>
        )}
      </div>

      {/* Map */}
      <div style={{ height }} className="rounded-lg border border-gray-200 overflow-hidden">
        <LeafletMapInner
          pickupLat={pickupCoords?.lat || DEFAULT_CENTER.lat}
          pickupLng={pickupCoords?.lng || DEFAULT_CENTER.lng}
          dropoffLat={dropoffCoords?.lat}
          dropoffLng={dropoffCoords?.lng}
          pickupAddress={pickupValue || "Pickup"}
          dropoffAddress={dropoffValue || "Dropoff"}
        />
      </div>
    </div>
  )
}
