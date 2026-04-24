"use client"

import { useEffect, useRef, useState } from "react"
import { GlideWayMap } from "./glideway-map"

interface RideType {
  id: string
  name: string
  description: string
  basePrice: number
  perMile: number
  perMinute: number
  icon: string
  color: string
}

const RIDE_TYPES: RideType[] = [
  { id: "economy", name: "Economy", description: "Affordable everyday ride", basePrice: 4.50, perMile: 1.65, perMinute: 0.35, icon: "🚗", color: "#22c55e" },
  { id: "comfort", name: "Comfort", description: "More space and better comfort", basePrice: 6.50, perMile: 2.15, perMinute: 0.42, icon: "🚙", color: "#3b82f6" },
  { id: "xl", name: "XL", description: "Best for groups and families", basePrice: 8.50, perMile: 2.85, perMinute: 0.55, icon: "🚐", color: "#8b5cf6" },
  { id: "premium", name: "Premium", description: "Luxury ride experience", basePrice: 12.00, perMile: 3.50, perMinute: 0.75, icon: "🏎️", color: "#f59e0b" },
]

const PAYMENT_METHODS = [
  "Card ending in 4242",
  "Apple Pay",
  "Google Pay", 
  "Cash"
]

// Colorado Springs default
const DEFAULT_CENTER = { lat: 38.8339, lng: -104.8214 }

let scriptLoaded = false
let scriptPromise: Promise<void> | null = null

