"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Calendar, Clock, Car, CreditCard, ChevronRight, Users } from "lucide-react"
import { Button } from "@/components/ui/button"
import { BookingMapPanel } from "@/components/booking-map-panel"

const rideOptions = [
  { id: "economy", name: "Economy", price: "$12-15", time: "5 min", icon: Car },
  { id: "comfort", name: "Comfort", price: "$18-22", time: "3 min", icon: Car },
  { id: "premium", name: "Premium", price: "$35-45", time: "7 min", icon: Car },
  { id: "xl", name: "XL", price: "$25-30", time: "8 min", icon: Users },
]

export function BookingSection() {
  const [pickup, setPickup] = useState("")
  const [dropoff, setDropoff] = useState("")
  const [selectedRide, setSelectedRide] = useState("comfort")
  const [showRideOptions, setShowRideOptions] = useState(false)
  const [isBooking, setIsBooking] = useState(false)
  const [routeInfo, setRouteInfo] = useState<{ distanceMi: number; durationMin: number } | null>(null)

  const handleSearch = () => {
    if (pickup && dropoff) {
      setShowRideOptions(true)
    }
  }

  const handleBookRide = async () => {
    setIsBooking(true)
    await new Promise(resolve => setTimeout(resolve, 2000))
    setIsBooking(false)
    // Show confirmation or redirect
  }

  const selectedRideOption = rideOptions.find(r => r.id === selectedRide)

  return (
    <section id="booking" className="relative min-h-[700px] bg-background">
      {/* Section Header - Overlaid on map */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
        className="absolute top-0 left-0 right-0 z-10 text-center pt-8 pb-4 bg-gradient-to-b from-background via-background/80 to-transparent"
      >
        <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-2">
          Book Your Ride
        </h2>
        <p className="text-muted-foreground max-w-2xl mx-auto px-4">
          Enter your pickup and drop-off locations to get started
        </p>
      </motion.div>

      {/* Full-width Map with Floating Card */}
      <div className="relative w-full h-[700px]">
        <BookingMapPanel
          pickup={pickup}
          dropoff={dropoff}
          onPickupChange={(addr, coords) => setPickup(addr)}
          onDropoffChange={(addr, coords) => setDropoff(addr)}
          onRouteInfo={setRouteInfo}
          onSearch={handleSearch}
          height="100%"
          className="pt-24"
        />

        {/* Ride Selection Panel - Appears after search */}
        {showRideOptions && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="absolute bottom-4 left-4 right-4 z-20 max-w-lg mx-auto"
          >
            <div className="glass-card rounded-2xl p-5 shadow-2xl">
              {/* Route Summary */}
              {routeInfo && (
                <div className="flex items-center justify-between text-sm mb-4 pb-4 border-b border-slate-700/50">
                  <div className="text-slate-400">
                    <span className="text-white font-medium">{routeInfo.distanceMi.toFixed(1)} mi</span> • {routeInfo.durationMin} min
                  </div>
                  <button
                    onClick={() => setShowRideOptions(false)}
                    className="text-emerald-400 text-sm font-medium hover:text-emerald-300"
                  >
                    Edit trip
                  </button>
                </div>
              )}

              {/* Ride Options */}
              <div className="space-y-2 mb-4">
                {rideOptions.map((ride) => (
                  <button
                    key={ride.id}
                    onClick={() => setSelectedRide(ride.id)}
                    className={`w-full flex items-center justify-between p-3 rounded-xl transition-all ${
                      selectedRide === ride.id
                        ? "bg-emerald-500/10 border border-emerald-500/50"
                        : "hover:bg-slate-800/50 border border-transparent"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                        selectedRide === ride.id ? "bg-emerald-500/20" : "bg-slate-700"
                      }`}>
                        <ride.icon className={`w-5 h-5 ${selectedRide === ride.id ? "text-emerald-400" : "text-slate-400"}`} />
                      </div>
                      <div className="text-left">
                        <div className={`font-medium ${selectedRide === ride.id ? "text-emerald-400" : "text-white"}`}>
                          {ride.name}
                        </div>
                        <div className="text-xs text-slate-400">{ride.time} away</div>
                      </div>
                    </div>
                    <div className={`font-semibold ${selectedRide === ride.id ? "text-emerald-400" : "text-white"}`}>
                      {ride.price}
                    </div>
                  </button>
                ))}
              </div>

              {/* Schedule Options */}
              <div className="flex gap-2 mb-4">
                <button className="flex-1 flex items-center justify-center gap-2 h-10 bg-slate-800/60 rounded-lg text-sm text-slate-300 hover:bg-slate-700/60 transition-colors">
                  <Calendar className="w-4 h-4" />
                  Today
                </button>
                <button className="flex-1 flex items-center justify-center gap-2 h-10 bg-slate-800/60 rounded-lg text-sm text-slate-300 hover:bg-slate-700/60 transition-colors">
                  <Clock className="w-4 h-4" />
                  Now
                </button>
              </div>

              {/* Payment */}
              <div className="flex items-center justify-between p-3 bg-slate-800/40 rounded-xl mb-4">
                <div className="flex items-center gap-3">
                  <CreditCard className="w-5 h-5 text-emerald-400" />
                  <div>
                    <p className="text-sm font-medium text-white">WorldPay Secure</p>
                    <p className="text-xs text-slate-400">•••• 4242</p>
                  </div>
                </div>
                <button className="text-emerald-400 text-sm font-medium hover:text-emerald-300">
                  Change
                </button>
              </div>

              {/* Book Button */}
              <Button
                onClick={handleBookRide}
                disabled={isBooking}
                className="w-full h-12 bg-emerald-500 hover:bg-emerald-600 text-white font-semibold rounded-xl shadow-lg shadow-emerald-500/30 transition-all"
              >
                {isBooking ? (
                  <span className="flex items-center gap-2">
                    <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Finding driver...
                  </span>
                ) : (
                  <span className="flex items-center gap-2">
                    Book {selectedRideOption?.name} • {selectedRideOption?.price}
                    <ChevronRight className="w-5 h-5" />
                  </span>
                )}
              </Button>
            </div>
          </motion.div>
        )}
      </div>
    </section>
  )
}
