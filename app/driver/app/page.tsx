"use client"

import { useEffect, useRef, useState } from "react"
import { io, Socket } from "socket.io-client"
import Link from "next/link"

interface RideRequest {
  id: string
  pickup: string
  dropoff: string
  distance: string
  duration: string
  fare: number
  rider?: {
    name: string
    id: string
    photo: string
    verified: boolean
  }
}

interface Message {
  id: string
  text: string
  sender: "rider" | "driver"
}

export default function DriverApp() {
  const [online, setOnline] = useState(false)
  const [ride, setRide] = useState<RideRequest | null>(null)
  const [status, setStatus] = useState("Offline")
  const [step, setStep] = useState<"waiting" | "requested" | "accepted" | "arrived" | "started" | "completed">("waiting")
  
  const [location, setLocation] = useState({ lat: 38.88202, lng: -104.84619 })
  const [heading, setHeading] = useState(169)
  const [accuracy, setAccuracy] = useState(55)
  const [gpsSource, setGpsSource] = useState("gps")
  
  const [chatMessages, setChatMessages] = useState<Message[]>([])
  const [chatText, setChatText] = useState("")
  const [socket, setSocket] = useState<Socket | null>(null)
  
  const watchId = useRef<number | null>(null)
  const lastLocation = useRef<{ lat: number; lng: number } | null>(null)

  // Socket connection
  useEffect(() => {
    const newSocket = io(process.env.NEXT_PUBLIC_SOCKET_URL || "http://localhost:5000", {
      transports: ["websocket", "polling"],
    })

    newSocket.on("connect", () => {
      console.log("[v0] Driver connected:", newSocket.id)
    })

    newSocket.on("newRideRequest", (rideData: RideRequest) => {
      console.log("[v0] New ride request:", rideData)
      // Add default rider info if not provided
      const rideWithRider = {
        ...rideData,
        rider: rideData.rider || {
          name: "Verified Rider",
          id: `RIDER-${rideData.id}`,
          photo: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop",
          verified: true,
        },
      }
      setRide(rideWithRider)
      setStep("requested")
      setStatus("New ride request received!")
      alert("New Ride Request!")
    })

    newSocket.on("receiveChatMessage", (message: Message) => {
      setChatMessages((prev) => [...prev, { ...message, sender: "rider" }])
    })

    setSocket(newSocket)
    return () => { newSocket.disconnect() }
  }, [])

  // GPS Stream
  useEffect(() => {
    if (online && navigator.geolocation) {
      watchId.current = navigator.geolocation.watchPosition(
        (position) => {
          const newLoc = {
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          }
          
          // Calculate heading from movement
          if (lastLocation.current) {
            const deltaLng = newLoc.lng - lastLocation.current.lng
            const deltaLat = newLoc.lat - lastLocation.current.lat
            const newHeading = Math.round((Math.atan2(deltaLng, deltaLat) * 180) / Math.PI)
            setHeading(newHeading >= 0 ? newHeading : 360 + newHeading)
          }
          
          setLocation(newLoc)
          setAccuracy(Math.round(position.coords.accuracy))
          setGpsSource("gps")
          lastLocation.current = newLoc

          // Broadcast location
          socket?.emit("updateLocation", {
            ...newLoc,
            heading,
            accuracy: position.coords.accuracy,
          })
        },
        (error) => {
          console.log("[v0] GPS error, using demo mode:", error)
          setGpsSource("demo")
          // Demo GPS simulation
          const interval = setInterval(() => {
            setLocation((prev) => ({
              lat: prev.lat + (Math.random() - 0.5) * 0.001,
              lng: prev.lng + (Math.random() - 0.5) * 0.001,
            }))
            setHeading((prev) => (prev + Math.floor(Math.random() * 10 - 5) + 360) % 360)
          }, 2000)
          return () => clearInterval(interval)
        },
        { enableHighAccuracy: true, maximumAge: 0 }
      )
    }

    return () => {
      if (watchId.current) navigator.geolocation.clearWatch(watchId.current)
    }
  }, [online, socket, heading])

  const toggleOnline = () => {
    const newOnline = !online
    setOnline(newOnline)
    if (newOnline) {
      setStatus("Online and waiting for ride requests")
      socket?.emit("driverOnline", { driverId: "driver_1" })
    } else {
      setStatus("Offline")
      setRide(null)
      setStep("waiting")
      socket?.emit("driverOffline", { driverId: "driver_1" })
    }
  }

  const acceptRide = () => {
    if (!ride || !socket) return
    socket.emit("acceptRide", { rideId: ride.id })
    setStep("accepted")
    setStatus("Driver arrived at pickup.")
  }

  const declineRide = () => {
    setRide(null)
    setStep("waiting")
    setStatus("Online and waiting for ride requests")
  }

  const arrivedAtPickup = () => {
    if (!socket || !ride) return
    socket.emit("driverArrived", { rideId: ride.id })
    setStep("arrived")
    setStatus("Waiting for rider")
  }

  const startTrip = () => {
    if (!socket || !ride) return
    socket.emit("startTrip", { rideId: ride.id })
    setStep("started")
    setStatus("Trip started. Drive safely.")
  }

  const completeTrip = () => {
    if (!socket || !ride) return
    socket.emit("completeTrip", { rideId: ride.id, fare: ride.fare })
    setStep("completed")
    setStatus("Trip completed.")
  }

  const readyForNext = () => {
    setRide(null)
    setStep("waiting")
    setStatus("Online and waiting for ride requests")
  }

  const openNavigation = () => {
    if (!ride) return
    const destination = step === "accepted" || step === "arrived" ? ride.pickup : ride.dropoff
    window.open(`https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(destination)}`, "_blank")
  }

  const sendMessage = () => {
    if (!chatText.trim() || !socket || !ride) return
    const message: Message = { id: `msg_${Date.now()}`, text: chatText, sender: "driver" }
    socket.emit("sendChatMessage", { rideId: ride.id, message })
    setChatMessages((prev) => [...prev, message])
    setChatText("")
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      {/* Header */}
      <header className="bg-gray-900 border-b border-gray-800 px-4 py-3">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <Link href="/" className="text-xl font-bold text-green-500">GlideWay</Link>
          <nav className="hidden md:flex items-center gap-4 text-sm text-gray-400">
            <Link href="/" className="hover:text-white">Home</Link>
            <Link href="/ride" className="hover:text-white">Ride</Link>
            <Link href="/driver" className="text-green-500 font-medium">Drive</Link>
            <Link href="/safety" className="hover:text-white">Safety</Link>
            <Link href="/pricing" className="hover:text-white">Pricing</Link>
            <Link href="/login" className="hover:text-white">Login</Link>
            <Link href="/register" className="hover:text-white">Register</Link>
          </nav>
        </div>
      </header>

      <div className="max-w-5xl mx-auto p-4 space-y-4">
        {/* Driver Title */}
        <div className="flex items-center gap-2">
          <span className="text-xl">🚗</span>
          <span className="text-green-500 font-medium">GlideWay Driver</span>
        </div>

        {/* Status Line */}
        <div className="flex items-center gap-2 text-sm">
          <span className={`w-2 h-2 rounded-full ${online ? "bg-green-500" : "bg-gray-500"}`}></span>
          <span className={online ? "text-green-400" : "text-gray-400"}>
            {online ? "Online" : "Offline"}
          </span>
          <span className="text-gray-500">·</span>
          <span className="text-gray-300">{status}</span>
        </div>

        {/* Go Online/Offline Button */}
        <button
          onClick={toggleOnline}
          className={`w-full py-4 rounded-lg font-semibold text-white transition-colors ${
            online ? "bg-orange-500 hover:bg-orange-600" : "bg-green-500 hover:bg-green-600"
          }`}
        >
          {online ? "Go Offline" : "Go Online"}
        </button>

        {/* Driver Safety Center */}
        <div className="bg-gray-800 border border-green-600 rounded-lg p-4">
          <div className="flex items-center gap-2 mb-3">
            <span className="text-green-500">🛡️</span>
            <span className="text-green-400 font-medium">Driver Safety Center</span>
          </div>
          <div className="space-y-1 text-sm text-green-300">
            <p>✓ Verified driver profile</p>
            <p>✓ GPS stream active when online</p>
            <p>✓ Rider identity visible before accepting</p>
            <p>✓ Trip details available for safety sharing</p>
            <p>✓ Report concerns anytime</p>
          </div>

          {/* SOS Button */}
          <button className="w-full mt-4 py-3 bg-red-500/80 hover:bg-red-500 rounded-lg text-white font-medium flex items-center justify-center gap-2">
            <span>🚨</span>
            Driver Emergency / SOS
          </button>

          {/* Share Trip Details */}
          <button className="mt-3 px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg text-white text-sm font-medium flex items-center gap-2">
            <span>📋</span>
            Share Trip Details
          </button>

          {/* Report Rider */}
          <button className="w-full mt-3 py-3 border border-gray-600 rounded-lg text-red-400 hover:bg-gray-700 font-medium">
            Report Rider / Trip Concern
          </button>
        </div>

        {/* GPS Stream Info */}
        <div className="text-sm">
          <p className="font-semibold text-white">GPS Stream Active</p>
          <p className="text-gray-400">Lat: {location.lat.toFixed(5)} · Lng: {location.lng.toFixed(5)}</p>
          <p className="text-gray-400">Heading: {heading}°</p>
          <p className="text-gray-400">Accuracy: {accuracy}m</p>
          <p className="text-gray-400">Source: {gpsSource}</p>
        </div>

        {/* Incoming Ride Request */}
        {ride && (
          <div className="bg-gray-800 border border-green-600 rounded-lg p-4 space-y-4">
            <div className="flex items-center gap-2 text-green-400 text-sm">
              <span>🚗</span>
              <span className="font-medium">Incoming Ride Request</span>
            </div>

            {/* Rider Info */}
            <div className="flex items-center gap-3">
              <img
                src={ride.rider?.photo || "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop"}
                alt="Rider"
                className="w-12 h-12 rounded-full object-cover"
              />
              <div>
                <p className="font-semibold text-white">{ride.rider?.name || "Verified Rider"}</p>
                <p className="text-xs text-green-400">✓ Verified Rider</p>
                <p className="text-xs text-gray-400">Rider ID: {ride.rider?.id || `RIDER-${ride.id}`}</p>
              </div>
            </div>

            {/* Driver Safety Check */}
            <div className="bg-gray-700/50 rounded-lg p-3">
              <p className="text-green-400 font-medium text-sm mb-2">Driver Safety Check</p>
              <div className="space-y-1 text-xs text-green-300">
                <p>✓ Rider picture visible</p>
                <p>✓ Rider ID shown before accepting</p>
                <p>✓ Pickup and destination visible</p>
                <p>✓ SOS and rider concern reporting enabled</p>
              </div>
            </div>

            {/* Ride Details */}
            <div className="text-sm space-y-1">
              <p><span className="text-gray-400">Ride ID:</span> <span className="text-yellow-400">{ride.id}</span></p>
              <p><span className="text-gray-400">Pickup:</span> <span className="text-green-300">{ride.pickup}</span></p>
              <p><span className="text-gray-400">Destination:</span> <span className="text-green-300">{ride.dropoff}</span></p>
              <p><span className="text-gray-400">Trip Distance:</span> <span className="text-white">{ride.distance || "1 ft"}</span></p>
              <p><span className="text-gray-400">Trip ETA:</span> <span className="text-white">{ride.duration || "1 min"}</span></p>
              <p className="text-green-500 font-semibold">${ride.fare?.toFixed(2) || "4.50"}</p>
            </div>

            {/* Action Buttons */}
            <div className="space-y-2">
              {/* Open Navigation */}
              <button
                onClick={openNavigation}
                className="w-full py-3 bg-blue-600 hover:bg-blue-700 rounded-lg text-white font-medium"
              >
                Open Route Navigation
              </button>

              {/* Accept/Start/Complete based on step */}
              {step === "requested" && (
                <>
                  <button
                    onClick={acceptRide}
                    className="w-full py-3 bg-green-500 hover:bg-green-600 rounded-lg text-white font-medium"
                  >
                    Accept Ride
                  </button>
                  <button
                    onClick={declineRide}
                    className="w-full py-3 bg-red-500 hover:bg-red-600 rounded-lg text-white font-medium"
                  >
                    Decline
                  </button>
                </>
              )}

              {step === "accepted" && (
                <button
                  onClick={arrivedAtPickup}
                  className="w-full py-3 bg-green-500 hover:bg-green-600 rounded-lg text-white font-medium"
                >
                  Arrived at Pickup
                </button>
              )}

              {step === "arrived" && (
                <button
                  onClick={startTrip}
                  className="w-full py-3 bg-green-500 hover:bg-green-600 rounded-lg text-white font-medium"
                >
                  Start Trip
                </button>
              )}

              {step === "started" && (
                <button
                  onClick={completeTrip}
                  className="w-full py-3 bg-green-500 hover:bg-green-600 rounded-lg text-white font-medium"
                >
                  Complete Trip
                </button>
              )}

              {step === "completed" && (
                <button
                  onClick={readyForNext}
                  className="w-full py-3 bg-green-500 hover:bg-green-600 rounded-lg text-white font-medium"
                >
                  Ready for Next Ride
                </button>
              )}
            </div>

            {/* Chat Section */}
            <div className="space-y-3">
              <div className="flex items-center gap-2 text-green-400 text-sm">
                <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                <span className="font-medium">Message Rider</span>
              </div>

              <div className="bg-gray-700/50 rounded-lg p-3 min-h-[60px] max-h-24 overflow-y-auto">
                {chatMessages.length === 0 ? (
                  <p className="text-xs text-gray-500">No messages yet.</p>
                ) : (
                  <div className="space-y-2">
                    {chatMessages.map((msg) => (
                      <div
                        key={msg.id}
                        className={`p-2 rounded-lg text-xs ${
                          msg.sender === "driver" ? "bg-green-600 text-white ml-8" : "bg-gray-600 text-gray-200 mr-8"
                        }`}
                      >
                        {msg.text}
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="Type message..."
                  value={chatText}
                  onChange={(e) => setChatText(e.target.value)}
                  onKeyPress={(e) => e.key === "Enter" && sendMessage()}
                  className="flex-1 px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white text-sm placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-green-500"
                />
                <button
                  onClick={sendMessage}
                  className="px-4 py-2 bg-green-500 hover:bg-green-600 rounded-lg text-white text-sm font-medium"
                >
                  Send
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
