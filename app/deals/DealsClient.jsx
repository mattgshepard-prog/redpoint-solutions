// @ts-nocheck
"use client";

import { useState } from "react";
import Link from "next/link";
import SiteFooter from "../components/SiteFooter";

// =====================================================================
//  This page is served at https://deals.redpointhomesolutions.com/
//  via a host-based rewrite in next.config.js. It is intentionally not
//  linked from the main seller-facing site at redpointhomesolutions.com.
//  The page is also tagged noindex,nofollow so search engines do not
//  surface it. Buyers find it through direct outreach.
// =====================================================================

const BUYER_TYPES = [
  "Flipper",
  "Buy-and-hold rental",
  "Wholesaler",
  "Owner-occupant",
];

const PRICE_RANGES = [
  "Up to $250k",
  "$250k–$400k",
  "$400k–$600k",
  "$600k–$900k",
  "$900k+",
  "No cap",
];

const FOCUS_AREAS = [
  "Denver",
  "Aurora",
  "Lakewood",
  "Arvada",
  "Westminster",
  "Broomfield",
  "Boulder",
  "Northern suburbs",
  "Southern suburbs",
  "Open / anywhere in metro",
];

const PROPERTY_TYPES = [
  "Single-family",
  "Duplex / triplex",
  "4+ unit small multi",
  "Townhouse",
  "Condo",
  "Land",
];

const TIMELINES = [
  "As fast as 7 days",
  "7–14 days",
  "14–30 days",
  "30+ days",
  "Flexible",
];

const FINANCING = [
  "Cash",
  "Hard money",
  "DSCR",
  "Conventional",
  "Mixed / depends",
];

