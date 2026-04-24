"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { Loader } from "@googlemaps/js-api-loader";
import { MapPin, Car, Navigation } from "lucide-react";

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
    pickup?: google.maps.Marker;
    dropoff?: google.maps.Marker;
    driver?: google.maps.Marker;
  }>({});
  const directionsRendererRef = useRef<google.maps.DirectionsRenderer | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Create custom marker icons
  const createPickupIcon = useCallback(() => {
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
    return {
      path: "M12 2L4 20h16L12 2z", // Arrow/car shape
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
        const loader = new Loader({
          apiKey,
          version: "weekly",
          libraries: ["places", "geometry"],
        });

        await loader.load();
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
            // Dark mode styling
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

        // Initialize directions renderer for route
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
        if (isMounted) {
          setError("Failed to load Google Maps. Please check your API key.");
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
    if (!map || isLoading) return;

    // Update pickup marker
    if (pickup) {
      if (markersRef.current.pickup) {
        markersRef.current.pickup.setPosition(pickup);
      } else {
        markersRef.current.pickup = new google.maps.Marker({
          position: pickup,
          map,
          icon: createPickupIcon(),
          title: "Pickup Location",
          zIndex: 100,
        });
      }
    }

    // Update dropoff marker
    if (dropoff) {
      if (markersRef.current.dropoff) {
        markersRef.current.dropoff.setPosition(dropoff);
      } else {
        markersRef.current.dropoff = new google.maps.Marker({
          position: dropoff,
          map,
          icon: createDropoffIcon(),
          title: "Drop-off Location",
          zIndex: 100,
        });
      }
    }

    // Update driver marker
    if (driver) {
      if (markersRef.current.driver) {
        markersRef.current.driver.setPosition(driver);
        markersRef.current.driver.setIcon(createDriverIcon(driver.heading || 0));
      } else {
        markersRef.current.driver = new google.maps.Marker({
          position: driver,
          map,
          icon: createDriverIcon(driver.heading || 0),
          title: `Driver ${driver.speedKph ? `- ${Math.round(driver.speedKph)} km/h` : ""}`,
          zIndex: 200,
        });
      }
      // Center on driver
      map.panTo(driver);
    }

    // Fit bounds to show all markers
    if (pickup || dropoff || driver) {
      const bounds = new google.maps.LatLngBounds();
      if (pickup) bounds.extend(pickup);
      if (dropoff) bounds.extend(dropoff);
      if (driver) bounds.extend(driver);
      
      // Only fit bounds if we have multiple points
      const hasMultiplePoints = [pickup, dropoff, driver].filter(Boolean).length > 1;
      if (hasMultiplePoints) {
        map.fitBounds(bounds, { padding: 60 });
      }
    }

  }, [pickup, dropoff, driver, isLoading, createPickupIcon, createDropoffIcon, createDriverIcon]);

  // Draw route between pickup and dropoff
  useEffect(() => {
    const map = mapInstanceRef.current;
    const directionsRenderer = directionsRendererRef.current;
    
    if (!map || !directionsRenderer || !showRoute || !pickup || !dropoff || isLoading) return;

    const directionsService = new google.maps.DirectionsService();
    
    directionsService.route(
      {
        origin: pickup,
        destination: dropoff,
        travelMode: google.maps.TravelMode.DRIVING,
      },
      (result, status) => {
        if (status === google.maps.DirectionsStatus.OK && result) {
          directionsRenderer.setDirections(result);
        }
      }
    );
  }, [pickup, dropoff, showRoute, isLoading]);

  if (error) {
    return (
      <div 
        className={`relative rounded-2xl overflow-hidden bg-slate-800 border border-slate-700 flex flex-col items-center justify-center ${className}`}
        style={{ height }}
      >
        <div className="text-center p-6">
          <MapPin className="w-12 h-12 text-slate-500 mx-auto mb-4" />
          <p className="text-slate-400 text-sm max-w-xs">{error}</p>
          <p className="text-slate-500 text-xs mt-2">
            Visit the Google Cloud Console to set up your Maps API key.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className={`relative rounded-2xl overflow-hidden ${className}`} style={{ height }}>
      {/* Loading overlay */}
      {isLoading && (
        <div className="absolute inset-0 bg-slate-800 flex items-center justify-center z-10">
          <div className="flex flex-col items-center gap-3">
            <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
            <span className="text-sm text-slate-400">Loading map...</span>
          </div>
        </div>
      )}
      
      {/* Map container */}
      <div
        ref={mapRef}
        className="w-full h-full"
        style={{ minHeight: height }}
      />

      {/* GPS coordinates overlay */}
      {driver && (
        <div className="absolute top-3 right-3 bg-slate-900/90 backdrop-blur-sm rounded-lg px-3 py-2 border border-slate-700/50">
          <div className="flex items-center gap-2 mb-1">
            <Navigation className="w-4 h-4 text-primary" />
            <span className="text-xs font-medium text-primary">Live GPS</span>
          </div>
          <div className="space-y-0.5 text-xs">
            <div className="flex justify-between gap-4">
              <span className="text-slate-400">Lat:</span>
              <span className="font-mono text-white">{driver.lat.toFixed(6)}</span>
            </div>
            <div className="flex justify-between gap-4">
              <span className="text-slate-400">Lng:</span>
              <span className="font-mono text-white">{driver.lng.toFixed(6)}</span>
            </div>
            {driver.heading !== undefined && (
              <div className="flex justify-between gap-4">
                <span className="text-slate-400">Heading:</span>
                <span className="font-mono text-white">{Math.round(driver.heading)}°</span>
              </div>
            )}
            {driver.speedKph !== undefined && (
              <div className="flex justify-between gap-4">
                <span className="text-slate-400">Speed:</span>
                <span className="font-mono text-white">{Math.round(driver.speedKph)} km/h</span>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Legend */}
      <div className="absolute bottom-3 left-3 bg-slate-900/90 backdrop-blur-sm rounded-lg px-3 py-2 border border-slate-700/50">
        <div className="flex items-center gap-4 text-xs">
          {pickup && (
            <div className="flex items-center gap-1.5">
              <div className="w-3 h-3 rounded-full bg-emerald-500 border border-white" />
              <span className="text-slate-300">Pickup</span>
            </div>
          )}
          {dropoff && (
            <div className="flex items-center gap-1.5">
              <div className="w-3 h-3 rounded-full bg-red-500 border border-white" />
              <span className="text-slate-300">Drop-off</span>
            </div>
          )}
          {driver && (
            <div className="flex items-center gap-1.5">
              <Car className="w-3 h-3 text-primary" />
              <span className="text-slate-300">Driver</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
