"use client"

import { motion } from "framer-motion"
import { useRouter } from "next/navigation"
import { Car, Users, Briefcase, Crown, Zap, Shield, Star, Check } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card"

const rideTypes = [
  {
    id: "economy",
    name: "Economy",
    description: "Affordable rides for everyday journeys",
    icon: Car,
    basePrice: 2.50,
    perMile: 1.20,
    perMinute: 0.25,
    eta: "3-5 min",
    capacity: "1-4 passengers",
    features: ["Affordable pricing", "Quick pickups", "Standard vehicles", "Cash & card accepted"],
    popular: false,
  },
  {
    id: "comfort",
    name: "Comfort",
    description: "Extra space and premium amenities",
    icon: Briefcase,
    basePrice: 4.00,
    perMile: 1.80,
    perMinute: 0.35,
    eta: "2-4 min",
    capacity: "1-4 passengers",
    features: ["Newer vehicles", "Extra legroom", "Top-rated drivers", "Bottled water"],
    popular: true,
  },
  {
    id: "premium",
    name: "Premium",
    description: "Luxury vehicles for special occasions",
    icon: Crown,
    basePrice: 8.00,
    perMile: 3.50,
    perMinute: 0.65,
    eta: "5-8 min",
    capacity: "1-4 passengers",
    features: ["Luxury vehicles", "Professional drivers", "Premium amenities", "Priority support"],
    popular: false,
  },
  {
    id: "xl",
    name: "XL",
    description: "Perfect for groups and extra luggage",
    icon: Users,
    basePrice: 5.00,
    perMile: 2.20,
    perMinute: 0.40,
    eta: "4-6 min",
    capacity: "1-6 passengers",
    features: ["Larger vehicles", "Extra luggage space", "Group friendly", "Minivans & SUVs"],
    popular: false,
  },
]

const pricingFeatures = [
  { icon: Zap, title: "Surge Pricing", description: "Transparent pricing during peak hours" },
  { icon: Shield, title: "Price Lock", description: "Lock in your fare before the ride" },
  { icon: Star, title: "Rewards", description: "Earn points on every ride" },
]

export function RideTypesSection() {
  const router = useRouter()

  const handleSelectRide = (rideType: string) => {
    // Navigate to booking section or rider app
    router.push(`/?ride=${rideType}#booking`)
  }

  return (
    <section id="ride-types" className="py-24 bg-background">
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
            Choose Your Ride
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            From budget-friendly to luxury, we have the perfect ride for every occasion
          </p>
        </motion.div>

        {/* Ride Type Cards */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          {rideTypes.map((ride, index) => (
            <motion.div
              key={ride.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <Card className={`relative h-full bg-card border-border hover:border-primary/50 transition-all duration-300 cursor-pointer hover:shadow-lg ${
                ride.popular ? "ring-2 ring-primary" : ""
              }`}>
                {ride.popular && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1 bg-primary text-primary-foreground text-xs font-semibold rounded-full">
                    Most Popular
                  </div>
                )}
                <CardHeader className="text-center pb-4">
                  <div className={`w-16 h-16 mx-auto rounded-2xl flex items-center justify-center mb-4 ${
                    ride.popular ? "bg-primary/20" : "bg-secondary"
                  }`}>
                    <ride.icon className={`w-8 h-8 ${ride.popular ? "text-primary" : "text-muted-foreground"}`} />
                  </div>
                  <CardTitle className="text-foreground">{ride.name}</CardTitle>
                  <CardDescription>{ride.description}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Pricing */}
                  <div className="text-center p-4 rounded-xl bg-secondary/50">
                    <div className="text-3xl font-bold text-foreground">${ride.basePrice.toFixed(2)}</div>
                    <div className="text-sm text-muted-foreground">base fare</div>
                    <div className="mt-2 text-xs text-muted-foreground">
                      +${ride.perMile.toFixed(2)}/mi • +${ride.perMinute.toFixed(2)}/min
                    </div>
                  </div>

                  {/* Info */}
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">ETA</span>
                    <span className="text-foreground font-medium">{ride.eta}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Capacity</span>
                    <span className="text-foreground font-medium">{ride.capacity}</span>
                  </div>

                  {/* Features */}
                  <div className="space-y-2 pt-4 border-t border-border">
                    {ride.features.map((feature) => (
                      <div key={feature} className="flex items-center gap-2 text-sm">
                        <Check className="w-4 h-4 text-primary flex-shrink-0" />
                        <span className="text-muted-foreground">{feature}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
                <CardFooter>
                  <Button 
                    onClick={() => handleSelectRide(ride.id)}
                    className={`w-full ${
                      ride.popular 
                        ? "bg-primary text-primary-foreground hover:bg-primary/90" 
                        : "bg-secondary text-foreground hover:bg-secondary/80"
                    }`}
                  >
                    Select {ride.name}
                  </Button>
                </CardFooter>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Pricing Features */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="grid md:grid-cols-3 gap-6"
        >
          {pricingFeatures.map((feature, index) => (
            <div
              key={feature.title}
              className="flex items-center gap-4 p-6 rounded-2xl bg-card border border-border"
            >
              <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
                <feature.icon className="w-6 h-6 text-primary" />
              </div>
              <div>
                <h3 className="font-semibold text-foreground">{feature.title}</h3>
                <p className="text-sm text-muted-foreground">{feature.description}</p>
              </div>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}
