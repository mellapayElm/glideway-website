"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import Link from "next/link"
import { 
  Smartphone, Download, Apple, PlayCircle, Shield, MapPin, CreditCard, 
  Star, Clock, Users, Car, CheckCircle, ArrowRight, QrCode, Globe,
  Navigation, Bell, Heart, Zap, Lock, Headphones, Gift, TrendingUp
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"

export default function DownloadPage() {
  const [activeTab, setActiveTab] = useState<"rider" | "driver">("rider")

  const riderFeatures = [
    { icon: <MapPin className="w-5 h-5" />, title: "Live GPS Tracking", desc: "Track your driver in real-time with precision GPS" },
    { icon: <CreditCard className="w-5 h-5" />, title: "Secure Payments", desc: "Pay safely with card, Apple Pay, or Google Pay" },
    { icon: <Clock className="w-5 h-5" />, title: "Schedule Rides", desc: "Book rides in advance for airport trips and events" },
    { icon: <Star className="w-5 h-5" />, title: "Rate & Review", desc: "Help maintain quality with driver ratings" },
    { icon: <Shield className="w-5 h-5" />, title: "Safety Features", desc: "Share trip, emergency button, and verified drivers" },
    { icon: <Heart className="w-5 h-5" />, title: "Saved Places", desc: "Save Home, Work, and favorite destinations" },
    { icon: <Bell className="w-5 h-5" />, title: "Real-time Updates", desc: "Get notified when your driver arrives" },
    { icon: <Gift className="w-5 h-5" />, title: "Rewards Program", desc: "Earn points on every ride you take" },
  ]

  const driverFeatures = [
    { icon: <Navigation className="w-5 h-5" />, title: "Smart Navigation", desc: "Turn-by-turn directions with traffic updates" },
    { icon: <TrendingUp className="w-5 h-5" />, title: "Earnings Dashboard", desc: "Track daily, weekly, and monthly earnings" },
    { icon: <Zap className="w-5 h-5" />, title: "Instant Payouts", desc: "Get paid same-day or weekly with direct deposit" },
    { icon: <Clock className="w-5 h-5" />, title: "Flexible Hours", desc: "Work whenever you want, no minimums" },
    { icon: <Shield className="w-5 h-5" />, title: "Insurance Coverage", desc: "Protected while driving with riders" },
    { icon: <Users className="w-5 h-5" />, title: "Rider Ratings", desc: "See rider ratings before accepting trips" },
    { icon: <Headphones className="w-5 h-5" />, title: "24/7 Support", desc: "Driver support available around the clock" },
    { icon: <Lock className="w-5 h-5" />, title: "Secure Platform", desc: "Background checks and verified riders" },
  ]

  const features = activeTab === "rider" ? riderFeatures : driverFeatures

  return (
    <div className="min-h-screen bg-slate-950">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-slate-900/90 backdrop-blur-sm border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <Link href="/" className="text-xl font-bold tracking-tight">
              <span className="text-white">GLIDE</span><span className="text-lime-400">WAY</span>
            </Link>
            <div className="flex items-center gap-4">
              <Link href="/rider">
                <Button variant="ghost" className="text-slate-300 hover:text-white">
                  Open Web App
                </Button>
              </Link>
              <Link href="/driver/register">
                <Button className="bg-emerald-600 hover:bg-emerald-700 text-white">
                  Become a Driver
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative py-20 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-emerald-900/20 via-slate-900 to-blue-900/20" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left Content */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
            >
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white mb-6">
                Download the{" "}
                <span className="text-emerald-400">GlideWoy</span>{" "}
                App
              </h1>
              <p className="text-xl text-slate-300 mb-8">
                Get reliable rides or earn money driving. Available on iOS and Android.
              </p>

              {/* App Toggle */}
              <div className="flex gap-2 p-1 bg-slate-800 rounded-xl mb-8 w-fit">
                <button
                  onClick={() => setActiveTab("rider")}
                  className={`px-6 py-3 rounded-lg font-medium transition-all ${
                    activeTab === "rider"
                      ? "bg-emerald-600 text-white"
                      : "text-slate-400 hover:text-white"
                  }`}
                >
                  <Car className="w-5 h-5 inline mr-2" />
                  Rider App
                </button>
                <button
                  onClick={() => setActiveTab("driver")}
                  className={`px-6 py-3 rounded-lg font-medium transition-all ${
                    activeTab === "driver"
                      ? "bg-emerald-600 text-white"
                      : "text-slate-400 hover:text-white"
                  }`}
                >
                  <Users className="w-5 h-5 inline mr-2" />
                  Driver App
                </button>
              </div>

              {/* Download Buttons */}
              <div className="flex flex-wrap gap-4 mb-8">
                <a
                  href="#"
                  className="flex items-center gap-3 bg-black border border-slate-700 rounded-xl px-6 py-3 hover:bg-slate-900 transition-all group"
                >
                  <Apple className="w-8 h-8 text-white" />
                  <div className="text-left">
                    <div className="text-xs text-slate-400">Download on the</div>
                    <div className="text-lg font-semibold text-white">App Store</div>
                  </div>
                </a>
                <a
                  href="#"
                  className="flex items-center gap-3 bg-black border border-slate-700 rounded-xl px-6 py-3 hover:bg-slate-900 transition-all group"
                >
                  <PlayCircle className="w-8 h-8 text-white" />
                  <div className="text-left">
                    <div className="text-xs text-slate-400">Get it on</div>
                    <div className="text-lg font-semibold text-white">Google Play</div>
                  </div>
                </a>
              </div>

              {/* Quick Stats */}
              <div className="flex gap-8">
                <div>
                  <div className="text-3xl font-bold text-white">4.8</div>
                  <div className="flex items-center gap-1 text-yellow-400">
                    <Star className="w-4 h-4 fill-current" />
                    <Star className="w-4 h-4 fill-current" />
                    <Star className="w-4 h-4 fill-current" />
                    <Star className="w-4 h-4 fill-current" />
                    <Star className="w-4 h-4 fill-current" />
                  </div>
                  <div className="text-sm text-slate-400">App Rating</div>
                </div>
                <div>
                  <div className="text-3xl font-bold text-white">100K+</div>
                  <div className="text-sm text-slate-400">Downloads</div>
                </div>
                <div>
                  <div className="text-3xl font-bold text-white">50+</div>
                  <div className="text-sm text-slate-400">Cities</div>
                </div>
              </div>
            </motion.div>

            {/* Right - Phone Mockup */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="relative flex justify-center"
            >
              <div className="relative">
                {/* Phone Frame */}
                <div className="relative w-72 h-[580px] bg-slate-900 rounded-[3rem] border-4 border-slate-700 shadow-2xl overflow-hidden">
                  {/* Status Bar */}
                  <div className="absolute top-0 left-0 right-0 h-8 bg-slate-950 flex items-center justify-between px-6 z-10">
                    <span className="text-xs text-white font-medium">9:41</span>
                    <div className="flex items-center gap-1">
                      <div className="w-4 h-2 border border-white rounded-sm">
                        <div className="w-3 h-1.5 bg-emerald-400 rounded-sm" />
                      </div>
                    </div>
                  </div>
                  
                  {/* Notch */}
                  <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-7 bg-slate-950 rounded-b-2xl z-20" />
                  
                  {/* App Content Preview */}
                  <div className="pt-10 h-full bg-gradient-to-b from-slate-900 to-slate-950 p-4">
                    <div className="flex items-center justify-between mb-6">
                      <span className="text-sm font-bold"><span className="text-white">GLIDE</span><span className="text-lime-400">WAY</span></span>
                      <div className="w-10 h-10 rounded-full bg-emerald-600 flex items-center justify-center text-white font-bold">
                        JD
                      </div>
                    </div>
                    
                    <div className="bg-slate-800 rounded-xl p-4 mb-4">
                      <div className="text-sm text-slate-400 mb-2">Where to?</div>
                      <div className="flex items-center gap-3">
                        <div className="w-3 h-3 rounded-full bg-emerald-500" />
                        <div className="text-white">Enter destination</div>
                      </div>
                    </div>

                    <div className="grid grid-cols-4 gap-2 mb-6">
                      {["Home", "Work", "Airport", "Event"].map((place) => (
                        <div key={place} className="bg-slate-800 rounded-lg p-3 text-center">
                          <div className="w-8 h-8 mx-auto rounded-full bg-slate-700 flex items-center justify-center mb-1">
                            <MapPin className="w-4 h-4 text-emerald-400" />
                          </div>
                          <div className="text-xs text-slate-300">{place}</div>
                        </div>
                      ))}
                    </div>

                    <div className="bg-gradient-to-r from-emerald-900/50 to-blue-900/50 rounded-xl p-4 border border-emerald-800/50">
                      <div className="flex items-center gap-3 mb-2">
                        <Zap className="w-5 h-5 text-emerald-400" />
                        <span className="text-white font-medium">Quick Ride</span>
                      </div>
                      <div className="text-sm text-slate-400">
                        12 drivers nearby - 3 min avg wait
                      </div>
                    </div>
                  </div>
                </div>

                {/* Decorative Elements */}
                <div className="absolute -top-10 -right-10 w-32 h-32 bg-emerald-500/20 rounded-full blur-3xl" />
                <div className="absolute -bottom-10 -left-10 w-32 h-32 bg-blue-500/20 rounded-full blur-3xl" />
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-slate-900/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
              {activeTab === "rider" ? "Rider" : "Driver"} App Features
            </h2>
            <p className="text-lg text-slate-400 max-w-2xl mx-auto">
              {activeTab === "rider"
                ? "Everything you need for a safe, reliable, and affordable ride experience."
                : "All the tools you need to earn money on your own schedule."}
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className="bg-slate-800/50 border-slate-700 hover:border-emerald-500/50 transition-all h-full">
                  <CardContent className="p-6">
                    <div className="w-12 h-12 rounded-xl bg-emerald-500/20 flex items-center justify-center text-emerald-400 mb-4">
                      {feature.icon}
                    </div>
                    <h3 className="text-lg font-semibold text-white mb-2">{feature.title}</h3>
                    <p className="text-sm text-slate-400">{feature.desc}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* App Description Section */}
      <section className="py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-3xl p-8 md:p-12 border border-slate-700"
          >
            <h2 className="text-2xl sm:text-3xl font-bold text-white mb-6">
              About GlideWoy
            </h2>
            <div className="prose prose-invert max-w-none">
              <p className="text-lg text-slate-300 mb-4">
                GlideWoy is a modern ride-booking platform designed to make transportation simple, 
                secure, affordable, and easy to use. Whether you need a ride to work, the airport, 
                school, church, appointments, shopping, or an event, GlideWoy helps connect you 
                with trusted drivers through a smooth mobile experience.
              </p>
              <p className="text-slate-400 mb-4">
                With GlideWoy, riders can register securely, choose pickup and drop-off locations, 
                view estimated fares, track drivers in real time, pay safely, and receive trip receipts. 
                The app uses smart GPS mapping, traffic-aware routing, and fair pricing logic to provide 
                a reliable and transparent ride experience.
              </p>
              <p className="text-slate-400">
                GlideWoy is built with rider safety, driver fairness, and operational excellence in mind.
              </p>
            </div>

            <div className="mt-8 pt-8 border-t border-slate-700">
              <h3 className="text-xl font-semibold text-white mb-4">Available Now</h3>
              <div className="flex flex-wrap gap-4">
                <a
                  href="#"
                  className="flex items-center gap-3 bg-black border border-slate-700 rounded-xl px-5 py-3 hover:bg-slate-900 transition-all"
                >
                  <Apple className="w-6 h-6 text-white" />
                  <span className="text-white font-medium">App Store</span>
                </a>
                <a
                  href="#"
                  className="flex items-center gap-3 bg-black border border-slate-700 rounded-xl px-5 py-3 hover:bg-slate-900 transition-all"
                >
                  <PlayCircle className="w-6 h-6 text-white" />
                  <span className="text-white font-medium">Google Play</span>
                </a>
                <Link
                  href="/rider"
                  className="flex items-center gap-3 bg-emerald-600 rounded-xl px-5 py-3 hover:bg-emerald-700 transition-all"
                >
                  <Globe className="w-6 h-6 text-white" />
                  <span className="text-white font-medium">Open Web App</span>
                </Link>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-emerald-900/50 to-blue-900/50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
              Ready to Get Started?
            </h2>
            <p className="text-lg text-slate-300 mb-8">
              Download the GlideWoy app and experience the difference today.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link href="/rider">
                <Button size="lg" className="bg-emerald-600 hover:bg-emerald-700 text-white px-8">
                  <Car className="w-5 h-5 mr-2" />
                  Book a Ride Now
                </Button>
              </Link>
              <Link href="/driver/register">
                <Button size="lg" variant="outline" className="border-white text-white hover:bg-white/10 px-8">
                  <Users className="w-5 h-5 mr-2" />
                  Start Driving
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 border-t border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <span className="text-lg font-bold tracking-tight"><span className="text-white">GLIDE</span><span className="text-lime-400">WAY</span></span>
            <div className="flex items-center gap-6 text-sm text-slate-400">
              <Link href="/privacy" className="hover:text-white">Privacy Policy</Link>
              <Link href="/terms" className="hover:text-white">Terms of Service</Link>
              <Link href="/support" className="hover:text-white">Support</Link>
            </div>
            <div className="text-sm text-slate-500">
              2024 GlideWoy. All rights reserved.
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
