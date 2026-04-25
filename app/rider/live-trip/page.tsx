"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { 
  ChevronLeft, Phone, MessageCircle, Send, Navigation, Car, Star, 
  DollarSign, Shield, MapPin, Clock, AlertCircle
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { GlidewayLogo } from "@/components/glideway-logo"
import dynamic from "next/dynamic"

const GoogleMapLive = dynamic(() => import("@/components/google-map-live"), { ssr: false })
import Link from "next/link"

// Demo coordinates for Los Angeles
const DEMO_PICKUP = { lat: 34.0522, lng: -118.2537 }
const DEMO_DROPOFF = { lat: 34.0622, lng: -118.2237 }
const DEMO_DRIVER_START = { lat: 34.0492, lng: -118.2487 }

const mockMessages = [
  { id: 1, from: "system" as const, text: "Your driver is on the way.", time: "2:34 PM" },
  { id: 2, from: "rider" as const, text: "Hi, I am outside.", time: "2:35 PM" },
  { id: 3, from: "driver" as const, text: "Got it, arriving now.", time: "2:35 PM" },
]

export default function LiveTripPage() {
  const [messages, setMessages] = useState(mockMessages)
  const [newMessage, setNewMessage] = useState("")
  const [callStatus, setCallStatus] = useState<"ready" | "calling" | "connected">("ready")
  
  // Simulated driver position
  const [driverPosition, setDriverPosition] = useState({
    lat: DEMO_DRIVER_START.lat,
    lng: DEMO_DRIVER_START.lng,
    heading: 45,
    speedKph: 35
  })

  // Simulate ETA countdown
  const [eta, setEta] = useState(4)

  // Simulate driver movement
  useEffect(() => {
    const interval = setInterval(() => {
      setDriverPosition(prev => {
        const targetLat = DEMO_PICKUP.lat
        const targetLng = DEMO_PICKUP.lng
        
        const latDiff = targetLat - prev.lat
        const lngDiff = targetLng - prev.lng
        const heading = Math.atan2(lngDiff, latDiff) * (180 / Math.PI)
        
        const newLat = prev.lat + latDiff * 0.08 + (Math.random() - 0.5) * 0.0001
        const newLng = prev.lng + lngDiff * 0.08 + (Math.random() - 0.5) * 0.0001
        const speedKph = 30 + Math.random() * 15
        
        return { lat: newLat, lng: newLng, heading, speedKph }
      })
      
      setEta(prev => Math.max(1, prev - 0.1))
    }, 2000)

    return () => clearInterval(interval)
  }, [])

  const handleSendMessage = () => {
    if (!newMessage.trim()) return
    setMessages(prev => [...prev, {
      id: prev.length + 1,
      from: "rider" as const,
      text: newMessage,
      time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
    }])
    setNewMessage("")
    
    // Simulate driver response
    setTimeout(() => {
      setMessages(prev => [...prev, {
        id: prev.length + 1,
        from: "driver" as const,
        text: "Almost there!",
        time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
      }])
    }, 2000)
  }

  const handleCall = () => {
    setCallStatus("calling")
    setTimeout(() => setCallStatus("connected"), 2000)
  }

  const handleEndCall = () => {
    setCallStatus("ready")
  }

  return (
    <div className="min-h-screen bg-slate-950">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-slate-900/90 backdrop-blur-sm border-b border-slate-800">
        <div className="max-w-4xl mx-auto px-4 py-3 flex items-center justify-between">
          <Link href="/rider" className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors cursor-pointer">
            <ChevronLeft className="w-5 h-5" />
            <span className="text-sm">Back to App</span>
          </Link>
          <GlidewayLogo className="h-8" />
          <div className="w-20" /> {/* Spacer for centering */}
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-6 space-y-6">
        {/* Status Banner */}
        <motion.div 
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-r from-emerald-900/50 to-blue-900/50 rounded-2xl p-4 border border-emerald-800/50 cursor-pointer hover:border-emerald-700/50 transition-all"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="relative">
                <div className="w-3 h-3 bg-emerald-500 rounded-full animate-ping absolute" />
                <div className="w-3 h-3 bg-emerald-500 rounded-full relative" />
              </div>
              <div>
                <h1 className="text-lg font-bold text-white">Driver Arriving</h1>
                <p className="text-sm text-slate-400">ETA: {Math.ceil(eta)} minutes</p>
              </div>
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold text-emerald-400">GW-10234</div>
              <div className="text-xs text-slate-500">Ride ID</div>
            </div>
          </div>
        </motion.div>

        {/* Live Map */}
        <Card className="bg-slate-900/50 border-slate-800 overflow-hidden cursor-pointer hover:border-slate-700 transition-all">
          <CardContent className="p-0">
            <div className="p-4 border-b border-slate-800 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Navigation className="w-5 h-5 text-emerald-400" />
                <span className="font-semibold text-white">Live GPS Tracking</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
                </span>
                <span className="text-sm text-emerald-400 font-medium">Live</span>
              </div>
            </div>
            
            <GoogleMapLive
              pickup={DEMO_PICKUP}
              dropoff={DEMO_DROPOFF}
              driver={driverPosition}
              showRoute={true}
              height={400}
            />
          </CardContent>
        </Card>

        <div className="grid md:grid-cols-2 gap-6">
          {/* Driver Info */}
          <Card className="bg-slate-900/50 border-slate-800 hover:border-slate-700 transition-all cursor-pointer">
            <CardContent className="p-4">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-16 h-16 rounded-full bg-gradient-to-br from-emerald-500 to-emerald-700 flex items-center justify-center text-white text-2xl font-bold hover:shadow-lg transition-all">
                  JD
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-white text-lg">John Driver</h3>
                  <p className="text-sm text-slate-400">Toyota Camry - ABC 123</p>
                  <div className="flex items-center gap-1 mt-1 cursor-pointer hover:text-yellow-400 transition-colors">
                    <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                    <span className="text-sm text-white">4.92</span>
                    <span className="text-xs text-slate-500">(2,341 rides)</span>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="grid grid-cols-2 gap-3">
                <Button 
                  variant="outline" 
                  className="border-slate-700 text-white hover:bg-slate-800 cursor-pointer transition-all"
                  onClick={handleCall}
                  disabled={callStatus !== "ready"}
                >
                  <Phone className="w-4 h-4 mr-2 text-emerald-400" />
                  {callStatus === "ready" ? "Call Driver" : callStatus === "calling" ? "Calling..." : "Connected"}
                </Button>
                {callStatus === "connected" && (
                  <Button 
                    variant="outline" 
                    className="border-red-700 text-red-400 hover:bg-red-900/30 cursor-pointer transition-all"
                    onClick={handleEndCall}
                  >
                    <Phone className="w-4 h-4 mr-2" />
                    End Call
                  </Button>
                )}
                {callStatus !== "connected" && (
                  <Button variant="outline" className="border-slate-700 text-white hover:bg-slate-800 cursor-pointer transition-all">
                    <MessageCircle className="w-4 h-4 mr-2 text-blue-400" />
                    Message
                  </Button>
                )}
              </div>

              <div className="mt-4 p-3 bg-slate-800/50 rounded-lg flex items-center gap-2 cursor-pointer hover:bg-slate-800 transition-all">
                <Shield className="w-5 h-5 text-emerald-400 flex-shrink-0" />
                <span className="text-sm text-slate-300">Your number stays private with masked calling</span>
              </div>
            </CardContent>
          </Card>

          {/* Chat */}
          <Card className="bg-slate-900/50 border-slate-800 hover:border-slate-700 transition-all">
            <CardContent className="p-4">
              <div className="flex items-center gap-2 mb-4">
                <MessageCircle className="w-5 h-5 text-blue-400" />
                <span className="font-semibold text-white">Chat with Driver</span>
              </div>
              
              <div className="h-48 overflow-y-auto space-y-3 mb-4 pr-2">
                {messages.map((msg) => (
                  <div
                    key={msg.id}
                    className={`flex ${msg.from === "rider" ? "justify-end" : "justify-start"} cursor-pointer hover:opacity-80 transition-opacity`}
                  >
                    <div
                      className={`max-w-[80%] px-3 py-2 rounded-xl text-sm ${
                        msg.from === "rider"
                          ? "bg-emerald-600 text-white hover:bg-emerald-700"
                          : msg.from === "system"
                          ? "bg-slate-700/50 text-slate-300 italic"
                          : "bg-slate-700 text-white hover:bg-slate-600"
                      } transition-all`}
                    >
                      {msg.text}
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="flex gap-2">
                <Input
                  placeholder="Message your driver..."
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
                  className="bg-slate-800 border-slate-700 text-white placeholder:text-slate-500 cursor-text"
                />
                <Button
                  size="icon"
                  onClick={handleSendMessage}
                  className="bg-emerald-600 hover:bg-emerald-700 cursor-pointer transition-all"
                >
                  <Send className="w-4 h-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Trip Details */}
        <Card className="bg-slate-900/50 border-slate-800 hover:border-slate-700 transition-all cursor-pointer">
          <CardContent className="p-4">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center p-3 bg-slate-800/50 rounded-xl hover:bg-slate-800 transition-all cursor-pointer">
                <MapPin className="w-5 h-5 text-emerald-400 mx-auto mb-2" />
                <div className="text-xs text-slate-500">Pickup</div>
                <div className="text-sm font-medium text-white truncate">123 Main St</div>
              </div>
              <div className="text-center p-3 bg-slate-800/50 rounded-xl hover:bg-slate-800 transition-all cursor-pointer">
                <MapPin className="w-5 h-5 text-red-400 mx-auto mb-2" />
                <div className="text-xs text-slate-500">Drop-off</div>
                <div className="text-sm font-medium text-white truncate">LAX Terminal 4</div>
              </div>
              <div className="text-center p-3 bg-slate-800/50 rounded-xl hover:bg-slate-800 transition-all cursor-pointer">
                <Clock className="w-5 h-5 text-blue-400 mx-auto mb-2" />
                <div className="text-xs text-slate-500">Est. Duration</div>
                <div className="text-sm font-medium text-white">25 min</div>
              </div>
              <div className="text-center p-3 bg-slate-800/50 rounded-xl hover:bg-slate-800 transition-all cursor-pointer">
                <DollarSign className="w-5 h-5 text-emerald-400 mx-auto mb-2" />
                <div className="text-xs text-slate-500">Estimated Fare</div>
                <div className="text-sm font-medium text-white">$32.50</div>
              </div>
            </div>

            <div className="mt-4 p-4 bg-gradient-to-r from-emerald-900/30 to-blue-900/30 rounded-xl border border-emerald-800/50 flex items-center justify-between cursor-pointer hover:border-emerald-700 transition-all">
              <div className="flex items-center gap-3">
                <DollarSign className="w-6 h-6 text-emerald-400" />
                <div>
                  <div className="text-sm text-slate-400">Payment Status</div>
                  <div className="font-semibold text-white">Pre-authorized</div>
                </div>
              </div>
              <div className="px-4 py-2 bg-emerald-500/20 rounded-lg">
                <span className="text-emerald-400 font-medium">AUTHORIZED</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Emergency/Help */}
        <Card className="bg-red-950/30 border-red-900/50 hover:border-red-900 transition-all cursor-pointer">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <AlertCircle className="w-6 h-6 text-red-400" />
                <div>
                  <div className="font-medium text-white">Need Help?</div>
                  <div className="text-sm text-slate-400">Emergency assistance available 24/7</div>
                </div>
              </div>
              <Button variant="outline" className="border-red-800 text-red-400 hover:bg-red-900/30 cursor-pointer transition-all">
                Get Help
              </Button>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  )
}
