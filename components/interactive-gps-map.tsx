'use client';

import React, { useEffect, useRef, useState } from 'react';
import { MapPin, Navigation, Zap, Phone } from 'lucide-react';

interface LatLng {
  lat: number;
  lng: number;
}

interface RouteInfo {
  distance: string;
  duration: string;
  pickupLocation: string;
  dropoffLocation: string;
}

export function InteractiveMapComponent() {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<any>(null);
  const [pickupLocation, setPickupLocation] = useState<LatLng>({ lat: 40.7128, lng: -74.0060 });
  const [dropoffLocation, setDropoffLocation] = useState<LatLng>({ lat: 40.7580, lng: -73.9855 });
  const [routeInfo, setRouteInfo] = useState<RouteInfo>({
    distance: '2.5 km',
    duration: '12 mins',
    pickupLocation: 'Times Square, NY',
    dropoffLocation: 'Central Park, NY'
  });

  useEffect(() => {
    // Load Leaflet CSS dynamically
    if (!document.querySelector('link[href*="leaflet"]')) {
      const link = document.createElement('link');
      link.rel = 'stylesheet';
      link.href = 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/leaflet.min.css';
      document.head.appendChild(link);
    }

    // Load Leaflet JS dynamically
    if (!(window as any).L) {
      const script = document.createElement('script');
      script.src = 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/leaflet.min.js';
      script.async = true;
      script.onload = () => initMap();
      document.body.appendChild(script);
    } else {
      initMap();
    }
  }, []);

  const initMap = () => {
    if (!mapContainer.current || map.current) return;

    const L = (window as any).L;
    const center = [(pickupLocation.lat + dropoffLocation.lat) / 2, (pickupLocation.lng + dropoffLocation.lng) / 2];

    map.current = L.map(mapContainer.current).setView(center, 13);

    // OpenStreetMap tiles (free, no API key needed)
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© OpenStreetMap contributors',
      maxZoom: 19,
    }).addTo(map.current);

    // Add pickup marker
    const pickupIcon = L.divIcon({
      html: `<div style="background-color: #10b981; color: white; width: 40px; height: 40px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 20px; font-weight: bold; border: 3px solid white; box-shadow: 0 2px 8px rgba(0,0,0,0.3);">P</div>`,
      iconSize: [40, 40],
      className: 'custom-icon'
    });
    L.marker([pickupLocation.lat, pickupLocation.lng], { icon: pickupIcon })
      .bindPopup('Pickup Location')
      .addTo(map.current);

    // Add dropoff marker
    const dropoffIcon = L.divIcon({
      html: `<div style="background-color: #ef4444; color: white; width: 40px; height: 40px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 20px; font-weight: bold; border: 3px solid white; box-shadow: 0 2px 8px rgba(0,0,0,0.3);">D</div>`,
      iconSize: [40, 40],
      className: 'custom-icon'
    });
    L.marker([dropoffLocation.lat, dropoffLocation.lng], { icon: dropoffIcon })
      .bindPopup('Dropoff Location')
      .addTo(map.current);

    // Draw route line
    const routeLine = L.polyline(
      [[pickupLocation.lat, pickupLocation.lng], [dropoffLocation.lat, dropoffLocation.lng]],
      { color: '#10b981', weight: 3, opacity: 0.7, dashArray: '5, 5' }
    ).addTo(map.current);

    // Fit bounds
    map.current.fitBounds(routeLine.getBounds(), { padding: [50, 50] });
  };

  const handleSwapLocations = () => {
    const temp = pickupLocation;
    setPickupLocation(dropoffLocation);
    setDropoffLocation(temp);

    if (map.current) {
      const L = (window as any).L;
      map.current.remove();
      map.current = null;
      setTimeout(initMap, 100);
    }
  };

  return (
    <div className="w-full h-screen flex flex-col bg-gray-900">
      {/* Top Header */}
      <div className="bg-gradient-to-r from-emerald-600 to-emerald-700 text-white p-4 shadow-lg">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <MapPin className="w-8 h-8" />
            <h1 className="text-2xl font-bold">GlideWay Live Navigation</h1>
          </div>
          <div className="flex items-center gap-3 bg-white/10 px-4 py-2 rounded-lg">
            <Zap className="w-5 h-5" />
            <span className="text-sm font-semibold">Live GPS Tracking</span>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex gap-4 p-4 max-w-6xl mx-auto w-full">
        {/* Map Container */}
        <div className="flex-1 rounded-xl overflow-hidden shadow-xl border border-gray-700">
          <div ref={mapContainer} className="w-full h-full bg-gray-800" />
        </div>

        {/* Side Panel */}
        <div className="w-80 bg-gray-800 rounded-xl border border-gray-700 shadow-xl p-6 flex flex-col gap-6">
          {/* Driver Info */}
          <div className="bg-gradient-to-br from-emerald-600/20 to-emerald-500/10 rounded-lg p-4 border border-emerald-500/30">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-12 h-12 rounded-full bg-emerald-500 flex items-center justify-center text-white font-bold">
                AJ
              </div>
              <div>
                <p className="text-white font-semibold">Ahmed Johnson</p>
                <p className="text-gray-400 text-sm">5★ (4.8 rating)</p>
              </div>
            </div>
            <div className="flex gap-2">
              <button className="flex-1 bg-emerald-600 hover:bg-emerald-500 text-white py-2 rounded-lg flex items-center justify-center gap-2 transition">
                <Phone className="w-4 h-4" />
                Call
              </button>
              <button className="flex-1 bg-gray-700 hover:bg-gray-600 text-white py-2 rounded-lg flex items-center justify-center gap-2 transition">
                <Navigation className="w-4 h-4" />
                Share
              </button>
            </div>
          </div>

          {/* Route Info */}
          <div className="space-y-3">
            <h3 className="text-white font-semibold flex items-center gap-2">
              <MapPin className="w-5 h-5 text-emerald-400" />
              Route Information
            </h3>

            {/* Pickup */}
            <div className="bg-gray-700/50 rounded-lg p-3 border-l-4 border-emerald-500">
              <p className="text-gray-400 text-xs uppercase font-semibold tracking-wide">Pickup</p>
              <p className="text-white font-semibold">{routeInfo.pickupLocation}</p>
              <p className="text-gray-400 text-sm">40.7128°N, 74.0060°W</p>
            </div>

            {/* Swap Button */}
            <button
              onClick={handleSwapLocations}
              className="w-full bg-gray-700 hover:bg-gray-600 text-white py-2 rounded-lg transition flex items-center justify-center gap-2"
            >
              <Navigation className="w-4 h-4 rotate-90" />
              Swap Locations
            </button>

            {/* Dropoff */}
            <div className="bg-gray-700/50 rounded-lg p-3 border-l-4 border-red-500">
              <p className="text-gray-400 text-xs uppercase font-semibold tracking-wide">Dropoff</p>
              <p className="text-white font-semibold">{routeInfo.dropoffLocation}</p>
              <p className="text-gray-400 text-sm">40.7580°N, 73.9855°W</p>
            </div>
          </div>

          {/* Trip Stats */}
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-emerald-500/10 border border-emerald-500/30 rounded-lg p-3 text-center">
              <p className="text-emerald-400 text-2xl font-bold">{routeInfo.distance}</p>
              <p className="text-gray-400 text-xs">Distance</p>
            </div>
            <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-3 text-center">
              <p className="text-blue-400 text-2xl font-bold">{routeInfo.duration}</p>
              <p className="text-gray-400 text-xs">Estimated Time</p>
            </div>
          </div>

          {/* Live Status */}
          <div className="bg-gray-700/50 rounded-lg p-3 border border-gray-600">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
              <p className="text-green-400 text-sm font-semibold">Live GPS Tracking Active</p>
            </div>
            <p className="text-gray-400 text-xs">Updates: Every 2 seconds</p>
            <p className="text-gray-400 text-xs">Signal: Strong (4G LTE)</p>
          </div>
        </div>
      </div>

      {/* Bottom Info */}
      <div className="bg-gray-800 border-t border-gray-700 p-4">
        <p className="text-center text-gray-500 text-xs">Powered by OpenStreetMap • Free GPS Navigation • No API Key Required</p>
      </div>
    </div>
  );
}
