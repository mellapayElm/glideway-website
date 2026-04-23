"use client";

import { useState } from "react";
import { requestRefund, startMaskedCall } from "@/lib/support-api";

type Props = {
  rideId: string;
  paymentId?: string;
};

export default function RideSupportActions({ rideId, paymentId }: Props) {
  const [callState, setCallState] = useState<string>("Ready");
  const [refundReason, setRefundReason] = useState("");
  const [refundAmount, setRefundAmount] = useState("5.00");
  const [refundState, setRefundState] = useState<string>("No refund requested");

  async function handleCall() {
    try {
      const result = await startMaskedCall(rideId);
      setCallState(`Call session started: ${result?.id || result?.status || "ok"}`);
    } catch (err: any) {
      setCallState(err?.message || "Failed to start call");
    }
  }

  async function handleRefund() {
    if (!paymentId) {
      setRefundState("Payment ID not available yet");
      return;
    }

    try {
      const minor = Math.round(Number(refundAmount || "0") * 100);
      const result = await requestRefund(rideId, paymentId, refundReason || "Service issue", minor);
      setRefundState(`Refund requested: ${result?.status || "REQUESTED"}`);
    } catch (err: any) {
      setRefundState(err?.message || "Refund request failed");
    }
  }

  return (
    <div style={{ border: "1px solid #e2e8f0", borderRadius: 20, padding: 20, background: "#fff" }}>
      <h3 style={{ marginTop: 0 }}>Support actions</h3>

      <div style={{ marginTop: 12, display: "grid", gap: 12 }}>
        <div style={{ border: "1px solid #e2e8f0", borderRadius: 14, padding: 14, background: "#f8fafc" }}>
          <div style={{ fontWeight: 600 }}>Masked calling</div>
          <p style={{ color: "#475569" }}>Start a private call with your driver without exposing personal numbers.</p>
          <button
            onClick={handleCall}
            style={{
              border: "none",
              borderRadius: 12,
              background: "#0f172a",
              color: "white",
              padding: "10px 14px",
              cursor: "pointer",
            }}
          >
            Start masked call
          </button>
          <div style={{ marginTop: 8, color: "#475569" }}>{callState}</div>
        </div>

        <div style={{ border: "1px solid #e2e8f0", borderRadius: 14, padding: 14, background: "#f8fafc" }}>
          <div style={{ fontWeight: 600 }}>Refund request</div>
          <p style={{ color: "#475569" }}>Request a partial or full refund if there was a service issue.</p>
          <div style={{ display: "grid", gap: 10 }}>
            <input
              value={refundReason}
              onChange={(e) => setRefundReason(e.target.value)}
              placeholder="Reason for refund request"
              style={{ border: "1px solid #cbd5e1", borderRadius: 12, padding: "10px 12px" }}
            />
            <input
              value={refundAmount}
              onChange={(e) => setRefundAmount(e.target.value)}
              placeholder="Amount in dollars"
              style={{ border: "1px solid #cbd5e1", borderRadius: 12, padding: "10px 12px" }}
            />
            <button
              onClick={handleRefund}
              style={{
                border: "none",
                borderRadius: 12,
                background: "#f59e0b",
                color: "#111827",
                padding: "10px 14px",
                cursor: "pointer",
                fontWeight: 600,
              }}
            >
              Submit refund request
            </button>
          </div>
          <div style={{ marginTop: 8, color: "#475569" }}>{refundState}</div>
        </div>
      </div>
    </div>
  );
}