"use client"

import { useState } from "react"

interface RideRequest {
  id: string
  passenger: { name: string; rating: number }
  pickup: string
  dropoff: string
  fare: number
  distance: string
  duration: string
}

interface ActiveTrip {
  id: string
  status: "pickup" | "in_trip" | "completed"
  passenger: { name: string; rating: number; phone: string }
  pickup: string
  dropoff: string
  fare: number
}

export function DriverApp() {
  const [screen, setScreen] = useState<"home" | "earnings" | "profile" | "register">("home")
  const [isOnline, setIsOnline] = useState(false)
  const [incomingRide, setIncomingRide] = useState<RideRequest | null>(null)
  const [activeTrip, setActiveTrip] = useState<ActiveTrip | null>(null)
  const [showChat, setShowChat] = useState(false)
  const [chatMessage, setChatMessage] = useState("")
  const [messages, setMessages] = useState<{ from: string; text: string }[]>([])

  // Sample earnings data
  const earnings = {
    today: 127.50,
    week: 892.30,
    month: 3245.80,
    trips: { today: 8, week: 47, month: 198 },
  }

  // Sample ride request
  const simulateRideRequest = () => {
    if (isOnline && !activeTrip) {
      setIncomingRide({
        id: `ride-${Date.now()}`,
        passenger: { name: "Sarah Johnson", rating: 4.8 },
        pickup: "123 Main St, Colorado Springs",
        dropoff: "456 Oak Ave, Colorado Springs",
        fare: 18.50,
        distance: "4.2 mi",
        duration: "12 min",
      })
    }
  }

  const acceptRide = () => {
    if (incomingRide) {
      setActiveTrip({
        id: incomingRide.id,
        status: "pickup",
        passenger: { ...incomingRide.passenger, phone: "+1 (555) 987-6543" },
        pickup: incomingRide.pickup,
        dropoff: incomingRide.dropoff,
        fare: incomingRide.fare,
      })
      setIncomingRide(null)
    }
  }

  const rejectRide = () => setIncomingRide(null)

  const updateTripStatus = () => {
    if (activeTrip) {
      if (activeTrip.status === "pickup") {
        setActiveTrip({ ...activeTrip, status: "in_trip" })
      } else if (activeTrip.status === "in_trip") {
        setActiveTrip({ ...activeTrip, status: "completed" })
      }
    }
  }

  const completeTrip = () => {
    setActiveTrip(null)
  }

  const sendMessage = () => {
    if (chatMessage.trim()) {
      setMessages([...messages, { from: "driver", text: chatMessage }])
      setChatMessage("")
      setTimeout(() => {
        setMessages((m) => [...m, { from: "passenger", text: "Thanks for the update!" }])
      }, 1500)
    }
  }

  // Registration screen
  if (screen === "register") {
    return <DriverRegistration onBack={() => setScreen("home")} />
  }

  return (
    <div className="flex flex-col h-full bg-gray-50">
      {/* Header */}
      <div className="bg-emerald-600 text-white px-4 py-5 pb-8">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-xl font-bold">GlideWay Driver</h1>
          <button
            onClick={() => setIsOnline(!isOnline)}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
              isOnline ? "bg-white text-emerald-600" : "bg-emerald-700 text-white"
            }`}
          >
            {isOnline ? "Online" : "Offline"}
          </button>
        </div>
        
        {/* Today's earnings */}
        <div className="bg-emerald-700/50 rounded-xl p-4">
          <p className="text-emerald-200 text-sm">Today&apos;s earnings</p>
          <p className="text-3xl font-bold">${earnings.today.toFixed(2)}</p>
          <p className="text-emerald-200 text-sm">{earnings.trips.today} trips completed</p>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 -mt-4 bg-white rounded-t-3xl overflow-y-auto">
        {/* Active Trip View */}
        {activeTrip ? (
          <div className="p-4">
            <div className="mb-4">
              <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm font-medium ${
                activeTrip.status === "pickup" ? "bg-yellow-100 text-yellow-700" :
                activeTrip.status === "in_trip" ? "bg-blue-100 text-blue-700" :
                "bg-emerald-100 text-emerald-700"
              }`}>
                <span className="w-2 h-2 rounded-full bg-current animate-pulse" />
                {activeTrip.status === "pickup" && "Heading to pickup"}
                {activeTrip.status === "in_trip" && "Trip in progress"}
                {activeTrip.status === "completed" && "Trip completed"}
              </div>
            </div>

            {/* Passenger info */}
            <div className="bg-gray-50 rounded-xl p-4 mb-4">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-12 h-12 bg-emerald-200 rounded-full flex items-center justify-center text-lg font-bold text-emerald-700">
                  {activeTrip.passenger.name[0]}
                </div>
                <div className="flex-1">
                  <p className="font-semibold text-gray-900">{activeTrip.passenger.name}</p>
                  <div className="flex items-center gap-1">
                    <svg className="w-4 h-4 text-yellow-500" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                    <span className="text-sm text-gray-600">{activeTrip.passenger.rating}</span>
                  </div>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => setShowChat(true)}
                    className="w-10 h-10 bg-emerald-100 rounded-full flex items-center justify-center"
                  >
                    <svg className="w-5 h-5 text-emerald-600" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                    </svg>
                  </button>
                  <a
                    href={`tel:${activeTrip.passenger.phone}`}
                    className="w-10 h-10 bg-emerald-100 rounded-full flex items-center justify-center"
                  >
                    <svg className="w-5 h-5 text-emerald-600" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                    </svg>
                  </a>
                </div>
              </div>
            </div>

            {/* Trip route */}
            <div className="space-y-3 mb-4">
              <div className="flex items-start gap-3">
                <div className="w-3 h-3 bg-emerald-500 rounded-full mt-1.5" />
                <div>
                  <p className="text-xs text-gray-500">Pickup</p>
                  <p className="text-sm font-medium text-gray-900">{activeTrip.pickup}</p>
                </div>
              </div>
              <div className="ml-1.5 w-0.5 h-4 bg-gray-200" />
              <div className="flex items-start gap-3">
                <div className="w-3 h-3 bg-red-500 rounded-sm mt-1.5" />
                <div>
                  <p className="text-xs text-gray-500">Dropoff</p>
                  <p className="text-sm font-medium text-gray-900">{activeTrip.dropoff}</p>
                </div>
              </div>
            </div>

            {/* Navigate button */}
            <button className="w-full py-3 bg-blue-500 text-white rounded-xl font-medium flex items-center justify-center gap-2 mb-3">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
              </svg>
              Navigate
            </button>

            {/* Action button */}
            {activeTrip.status === "completed" ? (
              <button
                onClick={completeTrip}
                className="w-full py-4 bg-emerald-500 text-white rounded-xl font-bold"
              >
                Complete - ${activeTrip.fare.toFixed(2)}
              </button>
            ) : (
              <button
                onClick={updateTripStatus}
                className="w-full py-4 bg-emerald-500 text-white rounded-xl font-bold"
              >
                {activeTrip.status === "pickup" ? "Arrived at Pickup" : "Complete Trip"}
              </button>
            )}
          </div>
        ) : (
          /* Default home view */
          <div className="p-4">
            {isOnline ? (
              <div className="text-center py-12">
                <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-emerald-500 animate-pulse" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  </svg>
                </div>
                <h3 className="font-semibold text-gray-900 mb-1">Looking for rides</h3>
                <p className="text-gray-500 text-sm mb-4">You will be notified when a ride is available</p>
                <button
                  onClick={simulateRideRequest}
                  className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg text-sm"
                >
                  Simulate ride request
                </button>
              </div>
            ) : (
              <div className="text-center py-12">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" />
                  </svg>
                </div>
                <h3 className="font-semibold text-gray-900 mb-1">You&apos;re offline</h3>
                <p className="text-gray-500 text-sm">Go online to start receiving ride requests</p>
              </div>
            )}

            {/* Quick stats */}
            <div className="grid grid-cols-2 gap-3 mt-6">
              <div className="bg-gray-50 rounded-xl p-4">
                <p className="text-gray-500 text-sm">This week</p>
                <p className="text-xl font-bold text-gray-900">${earnings.week.toFixed(2)}</p>
                <p className="text-xs text-gray-500">{earnings.trips.week} trips</p>
              </div>
              <div className="bg-gray-50 rounded-xl p-4">
                <p className="text-gray-500 text-sm">This month</p>
                <p className="text-xl font-bold text-gray-900">${earnings.month.toFixed(2)}</p>
                <p className="text-xs text-gray-500">{earnings.trips.month} trips</p>
              </div>
            </div>

            {/* Payout history */}
            <div className="mt-6">
              <h3 className="font-semibold text-gray-900 mb-3">Recent payouts</h3>
              <div className="space-y-2">
                {[
                  { date: "Apr 15", amount: 892.30 },
                  { date: "Apr 8", amount: 756.50 },
                  { date: "Apr 1", amount: 1024.80 },
                ].map((payout, i) => (
                  <div key={i} className="flex justify-between items-center p-3 bg-gray-50 rounded-xl">
                    <span className="text-sm text-gray-600">{payout.date}</span>
                    <span className="font-semibold text-emerald-600">${payout.amount.toFixed(2)}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Bottom Navigation */}
      <div className="bg-white border-t border-gray-200 px-4 py-3">
        <div className="flex justify-around">
          {[
            { id: "home", icon: "M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6", label: "Home" },
            { id: "earnings", icon: "M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z", label: "Earnings" },
            { id: "profile", icon: "M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z", label: "Profile" },
          ].map((item) => (
            <button
              key={item.id}
              onClick={() => setScreen(item.id as "home" | "earnings" | "profile")}
              className={`flex flex-col items-center gap-1 px-4 py-1 ${
                screen === item.id ? "text-emerald-600" : "text-gray-400"
              }`}
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d={item.icon} />
              </svg>
              <span className="text-xs">{item.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Incoming Ride Request Modal */}
      {incomingRide && (
        <div className="absolute inset-0 bg-black/50 z-50 flex items-end">
          <div className="bg-white w-full rounded-t-3xl p-4 animate-slide-up">
            <div className="w-12 h-1 bg-gray-300 rounded-full mx-auto mb-4" />
            
            <div className="text-center mb-4">
              <p className="text-sm text-gray-500">New ride request</p>
              <p className="text-2xl font-bold text-emerald-600">${incomingRide.fare.toFixed(2)}</p>
            </div>

            <div className="flex justify-center gap-6 mb-4">
              <div className="text-center">
                <p className="text-lg font-semibold text-gray-900">{incomingRide.distance}</p>
                <p className="text-xs text-gray-500">Distance</p>
              </div>
              <div className="text-center">
                <p className="text-lg font-semibold text-gray-900">{incomingRide.duration}</p>
                <p className="text-xs text-gray-500">Duration</p>
              </div>
            </div>

            <div className="bg-gray-50 rounded-xl p-3 mb-4">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-10 h-10 bg-emerald-200 rounded-full flex items-center justify-center font-bold text-emerald-700">
                  {incomingRide.passenger.name[0]}
                </div>
                <div>
                  <p className="font-medium text-gray-900">{incomingRide.passenger.name}</p>
                  <div className="flex items-center gap-1">
                    <svg className="w-4 h-4 text-yellow-500" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                    <span className="text-sm text-gray-600">{incomingRide.passenger.rating}</span>
                  </div>
                </div>
              </div>

              <div className="space-y-2 text-sm">
                <div className="flex items-start gap-2">
                  <div className="w-2 h-2 bg-emerald-500 rounded-full mt-1.5" />
                  <p className="text-gray-700">{incomingRide.pickup}</p>
                </div>
                <div className="flex items-start gap-2">
                  <div className="w-2 h-2 bg-red-500 rounded-sm mt-1.5" />
                  <p className="text-gray-700">{incomingRide.dropoff}</p>
                </div>
              </div>
            </div>

            <div className="flex gap-3">
              <button
                onClick={rejectRide}
                className="flex-1 py-4 border-2 border-gray-200 text-gray-700 rounded-xl font-semibold"
              >
                Decline
              </button>
              <button
                onClick={acceptRide}
                className="flex-1 py-4 bg-emerald-500 text-white rounded-xl font-semibold"
              >
                Accept
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Chat Modal */}
      {showChat && (
        <div className="absolute inset-0 bg-black/50 z-50 flex items-end">
          <div className="bg-white w-full rounded-t-3xl max-h-[80vh] flex flex-col">
            <div className="p-4 border-b border-gray-100 flex items-center justify-between">
              <h3 className="font-semibold">Chat with passenger</h3>
              <button onClick={() => setShowChat(false)} className="p-2">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <div className="flex-1 p-4 overflow-y-auto min-h-[200px]">
              {messages.length === 0 && (
                <p className="text-center text-gray-400 text-sm">Send a message to your passenger</p>
              )}
              {messages.map((msg, i) => (
                <div key={i} className={`mb-2 ${msg.from === "driver" ? "text-right" : "text-left"}`}>
                  <span className={`inline-block px-4 py-2 rounded-2xl text-sm ${
                    msg.from === "driver" ? "bg-emerald-500 text-white" : "bg-gray-100 text-gray-900"
                  }`}>
                    {msg.text}
                  </span>
                </div>
              ))}
            </div>
            <div className="p-4 border-t border-gray-100 flex gap-2">
              <input
                type="text"
                value={chatMessage}
                onChange={(e) => setChatMessage(e.target.value)}
                placeholder="Type a message..."
                className="flex-1 px-4 py-2 bg-gray-100 rounded-full text-sm focus:outline-none"
                onKeyPress={(e) => e.key === "Enter" && sendMessage()}
              />
              <button
                onClick={sendMessage}
                className="w-10 h-10 bg-emerald-500 rounded-full flex items-center justify-center"
              >
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

// Driver Registration Component
function DriverRegistration({ onBack }: { onBack: () => void }) {
  const [step, setStep] = useState(1)
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    licenseNumber: "",
    licenseExpiry: "",
    vehicleMake: "",
    vehicleModel: "",
    vehicleYear: "",
    vehiclePlate: "",
    vehicleColor: "",
  })

  const updateField = (field: string, value: string) => {
    setFormData({ ...formData, [field]: value })
  }

  return (
    <div className="flex flex-col h-full bg-white">
      {/* Header */}
      <div className="bg-emerald-600 text-white px-4 py-5">
        <div className="flex items-center gap-3 mb-4">
          <button onClick={onBack} className="p-1">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <h1 className="text-xl font-bold">Become a Driver</h1>
        </div>
        
        {/* Progress */}
        <div className="flex gap-2">
          {[1, 2, 3, 4].map((s) => (
            <div
              key={s}
              className={`flex-1 h-1 rounded-full ${s <= step ? "bg-white" : "bg-emerald-400"}`}
            />
          ))}
        </div>
      </div>

      {/* Form Content */}
      <div className="flex-1 p-4 overflow-y-auto">
        {step === 1 && (
          <div>
            <h2 className="text-lg font-semibold mb-4">Personal Information</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">First Name</label>
                <input
                  type="text"
                  value={formData.firstName}
                  onChange={(e) => updateField("firstName", e.target.value)}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  placeholder="John"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Last Name</label>
                <input
                  type="text"
                  value={formData.lastName}
                  onChange={(e) => updateField("lastName", e.target.value)}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  placeholder="Doe"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => updateField("email", e.target.value)}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  placeholder="john@example.com"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
                <input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => updateField("phone", e.target.value)}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  placeholder="+1 (555) 123-4567"
                />
              </div>
            </div>
          </div>
        )}

        {step === 2 && (
          <div>
            <h2 className="text-lg font-semibold mb-4">Driver&apos;s License</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">License Number</label>
                <input
                  type="text"
                  value={formData.licenseNumber}
                  onChange={(e) => updateField("licenseNumber", e.target.value)}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  placeholder="DL123456789"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Expiration Date</label>
                <input
                  type="date"
                  value={formData.licenseExpiry}
                  onChange={(e) => updateField("licenseExpiry", e.target.value)}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>
              <div className="border-2 border-dashed border-gray-300 rounded-xl p-6 text-center">
                <svg className="w-12 h-12 text-gray-400 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                <p className="text-gray-600 font-medium">Upload license photo</p>
                <p className="text-gray-400 text-sm">Front and back</p>
              </div>
            </div>
          </div>
        )}

        {step === 3 && (
          <div>
            <h2 className="text-lg font-semibold mb-4">Vehicle Information</h2>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Make</label>
                  <input
                    type="text"
                    value={formData.vehicleMake}
                    onChange={(e) => updateField("vehicleMake", e.target.value)}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    placeholder="Toyota"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Model</label>
                  <input
                    type="text"
                    value={formData.vehicleModel}
                    onChange={(e) => updateField("vehicleModel", e.target.value)}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    placeholder="Camry"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Year</label>
                  <input
                    type="text"
                    value={formData.vehicleYear}
                    onChange={(e) => updateField("vehicleYear", e.target.value)}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    placeholder="2022"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Color</label>
                  <input
                    type="text"
                    value={formData.vehicleColor}
                    onChange={(e) => updateField("vehicleColor", e.target.value)}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    placeholder="White"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">License Plate</label>
                <input
                  type="text"
                  value={formData.vehiclePlate}
                  onChange={(e) => updateField("vehiclePlate", e.target.value)}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  placeholder="ABC-1234"
                />
              </div>
            </div>
          </div>
        )}

        {step === 4 && (
          <div>
            <h2 className="text-lg font-semibold mb-4">Background Check</h2>
            <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4 mb-4">
              <div className="flex items-start gap-3">
                <svg className="w-6 h-6 text-yellow-600 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <div>
                  <p className="font-medium text-yellow-800">Background check required</p>
                  <p className="text-sm text-yellow-700">We will run a background check to ensure safety. This typically takes 3-5 business days.</p>
                </div>
              </div>
            </div>
            
            <div className="space-y-3">
              <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-xl">
                <input type="checkbox" id="terms" className="w-5 h-5 text-emerald-500 rounded" />
                <label htmlFor="terms" className="text-sm text-gray-700">
                  I agree to the Driver Terms & Conditions
                </label>
              </div>
              <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-xl">
                <input type="checkbox" id="privacy" className="w-5 h-5 text-emerald-500 rounded" />
                <label htmlFor="privacy" className="text-sm text-gray-700">
                  I agree to the Privacy Policy
                </label>
              </div>
              <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-xl">
                <input type="checkbox" id="background" className="w-5 h-5 text-emerald-500 rounded" />
                <label htmlFor="background" className="text-sm text-gray-700">
                  I authorize the background check
                </label>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Navigation */}
      <div className="p-4 border-t border-gray-100 flex gap-3">
        {step > 1 && (
          <button
            onClick={() => setStep(step - 1)}
            className="flex-1 py-4 border-2 border-gray-200 text-gray-700 rounded-xl font-semibold"
          >
            Back
          </button>
        )}
        <button
          onClick={() => (step < 4 ? setStep(step + 1) : onBack())}
          className="flex-1 py-4 bg-emerald-500 text-white rounded-xl font-semibold"
        >
          {step === 4 ? "Submit Application" : "Continue"}
        </button>
      </div>
    </div>
  )
}