export default function DealsPage() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    buyerType: "",
    priceRange: "",
    focus: [],
    propertyTypes: [],
    timeline: "",
    financing: "",
    notes: "",
    smsConsent: false,
  });
  const [status, setStatus] = useState("idle"); // idle | sending | sent | error
  const [errorMsg, setErrorMsg] = useState("");

  const toggleMulti = (key, value) => {
    setForm((f) => {
      const cur = f[key] || [];
      return {
        ...f,
        [key]: cur.includes(value) ? cur.filter((x) => x !== value) : [...cur, value],
      };
    });
  };

  const canSubmit =
    form.name.trim() &&
    form.email.trim() &&
    form.phone.trim() &&
    form.buyerType &&
    form.priceRange &&
    form.focus.length > 0 &&
    form.smsConsent &&
    status !== "sending";

  const handleSubmit = async (e) => {
    if (e && e.preventDefault) e.preventDefault();
    if (!canSubmit) {
      if (!form.smsConsent) {
        setErrorMsg("Please review and check the SMS consent box to continue.");
      } else {
        setErrorMsg("Please fill in your name, email, phone, buyer type, price range, and at least one geographic focus.");
      }
      setStatus("error");
      return;
    }
    setStatus("sending");
    setErrorMsg("");
    try {
      const res = await fetch("/api/submit-deals-signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          consentTimestamp: new Date().toISOString(),
          consentSource: "deals.redpointhomesolutions.com",
        }),
      });
      if (res.ok) {
        setStatus("sent");
      } else {
        setErrorMsg("We had trouble saving your signup. Please try again or call (720) 738-7998.");
        setStatus("error");
      }
    } catch {
      setErrorMsg("We had trouble saving your signup. Please try again or call (720) 738-7998.");
      setStatus("error");
    }
  };

  return (
    <>
      {/* Stripped-down header — this page is intentionally not part of the main site nav */}
      <header
        style={{
          padding: "20px 24px",
          borderBottom: "1px solid rgba(232,226,214,0.06)",
          background: "var(--bg)",
        }}
      >
        <div
          style={{
            maxWidth: 1100,
            margin: "0 auto",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <div
              style={{
                width: 28,
                height: 28,
                background: "linear-gradient(135deg, var(--warm), var(--warm-dark))",
                borderRadius: 6,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: 13,
                fontWeight: 700,
                color: "var(--bg)",
              }}
              aria-hidden="true"
            >
              R
            </div>
            <span style={{ fontFamily: "'Playfair Display', serif", fontSize: "1.05rem", fontWeight: 600, color: "var(--cream)" }}>
              Redpoint Home Solutions
            </span>
            <span style={{ display: "inline-block", padding: "3px 10px", marginLeft: 10, fontSize: "0.65rem", fontWeight: 600, letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--warm)", background: "rgba(196,149,106,0.1)", borderRadius: 4 }}>
              Investor Deal Flow
            </span>
          </div>
          <a
            href="tel:+17207387998"
            style={{
              fontSize: "0.88rem",
              color: "rgba(232,226,214,0.7)",
              textDecoration: "none",
              fontWeight: 500,
            }}
          >
            (720) 738-7998
          </a>
        </div>
      </header>

      <main id="main-content" style={{ background: "var(--bg)", minHeight: "100vh" }}>
        {/* Hero */}
        <section style={{ padding: "80px 24px 60px" }}>
          <div style={{ maxWidth: 820, margin: "0 auto", textAlign: "center" }}>
            <div style={{ fontSize: "0.72rem", fontWeight: 600, color: "var(--warm)", letterSpacing: "0.12em", textTransform: "uppercase", marginBottom: 16 }}>
              Off-market Denver Metro deal flow
            </div>
            <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: "clamp(2rem, 5vw, 3.2rem)", fontWeight: 600, color: "var(--cream)", lineHeight: 1.15, letterSpacing: "-0.02em", marginBottom: 20 }}>
              Real deals.<br />
              <span style={{ color: "var(--warm)", fontStyle: "italic" }}>Direct to your inbox.</span>
            </h1>
            <p style={{ fontSize: "1.05rem", lineHeight: 1.7, color: "rgba(232,226,214,0.7)", fontWeight: 300, maxWidth: 640, margin: "0 auto" }}>
              We source off-market properties from distressed-seller situations across Denver Metro &mdash; inherited homes, divorce splits, tax-lien exits, code-violation properties, and forced-move scenarios. Tell us what you buy and we'll send the matches.
            </p>
          </div>
        </section>

        {/* Value props */}
        <section style={{ padding: "20px 24px 60px" }}>
          <div style={{ maxWidth: 1000, margin: "0 auto" }}>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
                gap: 20,
              }}
            >
              {[
                {
                  title: "Direct seller relationships",
                  body: "Properties sourced through our own marketing and intake &mdash; not co-listed, not MLS rehashed.",
                },
                {
                  title: "GC-backed underwriting",
                  body: "We have an in-house general contractor, so the repair numbers we share are grounded in actual construction costs, not Zillow guesses.",
                },
                {
                  title: "Flexible disposition",
                  body: "Assignments, novations, double-close, or JV &mdash; structured around what the deal and the buyer need.",
                },
              ].map((card) => (
                <div
                  key={card.title}
                  style={{
                    background: "var(--card-bg)",
                    border: "1px solid rgba(232,226,214,0.06)",
                    borderRadius: 14,
                    padding: "24px 22px",
                  }}
                >
                  <h3
                    style={{
                      fontFamily: "'Playfair Display', serif",
                      fontSize: "1.1rem",
                      fontWeight: 600,
                      color: "var(--cream)",
                      marginBottom: 10,
                      lineHeight: 1.3,
                    }}
                  >
                    {card.title}
                  </h3>
                  <p style={{ fontSize: "0.92rem", lineHeight: 1.65, color: "rgba(232,226,214,0.6)", fontWeight: 300, margin: 0 }}>
                    {card.body}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Signup form */}
        <section style={{ padding: "20px 24px 80px" }}>
          <div style={{ maxWidth: 720, margin: "0 auto" }}>
            {status === "sent" ? (
              <div
                role="status"
                aria-live="polite"
                style={{
                  background: "var(--card-bg)",
                  border: "1px solid rgba(232,226,214,0.06)",
                  borderRadius: 16,
                  padding: "60px 36px",
                  textAlign: "center",
                }}
              >
                <div style={{ fontSize: "2.4rem", marginBottom: 14 }} aria-hidden="true">✓</div>
                <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: "1.5rem", fontWeight: 600, color: "var(--cream)", marginBottom: 12 }}>
                  You're on the list.
                </h3>
                <p style={{ color: "rgba(232,226,214,0.65)", fontSize: "0.95rem", lineHeight: 1.7, margin: 0 }}>
                  We'll send you deals that match your criteria as they come in. If you ever want to update your filters or come off the list, just reply STOP to any SMS or email us at{" "}
                  <a href="mailto:mattgshepard@gmail.com" style={{ color: "var(--warm)", textDecoration: "underline" }}>
                    mattgshepard@gmail.com
                  </a>
                  .
                </p>
              </div>
            ) : (
              <form
                onSubmit={handleSubmit}
                noValidate
                aria-label="Investor signup form"
                style={{
                  background: "var(--card-bg)",
                  border: "1px solid rgba(232,226,214,0.06)",
                  borderRadius: 16,
                  padding: "36px 32px",
                }}
              >
                <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: "1.5rem", fontWeight: 600, color: "var(--cream)", marginBottom: 8 }}>
                  Tell us what you buy.
                </h2>
                <p style={{ fontSize: "0.9rem", color: "rgba(232,226,214,0.55)", lineHeight: 1.6, marginBottom: 28 }}>
                  We'll only send you deals that match. No spam, no irrelevant blasts.
                </p>

                {/* Identity */}
                <div style={gridTwo}>
                  <Field label="YOUR NAME *" htmlFor="d-name">
                    <input id="d-name" type="text" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="Full name" style={inputStyle} required aria-required="true" autoComplete="name" />
                  </Field>
                  <Field label="EMAIL *" htmlFor="d-email">
                    <input id="d-email" type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} placeholder="you@email.com" style={inputStyle} required aria-required="true" autoComplete="email" />
                  </Field>
                </div>

                <Field label="MOBILE PHONE *" htmlFor="d-phone" hint="We need a mobile number to send you deal alerts via SMS.">
                  <input id="d-phone" type="tel" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} placeholder="(303) 555-0000" style={inputStyle} required aria-required="true" autoComplete="tel" />
                </Field>

                {/* Buyer profile */}
                <Field label="WHAT KIND OF BUYER ARE YOU? *" htmlFor="d-buyertype-group">
                  <ChipRow
                    id="d-buyertype-group"
                    options={BUYER_TYPES}
                    value={form.buyerType}
                    onSelect={(v) => setForm({ ...form, buyerType: v })}
                    mode="single"
                  />
                </Field>

                <Field label="MAX PURCHASE PRICE *" htmlFor="d-price-group">
                  <ChipRow
                    id="d-price-group"
                    options={PRICE_RANGES}
                    value={form.priceRange}
                    onSelect={(v) => setForm({ ...form, priceRange: v })}
                    mode="single"
                  />
                </Field>

                <Field label="GEOGRAPHIC FOCUS * (pick any that apply)" htmlFor="d-focus-group">
                  <ChipRow
                    id="d-focus-group"
                    options={FOCUS_AREAS}
                    value={form.focus}
                    onSelect={(v) => toggleMulti("focus", v)}
                    mode="multi"
                  />
                </Field>

                <Field label="PROPERTY TYPES YOU BUY (optional)" htmlFor="d-types-group">
                  <ChipRow
                    id="d-types-group"
                    options={PROPERTY_TYPES}
                    value={form.propertyTypes}
                    onSelect={(v) => toggleMulti("propertyTypes", v)}
                    mode="multi"
                  />
                </Field>

                <div style={gridTwo}>
                  <Field label="CLOSE TIMELINE (optional)" htmlFor="d-timeline-group">
                    <ChipRow
                      id="d-timeline-group"
                      options={TIMELINES}
                      value={form.timeline}
                      onSelect={(v) => setForm({ ...form, timeline: v })}
                      mode="single"
                    />
                  </Field>
                  <Field label="FINANCING (optional)" htmlFor="d-financing-group">
                    <ChipRow
                      id="d-financing-group"
                      options={FINANCING}
                      value={form.financing}
                      onSelect={(v) => setForm({ ...form, financing: v })}
                      mode="single"
                    />
                  </Field>
                </div>

                <Field label="ANYTHING ELSE WE SHOULD KNOW? (optional)" htmlFor="d-notes">
                  <textarea
                    id="d-notes"
                    value={form.notes}
                    onChange={(e) => setForm({ ...form, notes: e.target.value })}
                    placeholder="Off-market deal sources you've worked with, specific neighborhoods, deal types to skip, etc."
                    rows={3}
                    style={{ ...inputStyle, resize: "vertical", fontFamily: "'DM Sans', sans-serif" }}
                  />
                </Field>

                {/* SMS consent — TCPA express written consent (gold standard) */}
                <div
                  style={{
                    background: "rgba(196,149,106,0.06)",
                    border: "1px solid rgba(196,149,106,0.18)",
                    borderRadius: 10,
                    padding: "18px 20px",
                    marginTop: 8,
                    marginBottom: 18,
                  }}
                >
                  <label
                    htmlFor="d-sms-consent"
                    style={{
                      display: "flex",
                      alignItems: "flex-start",
                      gap: 12,
                      cursor: "pointer",
                      fontSize: "0.86rem",
                      color: "rgba(232,226,214,0.8)",
                      lineHeight: 1.6,
                    }}
                  >
                    <input
                      id="d-sms-consent"
                      type="checkbox"
                      checked={form.smsConsent}
                      onChange={(e) => setForm({ ...form, smsConsent: e.target.checked })}
                      aria-required="true"
                      style={{ marginTop: 4, width: 18, height: 18, accentColor: "#C4956A", flexShrink: 0, cursor: "pointer" }}
                    />
                    <span>
                      I agree to receive text messages and calls from <strong style={{ color: "var(--cream)", fontWeight: 600 }}>Redpoint Home Solutions</strong> about new off-market Denver Metro property deals matching my stated criteria. Consent is not a condition of any purchase or service. Message and data rates may apply. Message frequency varies. Reply STOP to opt out. Reply HELP for help. View our{" "}
                      <Link href="/privacy-policy" style={{ color: "var(--warm)", textDecoration: "underline" }}>
                        Privacy Policy
                      </Link>{" "}
                      and{" "}
                      <Link href="/terms" style={{ color: "var(--warm)", textDecoration: "underline" }}>
                        Terms
                      </Link>
                      .
                    </span>
                  </label>
                </div>

                <button
                  type="submit"
                  disabled={!canSubmit}
                  style={{
                    width: "100%",
                    padding: "16px",
                    background: canSubmit
                      ? "linear-gradient(135deg, var(--warm), var(--warm-dark))"
                      : "rgba(196,149,106,0.25)",
                    color: canSubmit ? "var(--bg)" : "rgba(232,226,214,0.5)",
                    border: "none",
                    borderRadius: 10,
                    fontSize: "1rem",
                    fontWeight: 700,
                    fontFamily: "'DM Sans', sans-serif",
                    cursor: canSubmit ? "pointer" : "not-allowed",
                    letterSpacing: "0.02em",
                    transition: "all 0.2s ease",
                  }}
                >
                  {status === "sending" ? "Adding you to the list..." : "Add Me to the Deal List"}
                </button>

                {status === "error" && errorMsg && (
                  <p
                    role="alert"
                    aria-live="polite"
                    style={{ marginTop: 12, fontSize: "0.85rem", color: "#c45c5c", textAlign: "center" }}
                  >
                    {errorMsg}
                  </p>
                )}

                <p style={{ fontSize: "0.72rem", color: "rgba(232,226,214,0.4)", textAlign: "center", lineHeight: 1.65, marginTop: 14, marginBottom: 0 }}>
                  Your information is never shared or sold. We only contact you about deals that match your criteria. View our{" "}
                  <Link href="/privacy-policy" style={{ color: "rgba(232,226,214,0.6)", textDecoration: "underline" }}>
                    Privacy Policy
                  </Link>
                  ,{" "}
                  <Link href="/terms" style={{ color: "rgba(232,226,214,0.6)", textDecoration: "underline" }}>
                    Terms
                  </Link>
                  , and{" "}
                  <Link href="/disclaimers" style={{ color: "rgba(232,226,214,0.6)", textDecoration: "underline" }}>
                    Disclaimers
                  </Link>
                  .
                </p>
              </form>
            )}
          </div>
        </section>

        <SiteFooter />
      </main>
    </>
  );
}

