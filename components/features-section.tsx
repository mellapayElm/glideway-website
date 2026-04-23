"use client"

import { motion } from "framer-motion"
import { Sofa, ShieldCheck, Zap, HandshakeIcon } from "lucide-react"

const features = [
  {
    icon: Sofa,
    title: "Comfort",
    description:
      "Every GlidewayRide vehicle is climate-controlled and meticulously maintained. Enjoy extra legroom, plush seating, and a quiet cabin so you arrive relaxed and ready — whether it's a quick trip across town or a long-haul journey.",
  },
  {
    icon: ShieldCheck,
    title: "Safety",
    description:
      "Your security is our top priority. All drivers pass rigorous background checks, vehicle inspections, and ongoing performance reviews. Real-time GPS tracking, masked calling, and 24/7 emergency support keep you protected every mile.",
  },
  {
    icon: Zap,
    title: "Efficiency",
    description:
      "Our AI-powered dispatch matches you with the nearest available driver in seconds. Dynamic routing avoids traffic, reducing wait times to under three minutes on average so you reach your destination faster, every time.",
  },
  {
    icon: HandshakeIcon,
    title: "Trust",
    description:
      "Transparent pricing with no hidden fees, end-to-end encrypted payments via WorldPay, and a driver rating system that keeps quality consistently high. When you ride with GlidewayRide, you ride with confidence.",
  },
]

export function FeaturesSection() {
  return (
    <section id="features" className="py-24 bg-background">
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
            Why Choose <span className="text-primary">GlidewayRide</span>?
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto text-pretty">
            Built around four core pillars — every decision we make starts here.
          </p>
        </motion.div>

        {/* 4 Feature cards */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.45, delay: index * 0.08 }}
              className="group flex flex-col p-7 rounded-2xl bg-card border border-border hover:border-primary/50 hover:shadow-xl hover:shadow-primary/5 transition-all duration-300"
            >
              <div className="w-14 h-14 rounded-xl bg-primary/10 flex items-center justify-center mb-5 group-hover:bg-primary/20 group-hover:scale-105 transition-all duration-300">
                <feature.icon className="w-7 h-7 text-primary" />
              </div>
              <h3 className="text-xl font-bold text-foreground mb-3">{feature.title}</h3>
              <p className="text-muted-foreground text-sm leading-relaxed flex-1">{feature.description}</p>
            </motion.div>
          ))}
        </div>

        {/* CTA strip */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="mt-16 flex flex-col sm:flex-row items-center justify-between gap-6 p-8 rounded-2xl border border-primary/20"
          style={{ background: "rgba(34,197,94,0.05)" }}
        >
          <div>
            <h3 className="text-xl font-bold text-foreground mb-1">Ready to experience the difference?</h3>
            <p className="text-muted-foreground text-sm">Join thousands of happy riders today.</p>
          </div>
          <a
            href="#booking"
            className="shrink-0 px-8 py-4 rounded-xl font-semibold transition-colors text-sm"
            style={{ background: "#22C55E", color: "#000" }}
          >
            Book Your First Ride
          </a>
        </motion.div>
      </div>
    </section>
  )
}
