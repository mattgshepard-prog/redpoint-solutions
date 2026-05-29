// POST /api/submit-deals-signup
//
// Receives the buyer signup submission from the /deals page (served at
// deals.redpointhomesolutions.com). Sends a notification email to the
// operator and returns success. Buyer profile data is kept separate
// from the seller contact pipeline so the two audiences are not mixed.

import { Resend } from "resend";

export const runtime = "nodejs";

export async function POST(request) {
  try {
    const body = await request.json();
    const {
      name = "",
      email = "",
      phone = "",
      buyerType = "",
      priceRange = "",
      focus = [],
      propertyTypes = [],
      timeline = "",
      financing = "",
      notes = "",
      smsConsent = false,
      consentTimestamp = "",
      consentSource = "",
    } = body || {};

    // Validate the minimum required fields. The full client-side validation
    // is in DealsClient; this is a server-side guard against direct API hits.
    const missing = [];
    if (!name.trim()) missing.push("name");
    if (!email.trim()) missing.push("email");
    if (!phone.trim()) missing.push("phone");
    if (!buyerType) missing.push("buyerType");
    if (!priceRange) missing.push("priceRange");
    if (!Array.isArray(focus) || focus.length === 0) missing.push("focus");
    if (!smsConsent) missing.push("smsConsent");

    if (missing.length > 0) {
      return Response.json(
        { ok: false, error: `Missing required fields: ${missing.join(", ")}` },
        { status: 400 }
      );
    }

    const resendKey = process.env.RESEND_API_KEY;
    const fromEmail = process.env.FROM_EMAIL || "mattgshepard@gmail.com";
    const notifyEmail = process.env.NOTIFICATION_EMAIL || "mattgshepard@gmail.com";

    // If Resend is not configured (dev / local), accept the submission and
    // log to console rather than failing.
    if (!resendKey) {
      console.log("[deals-signup] No RESEND_API_KEY set; submission accepted but no email sent:", { name, email, phone, buyerType });
      return Response.json({ ok: true, warning: "email-not-sent" });
    }

    const resend = new Resend(resendKey);

    const focusList = Array.isArray(focus) ? focus.join(", ") : "(none)";
    const propTypesList = Array.isArray(propertyTypes) && propertyTypes.length ? propertyTypes.join(", ") : "(not specified)";
    const safe = (v) => (v && String(v).trim() ? v : "(not specified)");

    const subject = `[Deals signup] ${name} — ${buyerType} — ${priceRange}`;

    const html = `
      <div style="font-family: 'Segoe UI', Arial, sans-serif; max-width: 640px; margin: 0 auto; color: #222;">
        <h2 style="color: #C4956A; border-bottom: 2px solid #C4956A; padding-bottom: 8px; margin-bottom: 16px;">
          New investor signup — Redpoint Deal List
        </h2>

        <table style="border-collapse: collapse; width: 100%; font-size: 0.95rem;">
          <tr><td style="padding: 8px 4px; color: #888; width: 180px;">Name</td><td style="padding: 8px 4px;"><strong>${escapeHtml(name)}</strong></td></tr>
          <tr><td style="padding: 8px 4px; color: #888;">Email</td><td style="padding: 8px 4px;"><a href="mailto:${escapeHtml(email)}" style="color: #C4956A;">${escapeHtml(email)}</a></td></tr>
          <tr><td style="padding: 8px 4px; color: #888;">Phone</td><td style="padding: 8px 4px;"><a href="tel:${escapeHtml(phone)}" style="color: #C4956A;">${escapeHtml(phone)}</a></td></tr>
          <tr><td style="padding: 8px 4px; color: #888;">Buyer type</td><td style="padding: 8px 4px;">${escapeHtml(buyerType)}</td></tr>
          <tr><td style="padding: 8px 4px; color: #888;">Max price</td><td style="padding: 8px 4px;">${escapeHtml(priceRange)}</td></tr>
          <tr><td style="padding: 8px 4px; color: #888;">Geographic focus</td><td style="padding: 8px 4px;">${escapeHtml(focusList)}</td></tr>
          <tr><td style="padding: 8px 4px; color: #888;">Property types</td><td style="padding: 8px 4px;">${escapeHtml(propTypesList)}</td></tr>
          <tr><td style="padding: 8px 4px; color: #888;">Close timeline</td><td style="padding: 8px 4px;">${escapeHtml(safe(timeline))}</td></tr>
          <tr><td style="padding: 8px 4px; color: #888;">Financing</td><td style="padding: 8px 4px;">${escapeHtml(safe(financing))}</td></tr>
        </table>

        ${notes ? `
          <h3 style="color: #C4956A; font-size: 0.85rem; text-transform: uppercase; letter-spacing: 0.05em; margin-top: 24px; margin-bottom: 8px;">Notes</h3>
          <p style="background: #f8f6f2; padding: 12px 14px; border-radius: 6px; line-height: 1.6; margin: 0;">${escapeHtml(notes).replace(/\n/g, "<br>")}</p>
        ` : ""}

        <h3 style="color: #C4956A; font-size: 0.85rem; text-transform: uppercase; letter-spacing: 0.05em; margin-top: 24px; margin-bottom: 8px;">TCPA / SMS consent record</h3>
        <table style="border-collapse: collapse; width: 100%; font-size: 0.85rem; background: #f8f6f2; border-radius: 6px;">
          <tr><td style="padding: 8px 12px; color: #666; width: 180px;">Consent given</td><td style="padding: 8px 12px;"><strong>${smsConsent ? "YES" : "NO"}</strong></td></tr>
          <tr><td style="padding: 8px 12px; color: #666;">Timestamp (UTC)</td><td style="padding: 8px 12px;">${escapeHtml(consentTimestamp || "(not captured)")}</td></tr>
          <tr><td style="padding: 8px 12px; color: #666;">Source URL</td><td style="padding: 8px 12px;">${escapeHtml(consentSource || "(not captured)")}</td></tr>
        </table>

        <p style="color: #888; font-size: 0.8rem; margin-top: 24px;">
          This signup came through the buyer-side form at <strong>deals.redpointhomesolutions.com</strong>. They consented to SMS and email contact about off-market deals matching their criteria.
        </p>
      </div>
    `;

    const text = `
New investor signup — Redpoint Deal List

Name:           ${name}
Email:          ${email}
Phone:          ${phone}
Buyer type:     ${buyerType}
Max price:      ${priceRange}
Focus:          ${focusList}
Property types: ${propTypesList}
Timeline:       ${safe(timeline)}
Financing:      ${safe(financing)}

${notes ? `Notes:\n${notes}\n` : ""}
TCPA / SMS consent
  Given:        ${smsConsent ? "YES" : "NO"}
  Timestamp:    ${consentTimestamp || "(not captured)"}
  Source URL:   ${consentSource || "(not captured)"}

Source: deals.redpointhomesolutions.com
    `.trim();

    const sendResult = await resend.emails.send({
      from: fromEmail,
      replyTo: email || notifyEmail,
      to: notifyEmail,
      subject,
      html,
      text,
    });

    if (sendResult && sendResult.error) {
      console.error("[deals-signup] Resend error:", sendResult.error);
      return Response.json({ ok: false, error: "Email send failed" }, { status: 500 });
    }

    return Response.json({ ok: true });
  } catch (err) {
    console.error("[deals-signup] Unexpected error:", err);
    return Response.json({ ok: false, error: "Server error" }, { status: 500 });
  }
}

function escapeHtml(str) {
  if (str == null) return "";
  return String(str)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}
