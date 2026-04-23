type Props = {
  rideId: string;
  status: string;
  estimatedFareMinor?: number;
  finalFareMinor?: number;
};

function formatMoney(amountMinor?: number) {
  if (amountMinor === undefined || amountMinor === null) return "--";
  return `$${(amountMinor / 100).toFixed(2)}`;
}

export default function RideStatusCard({ rideId, status, estimatedFareMinor, finalFareMinor }: Props) {
  return (
    <div style={{
      border: "1px solid #e2e8f0",
      borderRadius: 20,
      padding: 20,
      background: "#fff",
      boxShadow: "0 2px 10px rgba(0,0,0,0.04)"
    }}>
      <h3 style={{ margin: 0, fontSize: 22 }}>Ride #{rideId}</h3>
      <p style={{ color: "#475569", marginTop: 8 }}>Current status: <strong>{status}</strong></p>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginTop: 16 }}>
        <div style={{ background: "#f8fafc", padding: 14, borderRadius: 16 }}>
          <div style={{ color: "#64748b", fontSize: 13 }}>Estimated fare</div>
          <div style={{ fontSize: 24, fontWeight: 600 }}>{formatMoney(estimatedFareMinor)}</div>
        </div>
        <div style={{ background: "#f8fafc", padding: 14, borderRadius: 16 }}>
          <div style={{ color: "#64748b", fontSize: 13 }}>Final fare</div>
          <div style={{ fontSize: 24, fontWeight: 600 }}>{formatMoney(finalFareMinor)}</div>
        </div>
      </div>
    </div>
  );
}