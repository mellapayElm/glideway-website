"use client"

import { useState } from "react"
import { HomeScreen } from "./screens/home-screen"
import { ActivityScreen } from "./screens/activity-screen"
import { PaymentsScreen } from "./screens/payments-screen"
import { AccountScreen } from "./screens/account-screen"
import { DriverApp } from "./screens/driver-app"
import { AdminDashboard } from "./screens/admin-dashboard"

type AppMode = "rider" | "driver" | "admin"
type Screen = "home" | "activity" | "payments" | "account"

export function GlideWayMobileApp() {
  const [appMode, setAppMode] = useState<AppMode>("rider")
  const [activeScreen, setActiveScreen] = useState<Screen>("home")
  const [isTracking, setIsTracking] = useState(false)
  const [showAppSwitcher, setShowAppSwitcher] = useState(false)
  const [activeRide, setActiveRide] = useState<{
    id: string
    status: "searching" | "driver_assigned" | "arriving" | "in_trip" | "completed"
    driver?: {
      name: string
      rating: number
      photo: string
      vehicle: string
      plate: string
      phone: string
    }
    pickup: string
    dropoff: string
    fare: number
    eta: number
  } | null>(null)

  const renderScreen = () => {
    if (appMode === "driver") {
      return <DriverApp />
    }
    
    if (appMode === "admin") {
      return <AdminDashboard />
    }

    switch (activeScreen) {
      case "home":
        return (
          <HomeScreen 
            activeRide={activeRide}
            setActiveRide={setActiveRide}
            isTracking={isTracking}
            setIsTracking={setIsTracking}
          />
        )
      case "activity":
        return <ActivityScreen />
      case "payments":
        return <PaymentsScreen />
      case "account":
        return <AccountScreen />
      default:
        return <HomeScreen activeRide={activeRide} setActiveRide={setActiveRide} isTracking={isTracking} setIsTracking={setIsTracking} />
    }
  }

  return (
    <div className="flex flex-col h-screen max-w-md mx-auto bg-gray-50 relative overflow-hidden shadow-2xl">
      {/* Status Bar */}
      <div className="bg-emerald-600 text-white px-4 py-2 flex items-center justify-between text-xs font-medium">
        <span>9:41</span>
        <button 
          onClick={() => setShowAppSwitcher(true)}
          className="px-2 py-0.5 bg-emerald-700 rounded text-xs font-medium"
        >
          {appMode === "rider" ? "Rider" : appMode === "driver" ? "Driver" : "Admin"}
        </button>
        <div className="flex items-center gap-1">
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 21l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.18L12 21z"/>
          </svg>
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
            <path d="M1 9l2 2c4.97-4.97 13.03-4.97 18 0l2-2C16.93 2.93 7.08 2.93 1 9zm8 8l3 3 3-3c-1.65-1.66-4.34-1.66-6 0zm-4-4l2 2c2.76-2.76 7.24-2.76 10 0l2-2C15.14 9.14 8.87 9.14 5 13z"/>
          </svg>
          <svg className="w-5 h-4" fill="currentColor" viewBox="0 0 24 24">
            <rect x="2" y="7" width="18" height="10" rx="2" stroke="currentColor" strokeWidth="1" fill="none"/>
            <rect x="20" y="10" width="2" height="4" rx="0.5" fill="currentColor"/>
            <rect x="4" y="9" width="12" height="6" rx="1" fill="currentColor"/>
          </svg>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-hidden">
        {renderScreen()}
      </div>

      {/* Bottom Navigation - Only show for rider mode when not tracking */}
      {appMode === "rider" && !isTracking && (
        <nav className="bg-white border-t border-gray-200 px-2 py-2 safe-area-bottom">
          <div className="flex items-center justify-around">
            <NavItem 
              icon={<HomeIcon />} 
              label="Home" 
              active={activeScreen === "home"} 
              onClick={() => setActiveScreen("home")} 
            />
            <NavItem 
              icon={<ActivityIcon />} 
              label="Activity" 
              active={activeScreen === "activity"} 
              onClick={() => setActiveScreen("activity")} 
            />
            <NavItem 
              icon={<PaymentsIcon />} 
              label="Payment" 
              active={activeScreen === "payments"} 
              onClick={() => setActiveScreen("payments")} 
            />
            <NavItem 
              icon={<AccountIcon />} 
              label="Account" 
              active={activeScreen === "account"} 
              onClick={() => setActiveScreen("account")} 
            />
          </div>
        </nav>
      )}

      {/* App Switcher Modal */}
      {showAppSwitcher && (
        <div className="absolute inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl p-6 w-full max-w-sm">
            <h3 className="font-bold text-lg text-gray-900 mb-4">Switch App Mode</h3>
            <div className="space-y-2">
              <button
                onClick={() => {
                  setAppMode("rider")
                  setShowAppSwitcher(false)
                }}
                className={`w-full flex items-center gap-4 p-4 rounded-xl transition-all ${
                  appMode === "rider" ? "bg-emerald-50 border-2 border-emerald-500" : "bg-gray-50 border-2 border-transparent"
                }`}
              >
                <div className="w-12 h-12 bg-emerald-100 rounded-full flex items-center justify-center">
                  <svg className="w-6 h-6 text-emerald-600" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                </div>
                <div className="text-left">
                  <p className="font-semibold text-gray-900">Rider App</p>
                  <p className="text-sm text-gray-500">Book rides and track trips</p>
                </div>
                {appMode === "rider" && (
                  <svg className="w-5 h-5 text-emerald-500 ml-auto" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                )}
              </button>

              <button
                onClick={() => {
                  setAppMode("driver")
                  setShowAppSwitcher(false)
                }}
                className={`w-full flex items-center gap-4 p-4 rounded-xl transition-all ${
                  appMode === "driver" ? "bg-blue-50 border-2 border-blue-500" : "bg-gray-50 border-2 border-transparent"
                }`}
              >
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                  <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
                  </svg>
                </div>
                <div className="text-left">
                  <p className="font-semibold text-gray-900">Driver App</p>
                  <p className="text-sm text-gray-500">Accept rides and earn money</p>
                </div>
                {appMode === "driver" && (
                  <svg className="w-5 h-5 text-blue-500 ml-auto" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                )}
              </button>

              <button
                onClick={() => {
                  setAppMode("admin")
                  setShowAppSwitcher(false)
                }}
                className={`w-full flex items-center gap-4 p-4 rounded-xl transition-all ${
                  appMode === "admin" ? "bg-purple-50 border-2 border-purple-500" : "bg-gray-50 border-2 border-transparent"
                }`}
              >
                <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
                  <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
                <div className="text-left">
                  <p className="font-semibold text-gray-900">Admin Dashboard</p>
                  <p className="text-sm text-gray-500">Manage users, drivers, trips</p>
                </div>
                {appMode === "admin" && (
                  <svg className="w-5 h-5 text-purple-500 ml-auto" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                )}
              </button>
            </div>

            <button
              onClick={() => setShowAppSwitcher(false)}
              className="w-full mt-4 py-3 text-gray-600 font-medium"
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

function NavItem({ 
  icon, 
  label, 
  active, 
  onClick 
}: { 
  icon: React.ReactNode
  label: string
  active: boolean
  onClick: () => void 
}) {
  return (
    <button
      onClick={onClick}
      className={`flex flex-col items-center gap-1 px-4 py-2 rounded-xl transition-all ${
        active 
          ? "text-emerald-600 bg-emerald-50" 
          : "text-gray-500 hover:text-gray-700"
      }`}
    >
      <span className={active ? "scale-110" : ""}>{icon}</span>
      <span className="text-xs font-medium">{label}</span>
    </button>
  )
}

// Icons
function HomeIcon() {
  return (
    <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
    </svg>
  )
}

function ActivityIcon() {
  return (
    <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  )
}

function PaymentsIcon() {
  return (
    <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
    </svg>
  )
}

function AccountIcon() {
  return (
    <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
    </svg>
  )
}
