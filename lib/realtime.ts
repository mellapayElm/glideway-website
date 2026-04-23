// GlideWay Real-Time System
// Technology: WebSockets + Redis for live tracking

// ==========================================
// TYPES
// ==========================================

export interface LocationUpdate {
  userId: string
  userType: 'driver' | 'rider'
  latitude: number
  longitude: number
  heading?: number
  speed?: number
  accuracy?: number
  timestamp: number
}

export interface RideUpdate {
  rideId: string
  status: string
  driverLocation?: LocationUpdate
  eta?: number
  message?: string
  timestamp: number
}

export interface ChatMessage {
  rideId: string
  senderId: string
  senderType: 'driver' | 'rider'
  message: string
  timestamp: number
}

export interface DriverAvailability {
  driverId: string
  isOnline: boolean
  latitude: number
  longitude: number
  vehicleType: string
  rating: number
  currentRideId?: string
}

// ==========================================
// WEBSOCKET MESSAGE TYPES
// ==========================================

export type WebSocketMessageType =
  | 'LOCATION_UPDATE'
  | 'RIDE_STATUS_UPDATE'
  | 'DRIVER_ASSIGNED'
  | 'DRIVER_ARRIVED'
  | 'RIDE_STARTED'
  | 'RIDE_COMPLETED'
  | 'RIDE_CANCELED'
  | 'CHAT_MESSAGE'
  | 'ETA_UPDATE'
  | 'SURGE_UPDATE'
  | 'DRIVER_ONLINE'
  | 'DRIVER_OFFLINE'
  | 'NOTIFICATION'
  | 'HEARTBEAT'
  | 'ERROR'

export interface WebSocketMessage {
  type: WebSocketMessageType
  payload: unknown
  timestamp: number
  correlationId?: string
}

// ==========================================
// REAL-TIME EVENT CHANNELS
// ==========================================

export const CHANNELS = {
  // Ride-specific channels
  rideUpdates: (rideId: string) => `ride:${rideId}:updates`,
  rideLocation: (rideId: string) => `ride:${rideId}:location`,
  rideChat: (rideId: string) => `ride:${rideId}:chat`,
  
  // User-specific channels
  userNotifications: (userId: string) => `user:${userId}:notifications`,
  driverRequests: (driverId: string) => `driver:${driverId}:requests`,
  
  // Zone/Area channels
  zoneDrivers: (zoneId: string) => `zone:${zoneId}:drivers`,
  zoneDemand: (zoneId: string) => `zone:${zoneId}:demand`,
  
  // Admin channels
  adminAlerts: 'admin:alerts',
  systemMetrics: 'system:metrics',
  dispatchQueue: 'dispatch:queue'
}

// ==========================================
// GEOLOCATION UTILITIES
// ==========================================

export function calculateDistance(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number {
  const R = 3959 // Earth's radius in miles
  const dLat = toRad(lat2 - lat1)
  const dLon = toRad(lon2 - lon1)
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2)
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
  return R * c
}

function toRad(deg: number): number {
  return deg * (Math.PI / 180)
}

export function calculateETA(
  distanceMiles: number,
  trafficMultiplier: number = 1.0,
  baseSpeedMph: number = 25
): number {
  const effectiveSpeed = baseSpeedMph / trafficMultiplier
  const timeHours = distanceMiles / effectiveSpeed
  return Math.ceil(timeHours * 60) // Return minutes
}

export function isWithinRadius(
  centerLat: number,
  centerLon: number,
  pointLat: number,
  pointLon: number,
  radiusMiles: number
): boolean {
  return calculateDistance(centerLat, centerLon, pointLat, pointLon) <= radiusMiles
}

// ==========================================
// DRIVER MATCHING ALGORITHM
// ==========================================

export interface MatchCandidate {
  driverId: string
  distance: number
  eta: number
  rating: number
  vehicleType: string
  acceptanceRate: number
  score: number
}

export function calculateMatchScore(candidate: {
  distance: number
  eta: number
  rating: number
  acceptanceRate: number
}): number {
  // Weighted scoring algorithm
  const distanceScore = Math.max(0, 100 - candidate.distance * 10) // Closer = better
  const etaScore = Math.max(0, 100 - candidate.eta * 5) // Faster = better
  const ratingScore = candidate.rating * 20 // Higher rating = better
  const acceptanceScore = candidate.acceptanceRate * 50 // Higher acceptance = better
  
  // Weights
  const weights = {
    distance: 0.3,
    eta: 0.25,
    rating: 0.25,
    acceptance: 0.2
  }
  
  return (
    distanceScore * weights.distance +
    etaScore * weights.eta +
    ratingScore * weights.rating +
    acceptanceScore * weights.acceptance
  )
}

export function findBestDriver(
  candidates: MatchCandidate[],
  rideType: string
): MatchCandidate | null {
  if (candidates.length === 0) return null
  
  // Filter by vehicle type compatibility
  const compatibleCandidates = candidates.filter(c => {
    switch (rideType) {
      case 'ECONOMY':
        return ['SEDAN', 'SUV'].includes(c.vehicleType)
      case 'COMFORT':
        return ['SEDAN', 'SUV', 'LUXURY'].includes(c.vehicleType)
      case 'PREMIUM':
        return ['LUXURY'].includes(c.vehicleType)
      case 'XL':
        return ['SUV', 'VAN'].includes(c.vehicleType)
      default:
        return true
    }
  })
  
  if (compatibleCandidates.length === 0) return null
  
  // Sort by score descending
  compatibleCandidates.sort((a, b) => b.score - a.score)
  
  return compatibleCandidates[0]
}

