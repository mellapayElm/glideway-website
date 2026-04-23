"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { 
  Users, UserPlus, UserCheck, UserX, Briefcase, FileText, DollarSign, Clock,
  Calendar, CheckCircle2, AlertCircle, Search, Filter, Download, Plus, Edit,
  Trash2, Eye, Mail, Phone, MapPin, Building, CreditCard, Shield, Star,
  ChevronRight, ChevronDown, ChevronLeft, ArrowLeft, Bell, Menu, X, LogOut,
  FileCheck, Upload, Camera, Car, BadgeCheck, Banknote, Calculator, Receipt,
  ClipboardList, Flag, Globe, Database, Lock, Key, Fingerprint, History,
  BarChart3, PieChart, TrendingUp, ArrowUpRight, ArrowDownRight, RefreshCw,
  Send, MessageSquare, Headphones, Award, Target, Zap, Heart, Coffee,
  GraduationCap, BookOpen, Settings, Printer, FileSpreadsheet, Home, Play,
  Pause, RotateCcw, Check, Ban, MoreHorizontal, ExternalLink, Copy, Info
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import Link from "next/link"

// HR Dashboard Views
type HRView = 
  | "overview"
  | "applicants"
  | "onboarding"
  | "offboarding"
  | "payroll"
  | "benefits"
  | "records"
  | "reports"
  | "database"

interface HRMenuItem {
  id: HRView
  label: string
  icon: React.ElementType
  color: string
  badge?: number
  description: string
}

const hrMenuItems: HRMenuItem[] = [
  { id: "overview", label: "HR Overview", icon: BarChart3, color: "from-violet-500 to-purple-600", description: "Dashboard summary" },
  { id: "applicants", label: "Applicant Tracking", icon: UserPlus, color: "from-blue-500 to-cyan-500", badge: 24, description: "New applications" },
  { id: "onboarding", label: "Onboarding", icon: UserCheck, color: "from-emerald-500 to-green-500", badge: 8, description: "New hire setup" },
  { id: "offboarding", label: "Offboarding", icon: UserX, color: "from-orange-500 to-amber-500", badge: 2, description: "Exit processing" },
  { id: "payroll", label: "Payroll & Time", icon: DollarSign, color: "from-green-500 to-emerald-500", description: "Pay processing" },
  { id: "benefits", label: "Benefits", icon: Heart, color: "from-pink-500 to-rose-500", description: "Benefits admin" },
  { id: "records", label: "Employee Records", icon: FileText, color: "from-indigo-500 to-blue-500", description: "Driver files" },
  { id: "reports", label: "HR Reports", icon: FileSpreadsheet, color: "from-teal-500 to-cyan-500", description: "Analytics" },
  { id: "database", label: "HR Database", icon: Database, color: "from-slate-500 to-gray-600", description: "Secure storage" },
]

// Driver Onboarding Steps
const onboardingSteps = [
  { step: 1, title: "Click Become a Driver", description: "Start application process", icon: Play },
  { step: 2, title: "Enter Personal Details", description: "Name, DOB, SSN, contact info", icon: Users },
  { step: 3, title: "Verify Phone & Email", description: "OTP verification", icon: Phone },
  { step: 4, title: "Upload License", description: "Driver's license scan", icon: BadgeCheck },
  { step: 5, title: "Upload Insurance", description: "Vehicle insurance proof", icon: Shield },
  { step: 6, title: "Enter Vehicle Details", description: "Make, model, year, VIN", icon: Car },
  { step: 7, title: "Add Payout Account", description: "Bank details for earnings", icon: Banknote },
  { step: 8, title: "Background Check Consent", description: "Authorize screening", icon: Fingerprint },
  { step: 9, title: "Submit Application", description: "Complete submission", icon: Send },
  { step: 10, title: "Admin Reviews Documents", description: "Compliance verification", icon: Eye },
  { step: 11, title: "Driver Approved & Activated", description: "Ready to drive", icon: CheckCircle2 },
]

// Mock Data
const applicants = [
  { id: "APP001", name: "Michael Johnson", email: "m.johnson@email.com", phone: "+1 (555) 123-4567", appliedDate: "2024-01-15", status: "pending", step: 5, state: "California", city: "Los Angeles" },
  { id: "APP002", name: "Sarah Williams", email: "s.williams@email.com", phone: "+1 (555) 234-5678", appliedDate: "2024-01-14", status: "reviewing", step: 7, state: "Texas", city: "Houston" },
  { id: "APP003", name: "David Chen", email: "d.chen@email.com", phone: "+1 (555) 345-6789", appliedDate: "2024-01-13", status: "approved", step: 11, state: "New York", city: "New York" },
  { id: "APP004", name: "Emily Rodriguez", email: "e.rodriguez@email.com", phone: "+1 (555) 456-7890", appliedDate: "2024-01-12", status: "background_check", step: 8, state: "Florida", city: "Miami" },
  { id: "APP005", name: "James Wilson", email: "j.wilson@email.com", phone: "+1 (555) 567-8901", appliedDate: "2024-01-11", status: "rejected", step: 10, state: "Illinois", city: "Chicago" },
]

const drivers = [
  { id: "DRV001", name: "Robert Martinez", email: "r.martinez@email.com", phone: "+1 (555) 111-2222", hireDate: "2023-06-15", status: "active", state: "California", city: "San Francisco", earnings: 4250.00, rating: 4.9, trips: 342, taxStatus: "W-9 Filed" },
  { id: "DRV002", name: "Lisa Thompson", email: "l.thompson@email.com", phone: "+1 (555) 222-3333", hireDate: "2023-08-20", status: "active", state: "Texas", city: "Dallas", earnings: 3890.00, rating: 4.8, trips: 287, taxStatus: "W-9 Filed" },
  { id: "DRV003", name: "Kevin Anderson", email: "k.anderson@email.com", phone: "+1 (555) 333-4444", hireDate: "2023-09-10", status: "suspended", state: "New York", city: "Brooklyn", earnings: 0, rating: 4.2, trips: 156, taxStatus: "W-9 Pending" },
  { id: "DRV004", name: "Amanda Garcia", email: "a.garcia@email.com", phone: "+1 (555) 444-5555", hireDate: "2023-11-05", status: "active", state: "Florida", city: "Orlando", earnings: 2150.00, rating: 4.95, trips: 98, taxStatus: "W-9 Filed" },
]

