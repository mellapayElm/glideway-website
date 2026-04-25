"use client"

import { useState, useEffect, useRef, useCallback } from "react"
import { MapPin, Locate, X, Search } from "lucide-react"
import { Button } from "@/components/ui/button"
import { loadGoogleMaps } from "@/lib/google-maps-loader"

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

const DEFAULT_CENTER = { lat: 38.8339, lng: -104.8214 }

export function BookingMapPanel({
  pickup,
  dropoff,
  onPickupChange,
  onDropoffChange,
  className = "",
  height = "500px",
}: BookingMapPanelProps) {
  const mapRef = useRef<HTMLDivElement>(null)
  const mapInstanceRef = useRef<google.maps.Map | null>(null)
  const pickupMarkerRef = useRef<google.maps.Marker | null>(null)
  const dropoffMarkerRef = useRef<google.maps.Marker | null>(null)
  const directionsRendererRef = useRef<google.maps.DirectionsRenderer | null>(null)
  const geocoderRef = useRef<google.maps.Geocoder | null>(null)
  const placesServiceRef = useRef<google.maps.places.PlacesService | null>(null)
  const autocompleteRef = useRef<google.maps.places.AutocompleteService | null>(null)

  const [pickupValue, setPickupValue] = useState(pickup || "")
  const [dropoffValue, setDropoffValue] = useState(dropoff || "")
  const [pickupCoords, setPickupCoords] = useState<LatLng | null>(null)
  const [dropoffCoords, setDropoffCoords] = useState<LatLng | null>(null)
  const [isLocating, setIsLocating] = useState(false)
  const [pickupSuggestions, setPickupSuggestions] = useState<any[]>([])
  const [dropoffSuggestions, setDropoffSuggestions] = useState<any[]>([])
  const debounceRef = useRef<NodeJS.Timeout>()

  // Initialize map
  useEffect(() => {
    const initMap = async () => {
      try {
        await loadGoogleMaps()

        if (!mapRef.current || !window.google?.maps) return

        const map = new window.google.maps.Map(mapRef.current, {
          center: pickupCoords || DEFAULT_CENTER,
          zoom: 15,
          disableDefaultUI: true,
          zoomControl: true,
          styles: [
            { elementType: "geometry", stylers: [{ color: "#f5f5f5" }] },
            { elementType: "labels.text.fill", stylers: [{ color: "#616161" }] },
            { featureType: "road", elementType: "geometry", stylers: [{ color: "#ffffff" }] },
            { featureType: "water", elementType: "geometry", stylers: [{ color: "#c9c9c9" }] },
          ],
        })

        mapInstanceRef.current = map
        geocoderRef.current = new window.google.maps.Geocoder()
        placesServiceRef.current = new window.google.maps.PlacesService(map)
        autocompleteRef.current = new window.google.maps.places.AutocompleteService()
        directionsRendererRef.current = new window.google.maps.DirectionsRenderer({
          map,
          polylineOptions: { strokeColor: "#FF9E1B", strokeWeight: 5 },
          suppressMarkers: true,
        })

        // Add pickup marker
        pickupMarkerRef.current = new window.google.maps.Marker({
          position: pickupCoords || DEFAULT_CENTER,
          map,
          title: "Pickup",
          icon: "http://maps.google.com/mapfiles/ms/icons/green-dot.png",
        })

        // Get user location
        if (navigator.geolocation) {
          navigator.geolocation.getCurrentPosition((position) => {
            const userLocation = {
              lat: position.coords.latitude,
              lng: position.coords.longitude,
            }
            setPickupCoords(userLocation)
            pickupMarkerRef.current?.setPosition(userLocation)
            map.panTo(userLocation)

            // Reverse geocode
            if (geocoderRef.current) {
              geocoderRef.current.geocode({ location: userLocation }, (results, status) => {
                if (status === "OK" && results?.[0]) {
                  setPickupValue(results[0].formatted_address)
                  onPickupChange?.(results[0].formatted_address, userLocation)
                }
              })
            }
          })
        }
      } catch (error) {
        console.error("[v0] Failed to initialize map:", error)
      }
    }

    initMap()
  }, [])

  // Search for pickup location
  const searchPickup = useCallback((query: string) => {
    if (!query || query.length < 2) {
      setPickupSuggestions([])
      return
    }

    if (debounceRef.current) clearTimeout(debounceRef.current)

    debounceRef.current = setTimeout(() => {
      if (!autocompleteRef.current) return

      autocompleteRef.current.getPlacePredictions(
        { input: query, componentRestrictions: { country: "us" } },
        (predictions, status) => {
          if (status === "OK" && predictions) {
            setPickupSuggestions(predictions)
          }
        }
      )
    }, 300)
  }, [])

  // Search for dropoff location
  const searchDropoff = useCallback((query: string) => {
    if (!query || query.length < 2) {
      setDropoffSuggestions([])
      return
    }

    if (debounceRef.current) clearTimeout(debounceRef.current)

    debounceRef.current = setTimeout(() => {
      if (!autocompleteRef.current) return

      autocompleteRef.current.getPlacePredictions(
        { input: query, componentRestrictions: { country: "us" } },
        (predictions, status) => {
          if (status === "OK" && predictions) {
            setDropoffSuggestions(predictions)
          }
        }
      )
    }, 300)
  }, [])

  // Select pickup location
  const selectPickup = useCallback((prediction: any) => {
    if (!placesServiceRef.current || !mapInstanceRef.current) return

    placesServiceRef.current.getDetails(
      { placeId: prediction.place_id, fields: ["geometry", "formatted_address"] },
      (place, status) => {
        if (status === "OK" && place?.geometry?.location) {
          const coords = { lat: place.geometry.location.lat(), lng: place.geometry.location.lng() }
          setPickupCoords(coords)
          setPickupValue(place.formatted_address || "")
          setPickupSuggestions([])

          pickupMarkerRef.current?.setPosition(coords)
          mapInstanceRef.current?.panTo(coords)
          onPickupChange?.(place.formatted_address || "", coords)

          // Draw route if both coordinates exist
          if (dropoffCoords) {
            drawRoute(coords, dropoffCoords)
          }
        }
      }
    )
  }, [dropoffCoords])

  // Select dropoff location
  const selectDropoff = useCallback((prediction: any) => {
    if (!placesServiceRef.current || !mapInstanceRef.current) return

    placesServiceRef.current.getDetails(
      { placeId: prediction.place_id, fields: ["geometry", "formatted_address"] },
      (place, status) => {
        if (status === "OK" && place?.geometry?.location) {
          const coords = { lat: place.geometry.location.lat(), lng: place.geometry.location.lng() }
          setDropoffCoords(coords)
          setDropoffValue(place.formatted_address || "")
          setDropoffSuggestions([])

          // Update or create dropoff marker
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

          onDropoffChange?.(place.formatted_address || "", coords)

          // Draw route if pickup exists
          if (pickupCoords) {
            drawRoute(pickupCoords, coords)
          }
        }
      }
    )
  }, [pickupCoords])

  // Draw route between pickup and dropoff
  const drawRoute = useCallback((from: LatLng, to: LatLng) => {
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
  }, [])

  const handleUseCurrentLocation = async () => {
    if (!navigator.geolocation) return

    setIsLocating(true)
    navigator.geolocation.getCurrentPosition((position) => {
      const coords = {
        lat: position.coords.latitude,
        lng: position.coords.longitude,
      }
      setPickupCoords(coords)
      setIsLocating(false)

      if (geocoderRef.current) {
        geocoderRef.current.geocode({ location: coords }, (results, status) => {
          if (status === "OK" && results?.[0]) {
            setPickupValue(results[0].formatted_address)
            onPickupChange?.(results[0].formatted_address, coords)
          }
        })
      }

      pickupMarkerRef.current?.setPosition(coords)
      mapInstanceRef.current?.panTo(coords)
    })
  }

  return (
    <div className={`flex flex-col gap-4 ${className}`}>
      {/* Map */}
      <div ref={mapRef} style={{ height, width: "100%" }} className="rounded-lg border border-gray-200" />

      {/* Pickup Input */}
      <div className="relative">
        <div className="flex gap-2">
          <input
            type="text"
            placeholder="Enter pickup location"
            value={pickupValue}
            onChange={(e) => {
              setPickupValue(e.target.value)
              searchPickup(e.target.value)
            }}
            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg"
          />
          <Button variant="outline" size="sm" onClick={handleUseCurrentLocation} disabled={isLocating}>
            <Locate className="w-4 h-4" />
          </Button>
        </div>
        {pickupSuggestions.length > 0 && (
          <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-300 rounded-lg shadow-lg z-10">
            {pickupSuggestions.map((suggestion) => (
              <button
                key={suggestion.place_id}
                onClick={() => selectPickup(suggestion)}
                className="w-full px-4 py-2 text-left hover:bg-gray-100 border-b last:border-0 flex items-start gap-2"
              >
                <MapPin className="w-4 h-4 mt-0.5 flex-shrink-0 text-gray-500" />
                <div>
                  <div className="font-medium text-sm">{suggestion.structured_formatting.main_text}</div>
                  <div className="text-xs text-gray-500">{suggestion.structured_formatting.secondary_text}</div>
                </div>
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Dropoff Input */}
      <div className="relative">
        <input
          type="text"
          placeholder="Enter dropoff location"
          value={dropoffValue}
          onChange={(e) => {
            setDropoffValue(e.target.value)
            searchDropoff(e.target.value)
          }}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg"
        />
        {dropoffSuggestions.length > 0 && (
          <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-300 rounded-lg shadow-lg z-10">
            {dropoffSuggestions.map((suggestion) => (
              <button
                key={suggestion.place_id}
                onClick={() => selectDropoff(suggestion)}
                className="w-full px-4 py-2 text-left hover:bg-gray-100 border-b last:border-0 flex items-start gap-2"
              >
                <MapPin className="w-4 h-4 mt-0.5 flex-shrink-0 text-gray-500" />
                <div>
                  <div className="font-medium text-sm">{suggestion.structured_formatting.main_text}</div>
                  <div className="text-xs text-gray-500">{suggestion.structured_formatting.secondary_text}</div>
                </div>
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
