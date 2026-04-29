"use client"

import { useState } from "react"
import { ChevronLeft, ChevronRight, Check, DollarSign, Clock, Shield, Zap, Upload, Camera } from "lucide-react"
import { GlidewayLogo } from "@/components/glideway-logo"

const DRIVER_BENEFITS = [
  { icon: DollarSign, title: "Earn More", desc: "Competitive rates with weekly payouts" },
  { icon: Clock, title: "Flexible Hours", desc: "Drive when you want, as much as you want" },
  { icon: Shield, title: "Full Insurance", desc: "Comprehensive coverage while you drive" },
  { icon: Zap, title: "Instant Pay", desc: "Cash out your earnings anytime" },
]

const ONBOARDING_STEPS = [
  { id: 1, title: "Click Become a Driver", desc: "Start your application", status: "complete" as const },
  { id: 2, title: "Enter Personal Info", desc: "Name, DOB, SSN, contact details", status: "current" as const },
  { id: 3, title: "Verify Phone & Email", desc: "OTP confirmation to both", status: "pending" as const },
  { id: 4, title: "Upload Driver License", desc: "Front and back scan required", status: "pending" as const },
  { id: 5, title: "Upload Insurance", desc: "Current vehicle insurance proof", status: "pending" as const },
  { id: 6, title: "Enter Vehicle Details", desc: "Make, model, year, VIN, plate", status: "pending" as const },
  { id: 7, title: "Add Payout Account", desc: "Bank details for direct deposit", status: "pending" as const },
  { id: 8, title: "Background Check Consent", desc: "Authorize screening authorization", status: "pending" as const },
  { id: 9, title: "Submit Application", desc: "Final review and submission", status: "pending" as const },
  { id: 10, title: "Admin Reviews Documents", desc: "Compliance team verifies all docs", status: "pending" as const },
  { id: 11, title: "Driver Approved & Activated", desc: "Ready to accept rides and earn", status: "pending" as const },
]

interface BecomeDriverScreenProps {
  onBack?: () => void
  onComplete?: () => void
}

