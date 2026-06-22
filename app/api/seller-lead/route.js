// POST /api/seller-lead
//
// Writes a structured seller lead into OverWatch. Per the spec (section 6),
// this mirrors the VERIFIED overwatch_delivery.py adapter exactly — a faithful
// JS port of the same Python logic, no redesign:
//
//   - Direct Supabase insert into the `contacts` table (no webhook).
//   - Isolated OverWatch connection via OVERWATCH_SUPABASE_URL / _KEY.
//   - Upsert by lowercased email: select → deep-merge if exists, insert if new.
//   - status:"new" is load-bearing — it triggers OverWatch's Intake Crew.
//   - Source attribution via intake_source / intake_source_detail / tags.
//   - Seller intelligence rides in enrichment_data (JSONB).
//
// The lead write fires the MOMENT consent is captured (spec §4), so the lead is
// secured even if the seller closes the browser immediately after. A Resend
// alert fires to Matt on EVERY successful write (spec §8, decision 4).

import { createClient } from "@supabase/supabase-js";
import { Resend } from "resend";

export const runtime = "nodejs";

const INTAKE_SOURCE = "redpoint-seller-funnel";

export async function POST(request) {
  try {
    const body = await request.json();
    const {
      firstName = "",
      lastName = "",
      email = "",
      phone = "",
      smsConsent = false,
      consentText = "",
      consentTimestamp = "",
      consentSource = "",
      campaignId = "chatgpt-ads-allTriggers",
      gclid = "",                 // Google click id (for conversion attribution)
      gbraid = "",                // iOS app->web click id
      wbraid = "",                // iOS web click id
      enrichment = {},        // structured seller-intel blob (from analysis/structure)
      transcript = [],        // [{role, content}]
    } = body || {};

    // ---- Server-side guard (client also validates) ------------------------
    const missing = [];
    if (!firstName.trim()) missing.push("firstName");
    if (!email.trim()) missing.push("email");
    if (!phone.trim()) missing.push("phone");
    if (!smsConsent) missing.push("smsConsent");
    if (missing.length) {
      return Response.json(
        { ok: false, error: `Missing required fields: ${missing.join(", ")}` },
        { status: 400 }
      );
    }

    const emailLower = email.trim().toLowerCase();
    const nowIso = new Date().toISOString();

    // ---- Build enrichment_data blob (spec §6 shape) -----------------------
    const enrichmentData = {
      property: enrichment.property || { address_or_area: "unknown", type: "unknown", condition_estimate: "unknown" },
      relationship_to_property: enrichment.relationship_to_property || "unknown",
      motivation_summary: enrichment.motivation_summary || "unknown",
      timeline_urgency: enrichment.timeline_urgency || "unknown",
      financial_position: enrichment.financial_position || "unknown",
      urgency_score: typeof enrichment.urgency_score === "number" ? enrichment.urgency_score : null,
      recommended_paths: enrichment.recommended_paths || [],
      suggested_followup_angle: enrichment.suggested_followup_angle || "standard follow-up",
      referral_interest: enrichment.referral_interest || [],
      referral_disclosures_shown: enrichment.referral_disclosures_shown || [],
      tcpa_consent: {
        given: !!smsConsent,
        text_shown: consentText,
        timestamp: consentTimestamp || nowIso,
        source: consentSource || "",
      },
      ad_attribution: {
        gclid: gclid || null,
        gbraid: gbraid || null,
        wbraid: wbraid || null,
      },
      full_transcript: transcript,
      source: INTAKE_SOURCE,
      captured_at: nowIso,
    };

    // ---- OverWatch Supabase write (isolated connection) -------------------
    const owUrl = process.env.OVERWATCH_SUPABASE_URL;
    const owKey = process.env.OVERWATCH_SUPABASE_KEY;

    let writeStatus = "skipped";
    let contactId = null;

    if (owUrl && owKey) {
      const supabase = createClient(owUrl, owKey, { auth: { persistSession: false } });

      // Upsert by lowercased email: look up existing → deep-merge → else insert.
      // A lookup failure is NON-FATAL (mirrors the verified Python adapter):
      // we fall through to insert rather than dropping the lead on the floor.
      let existing = null;
      try {
        const { data, error: selErr } = await supabase
          .from("contacts")
          .select("id, enrichment_data, tags")
          .eq("email", emailLower)
          .maybeSingle();
        if (selErr) {
          console.warn("[seller-lead] contact lookup failed (treating as new):", selErr.message);
        } else {
          existing = data;
        }
      } catch (e) {
        console.warn("[seller-lead] contact lookup threw (treating as new):", e.message);
      }

      const baseTags = ["redpoint_seller", "chatgpt_ads"];

      if (existing) {
        // Deep-merge enrichment_data; union tags; reset status to "new" so the
        // Intake Crew re-picks it up with the fresh info.
        const mergedEnrichment = { ...(existing.enrichment_data || {}), ...enrichmentData };
        const mergedTags = Array.from(new Set([...(existing.tags || []), ...baseTags]));

        const { error: updErr } = await supabase
          .from("contacts")
          .update({
            first_name: firstName,
            last_name: lastName || null,
            phone,
            status: "new",
            intake_source: INTAKE_SOURCE,
            intake_source_detail: campaignId,
            tags: mergedTags,
            enrichment_data: mergedEnrichment,
          })
          .eq("id", existing.id);

        if (updErr) {
          console.error("[seller-lead] update error:", updErr.message);
          return Response.json({ ok: false, error: "Lead update failed" }, { status: 500 });
        }
        writeStatus = "updated";
        contactId = existing.id;
      } else {
        const { data: inserted, error: insErr } = await supabase
          .from("contacts")
          .insert({
            email: emailLower,
            first_name: firstName,
            last_name: lastName || null,
            phone,
            status: "new", // REQUIRED — triggers Intake Crew
            intake_source: INTAKE_SOURCE,
            intake_source_detail: campaignId,
            tags: baseTags,
            enrichment_data: enrichmentData,
          })
          .select("id")
          .maybeSingle();

        if (insErr) {
          console.error("[seller-lead] insert error:", insErr.message);
          return Response.json({ ok: false, error: "Lead insert failed" }, { status: 500 });
        }
        writeStatus = "inserted";
        contactId = inserted ? inserted.id : null;
      }
    } else {
      console.warn("[seller-lead] OVERWATCH_SUPABASE_URL/KEY not set; lead not persisted.");
    }

    // ---- Resend alert to Matt on EVERY lead (spec §8.4) -------------------
    await sendAlert({ firstName, lastName, email: emailLower, phone, enrichmentData, writeStatus });

    return Response.json({ ok: true, writeStatus, contactId });
  } catch (err) {
    console.error("[seller-lead] unexpected error:", err);
    return Response.json({ ok: false, error: "Server error" }, { status: 500 });
  }
}

