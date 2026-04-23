"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  ArrowLeft, Globe, Smartphone, Server, Map, CreditCard, Shield,
  Database, Wifi, Code, CheckCircle2, Clock, Zap, Lock, Cloud,
  Cpu, HardDrive, Network, FileCode, Terminal, GitBranch
} from "lucide-react"

export default function TechStackPage() {
  const [activeTab, setActiveTab] = useState("overview")

  const techCategories = [
    {
      id: "website",
      title: "A. Public Website",
      icon: Globe,
      color: "from-blue-500 to-cyan-500",
      technologies: [
        { name: "Next.js 16", status: "active", description: "React framework with App Router" },
        { name: "Tailwind CSS", status: "active", description: "Utility-first CSS framework" },
        { name: "Secure Forms", status: "active", description: "Client & server validation" },
        { name: "CMS Pages", status: "active", description: "Marketing content management" }
      ]
    },
    {
      id: "mobile",
      title: "B. Mobile Apps",
      icon: Smartphone,
      color: "from-purple-500 to-pink-500",
      technologies: [
        { name: "React Native", status: "recommended", description: "Cross-platform mobile framework" },
        { name: "Flutter", status: "alternative", description: "Google's UI toolkit" },
        { name: "Rider App", status: "active", description: "Customer-facing mobile app" },
        { name: "Driver App", status: "active", description: "Driver dashboard & navigation" }
      ]
    },
    {
      id: "backend",
      title: "C. Backend System",
      icon: Server,
      color: "from-emerald-500 to-teal-500",
      technologies: [
        { name: "Node.js (NestJS)", status: "active", description: "Enterprise-grade backend framework" },
        { name: "PostgreSQL", status: "active", description: "Primary relational database" },
        { name: "Prisma ORM", status: "active", description: "Type-safe database client" },
        { name: "Redis", status: "active", description: "Real-time state & caching" },
        { name: "WebSockets", status: "active", description: "Live tracking & messaging" }
      ]
    },
    {
      id: "mapping",
      title: "D. Mapping System",
      icon: Map,
      color: "from-orange-500 to-amber-500",
      technologies: [
        { name: "Google Maps Platform", status: "primary", description: "Maps, Places, Directions APIs" },
        { name: "Mapbox", status: "alternative", description: "Custom map styling" },
        { name: "Places Autocomplete", status: "active", description: "Address search & suggestions" },
        { name: "Directions API", status: "active", description: "Route calculation & navigation" },
        { name: "Distance Matrix API", status: "active", description: "Multi-point distance calculations" },
        { name: "Traffic Integration", status: "active", description: "Real-time traffic data" }
      ]
    },
    {
      id: "payments",
      title: "E. Payments",
      icon: CreditCard,
      color: "from-green-500 to-emerald-500",
      technologies: [
        { name: "Stripe", status: "primary", description: "Payment processing & payouts" },
        { name: "WorldPay", status: "supported", description: "Alternative payment processor" },
        { name: "Adyen", status: "supported", description: "Global payment platform" },
        { name: "Tokenized Storage", status: "active", description: "PCI-DSS compliant card vault" },
        { name: "ACH Payouts", status: "active", description: "Bank transfers for drivers" },
        { name: "Instant Payouts", status: "active", description: "Same-day driver payments" }
      ]
    },
    {
      id: "security",
      title: "F. Security",
      icon: Shield,
      color: "from-red-500 to-rose-500",
      technologies: [
        { name: "JWT Authentication", status: "active", description: "Secure token-based auth" },
        { name: "MFA", status: "active", description: "Multi-factor authentication" },
        { name: "Encryption", status: "active", description: "In transit + at rest (AES-256)" },
        { name: "RBAC", status: "active", description: "Role-based access control" },
        { name: "Audit Logs", status: "active", description: "Complete activity tracking" }
      ]
    }
  ]

  const systemMetrics = [
    { label: "API Uptime", value: 99.9, unit: "%", color: "emerald" },
    { label: "Avg Response Time", value: 45, unit: "ms", color: "blue" },
    { label: "Database Health", value: 100, unit: "%", color: "green" },
    { label: "Cache Hit Rate", value: 94.5, unit: "%", color: "purple" },
    { label: "WebSocket Connections", value: 12847, unit: "", color: "orange" },
    { label: "Requests/min", value: 8432, unit: "", color: "cyan" }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 text-white">
      {/* Header */}
      <header className="border-b border-white/10 bg-black/30 backdrop-blur-xl sticky top-0 z-50">
        <div className="flex items-center justify-between px-6 py-4">
          <div className="flex items-center gap-4">
            <Link href="/admin">
              <Button variant="ghost" size="sm" className="gap-2">
                <ArrowLeft className="h-4 w-4" />
                Back to Dashboard
              </Button>
            </Link>
            <div className="h-6 w-px bg-white/20" />
            <div>
              <h1 className="text-xl font-bold">Technology Stack</h1>
              <p className="text-sm text-white/60">Production-Ready Infrastructure</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Badge className="bg-emerald-500/20 text-emerald-400 border-emerald-500/30">
              <CheckCircle2 className="h-3 w-3 mr-1" />
              All Systems Operational
            </Badge>
          </div>
        </div>
      </header>

      <main className="p-6 max-w-7xl mx-auto">
        {/* System Health Overview */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-8">
          {systemMetrics.map((metric, i) => (
            <Card key={i} className="bg-white/5 border-white/10">
              <CardContent className="p-4">
                <div className="text-2xl font-bold text-white">
                  {typeof metric.value === "number" && metric.value > 1000 
                    ? `${(metric.value/1000).toFixed(1)}K` 
                    : metric.value}{metric.unit}
                </div>
                <div className="text-sm text-white/60">{metric.label}</div>
                <Progress 
                  value={metric.value > 100 ? 100 : metric.value} 
                  className="h-1 mt-2 bg-white/10"
                />
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="bg-white/5 border border-white/10 p-1">
            <TabsTrigger value="overview" className="data-[state=active]:bg-white/10">
              Overview
            </TabsTrigger>
            <TabsTrigger value="architecture" className="data-[state=active]:bg-white/10">
              Architecture
            </TabsTrigger>
            <TabsTrigger value="apis" className="data-[state=active]:bg-white/10">
              APIs
            </TabsTrigger>
            <TabsTrigger value="deployment" className="data-[state=active]:bg-white/10">
              Deployment
            </TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            {/* Technology Categories Grid */}
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {techCategories.map((category) => (
                <Card key={category.id} className="bg-white/5 border-white/10 overflow-hidden">
                  <CardHeader className={`bg-gradient-to-r ${category.color} p-4`}>
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-white/20 flex items-center justify-center">
                        <category.icon className="h-5 w-5 text-white" />
                      </div>
                      <CardTitle className="text-white text-lg">{category.title}</CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent className="p-4 space-y-3">
                    {category.technologies.map((tech, i) => (
                      <div key={i} className="flex items-center justify-between py-2 border-b border-white/5 last:border-0">
                        <div>
                          <div className="font-medium text-white">{tech.name}</div>
                          <div className="text-xs text-white/50">{tech.description}</div>
                        </div>
                        <Badge 
                          variant="outline" 
                          className={
                            tech.status === "active" ? "border-emerald-500/50 text-emerald-400" :
                            tech.status === "primary" ? "border-blue-500/50 text-blue-400" :
                            tech.status === "recommended" ? "border-purple-500/50 text-purple-400" :
                            "border-white/30 text-white/60"
                          }
                        >
                          {tech.status}
                        </Badge>
                      </div>
                    ))}
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="architecture" className="space-y-6">
            <Card className="bg-white/5 border-white/10">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Network className="h-5 w-5 text-blue-400" />
                  System Architecture
                </CardTitle>
                <CardDescription>High-level overview of the GlideWay platform architecture</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="bg-slate-900 rounded-lg p-6 font-mono text-sm">
                  <pre className="text-emerald-400 whitespace-pre-wrap">{`
┌─────────────────────────────────────────────────────────────────────┐
│                         GLIDEWAY ARCHITECTURE                        │
└─────────────────────────────────────────────────────────────────────┘

                    ┌──────────────────┐
                    │   CDN (Vercel)   │
                    │   Edge Network   │
                    └────────┬─────────┘
                             │
         ┌───────────────────┼───────────────────┐
         │                   │                   │
    ┌────▼────┐        ┌─────▼─────┐       ┌────▼────┐
    │ Website │        │ Rider App │       │ Driver  │
    │ Next.js │        │   React   │       │   App   │
    └────┬────┘        │  Native   │       │         │
         │             └─────┬─────┘       └────┬────┘
         │                   │                  │
         └───────────────────┼──────────────────┘
                             │
                    ┌────────▼────────┐
                    │   API Gateway   │
                    │   (Rate Limit)  │
                    └────────┬────────┘
                             │
         ┌───────────────────┼───────────────────┐
         │                   │                   │
    ┌────▼────┐        ┌─────▼─────┐       ┌────▼────┐
    │  Auth   │        │   Rides   │       │ Payment │
    │ Service │        │  Service  │       │ Service │
    └────┬────┘        └─────┬─────┘       └────┬────┘
         │                   │                  │
         └───────────────────┼──────────────────┘
                             │
              ┌──────────────┼──────────────┐
              │              │              │
        ┌─────▼─────┐  ┌─────▼─────┐  ┌────▼────┐
        │PostgreSQL │  │   Redis   │  │  Stripe │
        │  Primary  │  │   Cache   │  │ Payment │
        └───────────┘  └───────────┘  └─────────┘
`}</pre>
                </div>
              </CardContent>
            </Card>

            {/* Database Schema */}
            <Card className="bg-white/5 border-white/10">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Database className="h-5 w-5 text-purple-400" />
                  Database Schema
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-3 gap-4">
                  {[
                    { name: "Users", tables: ["users", "sessions", "addresses", "emergency_contacts"], color: "blue" },
                    { name: "Drivers", tables: ["driver_profiles", "vehicles", "documents", "bank_accounts"], color: "emerald" },
                    { name: "Rides", tables: ["rides", "ride_tracking", "ride_messages", "incidents"], color: "orange" },
                    { name: "Payments", tables: ["payment_methods", "driver_payouts", "refunds"], color: "green" },
                    { name: "Support", tables: ["support_tickets", "ticket_messages", "fraud_alerts"], color: "red" },
                    { name: "System", tables: ["audit_logs", "system_settings", "zones", "promotions"], color: "purple" }
                  ].map((schema, i) => (
                    <div key={i} className="bg-white/5 rounded-lg p-4 border border-white/10">
                      <div className={`text-${schema.color}-400 font-semibold mb-2`}>{schema.name}</div>
                      <ul className="space-y-1">
                        {schema.tables.map((table, j) => (
                          <li key={j} className="text-sm text-white/60 font-mono">{table}</li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="apis" className="space-y-6">
            <Card className="bg-white/5 border-white/10">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileCode className="h-5 w-5 text-cyan-400" />
                  API Endpoints
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[
                    { method: "POST", path: "/api/auth", description: "Authentication (register, login, logout, MFA)", color: "emerald" },
                    { method: "GET", path: "/api/rides?action=estimate", description: "Get fare estimate for trip", color: "blue" },
                    { method: "POST", path: "/api/rides", description: "Create new ride request", color: "emerald" },
                    { method: "PATCH", path: "/api/rides", description: "Update ride (cancel, rate, tip)", color: "orange" },
                    { method: "GET", path: "/api/drivers/nearby", description: "Find available drivers", color: "blue" },
                    { method: "POST", path: "/api/payments/charge", description: "Process payment", color: "emerald" },
                    { method: "POST", path: "/api/payments/refund", description: "Process refund", color: "emerald" },
                    { method: "WS", path: "/api/realtime", description: "WebSocket for live tracking", color: "purple" }
                  ].map((endpoint, i) => (
                    <div key={i} className="flex items-center gap-4 p-3 bg-white/5 rounded-lg">
                      <Badge className={`bg-${endpoint.color}-500/20 text-${endpoint.color}-400 font-mono`}>
                        {endpoint.method}
                      </Badge>
                      <code className="text-white font-mono">{endpoint.path}</code>
                      <span className="text-white/50 text-sm">{endpoint.description}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="deployment" className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              <Card className="bg-white/5 border-white/10">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Cloud className="h-5 w-5 text-blue-400" />
                    Deployment Pipeline
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {[
                    { step: "1", name: "Push to GitHub", status: "complete" },
                    { step: "2", name: "Vercel Build", status: "complete" },
                    { step: "3", name: "Run Tests", status: "complete" },
                    { step: "4", name: "Deploy Preview", status: "complete" },
                    { step: "5", name: "Production Deploy", status: "complete" }
                  ].map((step, i) => (
                    <div key={i} className="flex items-center gap-4">
                      <div className="w-8 h-8 rounded-full bg-emerald-500/20 flex items-center justify-center text-emerald-400 font-bold">
                        {step.step}
                      </div>
                      <div className="flex-1">{step.name}</div>
                      <CheckCircle2 className="h-5 w-5 text-emerald-400" />
                    </div>
                  ))}
                </CardContent>
              </Card>

              <Card className="bg-white/5 border-white/10">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Terminal className="h-5 w-5 text-emerald-400" />
                    Environment Variables
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="bg-slate-900 rounded-lg p-4 font-mono text-sm space-y-2">
                    <div><span className="text-purple-400">DATABASE_URL</span>=<span className="text-white/50">postgresql://...</span></div>
                    <div><span className="text-purple-400">REDIS_URL</span>=<span className="text-white/50">redis://...</span></div>
                    <div><span className="text-purple-400">STRIPE_SECRET_KEY</span>=<span className="text-white/50">sk_live_...</span></div>
                    <div><span className="text-purple-400">GOOGLE_MAPS_API_KEY</span>=<span className="text-white/50">AIza...</span></div>
                    <div><span className="text-purple-400">JWT_SECRET</span>=<span className="text-white/50">********</span></div>
                    <div><span className="text-purple-400">NEXT_PUBLIC_APP_URL</span>=<span className="text-white/50">https://glideway.com</span></div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  )
}
