// Free address search using Nominatim (OpenStreetMap)
export interface AddressResult {
  address: string
  lat: number
  lng: number
  displayName: string
}

export async function searchAddresses(query: string): Promise<AddressResult[]> {
  if (!query || query.length < 2) return []

  try {
    const response = await fetch(
      `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
        query
      )}&limit=8&countrycodes=us`,
      {
        headers: {
          'Accept-Language': 'en-US',
          'User-Agent': 'GlideWay Ride App',
        },
      }
    )

    if (!response.ok) throw new Error('Search failed')

    const results = await response.json()
    return results.map((item: any) => ({
      address: item.address || item.name,
      lat: parseFloat(item.lat),
      lng: parseFloat(item.lon),
      displayName: item.display_name,
    }))
  } catch (error) {
    console.error('[v0] Address search error:', error)
    return []
  }
}

// Reverse geocoding - get address from coordinates
export async function reverseGeocode(lat: number, lng: number): Promise<string> {
  try {
    const response = await fetch(
      `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&zoom=18`,
      {
        headers: {
          'Accept-Language': 'en-US',
          'User-Agent': 'GlideWay Ride App',
        },
      }
    )

    if (!response.ok) throw new Error('Reverse geocoding failed')

    const result = await response.json()
    return result.address?.road || result.address?.town || result.display_name || 'Unknown location'
  } catch (error) {
    console.error('[v0] Reverse geocoding error:', error)
    return 'Current location'
  }
}

// Calculate distance between two points in miles
export function calculateDistance(
  lat1: number,
  lng1: number,
  lat2: number,
  lng2: number
): number {
  const R = 3959 // Earth's radius in miles
  const dLat = ((lat2 - lat1) * Math.PI) / 180
  const dLng = ((lng2 - lng1) * Math.PI) / 180
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLng / 2) *
      Math.sin(dLng / 2)
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
  return R * c
}

// Estimate ride cost
export function estimateRideCost(distance: number, rideType: string = 'economy'): number {
  const baseFare = 2.5
  const costPerMile = rideType === 'premium' ? 1.5 : 1.0

  return Math.max(baseFare, Math.round((baseFare + distance * costPerMile) * 100) / 100)
}
