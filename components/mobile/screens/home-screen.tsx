"use client"

import { useState } from "react"
import { Bell, Star, Clock, Shield, ChevronRight, Headphones, Gift, MapPin } from "lucide-react"

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
  const [greeting] = useState(() => {
    const hour = new Date().getHours()
    if (hour < 12) return "Good Morning"
    if (hour < 17) return "Good Afternoon"
    return "Good Evening"
  })

  const quickActions = [
    { icon: Clock, label: "Ride History", color: "bg-blue-100 text-blue-600" },
    { icon: Star, label: "Favorites", color: "bg-amber-100 text-amber-600" },
    { icon: Gift, label: "Promotions", color: "bg-green-100 text-green-600" },
    { icon: Headphones, label: "Support", color: "bg-purple-100 text-purple-600" },
  ]

  const recentTrips = [
    { id: 1, destination: "Downtown Mall", date: "Yesterday", price: "$12.50" },
    { id: 2, destination: "Airport Terminal B", date: "2 days ago", price: "$34.00" },
    { id: 3, destination: "University Campus", date: "Last week", price: "$8.75" },
  ]

  return (
    <div className="flex-1 bg-gray-50 overflow-y-auto">
      {/* Header */}
      <div className="bg-green-500 px-6 pt-6 pb-10 rounded-b-3xl">
        <div className="flex items-center justify-between mb-6">
          <div>
            <p className="text-green-100 text-sm">{greeting}</p>
            <h1 className="text-white text-2xl font-bold">Welcome to GlideWay</h1>
          </div>
          <button className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
            <Bell className="w-5 h-5 text-white" />
          </button>
        </div>

        {/* Stats Card */}
        <div className="bg-white rounded-2xl p-4 shadow-lg">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                <Shield className="w-6 h-6 text-green-600" />
              </div>
              <div>
                <p className="text-gray-500 text-sm">Your Rating</p>
                <div className="flex items-center gap-1">
                  <Star className="w-4 h-4 text-amber-400 fill-amber-400" />
                  <span className="font-bold text-gray-900">4.92</span>
                </div>
              </div>
            </div>
            <div className="text-right">
              <p className="text-gray-500 text-sm">Total Trips</p>
              <p className="font-bold text-gray-900">127</p>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="px-6 -mt-4">
        <div className="bg-white rounded-2xl p-4 shadow-sm">
          <h2 className="font-semibold text-gray-900 mb-4">Quick Actions</h2>
          <div className="grid grid-cols-4 gap-3">
            {quickActions.map((action) => (
              <button
                key={action.label}
                className="flex flex-col items-center gap-2"
              >
                <div className={`w-12 h-12 rounded-xl ${action.color} flex items-center justify-center`}>
                  <action.icon className="w-5 h-5" />
                </div>
                <span className="text-xs text-gray-600 text-center">{action.label}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Recent Trips */}
      <div className="px-6 mt-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-semibold text-gray-900">Recent Trips</h2>
          <button className="text-green-600 text-sm font-medium">View All</button>
        </div>
        <div className="space-y-3">
          {recentTrips.map((trip) => (
            <button
              key={trip.id}
              className="w-full bg-white rounded-xl p-4 flex items-center gap-4 shadow-sm"
            >
              <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center">
                <MapPin className="w-5 h-5 text-gray-500" />
              </div>
              <div className="flex-1 text-left">
                <p className="font-medium text-gray-900">{trip.destination}</p>
                <p className="text-sm text-gray-500">{trip.date}</p>
              </div>
              <div className="text-right">
                <p className="font-medium text-gray-900">{trip.price}</p>
                <ChevronRight className="w-4 h-4 text-gray-400 ml-auto" />
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Safety Banner */}
      <div className="px-6 mt-6 mb-6">
        <div className="bg-gradient-to-r from-green-500 to-green-600 rounded-2xl p-5">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
              <Shield className="w-6 h-6 text-white" />
            </div>
            <div className="flex-1">
              <h3 className="text-white font-semibold">Your Safety Matters</h3>
              <p className="text-green-100 text-sm">All drivers are background checked</p>
            </div>
            <ChevronRight className="w-5 h-5 text-white" />
          </div>
        </div>
      </div>
    </div>
  )
}
