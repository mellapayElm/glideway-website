"use client"

import { useState, useEffect, useRef, useCallback } from "react"
import { MapPin, Navigation, Loader2, X, Locate } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
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
  const directionsRendererRef = useRef<google.maps.DirectionsRenderer | null>(null)
  const placesServiceRef = useRef<google.maps.places.PlacesService | null>(null)
  const autocompleteRef = useRef<google.maps.places.AutocompleteService | null>(null)

  const [pickupAddress, setPickupAddress] = useState("")
  const [dropoffAddress, setDropoffAddress] = useState("")
  const [pickupCoords, setPickupCoords] = useState<{ lat: number; lng: number } | null>(pickup || null)
  const [dropoffCoords, setDropoffCoords] = useState<{ lat: number; lng: number } | null>(dropoff || null)
  const [pickupSuggestions, setPickupSuggestions] = useState<any[]>([])
  const [dropoffSuggestions, setDropoffSuggestions] = useState<any[]>([])
  const [activeField, setActiveField] = useState<"pickup" | "dropoff" | null>(null)
  const [isLocating, setIsLocating] = useState(false)
  const [distance, setDistance] = useState<number | null>(null)

  const debounceRef = useRef<NodeJS.Timeout | null>(null)

  // Initialize map
  useEffect(() => {
    const initMap = async () => {
      try {
        await loadGoogleMaps()

        if (!mapRef.current || !window.google?.maps) return

        const center = pickupCoords || DEFAULT_CENTER

        const map = new window.google.maps.Map(mapRef.current, {
          center,
          zoom: 15,
          disableDefaultUI: false,
          zoomControl: true,
          fullscreenControl: false,
          mapTypeControl: false,
          styles: [
            { elementType: "geometry", stylers: [{ color: "#f5f5f5" }] },
            { elementType: "labels.text.fill", stylers: [{ color: "#616161" }] },
            { featureType: "road", elementType: "geometry", stylers: [{ color: "#ffffff" }] },
            { featureType: "water", elementType: "geometry", stylers: [{ color: "#c9c9c9" }] },
          ],
        })

        mapInstanceRef.current = map
        placesServiceRef.current = new window.google.maps.places.PlacesService(map)
        autocompleteRef.current = new window.google.maps.places.AutocompleteService()

        // Initialize directions renderer
        directionsRendererRef.current = new window.google.maps.DirectionsRenderer({
          map,
          suppressMarkers: true,
          polylineOptions: {
            strokeColor: "#FF9E1B",
            strokeWeight: 5,
          },
        })

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

          // Draw route
          drawRoute(center, dropoffCoords)

          // Fit bounds
          const bounds = new window.google.maps.LatLngBounds()
          bounds.extend(center)
          bounds.extend(dropoffCoords)
          map.fitBounds(bounds, { top: 100, bottom: 100, left: 50, right: 50 })
        }
      } catch (error) {
        console.error("[v0] Failed to initialize map:", error)
      }
    }

    initMap()
  }, [pickupCoords, dropoffCoords])

  // Get initial location
  useEffect(() => {
    if (navigator.geolocation && !pickupCoords) {
      navigator.geolocation.getCurrentPosition(
        async (pos) => {
          const coords = { lat: pos.coords.latitude, lng: pos.coords.longitude }
          setPickupCoords(coords)

          // Reverse geocode
          if (window.google?.maps) {
            const geocoder = new window.google.maps.Geocoder()
            geocoder.geocode({ location: coords }, (results, status) => {
              if (status === "OK" && results?.[0]) {
                setPickupAddress(results[0].formatted_address)
                onPickupSelect?.(coords.lat, coords.lng, results[0].formatted_address)
              }
            })
          }
        },
        () => {
          setPickupCoords(DEFAULT_CENTER)
        }
      )
    }
  }, [])

  // Calculate distance
  useEffect(() => {
    if (pickupCoords && dropoffCoords && window.google?.maps) {
      const dist = window.google.maps.geometry.spherical.computeDistanceBetween(
        new window.google.maps.LatLng(pickupCoords.lat, pickupCoords.lng),
        new window.google.maps.LatLng(dropoffCoords.lat, dropoffCoords.lng)
      )
      setDistance(dist / 1609.34) // Convert to miles
    }
  }, [pickupCoords, dropoffCoords])

  // Search addresses
  const handleSearch = useCallback((query: string, field: "pickup" | "dropoff") => {
    if (query.length < 2) {
      if (field === "pickup") setPickupSuggestions([])
      else setDropoffSuggestions([])
      return
    }

    if (debounceRef.current) clearTimeout(debounceRef.current)

    debounceRef.current = setTimeout(() => {
      if (!autocompleteRef.current) return

      autocompleteRef.current.getPlacePredictions(
        { input: query, componentRestrictions: { country: "us" } },
        (predictions, status) => {
          if (status === "OK" && predictions) {
            if (field === "pickup") setPickupSuggestions(predictions)
            else setDropoffSuggestions(predictions)
          }
        }
      )
    }, 300)
  }, [])

  // Select suggestion
  const handleSelectSuggestion = (prediction: any, field: "pickup" | "dropoff") => {
    if (!placesServiceRef.current || !mapInstanceRef.current) return

    placesServiceRef.current.getDetails(
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

            if (dropoffCoords) {
              drawRoute(coords, dropoffCoords)
            }
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

            if (pickupCoords) {
              drawRoute(pickupCoords, coords)
            }
          }

          setActiveField(null)
        }
      }
    )
  }

  const drawRoute = (from: { lat: number; lng: number }, to: { lat: number; lng: number }) => {
    if (!directionsRendererRef.current) return

    const directionsService = new google.maps.DirectionsService()
    directionsService.route(
      {
        origin: new google.maps.LatLng(from.lat, from.lng),
        destination: new google.maps.LatLng(to.lat, to.lng),
        travelMode: google.maps.TravelMode.DRIVING,
      },
      (result, status) => {
        if (status === "OK" && result) {
          directionsRendererRef.current?.setDirections(result)
        }
      }
    )
  }

  // Locate me
  const handleLocateMe = async () => {
    if (!navigator.geolocation) return
    setIsLocating(true)
    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const coords = { lat: pos.coords.latitude, lng: pos.coords.longitude }
        setPickupCoords(coords)

        if (window.google?.maps) {
          const geocoder = new window.google.maps.Geocoder()
          geocoder.geocode({ location: coords }, (results, status) => {
            if (status === "OK" && results?.[0]) {
              const address = results[0].formatted_address
              setPickupAddress(address)
              onPickupSelect?.(coords.lat, coords.lng, address)
            }
          })
        }

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
            <button
              onClick={() => {
                setPickupAddress("")
                setPickupCoords(null)
                setPickupSuggestions([])
              }}
            >
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
            <button
              onClick={() => {
                setDropoffAddress("")
                setDropoffCoords(null)
                setDropoffSuggestions([])
              }}
            >
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
      <div style={{ height }} className="rounded-lg overflow-hidden border border-gray-200">
        <div ref={mapRef} style={{ width: "100%", height: "100%" }} />
      </div>
    </div>
  )
}