function loadGoogleMaps(apiKey: string): Promise<void> {
  if (scriptLoaded && window.google?.maps) return Promise.resolve()
  if (scriptPromise) return scriptPromise

  scriptPromise = new Promise((resolve, reject) => {
    if (window.google?.maps) {
      scriptLoaded = true
      resolve()
      return
    }

    const existing = document.querySelector('script[src*="maps.googleapis.com"]')
    if (existing) {
      const interval = setInterval(() => {
        if (window.google?.maps) {
          clearInterval(interval)
          scriptLoaded = true
          resolve()
        }
      }, 100)
      return
    }

    const script = document.createElement("script")
    script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=places&callback=__initGoogleMaps`
    script.async = true
    script.defer = true

    ;(window as any).__initGoogleMaps = () => {
      scriptLoaded = true
      resolve()
    }

    script.onerror = () => reject(new Error("Failed to load Google Maps"))
    document.head.appendChild(script)
  })

  return scriptPromise
}

export function GlideWayBooking() {
  const mapRef = useRef<HTMLDivElement>(null)
  const mapInstance = useRef<google.maps.Map | null>(null)
  const directionsService = useRef<google.maps.DirectionsService | null>(null)
  const directionsRenderer = useRef<google.maps.DirectionsRenderer | null>(null)
  const pickupAutocomplete = useRef<google.maps.places.Autocomplete | null>(null)
  const dropoffAutocomplete = useRef<google.maps.places.Autocomplete | null>(null)
  const pickupInputRef = useRef<HTMLInputElement>(null)
  const dropoffInputRef = useRef<HTMLInputElement>(null)

  const [mapLoaded, setMapLoaded] = useState(false)
  const [mapError, setMapError] = useState<string | null>(null)
  const [pickup, setPickup] = useState("")
  const [dropoff, setDropoff] = useState("")
  const [scheduleType, setScheduleType] = useState("now")
  const [scheduleTime, setScheduleTime] = useState("")
  const [riderType, setRiderType] = useState("me")
  const [otherRiderName, setOtherRiderName] = useState("")
  const [otherRiderPhone, setOtherRiderPhone] = useState("")
  const [selectedRide, setSelectedRide] = useState("economy")
  const [paymentMethod, setPaymentMethod] = useState(PAYMENT_METHODS[0])
  const [promoCode, setPromoCode] = useState("")
  const [driverNote, setDriverNote] = useState("")
  const [tripSummary, setTripSummary] = useState<any>(null)
  const [isSearching, setIsSearching] = useState(false)
  const [mapPickupMode, setMapPickupMode] = useState(false)

  // Initialize Google Maps
  useEffect(() => {
    const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY
    if (!apiKey) {
      setMapError("Google Maps API key not configured")
      return
    }

    async function initMap() {
      try {
        await loadGoogleMaps(apiKey!)

        if (!mapRef.current || !window.google?.maps) return

        // Create map
        const map = new google.maps.Map(mapRef.current, {
          center: DEFAULT_CENTER,
          zoom: 13,
          mapTypeControl: false,
          streetViewControl: false,
          fullscreenControl: true,
          styles: [
            { featureType: "poi.business", stylers: [{ visibility: "off" }] },
            { featureType: "transit", elementType: "labels.icon", stylers: [{ visibility: "off" }] },
          ]
        })

        mapInstance.current = map
        directionsService.current = new google.maps.DirectionsService()
        directionsRenderer.current = new google.maps.DirectionsRenderer({ 
          map,
          suppressMarkers: false,
          polylineOptions: {
            strokeColor: "#22c55e",
            strokeWeight: 5
          }
        })

        // Setup autocomplete
        if (pickupInputRef.current) {
          pickupAutocomplete.current = new google.maps.places.Autocomplete(pickupInputRef.current, {
            types: ["address"]
          })
          pickupAutocomplete.current.addListener("place_changed", () => {
            const place = pickupAutocomplete.current?.getPlace()
            if (place?.formatted_address) {
              setPickup(place.formatted_address)
            }
          })
        }

        if (dropoffInputRef.current) {
          dropoffAutocomplete.current = new google.maps.places.Autocomplete(dropoffInputRef.current, {
            types: ["address"]
          })
          dropoffAutocomplete.current.addListener("place_changed", () => {
            const place = dropoffAutocomplete.current?.getPlace()
            if (place?.formatted_address) {
              setDropoff(place.formatted_address)
            }
          })
        }

        // Map click for pickup selection
        map.addListener("click", (event: google.maps.MapMouseEvent) => {
          if (mapPickupMode && event.latLng) {
            const geocoder = new google.maps.Geocoder()
            geocoder.geocode({ location: event.latLng }, (results, status) => {
              if (status === "OK" && results?.[0]) {
                setPickup(results[0].formatted_address)
                setMapPickupMode(false)
              }
            })
          }
        })

        // Show nearby drivers
        showNearbyDrivers(map, DEFAULT_CENTER)

        setMapLoaded(true)
      } catch (err) {
        setMapError(err instanceof Error ? err.message : "Failed to load map")
      }
    }

    initMap()
  }, [mapPickupMode])

  // Show fake nearby drivers
  function showNearbyDrivers(map: google.maps.Map, center: { lat: number; lng: number }) {
    const drivers = [
      { lat: center.lat + 0.008, lng: center.lng + 0.012 },
      { lat: center.lat - 0.010, lng: center.lng + 0.006 },
      { lat: center.lat + 0.005, lng: center.lng - 0.015 },
      { lat: center.lat - 0.007, lng: center.lng - 0.009 },
    ]

    drivers.forEach((pos, i) => {
      new google.maps.Marker({
        position: pos,
        map,
        title: `GlideWay Driver ${i + 1}`,
        icon: {
          url: "data:image/svg+xml," + encodeURIComponent(`
            <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="#22c55e">
              <circle cx="12" cy="12" r="10" fill="#22c55e"/>
              <text x="12" y="16" text-anchor="middle" fill="white" font-size="12">🚗</text>
            </svg>
          `),
          scaledSize: new google.maps.Size(40, 40)
        }
      })
    })
  }

  // Use current location
  function useCurrentLocation() {
    if (!navigator.geolocation) {
      alert("Geolocation not supported")
      return
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const loc = { lat: position.coords.latitude, lng: position.coords.longitude }
        
        if (mapInstance.current) {
          mapInstance.current.setCenter(loc)
          mapInstance.current.setZoom(15)
        }

        const geocoder = new google.maps.Geocoder()
        geocoder.geocode({ location: loc }, (results, status) => {
          if (status === "OK" && results?.[0]) {
            setPickup(results[0].formatted_address)
          }
        })
      },
      () => alert("Please allow location access")
    )
  }

  // Calculate route and fare
  function searchRide() {
    if (!pickup || !dropoff) {
      alert("Please enter pickup and dropoff locations")
      return
    }

    if (!directionsService.current || !directionsRenderer.current) {
      alert("Map not ready yet")
      return
    }

    setIsSearching(true)

    directionsService.current.route(
      {
        origin: pickup,
        destination: dropoff,
        travelMode: google.maps.TravelMode.DRIVING
      },
      (response, status) => {
        setIsSearching(false)

        if (status === "OK" && response) {
          directionsRenderer.current?.setDirections(response)

          const leg = response.routes[0].legs[0]
          const miles = leg.distance!.value / 1609.34
          const minutes = leg.duration!.value / 60

          const ride = RIDE_TYPES.find(r => r.id === selectedRide) || RIDE_TYPES[0]
          let fare = ride.basePrice + (miles * ride.perMile) + (minutes * ride.perMinute) + 1.25
          fare = Math.max(fare, 7.00)

          // Apply promo
          if (promoCode.toLowerCase() === "glide10") {
            fare = fare * 0.90
          }

          setTripSummary({
            pickupAddress: leg.start_address,
            dropoffAddress: leg.end_address,
            distance: leg.distance!.text,
            duration: leg.duration!.text,
            rideType: ride.name,
            fare: fare.toFixed(2),
            driversNearby: 4,
            payment: paymentMethod,
            promoApplied: promoCode.toLowerCase() === "glide10"
          })
        } else {
          alert("Could not calculate route: " + status)
        }
      }
    )
  }

  return (
    <div className="flex flex-col lg:flex-row h-screen w-full bg-gray-100">
      {/* Left Panel - Booking Form */}
      <div className="w-full lg:w-[420px] bg-white p-6 overflow-y-auto shadow-xl z-10 flex-shrink-0">
        {/* Brand Header */}
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-2">
            <span className="text-green-500">Glide</span>Way
          </h1>
          <p className="text-gray-500 mt-1">Ride smoothly, safely, and easily.</p>
        </div>

        {/* Pickup & Dropoff */}
        <div className="mb-6 pb-6 border-b border-gray-200">
          <label className="block font-bold text-gray-900 mb-2">Pickup Location</label>
          <input
            ref={pickupInputRef}
            type="text"
            value={pickup}
            onChange={(e) => setPickup(e.target.value)}
            placeholder="Enter pickup location"
            className="w-full p-3 border border-gray-300 rounded-xl text-base mb-3 focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none"
          />
          
          <div className="grid grid-cols-2 gap-3 mb-4">
            <button 
              onClick={useCurrentLocation}
              className="bg-green-50 text-green-700 border border-green-200 p-3 rounded-xl font-semibold hover:bg-green-100 transition-colors flex items-center justify-center gap-2"
            >
              <span>📍</span> Current Location
            </button>
            <button 
              onClick={() => {
                setMapPickupMode(true)
                alert("Tap anywhere on the map to set pickup")
              }}
              className="bg-blue-50 text-blue-700 border border-blue-200 p-3 rounded-xl font-semibold hover:bg-blue-100 transition-colors flex items-center justify-center gap-2"
            >
              <span>🗺️</span> Set on Map
            </button>
          </div>

          <label className="block font-bold text-gray-900 mb-2">Dropoff Location</label>
          <input
            ref={dropoffInputRef}
            type="text"
            value={dropoff}
            onChange={(e) => setDropoff(e.target.value)}
            placeholder="Enter destination"
            className="w-full p-3 border border-gray-300 rounded-xl text-base focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none"
          />
        </div>

        {/* Schedule */}
        <div className="mb-6 pb-6 border-b border-gray-200">
          <label className="block font-bold text-gray-900 mb-2">Schedule Ride</label>
          <select 
            value={scheduleType}
            onChange={(e) => setScheduleType(e.target.value)}
            className="w-full p-3 border border-gray-300 rounded-xl text-base mb-3 focus:ring-2 focus:ring-green-500 outline-none"
          >
            <option value="now">Pickup Now</option>
            <option value="later">Schedule for Later</option>
          </select>

          {scheduleType === "later" && (
            <input
              type="datetime-local"
              value={scheduleTime}
              onChange={(e) => setScheduleTime(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-xl text-base focus:ring-2 focus:ring-green-500 outline-none"
            />
          )}
        </div>

        {/* Rider */}
        <div className="mb-6 pb-6 border-b border-gray-200">
          <label className="block font-bold text-gray-900 mb-2">Rider</label>
          <select 
            value={riderType}
            onChange={(e) => setRiderType(e.target.value)}
            className="w-full p-3 border border-gray-300 rounded-xl text-base mb-3 focus:ring-2 focus:ring-green-500 outline-none"
          >
            <option value="me">For Me</option>
            <option value="someone_else">Order Ride for Someone Else</option>
          </select>

          {riderType === "someone_else" && (
            <div className="space-y-3">
              <input
                type="text"
                value={otherRiderName}
                onChange={(e) => setOtherRiderName(e.target.value)}
                placeholder="Passenger name"
                className="w-full p-3 border border-gray-300 rounded-xl text-base focus:ring-2 focus:ring-green-500 outline-none"
              />
              <input
                type="tel"
                value={otherRiderPhone}
                onChange={(e) => setOtherRiderPhone(e.target.value)}
                placeholder="Passenger phone"
                className="w-full p-3 border border-gray-300 rounded-xl text-base focus:ring-2 focus:ring-green-500 outline-none"
              />
            </div>
          )}
        </div>

        {/* Ride Types */}
        <div className="mb-6 pb-6 border-b border-gray-200">
          <label className="block font-bold text-gray-900 mb-3">Choose Ride Type</label>
          <div className="space-y-3">
            {RIDE_TYPES.map((ride) => (
              <button
                key={ride.id}
                onClick={() => setSelectedRide(ride.id)}
                className={`w-full p-4 rounded-xl text-left transition-all ${
                  selectedRide === ride.id
                    ? "border-2 border-gray-900 bg-gray-50 shadow-md"
                    : "border border-gray-200 bg-white hover:border-gray-300"
                }`}
              >
                <div className="flex items-center gap-3">
                  <span className="text-2xl">{ride.icon}</span>
                  <div className="flex-1">
                    <div className="font-bold text-gray-900">{ride.name}</div>
                    <div className="text-sm text-gray-500">{ride.description}</div>
                  </div>
                  <div 
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: ride.color }}
                  />
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Payment & Promo */}
        <div className="mb-6 pb-6 border-b border-gray-200">
          <label className="block font-bold text-gray-900 mb-2">Payment Method</label>
          <select 
            value={paymentMethod}
            onChange={(e) => setPaymentMethod(e.target.value)}
            className="w-full p-3 border border-gray-300 rounded-xl text-base mb-4 focus:ring-2 focus:ring-green-500 outline-none"
          >
            {PAYMENT_METHODS.map((method) => (
              <option key={method} value={method}>{method}</option>
            ))}
          </select>

          <label className="block font-bold text-gray-900 mb-2">Promo Code</label>
          <input
            type="text"
            value={promoCode}
            onChange={(e) => setPromoCode(e.target.value)}
            placeholder="Enter promo code (try GLIDE10)"
            className="w-full p-3 border border-gray-300 rounded-xl text-base mb-4 focus:ring-2 focus:ring-green-500 outline-none"
          />

          <label className="block font-bold text-gray-900 mb-2">Note for Driver</label>
          <textarea
            value={driverNote}
            onChange={(e) => setDriverNote(e.target.value)}
            placeholder="Gate code, pickup instructions, accessibility needs..."
            className="w-full p-3 border border-gray-300 rounded-xl text-base resize-none h-20 focus:ring-2 focus:ring-green-500 outline-none"
          />
        </div>

        {/* Search Button */}
        <button
          onClick={searchRide}
          disabled={isSearching}
          className="w-full bg-black text-white p-4 rounded-xl text-lg font-bold hover:bg-gray-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed mb-6"
        >
          {isSearching ? "Searching..." : "Search Ride"}
        </button>

        {/* Trip Summary */}
        {tripSummary ? (
          <div className="bg-gradient-to-br from-green-50 to-blue-50 rounded-xl p-5 mb-6 border border-green-100">
            <h3 className="font-bold text-gray-900 mb-3 text-lg">Trip Summary</h3>
            <div className="space-y-2 text-sm">
              <p><span className="font-semibold">Pickup:</span> {tripSummary.pickupAddress}</p>
              <p><span className="font-semibold">Dropoff:</span> {tripSummary.dropoffAddress}</p>
              <p><span className="font-semibold">Distance:</span> {tripSummary.distance}</p>
              <p><span className="font-semibold">ETA:</span> {tripSummary.duration}</p>
              <p><span className="font-semibold">Ride Type:</span> {tripSummary.rideType}</p>
              <p><span className="font-semibold">Drivers Nearby:</span> {tripSummary.driversNearby} available</p>
              <p><span className="font-semibold">Payment:</span> {tripSummary.payment}</p>
              {tripSummary.promoApplied && (
                <p className="text-green-600 font-semibold">10% promo applied!</p>
              )}
            </div>
            <div className="mt-4 pt-4 border-t border-green-200">
              <span className="text-3xl font-bold text-green-600">${tripSummary.fare}</span>
              <p className="text-xs text-gray-500 mt-1">Fare may change based on traffic, tolls, wait time.</p>
            </div>
            <button className="w-full mt-4 bg-green-600 text-white p-4 rounded-xl font-bold hover:bg-green-700 transition-colors">
              Confirm Ride
            </button>
          </div>
        ) : (
          <div className="bg-gray-50 rounded-xl p-5 mb-6 text-center text-gray-500">
            Trip summary will appear here after you search.
          </div>
        )}

        {/* Safety */}
        <button className="w-full bg-red-600 text-white p-4 rounded-xl font-bold hover:bg-red-700 transition-colors mb-6 flex items-center justify-center gap-2">
          <span>🛡️</span> Safety Help
        </button>

        {/* Cancel Policy */}
        <div className="bg-gray-50 rounded-xl p-4 text-sm text-gray-600">
          <strong className="text-gray-900">Cancel Policy:</strong><br />
          You may cancel at no charge before a driver accepts. Fees may apply after driver assignment or long wait time.
        </div>
      </div>

      {/* Right Panel - Map */}
      <div className="flex-1 relative min-h-[400px] lg:min-h-0">
        <GlideWayMap
          onPickupSelect={(lat, lng) => {
            console.log("[v0] Pickup selected:", { lat, lng })
          }}
          onDropoffSelect={(lat, lng) => {
            console.log("[v0] Dropoff selected:", { lat, lng })
          }}
        />
      </div>
    </div>
  )
}
