"use client"

import { useState, useEffect, useRef } from "react"
import { Navigation, MessageCircle, Phone, Star, Shield, RefreshCw } from "lucide-react"
import { loadGoogleMaps } from "@/lib/google-maps-loader"

// Demo trip data
const DEMO_TRIP = {
  id: "GW-10234",
  status: "DRIVER_EN_ROUTE",
  driver: {
    name: "John Driver",
    rating: 4.92,
    totalRides: 2341,
    vehicle: "Toyota Camry",
    plate: "ABC 123",
    initials: "JD",
  },
  pickup: { lat: 34.0522, lng: -118.2437, address: "123 Main St, Los Angeles" },
  dropoff: { lat: 34.0689, lng: -118.2631, address: "456 Oak Ave, Hollywood" },
  estimatedFare: 24.75,
}

export function LiveTrackingSection() {
  const mapRef = useRef<HTMLDivElement>(null)
  const mapInstanceRef = useRef<google.maps.Map | null>(null)
  const driverMarkerRef = useRef<google.maps.Marker | null>(null)
  
  const [mapLoaded, setMapLoaded] = useState(false)
  const [driverPosition, setDriverPosition] = useState({ lat: 34.0490, lng: -118.2500 })
  const [messages, setMessages] = useState([
    { id: 1, from: "driver", text: "Your driver is on the way.", time: "2:34 PM" },
    { id: 2, from: "rider", text: "Hi, I am outside.", time: "2:35 PM" },
    { id: 3, from: "driver", text: "Got it, arriving now.", time: "2:36 PM" },
  ])
  const [newMessage, setNewMessage] = useState("")

  // Initialize Google Maps
  useEffect(() => {
    const initMap = async () => {
      try {
        await loadGoogleMaps()
        
        if (!mapRef.current || !window.google?.maps) return

        const map = new window.google.maps.Map(mapRef.current, {
          center: DEMO_TRIP.pickup,
          zoom: 14,
          disableDefaultUI: true,
          zoomControl: true,
          styles: [
            { featureType: "poi", elementType: "labels", stylers: [{ visibility: "off" }] },
          ],
        })

        mapInstanceRef.current = map

        // Add pickup marker
        new window.google.maps.Marker({
          position: DEMO_TRIP.pickup,
          map,
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

        // Add dropoff marker
        new window.google.maps.Marker({
          position: DEMO_TRIP.dropoff,
          map,
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

        // Add driver marker
        driverMarkerRef.current = new window.google.maps.Marker({
          position: driverPosition,
          map,
          icon: {
            path: "M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z",
            fillColor: "#3b82f6",
            fillOpacity: 1,
            strokeColor: "#ffffff",
            strokeWeight: 2,
            scale: 1.5,
            anchor: new window.google.maps.Point(12, 22),
          },
          title: "Driver",
        })

        // Draw route
        const directionsService = new window.google.maps.DirectionsService()
        const directionsRenderer = new window.google.maps.DirectionsRenderer({
          map,
          suppressMarkers: true,
          polylineOptions: {
            strokeColor: "#22c55e",
            strokeWeight: 4,
          },
        })

        directionsService.route(
          {
            origin: DEMO_TRIP.pickup,
            destination: DEMO_TRIP.dropoff,
            travelMode: window.google.maps.TravelMode.DRIVING,
          },
          (result, status) => {
            if (status === "OK" && result) {
              directionsRenderer.setDirections(result)
            }
          }
        )

        setMapLoaded(true)
      } catch (error) {
        console.error("Failed to load Google Maps:", error)
      }
    }

    initMap()
  }, [])

  // Simulate driver movement
  useEffect(() => {
    const interval = setInterval(() => {
      setDriverPosition((prev) => {
        const newPos = {
          lat: prev.lat + (Math.random() - 0.5) * 0.002,
          lng: prev.lng + (Math.random() - 0.5) * 0.002,
        }
        driverMarkerRef.current?.setPosition(newPos)
        return newPos
      })
    }, 3000)

    return () => clearInterval(interval)
  }, [])

  const sendMessage = () => {
    if (!newMessage.trim()) return
    setMessages((prev) => [
      ...prev,
      { id: Date.now(), from: "rider", text: newMessage, time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }) },
    ])
    setNewMessage("")
  }

  return (
    <section className="py-16 bg-gray-900">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Live Ride Tracking</h2>
          <p className="text-gray-400 max-w-2xl mx-auto">
            Track your driver in real-time, chat, call safely, and manage your ride all in one place
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {/* Map Section */}
          <div className="lg:col-span-2 bg-gray-800 rounded-2xl overflow-hidden border border-gray-700">
            <div className="flex items-center justify-between p-4 border-b border-gray-700">
              <div className="flex items-center gap-2">
                <Navigation className="w-5 h-5 text-green-400" />
                <span className="font-semibold text-white">Live GPS Tracking</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                <span className="text-green-400 text-sm">Live</span>
              </div>
            </div>

            <div
              ref={mapRef}
              className="w-full h-[350px]"
              style={{ background: mapLoaded ? "transparent" : "#1f2937" }}
            />

            {/* Legend */}
            <div className="p-3 bg-gray-800/80 border-t border-gray-700 flex items-center gap-6">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-green-500 rounded-full" />
                <span className="text-gray-400 text-sm">Pickup</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-red-500 rounded-full" />
                <span className="text-gray-400 text-sm">Dropoff</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-blue-500 rounded-full" />
                <span className="text-gray-400 text-sm">Driver</span>
              </div>
            </div>

            {/* Trip Info */}
            <div className="p-4 bg-gray-800 border-t border-gray-700 grid grid-cols-4 gap-4">
              <div>
                <p className="text-gray-400 text-xs">Ride ID</p>
                <p className="text-white font-semibold">{DEMO_TRIP.id}</p>
              </div>
              <div>
                <p className="text-gray-400 text-xs">Status</p>
                <p className="text-green-400 font-semibold">{DEMO_TRIP.status}</p>
              </div>
              <div>
                <p className="text-gray-400 text-xs">Estimated Fare</p>
                <p className="text-white font-semibold">${DEMO_TRIP.estimatedFare.toFixed(2)}</p>
              </div>
              <div>
                <button className="px-4 py-2 bg-green-500/20 text-green-400 rounded-lg text-sm font-medium flex items-center gap-2">
                  <Shield className="w-4 h-4" />
                  AUTHORIZED
                </button>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-4">
            {/* Driver Info */}
            <div className="bg-gray-800 rounded-xl p-4 border border-gray-700">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 bg-green-500 rounded-full flex items-center justify-center text-white font-bold text-lg">
                  {DEMO_TRIP.driver.initials}
                </div>
                <div className="flex-1">
                  <h4 className="text-white font-semibold">{DEMO_TRIP.driver.name}</h4>
                  <p className="text-gray-400 text-sm">{DEMO_TRIP.driver.vehicle} - {DEMO_TRIP.driver.plate}</p>
                  <div className="flex items-center gap-1 mt-1">
                    <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                    <span className="text-white font-medium">{DEMO_TRIP.driver.rating}</span>
                    <span className="text-gray-500 text-sm">({DEMO_TRIP.driver.totalRides.toLocaleString()} rides)</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Chat */}
            <div className="bg-gray-800 rounded-xl border border-gray-700 overflow-hidden">
              <div className="p-3 border-b border-gray-700 flex items-center gap-2">
                <MessageCircle className="w-4 h-4 text-gray-400" />
                <span className="text-white font-medium text-sm">Chat with Driver</span>
              </div>
              <div className="h-40 overflow-y-auto p-3 space-y-2">
                {messages.map((msg) => (
                  <div
                    key={msg.id}
                    className={`flex ${msg.from === "rider" ? "justify-end" : "justify-start"}`}
                  >
                    <div
                      className={`max-w-[80%] px-3 py-2 rounded-xl text-sm ${
                        msg.from === "rider"
                          ? "bg-green-500 text-white"
                          : "bg-gray-700 text-gray-200"
                      }`}
                    >
                      {msg.text}
                    </div>
                  </div>
                ))}
              </div>
              <div className="p-3 border-t border-gray-700 flex gap-2">
                <input
                  type="text"
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && sendMessage()}
                  placeholder="Message your driver..."
                  className="flex-1 bg-gray-700 border-none rounded-lg px-3 py-2 text-white text-sm placeholder-gray-400 focus:ring-2 focus:ring-green-500"
                />
                <button
                  onClick={sendMessage}
                  className="p-2 bg-green-500 rounded-lg hover:bg-green-600 transition-colors"
                >
                  <Navigation className="w-4 h-4 text-white" />
                </button>
              </div>
            </div>

            {/* Safe Calling */}
            <div className="bg-gray-800 rounded-xl p-4 border border-gray-700">
              <div className="flex items-center gap-2 mb-3">
                <Phone className="w-4 h-4 text-green-400" />
                <span className="text-white font-medium text-sm">Safe Calling</span>
              </div>
              <p className="text-gray-400 text-xs mb-3">Your number stays private</p>
              <button className="w-full py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg font-medium text-sm flex items-center justify-center gap-2 transition-colors">
                <Phone className="w-4 h-4" />
                Start Masked Call
              </button>
              <p className="text-gray-500 text-xs text-center mt-2">Status: Ready</p>
            </div>

            {/* Request Refund */}
            <div className="bg-gray-800 rounded-xl p-4 border border-gray-700">
              <div className="flex items-center gap-2 mb-3">
                <RefreshCw className="w-4 h-4 text-gray-400" />
                <span className="text-white font-medium text-sm">Request Refund</span>
              </div>
              <input
                type="text"
                placeholder="Enter reason..."
                className="w-full bg-gray-700 border-none rounded-lg px-3 py-2 text-white text-sm placeholder-gray-400 mb-2"
              />
              <div className="flex items-center gap-2 mb-3">
                <span className="text-gray-400 text-sm">Amount ($)</span>
                <input
                  type="number"
                  defaultValue="5.00"
                  className="flex-1 bg-gray-700 border-none rounded-lg px-3 py-2 text-white text-sm"
                />
              </div>
              <button className="w-full py-2 border border-red-500/50 text-red-400 rounded-lg font-medium text-sm hover:bg-red-500/10 transition-colors">
                Submit Refund
              </button>
              <p className="text-gray-500 text-xs text-center mt-2">Status: No refund requested</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
