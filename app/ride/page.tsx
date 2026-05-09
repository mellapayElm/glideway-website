"use client";

import { useEffect, useRef, useState } from "react";
import { io } from "socket.io-client";
import {
  LoadScript,
  GoogleMap,
  DirectionsRenderer,
  Autocomplete,
  Marker,
} from "@react-google-maps/api";

const socket = io("http://localhost:5000");

const center = { lat: 38.8339, lng: -104.8214 };
const libraries: "places"[] = ["places"];

export default function RidePage() {
  const [pickup, setPickup] = useState("");
  const [dropoff, setDropoff] = useState("");
  const [rideType, setRideType] = useState("Standard");
  const [directions, setDirections] = useState<google.maps.DirectionsResult | null>(null);
  const [distance, setDistance] = useState("");
  const [duration, setDuration] = useState("");
  const [fare, setFare] = useState<number | null>(null);
  const [message, setMessage] = useState("");

  const [rideStatus, setRideStatus] = useState("Ready to ride");
  const [statusIcon, setStatusIcon] = useState("car");
  const [step, setStep] = useState("requested");

  const [driverLocation, setDriverLocation] = useState<{lat: number; lng: number} | null>(null);
  const [smoothDriverLocation, setSmoothDriverLocation] = useState<{lat: number; lng: number} | null>(null);
  const [driverInfo, setDriverInfo] = useState<{name?: string; photo?: string; car?: string; color?: string; plate?: string} | null>(null);
  const [nearbyDrivers, setNearbyDrivers] = useState<{id?: string; driverId?: string; lat: number; lng: number; name?: string}[]>([]);
  const [activeRideId, setActiveRideId] = useState("");
  const [liveEta, setLiveEta] = useState("Waiting for driver");

  const [chatMessages, setChatMessages] = useState<{id: string; sender: string; senderName: string; text: string; time?: string}[]>([]);
  const [chatText, setChatText] = useState("");

  const pickupRef = useRef<google.maps.places.Autocomplete | null>(null);
  const dropoffRef = useRef<google.maps.places.Autocomplete | null>(null);

  useEffect(() => {
    socket.off("connect");
    socket.off("driverLocation");
    socket.off("rideAccepted");
    socket.off("driverArrived");
    socket.off("tripStarted");
    socket.off("tripCompleted");
    socket.off("receiveChatMessage");

    socket.on("connect", () => {
      console.log("Rider connected:", socket.id);
    });

    socket.on("driverLocation", (driver) => {
      setDriverLocation(driver);
      setDriverInfo(driver);
      setSmoothDriverLocation((current) => current || driver);
      setLiveEta("Driver is moving toward you");
    });

    socket.on("rideAccepted", (data) => {
      setDriverInfo(data.driver);
      setStep("accepted");
      setRideStatus("Driver accepted your ride and is heading to pickup");
      setStatusIcon("check");
      setLiveEta("Driver is on the way");
      setMessage("Your driver is on the way.");
    });

    socket.on("driverArrived", () => {
      setStep("arrived");
      setRideStatus("Driver has arrived at your pickup location");
      setStatusIcon("pin");
      setLiveEta("Driver has arrived");
      setMessage("Please meet your driver safely.");
    });

    socket.on("tripStarted", () => {
      setStep("started");
      setRideStatus("Trip started");
      setStatusIcon("driving");
      setLiveEta("Trip in progress");
      setMessage("Enjoy your GlideWay ride.");
    });

    socket.on("tripCompleted", () => {
      setStep("completed");
      setRideStatus("Trip completed");
      setStatusIcon("complete");
      setLiveEta("Completed");
      setMessage("Thank you for riding with GlideWay.");
    });

    socket.on("receiveChatMessage", (msg) => {
      setChatMessages((prev) => {
        if (prev.find((m) => m.id === msg.id)) return prev;
        return [...prev, msg];
      });
    });

    async function loadNearbyDrivers() {
      try {
        const res = await fetch("http://localhost:5000/drivers/nearby");
        const data = await res.json();

        if (data.success) {
          setNearbyDrivers(data.drivers || []);
        }
      } catch (error) {
        console.error("Nearby drivers error:", error);
      }
    }

    loadNearbyDrivers();
    const nearbyInterval = setInterval(loadNearbyDrivers, 3000);

    return () => {
      clearInterval(nearbyInterval);
      socket.off("connect");
      socket.off("driverLocation");
      socket.off("rideAccepted");
      socket.off("driverArrived");
      socket.off("tripStarted");
      socket.off("tripCompleted");
      socket.off("receiveChatMessage");
    };
  }, []);

  useEffect(() => {
    if (!driverLocation || !smoothDriverLocation) return;

    const interval = setInterval(() => {
      setSmoothDriverLocation((current) => {
        if (!current) return driverLocation;

        return {
          ...driverLocation,
          lat:
            Number(current.lat) +
            (Number(driverLocation.lat) - Number(current.lat)) * 0.2,
          lng:
            Number(current.lng) +
            (Number(driverLocation.lng) - Number(current.lng)) * 0.2,
        };
      });
    }, 500);

    return () => clearInterval(interval);
  }, [driverLocation, smoothDriverLocation]);

  const steps = ["requested", "accepted", "arrived", "started", "completed"];
  const currentStepIndex = steps.indexOf(step);

  function sendChatMessage() {
    if (!chatText.trim()) return;

    if (!activeRideId) {
      setMessage("Please request a ride first before sending a message.");
      return;
    }

    const chatMessage = {
      id: "msg_" + Date.now(),
      rideId: activeRideId,
      sender: "rider",
      senderName: "Rider",
      text: chatText,
      time: new Date().toISOString(),
    };

    setChatMessages((current) => [...current, chatMessage]);
    socket.emit("sendChatMessage", chatMessage);
    setChatText("");
  }

  function onPickupPlaceChanged() {
    const place = pickupRef.current?.getPlace();
    if (place?.formatted_address) setPickup(place.formatted_address);
    else if (place?.name) setPickup(place.name);
  }

  function onDropoffPlaceChanged() {
    const place = dropoffRef.current?.getPlace();
    if (place?.formatted_address) setDropoff(place.formatted_address);
    else if (place?.name) setDropoff(place.name);
  }

  function calculateRoute() {
    if (!pickup || !dropoff) {
      setMessage("Please enter pickup and drop-off locations.");
      return;
    }

    const service = new window.google.maps.DirectionsService();

    service.route(
      {
        origin: pickup,
        destination: dropoff,
        travelMode: window.google.maps.TravelMode.DRIVING,
      },
      (result, status) => {
        if (status === "OK" && result) {
          setDirections(result);

          const leg = result.routes[0].legs[0];
          setDistance(leg.distance?.text || "");
          setDuration(leg.duration?.text || "");

          const miles = (leg.distance?.value || 0) / 1609.34;
          const baseFare = 4.5;
          const perMile =
            rideType === "Premium"
              ? 3.5
              : rideType === "Comfort"
              ? 2.75
              : rideType === "Family"
              ? 3.0
              : 2.1;

          setFare(Number((baseFare + miles * perMile).toFixed(2)));
          setStep("requested");
          setRideStatus("Route calculated. Ready to request your ride.");
          setStatusIcon("route");
          setLiveEta(leg.duration?.text || "");
          setMessage("Route calculated successfully.");
        } else {
          setMessage("Route not found. Please choose addresses from autocomplete.");
        }
      }
    );
  }

  async function requestRide() {
    if (!pickup || !dropoff) {
      setMessage("Please enter pickup and drop-off locations.");
      return;
    }

    try {
      setStep("requested");
      setRideStatus("Searching for the nearest GlideWay driver");
      setStatusIcon("search");
      setLiveEta("Searching nearby drivers");

      const res = await fetch("http://localhost:5000/rides/request", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          pickup,
          dropoff,
          pickupAddress: pickup,
          dropoffAddress: dropoff,
          rideType,
          distance,
          eta: duration,
          estimatedFare: fare,
          fare,
        }),
      });

      const data = await res.json();

      if (!data.success) {
        setMessage(data.message || "Ride request failed.");
        setRideStatus("Ride request failed");
        setStatusIcon("warning");
        return;
      }

      setActiveRideId(data.ride.rideId);
      setRideStatus("Ride requested. Waiting for driver confirmation.");
      setStatusIcon("phone");
      setLiveEta("Waiting for driver confirmation");
      setMessage(`Ride requested successfully. Ride ID: ${data.ride.rideId}`);
    } catch {
      setRideStatus("Backend connection failed");
      setStatusIcon("warning");
      setLiveEta("Unavailable");
      setMessage("Backend connection failed. Make sure backend is running.");
    }
  }

  const getStatusIcon = () => {
    switch (statusIcon) {
      case "car": return "🚘";
      case "check": return "✅";
      case "pin": return "📍";
      case "driving": return "🚗";
      case "complete": return "🎉";
      case "route": return "🛣️";
      case "search": return "🔎";
      case "phone": return "📲";
      case "warning": return "⚠️";
      default: return "🚘";
    }
  };

  return (
    <main style={pageStyle}>
      <LoadScript
        googleMapsApiKey={process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY as string}
        libraries={libraries}
      >
        <div style={layoutStyle}>
          <div style={panelStyle}>
            <h1 style={titleStyle}>Ride with GlideWay</h1>

            <div style={statusCard}>
              <div style={statusIconBox}>{getStatusIcon()}</div>
              <div>
                <h2 style={statusTitle}>{rideStatus}</h2>
                <p style={statusText}>ETA: {liveEta}</p>
              </div>
            </div>

            <div style={progressWrap}>
              {steps.map((s, i) => (
                <div
                  key={s}
                  style={{
                    flex: 1,
                    textAlign: "center",
                    color: i <= currentStepIndex ? "#16a34a" : "#9ca3af",
                    fontWeight: i === currentStepIndex ? 800 : 600,
                  }}
                >
                  ●
                  <div style={{ fontSize: "12px", textTransform: "capitalize" }}>
                    {s}
                  </div>
                </div>
              ))}
            </div>

            {driverInfo && (
              <div style={driverCard}>
                <img
                  src={driverInfo.photo || "https://randomuser.me/api/portraits/men/32.jpg"}
                  alt="Driver"
                  style={driverPhoto}
                  crossOrigin="anonymous"
                />
                <div>
                  <h3 style={{ margin: 0, color: "#111827" }}>
                    {driverInfo.name || "GlideWay Driver"}
                  </h3>
                  <p style={{ margin: "5px 0", color: "#374151" }}>
                    {driverInfo.color || "Black"} {driverInfo.car || "Vehicle"}
                  </p>
                  <p style={{ margin: 0, color: "#166534", fontWeight: 800 }}>
                    Plate: {driverInfo.plate || "N/A"}
                  </p>
                </div>
              </div>
            )}

            <Autocomplete
              onLoad={(autocomplete) => (pickupRef.current = autocomplete)}
              onPlaceChanged={onPickupPlaceChanged}
            >
              <input
                placeholder="Enter pickup location"
                value={pickup}
                onChange={(e) => setPickup(e.target.value)}
                style={inputStyle}
              />
            </Autocomplete>

            <Autocomplete
              onLoad={(autocomplete) => (dropoffRef.current = autocomplete)}
              onPlaceChanged={onDropoffPlaceChanged}
            >
              <input
                placeholder="Enter drop-off location"
                value={dropoff}
                onChange={(e) => setDropoff(e.target.value)}
                style={inputStyle}
              />
            </Autocomplete>

            <select
              value={rideType}
              onChange={(e) => setRideType(e.target.value)}
              style={inputStyle}
            >
              <option>Standard</option>
              <option>Comfort</option>
              <option>Family</option>
              <option>Premium</option>
            </select>

            <button onClick={calculateRoute} style={buttonStyle}>
              Calculate Route & Fare
            </button>

            {fare !== null && (
              <div style={estimateBox}>
                <p><b>Distance:</b> {distance}</p>
                <p><b>Estimated Time:</b> {duration}</p>
                <p><b>Estimated Fare:</b> ${fare.toFixed(2)}</p>
              </div>
            )}

            <button onClick={requestRide} style={requestButtonStyle}>
              Request Ride
            </button>

            {activeRideId && (
              <div style={rideIdBox}>
                <b>Active Ride:</b> {activeRideId}
              </div>
            )}

            <div style={nearbyBox}>
              Nearby drivers: <b>{nearbyDrivers.length}</b>
            </div>

            <div style={chatBox}>
              <div style={chatHeader}>💬 Message Your Driver</div>

              <div style={chatMessagesBox}>
                {chatMessages.length === 0 ? (
                  <p style={{ color: "#6b7280", fontSize: "14px" }}>
                    No messages yet. Send a quick note to your driver.
                  </p>
                ) : (
                  chatMessages.map((msg, index) => (
                    <div
                      key={`${msg.id}-${index}`}
                      style={{
                        display: "flex",
                        justifyContent:
                          msg.sender === "rider" ? "flex-end" : "flex-start",
                        marginBottom: "8px",
                      }}
                    >
                      <div
                        style={{
                          maxWidth: "75%",
                          padding: "10px 12px",
                          borderRadius: "14px",
                          background:
                            msg.sender === "rider" ? "#166534" : "#e5e7eb",
                          color: msg.sender === "rider" ? "#ffffff" : "#111827",
                          fontSize: "14px",
                        }}
                      >
                        <b>{msg.senderName}</b>
                        <div>{msg.text}</div>
                      </div>
                    </div>
                  ))
                )}
              </div>

              <div style={chatInputRow}>
                <input
                  value={chatText}
                  onChange={(e) => setChatText(e.target.value)}
                  placeholder="Type message..."
                  style={chatInput}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") sendChatMessage();
                  }}
                />
                <button onClick={sendChatMessage} style={chatButton}>
                  Send
                </button>
              </div>
            </div>

            {message && <p style={messageStyle}>{message}</p>}
          </div>

          <GoogleMap
            mapContainerStyle={mapStyle}
            center={
              smoothDriverLocation
                ? {
                    lat: Number(smoothDriverLocation.lat),
                    lng: Number(smoothDriverLocation.lng),
                  }
                : nearbyDrivers[0]
                ? {
                    lat: Number(nearbyDrivers[0].lat),
                    lng: Number(nearbyDrivers[0].lng),
                  }
                : center
            }
            zoom={13}
          >
            {directions && <DirectionsRenderer directions={directions} />}

            {nearbyDrivers.map((driver) => (
              <Marker
                key={driver.id || driver.driverId}
                position={{
                  lat: Number(driver.lat),
                  lng: Number(driver.lng),
                }}
                title={`${driver.name || "GlideWay Driver"} nearby`}
                label="🚗"
              />
            ))}

            {smoothDriverLocation && (
              <Marker
                position={{
                  lat: Number(smoothDriverLocation.lat),
                  lng: Number(smoothDriverLocation.lng),
                }}
                title="Assigned GlideWay Driver"
                label="🚘"
              />
            )}
          </GoogleMap>
        </div>
      </LoadScript>
    </main>
  );
}

