"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { motion } from "framer-motion"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  CheckCircle2,
  Clock,
  FileText,
  Car,
  Shield,
  User,
  Mail,
  Phone,
  AlertCircle,
  ChevronRight,
  Search,
  HelpCircle,
  MessageCircle,
  ArrowLeft,
  Loader2,
  Calendar,
  Building2,
  BadgeCheck,
  XCircle
} from "lucide-react"

type ApplicationStatus = "pending" | "reviewing" | "background_check" | "approved" | "rejected" | null

interface StatusStep {
  id: string
  title: string
  description: string
  icon: React.ReactNode
  status: "completed" | "current" | "upcoming"
  date?: string
}

export default function DriverStatusPage() {
  const [email, setEmail] = useState("")
  const [phone, setPhone] = useState("")
  const [isSearching, setIsSearching] = useState(false)
  const [applicationStatus, setApplicationStatus] = useState<ApplicationStatus>(null)
  const [hasSearched, setHasSearched] = useState(false)
  const [applicationData, setApplicationData] = useState<{
    name: string
    email: string
    submittedDate: string
    estimatedCompletion: string
    applicationId: string
  } | null>(null)

  const handleSearch = async () => {
    if (!email && !phone) return
    
    setIsSearching(true)
    
    // Simulate API call - in production this would check the database
    await new Promise(resolve => setTimeout(resolve, 1500))
    
    // For demo purposes, show a pending status
    // In production, this would fetch real data from the database
    setApplicationStatus("reviewing")
    setApplicationData({
      name: "Driver Applicant",
      email: email || "applicant@email.com",
      submittedDate: new Date().toLocaleDateString("en-US", { 
        year: "numeric", 
        month: "long", 
        day: "numeric" 
      }),
      estimatedCompletion: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toLocaleDateString("en-US", {
        year: "numeric",
        month: "long", 
        day: "numeric"
      }),
      applicationId: `GW-${Date.now().toString().slice(-8)}`
    })
    setHasSearched(true)
    setIsSearching(false)
  }

  const getStatusSteps = (): StatusStep[] => {
    const baseSteps: StatusStep[] = [
      {
        id: "submitted",
        title: "Application Submitted",
        description: "Your application has been received",
        icon: <FileText className="w-5 h-5" />,
        status: "completed",
        date: applicationData?.submittedDate
      },
      {
        id: "review",
        title: "Document Review",
        description: "Our team is reviewing your documents",
        icon: <User className="w-5 h-5" />,
        status: applicationStatus === "pending" ? "upcoming" : 
               applicationStatus === "reviewing" ? "current" : "completed"
      },
      {
        id: "background",
        title: "Background Check",
        description: "Criminal history and driving record verification",
        icon: <Shield className="w-5 h-5" />,
        status: applicationStatus === "background_check" ? "current" :
               applicationStatus === "approved" || applicationStatus === "rejected" ? "completed" : "upcoming"
      },
      {
        id: "vehicle",
        title: "Vehicle Verification",
        description: "Insurance and vehicle documents check",
        icon: <Car className="w-5 h-5" />,
        status: applicationStatus === "approved" || applicationStatus === "rejected" ? "completed" : "upcoming"
      },
      {
        id: "approved",
        title: "Final Approval",
        description: "Account activation and onboarding",
        icon: <BadgeCheck className="w-5 h-5" />,
        status: applicationStatus === "approved" ? "completed" : "upcoming"
      }
    ]
    return baseSteps
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-green-50 to-white py-12 px-4">
      {/* Header */}
      <div className="max-w-2xl mx-auto mb-8">
        <Link href="/" className="inline-flex items-center gap-2 text-gray-600 hover:text-green-600 transition-colors mb-6">
          <ArrowLeft className="w-4 h-4" />
          Back to GlideWay
        </Link>
        
        <div className="text-center">
          <div className="inline-flex items-center gap-2 mb-4">
            <div className="w-12 h-12 bg-green-500 rounded-xl flex items-center justify-center">
              <span className="text-white font-bold text-xl">G</span>
            </div>
            <span className="text-2xl font-bold text-gray-900">GlideWay Driver</span>
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Application Status</h1>
          <p className="text-gray-600">Track the progress of your driver application</p>
        </div>
      </div>

      {/* Search Form */}
      {!hasSearched && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-md mx-auto mb-8"
        >
          <Card className="bg-white border-green-200 shadow-lg">
            <CardContent className="p-6">
              <div className="text-center mb-6">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Search className="w-8 h-8 text-green-600" />
                </div>
                <h2 className="text-xl font-semibold text-gray-900 mb-2">Find Your Application</h2>
                <p className="text-sm text-gray-600">Enter your email or phone number used during registration</p>
              </div>

              <div className="space-y-4">
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-green-600" />
                  <Input
                    type="email"
                    placeholder="Email Address"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="pl-10 bg-white border-green-300 text-gray-900 placeholder:text-gray-500 focus:border-green-500 focus:ring-green-500"
                  />
                </div>

                <div className="flex items-center gap-3">
                  <div className="flex-1 h-px bg-gray-200" />
                  <span className="text-sm text-gray-500">or</span>
                  <div className="flex-1 h-px bg-gray-200" />
                </div>

                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-green-600" />
                  <Input
                    type="tel"
                    placeholder="Phone Number"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="pl-10 bg-white border-green-300 text-gray-900 placeholder:text-gray-500 focus:border-green-500 focus:ring-green-500"
                  />
                </div>

                <Button
                  onClick={handleSearch}
                  disabled={(!email && !phone) || isSearching}
                  className="w-full bg-green-500 hover:bg-green-600 text-white"
                >
                  {isSearching ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin mr-2" />
                      Searching...
                    </>
                  ) : (
                    <>
                      Check Status
                      <ChevronRight className="w-4 h-4 ml-1" />
                    </>
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      )}

      {/* Status Display */}
      {hasSearched && applicationData && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-2xl mx-auto space-y-6"
        >
          {/* Application Info Card */}
          <Card className="bg-white border-green-200 shadow-lg">
            <CardContent className="p-6">
              <div className="flex items-start justify-between mb-6">
                <div>
                  <p className="text-sm text-gray-500 mb-1">Application ID</p>
                  <p className="text-lg font-mono font-semibold text-gray-900">{applicationData.applicationId}</p>
                </div>
                <div className={`px-3 py-1.5 rounded-full text-sm font-medium ${
                  applicationStatus === "approved" ? "bg-green-100 text-green-700" :
                  applicationStatus === "rejected" ? "bg-red-100 text-red-700" :
                  "bg-yellow-100 text-yellow-700"
                }`}>
                  {applicationStatus === "approved" ? "Approved" :
                   applicationStatus === "rejected" ? "Rejected" :
                   applicationStatus === "background_check" ? "Background Check" :
                   applicationStatus === "reviewing" ? "Under Review" :
                   "Pending"}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 p-4 bg-green-50 rounded-lg border border-green-200">
                <div>
                  <p className="text-xs text-gray-500 mb-1">Submitted On</p>
                  <p className="text-sm font-medium text-gray-900 flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5 text-green-600" />
                    {applicationData.submittedDate}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-gray-500 mb-1">Estimated Completion</p>
                  <p className="text-sm font-medium text-gray-900 flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5 text-green-600" />
                    {applicationData.estimatedCompletion}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Progress Steps */}
          <Card className="bg-white border-green-200 shadow-lg">
            <CardContent className="p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-6">Application Progress</h3>
              
              <div className="space-y-4">
                {getStatusSteps().map((step, index) => (
                  <div key={step.id} className="flex gap-4">
                    <div className="flex flex-col items-center">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                        step.status === "completed" ? "bg-green-500 text-white" :
                        step.status === "current" ? "bg-green-100 text-green-600 ring-2 ring-green-500 ring-offset-2" :
                        "bg-gray-100 text-gray-400"
                      }`}>
                        {step.status === "completed" ? (
                          <CheckCircle2 className="w-5 h-5" />
                        ) : (
                          step.icon
                        )}
                      </div>
                      {index < getStatusSteps().length - 1 && (
                        <div className={`w-0.5 h-12 ${
                          step.status === "completed" ? "bg-green-500" : "bg-gray-200"
                        }`} />
                      )}
                    </div>
                    <div className="flex-1 pb-8">
                      <div className="flex items-center gap-2">
                        <h4 className={`font-medium ${
                          step.status === "upcoming" ? "text-gray-400" : "text-gray-900"
                        }`}>
                          {step.title}
                        </h4>
                        {step.status === "current" && (
                          <span className="px-2 py-0.5 bg-green-100 text-green-700 text-xs font-medium rounded-full">
                            In Progress
                          </span>
                        )}
                      </div>
                      <p className={`text-sm ${
                        step.status === "upcoming" ? "text-gray-400" : "text-gray-600"
                      }`}>
                        {step.description}
                      </p>
                      {step.date && (
                        <p className="text-xs text-green-600 mt-1">{step.date}</p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Important Information */}
          <Card className="bg-white border-green-200 shadow-lg">
            <CardContent className="p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Important Information</h3>
              
              <div className="space-y-4">
                <div className="flex gap-3 p-4 bg-blue-50 rounded-lg border border-blue-200">
                  <AlertCircle className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium text-blue-900">Background Check in Progress</p>
                    <p className="text-sm text-blue-700 mt-1">
                      Background checks typically take 2-5 business days. You will receive an email notification once completed.
                    </p>
                  </div>
                </div>

                <div className="flex gap-3 p-4 bg-green-50 rounded-lg border border-green-200">
                  <CheckCircle2 className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium text-green-900">What happens next?</p>
                    <ul className="text-sm text-green-700 mt-1 space-y-1">
                      <li>1. Our team will review your submitted documents</li>
                      <li>2. Background check will be initiated with our partner</li>
                      <li>3. Once approved, you will receive activation instructions</li>
                      <li>4. Complete a brief online orientation to start driving</li>
                    </ul>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Help & Support */}
          <Card className="bg-white border-green-200 shadow-lg">
            <CardContent className="p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Need Help?</h3>
              
              <div className="grid md:grid-cols-3 gap-4">
                <a href="mailto:driver-support@glidewayride.com" className="flex flex-col items-center p-4 bg-green-50 rounded-lg border border-green-200 hover:bg-green-100 transition-colors">
                  <Mail className="w-6 h-6 text-green-600 mb-2" />
                  <p className="text-sm font-medium text-gray-900">Email Support</p>
                  <p className="text-xs text-gray-600">driver-support@glidewayride.com</p>
                </a>

                <a href="tel:+18005551234" className="flex flex-col items-center p-4 bg-green-50 rounded-lg border border-green-200 hover:bg-green-100 transition-colors">
                  <Phone className="w-6 h-6 text-green-600 mb-2" />
                  <p className="text-sm font-medium text-gray-900">Phone Support</p>
                  <p className="text-xs text-gray-600">1-800-555-1234</p>
                </a>

                <Link href="/help" className="flex flex-col items-center p-4 bg-green-50 rounded-lg border border-green-200 hover:bg-green-100 transition-colors">
                  <HelpCircle className="w-6 h-6 text-green-600 mb-2" />
                  <p className="text-sm font-medium text-gray-900">Help Center</p>
                  <p className="text-xs text-gray-600">FAQs & Resources</p>
                </Link>
              </div>
            </CardContent>
          </Card>

          {/* Action Buttons */}
          <div className="flex gap-4">
            <Button
              variant="outline"
              onClick={() => {
                setHasSearched(false)
                setEmail("")
                setPhone("")
              }}
              className="flex-1 border-green-300 text-gray-700 hover:bg-green-50"
            >
              Search Another Application
            </Button>
            <Link href="/" className="flex-1">
              <Button className="w-full bg-green-500 hover:bg-green-600 text-white">
                Back to Home
              </Button>
            </Link>
          </div>
        </motion.div>
      )}

      {/* Footer */}
      <div className="text-center mt-12">
        <p className="text-sm text-gray-500">
          Questions? Contact us at{" "}
          <a href="mailto:support@glidewayride.com" className="text-green-600 hover:underline">
            support@glidewayride.com
          </a>
        </p>
      </div>
    </div>
  )
}
