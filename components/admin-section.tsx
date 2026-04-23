"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { 
  Users, 
  Car, 
  DollarSign, 
  TrendingUp,
  MapPin,
  Activity,
  AlertTriangle,
  CheckCircle2,
  Clock,
  BarChart3,
  Settings,
  Shield,
  Eye
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"

const dashboardStats = [
  { label: "Total Riders", value: "52,847", change: "+12.5%", icon: Users, trend: "up" },
  { label: "Active Drivers", value: "3,284", change: "+8.2%", icon: Car, trend: "up" },
  { label: "Revenue Today", value: "$48,392", change: "+23.1%", icon: DollarSign, trend: "up" },
  { label: "Active Rides", value: "847", change: "-2.4%", icon: Activity, trend: "down" },
]

const recentRides = [
  { id: "GW-10234", rider: "John D.", driver: "Mike S.", status: "completed", fare: "$24.75", time: "2 min ago" },
  { id: "GW-10233", rider: "Sarah M.", driver: "Tom B.", status: "in-progress", fare: "$18.50", time: "5 min ago" },
  { id: "GW-10232", rider: "Alex K.", driver: "Lisa W.", status: "completed", fare: "$32.00", time: "8 min ago" },
  { id: "GW-10231", rider: "Emma R.", driver: "David H.", status: "cancelled", fare: "$0.00", time: "12 min ago" },
  { id: "GW-10230", rider: "Chris P.", driver: "Anna L.", status: "completed", fare: "$15.25", time: "15 min ago" },
]

const alerts = [
  { type: "warning", message: "High demand in Downtown area - consider surge pricing", time: "2 min ago" },
  { type: "info", message: "5 new driver applications pending review", time: "15 min ago" },
  { type: "success", message: "Payment system running smoothly", time: "1 hr ago" },
]

const adminFeatures = [
  { icon: Users, title: "User Management", description: "Manage riders and driver accounts" },
  { icon: BarChart3, title: "Analytics Dashboard", description: "Real-time business insights" },
  { icon: DollarSign, title: "Payment Control", description: "WorldPay integration management" },
  { icon: MapPin, title: "Zone Management", description: "Configure service areas and pricing" },
  { icon: Shield, title: "Security Center", description: "Monitor fraud and safety" },
  { icon: Settings, title: "System Settings", description: "Configure app behavior" },
]

