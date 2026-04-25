"use client"

import { useState, useEffect, useCallback, useRef } from "react"
import { MapPin, Navigation, Loader2, X, Locate } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import dynamic from "next/dynamic"
import { searchAddresses, reverseGeocode, calculateDistance } from "@/lib/map-utils"

// Dynamic import to avoid SSR issues
const LeafletMapInner = dynamic(() => import("./leaflet-map-inner"), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full bg-gray-100 animate-pulse flex items-center justify-center">
      <Loader2 className="w-8 h-8 animate-spin text-gray-400" />
    </div>
  ),
})

interface BookingMapProps {
  pickup?: { lat: number; lng: number } | null
  dropoff?: { lat: number; lng: number } | null
  onPickupSelect?: (lat: number, lng: number, address?: string) => void
  onDropoffSelect?: (lat: number, lng: number, address?: string) => void
  height?: string
}

// Default to Colorado Springs
const DEFAULT_CENTER = { lat: 38.8339, lng: -104.8214 }

export default function BookingMap({
  pickup,
  dropoff,
  onPickupSelect,
  onDropoffSelect,
  height = "400px",
}: BookingMapProps) {
  const [pickupAddress, setPickupAddress] = useState("")
  const [dropoffAddress, setDropoffAddress] = useState("")
  const [pickupCoords, setPickupCoords] = useState<{ lat: number; lng: number } | null>(pickup || null)
  const [dropoffCoords, setDropoffCoords] = useState<{ lat: number; lng: number } | null>(dropoff || null)
  const [pickupSuggestions, setPickupSuggestions] = useState<Array<{ address: string; lat: number; lng: number }>>([])
  const [dropoffSuggestions, setDropoffSuggestions] = useState<Array<{ address: string; lat: number; lng: number }>>([])
  const [activeField, setActiveField] = useState<"pickup" | "dropoff" | null>(null)
  const [isLocating, setIsLocating] = useState(false)
  const [distance, setDistance] = useState<number | null>(null)

  const debounceRef = useRef<NodeJS.Timeout | null>(null)

  // Get initial location
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        async (pos) => {
          const coords = { lat: pos.coords.latitude, lng: pos.coords.longitude }
          setPickupCoords(coords)
          const address = await reverseGeocode(coords.lat, coords.lng)
          setPickupAddress(address)
          onPickupSelect?.(coords.lat, coords.lng, address)
        },
        () => {
          setPickupCoords(DEFAULT_CENTER)
        }
      )
    }
  }, [])

  // Calculate distance
  useEffect(() => {
    if (pickupCoords && dropoffCoords) {
      const dist = calculateDistance(pickupCoords.lat, pickupCoords.lng, dropoffCoords.lat, dropoffCoords.lng)
      setDistance(dist)
    }
  }, [pickupCoords, dropoffCoords])

  // Search addresses
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

  // Select suggestion
  const handleSelectSuggestion = (suggestion: { address: string; lat: number; lng: number }, field: "pickup" | "dropoff") => {
    if (field === "pickup") {
      setPickupAddress(suggestion.address)
      setPickupCoords({ lat: suggestion.lat, lng: suggestion.lng })
      setPickupSuggestions([])
      onPickupSelect?.(suggestion.lat, suggestion.lng, suggestion.address)
    } else {
      setDropoffAddress(suggestion.address)
      setDropoffCoords({ lat: suggestion.lat, lng: suggestion.lng })
      setDropoffSuggestions([])
      onDropoffSelect?.(suggestion.lat, suggestion.lng, suggestion.address)
    }
    setActiveField(null)
  }

  // Locate me
  const handleLocateMe = async () => {
    if (!navigator.geolocation) return
    setIsLocating(true)
    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const coords = { lat: pos.coords.latitude, lng: pos.coords.longitude }
        const address = await reverseGeocode(coords.lat, coords.lng)
        setPickupAddress(address)
        setPickupCoords(coords)
        onPickupSelect?.(coords.lat, coords.lng, address)
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
            <button onClick={() => { setPickupAddress(""); setPickupCoords(null); setPickupSuggestions([]) }}>
              <X className="w-4 h-4 text-gray-400" />
            </button>
          )}
        </div>
        {activeField === "pickup" && pickupSuggestions.length > 0 && (
          <div className="absolute z-50 top-full left-0 right-0 mt-1 bg-white border rounded-lg shadow-lg max-h-48 overflow-y-auto">
            {pickupSuggestions.map((s, i) => (
              <button key={i} onClick={() => handleSelectSuggestion(s, "pickup")} className="w-full flex items-center gap-2 p-3 hover:bg-gray-50 text-left text-sm">
                <MapPin className="w-4 h-4 text-gray-400" />
                <span className="truncate">{s.address}</span>
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
            <button onClick={() => { setDropoffAddress(""); setDropoffCoords(null); setDropoffSuggestions([]) }}>
              <X className="w-4 h-4 text-gray-400" />
            </button>
          )}
        </div>
        {activeField === "dropoff" && dropoffSuggestions.length > 0 && (
          <div className="absolute z-50 top-full left-0 right-0 mt-1 bg-white border rounded-lg shadow-lg max-h-48 overflow-y-auto">
            {dropoffSuggestions.map((s, i) => (
              <button key={i} onClick={() => handleSelectSuggestion(s, "dropoff")} className="w-full flex items-center gap-2 p-3 hover:bg-gray-50 text-left text-sm">
                <MapPin className="w-4 h-4 text-gray-400" />
                <span className="truncate">{s.address}</span>
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Locate Button */}
      <Button onClick={handleLocateMe} disabled={isLocating} variant="outline" className="w-full">
        <Locate className="w-4 h-4 mr-2" />
        {isLocating ? "Getting location..." : "Use my location"}
      </Button>

      {/* Distance */}
      {distance && (
        <div className="flex items-center justify-center gap-2 p-2 bg-lime-50 border border-lime-200 rounded-lg">
          <Navigation className="w-4 h-4 text-lime-600" />
          <span className="text-sm font-medium text-lime-700">{distance.toFixed(1)} miles</span>
        </div>
      )}

      {/* Map */}
      <div style={{ height }} className="rounded-lg overflow-hidden border">
        <LeafletMapInner
          pickupLat={pickupCoords?.lat || DEFAULT_CENTER.lat}
          pickupLng={pickupCoords?.lng || DEFAULT_CENTER.lng}
          dropoffLat={dropoffCoords?.lat}
          dropoffLng={dropoffCoords?.lng}
          pickupAddress={pickupAddress}
          dropoffAddress={dropoffAddress}
        />
      </div>
    </div>
  )
}
