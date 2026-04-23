// GlideWay Mapping System
// Technology: Google Maps Platform / Mapbox Integration
// Features: Places Autocomplete, Directions, Distance Matrix, Traffic

// ==========================================
// TYPES
// ==========================================

export interface Coordinates {
  lat: number
  lng: number
}

export interface PlaceSuggestion {
  placeId: string
  description: string
  mainText: string
  secondaryText: string
  types: string[]
}

export interface PlaceDetails {
  placeId: string
  name: string
  address: string
  coordinates: Coordinates
  types: string[]
  viewport?: {
    northeast: Coordinates
    southwest: Coordinates
  }
}

export interface RouteInfo {
  distance: {
    value: number // meters
    text: string
  }
  duration: {
    value: number // seconds
    text: string
  }
  durationInTraffic?: {
    value: number
    text: string
  }
  polyline: string
  steps: RouteStep[]
  startAddress: string
  endAddress: string
  bounds: {
    northeast: Coordinates
    southwest: Coordinates
  }
}

export interface RouteStep {
  distance: { value: number; text: string }
  duration: { value: number; text: string }
  startLocation: Coordinates
  endLocation: Coordinates
  instructions: string
  maneuver?: string
  polyline: string
}

export interface DistanceMatrixResult {
  origin: string
  destination: string
  distance: { value: number; text: string }
  duration: { value: number; text: string }
  durationInTraffic?: { value: number; text: string }
  status: 'OK' | 'NOT_FOUND' | 'ZERO_RESULTS'
}

export interface TrafficInfo {
  level: 'light' | 'moderate' | 'heavy' | 'severe'
  delayMinutes: number
  speedRatio: number // 0-1, where 1 is free flow
}

// ==========================================
// CONFIGURATION
// ==========================================

export const MAPPING_CONFIG = {
  defaultCenter: { lat: 40.7128, lng: -74.0060 }, // NYC
  defaultZoom: 13,
  searchRadius: 50000, // meters (50km)
  
  // Geocoding
  geocodeTypes: ['street_address', 'route', 'locality', 'airport'],
  
  // Directions
  avoidOptions: {
    tolls: false,
    highways: false,
    ferries: true
  },
  
  // Traffic
  trafficModel: 'best_guess' as const, // 'best_guess' | 'pessimistic' | 'optimistic'
  
  // Rate limiting
  autocompleteDebounceMs: 300,
  
  // Conversion
  metersToMiles: 0.000621371,
  secondsToMinutes: 1/60
}

// ==========================================
// PLACES AUTOCOMPLETE
// ==========================================

export async function searchPlaces(
  query: string,
  options?: {
    location?: Coordinates
    radius?: number
    types?: string[]
    sessionToken?: string
  }
): Promise<PlaceSuggestion[]> {
  if (!query || query.length < 2) return []

  // In production, use Google Places API:
  // const response = await fetch(
  //   `https://maps.googleapis.com/maps/api/place/autocomplete/json?` +
  //   `input=${encodeURIComponent(query)}` +
  //   `&key=${process.env.GOOGLE_MAPS_API_KEY}` +
  //   `&location=${options?.location?.lat},${options?.location?.lng}` +
  //   `&radius=${options?.radius || MAPPING_CONFIG.searchRadius}`
  // )

  // Demo suggestions
  const demoSuggestions: PlaceSuggestion[] = [
    {
      placeId: 'ChIJN1t_tDeuEmsRUsoyG83frY4',
      description: `${query} - New York, NY, USA`,
      mainText: query,
      secondaryText: 'New York, NY, USA',
      types: ['street_address']
    },
    {
      placeId: 'ChIJN1t_tDeuEmsRUsoyG83frY5',
      description: `${query} Street - Manhattan, NY`,
      mainText: `${query} Street`,
      secondaryText: 'Manhattan, NY',
      types: ['route']
    }
  ]

  return demoSuggestions
}

export async function getPlaceDetails(
  placeId: string
): Promise<PlaceDetails | null> {
  // In production, use Google Places Details API:
  // const response = await fetch(
  //   `https://maps.googleapis.com/maps/api/place/details/json?` +
  //   `place_id=${placeId}` +
  //   `&fields=name,formatted_address,geometry,types` +
  //   `&key=${process.env.GOOGLE_MAPS_API_KEY}`
  // )

  // Demo place details
  return {
    placeId,
    name: 'Sample Location',
    address: '123 Main Street, New York, NY 10001',
    coordinates: { lat: 40.7128, lng: -74.0060 },
    types: ['street_address']
  }
}

// ==========================================
// GEOCODING
// ==========================================

export async function geocodeAddress(
  address: string
): Promise<Coordinates | null> {
  // In production, use Google Geocoding API:
  // const response = await fetch(
  //   `https://maps.googleapis.com/maps/api/geocode/json?` +
  //   `address=${encodeURIComponent(address)}` +
  //   `&key=${process.env.GOOGLE_MAPS_API_KEY}`
  // )

  // Demo geocoding - return NYC coordinates with slight variation
  return {
    lat: 40.7128 + (Math.random() - 0.5) * 0.01,
    lng: -74.0060 + (Math.random() - 0.5) * 0.01
  }
}

