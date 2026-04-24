"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { useRouter } from "next/navigation"
import { MapPin, Navigation, Car, Clock, DollarSign, ArrowRight, CheckCircle2, Shield } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

const rideOptions = [
  { type: "Economy", price: "$12-15", time: "5 min", icon: Car, desc: "Affordable daily rides" },
  { type: "Comfort", price: "$18-22", time: "3 min", icon: Car, desc: "Extra space & comfort", popular: true },
  { type: "Premium", price: "$35-45", time: "7 min", icon: Car, desc: "Luxury experience" },
  { type: "XL", price: "$25-30", time: "8 min", icon: Car, desc: "Groups & luggage" },
]

export function FareEstimateSection() {
  const router = useRouter()
  const [pickup, setPickup] = useState("")
  const [dropoff, setDropoff] = useState("")
  const [selectedRide, setSelectedRide] = useState("Comfort")
  const [showEstimate, setShowEstimate] = useState(false)

  const handleEstimate = () => {
    if (pickup && dropoff) {
      setShowEstimate(true)
    }
  }

  const handleBookRide = () => {
    router.push(`/rider?pickup=${encodeURIComponent(pickup)}&dropoff=${encodeURIComponent(dropoff)}&ride=${selectedRide.toLowerCase()}`)
  }

  return (
    <section id="fare-estimate" className="py-20 bg-secondary/30 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground mb-4">
            What will your <span className="text-primary">GlideWay</span> ride cost?
          </h2>
          <p className="text-muted-foreground text-lg max-w-3xl mx-auto">
            Plan your next trip with a simple fare preview before you confirm your ride. 
            Enter your pickup and drop-off locations to compare ride options and estimated pricing.
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-8 items-start">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="bg-card border border-border rounded-2xl p-6"
          >
            <h3 className="text-xl font-semibold text-foreground mb-6 flex items-center gap-2">
              <DollarSign className="w-5 h-5 text-primary" />
              Fare Estimate Calculator
            </h3>

            <div className="space-y-4 mb-6">
              <div className="relative">
                <div className="absolute left-3 top-1/2 -translate-y-1/2">
                  <div className="w-3 h-3 rounded-full bg-primary" />
                </div>
                <Input
                  placeholder="Enter pickup location"
                  value={pickup}
                  onChange={(e) => setPickup(e.target.value)}
                  className="pl-10 bg-secondary border-border h-12"
                />
              </div>
              <div className="relative">
                <div className="absolute left-3 top-1/2 -translate-y-1/2">
                  <div className="w-3 h-3 rounded-full bg-red-500" />
                </div>
                <Input
                  placeholder="Enter drop-off location"
                  value={dropoff}
                  onChange={(e) => setDropoff(e.target.value)}
                  className="pl-10 bg-secondary border-border h-12"
                />
              </div>
            </div>

            <div className="space-y-3 mb-6">
              {rideOptions.map((option) => (
                <button
                  key={option.type}
                  onClick={() => setSelectedRide(option.type)}
                  className={`w-full p-4 rounded-xl border transition-all duration-200 flex items-center justify-between ${
                    selectedRide === option.type
                      ? "border-primary bg-primary/10"
                      : "border-border bg-secondary/50 hover:border-primary/50"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                      selectedRide === option.type ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"
                    }`}>
                      <option.icon className="w-5 h-5" />
                    </div>
                    <div className="text-left">
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-foreground">{option.type}</span>
                        {option.popular && (
                          <span className="text-[10px] bg-primary text-primary-foreground px-2 py-0.5 rounded-full">
                            Popular
                          </span>
                        )}
                      </div>
                      <span className="text-sm text-muted-foreground">{option.desc}</span>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-semibold text-foreground">{option.price}</div>
                    <div className="text-sm text-muted-foreground flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {option.time}
                    </div>
                  </div>
                </button>
              ))}
            </div>

            <Button
              onClick={handleEstimate}
              className="w-full bg-primary text-primary-foreground hover:bg-primary/90 h-12"
              disabled={!pickup || !dropoff}
            >
              Get Fare Estimate
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="space-y-6"
          >
            {showEstimate ? (
              <div className="bg-card border border-primary rounded-2xl p-6">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                    <CheckCircle2 className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground">Your Fare Estimate</h3>
                    <p className="text-sm text-muted-foreground">{selectedRide} ride</p>
                  </div>
                </div>
                <div className="space-y-4">
                  <div className="flex items-center justify-between py-3 border-b border-border">
                    <span className="text-muted-foreground">Estimated Fare</span>
                    <span className="text-2xl font-bold text-primary">
                      {rideOptions.find(r => r.type === selectedRide)?.price}
                    </span>
                  </div>
                  <div className="flex items-center justify-between py-3 border-b border-border">
                    <span className="text-muted-foreground">Estimated Time</span>
                    <span className="font-semibold text-foreground">12-15 min</span>
                  </div>
                  <div className="flex items-center justify-between py-3">
                    <span className="text-muted-foreground">Distance</span>
                    <span className="font-semibold text-foreground">4.2 miles</span>
                  </div>
                </div>
                <Button 
                  onClick={handleBookRide}
                  className="w-full mt-6 bg-primary text-primary-foreground hover:bg-primary/90"
                >
                  Book This Ride
                </Button>
              </div>
            ) : (
              <div className="bg-card border border-border rounded-2xl p-6">
                <h3 className="text-xl font-semibold text-foreground mb-4">
                  Book your ride in seconds
                </h3>
                <p className="text-muted-foreground mb-6">
                  Easy booking with live estimate, premium ride choices, and secure checkout
                </p>
                <div className="space-y-4">
                  {[
                    { icon: MapPin, text: "Enter pickup & drop-off locations" },
                    { icon: Car, text: "Choose your preferred ride type" },
                    { icon: DollarSign, text: "See transparent pricing upfront" },
                    { icon: CheckCircle2, text: "Confirm with secure payment" },
                  ].map((step, index) => (
                    <div key={index} className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                        <step.icon className="w-4 h-4 text-primary" />
                      </div>
                      <span className="text-foreground">{step.text}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="grid grid-cols-3 gap-4">
              {[
                { icon: Shield, label: "Secure Payment" },
                { icon: Navigation, label: "Live GPS" },
                { icon: Clock, label: "24/7 Support" },
              ].map((badge) => (
                <div key={badge.label} className="bg-card border border-border rounded-xl p-4 text-center">
                  <badge.icon className="w-6 h-6 text-primary mx-auto mb-2" />
                  <span className="text-xs text-muted-foreground">{badge.label}</span>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
