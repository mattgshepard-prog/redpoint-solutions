// @ts-nocheck
"use client";
import { useState } from "react";

const SITUATIONS = [
  "Inherited Property",
  "Divorce",
  "Tax Liens",
  "Code Violations",
  "Need to Move Fast",
  "Other",
];

export default function ContactForm({ preselectedSituation = "" }) {
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    situation: preselectedSituation,
    message: "",
  });
  const [status, setStatus] = useState("idle"); // idle | sending | sent | error

  const handleSubmit = async () => {
    if (!formData.name || !formData.phone) {
      alert("Please enter your name and phone number.");
      return;
    }
    setStatus("sending");
    try {
      const res = await fetch("/api/submit-contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      if (res.ok) {
        setStatus("sent");
        setFormData({ name: "", phone: "", email: "", situation: "", message: "" });
      } else {
        setStatus("error");
      }
    } catch {
      setStatus("error");
    }
  };

  if (status === "sent") {
    return (
      <div
        style={{
          background: "var(--card-bg)",
          borderRadius: 20,
          padding: "60px 36px",
          border: "1px solid rgba(232,226,214,0.06)",
          textAlign: "center",
        }}
      >
        <div style={{ fontSize: "2.5rem", marginBottom: 16 }}>✓</div>
        <h3
          style={{
            fontFamily: "'Playfair Display', serif",
            fontSize: "1.5rem",
            fontWeight: 600,
            marginBottom: 12,
          }}
        >
          We got your message.
        </h3>
        <p style={{ color: "rgba(232,226,214,0.6)", fontSize: "0.95rem", lineHeight: 1.7, margin: 0 }}>
          Someone from our team will reach out within 24 hours. If you need help sooner, call us at{" "}
          <a href="tel:+17207387998" style={{ color: "var(--warm)", textDecoration: "none", fontWeight: 600 }}>
            (720) 738-7998
          </a>
        </p>
      </div>
    );
  }

  return (
    <div
      style={{
        background: "var(--card-bg)",
        borderRadius: 20,
        padding: "40px 36px",
        border: "1px solid rgba(232,226,214,0.06)",
      }}
    >
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 16 }}>
        <div>
          <label style={labelStyle}>YOUR NAME *</label>
          <input
            type="text"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            placeholder="Full name"
            style={inputStyle}
          />
        </div>
        <div>
          <label style={labelStyle}>PHONE NUMBER *</label>
          <input
            type="tel"
            value={formData.phone}
            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
            placeholder="(303) 555-0000"
            style={inputStyle}
          />
        </div>
      </div>

      <div style={{ marginBottom: 16 }}>
        <label style={labelStyle}>EMAIL (OPTIONAL)</label>
        <input
          type="email"
          value={formData.email}
          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          placeholder="you@email.com"
          style={inputStyle}
        />
      </div>

      <div style={{ marginBottom: 16 }}>
        <label style={labelStyle}>WHAT'S YOUR SITUATION?</label>
        <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
          {SITUATIONS.map((opt) => (
            <button
              key={opt}
              onClick={() => setFormData({ ...formData, situation: opt })}
              style={{
                padding: "10px 18px",
                borderRadius: 8,
                border: `1px solid ${formData.situation === opt ? "var(--warm)" : "rgba(232,226,214,0.12)"}`,
                background: formData.situation === opt ? "rgba(196,149,106,0.1)" : "transparent",
                color: formData.situation === opt ? "var(--warm)" : "rgba(232,226,214,0.6)",
                fontSize: "0.88rem",
                fontFamily: "'DM Sans', sans-serif",
                cursor: "pointer",
                fontWeight: formData.situation === opt ? 600 : 400,
                transition: "all 0.2s ease",
              }}
            >
              {opt}
            </button>
          ))}
        </div>
      </div>

      <div style={{ marginBottom: 24 }}>
        <label style={labelStyle}>TELL US MORE (OPTIONAL)</label>
        <textarea
          value={formData.message}
          onChange={(e) => setFormData({ ...formData, message: e.target.value })}
          placeholder="Whatever you're comfortable sharing — property address, timeline, concerns..."
          rows={4}
          style={{ ...inputStyle, resize: "vertical" }}
        />
      </div>

      <button
        onClick={handleSubmit}
        disabled={status === "sending"}
        style={{
          width: "100%",
          padding: "16px",
          background: "linear-gradient(135deg, var(--warm), var(--warm-dark))",
          color: "var(--bg)",
          border: "none",
          borderRadius: 10,
          fontSize: "1rem",
          fontWeight: 700,
          fontFamily: "'DM Sans', sans-serif",
          cursor: status === "sending" ? "wait" : "pointer",
          letterSpacing: "0.02em",
          opacity: status === "sending" ? 0.7 : 1,
        }}
      >
        {status === "sending" ? "Sending..." : "Get My Free Options"}
      </button>

      {status === "error" && (
        <p style={{ textAlign: "center", color: "#c45c5c", fontSize: "0.85rem", marginTop: 12 }}>
          Something went wrong. Please try again or call us directly.
        </p>
      )}

      <p style={{ textAlign: "center", fontSize: "0.78rem", color: "rgba(232,226,214,0.35)", margin: "14px 0 0" }}>
        We'll respond within 24 hours. Your information is never shared or sold.
      </p>
    </div>
  );
}

const labelStyle = {
  display: "block",
  fontSize: "0.8rem",
  fontWeight: 500,
  color: "rgba(232,226,214,0.5)",
  marginBottom: 8,
  letterSpacing: "0.04em",
};

const inputStyle = {
  width: "100%",
  padding: "14px 16px",
  background: "rgba(232,226,214,0.04)",
  border: "1px solid rgba(232,226,214,0.1)",
  borderRadius: 10,
  color: "var(--cream)",
  fontSize: "0.95rem",
  fontFamily: "'DM Sans', sans-serif",
  outline: "none",
};