const payrollRecords = [
  { id: "PAY001", period: "Jan 1-15, 2024", totalDrivers: 189, totalPayout: 342150.00, status: "processed", processedDate: "2024-01-16" },
  { id: "PAY002", period: "Dec 16-31, 2023", totalDrivers: 185, totalPayout: 328920.00, status: "processed", processedDate: "2024-01-01" },
  { id: "PAY003", period: "Dec 1-15, 2023", totalDrivers: 182, totalPayout: 315750.00, status: "processed", processedDate: "2023-12-16" },
]

// US States for database organization
const usStates = [
  { code: "CA", name: "California", drivers: 45, applicants: 12 },
  { code: "TX", name: "Texas", drivers: 38, applicants: 8 },
  { code: "NY", name: "New York", drivers: 42, applicants: 15 },
  { code: "FL", name: "Florida", drivers: 35, applicants: 10 },
  { code: "IL", name: "Illinois", drivers: 28, applicants: 6 },
  { code: "PA", name: "Pennsylvania", drivers: 22, applicants: 4 },
  { code: "OH", name: "Ohio", drivers: 18, applicants: 5 },
  { code: "GA", name: "Georgia", drivers: 25, applicants: 7 },
]

export default function HRDashboard() {
  const [currentView, setCurrentView] = useState<HRView>("overview")
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [modal, setModal] = useState<{ type: string; data?: any } | null>(null)
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedState, setSelectedState] = useState<string | null>(null)
  const [selectedApplicant, setSelectedApplicant] = useState<typeof applicants[0] | null>(null)

  // HR Stats
  const [stats, setStats] = useState({
    totalApplicants: 24,
    pendingReview: 8,
    inOnboarding: 12,
    activeDrivers: 189,
    suspendedDrivers: 5,
    offboardingDrivers: 2,
    totalPayrollThisPeriod: 342150.00,
    pendingPayouts: 45230.00,
    avgTimeToHire: 5.2,
    retentionRate: 94.5,
    openPositions: 50,
    backgroundChecksPending: 6,
  })

  // Live updates simulation
  useEffect(() => {
    const interval = setInterval(() => {
      setStats(prev => ({
        ...prev,
        totalApplicants: prev.totalApplicants + Math.floor(Math.random() * 2),
        pendingPayouts: prev.pendingPayouts + Math.random() * 100,
      }))
    }, 10000)
    return () => clearInterval(interval)
  }, [])

  const getStatusBadge = (status: string) => {
    const badges: Record<string, { bg: string; text: string; label: string }> = {
      pending: { bg: "bg-yellow-500/20", text: "text-yellow-400", label: "Pending Review" },
      reviewing: { bg: "bg-blue-500/20", text: "text-blue-400", label: "Under Review" },
      approved: { bg: "bg-emerald-500/20", text: "text-emerald-400", label: "Approved" },
      rejected: { bg: "bg-red-500/20", text: "text-red-400", label: "Rejected" },
      background_check: { bg: "bg-purple-500/20", text: "text-purple-400", label: "Background Check" },
      active: { bg: "bg-emerald-500/20", text: "text-emerald-400", label: "Active" },
      suspended: { bg: "bg-red-500/20", text: "text-red-400", label: "Suspended" },
      processed: { bg: "bg-emerald-500/20", text: "text-emerald-400", label: "Processed" },
    }
    const badge = badges[status] || { bg: "bg-slate-500/20", text: "text-slate-400", label: status }
    return (
      <span className={`px-2 py-1 rounded-full text-xs font-medium ${badge.bg} ${badge.text}`}>
        {badge.label}
      </span>
    )
  }

  // Render different views
  const renderView = () => {
    switch (currentView) {
      case "overview":
        return (
          <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-bold text-white">HR Dashboard</h1>
                <p className="text-slate-400">All-in-one HR software - Easy to use and built to scale</p>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" className="border-slate-700">
                  <Download className="w-4 h-4 mr-2" />
                  Export Report
                </Button>
                <Link href="/driver/register" target="_blank">
                  <Button className="bg-emerald-600 hover:bg-emerald-700">
                    <Plus className="w-4 h-4 mr-2" />
                    Add Driver
                  </Button>
                </Link>
              </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <motion.div whileHover={{ scale: 1.02 }} className="bg-gradient-to-br from-blue-500/20 to-cyan-500/20 border border-blue-500/30 rounded-xl p-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-blue-500/30 rounded-lg">
                    <UserPlus className="w-5 h-5 text-blue-400" />
                  </div>
                  <div>
                    <p className="text-slate-400 text-sm">Applicants</p>
                    <p className="text-2xl font-bold text-white">{stats.totalApplicants}</p>
                  </div>
                </div>
              </motion.div>

              <motion.div whileHover={{ scale: 1.02 }} className="bg-gradient-to-br from-emerald-500/20 to-green-500/20 border border-emerald-500/30 rounded-xl p-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-emerald-500/30 rounded-lg">
                    <UserCheck className="w-5 h-5 text-emerald-400" />
                  </div>
                  <div>
                    <p className="text-slate-400 text-sm">Active Drivers</p>
                    <p className="text-2xl font-bold text-white">{stats.activeDrivers}</p>
                  </div>
                </div>
              </motion.div>

              <motion.div whileHover={{ scale: 1.02 }} className="bg-gradient-to-br from-green-500/20 to-emerald-500/20 border border-green-500/30 rounded-xl p-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-green-500/30 rounded-lg">
                    <DollarSign className="w-5 h-5 text-green-400" />
                  </div>
                  <div>
                    <p className="text-slate-400 text-sm">Payroll This Period</p>
                    <p className="text-2xl font-bold text-white">${stats.totalPayrollThisPeriod.toLocaleString()}</p>
                  </div>
                </div>
              </motion.div>

              <motion.div whileHover={{ scale: 1.02 }} className="bg-gradient-to-br from-purple-500/20 to-violet-500/20 border border-purple-500/30 rounded-xl p-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-purple-500/30 rounded-lg">
                    <TrendingUp className="w-5 h-5 text-purple-400" />
                  </div>
                  <div>
                    <p className="text-slate-400 text-sm">Retention Rate</p>
                    <p className="text-2xl font-bold text-white">{stats.retentionRate}%</p>
                  </div>
                </div>
              </motion.div>
            </div>

            {/* Quick Actions */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <button 
                onClick={() => setCurrentView("applicants")}
                className="bg-slate-800/50 border border-slate-700 rounded-xl p-4 hover:bg-slate-800 transition-all text-left"
              >
                <UserPlus className="w-8 h-8 text-blue-400 mb-2" />
                <h3 className="font-semibold text-white">Review Applicants</h3>
                <p className="text-slate-400 text-sm">{stats.pendingReview} pending review</p>
              </button>

              <button 
                onClick={() => setCurrentView("onboarding")}
                className="bg-slate-800/50 border border-slate-700 rounded-xl p-4 hover:bg-slate-800 transition-all text-left"
              >
                <ClipboardList className="w-8 h-8 text-emerald-400 mb-2" />
                <h3 className="font-semibold text-white">Onboarding</h3>
                <p className="text-slate-400 text-sm">{stats.inOnboarding} in progress</p>
              </button>

              <button 
                onClick={() => setCurrentView("payroll")}
                className="bg-slate-800/50 border border-slate-700 rounded-xl p-4 hover:bg-slate-800 transition-all text-left"
              >
                <Banknote className="w-8 h-8 text-green-400 mb-2" />
                <h3 className="font-semibold text-white">Process Payroll</h3>
                <p className="text-slate-400 text-sm">${stats.pendingPayouts.toLocaleString()} pending</p>
              </button>

              <button 
                onClick={() => setCurrentView("database")}
                className="bg-slate-800/50 border border-slate-700 rounded-xl p-4 hover:bg-slate-800 transition-all text-left"
              >
                <Database className="w-8 h-8 text-slate-400 mb-2" />
                <h3 className="font-semibold text-white">HR Database</h3>
                <p className="text-slate-400 text-sm">Secure driver files</p>
              </button>
            </div>

            {/* Driver Onboarding Steps Visual */}
            <Card className="bg-slate-900/50 border-slate-800">
              <CardHeader>
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <CardTitle className="text-white flex items-center gap-2 mb-1">
                      <ClipboardList className="w-5 h-5 text-emerald-400" />
                      Driver Onboarding Process (11 Steps)
                    </CardTitle>
                    <CardDescription>Dedicated system for driver application and activation</CardDescription>
                  </div>
                  <Link href="/driver/register" target="_blank">
                    <button className="flex items-center gap-2 px-4 py-2 rounded-lg bg-emerald-500 hover:bg-emerald-600 text-white text-sm font-semibold transition-colors shrink-0">
                      <ExternalLink className="w-4 h-4" />
                      Open Driver Registration
                    </button>
                  </Link>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-3">
                  {onboardingSteps.map((step, index) => (
                    <motion.div
                      key={step.step}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.05 }}
                      className="bg-slate-800/50 border border-slate-700 rounded-lg p-3 hover:border-emerald-500/50 transition-all cursor-pointer"
                      onClick={() => setModal({ type: "step_detail", data: step })}
                    >
                      <div className="flex items-center gap-2 mb-2">
                        <div className="w-6 h-6 rounded-full bg-emerald-500/20 flex items-center justify-center text-emerald-400 text-xs font-bold">
                          {step.step}
                        </div>
                        <step.icon className="w-4 h-4 text-emerald-400" />
                      </div>
                      <p className="text-white text-sm font-medium">{step.title}</p>
                      <p className="text-slate-500 text-xs mt-1">{step.description}</p>
                    </motion.div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Recent Activity */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="bg-slate-900/50 border-slate-800">
                <CardHeader>
                  <CardTitle className="text-white text-lg">Recent Applications</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {applicants.slice(0, 4).map((app) => (
                    <div key={app.id} className="flex items-center justify-between p-3 bg-slate-800/50 rounded-lg">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center text-white font-bold">
                          {app.name.split(" ").map(n => n[0]).join("")}
                        </div>
                        <div>
                          <p className="text-white font-medium">{app.name}</p>
                          <p className="text-slate-400 text-sm">{app.city}, {app.state}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        {getStatusBadge(app.status)}
                        <p className="text-slate-500 text-xs mt-1">Step {app.step}/11</p>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>

              <Card className="bg-slate-900/50 border-slate-800">
                <CardHeader>
                  <CardTitle className="text-white text-lg">Payroll Summary</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {payrollRecords.map((record) => (
                    <div key={record.id} className="flex items-center justify-between p-3 bg-slate-800/50 rounded-lg">
                      <div>
                        <p className="text-white font-medium">{record.period}</p>
                        <p className="text-slate-400 text-sm">{record.totalDrivers} drivers</p>
                      </div>
                      <div className="text-right">
                        <p className="text-emerald-400 font-bold">${record.totalPayout.toLocaleString()}</p>
                        {getStatusBadge(record.status)}
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </div>
          </div>
        )

      case "applicants":
        return (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-bold text-white">Applicant Tracking</h1>
                <p className="text-slate-400">Review and manage driver applications</p>
              </div>
              <div className="flex gap-2">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <Input 
                    placeholder="Search applicants..." 
                    className="pl-10 bg-slate-800 border-slate-700 w-64"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
                <Button variant="outline" className="border-slate-700">
                  <Filter className="w-4 h-4 mr-2" />
                  Filter
                </Button>
              </div>
            </div>

            {/* Status Tabs */}
            <div className="flex gap-2">
              {["All", "Pending", "Reviewing", "Background Check", "Approved", "Rejected"].map((status) => (
                <button
                  key={status}
                  className="px-4 py-2 rounded-lg bg-slate-800 text-slate-300 hover:bg-slate-700 transition-all text-sm"
                >
                  {status}
                </button>
              ))}
            </div>

            {/* Applicants Table */}
            <Card className="bg-slate-900/50 border-slate-800">
              <CardContent className="p-0">
                <table className="w-full">
                  <thead className="bg-slate-800/50">
                    <tr>
                      <th className="text-left p-4 text-slate-400 font-medium">Applicant</th>
                      <th className="text-left p-4 text-slate-400 font-medium">Contact</th>
                      <th className="text-left p-4 text-slate-400 font-medium">Location</th>
                      <th className="text-left p-4 text-slate-400 font-medium">Applied</th>
                      <th className="text-left p-4 text-slate-400 font-medium">Progress</th>
                      <th className="text-left p-4 text-slate-400 font-medium">Status</th>
                      <th className="text-left p-4 text-slate-400 font-medium">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {applicants.map((app) => (
                      <tr key={app.id} className="border-t border-slate-800 hover:bg-slate-800/50">
                        <td className="p-4">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center text-white font-bold">
                              {app.name.split(" ").map(n => n[0]).join("")}
                            </div>
                            <div>
                              <p className="text-white font-medium">{app.name}</p>
                              <p className="text-slate-500 text-sm">{app.id}</p>
                            </div>
                          </div>
                        </td>
                        <td className="p-4">
                          <p className="text-slate-300 text-sm">{app.email}</p>
                          <p className="text-slate-500 text-sm">{app.phone}</p>
                        </td>
                        <td className="p-4">
                          <p className="text-slate-300">{app.city}</p>
                          <p className="text-slate-500 text-sm">{app.state}</p>
                        </td>
                        <td className="p-4 text-slate-400">{app.appliedDate}</td>
                        <td className="p-4">
                          <div className="flex items-center gap-2">
                            <div className="w-24 h-2 bg-slate-700 rounded-full overflow-hidden">
                              <div 
                                className="h-full bg-emerald-500 rounded-full"
                                style={{ width: `${(app.step / 11) * 100}%` }}
                              />
                            </div>
                            <span className="text-slate-400 text-sm">{app.step}/11</span>
                          </div>
                        </td>
                        <td className="p-4">{getStatusBadge(app.status)}</td>
                        <td className="p-4">
                          <div className="flex gap-2">
                            <button 
                              onClick={() => setModal({ type: "view_applicant", data: app })}
                              className="p-2 hover:bg-slate-700 rounded-lg text-slate-400 hover:text-white"
                            >
                              <Eye className="w-4 h-4" />
                            </button>
                            <button className="p-2 hover:bg-emerald-500/20 rounded-lg text-slate-400 hover:text-emerald-400">
                              <Check className="w-4 h-4" />
                            </button>
                            <button className="p-2 hover:bg-red-500/20 rounded-lg text-slate-400 hover:text-red-400">
                              <Ban className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </CardContent>
            </Card>
          </div>
        )

      case "onboarding":
        return (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-bold text-white">New Hire Onboarding</h1>
                <p className="text-slate-400">Dedicated system for driver onboarding, trips, navigation, and earnings</p>
              </div>
            </div>

            {/* Onboarding Pipeline */}
            <Card className="bg-slate-900/50 border-slate-800">
              <CardHeader>
                <CardTitle className="text-white">11-Step Driver Onboarding Pipeline</CardTitle>
                <CardDescription>Click on any step to view details and manage applicants at that stage</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="relative">
                  {/* Progress Line */}
                  <div className="absolute top-8 left-0 right-0 h-1 bg-slate-700" />
                  
                  {/* Steps */}
                  <div className="relative grid grid-cols-11 gap-2">
                    {onboardingSteps.map((step, index) => (
                      <motion.button
                        key={step.step}
                        whileHover={{ scale: 1.05 }}
                        onClick={() => setModal({ type: "onboarding_step", data: step })}
                        className="flex flex-col items-center"
                      >
                        <div className={`w-16 h-16 rounded-xl flex items-center justify-center mb-2 ${
                          index < 5 ? "bg-emerald-500/20 border-2 border-emerald-500" :
                          index < 8 ? "bg-blue-500/20 border-2 border-blue-500" :
                          "bg-slate-700 border-2 border-slate-600"
                        }`}>
                          <step.icon className={`w-6 h-6 ${
                            index < 5 ? "text-emerald-400" :
                            index < 8 ? "text-blue-400" :
                            "text-slate-400"
                          }`} />
                        </div>
                        <span className="text-xs text-slate-400 text-center">{step.title}</span>
                        <span className="text-xs font-bold text-white mt-1">
                          {index === 0 ? "124" : index === 1 ? "98" : index === 2 ? "86" : index === 3 ? "72" : index === 4 ? "65" : index === 5 ? "58" : index === 6 ? "45" : index === 7 ? "38" : index === 8 ? "32" : index === 9 ? "28" : "24"}
                        </span>
                      </motion.button>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Current Onboarding List */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="bg-slate-900/50 border-slate-800">
                <CardHeader>
                  <CardTitle className="text-white">Awaiting Documents</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {applicants.filter(a => a.step <= 6).map((app) => (
                    <div key={app.id} className="flex items-center justify-between p-3 bg-slate-800/50 rounded-lg">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-yellow-500 to-orange-500 flex items-center justify-center text-white font-bold">
                          {app.name.split(" ").map(n => n[0]).join("")}
                        </div>
                        <div>
                          <p className="text-white font-medium">{app.name}</p>
                          <p className="text-slate-400 text-sm">Step {app.step}: {onboardingSteps[app.step - 1]?.title}</p>
                        </div>
                      </div>
                      <Button size="sm" variant="outline" className="border-yellow-500 text-yellow-400">
                        Send Reminder
                      </Button>
                    </div>
                  ))}
                </CardContent>
              </Card>

              <Card className="bg-slate-900/50 border-slate-800">
                <CardHeader>
                  <CardTitle className="text-white">Pending Admin Review</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {applicants.filter(a => a.step >= 9).map((app) => (
                    <div key={app.id} className="flex items-center justify-between p-3 bg-slate-800/50 rounded-lg">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 to-violet-500 flex items-center justify-center text-white font-bold">
                          {app.name.split(" ").map(n => n[0]).join("")}
                        </div>
                        <div>
                          <p className="text-white font-medium">{app.name}</p>
                          <p className="text-slate-400 text-sm">Step {app.step}: {onboardingSteps[app.step - 1]?.title}</p>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Button size="sm" className="bg-emerald-600 hover:bg-emerald-700">
                          Approve
                        </Button>
                        <Button size="sm" variant="outline" className="border-red-500 text-red-400">
                          Reject
                        </Button>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </div>
          </div>
        )

      case "payroll":
        return (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-bold text-white">Payroll, Time & Benefits</h1>
                <p className="text-slate-400">No more data double entry - Easy, accurate payroll for drivers</p>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" className="border-slate-700">
                  <Download className="w-4 h-4 mr-2" />
                  Export Payroll
                </Button>
                <Button className="bg-emerald-600 hover:bg-emerald-700">
                  <Play className="w-4 h-4 mr-2" />
                  Run Payroll
                </Button>
              </div>
            </div>

            {/* Payroll Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <Card className="bg-gradient-to-br from-emerald-500/20 to-green-500/20 border-emerald-500/30">
                <CardContent className="p-4">
                  <p className="text-slate-400 text-sm">Total Earnings This Period</p>
                  <p className="text-3xl font-bold text-white">${stats.totalPayrollThisPeriod.toLocaleString()}</p>
                  <p className="text-emerald-400 text-sm flex items-center gap-1 mt-1">
                    <ArrowUpRight className="w-4 h-4" /> +12.5% from last period
                  </p>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-yellow-500/20 to-amber-500/20 border-yellow-500/30">
                <CardContent className="p-4">
                  <p className="text-slate-400 text-sm">Pending Payouts</p>
                  <p className="text-3xl font-bold text-white">${stats.pendingPayouts.toLocaleString()}</p>
                  <p className="text-yellow-400 text-sm">189 drivers awaiting</p>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-blue-500/20 to-cyan-500/20 border-blue-500/30">
                <CardContent className="p-4">
                  <p className="text-slate-400 text-sm">Tips (100% to Drivers)</p>
                  <p className="text-3xl font-bold text-white">$28,450</p>
                  <p className="text-blue-400 text-sm">Calculated separately</p>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-purple-500/20 to-violet-500/20 border-purple-500/30">
                <CardContent className="p-4">
                  <p className="text-slate-400 text-sm">Tax Withholdings</p>
                  <p className="text-3xl font-bold text-white">$15,230</p>
                  <p className="text-purple-400 text-sm">W-9 compliant</p>
                </CardContent>
              </Card>
            </div>

            {/* Driver Earnings Table */}
            <Card className="bg-slate-900/50 border-slate-800">
              <CardHeader>
                <CardTitle className="text-white">Driver Earnings - Current Period</CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <table className="w-full">
                  <thead className="bg-slate-800/50">
                    <tr>
                      <th className="text-left p-4 text-slate-400 font-medium">Driver</th>
                      <th className="text-left p-4 text-slate-400 font-medium">Trips</th>
                      <th className="text-left p-4 text-slate-400 font-medium">Gross Earnings</th>
                      <th className="text-left p-4 text-slate-400 font-medium">Tips</th>
                      <th className="text-left p-4 text-slate-400 font-medium">Deductions</th>
                      <th className="text-left p-4 text-slate-400 font-medium">Net Pay</th>
                      <th className="text-left p-4 text-slate-400 font-medium">Tax Status</th>
                      <th className="text-left p-4 text-slate-400 font-medium">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {drivers.filter(d => d.status === "active").map((driver) => (
                      <tr key={driver.id} className="border-t border-slate-800 hover:bg-slate-800/50">
                        <td className="p-4">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-emerald-500 to-green-500 flex items-center justify-center text-white font-bold">
                              {driver.name.split(" ").map(n => n[0]).join("")}
                            </div>
                            <div>
                              <p className="text-white font-medium">{driver.name}</p>
                              <p className="text-slate-500 text-sm">{driver.id}</p>
                            </div>
                          </div>
                        </td>
                        <td className="p-4 text-slate-300">{driver.trips}</td>
                        <td className="p-4 text-emerald-400 font-medium">${driver.earnings.toLocaleString()}</td>
                        <td className="p-4 text-blue-400">${(driver.earnings * 0.12).toFixed(2)}</td>
                        <td className="p-4 text-red-400">-${(driver.earnings * 0.08).toFixed(2)}</td>
                        <td className="p-4 text-white font-bold">${(driver.earnings * 1.04).toFixed(2)}</td>
                        <td className="p-4">
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                            driver.taxStatus === "W-9 Filed" 
                              ? "bg-emerald-500/20 text-emerald-400" 
                              : "bg-yellow-500/20 text-yellow-400"
                          }`}>
                            {driver.taxStatus}
                          </span>
                        </td>
                        <td className="p-4">
                          <Button size="sm" variant="outline" className="border-emerald-500 text-emerald-400">
                            Pay Now
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </CardContent>
            </Card>
          </div>
        )

      case "database":
        return (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-bold text-white">HR Database</h1>
                <p className="text-slate-400">Highly secure database organized by state and country - Good for tax purposes</p>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" className="border-slate-700">
                  <Lock className="w-4 h-4 mr-2" />
                  Security Audit
                </Button>
                <Button className="bg-blue-600 hover:bg-blue-700">
                  <Download className="w-4 h-4 mr-2" />
                  Export Records
                </Button>
              </div>
            </div>

            {/* Security Status */}
            <Card className="bg-gradient-to-r from-emerald-500/10 to-green-500/10 border-emerald-500/30">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="p-3 bg-emerald-500/20 rounded-xl">
                      <Shield className="w-8 h-8 text-emerald-400" />
                    </div>
                    <div>
                      <h3 className="text-white font-bold text-lg">Database Security: MAXIMUM</h3>
                      <p className="text-slate-400">256-bit AES encryption | SOC 2 Type II | GDPR Compliant | PCI-DSS Level 1</p>
                    </div>
                  </div>
                  <div className="flex gap-4">
                    <div className="text-center">
                      <p className="text-2xl font-bold text-emerald-400">100%</p>
                      <p className="text-slate-500 text-sm">Encrypted</p>
                    </div>
                    <div className="text-center">
                      <p className="text-2xl font-bold text-blue-400">24/7</p>
                      <p className="text-slate-500 text-sm">Monitored</p>
                    </div>
                    <div className="text-center">
                      <p className="text-2xl font-bold text-purple-400">0</p>
                      <p className="text-slate-500 text-sm">Breaches</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* States Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="bg-slate-900/50 border-slate-800">
                <CardHeader>
                  <CardTitle className="text-white flex items-center gap-2">
                    <Globe className="w-5 h-5 text-blue-400" />
                    Driver Records by State (USA)
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  {usStates.map((state) => (
                    <motion.button
                      key={state.code}
                      whileHover={{ scale: 1.01 }}
                      onClick={() => setSelectedState(state.code)}
                      className={`w-full flex items-center justify-between p-3 rounded-lg transition-all ${
                        selectedState === state.code 
                          ? "bg-blue-500/20 border border-blue-500" 
                          : "bg-slate-800/50 hover:bg-slate-800"
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center text-white font-bold">
                          {state.code}
                        </div>
                        <div className="text-left">
                          <p className="text-white font-medium">{state.name}</p>
                          <p className="text-slate-500 text-sm">{state.drivers} drivers | {state.applicants} applicants</p>
                        </div>
                      </div>
                      <ChevronRight className="w-5 h-5 text-slate-400" />
                    </motion.button>
                  ))}
                </CardContent>
              </Card>

              <Card className="bg-slate-900/50 border-slate-800">
                <CardHeader>
                  <CardTitle className="text-white flex items-center gap-2">
                    <FileText className="w-5 h-5 text-emerald-400" />
                    Document Categories
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {[
                    { name: "Driver Licenses", count: 189, icon: BadgeCheck, color: "emerald" },
                    { name: "Vehicle Insurance", count: 189, icon: Shield, color: "blue" },
                    { name: "Background Checks", count: 185, icon: Fingerprint, color: "purple" },
                    { name: "W-9 Tax Forms", count: 178, icon: FileText, color: "orange" },
                    { name: "Vehicle Registrations", count: 189, icon: Car, color: "cyan" },
                    { name: "Bank Account Info", count: 189, icon: Banknote, color: "green" },
                    { name: "Profile Photos", count: 189, icon: Camera, color: "pink" },
                    { name: "Training Certificates", count: 156, icon: GraduationCap, color: "yellow" },
                  ].map((doc) => (
                    <button
                      key={doc.name}
                      className="w-full flex items-center justify-between p-3 bg-slate-800/50 rounded-lg hover:bg-slate-800 transition-all"
                    >
                      <div className="flex items-center gap-3">
                        <div className={`p-2 bg-${doc.color}-500/20 rounded-lg`}>
                          <doc.icon className={`w-5 h-5 text-${doc.color}-400`} />
                        </div>
                        <span className="text-white">{doc.name}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-slate-400">{doc.count} files</span>
                        <ChevronRight className="w-4 h-4 text-slate-500" />
                      </div>
                    </button>
                  ))}
                </CardContent>
              </Card>
            </div>

            {/* Audit Log */}
            <Card className="bg-slate-900/50 border-slate-800">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <History className="w-5 h-5 text-yellow-400" />
                  Recent Access Log (Audit Trail)
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {[
                    { user: "Admin Sarah", action: "Viewed driver license", target: "DRV001 - Robert Martinez", time: "2 min ago", ip: "192.168.1.***" },
                    { user: "Admin Mike", action: "Downloaded W-9 forms", target: "Batch export - California", time: "15 min ago", ip: "192.168.1.***" },
                    { user: "Admin Sarah", action: "Updated bank info", target: "DRV004 - Amanda Garcia", time: "1 hour ago", ip: "192.168.1.***" },
                    { user: "System", action: "Automated backup", target: "Full database", time: "6 hours ago", ip: "Internal" },
                  ].map((log, idx) => (
                    <div key={idx} className="flex items-center justify-between p-3 bg-slate-800/50 rounded-lg">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-slate-700 flex items-center justify-center">
                          <Key className="w-4 h-4 text-slate-400" />
                        </div>
                        <div>
                          <p className="text-white text-sm"><span className="text-blue-400">{log.user}</span> {log.action}</p>
                          <p className="text-slate-500 text-xs">{log.target}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-slate-400 text-sm">{log.time}</p>
                        <p className="text-slate-600 text-xs">{log.ip}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        )

      case "records":
        return (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-bold text-white">Driver Employee Records</h1>
                <p className="text-slate-400">Automate operational tasks - Focus on people, not paperwork</p>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" className="border-slate-700">
                  <Filter className="w-4 h-4 mr-2" />
                  Filter
                </Button>
                <Link href="/driver/register" target="_blank">
                  <Button className="bg-emerald-600 hover:bg-emerald-700">
                    <Plus className="w-4 h-4 mr-2" />
                    Add Driver
                  </Button>
                </Link>
              </div>
            </div>

            {/* Driver Records Table */}
            <Card className="bg-slate-900/50 border-slate-800">
              <CardContent className="p-0">
                <table className="w-full">
                  <thead className="bg-slate-800/50">
                    <tr>
                      <th className="text-left p-4 text-slate-400 font-medium">Driver</th>
                      <th className="text-left p-4 text-slate-400 font-medium">Location</th>
                      <th className="text-left p-4 text-slate-400 font-medium">Hire Date</th>
                      <th className="text-left p-4 text-slate-400 font-medium">Status</th>
                      <th className="text-left p-4 text-slate-400 font-medium">Rating</th>
                      <th className="text-left p-4 text-slate-400 font-medium">Trips</th>
                      <th className="text-left p-4 text-slate-400 font-medium">Earnings</th>
                      <th className="text-left p-4 text-slate-400 font-medium">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {drivers.map((driver) => (
                      <tr key={driver.id} className="border-t border-slate-800 hover:bg-slate-800/50">
                        <td className="p-4">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-emerald-500 to-green-500 flex items-center justify-center text-white font-bold">
                              {driver.name.split(" ").map(n => n[0]).join("")}
                            </div>
                            <div>
                              <p className="text-white font-medium">{driver.name}</p>
                              <p className="text-slate-500 text-sm">{driver.email}</p>
                            </div>
                          </div>
                        </td>
                        <td className="p-4">
                          <p className="text-slate-300">{driver.city}</p>
                          <p className="text-slate-500 text-sm">{driver.state}</p>
                        </td>
                        <td className="p-4 text-slate-400">{driver.hireDate}</td>
                        <td className="p-4">{getStatusBadge(driver.status)}</td>
                        <td className="p-4">
                          <div className="flex items-center gap-1">
                            <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                            <span className="text-white">{driver.rating}</span>
                          </div>
                        </td>
                        <td className="p-4 text-slate-300">{driver.trips}</td>
                        <td className="p-4 text-emerald-400 font-medium">${driver.earnings.toLocaleString()}</td>
                        <td className="p-4">
                          <div className="flex gap-2">
                            <button className="p-2 hover:bg-slate-700 rounded-lg text-slate-400 hover:text-white">
                              <Eye className="w-4 h-4" />
                            </button>
                            <button className="p-2 hover:bg-slate-700 rounded-lg text-slate-400 hover:text-white">
                              <Edit className="w-4 h-4" />
                            </button>
                            <button className="p-2 hover:bg-slate-700 rounded-lg text-slate-400 hover:text-white">
                              <FileText className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </CardContent>
            </Card>
          </div>
        )

      case "benefits":
        return (
          <div className="space-y-6">
            <div>
              <h1 className="text-2xl font-bold text-white">Benefits Administration</h1>
              <p className="text-slate-400">Driver benefits, incentives, and rewards management</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card className="bg-gradient-to-br from-emerald-500/20 to-green-500/20 border-emerald-500/30">
                <CardContent className="p-6">
                  <Heart className="w-10 h-10 text-emerald-400 mb-4" />
                  <h3 className="text-white font-bold text-lg">Health Benefits</h3>
                  <p className="text-slate-400 text-sm mt-2">Insurance options for eligible drivers</p>
                  <Button className="mt-4 w-full bg-emerald-600 hover:bg-emerald-700">Manage Plans</Button>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-blue-500/20 to-cyan-500/20 border-blue-500/30">
                <CardContent className="p-6">
                  <Award className="w-10 h-10 text-blue-400 mb-4" />
                  <h3 className="text-white font-bold text-lg">Performance Bonuses</h3>
                  <p className="text-slate-400 text-sm mt-2">Incentive programs for top drivers</p>
                  <Button className="mt-4 w-full bg-blue-600 hover:bg-blue-700">View Programs</Button>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-purple-500/20 to-violet-500/20 border-purple-500/30">
                <CardContent className="p-6">
                  <Target className="w-10 h-10 text-purple-400 mb-4" />
                  <h3 className="text-white font-bold text-lg">Driver Rewards</h3>
                  <p className="text-slate-400 text-sm mt-2">Loyalty and milestone rewards</p>
                  <Button className="mt-4 w-full bg-purple-600 hover:bg-purple-700">Manage Rewards</Button>
                </CardContent>
              </Card>
            </div>
          </div>
        )

      case "offboarding":
        return (
          <div className="space-y-6">
            <div>
              <h1 className="text-2xl font-bold text-white">Offboarding</h1>
              <p className="text-slate-400">Exit processing and account deactivation</p>
            </div>

            <Card className="bg-slate-900/50 border-slate-800">
              <CardHeader>
                <CardTitle className="text-white">Pending Offboarding</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-4 bg-slate-800/50 rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-orange-500 to-red-500 flex items-center justify-center text-white font-bold">
                        KA
                      </div>
                      <div>
                        <p className="text-white font-medium">Kevin Anderson</p>
                        <p className="text-slate-400 text-sm">Reason: Policy violation</p>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button size="sm" variant="outline" className="border-slate-600">
                        View Details
                      </Button>
                      <Button size="sm" className="bg-red-600 hover:bg-red-700">
                        Process Exit
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )

      case "reports":
        return (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-bold text-white">HR Reports & Analytics</h1>
                <p className="text-slate-400">Reporting software to focus on people, not paperwork</p>
              </div>
              <Button className="bg-blue-600 hover:bg-blue-700">
                <Download className="w-4 h-4 mr-2" />
                Generate Report
              </Button>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[
                { name: "Headcount Report", icon: Users, color: "blue" },
                { name: "Payroll Summary", icon: DollarSign, color: "emerald" },
                { name: "Turnover Analysis", icon: TrendingUp, color: "orange" },
                { name: "Compliance Status", icon: Shield, color: "purple" },
                { name: "Time to Hire", icon: Clock, color: "cyan" },
                { name: "Tax Documents", icon: FileText, color: "yellow" },
                { name: "Performance Metrics", icon: BarChart3, color: "pink" },
                { name: "Audit Trail", icon: History, color: "slate" },
              ].map((report) => (
                <Card key={report.name} className="bg-slate-900/50 border-slate-800 hover:border-slate-600 cursor-pointer transition-all">
                  <CardContent className="p-4">
                    <report.icon className={`w-8 h-8 text-${report.color}-400 mb-3`} />
                    <p className="text-white font-medium">{report.name}</p>
                    <p className="text-slate-500 text-sm">Click to generate</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )

      default:
        return null
    }
  }

  return (
    <div className="min-h-screen bg-slate-950 flex">
      {/* Sidebar */}
      <motion.aside
        initial={false}
        animate={{ width: sidebarOpen ? 280 : 80 }}
        className="bg-slate-900 border-r border-slate-800 flex flex-col fixed h-full z-50"
      >
        {/* Logo */}
        <div className="p-4 border-b border-slate-800">
          <Link href="/admin" className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500 to-green-600 flex items-center justify-center">
              <span className="text-white font-bold text-lg">G</span>
            </div>
            {sidebarOpen && (
              <div>
                <h1 className="font-bold text-white">GlideWay HR</h1>
                <p className="text-xs text-slate-500">Human Resources</p>
              </div>
            )}
          </Link>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
          {hrMenuItems.map((item) => (
            <motion.button
              key={item.id}
              whileHover={{ x: 4 }}
              onClick={() => setCurrentView(item.id)}
              className={`w-full flex items-center gap-3 px-3 py-3 rounded-xl transition-all ${
                currentView === item.id
                  ? `bg-gradient-to-r ${item.color} text-white shadow-lg`
                  : "text-slate-400 hover:bg-slate-800 hover:text-white"
              }`}
            >
              <item.icon className="w-5 h-5 flex-shrink-0" />
              {sidebarOpen && (
                <>
                  <span className="flex-1 text-left text-sm font-medium">{item.label}</span>
                  {item.badge && (
                    <span className="px-2 py-0.5 bg-red-500 text-white text-xs rounded-full">
                      {item.badge}
                    </span>
                  )}
                </>
              )}
            </motion.button>
          ))}
        </nav>

        {/* Footer */}
        <div className="p-3 border-t border-slate-800">
          <Link href="/admin">
            <button className="w-full flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-slate-800 text-slate-400">
              <ArrowLeft className="w-5 h-5" />
              {sidebarOpen && <span className="text-sm">Back to Dashboard</span>}
            </button>
          </Link>
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="w-full flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-slate-800 text-slate-400 mt-1"
          >
            {sidebarOpen ? <ChevronLeft className="w-5 h-5" /> : <ChevronRight className="w-5 h-5" />}
            {sidebarOpen && <span className="text-sm">Collapse</span>}
          </button>
        </div>
      </motion.aside>

      {/* Main Content */}
      <main className={`flex-1 ${sidebarOpen ? "ml-[280px]" : "ml-[80px]"} transition-all`}>
        {/* Top Bar */}
        <header className="bg-slate-900/80 backdrop-blur-sm border-b border-slate-800 px-6 py-4 sticky top-0 z-40">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <h2 className="text-lg font-semibold text-white">
                {hrMenuItems.find(m => m.id === currentView)?.label}
              </h2>
              <span className="text-slate-500">|</span>
              <span className="text-slate-400 text-sm">
                {hrMenuItems.find(m => m.id === currentView)?.description}
              </span>
            </div>
            <div className="flex items-center gap-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                <Input
                  placeholder="Search HR..."
                  className="pl-10 bg-slate-800 border-slate-700 w-64"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <button className="relative p-2 hover:bg-slate-800 rounded-lg">
                <Bell className="w-5 h-5 text-slate-400" />
                <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full" />
              </button>
              <div className="flex items-center gap-2 px-3 py-2 bg-slate-800 rounded-lg">
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-emerald-500 to-green-600 flex items-center justify-center text-white text-sm font-bold">
                  HR
                </div>
                {sidebarOpen && <span className="text-white text-sm">HR Admin</span>}
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
              {renderView()}
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
            className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4"
            onClick={() => setModal(null)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-slate-900 border border-slate-800 rounded-2xl p-6 max-w-lg w-full max-h-[80vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              {modal.type === "step_detail" && modal.data && (
                <>
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-12 h-12 rounded-xl bg-emerald-500/20 flex items-center justify-center">
                      <modal.data.icon className="w-6 h-6 text-emerald-400" />
                    </div>
                    <div>
                      <h3 className="text-white font-bold text-lg">Step {modal.data.step}</h3>
                      <p className="text-slate-400">{modal.data.title}</p>
                    </div>
                  </div>
                  <p className="text-slate-300">{modal.data.description}</p>
                  <div className="mt-6 flex gap-3">
                    <Button className="flex-1 bg-emerald-600 hover:bg-emerald-700">View Applicants</Button>
                    <Button variant="outline" className="flex-1 border-slate-700" onClick={() => setModal(null)}>Close</Button>
                  </div>
                </>
              )}

              {modal.type === "view_applicant" && modal.data && (
                <>
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-14 h-14 rounded-full bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center text-white font-bold text-lg">
                      {modal.data.name.split(" ").map((n: string) => n[0]).join("")}
                    </div>
                    <div>
                      <h3 className="text-white font-bold text-lg">{modal.data.name}</h3>
                      <p className="text-slate-400">{modal.data.email}</p>
                    </div>
                  </div>
                  <div className="space-y-3 mb-6">
                    <div className="flex justify-between p-3 bg-slate-800/50 rounded-lg">
                      <span className="text-slate-400">Phone</span>
                      <span className="text-white">{modal.data.phone}</span>
                    </div>
                    <div className="flex justify-between p-3 bg-slate-800/50 rounded-lg">
                      <span className="text-slate-400">Location</span>
                      <span className="text-white">{modal.data.city}, {modal.data.state}</span>
                    </div>
                    <div className="flex justify-between p-3 bg-slate-800/50 rounded-lg">
                      <span className="text-slate-400">Applied</span>
                      <span className="text-white">{modal.data.appliedDate}</span>
                    </div>
                    <div className="flex justify-between p-3 bg-slate-800/50 rounded-lg">
                      <span className="text-slate-400">Progress</span>
                      <span className="text-white">Step {modal.data.step} of 11</span>
                    </div>
                    <div className="flex justify-between p-3 bg-slate-800/50 rounded-lg">
                      <span className="text-slate-400">Status</span>
                      {getStatusBadge(modal.data.status)}
                    </div>
                  </div>
                  <div className="flex gap-3">
                    <Button className="flex-1 bg-emerald-600 hover:bg-emerald-700">Approve</Button>
                    <Button variant="outline" className="flex-1 border-red-500 text-red-400 hover:bg-red-500/20">Reject</Button>
                  </div>
                </>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
