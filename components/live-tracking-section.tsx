"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { 
  MapPin, 
  Phone, 
  MessageCircle, 
  Send, 
  Navigation, 
  Car, 
  Star, 
  Clock, 
  DollarSign,
  RefreshCcw,
  PhoneCall,
  Shield
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import GoogleMapLive from "@/components/google-map-live"

const mockMessages = [
  { id: 1, sender: "system", text: "Your driver is on the way.", time: "2:34 PM" },
  { id: 2, sender: "rider", text: "Hi, I am outside.", time: "2:35 PM" },
  { id: 3, sender: "driver", text: "Got it, arriving now.", time: "2:35 PM" },
]

// Demo coordinates for Los Angeles area
const DEMO_PICKUP = { lat: 34.0522, lng: -118.2537 }
const DEMO_DROPOFF = { lat: 34.0622, lng: -118.2337 }
const DEMO_DRIVER_START = { lat: 34.0482, lng: -118.2507 }

export function LiveTrackingSection() {
  const [messages, setMessages] = useState(mockMessages)
  const [newMessage, setNewMessage] = useState("")
  const [callStatus, setCallStatus] = useState<"ready" | "calling" | "connected">("ready")
  const [refundAmount, setRefundAmount] = useState("5.00")
  const [refundReason, setRefundReason] = useState("")
  const [refundStatus, setRefundStatus] = useState<"none" | "submitted" | "processing">("none")
  
  // Simulated driver position for demo
  const [driverPosition, setDriverPosition] = useState({
    lat: DEMO_DRIVER_START.lat,
    lng: DEMO_DRIVER_START.lng,
    heading: 45,
    speedKph: 35
  })

  // Simulate driver movement towards pickup
  useEffect(() => {
    const interval = setInterval(() => {
      setDriverPosition(prev => {
        // Move driver towards pickup location
        const targetLat = DEMO_PICKUP.lat
        const targetLng = DEMO_PICKUP.lng
        
        const latDiff = targetLat - prev.lat
        const lngDiff = targetLng - prev.lng
        
        // Calculate heading based on movement direction
        const heading = Math.atan2(lngDiff, latDiff) * (180 / Math.PI)
        
        // Move 5% closer to target each step, with some randomness
        const newLat = prev.lat + latDiff * 0.05 + (Math.random() - 0.5) * 0.0002
        const newLng = prev.lng + lngDiff * 0.05 + (Math.random() - 0.5) * 0.0002
        
        // Simulate speed variations
        const speedKph = 25 + Math.random() * 20
        
        return {
          lat: newLat,
          lng: newLng,
          heading: heading + (Math.random() - 0.5) * 10,
          speedKph
        }
      })
    }, 2000)

    return () => clearInterval(interval)
  }, [])

  const handleSendMessage = () => {
    if (!newMessage.trim()) return
    setMessages([...messages, {
      id: messages.length + 1,
      sender: "rider",
      text: newMessage,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }])
    setNewMessage("")
  }

  const handleCall = () => {
    setCallStatus("calling")
    setTimeout(() => setCallStatus("connected"), 2000)
  }

  const handleRefund = () => {
    setRefundStatus("processing")
    setTimeout(() => setRefundStatus("submitted"), 1500)
  }

  return (
    <section id="live-tracking" className="py-24 bg-gradient-to-b from-secondary/20 to-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-4">
            Live Ride Tracking
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Track your driver in real-time, chat, call safely, and manage your ride all in one place
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* GPS Map Card */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="lg:col-span-2"
          >
            <Card className="bg-card border-border h-full">
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center gap-2 text-foreground">
                    <Navigation className="w-5 h-5 text-primary" />
                    Live GPS Tracking
                  </CardTitle>
                  <div className="flex items-center gap-2">
                    <span className="relative flex h-2 w-2">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75" />
                      <span className="relative inline-flex rounded-full h-2 w-2 bg-primary" />
                    </span>
                    <span className="text-sm text-primary font-medium">Live</span>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                {/* Real Google Maps */}
                <GoogleMapLive
                  pickup={DEMO_PICKUP}
                  dropoff={DEMO_DROPOFF}
                  driver={driverPosition}
                  showRoute={true}
                  height={350}
                  className="rounded-xl"
                />

                {/* Ride Info Bar */}
                <div className="mt-4 p-4 rounded-xl bg-secondary/50 border border-border">
                  <div className="flex items-center justify-between flex-wrap gap-4">
                    <div>
                      <p className="text-sm text-muted-foreground">Ride ID</p>
                      <p className="font-mono font-semibold text-foreground">GW-10234</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Status</p>
                      <p className="font-semibold text-primary">DRIVER_EN_ROUTE</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Estimated Fare</p>
                      <p className="font-semibold text-foreground">$24.75</p>
                    </div>
                    <div className="flex items-center gap-2 px-3 py-2 bg-primary/10 rounded-lg border border-primary/20">
                      <DollarSign className="w-4 h-4 text-primary" />
                      <span className="text-sm font-medium text-primary">AUTHORIZED</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Right Column - Chat, Call, Refund */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="space-y-6"
          >
            {/* Driver Info */}
            <Card className="bg-card border-border">
              <CardContent className="p-4">
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 rounded-full bg-gradient-to-br from-primary/40 to-primary flex items-center justify-center text-primary-foreground font-bold text-lg">
                    JD
                  </div>
                  <div className="flex-1">
                    <h4 className="font-semibold text-foreground">John Driver</h4>
                    <p className="text-sm text-muted-foreground">Toyota Camry - ABC 123</p>
                    <div className="flex items-center gap-1 mt-1">
                      <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                      <span className="text-sm font-medium text-foreground">4.92</span>
                      <span className="text-sm text-muted-foreground">(2,341 rides)</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Chat Card */}
            <Card className="bg-card border-border">
              <CardHeader className="pb-2">
                <CardTitle className="flex items-center gap-2 text-foreground text-base">
                  <MessageCircle className="w-4 h-4 text-primary" />
                  Chat with Driver
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-40 overflow-y-auto space-y-3 mb-4 pr-2">
                  {messages.map((msg) => (
                    <div
                      key={msg.id}
                      className={`flex ${msg.sender === "rider" ? "justify-end" : "justify-start"}`}
                    >
                      <div
                        className={`max-w-[80%] px-3 py-2 rounded-xl text-sm ${
                          msg.sender === "rider"
                            ? "bg-primary text-primary-foreground"
                            : msg.sender === "system"
                            ? "bg-muted text-muted-foreground italic"
                            : "bg-secondary text-foreground"
                        }`}
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
                    className="h-10 bg-secondary border-border text-foreground"
                  />
                  <Button
                    size="icon"
                    onClick={handleSendMessage}
                    className="h-10 w-10 bg-primary text-primary-foreground hover:bg-primary/90"
                  >
                    <Send className="w-4 h-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Masked Call Card */}
            <Card className="bg-card border-border">
              <CardHeader className="pb-2">
                <CardTitle className="flex items-center gap-2 text-foreground text-base">
                  <PhoneCall className="w-4 h-4 text-primary" />
                  Safe Calling
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-3 mb-4">
                  <Shield className="w-5 h-5 text-primary" />
                  <span className="text-sm text-muted-foreground">Your number stays private</span>
                </div>
                <Button
                  onClick={handleCall}
                  disabled={callStatus !== "ready"}
                  className={`w-full ${
                    callStatus === "connected" 
                      ? "bg-green-600 hover:bg-green-700" 
                      : "bg-primary hover:bg-primary/90"
                  } text-white`}
                >
                  {callStatus === "ready" && (
                    <>
                      <Phone className="w-4 h-4 mr-2" />
                      Start Masked Call
                    </>
                  )}
                  {callStatus === "calling" && (
                    <>
                      <span className="h-4 w-4 mr-2 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      Connecting...
                    </>
                  )}
                  {callStatus === "connected" && (
                    <>
                      <Phone className="w-4 h-4 mr-2" />
                      Connected
                    </>
                  )}
                </Button>
                <p className="text-xs text-center text-muted-foreground mt-2">
                  Status: {callStatus === "ready" ? "Ready" : callStatus === "calling" ? "Calling..." : "In Call"}
                </p>
              </CardContent>
            </Card>

            {/* Refund Request Card */}
            <Card className="bg-card border-border">
              <CardHeader className="pb-2">
                <CardTitle className="flex items-center gap-2 text-foreground text-base">
                  <RefreshCcw className="w-4 h-4 text-primary" />
                  Request Refund
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div>
                  <label className="text-sm text-muted-foreground">Reason</label>
                  <Input
                    placeholder="Enter reason..."
                    value={refundReason}
                    onChange={(e) => setRefundReason(e.target.value)}
                    className="mt-1 h-10 bg-secondary border-border text-foreground"
                  />
                </div>
                <div>
                  <label className="text-sm text-muted-foreground">Amount ($)</label>
                  <Input
                    type="number"
                    value={refundAmount}
                    onChange={(e) => setRefundAmount(e.target.value)}
                    className="mt-1 h-10 bg-secondary border-border text-foreground"
                  />
                </div>
                <Button
                  onClick={handleRefund}
                  disabled={refundStatus !== "none" || !refundReason}
                  variant="outline"
                  className="w-full border-destructive text-destructive hover:bg-destructive hover:text-white"
                >
                  {refundStatus === "none" && "Submit Refund"}
                  {refundStatus === "processing" && (
                    <>
                      <span className="h-4 w-4 mr-2 border-2 border-destructive/30 border-t-destructive rounded-full animate-spin" />
                      Processing...
                    </>
                  )}
                  {refundStatus === "submitted" && "Refund Submitted"}
                </Button>
                <p className="text-xs text-center text-muted-foreground">
                  Status: {refundStatus === "none" ? "No refund requested" : refundStatus === "processing" ? "Processing..." : "Submitted for review"}
                </p>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
