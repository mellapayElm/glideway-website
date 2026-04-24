"use client"

import { useState, useEffect } from "react"
import { Search, Calendar, Users, MapPin, Clock } from "lucide-react"

const RIDE_TYPES = [
  { id: "economy", name: "Economy", icon: "🚗", price: "$26.96", time: "in 8 min", seats: 4 },
  { id: "comfort", name: "Comfort", icon: "🚙", price: "$29.96", time: "in 7 min", seats: 4 },
  { id: "xl", name: "XL", icon: "🚐", price: "$35.96", time: "in 10 min", seats: 6 },
  { id: "premium", name: "Premium", icon: "✨", price: "$45.96", time: "in 6 min", seats: 4 },
]

const SHORTCUTS = [
  { id: "work", icon: "💼", label: "Work", description: "456 Business Ave" },
  { id: "home", icon: "🏠", label: "Home", description: "123 Main St" },
]

interface ActiveRide {
  id: string
  status: "searching" | "driver_assigned" | "arriving" | "in_trip" | "completed"
  driver?: {
    name: string
    rating: number
    photo: string
    vehicle: string
    plate: string
    phone: string
  }
  pickup: string
  dropoff: string
  fare: number
  eta: number
}

interface HomeScreenProps {
  activeRide: ActiveRide | null
  setActiveRide: (ride: ActiveRide | null) => void
  isTracking: boolean
  setIsTracking: (tracking: boolean) => void
}