export async function reverseGeocode(
  coordinates: Coordinates
): Promise<string | null> {
  // In production, use Google Reverse Geocoding API:
  // const response = await fetch(
  //   `https://maps.googleapis.com/maps/api/geocode/json?` +
  //   `latlng=${coordinates.lat},${coordinates.lng}` +
  //   `&key=${process.env.GOOGLE_MAPS_API_KEY}`
  // )

  return '123 Main Street, New York, NY 10001'
}

// ==========================================
// DIRECTIONS & ROUTING
// ==========================================

export async function getDirections(
  origin: Coordinates,
  destination: Coordinates,
  options?: {
    waypoints?: Coordinates[]
    avoidTolls?: boolean
    avoidHighways?: boolean
    departureTime?: Date
    alternatives?: boolean
  }
): Promise<RouteInfo[]> {
  // In production, use Google Directions API:
  // const params = new URLSearchParams({
  //   origin: `${origin.lat},${origin.lng}`,
  //   destination: `${destination.lat},${destination.lng}`,
  //   mode: 'driving',
  //   departure_time: options?.departureTime?.getTime().toString() || 'now',
  //   traffic_model: MAPPING_CONFIG.trafficModel,
  //   alternatives: (options?.alternatives ?? true).toString(),
  //   key: process.env.GOOGLE_MAPS_API_KEY!
  // })

  // Calculate demo distance and duration
  const distanceKm = calculateHaversineDistance(origin, destination)
  const distanceMiles = distanceKm * 0.621371
  const durationMinutes = Math.ceil(distanceMiles * 2.5) // ~24 mph average
  const trafficDelay = Math.ceil(durationMinutes * 0.15) // 15% traffic delay

  const route: RouteInfo = {
    distance: {
      value: Math.round(distanceKm * 1000),
      text: `${distanceMiles.toFixed(1)} mi`
    },
    duration: {
      value: durationMinutes * 60,
      text: `${durationMinutes} mins`
    },
    durationInTraffic: {
      value: (durationMinutes + trafficDelay) * 60,
      text: `${durationMinutes + trafficDelay} mins`
    },
    polyline: generateDemoPolyline(origin, destination),
    steps: [],
    startAddress: await reverseGeocode(origin) || 'Origin',
    endAddress: await reverseGeocode(destination) || 'Destination',
    bounds: {
      northeast: { lat: Math.max(origin.lat, destination.lat), lng: Math.max(origin.lng, destination.lng) },
      southwest: { lat: Math.min(origin.lat, destination.lat), lng: Math.min(origin.lng, destination.lng) }
    }
  }

  return [route]
}

// ==========================================
// DISTANCE MATRIX
// ==========================================

export async function getDistanceMatrix(
  origins: Coordinates[],
  destinations: Coordinates[],
  options?: {
    departureTime?: Date
    trafficModel?: 'best_guess' | 'pessimistic' | 'optimistic'
  }
): Promise<DistanceMatrixResult[][]> {
  // In production, use Google Distance Matrix API:
  // const response = await fetch(
  //   `https://maps.googleapis.com/maps/api/distancematrix/json?` +
  //   `origins=${origins.map(o => `${o.lat},${o.lng}`).join('|')}` +
  //   `&destinations=${destinations.map(d => `${d.lat},${d.lng}`).join('|')}` +
  //   `&departure_time=${options?.departureTime?.getTime() || 'now'}` +
  //   `&traffic_model=${options?.trafficModel || 'best_guess'}` +
  //   `&key=${process.env.GOOGLE_MAPS_API_KEY}`
  // )

  const results: DistanceMatrixResult[][] = []

  for (const origin of origins) {
    const row: DistanceMatrixResult[] = []
    for (const destination of destinations) {
      const distanceKm = calculateHaversineDistance(origin, destination)
      const distanceMiles = distanceKm * 0.621371
      const durationMinutes = Math.ceil(distanceMiles * 2.5)
      const trafficDelay = Math.ceil(durationMinutes * 0.15)

      row.push({
        origin: `${origin.lat},${origin.lng}`,
        destination: `${destination.lat},${destination.lng}`,
        distance: {
          value: Math.round(distanceKm * 1000),
          text: `${distanceMiles.toFixed(1)} mi`
        },
        duration: {
          value: durationMinutes * 60,
          text: `${durationMinutes} mins`
        },
        durationInTraffic: {
          value: (durationMinutes + trafficDelay) * 60,
          text: `${durationMinutes + trafficDelay} mins`
        },
        status: 'OK'
      })
    }
    results.push(row)
  }

  return results
}

// ==========================================
// TRAFFIC
// ==========================================

