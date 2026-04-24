"use client"

import { useState, useEffect } from "react"

// Ride type options with colors
const RIDE_TYPES = [
  { id: "economy", name: "Economy", icon: "🚗", price: 1.0, color: "#22c55e", time: "3 min" },
  { id: "comfort", name: "Comfort", icon: "🚙", price: 1.5, color: "#3b82f6", time: "5 min" },
  { id: "xl", name: "XL", icon: "🚐", price: 2.0, color: "#8b5cf6", time: "7 min" },
  { id: "premium", name: "Premium", icon: "✨", price: 2.5, color: "#f59e0b", time: "4 min" },
]

export function GlideWayRide() {
  const [pickup, setPickup] = useState("")
  const [dropoff, setDropoff] = useState("")
  const [selectedRide, setSelectedRide] = useState("economy")
  const [scheduleType, setScheduleType] = useState("now")
  const [scheduledTime, setScheduledTime] = useState("")
  const [promoCode, setPromoCode] = useState("")
  const [driverNote, setDriverNote] = useState("")
  const [estimatedFare, setEstimatedFare] = useState(0)
  const [estimatedDistance, setEstimatedDistance] = useState(0)
  const [isSearching, setIsSearching] = useState(false)

  // Calculate fare estimate in real-time
  useEffect(() => {
    if (pickup && dropoff) {
      // Simulate distance calculation (in real app, use Google Distance Matrix API)
      const mockDistance = Math.random() * 10 + 2 // 2-12 miles
      setEstimatedDistance(parseFloat(mockDistance.toFixed(1)))
      
      const selectedRideType = RIDE_TYPES.find(r => r.id === selectedRide)
      const baseFare = 2.50
      const perMile = 1.75 * (selectedRideType?.price || 1)
      const fare = baseFare + (mockDistance * perMile)
      setEstimatedFare(parseFloat(fare.toFixed(2)))
    } else {
      setEstimatedFare(0)
      setEstimatedDistance(0)
    }
  }, [pickup, dropoff, selectedRide])

  // Handle search
  const handleSearch = () => {
    if (!pickup || !dropoff) {
      alert("Please enter both pickup and dropoff locations")
      return
    }
    setIsSearching(true)
    setTimeout(() => {
      setIsSearching(false)
      alert(`Searching for ${RIDE_TYPES.find(r => r.id === selectedRide)?.name} ride...`)
    }, 2000)
  }

  // Get current location
  const getCurrentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setPickup(`${position.coords.latitude.toFixed(4)}, ${position.coords.longitude.toFixed(4)}`)
        },
        () => alert("Unable to get location. Please enable location access.")
      )
    } else {
      alert("Geolocation is not supported by your browser")
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-blue-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-green-600 rounded-xl flex items-center justify-center shadow-lg">
              <span className="text-white font-bold text-lg">G</span>
            </div>
            <div>
              <h1 className="text-2xl font-bold">
                <span className="text-green-600">Glide</span>
                <span className="text-gray-800">Way</span>
              </h1>
              <p className="text-xs text-gray-500">Ride smoothly, safely</p>
            </div>
          </div>
          <button className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg font-medium transition-colors">
            Sign In
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-2 gap-8">
          
          {/* Left Panel - Booking Form */}
          <div className="bg-white rounded-2xl shadow-xl p-6 border border-gray-100">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Book Your Ride</h2>
            
            {/* Pickup Location */}
            <div className="mb-4">
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Pickup Location
              </label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-green-500 text-xl">●</span>
                <input
                  type="text"
                  value={pickup}
                  onChange={(e) => setPickup(e.target.value)}
                  placeholder="Enter pickup address"
                  className="w-full pl-10 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:border-green-500 focus:ring-2 focus:ring-green-200 outline-none transition-all text-gray-900 placeholder-gray-400"
                />
              </div>
              <button
                onClick={getCurrentLocation}
                className="mt-2 flex items-center gap-2 text-green-600 hover:text-green-700 text-sm font-medium"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                Use Current Location
              </button>
            </div>

            {/* Dropoff Location */}
            <div className="mb-6">
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Dropoff Location
              </label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-red-500 text-xl">■</span>
                <input
                  type="text"
                  value={dropoff}
                  onChange={(e) => setDropoff(e.target.value)}
                  placeholder="Enter destination address"
                  className="w-full pl-10 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:border-green-500 focus:ring-2 focus:ring-green-200 outline-none transition-all text-gray-900 placeholder-gray-400"
                />
              </div>
            </div>

            {/* Schedule */}
            <div className="mb-6">
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                When do you need a ride?
              </label>
              <div className="flex gap-3">
                <button
                  onClick={() => setScheduleType("now")}
                  className={`flex-1 py-3 rounded-xl font-medium transition-all ${
                    scheduleType === "now"
                      ? "bg-green-500 text-white shadow-lg"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
                >
                  Now
                </button>
                <button
                  onClick={() => setScheduleType("later")}
                  className={`flex-1 py-3 rounded-xl font-medium transition-all ${
                    scheduleType === "later"
                      ? "bg-green-500 text-white shadow-lg"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
                >
                  Schedule Later
                </button>
              </div>
              {scheduleType === "later" && (
                <input
                  type="datetime-local"
                  value={scheduledTime}
                  onChange={(e) => setScheduledTime(e.target.value)}
                  className="w-full mt-3 px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-green-500 outline-none"
                />
              )}
            </div>

            {/* Ride Types */}
            <div className="mb-6">
              <label className="block text-sm font-semibold text-gray-700 mb-3">
                Choose Ride Type
              </label>
              <div className="grid grid-cols-2 gap-3">
                {RIDE_TYPES.map((ride) => (
                  <button
                    key={ride.id}
                    onClick={() => setSelectedRide(ride.id)}
                    className={`p-4 rounded-xl border-2 transition-all ${
                      selectedRide === ride.id
                        ? "border-green-500 bg-green-50 shadow-lg"
                        : "border-gray-200 hover:border-gray-300 bg-white"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <span
                        className="w-12 h-12 rounded-full flex items-center justify-center text-2xl"
                        style={{ backgroundColor: `${ride.color}20` }}
                      >
                        {ride.icon}
                      </span>
                      <div className="text-left">
                        <p className="font-semibold text-gray-900">{ride.name}</p>
                        <p className="text-sm text-gray-500">{ride.time} away</p>
                      </div>
                    </div>
                    {selectedRide === ride.id && (
                      <div
                        className="mt-2 text-xs font-medium px-2 py-1 rounded-full inline-block"
                        style={{ backgroundColor: ride.color, color: "white" }}
                      >
                        Selected
                      </div>
                    )}
                  </button>
                ))}
              </div>
            </div>

            {/* Promo Code */}
            <div className="mb-6">
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Promo Code (Optional)
              </label>
              <input
                type="text"
                value={promoCode}
                onChange={(e) => setPromoCode(e.target.value.toUpperCase())}
                placeholder="Enter promo code"
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-green-500 outline-none uppercase"
              />
            </div>

            {/* Note for Driver */}
            <div className="mb-6">
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Note for Driver (Optional)
              </label>
              <textarea
                value={driverNote}
                onChange={(e) => setDriverNote(e.target.value)}
                placeholder="Gate code, pickup instructions, accessibility needs..."
                rows={2}
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-green-500 outline-none resize-none"
              />
            </div>

            {/* Search Button */}
            <button
              onClick={handleSearch}
              disabled={isSearching || !pickup || !dropoff}
              className={`w-full py-4 rounded-xl font-bold text-lg transition-all ${
                isSearching || !pickup || !dropoff
                  ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                  : "bg-gradient-to-r from-green-500 to-green-600 text-white hover:from-green-600 hover:to-green-700 shadow-lg hover:shadow-xl"
              }`}
            >
              {isSearching ? (
                <span className="flex items-center justify-center gap-2">
                  <svg className="animate-spin w-5 h-5" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  Finding your ride...
                </span>
              ) : (
                "Search Ride"
              )}
            </button>
          </div>

          {/* Right Panel - Fare Estimate & Map Placeholder */}
          <div className="space-y-6">
            {/* Fare Estimate Card */}
            <div className="bg-white rounded-2xl shadow-xl p-6 border border-gray-100">
              <h3 className="text-lg font-bold text-gray-900 mb-4">Real-Time Estimate</h3>
              
              {estimatedFare > 0 ? (
                <div className="space-y-4">
                  <div className="flex justify-between items-center py-3 border-b border-gray-100">
                    <span className="text-gray-600">Distance</span>
                    <span className="font-semibold text-gray-900">{estimatedDistance} miles</span>
                  </div>
                  <div className="flex justify-between items-center py-3 border-b border-gray-100">
                    <span className="text-gray-600">Ride Type</span>
                    <span className="font-semibold text-gray-900">
                      {RIDE_TYPES.find(r => r.id === selectedRide)?.name}
                    </span>
                  </div>
                  <div className="flex justify-between items-center py-3 border-b border-gray-100">
                    <span className="text-gray-600">Base Fare</span>
                    <span className="font-semibold text-gray-900">$2.50</span>
                  </div>
                  <div className="flex justify-between items-center py-3">
                    <span className="text-xl font-bold text-gray-900">Estimated Total</span>
                    <span className="text-3xl font-bold text-green-600">${estimatedFare}</span>
                  </div>
                  {promoCode === "GLIDE10" && (
                    <div className="bg-green-50 text-green-700 px-4 py-2 rounded-lg text-sm font-medium">
                      10% discount applied with code GLIDE10
                    </div>
                  )}
                </div>
              ) : (
                <div className="text-center py-8 text-gray-500">
                  <svg className="w-16 h-16 mx-auto mb-4 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  <p>Enter pickup and dropoff locations to see fare estimate</p>
                </div>
              )}
            </div>

            {/* Map Placeholder */}
            <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100">
              <div className="h-80 bg-gradient-to-br from-green-100 via-blue-50 to-green-50 relative">
                {/* Stylized Map Background */}
                <div className="absolute inset-0 opacity-30">
                  <svg className="w-full h-full" viewBox="0 0 400 300">
                    {/* Roads */}
                    <line x1="0" y1="100" x2="400" y2="100" stroke="#94a3b8" strokeWidth="3" />
                    <line x1="0" y1="200" x2="400" y2="200" stroke="#94a3b8" strokeWidth="3" />
                    <line x1="100" y1="0" x2="100" y2="300" stroke="#94a3b8" strokeWidth="3" />
                    <line x1="250" y1="0" x2="250" y2="300" stroke="#94a3b8" strokeWidth="3" />
                    <line x1="0" y1="0" x2="200" y2="150" stroke="#94a3b8" strokeWidth="2" />
                    <line x1="400" y1="50" x2="300" y2="250" stroke="#94a3b8" strokeWidth="2" />
                  </svg>
                </div>
                
                {/* Park areas */}
                <div className="absolute top-8 right-12 w-20 h-16 bg-green-300/50 rounded-lg" />
                <div className="absolute bottom-16 left-8 w-24 h-12 bg-green-300/50 rounded-lg" />
                
                {/* Water */}
                <div className="absolute bottom-4 right-4 w-32 h-20 bg-blue-300/40 rounded-full" />

                {/* Center marker */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
                  <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center shadow-lg animate-pulse">
                    <div className="w-3 h-3 bg-white rounded-full" />
                  </div>
                </div>

                {/* Driver markers */}
                <div className="absolute top-1/4 left-1/3 w-6 h-6 bg-green-600 rounded-full flex items-center justify-center text-white text-xs shadow">
                  <span>1</span>
                </div>
                <div className="absolute top-2/3 right-1/4 w-6 h-6 bg-green-600 rounded-full flex items-center justify-center text-white text-xs shadow">
                  <span>2</span>
                </div>
                <div className="absolute bottom-1/4 left-1/4 w-6 h-6 bg-green-600 rounded-full flex items-center justify-center text-white text-xs shadow">
                  <span>3</span>
                </div>

                {/* Attribution */}
                <div className="absolute bottom-2 right-2 bg-white/90 px-2 py-1 rounded text-xs text-gray-600">
                  GlideWay Maps
                </div>
              </div>
              
              <div className="p-4 bg-green-50 border-t border-green-100">
                <p className="text-sm text-green-700 font-medium flex items-center gap-2">
                  <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                  3 drivers nearby - Average pickup: 4 min
                </p>
              </div>
            </div>

            {/* Safety Info */}
            <div className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-2xl p-6 text-white">
              <h3 className="font-bold text-lg mb-2">Your Safety Matters</h3>
              <ul className="space-y-2 text-blue-100 text-sm">
                <li className="flex items-center gap-2">
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  All drivers background checked
                </li>
                <li className="flex items-center gap-2">
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  Real-time trip tracking
                </li>
                <li className="flex items-center gap-2">
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  24/7 customer support
                </li>
              </ul>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
