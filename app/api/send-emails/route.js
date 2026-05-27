import { NextResponse } from "next/server";

export async function POST(request) {
  try {
    const { contact, results, answers, type } = await request.json();

    if (!process.env.RESEND_API_KEY) {
      console.log("RESEND_API_KEY not set — skipping emails");
      return NextResponse.json({ success: true, skipped: true });
    }

    const { Resend } = await import("resend");
    const resend = new Resend(process.env.RESEND_API_KEY);

    const fromEmail = process.env.FROM_EMAIL || "mattgshepard@gmail.com";
    const notifyEmail = process.env.NOTIFICATION_EMAIL || "mattgshepard@gmail.com";

    const scorePercent = answers
      ? Math.round((answers.reduce((s, a) => s + a.weight, 0) / (answers.length * 4)) * 100)
      : 0;

    // Build options HTML for emails
    const optionsHTML = (results.options || [])
      .map(
        (o) => `
      <div style="background:#f8f6f2;border-radius:8px;padding:14px 16px;margin-bottom:8px;">
        <div style="margin-bottom:4px;">
          <strong>${o.name}</strong>
          <span style="margin-left:8px;font-size:0.8rem;color:${o.fit === "Best fit" ? "#4A7C6F" : "#A07A55"};font-weight:600;">(${o.fit})</span>
        </div>
        <p style="font-size:0.85rem;color:#555;margin:0;line-height:1.5;">${o.description}</p>
      </div>`
      )
      .join("");

    const stepsHTML = (results.nextSteps || [])
      .map((s, i) => `<p style="margin:8px 0;color:#444;"><strong>${i + 1}.</strong> ${s}</p>`)
      .join("");

    const answersHTML = (answers || [])
      .map((a) => `<tr><td style="padding:6px 8px;border-bottom:1px solid #eee;font-size:0.85rem;color:#666;">${a.question}</td><td style="padding:6px 8px;border-bottom:1px solid #eee;font-size:0.85rem;">${a.answer}</td></tr>`)
      .join("");

    const emailPromises = [];

    // 1. Email to the lead (if they provided email)
    if (contact.email) {
      emailPromises.push(
        resend.emails.send({
          from: fromEmail,
          replyTo: notifyEmail,
          to: contact.email,
          subject: `Your Property Situation Assessment — Redpoint Home Solutions`,
          html: `
            <div style="font-family:'Segoe UI',sans-serif;max-width:600px;margin:0 auto;padding:20px;">
              <div style="border-bottom:2px solid #C4956A;padding-bottom:16px;margin-bottom:24px;">
                <h1 style="color:#1A1814;margin:0;font-size:1.4rem;">Your Property Situation Assessment</h1>
                <p style="color:#888;margin:6px 0 0;font-size:0.9rem;">Prepared for ${contact.name}</p>
              </div>

              <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:16px;">
                <h2 style="color:#1A1814;font-size:1.1rem;margin:0;">${results.headline}</h2>
              </div>
              <div style="display:inline-block;background:rgba(196,149,106,0.15);color:#A07A55;padding:3px 12px;border-radius:12px;font-size:0.8rem;font-weight:600;margin-bottom:16px;">${results.urgencyLabel}</div>

              <div style="background:#f8f6f2;border-radius:8px;padding:18px 20px;margin-bottom:20px;">
                <p style="margin:0;line-height:1.7;color:#444;">${results.summary}</p>
              </div>

              <h3 style="color:#C4956A;font-size:0.85rem;text-transform:uppercase;letter-spacing:0.05em;">Recommended Path</h3>
              <p style="line-height:1.7;color:#444;">${results.recommendedPath}</p>

              ${optionsHTML ? `<h3 style="color:#C4956A;font-size:0.85rem;text-transform:uppercase;letter-spacing:0.05em;">Your Options</h3>${optionsHTML}` : ""}

              ${results.estimatedTimeline ? `<div style="background:rgba(196,149,106,0.08);border-radius:8px;padding:14px 18px;margin:20px 0;border:1px solid rgba(196,149,106,0.15);"><div style="font-size:0.75rem;color:#A07A55;font-weight:600;text-transform:uppercase;">Estimated Timeline</div><div style="font-size:1rem;font-weight:600;color:#1A1814;margin-top:4px;">${results.estimatedTimeline}</div></div>` : ""}

              ${stepsHTML ? `<h3 style="color:#C4956A;font-size:0.85rem;text-transform:uppercase;letter-spacing:0.05em;">Next Steps</h3>${stepsHTML}` : ""}

              <div style="margin-top:32px;padding:20px;background:#1A1814;border-radius:10px;text-align:center;">
                <p style="color:#E8E2D6;margin:0 0 8px;font-size:0.95rem;">Ready to talk? We're here for you.</p>
                <a href="tel:+17207649112" style="color:#C4956A;font-size:1.2rem;font-weight:600;text-decoration:none;">(720) 764-9112</a>
                <p style="color:rgba(232,226,214,0.5);margin:8px 0 0;font-size:0.8rem;">Available 24/7 — no pressure, just real answers</p>
              </div>

              <div style="margin-top:24px;text-align:center;font-size:0.78rem;color:#aaa;">
                <p>Redpoint Home Solutions &bull; A Redpoint Consulting Company<br/>Denver Metro, Colorado</p>
              </div>
            </div>
          `,
        })
      );
    }

    // 2. Notification email to Matt
    emailPromises.push(
      resend.emails.send({
        from: fromEmail,
        replyTo: contact.email || notifyEmail,
        to: notifyEmail,
        subject: `🏠 Assessment Lead: ${contact.name} — ${results.urgencyLabel} (${scorePercent}%)`,
        html: `
          <div style="font-family:'Segoe UI',sans-serif;max-width:600px;margin:0 auto;padding:20px;">
            <h2 style="color:#C4956A;margin:0 0 16px;">New Assessment Lead</h2>

            <table style="width:100%;border-collapse:collapse;margin-bottom:20px;">
              <tr><td style="padding:8px;font-weight:bold;border-bottom:1px solid #eee;">Name</td><td style="padding:8px;border-bottom:1px solid #eee;">${contact.name}</td></tr>
              <tr><td style="padding:8px;font-weight:bold;border-bottom:1px solid #eee;">Phone</td><td style="padding:8px;border-bottom:1px solid #eee;"><a href="tel:${contact.phone}">${contact.phone}</a></td></tr>
              <tr><td style="padding:8px;font-weight:bold;border-bottom:1px solid #eee;">Email</td><td style="padding:8px;border-bottom:1px solid #eee;">${contact.email || "Not provided"}</td></tr>
              <tr><td style="padding:8px;font-weight:bold;border-bottom:1px solid #eee;">Score</td><td style="padding:8px;border-bottom:1px solid #eee;">${scorePercent}% — ${results.urgencyLabel}</td></tr>
              <tr><td style="padding:8px;font-weight:bold;">Headline</td><td style="padding:8px;">${results.headline}</td></tr>
            </table>

            <h3 style="color:#C4956A;font-size:0.85rem;">Assessment Summary</h3>
            <p style="color:#444;line-height:1.6;">${results.summary}</p>
            <p style="color:#444;line-height:1.6;"><strong>Recommended:</strong> ${results.recommendedPath}</p>
            <p style="color:#444;line-height:1.6;"><strong>Timeline:</strong> ${results.estimatedTimeline || "Not specified"}</p>

            <h3 style="color:#C4956A;font-size:0.85rem;">Their Answers</h3>
            <table style="width:100%;border-collapse:collapse;font-size:0.85rem;">
              ${answersHTML}
            </table>

            <p style="margin-top:24px;color:#888;font-size:0.8rem;">Submitted ${new Date().toLocaleString("en-US", { timeZone: "America/Denver" })} MT</p>
          </div>
        `,
      })
    );

    const emailResults = await Promise.allSettled(emailPromises);
    const anyFailed = emailResults.some((r) => r.status === "rejected");

    return NextResponse.json({ success: true, emailsSent: !anyFailed });
  } catch (error) {
    console.error("Email error:", error);
    return NextResponse.json({ success: false, error: "Email send failed" }, { status: 500 });
  }
}
