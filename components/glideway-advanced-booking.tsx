"use client"

import { useEffect, useRef, useState } from "react"
import { MapPin, Navigation, Clock, Users, DollarSign, Settings, ChevronLeft, ChevronRight, Plus, Edit2, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

interface Destination {
  id: string
  name: string
  placeId: string
  lat: number
  lng: number
  travelMode: "DRIVING" | "TRANSIT" | "BICYCLING" | "WALKING"
  duration: string
  distance: string
  active: boolean
}

const TRAVEL_MODES = [
  { id: "DRIVING", label: "Driving", icon: "🚗" },
  { id: "TRANSIT", label: "Transit", icon: "🚌" },
  { id: "BICYCLING", label: "Biking", icon: "🚴" },
  { id: "WALKING", label: "Walking", icon: "🚶" },
]

export function GlideWayAdvancedBooking() {
  const mapRef = useRef<HTMLDivElement>(null)
  const [mapInstance, setMapInstance] = useState<google.maps.Map | null>(null)
  const [destinations, setDestinations] = useState<Destination[]>([])
  const [activeDestination, setActiveDestination] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [showAddModal, setShowAddModal] = useState(false)
  const [modalMode, setModalMode] = useState<"add" | "edit">("add")
  const [formData, setFormData] = useState({ address: "", travelMode: "DRIVING" })
  const autocompleteRef = useRef<google.maps.places.Autocomplete | null>(null)
  const markersRef = useRef<Map<string, google.maps.Marker>>(new Map())
  const polylinesRef = useRef<Map<string, google.maps.Polyline>>(new Map())

  // Initialize map
  useEffect(() => {
    const initMap = async () => {
      try {
        setLoading(true)
        
        // Load Google Maps script
        if (!window.google?.maps) {
          const script = document.createElement("script")
          const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY
          script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=places,geometry`
          script.async = true
          
          await new Promise((resolve, reject) => {
            script.onload = resolve
            script.onerror = reject
            document.head.appendChild(script)
          })
        }

        if (!mapRef.current) return

        const map = new google.maps.Map(mapRef.current, {
          center: { lat: 38.8339, lng: -104.8214 }, // Colorado Springs
          zoom: 13,
          mapTypeControl: true,
          fullscreenControl: true,
          zoomControl: true,
          streetViewControl: true,
          styles: [
            { elementType: "geometry", stylers: [{ color: "#f5f5f5" }] },
            { elementType: "labels.text.fill", stylers: [{ color: "#616161" }] },
            { featureType: "water", stylers: [{ color: "#e5e5e5" }] },
            { featureType: "poi", stylers: [{ color: "#eeeeee" }] },
          ],
        })

        setMapInstance(map)

        // Add map click listener
        map.addListener("click", (e: google.maps.MapMouseEvent) => {
          if (e.latLng && activeDestination) {
            const lat = e.latLng.lat()
            const lng = e.latLng.lng()
            updateDestinationCoords(activeDestination, lat, lng)
          }
        })

        setLoading(false)
      } catch (err) {
        console.error("[v0] Map initialization error:", err)
        setError("Failed to load map")
        setLoading(false)
      }
    }

    initMap()
  }, [activeDestination])

  // Initialize autocomplete
  useEffect(() => {
    if (!mapInstance || showAddModal === false) return

    const input = document.getElementById("destination-input") as HTMLInputElement
    if (!input || autocompleteRef.current) return

    const autocomplete = new google.maps.places.Autocomplete(input, {
      bounds: new google.maps.LatLngBounds(
        { lat: 38.3339, lng: -105.3214 },
        { lat: 39.3339, lng: -104.3214 }
      ),
      fields: ["place_id", "geometry", "name", "formatted_address"],
    })

    autocomplete.addListener("place_changed", () => {
      const place = autocomplete.getPlace()
      if (place.geometry?.location) {
        setFormData(prev => ({ ...prev, address: place.name || place.formatted_address || "" }))
      }
    })

    autocompleteRef.current = autocomplete
  }, [showAddModal, mapInstance])

  const addDestination = async () => {
    if (!formData.address || !mapInstance) return

    const newDestination: Destination = {
      id: Math.random().toString(36).substr(2, 9),
      name: formData.address,
      placeId: "",
      lat: 38.8339,
      lng: -104.8214,
      travelMode: formData.travelMode as "DRIVING" | "TRANSIT" | "BICYCLING" | "WALKING",
      duration: "Calculating...",
      distance: "—",
      active: false,
    }

    setDestinations([...destinations, newDestination])
    setActiveDestination(newDestination.id)
    setShowAddModal(false)
    setFormData({ address: "", travelMode: "DRIVING" })
  }

  const updateDestinationCoords = (id: string, lat: number, lng: number) => {
    setDestinations(prev =>
      prev.map(dest =>
        dest.id === id ? { ...dest, lat, lng } : dest
      )
    )
  }

  const deleteDestination = (id: string) => {
    setDestinations(prev => prev.filter(dest => dest.id !== id))
    markersRef.current.get(id)?.setMap(null)
    polylinesRef.current.get(id)?.setMap(null)
    markersRef.current.delete(id)
    polylinesRef.current.delete(id)

    if (activeDestination === id) {
      setActiveDestination(destinations[0]?.id || null)
    }
  }

  // Render markers on map
  useEffect(() => {
    if (!mapInstance) return

    destinations.forEach((dest, idx) => {
      let marker = markersRef.current.get(dest.id)

      if (!marker) {
        marker = new google.maps.Marker({
          position: { lat: dest.lat, lng: dest.lng },
          map: mapInstance,
          title: dest.name,
          label: {
            text: String(idx + 1),
            color: "white",
            fontSize: "16px",
            fontWeight: "bold",
          },
          icon: {
            path: google.maps.SymbolPath.CIRCLE,
            scale: 12,
            fillColor: dest.active ? "#22c55e" : "#ef4444",
            fillOpacity: 1,
            strokeColor: "white",
            strokeWeight: 2,
          },
        })
        markersRef.current.set(dest.id, marker)
      } else {
        marker.setPosition({ lat: dest.lat, lng: dest.lng })
        marker.setIcon({
          path: google.maps.SymbolPath.CIRCLE,
          scale: 12,
          fillColor: dest.active ? "#22c55e" : "#ef4444",
          fillOpacity: 1,
          strokeColor: "white",
          strokeWeight: 2,
        })
      }
    })
  }, [destinations, mapInstance, activeDestination])

  return (
    <div className="h-screen w-full flex bg-white">
      {/* Left Sidebar */}
      <div className="w-full lg:w-96 flex flex-col bg-white border-r border-gray-200 shadow-sm">
        {/* Header */}
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-10 h-10 bg-gradient-to-br from-green-400 to-green-600 rounded-lg flex items-center justify-center text-white font-bold text-lg">
              G
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-900">GlideWay</h1>
              <p className="text-xs text-gray-500">Smart commute planner</p>
            </div>
          </div>
        </div>

        {/* Destinations List */}
        <div className="flex-1 overflow-y-auto">
          {destinations.length === 0 ? (
            <div className="p-8 text-center">
              <MapPin className="w-12 h-12 text-gray-300 mx-auto mb-3" />
              <p className="text-gray-500 font-medium mb-2">No destinations yet</p>
              <p className="text-xs text-gray-400 mb-4">Add your first destination to get started</p>
              <Button onClick={() => { setShowAddModal(true); setModalMode("add") }} className="w-full bg-green-600 hover:bg-green-700">
                <Plus className="w-4 h-4 mr-2" /> Add Destination
              </Button>
            </div>
          ) : (
            <div className="divide-y">
              {destinations.map((dest, idx) => (
                <div
                  key={dest.id}
                  onClick={() => setActiveDestination(dest.id)}
                  className={`p-4 cursor-pointer transition-colors ${
                    activeDestination === dest.id
                      ? "bg-green-50 border-l-4 border-green-600"
                      : "hover:bg-gray-50"
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-green-400 to-green-600 text-white flex items-center justify-center font-bold text-sm flex-shrink-0">
                      {idx + 1}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-gray-900 truncate">{dest.name}</p>
                      <div className="flex items-center gap-4 mt-2">
                        <div className="flex items-center gap-1 text-xs text-gray-600">
                          <Clock className="w-3 h-3" />
                          {dest.duration}
                        </div>
                        <div className="flex items-center gap-1 text-xs text-gray-600">
                          <Navigation className="w-3 h-3" />
                          {dest.distance}
                        </div>
                      </div>
                      {/* Travel mode selector */}
                      <div className="flex gap-1 mt-2">
                        {TRAVEL_MODES.map(mode => (
                          <button
                            key={mode.id}
                            onClick={(e) => {
                              e.stopPropagation()
                              setDestinations(prev =>
                                prev.map(d =>
                                  d.id === dest.id
                                    ? { ...d, travelMode: mode.id as any }
                                    : d
                                )
                              )
                            }}
                            className={`px-2 py-1 text-xs rounded transition-colors ${
                              dest.travelMode === mode.id
                                ? "bg-green-600 text-white"
                                : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                            }`}
                            title={mode.label}
                          >
                            {mode.icon}
                          </button>
                        ))}
                      </div>
                    </div>
                    <div className="flex gap-1 flex-shrink-0">
                      <button
                        onClick={(e) => {
                          e.stopPropagation()
                          setShowAddModal(true)
                          setModalMode("edit")
                        }}
                        className="p-1.5 hover:bg-gray-200 rounded transition-colors"
                      >
                        <Edit2 className="w-4 h-4 text-gray-600" />
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation()
                          deleteDestination(dest.id)
                        }}
                        className="p-1.5 hover:bg-red-100 rounded transition-colors"
                      >
                        <Trash2 className="w-4 h-4 text-red-600" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Add Button */}
        <div className="p-4 border-t border-gray-200">
          <Button
            onClick={() => { setShowAddModal(true); setModalMode("add") }}
            className="w-full bg-green-600 hover:bg-green-700 text-white"
          >
            <Plus className="w-4 h-4 mr-2" />
            Add Destination
          </Button>
        </div>
      </div>

      {/* Right Side - Map */}
      <div className="flex-1 relative">
        <div ref={mapRef} className="w-full h-full" />

        {loading && (
          <div className="absolute inset-0 flex items-center justify-center bg-white/80">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4" />
              <p className="text-gray-600 font-medium">Loading map...</p>
            </div>
          </div>
        )}

        {error && (
          <div className="absolute inset-0 flex items-center justify-center bg-red-50">
            <div className="text-center p-8">
              <p className="text-red-600 font-semibold mb-2">Map Error</p>
              <p className="text-red-600 text-sm">{error}</p>
            </div>
          </div>
        )}

        {activeDestination && (
          <div className="absolute top-4 left-4 bg-blue-600 text-white px-4 py-2 rounded-lg shadow-lg text-sm font-medium">
            Click on map to move destination
          </div>
        )}

        {/* Map Attribution */}
        <div className="absolute bottom-4 right-4 bg-white/90 px-3 py-1.5 rounded text-xs text-gray-600">
          GlideWay Maps
        </div>
      </div>

      {/* Add/Edit Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full mx-4">
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-xl font-bold text-gray-900">
                {modalMode === "add" ? "Add Destination" : "Edit Destination"}
              </h2>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Destination Address
                </label>
                <Input
                  id="destination-input"
                  type="text"
                  placeholder="Enter address..."
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  className="w-full"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Travel Mode
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {TRAVEL_MODES.map(mode => (
                    <button
                      key={mode.id}
                      onClick={() => setFormData({ ...formData, travelMode: mode.id })}
                      className={`py-2 px-3 rounded transition-colors text-sm font-medium ${
                        formData.travelMode === mode.id
                          ? "bg-green-600 text-white"
                          : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                      }`}
                    >
                      <span className="mr-2">{mode.icon}</span>
                      {mode.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>
            <div className="p-6 border-t border-gray-200 flex gap-3">
              <Button
                variant="outline"
                onClick={() => setShowAddModal(false)}
                className="flex-1"
              >
                Cancel
              </Button>
              <Button
                onClick={addDestination}
                className="flex-1 bg-green-600 hover:bg-green-700"
              >
                {modalMode === "add" ? "Add" : "Save"}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
