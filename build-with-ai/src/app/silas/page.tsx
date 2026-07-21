"use client";

import { useState } from "react";

export default function SilasChat() {
  const [messages, setMessages] = useState<{role: string, content: string}[]>([]);
  const [input, setInput] = useState("");

  async function sendMessage() {
    if (!input.trim()) return;

    const userMessage = { role: "user", content: input };
    setMessages((prev) => [...prev, userMessage]);

    const res = await fetch("/api/silas/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message: input })
    });

    const data = await res.json();
    const silasMessage = { role: "silas", content: data.reply };

    setMessages((prev) => [...prev, silasMessage]);
    setInput("");
  }

  return (
    <div style={{ padding: 20, maxWidth: 600, margin: "0 auto" }}>
      <h1>Silas Chat</h1>

      <div
        style={{
          border: "1px solid #ccc",
          padding: 10,
          height: 400,
          overflowY: "auto",
          marginBottom: 10,
          borderRadius: 8
        }}
      >
        {messages.map((msg, i) => (
          <div
            key={i}
            style={{
              marginBottom: 12,
              textAlign: msg.role === "user" ? "right" : "left"
            }}
          >
            <strong>{msg.role === "user" ? "You" : "Silas"}:</strong>{" "}
            {msg.content}
          </div>
        ))}
      </div>

      <div style={{ display: "flex", gap: 10 }}>
        <input
          style={{ flex: 1, padding: 10, borderRadius: 6 }}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Talk to Silas..."
        />
        <button
          onClick={sendMessage}
          style={{
            padding: "10px 20px",
            borderRadius: 6,
            background: "#0070f3",
            color: "white"
          }}
        >
          Send
        </button>
      </div>
    </div>
  );
}
