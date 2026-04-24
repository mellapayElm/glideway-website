"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import Link from "next/link"
import { 
  ChevronLeft, DollarSign, TrendingUp, Calendar, Clock, Car, 
  ArrowUpRight, ArrowDownRight, Filter, Download, CreditCard,
  CheckCircle, AlertCircle, Wallet, PiggyBank, Target, Award,
  BarChart3, LineChart, Activity, Zap, MapPin, Route
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { GlidewayLogo } from "@/components/glideway-logo"

interface EarningEntry {
  id: string
  date: string
  time: string
  type: "trip" | "bonus" | "tip" | "adjustment" | "promotion"
  description: string
  amount: number
  status: "completed" | "pending" | "processing"
  tripId?: string
  distance?: number
  duration?: number
}

export default function DriverEarningsPage() {
  const [selectedPeriod, setSelectedPeriod] = useState<"today" | "week" | "month" | "year">("week")
  const [showFilters, setShowFilters] = useState(false)

  const earningsData = {
    today: { earnings: 187.50, trips: 12, hours: 6.5, avgPerTrip: 15.63 },
    week: { earnings: 892.40, trips: 58, hours: 38, avgPerTrip: 15.39 },
    month: { earnings: 3248.75, trips: 215, hours: 142, avgPerTrip: 15.11 },
    year: { earnings: 42580.00, trips: 2840, hours: 1820, avgPerTrip: 15.00 }
  }

  const current = earningsData[selectedPeriod]

  const recentEarnings: EarningEntry[] = [
    { id: "1", date: "Today", time: "2:45 PM", type: "trip", description: "Trip to LAX Airport", amount: 34.50, status: "completed", tripId: "GW-10234", distance: 12.4, duration: 28 },
    { id: "2", date: "Today", time: "1:30 PM", type: "tip", description: "Tip from Sarah M.", amount: 5.00, status: "completed" },
    { id: "3", date: "Today", time: "12:15 PM", type: "trip", description: "Trip to Downtown", amount: 18.75, status: "completed", tripId: "GW-10233", distance: 5.2, duration: 15 },
    { id: "4", date: "Today", time: "11:00 AM", type: "bonus", description: "Peak Hours Bonus", amount: 15.00, status: "completed" },
    { id: "5", date: "Today", time: "10:30 AM", type: "trip", description: "Trip to Beverly Hills", amount: 28.25, status: "completed", tripId: "GW-10232", distance: 8.7, duration: 22 },
    { id: "6", date: "Yesterday", time: "8:45 PM", type: "promotion", description: "Quest Completion Bonus", amount: 50.00, status: "completed" },
    { id: "7", date: "Yesterday", time: "7:30 PM", type: "trip", description: "Trip to Santa Monica", amount: 42.00, status: "completed", tripId: "GW-10231", distance: 15.3, duration: 35 },
    { id: "8", date: "Yesterday", time: "6:00 PM", type: "trip", description: "Trip to Hollywood", amount: 22.50, status: "completed", tripId: "GW-10230", distance: 6.8, duration: 18 },
  ]

  const weeklyBreakdown = [
    { day: "Mon", earnings: 145.20, trips: 9 },
    { day: "Tue", earnings: 168.50, trips: 11 },
    { day: "Wed", earnings: 132.80, trips: 8 },
    { day: "Thu", earnings: 155.40, trips: 10 },
    { day: "Fri", earnings: 198.00, trips: 13 },
    { day: "Sat", earnings: 92.50, trips: 7 },
    { day: "Sun", earnings: 0, trips: 0 },
  ]

  const maxEarnings = Math.max(...weeklyBreakdown.map(d => d.earnings))

  const getTypeIcon = (type: EarningEntry["type"]) => {
    switch (type) {
      case "trip": return <Car className="w-4 h-4" />
      case "bonus": return <Zap className="w-4 h-4" />
      case "tip": return <DollarSign className="w-4 h-4" />
      case "adjustment": return <Activity className="w-4 h-4" />
      case "promotion": return <Award className="w-4 h-4" />
    }
  }

  const getTypeColor = (type: EarningEntry["type"]) => {
    switch (type) {
      case "trip": return "bg-blue-500/20 text-blue-400"
      case "bonus": return "bg-yellow-500/20 text-yellow-400"
      case "tip": return "bg-emerald-500/20 text-emerald-400"
      case "adjustment": return "bg-orange-500/20 text-orange-400"
      case "promotion": return "bg-purple-500/20 text-purple-400"
    }
  }

  return (
    <div className="min-h-screen bg-slate-950">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-slate-900/95 backdrop-blur-sm border-b border-slate-800">
        <div className="flex items-center justify-between px-4 py-3">
          <Link href="/driver/app" className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors cursor-pointer">
            <ChevronLeft className="w-5 h-5" />
            <span className="text-sm">Back</span>
          </Link>
          <h1 className="text-lg font-semibold text-white">Earnings</h1>
          <Button variant="ghost" size="icon" className="text-slate-400 hover:text-white cursor-pointer">
            <Download className="w-5 h-5" />
          </Button>
        </div>
      </header>

      <main className="p-4 space-y-6 pb-24">
        {/* Period Selector */}
        <div className="flex gap-2">
          {(["today", "week", "month", "year"] as const).map((period) => (
            <button
              key={period}
              onClick={() => setSelectedPeriod(period)}
              className={`flex-1 py-2 px-3 rounded-lg text-sm font-medium transition-all cursor-pointer ${
                selectedPeriod === period
                  ? "bg-emerald-600 text-white"
                  : "bg-slate-800 text-slate-400 hover:bg-slate-700"
              }`}
            >
              {period.charAt(0).toUpperCase() + period.slice(1)}
            </button>
          ))}
        </div>

        {/* Main Earnings Card */}
        <Card className="bg-gradient-to-br from-emerald-900/50 to-slate-900 border-emerald-800/50">
          <CardContent className="p-6">
            <div className="text-center mb-6">
              <p className="text-emerald-400 text-sm mb-1">Total Earnings</p>
              <h2 className="text-4xl font-bold text-white">${current.earnings.toFixed(2)}</h2>
              <div className="flex items-center justify-center gap-1 mt-2 text-emerald-400 text-sm">
                <ArrowUpRight className="w-4 h-4" />
                <span>+12% vs last {selectedPeriod}</span>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div className="text-center p-3 bg-slate-800/50 rounded-xl cursor-pointer hover:bg-slate-800 transition-all">
                <Car className="w-5 h-5 mx-auto text-blue-400 mb-1" />
                <div className="text-xl font-bold text-white">{current.trips}</div>
                <div className="text-xs text-slate-400">Trips</div>
              </div>
              <div className="text-center p-3 bg-slate-800/50 rounded-xl cursor-pointer hover:bg-slate-800 transition-all">
                <Clock className="w-5 h-5 mx-auto text-purple-400 mb-1" />
                <div className="text-xl font-bold text-white">{current.hours}h</div>
                <div className="text-xs text-slate-400">Online</div>
              </div>
              <div className="text-center p-3 bg-slate-800/50 rounded-xl cursor-pointer hover:bg-slate-800 transition-all">
                <TrendingUp className="w-5 h-5 mx-auto text-emerald-400 mb-1" />
                <div className="text-xl font-bold text-white">${current.avgPerTrip.toFixed(2)}</div>
                <div className="text-xs text-slate-400">Avg/Trip</div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Weekly Chart */}
        <Card className="bg-slate-900/50 border-slate-800">
          <CardHeader className="pb-2">
            <CardTitle className="text-white text-base flex items-center gap-2">
              <BarChart3 className="w-5 h-5 text-emerald-400" />
              Weekly Overview
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-end justify-between h-32 gap-2">
              {weeklyBreakdown.map((day, index) => (
                <div key={day.day} className="flex-1 flex flex-col items-center gap-2 cursor-pointer group">
                  <div 
                    className="w-full bg-emerald-600/30 group-hover:bg-emerald-600/50 rounded-t transition-all relative"
                    style={{ height: `${(day.earnings / maxEarnings) * 100}%`, minHeight: day.earnings > 0 ? "8px" : "0" }}
                  >
                    <div 
                      className="absolute inset-0 bg-emerald-500 rounded-t opacity-0 group-hover:opacity-100 transition-opacity"
                      style={{ height: "100%" }}
                    />
                  </div>
                  <span className="text-xs text-slate-400 group-hover:text-white transition-colors">{day.day}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <div className="grid grid-cols-2 gap-3">
          <Link href="/driver/payouts">
            <Card className="bg-slate-800/50 border-slate-700 cursor-pointer hover:bg-slate-800 hover:border-slate-600 transition-all">
              <CardContent className="p-4 flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-emerald-500/20 flex items-center justify-center">
                  <Wallet className="w-5 h-5 text-emerald-400" />
                </div>
                <div>
                  <p className="text-white font-medium">Cash Out</p>
                  <p className="text-xs text-slate-400">Instant transfer</p>
                </div>
              </CardContent>
            </Card>
          </Link>
          <Link href="/driver/history">
            <Card className="bg-slate-800/50 border-slate-700 cursor-pointer hover:bg-slate-800 hover:border-slate-600 transition-all">
              <CardContent className="p-4 flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-blue-500/20 flex items-center justify-center">
                  <Calendar className="w-5 h-5 text-blue-400" />
                </div>
                <div>
                  <p className="text-white font-medium">Trip History</p>
                  <p className="text-xs text-slate-400">View all trips</p>
                </div>
              </CardContent>
            </Card>
          </Link>
        </div>

        {/* Recent Earnings */}
        <Card className="bg-slate-900/50 border-slate-800">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="text-white text-base">Recent Activity</CardTitle>
              <Button variant="ghost" size="sm" className="text-slate-400 hover:text-white cursor-pointer" onClick={() => setShowFilters(!showFilters)}>
                <Filter className="w-4 h-4 mr-1" />
                Filter
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-3">
            {recentEarnings.map((entry) => (
              <motion.div
                key={entry.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex items-center justify-between p-3 bg-slate-800/50 rounded-xl cursor-pointer hover:bg-slate-800 transition-all"
              >
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center ${getTypeColor(entry.type)}`}>
                    {getTypeIcon(entry.type)}
                  </div>
                  <div>
                    <p className="text-white font-medium text-sm">{entry.description}</p>
                    <p className="text-xs text-slate-400">{entry.date} at {entry.time}</p>
                    {entry.tripId && (
                      <p className="text-xs text-slate-500">{entry.tripId} • {entry.distance} mi • {entry.duration} min</p>
                    )}
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-emerald-400 font-semibold">+${entry.amount.toFixed(2)}</p>
                  <p className="text-xs text-slate-400 capitalize">{entry.status}</p>
                </div>
              </motion.div>
            ))}
          </CardContent>
        </Card>

        {/* Earnings Breakdown */}
        <Card className="bg-slate-900/50 border-slate-800">
          <CardHeader className="pb-2">
            <CardTitle className="text-white text-base flex items-center gap-2">
              <PiggyBank className="w-5 h-5 text-purple-400" />
              Earnings Breakdown
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-center justify-between p-3 bg-slate-800/50 rounded-xl">
              <div className="flex items-center gap-3">
                <div className="w-3 h-3 rounded-full bg-blue-500" />
                <span className="text-slate-300">Trip Fares</span>
              </div>
              <span className="text-white font-medium">$752.40 (84%)</span>
            </div>
            <div className="flex items-center justify-between p-3 bg-slate-800/50 rounded-xl">
              <div className="flex items-center gap-3">
                <div className="w-3 h-3 rounded-full bg-emerald-500" />
                <span className="text-slate-300">Tips</span>
              </div>
              <span className="text-white font-medium">$68.00 (8%)</span>
            </div>
            <div className="flex items-center justify-between p-3 bg-slate-800/50 rounded-xl">
              <div className="flex items-center gap-3">
                <div className="w-3 h-3 rounded-full bg-yellow-500" />
                <span className="text-slate-300">Bonuses</span>
              </div>
              <span className="text-white font-medium">$52.00 (6%)</span>
            </div>
            <div className="flex items-center justify-between p-3 bg-slate-800/50 rounded-xl">
              <div className="flex items-center gap-3">
                <div className="w-3 h-3 rounded-full bg-purple-500" />
                <span className="text-slate-300">Promotions</span>
              </div>
              <span className="text-white font-medium">$20.00 (2%)</span>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  )
}
