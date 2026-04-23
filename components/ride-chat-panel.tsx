"use client";

import { useState } from "react";
import { sendRideMessage } from "@/lib/support-api";

type ChatMessage = {
  id: string;
  sender: string;
  body: string;
};

type Props = {
  rideId: string;
};

export default function RideChatPanel({ rideId }: Props) {
  const [messages, setMessages] = useState<ChatMessage[]>([
    { id: "1", sender: "System", body: "Your driver is on the way." },
  ]);
  const [text, setText] = useState("");
  const [sending, setSending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSend() {
    if (!text.trim()) return;
    try {
      setSending(true);
      setError(null);
      await sendRideMessage(rideId, text.trim());
      setMessages((prev) => [
        ...prev,
        { id: String(Date.now()), sender: "You", body: text.trim() },
      ]);
      setText("");
    } catch (err: any) {
      setError(err?.message || "Failed to send");
    } finally {
      setSending(false);
    }
  }

  return (
    <div style={{ border: "1px solid #e2e8f0", borderRadius: 20, padding: 20, background: "#fff" }}>
      <h3 style={{ marginTop: 0 }}>In-app chat</h3>
      <div style={{ display: "grid", gap: 10, maxHeight: 220, overflowY: "auto", marginTop: 12 }}>
        {messages.map((msg) => (
          <div key={msg.id} style={{ background: "#f8fafc", borderRadius: 14, padding: 12 }}>
            <div style={{ fontWeight: 600, fontSize: 13 }}>{msg.sender}</div>
            <div style={{ marginTop: 4 }}>{msg.body}</div>
          </div>
        ))}
      </div>
      <div style={{ display: "flex", gap: 10, marginTop: 14 }}>
        <input
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Message your driver"
          style={{
            flex: 1,
            border: "1px solid #cbd5e1",
            borderRadius: 14,
            padding: "12px 14px",
            outline: "none",
          }}
        />
        <button
          onClick={handleSend}
          disabled={sending}
          style={{
            border: "none",
            borderRadius: 14,
            background: "#0f172a",
            color: "white",
            padding: "12px 18px",
            cursor: "pointer",
          }}
        >
          {sending ? "Sending..." : "Send"}
        </button>
      </div>
      {error ? <p style={{ color: "#b91c1c", marginTop: 10 }}>{error}</p> : null}
    </div>
  );
}