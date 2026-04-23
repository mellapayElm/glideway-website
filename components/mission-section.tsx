"use client"

import { motion } from "framer-motion"
import { Target, Eye, Shield, Heart, Zap, Users } from "lucide-react"

export function MissionSection() {
  return (
    <section id="mission" className="py-20 bg-background relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground mb-4">
            Our <span className="text-primary">Mission</span> & <span className="text-primary">Vision</span>
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Building the future of transportation with safety, transparency, and excellence at every step
          </p>
        </motion.div>

        {/* Mission & Vision Cards */}
        <div className="grid md:grid-cols-2 gap-8 mb-16">
          {/* Mission Card */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="bg-card border border-border rounded-2xl p-8 hover:border-primary/50 transition-all duration-300"
          >
            <div className="w-14 h-14 rounded-xl bg-primary/10 flex items-center justify-center mb-6">
              <Target className="w-7 h-7 text-primary" />
            </div>
            <h3 className="text-2xl font-bold text-foreground mb-4">GlideWay Mission</h3>
            <p className="text-muted-foreground leading-relaxed">
              GlideWay&apos;s mission is to deliver safe, smooth, transparent, and customer-centered 
              transportation by combining technology, dependable service, secure communication, 
              and clear support at every step of the ride experience.
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              {["Safe", "Smooth", "Transparent", "Customer-Centered"].map((tag) => (
                <span key={tag} className="px-3 py-1 bg-primary/10 text-primary text-sm rounded-full">
                  {tag}
                </span>
              ))}
            </div>
          </motion.div>

          {/* Vision Card */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="bg-card border border-border rounded-2xl p-8 hover:border-primary/50 transition-all duration-300"
          >
            <div className="w-14 h-14 rounded-xl bg-primary/10 flex items-center justify-center mb-6">
              <Eye className="w-7 h-7 text-primary" />
            </div>
            <h3 className="text-2xl font-bold text-foreground mb-4">GlideWay Vision</h3>
            <p className="text-muted-foreground leading-relaxed">
              GlideWay&apos;s vision is to become a trusted modern ride platform known for excellent 
              customer service, informed digital booking, strong driver quality, secure payment 
              systems, and smooth travel that feels simple and professional.
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              {["Trusted", "Modern", "Professional", "Secure"].map((tag) => (
                <span key={tag} className="px-3 py-1 bg-primary/10 text-primary text-sm rounded-full">
                  {tag}
                </span>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Core Values */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-8"
        >
          <h3 className="text-xl font-semibold text-foreground mb-2">Our Core Values</h3>
          <p className="text-muted-foreground">The principles that guide every GlideWay ride</p>
        </motion.div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { icon: Shield, label: "Safety First", desc: "Your security is our priority" },
            { icon: Heart, label: "Customer Care", desc: "24/7 dedicated support" },
            { icon: Zap, label: "Efficiency", desc: "Fast, reliable service" },
            { icon: Users, label: "Community", desc: "Building trusted connections" },
          ].map((value, index) => (
            <motion.div
              key={value.label}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="bg-secondary/50 rounded-xl p-4 text-center hover:bg-secondary transition-colors"
            >
              <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center mx-auto mb-3">
                <value.icon className="w-5 h-5 text-primary" />
              </div>
              <h4 className="font-semibold text-foreground text-sm mb-1">{value.label}</h4>
              <p className="text-muted-foreground text-xs">{value.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
