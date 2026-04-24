"use client"

import { useState } from "react"
import { ChevronLeft, ChevronRight, Check, Upload, Camera, DollarSign, Clock, Shield, Zap, Users, Star, Car } from "lucide-react"
import { GlidewayLogo } from "@/components/glideway-logo"

const DRIVER_BENEFITS = [
  { icon: DollarSign, title: "Earn More", description: "Competitive rates with weekly payouts" },
  { icon: Clock, title: "Flexible Hours", description: "Drive when you want, as much as you want" },
  { icon: Shield, title: "Full Insurance", description: "Comprehensive coverage while you drive" },
  { icon: Zap, title: "Instant Pay", description: "Cash out your earnings anytime" },
]

const DRIVER_STANDARDS = [
  { title: "Professional Appearance", description: "Maintain clean, well-groomed appearance and wear a GlideWay lanyard at all times while on duty." },
  { title: "Vehicle Standards", description: "Vehicles must be 2015 or newer, fully insured, and pass our 50-point safety inspection every six months." },
  { title: "Rider-First Service", description: "Greet every rider, assist with luggage, offer bottled water on Comfort & Premium tiers, and maintain a 4.7+ rating." },
  { title: "Zero-Tolerance Policy", description: "Discrimination, distracted driving, and any form of harassment result in immediate account suspension." },
]

const ONBOARDING_STEPS = [
  { step: 1, title: "Click Become a Driver", description: "Start your application", status: "complete" },
  { step: 2, title: "Enter Personal Info", description: "Name, DOB, SSN, contact details", status: "current" },
  { step: 3, title: "Verify Phone & Email", description: "OTP confirmation to both", status: "pending" },
  { step: 4, title: "Upload Driver License", description: "Front and back scan required", status: "pending" },
  { step: 5, title: "Upload Insurance", description: "Current vehicle insurance proof", status: "pending" },
  { step: 6, title: "Enter Vehicle Details", description: "Make, model, year, VIN, plate", status: "pending" },
  { step: 7, title: "Add Payout Account", description: "Bank details for direct deposit", status: "pending" },
  { step: 8, title: "Background Check Consent", description: "Authorize screening authorization", status: "pending" },
  { step: 9, title: "Submit Application", description: "Final review and submission", status: "pending" },
  { step: 10, title: "Admin Reviews Documents", description: "Compliance team verifies all docs", status: "pending" },
  { step: 11, title: "Driver Approved & Activated", description: "Ready to accept rides and earn", status: "pending" },
]

interface BecomeDriverScreenProps {
  onBack?: () => void
  onComplete?: () => void
}

