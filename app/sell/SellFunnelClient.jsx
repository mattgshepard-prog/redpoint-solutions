// @ts-nocheck
"use client";
import { useState, useRef, useEffect, useCallback } from "react";

/**
 * SellFunnelClient — the conversational seller-intake survey.
 *
 * Not a rigid question march: a chat surface where an AI assistant helps the
 * person think through options for their property. Model routing happens
 * server-side in /api/seller-chat. When the assistant decides value has been
 * delivered, the server flags showContactForm and this component reveals the
 * consent-gated contact form. On consent, it (1) fires the Opus options
 * analysis, (2) writes the lead to OverWatch via /api/seller-lead the moment
 * consent is captured, then (3) keeps the conversation going for follow-ups.
 *
 * Design tokens inherited from the parent site (globals.css): --bg, --card-bg,
 * --cream, --warm, --warm-dark, --warm-light. No page-level wrappers.
 */

const OPENING_MESSAGE =
  "Hi — I'm an AI assistant for Redpoint Home Solutions. I can help you think " +
  "through your options for a property, no pressure and no obligation. What " +
  "should I call you?";

const CONSENT_TEXT =
  "By checking this box and providing my phone number, I agree to receive calls " +
  "and text messages (including via automated technology) from Redpoint Home " +
  "Solutions / Redpoint Consulting, LLC about my property and my options. Consent " +
  "is not a condition of any purchase or service. Message and data rates may " +
  "apply. Reply STOP to opt out at any time.";

