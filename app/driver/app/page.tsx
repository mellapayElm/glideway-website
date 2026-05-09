"use client";

import { useEffect, useRef, useState } from "react";
import { io } from "socket.io-client";
import Protected from "@/components/Protected";
import Link from "next/link";

const socket = io("http://localhost:5000");

const driver = {
  driverId: "driver-001",
  name: "Berhane H.",
  car: "Toyota Camry",
  plate: "GLD-2026",
  color: "Black",
  verified: true,
  photo: "https://randomuser.me/api/portraits/men/32.jpg",
};

const fallbackLocation = {
  lat: 38.8339,
  lng: -104.8214,
};

interface LocationData {
  lat: number;
  lng: number;
  accuracy?: number | null;
  speed?: number | null;
  heading?: number | null;
  calculatedHeading?: number;
  source: "gps" | "demo";
}

interface RideData {
  rideId: string;
  pickup?: string;
  pickupAddress?: string;
  dropoff?: string;
  dropoffAddress?: string;
  destination?: string;
  distance?: string;
  distanceMiles?: string;
  eta?: string;
  fare?: number;
  estimatedFare?: number;
  rider?: {
    photo?: string;
    name?: string;
    riderId?: string;
    id?: string;
  };
}

interface ChatMessage {
  id: string;
  sender: string;
  senderName: string;
  text: string;
}

