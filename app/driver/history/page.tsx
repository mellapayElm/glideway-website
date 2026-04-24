"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import Link from "next/link"
import { 
  ChevronLeft, MapPin, Clock, DollarSign, Star, User, 
  Calendar, Filter, Search, ChevronRight, Route, Car,
  CheckCircle, XCircle, AlertCircle, ArrowUpRight, X
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"

interface Trip {
  id: string
  date: string
  time: string
  pickup: string
  dropoff: string
  riderName: string
  riderRating: number
  distance: number
  duration: number
  fare: number
  tip: number
  status: "completed" | "cancelled" | "rider_cancelled"
  rideType: string
  yourRating?: number
}

export default function DriverHistoryPage() {
  const [selectedTrip, setSelectedTrip] = useState<Trip | null>(null)
  const [filterDate, setFilterDate] = useState<"all" | "today" | "week" | "month">("all")
  const [searchQuery, setSearchQuery] = useState("")

  const trips: Trip[] = [
    { id: "GW-10234", date: "Today", time: "2:45 PM", pickup: "456 Oak Street, Los Angeles", dropoff: "LAX Airport Terminal 4", riderName: "Sarah M.", riderRating: 4.85, distance: 12.4, duration: 28, fare: 34.50, tip: 5.00, status: "completed", rideType: "Comfort", yourRating: 5 },
    { id: "GW-10233", date: "Today", time: "12:15 PM", pickup: "123 Main St, Downtown", dropoff: "Beverly Center Mall", riderName: "James K.", riderRating: 4.92, distance: 5.2, duration: 15, fare: 18.75, tip: 0, status: "completed", rideType: "Economy", yourRating: 5 },
    { id: "GW-10232", date: "Today", time: "10:30 AM", pickup: "Hollywood Blvd", dropoff: "Beverly Hills Hotel", riderName: "Emily R.", riderRating: 4.78, distance: 8.7, duration: 22, fare: 28.25, tip: 8.00, status: "completed", rideType: "Premium", yourRating: 5 },
    { id: "GW-10231", date: "Yesterday", time: "7:30 PM", pickup: "Santa Monica Pier", dropoff: "Venice Beach", riderName: "Michael D.", riderRating: 4.95, distance: 15.3, duration: 35, fare: 42.00, tip: 10.00, status: "completed", rideType: "Comfort", yourRating: 5 },
    { id: "GW-10230", date: "Yesterday", time: "6:00 PM", pickup: "Sunset Strip", dropoff: "Hollywood Sign Area", riderName: "Lisa T.", riderRating: 4.65, distance: 6.8, duration: 18, fare: 22.50, tip: 3.00, status: "completed", rideType: "Economy" },
    { id: "GW-10229", date: "Yesterday", time: "4:15 PM", pickup: "USC Campus", dropoff: "Staples Center", riderName: "Alex P.", riderRating: 4.88, distance: 4.2, duration: 12, fare: 15.00, tip: 0, status: "rider_cancelled", rideType: "Economy" },
    { id: "GW-10228", date: "Jan 20", time: "9:00 AM", pickup: "Burbank Airport", dropoff: "Pasadena", riderName: "Chris W.", riderRating: 4.72, distance: 18.5, duration: 42, fare: 48.00, tip: 12.00, status: "completed", rideType: "XL", yourRating: 4 },
    { id: "GW-10227", date: "Jan 20", time: "7:30 AM", pickup: "Union Station", dropoff: "DTLA", riderName: "Jennifer L.", riderRating: 4.90, distance: 2.8, duration: 8, fare: 12.00, tip: 2.00, status: "completed", rideType: "Economy", yourRating: 5 },
  ]

  const completedTrips = trips.filter(t => t.status === "completed")
  const totalEarnings = completedTrips.reduce((sum, t) => sum + t.fare + t.tip, 0)
  const totalDistance = completedTrips.reduce((sum, t) => sum + t.distance, 0)
  const totalDuration = completedTrips.reduce((sum, t) => sum + t.duration, 0)

  const getStatusColor = (status: Trip["status"]) => {
    switch (status) {
      case "completed": return "bg-emerald-500/20 text-emerald-400"
      case "cancelled": return "bg-red-500/20 text-red-400"
      case "rider_cancelled": return "bg-yellow-500/20 text-yellow-400"
    }
  }

  const getStatusIcon = (status: Trip["status"]) => {
    switch (status) {
      case "completed": return <CheckCircle className="w-4 h-4" />
      case "cancelled": return <XCircle className="w-4 h-4" />
      case "rider_cancelled": return <AlertCircle className="w-4 h-4" />
    }
  }

  const filteredTrips = trips.filter(trip => {
    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      return trip.id.toLowerCase().includes(query) ||
             trip.pickup.toLowerCase().includes(query) ||
             trip.dropoff.toLowerCase().includes(query) ||
             trip.riderName.toLowerCase().includes(query)
    }
    return true
  })

  return (
    <div className="min-h-screen bg-slate-950">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-slate-900/95 backdrop-blur-sm border-b border-slate-800">
        <div className="flex items-center justify-between px-4 py-3">
          <Link href="/driver/app" className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors cursor-pointer">
            <ChevronLeft className="w-5 h-5" />
            <span className="text-sm">Back</span>
          </Link>
          <h1 className="text-lg font-semibold text-white">Trip History</h1>
          <div className="w-10" />
        </div>
      </header>

      <main className="p-4 space-y-6 pb-24">
        {/* Stats Overview */}
        <Card className="bg-gradient-to-br from-blue-900/50 to-slate-900 border-blue-800/50">
          <CardContent className="p-4">
            <div className="grid grid-cols-4 gap-3">
              <div className="text-center">
                <Car className="w-5 h-5 mx-auto text-blue-400 mb-1" />
                <div className="text-xl font-bold text-white">{completedTrips.length}</div>
                <div className="text-xs text-slate-400">Trips</div>
              </div>
              <div className="text-center">
                <Route className="w-5 h-5 mx-auto text-purple-400 mb-1" />
                <div className="text-xl font-bold text-white">{totalDistance.toFixed(0)}</div>
                <div className="text-xs text-slate-400">Miles</div>
              </div>
              <div className="text-center">
                <Clock className="w-5 h-5 mx-auto text-yellow-400 mb-1" />
                <div className="text-xl font-bold text-white">{Math.floor(totalDuration / 60)}h</div>
                <div className="text-xs text-slate-400">Driving</div>
              </div>
              <div className="text-center">
                <DollarSign className="w-5 h-5 mx-auto text-emerald-400 mb-1" />
                <div className="text-xl font-bold text-emerald-400">${totalEarnings.toFixed(0)}</div>
                <div className="text-xs text-slate-400">Earned</div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Search & Filter */}
        <div className="space-y-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
            <Input
              placeholder="Search trips..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 bg-slate-800 border-slate-700 text-white placeholder:text-slate-500"
            />
          </div>
          <div className="flex gap-2">
            {(["all", "today", "week", "month"] as const).map((filter) => (
              <button
                key={filter}
                onClick={() => setFilterDate(filter)}
                className={`flex-1 py-2 px-3 rounded-lg text-sm font-medium transition-all cursor-pointer ${
                  filterDate === filter
                    ? "bg-blue-600 text-white"
                    : "bg-slate-800 text-slate-400 hover:bg-slate-700"
                }`}
              >
                {filter.charAt(0).toUpperCase() + filter.slice(1)}
              </button>
            ))}
          </div>
        </div>

        {/* Trip List */}
        <Card className="bg-slate-900/50 border-slate-800">
          <CardContent className="p-0">
            {filteredTrips.map((trip, index) => (
              <motion.div
                key={trip.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className={`p-4 cursor-pointer hover:bg-slate-800/50 transition-all ${
                  index !== filteredTrips.length - 1 ? "border-b border-slate-800" : ""
                }`}
                onClick={() => setSelectedTrip(trip)}
              >
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-white font-medium">{trip.id}</span>
                      <span className={`text-xs px-2 py-0.5 rounded-full flex items-center gap-1 ${getStatusColor(trip.status)}`}>
                        {getStatusIcon(trip.status)}
                        <span className="capitalize">{trip.status.replace("_", " ")}</span>
                      </span>
                    </div>
                    <p className="text-xs text-slate-400 mt-0.5">{trip.date} at {trip.time} • {trip.rideType}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-emerald-400 font-semibold">${(trip.fare + trip.tip).toFixed(2)}</p>
                    {trip.tip > 0 && (
                      <p className="text-xs text-slate-400">+${trip.tip.toFixed(2)} tip</p>
                    )}
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex items-start gap-2">
                    <div className="w-2 h-2 rounded-full bg-emerald-500 mt-1.5" />
                    <p className="text-sm text-slate-300 truncate">{trip.pickup}</p>
                  </div>
                  <div className="flex items-start gap-2">
                    <div className="w-2 h-2 rounded-full bg-red-500 mt-1.5" />
                    <p className="text-sm text-slate-300 truncate">{trip.dropoff}</p>
                  </div>
                </div>

                <div className="flex items-center justify-between mt-3 pt-3 border-t border-slate-800/50">
                  <div className="flex items-center gap-4 text-xs text-slate-400">
                    <span className="flex items-center gap-1">
                      <Route className="w-3 h-3" />
                      {trip.distance} mi
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {trip.duration} min
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-slate-400">{trip.riderName}</span>
                    <div className="flex items-center gap-1 text-yellow-400">
                      <Star className="w-3 h-3 fill-current" />
                      <span className="text-xs">{trip.riderRating}</span>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </CardContent>
        </Card>
      </main>

      {/* Trip Detail Modal */}
      {selectedTrip && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="fixed inset-0 bg-black/80 z-50 flex items-end justify-center"
          onClick={() => setSelectedTrip(null)}
        >
          <motion.div
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            className="w-full max-w-lg bg-slate-900 rounded-t-2xl max-h-[80vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="sticky top-0 bg-slate-900 p-6 border-b border-slate-800">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-xl font-bold text-white">{selectedTrip.id}</h3>
                  <p className="text-sm text-slate-400">{selectedTrip.date} at {selectedTrip.time}</p>
                </div>
                <button onClick={() => setSelectedTrip(null)} className="text-slate-400 hover:text-white cursor-pointer">
                  <X className="w-6 h-6" />
                </button>
              </div>
            </div>

            <div className="p-6 space-y-6">
              {/* Status */}
              <div className={`flex items-center gap-2 px-4 py-3 rounded-xl ${getStatusColor(selectedTrip.status)}`}>
                {getStatusIcon(selectedTrip.status)}
                <span className="font-medium capitalize">{selectedTrip.status.replace("_", " ")}</span>
              </div>

              {/* Route */}
              <div className="space-y-3">
                <h4 className="text-sm text-slate-400 font-medium">Route</h4>
                <div className="p-4 bg-slate-800/50 rounded-xl space-y-3">
                  <div className="flex items-start gap-3">
                    <div className="w-3 h-3 rounded-full bg-emerald-500 mt-1" />
                    <div>
                      <p className="text-xs text-slate-500">Pickup</p>
                      <p className="text-white">{selectedTrip.pickup}</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-3 h-3 rounded-full bg-red-500 mt-1" />
                    <div>
                      <p className="text-xs text-slate-500">Dropoff</p>
                      <p className="text-white">{selectedTrip.dropoff}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Trip Details */}
              <div className="grid grid-cols-3 gap-3">
                <div className="text-center p-3 bg-slate-800/50 rounded-xl">
                  <Route className="w-5 h-5 mx-auto text-blue-400 mb-1" />
                  <div className="text-lg font-bold text-white">{selectedTrip.distance}</div>
                  <div className="text-xs text-slate-400">Miles</div>
                </div>
                <div className="text-center p-3 bg-slate-800/50 rounded-xl">
                  <Clock className="w-5 h-5 mx-auto text-purple-400 mb-1" />
                  <div className="text-lg font-bold text-white">{selectedTrip.duration}</div>
                  <div className="text-xs text-slate-400">Minutes</div>
                </div>
                <div className="text-center p-3 bg-slate-800/50 rounded-xl">
                  <Car className="w-5 h-5 mx-auto text-yellow-400 mb-1" />
                  <div className="text-lg font-bold text-white">{selectedTrip.rideType}</div>
                  <div className="text-xs text-slate-400">Type</div>
                </div>
              </div>

              {/* Rider */}
              <div className="p-4 bg-slate-800/50 rounded-xl">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-blue-700 flex items-center justify-center text-white font-bold">
                      {selectedTrip.riderName.charAt(0)}
                    </div>
                    <div>
                      <p className="text-white font-medium">{selectedTrip.riderName}</p>
                      <div className="flex items-center gap-1 text-yellow-400">
                        <Star className="w-4 h-4 fill-current" />
                        <span className="text-sm">{selectedTrip.riderRating}</span>
                      </div>
                    </div>
                  </div>
                  {selectedTrip.yourRating && (
                    <div className="text-right">
                      <p className="text-xs text-slate-400">Your Rating</p>
                      <div className="flex items-center gap-1 text-emerald-400">
                        <Star className="w-4 h-4 fill-current" />
                        <span>{selectedTrip.yourRating}</span>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Earnings */}
              <div className="space-y-3">
                <h4 className="text-sm text-slate-400 font-medium">Earnings Breakdown</h4>
                <div className="p-4 bg-slate-800/50 rounded-xl space-y-3">
                  <div className="flex justify-between">
                    <span className="text-slate-400">Base Fare</span>
                    <span className="text-white">${selectedTrip.fare.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Tip</span>
                    <span className="text-emerald-400">+${selectedTrip.tip.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between pt-3 border-t border-slate-700">
                    <span className="text-white font-medium">Total Earned</span>
                    <span className="text-emerald-400 font-bold">${(selectedTrip.fare + selectedTrip.tip).toFixed(2)}</span>
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="grid grid-cols-2 gap-3">
                <Button variant="outline" className="border-slate-700 text-white hover:bg-slate-800 cursor-pointer">
                  Report Issue
                </Button>
                <Button variant="outline" className="border-slate-700 text-white hover:bg-slate-800 cursor-pointer">
                  Get Help
                </Button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </div>
  )
}