const pageStyle: React.CSSProperties = {
  padding: "40px",
  background: "#f9fafb",
  minHeight: "100vh",
};

const layoutStyle: React.CSSProperties = {
  display: "grid",
  gridTemplateColumns: "1fr 1fr",
  gap: "20px",
};

const panelStyle: React.CSSProperties = {
  background: "#ffffff",
  padding: "28px",
  borderRadius: "20px",
  boxShadow: "0 12px 30px rgba(0,0,0,0.08)",
};

const titleStyle: React.CSSProperties = {
  color: "#166534",
  fontSize: "32px",
  marginBottom: "16px",
};

const statusCard: React.CSSProperties = {
  display: "flex",
  gap: "16px",
  alignItems: "center",
  padding: "18px",
  borderRadius: "18px",
  background: "linear-gradient(135deg, #dcfce7, #eff6ff)",
  border: "1px solid #bbf7d0",
  marginBottom: "12px",
};

const progressWrap: React.CSSProperties = {
  display: "flex",
  justifyContent: "space-between",
  marginBottom: "16px",
  padding: "12px",
  background: "#f1f5f9",
  borderRadius: "14px",
};

const statusIconBox: React.CSSProperties = {
  width: "54px",
  height: "54px",
  borderRadius: "16px",
  background: "#166534",
  color: "#ffffff",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  fontSize: "26px",
};

