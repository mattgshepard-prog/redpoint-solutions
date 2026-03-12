import { NextResponse } from "next/server";

export async function POST(request) {
  try {
    const body = await request.json();
    const { name, phone, email, situation, message } = body;

    if (!name || !phone) {
      return NextResponse.json({ error: "Name and phone are required" }, { status: 400 });
    }

    // Log the submission (replace with email/CRM integration)
    console.log("=== NEW LEAD ===");
    console.log(`Name: ${name}`);
    console.log(`Phone: ${phone}`);
    console.log(`Email: ${email || "not provided"}`);
    console.log(`Situation: ${situation || "not specified"}`);
    console.log(`Message: ${message || "none"}`);
    console.log(`Submitted: ${new Date().toISOString()}`);
    console.log("================");

    // TODO: Integrate with one or more of:
    // 1. Resend email to matt@redpointsolutions.ai
    // 2. Google Sheets CRM via service account
    // 3. GoHighLevel webhook
    // 4. Gumloop automation trigger

    // For now, if RESEND_API_KEY is set, send notification email
    if (process.env.RESEND_API_KEY) {
      const { Resend } = await import("resend");
      const resend = new Resend(process.env.RESEND_API_KEY);

      await resend.emails.send({
        from: process.env.FROM_EMAIL || "leads@redpointsolutions.ai",
        to: process.env.NOTIFICATION_EMAIL || "matt@redpointsolutions.ai",
        subject: `🏠 New Lead: ${name} — ${situation || "General Inquiry"}`,
        html: `
          <div style="font-family: sans-serif; max-width: 600px;">
            <h2 style="color: #C4956A;">New Lead from Redpoint Solutions</h2>
            <table style="width: 100%; border-collapse: collapse;">
              <tr><td style="padding: 8px; font-weight: bold; border-bottom: 1px solid #eee;">Name</td><td style="padding: 8px; border-bottom: 1px solid #eee;">${name}</td></tr>
              <tr><td style="padding: 8px; font-weight: bold; border-bottom: 1px solid #eee;">Phone</td><td style="padding: 8px; border-bottom: 1px solid #eee;"><a href="tel:${phone}">${phone}</a></td></tr>
              <tr><td style="padding: 8px; font-weight: bold; border-bottom: 1px solid #eee;">Email</td><td style="padding: 8px; border-bottom: 1px solid #eee;">${email || "Not provided"}</td></tr>
              <tr><td style="padding: 8px; font-weight: bold; border-bottom: 1px solid #eee;">Situation</td><td style="padding: 8px; border-bottom: 1px solid #eee;">${situation || "Not specified"}</td></tr>
              <tr><td style="padding: 8px; font-weight: bold; vertical-align: top;">Message</td><td style="padding: 8px;">${message || "None"}</td></tr>
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