export function HomeScreen({ activeRide, setActiveRide, isTracking, setIsTracking }: HomeScreenProps) {
  const [pickup, setPickup] = useState("Current location")
  const [dropoff, setDropoff] = useState("")
  const [selectedRide, setSelectedRide] = useState("economy")
  const [greeting, setGreeting] = useState("Happy Friday")

  // Set greeting based on time of day
  useEffect(() => {
    const hour = new Date().getHours()
    if (hour < 12) setGreeting("Happy Friday")
    else if (hour < 17) setGreeting("Good Afternoon")
    else setGreeting("Good Evening")
  }, [])

  const handleRideSelect = (rideId: string) => {
    setSelectedRide(rideId)
  }

  const handleBookRide = () => {
    if (!pickup || !dropoff) {
      alert("Please enter both pickup and dropoff locations")
      return
    }

    const rideType = RIDE_TYPES.find(r => r.id === selectedRide)
    const fare = parseFloat(rideType?.price.replace("$", "") || "26.96")

    setIsTracking(true)
    setActiveRide({
      id: `ride-${Date.now()}`,
      status: "searching",
      pickup,
      dropoff,
      fare,
      eta: 5,
    })

    // Simulate finding driver after 3 seconds
    setTimeout(() => {
      setActiveRide(prev => prev ? {
        ...prev,
        status: "driver_assigned",
        driver: {
          name: "Michael Johnson",
          rating: 4.9,
          photo: "/driver.jpg",
          vehicle: "Toyota Camry (White)",
          plate: "ABC-1234",
          phone: "+1 (555) 123-4567",
        },
        eta: 4,
      } : null)
    }, 3000)
  }

  // Show active ride screen if tracking
  if (isTracking && activeRide) {
    return (
      <div className="flex flex-col h-full bg-gray-950">
        {/* Map background placeholder */}
        <div className="flex-1 bg-gradient-to-br from-gray-900 via-gray-950 to-black flex items-center justify-center relative">
          <div className="absolute inset-0 opacity-20">
            <svg className="w-full h-full" viewBox="0 0 400 400" fill="none">
              <circle cx="200" cy="200" r="150" stroke="#7CFF3A" strokeWidth="0.5" opacity="0.1"/>
              <circle cx="200" cy="200" r="100" stroke="#7CFF3A" strokeWidth="0.5" opacity="0.1"/>
              <path d="M 100 200 Q 150 150 200 100 Q 250 150 300 200" stroke="#7CFF3A" strokeWidth="1" opacity="0.1"/>
            </svg>
          </div>

          {/* Status overlay */}
          <div className="relative z-10 text-center">
            <div className="text-6xl mb-4">🚗</div>
            <h2 className="text-2xl font-bold text-white mb-2">
              {activeRide.status === "searching" ? "Finding your driver..." : "Driver assigned!"}
            </h2>
            <p className="text-gray-400 mb-4">ETA: {activeRide.eta} minutes</p>
            
            {activeRide.driver && (
              <div className="bg-gray-800/80 backdrop-blur-sm rounded-lg p-4 mt-4 text-left max-w-sm">
                <p className="text-white font-semibold mb-2">{activeRide.driver.name}</p>
                <p className="text-gray-400 text-sm mb-2">{activeRide.driver.vehicle}</p>
                <p className="text-lime-400 font-medium">⭐ {activeRide.driver.rating}</p>
              </div>
            )}
          </div>
        </div>

        {/* Trip info */}
        <div className="bg-gray-900 border-t border-gray-800 p-4 space-y-3">
          <div className="flex items-center gap-3">
            <MapPin className="w-5 h-5 text-lime-400" />
            <div className="flex-1 text-sm">
              <p className="text-gray-400">Pickup</p>
              <p className="text-white font-medium">{activeRide.pickup}</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <MapPin className="w-5 h-5 text-lime-400" />
            <div className="flex-1 text-sm">
              <p className="text-gray-400">Dropoff</p>
              <p className="text-white font-medium">{activeRide.dropoff}</p>
            </div>
          </div>
          <button 
            onClick={() => {
              setIsTracking(false)
              setActiveRide(null)
            }}
            className="w-full bg-gray-800 hover:bg-gray-700 text-white font-medium py-3 rounded-lg transition-colors"
          >
            Cancel Ride
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="flex flex-col h-full bg-gray-950 overflow-hidden">
      {/* Map Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-gray-900 via-gray-950 to-black">
        <div className="absolute inset-0 opacity-20">
          <svg className="w-full h-full" viewBox="0 0 400 400" fill="none">
            <circle cx="200" cy="200" r="150" stroke="#7CFF3A" strokeWidth="0.5" opacity="0.1"/>
            <circle cx="200" cy="200" r="100" stroke="#7CFF3A" strokeWidth="0.5" opacity="0.1"/>
            <path d="M 100 200 Q 150 150 200 100 Q 250 150 300 200" stroke="#7CFF3A" strokeWidth="1" opacity="0.1"/>
          </svg>
        </div>
        <div className="absolute top-1/4 right-1/4 w-64 h-64 bg-lime-400/5 rounded-full blur-3xl" />
      </div>

      {/* Content */}
      <div className="relative z-10 flex flex-col h-full">
        {/* Header */}
        <div className="px-4 pt-4 pb-2">
          <h2 className="text-2xl font-bold text-white mb-1">{greeting}</h2>
        </div>

        {/* Search Box */}
        <div className="px-4 pb-4 space-y-2">
          <input
            type="text"
            placeholder="Where are you going?"
            value={dropoff}
            onChange={(e) => setDropoff(e.target.value)}
            className="w-full bg-gray-800/80 hover:bg-gray-700 backdrop-blur-sm border border-gray-700 hover:border-lime-400/30 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-lime-400 transition-all"
          />
        </div>

        {/* Quick Actions */}
        <div className="px-4 pb-4 flex gap-2">
          <button className="flex-1 flex items-center gap-2 bg-gray-800/50 hover:bg-gray-700 border border-gray-700 rounded-full px-4 py-2.5 transition-colors text-gray-300 font-medium text-sm">
            <Calendar className="w-4 h-4 text-lime-400" />
            <span>Schedule</span>
          </button>
          <button className="flex-1 flex items-center gap-2 bg-gray-800/50 hover:bg-gray-700 border border-gray-700 rounded-full px-4 py-2.5 transition-colors text-gray-300 font-medium text-sm">
            <Users className="w-4 h-4 text-lime-400" />
            <span>Change rider</span>
          </button>
        </div>

        {/* Shortcuts Section */}
        <div className="px-4 pb-4 space-y-2">
          {SHORTCUTS.map((shortcut) => (
            <button
              key={shortcut.id}
              className="w-full flex items-center gap-4 bg-gray-800/40 hover:bg-gray-700/60 border border-gray-700 rounded-lg px-4 py-3 transition-all group"
            >
              <span className="text-2xl">{shortcut.icon}</span>
              <div className="flex-1 text-left">
                <p className="font-medium text-white group-hover:text-lime-400 transition-colors">{shortcut.label}</p>
                <p className="text-xs text-gray-500">Add shortcut</p>
              </div>
            </button>
          ))}
        </div>

        {/* Divider */}
        <div className="px-4 mb-3">
          <div className="flex items-center gap-4">
            <div className="flex-1 h-px bg-gray-800" />
            <span className="text-gray-500 text-xs font-medium">More ways to ride</span>
            <div className="flex-1 h-px bg-gray-800" />
          </div>
        </div>

        {/* Ride Types */}
        <div className="flex-1 overflow-y-auto px-4 pb-4 space-y-2">
          {RIDE_TYPES.map((ride) => (
            <button
              key={ride.id}
              onClick={() => handleRideSelect(ride.id)}
              className={`w-full rounded-lg p-3 transition-all border ${
                selectedRide === ride.id
                  ? "bg-lime-400/20 border-lime-400 shadow-lg shadow-lime-400/20"
                  : "bg-gray-800/40 border-gray-700 hover:bg-gray-700/60"
              }`}
            >
              <div className="flex items-center gap-3">
                <div className="text-3xl flex-shrink-0">{ride.icon}</div>
                <div className="flex-1 text-left">
                  <h3 className="font-semibold text-white text-sm">{ride.name}</h3>
                  <div className="flex items-center gap-1.5 text-xs text-gray-400">
                    <Clock className="w-3 h-3" />
                    <span>{ride.time}</span>
                    <span>•</span>
                    <Users className="w-3 h-3" />
                    <span>{ride.seats}</span>
                  </div>
                </div>
                <div className="font-bold text-white text-right">{ride.price}</div>
              </div>
            </button>
          ))}
          <div className="h-2" />
        </div>

        {/* Confirm Button */}
        <div className="px-4 pb-4 border-t border-gray-800 pt-4">
          <button 
            onClick={handleBookRide}
            disabled={!pickup || !dropoff}
            className="w-full bg-lime-400 hover:bg-lime-500 disabled:bg-gray-700 disabled:text-gray-500 text-gray-950 font-bold py-4 rounded-lg transition-all duration-300 transform hover:scale-105 active:scale-95"
          >
            Confirm {RIDE_TYPES.find(r => r.id === selectedRide)?.name || "Ride"}
          </button>
        </div>
      </div>
    </div>
  )
}
