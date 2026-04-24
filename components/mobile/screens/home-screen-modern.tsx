"use client"

import { useState } from "react"
import { Search, Calendar, Users, MapPin, Clock, Zap, Star } from "lucide-react"

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

interface HomeScreenModernProps {
  onRideSelect?: (rideType: string) => void
}

export function HomeScreenModern({ onRideSelect }: HomeScreenModernProps) {
  const [pickup, setPickup] = useState("Current location")
  const [dropoff, setDropoff] = useState("")
  const [selectedRide, setSelectedRide] = useState("economy")

  const handleRideSelect = (rideId: string) => {
    setSelectedRide(rideId)
    onRideSelect?.(rideId)
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
        <div className="px-4 pt-4 pb-6">
          <h2 className="text-2xl font-bold text-white mb-1">Happy Friday</h2>
          <p className="text-gray-400 text-sm">Where are you going?</p>
        </div>

        {/* Search Box */}
        <div className="px-4 pb-4">
          <button className="w-full bg-gray-800/80 hover:bg-gray-700 backdrop-blur-sm border border-gray-700 hover:border-lime-400/30 rounded-lg px-4 py-3 flex items-center gap-3 transition-all group">
            <Search className="w-5 h-5 text-lime-400 group-hover:text-lime-300" />
            <input
              type="text"
              placeholder="Where are you going?"
              className="bg-transparent text-white placeholder-gray-500 focus:outline-none w-full"
            />
          </button>
        </div>

        {/* Quick Actions */}
        <div className="px-4 pb-6 flex gap-3">
          <button className="flex-1 flex items-center gap-2 bg-gray-800/50 hover:bg-gray-700 border border-gray-700 rounded-full px-4 py-2.5 transition-colors">
            <Calendar className="w-4 h-4 text-lime-400" />
            <span className="text-sm font-medium text-gray-300">Schedule</span>
          </button>
          <button className="flex-1 flex items-center gap-2 bg-gray-800/50 hover:bg-gray-700 border border-gray-700 rounded-full px-4 py-2.5 transition-colors">
            <Users className="w-4 h-4 text-lime-400" />
            <span className="text-sm font-medium text-gray-300">Change rider</span>
          </button>
        </div>

        {/* Shortcuts Section */}
        <div className="px-4 pb-6 space-y-2">
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
        <div className="px-4 mb-6">
          <div className="flex items-center gap-4">
            <div className="flex-1 h-px bg-gray-800" />
            <span className="text-gray-500 text-xs font-medium">More ways to ride</span>
            <div className="flex-1 h-px bg-gray-800" />
          </div>
        </div>

        {/* Ride Types - Scrollable */}
        <div className="flex-1 overflow-y-auto px-4 pb-4 space-y-3">
          {RIDE_TYPES.map((ride) => (
            <button
              key={ride.id}
              onClick={() => handleRideSelect(ride.id)}
              className={`w-full rounded-lg p-4 transition-all border ${
                selectedRide === ride.id
                  ? "bg-lime-400/20 border-lime-400 shadow-lg shadow-lime-400/20"
                  : "bg-gray-800/40 border-gray-700 hover:bg-gray-700/60 hover:border-gray-600"
              }`}
            >
              <div className="flex items-center gap-4">
                {/* Car Icon */}
                <div className="text-4xl flex-shrink-0">{ride.icon}</div>

                {/* Details */}
                <div className="flex-1 text-left">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="font-semibold text-white">{ride.name}</h3>
                    {ride.id === "comfort" && (
                      <span className="text-xs bg-lime-400/20 text-lime-400 px-2 py-0.5 rounded">New</span>
                    )}
                  </div>
                  <div className="flex items-center gap-2 text-xs text-gray-400">
                    <Clock className="w-3 h-3" />
                    <span>{ride.time}</span>
                    <span>•</span>
                    <Users className="w-3 h-3" />
                    <span>{ride.seats} seats</span>
                  </div>
                </div>

                {/* Price */}
                <div className="text-right flex-shrink-0">
                  <div className="font-bold text-white text-lg">{ride.price}</div>
                </div>
              </div>
            </button>
          ))}

          {/* Promo Section */}
          <div className="bg-gradient-to-r from-gray-800/40 to-gray-800/20 border border-gray-700 rounded-lg p-4 mt-4">
            <div className="flex items-center gap-3">
              <div className="text-2xl">🎉</div>
              <div className="flex-1 text-left">
                <p className="font-medium text-white text-sm">Special offer</p>
                <p className="text-xs text-gray-400">Get $10 off your next ride</p>
              </div>
              <div className="text-lime-400 text-xs font-semibold">Apply →</div>
            </div>
          </div>

          {/* Bottom Spacing */}
          <div className="h-4" />
        </div>

        {/* Footer Button */}
        <div className="px-4 pb-4 border-t border-gray-800 pt-4">
          <button className="w-full bg-lime-400 hover:bg-lime-500 text-gray-950 font-bold py-4 px-6 rounded-lg transition-all duration-300 transform hover:scale-105">
            Confirm {RIDE_TYPES.find(r => r.id === selectedRide)?.name || "Ride"}
          </button>
        </div>
      </div>
    </div>
  )
}
