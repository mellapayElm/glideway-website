"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { MapPin, Calendar, Clock, Car, CreditCard, ChevronRight, Navigation, Locate } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

const rideOptions = [
  { id: "economy", name: "Economy", price: "$12-15", time: "5 min", icon: Car, description: "Affordable everyday rides" },
  { id: "comfort", name: "Comfort", price: "$18-22", time: "3 min", icon: Car, description: "Extra legroom & amenities" },
  { id: "premium", name: "Premium", price: "$35-45", time: "7 min", icon: Car, description: "Luxury vehicles" },
  { id: "xl", name: "XL", price: "$25-30", time: "8 min", icon: Car, description: "For groups up to 6" },
]

export function BookingSection() {
  const [pickup, setPickup] = useState("")
  const [dropoff, setDropoff] = useState("")
  const [selectedRide, setSelectedRide] = useState("comfort")
  const [isBooking, setIsBooking] = useState(false)
  const [bookingStep, setBookingStep] = useState<"location" | "ride" | "payment" | "confirmed">("location")

  const handleBookRide = async () => {
    setIsBooking(true)
    await new Promise(resolve => setTimeout(resolve, 2000))
    setBookingStep("confirmed")
    setIsBooking(false)
  }

  return (
    <section id="booking" className="py-24 bg-gradient-to-b from-background to-secondary/20">
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
            Book Your Ride
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Enter your pickup and drop-off locations to get started with your journey
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-8 items-start">
          {/* Booking Form */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <Card className="bg-card border-border">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-foreground">
                  <Navigation className="w-5 h-5 text-primary" />
                  Where are you going?
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Location Inputs */}
                <div className="space-y-4">
                  <div className="relative">
                    <div className="absolute left-3 top-1/2 -translate-y-1/2 flex flex-col items-center">
                      <div className="w-3 h-3 rounded-full bg-primary" />
                      <div className="w-0.5 h-8 bg-border my-1" />
                      <div className="w-3 h-3 rounded-full bg-destructive" />
                    </div>
                    <div className="space-y-3 pl-10">
                      <div className="relative">
                        <Input
                          placeholder="Enter pickup location"
                          value={pickup}
                          onChange={(e) => setPickup(e.target.value)}
                          className="h-12 bg-secondary border-border text-foreground pr-10"
                        />
                        <button className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-primary transition-colors">
                          <Locate className="w-5 h-5" />
                        </button>
                      </div>
                      <div className="relative">
                        <Input
                          placeholder="Enter drop-off location"
                          value={dropoff}
                          onChange={(e) => setDropoff(e.target.value)}
                          className="h-12 bg-secondary border-border text-foreground"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Date & Time */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="relative">
                    <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                    <Input
                      type="date"
                      className="h-12 bg-secondary border-border text-foreground pl-10"
                    />
                  </div>
                  <div className="relative">
                    <Clock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                    <Input
                      type="time"
                      className="h-12 bg-secondary border-border text-foreground pl-10"
                    />
                  </div>
                </div>

                {/* Ride Options */}
                <div className="space-y-3">
                  <p className="text-sm font-medium text-foreground">Select Ride Type</p>
                  <div className="grid grid-cols-2 gap-3">
                    {rideOptions.map((ride) => (
                      <button
                        key={ride.id}
                        onClick={() => setSelectedRide(ride.id)}
                        className={`p-4 rounded-xl border text-left transition-all ${
                          selectedRide === ride.id
                            ? "border-primary bg-primary/10"
                            : "border-border bg-secondary/50 hover:border-primary/50"
                        }`}
                      >
                        <div className="flex items-center gap-3 mb-2">
                          <ride.icon className={`w-5 h-5 ${selectedRide === ride.id ? "text-primary" : "text-muted-foreground"}`} />
                          <span className={`font-medium ${selectedRide === ride.id ? "text-primary" : "text-foreground"}`}>
                            {ride.name}
                          </span>
                        </div>
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-muted-foreground">{ride.time} away</span>
                          <span className="font-semibold text-foreground">{ride.price}</span>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Payment Method */}
                <div className="flex items-center justify-between p-4 rounded-xl bg-secondary/50 border border-border">
                  <div className="flex items-center gap-3">
                    <CreditCard className="w-5 h-5 text-primary" />
                    <div>
                      <p className="text-sm font-medium text-foreground">WorldPay Secure</p>
                      <p className="text-xs text-muted-foreground">**** **** **** 4242</p>
                    </div>
                  </div>
                  <Button variant="ghost" size="sm" className="text-primary">
                    Change
                  </Button>
                </div>

                {/* Book Button */}
                <Button
                  onClick={handleBookRide}
                  disabled={!pickup || !dropoff || isBooking}
                  className="w-full h-14 bg-primary text-primary-foreground hover:bg-primary/90 text-lg font-semibold group"
                >
                  {isBooking ? (
                    <span className="flex items-center gap-2">
                      <span className="h-5 w-5 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
                      Finding your ride...
                    </span>
                  ) : (
                    <span className="flex items-center gap-2">
                      Book Ride Now
                      <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                    </span>
                  )}
                </Button>
              </CardContent>
            </Card>
          </motion.div>

          {/* Map Preview */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="relative"
          >
            <Card className="bg-card border-border overflow-hidden">
              <div className="aspect-square lg:aspect-[4/3] bg-secondary relative">
                {/* Simulated Map */}
                <div className="absolute inset-0 bg-gradient-to-br from-secondary to-muted">
                  {/* Grid lines for map effect */}
                  <div 
                    className="absolute inset-0 opacity-20"
                    style={{
                      backgroundImage: `linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px),
                                       linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)`,
                      backgroundSize: '40px 40px'
                    }}
                  />
                  
                  {/* Pickup marker */}
                  <div className="absolute top-1/3 left-1/4 flex flex-col items-center">
                    <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center shadow-lg">
                      <MapPin className="w-4 h-4 text-primary-foreground" />
                    </div>
                    <div className="mt-2 px-3 py-1 rounded-full bg-card text-xs font-medium text-foreground shadow">
                      Pickup
                    </div>
                  </div>
                  
                  {/* Route line */}
                  <svg className="absolute inset-0 w-full h-full" style={{ overflow: 'visible' }}>
                    <path
                      d="M 25% 33% Q 50% 20%, 70% 60%"
                      fill="none"
                      stroke="var(--primary)"
                      strokeWidth="3"
                      strokeDasharray="8 4"
                      className="opacity-60"
                    />
                  </svg>
                  
                  {/* Dropoff marker */}
                  <div className="absolute bottom-1/3 right-1/4 flex flex-col items-center">
                    <div className="w-8 h-8 rounded-full bg-destructive flex items-center justify-center shadow-lg">
                      <MapPin className="w-4 h-4 text-white" />
                    </div>
                    <div className="mt-2 px-3 py-1 rounded-full bg-card text-xs font-medium text-foreground shadow">
                      Drop-off
                    </div>
                  </div>
                  
                  {/* Car icon moving */}
                  <motion.div
                    className="absolute"
                    style={{ top: '40%', left: '40%' }}
                    animate={{
                      x: [0, 20, 40, 60],
                      y: [0, -10, 5, 15],
                    }}
                    transition={{
                      duration: 4,
                      repeat: Infinity,
                      ease: "linear",
                    }}
                  >
                    <div className="w-10 h-10 rounded-full bg-card border-2 border-primary flex items-center justify-center shadow-lg">
                      <Car className="w-5 h-5 text-primary" />
                    </div>
                  </motion.div>
                </div>
                
                {/* Map overlay info */}
                <div className="absolute bottom-4 left-4 right-4">
                  <div className="bg-card/95 backdrop-blur rounded-xl p-4 border border-border">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm text-muted-foreground">Estimated Time</span>
                      <span className="font-semibold text-foreground">12 min</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">Distance</span>
                      <span className="font-semibold text-foreground">4.2 miles</span>
                    </div>
                  </div>
                </div>
              </div>
            </Card>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
