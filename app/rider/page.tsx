"use client"

import { useState } from "react"
import { 
  Clock, DollarSign, Star, CreditCard, Shield, History, Settings, User, Bell, ChevronRight,
  Gift, HelpCircle, Heart, MapPin
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { GlidewayLogo } from "@/components/glideway-logo"
import Link from "next/link"

export default function RiderApp() {
  const [activeTab, setActiveTab] = useState<"home" | "history" | "profile">("home")

  const recentTrips = [
    { id: 1, destination: "Downtown Mall", date: "Yesterday", price: "$12.50", driver: "Michael S.", rating: 4.9 },
    { id: 2, destination: "Airport Terminal B", date: "2 days ago", price: "$34.00", driver: "Sarah J.", rating: 5.0 },
    { id: 3, destination: "University Campus", date: "Last week", price: "$8.75", driver: "David R.", rating: 4.8 },
  ]

  const quickActions = [
    { icon: History, label: "Ride History", color: "bg-blue-100 text-blue-600" },
    { icon: CreditCard, label: "Payment", color: "bg-green-100 text-green-600" },
    { icon: Gift, label: "Promotions", color: "bg-amber-100 text-amber-600" },
    { icon: HelpCircle, label: "Support", color: "bg-purple-100 text-purple-600" },
  ]

  const menuItems = [
    { icon: User, label: "Profile", href: "#" },
    { icon: History, label: "Ride History", href: "#" },
    { icon: CreditCard, label: "Payment Methods", href: "#" },
    { icon: Gift, label: "Promotions", href: "#" },
    { icon: Heart, label: "Saved Places", href: "#" },
    { icon: Shield, label: "Safety", href: "#" },
    { icon: HelpCircle, label: "Support", href: "#" },
    { icon: Settings, label: "Settings", href: "#" },
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-green-500 px-6 pt-6 pb-10 rounded-b-3xl">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center justify-between mb-6">
            <GlidewayLogo size="md" />
            <button className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
              <Bell className="w-5 h-5 text-white" />
            </button>
          </div>

          <h1 className="text-white text-2xl font-bold mb-2">Welcome back!</h1>
          <p className="text-green-100">Ready for your next ride?</p>

          {/* Stats Card */}
          <div className="bg-white rounded-2xl p-4 shadow-lg mt-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                  <Star className="w-6 h-6 text-green-600" />
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
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-6 -mt-4">
        {/* Quick Actions */}
        <Card className="shadow-sm mb-6">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Quick Actions</CardTitle>
          </CardHeader>
          <CardContent>
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
          </CardContent>
        </Card>

        {/* Recent Trips */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-semibold text-gray-900">Recent Trips</h2>
            <button className="text-green-600 text-sm font-medium">View All</button>
          </div>
          <div className="space-y-3">
            {recentTrips.map((trip) => (
              <Card key={trip.id} className="shadow-sm">
                <CardContent className="p-4">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center">
                      <MapPin className="w-5 h-5 text-gray-500" />
                    </div>
                    <div className="flex-1">
                      <p className="font-medium text-gray-900">{trip.destination}</p>
                      <p className="text-sm text-gray-500">{trip.date} - {trip.driver}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-medium text-gray-900">{trip.price}</p>
                      <div className="flex items-center gap-1 justify-end">
                        <Star className="w-3 h-3 text-amber-400 fill-amber-400" />
                        <span className="text-xs text-gray-500">{trip.rating}</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Menu Items */}
        <Card className="shadow-sm mb-6">
          <CardContent className="p-2">
            {menuItems.map((item, index) => (
              <Link
                key={item.label}
                href={item.href}
                className={`flex items-center gap-4 p-4 hover:bg-gray-50 rounded-xl transition-colors ${
                  index < menuItems.length - 1 ? "border-b border-gray-100" : ""
                }`}
              >
                <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center">
                  <item.icon className="w-5 h-5 text-gray-600" />
                </div>
                <span className="flex-1 font-medium text-gray-900">{item.label}</span>
                <ChevronRight className="w-5 h-5 text-gray-400" />
              </Link>
            ))}
          </CardContent>
        </Card>

        {/* Safety Banner */}
        <div className="bg-gradient-to-r from-green-500 to-green-600 rounded-2xl p-5 mb-6">
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
      </main>
    </div>
  )
}
