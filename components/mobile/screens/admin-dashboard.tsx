"use client"

import { useState } from "react"

// Sample data
const SAMPLE_USERS = [
  { id: "u1", name: "Sarah Johnson", email: "sarah@email.com", trips: 47, status: "active", joined: "Jan 2024" },
  { id: "u2", name: "Mike Chen", email: "mike@email.com", trips: 23, status: "active", joined: "Feb 2024" },
  { id: "u3", name: "Emily Davis", email: "emily@email.com", trips: 8, status: "suspended", joined: "Mar 2024" },
]

const SAMPLE_DRIVERS = [
  { id: "d1", name: "Michael Johnson", email: "michael@email.com", rating: 4.9, trips: 1847, status: "approved", vehicle: "Toyota Camry" },
  { id: "d2", name: "Jennifer Lee", email: "jennifer@email.com", rating: 4.7, trips: 562, status: "pending", vehicle: "Honda Accord" },
  { id: "d3", name: "Robert Wilson", email: "robert@email.com", rating: 4.8, trips: 923, status: "approved", vehicle: "Nissan Altima" },
]

const SAMPLE_TRIPS = [
  { id: "t1", user: "Sarah Johnson", driver: "Michael Johnson", pickup: "123 Main St", dropoff: "456 Oak Ave", fare: 18.50, status: "completed", date: "Apr 24" },
  { id: "t2", user: "Mike Chen", driver: "Jennifer Lee", pickup: "789 Pine Rd", dropoff: "321 Elm St", fare: 24.75, status: "in_progress", date: "Apr 24" },
  { id: "t3", user: "Emily Davis", driver: "Robert Wilson", pickup: "555 Cedar Ln", dropoff: "888 Maple Dr", fare: 12.00, status: "cancelled", date: "Apr 23" },
]

const SAMPLE_TICKETS = [
  { id: "tk1", user: "Sarah Johnson", subject: "Charged twice", status: "open", priority: "high", date: "Apr 24" },
  { id: "tk2", user: "Mike Chen", subject: "Driver was rude", status: "in_progress", priority: "medium", date: "Apr 23" },
  { id: "tk3", user: "Emily Davis", subject: "Lost item in car", status: "resolved", priority: "low", date: "Apr 22" },
]

