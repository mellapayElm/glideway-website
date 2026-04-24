'use client';

import { useEffect, useRef } from 'react';
import { Loader } from 'lucide-react';

declare global {
  interface Window {
    google: any;
  }
}

interface GoogleMapProps {
  pickupLat?: number;
  pickupLng?: number;
  dropoffLat?: number;
  dropoffLng?: number;
  driverLat?: number;
  driverLng?: number;
  zoom?: number;
  className?: string;
}

export function GoogleMap({
  pickupLat = 34.0522,
  pickupLng = -118.2437,
  dropoffLat = 34.1015,
  dropoffLng = -117.7149,
  driverLat = 34.0730,
  driverLng = -118.2465,
  zoom = 12,
  className = 'w-full h-96'
}: GoogleMapProps) {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstance = useRef<any>(null);
  const markersRef = useRef<any[]>([]);

  useEffect(() => {
    if (!mapRef.current || !window.google) return;

    // Initialize map
    const map = new window.google.maps.Map(mapRef.current, {
      center: { lat: pickupLat, lng: pickupLng },
      zoom,
      styles: [
        { elementType: 'geometry', stylers: [{ color: '#1a1a1a' }] },
        { elementType: 'labels.text.stroke', stylers: [{ color: '#1a1a1a' }] },
        { elementType: 'labels.text.fill', stylers: [{ color: '#757575' }] },
        {
          featureType: 'administrative.locality',
          elementType: 'labels.text.fill',
          stylers: [{ color: '#d59563' }],
        },
        {
          featureType: 'poi',
          elementType: 'labels.text.fill',
          stylers: [{ color: '#d59563' }],
        },
        {
          featureType: 'poi.park',
          elementType: 'geometry',
          stylers: [{ color: '#263c3f' }],
        },
        {
          featureType: 'road',
          elementType: 'geometry',
          stylers: [{ color: '#38414e' }],
        },
        {
          featureType: 'road',
          elementType: 'geometry.stroke',
          stylers: [{ color: '#212a37' }],
        },
        {
          featureType: 'road.highway',
          elementType: 'geometry',
          stylers: [{ color: '#746855' }],
        },
        {
          featureType: 'road.highway',
          elementType: 'geometry.stroke',
          stylers: [{ color: '#1f2835' }],
        },
        {
          featureType: 'road.highway.controlled_access',
          elementType: 'geometry',
          stylers: [{ color: '#4b6741' }],
        },
        {
          featureType: 'road.highway.controlled_access',
          elementType: 'geometry.stroke',
          stylers: [{ color: '#27392d' }],
        },
        {
          featureType: 'water',
          elementType: 'geometry',
          stylers: [{ color: '#17263c' }],
        },
        {
          featureType: 'water',
          elementType: 'labels.text.fill',
          stylers: [{ color: '#515c6d' }],
        },
        {
          featureType: 'water',
          elementType: 'labels.text.stroke',
          stylers: [{ color: '#17263c' }],
        },
      ],
    });

    mapInstance.current = map;

    // Clear existing markers
    markersRef.current.forEach(marker => marker.setMap(null));
    markersRef.current = [];

    // Pickup marker
    const pickupMarker = new window.google.maps.Marker({
      position: { lat: pickupLat, lng: pickupLng },
      map,
      title: 'Pickup Location',
      icon: 'http://maps.google.com/mapfiles/ms/icons/green-dot.png',
    });
    markersRef.current.push(pickupMarker);

    // Dropoff marker
    const dropoffMarker = new window.google.maps.Marker({
      position: { lat: dropoffLat, lng: dropoffLng },
      map,
      title: 'Dropoff Location',
      icon: 'http://maps.google.com/mapfiles/ms/icons/red-dot.png',
    });
    markersRef.current.push(dropoffMarker);

    // Driver marker
    const driverMarker = new window.google.maps.Marker({
      position: { lat: driverLat, lng: driverLng },
      map,
      title: 'Driver Location',
      icon: 'http://maps.google.com/mapfiles/ms/icons/blue-dot.png',
    });
    markersRef.current.push(driverMarker);

    // Draw route line
    const directionsService = new window.google.maps.DirectionsService();
    const directionsRenderer = new window.google.maps.DirectionsRenderer({
      map,
      polylineOptions: {
        strokeColor: '#22c55e',
        strokeWeight: 3,
      },
    });

    directionsService.route(
      {
        origin: { lat: pickupLat, lng: pickupLng },
        destination: { lat: dropoffLat, lng: dropoffLng },
        travelMode: window.google.maps.TravelMode.DRIVING,
      },
      (result: any, status: any) => {
        if (status === window.google.maps.DirectionsStatus.OK) {
          directionsRenderer.setDirections(result);
        }
      }
    );

    // Fit bounds to show all markers
    const bounds = new window.google.maps.LatLngBounds();
    bounds.extend({ lat: pickupLat, lng: pickupLng });
    bounds.extend({ lat: dropoffLat, lng: dropoffLng });
    bounds.extend({ lat: driverLat, lng: driverLng });
    map.fitBounds(bounds);

  }, [pickupLat, pickupLng, dropoffLat, dropoffLng, driverLat, driverLng, zoom]);

  if (!window.google) {
    return (
      <div className={`${className} bg-slate-900 rounded-lg flex items-center justify-center`}>
        <div className="text-center">
          <Loader className="w-8 h-8 animate-spin text-emerald-400 mx-auto mb-2" />
          <p className="text-gray-400 text-sm">Loading map...</p>
        </div>
      </div>
    );
  }

  return <div ref={mapRef} className={`${className} rounded-lg border border-slate-700`} />;
}
