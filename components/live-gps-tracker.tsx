'use client';

import { useEffect, useState, useRef, useCallback } from 'react';
import { Navigation, MapPin, Car, Phone, MessageSquare, Shield, Clock, Route, Locate, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface Location {
  lat: number;
  lng: number;
  accuracy?: number;
  heading?: number;
  speed?: number;
  timestamp?: number;
}

interface LiveGPSTrackerProps {
  rideId?: string;
  pickupAddress?: string;
  dropoffAddress?: string;
  driverName?: string;
  driverPhone?: string;
  vehicleInfo?: string;
  estimatedArrival?: string;
  onBack?: () => void;
}

export function LiveGPSTracker({
  rideId = 'GW-10234',
  pickupAddress = 'Downtown LA',
  dropoffAddress = 'LAX Airport',
  driverName = 'John D.',
  driverPhone = '+1 (555) 123-4567',
  vehicleInfo = 'Black Honda Civic - GW-5239K',
  estimatedArrival = '12 min',
  onBack
}: LiveGPSTrackerProps) {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstance = useRef<any>(null);
  const userMarker = useRef<any>(null);
  const driverMarker = useRef<any>(null);
  const directionsRenderer = useRef<any>(null);
  
  const [userLocation, setUserLocation] = useState<Location | null>(null);
  const [driverLocation, setDriverLocation] = useState<Location>({ lat: 34.0522, lng: -118.2437 });
  const [mapLoaded, setMapLoaded] = useState(false);
  const [gpsStatus, setGpsStatus] = useState<'acquiring' | 'locked' | 'error'>('acquiring');
  const [eta, setEta] = useState(estimatedArrival);
  const [distance, setDistance] = useState('5.2 mi');
  const [watchId, setWatchId] = useState<number | null>(null);

  // Load Google Maps script
  useEffect(() => {
    const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;
    
    if (window.google?.maps) {
      setMapLoaded(true);
      return;
    }

    if (!apiKey) {
      console.log('[v0] No Google Maps API key found, using fallback map');
      setMapLoaded(true);
      return;
    }

    const script = document.createElement('script');
    script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=places,directions`;
    script.async = true;
    script.defer = true;
    script.onload = () => setMapLoaded(true);
    document.head.appendChild(script);

    return () => {
      if (document.head.contains(script)) {
        document.head.removeChild(script);
      }
    };
  }, []);

  // Get user's real GPS location
  useEffect(() => {
    if (!navigator.geolocation) {
      setGpsStatus('error');
      return;
    }

    const options = {
      enableHighAccuracy: true,
      timeout: 10000,
      maximumAge: 0
    };

    const successHandler = (position: GeolocationPosition) => {
      const newLocation = {
        lat: position.coords.latitude,
        lng: position.coords.longitude,
        accuracy: position.coords.accuracy,
        heading: position.coords.heading || 0,
        speed: position.coords.speed || 0,
        timestamp: position.timestamp
      };
      setUserLocation(newLocation);
      setGpsStatus('locked');
    };

    const errorHandler = (error: GeolocationPositionError) => {
      console.log('[v0] GPS error:', error.message);
      setGpsStatus('error');
      // Use default LA location as fallback
      setUserLocation({ lat: 34.0522, lng: -118.2437 });
    };

    // Start watching position for real-time updates
    const id = navigator.geolocation.watchPosition(successHandler, errorHandler, options);
    setWatchId(id);

    return () => {
      if (id) {
        navigator.geolocation.clearWatch(id);
      }
    };
  }, []);

  // Simulate driver movement toward user
  useEffect(() => {
    if (!userLocation) return;

    const interval = setInterval(() => {
      setDriverLocation(prev => {
        const latDiff = userLocation.lat - prev.lat;
        const lngDiff = userLocation.lng - prev.lng;
        const step = 0.001; // Movement speed
        
        return {
          lat: prev.lat + Math.sign(latDiff) * Math.min(Math.abs(latDiff), step),
          lng: prev.lng + Math.sign(lngDiff) * Math.min(Math.abs(lngDiff), step)
        };
      });
    }, 2000);

    return () => clearInterval(interval);
  }, [userLocation]);

  // Initialize and update map
  useEffect(() => {
    if (!mapLoaded || !mapRef.current || !userLocation) return;

    const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;

    if (!apiKey || !window.google?.maps) {
      // Fallback: Use iframe with OpenStreetMap
      return;
    }

    // Initialize Google Map
    if (!mapInstance.current) {
      mapInstance.current = new window.google.maps.Map(mapRef.current, {
        center: { lat: userLocation.lat, lng: userLocation.lng },
        zoom: 15,
        disableDefaultUI: true,
        zoomControl: true,
        styles: [
          { elementType: 'geometry', stylers: [{ color: '#1a1a1a' }] },
          { elementType: 'labels.text.stroke', stylers: [{ color: '#1a1a1a' }] },
          { elementType: 'labels.text.fill', stylers: [{ color: '#757575' }] },
          { featureType: 'road', elementType: 'geometry', stylers: [{ color: '#38414e' }] },
          { featureType: 'road.highway', elementType: 'geometry', stylers: [{ color: '#4b6741' }] },
          { featureType: 'water', elementType: 'geometry', stylers: [{ color: '#17263c' }] },
        ],
      });

      directionsRenderer.current = new window.google.maps.DirectionsRenderer({
        map: mapInstance.current,
        suppressMarkers: true,
        polylineOptions: { strokeColor: '#22c55e', strokeWeight: 4 },
      });
    }

    // Update user marker
    if (userMarker.current) {
      userMarker.current.setPosition({ lat: userLocation.lat, lng: userLocation.lng });
    } else {
      userMarker.current = new window.google.maps.Marker({
        position: { lat: userLocation.lat, lng: userLocation.lng },
        map: mapInstance.current,
        title: 'Your Location',
        icon: {
          path: window.google.maps.SymbolPath.CIRCLE,
          scale: 10,
          fillColor: '#22c55e',
          fillOpacity: 1,
          strokeColor: '#fff',
          strokeWeight: 3,
        },
      });
    }

    // Update driver marker
    if (driverMarker.current) {
      driverMarker.current.setPosition({ lat: driverLocation.lat, lng: driverLocation.lng });
    } else {
      driverMarker.current = new window.google.maps.Marker({
        position: { lat: driverLocation.lat, lng: driverLocation.lng },
        map: mapInstance.current,
        title: 'Driver',
        icon: {
          url: 'data:image/svg+xml;charset=UTF-8,' + encodeURIComponent(`
            <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 40 40">
              <circle cx="20" cy="20" r="18" fill="#3b82f6" stroke="#fff" stroke-width="3"/>
              <path d="M20 10 L28 25 L20 22 L12 25 Z" fill="#fff"/>
            </svg>
          `),
          scaledSize: new window.google.maps.Size(40, 40),
          anchor: new window.google.maps.Point(20, 20),
        },
      });
    }

    // Draw route between driver and user
    const directionsService = new window.google.maps.DirectionsService();
    directionsService.route(
      {
        origin: { lat: driverLocation.lat, lng: driverLocation.lng },
        destination: { lat: userLocation.lat, lng: userLocation.lng },
        travelMode: window.google.maps.TravelMode.DRIVING,
      },
      (result: any, status: any) => {
        if (status === 'OK' && directionsRenderer.current) {
          directionsRenderer.current.setDirections(result);
          
          // Update ETA and distance
          const route = result.routes[0]?.legs[0];
          if (route) {
            setEta(route.duration?.text || estimatedArrival);
            setDistance(route.distance?.text || '5.2 mi');
          }
        }
      }
    );

    // Fit bounds
    const bounds = new window.google.maps.LatLngBounds();
    bounds.extend({ lat: userLocation.lat, lng: userLocation.lng });
    bounds.extend({ lat: driverLocation.lat, lng: driverLocation.lng });
    mapInstance.current.fitBounds(bounds, 50);

  }, [mapLoaded, userLocation, driverLocation, estimatedArrival]);

  const centerOnUser = useCallback(() => {
    if (mapInstance.current && userLocation) {
      mapInstance.current.panTo({ lat: userLocation.lat, lng: userLocation.lng });
      mapInstance.current.setZoom(16);
    }
  }, [userLocation]);

  const openInMaps = useCallback(() => {
    if (userLocation) {
      const url = `https://www.google.com/maps/dir/?api=1&destination=${userLocation.lat},${userLocation.lng}`;
      window.open(url, '_blank');
    }
  }, [userLocation]);

  return (
    <div className="min-h-screen bg-slate-900">
      {/* Header */}
      <div className="bg-slate-900/95 backdrop-blur border-b border-slate-800 p-4">
        <div className="flex items-center justify-between">
          {onBack && (
            <Button variant="ghost" size="sm" className="text-white" onClick={onBack}>
              Back
            </Button>
          )}
          <div className="flex items-center gap-2">
            <div className={`w-2 h-2 rounded-full ${gpsStatus === 'locked' ? 'bg-emerald-400 animate-pulse' : gpsStatus === 'acquiring' ? 'bg-yellow-400 animate-pulse' : 'bg-red-400'}`} />
            <span className="text-sm text-gray-400">
              {gpsStatus === 'locked' ? 'GPS Active' : gpsStatus === 'acquiring' ? 'Acquiring GPS...' : 'GPS Error'}
            </span>
          </div>
          <Button variant="ghost" size="icon" className="text-white" onClick={centerOnUser}>
            <Locate className="w-5 h-5" />
          </Button>
        </div>
      </div>

      {/* Map Container */}
      <div className="relative h-[50vh]">
        {!process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || !window.google?.maps ? (
          // Fallback map using iframe
          <iframe
            src={`https://www.openstreetmap.org/export/embed.html?bbox=${(userLocation?.lng || -118.2437) - 0.05}%2C${(userLocation?.lat || 34.0522) - 0.03}%2C${(userLocation?.lng || -118.2437) + 0.05}%2C${(userLocation?.lat || 34.0522) + 0.03}&layer=mapnik&marker=${userLocation?.lat || 34.0522}%2C${userLocation?.lng || -118.2437}`}
            className="w-full h-full border-0"
            style={{ filter: 'invert(90%) hue-rotate(180deg)' }}
          />
        ) : (
          <div ref={mapRef} className="w-full h-full" />
        )}
        
        {/* Map overlay controls */}
        <div className="absolute bottom-4 right-4 flex flex-col gap-2">
          <Button size="icon" className="bg-emerald-600 hover:bg-emerald-500 shadow-lg" onClick={openInMaps}>
            <Navigation className="w-5 h-5" />
          </Button>
          <Button size="icon" variant="secondary" className="shadow-lg" onClick={centerOnUser}>
            <Locate className="w-5 h-5" />
          </Button>
        </div>
      </div>

      {/* Trip Info Card */}
      <div className="bg-slate-800 rounded-t-3xl -mt-6 relative z-10 p-6 space-y-4">
        {/* Driver arriving info */}
        <div className="flex items-center justify-between">
          <div>
            <p className="text-emerald-400 font-semibold text-lg">Driver is on the way</p>
            <p className="text-gray-400 text-sm">Arriving in {eta}</p>
          </div>
          <div className="text-right">
            <p className="text-white font-bold text-2xl">{eta}</p>
            <p className="text-gray-500 text-xs">{distance} away</p>
          </div>
        </div>

        {/* Driver info */}
        <div className="flex items-center gap-4 p-4 bg-slate-700/50 rounded-xl">
          <div className="w-14 h-14 rounded-full bg-emerald-500 flex items-center justify-center text-white font-bold text-xl">
            {driverName.charAt(0)}
          </div>
          <div className="flex-1">
            <p className="text-white font-semibold">{driverName}</p>
            <p className="text-gray-400 text-sm">{vehicleInfo}</p>
            <div className="flex items-center gap-1 mt-1">
              <span className="text-yellow-400 text-sm">★★★★★</span>
              <span className="text-gray-400 text-xs">4.95</span>
            </div>
          </div>
          <div className="flex gap-2">
            <Button size="icon" variant="outline" className="border-slate-600 text-white">
              <Phone className="w-4 h-4" />
            </Button>
            <Button size="icon" variant="outline" className="border-slate-600 text-white">
              <MessageSquare className="w-4 h-4" />
            </Button>
          </div>
        </div>

        {/* Route info */}
        <div className="space-y-3">
          <div className="flex items-start gap-3">
            <div className="w-3 h-3 rounded-full bg-emerald-500 mt-1.5" />
            <div>
              <p className="text-gray-400 text-xs">PICKUP</p>
              <p className="text-white font-medium">{pickupAddress}</p>
            </div>
          </div>
          <div className="ml-1.5 border-l-2 border-dashed border-slate-600 h-4" />
          <div className="flex items-start gap-3">
            <div className="w-3 h-3 rounded-full bg-red-500 mt-1.5" />
            <div>
              <p className="text-gray-400 text-xs">DROPOFF</p>
              <p className="text-white font-medium">{dropoffAddress}</p>
            </div>
          </div>
        </div>

        {/* Action buttons */}
        <div className="grid grid-cols-3 gap-3 pt-2">
          <Button variant="outline" className="border-slate-600 text-white flex flex-col h-auto py-3">
            <Route className="w-5 h-5 mb-1" />
            <span className="text-xs">Share Trip</span>
          </Button>
          <Button variant="outline" className="border-slate-600 text-white flex flex-col h-auto py-3">
            <Shield className="w-5 h-5 mb-1" />
            <span className="text-xs">Safety</span>
          </Button>
          <Button variant="outline" className="border-red-500/50 text-red-400 flex flex-col h-auto py-3">
            <Clock className="w-5 h-5 mb-1" />
            <span className="text-xs">Cancel</span>
          </Button>
        </div>

        {/* Ride ID */}
        <p className="text-center text-gray-500 text-xs">Ride ID: {rideId}</p>
      </div>
    </div>
  );
}
