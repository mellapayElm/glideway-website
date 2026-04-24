"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import Link from "next/link"
import { 
  ChevronLeft, Star, TrendingUp, TrendingDown, Award, 
  ThumbsUp, ThumbsDown, MessageCircle, Calendar, Clock,
  CheckCircle, AlertCircle, Heart, Zap, Shield, Car, MapPin
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

interface RatingEntry {
  id: string
  date: string
  rating: number
  feedback?: string
  riderName: string
  tripId: string
  compliments?: string[]
}

interface Compliment {
  id: string
  icon: React.ReactNode
  label: string
  count: number
}

export default function DriverRatingsPage() {
  const [selectedPeriod, setSelectedPeriod] = useState<"week" | "month" | "all">("month")

  const overallRating = 4.92
  const totalRatings = 2840
  const ratingGoal = 4.85

  const ratingDistribution = [
    { stars: 5, count: 2580, percentage: 91 },
    { stars: 4, count: 180, percentage: 6 },
    { stars: 3, count: 50, percentage: 2 },
    { stars: 2, count: 20, percentage: 1 },
    { stars: 1, count: 10, percentage: 0 },
  ]

  const compliments: Compliment[] = [
    { id: "1", icon: <Star className="w-5 h-5" />, label: "Excellent Service", count: 892 },
    { id: "2", icon: <Car className="w-5 h-5" />, label: "Great Driving", count: 756 },
    { id: "3", icon: <MessageCircle className="w-5 h-5" />, label: "Great Conversation", count: 524 },
    { id: "4", icon: <Shield className="w-5 h-5" />, label: "Safe Driver", count: 689 },
    { id: "5", icon: <MapPin className="w-5 h-5" />, label: "Knows the Area", count: 412 },
    { id: "6", icon: <Zap className="w-5 h-5" />, label: "Above & Beyond", count: 234 },
  ]

  const recentRatings: RatingEntry[] = [
    { id: "1", date: "Today", rating: 5, feedback: "Excellent ride! Very professional driver.", riderName: "Sarah M.", tripId: "GW-10234", compliments: ["Safe Driver", "Great Conversation"] },
    { id: "2", date: "Today", rating: 5, riderName: "James K.", tripId: "GW-10233" },
    { id: "3", date: "Today", rating: 5, feedback: "Best Uber-style experience I have had!", riderName: "Emily R.", tripId: "GW-10232", compliments: ["Excellent Service"] },
    { id: "4", date: "Yesterday", rating: 4, riderName: "Michael D.", tripId: "GW-10231" },
    { id: "5", date: "Yesterday", rating: 5, feedback: "Very clean car and safe driving.", riderName: "Lisa T.", tripId: "GW-10230", compliments: ["Safe Driver"] },
    { id: "6", date: "Jan 20", rating: 5, riderName: "Alex P.", tripId: "GW-10229" },
    { id: "7", date: "Jan 20", rating: 4, feedback: "Good ride, slightly longer route.", riderName: "Chris W.", tripId: "GW-10228" },
    { id: "8", date: "Jan 19", rating: 5, riderName: "Jennifer L.", tripId: "GW-10227", compliments: ["Knows the Area", "Great Driving"] },
  ]

  const weeklyTrend = [
    { day: "Mon", rating: 4.95 },
    { day: "Tue", rating: 4.88 },
    { day: "Wed", rating: 4.92 },
    { day: "Thu", rating: 4.90 },
    { day: "Fri", rating: 4.94 },
    { day: "Sat", rating: 4.85 },
    { day: "Sun", rating: 0 },
  ]

  const maxRating = 5
  const minRating = Math.min(...weeklyTrend.filter(d => d.rating > 0).map(d => d.rating))

  return (
    <div className="min-h-screen bg-slate-950">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-slate-900/95 backdrop-blur-sm border-b border-slate-800">
        <div className="flex items-center justify-between px-4 py-3">
          <Link href="/driver/app" className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors cursor-pointer">
            <ChevronLeft className="w-5 h-5" />
            <span className="text-sm">Back</span>
          </Link>
          <h1 className="text-lg font-semibold text-white">Ratings</h1>
          <div className="w-10" />
        </div>
      </header>

      <main className="p-4 space-y-6 pb-24">
        {/* Overall Rating Card */}
        <Card className="bg-gradient-to-br from-yellow-900/30 to-slate-900 border-yellow-800/50 overflow-hidden">
          <CardContent className="p-6 relative">
            <div className="absolute top-0 right-0 w-32 h-32 bg-yellow-500/10 rounded-full -translate-y-1/2 translate-x-1/2" />
            
            <div className="relative z-10 text-center">
              <div className="flex items-center justify-center gap-1 mb-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star
                    key={star}
                    className={`w-8 h-8 ${star <= Math.round(overallRating) ? "fill-yellow-400 text-yellow-400" : "text-slate-600"}`}
                  />
                ))}
              </div>
              <h2 className="text-5xl font-bold text-white mb-1">{overallRating}</h2>
              <p className="text-sm text-slate-400">{totalRatings.toLocaleString()} ratings</p>
              
              <div className="flex items-center justify-center gap-2 mt-4">
                {overallRating >= ratingGoal ? (
                  <>
                    <TrendingUp className="w-5 h-5 text-emerald-400" />
                    <span className="text-emerald-400 text-sm">Above goal ({ratingGoal})</span>
                  </>
                ) : (
                  <>
                    <TrendingDown className="w-5 h-5 text-orange-400" />
                    <span className="text-orange-400 text-sm">Below goal ({ratingGoal})</span>
                  </>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Rating Distribution */}
        <Card className="bg-slate-900/50 border-slate-800">
          <CardHeader className="pb-2">
            <CardTitle className="text-white text-base">Rating Distribution</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {ratingDistribution.map((rating) => (
              <div key={rating.stars} className="flex items-center gap-3">
                <div className="flex items-center gap-1 w-12">
                  <span className="text-white font-medium">{rating.stars}</span>
                  <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                </div>
                <div className="flex-1 h-3 bg-slate-800 rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${rating.percentage}%` }}
                    transition={{ duration: 0.5, delay: (5 - rating.stars) * 0.1 }}
                    className="h-full bg-yellow-500 rounded-full"
                  />
                </div>
                <span className="text-sm text-slate-400 w-12 text-right">{rating.count}</span>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Weekly Trend */}
        <Card className="bg-slate-900/50 border-slate-800">
          <CardHeader className="pb-2">
            <CardTitle className="text-white text-base flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-emerald-400" />
              Weekly Trend
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-end justify-between h-32 gap-2">
              {weeklyTrend.map((day) => {
                const height = day.rating > 0 
                  ? ((day.rating - 4.5) / 0.5) * 100 
                  : 0
                return (
                  <div key={day.day} className="flex-1 flex flex-col items-center gap-2 cursor-pointer group">
                    <span className="text-xs text-slate-400 opacity-0 group-hover:opacity-100 transition-opacity">
                      {day.rating > 0 ? day.rating.toFixed(2) : "-"}
                    </span>
                    <div 
                      className={`w-full rounded-t transition-all ${
                        day.rating > 0 
                          ? day.rating >= 4.90 
                            ? "bg-emerald-500 group-hover:bg-emerald-400" 
                            : "bg-yellow-500 group-hover:bg-yellow-400"
                          : "bg-slate-700"
                      }`}
                      style={{ height: `${Math.max(height, 5)}%` }}
                    />
                    <span className="text-xs text-slate-400 group-hover:text-white transition-colors">{day.day}</span>
                  </div>
                )
              })}
            </div>
          </CardContent>
        </Card>

        {/* Compliments */}
        <Card className="bg-slate-900/50 border-slate-800">
          <CardHeader className="pb-2">
            <CardTitle className="text-white text-base flex items-center gap-2">
              <Award className="w-5 h-5 text-purple-400" />
              Compliments Received
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-3">
              {compliments.map((compliment) => (
                <motion.div
                  key={compliment.id}
                  whileHover={{ scale: 1.02 }}
                  className="p-4 bg-slate-800/50 rounded-xl cursor-pointer hover:bg-slate-800 transition-all"
                >
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-10 h-10 rounded-full bg-purple-500/20 flex items-center justify-center text-purple-400">
                      {compliment.icon}
                    </div>
                    <span className="text-2xl font-bold text-white">{compliment.count}</span>
                  </div>
                  <p className="text-sm text-slate-400">{compliment.label}</p>
                </motion.div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Recent Ratings */}
        <Card className="bg-slate-900/50 border-slate-800">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="text-white text-base flex items-center gap-2">
                <Clock className="w-5 h-5 text-blue-400" />
                Recent Ratings
              </CardTitle>
              <div className="flex gap-1">
                {(["week", "month", "all"] as const).map((period) => (
                  <button
                    key={period}
                    onClick={() => setSelectedPeriod(period)}
                    className={`px-3 py-1 rounded-lg text-xs font-medium transition-all cursor-pointer ${
                      selectedPeriod === period
                        ? "bg-blue-600 text-white"
                        : "bg-slate-800 text-slate-400 hover:bg-slate-700"
                    }`}
                  >
                    {period.charAt(0).toUpperCase() + period.slice(1)}
                  </button>
                ))}
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-3">
            {recentRatings.map((entry) => (
              <motion.div
                key={entry.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-4 bg-slate-800/50 rounded-xl cursor-pointer hover:bg-slate-800 transition-all"
              >
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-white font-medium">{entry.riderName}</span>
                      <span className="text-xs text-slate-500">{entry.tripId}</span>
                    </div>
                    <p className="text-xs text-slate-400">{entry.date}</p>
                  </div>
                  <div className="flex items-center gap-1">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star
                        key={star}
                        className={`w-4 h-4 ${star <= entry.rating ? "fill-yellow-400 text-yellow-400" : "text-slate-600"}`}
                      />
                    ))}
                  </div>
                </div>
                {entry.feedback && (
                  <p className="text-sm text-slate-300 italic">&quot;{entry.feedback}&quot;</p>
                )}
                {entry.compliments && entry.compliments.length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-2">
                    {entry.compliments.map((compliment) => (
                      <span key={compliment} className="text-xs px-2 py-1 bg-purple-500/20 text-purple-400 rounded-full">
                        {compliment}
                      </span>
                    ))}
                  </div>
                )}
              </motion.div>
            ))}
          </CardContent>
        </Card>

        {/* Rating Tips */}
        <Card className="bg-gradient-to-br from-blue-900/30 to-slate-900 border-blue-800/50">
          <CardContent className="p-6">
            <h3 className="text-white font-semibold mb-4 flex items-center gap-2">
              <ThumbsUp className="w-5 h-5 text-blue-400" />
              Tips to Improve Your Rating
            </h3>
            <ul className="space-y-3">
              {[
                "Keep your car clean and fresh",
                "Greet riders warmly and confirm their name",
                "Follow GPS but consider rider preferences",
                "Drive safely and smoothly",
                "Offer amenities like phone charging",
                "Be respectful of rider conversation preferences"
              ].map((tip, index) => (
                <li key={index} className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-emerald-400 flex-shrink-0 mt-0.5" />
                  <span className="text-sm text-slate-300">{tip}</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      </main>
    </div>
  )
}
