"use client"

import { useState, useCallback } from "react"

interface DispatchRequest {
  pickupLat: number
  pickupLng: number
  pickupAddress: string
  dropoffLat: number
  dropoffLng: number
  dropoffAddress: string
  rideType: string
  riderId?: string
  riderName?: string
  riderRating?: number
  riderTrips?: number
  estimatedFare?: number
  estimatedDistance?: number
  estimatedDuration?: number
  surgeMultiplier?: number
}

interface DriverMatch {
  id: string
  name: string
  rating: number
  vehicleType: string
  totalTrips: number
  distanceToPickup: number
  etaToPickup: number
  matchScore: number
  matchReasons: string[]
}

interface DispatchResponse {
  success: boolean
  requestId?: string
  bestDriver?: DriverMatch
  driverQueue?: Array<{
    id: string
    name: string
    distanceToPickup: number
    etaToPickup: number
  }>
  tripDetails?: {
    pickup: { lat: number; lng: number; address: string }
    dropoff: { lat: number; lng: number; address: string }
    estimatedFare: number
    estimatedDistance: number
    estimatedDuration: number
    driverPayout: number
    surgeMultiplier: number
    rideType: string
  }
  alertSettings?: {
    countdown: number
    soundEnabled: boolean
    vibrationEnabled: boolean
    fullScreenAlert: boolean
  }
  message?: string
  error?: string
}

type DispatchStatus = "idle" | "searching" | "driver_found" | "driver_accepted" | "no_drivers" | "error"

export function useRideDispatch() {
  const [status, setStatus] = useState<DispatchStatus>("idle")
  const [response, setResponse] = useState<DispatchResponse | null>(null)
  const [currentDriverIndex, setCurrentDriverIndex] = useState(0)
  const [searchRadius, setSearchRadius] = useState(5)

  const dispatchRide = useCallback(async (request: DispatchRequest) => {
    setStatus("searching")
    setCurrentDriverIndex(0)

    try {
      const res = await fetch("/api/dispatch", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...request,
          searchRadius
        })
      })

      const data: DispatchResponse = await res.json()

      if (data.success && data.bestDriver) {
        setStatus("driver_found")
        setResponse(data)
        return data
      } else {
        // No drivers found - expand radius and retry
        if (searchRadius < 15) {
          setSearchRadius(prev => prev + 5)
          setStatus("searching")
          // In production, would retry with expanded radius
        } else {
          setStatus("no_drivers")
        }
        setResponse(data)
        return data
      }
    } catch (error) {
      console.error("[Dispatch Error]", error)
      setStatus("error")
      setResponse({
        success: false,
        error: "Failed to dispatch ride request. Please try again."
      })
      return null
    }
  }, [searchRadius])

  const tryNextDriver = useCallback(() => {
    if (response?.driverQueue && currentDriverIndex < response.driverQueue.length) {
      setCurrentDriverIndex(prev => prev + 1)
      // In production, would send request to next driver
      return response.driverQueue[currentDriverIndex]
    }
    return null
  }, [response, currentDriverIndex])

  const cancelDispatch = useCallback(() => {
    setStatus("idle")
    setResponse(null)
    setCurrentDriverIndex(0)
    setSearchRadius(5)
  }, [])

  const expandSearch = useCallback(async (request: DispatchRequest) => {
    setSearchRadius(prev => Math.min(prev + 5, 20))
    return dispatchRide(request)
  }, [dispatchRide])

  return {
    status,
    response,
    currentDriverIndex,
    searchRadius,
    dispatchRide,
    tryNextDriver,
    cancelDispatch,
    expandSearch,
    isSearching: status === "searching",
    hasDriver: status === "driver_found" || status === "driver_accepted"
  }
}
