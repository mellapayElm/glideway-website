import { NextRequest, NextResponse } from "next/server"

// Types for driver dispatch system
interface DriverLocation {
  id: string
  name: string
  lat: number
  lng: number
  status: "online" | "busy" | "offline"
  rating: number
  acceptanceRate: number
  cancellationRate: number
  vehicleType: "economy" | "comfort" | "premium" | "xl"
  totalTrips: number
  safetyScore: number
  lastActive: Date
  currentSpeed: number
}

interface RideRequest {
  riderId: string
  riderName: string
  riderRating: number
  riderTrips: number
  pickup: {
    lat: number
    lng: number
    address: string
  }
  dropoff: {
    lat: number
    lng: number
    address: string
  }
  rideType: string
  estimatedFare: number
  estimatedDistance: number
  estimatedDuration: number
  surgeMultiplier: number
  timestamp: Date
}

interface DriverMatch {
  driver: DriverLocation
  score: number
  distanceToPickup: number
  etaToPickup: number
  matchReasons: string[]
}

// Haversine formula to calculate distance between two points
function calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 3959 // Earth's radius in miles
  const dLat = (lat2 - lat1) * Math.PI / 180
  const dLon = (lon2 - lon1) * Math.PI / 180
  const a = 
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
    Math.sin(dLon/2) * Math.sin(dLon/2)
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a))
  return R * c
}

// Calculate ETA based on distance and average speed
function calculateETA(distance: number, trafficMultiplier: number = 1): number {
  const avgSpeedMph = 25 // Average city driving speed
  const adjustedSpeed = avgSpeedMph / trafficMultiplier
  return Math.ceil((distance / adjustedSpeed) * 60) // Returns minutes
}

// Smart driver matching algorithm
function calculateDriverScore(
  driver: DriverLocation, 
  pickupLat: number, 
  pickupLng: number,
  requestedVehicleType: string
): DriverMatch | null {
  // Only match online drivers
  if (driver.status !== "online") return null

  const distance = calculateDistance(driver.lat, driver.lng, pickupLat, pickupLng)
  const eta = calculateETA(distance)
  
  // Skip drivers too far away (> 10 miles)
  if (distance > 10) return null

  const matchReasons: string[] = []
  let score = 100 // Start with base score

  // Distance factor (most important - up to 40 points)
  // Closer drivers get higher scores
  const distanceScore = Math.max(0, 40 - (distance * 4))
  score += distanceScore
  if (distance < 1) matchReasons.push("Very close")
  else if (distance < 2) matchReasons.push("Nearby")

  // Rating factor (up to 20 points)
  const ratingScore = (driver.rating - 4) * 20 // 4.5 rating = 10 points, 5.0 = 20 points
  score += ratingScore
  if (driver.rating >= 4.8) matchReasons.push("Top-rated driver")

  // Acceptance rate factor (up to 15 points)
  const acceptanceScore = (driver.acceptanceRate / 100) * 15
  score += acceptanceScore
  if (driver.acceptanceRate >= 90) matchReasons.push("High acceptance")

  // Low cancellation bonus (up to 10 points)
  const cancellationScore = ((100 - driver.cancellationRate) / 100) * 10
  score += cancellationScore
  if (driver.cancellationRate < 3) matchReasons.push("Reliable")

  // Vehicle type match bonus (15 points)
  if (driver.vehicleType === requestedVehicleType.toLowerCase()) {
    score += 15
    matchReasons.push("Matching vehicle")
  } else if (
    // Allow upgrade matches (comfort can accept economy)
    (requestedVehicleType === "economy" && ["comfort", "premium"].includes(driver.vehicleType)) ||
    (requestedVehicleType === "comfort" && driver.vehicleType === "premium")
  ) {
    score += 10
    matchReasons.push("Vehicle upgrade available")
  }

  // Safety score bonus (up to 10 points)
  const safetyScore = (driver.safetyScore / 100) * 10
  score += safetyScore
  if (driver.safetyScore >= 95) matchReasons.push("Safety verified")

  // Experience bonus (up to 5 points)
  if (driver.totalTrips > 1000) {
    score += 5
    matchReasons.push("Experienced")
  } else if (driver.totalTrips > 500) {
    score += 3
  }

  return {
    driver,
    score,
    distanceToPickup: Math.round(distance * 10) / 10,
    etaToPickup: eta,
    matchReasons
  }
}

