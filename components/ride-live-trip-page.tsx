"use client";

import { useEffect, useMemo, useState } from "react";
import RideStatusCard from "@/components/ride-status-card";
import RideChatPanel from "@/components/ride-chat-panel";
import RideSupportActions from "@/components/ride-support-actions";
import GoogleMapLive from "@/components/google-map-live";
import { fetchRideById } from "@/lib/api";
import { getTripsSocket, joinRideRoom, leaveRideRoom } from "@/lib/socket";

export default function RideLiveTripPage({ params }: { params: { rideId: string } }) {
  const rideId = params.rideId;
  const [ride, setRide] = useState<any>(null);
  const [location, setLocation] = useState<any>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let active = true;

    async function loadRide() {
      try {
        setLoading(true);
        const data = await fetchRideById(rideId);
        if (!active) return;
        setRide(data);
      } catch (err: any) {
        if (!active) return;
        setError(err?.message || "Failed to load ride");
      } finally {
        if (active) setLoading(false);
      }
    }

    loadRide();
    return () => {
      active = false;
    };
  }, [rideId]);

  useEffect(() => {
    const socket = getTripsSocket();
    joinRideRoom(rideId);

    socket.on("ride.updated", (payload: any) => {
      if (payload?.id === rideId || payload?.rideId === rideId) {
        setRide((prev: any) => ({ ...(prev || {}), ...payload }));
      }
    });

    socket.on("driver.location", (payload: any) => {
      if (payload?.rideId === rideId) {
        setLocation(payload);
      }
    });

    socket.on("payment.updated", (payload: any) => {
      if (payload?.rideId === rideId) {
        setRide((prev: any) => ({ ...(prev || {}), payment: payload }));
      }
    });

    socket.on("refund.updated", (payload: any) => {
      if (payload?.rideId === rideId) {
        setRide((prev: any) => ({ ...(prev || {}), refund: payload }));
      }
    });

    return () => {
      leaveRideRoom(rideId);
      socket.off("ride.updated");
      socket.off("driver.location");
      socket.off("payment.updated");
      socket.off("refund.updated");
    };
  }, [rideId]);

  const paymentText = useMemo(() => {
    const payment = ride?.payment;
    if (!payment) return "No payment update yet";
    return `${payment.status} • $${((payment.amountMinor || 0) / 100).toFixed(2)}`;
  }, [ride]);

  if (loading) {
    return <main style={{ padding: 24, fontFamily: "Arial, sans-serif" }}>Loading ride...</main>;
  }

  if (error) {
    return <main style={{ padding: 24, fontFamily: "Arial, sans-serif" }}>Error: {error}</main>;
  }

  const pickupCoords = ride?.pickupJson?.coordinates;
  const dropoffCoords = ride?.dropoffJson?.coordinates;
  const paymentId = ride?.payment?.id;

  return (
    <main style={{ padding: 24, fontFamily: "Arial, sans-serif", background: "#f8fafc", minHeight: "100vh" }}>
      <div style={{ maxWidth: 1100, margin: "0 auto" }}>
        <h1 style={{ marginBottom: 8 }}>GlideWay live trip</h1>
        <p style={{ color: "#475569", marginTop: 0 }}>Ride smoothly, glide easily.</p>

        <div style={{ display: "grid", gridTemplateColumns: "1.1fr 0.9fr", gap: 20, alignItems: "start" }}>
          <RideStatusCard
            rideId={ride?.id || rideId}
            status={ride?.status || "UNKNOWN"}
            estimatedFareMinor={ride?.estimatedFareMinor}
            finalFareMinor={ride?.finalFareMinor}
          />
          <GoogleMapLive
            pickup={pickupCoords}
            dropoff={dropoffCoords}
            lat={location.lat}
            lng={location.lng}
            heading={location.heading}
            speedKph={location.speedKph}
          />
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20, marginTop: 20 }}>
          <div style={{ border: "1px solid #e2e8f0", borderRadius: 20, padding: 20, background: "#fff" }}>
            <h3 style={{ marginTop: 0 }}>Payment status</h3>
            <p>{paymentText}</p>
          </div>
          <RideSupportActions rideId={rideId} paymentId={paymentId} />
        </div>

        <div style={{ marginTop: 20 }}>
          <RideChatPanel rideId={rideId} />
        </div>
      </div>
    </main>
  );
}