// =============================================================================
//  Helper components
// =============================================================================

function Field({ label, htmlFor, hint, children }) {
  return (
    <div style={{ marginBottom: 18 }}>
      <label htmlFor={htmlFor} style={labelStyle}>
        {label}
      </label>
      {children}
      {hint && (
        <p style={{ fontSize: "0.72rem", color: "rgba(232,226,214,0.45)", lineHeight: 1.55, margin: "6px 0 0" }}>
          {hint}
        </p>
      )}
    </div>
  );
}

function ChipRow({ id, options, value, onSelect, mode }) {
  const selected = (opt) => (mode === "multi" ? value.includes(opt) : value === opt);
  return (
    <div
      id={id}
      role={mode === "multi" ? "group" : "radiogroup"}
      aria-label="Choose one or more options"
      style={{ display: "flex", flexWrap: "wrap", gap: 8 }}
    >
      {options.map((opt) => {
        const isSel = selected(opt);
        return (
          <button
            key={opt}
            type="button"
            onClick={() => onSelect(opt)}
            aria-pressed={mode === "multi" ? isSel : undefined}
            role={mode === "multi" ? undefined : "radio"}
            aria-checked={mode === "multi" ? undefined : isSel}
            style={{
              padding: "9px 16px",
              borderRadius: 8,
              border: `1px solid ${isSel ? "var(--warm)" : "rgba(232,226,214,0.12)"}`,
              background: isSel ? "rgba(196,149,106,0.12)" : "transparent",
              color: isSel ? "var(--warm)" : "rgba(232,226,214,0.65)",
              fontSize: "0.85rem",
              fontFamily: "'DM Sans', sans-serif",
              fontWeight: isSel ? 600 : 400,
              cursor: "pointer",
              transition: "all 0.2s ease",
            }}
          >
            {opt}
          </button>
        );
      })}
    </div>
  );
}

// =============================================================================
//  Styles
// =============================================================================

const gridTwo = {
  display: "grid",
  gridTemplateColumns: "1fr 1fr",
  gap: 16,
};

const labelStyle = {
  display: "block",
  fontSize: "0.75rem",
  fontWeight: 600,
  color: "rgba(232,226,214,0.55)",
  marginBottom: 8,
  letterSpacing: "0.05em",
};

const inputStyle = {
  width: "100%",
  padding: "13px 16px",
  background: "rgba(232,226,214,0.04)",
  border: "1px solid rgba(232,226,214,0.1)",
  borderRadius: 9,
  color: "var(--cream)",
  fontSize: "0.93rem",
  fontFamily: "'DM Sans', sans-serif",
  outline: "none",
};
