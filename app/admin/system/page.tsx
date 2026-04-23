"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { 
  CheckCircle2, Circle, Clock, AlertTriangle, ChevronRight, ChevronDown,
  Database, Server, Shield, Users, Car, MapPin, DollarSign, Activity,
  Zap, TrendingUp, BarChart3, Globe, Lock, Key, CreditCard, Receipt,
  Navigation, Route, Fuel, Timer, Target, Radio, Map, Layers, Flame,
  RefreshCw, Play, Pause, Settings, Eye, Download, Upload, Link,
  ArrowRight, Check, X, Loader2, Sparkles, Crown, Award, Gauge,
  Building, Plane, Music, Coffee, ShoppingBag, Heart, Star, Bell,
  Phone, Mail, MessageSquare, Headphones, FileText, Clipboard,
  UserPlus, CarFront, Wallet, Landmark, Calculator, PieChart, BarChart2
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import NextLink from "next/link"

interface PhaseTask {
  id: string
  name: string
  status: "completed" | "in-progress" | "pending"
  description: string
  link?: string
}

interface Phase {
  id: number
  name: string
  description: string
  status: "completed" | "in-progress" | "pending"
  progress: number
  color: string
  icon: React.ElementType
  tasks: PhaseTask[]
}

interface DemandZone {
  id: string
  name: string
  eta: number
  traffic: "Low" | "Moderate" | "High"
  demandIndex: number
  driversNearby: number
  color: string
  surge: number
}

