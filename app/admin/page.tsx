"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { 
  LayoutDashboard, Users, Car, DollarSign, TrendingUp, MapPin, Activity, AlertTriangle,
  CheckCircle2, Clock, BarChart3, Settings, Shield, Eye, Search, Filter,
  Download, RefreshCw, ChevronDown, ChevronRight, Bell, Menu, X, LogOut,
  UserPlus, CarFront, CreditCard, FileText, PieChart, Globe, Zap, Phone,
  Mail, Calendar, Star, AlertCircle, Check, Ban, Edit, Trash2, MoreHorizontal,
  Building, Wallet, Receipt, TrendingDown, ArrowUpRight, ArrowDownRight,
  Fuel, Timer, Route, Navigation, MessageSquare, Headphones, Lock, Unlock,
  UserCheck, UserX, CarTaxiFront, Megaphone, Plus, Percent, Tag, Gift,
  ShieldCheck, Scale, FileWarning, ClipboardList, Truck, Wrench, BadgePercent,
  Target, Award, Gauge, Radio, Send, CircleDot, Database, Server, Key, Cog,
  Map, Flame, Sun, Moon, RotateCcw, FileDown, Printer, ChevronUp, BookOpen,
  Landmark, BadgeCheck, Fingerprint, AlertOctagon, FileLock, UserCog, History,
  Clipboard, Flag, MessageCircle, BarChart2, FileSpreadsheet, ShieldAlert, 
  ScrollText, Banknote, Calculator, Briefcase, FileCheck, CircleSlash, Play, Pause,
  ExternalLink, Copy, Info, HelpCircle, Sparkles, Layers, Package, Crown
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import Link from "next/link"

// Dashboard Views - Now with 9 comprehensive modules
type DashboardView = 
  | "super-admin" 
  | "operations" 
  | "accounting"
  | "drivers"
  | "customers"
  | "pricing"
  | "ledgers"
  | "management"
  | "compliance"

interface MenuItem {
  id: DashboardView
  label: string
  icon: React.ElementType
  color: string
  badge?: number
  description: string
}

const menuItems: MenuItem[] = [
  { id: "super-admin", label: "Super Admin", icon: Shield, color: "from-violet-500 to-purple-600", description: "Full platform control" },
  { id: "operations", label: "Operations", icon: Activity, color: "from-blue-500 to-cyan-500", description: "Daily ride monitoring" },
  { id: "accounting", label: "Accounting", icon: DollarSign, color: "from-emerald-500 to-green-500", description: "Finances & reports" },
  { id: "ledgers", label: "Ledgers & Books", icon: BookOpen, color: "from-teal-500 to-cyan-500", description: "Chart of accounts" },
  { id: "drivers", label: "Drivers", icon: CarFront, color: "from-orange-500 to-amber-500", description: "Driver oversight", badge: 5 },
  { id: "customers", label: "Customers", icon: Users, color: "from-pink-500 to-rose-500", description: "Rider profiles", badge: 12 },
  { id: "pricing", label: "Pricing Engine", icon: Gauge, color: "from-indigo-500 to-blue-500", description: "Fare management" },
  { id: "management", label: "Management", icon: UserCog, color: "from-sky-500 to-blue-500", description: "Staff & roles", badge: 3 },
  { id: "compliance", label: "Compliance", icon: ShieldAlert, color: "from-red-500 to-rose-500", description: "KYC & safety", badge: 7 },
]

