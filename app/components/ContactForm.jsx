// @ts-nocheck
"use client";
import { useState, useEffect } from "react";

const SITUATIONS = [
  "Inherited Property",
  "Divorce",
  "Tax Liens",
  "Code Violations",
  "Need to Move Fast",
  "Other",
];

// Capture attribution on the FIRST page the visitor lands on, stash it in
// sessionStorage, then read it back at submit. This survives multi-page
// visits, where document.referrer at submit time would just be our own domain.
function captureAttribution() {
  if (typeof window === "undefined") return;
  try {
    const KEY = "rp_attribution";
    // Only capture once per session, on the genuine first touch.
    if (sessionStorage.getItem(KEY)) return;

    const params = new URLSearchParams(window.location.search);
    const get = (k) => params.get(k) || "";

    const attribution = {
      referrer: document.referrer || "",
      landing_page: window.location.href || "",
      utm_source: get("utm_source"),
      utm_medium: get("utm_medium"),
      utm_campaign: get("utm_campaign"),
      utm_content: get("utm_content"),
      utm_term: get("utm_term"),
      gclid: get("gclid"),
      fbclid: get("fbclid"),
      gbraid: get("gbraid"),
      wbraid: get("wbraid"),
      msclkid: get("msclkid"),
      captured_at: new Date().toISOString(),
    };

    sessionStorage.setItem(KEY, JSON.stringify(attribution));
  } catch {
    // sessionStorage can throw in private mode / blocked storage — fail silently.
  }
}

function readAttribution() {
  if (typeof window === "undefined") return {};
  try {
    const raw = sessionStorage.getItem("rp_attribution");
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}

export default function ContactForm({ preselectedSituation = "" }) {
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    situation: preselectedSituation,
    message: "",
  });
  const [status, setStatus] = useState("idle"); // idle | sending | sent | error

  // Stash first-touch attribution as soon as the form mounts.
  useEffect(() => {
    captureAttribution();
  }, []);

  const handleSubmit = async (e) => {
    if (e && e.preventDefault) e.preventDefault();
    if (!formData.name || !formData.phone) {
      alert("Please enter your name and phone number.");
      return;
    }
    setStatus("sending");
    try {
      const res = await fetch("/api/submit-contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...formData, attribution: readAttribution() }),
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
        role="status"
        aria-live="polite"
        style={{
          background: "var(--card-bg)",
          borderRadius: 20,
          padding: "60px 36px",
          border: "1px solid rgba(232,226,214,0.06)",
          textAlign: "center",
        }}
      >
        <div style={{ fontSize: "2.5rem", marginBottom: 16 }} aria-hidden="true">✓</div>
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
    <form
      onSubmit={handleSubmit}
      noValidate
      aria-label="Contact form"
      style={{
        background: "var(--card-bg)",
        borderRadius: 20,
        padding: "40px 36px",
        border: "1px solid rgba(232,226,214,0.06)",
      }}
    >
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 16 }}>
        <div>
          <label htmlFor="cf-name" style={labelStyle}>YOUR NAME *</label>
          <input
            id="cf-name"
            type="text"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            placeholder="Full name"
            style={inputStyle}
            required
            aria-required="true"
            autoComplete="name"
          />
        </div>
        <div>
          <label htmlFor="cf-phone" style={labelStyle}>PHONE NUMBER *</label>
          <input
            id="cf-phone"
            type="tel"
            value={formData.phone}
            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
            placeholder="(303) 555-0000"
            style={inputStyle}
            required
            aria-required="true"
            aria-describedby="cf-phone-consent"
            autoComplete="tel"
          />
        </div>
      </div>

      <p
        id="cf-phone-consent"
        style={{
          fontSize: "0.72rem",
          color: "rgba(232,226,214,0.5)",
          lineHeight: 1.65,
          margin: "0 0 18px",
        }}
      >
        By providing your phone, you consent to receive follow-up calls or text messages from Redpoint Home Solutions about your property and inquiry. Message and data rates may apply. Reply STOP to opt out. See our <a href="/privacy-policy" style={{ color: "rgba(232,226,214,0.7)", textDecoration: "underline" }}>Privacy Policy</a>.
      </p>

      <div style={{ marginBottom: 16 }}>
        <label htmlFor="cf-email" style={labelStyle}>EMAIL (OPTIONAL)</label>
        <input
          id="cf-email"
          type="email"
          value={formData.email}
          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          placeholder="you@email.com"
          style={inputStyle}
          autoComplete="email"
        />
      </div>

      <div style={{ marginBottom: 16 }}>
        <fieldset style={{ border: 0, padding: 0, margin: 0 }}>
          <legend style={{ ...labelStyle, padding: 0 }}>WHAT'S YOUR SITUATION?</legend>
          <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
            {SITUATIONS.map((opt) => {
              const selected = formData.situation === opt;
              return (
                <button
                  key={opt}
                  type="button"
                  onClick={() => setFormData({ ...formData, situation: opt })}
                  aria-pressed={selected}
                  style={{
                    padding: "10px 18px",
                    borderRadius: 8,
                    border: `1px solid ${selected ? "var(--warm)" : "rgba(232,226,214,0.12)"}`,
                    background: selected ? "rgba(196,149,106,0.1)" : "transparent",
                    color: selected ? "var(--warm)" : "rgba(232,226,214,0.6)",
                    fontSize: "0.88rem",
                    fontFamily: "'DM Sans', sans-serif",
                    cursor: "pointer",
                    fontWeight: selected ? 600 : 400,
                    transition: "all 0.2s ease",
                  }}
                >
                  {opt}
                </button>
              );
            })}
          </div>
        </fieldset>
      </div>

      <div style={{ marginBottom: 24 }}>
        <label htmlFor="cf-message" style={labelStyle}>TELL US MORE (OPTIONAL)</label>
        <textarea
          id="cf-message"
          value={formData.message}
          onChange={(e) => setFormData({ ...formData, message: e.target.value })}
          placeholder="Whatever you're comfortable sharing — property address, timeline, concerns..."
          rows={4}
          style={{ ...inputStyle, resize: "vertical" }}
        />
      </div>

      <button
        type="submit"
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
        <p
          role="alert"
          aria-live="polite"
          style={{ textAlign: "center", color: "#c45c5c", fontSize: "0.85rem", marginTop: 12 }}
        >
          Something went wrong. Please try again or call us directly.
        </p>
      )}

      <p style={{ textAlign: "center", fontSize: "0.78rem", color: "rgba(232,226,214,0.35)", margin: "14px 0 0" }}>
        We'll respond within 24 hours. Your information is never shared or sold.
      </p>
    </form>
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