export default function DriverApp() {
  const [online, setOnline] = useState(false);
  const [ride, setRide] = useState<RideData | null>(null);
  const [status, setStatus] = useState("Offline");
  const [step, setStep] = useState("waiting");
  const [location, setLocation] = useState<LocationData | null>(null);
  const [safetyMessage, setSafetyMessage] = useState("");

  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [chatText, setChatText] = useState("");

  const watchId = useRef<number | null>(null);
  const demoTimer = useRef<ReturnType<typeof setInterval> | null>(null);
  const lastLocation = useRef<{lat: number; lng: number} | null>(null);
  const alertAudioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    alertAudioRef.current = new Audio(
      "https://actions.google.com/sounds/v1/alarms/alarm_clock.ogg"
    );
    alertAudioRef.current.loop = true;

    socket.on("connect", () => {
      console.log("Driver connected:", socket.id);
    });

    socket.on("newRideRequest", (rideData: RideData) => {
      alert("New Ride Request!");
      console.log("New Ride Received:", rideData);

      setRide(rideData);
      setStatus("New ride request received!");
      setStep("requested");
      playAlert();
    });

   socket.on("receiveChatMessage", (chatMessage: ChatMessage) => {
      console.log("Driver received chat:", chatMessage);
      setChatMessages((current) => [...current, chatMessage]);
    });

    socket.on("safetyReportReceived", (report: {type?: string}) => {
      setSafetyMessage(`Safety notice received: ${report.type || "Report"}`);
    });

    return () => {
      socket.off("connect");
      socket.off("newRideRequest");
      socket.off("receiveChatMessage");
      socket.off("safetyReportReceived");
      stopAlert();

      if (watchId.current !== null) {
        navigator.geolocation.clearWatch(watchId.current);
      }

      if (demoTimer.current) {
        clearInterval(demoTimer.current);
      }
    };
  }, [ride?.rideId]);

  function sendChatMessage() {
    if (!chatText.trim()) return;

    const chatMessage = {
      id: "msg_" + Date.now(),
      rideId: ride?.rideId || "",
      sender: "driver",
      senderName: driver.name,
      text: chatText,
    };

    setChatMessages((current) => [...current, chatMessage]);
    socket.emit("sendChatMessage", chatMessage);
    setChatText("");
  }

  function playAlert() {
    if (navigator.vibrate) {
      navigator.vibrate([500, 200, 500, 200, 500]);
    }

    try {
      const audioContext = new AudioContext();

      const beep = () => {
        const oscillator = audioContext.createOscillator();
        const gain = audioContext.createGain();

        oscillator.connect(gain);
        gain.connect(audioContext.destination);

        oscillator.type = "sine";
        oscillator.frequency.value = 880;
        gain.gain.value = 0.3;

        oscillator.start();
        oscillator.stop(audioContext.currentTime + 0.4);
      };

      beep();
      setTimeout(beep, 700);
      setTimeout(beep, 1400);
    } catch (e) {
      console.log("Audio alert failed:", e);
    }
  }

  function stopAlert() {
    if (alertAudioRef.current) {
      alertAudioRef.current.pause();
      alertAudioRef.current.currentTime = 0;
    }
  }

  function calculateHeading(from: {lat: number; lng: number}, to: {lat: number; lng: number}) {
    if (!from || !to) return 0;

    const lat1 = (from.lat * Math.PI) / 180;
    const lat2 = (to.lat * Math.PI) / 180;
    const lngDiff = ((to.lng - from.lng) * Math.PI) / 180;

    const y = Math.sin(lngDiff) * Math.cos(lat2);
    const x =
      Math.cos(lat1) * Math.sin(lat2) -
      Math.sin(lat1) * Math.cos(lat2) * Math.cos(lngDiff);

    const heading = (Math.atan2(y, x) * 180) / Math.PI;
    return (heading + 360) % 360;
  }

  function sendDriverLocation(positionData: {
    lat: number;
    lng: number;
    accuracy?: number;
    speed?: number | null;
    heading?: number | null;
    source: "gps" | "demo";
  }) {
    const previous = lastLocation.current;
    const current = { lat: positionData.lat, lng: positionData.lng };

    const calculatedHeading = previous
      ? calculateHeading(previous, current)
      : positionData.heading || 0;

    const driverData = {
      ...driver,
      lat: positionData.lat,
      lng: positionData.lng,
      heading: positionData.heading ?? calculatedHeading,
      calculatedHeading,
      speed: positionData.speed ?? 0,
      accuracy: positionData.accuracy ?? null,
      timestamp: Date.now(),
      source: positionData.source,
      status: "online",
    };

    lastLocation.current = current;
    setLocation({
      lat: positionData.lat,
      lng: positionData.lng,
      accuracy: positionData.accuracy,
      speed: positionData.speed,
      heading: positionData.heading,
      calculatedHeading,
      source: positionData.source,
    });

    socket.emit("registerDriver", driverData);
    socket.emit("driverOnline", driverData);
    socket.emit("driverLocationUpdate", driverData);
  }

  function goOnline() {
    setStatus("Starting GPS stream...");
    playAlert();
    setTimeout(() => stopAlert(), 700);

    if (!navigator.geolocation) {
      startDemoMovement();
      setOnline(true);
      setStatus("Online with demo GPS stream. Waiting for rides.");
      return;
    }

    watchId.current = navigator.geolocation.watchPosition(
      (pos) => {
        sendDriverLocation({
          lat: pos.coords.latitude,
          lng: pos.coords.longitude,
          accuracy: pos.coords.accuracy,
          speed: pos.coords.speed,
          heading: pos.coords.heading,
          source: "gps",
        });

        setOnline(true);
        setStatus("Online and waiting for ride requests");
      },
      () => {
        startDemoMovement();
        setOnline(true);
        setStatus("GPS unavailable. Online with demo GPS stream.");
      },
      {
        enableHighAccuracy: true,
        maximumAge: 0,
        timeout: 8000,
      }
    );
  }

  function startDemoMovement() {
    if (demoTimer.current) clearInterval(demoTimer.current);

    let lat = fallbackLocation.lat;
    let lng = fallbackLocation.lng;

    sendDriverLocation({
      lat,
      lng,
      accuracy: 10,
      speed: 12,
      heading: 45,
      source: "demo",
    });

    demoTimer.current = setInterval(() => {
      lat += 0.00035;
      lng += 0.00025;

      sendDriverLocation({
        lat,
        lng,
        accuracy: 10,
        speed: 12,
        heading: null,
        source: "demo",
      });
    }, 3000);
  }

  function goOffline() {
    stopAlert();

    if (watchId.current !== null) {
      navigator.geolocation.clearWatch(watchId.current);
      watchId.current = null;
    }

    if (demoTimer.current) {
      clearInterval(demoTimer.current);
      demoTimer.current = null;
    }

    setOnline(false);
    setRide(null);
    setStep("waiting");
    setStatus("Offline");
  }

  async function updateRideStatus(nextStatus: string) {
    if (!ride?.rideId) return;

    try {
      const res = await fetch(
        `http://localhost:5000/rides/${ride.rideId}/status`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            status: nextStatus,
            driverId: driver.driverId,
          }),
        }
      );

      const data = await res.json();

      if (!data.success) {
        setStatus(data.message || "Unable to update ride status.");
        return;
      }

      setRide(data.ride);
    } catch (error) {
      console.error("Ride status update failed:", error);
      setStatus("Unable to update ride status.");
    }
  }

  async function acceptRide() {
    if (!ride) return;

    stopAlert();

    await updateRideStatus("accepted");

    setStatus("Ride accepted. Navigate to pickup.");
    setStep("accepted");

    socket.emit("rideAccepted", {
      ride,
      driver,
      driverLocation: location,
    });
  }

  async function driverArrived() {
    await updateRideStatus("arrived");

    setStatus("Driver arrived at pickup.");
    setStep("arrived");

    socket.emit("driverArrived", {
      ride,
      driver,
      driverLocation: location,
    });
  }

  async function startTrip() {
    await updateRideStatus("started");

    setStatus("Trip started. Drive safely.");
    setStep("started");

    socket.emit("tripStarted", {
      ride,
      driver,
      driverLocation: location,
    });
  }

  async function completeTrip() {
    await updateRideStatus("completed");

    setStatus("Trip completed.");
    setStep("completed");

    socket.emit("tripCompleted", {
      ride,
      driver,
      driverLocation: location,
    });
  }

  function declineRide() {
    stopAlert();
    setRide(null);
    setStep("waiting");
    setStatus("Online and waiting for ride requests");
  }

  const pickupText = ride?.pickup || ride?.pickupAddress || "Pending";
  const destinationText =
    ride?.destination || ride?.dropoff || ride?.dropoffAddress || "Pending";

  const riderPhoto =
    ride?.rider?.photo || "https://randomuser.me/api/portraits/men/75.jpg";

  const riderName = ride?.rider?.name || "Verified Rider";

  const riderId =
    ride?.rider?.riderId ||
    ride?.rider?.id ||
    `RIDER-${ride?.rideId || "UNKNOWN"}`;

  const navDestination = step === "started" ? destinationText : pickupText;

  const navUrl = ride
    ? `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(
        navDestination
      )}`
    : "#";

  function shareTrip() {
    const message = `GlideWay Driver Trip
Ride ID: ${ride?.rideId || "Pending"}
Rider ID: ${riderId}
Status: ${step}
Pickup: ${pickupText}
Destination: ${destinationText}
Driver: ${driver.name}
Vehicle: ${driver.color} ${driver.car}
Plate: ${driver.plate}`;

    navigator.clipboard?.writeText(message).catch(() => {});
    setSafetyMessage("Trip details copied for safety sharing.");
  }

  function driverSOS() {
    const report = {
      rideId: ride?.rideId || "",
      type: "Driver SOS",
      driver,
      ride,
      driverLocation: location,
      time: new Date().toISOString(),
    };

    setSafetyMessage("Driver SOS sent. GlideWay Safety Support would be alerted immediately.");

    fetch("http://localhost:5000/safety/report", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(report),
    }).catch(() => {});
  }

  function reportRiderIssue() {
    const report = {
      rideId: ride?.rideId || "",
      type: "Driver Reported Rider Issue",
      driver,
      ride,
      driverLocation: location,
      time: new Date().toISOString(),
    };

    setSafetyMessage("Rider issue report submitted.");

    fetch("http://localhost:5000/safety/report", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(report),
    }).catch(() => {});
  }

  return (
    <Protected role="DRIVER">
      <main style={pageStyle}>
        <div style={headerStyle}>
          <h1 style={titleStyle}>GlideWay Driver</h1>
          <Link href="/driver" style={backLinkStyle}>Back to Dashboard</Link>
        </div>

        <div style={statusPill}>
          {online ? "Online" : "Offline"} - {status}
        </div>

        {!online && (
          <button onClick={goOnline} style={greenButton}>
            Go Online
          </button>
        )}

        {online && (
          <button onClick={goOffline} style={redButton}>
            Go Offline
          </button>
        )}

        <div style={safetyCardStyle}>
          <h2 style={safetySectionTitle}>Driver Safety Center</h2>
          <div style={safetyChecklistStyle}>
            <p>Verified driver profile</p>
            <p>GPS stream active when online</p>
            <p>Rider identity visible before accepting</p>
            <p>Trip details available for safety sharing</p>
            <p>Report concerns anytime</p>
          </div>

          <button onClick={driverSOS} style={sosButtonStyle}>
            Driver Emergency / SOS
          </button>

          <button onClick={shareTrip} style={blueButton}>
            Share Trip Details
          </button>

          <button onClick={reportRiderIssue} style={redOutlineButton}>
            Report Rider / Trip Concern
          </button>

          {safetyMessage && <div style={noticeStyle}>{safetyMessage}</div>}
        </div>

        {location && (
          <div style={miniCard}>
            <b>GPS Stream Active</b>
            <br />
            Lat: {location.lat.toFixed(5)} - Lng: {location.lng.toFixed(5)}
            <br />
            Heading: {Math.round(location.calculatedHeading || 0)}deg
            <br />
            Accuracy: {location.accuracy ? `${Math.round(location.accuracy)}m` : "N/A"}
            <br />
            Source: {location.source}
          </div>
        )}

        {ride && (
          <div style={cardStyle}>
            <h2 style={cardTitleStyle}>Incoming Ride Request</h2>

            <div style={riderBox}>
              <img src={riderPhoto} alt="Rider Profile" style={riderPhotoStyle} crossOrigin="anonymous" />

              <div style={riderInfo}>
                <h3 style={riderNameStyle}>{riderName}</h3>
                <p style={verifiedText}>Verified Rider</p>
                <p style={riderIdText}>
                  <b>Rider ID:</b> {riderId}
                </p>
              </div>
            </div>

            <div style={securityBox}>
              <b>Driver Safety Check</b>
              <p>Rider picture visible</p>
              <p>Rider ID shown before accepting</p>
              <p>Pickup and destination visible</p>
              <p>SOS and rider concern reporting enabled</p>
            </div>

            <div style={tripDetailsStyle}>
              <p><b>Ride ID:</b> {ride.rideId}</p>
              <p><b>Pickup:</b> {pickupText}</p>
              <p><b>Destination:</b> {destinationText}</p>
              <p><b>Trip Distance:</b> {ride.distance || ride.distanceMiles || "Calculating"}</p>
              <p><b>Trip ETA:</b> {ride.eta || "Calculating"}</p>
            </div>

            <h2 style={fareStyle}>
              ${Number(ride.fare || ride.estimatedFare || 0).toFixed(2)}
            </h2>

            <a href={navUrl} target="_blank" rel="noopener noreferrer" style={blueButton}>
              Open Route Navigation
            </a>

            {step === "requested" && (
              <>
                <button onClick={acceptRide} style={greenButton}>
                  Accept Ride
                </button>
                <button onClick={declineRide} style={redButton}>
                  Decline
                </button>
              </>
            )}

            {step === "accepted" && (
              <button onClick={driverArrived} style={greenButton}>
                Driver Arrived
              </button>
            )}

            {step === "arrived" && (
              <button onClick={startTrip} style={greenButton}>
                Start Trip
              </button>
            )}

            {step === "started" && (
              <button onClick={completeTrip} style={greenButton}>
                Complete Trip
              </button>
            )}

            {step === "completed" && (
              <button
                onClick={() => {
                  setRide(null);
                  setStep("waiting");
                  setStatus("Online and waiting for ride requests");
                  setChatMessages([]);
                }}
                style={greenButton}
              >
                Ready for Next Ride
              </button>
            )}

            <div style={chatBox}>
              <div style={chatHeader}>Message Rider</div>

              <div style={chatMessagesBox}>
                {chatMessages.length === 0 ? (
                  <p style={{ color: "#6b7280", fontSize: "14px" }}>
                    No messages yet.
                  </p>
                ) : (
                  chatMessages.map((msg) => (
                    <div
                      key={msg.id}
                      style={{
                        display: "flex",
                        justifyContent:
                          msg.sender === "driver" ? "flex-end" : "flex-start",
                        marginBottom: "8px",
                      }}
                    >
                      <div
                        style={{
                          maxWidth: "75%",
                          padding: "10px 12px",
                          borderRadius: "14px",
                          background:
                            msg.sender === "driver" ? "#22c55e" : "#e5e7eb",
                          color: msg.sender === "driver" ? "#ffffff" : "#111827",
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
          </div>
        )}
      </main>
    </Protected>
  );
}

const pageStyle: React.CSSProperties = {
  minHeight: "100vh",
  background: "linear-gradient(to bottom, #f0fdf4, #ffffff)",
  color: "#111827",
  padding: "30px",
};

const headerStyle: React.CSSProperties = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  marginBottom: "20px",
};

const titleStyle: React.CSSProperties = {
  color: "#22c55e",
  fontSize: "28px",
  fontWeight: 800,
  margin: 0,
};

const backLinkStyle: React.CSSProperties = {
  color: "#16a34a",
  textDecoration: "none",
  fontWeight: 600,
};

const statusPill: React.CSSProperties = {
  padding: "14px 20px",
  background: "#ffffff",
  borderRadius: "999px",
  marginTop: "12px",
  marginBottom: "16px",
  color: "#111827",
  fontWeight: 600,
  border: "1px solid #bbf7d0",
  boxShadow: "0 2px 8px rgba(0,0,0,0.06)",
};

const safetyCardStyle: React.CSSProperties = {
  marginTop: "20px",
  padding: "24px",
  background: "#ffffff",
  borderRadius: "20px",
  border: "1px solid #bbf7d0",
  boxShadow: "0 4px 12px rgba(0,0,0,0.06)",
};

const safetySectionTitle: React.CSSProperties = {
  color: "#166534",
  fontSize: "20px",
  fontWeight: 700,
  marginBottom: "16px",
  margin: 0,
};

const safetyChecklistStyle: React.CSSProperties = {
  color: "#374151",
  fontSize: "14px",
  lineHeight: "1.8",
  marginTop: "12px",
};

const miniCard: React.CSSProperties = {
  marginTop: "15px",
  padding: "16px",
  background: "#ffffff",
  borderRadius: "16px",
  color: "#374151",
  border: "1px solid #d1fae5",
  fontSize: "14px",
};

const cardStyle: React.CSSProperties = {
  marginTop: "25px",
  padding: "24px",
  background: "#ffffff",
  borderRadius: "20px",
  border: "1px solid #bbf7d0",
  boxShadow: "0 4px 12px rgba(0,0,0,0.06)",
};

const cardTitleStyle: React.CSSProperties = {
  color: "#166534",
  fontSize: "20px",
  fontWeight: 700,
  marginBottom: "16px",
};

const riderBox: React.CSSProperties = {
  display: "flex",
  alignItems: "center",
  gap: "18px",
  padding: "16px",
  background: "#f0fdf4",
  borderRadius: "16px",
  border: "1px solid #bbf7d0",
  marginBottom: "20px",
};

const riderPhotoStyle: React.CSSProperties = {
  width: "80px",
  height: "80px",
  borderRadius: "50%",
  objectFit: "cover",
  border: "3px solid #22c55e",
};

const riderInfo: React.CSSProperties = {
  display: "flex",
  flexDirection: "column",
  gap: "4px",
};

const riderNameStyle: React.CSSProperties = {
  margin: 0,
  fontSize: "18px",
  fontWeight: 600,
  color: "#111827",
};

const verifiedText: React.CSSProperties = {
  color: "#22c55e",
  fontSize: "14px",
  margin: 0,
  fontWeight: 600,
};

const riderIdText: React.CSSProperties = {
  margin: 0,
  color: "#6b7280",
  fontSize: "14px",
};

const securityBox: React.CSSProperties = {
  padding: "16px",
  background: "#ecfdf5",
  borderRadius: "14px",
  marginBottom: "18px",
  color: "#166534",
  fontSize: "14px",
  lineHeight: "1.6",
};

const tripDetailsStyle: React.CSSProperties = {
  color: "#374151",
  fontSize: "15px",
  lineHeight: "1.8",
};

const fareStyle: React.CSSProperties = {
  color: "#22c55e",
  fontSize: "32px",
  fontWeight: 800,
  textAlign: "center",
  margin: "16px 0",
};

const greenButton: React.CSSProperties = {
  width: "100%",
  padding: "18px",
  marginTop: "14px",
  borderRadius: "14px",
  border: "none",
  background: "#22c55e",
  color: "white",
  fontWeight: 700,
  fontSize: "16px",
  cursor: "pointer",
};

const redButton: React.CSSProperties = {
  width: "100%",
  padding: "18px",
  marginTop: "14px",
  borderRadius: "14px",
  border: "none",
  background: "#ef4444",
  color: "white",
  fontWeight: 700,
  fontSize: "16px",
  cursor: "pointer",
};

const sosButtonStyle: React.CSSProperties = {
  width: "100%",
  padding: "18px",
  marginTop: "14px",
  borderRadius: "14px",
  border: "none",
  background: "#dc2626",
  color: "white",
  fontWeight: 700,
  fontSize: "16px",
  cursor: "pointer",
};

const redOutlineButton: React.CSSProperties = {
  width: "100%",
  padding: "18px",
  marginTop: "14px",
  borderRadius: "14px",
  border: "2px solid #f87171",
  background: "transparent",
  color: "#dc2626",
  fontWeight: 700,
  fontSize: "16px",
  cursor: "pointer",
};

const blueButton: React.CSSProperties = {
  display: "block",
  textAlign: "center",
  padding: "18px",
  marginTop: "14px",
  borderRadius: "14px",
  background: "#2563eb",
  color: "white",
  textDecoration: "none",
  fontWeight: 700,
  fontSize: "16px",
  cursor: "pointer",
  border: "none",
};

const noticeStyle: React.CSSProperties = {
  marginTop: "15px",
  padding: "14px",
  background: "#ecfdf5",
  borderRadius: "12px",
  color: "#166534",
  fontWeight: 600,
  border: "1px solid #bbf7d0",
};

const chatBox: React.CSSProperties = {
  marginTop: "20px",
  padding: "16px",
  borderRadius: "18px",
  background: "#f9fafb",
  border: "1px solid #e5e7eb",
};

const chatHeader: React.CSSProperties = {
  fontWeight: 700,
  color: "#166534",
  marginBottom: "12px",
  fontSize: "16px",
};

const chatMessagesBox: React.CSSProperties = {
  minHeight: "120px",
  maxHeight: "220px",
  overflowY: "auto",
  padding: "12px",
  borderRadius: "14px",
  background: "#ffffff",
  border: "1px solid #e5e7eb",
};

const chatInputRow: React.CSSProperties = {
  display: "flex",
  gap: "8px",
  marginTop: "12px",
};

const chatInput: React.CSSProperties = {
  flex: 1,
  padding: "12px 16px",
  borderRadius: "12px",
  border: "1px solid #d1d5db",
  color: "#111827",
  background: "#ffffff",
  fontSize: "14px",
};

const chatButton: React.CSSProperties = {
  padding: "12px 20px",
  borderRadius: "12px",
  border: "none",
  background: "#22c55e",
  color: "#ffffff",
  fontWeight: 700,
  cursor: "pointer",
};