export function AdminDashboard() {
  const [activeTab, setActiveTab] = useState<"overview" | "users" | "drivers" | "trips" | "payments" | "support" | "reports">("overview")
  const [selectedUser, setSelectedUser] = useState<string | null>(null)
  const [selectedDriver, setSelectedDriver] = useState<string | null>(null)
  const [selectedTicket, setSelectedTicket] = useState<string | null>(null)
  const [ticketResponse, setTicketResponse] = useState("")

  // Stats
  const stats = {
    totalUsers: 12847,
    totalDrivers: 892,
    activeTrips: 156,
    todayRevenue: 8942.50,
    weekRevenue: 67234.80,
    monthRevenue: 284592.30,
    openTickets: 23,
  }

  return (
    <div className="flex flex-col h-full bg-gray-100">
      {/* Header */}
      <div className="bg-emerald-600 text-white px-4 py-4">
        <div className="flex items-center justify-between">
          <h1 className="text-xl font-bold">GlideWay Admin</h1>
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 bg-emerald-300 rounded-full animate-pulse" />
            <span className="text-sm">Live</span>
          </div>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="bg-white border-b border-gray-200 px-2 overflow-x-auto">
        <div className="flex gap-1">
          {[
            { id: "overview", label: "Overview" },
            { id: "users", label: "Users" },
            { id: "drivers", label: "Drivers" },
            { id: "trips", label: "Trips" },
            { id: "payments", label: "Payments" },
            { id: "support", label: "Support" },
            { id: "reports", label: "Reports" },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as typeof activeTab)}
              className={`px-4 py-3 text-sm font-medium whitespace-nowrap border-b-2 transition-colors ${
                activeTab === tab.id
                  ? "border-emerald-500 text-emerald-600"
                  : "border-transparent text-gray-500 hover:text-gray-700"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-y-auto p-4">
        {/* Overview Tab */}
        {activeTab === "overview" && (
          <div className="space-y-4">
            {/* Key Metrics */}
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-white rounded-xl p-4 shadow-sm">
                <p className="text-gray-500 text-xs">Total Users</p>
                <p className="text-2xl font-bold text-gray-900">{stats.totalUsers.toLocaleString()}</p>
              </div>
              <div className="bg-white rounded-xl p-4 shadow-sm">
                <p className="text-gray-500 text-xs">Total Drivers</p>
                <p className="text-2xl font-bold text-gray-900">{stats.totalDrivers.toLocaleString()}</p>
              </div>
              <div className="bg-white rounded-xl p-4 shadow-sm">
                <p className="text-gray-500 text-xs">Active Trips</p>
                <p className="text-2xl font-bold text-emerald-600">{stats.activeTrips}</p>
              </div>
              <div className="bg-white rounded-xl p-4 shadow-sm">
                <p className="text-gray-500 text-xs">Open Tickets</p>
                <p className="text-2xl font-bold text-orange-600">{stats.openTickets}</p>
              </div>
            </div>

            {/* Revenue */}
            <div className="bg-white rounded-xl p-4 shadow-sm">
              <h3 className="font-semibold text-gray-900 mb-3">Revenue</h3>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Today</span>
                  <span className="font-bold text-emerald-600">${stats.todayRevenue.toLocaleString()}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">This Week</span>
                  <span className="font-bold text-gray-900">${stats.weekRevenue.toLocaleString()}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">This Month</span>
                  <span className="font-bold text-gray-900">${stats.monthRevenue.toLocaleString()}</span>
                </div>
              </div>
            </div>

            {/* Recent Activity */}
            <div className="bg-white rounded-xl p-4 shadow-sm">
              <h3 className="font-semibold text-gray-900 mb-3">Recent Activity</h3>
              <div className="space-y-3">
                {[
                  { text: "New driver application from Jennifer Lee", time: "2m ago", type: "driver" },
                  { text: "Trip completed: Sarah J. to Downtown", time: "5m ago", type: "trip" },
                  { text: "Support ticket opened: Billing issue", time: "12m ago", type: "support" },
                  { text: "New user registered: Mark Smith", time: "18m ago", type: "user" },
                ].map((activity, i) => (
                  <div key={i} className="flex items-start gap-3">
                    <div className={`w-2 h-2 rounded-full mt-2 ${
                      activity.type === "driver" ? "bg-blue-500" :
                      activity.type === "trip" ? "bg-emerald-500" :
                      activity.type === "support" ? "bg-orange-500" : "bg-purple-500"
                    }`} />
                    <div className="flex-1">
                      <p className="text-sm text-gray-700">{activity.text}</p>
                      <p className="text-xs text-gray-400">{activity.time}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Users Tab */}
        {activeTab === "users" && (
          <div className="space-y-3">
            <div className="flex gap-2 mb-4">
              <input
                type="text"
                placeholder="Search users..."
                className="flex-1 px-4 py-2 bg-white rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
              <button className="px-4 py-2 bg-emerald-500 text-white rounded-xl text-sm font-medium">
                Search
              </button>
            </div>

            {SAMPLE_USERS.map((user) => (
              <div key={user.id} className="bg-white rounded-xl p-4 shadow-sm">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-emerald-100 rounded-full flex items-center justify-center font-bold text-emerald-700">
                    {user.name[0]}
                  </div>
                  <div className="flex-1">
                    <p className="font-medium text-gray-900">{user.name}</p>
                    <p className="text-xs text-gray-500">{user.email}</p>
                  </div>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    user.status === "active" ? "bg-emerald-100 text-emerald-700" : "bg-red-100 text-red-700"
                  }`}>
                    {user.status}
                  </span>
                </div>
                <div className="flex gap-4 mt-3 text-xs text-gray-500">
                  <span>{user.trips} trips</span>
                  <span>Joined {user.joined}</span>
                </div>
                <div className="flex gap-2 mt-3">
                  <button
                    onClick={() => setSelectedUser(user.id)}
                    className="flex-1 py-2 bg-gray-100 text-gray-700 rounded-lg text-sm font-medium"
                  >
                    View Details
                  </button>
                  <button className={`flex-1 py-2 rounded-lg text-sm font-medium ${
                    user.status === "active"
                      ? "bg-red-100 text-red-700"
                      : "bg-emerald-100 text-emerald-700"
                  }`}>
                    {user.status === "active" ? "Suspend" : "Activate"}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Drivers Tab */}
        {activeTab === "drivers" && (
          <div className="space-y-3">
            <div className="flex gap-2 mb-4">
              <select className="flex-1 px-4 py-2 bg-white rounded-xl border border-gray-200 text-sm focus:outline-none">
                <option>All Drivers</option>
                <option>Pending Approval</option>
                <option>Approved</option>
                <option>Suspended</option>
              </select>
            </div>

            {SAMPLE_DRIVERS.map((driver) => (
              <div key={driver.id} className="bg-white rounded-xl p-4 shadow-sm">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center font-bold text-blue-700">
                    {driver.name[0]}
                  </div>
                  <div className="flex-1">
                    <p className="font-medium text-gray-900">{driver.name}</p>
                    <div className="flex items-center gap-1">
                      <svg className="w-4 h-4 text-yellow-500" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                      <span className="text-xs text-gray-600">{driver.rating}</span>
                    </div>
                  </div>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    driver.status === "approved" ? "bg-emerald-100 text-emerald-700" :
                    driver.status === "pending" ? "bg-yellow-100 text-yellow-700" : "bg-red-100 text-red-700"
                  }`}>
                    {driver.status}
                  </span>
                </div>
                <div className="flex gap-4 mt-3 text-xs text-gray-500">
                  <span>{driver.trips} trips</span>
                  <span>{driver.vehicle}</span>
                </div>
                <div className="flex gap-2 mt-3">
                  <button
                    onClick={() => setSelectedDriver(driver.id)}
                    className="flex-1 py-2 bg-gray-100 text-gray-700 rounded-lg text-sm font-medium"
                  >
                    View Details
                  </button>
                  {driver.status === "pending" && (
                    <>
                      <button className="flex-1 py-2 bg-emerald-500 text-white rounded-lg text-sm font-medium">
                        Approve
                      </button>
                      <button className="flex-1 py-2 bg-red-100 text-red-700 rounded-lg text-sm font-medium">
                        Reject
                      </button>
                    </>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Trips Tab */}
        {activeTab === "trips" && (
          <div className="space-y-3">
            <div className="flex gap-2 mb-4">
              <select className="flex-1 px-4 py-2 bg-white rounded-xl border border-gray-200 text-sm focus:outline-none">
                <option>All Trips</option>
                <option>In Progress</option>
                <option>Completed</option>
                <option>Cancelled</option>
              </select>
              <input
                type="date"
                className="px-4 py-2 bg-white rounded-xl border border-gray-200 text-sm focus:outline-none"
              />
            </div>

            {SAMPLE_TRIPS.map((trip) => (
              <div key={trip.id} className="bg-white rounded-xl p-4 shadow-sm">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs text-gray-500">{trip.date}</span>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    trip.status === "completed" ? "bg-emerald-100 text-emerald-700" :
                    trip.status === "in_progress" ? "bg-blue-100 text-blue-700" : "bg-red-100 text-red-700"
                  }`}>
                    {trip.status.replace("_", " ")}
                  </span>
                </div>
                <div className="space-y-2 text-sm">
                  <div className="flex items-start gap-2">
                    <div className="w-2 h-2 bg-emerald-500 rounded-full mt-1.5" />
                    <p className="text-gray-700">{trip.pickup}</p>
                  </div>
                  <div className="flex items-start gap-2">
                    <div className="w-2 h-2 bg-red-500 rounded-sm mt-1.5" />
                    <p className="text-gray-700">{trip.dropoff}</p>
                  </div>
                </div>
                <div className="flex justify-between items-center mt-3 pt-3 border-t border-gray-100">
                  <div className="text-xs text-gray-500">
                    <p>User: {trip.user}</p>
                    <p>Driver: {trip.driver}</p>
                  </div>
                  <p className="font-bold text-emerald-600">${trip.fare.toFixed(2)}</p>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Payments Tab */}
        {activeTab === "payments" && (
          <div className="space-y-4">
            <div className="bg-white rounded-xl p-4 shadow-sm">
              <h3 className="font-semibold text-gray-900 mb-3">Payment Summary</h3>
              <div className="space-y-3">
                <div className="flex justify-between items-center p-3 bg-emerald-50 rounded-lg">
                  <span className="text-gray-700">Total Revenue (MTD)</span>
                  <span className="font-bold text-emerald-600">${stats.monthRevenue.toLocaleString()}</span>
                </div>
                <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                  <span className="text-gray-700">Driver Payouts</span>
                  <span className="font-bold text-gray-900">${(stats.monthRevenue * 0.75).toLocaleString()}</span>
                </div>
                <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                  <span className="text-gray-700">Platform Fee</span>
                  <span className="font-bold text-gray-900">${(stats.monthRevenue * 0.25).toLocaleString()}</span>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl p-4 shadow-sm">
              <h3 className="font-semibold text-gray-900 mb-3">Pending Payouts</h3>
              <div className="space-y-2">
                {SAMPLE_DRIVERS.filter(d => d.status === "approved").map((driver) => (
                  <div key={driver.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center text-sm font-bold text-blue-700">
                        {driver.name[0]}
                      </div>
                      <span className="text-sm text-gray-700">{driver.name}</span>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-gray-900">${(Math.random() * 500 + 100).toFixed(2)}</p>
                      <button className="text-xs text-emerald-600 font-medium">Process</button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Support Tab */}
        {activeTab === "support" && (
          <div className="space-y-3">
            <div className="flex gap-2 mb-4">
              <select className="flex-1 px-4 py-2 bg-white rounded-xl border border-gray-200 text-sm focus:outline-none">
                <option>All Tickets</option>
                <option>Open</option>
                <option>In Progress</option>
                <option>Resolved</option>
              </select>
              <select className="px-4 py-2 bg-white rounded-xl border border-gray-200 text-sm focus:outline-none">
                <option>All Priority</option>
                <option>High</option>
                <option>Medium</option>
                <option>Low</option>
              </select>
            </div>

            {SAMPLE_TICKETS.map((ticket) => (
              <div key={ticket.id} className="bg-white rounded-xl p-4 shadow-sm">
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <p className="font-medium text-gray-900">{ticket.subject}</p>
                    <p className="text-xs text-gray-500">{ticket.user} - {ticket.date}</p>
                  </div>
                  <div className="flex gap-2">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      ticket.priority === "high" ? "bg-red-100 text-red-700" :
                      ticket.priority === "medium" ? "bg-yellow-100 text-yellow-700" : "bg-gray-100 text-gray-700"
                    }`}>
                      {ticket.priority}
                    </span>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      ticket.status === "open" ? "bg-blue-100 text-blue-700" :
                      ticket.status === "in_progress" ? "bg-yellow-100 text-yellow-700" : "bg-emerald-100 text-emerald-700"
                    }`}>
                      {ticket.status.replace("_", " ")}
                    </span>
                  </div>
                </div>
                <div className="flex gap-2 mt-3">
                  <button
                    onClick={() => setSelectedTicket(ticket.id)}
                    className="flex-1 py-2 bg-emerald-500 text-white rounded-lg text-sm font-medium"
                  >
                    Respond
                  </button>
                  {ticket.status !== "resolved" && (
                    <button className="flex-1 py-2 bg-gray-100 text-gray-700 rounded-lg text-sm font-medium">
                      Mark Resolved
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Reports Tab */}
        {activeTab === "reports" && (
          <div className="space-y-4">
            <div className="bg-white rounded-xl p-4 shadow-sm">
              <h3 className="font-semibold text-gray-900 mb-3">Generate Report</h3>
              <div className="space-y-3">
                <select className="w-full px-4 py-3 bg-gray-50 rounded-xl border border-gray-200 text-sm focus:outline-none">
                  <option>Revenue Report</option>
                  <option>Trip Analytics</option>
                  <option>Driver Performance</option>
                  <option>User Growth</option>
                  <option>Support Metrics</option>
                </select>
                <div className="flex gap-2">
                  <input
                    type="date"
                    className="flex-1 px-4 py-3 bg-gray-50 rounded-xl border border-gray-200 text-sm"
                    placeholder="Start Date"
                  />
                  <input
                    type="date"
                    className="flex-1 px-4 py-3 bg-gray-50 rounded-xl border border-gray-200 text-sm"
                    placeholder="End Date"
                  />
                </div>
                <button className="w-full py-3 bg-emerald-500 text-white rounded-xl font-medium">
                  Generate Report
                </button>
              </div>
            </div>

            <div className="bg-white rounded-xl p-4 shadow-sm">
              <h3 className="font-semibold text-gray-900 mb-3">Quick Stats</h3>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Avg. Trip Duration</span>
                  <span className="font-semibold text-gray-900">18 min</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Avg. Trip Distance</span>
                  <span className="font-semibold text-gray-900">5.2 mi</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Avg. Fare</span>
                  <span className="font-semibold text-gray-900">$16.80</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Driver Acceptance Rate</span>
                  <span className="font-semibold text-gray-900">87%</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Customer Satisfaction</span>
                  <span className="font-semibold text-emerald-600">4.7/5</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Ticket Response Modal */}
      {selectedTicket && (
        <div className="absolute inset-0 bg-black/50 z-50 flex items-end">
          <div className="bg-white w-full rounded-t-3xl p-4 max-h-[80vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-bold text-lg">Respond to Ticket</h3>
              <button onClick={() => setSelectedTicket(null)} className="p-2">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            
            <div className="bg-gray-50 rounded-xl p-3 mb-4">
              <p className="text-sm text-gray-700">
                {SAMPLE_TICKETS.find(t => t.id === selectedTicket)?.subject}
              </p>
              <p className="text-xs text-gray-500 mt-1">
                From: {SAMPLE_TICKETS.find(t => t.id === selectedTicket)?.user}
              </p>
            </div>

            <textarea
              value={ticketResponse}
              onChange={(e) => setTicketResponse(e.target.value)}
              placeholder="Type your response..."
              rows={4}
              className="w-full px-4 py-3 bg-gray-50 rounded-xl border border-gray-200 text-sm mb-4 resize-none focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />

            <div className="flex gap-2">
              <button
                onClick={() => setSelectedTicket(null)}
                className="flex-1 py-3 border-2 border-gray-200 text-gray-700 rounded-xl font-medium"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  setTicketResponse("")
                  setSelectedTicket(null)
                }}
                className="flex-1 py-3 bg-emerald-500 text-white rounded-xl font-medium"
              >
                Send Response
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