export function BecomeDriverScreen({ onBack, onComplete }: BecomeDriverScreenProps) {
  const [currentStep, setCurrentStep] = useState(0) // 0 = overview, 1-11 = actual steps
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    dob: "",
    ssn: "",
    address: "",
    city: "",
    state: "",
    zip: "",
    vehicleMake: "",
    vehicleModel: "",
    vehicleYear: "",
    vehicleColor: "",
    vehiclePlate: "",
    vehicleVin: "",
    bankName: "",
    accountNumber: "",
    routingNumber: "",
    licenseUploaded: false,
    insuranceUploaded: false,
    backgroundConsent: false,
  })
  const [phoneVerified, setPhoneVerified] = useState(false)
  const [emailVerified, setEmailVerified] = useState(false)
  const [otp, setOtp] = useState("")

  const handleInputChange = (field: string, value: string | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const renderOverview = () => (
    <div className="flex-1 overflow-y-auto">
      {/* Hero Section */}
      <div className="px-6 py-8 text-center border-b border-gray-800">
        <h1 className="text-2xl font-bold text-white mb-2">Become a GlideWay Driver</h1>
        <p className="text-gray-400 text-sm">Join our network of professional drivers. Earn on your schedule, protected by GlideWay.</p>
      </div>

      {/* Benefits Grid */}
      <div className="p-4 grid grid-cols-2 gap-3">
        {DRIVER_BENEFITS.map((benefit, i) => (
          <div key={i} className="bg-gray-800/50 border border-gray-700 rounded-xl p-4">
            <div className="w-10 h-10 bg-lime-400/20 rounded-lg flex items-center justify-center mb-3">
              <benefit.icon className="w-5 h-5 text-lime-400" />
            </div>
            <h3 className="text-white font-semibold text-sm mb-1">{benefit.title}</h3>
            <p className="text-gray-400 text-xs">{benefit.description}</p>
          </div>
        ))}
      </div>

      {/* Service Standards */}
      <div className="px-4 py-4">
        <h2 className="text-lg font-bold text-white mb-3">Driver Service Standards</h2>
        <div className="space-y-3">
          {DRIVER_STANDARDS.map((standard, i) => (
            <div key={i} className="flex gap-3 bg-gray-800/30 border border-gray-800 rounded-lg p-3">
              <div className="w-6 h-6 bg-lime-400/20 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                <Check className="w-3 h-3 text-lime-400" />
              </div>
              <div>
                <h4 className="text-white font-medium text-sm">{standard.title}</h4>
                <p className="text-gray-400 text-xs mt-0.5">{standard.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Stats */}
      <div className="px-4 py-4 grid grid-cols-3 gap-2">
        <div className="bg-lime-400/10 border border-lime-400/30 rounded-xl p-3 text-center">
          <Users className="w-5 h-5 text-lime-400 mx-auto mb-1" />
          <p className="text-white font-bold">10K+</p>
          <p className="text-gray-400 text-xs">Active Drivers</p>
        </div>
        <div className="bg-lime-400/10 border border-lime-400/30 rounded-xl p-3 text-center">
          <DollarSign className="w-5 h-5 text-lime-400 mx-auto mb-1" />
          <p className="text-white font-bold">$25/hr</p>
          <p className="text-gray-400 text-xs">Avg. Earnings</p>
        </div>
        <div className="bg-lime-400/10 border border-lime-400/30 rounded-xl p-3 text-center">
          <Star className="w-5 h-5 text-lime-400 mx-auto mb-1" />
          <p className="text-white font-bold">4.8</p>
          <p className="text-gray-400 text-xs">Driver Rating</p>
        </div>
      </div>

      {/* Onboarding Steps Preview */}
      <div className="px-4 py-4">
        <h2 className="text-lg font-bold text-white mb-3">Driver Onboarding - 11 Steps</h2>
        <p className="text-gray-400 text-xs mb-4">Tap the button below to start your application.</p>
        <div className="space-y-2 max-h-64 overflow-y-auto">
          {ONBOARDING_STEPS.map((step, i) => (
            <div key={i} className="flex items-center gap-3 py-2">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 ${
                i === 0 ? "bg-lime-400 text-gray-900" : "bg-gray-700 text-gray-400"
              }`}>
                {i === 0 ? <Check className="w-4 h-4" /> : `S${step.step}`}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-white text-sm font-medium truncate">{step.title}</p>
                <p className="text-gray-500 text-xs truncate">{step.description}</p>
              </div>
              {i === 10 && (
                <span className="bg-lime-400 text-gray-900 text-xs font-bold px-2 py-0.5 rounded">Final</span>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* CTA */}
      <div className="px-4 py-4 border-t border-gray-800">
        <button
          onClick={() => setCurrentStep(2)}
          className="w-full bg-lime-400 hover:bg-lime-500 text-gray-950 font-bold py-4 rounded-lg transition-colors flex items-center justify-center gap-2"
        >
          <Car className="w-5 h-5" />
          Become a Driver - Start Now
          <ChevronRight className="w-5 h-5" />
        </button>
        <p className="text-gray-500 text-xs text-center mt-3">Takes about 10 minutes. Admin approval within 24-48 hours.</p>
      </div>
    </div>
  )

  const renderStep2 = () => (
    <div className="flex-1 overflow-y-auto px-4 py-6">
      <div className="mb-6">
        <div className="flex items-center gap-2 text-lime-400 text-sm mb-2">
          <span className="w-6 h-6 bg-lime-400 text-gray-900 rounded-full flex items-center justify-center text-xs font-bold">2</span>
          Step 2 of 11
        </div>
        <h1 className="text-2xl font-bold text-white">Personal Information</h1>
        <p className="text-gray-400 text-sm mt-1">Enter your legal name and contact details</p>
      </div>

      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-sm text-gray-400 mb-1">First Name</label>
            <input
              type="text"
              value={formData.firstName}
              onChange={(e) => handleInputChange("firstName", e.target.value)}
              className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-3 text-white focus:outline-none focus:border-lime-400"
              placeholder="John"
            />
          </div>
          <div>
            <label className="block text-sm text-gray-400 mb-1">Last Name</label>
            <input
              type="text"
              value={formData.lastName}
              onChange={(e) => handleInputChange("lastName", e.target.value)}
              className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-3 text-white focus:outline-none focus:border-lime-400"
              placeholder="Doe"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm text-gray-400 mb-1">Email Address</label>
          <input
            type="email"
            value={formData.email}
            onChange={(e) => handleInputChange("email", e.target.value)}
            className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-3 text-white focus:outline-none focus:border-lime-400"
            placeholder="john@example.com"
          />
        </div>

        <div>
          <label className="block text-sm text-gray-400 mb-1">Phone Number</label>
          <input
            type="tel"
            value={formData.phone}
            onChange={(e) => handleInputChange("phone", e.target.value)}
            className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-3 text-white focus:outline-none focus:border-lime-400"
            placeholder="+1 (555) 123-4567"
          />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-sm text-gray-400 mb-1">Date of Birth</label>
            <input
              type="date"
              value={formData.dob}
              onChange={(e) => handleInputChange("dob", e.target.value)}
              className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-3 text-white focus:outline-none focus:border-lime-400"
            />
          </div>
          <div>
            <label className="block text-sm text-gray-400 mb-1">SSN (Last 4)</label>
            <input
              type="password"
              value={formData.ssn}
              onChange={(e) => handleInputChange("ssn", e.target.value.slice(0, 4))}
              className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-3 text-white focus:outline-none focus:border-lime-400"
              placeholder="****"
              maxLength={4}
            />
          </div>
        </div>

        <div>
          <label className="block text-sm text-gray-400 mb-1">Street Address</label>
          <input
            type="text"
            value={formData.address}
            onChange={(e) => handleInputChange("address", e.target.value)}
            className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-3 text-white focus:outline-none focus:border-lime-400"
            placeholder="123 Main St"
          />
        </div>

        <div className="grid grid-cols-3 gap-3">
          <div>
            <label className="block text-sm text-gray-400 mb-1">City</label>
            <input
              type="text"
              value={formData.city}
              onChange={(e) => handleInputChange("city", e.target.value)}
              className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-3 text-white focus:outline-none focus:border-lime-400"
            />
          </div>
          <div>
            <label className="block text-sm text-gray-400 mb-1">State</label>
            <input
              type="text"
              value={formData.state}
              onChange={(e) => handleInputChange("state", e.target.value)}
              className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-3 text-white focus:outline-none focus:border-lime-400"
            />
          </div>
          <div>
            <label className="block text-sm text-gray-400 mb-1">ZIP</label>
            <input
              type="text"
              value={formData.zip}
              onChange={(e) => handleInputChange("zip", e.target.value)}
              className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-3 text-white focus:outline-none focus:border-lime-400"
            />
          </div>
        </div>
      </div>
    </div>
  )

  const renderStep3 = () => (
    <div className="flex-1 overflow-y-auto px-4 py-6">
      <div className="mb-6">
        <div className="flex items-center gap-2 text-lime-400 text-sm mb-2">
          <span className="w-6 h-6 bg-lime-400 text-gray-900 rounded-full flex items-center justify-center text-xs font-bold">3</span>
          Step 3 of 11
        </div>
        <h1 className="text-2xl font-bold text-white">Verify Phone & Email</h1>
        <p className="text-gray-400 text-sm mt-1">We sent verification codes to your phone and email</p>
      </div>

      <div className="space-y-6">
        {/* Phone Verification */}
        <div className="bg-gray-800/50 border border-gray-700 rounded-xl p-4">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-white font-medium">Phone Verification</h3>
            {phoneVerified && <span className="bg-lime-400/20 text-lime-400 text-xs px-2 py-1 rounded-full flex items-center gap-1"><Check className="w-3 h-3" /> Verified</span>}
          </div>
          <p className="text-gray-400 text-sm mb-3">Code sent to {formData.phone || "+1 (555) ***-**67"}</p>
          {!phoneVerified ? (
            <div className="flex gap-2">
              <input
                type="text"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                className="flex-1 bg-gray-900 border border-gray-600 rounded-lg px-3 py-2 text-white text-center tracking-widest"
                placeholder="000000"
                maxLength={6}
              />
              <button
                onClick={() => setPhoneVerified(true)}
                className="bg-lime-400 hover:bg-lime-500 text-gray-900 font-bold px-4 py-2 rounded-lg"
              >
                Verify
              </button>
            </div>
          ) : null}
        </div>

        {/* Email Verification */}
        <div className="bg-gray-800/50 border border-gray-700 rounded-xl p-4">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-white font-medium">Email Verification</h3>
            {emailVerified && <span className="bg-lime-400/20 text-lime-400 text-xs px-2 py-1 rounded-full flex items-center gap-1"><Check className="w-3 h-3" /> Verified</span>}
          </div>
          <p className="text-gray-400 text-sm mb-3">Code sent to {formData.email || "j***@example.com"}</p>
          {!emailVerified ? (
            <div className="flex gap-2">
              <input
                type="text"
                className="flex-1 bg-gray-900 border border-gray-600 rounded-lg px-3 py-2 text-white text-center tracking-widest"
                placeholder="000000"
                maxLength={6}
              />
              <button
                onClick={() => setEmailVerified(true)}
                className="bg-lime-400 hover:bg-lime-500 text-gray-900 font-bold px-4 py-2 rounded-lg"
              >
                Verify
              </button>
            </div>
          ) : null}
        </div>

        <button className="text-lime-400 text-sm hover:text-lime-300">Resend verification codes</button>
      </div>
    </div>
  )

  const renderStep4 = () => (
    <div className="flex-1 overflow-y-auto px-4 py-6">
      <div className="mb-6">
        <div className="flex items-center gap-2 text-lime-400 text-sm mb-2">
          <span className="w-6 h-6 bg-lime-400 text-gray-900 rounded-full flex items-center justify-center text-xs font-bold">4</span>
          Step 4 of 11
        </div>
        <h1 className="text-2xl font-bold text-white">Upload Driver License</h1>
        <p className="text-gray-400 text-sm mt-1">Front and back scan required</p>
      </div>

      <div className="space-y-4">
        {/* Front of License */}
        <div className="border-2 border-dashed border-gray-700 rounded-xl p-6 text-center hover:border-lime-400/50 transition-colors cursor-pointer">
          <div className="w-16 h-16 bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-3">
            <Camera className="w-8 h-8 text-gray-500" />
          </div>
          <h3 className="text-white font-medium mb-1">Front of License</h3>
          <p className="text-gray-400 text-sm">Tap to take a photo or upload</p>
          <button 
            onClick={() => handleInputChange("licenseUploaded", true)}
            className="mt-4 bg-lime-400/20 text-lime-400 px-4 py-2 rounded-lg text-sm font-medium"
          >
            <Upload className="w-4 h-4 inline mr-2" />
            Upload File
          </button>
        </div>

        {/* Back of License */}
        <div className="border-2 border-dashed border-gray-700 rounded-xl p-6 text-center hover:border-lime-400/50 transition-colors cursor-pointer">
          <div className="w-16 h-16 bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-3">
            <Camera className="w-8 h-8 text-gray-500" />
          </div>
          <h3 className="text-white font-medium mb-1">Back of License</h3>
          <p className="text-gray-400 text-sm">Tap to take a photo or upload</p>
          <button className="mt-4 bg-lime-400/20 text-lime-400 px-4 py-2 rounded-lg text-sm font-medium">
            <Upload className="w-4 h-4 inline mr-2" />
            Upload File
          </button>
        </div>

        <p className="text-gray-500 text-xs">Make sure all text is clearly visible and not blurry.</p>
      </div>
    </div>
  )

  const renderStep5 = () => (
    <div className="flex-1 overflow-y-auto px-4 py-6">
      <div className="mb-6">
        <div className="flex items-center gap-2 text-lime-400 text-sm mb-2">
          <span className="w-6 h-6 bg-lime-400 text-gray-900 rounded-full flex items-center justify-center text-xs font-bold">5</span>
          Step 5 of 11
        </div>
        <h1 className="text-2xl font-bold text-white">Upload Insurance</h1>
        <p className="text-gray-400 text-sm mt-1">Current vehicle insurance proof</p>
      </div>

      <div className="border-2 border-dashed border-gray-700 rounded-xl p-8 text-center hover:border-lime-400/50 transition-colors cursor-pointer">
        <div className="w-20 h-20 bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-4">
          <Shield className="w-10 h-10 text-gray-500" />
        </div>
        <h3 className="text-white font-medium mb-2">Insurance Document</h3>
        <p className="text-gray-400 text-sm mb-4">Upload your current auto insurance card or declaration page</p>
        <button 
          onClick={() => handleInputChange("insuranceUploaded", true)}
          className="bg-lime-400/20 text-lime-400 px-6 py-3 rounded-lg font-medium"
        >
          <Upload className="w-5 h-5 inline mr-2" />
          Upload Insurance
        </button>
      </div>

      <div className="mt-4 bg-gray-800/50 border border-gray-700 rounded-lg p-4">
        <h4 className="text-white font-medium text-sm mb-2">Requirements:</h4>
        <ul className="text-gray-400 text-xs space-y-1">
          <li>- Insurance must be current and not expired</li>
          <li>- Policy must include the vehicle you&apos;ll be driving</li>
          <li>- Minimum liability coverage required</li>
        </ul>
      </div>
    </div>
  )

  const renderStep6 = () => (
    <div className="flex-1 overflow-y-auto px-4 py-6">
      <div className="mb-6">
        <div className="flex items-center gap-2 text-lime-400 text-sm mb-2">
          <span className="w-6 h-6 bg-lime-400 text-gray-900 rounded-full flex items-center justify-center text-xs font-bold">6</span>
          Step 6 of 11
        </div>
        <h1 className="text-2xl font-bold text-white">Vehicle Details</h1>
        <p className="text-gray-400 text-sm mt-1">Make, model, year, VIN, plate</p>
      </div>

      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-sm text-gray-400 mb-1">Make</label>
            <input
              type="text"
              value={formData.vehicleMake}
              onChange={(e) => handleInputChange("vehicleMake", e.target.value)}
              className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-3 text-white focus:outline-none focus:border-lime-400"
              placeholder="Toyota"
            />
          </div>
          <div>
            <label className="block text-sm text-gray-400 mb-1">Model</label>
            <input
              type="text"
              value={formData.vehicleModel}
              onChange={(e) => handleInputChange("vehicleModel", e.target.value)}
              className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-3 text-white focus:outline-none focus:border-lime-400"
              placeholder="Camry"
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-sm text-gray-400 mb-1">Year</label>
            <input
              type="text"
              value={formData.vehicleYear}
              onChange={(e) => handleInputChange("vehicleYear", e.target.value)}
              className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-3 text-white focus:outline-none focus:border-lime-400"
              placeholder="2020"
            />
          </div>
          <div>
            <label className="block text-sm text-gray-400 mb-1">Color</label>
            <input
              type="text"
              value={formData.vehicleColor}
              onChange={(e) => handleInputChange("vehicleColor", e.target.value)}
              className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-3 text-white focus:outline-none focus:border-lime-400"
              placeholder="White"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm text-gray-400 mb-1">License Plate</label>
          <input
            type="text"
            value={formData.vehiclePlate}
            onChange={(e) => handleInputChange("vehiclePlate", e.target.value.toUpperCase())}
            className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-3 text-white uppercase focus:outline-none focus:border-lime-400"
            placeholder="ABC-1234"
          />
        </div>

        <div>
          <label className="block text-sm text-gray-400 mb-1">VIN (Vehicle Identification Number)</label>
          <input
            type="text"
            value={formData.vehicleVin}
            onChange={(e) => handleInputChange("vehicleVin", e.target.value.toUpperCase())}
            className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-3 text-white uppercase focus:outline-none focus:border-lime-400"
            placeholder="1HGBH41JXMN109186"
            maxLength={17}
          />
        </div>
      </div>
    </div>
  )

  const renderStep7 = () => (
    <div className="flex-1 overflow-y-auto px-4 py-6">
      <div className="mb-6">
        <div className="flex items-center gap-2 text-lime-400 text-sm mb-2">
          <span className="w-6 h-6 bg-lime-400 text-gray-900 rounded-full flex items-center justify-center text-xs font-bold">7</span>
          Step 7 of 11
        </div>
        <h1 className="text-2xl font-bold text-white">Payout Account</h1>
        <p className="text-gray-400 text-sm mt-1">Bank details for direct deposit</p>
      </div>

      <div className="space-y-4">
        <div>
          <label className="block text-sm text-gray-400 mb-1">Bank Name</label>
          <input
            type="text"
            value={formData.bankName}
            onChange={(e) => handleInputChange("bankName", e.target.value)}
            className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-3 text-white focus:outline-none focus:border-lime-400"
            placeholder="Chase Bank"
          />
        </div>

        <div>
          <label className="block text-sm text-gray-400 mb-1">Routing Number</label>
          <input
            type="text"
            value={formData.routingNumber}
            onChange={(e) => handleInputChange("routingNumber", e.target.value)}
            className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-3 text-white focus:outline-none focus:border-lime-400"
            placeholder="021000021"
            maxLength={9}
          />
        </div>

        <div>
          <label className="block text-sm text-gray-400 mb-1">Account Number</label>
          <input
            type="password"
            value={formData.accountNumber}
            onChange={(e) => handleInputChange("accountNumber", e.target.value)}
            className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-3 text-white focus:outline-none focus:border-lime-400"
            placeholder="**********"
          />
        </div>

        <div className="bg-gray-800/50 border border-gray-700 rounded-lg p-4">
          <div className="flex items-start gap-3">
            <Shield className="w-5 h-5 text-lime-400 flex-shrink-0 mt-0.5" />
            <p className="text-gray-400 text-xs">Your banking information is encrypted and securely stored. We use bank-level security to protect your data.</p>
          </div>
        </div>
      </div>
    </div>
  )

  const renderStep8 = () => (
    <div className="flex-1 overflow-y-auto px-4 py-6">
      <div className="mb-6">
        <div className="flex items-center gap-2 text-lime-400 text-sm mb-2">
          <span className="w-6 h-6 bg-lime-400 text-gray-900 rounded-full flex items-center justify-center text-xs font-bold">8</span>
          Step 8 of 11
        </div>
        <h1 className="text-2xl font-bold text-white">Background Check Consent</h1>
        <p className="text-gray-400 text-sm mt-1">Authorize screening authorization</p>
      </div>

      <div className="bg-gray-800/50 border border-gray-700 rounded-xl p-4 mb-6">
        <h3 className="text-white font-medium mb-3">What we check:</h3>
        <ul className="text-gray-400 text-sm space-y-2">
          <li className="flex items-center gap-2"><Check className="w-4 h-4 text-lime-400" /> Driving record (MVR)</li>
          <li className="flex items-center gap-2"><Check className="w-4 h-4 text-lime-400" /> Criminal background check</li>
          <li className="flex items-center gap-2"><Check className="w-4 h-4 text-lime-400" /> Sex offender registry</li>
          <li className="flex items-center gap-2"><Check className="w-4 h-4 text-lime-400" /> Identity verification</li>
        </ul>
      </div>

      <div className="bg-gray-900 border border-gray-700 rounded-xl p-4 mb-6 max-h-40 overflow-y-auto">
        <p className="text-gray-400 text-xs leading-relaxed">
          By checking the box below, I authorize GlideWay and its designated consumer reporting agency to obtain a consumer report and/or investigative consumer report on me. I understand this may include information regarding my driving record, criminal history, and other background information. I acknowledge that I have read and agree to the Fair Credit Reporting Act disclosure and my rights thereunder...
        </p>
      </div>

      <label className="flex items-start gap-3 cursor-pointer">
        <input
          type="checkbox"
          checked={formData.backgroundConsent}
          onChange={(e) => handleInputChange("backgroundConsent", e.target.checked)}
          className="w-5 h-5 rounded border-gray-600 bg-gray-800 text-lime-400 focus:ring-lime-400 mt-0.5"
        />
        <span className="text-white text-sm">I consent to the background check and agree to the terms above</span>
      </label>
    </div>
  )

  const renderStep9 = () => (
    <div className="flex-1 overflow-y-auto px-4 py-6">
      <div className="mb-6">
        <div className="flex items-center gap-2 text-lime-400 text-sm mb-2">
          <span className="w-6 h-6 bg-lime-400 text-gray-900 rounded-full flex items-center justify-center text-xs font-bold">9</span>
          Step 9 of 11
        </div>
        <h1 className="text-2xl font-bold text-white">Review & Submit</h1>
        <p className="text-gray-400 text-sm mt-1">Final review before submission</p>
      </div>

      <div className="space-y-4">
        <div className="bg-gray-800/50 border border-gray-700 rounded-xl p-4">
          <h3 className="text-white font-medium mb-2">Personal Info</h3>
          <p className="text-gray-400 text-sm">{formData.firstName} {formData.lastName}</p>
          <p className="text-gray-400 text-sm">{formData.email}</p>
          <p className="text-gray-400 text-sm">{formData.phone}</p>
        </div>

        <div className="bg-gray-800/50 border border-gray-700 rounded-xl p-4">
          <h3 className="text-white font-medium mb-2">Vehicle</h3>
          <p className="text-gray-400 text-sm">{formData.vehicleYear} {formData.vehicleMake} {formData.vehicleModel}</p>
          <p className="text-gray-400 text-sm">Plate: {formData.vehiclePlate}</p>
        </div>

        <div className="bg-gray-800/50 border border-gray-700 rounded-xl p-4">
          <h3 className="text-white font-medium mb-2">Documents</h3>
          <div className="flex items-center gap-2 text-sm">
            <span className={formData.licenseUploaded ? "text-lime-400" : "text-gray-500"}>
              {formData.licenseUploaded ? <Check className="w-4 h-4 inline" /> : "O"} License
            </span>
            <span className={formData.insuranceUploaded ? "text-lime-400" : "text-gray-500"}>
              {formData.insuranceUploaded ? <Check className="w-4 h-4 inline" /> : "O"} Insurance
            </span>
            <span className={formData.backgroundConsent ? "text-lime-400" : "text-gray-500"}>
              {formData.backgroundConsent ? <Check className="w-4 h-4 inline" /> : "O"} Background
            </span>
          </div>
        </div>
      </div>
    </div>
  )

  const renderSubmitted = () => (
    <div className="flex-1 flex flex-col items-center justify-center px-6 py-12 text-center">
      <div className="w-24 h-24 bg-lime-400/20 rounded-full flex items-center justify-center mb-6">
        <Check className="w-12 h-12 text-lime-400" />
      </div>
      <h1 className="text-2xl font-bold text-white mb-2">Application Submitted!</h1>
      <p className="text-gray-400 mb-8">Our team will review your documents within 24-48 hours. You&apos;ll receive an email and SMS when approved.</p>
      
      <div className="w-full space-y-3">
        <div className="bg-gray-800/50 border border-gray-700 rounded-xl p-4 flex items-center gap-4">
          <div className="w-10 h-10 bg-yellow-500/20 rounded-full flex items-center justify-center">
            <Clock className="w-5 h-5 text-yellow-400" />
          </div>
          <div className="text-left">
            <p className="text-white font-medium">Pending Review</p>
            <p className="text-gray-400 text-sm">Admin reviews documents</p>
          </div>
        </div>
        
        <div className="bg-gray-800/30 border border-gray-800 rounded-xl p-4 flex items-center gap-4 opacity-50">
          <div className="w-10 h-10 bg-gray-700 rounded-full flex items-center justify-center">
            <Check className="w-5 h-5 text-gray-500" />
          </div>
          <div className="text-left">
            <p className="text-white font-medium">Approved & Activated</p>
            <p className="text-gray-400 text-sm">Ready to accept rides</p>
          </div>
        </div>
      </div>
    </div>
  )

  const renderCurrentStep = () => {
    switch (currentStep) {
      case 0: return renderOverview()
      case 2: return renderStep2()
      case 3: return renderStep3()
      case 4: return renderStep4()
      case 5: return renderStep5()
      case 6: return renderStep6()
      case 7: return renderStep7()
      case 8: return renderStep8()
      case 9: return renderStep9()
      case 10:
      case 11: return renderSubmitted()
      default: return renderOverview()
    }
  }

  const canProceed = () => {
    switch (currentStep) {
      case 2: return formData.firstName && formData.lastName && formData.email && formData.phone
      case 3: return phoneVerified && emailVerified
      case 4: return formData.licenseUploaded
      case 5: return formData.insuranceUploaded
      case 6: return formData.vehicleMake && formData.vehicleModel && formData.vehiclePlate
      case 7: return formData.bankName && formData.routingNumber && formData.accountNumber
      case 8: return formData.backgroundConsent
      case 9: return true
      default: return true
    }
  }

  return (
    <div className="w-full min-h-screen bg-gray-950 flex flex-col">
      {/* Header */}
      <div className="bg-gray-900 border-b border-gray-800 px-4 py-4 flex items-center gap-3">
        <button
          onClick={currentStep === 0 ? onBack : () => setCurrentStep(prev => Math.max(0, prev - 1))}
          className="w-10 h-10 flex items-center justify-center hover:bg-gray-800 rounded-lg transition-colors"
        >
          <ChevronLeft className="w-5 h-5 text-white" />
        </button>
        <div className="flex-1 flex items-center gap-3">
          <GlidewayLogo variant="icon" size="sm" />
          <span className="text-white font-semibold">Become a Driver</span>
        </div>
      </div>

      {/* Progress Bar */}
      {currentStep > 0 && currentStep < 10 && (
        <div className="px-4 py-2 bg-gray-900/50">
          <div className="h-1 bg-gray-800 rounded-full overflow-hidden">
            <div 
              className="h-full bg-lime-400 transition-all duration-300"
              style={{ width: `${((currentStep - 1) / 8) * 100}%` }}
            />
          </div>
        </div>
      )}

      {/* Content */}
      {renderCurrentStep()}

      {/* Bottom Action */}
      {currentStep > 0 && currentStep < 10 && (
        <div className="px-4 py-4 border-t border-gray-800 bg-gray-900">
          <button
            onClick={() => setCurrentStep(prev => prev + 1)}
            disabled={!canProceed()}
            className="w-full bg-lime-400 hover:bg-lime-500 disabled:bg-gray-700 disabled:cursor-not-allowed text-gray-950 font-bold py-4 rounded-lg transition-colors flex items-center justify-center gap-2"
          >
            {currentStep === 9 ? "Submit Application" : "Continue"}
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      )}

      {currentStep >= 10 && (
        <div className="px-4 py-4 border-t border-gray-800 bg-gray-900">
          <button
            onClick={onComplete}
            className="w-full bg-lime-400 hover:bg-lime-500 text-gray-950 font-bold py-4 rounded-lg transition-colors"
          >
            Go to Driver App
          </button>
        </div>
      )}
    </div>
  )
}
