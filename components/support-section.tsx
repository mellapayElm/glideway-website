"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Send, CheckCircle2, CalendarDays, Navigation, Clock } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

const phases = [
  {
    icon: CalendarDays,
    label: "Before Your Ride",
    color: "text-blue-400",
    bg: "bg-blue-400/10",
    border: "border-blue-400/20",
    points: [
      "Book instantly in the app — enter pickup, drop-off, date, and time.",
      "Choose Economy, Comfort, Premium, or XL based on your needs.",
      "Receive driver details (name, photo, rating, plate number) the moment a match is confirmed.",
      "Modify or cancel up to 5 minutes before pickup at no charge.",
    ],
  },
  {
    icon: Navigation,
    label: "During Your Ride",
    color: "text-[#22C55E]",
    bg: "bg-[#22C55E]/10",
    border: "border-[#22C55E]/20",
    points: [
      "Live GPS tracking visible to you and a trusted contact you share the trip with.",
      "Masked in-app calling keeps your personal number private.",
      "Tap the SOS button at any time to alert our 24/7 safety team and local emergency services.",
      "Driver routes are monitored for unusual detours — we'll reach out if anything looks off.",
    ],
  },
  {
    icon: Clock,
    label: "After Your Ride",
    color: "text-orange-400",
    bg: "bg-orange-400/10",
    border: "border-orange-400/20",
    points: [
      "Digital receipt emailed instantly — itemized fare, route map, and trip duration.",
      "Rate your driver and leave detailed feedback to help maintain quality.",
      "Dispute charges or request a refund directly through the app — resolved within 48 hours.",
      "Earn GlidePoints on every completed ride, redeemable for discounts and free trips.",
    ],
  },
]

export function SupportSection() {
  const [message, setMessage] = useState("")
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [isSent, setIsSent] = useState(false)
  const [isSending, setIsSending] = useState(false)

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!message.trim()) return
    setIsSending(true)
    await new Promise((r) => setTimeout(r, 1500))
    setIsSending(false)
    setIsSent(true)
  }

  return (
    <section id="contact" className="py-24 bg-gradient-to-b from-secondary/20 to-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-4">
            Support &amp; How It Works
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto text-pretty">
            From the moment you open the app to the moment you step out — {"we've"} got you covered every step of the way.
          </p>
        </motion.div>

        {/* Phase cards */}
        <div className="grid md:grid-cols-3 gap-6 mb-16">
          {phases.map((phase, index) => (
            <motion.div
              key={phase.label}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.45, delay: index * 0.1 }}
            >
              <Card className={`h-full bg-card border ${phase.border}`}>
                <CardHeader className="pb-3">
                  <div className={`w-12 h-12 rounded-xl ${phase.bg} flex items-center justify-center mb-3`}>
                    <phase.icon className={`w-6 h-6 ${phase.color}`} />
                  </div>
                  <CardTitle className={`text-base font-bold ${phase.color}`}>{phase.label}</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-3">
                    {phase.points.map((point, i) => (
                      <li key={i} className="flex gap-3 text-sm text-muted-foreground leading-relaxed">
                        <span className={`mt-1.5 w-1.5 h-1.5 rounded-full shrink-0 ${phase.color.replace("text-", "bg-")}`} />
                        {point}
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Support message form */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="max-w-2xl mx-auto"
        >
          <Card className="bg-card border-border">
            <CardHeader>
              <CardTitle className="text-foreground">Send Us a Message</CardTitle>
              <p className="text-sm text-muted-foreground">Our support team typically responds within 2 hours.</p>
            </CardHeader>
            <CardContent>
              {!isSent ? (
                <form onSubmit={handleSend} className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium text-foreground mb-1.5 block">Name</label>
                      <input
                        type="text"
                        placeholder="Jane Smith"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        required
                        className="w-full h-11 rounded-md px-3 text-sm bg-secondary border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/40"
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium text-foreground mb-1.5 block">Email</label>
                      <input
                        type="email"
                        placeholder="jane@example.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        className="w-full h-11 rounded-md px-3 text-sm bg-secondary border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/40"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-foreground mb-1.5 block">Message</label>
                    <textarea
                      rows={5}
                      placeholder="Describe your issue or question..."
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      required
                      className="w-full rounded-md px-3 py-2 text-sm resize-none bg-secondary border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/40"
                    />
                  </div>
                  <Button
                    type="submit"
                    disabled={isSending}
                    className="w-full h-12 bg-primary text-primary-foreground hover:bg-primary/90 font-semibold"
                  >
                    {isSending ? (
                      <span className="flex items-center gap-2">
                        <span className="h-4 w-4 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
                        Sending...
                      </span>
                    ) : (
                      <span className="flex items-center gap-2">
                        <Send className="w-4 h-4" />
                        Send Message
                      </span>
                    )}
                  </Button>
                </form>
              ) : (
                <div className="text-center py-10">
                  <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                    <CheckCircle2 className="w-8 h-8 text-primary" />
                  </div>
                  <h3 className="text-xl font-semibold text-foreground mb-2">Message Sent!</h3>
                  <p className="text-muted-foreground text-sm">
                    {"We've"} received your message and will reply to <strong className="text-foreground">{email}</strong> within 2 hours.
                  </p>
                  <Button
                    variant="outline"
                    className="mt-6"
                    onClick={() => { setIsSent(false); setMessage(""); setName(""); setEmail("") }}
                  >
                    Send Another Message
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </section>
  )
}
