"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Calendar, Clock, Car, CreditCard, ChevronRight, Navigation } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { BookingMapPanel } from "@/components/booking-map-panel"

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

          {/* Real Google Map with Address Entry */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <BookingMapPanel
              pickup={pickup}
              dropoff={dropoff}
              onPickupChange={(addr) => setPickup(addr)}
              onDropoffChange={(addr) => setDropoff(addr)}
            />
          </motion.div>
        </div>
      </div>
    </section>
  )
}
