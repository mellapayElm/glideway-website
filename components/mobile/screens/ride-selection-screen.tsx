"use client"

import { useState } from "react"
import { ChevronLeft, MapPin, Clock, Users, Star, Shield, DollarSign, Info, Calendar } from "lucide-react"

const RIDE_OPTIONS = [
  {
    id: "economy",
    name: "Economy",
    icon: "🚗",
    price: "$26.96",
    time: "8 min",
    seats: 4,
    description: "Standard ride at an affordable price",
    features: ["Newer cars", "Professional drivers", "Dash cam for safety"],
    rating: 4.8,
    info: "Matched with a nearby driver"
  },
  {
    id: "comfort",
    name: "Comfort",
    icon: "🚙",
    price: "$29.96",
    time: "7 min",
    seats: 4,
    description: "Upgrade to a more spacious vehicle",
    features: ["Roomier cars", "Top-rated drivers", "Extra legroom"],
    rating: 4.9,
    info: "Newer, roomier rides with top-rated drivers"
  },
  {
    id: "xl",
    name: "XL",
    icon: "🚐",
    price: "$35.96",
    time: "10 min",
    seats: 6,
    description: "Room for the whole crew",
    features: ["Fits up to 6 passengers", "Extra luggage space", "Perfect for groups"],
    rating: 4.7,
    info: "Seats for 6 plus extra room for bags"
  },
  {
    id: "premium",
    name: "Premium",
    icon: "✨",
    price: "$45.96",
    time: "6 min",
    seats: 4,
    description: "First-class comfort experience",
    features: ["Luxury vehicles", "Elite drivers", "Premium experience"],
    rating: 4.95,
    info: "Premium vehicles with the finest drivers"
  },
]

interface RideSelectionScreenProps {
  onBack?: () => void
  onSelect?: (rideId: string) => void
  selectedRide?: string
}

