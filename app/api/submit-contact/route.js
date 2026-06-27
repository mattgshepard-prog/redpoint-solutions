import { NextResponse } from "next/server";

// Turn raw attribution fields into a single human-readable source label,
// so the email tells you at a glance where the lead came from.
function summarizeSource(a = {}) {
  if (a.gclid) return "Google Ads (paid click)";
  if (a.gbraid || a.wbraid) return "Google Ads (in-app / iOS click)";
  if (a.fbclid) return "Meta / Facebook Ads";
  if (a.msclkid) return "Microsoft / Bing Ads";
  if (a.utm_source) {
    const medium = a.utm_medium ? ` / ${a.utm_medium}` : "";
    const campaign = a.utm_campaign ? ` (${a.utm_campaign})` : "";
    return `Tagged link: ${a.utm_source}${medium}${campaign}`;
  }
  const ref = (a.referrer || "").toLowerCase();
  if (!ref) return "Direct / typed URL / bookmark (or stripped referrer)";
  try {
    const host = new URL(a.referrer).hostname.replace(/^www\./, "");
    if (host.includes("google.")) return "Organic Google search";
    if (host.includes("bing.")) return "Organic Bing search";
    if (host.includes("duckduckgo.")) return "Organic DuckDuckGo search";
    if (host.includes("chatgpt.com") || host.includes("openai.com")) return "ChatGPT (cited / linked the site)";
    if (host.includes("perplexity.")) return "Perplexity (cited / linked the site)";
    if (host.includes("facebook.") || host.includes("instagram.")) return "Meta (organic referral)";
    if (host.includes("linkedin.")) return "LinkedIn (organic referral)";
    if (host.includes("redpointhomesolutions.com")) return "Internal navigation (first touch not captured)";
    return `Referral from ${host}`;
  } catch {
    return `Referral: ${a.referrer}`;
  }
}

export async function POST(request) {
  try {
    const body = await request.json();
    const { name, phone, email, situation, message, attribution = {} } = body;

    if (!name || !phone) {
      return NextResponse.json({ error: "Name and phone are required" }, { status: 400 });
    }

    const sourceLabel = summarizeSource(attribution);

    // Log the submission (replace with email/CRM integration)
    console.log("=== NEW LEAD ===");
    console.log(`Name: ${name}`);
    console.log(`Phone: ${phone}`);
    console.log(`Email: ${email || "not provided"}`);
    console.log(`Situation: ${situation || "not specified"}`);
    console.log(`Message: ${message || "none"}`);
    console.log(`Source: ${sourceLabel}`);
    console.log(`Referrer: ${attribution.referrer || "none"}`);
    console.log(`Landing page: ${attribution.landing_page || "none"}`);
    console.log(`UTM: ${attribution.utm_source || "-"} / ${attribution.utm_medium || "-"} / ${attribution.utm_campaign || "-"}`);
    console.log(`Click IDs: gclid=${attribution.gclid || "-"} fbclid=${attribution.fbclid || "-"}`);
    console.log(`Submitted: ${new Date().toISOString()}`);
    console.log("================");

    // TODO: Integrate with one or more of:
    // 1. Resend email to mattgshepard@gmail.com
    // 2. Google Sheets CRM via service account
    // 3. GoHighLevel webhook
    // 4. Gumloop automation trigger

    // For now, if RESEND_API_KEY is set, send notification email
    if (process.env.RESEND_API_KEY) {
      const { Resend } = await import("resend");
      const resend = new Resend(process.env.RESEND_API_KEY);

      const row = (label, value) =>
        `<tr><td style="padding: 8px; font-weight: bold; border-bottom: 1px solid #eee; vertical-align: top;">${label}</td><td style="padding: 8px; border-bottom: 1px solid #eee;">${value}</td></tr>`;

      await resend.emails.send({
        from: process.env.FROM_EMAIL || "mattgshepard@gmail.com",
        replyTo: email || process.env.NOTIFICATION_EMAIL || "mattgshepard@gmail.com",
        to: process.env.NOTIFICATION_EMAIL || "mattgshepard@gmail.com",
        subject: `🏠 New Lead: ${name} — ${situation || "General Inquiry"}`,
        html: `
          <div style="font-family: sans-serif; max-width: 600px;">
            <h2 style="color: #C4956A;">New Lead from Redpoint Home Solutions</h2>
            <table style="width: 100%; border-collapse: collapse;">
              ${row("Name", name)}
              ${row("Phone", `<a href="tel:${phone}">${phone}</a>`)}
              ${row("Email", email || "Not provided")}
              ${row("Situation", situation || "Not specified")}
              ${row("Message", message || "None")}
            </table>

            <h3 style="color: #C4956A; margin-top: 28px; font-size: 1rem;">Lead Source</h3>
            <table style="width: 100%; border-collapse: collapse;">
              ${row("Best guess", `<strong>${sourceLabel}</strong>`)}
              ${row("Referrer", attribution.referrer || "None (direct / stripped)")}
              ${row("Landing page", attribution.landing_page || "Not captured")}
              ${row("UTM source", attribution.utm_source || "—")}
              ${row("UTM medium", attribution.utm_medium || "—")}
              ${row("UTM campaign", attribution.utm_campaign || "—")}
              ${row("Google click (gclid)", attribution.gclid || "—")}
              ${row("Meta click (fbclid)", attribution.fbclid || "—")}
            </table>

            <p style="color: #888; font-size: 0.85rem; margin-top: 24px;">Submitted ${new Date().toLocaleString("en-US", { timeZone: "America/Denver" })} MT</p>
          </div>
        `,
      });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Contact form error:", error);
    return NextResponse.json({ error: "Failed to submit" }, { status: 500 });
  }
}
