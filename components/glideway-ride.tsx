"use client"

import { useState, useEffect, useRef, useCallback } from "react"
import { MapPin, Navigation, Clock, Car, Users, Star, ChevronRight } from "lucide-react"
import { loadGoogleMaps } from "@/lib/google-maps-loader"

interface RideType {
  id: string
  name: string
  description: string
  priceMultiplier: number
  eta: string
  capacity: number
  icon: string
}

const RIDE_TYPES: RideType[] = [
  { id: "economy", name: "Economy", description: "Affordable everyday rides", priceMultiplier: 1, eta: "3 min", capacity: 4, icon: "🚗" },
  { id: "comfort", name: "Comfort", description: "Newer cars with extra legroom", priceMultiplier: 1.3, eta: "5 min", capacity: 4, icon: "🚙" },
  { id: "xl", name: "XL", description: "SUVs for groups up to 6", priceMultiplier: 1.5, eta: "7 min", capacity: 6, icon: "🚐" },
  { id: "premium", name: "Premium", description: "Luxury vehicles", priceMultiplier: 2, eta: "4 min", capacity: 4, icon: "✨" },
]

export function GlideWayRide() {
  const mapRef = useRef<HTMLDivElement>(null)
  const mapInstanceRef = useRef<google.maps.Map | null>(null)
  const pickupMarkerRef = useRef<google.maps.Marker | null>(null)
  const dropoffMarkerRef = useRef<google.maps.Marker | null>(null)
  const directionsRendererRef = useRef<google.maps.DirectionsRenderer | null>(null)

  const [pickup, setPickup] = useState("")
  const [dropoff, setDropoff] = useState("")
  const [pickupCoords, setPickupCoords] = useState<{ lat: number; lng: number } | null>(null)
  const [dropoffCoords, setDropoffCoords] = useState<{ lat: number; lng: number } | null>(null)
  const [selectedRide, setSelectedRide] = useState("economy")
  const [estimatedPrice, setEstimatedPrice] = useState<number | null>(null)
  const [mapLoaded, setMapLoaded] = useState(false)
  const [scheduleMode, setScheduleMode] = useState<"now" | "later">("now")

  // Initialize Google Maps
  useEffect(() => {
    const initMap = async () => {
      try {
        await loadGoogleMaps()
        
        if (!mapRef.current || !window.google?.maps) return

        const map = new window.google.maps.Map(mapRef.current, {
          center: { lat: 38.8339, lng: -104.8214 }, // Colorado Springs
          zoom: 13,
          disableDefaultUI: true,
          zoomControl: true,
          mapTypeControl: false,
          streetViewControl: false,
          fullscreenControl: false,
          styles: [
            { featureType: "poi", elementType: "labels", stylers: [{ visibility: "off" }] },
          ],
        })

        mapInstanceRef.current = map
        directionsRendererRef.current = new window.google.maps.DirectionsRenderer({
          map,
          suppressMarkers: true,
          polylineOptions: {
            strokeColor: "#22c55e",
            strokeWeight: 5,
          },
        })

        setMapLoaded(true)
      } catch (error) {
        console.error("Failed to load Google Maps:", error)
      }
    }

    initMap()
  }, [])

  // Update markers and route when coordinates change
  useEffect(() => {
    if (!mapInstanceRef.current || !window.google?.maps) return

    // Clear existing markers
    pickupMarkerRef.current?.setMap(null)
    dropoffMarkerRef.current?.setMap(null)

    // Add pickup marker
    if (pickupCoords) {
      pickupMarkerRef.current = new window.google.maps.Marker({
        position: pickupCoords,
        map: mapInstanceRef.current,
        icon: {
          path: window.google.maps.SymbolPath.CIRCLE,
          scale: 10,
          fillColor: "#22c55e",
          fillOpacity: 1,
          strokeColor: "#ffffff",
          strokeWeight: 3,
        },
        title: "Pickup",
      })
    }

    // Add dropoff marker
    if (dropoffCoords) {
      dropoffMarkerRef.current = new window.google.maps.Marker({
        position: dropoffCoords,
        map: mapInstanceRef.current,
        icon: {
          path: window.google.maps.SymbolPath.CIRCLE,
          scale: 10,
          fillColor: "#ef4444",
          fillOpacity: 1,
          strokeColor: "#ffffff",
          strokeWeight: 3,
        },
        title: "Dropoff",
      })
    }

    // Draw route if both points exist
    if (pickupCoords && dropoffCoords && directionsRendererRef.current) {
      const directionsService = new window.google.maps.DirectionsService()
      directionsService.route(
        {
          origin: pickupCoords,
          destination: dropoffCoords,
          travelMode: window.google.maps.TravelMode.DRIVING,
        },
        (result, status) => {
          if (status === "OK" && result) {
            directionsRendererRef.current?.setDirections(result)
            
            // Calculate estimated price based on distance
            const route = result.routes[0]
            if (route?.legs[0]?.distance) {
              const distanceMiles = route.legs[0].distance.value / 1609.34
              const basePrice = 2.5 + distanceMiles * 1.5
              const rideType = RIDE_TYPES.find(r => r.id === selectedRide)
              setEstimatedPrice(basePrice * (rideType?.priceMultiplier || 1))
            }
          }
        }
      )
    }
  }, [pickupCoords, dropoffCoords, selectedRide])

  // Handle location search using Places API
  const searchLocation = useCallback(async (query: string, type: "pickup" | "dropoff") => {
    if (!window.google?.maps || query.length < 3) return

    const autocompleteService = new window.google.maps.places.AutocompleteService()
    const placesService = new window.google.maps.places.PlacesService(
      document.createElement("div")
    )

    autocompleteService.getPlacePredictions(
      { input: query, componentRestrictions: { country: "us" } },
      (predictions, status) => {
        if (status === "OK" && predictions?.[0]) {
          placesService.getDetails(
            { placeId: predictions[0].place_id, fields: ["geometry", "formatted_address"] },
            (place, detailStatus) => {
              if (detailStatus === "OK" && place?.geometry?.location) {
                const coords = {
                  lat: place.geometry.location.lat(),
                  lng: place.geometry.location.lng(),
                }
                if (type === "pickup") {
                  setPickupCoords(coords)
                  setPickup(place.formatted_address || query)
                } else {
                  setDropoffCoords(coords)
                  setDropoff(place.formatted_address || query)
                }
                mapInstanceRef.current?.panTo(coords)
              }
            }
          )
        }
      }
    )
  }, [])

  // Use current location
  const useCurrentLocation = useCallback(() => {
    if (!navigator.geolocation) return

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const coords = {
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        }
        setPickupCoords(coords)
        mapInstanceRef.current?.panTo(coords)
        mapInstanceRef.current?.setZoom(15)

        // Reverse geocode
        if (window.google?.maps) {
          const geocoder = new window.google.maps.Geocoder()
          geocoder.geocode({ location: coords }, (results, status) => {
            if (status === "OK" && results?.[0]) {
              setPickup(results[0].formatted_address)
            } else {
              setPickup("Current Location")
            }
          })
        }
      },
      () => setPickup("Unable to get location")
    )
  }, [])

  return (
    <section className="py-16 bg-gradient-to-b from-gray-50 to-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Book Your Ride</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Enter your pickup and destination to get an instant fare estimate
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8 max-w-6xl mx-auto">
          {/* Booking Form */}
          <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                <MapPin className="w-5 h-5 text-green-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900">Book Your Ride</h3>
            </div>

            {/* Pickup Location */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">Pickup Location</label>
              <div className="relative">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 w-3 h-3 bg-green-500 rounded-full" />
                <input
                  type="text"
                  value={pickup}
                  onChange={(e) => setPickup(e.target.value)}
                  onBlur={() => pickup && searchLocation(pickup, "pickup")}
                  placeholder="Enter pickup address"
                  className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent"
                />
              </div>
              <button
                onClick={useCurrentLocation}
                className="flex items-center gap-2 mt-2 text-green-600 hover:text-green-700 text-sm font-medium"
              >
                <Navigation className="w-4 h-4" />
                Use Current Location
              </button>
            </div>

            {/* Dropoff Location */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">Dropoff Location</label>
              <div className="relative">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 w-3 h-3 bg-red-500 rounded-full" />
                <input
                  type="text"
                  value={dropoff}
                  onChange={(e) => setDropoff(e.target.value)}
                  onBlur={() => dropoff && searchLocation(dropoff, "dropoff")}
                  placeholder="Enter destination address"
                  className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent"
                />
              </div>
            </div>

            {/* Schedule Options */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">When do you need a ride?</label>
              <div className="flex gap-3">
                <button
                  onClick={() => setScheduleMode("now")}
                  className={`flex-1 py-3 rounded-xl font-medium transition-all ${
                    scheduleMode === "now"
                      ? "bg-green-500 text-white"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
                >
                  Now
                </button>
                <button
                  onClick={() => setScheduleMode("later")}
                  className={`flex-1 py-3 rounded-xl font-medium transition-all flex items-center justify-center gap-2 ${
                    scheduleMode === "later"
                      ? "bg-green-500 text-white"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
                >
                  <Clock className="w-4 h-4" />
                  Schedule Later
                </button>
              </div>
            </div>

            {/* Ride Types */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-3">Choose your ride</label>
              <div className="grid grid-cols-2 gap-3">
                {RIDE_TYPES.map((ride) => (
                  <button
                    key={ride.id}
                    onClick={() => setSelectedRide(ride.id)}
                    className={`p-4 rounded-xl border-2 transition-all text-left ${
                      selectedRide === ride.id
                        ? "border-green-500 bg-green-50"
                        : "border-gray-200 hover:border-gray-300"
                    }`}
                  >
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-xl">{ride.icon}</span>
                      <span className="font-semibold text-gray-900">{ride.name}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-500">
                      <Users className="w-3 h-3" />
                      <span>{ride.capacity}</span>
                      <Clock className="w-3 h-3 ml-2" />
                      <span>{ride.eta}</span>
                    </div>
                    {selectedRide === ride.id && (
                      <span className="text-xs text-green-600 font-medium mt-1 block">Selected</span>
                    )}
                  </button>
                ))}
              </div>
            </div>

            {/* Price Estimate & Book Button */}
            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl mb-4">
              <div>
                <p className="text-sm text-gray-500">Estimated fare</p>
                <p className="text-2xl font-bold text-gray-900">
                  {estimatedPrice ? `$${estimatedPrice.toFixed(2)}` : "—"}
                </p>
              </div>
              <button
                disabled={!pickupCoords || !dropoffCoords}
                className="px-6 py-3 bg-green-500 hover:bg-green-600 disabled:bg-gray-300 disabled:cursor-not-allowed text-white font-semibold rounded-xl transition-colors flex items-center gap-2"
              >
                Book Ride
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>

            {/* Safety Banner */}
            <div className="bg-gradient-to-r from-green-500 to-emerald-600 rounded-xl p-4 text-white">
              <h4 className="font-semibold mb-2">Your Safety Matters</h4>
              <ul className="text-sm space-y-1 text-green-100">
                <li className="flex items-center gap-2">
                  <Star className="w-3 h-3" /> All drivers background checked
                </li>
                <li className="flex items-center gap-2">
                  <Star className="w-3 h-3" /> Real-time trip tracking
                </li>
                <li className="flex items-center gap-2">
                  <Star className="w-3 h-3" /> 24/7 customer support
                </li>
              </ul>
            </div>
          </div>

          {/* Map */}
          <div className="bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-100">
            <div
              ref={mapRef}
              className="w-full h-[500px] lg:h-full min-h-[400px]"
              style={{ background: mapLoaded ? "transparent" : "#f3f4f6" }}
            />
            {!mapLoaded && (
              <div className="absolute inset-0 flex items-center justify-center bg-gray-100">
                <div className="text-center">
                  <div className="w-8 h-8 border-4 border-green-500 border-t-transparent rounded-full animate-spin mx-auto mb-2" />
                  <p className="text-gray-500">Loading map...</p>
                </div>
              </div>
            )}
            <div className="absolute bottom-4 right-4 bg-white px-3 py-1 rounded-lg shadow text-xs text-gray-500">
              GlideWay Maps
            </div>
            <div className="p-4 bg-green-50 border-t border-green-100">
              <div className="flex items-center gap-2 text-green-700 text-sm">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                <span>3 drivers nearby - Average pickup: 4 min</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
