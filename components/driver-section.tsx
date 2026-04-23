"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Car, DollarSign, Clock, Shield, Wallet, CheckCircle2, ChevronRight, Users, Star, Play, Phone, Upload, CreditCard, Fingerprint, Send, Eye, BadgeCheck } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import Link from "next/link"

const benefits = [
  { icon: DollarSign, title: "Earn More", description: "Competitive rates with weekly payouts" },
  { icon: Clock, title: "Flexible Hours", description: "Drive when you want, as much as you want" },
  { icon: Shield, title: "Full Insurance", description: "Comprehensive coverage while you drive" },
  { icon: Wallet, title: "Instant Pay", description: "Cash out your earnings anytime" },
]

const onboardingSteps = [
  { step: 1,  icon: Play,        title: "Click Become a Driver",      description: "Start your application", color: "from-emerald-500 to-green-600" },
  { step: 2,  icon: Users,       title: "Enter Personal Info",         description: "Name, DOB, SSN, contact details", color: "from-blue-500 to-cyan-600" },
  { step: 3,  icon: Phone,       title: "Verify Phone & Email",        description: "OTP confirmation to both", color: "from-violet-500 to-purple-600" },
  { step: 4,  icon: BadgeCheck,  title: "Upload Driver License",       description: "Front and back scan required", color: "from-orange-500 to-amber-600" },
  { step: 5,  icon: Shield,      title: "Upload Insurance",            description: "Current vehicle insurance proof", color: "from-pink-500 to-rose-600" },
  { step: 6,  icon: Car,         title: "Enter Vehicle Details",       description: "Make, model, year, VIN, plate", color: "from-teal-500 to-cyan-600" },
  { step: 7,  icon: CreditCard,  title: "Add Payout Account",          description: "Bank details for direct deposit", color: "from-indigo-500 to-blue-600" },
  { step: 8,  icon: Fingerprint, title: "Background Check Consent",    description: "Authorize screening authorization", color: "from-red-500 to-orange-600" },
  { step: 9,  icon: Send,        title: "Submit Application",          description: "Final review and submission", color: "from-emerald-500 to-teal-600" },
  { step: 10, icon: Eye,         title: "Admin Reviews Documents",     description: "Compliance team verifies all docs", color: "from-slate-500 to-gray-600" },
  { step: 11, icon: CheckCircle2,title: "Driver Approved & Activated", description: "Ready to accept rides and earn", color: "from-green-500 to-emerald-600" },
]

const serviceStandards = [
  { title: "Professional Appearance", description: "Drivers maintain clean, well-groomed appearance and wear a GlideWay lanyard at all times while on duty." },
  { title: "Vehicle Standards", description: "Vehicles must be 2015 or newer, fully insured, and pass our 50-point safety inspection every six months." },
  { title: "Rider-First Service", description: "Greet every rider, assist with luggage, offer bottled water on Comfort & Premium tiers, and maintain a 4.7+ rating." },
  { title: "Zero-Tolerance Policy", description: "Discrimination, distracted driving, and any form of harassment result in immediate account suspension." },
]