export default function AdminDashboard() {
  const [currentView, setCurrentView] = useState<DashboardView>("super-admin")
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [notifications, setNotifications] = useState(7)
  const [modal, setModal] = useState<{ type: string; data?: any } | null>(null)
  const [searchQuery, setSearchQuery] = useState("")

  // Comprehensive stats
  const [stats, setStats] = useState({
    totalUsers: 24892,
    activeRides: 247,
    totalRevenue: 1847250.50,
    driverPayoutsDue: 342150.00,
    failedPayments: 23,
    disputes: 8,
    systemAlerts: 3,
    ridesRequestedToday: 1247,
    ridesAccepted: 1189,
    ridesCompleted: 892,
    ridesCanceled: 58,
    avgETA: 4.2,
    peakHour: "5:00 PM",
    activeDriversByZone: { downtown: 45, airport: 23, suburbs: 67, mall: 34 },
    totalFaresCollected: 89750.00,
    companyCommissions: 17950.00,
    driverEarningsPayable: 71800.00,
    refunds: 1250.00,
    promotionalDiscounts: 3420.00,
    taxes: 8975.00,
    processorFees: 2692.50,
    netProfitToday: 6282.50,
    onlineDrivers: 189,
    completedToday: 892,
    avgRating: 4.87,
    accountsPayable: 45230.00,
    accountsReceivable: 12450.00,
    staffCount: 47,
    openTickets: 23,
    escalations: 5,
    pendingKYC: 12,
    expiredDocs: 8,
    flaggedAccounts: 3
  })

  useEffect(() => {
    const interval = setInterval(() => {
      setStats(prev => ({
        ...prev,
        activeRides: Math.max(100, prev.activeRides + Math.floor(Math.random() * 10) - 5),
        onlineDrivers: Math.max(50, prev.onlineDrivers + Math.floor(Math.random() * 6) - 3),
        ridesCompleted: prev.ridesCompleted + Math.floor(Math.random() * 3),
        totalFaresCollected: prev.totalFaresCollected + Math.random() * 100,
        netProfitToday: prev.netProfitToday + Math.random() * 20,
      }))
    }, 4000)
    return () => clearInterval(interval)
  }, [])

  const renderContent = () => {
    switch (currentView) {
      case "super-admin":
        return <SuperAdminView stats={stats} setModal={setModal} />
      case "operations":
        return <OperationsView stats={stats} setModal={setModal} />
      case "accounting":
        return <AccountingView stats={stats} setModal={setModal} />
      case "ledgers":
        return <LedgersView stats={stats} setModal={setModal} />
      case "drivers":
        return <DriversView setModal={setModal} />
      case "customers":
        return <CustomersView setModal={setModal} />
      case "pricing":
        return <PricingView setModal={setModal} />
      case "management":
        return <ManagementView stats={stats} setModal={setModal} />
      case "compliance":
        return <ComplianceView stats={stats} setModal={setModal} />
      default:
        return <SuperAdminView stats={stats} setModal={setModal} />
    }
  }

  return (
    <div className="min-h-screen bg-slate-950 text-white flex">
      {/* Sidebar */}
      <motion.aside
        initial={false}
        animate={{ width: sidebarOpen ? 280 : 80 }}
        className="fixed left-0 top-0 h-full bg-slate-900 border-r border-slate-800 z-40 flex flex-col"
      >
        {/* Header */}
        <div className="p-4 border-b border-slate-800 flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center font-bold text-lg">
            G
          </div>
          {sidebarOpen && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <div className="font-bold text-white">GlideWay</div>
              <div className="text-[10px] text-slate-400">Management Portal</div>
            </motion.div>
          )}
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
          {menuItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setCurrentView(item.id)}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all ${
                currentView === item.id 
                  ? `bg-gradient-to-r ${item.color} text-white shadow-lg` 
                  : "hover:bg-slate-800 text-slate-400 hover:text-white"
              }`}
            >
              <item.icon className="w-5 h-5 flex-shrink-0" />
              {sidebarOpen && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex-1 text-left">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">{item.label}</span>
                    {item.badge && (
                      <span className="px-1.5 py-0.5 text-[10px] bg-red-500 rounded-full">{item.badge}</span>
                    )}
                  </div>
                  <div className="text-[10px] opacity-70">{item.description}</div>
                </motion.div>
              )}
            </button>
          ))}
        </nav>

        {/* Footer */}
        <div className="p-3 border-t border-slate-800">
          <Link href="/admin/hr">
            <button className="w-full flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-pink-500/20 text-pink-400 mb-1">
              <Users className="w-5 h-5" />
              {sidebarOpen && <span className="text-sm">HR Dashboard</span>}
            </button>
          </Link>
          <Link href="/admin/system">
            <button className="w-full flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-emerald-500/20 text-emerald-400 mb-1">
              <Layers className="w-5 h-5" />
              {sidebarOpen && <span className="text-sm">System Build Phases</span>}
            </button>
          </Link>
          <Link href="/admin/tech-stack">
            <button className="w-full flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-blue-500/20 text-blue-400 mb-1">
              <Server className="w-5 h-5" />
              {sidebarOpen && <span className="text-sm">Tech Stack</span>}
            </button>
          </Link>
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="w-full flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-slate-800 text-slate-400"
          >
            {sidebarOpen ? <ChevronDown className="w-5 h-5" /> : <ChevronRight className="w-5 h-5" />}
            {sidebarOpen && <span className="text-sm">Collapse</span>}
          </button>
          <Link href="/admin/login">
            <button className="w-full flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-red-500/20 text-red-400 mt-1">
              <LogOut className="w-5 h-5" />
              {sidebarOpen && <span className="text-sm">Sign Out</span>}
            </button>
          </Link>
        </div>
      </motion.aside>

      {/* Main Content */}
      <main className={`flex-1 transition-all ${sidebarOpen ? "ml-[280px]" : "ml-[80px]"}`}>
        {/* Top Bar */}
        <header className="sticky top-0 z-30 bg-slate-900/80 backdrop-blur-lg border-b border-slate-800 px-6 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <h1 className="text-xl font-bold">
                {menuItems.find(m => m.id === currentView)?.label || "Dashboard"}
              </h1>
              <span className="px-2 py-1 text-xs bg-green-500/20 text-green-400 rounded-full flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
                Live
              </span>
            </div>
            <div className="flex items-center gap-3">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <Input
                  placeholder="Search..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 w-64 bg-slate-800 border-slate-700 text-white"
                />
              </div>
              <Button variant="ghost" size="icon" className="relative">
                <Bell className="w-5 h-5" />
                {notifications > 0 && (
                  <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 rounded-full text-[10px] flex items-center justify-center">
                    {notifications}
                  </span>
                )}
              </Button>
              <Button variant="ghost" size="icon" onClick={() => window.location.reload()}>
                <RefreshCw className="w-5 h-5" />
              </Button>
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center text-sm font-bold">
                A
              </div>
            </div>
          </div>
        </header>

        {/* Content */}
        <div className="p-6">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentView}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.2 }}
            >
              {renderContent()}
            </motion.div>
          </AnimatePresence>
        </div>
      </main>

      {/* Modal */}
      <AnimatePresence>
        {modal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setModal(null)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-slate-900 border border-slate-700 rounded-2xl max-w-2xl w-full max-h-[80vh] overflow-auto"
            >
              <div className="p-6 border-b border-slate-700 flex items-center justify-between">
                <h2 className="text-xl font-bold">{modal.type}</h2>
                <Button variant="ghost" size="icon" onClick={() => setModal(null)}>
                  <X className="w-5 h-5" />
                </Button>
              </div>
              <div className="p-6">
                {modal.type === "View Details" && modal.data && (
                  <div className="space-y-4">
                    {Object.entries(modal.data).map(([key, value]) => (
                      <div key={key} className="flex justify-between py-2 border-b border-slate-800">
                        <span className="text-slate-400 capitalize">{key.replace(/([A-Z])/g, ' $1')}</span>
                        <span className="font-medium">{String(value)}</span>
                      </div>
                    ))}
                  </div>
                )}
                {modal.type === "Download Report" && (
                  <div className="space-y-4">
                    <p className="text-slate-400">Select report format:</p>
                    <div className="grid grid-cols-2 gap-4">
                      <Button className="bg-emerald-600 hover:bg-emerald-700">
                        <FileDown className="w-4 h-4 mr-2" /> Download PDF
                      </Button>
                      <Button className="bg-blue-600 hover:bg-blue-700">
                        <FileSpreadsheet className="w-4 h-4 mr-2" /> Download CSV
                      </Button>
                    </div>
                  </div>
                )}
                {modal.type === "Edit Pricing" && (
                  <div className="space-y-4">
                    <div>
                      <label className="text-sm text-slate-400">Base Fare ($)</label>
                      <Input type="number" defaultValue="2.50" className="bg-slate-800 border-slate-700" />
                    </div>
                    <div>
                      <label className="text-sm text-slate-400">Per Mile Rate ($)</label>
                      <Input type="number" defaultValue="1.75" className="bg-slate-800 border-slate-700" />
                    </div>
                    <div>
                      <label className="text-sm text-slate-400">Per Minute Rate ($)</label>
                      <Input type="number" defaultValue="0.35" className="bg-slate-800 border-slate-700" />
                    </div>
                    <Button className="w-full bg-green-600 hover:bg-green-700">Save Changes</Button>
                  </div>
                )}
                {modal.type === "Add Driver" && (
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="text-sm text-slate-400">Full Name</label>
                        <Input placeholder="John Driver" className="bg-slate-800 border-slate-700" />
                      </div>
                      <div>
                        <label className="text-sm text-slate-400">Email</label>
                        <Input placeholder="john@example.com" className="bg-slate-800 border-slate-700" />
                      </div>
                      <div>
                        <label className="text-sm text-slate-400">Phone</label>
                        <Input placeholder="+1 (555) 000-0000" className="bg-slate-800 border-slate-700" />
                      </div>
                      <div>
                        <label className="text-sm text-slate-400">License #</label>
                        <Input placeholder="DL12345678" className="bg-slate-800 border-slate-700" />
                      </div>
                    </div>
                    <Button className="w-full bg-orange-600 hover:bg-orange-700">Add Driver</Button>
                  </div>
                )}
                {modal.type === "System Alert" && modal.data && (
                  <div className="space-y-4">
                    <div className={`p-4 rounded-lg ${modal.data.severity === 'critical' ? 'bg-red-500/20' : modal.data.severity === 'warning' ? 'bg-yellow-500/20' : 'bg-blue-500/20'}`}>
                      <div className="flex items-center gap-2 mb-2">
                        <AlertTriangle className={`w-5 h-5 ${modal.data.severity === 'critical' ? 'text-red-400' : modal.data.severity === 'warning' ? 'text-yellow-400' : 'text-blue-400'}`} />
                        <span className="font-medium">{modal.data.title}</span>
                      </div>
                      <p className="text-sm text-slate-300">{modal.data.message}</p>
                    </div>
                    <div className="flex gap-2">
                      <Button className="flex-1 bg-slate-700 hover:bg-slate-600">Acknowledge</Button>
                      <Button className="flex-1 bg-green-600 hover:bg-green-700">Resolve</Button>
                    </div>
                  </div>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

// ===================
// SUPER ADMIN VIEW
// ===================
function SuperAdminView({ stats, setModal }: { stats: any; setModal: (m: any) => void }) {
  const statCards = [
    { label: "Total Users", value: stats.totalUsers.toLocaleString(), icon: Users, color: "from-violet-500 to-purple-600", trend: "+12.5%", trendUp: true },
    { label: "Active Rides", value: stats.activeRides, icon: Car, color: "from-blue-500 to-cyan-500", trend: "Live", live: true },
    { label: "Total Revenue", value: `$${(stats.totalRevenue / 1000).toFixed(1)}K`, icon: DollarSign, color: "from-emerald-500 to-green-500", trend: "+8.3%", trendUp: true },
    { label: "Driver Payouts Due", value: `$${(stats.driverPayoutsDue / 1000).toFixed(1)}K`, icon: Wallet, color: "from-orange-500 to-amber-500", trend: "Pending" },
    { label: "Failed Payments", value: stats.failedPayments, icon: AlertCircle, color: "from-red-500 to-rose-500", trend: "-3", trendUp: false },
    { label: "Active Disputes", value: stats.disputes, icon: Scale, color: "from-pink-500 to-rose-500", trend: "2 new" },
    { label: "System Alerts", value: stats.systemAlerts, icon: Bell, color: "from-yellow-500 to-amber-500", trend: "Action needed" },
    { label: "Online Drivers", value: stats.onlineDrivers, icon: CarFront, color: "from-teal-500 to-cyan-500", trend: "Live", live: true },
  ]

  const zones = [
    { name: "Downtown", rides: 342, revenue: "$8,450", drivers: 45, status: "high" },
    { name: "Airport", rides: 189, revenue: "$12,340", drivers: 23, status: "medium" },
    { name: "Suburbs", rides: 267, revenue: "$5,670", drivers: 67, status: "low" },
    { name: "Mall District", rides: 156, revenue: "$3,890", drivers: 34, status: "medium" },
  ]

  const alerts = [
    { id: 1, title: "Payment Gateway Latency", severity: "warning", message: "WorldPay response time increased to 2.3s", time: "5 min ago" },
    { id: 2, title: "Driver Shortage - Airport", severity: "critical", message: "Only 5 drivers available, 23 ride requests pending", time: "12 min ago" },
    { id: 3, title: "New Compliance Update", severity: "info", message: "Insurance verification requirements updated", time: "1 hour ago" },
  ]

  return (
    <div className="space-y-6">
      {/* Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {statCards.map((stat, i) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
          >
            <Card 
              className="bg-slate-900 border-slate-800 hover:border-slate-700 transition-all cursor-pointer group"
              onClick={() => setModal({ type: "View Details", data: { metric: stat.label, value: stat.value, trend: stat.trend } })}
            >
              <CardContent className="p-4">
                <div className="flex items-start justify-between mb-3">
                  <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${stat.color} flex items-center justify-center group-hover:scale-110 transition-transform`}>
                    <stat.icon className="w-5 h-5 text-white" />
                  </div>
                  {stat.live ? (
                    <span className="px-2 py-0.5 text-[10px] bg-green-500/20 text-green-400 rounded-full flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
                      Live
                    </span>
                  ) : stat.trendUp !== undefined ? (
                    <span className={`text-xs flex items-center gap-0.5 ${stat.trendUp ? "text-green-400" : "text-red-400"}`}>
                      {stat.trendUp ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
                      {stat.trend}
                    </span>
                  ) : (
                    <span className="text-xs text-slate-400">{stat.trend}</span>
                  )}
                </div>
                <div className="text-2xl font-bold text-white mb-1">{stat.value}</div>
                <div className="text-xs text-slate-400">{stat.label}</div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Two Column Layout */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Service Area Performance */}
        <Card className="bg-slate-900 border-slate-800">
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle className="text-white">Service Area Performance</CardTitle>
              <CardDescription>Real-time zone analytics</CardDescription>
            </div>
            <Button variant="outline" size="sm" className="border-slate-700" onClick={() => setModal({ type: "Download Report" })}>
              <Download className="w-4 h-4 mr-2" /> Export
            </Button>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {zones.map((zone) => (
                <div 
                  key={zone.name} 
                  className="p-3 rounded-lg bg-slate-800/50 hover:bg-slate-800 transition-colors cursor-pointer"
                  onClick={() => setModal({ type: "View Details", data: zone })}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-medium text-white flex items-center gap-2">
                      <MapPin className="w-4 h-4 text-green-400" />
                      {zone.name}
                    </span>
                    <span className={`px-2 py-0.5 text-xs rounded-full ${
                      zone.status === "high" ? "bg-green-500/20 text-green-400" :
                      zone.status === "medium" ? "bg-yellow-500/20 text-yellow-400" :
                      "bg-slate-700 text-slate-400"
                    }`}>
                      {zone.status} demand
                    </span>
                  </div>
                  <div className="grid grid-cols-3 gap-2 text-sm">
                    <div><span className="text-slate-400">Rides:</span> <span className="text-white">{zone.rides}</span></div>
                    <div><span className="text-slate-400">Revenue:</span> <span className="text-green-400">{zone.revenue}</span></div>
                    <div><span className="text-slate-400">Drivers:</span> <span className="text-white">{zone.drivers}</span></div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* System Alerts */}
        <Card className="bg-slate-900 border-slate-800">
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle className="text-white">System Alerts</CardTitle>
              <CardDescription>Action items requiring attention</CardDescription>
            </div>
            <Button variant="ghost" size="sm">
              <CheckCircle2 className="w-4 h-4 mr-2" /> Mark All Read
            </Button>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {alerts.map((alert) => (
                <div 
                  key={alert.id} 
                  className={`p-3 rounded-lg cursor-pointer transition-all hover:scale-[1.02] ${
                    alert.severity === "critical" ? "bg-red-500/10 border border-red-500/30" :
                    alert.severity === "warning" ? "bg-yellow-500/10 border border-yellow-500/30" :
                    "bg-blue-500/10 border border-blue-500/30"
                  }`}
                  onClick={() => setModal({ type: "System Alert", data: alert })}
                >
                  <div className="flex items-start gap-3">
                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                      alert.severity === "critical" ? "bg-red-500/20" :
                      alert.severity === "warning" ? "bg-yellow-500/20" :
                      "bg-blue-500/20"
                    }`}>
                      <AlertTriangle className={`w-4 h-4 ${
                        alert.severity === "critical" ? "text-red-400" :
                        alert.severity === "warning" ? "text-yellow-400" :
                        "text-blue-400"
                      }`} />
                    </div>
                    <div className="flex-1">
                      <div className="font-medium text-white text-sm">{alert.title}</div>
                      <div className="text-xs text-slate-400 mt-0.5">{alert.message}</div>
                      <div className="text-[10px] text-slate-500 mt-1">{alert.time}</div>
                    </div>
                    <Button variant="ghost" size="sm" className="shrink-0">
                      <ExternalLink className="w-3 h-3" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card className="bg-slate-900 border-slate-800">
        <CardHeader>
          <CardTitle className="text-white">Quick Actions</CardTitle>
          <CardDescription>Common administrative tasks</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-3">
            {[
              { label: "Add Driver", icon: UserPlus, color: "bg-orange-500" },
              { label: "Process Payouts", icon: Banknote, color: "bg-emerald-500" },
              { label: "View Reports", icon: BarChart3, color: "bg-blue-500" },
              { label: "Manage Pricing", icon: Gauge, color: "bg-purple-500" },
              { label: "Support Tickets", icon: Headphones, color: "bg-pink-500" },
              { label: "System Settings", icon: Settings, color: "bg-slate-500" },
            ].map((action) => (
              <Button
                key={action.label}
                variant="outline"
                className="h-auto py-4 flex-col gap-2 border-slate-700 hover:border-slate-600 hover:bg-slate-800"
                onClick={() => setModal({ type: action.label })}
              >
                <div className={`w-10 h-10 rounded-xl ${action.color} flex items-center justify-center`}>
                  <action.icon className="w-5 h-5 text-white" />
                </div>
                <span className="text-xs text-slate-300">{action.label}</span>
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

// ===================
// OPERATIONS VIEW
// ===================
function OperationsView({ stats, setModal }: { stats: any; setModal: (m: any) => void }) {
  const rideStats = [
    { label: "Rides Requested", value: stats.ridesRequestedToday, icon: Send, color: "from-blue-500 to-cyan-500" },
    { label: "Rides Accepted", value: stats.ridesAccepted, icon: CheckCircle2, color: "from-green-500 to-emerald-500" },
    { label: "Rides Completed", value: stats.ridesCompleted, icon: Flag, color: "from-violet-500 to-purple-500" },
    { label: "Rides Canceled", value: stats.ridesCanceled, icon: X, color: "from-red-500 to-rose-500" },
    { label: "Average ETA", value: `${stats.avgETA} min`, icon: Clock, color: "from-amber-500 to-orange-500" },
    { label: "Peak Hour", value: stats.peakHour, icon: Flame, color: "from-pink-500 to-rose-500" },
  ]

  const hourlyData = [
    { hour: "6 AM", rides: 45 }, { hour: "8 AM", rides: 120 }, { hour: "10 AM", rides: 85 },
    { hour: "12 PM", rides: 95 }, { hour: "2 PM", rides: 78 }, { hour: "4 PM", rides: 145 },
    { hour: "6 PM", rides: 180 }, { hour: "8 PM", rides: 130 }, { hour: "10 PM", rides: 75 },
  ]

  const maxRides = Math.max(...hourlyData.map(d => d.rides))

  return (
    <div className="space-y-6">
      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        {rideStats.map((stat, i) => (
          <motion.div key={stat.label} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}>
            <Card className="bg-slate-900 border-slate-800 hover:border-slate-700 cursor-pointer" onClick={() => setModal({ type: "View Details", data: stat })}>
              <CardContent className="p-4">
                <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${stat.color} flex items-center justify-center mb-3`}>
                  <stat.icon className="w-5 h-5 text-white" />
                </div>
                <div className="text-2xl font-bold text-white">{stat.value}</div>
                <div className="text-xs text-slate-400">{stat.label}</div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Demand Heatmap */}
        <Card className="bg-slate-900 border-slate-800">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <Map className="w-5 h-5 text-blue-400" /> Demand Heatmap
            </CardTitle>
            <CardDescription>Real-time ride request density</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="relative aspect-video bg-slate-800 rounded-lg overflow-hidden">
              <div className="absolute inset-0 grid grid-cols-4 grid-rows-3 gap-1 p-2">
                {[...Array(12)].map((_, i) => {
                  const intensity = Math.random()
                  return (
                    <div
                      key={i}
                      className={`rounded-lg transition-all cursor-pointer hover:scale-105 ${
                        intensity > 0.7 ? "bg-red-500/60" :
                        intensity > 0.4 ? "bg-yellow-500/50" :
                        "bg-green-500/40"
                      }`}
                      onClick={() => setModal({ type: "View Details", data: { zone: `Zone ${i + 1}`, demand: intensity > 0.7 ? "High" : intensity > 0.4 ? "Medium" : "Low" } })}
                    />
                  )
                })}
              </div>
              <div className="absolute bottom-2 left-2 flex items-center gap-2 text-xs">
                <span className="flex items-center gap-1"><span className="w-3 h-3 rounded bg-green-500/40" /> Low</span>
                <span className="flex items-center gap-1"><span className="w-3 h-3 rounded bg-yellow-500/50" /> Medium</span>
                <span className="flex items-center gap-1"><span className="w-3 h-3 rounded bg-red-500/60" /> High</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Hourly Distribution */}
        <Card className="bg-slate-900 border-slate-800">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <BarChart3 className="w-5 h-5 text-violet-400" /> Hourly Distribution
            </CardTitle>
            <CardDescription>Rides by hour of day</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-end justify-between gap-2 h-48">
              {hourlyData.map((d, i) => (
                <div key={i} className="flex-1 flex flex-col items-center gap-1">
                  <div 
                    className="w-full bg-gradient-to-t from-violet-600 to-purple-400 rounded-t cursor-pointer hover:from-violet-500 hover:to-purple-300 transition-all"
                    style={{ height: `${(d.rides / maxRides) * 100}%` }}
                    onClick={() => setModal({ type: "View Details", data: { hour: d.hour, rides: d.rides } })}
                  />
                  <span className="text-[10px] text-slate-400">{d.hour.replace(" AM", "a").replace(" PM", "p")}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Active Drivers by Zone */}
      <Card className="bg-slate-900 border-slate-800">
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle className="text-white">Active Drivers by Zone</CardTitle>
            <CardDescription>Real-time driver distribution</CardDescription>
          </div>
          <Button variant="outline" size="sm" className="border-slate-700" onClick={() => setModal({ type: "Download Report" })}>
            <Download className="w-4 h-4 mr-2" /> Export
          </Button>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {Object.entries(stats.activeDriversByZone).map(([zone, count]) => {
              const percentage = ((count as number) / 169) * 100
              return (
                <div key={zone} className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-white capitalize flex items-center gap-2">
                      <MapPin className="w-4 h-4 text-green-400" />
                      {zone}
                    </span>
                    <span className="text-slate-400">{count as number} drivers</span>
                  </div>
                  <div className="h-3 bg-slate-800 rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${percentage}%` }}
                      transition={{ duration: 1, delay: 0.2 }}
                      className={`h-full rounded-full ${
                        percentage > 30 ? "bg-gradient-to-r from-green-500 to-emerald-400" :
                        percentage > 15 ? "bg-gradient-to-r from-yellow-500 to-amber-400" :
                        "bg-gradient-to-r from-red-500 to-rose-400"
                      }`}
                    />
                  </div>
                </div>
              )
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

// ===================
// ACCOUNTING VIEW
// ===================
function AccountingView({ stats, setModal }: { stats: any; setModal: (m: any) => void }) {
  const financialStats = [
    { label: "Total Fares Collected", value: `$${stats.totalFaresCollected.toLocaleString(undefined, { minimumFractionDigits: 2 })}`, icon: Receipt, color: "from-emerald-500 to-green-500", trend: "+12.3%" },
    { label: "Company Commissions", value: `$${stats.companyCommissions.toLocaleString(undefined, { minimumFractionDigits: 2 })}`, icon: Building, color: "from-blue-500 to-cyan-500", trend: "+8.7%" },
    { label: "Driver Earnings Payable", value: `$${stats.driverEarningsPayable.toLocaleString(undefined, { minimumFractionDigits: 2 })}`, icon: Wallet, color: "from-orange-500 to-amber-500", trend: "Due" },
    { label: "Refunds Issued", value: `$${stats.refunds.toLocaleString(undefined, { minimumFractionDigits: 2 })}`, icon: RotateCcw, color: "from-red-500 to-rose-500", trend: "-15%" },
    { label: "Promo Discounts", value: `$${stats.promotionalDiscounts.toLocaleString(undefined, { minimumFractionDigits: 2 })}`, icon: Tag, color: "from-pink-500 to-rose-500", trend: "Active" },
    { label: "Tax Collected", value: `$${stats.taxes.toLocaleString(undefined, { minimumFractionDigits: 2 })}`, icon: Landmark, color: "from-purple-500 to-violet-500", trend: "10%" },
    { label: "Processor Fees", value: `$${stats.processorFees.toLocaleString(undefined, { minimumFractionDigits: 2 })}`, icon: CreditCard, color: "from-slate-500 to-gray-500", trend: "3%" },
    { label: "Net Profit Today", value: `$${stats.netProfitToday.toLocaleString(undefined, { minimumFractionDigits: 2 })}`, icon: TrendingUp, color: "from-green-500 to-emerald-500", trend: "+5.2%", highlight: true },
  ]

  return (
    <div className="space-y-6">
      {/* Financial Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {financialStats.map((stat, i) => (
          <motion.div key={stat.label} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}>
            <Card 
              className={`bg-slate-900 border-slate-800 hover:border-slate-700 cursor-pointer ${stat.highlight ? 'ring-2 ring-green-500/50' : ''}`}
              onClick={() => setModal({ type: "View Details", data: stat })}
            >
              <CardContent className="p-4">
                <div className="flex items-start justify-between mb-3">
                  <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${stat.color} flex items-center justify-center`}>
                    <stat.icon className="w-5 h-5 text-white" />
                  </div>
                  <span className={`text-xs ${stat.trend.startsWith('+') ? 'text-green-400' : stat.trend.startsWith('-') ? 'text-red-400' : 'text-slate-400'}`}>
                    {stat.trend}
                  </span>
                </div>
                <div className="text-xl font-bold text-white truncate">{stat.value}</div>
                <div className="text-xs text-slate-400">{stat.label}</div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Reports Section */}
      <Card className="bg-slate-900 border-slate-800">
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle className="text-white">Financial Reports</CardTitle>
            <CardDescription>Download detailed financial statements</CardDescription>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { label: "Daily Summary", icon: Calendar, period: "Today" },
              { label: "Weekly Report", icon: BarChart2, period: "This Week" },
              { label: "Monthly P&L", icon: FileText, period: "This Month" },
              { label: "Tax Report", icon: Landmark, period: "Quarter" },
            ].map((report) => (
              <Button
                key={report.label}
                variant="outline"
                className="h-auto py-4 flex-col gap-2 border-slate-700 hover:border-emerald-500/50 hover:bg-emerald-500/10"
                onClick={() => setModal({ type: "Download Report" })}
              >
                <report.icon className="w-6 h-6 text-emerald-400" />
                <span className="text-sm text-white">{report.label}</span>
                <span className="text-xs text-slate-400">{report.period}</span>
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Revenue Breakdown */}
      <Card className="bg-slate-900 border-slate-800">
        <CardHeader>
          <CardTitle className="text-white">Revenue Breakdown</CardTitle>
          <CardDescription>Distribution of today&apos;s earnings</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-8">
            {/* Pie Chart Simulation */}
            <div className="relative w-48 h-48">
              <svg viewBox="0 0 100 100" className="transform -rotate-90">
                <circle cx="50" cy="50" r="40" fill="none" stroke="#1e293b" strokeWidth="20" />
                <circle cx="50" cy="50" r="40" fill="none" stroke="#10b981" strokeWidth="20" strokeDasharray="150 251" strokeDashoffset="0" />
                <circle cx="50" cy="50" r="40" fill="none" stroke="#f59e0b" strokeWidth="20" strokeDasharray="60 251" strokeDashoffset="-150" />
                <circle cx="50" cy="50" r="40" fill="none" stroke="#ef4444" strokeWidth="20" strokeDasharray="15 251" strokeDashoffset="-210" />
                <circle cx="50" cy="50" r="40" fill="none" stroke="#8b5cf6" strokeWidth="20" strokeDasharray="26 251" strokeDashoffset="-225" />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center">
                  <div className="text-2xl font-bold text-white">$89.7K</div>
                  <div className="text-xs text-slate-400">Total</div>
                </div>
              </div>
            </div>
            {/* Legend */}
            <div className="flex-1 space-y-3">
              {[
                { label: "Driver Earnings", value: "$71,800", percent: "80%", color: "bg-emerald-500" },
                { label: "Company Commission", value: "$17,950", percent: "20%", color: "bg-amber-500" },
                { label: "Refunds", value: "$1,250", percent: "1.4%", color: "bg-red-500" },
                { label: "Taxes & Fees", value: "$11,668", percent: "13%", color: "bg-violet-500" },
              ].map((item) => (
                <div key={item.label} className="flex items-center justify-between cursor-pointer hover:bg-slate-800 p-2 rounded-lg" onClick={() => setModal({ type: "View Details", data: item })}>
                  <div className="flex items-center gap-3">
                    <div className={`w-3 h-3 rounded-full ${item.color}`} />
                    <span className="text-sm text-slate-300">{item.label}</span>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-medium text-white">{item.value}</div>
                    <div className="text-xs text-slate-400">{item.percent}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

// ===================
// LEDGERS VIEW
// ===================
function LedgersView({ stats, setModal }: { stats: any; setModal: (m: any) => void }) {
  const ledgers = [
    { id: "revenue", name: "Revenue Ledger", balance: 89750.00, entries: 1247, status: "reconciled", icon: TrendingUp, color: "from-green-500 to-emerald-500" },
    { id: "payout", name: "Driver Payout Ledger", balance: 71800.00, entries: 189, status: "pending", icon: Wallet, color: "from-orange-500 to-amber-500" },
    { id: "refund", name: "Refund Ledger", balance: 1250.00, entries: 23, status: "reconciled", icon: RotateCcw, color: "from-red-500 to-rose-500" },
    { id: "tax", name: "Tax Ledger", balance: 8975.00, entries: 1, status: "pending", icon: Landmark, color: "from-purple-500 to-violet-500" },
    { id: "fees", name: "Processor Fee Ledger", balance: 2692.50, entries: 1247, status: "reconciled", icon: CreditCard, color: "from-slate-500 to-gray-500" },
    { id: "ap", name: "Accounts Payable", balance: stats.accountsPayable, entries: 47, status: "action", icon: FileWarning, color: "from-yellow-500 to-amber-500" },
    { id: "ar", name: "Accounts Receivable", balance: stats.accountsReceivable, entries: 12, status: "pending", icon: Receipt, color: "from-blue-500 to-cyan-500" },
  ]

  const transactions = [
    { id: 1, type: "credit", description: "Ride fare - #GW-10234", amount: 24.75, time: "2 min ago" },
    { id: 2, type: "debit", description: "Driver payout - John D.", amount: -156.80, time: "15 min ago" },
    { id: 3, type: "credit", description: "Ride fare - #GW-10233", amount: 18.50, time: "22 min ago" },
    { id: 4, type: "debit", description: "Refund issued - #RF-892", amount: -12.00, time: "1 hour ago" },
    { id: 5, type: "credit", description: "Ride fare - #GW-10232", amount: 45.25, time: "1 hour ago" },
  ]

  return (
    <div className="space-y-6">
      {/* Ledger Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {ledgers.map((ledger, i) => (
          <motion.div key={ledger.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}>
            <Card 
              className="bg-slate-900 border-slate-800 hover:border-slate-700 cursor-pointer"
              onClick={() => setModal({ type: "View Details", data: ledger })}
            >
              <CardContent className="p-4">
                <div className="flex items-start justify-between mb-3">
                  <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${ledger.color} flex items-center justify-center`}>
                    <ledger.icon className="w-5 h-5 text-white" />
                  </div>
                  <span className={`px-2 py-0.5 text-[10px] rounded-full ${
                    ledger.status === "reconciled" ? "bg-green-500/20 text-green-400" :
                    ledger.status === "pending" ? "bg-yellow-500/20 text-yellow-400" :
                    "bg-red-500/20 text-red-400"
                  }`}>
                    {ledger.status}
                  </span>
                </div>
                <div className="text-lg font-bold text-white">${ledger.balance.toLocaleString(undefined, { minimumFractionDigits: 2 })}</div>
                <div className="text-xs text-slate-400">{ledger.name}</div>
                <div className="text-[10px] text-slate-500 mt-1">{ledger.entries} entries</div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Recent Transactions */}
      <Card className="bg-slate-900 border-slate-800">
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle className="text-white">Recent Transactions</CardTitle>
            <CardDescription>Latest financial entries</CardDescription>
          </div>
          <Button variant="outline" size="sm" className="border-slate-700" onClick={() => setModal({ type: "Download Report" })}>
            <Download className="w-4 h-4 mr-2" /> Export
          </Button>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {transactions.map((tx) => (
              <div 
                key={tx.id} 
                className="flex items-center justify-between p-3 rounded-lg bg-slate-800/50 hover:bg-slate-800 cursor-pointer transition-colors"
                onClick={() => setModal({ type: "View Details", data: tx })}
              >
                <div className="flex items-center gap-3">
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${tx.type === "credit" ? "bg-green-500/20" : "bg-red-500/20"}`}>
                    {tx.type === "credit" ? <ArrowUpRight className="w-4 h-4 text-green-400" /> : <ArrowDownRight className="w-4 h-4 text-red-400" />}
                  </div>
                  <div>
                    <div className="text-sm text-white">{tx.description}</div>
                    <div className="text-xs text-slate-400">{tx.time}</div>
                  </div>
                </div>
                <div className={`font-medium ${tx.amount > 0 ? "text-green-400" : "text-red-400"}`}>
                  {tx.amount > 0 ? "+" : ""}${Math.abs(tx.amount).toFixed(2)}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Reconciliation Status */}
      <Card className="bg-slate-900 border-slate-800">
        <CardHeader>
          <CardTitle className="text-white">Reconciliation Status</CardTitle>
          <CardDescription>Daily and weekly reconciliation progress</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-3">
              <h4 className="text-sm font-medium text-white">Daily Reconciliation</h4>
              <div className="h-2 bg-slate-800 rounded-full overflow-hidden">
                <div className="h-full w-[85%] bg-gradient-to-r from-green-500 to-emerald-400 rounded-full" />
              </div>
              <div className="flex justify-between text-xs text-slate-400">
                <span>1,060 / 1,247 transactions</span>
                <span>85% complete</span>
              </div>
              <Button size="sm" className="w-full bg-green-600 hover:bg-green-700" onClick={() => setModal({ type: "View Details", data: { type: "Daily Reconciliation" } })}>
                Complete Reconciliation
              </Button>
            </div>
            <div className="space-y-3">
              <h4 className="text-sm font-medium text-white">Weekly Payout Reconciliation</h4>
              <div className="h-2 bg-slate-800 rounded-full overflow-hidden">
                <div className="h-full w-[100%] bg-gradient-to-r from-blue-500 to-cyan-400 rounded-full" />
              </div>
              <div className="flex justify-between text-xs text-slate-400">
                <span>189 / 189 drivers</span>
                <span>100% complete</span>
              </div>
              <Button size="sm" variant="outline" className="w-full border-slate-700" onClick={() => setModal({ type: "Download Report" })}>
                Download Payout Report
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

// ===================
// DRIVERS VIEW
// ===================
function DriversView({ setModal }: { setModal: (m: any) => void }) {
  const [filter, setFilter] = useState("all")
  
  const drivers = [
    { id: 1, name: "John Driver", status: "active", rating: 4.92, rides: 2341, earnings: "$45,230", vehicle: "Toyota Camry 2022", documents: "valid", phone: "+1 555-0101" },
    { id: 2, name: "Sarah Smith", status: "active", rating: 4.88, rides: 1876, earnings: "$38,450", vehicle: "Honda Accord 2021", documents: "expiring", phone: "+1 555-0102" },
    { id: 3, name: "Mike Johnson", status: "inactive", rating: 4.75, rides: 956, earnings: "$18,900", vehicle: "Ford Fusion 2020", documents: "valid", phone: "+1 555-0103" },
    { id: 4, name: "Emily Brown", status: "suspended", rating: 4.45, rides: 1234, earnings: "$24,680", vehicle: "Nissan Altima 2021", documents: "expired", phone: "+1 555-0104" },
    { id: 5, name: "David Wilson", status: "active", rating: 4.95, rides: 3102, earnings: "$62,450", vehicle: "Tesla Model 3 2023", documents: "valid", phone: "+1 555-0105" },
  ]

  const filteredDrivers = filter === "all" ? drivers : drivers.filter(d => d.status === filter)

  return (
    <div className="space-y-6">
      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: "Total Drivers", value: "1,247", color: "from-orange-500 to-amber-500" },
          { label: "Active Today", value: "189", color: "from-green-500 to-emerald-500" },
          { label: "Pending Onboarding", value: "23", color: "from-blue-500 to-cyan-500" },
          { label: "Suspended", value: "8", color: "from-red-500 to-rose-500" },
        ].map((stat, i) => (
          <Card key={stat.label} className="bg-slate-900 border-slate-800">
            <CardContent className="p-4">
              <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${stat.color} flex items-center justify-center mb-3`}>
                <CarFront className="w-5 h-5 text-white" />
              </div>
              <div className="text-2xl font-bold text-white">{stat.value}</div>
              <div className="text-xs text-slate-400">{stat.label}</div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Driver List */}
      <Card className="bg-slate-900 border-slate-800">
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle className="text-white">Driver Management</CardTitle>
            <CardDescription>Manage all drivers on the platform</CardDescription>
          </div>
          <div className="flex items-center gap-2">
            <div className="flex bg-slate-800 rounded-lg p-1">
              {["all", "active", "inactive", "suspended"].map((f) => (
                <button
                  key={f}
                  onClick={() => setFilter(f)}
                  className={`px-3 py-1 text-xs rounded-md transition-colors capitalize ${filter === f ? "bg-orange-500 text-white" : "text-slate-400 hover:text-white"}`}
                >
                  {f}
                </button>
              ))}
            </div>
            <Button size="sm" className="bg-orange-600 hover:bg-orange-700" onClick={() => setModal({ type: "Add Driver" })}>
              <UserPlus className="w-4 h-4 mr-2" /> Add Driver
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-slate-800 text-xs text-slate-400">
                  <th className="text-left py-3 px-2">Driver</th>
                  <th className="text-left py-3 px-2">Status</th>
                  <th className="text-left py-3 px-2">Rating</th>
                  <th className="text-left py-3 px-2">Rides</th>
                  <th className="text-left py-3 px-2">Earnings</th>
                  <th className="text-left py-3 px-2">Vehicle</th>
                  <th className="text-left py-3 px-2">Documents</th>
                  <th className="text-left py-3 px-2">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredDrivers.map((driver) => (
                  <tr key={driver.id} className="border-b border-slate-800/50 hover:bg-slate-800/50">
                    <td className="py-3 px-2">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-orange-500 to-amber-500 flex items-center justify-center text-sm font-bold">
                          {driver.name.split(" ").map(n => n[0]).join("")}
                        </div>
                        <div>
                          <div className="text-sm text-white">{driver.name}</div>
                          <div className="text-xs text-slate-400">{driver.phone}</div>
                        </div>
                      </div>
                    </td>
                    <td className="py-3 px-2">
                      <span className={`px-2 py-0.5 text-xs rounded-full ${
                        driver.status === "active" ? "bg-green-500/20 text-green-400" :
                        driver.status === "inactive" ? "bg-slate-500/20 text-slate-400" :
                        "bg-red-500/20 text-red-400"
                      }`}>
                        {driver.status}
                      </span>
                    </td>
                    <td className="py-3 px-2">
                      <div className="flex items-center gap-1">
                        <Star className="w-3 h-3 text-yellow-400 fill-yellow-400" />
                        <span className="text-sm text-white">{driver.rating}</span>
                      </div>
                    </td>
                    <td className="py-3 px-2 text-sm text-white">{driver.rides.toLocaleString()}</td>
                    <td className="py-3 px-2 text-sm text-green-400">{driver.earnings}</td>
                    <td className="py-3 px-2 text-sm text-slate-300">{driver.vehicle}</td>
                    <td className="py-3 px-2">
                      <span className={`px-2 py-0.5 text-xs rounded-full ${
                        driver.documents === "valid" ? "bg-green-500/20 text-green-400" :
                        driver.documents === "expiring" ? "bg-yellow-500/20 text-yellow-400" :
                        "bg-red-500/20 text-red-400"
                      }`}>
                        {driver.documents}
                      </span>
                    </td>
                    <td className="py-3 px-2">
                      <div className="flex items-center gap-1">
                        <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => setModal({ type: "View Details", data: driver })}>
                          <Eye className="w-4 h-4" />
                        </Button>
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button variant="ghost" size="icon" className="h-8 w-8 text-red-400">
                          <Ban className="w-4 h-4" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

// ===================
// CUSTOMERS VIEW
// ===================
function CustomersView({ setModal }: { setModal: (m: any) => void }) {
  const customers = [
    { id: 1, name: "Alice Johnson", email: "alice@email.com", rides: 156, spent: "$2,340", loyalty: "Gold", status: "active", lastRide: "Today" },
    { id: 2, name: "Bob Williams", email: "bob@email.com", rides: 89, spent: "$1,230", loyalty: "Silver", status: "active", lastRide: "Yesterday" },
    { id: 3, name: "Carol Davis", email: "carol@email.com", rides: 234, spent: "$4,560", loyalty: "Platinum", status: "active", lastRide: "Today" },
    { id: 4, name: "Dan Miller", email: "dan@email.com", rides: 12, spent: "$180", loyalty: "Bronze", status: "flagged", lastRide: "3 days ago" },
    { id: 5, name: "Eva Garcia", email: "eva@email.com", rides: 67, spent: "$890", loyalty: "Silver", status: "active", lastRide: "Today" },
  ]

  const loyaltyColors: Record<string, string> = {
    Bronze: "from-amber-700 to-amber-600",
    Silver: "from-slate-400 to-slate-300",
    Gold: "from-yellow-500 to-amber-400",
    Platinum: "from-violet-500 to-purple-400",
  }

  return (
    <div className="space-y-6">
      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: "Total Customers", value: "24,892", color: "from-pink-500 to-rose-500" },
          { label: "Active This Week", value: "8,456", color: "from-green-500 to-emerald-500" },
          { label: "Open Support Cases", value: "23", color: "from-yellow-500 to-amber-500" },
          { label: "Flagged Accounts", value: "12", color: "from-red-500 to-rose-500" },
        ].map((stat) => (
          <Card key={stat.label} className="bg-slate-900 border-slate-800">
            <CardContent className="p-4">
              <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${stat.color} flex items-center justify-center mb-3`}>
                <Users className="w-5 h-5 text-white" />
              </div>
              <div className="text-2xl font-bold text-white">{stat.value}</div>
              <div className="text-xs text-slate-400">{stat.label}</div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Customer List */}
      <Card className="bg-slate-900 border-slate-800">
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle className="text-white">Customer Management</CardTitle>
            <CardDescription>View and manage rider profiles</CardDescription>
          </div>
          <div className="flex items-center gap-2">
            <Input placeholder="Search customers..." className="w-64 bg-slate-800 border-slate-700" />
            <Button variant="outline" size="sm" className="border-slate-700">
              <Filter className="w-4 h-4 mr-2" /> Filter
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-slate-800 text-xs text-slate-400">
                  <th className="text-left py-3 px-2">Customer</th>
                  <th className="text-left py-3 px-2">Rides</th>
                  <th className="text-left py-3 px-2">Total Spent</th>
                  <th className="text-left py-3 px-2">Loyalty Tier</th>
                  <th className="text-left py-3 px-2">Status</th>
                  <th className="text-left py-3 px-2">Last Ride</th>
                  <th className="text-left py-3 px-2">Actions</th>
                </tr>
              </thead>
              <tbody>
                {customers.map((customer) => (
                  <tr key={customer.id} className="border-b border-slate-800/50 hover:bg-slate-800/50">
                    <td className="py-3 px-2">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-pink-500 to-rose-500 flex items-center justify-center text-sm font-bold">
                          {customer.name.split(" ").map(n => n[0]).join("")}
                        </div>
                        <div>
                          <div className="text-sm text-white">{customer.name}</div>
                          <div className="text-xs text-slate-400">{customer.email}</div>
                        </div>
                      </div>
                    </td>
                    <td className="py-3 px-2 text-sm text-white">{customer.rides}</td>
                    <td className="py-3 px-2 text-sm text-green-400">{customer.spent}</td>
                    <td className="py-3 px-2">
                      <span className={`px-2 py-0.5 text-xs rounded-full bg-gradient-to-r ${loyaltyColors[customer.loyalty]} text-white`}>
                        <Crown className="w-3 h-3 inline mr-1" />
                        {customer.loyalty}
                      </span>
                    </td>
                    <td className="py-3 px-2">
                      <span className={`px-2 py-0.5 text-xs rounded-full ${customer.status === "active" ? "bg-green-500/20 text-green-400" : "bg-red-500/20 text-red-400"}`}>
                        {customer.status}
                      </span>
                    </td>
                    <td className="py-3 px-2 text-sm text-slate-300">{customer.lastRide}</td>
                    <td className="py-3 px-2">
                      <div className="flex items-center gap-1">
                        <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => setModal({ type: "View Details", data: customer })}>
                          <Eye className="w-4 h-4" />
                        </Button>
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <MessageSquare className="w-4 h-4" />
                        </Button>
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <Gift className="w-4 h-4" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

// ===================
// PRICING VIEW
// ===================
function PricingView({ setModal }: { setModal: (m: any) => void }) {
  const [baseFare, setBaseFare] = useState(2.50)
  const [perMile, setPerMile] = useState(1.75)
  const [perMinute, setPerMinute] = useState(0.35)
  const [driverPayout, setDriverPayout] = useState(80)

  const competitors = [
    { name: "GlideWay", baseFare: 2.50, perMile: 1.75, avgTrip: 14.50, highlight: true },
    { name: "Uber", baseFare: 2.85, perMile: 1.82, avgTrip: 15.20 },
    { name: "Lyft", baseFare: 2.75, perMile: 1.79, avgTrip: 14.95 },
    { name: "Taxi", baseFare: 3.50, perMile: 2.50, avgTrip: 18.75 },
  ]

  return (
    <div className="space-y-6">
      {/* Pricing Controls */}
      <div className="grid lg:grid-cols-2 gap-6">
        <Card className="bg-slate-900 border-slate-800">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <Gauge className="w-5 h-5 text-indigo-400" />
              Base Pricing Controls
            </CardTitle>
            <CardDescription>Adjust core pricing parameters</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <label className="text-sm text-slate-300">Base Fare</label>
                <span className="text-lg font-bold text-indigo-400">${baseFare.toFixed(2)}</span>
              </div>
              <input
                type="range"
                min="1"
                max="5"
                step="0.25"
                value={baseFare}
                onChange={(e) => setBaseFare(parseFloat(e.target.value))}
                className="w-full accent-indigo-500"
              />
            </div>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <label className="text-sm text-slate-300">Per Mile Rate</label>
                <span className="text-lg font-bold text-indigo-400">${perMile.toFixed(2)}</span>
              </div>
              <input
                type="range"
                min="1"
                max="3"
                step="0.05"
                value={perMile}
                onChange={(e) => setPerMile(parseFloat(e.target.value))}
                className="w-full accent-indigo-500"
              />
            </div>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <label className="text-sm text-slate-300">Per Minute Rate</label>
                <span className="text-lg font-bold text-indigo-400">${perMinute.toFixed(2)}</span>
              </div>
              <input
                type="range"
                min="0.10"
                max="0.75"
                step="0.05"
                value={perMinute}
                onChange={(e) => setPerMinute(parseFloat(e.target.value))}
                className="w-full accent-indigo-500"
              />
            </div>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <label className="text-sm text-slate-300">Driver Payout %</label>
                <span className="text-lg font-bold text-green-400">{driverPayout}%</span>
              </div>
              <input
                type="range"
                min="70"
                max="90"
                step="1"
                value={driverPayout}
                onChange={(e) => setDriverPayout(parseInt(e.target.value))}
                className="w-full accent-green-500"
              />
            </div>
            <Button className="w-full bg-indigo-600 hover:bg-indigo-700" onClick={() => setModal({ type: "Edit Pricing" })}>
              Save Pricing Changes
            </Button>
          </CardContent>
        </Card>

        {/* Competitor Comparison */}
        <Card className="bg-slate-900 border-slate-800">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <Target className="w-5 h-5 text-indigo-400" />
              Competitor Comparison
            </CardTitle>
            <CardDescription>GlideWay aims for 2-3% lower pricing</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {competitors.map((comp) => (
                <div 
                  key={comp.name} 
                  className={`p-4 rounded-lg ${comp.highlight ? 'bg-indigo-500/20 border border-indigo-500/30' : 'bg-slate-800/50'}`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className={`font-medium ${comp.highlight ? 'text-indigo-400' : 'text-white'}`}>
                      {comp.name}
                      {comp.highlight && <span className="ml-2 text-xs bg-indigo-500 px-2 py-0.5 rounded-full">You</span>}
                    </span>
                    <span className={`text-lg font-bold ${comp.highlight ? 'text-green-400' : 'text-white'}`}>
                      ${comp.avgTrip.toFixed(2)} avg
                    </span>
                  </div>
                  <div className="grid grid-cols-2 gap-2 text-xs text-slate-400">
                    <span>Base: ${comp.baseFare.toFixed(2)}</span>
                    <span>Per Mile: ${comp.perMile.toFixed(2)}</span>
                  </div>
                  {comp.highlight && (
                    <div className="mt-2 text-xs text-green-400">
                      2.5% lower than average competitor
                    </div>
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Surge Pricing */}
      <Card className="bg-slate-900 border-slate-800">
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle className="text-white flex items-center gap-2">
              <Flame className="w-5 h-5 text-orange-400" />
              Smart Demand Pricing
            </CardTitle>
            <CardDescription>Zone-based surge multipliers</CardDescription>
          </div>
          <Button variant="outline" size="sm" className="border-slate-700">
            <Settings className="w-4 h-4 mr-2" /> Configure Rules
          </Button>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { zone: "Downtown", multiplier: 1.5, demand: "high" },
              { zone: "Airport", multiplier: 1.8, demand: "very high" },
              { zone: "Suburbs", multiplier: 1.0, demand: "normal" },
              { zone: "Mall District", multiplier: 1.2, demand: "moderate" },
            ].map((zone) => (
              <div 
                key={zone.zone} 
                className={`p-4 rounded-lg cursor-pointer transition-all hover:scale-105 ${
                  zone.multiplier >= 1.5 ? 'bg-orange-500/20 border border-orange-500/30' :
                  zone.multiplier >= 1.2 ? 'bg-yellow-500/20 border border-yellow-500/30' :
                  'bg-slate-800/50'
                }`}
                onClick={() => setModal({ type: "View Details", data: zone })}
              >
                <div className="text-sm text-slate-300 mb-1">{zone.zone}</div>
                <div className="text-2xl font-bold text-white">{zone.multiplier}x</div>
                <div className={`text-xs ${
                  zone.demand === "very high" ? "text-red-400" :
                  zone.demand === "high" ? "text-orange-400" :
                  zone.demand === "moderate" ? "text-yellow-400" :
                  "text-green-400"
                }`}>
                  {zone.demand} demand
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

// ===================
// MANAGEMENT VIEW
// ===================
function ManagementView({ stats, setModal }: { stats: any; setModal: (m: any) => void }) {
  const staff = [
    { id: 1, name: "Admin User", role: "Super Admin", email: "admin@glideway.com", status: "active", lastLogin: "Just now" },
    { id: 2, name: "Operations Lead", role: "Operations", email: "ops@glideway.com", status: "active", lastLogin: "2 hours ago" },
    { id: 3, name: "Support Agent", role: "Support", email: "support@glideway.com", status: "active", lastLogin: "15 min ago" },
    { id: 4, name: "Accountant", role: "Accounting", email: "accounting@glideway.com", status: "inactive", lastLogin: "2 days ago" },
  ]

  const auditLog = [
    { id: 1, action: "Updated pricing rules", user: "Admin User", time: "5 min ago", type: "config" },
    { id: 2, action: "Suspended driver #1234", user: "Operations Lead", time: "1 hour ago", type: "driver" },
    { id: 3, action: "Processed payout batch", user: "Accountant", time: "3 hours ago", type: "payment" },
    { id: 4, action: "Resolved support ticket #5678", user: "Support Agent", time: "4 hours ago", type: "support" },
  ]

  return (
    <div className="space-y-6">
      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: "Staff Members", value: stats.staffCount, color: "from-sky-500 to-blue-500" },
          { label: "Open Tickets", value: stats.openTickets, color: "from-yellow-500 to-amber-500" },
          { label: "Escalations", value: stats.escalations, color: "from-red-500 to-rose-500" },
          { label: "Avg Response Time", value: "4.2 min", color: "from-green-500 to-emerald-500" },
        ].map((stat) => (
          <Card key={stat.label} className="bg-slate-900 border-slate-800">
            <CardContent className="p-4">
              <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${stat.color} flex items-center justify-center mb-3`}>
                <UserCog className="w-5 h-5 text-white" />
              </div>
              <div className="text-2xl font-bold text-white">{stat.value}</div>
              <div className="text-xs text-slate-400">{stat.label}</div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Staff Management */}
        <Card className="bg-slate-900 border-slate-800">
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle className="text-white">Staff & Permissions</CardTitle>
              <CardDescription>Manage team access</CardDescription>
            </div>
            <Button size="sm" className="bg-sky-600 hover:bg-sky-700">
              <UserPlus className="w-4 h-4 mr-2" /> Add Staff
            </Button>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {staff.map((member) => (
                <div key={member.id} className="flex items-center justify-between p-3 rounded-lg bg-slate-800/50 hover:bg-slate-800 cursor-pointer" onClick={() => setModal({ type: "View Details", data: member })}>
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-sky-500 to-blue-500 flex items-center justify-center text-sm font-bold">
                      {member.name.split(" ").map(n => n[0]).join("")}
                    </div>
                    <div>
                      <div className="text-sm text-white">{member.name}</div>
                      <div className="text-xs text-slate-400">{member.role}</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className={`px-2 py-0.5 text-xs rounded-full ${member.status === "active" ? "bg-green-500/20 text-green-400" : "bg-slate-500/20 text-slate-400"}`}>
                      {member.status}
                    </span>
                    <Button variant="ghost" size="icon" className="h-8 w-8">
                      <Edit className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Audit Trail */}
        <Card className="bg-slate-900 border-slate-800">
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle className="text-white">Audit Trail</CardTitle>
              <CardDescription>Recent system activity</CardDescription>
            </div>
            <Button variant="outline" size="sm" className="border-slate-700" onClick={() => setModal({ type: "Download Report" })}>
              <Download className="w-4 h-4 mr-2" /> Export
            </Button>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {auditLog.map((log) => (
                <div key={log.id} className="flex items-start gap-3 p-3 rounded-lg bg-slate-800/50">
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                    log.type === "config" ? "bg-purple-500/20" :
                    log.type === "driver" ? "bg-orange-500/20" :
                    log.type === "payment" ? "bg-green-500/20" :
                    "bg-blue-500/20"
                  }`}>
                    {log.type === "config" ? <Settings className="w-4 h-4 text-purple-400" /> :
                     log.type === "driver" ? <CarFront className="w-4 h-4 text-orange-400" /> :
                     log.type === "payment" ? <DollarSign className="w-4 h-4 text-green-400" /> :
                     <Headphones className="w-4 h-4 text-blue-400" />}
                  </div>
                  <div className="flex-1">
                    <div className="text-sm text-white">{log.action}</div>
                    <div className="text-xs text-slate-400">by {log.user} • {log.time}</div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

// ===================
// COMPLIANCE VIEW
// ===================
function ComplianceView({ stats, setModal }: { stats: any; setModal: (m: any) => void }) {
  const kycItems = [
    { id: 1, driver: "John Driver", type: "License Renewal", status: "pending", dueDate: "Mar 15, 2024" },
    { id: 2, driver: "Sarah Smith", type: "Insurance Expiring", status: "warning", dueDate: "Apr 1, 2024" },
    { id: 3, driver: "Mike Johnson", type: "Background Check", status: "expired", dueDate: "Feb 28, 2024" },
    { id: 4, driver: "Emily Brown", type: "Vehicle Inspection", status: "pending", dueDate: "Mar 20, 2024" },
  ]

  const fraudAlerts = [
    { id: 1, type: "Suspicious Trip Pattern", account: "User #5678", severity: "high", time: "15 min ago" },
    { id: 2, type: "Multiple Failed Payments", account: "User #9012", severity: "medium", time: "1 hour ago" },
    { id: 3, type: "GPS Spoofing Detected", account: "Driver #3456", severity: "critical", time: "2 hours ago" },
  ]

  return (
    <div className="space-y-6">
      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: "Pending KYC", value: stats.pendingKYC, color: "from-yellow-500 to-amber-500" },
          { label: "Expired Documents", value: stats.expiredDocs, color: "from-red-500 to-rose-500" },
          { label: "Flagged Accounts", value: stats.flaggedAccounts, color: "from-orange-500 to-amber-500" },
          { label: "Compliance Score", value: "94%", color: "from-green-500 to-emerald-500" },
        ].map((stat) => (
          <Card key={stat.label} className="bg-slate-900 border-slate-800">
            <CardContent className="p-4">
              <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${stat.color} flex items-center justify-center mb-3`}>
                <ShieldAlert className="w-5 h-5 text-white" />
              </div>
              <div className="text-2xl font-bold text-white">{stat.value}</div>
              <div className="text-xs text-slate-400">{stat.label}</div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* KYC & Documents */}
        <Card className="bg-slate-900 border-slate-800">
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle className="text-white">KYC & Document Tracking</CardTitle>
              <CardDescription>Driver verification status</CardDescription>
            </div>
            <Button variant="outline" size="sm" className="border-slate-700">
              <Filter className="w-4 h-4 mr-2" /> Filter
            </Button>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {kycItems.map((item) => (
                <div key={item.id} className="flex items-center justify-between p-3 rounded-lg bg-slate-800/50 hover:bg-slate-800 cursor-pointer" onClick={() => setModal({ type: "View Details", data: item })}>
                  <div className="flex items-center gap-3">
                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                      item.status === "expired" ? "bg-red-500/20" :
                      item.status === "warning" ? "bg-yellow-500/20" :
                      "bg-blue-500/20"
                    }`}>
                      <FileText className={`w-4 h-4 ${
                        item.status === "expired" ? "text-red-400" :
                        item.status === "warning" ? "text-yellow-400" :
                        "text-blue-400"
                      }`} />
                    </div>
                    <div>
                      <div className="text-sm text-white">{item.driver}</div>
                      <div className="text-xs text-slate-400">{item.type}</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className={`px-2 py-0.5 text-xs rounded-full ${
                      item.status === "expired" ? "bg-red-500/20 text-red-400" :
                      item.status === "warning" ? "bg-yellow-500/20 text-yellow-400" :
                      "bg-blue-500/20 text-blue-400"
                    }`}>
                      {item.status}
                    </span>
                    <div className="text-xs text-slate-400 mt-1">{item.dueDate}</div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Fraud Monitoring */}
        <Card className="bg-slate-900 border-slate-800">
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle className="text-white">Fraud Monitoring</CardTitle>
              <CardDescription>Suspicious activity alerts</CardDescription>
            </div>
            <span className="px-2 py-1 text-xs bg-red-500/20 text-red-400 rounded-full flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-red-400 animate-pulse" />
              3 Active
            </span>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {fraudAlerts.map((alert) => (
                <div 
                  key={alert.id} 
                  className={`p-3 rounded-lg cursor-pointer transition-all hover:scale-[1.02] ${
                    alert.severity === "critical" ? "bg-red-500/10 border border-red-500/30" :
                    alert.severity === "high" ? "bg-orange-500/10 border border-orange-500/30" :
                    "bg-yellow-500/10 border border-yellow-500/30"
                  }`}
                  onClick={() => setModal({ type: "System Alert", data: { title: alert.type, message: `Account: ${alert.account}`, severity: alert.severity } })}
                >
                  <div className="flex items-start gap-3">
                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                      alert.severity === "critical" ? "bg-red-500/20" :
                      alert.severity === "high" ? "bg-orange-500/20" :
                      "bg-yellow-500/20"
                    }`}>
                      <AlertOctagon className={`w-4 h-4 ${
                        alert.severity === "critical" ? "text-red-400" :
                        alert.severity === "high" ? "text-orange-400" :
                        "text-yellow-400"
                      }`} />
                    </div>
                    <div className="flex-1">
                      <div className="text-sm text-white">{alert.type}</div>
                      <div className="text-xs text-slate-400">{alert.account} • {alert.time}</div>
                    </div>
                    <span className={`px-2 py-0.5 text-[10px] rounded-full uppercase font-medium ${
                      alert.severity === "critical" ? "bg-red-500/20 text-red-400" :
                      alert.severity === "high" ? "bg-orange-500/20 text-orange-400" :
                      "bg-yellow-500/20 text-yellow-400"
                    }`}>
                      {alert.severity}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Privacy & Data Controls */}
      <Card className="bg-slate-900 border-slate-800">
        <CardHeader>
          <CardTitle className="text-white">Privacy & Data Access Controls</CardTitle>
          <CardDescription>GDPR, CCPA, and data protection compliance</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { label: "Data Retention Policy", status: "Active", icon: Database },
              { label: "GDPR Compliance", status: "Compliant", icon: ShieldCheck },
              { label: "CCPA Compliance", status: "Compliant", icon: Lock },
              { label: "Data Export Requests", status: "2 Pending", icon: FileDown },
            ].map((item) => (
              <div key={item.label} className="p-4 rounded-lg bg-slate-800/50 cursor-pointer hover:bg-slate-800" onClick={() => setModal({ type: "View Details", data: item })}>
                <item.icon className="w-8 h-8 text-emerald-400 mb-3" />
                <div className="text-sm text-white">{item.label}</div>
                <div className="text-xs text-green-400 mt-1">{item.status}</div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