export default function SystemBuildPhasesPage() {
  const [expandedPhase, setExpandedPhase] = useState<number | null>(1)
  const [selectedZone, setSelectedZone] = useState<string | null>(null)
  const [isLive, setIsLive] = useState(true)
  
  // System Build Phases
  const phases: Phase[] = [
    {
      id: 1,
      name: "Phase 1 — Fix Critical Issues",
      description: "Registration, validation, database, and authentication",
      status: "completed",
      progress: 100,
      color: "from-emerald-500 to-green-600",
      icon: Shield,
      tasks: [
        { id: "1-1", name: "Fix Register Button", status: "completed", description: "Registration form now works with full validation", link: "/app/login" },
        { id: "1-2", name: "Connect Frontend → Backend", status: "completed", description: "API routes connected to all forms", link: "/api/register" },
        { id: "1-3", name: "Add Validation", status: "completed", description: "All inputs validated with proper error handling" },
        { id: "1-4", name: "Store Users in Database", status: "completed", description: "Prisma ORM with PostgreSQL schema", link: "/admin/tech-stack" },
        { id: "1-5", name: "OTP/Email Verification", status: "completed", description: "6-digit OTP with countdown timer", link: "/app/login" },
        { id: "1-6", name: "Fix Login/Session", status: "completed", description: "JWT tokens with refresh token flow", link: "/app/login" },
      ]
    },
    {
      id: 2,
      name: "Phase 2 — Platform Structure",
      description: "Separate systems for website, app, and dashboard",
      status: "completed",
      progress: 100,
      color: "from-blue-500 to-cyan-600",
      icon: Layers,
      tasks: [
        { id: "2-1", name: "Separate GlideWay APP from Website", status: "completed", description: "App at /app, Website at /", link: "/app/login" },
        { id: "2-2", name: "Build Secure Admin Panel", status: "completed", description: "Management Portal with 9 modules", link: "/admin/login" },
        { id: "2-3", name: "Create Rider App Structure", status: "completed", description: "Complete rider experience with booking", link: "/rider" },
        { id: "2-4", name: "Create Driver System", status: "completed", description: "Driver dashboard and registration", link: "/driver" },
      ]
    },
    {
      id: 3,
      name: "Phase 3 — Core Ride System",
      description: "Booking, matching, tracking, and payments",
      status: "completed",
      progress: 100,
      color: "from-violet-500 to-purple-600",
      icon: Car,
      tasks: [
        { id: "3-1", name: "Ride Booking", status: "completed", description: "Full booking flow with location selection", link: "/rider" },
        { id: "3-2", name: "Driver Matching", status: "completed", description: "Smart algorithm with weighted scoring", link: "/rider" },
        { id: "3-3", name: "Dispatch Logic", status: "completed", description: "Real-time dispatch with zone management", link: "/admin" },
        { id: "3-4", name: "Live Tracking", status: "completed", description: "GPS updates with ETA calculation", link: "/rider" },
        { id: "3-5", name: "Pricing Engine", status: "completed", description: "Smart fare calculation with competitor comparison", link: "/admin" },
        { id: "3-6", name: "Payment Processing", status: "completed", description: "WorldPay/Stripe integration", link: "/rider" },
        { id: "3-7", name: "Receipts", status: "completed", description: "Digital receipts with fare breakdown", link: "/rider" },
      ]
    },
    {
      id: 4,
      name: "Phase 4 — Financial & Management Systems",
      description: "Accounting, payouts, analytics, and admin tools",
      status: "completed",
      progress: 100,
      color: "from-amber-500 to-orange-600",
      icon: DollarSign,
      tasks: [
        { id: "4-1", name: "Accounting Dashboard", status: "completed", description: "Full financial overview with reports", link: "/admin" },
        { id: "4-2", name: "Driver Payouts", status: "completed", description: "ACH and instant payout system", link: "/admin" },
        { id: "4-3", name: "Refund System", status: "completed", description: "Time-based refund policies", link: "/admin" },
        { id: "4-4", name: "Admin Logs", status: "completed", description: "Complete audit trail", link: "/admin" },
        { id: "4-5", name: "Performance Analytics", status: "completed", description: "Charts and metrics dashboard", link: "/admin" },
      ]
    },
    {
      id: 5,
      name: "Phase 5 — Advanced Optimization",
      description: "Smart pricing, heatmaps, and predictive systems",
      status: "completed",
      progress: 100,
      color: "from-rose-500 to-pink-600",
      icon: Sparkles,
      tasks: [
        { id: "5-1", name: "Smart Pricing vs Competitors", status: "completed", description: "2-3% lower than Uber/Lyft", link: "/admin" },
        { id: "5-2", name: "Demand Heatmaps", status: "completed", description: "Real-time zone visualization", link: "#heatmap" },
        { id: "5-3", name: "Driver Supply Balancing", status: "completed", description: "Zone-based driver distribution", link: "/admin" },
        { id: "5-4", name: "Predictive ETAs", status: "completed", description: "ML-based arrival estimates", link: "/rider" },
        { id: "5-5", name: "Route Intelligence", status: "completed", description: "Fastest/cheapest/shortest options", link: "/rider" },
      ]
    }
  ]

  // Demand Heatmap Zones
  const [demandZones, setDemandZones] = useState<DemandZone[]>([
    { id: "downtown", name: "Downtown", eta: 4, traffic: "High", demandIndex: 88, driversNearby: 24, color: "from-red-500 to-orange-500", surge: 1.4 },
    { id: "airport", name: "Airport", eta: 7, traffic: "Moderate", demandIndex: 76, driversNearby: 18, color: "from-orange-500 to-amber-500", surge: 1.2 },
    { id: "university", name: "University", eta: 5, traffic: "Moderate", demandIndex: 61, driversNearby: 12, color: "from-yellow-500 to-amber-400", surge: 1.1 },
    { id: "westside", name: "West Side", eta: 3, traffic: "Low", demandIndex: 39, driversNearby: 8, color: "from-emerald-500 to-green-500", surge: 1.0 },
    { id: "suburbs", name: "Suburbs", eta: 6, traffic: "Low", demandIndex: 28, driversNearby: 5, color: "from-green-500 to-teal-500", surge: 1.0 },
    { id: "shopping", name: "Shopping District", eta: 4, traffic: "Moderate", demandIndex: 52, driversNearby: 10, color: "from-blue-500 to-cyan-500", surge: 1.05 },
  ])

  // Live updates simulation
  useEffect(() => {
    if (!isLive) return
    const interval = setInterval(() => {
      setDemandZones(prev => prev.map(zone => ({
        ...zone,
        demandIndex: Math.max(10, Math.min(100, zone.demandIndex + Math.floor(Math.random() * 11) - 5)),
        eta: Math.max(2, Math.min(15, zone.eta + (Math.random() > 0.5 ? 1 : -1))),
        driversNearby: Math.max(2, Math.min(30, zone.driversNearby + Math.floor(Math.random() * 5) - 2)),
      })))
    }, 3000)
    return () => clearInterval(interval)
  }, [isLive])

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "completed": return <CheckCircle2 className="w-5 h-5 text-emerald-400" />
      case "in-progress": return <Loader2 className="w-5 h-5 text-blue-400 animate-spin" />
      default: return <Circle className="w-5 h-5 text-slate-500" />
    }
  }

  const getTrafficColor = (traffic: string) => {
    switch (traffic) {
      case "High": return "text-red-400"
      case "Moderate": return "text-yellow-400"
      default: return "text-emerald-400"
    }
  }

  const getDemandColor = (index: number) => {
    if (index >= 80) return "bg-red-500"
    if (index >= 60) return "bg-orange-500"
    if (index >= 40) return "bg-yellow-500"
    return "bg-emerald-500"
  }

  // GPS Mapping Features
  const gpsFeatures = [
    { icon: MapPin, name: "Detect Rider Location", desc: "GPS + fallback location detection", active: true },
    { icon: Target, name: "Validate Pickup Point", desc: "Correct wrong pin placements", active: true },
    { icon: Route, name: "Calculate Best Route", desc: "Fastest + cheapest options", active: true },
    { icon: Activity, name: "Monitor Traffic", desc: "Real-time traffic conditions", active: true },
    { icon: Timer, name: "Estimate ETA", desc: "Accurate arrival predictions", active: true },
    { icon: Clock, name: "Trip Duration", desc: "Total time estimate", active: true },
    { icon: Navigation, name: "Calculate Distance", desc: "Precise mile/km tracking", active: true },
    { icon: AlertTriangle, name: "Detect Route Changes", desc: "Auto-update on deviation", active: true },
    { icon: DollarSign, name: "Update Fare", desc: "Adjust for trip changes", active: true },
    { icon: Map, name: "Driver Navigation", desc: "Turn-by-turn guidance", active: true },
    { icon: Globe, name: "Geofencing", desc: "City and zone support", active: true },
    { icon: Flame, name: "Demand Heatmaps", desc: "Visual demand guidance", active: true },
  ]

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b border-white/10 bg-[#0a0a0a]/95 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <NextLink href="/admin" className="flex items-center gap-2 text-emerald-400 hover:text-emerald-300 transition-colors">
              <ChevronRight className="w-4 h-4 rotate-180" />
              <span>Back to Dashboard</span>
            </NextLink>
          </div>
          <h1 className="text-xl font-bold">System Build Phases</h1>
          <div className="flex items-center gap-3">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsLive(!isLive)}
              className={`border-emerald-500/50 ${isLive ? 'bg-emerald-500/20 text-emerald-400' : 'text-slate-400'}`}
            >
              {isLive ? <Play className="w-4 h-4 mr-2" /> : <Pause className="w-4 h-4 mr-2" />}
              {isLive ? 'Live Updates' : 'Paused'}
            </Button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8">
        {/* Core Vision Banner */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8 p-6 rounded-2xl bg-gradient-to-r from-emerald-500/20 via-cyan-500/20 to-blue-500/20 border border-emerald-500/30"
        >
          <div className="flex items-start gap-4">
            <div className="p-3 rounded-xl bg-emerald-500/20">
              <Crown className="w-8 h-8 text-emerald-400" />
            </div>
            <div>
              <h2 className="text-2xl font-bold mb-2">GlideWay Core Vision</h2>
              <p className="text-slate-300 mb-4">
                GlideWay is not just a ride app — it is a <span className="text-emerald-400 font-semibold">smart transportation engine</span> that combines:
              </p>
              <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
                {[
                  { icon: Navigation, text: "Real-time GPS Intelligence" },
                  { icon: DollarSign, text: "Dynamic Pricing" },
                  { icon: Shield, text: "Driver Protection" },
                  { icon: Users, text: "Customer Affordability" },
                  { icon: Zap, text: "Operational Efficiency" },
                ].map((item, i) => (
                  <div key={i} className="flex items-center gap-2 p-2 rounded-lg bg-white/5">
                    <item.icon className="w-4 h-4 text-emerald-400" />
                    <span className="text-sm">{item.text}</span>
                  </div>
                ))}
              </div>
              <p className="mt-4 text-emerald-400 font-medium">
                The winning strategy: "Smart pricing, not cheap pricing."
              </p>
            </div>
          </div>
        </motion.div>

        {/* Phase Progress Overview */}
        <div className="grid grid-cols-5 gap-4 mb-8">
          {phases.map((phase) => (
            <motion.button
              key={phase.id}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setExpandedPhase(expandedPhase === phase.id ? null : phase.id)}
              className={`p-4 rounded-xl border transition-all ${
                expandedPhase === phase.id 
                  ? 'border-emerald-500 bg-emerald-500/10' 
                  : 'border-white/10 bg-white/5 hover:border-white/20'
              }`}
            >
              <div className={`w-10 h-10 rounded-lg bg-gradient-to-br ${phase.color} flex items-center justify-center mb-3 mx-auto`}>
                <phase.icon className="w-5 h-5 text-white" />
              </div>
              <div className="text-center">
                <div className="text-sm font-medium mb-1">Phase {phase.id}</div>
                <div className="text-xs text-slate-400 mb-2">{phase.progress}%</div>
                <div className="h-1.5 bg-white/10 rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${phase.progress}%` }}
                    className={`h-full bg-gradient-to-r ${phase.color}`}
                  />
                </div>
              </div>
            </motion.button>
          ))}
        </div>

        {/* Expanded Phase Details */}
        <AnimatePresence mode="wait">
          {expandedPhase && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="mb-8"
            >
              {phases.filter(p => p.id === expandedPhase).map(phase => (
                <Card key={phase.id} className="bg-[#111]/80 border-white/10">
                  <CardHeader>
                    <div className="flex items-center gap-4">
                      <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${phase.color} flex items-center justify-center`}>
                        <phase.icon className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <CardTitle className="text-white">{phase.name}</CardTitle>
                        <CardDescription>{phase.description}</CardDescription>
                      </div>
                      <div className="ml-auto flex items-center gap-2">
                        <span className={`px-3 py-1 rounded-full text-sm ${
                          phase.status === 'completed' ? 'bg-emerald-500/20 text-emerald-400' :
                          phase.status === 'in-progress' ? 'bg-blue-500/20 text-blue-400' :
                          'bg-slate-500/20 text-slate-400'
                        }`}>
                          {phase.status === 'completed' ? 'Completed' : 
                           phase.status === 'in-progress' ? 'In Progress' : 'Pending'}
                        </span>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="grid gap-3">
                      {phase.tasks.map((task, i) => (
                        <motion.div
                          key={task.id}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: i * 0.05 }}
                          className="flex items-center gap-4 p-4 rounded-xl bg-white/5 hover:bg-white/10 transition-colors group"
                        >
                          {getStatusIcon(task.status)}
                          <div className="flex-1">
                            <div className="font-medium">{task.name}</div>
                            <div className="text-sm text-slate-400">{task.description}</div>
                          </div>
                          {task.link && (
                            <NextLink href={task.link}>
                              <Button variant="outline" size="sm" className="opacity-0 group-hover:opacity-100 transition-opacity">
                                <Eye className="w-4 h-4 mr-2" />
                                View
                              </Button>
                            </NextLink>
                          )}
                        </motion.div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Smart GPS & Mapping Engine */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold mb-4 flex items-center gap-3">
            <div className="p-2 rounded-lg bg-blue-500/20">
              <Map className="w-6 h-6 text-blue-400" />
            </div>
            Smart GPS & Mapping Engine
          </h2>
          <p className="text-slate-400 mb-6">The mapping engine is a core system, not just a visual map.</p>
          
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-3">
            {gpsFeatures.map((feature, i) => (
              <motion.button
                key={i}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="p-4 rounded-xl bg-white/5 border border-white/10 hover:border-blue-500/50 hover:bg-blue-500/10 transition-all group"
              >
                <div className="flex flex-col items-center text-center gap-2">
                  <div className="p-2 rounded-lg bg-blue-500/20 group-hover:bg-blue-500/30 transition-colors">
                    <feature.icon className="w-5 h-5 text-blue-400" />
                  </div>
                  <div className="text-sm font-medium">{feature.name}</div>
                  <div className="text-xs text-slate-500">{feature.desc}</div>
                  <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                </div>
              </motion.button>
            ))}
          </div>
        </div>

        {/* Demand Heatmap Zones */}
        <div id="heatmap" className="mb-8">
          <h2 className="text-2xl font-bold mb-4 flex items-center gap-3">
            <div className="p-2 rounded-lg bg-orange-500/20">
              <Flame className="w-6 h-6 text-orange-400" />
            </div>
            Demand Heatmap Zones
            {isLive && (
              <span className="ml-auto flex items-center gap-2 text-sm font-normal text-emerald-400">
                <Radio className="w-4 h-4 animate-pulse" />
                Live
              </span>
            )}
          </h2>
          <p className="text-slate-400 mb-6">Visual demand guidance for dispatching and pricing decisions.</p>
          
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {demandZones.map((zone) => (
              <motion.button
                key={zone.id}
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                onClick={() => setSelectedZone(selectedZone === zone.id ? null : zone.id)}
                className={`p-4 rounded-xl border transition-all ${
                  selectedZone === zone.id 
                    ? 'border-emerald-500 bg-emerald-500/10' 
                    : 'border-white/10 bg-white/5 hover:border-white/20'
                }`}
              >
                <div className={`w-full h-2 rounded-full bg-gradient-to-r ${zone.color} mb-3`} />
                <div className="text-left">
                  <div className="font-bold text-lg mb-2">{zone.name}</div>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-slate-400">ETA</span>
                      <span className="font-medium">{zone.eta} min</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">Traffic</span>
                      <span className={`font-medium ${getTrafficColor(zone.traffic)}`}>{zone.traffic}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-slate-400">Demand</span>
                      <div className="flex items-center gap-2">
                        <div className="w-16 h-2 bg-white/10 rounded-full overflow-hidden">
                          <motion.div
                            animate={{ width: `${zone.demandIndex}%` }}
                            className={`h-full ${getDemandColor(zone.demandIndex)}`}
                          />
                        </div>
                        <span className="font-medium text-xs">{zone.demandIndex}/100</span>
                      </div>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">Drivers</span>
                      <span className="font-medium text-emerald-400">{zone.driversNearby} nearby</span>
                    </div>
                    {zone.surge > 1 && (
                      <div className="flex justify-between">
                        <span className="text-slate-400">Surge</span>
                        <span className="font-medium text-orange-400">{zone.surge}x</span>
                      </div>
                    )}
                  </div>
                </div>
              </motion.button>
            ))}
          </div>
        </div>

        {/* Quick Links */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { href: "/", label: "Public Website", icon: Globe, color: "from-emerald-500 to-green-600" },
            { href: "/app/login", label: "GlideWay App", icon: Phone, color: "from-blue-500 to-cyan-600" },
            { href: "/rider", label: "Rider Dashboard", icon: Users, color: "from-violet-500 to-purple-600" },
            { href: "/driver", label: "Driver Dashboard", icon: Car, color: "from-orange-500 to-amber-600" },
            { href: "/driver/register", label: "Driver Registration", icon: UserPlus, color: "from-pink-500 to-rose-600" },
            { href: "/admin", label: "Management Portal", icon: Shield, color: "from-red-500 to-rose-600" },
            { href: "/admin/tech-stack", label: "Tech Stack", icon: Server, color: "from-indigo-500 to-blue-600" },
            { href: "/admin/login", label: "Admin Login", icon: Lock, color: "from-slate-500 to-zinc-600" },
          ].map((link, i) => (
            <NextLink key={i} href={link.href}>
              <motion.div
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className={`p-4 rounded-xl bg-gradient-to-br ${link.color} cursor-pointer group`}
              >
                <div className="flex items-center gap-3">
                  <link.icon className="w-6 h-6 text-white" />
                  <span className="font-medium text-white">{link.label}</span>
                  <ChevronRight className="w-4 h-4 text-white/50 ml-auto group-hover:translate-x-1 transition-transform" />
                </div>
              </motion.div>
            </NextLink>
          ))}
        </div>
      </main>
    </div>
  )
}
