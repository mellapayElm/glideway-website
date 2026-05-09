// Google Maps API Loader - uses environment variable
const GOOGLE_MAPS_API_KEY = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || ""

let isLoading = false
let isLoaded = false
let loadPromise: Promise<void> | null = null

export function loadGoogleMaps(): Promise<void> {
  // Already loaded
  if (isLoaded && window.google?.maps) {
    return Promise.resolve()
  }

  // Currently loading
  if (isLoading && loadPromise) {
    return loadPromise
  }

  isLoading = true

  loadPromise = new Promise((resolve, reject) => {
    // Check if already loaded
    if (window.google?.maps) {
      isLoaded = true
      isLoading = false
      resolve()
      return
    }

    // Check if script already exists
    const existingScript = document.querySelector('script[src*="maps.googleapis.com"]')
    if (existingScript) {
      existingScript.addEventListener("load", () => {
        isLoaded = true
        isLoading = false
        resolve()
      })
      return
    }

    // Create and load script
    const script = document.createElement("script")
    script.src = `https://maps.googleapis.com/maps/api/js?key=${GOOGLE_MAPS_API_KEY}&libraries=places,geometry&loading=async`
    script.async = true
    script.defer = true

    script.onload = () => {
      isLoaded = true
      isLoading = false
      resolve()
    }

    script.onerror = () => {
      isLoading = false
      reject(new Error("Failed to load Google Maps"))
    }

    document.head.appendChild(script)
  })

  return loadPromise
}

export function isGoogleMapsLoaded(): boolean {
  return isLoaded && !!window.google?.maps
}
