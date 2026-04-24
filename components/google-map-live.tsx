"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { MapPin, Car, Navigation, Loader2 } from "lucide-react";
import { loadGoogleMaps } from "@/lib/google-maps-loader";

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
    pickup?: google.maps.marker.AdvancedMarkerElement;
    dropoff?: google.maps.marker.AdvancedMarkerElement;
    driver?: google.maps.marker.AdvancedMarkerElement;
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

      try {
        await loadGoogleMaps();
        
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
    if (!map || isLoading || !window.google?.maps || !window.google.maps.marker) return;

    // Create pickup marker
    if (pickup) {
      if (!markersRef.current.pickup) {
        const pickupDiv = document.createElement('div');
        pickupDiv.innerHTML = '<div class="w-6 h-6 bg-emerald-500 rounded-full border-2 border-white shadow-lg flex items-center justify-center"><div class="w-2 h-2 bg-white rounded-full"></div></div>';
        try {
          markersRef.current.pickup = new google.maps.marker.AdvancedMarkerElement({
            map,
            position: pickup,
            title: "Pickup",
            content: pickupDiv,
          });
        } catch (e) {
          console.error("[GlideWay] Error creating pickup marker:", e);
        }
      } else {
        markersRef.current.pickup.position = pickup;
      }
    }

    // Create dropoff marker
    if (dropoff) {
      if (!markersRef.current.dropoff) {
        const dropoffDiv = document.createElement('div');
        dropoffDiv.innerHTML = '<div class="w-6 h-6 bg-red-500 rounded-full border-2 border-white shadow-lg flex items-center justify-center"><div class="w-2 h-2 bg-white rounded-full"></div></div>';
        try {
          markersRef.current.dropoff = new google.maps.marker.AdvancedMarkerElement({
            map,
            position: dropoff,
            title: "Dropoff",
            content: dropoffDiv,
          });
        } catch (e) {
          console.error("[GlideWay] Error creating dropoff marker:", e);
        }
      } else {
        markersRef.current.dropoff.position = dropoff;
      }
    }

    // Create driver marker
    if (driver) {
      if (!markersRef.current.driver) {
        const driverDiv = document.createElement('div');
        driverDiv.innerHTML = '<div class="w-5 h-5 bg-emerald-400 rounded-full border-2 border-white shadow-lg flex items-center justify-center text-xs">🚗</div>';
        try {
          markersRef.current.driver = new google.maps.marker.AdvancedMarkerElement({
            map,
            position: driver,
            title: "Driver",
            content: driverDiv,
          });
        } catch (e) {
          console.error("[GlideWay] Error creating driver marker:", e);
        }
      } else {
        markersRef.current.driver.position = driver;
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
  }, [pickup, dropoff, driver, isLoading]);

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
