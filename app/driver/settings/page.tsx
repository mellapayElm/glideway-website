"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import Link from "next/link"
import { 
  ChevronLeft, User, Bell, Shield, Car, CreditCard, MapPin,
  ChevronRight, Moon, Sun, Volume2, VolumeX, Vibrate, Globe,
  Lock, LogOut, Trash2, Eye, EyeOff, Phone, Mail, Camera,
  Edit, CheckCircle, AlertCircle, X, Smartphone, Key
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Switch } from "@/components/ui/switch"

export default function DriverSettingsPage() {
  const [darkMode, setDarkMode] = useState(true)
  const [soundEnabled, setSoundEnabled] = useState(true)
  const [vibrationEnabled, setVibrationEnabled] = useState(true)
  const [pushNotifications, setPushNotifications] = useState(true)
  const [emailNotifications, setEmailNotifications] = useState(true)
  const [smsNotifications, setSmsNotifications] = useState(false)
  const [locationSharing, setLocationSharing] = useState(true)
  const [showEditProfile, setShowEditProfile] = useState(false)
  const [showChangePassword, setShowChangePassword] = useState(false)

  const driverProfile = {
    name: "Marcus Johnson",
    email: "marcus.johnson@email.com",
    phone: "+1 (323) 555-0147",
    photo: null,
    rating: 4.92,
    totalTrips: 2840,
    memberSince: "January 2022",
    vehicleModel: "2022 Toyota Camry",
    licensePlate: "ABC 1234"
  }

  const settingsSections = [
    {
      title: "Account",
      items: [
        { icon: <User className="w-5 h-5" />, label: "Edit Profile", action: () => setShowEditProfile(true), value: null },
        { icon: <Lock className="w-5 h-5" />, label: "Change Password", action: () => setShowChangePassword(true), value: null },
        { icon: <Key className="w-5 h-5" />, label: "Two-Factor Authentication", action: () => {}, value: "Enabled", color: "text-emerald-400" },
        { icon: <Smartphone className="w-5 h-5" />, label: "Linked Devices", action: () => {}, value: "2 devices" },
      ]
    },
    {
      title: "Vehicle",
      items: [
        { icon: <Car className="w-5 h-5" />, label: "Vehicle Information", action: () => {}, value: driverProfile.vehicleModel },
        { icon: <CreditCard className="w-5 h-5" />, label: "License Plate", action: () => {}, value: driverProfile.licensePlate },
      ]
    },
    {
      title: "Notifications",
      items: [
        { icon: <Bell className="w-5 h-5" />, label: "Push Notifications", toggle: true, value: pushNotifications, onChange: setPushNotifications },
        { icon: <Mail className="w-5 h-5" />, label: "Email Notifications", toggle: true, value: emailNotifications, onChange: setEmailNotifications },
        { icon: <Phone className="w-5 h-5" />, label: "SMS Notifications", toggle: true, value: smsNotifications, onChange: setSmsNotifications },
      ]
    },
    {
      title: "App Preferences",
      items: [
        { icon: darkMode ? <Moon className="w-5 h-5" /> : <Sun className="w-5 h-5" />, label: "Dark Mode", toggle: true, value: darkMode, onChange: setDarkMode },
        { icon: soundEnabled ? <Volume2 className="w-5 h-5" /> : <VolumeX className="w-5 h-5" />, label: "Sound Effects", toggle: true, value: soundEnabled, onChange: setSoundEnabled },
        { icon: <Vibrate className="w-5 h-5" />, label: "Vibration", toggle: true, value: vibrationEnabled, onChange: setVibrationEnabled },
        { icon: <Globe className="w-5 h-5" />, label: "Language", action: () => {}, value: "English" },
      ]
    },
    {
      title: "Privacy & Safety",
      items: [
        { icon: <MapPin className="w-5 h-5" />, label: "Location Sharing", toggle: true, value: locationSharing, onChange: setLocationSharing },
        { icon: <Shield className="w-5 h-5" />, label: "Safety Features", action: () => {}, value: "Active", color: "text-emerald-400" },
        { icon: <Eye className="w-5 h-5" />, label: "Privacy Settings", action: () => {}, value: null },
      ]
    },
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
          <h1 className="text-lg font-semibold text-white">Settings</h1>
          <div className="w-10" />
        </div>
      </header>

      <main className="p-4 space-y-6 pb-24">
        {/* Profile Card */}
        <Card className="bg-gradient-to-br from-slate-800 to-slate-900 border-slate-700">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="relative">
                <div className="w-20 h-20 rounded-full bg-gradient-to-br from-emerald-500 to-emerald-700 flex items-center justify-center text-white text-2xl font-bold">
                  {driverProfile.name.charAt(0)}
                </div>
                <button className="absolute bottom-0 right-0 w-7 h-7 rounded-full bg-emerald-600 flex items-center justify-center text-white cursor-pointer hover:bg-emerald-700 transition-all">
                  <Camera className="w-4 h-4" />
                </button>
              </div>
              <div className="flex-1">
                <h2 className="text-xl font-bold text-white">{driverProfile.name}</h2>
                <p className="text-sm text-slate-400">{driverProfile.email}</p>
                <div className="flex items-center gap-4 mt-2">
                  <div className="flex items-center gap-1 text-yellow-400">
                    <span className="text-sm font-medium">{driverProfile.rating}</span>
                    <span className="text-xs text-slate-400">rating</span>
                  </div>
                  <div className="text-slate-400">|</div>
                  <div className="text-sm text-slate-400">{driverProfile.totalTrips.toLocaleString()} trips</div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Settings Sections */}
        {settingsSections.map((section) => (
          <Card key={section.title} className="bg-slate-900/50 border-slate-800">
            <CardHeader className="pb-2">
              <CardTitle className="text-white text-base">{section.title}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-1">
              {section.items.map((item, index) => (
                <div
                  key={index}
                  onClick={item.action}
                  className={`flex items-center justify-between p-4 rounded-xl transition-all ${
                    item.action ? "cursor-pointer hover:bg-slate-800" : ""
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className="text-slate-400">{item.icon}</div>
                    <span className="text-white">{item.label}</span>
                  </div>
                  {item.toggle ? (
                    <Switch
                      checked={item.value as boolean}
                      onCheckedChange={item.onChange}
                      className="data-[state=checked]:bg-emerald-600"
                    />
                  ) : (
                    <div className="flex items-center gap-2">
                      {item.value && (
                        <span className={`text-sm ${item.color || "text-slate-400"}`}>{item.value}</span>
                      )}
                      <ChevronRight className="w-5 h-5 text-slate-500" />
                    </div>
                  )}
                </div>
              ))}
            </CardContent>
          </Card>
        ))}

        {/* Legal & About */}
        <Card className="bg-slate-900/50 border-slate-800">
          <CardHeader className="pb-2">
            <CardTitle className="text-white text-base">Legal & About</CardTitle>
          </CardHeader>
          <CardContent className="space-y-1">
            <div className="flex items-center justify-between p-4 rounded-xl cursor-pointer hover:bg-slate-800 transition-all">
              <span className="text-white">Terms of Service</span>
              <ChevronRight className="w-5 h-5 text-slate-500" />
            </div>
            <div className="flex items-center justify-between p-4 rounded-xl cursor-pointer hover:bg-slate-800 transition-all">
              <span className="text-white">Privacy Policy</span>
              <ChevronRight className="w-5 h-5 text-slate-500" />
            </div>
            <div className="flex items-center justify-between p-4 rounded-xl cursor-pointer hover:bg-slate-800 transition-all">
              <span className="text-white">About GlideWay</span>
              <ChevronRight className="w-5 h-5 text-slate-500" />
            </div>
            <div className="flex items-center justify-between p-4 rounded-xl">
              <span className="text-white">App Version</span>
              <span className="text-slate-400">1.0.0</span>
            </div>
          </CardContent>
        </Card>

        {/* Danger Zone */}
        <Card className="bg-red-950/20 border-red-900/50">
          <CardHeader className="pb-2">
            <CardTitle className="text-red-400 text-base">Danger Zone</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <Button
              variant="outline"
              className="w-full border-red-900/50 text-red-400 hover:bg-red-950/30 hover:text-red-300 cursor-pointer"
            >
              <LogOut className="w-4 h-4 mr-2" />
              Log Out
            </Button>
            <Button
              variant="outline"
              className="w-full border-red-900/50 text-red-400 hover:bg-red-950/30 hover:text-red-300 cursor-pointer"
            >
              <Trash2 className="w-4 h-4 mr-2" />
              Delete Account
            </Button>
          </CardContent>
        </Card>
      </main>

      {/* Edit Profile Modal */}
      {showEditProfile && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="fixed inset-0 bg-black/80 z-50 flex items-end justify-center"
          onClick={() => setShowEditProfile(false)}
        >
          <motion.div
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            className="w-full max-w-lg bg-slate-900 rounded-t-2xl p-6"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-white">Edit Profile</h3>
              <button onClick={() => setShowEditProfile(false)} className="text-slate-400 hover:text-white cursor-pointer">
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="space-y-4 mb-6">
              <div>
                <label className="text-sm text-slate-400 mb-2 block">Full Name</label>
                <Input
                  defaultValue={driverProfile.name}
                  className="bg-slate-800 border-slate-700 text-white"
                />
              </div>
              <div>
                <label className="text-sm text-slate-400 mb-2 block">Email</label>
                <Input
                  defaultValue={driverProfile.email}
                  className="bg-slate-800 border-slate-700 text-white"
                />
              </div>
              <div>
                <label className="text-sm text-slate-400 mb-2 block">Phone Number</label>
                <Input
                  defaultValue={driverProfile.phone}
                  className="bg-slate-800 border-slate-700 text-white"
                />
              </div>
            </div>

            <Button className="w-full bg-emerald-600 hover:bg-emerald-700 text-white cursor-pointer">
              Save Changes
            </Button>
          </motion.div>
        </motion.div>
      )}

      {/* Change Password Modal */}
      {showChangePassword && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="fixed inset-0 bg-black/80 z-50 flex items-end justify-center"
          onClick={() => setShowChangePassword(false)}
        >
          <motion.div
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            className="w-full max-w-lg bg-slate-900 rounded-t-2xl p-6"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-white">Change Password</h3>
              <button onClick={() => setShowChangePassword(false)} className="text-slate-400 hover:text-white cursor-pointer">
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="space-y-4 mb-6">
              <div>
                <label className="text-sm text-slate-400 mb-2 block">Current Password</label>
                <Input
                  type="password"
                  className="bg-slate-800 border-slate-700 text-white"
                />
              </div>
              <div>
                <label className="text-sm text-slate-400 mb-2 block">New Password</label>
                <Input
                  type="password"
                  className="bg-slate-800 border-slate-700 text-white"
                />
              </div>
              <div>
                <label className="text-sm text-slate-400 mb-2 block">Confirm New Password</label>
                <Input
                  type="password"
                  className="bg-slate-800 border-slate-700 text-white"
                />
              </div>
            </div>

            <Button className="w-full bg-emerald-600 hover:bg-emerald-700 text-white cursor-pointer">
              Update Password
            </Button>
          </motion.div>
        </motion.div>
      )}
    </div>
  )
}