export default function SellFunnelClient() {
  // Conversation state
  const [messages, setMessages] = useState([
    { role: "assistant", content: OPENING_MESSAGE },
  ]);
  const [input, setInput] = useState("");
  const [sending, setSending] = useState(false);
  const [thinking, setThinking] = useState(false);

  // Contact-capture state
  const [showContact, setShowContact] = useState(false);
  const [contactDone, setContactDone] = useState(false);
  const [contact, setContact] = useState({ firstName: "", lastName: "", email: "", phone: "" });
  const [consent, setConsent] = useState(false);
  const [contactErrors, setContactErrors] = useState({});
  const [contactSubmitting, setContactSubmitting] = useState(false);
  const [contactStatusMsg, setContactStatusMsg] = useState("");

  const scrollRef = useRef(null);
  const inputRef = useRef(null);
  const liveRef = useRef(null);

  // Keep the chat scrolled to the latest turn.
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, thinking, showContact]);

  // Derive first name early so the form can prefill if the user gave it in chat.
  useEffect(() => {
    if (showContact && !contact.firstName) {
      // best-effort: pull a likely first name from the first user message
      const firstUser = messages.find((m) => m.role === "user");
      if (firstUser) {
        const guess = String(firstUser.content).trim().split(/\s+/)[0];
        if (guess && guess.length <= 20 && /^[A-Za-z'-]+$/.test(guess)) {
          setContact((c) => ({ ...c, firstName: guess.charAt(0).toUpperCase() + guess.slice(1) }));
        }
      }
    }
  }, [showContact]); // eslint-disable-line react-hooks/exhaustive-deps

  const announce = (msg) => {
    if (liveRef.current) liveRef.current.textContent = msg;
  };

  const callChat = useCallback(async (nextMessages, mode = "chat") => {
    const res = await fetch("/api/seller-chat", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ messages: nextMessages, mode }),
    });
    if (!res.ok) throw new Error(`chat ${res.status}`);
    return res.json();
  }, []);

  const sendMessage = useCallback(async () => {
    const text = input.trim();
    if (!text || sending) return;

    const nextMessages = [...messages, { role: "user", content: text }];
    setMessages(nextMessages);
    setInput("");
    setSending(true);
    setThinking(true);
    announce("Assistant is typing");

    try {
      const data = await callChat(nextMessages, "chat");
      setThinking(false);
      const reply = data.reply || "Sorry — I lost my train of thought there. Could you say that again?";
      setMessages((m) => [...m, { role: "assistant", content: reply }]);
      announce("New reply from assistant");
      if (data.showContactForm && !contactDone) {
        setShowContact(true);
      }
    } catch (e) {
      setThinking(false);
      setMessages((m) => [
        ...m,
        {
          role: "assistant",
          content:
            "Something hiccuped on my end. Give me a moment and try sending that again — " +
            "I don't want to lose what you were telling me.",
        },
      ]);
      announce("Error sending message");
    } finally {
      setSending(false);
      if (inputRef.current) inputRef.current.focus();
    }
  }, [input, sending, messages, callChat, contactDone]);

  const onKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  // ---- Contact form validation + submission -------------------------------
  const validateContact = () => {
    const errs = {};
    if (!contact.firstName.trim()) errs.firstName = "Please enter your first name.";
    if (!contact.email.trim()) errs.email = "Please enter your email.";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(contact.email.trim()))
      errs.email = "That email doesn't look right.";
    if (!contact.phone.trim()) errs.phone = "Please enter a phone number.";
    else if (contact.phone.replace(/\D/g, "").length < 10)
      errs.phone = "Please enter a valid phone number.";
    if (!consent) errs.consent = "Please check the box so we're allowed to reach out.";
    setContactErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const submitContact = async () => {
    if (contactSubmitting) return;
    if (!validateContact()) {
      announce("Please fix the highlighted fields");
      return;
    }
    setContactSubmitting(true);
    setContactStatusMsg("Saving your info and pulling your options together…");
    announce("Saving your information");

    // 1) Run the Opus options analysis on the full transcript.
    let enrichment = {};
    let analysisReply = "";
    try {
      const analysis = await callChat(messages, "analysis");
      if (analysis && analysis.ok) {
        analysisReply = analysis.reply || "";
        if (analysis.leadData) enrichment = analysis.leadData;
      }
    } catch (e) {
      // Fall back to a Haiku structuring pass if the analysis failed.
      try {
        const structured = await callChat(messages, "structure");
        if (structured && structured.structured) enrichment = structured.structured;
      } catch (_) {
        /* non-fatal */
      }
    }

    // 2) Write the lead to OverWatch the MOMENT consent is captured (spec §4).
    const nowIso = new Date().toISOString();
    try {
      await fetch("/api/seller-lead", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          firstName: contact.firstName.trim(),
          lastName: contact.lastName.trim(),
          email: contact.email.trim(),
          phone: contact.phone.trim(),
          smsConsent: consent,
          consentText: CONSENT_TEXT,
          consentTimestamp: nowIso,
          consentSource: typeof window !== "undefined" ? window.location.href : "",
          campaignId: "chatgpt-ads-allTriggers",
          enrichment,
          transcript: messages,
        }),
      });
    } catch (e) {
      // Lead write failed, but we don't block the human experience. Matt's
      // alert path and the transcript are best-effort; surface a soft note.
      console.error("lead write failed", e);
    }

    // 3) Show the analysis (the trust-earning payoff) in the chat and keep going.
    setContactDone(true);
    setShowContact(false);
    setContactSubmitting(false);
    setContactStatusMsg("");

    const closing =
      analysisReply ||
      "Thanks — you're all set. Someone from Redpoint will follow up, no obligation. " +
      "In the meantime, I'm still here if you want to think through anything else about your place.";

    setMessages((m) => [...m, { role: "assistant", content: closing }]);
    announce("Your options summary is ready");
    if (inputRef.current) inputRef.current.focus();
  };

  // ---- Styles (inline, inheriting site tokens) ----------------------------
  const s = styles;

  return (
    <section aria-label="Talk through your property options" style={s.wrap}>
      {/* AI disclosure banner — always visible */}
      <div style={s.aiBanner} role="note">
        <span aria-hidden="true" style={s.aiDot} />
        <span>
          You're chatting with an <strong>AI assistant</strong> for Redpoint Home Solutions.
          It offers general information about your options — not legal or financial advice, and
          not a guaranteed offer. AI output can contain errors; please review it and consult a
          professional before any major decision.
        </span>
      </div>

      {/* Chat transcript */}
      <div
        ref={scrollRef}
        style={s.transcript}
        role="log"
        aria-live="polite"
        aria-label="Conversation"
        tabIndex={0}
      >
        {messages.map((m, i) => (
          <div key={i} style={m.role === "user" ? s.rowUser : s.rowAsst}>
            <div style={m.role === "user" ? s.bubbleUser : s.bubbleAsst}>
              {m.role === "assistant" && (
                <span style={s.asstLabel} aria-hidden="true">Redpoint AI</span>
              )}
              <span style={s.bubbleText}>{m.content}</span>
            </div>
          </div>
        ))}

        {thinking && (
          <div style={s.rowAsst}>
            <div style={s.bubbleAsst}>
              <span style={s.asstLabel} aria-hidden="true">Redpoint AI</span>
              <span style={s.typing} aria-label="Assistant is typing">
                <span style={{ ...s.dot, animationDelay: "0s" }} />
                <span style={{ ...s.dot, animationDelay: "0.2s" }} />
                <span style={{ ...s.dot, animationDelay: "0.4s" }} />
              </span>
            </div>
          </div>
        )}

        {/* Consent-gated contact form, revealed when value is delivered */}
        {showContact && !contactDone && (
          <div style={s.contactCard}>
            <p style={s.contactHeading}>Want someone from Redpoint to follow up?</p>
            <p style={s.contactSub}>
              No obligation. You'll get your options summary either way — this just lets a real
              person reach out to walk you through things.
            </p>

            <div style={s.field}>
              <label htmlFor="sf-first" style={s.label}>First name</label>
              <input
                id="sf-first"
                type="text"
                autoComplete="given-name"
                value={contact.firstName}
                onChange={(e) => setContact((c) => ({ ...c, firstName: e.target.value }))}
                aria-required="true"
                aria-invalid={!!contactErrors.firstName}
                aria-describedby={contactErrors.firstName ? "sf-first-err" : undefined}
                style={s.input}
              />
              {contactErrors.firstName && (
                <span id="sf-first-err" role="alert" style={s.err}>{contactErrors.firstName}</span>
              )}
            </div>

            <div style={s.field}>
              <label htmlFor="sf-last" style={s.label}>Last name <span style={s.optional}>(optional)</span></label>
              <input
                id="sf-last"
                type="text"
                autoComplete="family-name"
                value={contact.lastName}
                onChange={(e) => setContact((c) => ({ ...c, lastName: e.target.value }))}
                style={s.input}
              />
            </div>

            <div style={s.field}>
              <label htmlFor="sf-email" style={s.label}>Email</label>
              <input
                id="sf-email"
                type="email"
                autoComplete="email"
                value={contact.email}
                onChange={(e) => setContact((c) => ({ ...c, email: e.target.value }))}
                aria-required="true"
                aria-invalid={!!contactErrors.email}
                aria-describedby={contactErrors.email ? "sf-email-err" : undefined}
                style={s.input}
              />
              {contactErrors.email && (
                <span id="sf-email-err" role="alert" style={s.err}>{contactErrors.email}</span>
              )}
            </div>

            <div style={s.field}>
              <label htmlFor="sf-phone" style={s.label}>Phone</label>
              <input
                id="sf-phone"
                type="tel"
                autoComplete="tel"
                value={contact.phone}
                onChange={(e) => setContact((c) => ({ ...c, phone: e.target.value }))}
                aria-required="true"
                aria-invalid={!!contactErrors.phone}
                aria-describedby={contactErrors.phone ? "sf-phone-err" : "sf-consent-text"}
                style={s.input}
              />
              {contactErrors.phone && (
                <span id="sf-phone-err" role="alert" style={s.err}>{contactErrors.phone}</span>
              )}
            </div>

            {/* TCPA express-written-consent gate (Variant 3) */}
            <div style={s.consentRow}>
              <input
                id="sf-consent"
                type="checkbox"
                checked={consent}
                onChange={(e) => setConsent(e.target.checked)}
                aria-required="true"
                aria-invalid={!!contactErrors.consent}
                aria-describedby="sf-consent-text"
                style={s.checkbox}
              />
              <label htmlFor="sf-consent" id="sf-consent-text" style={s.consentText}>
                {CONSENT_TEXT}
              </label>
            </div>
            {contactErrors.consent && (
              <span role="alert" style={s.err}>{contactErrors.consent}</span>
            )}

            <button
              type="button"
              onClick={submitContact}
              disabled={contactSubmitting}
              style={{ ...s.submitBtn, opacity: contactSubmitting ? 0.7 : 1 }}
            >
              {contactSubmitting ? "Saving…" : "Send me my options & have someone follow up"}
            </button>
            {contactStatusMsg && (
              <p role="status" aria-live="polite" style={s.statusMsg}>{contactStatusMsg}</p>
            )}
          </div>
        )}
      </div>

      {/* Composer */}
      <div style={s.composer}>
        <label htmlFor="sf-input" className="sr-only">Type your message</label>
        <textarea
          id="sf-input"
          ref={inputRef}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={onKeyDown}
          placeholder="Tell me what's going on with the property…"
          rows={1}
          style={s.textarea}
          disabled={sending}
        />
        <button
          type="button"
          onClick={sendMessage}
          disabled={sending || !input.trim()}
          aria-label="Send message"
          style={{ ...s.sendBtn, opacity: sending || !input.trim() ? 0.5 : 1 }}
        >
          Send
        </button>
      </div>

      {/* Visually-hidden live region for screen readers */}
      <div ref={liveRef} role="status" aria-live="polite" className="sr-only" />

      <style>{`
        @keyframes sf-bounce {
          0%, 80%, 100% { transform: translateY(0); opacity: 0.4; }
          40% { transform: translateY(-4px); opacity: 1; }
        }
        #sf-input::placeholder { color: rgba(232,226,214,0.4); }
        .sf-send:focus-visible, .sf-submit:focus-visible {
          outline: 2px solid var(--cream); outline-offset: 2px;
        }
      `}</style>
    </section>
  );
}

