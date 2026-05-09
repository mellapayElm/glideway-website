"use client"

import { useState, useEffect, useRef } from "react"
import { GoogleMap, useJsApiLoader, DirectionsRenderer, Marker } from "@react-google-maps/api"
import { io, Socket } from "socket.io-client"
import Link from "next/link"

const libraries: ("places")[] = ["places"]

const mapContainerStyle = {
  width: "100%",
  height: "100%",
}

const defaultCenter = { lat: 38.8339, lng: -104.8214 }

interface Message {
  id: string
  text: string
  sender: "rider" | "driver"
}

export default function RidePage() {
  const [pickup, setPickup] = useState("")
  const [dropoff, setDropoff] = useState("")
  const [rideType, setRideType] = useState("Standard")
  const [directions, setDirections] = useState<google.maps.DirectionsResult | null>(null)
  const [distance, setDistance] = useState("")
  const [duration, setDuration] = useState("")
  const [fare, setFare] = useState(0)
  const [rideId, setRideId] = useState("")
  const [status, setStatus] = useState<"idle" | "calculated" | "requested" | "accepted" | "arrived" | "started" | "completed">("idle")
  const [statusMessage, setStatusMessage] = useState("Enter pickup and destination")
  const [eta, setEta] = useState("")
  const [nearbyDrivers, setNearbyDrivers] = useState(1)
  const [messages, setMessages] = useState<Message[]>([])
  const [newMessage, setNewMessage] = useState("")
  const [driverLocation, setDriverLocation] = useState<{ lat: number; lng: number } | null>(null)
  const [socket, setSocket] = useState<Socket | null>(null)
  const [mapCenter, setMapCenter] = useState(defaultCenter)

  const [driver] = useState({
    name: "Berhane H.",
    car: "Black Toyota Camry",
    plate: "GLD-2026",
    photo: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop",
  })

  const pickupRef = useRef<HTMLInputElement>(null)
  const dropoffRef = useRef<HTMLInputElement>(null)

  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || "",
    libraries,
  })

  // Socket connection
  useEffect(() => {
    const newSocket = io(process.env.NEXT_PUBLIC_SOCKET_URL || "http://localhost:5000", {
      transports: ["websocket", "polling"],
    })

    newSocket.on("connect", () => {
      console.log("[v0] Rider connected to socket")
    })

    newSocket.on("rideAccepted", () => {
      setStatus("accepted")
      setStatusMessage("Driver accepted your ride and is heading to pickup")
      setEta("Driver is on the way")
    })

    newSocket.on("driverArrived", () => {
      setStatus("arrived")
      setStatusMessage("Driver has arrived at your pickup location")
      setEta("Driver has arrived")
    })

    newSocket.on("tripStarted", () => {
      setStatus("started")
      setStatusMessage("Trip started")
      setEta("Trip in progress")
    })

    newSocket.on("tripCompleted", () => {
      setStatus("completed")
      setStatusMessage("Trip completed")
      setEta("Completed")
    })

    newSocket.on("driverLocation", (location: { lat: number; lng: number }) => {
      setDriverLocation(location)
    })

    newSocket.on("receiveChatMessage", (message: Message) => {
      setMessages((prev) => [...prev, { ...message, sender: "driver" }])
    })

    setSocket(newSocket)
    return () => { newSocket.disconnect() }
  }, [])

  // Setup Google Places Autocomplete
  useEffect(() => {
    if (isLoaded && pickupRef.current && dropoffRef.current) {
      const pickupAuto = new google.maps.places.Autocomplete(pickupRef.current, { types: ["address"] })
      const dropoffAuto = new google.maps.places.Autocomplete(dropoffRef.current, { types: ["address"] })

      pickupAuto.addListener("place_changed", () => {
        const place = pickupAuto.getPlace()
        if (place?.formatted_address) setPickup(place.formatted_address)
      })

      dropoffAuto.addListener("place_changed", () => {
        const place = dropoffAuto.getPlace()
        if (place?.formatted_address) setDropoff(place.formatted_address)
      })
    }
  }, [isLoaded])

  const calculateRoute = async () => {
    if (!pickup || !dropoff || !isLoaded) return

    const directionsService = new google.maps.DirectionsService()
    
    try {
      const result = await directionsService.route({
        origin: pickup,
        destination: dropoff,
        travelMode: google.maps.TravelMode.DRIVING,
      })

      setDirections(result)
      
      const route = result.routes[0]
      if (route?.legs[0]) {
        const leg = route.legs[0]
        setDistance(leg.distance?.text || "")
        setDuration(leg.duration?.text || "")
        
        const distanceValue = leg.distance?.value || 0
        const miles = distanceValue / 1609.34
        const baseRates: Record<string, number> = { Standard: 2.5, Comfort: 3.0, XL: 3.5, Premium: 4.0 }
        const calculatedFare = 4.50 + miles * baseRates[rideType]
        setFare(Math.round(calculatedFare * 100) / 100)

        if (leg.start_location) {
          setMapCenter({ lat: leg.start_location.lat(), lng: leg.start_location.lng() })
        }

        setStatus("calculated")
        setStatusMessage("Route calculated. Ready to request your ride.")
        setEta(leg.duration?.text || "")
      }
    } catch (error) {
      console.error("Error calculating route:", error)
      setStatusMessage("Could not calculate route. Please check addresses.")
    }
  }

  const requestRide = () => {
    if (!socket || status === "idle") return

    const newRideId = `ride_${Date.now()}`
    setRideId(newRideId)

    socket.emit("newRideRequest", {
      id: newRideId,
      pickup,
      dropoff,
      rideType,
      fare,
      distance,
      duration,
    })

    setStatus("requested")
    setStatusMessage("Looking for nearby drivers...")
    setEta("Finding driver...")
  }

  const sendMessage = () => {
    if (!newMessage.trim() || !socket) return

    const message: Message = {
      id: `msg_${Date.now()}`,
      text: newMessage,
      sender: "rider",
    }

    socket.emit("sendChatMessage", { rideId, message })
    setMessages((prev) => [...prev, message])
    setNewMessage("")
  }

  const progressSteps = ["Requested", "Accepted", "Arrived", "Started", "Completed"]
  const stepIndex = { idle: -1, calculated: -1, requested: 0, accepted: 1, arrived: 2, started: 3, completed: 4 }[status]

  const getStatusIcon = () => {
    if (status === "completed") return "bg-green-600"
    if (status === "arrived") return "bg-orange-500"
    if (status === "accepted") return "bg-blue-500"
    return "bg-green-500"
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 px-4 py-3">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <Link href="/" className="text-xl font-bold text-green-600">GlideWay</Link>
          <nav className="hidden md:flex items-center gap-4">
            <Link href="/" className="text-gray-600 hover:text-gray-900 px-3 py-1">Home</Link>
            <Link href="/ride" className="bg-green-600 text-white px-4 py-1.5 rounded text-sm font-medium">Ride</Link>
            <Link href="/driver" className="text-gray-600 hover:text-gray-900 px-3 py-1">Drive</Link>
            <Link href="/safety" className="text-gray-600 hover:text-gray-900 px-3 py-1">Safety</Link>
            <Link href="/pricing" className="text-gray-600 hover:text-gray-900 px-3 py-1">Pricing</Link>
            <Link href="/login" className="text-gray-600 hover:text-gray-900 px-3 py-1">Login</Link>
            <Link href="/register" className="text-gray-600 hover:text-gray-900 px-3 py-1">Register</Link>
          </nav>
        </div>
      </header>

      <div className="max-w-7xl mx-auto p-4">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Left Panel - Booking Form */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h1 className="text-xl font-semibold text-green-700 mb-4">Ride with GlideWay</h1>

            {/* Status Banner */}
            {status !== "idle" && (
              <div className="flex items-center gap-3 p-3 rounded-lg mb-4 bg-green-50 border border-green-200">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center ${getStatusIcon()}`}>
                  {status === "completed" ? (
                    <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  ) : (
                    <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                  )}
                </div>
                <div>
                  <p className="font-medium text-gray-900 text-sm">{statusMessage}</p>
                  <p className="text-xs text-gray-600">ETA: {eta}</p>
                </div>
              </div>
            )}

            {/* Progress Tracker */}
            {stepIndex >= 0 && (
              <div className="flex items-center justify-between mb-5 px-1 border-b border-gray-200 pb-4">
                {progressSteps.map((step, index) => (
                  <div key={step} className="flex flex-col items-center">
                    <div className={`w-2 h-2 rounded-full mb-1 ${index <= stepIndex ? "bg-green-500" : "bg-gray-300"}`} />
                    <span className={`text-xs ${index <= stepIndex ? "text-green-600 font-medium" : "text-gray-400"}`}>
                      {step}
                    </span>
                  </div>
                ))}
              </div>
            )}

            {/* Driver Info Card */}
            {stepIndex >= 0 && (
              <div className="flex items-center gap-4 p-3 bg-gray-50 rounded-lg mb-4 border border-gray-200">
                <img 
                  src={driver.photo}
                  alt={driver.name}
                  className="w-12 h-12 rounded-full object-cover"
                />
                <div>
                  <p className="font-medium text-gray-900">{driver.name}</p>
                  <p className="text-sm text-gray-500">{driver.car}</p>
                  <p className="text-sm font-semibold text-gray-700">Plate: {driver.plate}</p>
                </div>
              </div>
            )}

            {/* Pickup Input */}
            <div className="mb-3">
              <input
                ref={pickupRef}
                type="text"
                placeholder="7770 Milton E Proby Pkwy, Colorado Springs, CO 80916, USA"
                value={pickup}
                onChange={(e) => setPickup(e.target.value)}
                className="w-full px-4 py-3 border border-green-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 text-gray-900 text-sm"
              />
            </div>

            {/* Dropoff Input */}
            <div className="mb-3">
              <input
                ref={dropoffRef}
                type="text"
                placeholder="8500 Pena Blvd, Denver, CO 80249, USA"
                value={dropoff}
                onChange={(e) => setDropoff(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 text-gray-900 text-sm"
              />
            </div>

            {/* Ride Type Selector */}
            <div className="mb-4">
              <select
                value={rideType}
                onChange={(e) => setRideType(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 bg-white text-gray-900 text-sm"
              >
                <option value="Standard">Standard</option>
                <option value="Comfort">Comfort</option>
                <option value="XL">XL</option>
                <option value="Premium">Premium</option>
              </select>
            </div>

            {/* Calculate Route Button */}
            <button
              onClick={calculateRoute}
              className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-3 rounded-lg mb-4 transition-colors text-sm"
            >
              Calculate Route &amp; Fare
            </button>

            {/* Route Info */}
            {distance && (
              <div className="mb-4 space-y-1">
                <p className="text-sm">
                  <span className="font-semibold text-green-700">Distance:</span>{" "}
                  <span className="text-blue-600">{distance}</span>
                </p>
                <p className="text-sm">
                  <span className="font-semibold text-green-700">Estimated Time:</span>{" "}
                  <span className="text-blue-600">{duration}</span>
                </p>
                <p className="text-sm">
                  <span className="font-semibold text-green-700">Estimated Fare:</span>{" "}
                  <span className="text-gray-900">${fare.toFixed(2)}</span>
                </p>
              </div>
            )}

            {/* Request Ride Button */}
            <button
              onClick={requestRide}
              disabled={status === "idle"}
              className="w-full bg-green-800 hover:bg-green-900 disabled:bg-gray-400 text-white font-semibold py-3 rounded-lg mb-4 transition-colors text-sm"
            >
              Request Ride
            </button>

            {/* Active Ride Info */}
            {rideId && (
              <p className="text-sm text-yellow-700 mb-2">
                <span className="font-semibold">Active Ride:</span> {rideId}
              </p>
            )}

            {/* Nearby Drivers */}
            <p className="text-sm font-semibold text-green-700 mb-4">
              Nearby drivers: <span className="text-blue-600">{nearbyDrivers}</span>
            </p>

            {/* Chat Section */}
            <div className="border border-gray-200 rounded-lg p-4">
              <h3 className="font-medium text-gray-700 mb-2 flex items-center gap-2 text-sm">
                <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                Message Your Driver
              </h3>
              <p className="text-xs text-gray-500 mb-3">
                {messages.length === 0 ? "No messages yet. Send a quick note to your driver." : ""}
              </p>
              
              <div className="max-h-24 overflow-y-auto mb-3 space-y-2">
                {messages.map((msg) => (
                  <div
                    key={msg.id}
                    className={`p-2 rounded-lg text-xs ${
                      msg.sender === "rider" ? "bg-green-100 text-green-900 ml-8" : "bg-gray-100 text-gray-900 mr-8"
                    }`}
                  >
                    {msg.text}
                  </div>
                ))}
              </div>

              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="Type message..."
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  onKeyPress={(e) => e.key === "Enter" && sendMessage()}
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 text-xs text-gray-900"
                />
                <button
                  onClick={sendMessage}
                  className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg text-xs font-medium transition-colors"
                >
                  Send
                </button>
              </div>
            </div>

            {/* Footer Message */}
            <p className="text-sm text-green-700 mt-4">
              {status === "completed" ? "Thank you for riding with GlideWay." :
               status === "started" ? "Enjoy your GlideWay ride." :
               status === "arrived" ? "Please meet your driver safely." :
               status === "calculated" ? "Route calculated successfully." : ""}
            </p>
          </div>

          {/* Right Panel - Google Map */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden h-[650px]">
            {isLoaded ? (
              <GoogleMap
                mapContainerStyle={mapContainerStyle}
                center={mapCenter}
                zoom={10}
                options={{
                  zoomControl: true,
                  streetViewControl: false,
                  mapTypeControl: true,
                  fullscreenControl: true,
                }}
              >
                {directions && <DirectionsRenderer directions={directions} />}
                {driverLocation && (
                  <Marker
                    position={driverLocation}
                    icon={{ url: "https://maps.google.com/mapfiles/ms/icons/blue-dot.png" }}
                  />
                )}
              </GoogleMap>
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-gray-100">
                <div className="text-center">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
                  <p className="text-gray-600">Loading map...</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
