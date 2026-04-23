"use client"

import { useState } from "react"
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

const mockMessages = [
  { id: 1, sender: "system", text: "Your driver is on the way.", time: "2:34 PM" },
  { id: 2, sender: "rider", text: "Hi, I am outside.", time: "2:35 PM" },
  { id: 3, sender: "driver", text: "Got it, arriving now.", time: "2:35 PM" },
]

export function LiveTrackingSection() {
  const [messages, setMessages] = useState(mockMessages)
  const [newMessage, setNewMessage] = useState("")
  const [callStatus, setCallStatus] = useState<"ready" | "calling" | "connected">("ready")
  const [refundAmount, setRefundAmount] = useState("5.00")
  const [refundReason, setRefundReason] = useState("")
  const [refundStatus, setRefundStatus] = useState<"none" | "submitted" | "processing">("none")

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
                {/* Simulated Map */}
                <div className="aspect-video rounded-xl bg-secondary relative overflow-hidden">
                  {/* Grid Pattern */}
                  <div 
                    className="absolute inset-0 opacity-10"
                    style={{
                      backgroundImage: `linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px),
                                       linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)`,
                      backgroundSize: '30px 30px'
                    }}
                  />

                  {/* Pickup Point */}
                  <div className="absolute top-1/4 left-1/5 flex flex-col items-center">
                    <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center shadow-lg shadow-primary/30">
                      <MapPin className="w-5 h-5 text-primary-foreground" />
                    </div>
                    <span className="mt-1 text-xs bg-card px-2 py-1 rounded text-foreground">Pickup</span>
                  </div>

                  {/* Drop-off Point */}
                  <div className="absolute bottom-1/4 right-1/5 flex flex-col items-center">
                    <div className="w-10 h-10 rounded-full bg-destructive flex items-center justify-center shadow-lg shadow-destructive/30">
                      <MapPin className="w-5 h-5 text-white" />
                    </div>
                    <span className="mt-1 text-xs bg-card px-2 py-1 rounded text-foreground">Drop-off</span>
                  </div>

                  {/* Animated Car */}
                  <motion.div
                    className="absolute"
                    style={{ top: '45%', left: '35%' }}
                    animate={{
                      x: [0, 30, 60, 90, 120],
                      y: [0, -15, 10, 25, 40],
                      rotate: [0, 15, -10, 20, 30],
                    }}
                    transition={{
                      duration: 8,
                      repeat: Infinity,
                      ease: "linear",
                    }}
                  >
                    <div className="w-12 h-12 rounded-full bg-card border-2 border-primary flex items-center justify-center shadow-xl">
                      <Car className="w-6 h-6 text-primary" />
                    </div>
                  </motion.div>

                  {/* Location Info Overlay */}
                  <div className="absolute top-4 right-4 bg-card/95 backdrop-blur rounded-lg p-3 border border-border text-sm">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <span>Lat:</span>
                        <span className="text-foreground font-mono">34.0522</span>
                      </div>
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <span>Long:</span>
                        <span className="text-foreground font-mono">-118.2437</span>
                      </div>
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <span>Heading:</span>
                        <span className="text-foreground font-mono">120 deg</span>
                      </div>
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <span>Speed:</span>
                        <span className="text-foreground font-mono">45 kph</span>
                      </div>
                    </div>
                  </div>
                </div>

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