async function sendAlert({ firstName, lastName, email, phone, enrichmentData, writeStatus }) {
  const resendKey = process.env.RESEND_API_KEY;
  const fromEmail = process.env.FROM_EMAIL || "mattgshepard@gmail.com";
  const notifyEmail = process.env.NOTIFICATION_EMAIL || "mattgshepard@gmail.com";

  if (!resendKey) {
    console.log("[seller-lead] No RESEND_API_KEY; alert skipped:", { firstName, email, phone });
    return;
  }

  try {
    const resend = new Resend(resendKey);
    const name = `${firstName}${lastName ? " " + lastName : ""}`.trim();
    const e = enrichmentData;
    const urgency = e.urgency_score != null ? `${e.urgency_score}/5` : "n/a";
    const paths = Array.isArray(e.recommended_paths) && e.recommended_paths.length ? e.recommended_paths.join(", ") : "(none)";
    const refs = Array.isArray(e.referral_interest) && e.referral_interest.length ? e.referral_interest.join(", ") : "(none)";
    const prop = e.property || {};

    const subject = `[Seller lead] ${name} — urgency ${urgency} — ${e.timeline_urgency || "timeline n/a"}`;

    const html = `
      <div style="font-family:'Segoe UI',Arial,sans-serif;max-width:640px;margin:0 auto;color:#222;">
        <h2 style="color:#C4956A;border-bottom:2px solid #C4956A;padding-bottom:8px;margin-bottom:16px;">
          New seller lead — Redpoint Seller Funnel
        </h2>
        <table style="border-collapse:collapse;width:100%;font-size:0.95rem;">
          <tr><td style="padding:8px 4px;color:#888;width:180px;">Name</td><td style="padding:8px 4px;"><strong>${escapeHtml(name)}</strong></td></tr>
          <tr><td style="padding:8px 4px;color:#888;">Email</td><td style="padding:8px 4px;"><a href="mailto:${escapeHtml(email)}" style="color:#C4956A;">${escapeHtml(email)}</a></td></tr>
          <tr><td style="padding:8px 4px;color:#888;">Phone</td><td style="padding:8px 4px;"><a href="tel:${escapeHtml(phone)}" style="color:#C4956A;">${escapeHtml(phone)}</a></td></tr>
          <tr><td style="padding:8px 4px;color:#888;">Urgency</td><td style="padding:8px 4px;"><strong>${escapeHtml(urgency)}</strong></td></tr>
          <tr><td style="padding:8px 4px;color:#888;">Timeline</td><td style="padding:8px 4px;">${escapeHtml(e.timeline_urgency || "n/a")}</td></tr>
          <tr><td style="padding:8px 4px;color:#888;">OverWatch write</td><td style="padding:8px 4px;">${escapeHtml(writeStatus)}</td></tr>
        </table>

        <h3 style="color:#C4956A;font-size:0.85rem;text-transform:uppercase;letter-spacing:0.05em;margin-top:24px;margin-bottom:8px;">Situation</h3>
        <table style="border-collapse:collapse;width:100%;font-size:0.9rem;">
          <tr><td style="padding:6px 4px;color:#888;width:180px;">Motivation</td><td style="padding:6px 4px;">${escapeHtml(e.motivation_summary || "unknown")}</td></tr>
          <tr><td style="padding:6px 4px;color:#888;">Relationship</td><td style="padding:6px 4px;">${escapeHtml(e.relationship_to_property || "unknown")}</td></tr>
          <tr><td style="padding:6px 4px;color:#888;">Property</td><td style="padding:6px 4px;">${escapeHtml(prop.address_or_area || "unknown")} — ${escapeHtml(prop.type || "unknown")} — ${escapeHtml(prop.condition_estimate || "unknown")}</td></tr>
          <tr><td style="padding:6px 4px;color:#888;">Financial</td><td style="padding:6px 4px;">${escapeHtml(e.financial_position || "unknown")}</td></tr>
          <tr><td style="padding:6px 4px;color:#888;">Paths surfaced</td><td style="padding:6px 4px;">${escapeHtml(paths)}</td></tr>
          <tr><td style="padding:6px 4px;color:#888;">Referral interest</td><td style="padding:6px 4px;">${escapeHtml(refs)}</td></tr>
        </table>

        <h3 style="color:#C4956A;font-size:0.85rem;text-transform:uppercase;letter-spacing:0.05em;margin-top:24px;margin-bottom:8px;">Suggested follow-up</h3>
        <p style="background:#f8f6f2;padding:12px 14px;border-radius:6px;line-height:1.6;margin:0;">${escapeHtml(e.suggested_followup_angle || "standard follow-up")}</p>

        <h3 style="color:#C4956A;font-size:0.85rem;text-transform:uppercase;letter-spacing:0.05em;margin-top:24px;margin-bottom:8px;">TCPA consent record</h3>
        <table style="border-collapse:collapse;width:100%;font-size:0.85rem;background:#f8f6f2;border-radius:6px;">
          <tr><td style="padding:8px 12px;color:#666;width:180px;">Consent given</td><td style="padding:8px 12px;"><strong>${e.tcpa_consent && e.tcpa_consent.given ? "YES" : "NO"}</strong></td></tr>
          <tr><td style="padding:8px 12px;color:#666;">Timestamp</td><td style="padding:8px 12px;">${escapeHtml((e.tcpa_consent && e.tcpa_consent.timestamp) || "(not captured)")}</td></tr>
          <tr><td style="padding:8px 12px;color:#666;">Source URL</td><td style="padding:8px 12px;">${escapeHtml((e.tcpa_consent && e.tcpa_consent.source) || "(not captured)")}</td></tr>
        </table>

        <p style="color:#888;font-size:0.8rem;margin-top:24px;">
          Source: <strong>Redpoint Seller Funnel (/sell)</strong>. Lead written to OverWatch with status "new".
          Full transcript is stored in enrichment_data.full_transcript.
        </p>
      </div>
    `;

    await resend.emails.send({
      from: fromEmail,
      replyTo: email || notifyEmail,
      to: notifyEmail,
      subject,
      html,
    });
  } catch (e) {
    // An alert failure must never block the lead write.
    console.error("[seller-lead] alert send failed (non-fatal):", e.message);
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