export function RideSelectionScreen({ onBack, onSelect, selectedRide = "economy" }: RideSelectionScreenProps) {
  const [expandedRide, setExpandedRide] = useState<string | null>(selectedRide)

  return (
    <div className="w-full min-h-screen bg-gray-950 flex flex-col">
      {/* Status Bar */}
      <div className="bg-gray-900 text-white px-4 py-2 flex items-center justify-between text-xs font-medium border-b border-gray-800">
        <span>12:26</span>
        <div className="flex items-center gap-1">
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
            <path d="M1 9l2 2c4.97-4.97 13.03-4.97 18 0l2-2C16.93 2.93 7.08 2.93 1 9zm8 8l3 3 3-3c-1.65-1.66-4.34-1.66-6 0zm-4-4l2 2c2.76-2.76 7.24-2.76 10 0l2-2C15.14 9.14 8.87 9.14 5 13z"/>
          </svg>
          <svg className="w-5 h-4" fill="currentColor" viewBox="0 0 24 24">
            <rect x="2" y="7" width="18" height="10" rx="2" stroke="currentColor" strokeWidth="1" fill="none"/>
            <rect x="20" y="10" width="2" height="4" rx="0.5" fill="currentColor"/>
            <rect x="4" y="9" width="12" height="6" rx="1" fill="currentColor"/>
          </svg>
        </div>
      </div>

      {/* Header */}
      <div className="bg-gray-900 border-b border-gray-800 px-4 py-4">
        <div className="flex items-center gap-3 mb-4">
          <button
            onClick={onBack}
            className="flex items-center gap-2 text-lime-400 hover:text-lime-300 transition-colors"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <div>
            <h1 className="text-white font-bold">Choose a ride</h1>
            <p className="text-gray-400 text-sm">From 456 Business Ave to Home</p>
          </div>
        </div>

        {/* Trip Info */}
        <div className="flex items-center gap-2 bg-gray-800/40 border border-gray-700 rounded-lg px-3 py-2 text-sm">
          <MapPin className="w-4 h-4 text-lime-400" />
          <span className="text-gray-300">2.5 miles</span>
          <Clock className="w-4 h-4 text-lime-400 ml-2" />
          <span className="text-gray-300">~12 min</span>
        </div>
      </div>

      {/* Ride Options */}
      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-2">
        {RIDE_OPTIONS.map((ride) => (
          <div
            key={ride.id}
            className={`rounded-lg border transition-all ${
              selectedRide === ride.id
                ? "bg-lime-400/10 border-lime-400 shadow-lg shadow-lime-400/20"
                : "bg-gray-800/40 border-gray-700"
            }`}
          >
            {/* Main Button */}
            <button
              onClick={() => {
                setExpandedRide(expandedRide === ride.id ? null : ride.id)
                onSelect?.(ride.id)
              }}
              className="w-full px-4 py-4 flex items-center gap-4 hover:bg-gray-700/30 transition-colors"
            >
              {/* Car Icon */}
              <div className="text-4xl flex-shrink-0">{ride.icon}</div>

              {/* Details */}
              <div className="flex-1 text-left">
                <h3 className="font-bold text-white text-lg">{ride.name}</h3>
                <p className="text-sm text-gray-400 mb-1">{ride.description}</p>
                <div className="flex items-center gap-3 text-xs text-gray-500">
                  <div className="flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    <span>in {ride.time}</span>
                  </div>
                  <span>•</span>
                  <div className="flex items-center gap-1">
                    <Users className="w-3 h-3" />
                    <span>{ride.seats} seats</span>
                  </div>
                  <span>•</span>
                  <div className="flex items-center gap-1">
                    <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                    <span>{ride.rating}</span>
                  </div>
                </div>
              </div>

              {/* Price */}
              <div className="text-right flex-shrink-0">
                <div className="font-bold text-lime-400 text-2xl">{ride.price}</div>
              </div>
            </button>

            {/* Expanded Details */}
            {expandedRide === ride.id && (
              <div className="px-4 pb-4 border-t border-gray-700 space-y-4">
                {/* Info Banner */}
                <div className="flex items-start gap-3 bg-blue-500/10 border border-blue-500/30 rounded-lg p-3">
                  <Info className="w-4 h-4 text-blue-400 flex-shrink-0 mt-0.5" />
                  <p className="text-sm text-blue-300">{ride.info}</p>
                </div>

                {/* Features */}
                <div className="space-y-2">
                  <p className="text-xs font-semibold text-gray-400 uppercase">Features</p>
                  {ride.features.map((feature, idx) => (
                    <div key={idx} className="flex items-center gap-2 text-sm text-gray-300">
                      <div className="w-1 h-1 bg-lime-400 rounded-full" />
                      <span>{feature}</span>
                    </div>
                  ))}
                </div>

                {/* Select Button */}
                <button
                  onClick={() => onSelect?.(ride.id)}
                  className="w-full bg-lime-400 hover:bg-lime-500 text-gray-950 font-bold py-3 px-4 rounded-lg transition-all duration-300 mt-2"
                >
                  Select {ride.name}
                </button>
              </div>
            )}
          </div>
        ))}

        <div className="h-4" />
      </div>

      {/* Bottom Action - Sticky */}
      <div className="bg-gray-900 border-t border-gray-800 px-4 py-4">
        <div className="flex items-center justify-between mb-4">
          <div>
            <p className="text-gray-400 text-sm">Estimated fare</p>
            <p className="text-2xl font-bold text-white">
              {RIDE_OPTIONS.find(r => r.id === selectedRide)?.price}
            </p>
          </div>
          <div className="flex gap-2">
            <button className="flex-1 bg-gray-800 hover:bg-gray-700 text-white font-semibold py-3 px-4 rounded-lg transition-colors flex items-center justify-center gap-2">
              <DollarSign className="w-5 h-5" />
              Add payment
            </button>
            <button className="flex-1 bg-gray-800 hover:bg-gray-700 text-white font-semibold py-3 px-4 rounded-lg transition-colors flex items-center justify-center gap-2">
              <Calendar className="w-5 h-5" />
              Schedule
            </button>
          </div>
        </div>

        <button className="w-full bg-lime-400 hover:bg-lime-500 text-gray-950 font-bold py-4 px-6 rounded-lg transition-all duration-300 transform hover:scale-105">
          Confirm {RIDE_OPTIONS.find(r => r.id === selectedRide)?.name}
        </button>
      </div>
    </div>
  )
}
