"use client"

import { useState, useEffect } from "react"
import { GlideWaySplash } from "./glideway-splash"
import { PhoneLoginScreen } from "./screens/login-screen"
import { HomeScreen } from "./screens/home-screen"
import { ActivityScreen } from "./screens/activity-screen"
import { PaymentsScreen } from "./screens/payments-screen"
import { AccountScreen } from "./screens/account-screen"
import { DriverApp } from "./screens/driver-app"
import { AdminDashboard } from "./screens/admin-dashboard"
import { BecomeDriverScreen } from "./screens/become-driver-screen"

type AppMode = "rider" | "driver" | "admin"
type Screen = "splash" | "login" | "register" | "become-driver" | "home" | "activity" | "payments" | "account"

export function GlideWayMobileApp() {
  const [appMode, setAppMode] = useState<AppMode>("rider")
  const [currentScreen, setCurrentScreen] = useState<Screen>("splash")
  const [isLoggedIn, setIsLoggedIn] = useState(false)
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

  // Auto-advance from splash after 3 seconds
  useEffect(() => {
    if (currentScreen === "splash") {
      const timer = setTimeout(() => {
        // Check if user is already logged in (could check localStorage here)
        const savedLogin = typeof window !== 'undefined' && localStorage.getItem('glideway_logged_in')
        if (savedLogin === 'true') {
          setIsLoggedIn(true)
          setCurrentScreen("home")
        }
      }, 3500)
      return () => clearTimeout(timer)
    }
  }, [currentScreen])

  const handleGetStarted = () => {
    setCurrentScreen("register")
  }

  const handleLogin = () => {
    setCurrentScreen("login")
  }

  const handleBecomeDriver = () => {
    setCurrentScreen("become-driver")
  }

  const handleLoginComplete = (identifier: string) => {
    console.log("[v0] Login completed with:", identifier)
    setIsLoggedIn(true)
    if (typeof window !== 'undefined') {
      localStorage.setItem('glideway_logged_in', 'true')
    }
    setCurrentScreen("home")
  }

  const handleLogout = () => {
    setIsLoggedIn(false)
    if (typeof window !== 'undefined') {
      localStorage.removeItem('glideway_logged_in')
    }
    setCurrentScreen("splash")
  }

  const renderScreen = () => {
    // Show splash screen
    if (currentScreen === "splash") {
      return (
        <GlideWaySplash 
          onGetStarted={handleGetStarted}
          onLogin={handleLogin}
        />
      )
    }

    // Show login/register screen
    if (currentScreen === "login" || currentScreen === "register") {
      return (
        <PhoneLoginScreen 
          onBack={() => setCurrentScreen("splash")}
          onContinue={handleLoginComplete}
          onBecomeDriver={handleBecomeDriver}
        />
      )
    }

    // Show become a driver screen
    if (currentScreen === "become-driver") {
      return (
        <BecomeDriverScreen
          onBack={() => setCurrentScreen("login")}
          onComplete={() => {
            setAppMode("driver")
            setIsLoggedIn(true)
            if (typeof window !== 'undefined') {
              localStorage.setItem('glideway_logged_in', 'true')
            }
          }}
        />
      )
    }

    // Driver mode
    if (appMode === "driver") {
      return <DriverApp />
    }
    
    // Admin mode
    if (appMode === "admin") {
      return <AdminDashboard />
    }

    // Rider mode screens
    switch (currentScreen) {
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
        return <AccountScreen onLogout={handleLogout} />
      default:
        return <HomeScreen activeRide={activeRide} setActiveRide={setActiveRide} isTracking={isTracking} setIsTracking={setIsTracking} />
    }
  }

  // Hide navigation on certain screens
  const showBottomNav = isLoggedIn && 
    appMode === "rider" && 
    !isTracking && 
    currentScreen !== "splash" && 
    currentScreen !== "login" && 
    currentScreen !== "register"

  return (
    <div className="flex flex-col h-screen max-w-md mx-auto bg-white relative overflow-hidden shadow-2xl">
      {/* Status Bar - Only show when logged in */}
      {isLoggedIn && currentScreen !== "splash" && (
        <div className="bg-white text-gray-900 px-4 py-2 flex items-center justify-between text-xs font-medium border-b border-gray-200">
          <span>9:41</span>
          <button 
            onClick={() => setShowAppSwitcher(true)}
            className="px-2 py-0.5 bg-green-100 text-green-700 rounded text-xs font-medium"
          >
            {appMode === "rider" ? "Rider" : appMode === "driver" ? "Driver" : "Admin"}
          </button>
          <div className="flex items-center gap-1">
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
      )}

      {/* Main Content */}
      <div className="flex-1 overflow-hidden">
        {renderScreen()}
      </div>

      {/* Bottom Navigation */}
      {showBottomNav && (
        <nav className="bg-white border-t border-gray-200 px-2 py-2">
          <div className="flex items-center justify-around">
            <NavItem 
              icon={<HomeIcon />} 
              label="Home" 
              active={currentScreen === "home"} 
              onClick={() => setCurrentScreen("home")} 
            />
            <NavItem 
              icon={<ActivityIcon />} 
              label="Activity" 
              active={currentScreen === "activity"} 
              onClick={() => setCurrentScreen("activity")} 
            />
            <NavItem 
              icon={<PaymentsIcon />} 
              label="Payment" 
              active={currentScreen === "payments"} 
              onClick={() => setCurrentScreen("payments")} 
            />
            <NavItem 
              icon={<AccountIcon />} 
              label="Account" 
              active={currentScreen === "account"} 
              onClick={() => setCurrentScreen("account")} 
            />
          </div>
        </nav>
      )}

      {/* App Switcher Modal */}
      {showAppSwitcher && (
        <div className="absolute inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white border border-gray-200 rounded-2xl p-6 w-full max-w-sm shadow-xl">
            <h3 className="font-bold text-lg text-gray-900 mb-4">Switch App Mode</h3>
            <div className="space-y-2">
              <button
                onClick={() => {
                  setAppMode("rider")
                  setShowAppSwitcher(false)
                }}
                className={`w-full flex items-center gap-4 p-4 rounded-xl transition-all ${
                  appMode === "rider" ? "bg-green-50 border-2 border-green-500" : "bg-gray-100 border-2 border-transparent"
                }`}
              >
                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                  <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                </div>
                <div className="text-left">
                  <p className="font-semibold text-gray-900">Rider App</p>
                  <p className="text-sm text-gray-500">Book rides and track trips</p>
                </div>
              </button>

              <button
                onClick={() => {
                  setAppMode("driver")
                  setShowAppSwitcher(false)
                }}
                className={`w-full flex items-center gap-4 p-4 rounded-xl transition-all ${
                  appMode === "driver" ? "bg-blue-50 border-2 border-blue-500" : "bg-gray-100 border-2 border-transparent"
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
              </button>

              <button
                onClick={() => {
                  setAppMode("admin")
                  setShowAppSwitcher(false)
                }}
                className={`w-full flex items-center gap-4 p-4 rounded-xl transition-all ${
                  appMode === "admin" ? "bg-amber-50 border-2 border-amber-500" : "bg-gray-100 border-2 border-transparent"
                }`}
              >
                <div className="w-12 h-12 bg-amber-100 rounded-full flex items-center justify-center">
                  <svg className="w-6 h-6 text-amber-600" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
                <div className="text-left">
                  <p className="font-semibold text-gray-900">Admin Dashboard</p>
                  <p className="text-sm text-gray-500">Manage users, drivers, trips</p>
                </div>
              </button>
            </div>

            <button
              onClick={() => setShowAppSwitcher(false)}
              className="w-full mt-4 py-3 text-gray-500 hover:text-gray-900 font-medium transition-colors"
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
          ? "text-green-600 bg-green-50" 
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
