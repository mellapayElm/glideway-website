"use client"

import { useState } from "react"

interface RideHistory {
  id: string
  date: string
  time: string
  pickup: string
  dropoff: string
  fare: number
  rideType: string
  driver: {
    name: string
    rating: number
  }
  status: "completed" | "cancelled"
  rating?: number
  tip?: number
}

const RIDE_HISTORY: RideHistory[] = [
  {
    id: "1",
    date: "Today",
    time: "2:30 PM",
    pickup: "123 Main St, Colorado Springs",
    dropoff: "456 Business Ave, Colorado Springs",
    fare: 18.50,
    rideType: "Comfort",
    driver: { name: "Michael J.", rating: 4.9 },
    status: "completed",
    rating: 5,
    tip: 3,
  },
  {
    id: "2",
    date: "Yesterday",
    time: "9:15 AM",
    pickup: "789 Oak Dr, Colorado Springs",
    dropoff: "Denver International Airport",
    fare: 65.00,
    rideType: "XL",
    driver: { name: "Sarah K.", rating: 4.8 },
    status: "completed",
    rating: 4,
  },
  {
    id: "3",
    date: "Mar 18",
    time: "6:45 PM",
    pickup: "Citadel Mall",
    dropoff: "123 Main St, Colorado Springs",
    fare: 12.75,
    rideType: "Economy",
    driver: { name: "David L.", rating: 4.7 },
    status: "completed",
    rating: 5,
    tip: 2,
  },
  {
    id: "4",
    date: "Mar 15",
    time: "3:00 PM",
    pickup: "Garden of the Gods",
    dropoff: "Downtown Colorado Springs",
    fare: 0,
    rideType: "Premium",
    driver: { name: "Emma R.", rating: 4.9 },
    status: "cancelled",
  },
  {
    id: "5",
    date: "Mar 12",
    time: "11:30 AM",
    pickup: "UCCS Campus",
    dropoff: "Memorial Hospital",
    fare: 22.00,
    rideType: "Comfort",
    driver: { name: "James W.", rating: 4.6 },
    status: "completed",
    rating: 4,
  },
]