const styles = {
  wrap: {
    display: "flex",
    flexDirection: "column",
    background: "var(--card-bg)",
    border: "1px solid rgba(196,149,106,0.16)",
    borderRadius: 16,
    overflow: "hidden",
    maxHeight: "78vh",
    minHeight: 520,
  },
  aiBanner: {
    display: "flex",
    gap: 10,
    alignItems: "flex-start",
    padding: "14px 18px",
    fontSize: "0.78rem",
    lineHeight: 1.55,
    color: "rgba(232,226,214,0.7)",
    background: "rgba(196,149,106,0.06)",
    borderBottom: "1px solid rgba(196,149,106,0.12)",
  },
  aiDot: {
    flexShrink: 0,
    width: 8,
    height: 8,
    marginTop: 6,
    borderRadius: "50%",
    background: "var(--warm)",
  },
  transcript: {
    flex: 1,
    overflowY: "auto",
    padding: "20px 18px",
    display: "flex",
    flexDirection: "column",
    gap: 14,
  },
  rowAsst: { display: "flex", justifyContent: "flex-start" },
  rowUser: { display: "flex", justifyContent: "flex-end" },
  bubbleAsst: {
    maxWidth: "85%",
    background: "rgba(232,226,214,0.05)",
    border: "1px solid rgba(232,226,214,0.08)",
    borderRadius: "4px 14px 14px 14px",
    padding: "12px 16px",
  },
  bubbleUser: {
    maxWidth: "85%",
    background: "linear-gradient(135deg, var(--warm), var(--warm-dark))",
    color: "var(--bg)",
    borderRadius: "14px 4px 14px 14px",
    padding: "12px 16px",
    fontWeight: 500,
  },
  asstLabel: {
    display: "block",
    fontSize: "0.66rem",
    fontWeight: 700,
    letterSpacing: "0.1em",
    textTransform: "uppercase",
    color: "var(--warm)",
    marginBottom: 6,
  },
  bubbleText: {
    fontSize: "0.95rem",
    lineHeight: 1.65,
    whiteSpace: "pre-wrap",
  },
  typing: { display: "inline-flex", gap: 5, alignItems: "center", padding: "4px 0" },
  dot: {
    width: 7,
    height: 7,
    borderRadius: "50%",
    background: "var(--warm)",
    display: "inline-block",
    animation: "sf-bounce 1.2s infinite ease-in-out",
  },
  contactCard: {
    marginTop: 6,
    background: "rgba(196,149,106,0.07)",
    border: "1px solid rgba(196,149,106,0.22)",
    borderRadius: 14,
    padding: "22px 20px",
  },
  contactHeading: {
    fontFamily: "'Playfair Display', serif",
    fontSize: "1.2rem",
    fontWeight: 600,
    color: "var(--cream)",
    margin: "0 0 6px",
  },
  contactSub: {
    fontSize: "0.85rem",
    lineHeight: 1.6,
    color: "rgba(232,226,214,0.7)",
    margin: "0 0 18px",
  },
  field: { display: "flex", flexDirection: "column", marginBottom: 14 },
  label: { fontSize: "0.8rem", fontWeight: 600, color: "var(--cream)", marginBottom: 6 },
  optional: { fontWeight: 400, color: "rgba(232,226,214,0.45)" },
  input: {
    background: "var(--bg)",
    border: "1px solid rgba(232,226,214,0.16)",
    borderRadius: 8,
    padding: "11px 13px",
    color: "var(--cream)",
    fontSize: "0.95rem",
    fontFamily: "inherit",
  },
  err: { color: "#E89B7A", fontSize: "0.78rem", marginTop: 5 },
  consentRow: { display: "flex", gap: 10, alignItems: "flex-start", margin: "6px 0 4px" },
  checkbox: { marginTop: 3, width: 18, height: 18, flexShrink: 0, accentColor: "var(--warm)" },
  consentText: { fontSize: "0.72rem", lineHeight: 1.5, color: "rgba(232,226,214,0.62)" },
  submitBtn: {
    marginTop: 16,
    width: "100%",
    background: "linear-gradient(135deg, var(--warm), var(--warm-dark))",
    color: "var(--bg)",
    border: "none",
    borderRadius: 10,
    padding: "14px 18px",
    fontSize: "0.92rem",
    fontWeight: 700,
    cursor: "pointer",
    fontFamily: "inherit",
  },
  statusMsg: { fontSize: "0.8rem", color: "var(--warm-light)", marginTop: 10, textAlign: "center" },
  composer: {
    display: "flex",
    gap: 10,
    padding: "14px 16px",
    borderTop: "1px solid rgba(196,149,106,0.12)",
    background: "rgba(0,0,0,0.15)",
  },
  textarea: {
    flex: 1,
    resize: "none",
    background: "var(--bg)",
    border: "1px solid rgba(232,226,214,0.16)",
    borderRadius: 10,
    padding: "12px 14px",
    color: "var(--cream)",
    fontSize: "0.95rem",
    fontFamily: "inherit",
    lineHeight: 1.5,
    maxHeight: 120,
  },
  sendBtn: {
    background: "linear-gradient(135deg, var(--warm), var(--warm-dark))",
    color: "var(--bg)",
    border: "none",
    borderRadius: 10,
    padding: "0 22px",
    fontSize: "0.9rem",
    fontWeight: 700,
    cursor: "pointer",
    fontFamily: "inherit",
    flexShrink: 0,
  },
};
