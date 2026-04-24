"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import Link from "next/link"
import { 
  ChevronLeft, Shield, AlertTriangle, Phone, MessageCircle, 
  MapPin, Camera, Clock, CheckCircle, Share2, Users, Car,
  AlertCircle, X, ChevronRight, FileText, Siren, Heart,
  Eye, Lock, Bell, Radio
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"

interface SafetyFeature {
  id: string
  icon: React.ReactNode
  title: string
  description: string
  enabled: boolean
}

export default function DriverSafetyPage() {
  const [showReportIncident, setShowReportIncident] = useState(false)
  const [incidentType, setIncidentType] = useState<string | null>(null)
  const [incidentDescription, setIncidentDescription] = useState("")
  const [locationSharing, setLocationSharing] = useState(true)

  const safetyFeatures: SafetyFeature[] = [
    { id: "1", icon: <MapPin className="w-5 h-5" />, title: "Live Location Sharing", description: "Share your real-time location with trusted contacts", enabled: locationSharing },
    { id: "2", icon: <Siren className="w-5 h-5" />, title: "Emergency SOS", description: "Quick access to emergency services", enabled: true },
    { id: "3", icon: <Camera className="w-5 h-5" />, title: "Dashcam Integration", description: "Record trips for safety and evidence", enabled: false },
    { id: "4", icon: <Shield className="w-5 h-5" />, title: "Rider Verification", description: "Verify rider identity before starting trip", enabled: true },
    { id: "5", icon: <Bell className="w-5 h-5" />, title: "Safety Alerts", description: "Get notified about safety concerns", enabled: true },
    { id: "6", icon: <Lock className="w-5 h-5" />, title: "PIN Verification", description: "Require riders to provide PIN to start trip", enabled: false },
  ]

  const incidentTypes = [
    { id: "collision", icon: <Car className="w-5 h-5" />, label: "Vehicle Collision" },
    { id: "harassment", icon: <AlertTriangle className="w-5 h-5" />, label: "Harassment" },
    { id: "assault", icon: <AlertCircle className="w-5 h-5" />, label: "Physical Assault" },
    { id: "theft", icon: <Eye className="w-5 h-5" />, label: "Theft" },
    { id: "property", icon: <Car className="w-5 h-5" />, label: "Property Damage" },
    { id: "other", icon: <FileText className="w-5 h-5" />, label: "Other Incident" },
  ]

  const emergencyContacts = [
    { name: "Emergency Services", number: "911", icon: <Siren className="w-5 h-5" />, color: "bg-red-500" },
    { name: "GlideWay Safety Line", number: "1-800-SAFE", icon: <Shield className="w-5 h-5" />, color: "bg-emerald-500" },
    { name: "Local Police", number: "Non-emergency", icon: <Radio className="w-5 h-5" />, color: "bg-blue-500" },
  ]

  const safetyTips = [
    "Always verify rider's name before starting the trip",
    "Trust your instincts - decline trips that feel unsafe",
    "Keep your doors locked until rider is verified",
    "Share your trip status with a trusted contact",
    "Report any safety concerns immediately",
    "Keep your vehicle well-maintained for safe driving",
  ]

  return (
    <div className="min-h-screen bg-slate-950">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-slate-900/95 backdrop-blur-sm border-b border-slate-800">
        <div className="flex items-center justify-between px-4 py-3">
          <Link href="/driver/app" className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors cursor-pointer">
            <ChevronLeft className="w-5 h-5" />
            <span className="text-sm">Back</span>
          </Link>
          <h1 className="text-lg font-semibold text-white">Safety Center</h1>
          <div className="w-10" />
        </div>
      </header>

      <main className="p-4 space-y-6 pb-24">
        {/* Emergency Banner */}
        <Card className="bg-red-950/50 border-red-900/50">
          <CardContent className="p-4">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-full bg-red-500/20 flex items-center justify-center flex-shrink-0">
                <Siren className="w-7 h-7 text-red-400" />
              </div>
              <div className="flex-1">
                <h2 className="text-white font-semibold mb-1">Emergency?</h2>
                <p className="text-sm text-slate-400 mb-2">If you are in immediate danger, call 911</p>
                <Button className="bg-red-600 hover:bg-red-700 text-white cursor-pointer">
                  <Phone className="w-4 h-4 mr-2" />
                  Call 911
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <div className="grid grid-cols-2 gap-3">
          <Card 
            className="bg-slate-800/50 border-slate-700 cursor-pointer hover:bg-slate-800 hover:border-slate-600 transition-all"
            onClick={() => setShowReportIncident(true)}
          >
            <CardContent className="p-4 flex flex-col items-center text-center">
              <div className="w-12 h-12 rounded-full bg-orange-500/20 flex items-center justify-center mb-3">
                <AlertTriangle className="w-6 h-6 text-orange-400" />
              </div>
              <h3 className="text-white font-medium">Report Incident</h3>
              <p className="text-xs text-slate-400 mt-1">File a safety report</p>
            </CardContent>
          </Card>
          <Card className="bg-slate-800/50 border-slate-700 cursor-pointer hover:bg-slate-800 hover:border-slate-600 transition-all">
            <CardContent className="p-4 flex flex-col items-center text-center">
              <div className="w-12 h-12 rounded-full bg-blue-500/20 flex items-center justify-center mb-3">
                <Share2 className="w-6 h-6 text-blue-400" />
              </div>
              <h3 className="text-white font-medium">Share Location</h3>
              <p className="text-xs text-slate-400 mt-1">With trusted contacts</p>
            </CardContent>
          </Card>
        </div>

        {/* Emergency Contacts */}
        <Card className="bg-slate-900/50 border-slate-800">
          <CardHeader className="pb-2">
            <CardTitle className="text-white text-base flex items-center gap-2">
              <Phone className="w-5 h-5 text-emerald-400" />
              Emergency Contacts
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {emergencyContacts.map((contact) => (
              <div
                key={contact.name}
                className="flex items-center justify-between p-4 bg-slate-800/50 rounded-xl cursor-pointer hover:bg-slate-800 transition-all"
              >
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-full ${contact.color}/20 flex items-center justify-center`}>
                    <div className={`${contact.color.replace('bg-', 'text-').replace('-500', '-400')}`}>
                      {contact.icon}
                    </div>
                  </div>
                  <div>
                    <p className="text-white font-medium">{contact.name}</p>
                    <p className="text-xs text-slate-400">{contact.number}</p>
                  </div>
                </div>
                <Button size="sm" variant="outline" className="border-slate-600 text-white hover:bg-slate-700 cursor-pointer">
                  <Phone className="w-4 h-4" />
                </Button>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Safety Features */}
        <Card className="bg-slate-900/50 border-slate-800">
          <CardHeader className="pb-2">
            <CardTitle className="text-white text-base flex items-center gap-2">
              <Shield className="w-5 h-5 text-emerald-400" />
              Safety Features
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {safetyFeatures.map((feature) => (
              <div
                key={feature.id}
                className="flex items-center justify-between p-4 bg-slate-800/50 rounded-xl cursor-pointer hover:bg-slate-800 transition-all"
              >
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                    feature.enabled ? "bg-emerald-500/20 text-emerald-400" : "bg-slate-600/20 text-slate-400"
                  }`}>
                    {feature.icon}
                  </div>
                  <div>
                    <p className="text-white font-medium">{feature.title}</p>
                    <p className="text-xs text-slate-400">{feature.description}</p>
                  </div>
                </div>
                <div className={`w-3 h-3 rounded-full ${feature.enabled ? "bg-emerald-500" : "bg-slate-600"}`} />
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Safety Tips */}
        <Card className="bg-slate-900/50 border-slate-800">
          <CardHeader className="pb-2">
            <CardTitle className="text-white text-base flex items-center gap-2">
              <Heart className="w-5 h-5 text-pink-400" />
              Safety Tips
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {safetyTips.map((tip, index) => (
              <div key={index} className="flex items-start gap-3 p-3 bg-slate-800/50 rounded-xl">
                <CheckCircle className="w-5 h-5 text-emerald-400 flex-shrink-0 mt-0.5" />
                <p className="text-sm text-slate-300">{tip}</p>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Driver Protection */}
        <Card className="bg-gradient-to-br from-emerald-900/30 to-slate-900 border-emerald-800/50">
          <CardContent className="p-6">
            <div className="flex items-start gap-4">
              <div className="w-14 h-14 rounded-full bg-emerald-500/20 flex items-center justify-center flex-shrink-0">
                <Shield className="w-7 h-7 text-emerald-400" />
              </div>
              <div>
                <h3 className="text-white font-semibold mb-2">Driver Protection Program</h3>
                <p className="text-sm text-slate-400 mb-4">
                  You are covered by GlideWay&apos;s comprehensive driver protection, including accident insurance, 
                  legal support, and 24/7 safety monitoring while on trips.
                </p>
                <div className="grid grid-cols-2 gap-3">
                  <div className="p-3 bg-slate-800/50 rounded-lg text-center">
                    <p className="text-lg font-bold text-emerald-400">$1M</p>
                    <p className="text-xs text-slate-400">Liability Coverage</p>
                  </div>
                  <div className="p-3 bg-slate-800/50 rounded-lg text-center">
                    <p className="text-lg font-bold text-emerald-400">24/7</p>
                    <p className="text-xs text-slate-400">Safety Support</p>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </main>

      {/* Report Incident Modal */}
      {showReportIncident && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="fixed inset-0 bg-black/80 z-50 flex items-end justify-center"
          onClick={() => setShowReportIncident(false)}
        >
          <motion.div
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            className="w-full max-w-lg bg-slate-900 rounded-t-2xl max-h-[80vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="sticky top-0 bg-slate-900 p-6 border-b border-slate-800">
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-bold text-white">Report Incident</h3>
                <button onClick={() => setShowReportIncident(false)} className="text-slate-400 hover:text-white cursor-pointer">
                  <X className="w-6 h-6" />
                </button>
              </div>
            </div>

            <div className="p-6 space-y-6">
              {/* Incident Type */}
              <div>
                <h4 className="text-sm text-slate-400 font-medium mb-3">What type of incident?</h4>
                <div className="grid grid-cols-2 gap-3">
                  {incidentTypes.map((type) => (
                    <button
                      key={type.id}
                      onClick={() => setIncidentType(type.id)}
                      className={`p-4 rounded-xl text-left transition-all cursor-pointer ${
                        incidentType === type.id
                          ? "bg-emerald-900/30 border border-emerald-800/50"
                          : "bg-slate-800/50 hover:bg-slate-800"
                      }`}
                    >
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center mb-2 ${
                        incidentType === type.id ? "bg-emerald-500/20 text-emerald-400" : "bg-slate-700 text-slate-400"
                      }`}>
                        {type.icon}
                      </div>
                      <p className="text-sm text-white">{type.label}</p>
                    </button>
                  ))}
                </div>
              </div>

              {/* Description */}
              <div>
                <h4 className="text-sm text-slate-400 font-medium mb-3">Describe what happened</h4>
                <Textarea
                  placeholder="Please provide as much detail as possible..."
                  value={incidentDescription}
                  onChange={(e) => setIncidentDescription(e.target.value)}
                  className="bg-slate-800 border-slate-700 text-white placeholder:text-slate-500 min-h-[120px]"
                />
              </div>

              {/* Add Evidence */}
              <div>
                <h4 className="text-sm text-slate-400 font-medium mb-3">Add evidence (optional)</h4>
                <div className="flex gap-3">
                  <button className="flex-1 p-4 bg-slate-800/50 rounded-xl text-center cursor-pointer hover:bg-slate-800 transition-all">
                    <Camera className="w-6 h-6 mx-auto text-slate-400 mb-2" />
                    <p className="text-xs text-slate-400">Take Photo</p>
                  </button>
                  <button className="flex-1 p-4 bg-slate-800/50 rounded-xl text-center cursor-pointer hover:bg-slate-800 transition-all">
                    <FileText className="w-6 h-6 mx-auto text-slate-400 mb-2" />
                    <p className="text-xs text-slate-400">Upload File</p>
                  </button>
                </div>
              </div>

              {/* Submit */}
              <Button
                className="w-full bg-emerald-600 hover:bg-emerald-700 text-white h-12 cursor-pointer"
                disabled={!incidentType}
              >
                Submit Report
              </Button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </div>
  )
}