export function AdminSection() {
  const [activeTab, setActiveTab] = useState<"overview" | "rides" | "users">("overview")

  return (
    <section id="admin" className="py-24 bg-gradient-to-b from-secondary/20 to-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 mb-6">
            <Shield className="w-4 h-4 text-primary" />
            <span className="text-sm font-medium text-primary">Super Admin</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-4">
            Admin Control Center
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Powerful tools to manage your entire ride-sharing platform
          </p>
        </motion.div>

        {/* Admin Dashboard Preview */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <Card className="bg-card border-border overflow-hidden">
            {/* Dashboard Header */}
            <div className="bg-secondary/50 border-b border-border p-4">
              <div className="flex items-center justify-between flex-wrap gap-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center">
                    <Shield className="w-5 h-5 text-primary-foreground" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground">GlidewayRide Admin</h3>
                    <p className="text-xs text-muted-foreground">Super Admin Dashboard</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Button variant="outline" size="sm">
                    <Settings className="w-4 h-4 mr-2" />
                    Settings
                  </Button>
                  <Button size="sm" className="bg-primary text-primary-foreground">
                    <Eye className="w-4 h-4 mr-2" />
                    View Live Map
                  </Button>
                </div>
              </div>
            </div>

            <CardContent className="p-6">
              {/* Stats Grid */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                {dashboardStats.map((stat) => (
                  <div
                    key={stat.label}
                    className="p-4 rounded-xl bg-secondary/30 border border-border"
                  >
                    <div className="flex items-center justify-between mb-3">
                      <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                        <stat.icon className="w-5 h-5 text-primary" />
                      </div>
                      <span className={`text-xs font-medium px-2 py-1 rounded-full ${
                        stat.trend === "up" 
                          ? "bg-green-500/10 text-green-500" 
                          : "bg-red-500/10 text-red-500"
                      }`}>
                        {stat.change}
                      </span>
                    </div>
                    <div className="text-2xl font-bold text-foreground">{stat.value}</div>
                    <div className="text-sm text-muted-foreground">{stat.label}</div>
                  </div>
                ))}
              </div>

              <div className="grid lg:grid-cols-3 gap-6">
                {/* Recent Rides */}
                <div className="lg:col-span-2">
                  <div className="flex items-center justify-between mb-4">
                    <h4 className="font-semibold text-foreground">Recent Rides</h4>
                    <Button variant="ghost" size="sm" className="text-primary">View All</Button>
                  </div>
                  <div className="rounded-xl border border-border overflow-hidden">
                    <table className="w-full">
                      <thead className="bg-secondary/50">
                        <tr>
                          <th className="text-left text-xs font-medium text-muted-foreground p-3">ID</th>
                          <th className="text-left text-xs font-medium text-muted-foreground p-3">Rider</th>
                          <th className="text-left text-xs font-medium text-muted-foreground p-3">Driver</th>
                          <th className="text-left text-xs font-medium text-muted-foreground p-3">Status</th>
                          <th className="text-left text-xs font-medium text-muted-foreground p-3">Fare</th>
                        </tr>
                      </thead>
                      <tbody>
                        {recentRides.map((ride) => (
                          <tr key={ride.id} className="border-t border-border">
                            <td className="p-3 text-sm font-mono text-foreground">{ride.id}</td>
                            <td className="p-3 text-sm text-foreground">{ride.rider}</td>
                            <td className="p-3 text-sm text-foreground">{ride.driver}</td>
                            <td className="p-3">
                              <span className={`text-xs font-medium px-2 py-1 rounded-full ${
                                ride.status === "completed" 
                                  ? "bg-green-500/10 text-green-500"
                                  : ride.status === "in-progress"
                                  ? "bg-blue-500/10 text-blue-500"
                                  : "bg-red-500/10 text-red-500"
                              }`}>
                                {ride.status}
                              </span>
                            </td>
                            <td className="p-3 text-sm font-semibold text-foreground">{ride.fare}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* Alerts */}
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <h4 className="font-semibold text-foreground">System Alerts</h4>
                    <span className="text-xs bg-primary/10 text-primary px-2 py-1 rounded-full">3 new</span>
                  </div>
                  <div className="space-y-3">
                    {alerts.map((alert, index) => (
                      <div
                        key={index}
                        className={`p-3 rounded-xl border ${
                          alert.type === "warning"
                            ? "bg-yellow-500/5 border-yellow-500/20"
                            : alert.type === "success"
                            ? "bg-green-500/5 border-green-500/20"
                            : "bg-blue-500/5 border-blue-500/20"
                        }`}
                      >
                        <div className="flex items-start gap-3">
                          {alert.type === "warning" && <AlertTriangle className="w-4 h-4 text-yellow-500 mt-0.5" />}
                          {alert.type === "success" && <CheckCircle2 className="w-4 h-4 text-green-500 mt-0.5" />}
                          {alert.type === "info" && <Activity className="w-4 h-4 text-blue-500 mt-0.5" />}
                          <div>
                            <p className="text-sm text-foreground">{alert.message}</p>
                            <p className="text-xs text-muted-foreground mt-1">{alert.time}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Admin Features Grid */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="mt-12"
        >
          <h3 className="text-xl font-bold text-foreground text-center mb-8">Admin Capabilities</h3>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {adminFeatures.map((feature, index) => (
              <div
                key={feature.title}
                className="flex items-center gap-4 p-4 rounded-xl bg-card border border-border hover:border-primary/30 transition-colors"
              >
                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <feature.icon className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <h4 className="font-semibold text-foreground">{feature.title}</h4>
                  <p className="text-sm text-muted-foreground">{feature.description}</p>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  )
}