// ==========================================
// DEMAND CALCULATION
// ==========================================

export interface DemandMetrics {
  activeRiders: number
  availableDrivers: number
  pendingRequests: number
  avgWaitTime: number
  demandLevel: 'low' | 'normal' | 'high' | 'surge'
  surgeMultiplier: number
}

export function calculateDemandLevel(metrics: {
  activeRiders: number
  availableDrivers: number
  pendingRequests: number
}): DemandMetrics {
  const ratio = metrics.availableDrivers > 0 
    ? metrics.activeRiders / metrics.availableDrivers 
    : 10
  
  let demandLevel: DemandMetrics['demandLevel']
  let surgeMultiplier: number
  
  if (ratio < 0.5) {
    demandLevel = 'low'
    surgeMultiplier = 1.0
  } else if (ratio < 1.5) {
    demandLevel = 'normal'
    surgeMultiplier = 1.0
  } else if (ratio < 3) {
    demandLevel = 'high'
    surgeMultiplier = 1.25
  } else {
    demandLevel = 'surge'
    surgeMultiplier = Math.min(2.5, 1 + (ratio - 3) * 0.25)
  }
  
  const avgWaitTime = Math.ceil(3 + (ratio * 2))
  
  return {
    activeRiders: metrics.activeRiders,
    availableDrivers: metrics.availableDrivers,
    pendingRequests: metrics.pendingRequests,
    avgWaitTime,
    demandLevel,
    surgeMultiplier: Math.round(surgeMultiplier * 100) / 100
  }
}

// ==========================================
// ROUTE OPTIMIZATION
// ==========================================

export interface RouteOption {
  name: string
  distanceMiles: number
  durationMinutes: number
  trafficDelay: number
  tollCost: number
  polyline: string
}

export function selectOptimalRoute(
  routes: RouteOption[],
  preference: 'fastest' | 'cheapest' | 'shortest' = 'fastest'
): RouteOption | null {
  if (routes.length === 0) return null
  
  const sorted = [...routes].sort((a, b) => {
    switch (preference) {
      case 'fastest':
        return (a.durationMinutes + a.trafficDelay) - (b.durationMinutes + b.trafficDelay)
      case 'cheapest':
        return a.tollCost - b.tollCost
      case 'shortest':
        return a.distanceMiles - b.distanceMiles
    }
  })
  
  return sorted[0]
}

// ==========================================
// EVENT SIMULATION (for demo/testing)
// ==========================================

export function simulateDriverMovement(
  currentLat: number,
  currentLon: number,
  targetLat: number,
  targetLon: number,
  stepSize: number = 0.001
): { lat: number; lon: number; arrived: boolean } {
  const latDiff = targetLat - currentLat
  const lonDiff = targetLon - currentLon
  const distance = Math.sqrt(latDiff * latDiff + lonDiff * lonDiff)
  
  if (distance < stepSize) {
    return { lat: targetLat, lon: targetLon, arrived: true }
  }
  
  const ratio = stepSize / distance
  return {
    lat: currentLat + latDiff * ratio,
    lon: currentLon + lonDiff * ratio,
    arrived: false
  }
}

export function generateRandomNearbyLocation(
  centerLat: number,
  centerLon: number,
  radiusMiles: number
): { lat: number; lon: number } {
  const radiusDegrees = radiusMiles / 69 // Approximate degrees per mile
  const angle = Math.random() * 2 * Math.PI
  const distance = Math.random() * radiusDegrees
  
  return {
    lat: centerLat + distance * Math.cos(angle),
    lon: centerLon + distance * Math.sin(angle)
  }
}

// ==========================================
// TRAFFIC CONDITIONS
// ==========================================

export type TrafficLevel = 'light' | 'moderate' | 'heavy' | 'severe'

export function getTrafficMultiplier(level: TrafficLevel): number {
  switch (level) {
    case 'light': return 1.0
    case 'moderate': return 1.2
    case 'heavy': return 1.5
    case 'severe': return 2.0
  }
}

export function estimateTrafficLevel(hour: number, dayOfWeek: number): TrafficLevel {
  const isWeekday = dayOfWeek >= 1 && dayOfWeek <= 5
  const isMorningRush = hour >= 7 && hour <= 9
  const isEveningRush = hour >= 16 && hour <= 19
  const isLateNight = hour >= 22 || hour <= 5
  
  if (isLateNight) return 'light'
  if (!isWeekday) return 'moderate'
  if (isMorningRush || isEveningRush) return 'heavy'
  return 'moderate'
}

// ==========================================
// GEOFENCING
// ==========================================

export interface GeoZone {
  id: string
  name: string
  type: 'airport' | 'downtown' | 'event' | 'restricted'
  center: { lat: number; lon: number }
  radiusMiles: number
  surchargeAmount: number
  isActive: boolean
}

export function checkZone(
  lat: number,
  lon: number,
  zones: GeoZone[]
): GeoZone | null {
  for (const zone of zones) {
    if (!zone.isActive) continue
    if (isWithinRadius(zone.center.lat, zone.center.lon, lat, lon, zone.radiusMiles)) {
      return zone
    }
  }
  return null
}
