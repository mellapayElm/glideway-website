"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { MapPin, Car, Navigation, Loader2 } from "lucide-react";

type Props = {
  pickup?: { lat: number; lng: number };
  dropoff?: { lat: number; lng: number };
  driver?: { lat: number; lng: number; heading?: number; speedKph?: number };
  showRoute?: boolean;
  height?: number | string;
  className?: string;
  onMapReady?: (map: google.maps.Map) => void;
};

// Default to Los Angeles if no location provided
const DEFAULT_CENTER = { lat: 34.0522, lng: -118.2437 };

// Global script loading state
let googleMapsPromise: Promise<void> | null = null;

function loadGoogleMaps(apiKey: string): Promise<void> {
  if (googleMapsPromise) return googleMapsPromise;
  
  if (typeof window !== "undefined" && window.google?.maps) {
    return Promise.resolve();
  }

  googleMapsPromise = new Promise((resolve, reject) => {
    // Check if script already exists to prevent duplicates
    const existingScript = document.querySelector(
      `script[src*="maps.googleapis.com/maps/api/js"][src*="key=${apiKey}"]`
    );
    
    if (existingScript) {
      // Wait for existing script to load
      const checkGoogle = setInterval(() => {
        if (window.google?.maps) {
          clearInterval(checkGoogle);
          resolve();
        }
      }, 100);
      return;
    }

    const script = document.createElement("script");
    // Note: "directions" library was removed - it's not a valid library in Google Maps API
    // Use only valid libraries: places, geometry, marker, routes
    script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=places,geometry,marker&v=weekly`;
    script.async = true;
    script.defer = true;
    script.onload = () => {
      console.log("[GlideWay] Google Maps API loaded successfully");
      resolve();
    };
    script.onerror = () => {
      console.error("[GlideWay] Failed to load Google Maps - check API key activation in Google Cloud Console");
      reject(new Error("Failed to load Google Maps script - Ensure Maps JavaScript API is enabled"));
    };
    document.head.appendChild(script);
  });

  return googleMapsPromise;
}

export default function GoogleMapLive({ 
  pickup, 
  dropoff, 
  driver,
  showRoute = true,
  height = 400,
  className = "",
  onMapReady
}: Props) {
  const mapRef = useRef<HTMLDivElement | null>(null);
  const mapInstanceRef = useRef<google.maps.Map | null>(null);
  const markersRef = useRef<{
    pickup?: google.maps.Marker;
    dropoff?: google.maps.Marker;
    driver?: google.maps.Marker;
  }>({});
  const directionsRendererRef = useRef<google.maps.DirectionsRenderer | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Create custom marker icons
  const createPickupIcon = useCallback(() => {
    if (!window.google?.maps) return null;
    return {
      path: google.maps.SymbolPath.CIRCLE,
      fillColor: "#22c55e",
      fillOpacity: 1,
      strokeColor: "#ffffff",
      strokeWeight: 3,
      scale: 12,
    };
  }, []);

  const createDropoffIcon = useCallback(() => {
    if (!window.google?.maps) return null;
    return {
      path: google.maps.SymbolPath.CIRCLE,
      fillColor: "#ef4444",
      fillOpacity: 1,
      strokeColor: "#ffffff",
      strokeWeight: 3,
      scale: 12,
    };
  }, []);

  const createDriverIcon = useCallback((heading: number = 0) => {
    if (!window.google?.maps) return null;
    return {
      path: "M12 2L4 20h16L12 2z",
      fillColor: "#22c55e",
      fillOpacity: 1,
      strokeColor: "#ffffff",
      strokeWeight: 2,
      scale: 1.5,
      rotation: heading,
      anchor: new google.maps.Point(12, 12),
    };
  }, []);

  // Initialize map
  useEffect(() => {
    let isMounted = true;

    async function initMap() {
      if (!mapRef.current) return;

      const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;
      
      if (!apiKey) {
        setError("Google Maps API key is required. Add NEXT_PUBLIC_GOOGLE_MAPS_API_KEY to your environment variables.");
        setIsLoading(false);
        return;
      }

      try {
        await loadGoogleMaps(apiKey);
        
        if (!isMounted || !mapRef.current) return;

        const center = driver || pickup || DEFAULT_CENTER;
        
        const map = new google.maps.Map(mapRef.current, {
          center,
          zoom: 14,
          mapTypeControl: false,
          streetViewControl: false,
          fullscreenControl: false,
          zoomControl: true,
          styles: [
            { elementType: "geometry", stylers: [{ color: "#1a1a2e" }] },
            { elementType: "labels.text.stroke", stylers: [{ color: "#1a1a2e" }] },
            { elementType: "labels.text.fill", stylers: [{ color: "#8b8b8b" }] },
            { featureType: "road", elementType: "geometry", stylers: [{ color: "#2d2d44" }] },
            { featureType: "road", elementType: "geometry.stroke", stylers: [{ color: "#1a1a2e" }] },
            { featureType: "road.highway", elementType: "geometry", stylers: [{ color: "#3d3d5c" }] },
            { featureType: "water", elementType: "geometry", stylers: [{ color: "#0e4166" }] },
            { featureType: "poi", elementType: "geometry", stylers: [{ color: "#1a1a2e" }] },
            { featureType: "poi.park", elementType: "geometry", stylers: [{ color: "#1a3320" }] },
          ],
        });

        mapInstanceRef.current = map;

        const directionsRenderer = new google.maps.DirectionsRenderer({
          map,
          suppressMarkers: true,
          polylineOptions: {
            strokeColor: "#22c55e",
            strokeWeight: 5,
            strokeOpacity: 0.8,
          },
        });
        directionsRendererRef.current = directionsRenderer;

        setIsLoading(false);
        onMapReady?.(map);

      } catch (err) {
        console.error("[GoogleMapLive] Error:", err);
        if (isMounted) {
          const errorMessage = err instanceof Error ? err.message : "Unknown error";
          setError(`Failed to load Google Maps: ${errorMessage}`);
          setIsLoading(false);
        }
      }
    }

    initMap();

    return () => {
      isMounted = false;
    };
  }, [onMapReady]);

  // Update markers when locations change
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map || isLoading || !window.google?.maps) return;

    // Update pickup marker
    if (pickup) {
      if (markersRef.current.pickup) {
        markersRef.current.pickup.setPosition(pickup);
      } else {
        const icon = createPickupIcon();
        if (icon) {
          markersRef.current.pickup = new google.maps.Marker({
            position: pickup,
            map,
            icon,
            title: "Pickup",
          });
        }
      }
    }

    // Update dropoff marker
    if (dropoff) {
      if (markersRef.current.dropoff) {
        markersRef.current.dropoff.setPosition(dropoff);
      } else {
        const icon = createDropoffIcon();
        if (icon) {
          markersRef.current.dropoff = new google.maps.Marker({
            position: dropoff,
            map,
            icon,
            title: "Dropoff",
          });
        }
      }
    }

    // Update driver marker
    if (driver) {
      const icon = createDriverIcon(driver.heading);
      if (markersRef.current.driver) {
        markersRef.current.driver.setPosition(driver);
        if (icon) markersRef.current.driver.setIcon(icon);
      } else if (icon) {
        markersRef.current.driver = new google.maps.Marker({
          position: driver,
          map,
          icon,
          title: "Driver",
        });
      }
    }

    // Fit bounds to show all markers
    const bounds = new google.maps.LatLngBounds();
    if (pickup) bounds.extend(pickup);
    if (dropoff) bounds.extend(dropoff);
    if (driver) bounds.extend(driver);
    
    if (!bounds.isEmpty()) {
      map.fitBounds(bounds, { padding: 60 });
    }
  }, [pickup, dropoff, driver, isLoading, createPickupIcon, createDropoffIcon, createDriverIcon]);

  // Draw route
  useEffect(() => {
    if (!showRoute || !pickup || !dropoff || !directionsRendererRef.current || !window.google?.maps) return;

    const directionsService = new google.maps.DirectionsService();
    
    directionsService.route(
      {
        origin: pickup,
        destination: dropoff,
        travelMode: google.maps.TravelMode.DRIVING,
      },
      (result, status) => {
        if (status === google.maps.DirectionsStatus.OK && result) {
          directionsRendererRef.current?.setDirections(result);
        }
      }
    );
  }, [pickup, dropoff, showRoute, isLoading]);

  if (error) {
    return (
      <div 
        className={`relative bg-slate-900 rounded-lg flex items-center justify-center ${className}`}
        style={{ height }}
      >
        <div className="text-center p-6">
          <MapPin className="w-12 h-12 text-slate-600 mx-auto mb-4" />
          <p className="text-slate-400 text-sm max-w-xs">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className={`relative ${className}`} style={{ height }}>
      {isLoading && (
        <div className="absolute inset-0 bg-slate-900 flex items-center justify-center z-10 rounded-lg">
          <div className="text-center">
            <Loader2 className="w-8 h-8 text-emerald-500 animate-spin mx-auto mb-2" />
            <p className="text-slate-400 text-sm">Loading map...</p>
          </div>
        </div>
      )}
      <div 
        ref={mapRef} 
        className="w-full h-full rounded-lg"
        style={{ minHeight: height }}
      />
      
      {/* Map Legend */}
      <div className="absolute bottom-4 left-4 bg-slate-900/90 backdrop-blur-sm rounded-lg p-3 text-xs">
        <div className="flex items-center gap-3">
          {pickup && (
            <div className="flex items-center gap-1.5">
              <div className="w-3 h-3 rounded-full bg-emerald-500" />
              <span className="text-slate-300">Pickup</span>
            </div>
          )}
          {dropoff && (
            <div className="flex items-center gap-1.5">
              <div className="w-3 h-3 rounded-full bg-red-500" />
              <span className="text-slate-300">Dropoff</span>
            </div>
          )}
          {driver && (
            <div className="flex items-center gap-1.5">
              <Car className="w-3 h-3 text-emerald-400" />
              <span className="text-slate-300">Driver</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// Also export a named export for backwards compatibility
export { GoogleMapLive };
