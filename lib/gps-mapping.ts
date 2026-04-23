// GPS & Mapping Utilities for GlideWay
// Uses OpenStreetMap - No API key required!

export interface Coordinates {
  lat: number;
  lng: number;
}

export interface RouteDetails {
  distance: number; // kilometers
  duration: number; // minutes
  pickupLat: number;
  pickupLng: number;
  dropoffLat: number;
  dropoffLng: number;
}

export interface DriverLocation {
  driverId: string;
  latitude: number;
  longitude: number;
  heading: number;
  speed: number;
  timestamp: Date;
}

/**
 * Calculate distance between two coordinates using Haversine formula
 */
export function calculateDistance(from: Coordinates, to: Coordinates): number {
  const R = 6371; // Earth's radius in km
  const dLat = (to.lat - from.lat) * Math.PI / 180;
  const dLng = (to.lng - from.lng) * Math.PI / 180;
  
  const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(from.lat * Math.PI / 180) * Math.cos(to.lat * Math.PI / 180) *
    Math.sin(dLng / 2) * Math.sin(dLng / 2);
  
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

/**
 * Estimate travel time based on distance and avg speed
 */
export function estimateDuration(distanceKm: number, avgSpeedKmh: number = 30): number {
  return Math.round((distanceKm / avgSpeedKmh) * 60);
}

/**
 * Get bearing (direction) between two points
 */
export function getBearing(from: Coordinates, to: Coordinates): number {
  const dLng = (to.lng - from.lng) * Math.PI / 180;
  const lat1 = from.lat * Math.PI / 180;
  const lat2 = to.lat * Math.PI / 180;
  
  const y = Math.sin(dLng) * Math.cos(lat2);
  const x = Math.cos(lat1) * Math.sin(lat2) - Math.sin(lat1) * Math.cos(lat2) * Math.cos(dLng);
  
  const bearing = Math.atan2(y, x) * 180 / Math.PI;
  return (bearing + 360) % 360;
}

/**
 * Check if point is within a radius
 */
export function isWithinRadius(
  center: Coordinates,
  point: Coordinates,
  radiusKm: number
): boolean {
  return calculateDistance(center, point) <= radiusKm;
}

/**
 * Generate a route for live tracking with multiple waypoints
 */
export function generateRouteWaypoints(
  from: Coordinates,
  to: Coordinates,
  pointCount: number = 10
): Coordinates[] {
  const waypoints: Coordinates[] = [from];
  
  for (let i = 1; i < pointCount - 1; i++) {
    const fraction = i / (pointCount - 1);
    const lat = from.lat + (to.lat - from.lat) * fraction;
    const lng = from.lng + (to.lng - from.lng) * fraction;
    
    // Add slight randomization for realistic routes
    const noise = 0.0001;
    waypoints.push({
      lat: lat + (Math.random() - 0.5) * noise,
      lng: lng + (Math.random() - 0.5) * noise
    });
  }
  
  waypoints.push(to);
  return waypoints;
}

/**
 * Format distance for display
 */
export function formatDistance(km: number): string {
  if (km < 1) {
    return `${Math.round(km * 1000)} m`;
  }
  return `${km.toFixed(1)} km`;
}

/**
 * Format duration for display
 */
export function formatDuration(minutes: number): string {
  if (minutes < 60) {
    return `${minutes} min`;
  }
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  return `${hours}h ${mins}m`;
}

/**
 * Simulate driver GPS location update for demo
 */
export function simulateDriverLocation(
  driverId: string,
  currentLoc: Coordinates,
  destination: Coordinates,
  progress: number // 0 to 1
): DriverLocation {
  const nextLat = currentLoc.lat + (destination.lat - currentLoc.lat) * progress;
  const nextLng = currentLoc.lng + (destination.lng - currentLoc.lng) * progress;
  
  return {
    driverId,
    latitude: nextLat,
    longitude: nextLng,
    heading: getBearing(currentLoc, destination),
    speed: 30 + Math.random() * 20, // 30-50 km/h
    timestamp: new Date()
  };
}

/**
 * Get OpenStreetMap tile URL (free provider)
 */
export function getMapTileUrl(provider: 'osm' | 'dark' | 'satellite' = 'osm'): {
  url: string;
  attribution: string;
} {
  const providers = {
    osm: {
      url: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
      attribution: '© OpenStreetMap contributors'
    },
    dark: {
      url: 'https://cartodb-basemaps-{s}.global.ssl.fastly.net/dark_all/{z}/{x}/{y}.png',
      attribution: '© CartoDB, © OpenStreetMap contributors'
    },
    satellite: {
      url: 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
      attribution: '© Esri'
    }
  };
  
  return providers[provider];
}

/**
 * Calculate fare based on distance and time
 */
export function calculateFareFromDistance(
  distanceKm: number,
  durationMinutes: number,
  baseFare: number = 2,
  perKmRate: number = 1.5,
  perMinuteRate: number = 0.25
): number {
  return baseFare + (distanceKm * perKmRate) + (durationMinutes * perMinuteRate);
}

/**
 * Format coordinates for display
 */
export function formatCoordinates(coords: Coordinates): string {
  const latDir = coords.lat >= 0 ? 'N' : 'S';
  const lngDir = coords.lng >= 0 ? 'E' : 'W';
  const lat = Math.abs(coords.lat).toFixed(4);
  const lng = Math.abs(coords.lng).toFixed(4);
  return `${lat}°${latDir}, ${lng}°${lngDir}`;
}

/**
 * Get address suggestions (mock - would integrate with geocoding service)
 */
export async function getAddressSuggestions(query: string): Promise<string[]> {
  // Mock suggestions
  const suggestions: { [key: string]: string[] } = {
    'times': ['Times Square, New York', 'Times Square Hotel, NYC'],
    'central': ['Central Park, New York', 'Central Station, NYC'],
    'brooklyn': ['Brooklyn Bridge, NYC', 'Brooklyn Heights Promenade'],
    'wall': ['Wall Street, New York', 'Wallabies Corner, NYC']
  };
  
  const key = query.toLowerCase();
  for (const [k, v] of Object.entries(suggestions)) {
    if (k.includes(key) || key.includes(k)) {
      return v;
    }
  }
  
  return [`${query}, New York`];
}

/**
 * Get current GPS accuracy estimate
 */
export function getGPSAccuracy(): {
  accuracy: number; // meters
  status: 'excellent' | 'good' | 'fair' | 'poor';
} {
  // In real app, would use navigator.geolocation API
  const accuracy = 5 + Math.random() * 10;
  
  let status: 'excellent' | 'good' | 'fair' | 'poor' = 'good';
  if (accuracy < 5) status = 'excellent';
  if (accuracy > 20) status = 'fair';
  if (accuracy > 50) status = 'poor';
  
  return { accuracy, status };
}
