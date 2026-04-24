"use client"

import { useState } from "react"
import { MapPin, Clock, Users, Search } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

interface RideBookingFormProps {
  onSearch?: (data: BookingData) => void
  onPickupChange?: (address: string) => void
  onDropoffChange?: (address: string) => void
  className?: string
}

interface BookingData {
  pickup: string
  dropoff: string
  pickupTime: string
  passengers: number
}

export function RideBookingForm({ onSearch, className = "" }: RideBookingFormProps) {
  const [pickup, setPickup] = useState("")
  const [dropoff, setDropoff] = useState("")
  const [pickupTime, setPickupTime] = useState("now")
  const [passengers, setPassengers] = useState(1)
  const [isLoading, setIsLoading] = useState(false)

  const handleSearch = async () => {
    if (!pickup.trim() || !dropoff.trim()) {
      alert("Please enter pickup and dropoff locations")
      return
    }

    setIsLoading(true)
    try {
      onSearch?.({
        pickup: pickup.trim(),
        dropoff: dropoff.trim(),
        pickupTime,
        passengers,
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className={`bg-white rounded-2xl p-6 shadow-lg ${className}`}>
      {/* Header */}
      <h2 className="text-2xl font-bold text-slate-900 mb-6">Get a ride</h2>

      {/* Location Inputs */}
      <div className="space-y-3 mb-4">
        {/* Pickup Location */}
        <div className="relative">
          <div className="absolute left-4 top-1/2 -translate-y-1/2">
            <div className="w-5 h-5 rounded-full bg-black" />
          </div>
          <Input
            type="text"
            placeholder="Pickup location"
            value={pickup}
            onChange={(e) => setPickup(e.target.value)}
            className="pl-14 py-3 bg-slate-100 border-0 text-slate-900 placeholder:text-slate-500 rounded-lg focus:bg-slate-50 focus:ring-2 focus:ring-emerald-500"
          />
        </div>

        {/* Dropoff Location */}
        <div className="relative">
          <div className="absolute left-4 top-1/2 -translate-y-1/2">
            <div className="w-5 h-5 bg-black flex items-center justify-center">
              <X className="w-3 h-3 text-white stroke-[3]" />
            </div>
          </div>
          <Input
            type="text"
            placeholder="Dropoff location"
            value={dropoff}
            onChange={(e) => setDropoff(e.target.value)}
            className="pl-14 py-3 bg-slate-100 border-0 text-slate-900 placeholder:text-slate-500 rounded-lg focus:bg-slate-50 focus:ring-2 focus:ring-emerald-500"
          />
        </div>
      </div>

      {/* Selectors - Pickup Time and Passengers */}
      <div className="space-y-3 mb-6">
        {/* Pickup Time Dropdown */}
        <div className="flex items-center gap-2 bg-slate-100 rounded-lg px-4 py-3 cursor-pointer hover:bg-slate-200 transition-colors">
          <Clock className="w-5 h-5 text-slate-700" />
          <select
            value={pickupTime}
            onChange={(e) => setPickupTime(e.target.value)}
            className="flex-1 bg-transparent text-slate-900 font-medium focus:outline-none cursor-pointer"
          >
            <option value="now">Pickup now</option>
            <option value="schedule">Schedule for later</option>
          </select>
        </div>

        {/* Passengers Dropdown */}
        <div className="flex items-center gap-2 bg-white border border-slate-200 rounded-lg px-3 py-2 cursor-pointer hover:border-slate-300 transition-colors w-fit">
          <Users className="w-5 h-5 text-slate-700" />
          <select
            value={passengers}
            onChange={(e) => setPassengers(parseInt(e.target.value))}
            className="bg-transparent text-slate-900 font-medium focus:outline-none cursor-pointer"
          >
            <option value={1}>For me</option>
            <option value={2}>2 passengers</option>
            <option value={3}>3 passengers</option>
            <option value={4}>4 passengers</option>
            <option value={5}>5 passengers</option>
            <option value={6}>6 passengers</option>
          </select>
        </div>
      </div>

      {/* Search Button */}
      <Button
        onClick={handleSearch}
        disabled={isLoading || !pickup.trim() || !dropoff.trim()}
        className="w-full bg-black hover:bg-slate-900 text-white font-bold py-4 rounded-xl text-lg transition-colors flex items-center justify-center gap-2"
      >
        {isLoading ? (
          <>
            <span className="animate-spin">⏳</span>
            Searching...
          </>
        ) : (
          <>
            <Search className="w-5 h-5" />
            Search
          </>
        )}
      </Button>
    </div>
  )
}

// Helper component - X icon (since it may not be available)
function X({ className }: { className: string }) {
  return (
    <svg
      className={className}
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M6 18L18 6M6 6l12 12"
      />
    </svg>
  )
}