const statusTitle: React.CSSProperties = {
  margin: 0,
  color: "#14532d",
  fontSize: "18px",
};

const statusText: React.CSSProperties = {
  margin: "6px 0 0",
  color: "#374151",
  fontSize: "14px",
  fontWeight: 700,
};

const driverCard: React.CSSProperties = {
  display: "flex",
  alignItems: "center",
  gap: "14px",
  padding: "16px",
  borderRadius: "16px",
  background: "#f0fdf4",
  border: "1px solid #bbf7d0",
  marginBottom: "16px",
};

const driverPhoto: React.CSSProperties = {
  width: "64px",
  height: "64px",
  borderRadius: "50%",
  objectFit: "cover",
  border: "3px solid #16a34a",
};

const inputStyle: React.CSSProperties = {
  width: "100%",
  padding: "14px",
  marginTop: "12px",
  borderRadius: "12px",
  border: "1px solid #d1d5db",
  fontSize: "16px",
  color: "#111827",
  background: "#ffffff",
  outline: "none",
};

const buttonStyle: React.CSSProperties = {
  width: "100%",
  marginTop: "15px",
  padding: "14px",
  background: "#166534",
  color: "white",
  border: "none",
  borderRadius: "12px",
  fontWeight: 800,
  cursor: "pointer",
};

