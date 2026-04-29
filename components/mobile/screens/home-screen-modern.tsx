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
    <div className="flex flex-col h-full bg-white overflow-hidden">
      {/* Map Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-gray-900 via-gray-950 to-black">
        <div className="absolute inset-0 opacity-20">
          <svg className="w-full h-full" viewBox="0 0 400 400" fill="none">
            <circle cx="200" cy="200" r="150" stroke="#7CFF3A" strokeWidth="0.5" opacity="0.1"/>
            <circle cx="200" cy="200" r="100" stroke="#7CFF3A" strokeWidth="0.5" opacity="0.1"/>
            <path d="M 100 200 Q 150 150 200 100 Q 250 150 300 200" stroke="#7CFF3A" strokeWidth="1" opacity="0.1"/>
          </svg>
        </div>
        <div className="absolute top-1/4 right-1/4 w-64 h-64 bg-green-500/5 rounded-full blur-3xl" />
      </div>

      {/* Content */}
      <div className="relative z-10 flex flex-col h-full">
        {/* Header */}
        <div className="px-4 pt-4 pb-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-1">Happy Friday</h2>
          <p className="text-gray-600 text-sm">Where are you going?</p>
        </div>

        {/* Search Box */}
        <div className="px-4 pb-4">
          <button className="w-full bg-green-50/80 hover:bg-green-100 backdrop-blur-sm border border-green-200 hover:border-green-500/30 rounded-lg px-4 py-3 flex items-center gap-3 transition-all group">
            <Search className="w-5 h-5 text-green-500 group-hover:text-lime-300" />
            <input
              type="text"
              placeholder="Where are you going?"
              className="bg-transparent text-gray-900 placeholder-gray-500 focus:outline-none w-full"
            />
          </button>
        </div>

        {/* Quick Actions */}
        <div className="px-4 pb-6 flex gap-3">
          <button className="flex-1 flex items-center gap-2 bg-green-50/50 hover:bg-green-100 border border-green-200 rounded-full px-4 py-2.5 transition-colors">
            <Calendar className="w-4 h-4 text-green-500" />
            <span className="text-sm font-medium text-gray-700">Schedule</span>
          </button>
          <button className="flex-1 flex items-center gap-2 bg-green-50/50 hover:bg-green-100 border border-green-200 rounded-full px-4 py-2.5 transition-colors">
            <Users className="w-4 h-4 text-green-500" />
            <span className="text-sm font-medium text-gray-700">Change rider</span>
          </button>
        </div>

        {/* Shortcuts Section */}
        <div className="px-4 pb-6 space-y-2">
          {SHORTCUTS.map((shortcut) => (
            <button
              key={shortcut.id}
              className="w-full flex items-center gap-4 bg-green-50/40 hover:bg-green-100/60 border border-green-200 rounded-lg px-4 py-3 transition-all group"
            >
              <span className="text-2xl">{shortcut.icon}</span>
              <div className="flex-1 text-left">
                <p className="font-medium text-gray-900 group-hover:text-green-500 transition-colors">{shortcut.label}</p>
                <p className="text-xs text-gray-500">Add shortcut</p>
              </div>
            </button>
          ))}
        </div>

        {/* Divider */}
        <div className="px-4 mb-6">
          <div className="flex items-center gap-4">
            <div className="flex-1 h-px bg-green-50" />
            <span className="text-gray-500 text-xs font-medium">More ways to ride</span>
            <div className="flex-1 h-px bg-green-50" />
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
                  ? "bg-green-500/20 border-green-500 shadow-lg shadow-green-500/20"
                  : "bg-green-50/40 border-green-200 hover:bg-green-100/60 hover:border-gray-600"
              }`}
            >
              <div className="flex items-center gap-4">
                {/* Car Icon */}
                <div className="text-4xl flex-shrink-0">{ride.icon}</div>

                {/* Details */}
                <div className="flex-1 text-left">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="font-semibold text-gray-900">{ride.name}</h3>
                    {ride.id === "comfort" && (
                      <span className="text-xs bg-green-500/20 text-green-500 px-2 py-0.5 rounded">New</span>
                    )}
                  </div>
                  <div className="flex items-center gap-2 text-xs text-gray-600">
                    <Clock className="w-3 h-3" />
                    <span>{ride.time}</span>
                    <span>•</span>
                    <Users className="w-3 h-3" />
                    <span>{ride.seats} seats</span>
                  </div>
                </div>

                {/* Price */}
                <div className="text-right flex-shrink-0">
                  <div className="font-bold text-gray-900 text-lg">{ride.price}</div>
                </div>
              </div>
            </button>
          ))}

          {/* Promo Section */}
          <div className="bg-gradient-to-r from-gray-800/40 to-gray-800/20 border border-green-200 rounded-lg p-4 mt-4">
            <div className="flex items-center gap-3">
              <div className="text-2xl">🎉</div>
              <div className="flex-1 text-left">
                <p className="font-medium text-gray-900 text-sm">Special offer</p>
                <p className="text-xs text-gray-600">Get $10 off your next ride</p>
              </div>
              <div className="text-green-500 text-xs font-semibold">Apply →</div>
            </div>
          </div>

          {/* Bottom Spacing */}
          <div className="h-4" />
        </div>

        {/* Footer Button */}
        <div className="px-4 pb-4 border-t border-green-200 pt-4">
          <button className="w-full bg-green-500 hover:bg-lime-500 text-gray-950 font-bold py-4 px-6 rounded-lg transition-all duration-300 transform hover:scale-105">
            Confirm {RIDE_TYPES.find(r => r.id === selectedRide)?.name || "Ride"}
          </button>
        </div>
      </div>
    </div>
  )
}