export function DriverSection() {
  const [hoveredStep, setHoveredStep] = useState<number | null>(null)

  return (
    <section id="drivers" className="py-24 bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 mb-6">
            <Car className="w-4 h-4 text-primary" />
            <span className="text-sm font-medium text-primary">Drive with Us</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-4">
            Become a GlideWay Driver
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto text-lg">
            Join our network of professional drivers. Earn on your schedule, protected by GlideWay.
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-12 items-start">

          {/* LEFT — Benefits + Standards + Stats */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="space-y-8"
          >
            {/* Benefits */}
            <div className="grid grid-cols-2 gap-4">
              {benefits.map((b) => (
                <div key={b.title} className="p-5 rounded-2xl bg-card border border-border hover:border-primary/30 transition-colors">
                  <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center mb-3">
                    <b.icon className="w-5 h-5 text-primary" />
                  </div>
                  <h4 className="font-semibold text-foreground mb-1">{b.title}</h4>
                  <p className="text-sm text-muted-foreground">{b.description}</p>
                </div>
              ))}
            </div>

            {/* Service Standards */}
            <div>
              <h3 className="text-lg font-bold text-foreground mb-4">Driver Service Standards</h3>
              <div className="grid gap-4">
                {serviceStandards.map((std) => (
                  <div key={std.title} className="flex gap-4 p-4 rounded-xl bg-card border border-border">
                    <CheckCircle2 className="w-5 h-5 text-primary mt-0.5 shrink-0" />
                    <div>
                      <h4 className="font-semibold text-foreground text-sm">{std.title}</h4>
                      <p className="text-xs text-muted-foreground mt-1 leading-relaxed">{std.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-4">
              {[
                { icon: Users,     value: "10K+",  label: "Active Drivers" },
                { icon: DollarSign,value: "$25/hr", label: "Avg. Earnings" },
                { icon: Star,      value: "4.8",    label: "Driver Rating" },
              ].map((s) => (
                <div key={s.label} className="text-center p-4 rounded-xl bg-primary/5 border border-primary/10">
                  <s.icon className="w-5 h-5 text-primary mx-auto mb-2" />
                  <div className="text-xl font-bold text-foreground">{s.value}</div>
                  <div className="text-xs text-muted-foreground">{s.label}</div>
                </div>
              ))}
            </div>
          </motion.div>

          {/* RIGHT — 11-Step clickable onboarding pipeline */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <Card className="bg-card border-border sticky top-24">
              <CardHeader className="pb-4">
                <CardTitle className="text-foreground text-xl">Driver Onboarding — 11 Steps</CardTitle>
                <p className="text-sm text-muted-foreground">Tap any step to begin, or click the button below to start now.</p>
              </CardHeader>
              <CardContent className="space-y-2 pb-6">

                {/* Step pipeline */}
                {onboardingSteps.map((s, idx) => (
                  <Link key={s.step} href="/driver/register">
                    <motion.div
                      onHoverStart={() => setHoveredStep(s.step)}
                      onHoverEnd={() => setHoveredStep(null)}
                      whileHover={{ x: 4 }}
                      className="flex items-center gap-3 p-3 rounded-xl border border-transparent hover:border-primary/30 hover:bg-primary/5 transition-all cursor-pointer group"
                    >
                      {/* Step number + icon */}
                      <div className={`w-9 h-9 rounded-xl bg-gradient-to-br ${s.color} flex items-center justify-center shrink-0 shadow-sm`}>
                        <s.icon className="w-4 h-4 text-white" />
                      </div>

                      {/* Connector line for non-last items */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-bold text-muted-foreground w-5">S{s.step}</span>
                          <p className="text-sm font-semibold text-foreground truncate group-hover:text-primary transition-colors">
                            {s.title}
                          </p>
                          {s.step === 11 && (
                            <span className="ml-auto shrink-0 px-2 py-0.5 rounded-full bg-green-500/20 text-green-400 text-xs font-semibold">
                              Final
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-muted-foreground pl-7 truncate">{s.description}</p>
                      </div>

                      <ChevronRight className={`w-4 h-4 shrink-0 transition-all ${hoveredStep === s.step ? "text-primary translate-x-0.5" : "text-muted-foreground/40"}`} />
                    </motion.div>

                    {/* Connector dot between steps */}
                    {idx < onboardingSteps.length - 1 && (
                      <div className="flex items-center ml-[22px] my-0.5">
                        <div className="w-0.5 h-2 bg-border rounded-full" />
                      </div>
                    )}
                  </Link>
                ))}

                {/* Primary CTA */}
                <div className="pt-4">
                  <Link href="/driver/register">
                    <Button className="w-full h-14 bg-primary text-primary-foreground hover:bg-primary/90 text-base font-bold group shadow-lg shadow-primary/25">
                      <Play className="w-5 h-5 mr-2 group-hover:scale-110 transition-transform" />
                      Become a Driver — Start Now
                      <ChevronRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                    </Button>
                  </Link>
                  <p className="text-xs text-center text-muted-foreground mt-3">
                    Takes about 10 minutes. Admin approval within 24–48 hours.
                  </p>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