const requestButtonStyle: React.CSSProperties = {
  width: "100%",
  marginTop: "15px",
  padding: "17px",
  background: "#14532d",
  color: "white",
  border: "none",
  borderRadius: "14px",
  fontWeight: 900,
  fontSize: "17px",
  cursor: "pointer",
};

const estimateBox: React.CSSProperties = {
  marginTop: "16px",
  padding: "16px",
  borderRadius: "14px",
  background: "#ecfdf5",
  color: "#111827",
};

const rideIdBox: React.CSSProperties = {
  marginTop: "14px",
  padding: "12px",
  borderRadius: "12px",
  background: "#fefce8",
  color: "#713f12",
};

const nearbyBox: React.CSSProperties = {
  marginTop: "14px",
  padding: "12px",
  borderRadius: "12px",
  background: "#eff6ff",
  color: "#1e40af",
  fontWeight: 800,
};

const chatBox: React.CSSProperties = {
  marginTop: "18px",
  padding: "14px",
  borderRadius: "18px",
  background: "#f8fafc",
  border: "1px solid #dbeafe",
};

const chatHeader: React.CSSProperties = {
  fontWeight: 900,
  color: "#14532d",
  marginBottom: "10px",
};

const chatMessagesBox: React.CSSProperties = {
  minHeight: "120px",
  maxHeight: "220px",
  overflowY: "auto",
  padding: "10px",
  borderRadius: "14px",
  background: "#ffffff",
};

const chatInputRow: React.CSSProperties = {
  display: "flex",
  gap: "8px",
  marginTop: "10px",
};

const chatInput: React.CSSProperties = {
  flex: 1,
  padding: "12px",
  borderRadius: "12px",
  border: "1px solid #d1d5db",
  color: "#111827",
  background: "#ffffff",
};

const chatButton: React.CSSProperties = {
  padding: "12px 16px",
  borderRadius: "12px",
  border: "none",
  background: "#166534",
  color: "#ffffff",
  fontWeight: 800,
  cursor: "pointer",
};

const messageStyle: React.CSSProperties = {
  marginTop: "16px",
  padding: "14px",
  borderRadius: "14px",
  background: "#fef3c7",
  color: "#92400e",
  fontWeight: 600,
};

const mapStyle: React.CSSProperties = {
  width: "100%",
  height: "calc(100vh - 80px)",
  borderRadius: "20px",
};
