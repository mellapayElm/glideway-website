"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import Link from "next/link"
import { 
  ChevronLeft, FileText, Upload, Camera, CheckCircle, AlertTriangle,
  Clock, Calendar, Shield, Car, CreditCard, IdCard, Building,
  AlertCircle, Eye, Download, Trash2, RefreshCw, Plus, X
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

interface Document {
  id: string
  type: string
  name: string
  status: "verified" | "pending" | "expired" | "rejected" | "missing"
  expiryDate?: string
  uploadedDate?: string
  icon: React.ReactNode
  required: boolean
  description: string
}

export default function DriverDocumentsPage() {
  const [selectedDoc, setSelectedDoc] = useState<Document | null>(null)
  const [showUpload, setShowUpload] = useState(false)

  const documents: Document[] = [
    {
      id: "1",
      type: "drivers_license",
      name: "Driver's License",
      status: "verified",
      expiryDate: "Dec 15, 2025",
      uploadedDate: "Jan 10, 2024",
      icon: <IdCard className="w-5 h-5" />,
      required: true,
      description: "Valid driver's license with photo"
    },
    {
      id: "2",
      type: "vehicle_registration",
      name: "Vehicle Registration",
      status: "verified",
      expiryDate: "Mar 20, 2025",
      uploadedDate: "Jan 10, 2024",
      icon: <Car className="w-5 h-5" />,
      required: true,
      description: "Current vehicle registration document"
    },
    {
      id: "3",
      type: "insurance",
      name: "Auto Insurance",
      status: "expired",
      expiryDate: "Jan 1, 2024",
      uploadedDate: "Jan 10, 2023",
      icon: <Shield className="w-5 h-5" />,
      required: true,
      description: "Valid auto insurance policy"
    },
    {
      id: "4",
      type: "vehicle_inspection",
      name: "Vehicle Inspection",
      status: "pending",
      uploadedDate: "Jan 20, 2024",
      icon: <CheckCircle className="w-5 h-5" />,
      required: true,
      description: "Annual vehicle safety inspection"
    },
    {
      id: "5",
      type: "background_check",
      name: "Background Check",
      status: "verified",
      uploadedDate: "Jan 5, 2024",
      icon: <Shield className="w-5 h-5" />,
      required: true,
      description: "Criminal background verification"
    },
    {
      id: "6",
      type: "profile_photo",
      name: "Profile Photo",
      status: "verified",
      uploadedDate: "Jan 10, 2024",
      icon: <Camera className="w-5 h-5" />,
      required: true,
      description: "Clear photo of your face"
    },
    {
      id: "7",
      type: "vehicle_photos",
      name: "Vehicle Photos",
      status: "verified",
      uploadedDate: "Jan 10, 2024",
      icon: <Car className="w-5 h-5" />,
      required: true,
      description: "Photos of vehicle exterior and interior"
    },
    {
      id: "8",
      type: "bank_info",
      name: "Bank Account",
      status: "verified",
      uploadedDate: "Jan 10, 2024",
      icon: <Building className="w-5 h-5" />,
      required: true,
      description: "Bank account for payouts"
    },
    {
      id: "9",
      type: "w9",
      name: "W-9 Tax Form",
      status: "missing",
      icon: <FileText className="w-5 h-5" />,
      required: false,
      description: "Tax identification form (optional)"
    },
  ]

  const getStatusColor = (status: Document["status"]) => {
    switch (status) {
      case "verified": return "bg-emerald-500/20 text-emerald-400 border-emerald-500/30"
      case "pending": return "bg-yellow-500/20 text-yellow-400 border-yellow-500/30"
      case "expired": return "bg-red-500/20 text-red-400 border-red-500/30"
      case "rejected": return "bg-red-500/20 text-red-400 border-red-500/30"
      case "missing": return "bg-slate-500/20 text-slate-400 border-slate-500/30"
    }
  }

  const getStatusIcon = (status: Document["status"]) => {
    switch (status) {
      case "verified": return <CheckCircle className="w-4 h-4" />
      case "pending": return <Clock className="w-4 h-4" />
      case "expired": return <AlertTriangle className="w-4 h-4" />
      case "rejected": return <AlertCircle className="w-4 h-4" />
      case "missing": return <Plus className="w-4 h-4" />
    }
  }

  const verifiedCount = documents.filter(d => d.status === "verified").length
  const totalRequired = documents.filter(d => d.required).length
  const expiredCount = documents.filter(d => d.status === "expired").length

  return (
    <div className="min-h-screen bg-slate-950">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-slate-900/95 backdrop-blur-sm border-b border-slate-800">
        <div className="flex items-center justify-between px-4 py-3">
          <Link href="/driver/app" className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors cursor-pointer">
            <ChevronLeft className="w-5 h-5" />
            <span className="text-sm">Back</span>
          </Link>
          <h1 className="text-lg font-semibold text-white">Documents</h1>
          <div className="w-10" />
        </div>
      </header>

      <main className="p-4 space-y-6 pb-24">
        {/* Status Overview */}
        <Card className="bg-gradient-to-br from-slate-800 to-slate-900 border-slate-700">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-xl font-bold text-white">Document Status</h2>
                <p className="text-sm text-slate-400">Keep your documents up to date</p>
              </div>
              <div className="w-16 h-16 rounded-full bg-emerald-500/20 flex items-center justify-center">
                <span className="text-2xl font-bold text-emerald-400">{Math.round((verifiedCount / totalRequired) * 100)}%</span>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-3">
              <div className="text-center p-3 bg-emerald-500/10 rounded-xl border border-emerald-500/20">
                <CheckCircle className="w-5 h-5 mx-auto text-emerald-400 mb-1" />
                <div className="text-lg font-bold text-white">{verifiedCount}</div>
                <div className="text-xs text-slate-400">Verified</div>
              </div>
              <div className="text-center p-3 bg-yellow-500/10 rounded-xl border border-yellow-500/20">
                <Clock className="w-5 h-5 mx-auto text-yellow-400 mb-1" />
                <div className="text-lg font-bold text-white">{documents.filter(d => d.status === "pending").length}</div>
                <div className="text-xs text-slate-400">Pending</div>
              </div>
              <div className="text-center p-3 bg-red-500/10 rounded-xl border border-red-500/20">
                <AlertTriangle className="w-5 h-5 mx-auto text-red-400 mb-1" />
                <div className="text-lg font-bold text-white">{expiredCount}</div>
                <div className="text-xs text-slate-400">Action Needed</div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Expired/Action Required */}
        {expiredCount > 0 && (
          <Card className="bg-red-950/30 border-red-900/50">
            <CardHeader className="pb-2">
              <CardTitle className="text-red-400 text-base flex items-center gap-2">
                <AlertTriangle className="w-5 h-5" />
                Action Required
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {documents.filter(d => d.status === "expired" || d.status === "rejected").map((doc) => (
                <motion.div
                  key={doc.id}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="flex items-center justify-between p-3 bg-red-900/20 rounded-xl border border-red-900/30 cursor-pointer hover:bg-red-900/30 transition-all"
                  onClick={() => setSelectedDoc(doc)}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-red-500/20 flex items-center justify-center text-red-400">
                      {doc.icon}
                    </div>
                    <div>
                      <p className="text-white font-medium">{doc.name}</p>
                      <p className="text-xs text-red-400">Expired {doc.expiryDate}</p>
                    </div>
                  </div>
                  <Button size="sm" className="bg-red-600 hover:bg-red-700 text-white cursor-pointer">
                    <Upload className="w-4 h-4 mr-1" />
                    Update
                  </Button>
                </motion.div>
              ))}
            </CardContent>
          </Card>
        )}

        {/* All Documents */}
        <Card className="bg-slate-900/50 border-slate-800">
          <CardHeader className="pb-2">
            <CardTitle className="text-white text-base flex items-center gap-2">
              <FileText className="w-5 h-5 text-blue-400" />
              All Documents
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {documents.map((doc) => (
              <motion.div
                key={doc.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex items-center justify-between p-4 bg-slate-800/50 rounded-xl cursor-pointer hover:bg-slate-800 transition-all"
                onClick={() => setSelectedDoc(doc)}
              >
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                    doc.status === "verified" ? "bg-emerald-500/20 text-emerald-400" :
                    doc.status === "pending" ? "bg-yellow-500/20 text-yellow-400" :
                    doc.status === "expired" ? "bg-red-500/20 text-red-400" :
                    "bg-slate-500/20 text-slate-400"
                  }`}>
                    {doc.icon}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <p className="text-white font-medium">{doc.name}</p>
                      {doc.required && (
                        <span className="text-[10px] bg-blue-500/20 text-blue-400 px-1.5 py-0.5 rounded">Required</span>
                      )}
                    </div>
                    <p className="text-xs text-slate-400">{doc.description}</p>
                    {doc.expiryDate && (
                      <p className="text-xs text-slate-500 mt-0.5">Expires: {doc.expiryDate}</p>
                    )}
                  </div>
                </div>
                <div className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border ${getStatusColor(doc.status)}`}>
                  {getStatusIcon(doc.status)}
                  <span className="capitalize">{doc.status}</span>
                </div>
              </motion.div>
            ))}
          </CardContent>
        </Card>

        {/* Upload Tips */}
        <Card className="bg-slate-900/50 border-slate-800">
          <CardHeader className="pb-2">
            <CardTitle className="text-white text-base flex items-center gap-2">
              <Camera className="w-5 h-5 text-purple-400" />
              Upload Tips
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-start gap-3 p-3 bg-slate-800/50 rounded-xl">
              <CheckCircle className="w-5 h-5 text-emerald-400 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-white text-sm font-medium">Good lighting</p>
                <p className="text-xs text-slate-400">Ensure documents are well-lit and readable</p>
              </div>
            </div>
            <div className="flex items-start gap-3 p-3 bg-slate-800/50 rounded-xl">
              <CheckCircle className="w-5 h-5 text-emerald-400 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-white text-sm font-medium">Full document visible</p>
                <p className="text-xs text-slate-400">All corners and text must be clearly visible</p>
              </div>
            </div>
            <div className="flex items-start gap-3 p-3 bg-slate-800/50 rounded-xl">
              <CheckCircle className="w-5 h-5 text-emerald-400 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-white text-sm font-medium">No blur or glare</p>
                <p className="text-xs text-slate-400">Hold camera steady and avoid reflections</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </main>

      {/* Document Detail Modal */}
      {selectedDoc && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="fixed inset-0 bg-black/80 z-50 flex items-end justify-center"
          onClick={() => setSelectedDoc(null)}
        >
          <motion.div
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            className="w-full max-w-lg bg-slate-900 rounded-t-2xl p-6"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-white">{selectedDoc.name}</h3>
              <button onClick={() => setSelectedDoc(null)} className="text-slate-400 hover:text-white cursor-pointer">
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className={`flex items-center gap-2 px-3 py-2 rounded-lg mb-4 ${getStatusColor(selectedDoc.status)}`}>
              {getStatusIcon(selectedDoc.status)}
              <span className="capitalize font-medium">Status: {selectedDoc.status}</span>
            </div>

            <div className="space-y-4 mb-6">
              <div className="flex justify-between text-sm">
                <span className="text-slate-400">Uploaded</span>
                <span className="text-white">{selectedDoc.uploadedDate || "Not uploaded"}</span>
              </div>
              {selectedDoc.expiryDate && (
                <div className="flex justify-between text-sm">
                  <span className="text-slate-400">Expires</span>
                  <span className="text-white">{selectedDoc.expiryDate}</span>
                </div>
              )}
              <div className="flex justify-between text-sm">
                <span className="text-slate-400">Required</span>
                <span className="text-white">{selectedDoc.required ? "Yes" : "No"}</span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              {selectedDoc.status === "verified" && (
                <Button variant="outline" className="border-slate-700 text-white hover:bg-slate-800 cursor-pointer">
                  <Eye className="w-4 h-4 mr-2" />
                  View
                </Button>
              )}
              <Button className="bg-emerald-600 hover:bg-emerald-700 text-white cursor-pointer col-span-full">
                <Upload className="w-4 h-4 mr-2" />
                {selectedDoc.status === "missing" ? "Upload Document" : "Update Document"}
              </Button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </div>
  )
}
