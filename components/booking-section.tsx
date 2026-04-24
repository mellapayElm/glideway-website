"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { 
  MapPin, 
  Square, 
  Clock, 
  User, 
  ChevronDown, 
  X, 
  Calendar,
  Users,
  Check,
  ArrowLeft,
  Navigation,
  Car
} from "lucide-react"
import { Button } from "@/components/ui/button"

// Rider selection options
const riderOptions = [
  { id: "me", name: "Me", icon: "initial" },
  { id: "someone", name: "Order ride for someone else", icon: "users" },
]

// Time options
const timeOptions = [
  { id: "now", label: "Now" },
  { id: "15min", label: "In 15 minutes" },
  { id: "30min", label: "In 30 minutes" },
  { id: "1hour", label: "In 1 hour" },
  { id: "schedule", label: "Schedule for later" },
]

// Day options
const dayOptions = [
  { id: "today", label: "Today" },
  { id: "tomorrow", label: "Tomorrow" },
]

export function BookingSection() {
  const [pickup, setPickup] = useState("")
  const [dropoff, setDropoff] = useState("")
  const [selectedTime, setSelectedTime] = useState("now")
  const [selectedDay, setSelectedDay] = useState("today")
  const [selectedRider, setSelectedRider] = useState("me")
  const [showRiderModal, setShowRiderModal] = useState(false)
  const [showTimeModal, setShowTimeModal] = useState(false)
  const [isSearching, setIsSearching] = useState(false)
  const [showRideOptions, setShowRideOptions] = useState(false)

  const handleSearch = async () => {
    if (!pickup || !dropoff) return
    setIsSearching(true)
    await new Promise(resolve => setTimeout(resolve, 1500))
    setIsSearching(false)
    setShowRideOptions(true)
  }

  const getTimeLabel = () => {
    if (selectedTime === "now") return "Pickup now"
    if (selectedTime === "schedule") return `${dayOptions.find(d => d.id === selectedDay)?.label}, Scheduled`
    return timeOptions.find(t => t.id === selectedTime)?.label || "Pickup now"
  }

  const getRiderLabel = () => {
    return selectedRider === "me" ? "For me" : "For someone else"
  }

  return (
    <section id="booking" className="relative bg-slate-100 min-h-[700px]">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-2">
            Book Your Ride
          </h2>
          <p className="text-gray-600">
            Enter your pickup and drop-off locations to get started
          </p>
        </div>
      </div>

      {/* Main Content - Split Layout */}
      <div className="flex flex-col lg:flex-row min-h-[600px]">
        {/* Left Side - Booking Form */}
        <div className="w-full lg:w-[400px] bg-white p-6 lg:p-8 border-r border-gray-200">
          <h3 className="text-xl font-semibold text-gray-900 mb-6">Get a ride</h3>

          {/* Pickup Location */}
          <div className="mb-3">
            <div className="flex items-center gap-3 p-4 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors cursor-text">
              <div className="w-2.5 h-2.5 rounded-full bg-gray-900" />
              <input
                type="text"
                placeholder="Pickup location"
                value={pickup}
                onChange={(e) => setPickup(e.target.value)}
                className="flex-1 bg-transparent outline-none text-gray-900 placeholder:text-gray-500"
              />
            </div>
          </div>

          {/* Dropoff Location */}
          <div className="mb-4">
            <div className="flex items-center gap-3 p-4 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors cursor-text">
              <Square className="w-2.5 h-2.5 text-gray-900 fill-gray-900" />
              <input
                type="text"
                placeholder="Dropoff location"
                value={dropoff}
                onChange={(e) => setDropoff(e.target.value)}
                className="flex-1 bg-transparent outline-none text-gray-900 placeholder:text-gray-500"
              />
            </div>
          </div>

          {/* Time Selector */}
          <button
            onClick={() => setShowTimeModal(true)}
            className="w-full flex items-center justify-between gap-3 p-4 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors mb-4"
          >
            <div className="flex items-center gap-3">
              <Clock className="w-5 h-5 text-gray-900" />
              <span className="text-gray-900 font-medium">{getTimeLabel()}</span>
            </div>
            <ChevronDown className="w-5 h-5 text-gray-500" />
          </button>

          {/* Rider Selector */}
          <button
            onClick={() => setShowRiderModal(true)}
            className="flex items-center gap-2 px-4 py-2 rounded-full border border-gray-300 hover:bg-gray-50 transition-colors mb-6"
          >
            <User className="w-4 h-4 text-gray-700" />
            <span className="text-gray-900 text-sm font-medium">{getRiderLabel()}</span>
            <ChevronDown className="w-4 h-4 text-gray-500" />
          </button>

          {/* Search Button */}
          <Button
            onClick={handleSearch}
            disabled={!pickup || !dropoff || isSearching}
            className="w-full bg-gray-900 hover:bg-gray-800 text-white font-semibold py-6 rounded-lg text-base disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSearching ? (
              <div className="flex items-center gap-2">
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Searching...
              </div>
            ) : (
              "Search"
            )}
          </Button>

          {/* Quick Actions */}
          <div className="mt-6 pt-6 border-t border-gray-200">
            <button className="flex items-center gap-3 w-full p-3 rounded-lg hover:bg-gray-50 transition-colors">
              <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center">
                <Navigation className="w-5 h-5 text-gray-700" />
              </div>
              <div className="text-left">
                <div className="font-medium text-gray-900">Allow location access</div>
                <div className="text-sm text-gray-500">It provides your pickup address</div>
              </div>
            </button>
            <button className="flex items-center gap-3 w-full p-3 rounded-lg hover:bg-gray-50 transition-colors">
              <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center">
                <MapPin className="w-5 h-5 text-gray-700" />
              </div>
              <div className="text-left">
                <div className="font-medium text-gray-900">Set location on map</div>
                <div className="text-sm text-gray-500">Tap anywhere on the map</div>
              </div>
            </button>
          </div>
        </div>

        {/* Right Side - Map */}
        <div className="flex-1 relative bg-slate-200 min-h-[400px] lg:min-h-0">
          {/* Static Map Background with CSS styling */}
          <div className="absolute inset-0 bg-gradient-to-br from-slate-100 via-slate-200 to-slate-300">
            {/* Map Grid Pattern */}
            <div 
              className="absolute inset-0 opacity-30"
              style={{
                backgroundImage: `
                  linear-gradient(to right, #cbd5e1 1px, transparent 1px),
                  linear-gradient(to bottom, #cbd5e1 1px, transparent 1px)
                `,
                backgroundSize: '60px 60px'
              }}
            />
            
            {/* Simulated Streets */}
            <svg className="absolute inset-0 w-full h-full opacity-40" preserveAspectRatio="none">
              <line x1="0%" y1="30%" x2="100%" y2="30%" stroke="#94a3b8" strokeWidth="3"/>
              <line x1="0%" y1="60%" x2="100%" y2="60%" stroke="#94a3b8" strokeWidth="3"/>
              <line x1="25%" y1="0%" x2="25%" y2="100%" stroke="#94a3b8" strokeWidth="3"/>
              <line x1="55%" y1="0%" x2="55%" y2="100%" stroke="#94a3b8" strokeWidth="3"/>
              <line x1="80%" y1="0%" x2="80%" y2="100%" stroke="#94a3b8" strokeWidth="3"/>
              {/* Diagonal roads */}
              <line x1="0%" y1="0%" x2="50%" y2="50%" stroke="#94a3b8" strokeWidth="2"/>
              <line x1="100%" y1="20%" x2="60%" y2="80%" stroke="#94a3b8" strokeWidth="2"/>
            </svg>

            {/* Green areas (parks) */}
            <div className="absolute top-[15%] left-[60%] w-32 h-24 bg-green-200/60 rounded-lg" />
            <div className="absolute bottom-[20%] left-[10%] w-40 h-20 bg-green-200/60 rounded-lg" />
            
            {/* Water body */}
            <div className="absolute bottom-[10%] right-[5%] w-48 h-32 bg-blue-200/50 rounded-full" />
          </div>

          {/* Location Pin - Center of map */}
          {pickup && (
            <motion.div 
              initial={{ scale: 0, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-full z-10"
            >
              <div className="flex flex-col items-center">
                <div className="w-8 h-8 bg-black rounded-full flex items-center justify-center shadow-lg">
                  <div className="w-3 h-3 bg-white rounded-full" />
                </div>
                <div className="w-1 h-4 bg-black" />
              </div>
            </motion.div>
          )}

          {/* Map Attribution */}
          <div className="absolute bottom-4 right-4 bg-white/90 px-3 py-1.5 rounded text-xs text-gray-600">
            GlideWay Maps
          </div>

          {/* Zoom Controls */}
          <div className="absolute bottom-20 right-4 flex flex-col bg-white rounded-lg shadow-lg overflow-hidden">
            <button className="p-3 hover:bg-gray-100 border-b border-gray-200 text-gray-700 font-bold">+</button>
            <button className="p-3 hover:bg-gray-100 text-gray-700 font-bold">-</button>
          </div>
        </div>
      </div>

      {/* Rider Selection Modal */}
      <AnimatePresence>
        {showRiderModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
            onClick={() => setShowRiderModal(false)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white rounded-2xl w-full max-w-md p-6 shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-semibold text-gray-900">Choose a rider</h3>
                <button
                  onClick={() => setShowRiderModal(false)}
                  className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                >
                  <X className="w-5 h-5 text-gray-500" />
                </button>
              </div>

              <div className="space-y-2 mb-6">
                {/* Me Option */}
                <button
                  onClick={() => setSelectedRider("me")}
                  className={`w-full flex items-center gap-4 p-4 rounded-xl transition-colors ${
                    selectedRider === "me" ? "bg-gray-100" : "hover:bg-gray-50"
                  }`}
                >
                  <div className="w-12 h-12 bg-gray-900 rounded-full flex items-center justify-center text-white font-semibold text-lg">
                    M
                  </div>
                  <span className="flex-1 text-left font-medium text-gray-900">Me</span>
                  {selectedRider === "me" && (
                    <div className="w-6 h-6 bg-gray-900 rounded-full flex items-center justify-center">
                      <div className="w-2 h-2 bg-white rounded-full" />
                    </div>
                  )}
                </button>

                {/* Someone Else Option */}
                <button
                  onClick={() => setSelectedRider("someone")}
                  className={`w-full flex items-center gap-4 p-4 rounded-xl transition-colors ${
                    selectedRider === "someone" ? "bg-gray-100" : "hover:bg-gray-50"
                  }`}
                >
                  <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center">
                    <Users className="w-6 h-6 text-gray-700" />
                  </div>
                  <span className="flex-1 text-left font-medium text-gray-900">Order ride for someone else</span>
                  {selectedRider === "someone" && (
                    <div className="w-6 h-6 bg-gray-900 rounded-full flex items-center justify-center">
                      <div className="w-2 h-2 bg-white rounded-full" />
                    </div>
                  )}
                </button>
              </div>

              <Button
                onClick={() => setShowRiderModal(false)}
                className="w-full bg-gray-900 hover:bg-gray-800 text-white font-semibold py-4 rounded-lg"
              >
                Done
              </Button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Time Selection Modal */}
      <AnimatePresence>
        {showTimeModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
            onClick={() => setShowTimeModal(false)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white rounded-2xl w-full max-w-md shadow-2xl overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header */}
              <div className="flex items-center justify-between p-4 border-b border-gray-200">
                <button
                  onClick={() => setShowTimeModal(false)}
                  className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                >
                  <ArrowLeft className="w-5 h-5 text-gray-700" />
                </button>
                <button
                  onClick={() => {
                    setSelectedTime("now")
                    setSelectedDay("today")
                  }}
                  className="text-gray-900 font-medium hover:text-gray-700"
                >
                  Clear
                </button>
              </div>

              <div className="p-6">
                <h3 className="text-2xl font-semibold text-gray-900 mb-6">
                  When do you want to be picked up?
                </h3>

                {/* Day Selector */}
                <button
                  className="w-full flex items-center justify-between gap-3 p-4 bg-gray-100 rounded-lg mb-3"
                >
                  <div className="flex items-center gap-3">
                    <Calendar className="w-5 h-5 text-gray-700" />
                    <span className="text-gray-900 font-medium">
                      {dayOptions.find(d => d.id === selectedDay)?.label}
                    </span>
                  </div>
                  <ChevronDown className="w-5 h-5 text-gray-500" />
                </button>

                {/* Time Selector */}
                <button
                  className="w-full flex items-center justify-between gap-3 p-4 bg-gray-100 rounded-lg mb-6"
                >
                  <div className="flex items-center gap-3">
                    <Clock className="w-5 h-5 text-gray-700" />
                    <span className="text-gray-900 font-medium">
                      {selectedTime === "now" ? "Now" : timeOptions.find(t => t.id === selectedTime)?.label}
                    </span>
                  </div>
                  <ChevronDown className="w-5 h-5 text-gray-500" />
                </button>

                {/* Benefits */}
                <div className="space-y-4 mb-6">
                  <div className="flex items-start gap-3">
                    <Calendar className="w-5 h-5 text-gray-500 mt-0.5" />
                    <p className="text-gray-600 text-sm">
                      Choose your pickup time up to 30 days in advance
                    </p>
                  </div>
                  <div className="flex items-start gap-3">
                    <Clock className="w-5 h-5 text-gray-500 mt-0.5" />
                    <p className="text-gray-600 text-sm">
                      Extra wait time included to meet your ride
                    </p>
                  </div>
                  <div className="flex items-start gap-3">
                    <X className="w-5 h-5 text-gray-500 mt-0.5" />
                    <p className="text-gray-600 text-sm">
                      Cancel at no charge up to 60 minutes in advance
                    </p>
                  </div>
                </div>

                <a href="#" className="text-gray-900 underline text-sm mb-6 block">
                  See terms
                </a>
              </div>

              <div className="p-4 border-t border-gray-200">
                <Button
                  onClick={() => setShowTimeModal(false)}
                  className="w-full bg-gray-900 hover:bg-gray-800 text-white font-semibold py-4 rounded-lg"
                >
                  Next
                </Button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Ride Options Panel */}
      <AnimatePresence>
        {showRideOptions && (
          <motion.div
            initial={{ opacity: 0, y: 100 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 100 }}
            className="fixed bottom-0 left-0 right-0 bg-white rounded-t-3xl shadow-2xl z-40 p-6 max-h-[60vh] overflow-y-auto"
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-semibold text-gray-900">Choose a ride</h3>
              <button
                onClick={() => setShowRideOptions(false)}
                className="p-2 hover:bg-gray-100 rounded-full"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-2 mb-6">
              {[
                { id: "economy", name: "GlideWay Economy", price: "$12-15", time: "5 min away", seats: 4 },
                { id: "comfort", name: "GlideWay Comfort", price: "$18-22", time: "3 min away", seats: 4 },
                { id: "xl", name: "GlideWay XL", price: "$25-30", time: "8 min away", seats: 6 },
                { id: "premium", name: "GlideWay Premium", price: "$35-45", time: "7 min away", seats: 4 },
              ].map((ride) => (
                <button
                  key={ride.id}
                  className="w-full flex items-center gap-4 p-4 rounded-xl hover:bg-gray-100 transition-colors"
                >
                  <div className="w-16 h-12 bg-gray-200 rounded-lg flex items-center justify-center">
                    <Car className="w-8 h-8 text-gray-600" />
                  </div>
                  <div className="flex-1 text-left">
                    <div className="font-medium text-gray-900">{ride.name}</div>
                    <div className="text-sm text-gray-500">{ride.time} - {ride.seats} seats</div>
                  </div>
                  <div className="font-semibold text-gray-900">{ride.price}</div>
                </button>
              ))}
            </div>

            <Button className="w-full bg-gray-900 hover:bg-gray-800 text-white font-semibold py-4 rounded-lg">
              Confirm GlideWay Comfort
            </Button>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  )
}