// Demo drivers for simulation
function getDemoDrivers(): DriverLocation[] {
  return [
    {
      id: "DRV-001",
      name: "John D.",
      lat: 34.0530,
      lng: -118.2450,
      status: "online",
      rating: 4.92,
      acceptanceRate: 94,
      cancellationRate: 2,
      vehicleType: "comfort",
      totalTrips: 2341,
      safetyScore: 98,
      lastActive: new Date(),
      currentSpeed: 0
    },
    {
      id: "DRV-002",
      name: "Maria S.",
      lat: 34.0580,
      lng: -118.2520,
      status: "online",
      rating: 4.88,
      acceptanceRate: 91,
      cancellationRate: 3,
      vehicleType: "economy",
      totalTrips: 1567,
      safetyScore: 96,
      lastActive: new Date(),
      currentSpeed: 15
    },
    {
      id: "DRV-003",
      name: "Robert K.",
      lat: 34.0490,
      lng: -118.2380,
      status: "online",
      rating: 4.95,
      acceptanceRate: 97,
      cancellationRate: 1,
      vehicleType: "premium",
      totalTrips: 3892,
      safetyScore: 99,
      lastActive: new Date(),
      currentSpeed: 0
    },
    {
      id: "DRV-004",
      name: "Lisa M.",
      lat: 34.0610,
      lng: -118.2590,
      status: "busy",
      rating: 4.78,
      acceptanceRate: 88,
      cancellationRate: 4,
      vehicleType: "xl",
      totalTrips: 892,
      safetyScore: 94,
      lastActive: new Date(),
      currentSpeed: 28
    },
    {
      id: "DRV-005",
      name: "James W.",
      lat: 34.0550,
      lng: -118.2410,
      status: "online",
      rating: 4.85,
      acceptanceRate: 92,
      cancellationRate: 3,
      vehicleType: "comfort",
      totalTrips: 1234,
      safetyScore: 97,
      lastActive: new Date(),
      currentSpeed: 0
    }
  ]
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { 
      pickupLat, 
      pickupLng, 
      pickupAddress,
      dropoffLat, 
      dropoffLng, 
      dropoffAddress,
      rideType = "comfort",
      riderId,
      riderName,
      riderRating = 4.5,
      riderTrips = 10,
      estimatedFare,
      estimatedDistance,
      estimatedDuration,
      surgeMultiplier = 1.0,
      searchRadius = 5 // miles
    } = body

    // Get available drivers
    const drivers = getDemoDrivers()
    
    // Calculate scores for all drivers
    const matches: DriverMatch[] = []
    
    for (const driver of drivers) {
      const match = calculateDriverScore(driver, pickupLat, pickupLng, rideType)
      if (match) {
        matches.push(match)
      }
    }

    // Sort by score (highest first)
    matches.sort((a, b) => b.score - a.score)

    // Take top 5 matches
    const topMatches = matches.slice(0, 5)

    if (topMatches.length === 0) {
      return NextResponse.json({
        success: false,
        message: "No drivers available in your area",
        suggestion: "Try expanding search radius or wait a few minutes",
        shouldExpandRadius: true,
        currentRadius: searchRadius
      }, { status: 404 })
    }

    // Create ride request object
    const rideRequest: RideRequest = {
      riderId: riderId || `RDR-${Date.now()}`,
      riderName: riderName || "Rider",
      riderRating,
      riderTrips,
      pickup: {
        lat: pickupLat,
        lng: pickupLng,
        address: pickupAddress || "Pickup location"
      },
      dropoff: {
        lat: dropoffLat,
        lng: dropoffLng,
        address: dropoffAddress || "Dropoff location"
      },
      rideType,
      estimatedFare: estimatedFare || 25.00,
      estimatedDistance: estimatedDistance || 8.5,
      estimatedDuration: estimatedDuration || 22,
      surgeMultiplier,
      timestamp: new Date()
    }

    // Return the best match and queue
    const bestMatch = topMatches[0]
    const driverPayout = (rideRequest.estimatedFare * 0.80).toFixed(2)

    return NextResponse.json({
      success: true,
      requestId: `REQ-${Date.now()}`,
      rideRequest,
      bestDriver: {
        id: bestMatch.driver.id,
        name: bestMatch.driver.name,
        rating: bestMatch.driver.rating,
        vehicleType: bestMatch.driver.vehicleType,
        totalTrips: bestMatch.driver.totalTrips,
        distanceToPickup: bestMatch.distanceToPickup,
        etaToPickup: bestMatch.etaToPickup,
        matchScore: bestMatch.score,
        matchReasons: bestMatch.matchReasons
      },
      driverQueue: topMatches.slice(1).map(m => ({
        id: m.driver.id,
        name: m.driver.name,
        distanceToPickup: m.distanceToPickup,
        etaToPickup: m.etaToPickup
      })),
      tripDetails: {
        pickup: rideRequest.pickup,
        dropoff: rideRequest.dropoff,
        estimatedFare: rideRequest.estimatedFare,
        estimatedDistance: rideRequest.estimatedDistance,
        estimatedDuration: rideRequest.estimatedDuration,
        driverPayout: parseFloat(driverPayout),
        surgeMultiplier: rideRequest.surgeMultiplier,
        rideType: rideRequest.rideType
      },
      alertSettings: {
        countdown: 20, // seconds to respond
        soundEnabled: true,
        vibrationEnabled: true,
        fullScreenAlert: true
      },
      timestamp: new Date().toISOString()
    })

  } catch (error) {
    console.error("[DISPATCH ERROR]", error)
    return NextResponse.json({
      success: false,
      error: "Failed to dispatch ride request"
    }, { status: 500 })
  }
}

// GET endpoint to check dispatch status
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const requestId = searchParams.get("requestId")

  if (!requestId) {
    return NextResponse.json({
      error: "Request ID required"
    }, { status: 400 })
  }

  // In production, this would check a database
  // For demo, return simulated status
  const statuses = ["pending", "driver_notified", "driver_accepted", "driver_declined", "expired"]
  const randomStatus = statuses[Math.floor(Math.random() * 3)] // Bias towards positive outcomes

  return NextResponse.json({
    requestId,
    status: randomStatus,
    timestamp: new Date().toISOString()
  })
}
