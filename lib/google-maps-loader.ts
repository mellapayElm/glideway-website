// Centralized singleton pattern to ensure Google Maps is only loaded once across the entire app
let loadPromise: Promise<void> | null = null
let isLoaded = false

const GOOGLE_MAPS_API_KEY = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || "AIzaSyCH4JRnP4zS-dSKAcDwtaz0hREGExtHOuo"

export function loadGoogleMaps(): Promise<void> {
  // Already loaded
  if (isLoaded && typeof window !== "undefined" && window.google?.maps) {
    return Promise.resolve()
  }

  // Loading in progress
  if (loadPromise) {
    return loadPromise
  }

  // Start loading
  loadPromise = new Promise((resolve, reject) => {
    if (typeof window === "undefined") {
      reject(new Error("Cannot load Google Maps on server"))
      return
    }

    // Check if already loaded by another script
    if (window.google?.maps) {
      isLoaded = true
      resolve()
      return
    }

    // Check if script already exists (from any source)
    const existingScript = document.querySelector('script[src*="maps.googleapis.com/maps/api/js"]')
    if (existingScript) {
      // Wait for it to load
      const checkLoaded = setInterval(() => {
        if (window.google?.maps) {
          isLoaded = true
          clearInterval(checkLoaded)
          resolve()
        }
      }, 100)
      
      setTimeout(() => {
        clearInterval(checkLoaded)
        if (!window.google?.maps) {
          reject(new Error("Timeout waiting for Google Maps"))
        }
      }, 15000)
      return
    }

    // Create callback for async loading
    const callbackName = `googleMapsCallback_${Date.now()}`
    ;(window as unknown as Record<string, () => void>)[callbackName] = () => {
      isLoaded = true
      delete (window as unknown as Record<string, () => void>)[callbackName]
      resolve()
    }

    // Create and load script
    const script = document.createElement("script")
    script.src = `https://maps.googleapis.com/maps/api/js?key=${GOOGLE_MAPS_API_KEY}&libraries=places,geometry&callback=${callbackName}&loading=async`
    script.async = true
    script.defer = true
    script.onerror = () => {
      loadPromise = null
      reject(new Error("Failed to load Google Maps"))
    }
    document.head.appendChild(script)
  })

  return loadPromise
}

export function isGoogleMapsLoaded(): boolean {
  return isLoaded && typeof window !== "undefined" && !!window.google?.maps
}

export function getGoogleMapsApiKey(): string {
  return GOOGLE_MAPS_API_KEY
}

// Type declaration for Google Maps
declare global {
  interface Window {
    google?: {
      maps: typeof google.maps
    }
  }
}
