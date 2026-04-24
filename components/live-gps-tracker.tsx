'use client';

import { useEffect, useRef, useState } from 'react';
import { Button } from '@/components/ui/button';
import { MapPin, Phone, AlertTriangle, Star, X } from 'lucide-react';

interface LiveGPSTrackerProps {
  onClose?: () => void;
}

export function LiveGPSTracker({ onClose }: LiveGPSTrackerProps) {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstance = useRef<any>(null);
  const userMarker = useRef<any>(null);
  const driverMarker = useRef<any>(null);
  const directionsRenderer = useRef<any>(null);
  const locationWatchId = useRef<number | null>(null);
  
  const [isClient, setIsClient] = useState(false);
  const [mapsReady, setMapsReady] = useState(false);
  const [userLocation, setUserLocation] = useState({ lat: 34.0522, lng: -118.2437 });
  const [driverLocation, setDriverLocation] = useState({ lat: 34.0730, lng: -118.2465 });
  const [mapLoaded, setMapLoaded] = useState(false);
  const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;

  // Check if Google Maps is ready
  useEffect(() => {
    setIsClient(true);
    if (typeof window !== 'undefined' && window.google?.maps) {
      setMapsReady(true);
    }
  }, []);

  // Load Google Maps script and initialize map
  useEffect(() => {
    if (!isClient || !mapRef.current || !apiKey) return;

    // Check if Google Maps is already loaded
    if (typeof window !== 'undefined' && window.google?.maps) {
      initMap();
      return;
    }

    // Load Google Maps script
    const script = document.createElement('script');
    script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=places,directions`;
    script.async = true;
    script.defer = true;
    script.onload = initMap;
    document.head.appendChild(script);

    return () => {
      if (document.head.contains(script)) {
        document.head.removeChild(script);
      }
    };
  }, [isClient, apiKey]);

  // Initialize the map
  const initMap = () => {
    if (!mapRef.current || !window.google?.maps) return;

    mapInstance.current = new window.google.maps.Map(mapRef.current, {
      zoom: 15,
      center: { lat: userLocation.lat, lng: userLocation.lng },
      mapTypeId: 'roadmap',
      styles: [
        { elementType: 'geometry', stylers: [{ color: '#242f3e' }] },
        { elementType: 'labels.text.stroke', stylers: [{ color: '#242f3e' }] },
        { elementType: 'labels.text.fill', stylers: [{ color: '#746855' }] },
      ],
    });

    directionsRenderer.current = new window.google.maps.DirectionsRenderer({
      map: mapInstance.current,
      suppressMarkers: true,
    });

    // Add user marker (pickup)
    userMarker.current = new window.google.maps.Marker({
      position: userLocation,
      map: mapInstance.current,
      title: 'Pickup Location',
      icon: 'http://maps.google.com/mapfiles/ms/icons/green-dot.png',
    });

    // Add driver marker
    driverMarker.current = new window.google.maps.Marker({
      position: driverLocation,
      map: mapInstance.current,
      title: 'Driver Location',
      icon: 'http://maps.google.com/mapfiles/ms/icons/blue-dot.png',
    });

    setMapLoaded(true);
    drawRoute();
  };

  // Draw route between user and driver
  const drawRoute = () => {
    if (!directionsRenderer.current || !window.google?.maps) return;

    const directionsService = new window.google.maps.DirectionsService();

    directionsService.route(
      {
        origin: userLocation,
        destination: driverLocation,
        travelMode: window.google.maps.TravelMode.DRIVING,
      },
      (result: any, status: any) => {
        if (status === window.google.maps.DirectionsStatus.OK) {
          directionsRenderer.current.setDirections(result);
        }
      }
    );
  };

  // Simulate real-time GPS tracking
  useEffect(() => {
    if (!mapLoaded) return;

    const interval = setInterval(() => {
      // Simulate driver moving towards pickup
      setDriverLocation((prev) => ({
        lat: prev.lat + (userLocation.lat - prev.lat) * 0.01,
        lng: prev.lng + (userLocation.lng - prev.lng) * 0.01,
      }));
    }, 2000);

    return () => clearInterval(interval);
  }, [mapLoaded, userLocation]);

  // Update driver marker position
  useEffect(() => {
    if (driverMarker.current && mapLoaded) {
      driverMarker.current.setPosition(driverLocation);
      if (mapInstance.current) {
        mapInstance.current.panTo(driverLocation);
      }
      drawRoute();
    }
  }, [driverLocation, mapLoaded]);

  // Get user's real GPS location if available
  useEffect(() => {
    if (typeof navigator !== 'undefined' && navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          });
          
          if (userMarker.current) {
            userMarker.current.setPosition({
              lat: position.coords.latitude,
              lng: position.coords.longitude,
            });
          }
        },
        (error) => console.log('[v0] Geolocation error:', error)
      );
    }
  }, []);

  // Calculate distance
  const calculateDistance = () => {
    const R = 3959; // Earth's radius in miles
    const dLat = ((driverLocation.lat - userLocation.lat) * Math.PI) / 180;
    const dLng = ((driverLocation.lng - userLocation.lng) * Math.PI) / 180;
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos((userLocation.lat * Math.PI) / 180) *
        Math.cos((driverLocation.lat * Math.PI) / 180) *
        Math.sin(dLng / 2) *
        Math.sin(dLng / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return (R * c).toFixed(1);
  };

  const distance = calculateDistance();
  const eta = Math.ceil(parseFloat(distance) * 2);

  if (!isClient || !apiKey) {
    return (
      <div className="flex items-center justify-center h-screen bg-slate-900">
        <div className="text-center">
          <AlertTriangle className="w-12 h-12 text-yellow-500 mx-auto mb-4" />
          <p className="text-white font-semibold">Google Maps Not Configured</p>
          <p className="text-gray-400 text-sm mt-2">Please add NEXT_PUBLIC_GOOGLE_MAPS_API_KEY environment variable</p>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-slate-900 z-50 flex flex-col">
      {/* Header */}
      <div className="bg-slate-800 border-b border-slate-700 p-4 flex items-center justify-between">
        <h1 className="text-xl font-bold text-white">Live Trip Tracking</h1>
        <Button variant="ghost" size="icon" className="text-white" onClick={onClose}>
          <X className="w-6 h-6" />
        </Button>
      </div>

      {/* Map */}
      <div ref={mapRef} className="flex-1 w-full" />

      {/* Trip Info */}
      <div className="bg-slate-800 border-t border-slate-700 p-4 space-y-4">
        {/* Driver Info */}
        <div className="bg-slate-700/50 rounded-lg p-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-full bg-emerald-600 flex items-center justify-center text-white font-bold">
              JD
            </div>
            <div>
              <p className="text-white font-semibold">John Driver</p>
              <p className="text-sm text-gray-400 flex items-center gap-1">
                <Star className="w-4 h-4 text-yellow-400 fill-current" />
                4.95 rating
              </p>
            </div>
          </div>
          <div className="text-right">
            <p className="text-emerald-400 font-semibold">{distance} mi away</p>
            <p className="text-sm text-gray-400">{eta} min away</p>
          </div>
        </div>

        {/* Route Info */}
        <div className="grid grid-cols-3 gap-2">
          <div className="bg-slate-700/50 rounded-lg p-3 text-center">
            <p className="text-2xl font-bold text-emerald-400">{distance}</p>
            <p className="text-xs text-gray-400 mt-1">Distance</p>
          </div>
          <div className="bg-slate-700/50 rounded-lg p-3 text-center">
            <p className="text-2xl font-bold text-emerald-400">{eta}</p>
            <p className="text-xs text-gray-400 mt-1">Minutes</p>
          </div>
          <div className="bg-slate-700/50 rounded-lg p-3 text-center">
            <p className="text-2xl font-bold text-emerald-400">35</p>
            <p className="text-xs text-gray-400 mt-1">Avg Speed</p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-2">
          <Button className="flex-1 bg-emerald-600 hover:bg-emerald-500 text-white">
            <Phone className="w-4 h-4 mr-2" />
            Call Driver
          </Button>
          <Button variant="outline" className="flex-1 text-white border-gray-600 hover:bg-slate-700">
            <MapPin className="w-4 h-4 mr-2" />
            Share Location
          </Button>
        </div>
      </div>
    </div>
  );
}