export async function getTrafficInfo(
  origin: Coordinates,
  destination: Coordinates
): Promise<TrafficInfo> {
  // In production, this would come from Google Traffic Layer or HERE Traffic API
  
  const hour = new Date().getHours()
  const isRushHour = (hour >= 7 && hour <= 9) || (hour >= 16 && hour <= 19)
  const isWeekend = [0, 6].includes(new Date().getDay())

  let level: TrafficInfo['level']
  let speedRatio: number
  let delayMinutes: number

  if (isWeekend) {
    level = 'light'
    speedRatio = 0.9
    delayMinutes = 2
  } else if (isRushHour) {
    level = 'heavy'
    speedRatio = 0.5
    delayMinutes = 15
  } else if (hour >= 22 || hour <= 5) {
    level = 'light'
    speedRatio = 0.95
    delayMinutes = 0
  } else {
    level = 'moderate'
    speedRatio = 0.7
    delayMinutes = 5
  }

  return { level, delayMinutes, speedRatio }
}

// ==========================================
// GEOFENCING & ZONES
// ==========================================

export interface GeoFence {
  id: string
  name: string
  type: 'airport' | 'downtown' | 'event' | 'suburb' | 'restricted'
  coordinates: Coordinates
  radiusMeters: number
  polygon?: Coordinates[] // For complex shapes
  surcharge?: number
  isActive: boolean
}

export function isPointInGeofence(
  point: Coordinates,
  fence: GeoFence
): boolean {
  if (fence.polygon) {
    return isPointInPolygon(point, fence.polygon)
  }
  
  const distance = calculateHaversineDistance(point, fence.coordinates) * 1000
  return distance <= fence.radiusMeters
}

export function isPointInPolygon(
  point: Coordinates,
  polygon: Coordinates[]
): boolean {
  let inside = false
  const n = polygon.length

  for (let i = 0, j = n - 1; i < n; j = i++) {
    const xi = polygon[i].lng, yi = polygon[i].lat
    const xj = polygon[j].lng, yj = polygon[j].lat

    if (((yi > point.lat) !== (yj > point.lat)) &&
        (point.lng < (xj - xi) * (point.lat - yi) / (yj - yi) + xi)) {
      inside = !inside
    }
  }

  return inside
}

// ==========================================
// DEMAND HEATMAP
// ==========================================

export interface HeatmapCell {
  coordinates: Coordinates
  weight: number // 0-1 intensity
  requestCount: number
  avgWaitTime: number
}

export function generateDemandHeatmap(
  requests: Array<{ coordinates: Coordinates; timestamp: Date }>,
  gridSize: number = 0.01 // degrees (~1km)
): HeatmapCell[] {
  const grid = new Map<string, { count: number; lat: number; lng: number }>()

  for (const request of requests) {
    const gridLat = Math.floor(request.coordinates.lat / gridSize) * gridSize
    const gridLng = Math.floor(request.coordinates.lng / gridSize) * gridSize
    const key = `${gridLat},${gridLng}`

    if (!grid.has(key)) {
      grid.set(key, { count: 0, lat: gridLat + gridSize / 2, lng: gridLng + gridSize / 2 })
    }
    grid.get(key)!.count++
  }

  const maxCount = Math.max(...Array.from(grid.values()).map(v => v.count))

  return Array.from(grid.values()).map(cell => ({
    coordinates: { lat: cell.lat, lng: cell.lng },
    weight: cell.count / maxCount,
    requestCount: cell.count,
    avgWaitTime: Math.ceil(3 + (1 - cell.count / maxCount) * 7) // 3-10 minutes
  }))
}

// ==========================================
// UTILITY FUNCTIONS
// ==========================================

export function calculateHaversineDistance(
  point1: Coordinates,
  point2: Coordinates
): number {
  const R = 6371 // Earth's radius in km
  const dLat = toRadians(point2.lat - point1.lat)
  const dLng = toRadians(point2.lng - point1.lng)
  
  const a = 
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRadians(point1.lat)) * Math.cos(toRadians(point2.lat)) *
    Math.sin(dLng / 2) * Math.sin(dLng / 2)
  
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
  return R * c
}

function toRadians(degrees: number): number {
  return degrees * (Math.PI / 180)
}

function generateDemoPolyline(origin: Coordinates, destination: Coordinates): string {
  // In production, this comes from Google Directions API
  // For demo, generate a simple encoded polyline
  const points = [origin]
  const steps = 10
  
  for (let i = 1; i < steps; i++) {
    points.push({
      lat: origin.lat + (destination.lat - origin.lat) * (i / steps) + (Math.random() - 0.5) * 0.001,
      lng: origin.lng + (destination.lng - origin.lng) * (i / steps) + (Math.random() - 0.5) * 0.001
    })
  }
  points.push(destination)

  // Return simplified representation (in production, use polyline encoding)
  return JSON.stringify(points)
}

export function metersToMiles(meters: number): number {
  return meters * MAPPING_CONFIG.metersToMiles
}

export function milesToMeters(miles: number): number {
  return miles / MAPPING_CONFIG.metersToMiles
}

export function secondsToMinutes(seconds: number): number {
  return Math.ceil(seconds / 60)
}