export function BecomeDriverScreen({ onBack, onComplete }: BecomeDriverScreenProps) {
  const [currentStep, setCurrentStep] = useState(0) // 0 = intro, 1-11 = steps
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
    licenseNumber: "",
    licenseExpiry: "",
    vehicleMake: "",
    vehicleModel: "",
    vehicleYear: "",
    vehicleColor: "",
    vehiclePlate: "",
    bankName: "",
    accountNumber: "",
    routingNumber: "",
  })
  const [otp, setOtp] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const handleNext = () => {
    if (currentStep < 11) {
      setCurrentStep(currentStep + 1)
    }
  }

  const handleSubmit = () => {
    setIsSubmitting(true)
    setTimeout(() => {
      setIsSubmitting(false)
      setCurrentStep(11)
    }, 2000)
  }

  const handleComplete = () => {
    onComplete?.()
  }

  // Intro screen
  if (currentStep === 0) {
    return (
      <div className="w-full min-h-screen bg-gradient-to-br from-white via-gray-50 to-white flex flex-col">
        {/* Header */}
        <div className="bg-gray-50 border-b border-green-200 px-4 py-4 flex items-center gap-3">
          <button 
            onClick={onBack}
            className="w-10 h-10 flex items-center justify-center hover:bg-green-50 rounded-lg transition-colors"
          >
            <ChevronLeft className="w-5 h-5 text-gray-900" />
          </button>
          <GlidewayLogo variant="icon" size="sm" />
          <h2 className="text-lg font-semibold text-gray-900">Become a Driver</h2>
        </div>

        <div className="flex-1 overflow-y-auto p-4">
          {/* Hero */}
          <div className="text-center mb-6">
            <h1 className="text-2xl font-bold text-gray-900 mb-2">Become a GlideWay Driver</h1>
            <p className="text-gray-600 text-sm">Join our network of professional drivers. Earn on your schedule, protected by GlideWay.</p>
          </div>

          {/* Benefits Grid */}
          <div className="grid grid-cols-2 gap-3 mb-6">
            {DRIVER_BENEFITS.map((benefit, index) => (
              <div key={index} className="bg-green-50/50 border border-green-200 rounded-xl p-4">
                <div className="w-10 h-10 bg-green-500/20 rounded-lg flex items-center justify-center mb-3">
                  <benefit.icon className="w-5 h-5 text-green-500" />
                </div>
                <h3 className="font-semibold text-gray-900 text-sm mb-1">{benefit.title}</h3>
                <p className="text-gray-600 text-xs">{benefit.desc}</p>
              </div>
            ))}
          </div>

          {/* Stats */}
          <div className="flex gap-3 mb-6">
            <div className="flex-1 bg-green-50/50 border border-green-200 rounded-xl p-4 text-center">
              <p className="text-2xl font-bold text-gray-900">10K+</p>
              <p className="text-xs text-gray-600">Active Drivers</p>
            </div>
            <div className="flex-1 bg-green-50/50 border border-green-200 rounded-xl p-4 text-center">
              <p className="text-2xl font-bold text-gray-900">$25/hr</p>
              <p className="text-xs text-gray-600">Avg. Earnings</p>
            </div>
            <div className="flex-1 bg-green-50/50 border border-green-200 rounded-xl p-4 text-center">
              <p className="text-2xl font-bold text-gray-900">4.8</p>
              <p className="text-xs text-gray-600">Driver Rating</p>
            </div>
          </div>

          {/* Onboarding Steps Preview */}
          <div className="mb-6">
            <h3 className="font-semibold text-gray-900 mb-3">Driver Onboarding - 11 Steps</h3>
            <p className="text-gray-600 text-xs mb-4">Tap any step to begin, or click the button below to start now.</p>
            <div className="space-y-2 max-h-60 overflow-y-auto">
              {ONBOARDING_STEPS.map((step) => (
                <div 
                  key={step.id}
                  className="flex items-center gap-3 p-3 bg-green-50/30 rounded-lg border border-green-200/50"
                >
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold ${
                    step.id === 1 ? "bg-green-500 text-gray-950" : "bg-gray-700 text-gray-600"
                  }`}>
                    {step.id === 1 ? <Check className="w-4 h-4" /> : `S${step.id}`}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-gray-900 text-sm font-medium truncate">{step.title}</p>
                    <p className="text-gray-600 text-xs truncate">{step.desc}</p>
                  </div>
                  {step.id === 11 && (
                    <span className="text-xs bg-green-500/20 text-green-500 px-2 py-0.5 rounded">Final</span>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* CTA Button */}
        <div className="p-4 border-t border-green-200">
          <button
            onClick={handleNext}
            className="w-full bg-green-500 hover:bg-lime-500 text-gray-950 font-bold py-4 rounded-lg transition-colors flex items-center justify-center gap-2"
          >
            Become a Driver - Start Now
            <ChevronRight className="w-5 h-5" />
          </button>
          <p className="text-center text-gray-600 text-xs mt-3">Takes about 10 minutes. Admin approval within 24-48 hours.</p>
        </div>
      </div>
    )
  }

  // Step 2: Personal Info
  if (currentStep === 1) {
    return (
      <div className="w-full min-h-screen bg-gradient-to-br from-white via-gray-50 to-white flex flex-col">
        <StepHeader step={2} title="Enter Personal Info" onBack={() => setCurrentStep(0)} />
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          <InputField label="First Name" value={formData.firstName} onChange={(v) => handleInputChange("firstName", v)} placeholder="John" />
          <InputField label="Last Name" value={formData.lastName} onChange={(v) => handleInputChange("lastName", v)} placeholder="Smith" />
          <InputField label="Email" type="email" value={formData.email} onChange={(v) => handleInputChange("email", v)} placeholder="john@example.com" />
          <InputField label="Phone" type="tel" value={formData.phone} onChange={(v) => handleInputChange("phone", v)} placeholder="(555) 123-4567" />
          <InputField label="Date of Birth" type="date" value={formData.dob} onChange={(v) => handleInputChange("dob", v)} />
          <InputField label="SSN (Last 4)" value={formData.ssn} onChange={(v) => handleInputChange("ssn", v)} placeholder="1234" maxLength={4} />
          <InputField label="Street Address" value={formData.address} onChange={(v) => handleInputChange("address", v)} placeholder="123 Main St" />
          <div className="grid grid-cols-2 gap-3">
            <InputField label="City" value={formData.city} onChange={(v) => handleInputChange("city", v)} placeholder="Denver" />
            <InputField label="State" value={formData.state} onChange={(v) => handleInputChange("state", v)} placeholder="CO" />
          </div>
          <InputField label="ZIP Code" value={formData.zip} onChange={(v) => handleInputChange("zip", v)} placeholder="80202" />
        </div>
        <StepFooter onNext={handleNext} />
      </div>
    )
  }

  // Step 3: Verify Phone & Email
  if (currentStep === 2) {
    return (
      <div className="w-full min-h-screen bg-gradient-to-br from-white via-gray-50 to-white flex flex-col">
        <StepHeader step={3} title="Verify Phone & Email" onBack={() => setCurrentStep(1)} />
        <div className="flex-1 overflow-y-auto p-4">
          <p className="text-gray-600 text-sm mb-6">We sent a 6-digit code to your phone and email. Enter it below to verify.</p>
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">Verification Code</label>
            <input
              type="text"
              value={otp}
              onChange={(e) => setOtp(e.target.value.replace(/\D/g, "").slice(0, 6))}
              placeholder="000000"
              className="w-full bg-green-50 border border-green-200 rounded-lg px-4 py-4 text-gray-900 text-center text-2xl tracking-widest placeholder-gray-500 focus:outline-none focus:border-green-500"
              maxLength={6}
            />
          </div>
          <button className="text-green-500 text-sm font-medium">Resend Code</button>
        </div>
        <StepFooter onNext={handleNext} disabled={otp.length !== 6} />
      </div>
    )
  }

  // Step 4: Upload Driver License
  if (currentStep === 3) {
    return (
      <div className="w-full min-h-screen bg-gradient-to-br from-white via-gray-50 to-white flex flex-col">
        <StepHeader step={4} title="Upload Driver License" onBack={() => setCurrentStep(2)} />
        <div className="flex-1 overflow-y-auto p-4">
          <p className="text-gray-600 text-sm mb-6">Upload clear photos of your driver&apos;s license (front and back).</p>
          <UploadBox label="License Front" icon={<Camera className="w-8 h-8" />} />
          <div className="h-4" />
          <UploadBox label="License Back" icon={<Camera className="w-8 h-8" />} />
          <div className="mt-4 space-y-3">
            <InputField label="License Number" value={formData.licenseNumber} onChange={(v) => handleInputChange("licenseNumber", v)} placeholder="DL12345678" />
            <InputField label="Expiry Date" type="date" value={formData.licenseExpiry} onChange={(v) => handleInputChange("licenseExpiry", v)} />
          </div>
        </div>
        <StepFooter onNext={handleNext} />
      </div>
    )
  }

  // Step 5: Upload Insurance
  if (currentStep === 4) {
    return (
      <div className="w-full min-h-screen bg-gradient-to-br from-white via-gray-50 to-white flex flex-col">
        <StepHeader step={5} title="Upload Insurance" onBack={() => setCurrentStep(3)} />
        <div className="flex-1 overflow-y-auto p-4">
          <p className="text-gray-600 text-sm mb-6">Upload your current vehicle insurance document.</p>
          <UploadBox label="Insurance Document" icon={<Upload className="w-8 h-8" />} />
        </div>
        <StepFooter onNext={handleNext} />
      </div>
    )
  }

  // Step 6: Vehicle Details
  if (currentStep === 5) {
    return (
      <div className="w-full min-h-screen bg-gradient-to-br from-white via-gray-50 to-white flex flex-col">
        <StepHeader step={6} title="Enter Vehicle Details" onBack={() => setCurrentStep(4)} />
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          <InputField label="Vehicle Make" value={formData.vehicleMake} onChange={(v) => handleInputChange("vehicleMake", v)} placeholder="Toyota" />
          <InputField label="Vehicle Model" value={formData.vehicleModel} onChange={(v) => handleInputChange("vehicleModel", v)} placeholder="Camry" />
          <InputField label="Year" value={formData.vehicleYear} onChange={(v) => handleInputChange("vehicleYear", v)} placeholder="2022" />
          <InputField label="Color" value={formData.vehicleColor} onChange={(v) => handleInputChange("vehicleColor", v)} placeholder="White" />
          <InputField label="License Plate" value={formData.vehiclePlate} onChange={(v) => handleInputChange("vehiclePlate", v)} placeholder="ABC-1234" />
        </div>
        <StepFooter onNext={handleNext} />
      </div>
    )
  }

  // Step 7: Payout Account
  if (currentStep === 6) {
    return (
      <div className="w-full min-h-screen bg-gradient-to-br from-white via-gray-50 to-white flex flex-col">
        <StepHeader step={7} title="Add Payout Account" onBack={() => setCurrentStep(5)} />
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          <p className="text-gray-600 text-sm mb-2">Enter your bank details for direct deposit of earnings.</p>
          <InputField label="Bank Name" value={formData.bankName} onChange={(v) => handleInputChange("bankName", v)} placeholder="Chase Bank" />
          <InputField label="Account Number" value={formData.accountNumber} onChange={(v) => handleInputChange("accountNumber", v)} placeholder="1234567890" />
          <InputField label="Routing Number" value={formData.routingNumber} onChange={(v) => handleInputChange("routingNumber", v)} placeholder="021000021" />
        </div>
        <StepFooter onNext={handleNext} />
      </div>
    )
  }

  // Step 8: Background Check Consent
  if (currentStep === 7) {
    return (
      <div className="w-full min-h-screen bg-gradient-to-br from-white via-gray-50 to-white flex flex-col">
        <StepHeader step={8} title="Background Check Consent" onBack={() => setCurrentStep(6)} />
        <div className="flex-1 overflow-y-auto p-4">
          <p className="text-gray-600 text-sm mb-6">
            By proceeding, you authorize GlideWay to conduct a background check including driving history, criminal records, and identity verification.
          </p>
          <div className="bg-green-50/50 border border-green-200 rounded-xl p-4 mb-6">
            <h4 className="font-semibold text-gray-900 mb-2">What we check:</h4>
            <ul className="text-gray-600 text-sm space-y-2">
              <li className="flex items-center gap-2"><Check className="w-4 h-4 text-green-500" /> Motor Vehicle Records (MVR)</li>
              <li className="flex items-center gap-2"><Check className="w-4 h-4 text-green-500" /> Criminal Background Check</li>
              <li className="flex items-center gap-2"><Check className="w-4 h-4 text-green-500" /> Identity Verification</li>
              <li className="flex items-center gap-2"><Check className="w-4 h-4 text-green-500" /> SSN Trace</li>
            </ul>
          </div>
          <label className="flex items-start gap-3 cursor-pointer">
            <input type="checkbox" className="mt-1 w-5 h-5 rounded border-gray-600 bg-green-50 text-green-500 focus:ring-green-500" />
            <span className="text-gray-700 text-sm">I authorize GlideWay to perform background screening as described above.</span>
          </label>
        </div>
        <StepFooter onNext={handleNext} buttonText="I Consent" />
      </div>
    )
  }

  // Step 9: Submit Application
  if (currentStep === 8) {
    return (
      <div className="w-full min-h-screen bg-gradient-to-br from-white via-gray-50 to-white flex flex-col">
        <StepHeader step={9} title="Submit Application" onBack={() => setCurrentStep(7)} />
        <div className="flex-1 overflow-y-auto p-4">
          <p className="text-gray-600 text-sm mb-6">Review your application before submitting.</p>
          <div className="space-y-3">
            <ReviewItem label="Name" value={`${formData.firstName} ${formData.lastName}`} />
            <ReviewItem label="Email" value={formData.email} />
            <ReviewItem label="Phone" value={formData.phone} />
            <ReviewItem label="Address" value={`${formData.address}, ${formData.city}, ${formData.state} ${formData.zip}`} />
            <ReviewItem label="Vehicle" value={`${formData.vehicleYear} ${formData.vehicleMake} ${formData.vehicleModel}`} />
            <ReviewItem label="License Plate" value={formData.vehiclePlate} />
          </div>
        </div>
        <div className="p-4 border-t border-green-200">
          <button
            onClick={handleSubmit}
            disabled={isSubmitting}
            className="w-full bg-green-500 hover:bg-lime-500 disabled:bg-gray-700 text-gray-950 font-bold py-4 rounded-lg transition-colors flex items-center justify-center gap-2"
          >
            {isSubmitting ? (
              <>
                <div className="w-5 h-5 border-2 border-gray-600 border-t-gray-950 rounded-full animate-spin" />
                Submitting...
              </>
            ) : (
              "Submit Application"
            )}
          </button>
        </div>
      </div>
    )
  }

  // Steps 10-11: Pending/Approved
  return (
    <div className="w-full min-h-screen bg-gradient-to-br from-white via-gray-50 to-white flex flex-col">
      <StepHeader step={currentStep === 9 ? 10 : 11} title={currentStep === 9 ? "Application Under Review" : "You're Approved!"} onBack={() => setCurrentStep(8)} />
      <div className="flex-1 flex flex-col items-center justify-center p-4 text-center">
        <div className={`w-24 h-24 rounded-full flex items-center justify-center mb-6 ${currentStep === 9 ? "bg-yellow-500/20" : "bg-green-500/20"}`}>
          {currentStep === 9 ? (
            <Clock className="w-12 h-12 text-yellow-400" />
          ) : (
            <Check className="w-12 h-12 text-green-500" />
          )}
        </div>
        <h2 className="text-2xl font-bold text-gray-900 mb-3">
          {currentStep === 9 ? "Application Under Review" : "Welcome to GlideWay!"}
        </h2>
        <p className="text-gray-600 mb-8">
          {currentStep === 9 
            ? "Our compliance team is reviewing your documents. This typically takes 24-48 hours. We'll notify you once approved."
            : "Your driver account is now active. You can start accepting rides and earning money!"
          }
        </p>
        {currentStep === 9 ? (
          <button
            onClick={() => setCurrentStep(10)}
            className="bg-green-50 hover:bg-green-100 text-gray-900 font-medium py-3 px-8 rounded-lg transition-colors"
          >
            Simulate Approval
          </button>
        ) : (
          <button
            onClick={handleComplete}
            className="bg-green-500 hover:bg-lime-500 text-gray-950 font-bold py-4 px-8 rounded-lg transition-colors"
          >
            Open Driver App
          </button>
        )}
      </div>
    </div>
  )
}

// Helper Components
function StepHeader({ step, title, onBack }: { step: number; title: string; onBack: () => void }) {
  return (
    <div className="bg-gray-50 border-b border-green-200 px-4 py-4">
      <div className="flex items-center gap-3">
        <button onClick={onBack} className="w-10 h-10 flex items-center justify-center hover:bg-green-50 rounded-lg transition-colors">
          <ChevronLeft className="w-5 h-5 text-gray-900" />
        </button>
        <div className="flex-1">
          <p className="text-green-500 text-xs font-medium">Step {step} of 11</p>
          <h2 className="text-gray-900 font-semibold">{title}</h2>
        </div>
      </div>
      <div className="mt-3 h-1 bg-green-50 rounded-full overflow-hidden">
        <div className="h-full bg-green-500 transition-all" style={{ width: `${(step / 11) * 100}%` }} />
      </div>
    </div>
  )
}

function StepFooter({ onNext, disabled, buttonText = "Continue" }: { onNext: () => void; disabled?: boolean; buttonText?: string }) {
  return (
    <div className="p-4 border-t border-green-200">
      <button
        onClick={onNext}
        disabled={disabled}
        className="w-full bg-green-500 hover:bg-lime-500 disabled:bg-gray-700 disabled:cursor-not-allowed text-gray-950 font-bold py-4 rounded-lg transition-colors"
      >
        {buttonText}
      </button>
    </div>
  )
}

function InputField({ label, value, onChange, placeholder, type = "text", maxLength }: { 
  label: string; value: string; onChange: (v: string) => void; placeholder?: string; type?: string; maxLength?: number 
}) {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-2">{label}</label>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        maxLength={maxLength}
        className="w-full bg-green-50 border border-green-200 rounded-lg px-4 py-3 text-gray-900 placeholder-gray-500 focus:outline-none focus:border-green-500 transition-colors"
      />
    </div>
  )
}

function UploadBox({ label, icon }: { label: string; icon: React.ReactNode }) {
  return (
    <div className="border-2 border-dashed border-green-200 rounded-xl p-8 text-center hover:border-green-500/50 transition-colors cursor-pointer">
      <div className="text-gray-600 mb-3 flex justify-center">{icon}</div>
      <p className="text-gray-900 font-medium mb-1">{label}</p>
      <p className="text-gray-600 text-sm">Tap to upload or take photo</p>
    </div>
  )
}

function ReviewItem({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between items-center py-3 border-b border-green-200">
      <span className="text-gray-600 text-sm">{label}</span>
      <span className="text-gray-900 font-medium text-sm">{value || "Not provided"}</span>
    </div>
  )
}