export function ActivityScreen() {
  const [selectedRide, setSelectedRide] = useState<RideHistory | null>(null)
  const [activeTab, setActiveTab] = useState<"all" | "completed" | "cancelled">("all")

  const filteredRides = RIDE_HISTORY.filter(ride => {
    if (activeTab === "all") return true
    return ride.status === activeTab
  })

  return (
    <div className="flex flex-col h-full bg-gray-50">
      {/* Header */}
      <div className="bg-white px-4 py-4 border-b border-gray-100">
        <h1 className="text-xl font-bold text-gray-900 mb-4">Your Rides</h1>
        
        {/* Tabs */}
        <div className="flex gap-2">
          {[
            { id: "all", label: "All" },
            { id: "completed", label: "Completed" },
            { id: "cancelled", label: "Cancelled" },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as typeof activeTab)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                activeTab === tab.id
                  ? "bg-emerald-500 text-gray-900"
                  : "bg-gray-100 text-gray-600"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Ride List */}
      <div className="flex-1 overflow-y-auto px-4 py-4">
        {filteredRides.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center">
            <svg className="w-16 h-16 text-gray-700 mb-4" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 18.75a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h6m-9 0H3.375a1.125 1.125 0 01-1.125-1.125V14.25m17.25 4.5a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h1.125c.621 0 1.129-.504 1.09-1.124a17.902 17.902 0 00-3.213-9.193 2.056 2.056 0 00-1.58-.86H14.25M16.5 18.75h-2.25m0-11.177v-.958c0-.568-.422-1.048-.987-1.106a48.554 48.554 0 00-10.026 0 1.106 1.106 0 00-.987 1.106v7.635m12-6.677v6.677m0 4.5v-4.5m0 0h-12" />
            </svg>
            <p className="text-gray-500 font-medium">No rides found</p>
            <p className="text-sm text-gray-600 mt-1">Your ride history will appear here</p>
          </div>
        ) : (
          <div className="space-y-3">
            {filteredRides.map((ride) => (
              <button
                key={ride.id}
                onClick={() => setSelectedRide(ride)}
                className="w-full bg-white rounded-xl p-4 shadow-sm border border-gray-100 text-left"
              >
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <p className="text-xs text-gray-500">{ride.date} at {ride.time}</p>
                    <p className="font-semibold text-gray-900">{ride.rideType}</p>
                  </div>
                  <div className="text-right">
                    {ride.status === "completed" ? (
                      <p className="font-bold text-emerald-600">${ride.fare.toFixed(2)}</p>
                    ) : (
                      <span className="text-xs bg-red-100 text-red-600 px-2 py-1 rounded-full">
                        Cancelled
                      </span>
                    )}
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex items-start gap-2">
                    <div className="w-2 h-2 bg-emerald-500 rounded-full mt-1.5 shrink-0" />
                    <p className="text-sm text-gray-600 truncate">{ride.pickup}</p>
                  </div>
                  <div className="flex items-start gap-2">
                    <div className="w-2 h-2 bg-red-500 rounded-sm mt-1.5 shrink-0" />
                    <p className="text-sm text-gray-600 truncate">{ride.dropoff}</p>
                  </div>
                </div>

                {ride.status === "completed" && ride.rating && (
                  <div className="flex items-center gap-1 mt-3 pt-3 border-t border-gray-100">
                    <span className="text-xs text-gray-500">Your rating:</span>
                    <div className="flex">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <svg
                          key={star}
                          className={`w-4 h-4 ${star <= ride.rating! ? "text-yellow-400" : "text-gray-700"}`}
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                      ))}
                    </div>
                  </div>
                )}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Ride Detail Modal */}
      {selectedRide && (
        <div className="absolute inset-0 bg-black/50 z-50 flex items-end">
          <div className="bg-white w-full rounded-t-3xl max-h-[85vh] overflow-y-auto">
            <div className="sticky top-0 bg-white px-4 py-4 border-b border-gray-100 flex justify-between items-center">
              <h2 className="text-lg font-bold">Trip Details</h2>
              <button 
                onClick={() => setSelectedRide(null)}
                className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center"
              >
                <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="px-4 py-4">
              {/* Date & Status */}
              <div className="flex justify-between items-center mb-4">
                <div>
                  <p className="text-sm text-gray-500">{selectedRide.date}</p>
                  <p className="font-semibold text-gray-900">{selectedRide.time}</p>
                </div>
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                  selectedRide.status === "completed"
                    ? "bg-emerald-100 text-emerald-700"
                    : "bg-red-100 text-red-700"
                }`}>
                  {selectedRide.status === "completed" ? "Completed" : "Cancelled"}
                </span>
              </div>

              {/* Map Preview */}
              <div className="bg-emerald-50 rounded-xl h-32 mb-4 flex items-center justify-center">
                <p className="text-emerald-600 text-sm">Route preview</p>
              </div>

              {/* Locations */}
              <div className="bg-gray-50 rounded-xl p-4 mb-4">
                <div className="flex gap-3">
                  <div className="flex flex-col items-center">
                    <div className="w-3 h-3 bg-emerald-500 rounded-full" />
                    <div className="w-0.5 h-8 bg-gray-300 my-1" />
                    <div className="w-3 h-3 bg-red-500 rounded-sm" />
                  </div>
                  <div className="flex-1 space-y-4">
                    <div>
                      <p className="text-xs text-gray-500">Pickup</p>
                      <p className="font-medium text-gray-900">{selectedRide.pickup}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">Dropoff</p>
                      <p className="font-medium text-gray-900">{selectedRide.dropoff}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Driver Info */}
              {selectedRide.status === "completed" && (
                <div className="bg-gray-50 rounded-xl p-4 mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-emerald-200 rounded-full flex items-center justify-center text-lg">
                      {selectedRide.driver.name[0]}
                    </div>
                    <div className="flex-1">
                      <p className="font-semibold text-gray-900">{selectedRide.driver.name}</p>
                      <div className="flex items-center gap-1">
                        <svg className="w-4 h-4 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                        <span className="text-sm text-gray-600">{selectedRide.driver.rating}</span>
                      </div>
                    </div>
                    <span className="text-sm text-gray-500">{selectedRide.rideType}</span>
                  </div>
                </div>
              )}

              {/* Payment Summary */}
              {selectedRide.status === "completed" && (
                <div className="bg-gray-50 rounded-xl p-4 mb-4">
                  <h3 className="font-semibold text-gray-900 mb-3">Payment Summary</h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Ride fare</span>
                      <span className="text-gray-900">${selectedRide.fare.toFixed(2)}</span>
                    </div>
                    {selectedRide.tip && (
                      <div className="flex justify-between">
                        <span className="text-gray-600">Tip</span>
                        <span className="text-gray-900">${selectedRide.tip.toFixed(2)}</span>
                      </div>
                    )}
                    <div className="flex justify-between pt-2 border-t border-gray-200 font-semibold">
                      <span className="text-gray-900">Total</span>
                      <span className="text-emerald-600">
                        ${(selectedRide.fare + (selectedRide.tip || 0)).toFixed(2)}
                      </span>
                    </div>
                  </div>
                </div>
              )}

              {/* Your Rating */}
              {selectedRide.status === "completed" && selectedRide.rating && (
                <div className="bg-gray-50 rounded-xl p-4 mb-4">
                  <h3 className="font-semibold text-gray-900 mb-2">Your Rating</h3>
                  <div className="flex gap-1">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <svg
                        key={star}
                        className={`w-6 h-6 ${star <= selectedRide.rating! ? "text-yellow-400" : "text-gray-700"}`}
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                    ))}
                  </div>
                </div>
              )}

              {/* Actions */}
              <div className="space-y-2">
                <button className="w-full py-3 bg-emerald-500 text-gray-900 font-semibold rounded-xl">
                  Book Again
                </button>
                <button className="w-full py-3 bg-gray-100 text-gray-700 font-medium rounded-xl">
                  Get Receipt
                </button>
                <button className="w-full py-3 text-gray-500 font-medium">
                  Report an Issue
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
