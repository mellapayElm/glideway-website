"use client";

import { useEffect, useRef } from "react";
import { Loader } from "@googlemaps/js-api-loader";

type Props = {
  pickup?: { lat: number; lng: number };
  dropoff?: { lat: number; lng: number };
  driver?: { lat: number; lng: number };
};

export default function GoogleMapLive({ pickup, dropoff, driver }: Props) {
  const mapRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    async function init() {
      if (!mapRef.current) return;

      const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;
      if (!apiKey) {
        mapRef.current.innerHTML = "<div style='padding:20px;color:#475569'>Missing NEXT_PUBLIC_GOOGLE_MAPS_API_KEY</div>";
        return;
      }

      const loader = new Loader({
        apiKey,
        version: "weekly",
      });

      await loader.load();

      const center = driver || pickup || { lat: 39.7392, lng: -104.9903 };
      const map = new google.maps.Map(mapRef.current, {
        center,
        zoom: 12,
        mapTypeControl: false,
        streetViewControl: false,
        fullscreenControl: false,
      });

      if (pickup) new google.maps.Marker({ position: pickup, map, title: "Pickup" });
      if (dropoff) new google.maps.Marker({ position: dropoff, map, title: "Drop-off" });
      if (driver) new google.maps.Marker({ position: driver, map, title: "Driver" });
    }

    init();
  }, [pickup, dropoff, driver]);

  return (
    <div
      ref={mapRef}
      style={{
        marginTop: 18,
        borderRadius: 18,
        background: "linear-gradient(135deg, #e2e8f0, #f8fafc)",
        height: 300,
        overflow: "hidden",
      }}
    />
  );
}