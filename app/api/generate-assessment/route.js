import { NextResponse } from "next/server";

export async function POST(request) {
  try {
    const { contact, answers, questions } = await request.json();
    const KEY = process.env.GEMINI_API_KEY;

    if (!KEY) {
      return NextResponse.json({ error: "AI assessment not configured" }, { status: 500 });
    }

    // Build Q&A summary
    const qaSummary = answers.map((a) => `Q: ${a.question}\nA: ${a.answer}`).join("\n\n");
    const totalScore = answers.reduce((s, a) => s + a.weight, 0);
    const maxScore = questions.length * 4;
    const scorePercent = Math.round((totalScore / maxScore) * 100);

    const prompt = `You are a senior real estate advisor specializing in helping distressed homeowners in the Denver metro area of Colorado. You work for Redpoint Home Solutions, which is backed by Onsight Construction (a licensed general contractor with 15+ years experience).

A homeowner named ${contact.name} just completed our Property Situation Assessment. Their complexity score is ${scorePercent}% (${totalScore}/${maxScore} — higher means more complex/urgent).

Here are their answers:

${qaSummary}

Based on their specific answers, generate a personalized assessment. Be empathetic, specific to Colorado law and Denver metro market conditions, and genuinely helpful — not salesy. Mention specific things about their answers. If a traditional listing is their best option, say so.

Respond ONLY with a JSON object (no markdown, no backticks, no preamble) with this exact structure:
{
  "headline": "A short, empathetic headline for their situation (max 10 words)",
  "urgencyLabel": "One of: 'Act Soon', 'Time to Plan', 'Explore Your Options', 'Take Your Time'",
  "summary": "2-3 sentences summarizing their specific situation and what it means. Reference their actual answers.",
  "recommendedPath": "2-3 sentences on the best path forward given their specific circumstances. Be concrete and Colorado-specific.",
  "options": [
    {
      "name": "Option name (e.g., 'Sell Direct to Redpoint', 'List with a Realtor', 'Keep & Rent', 'Pay Off the Lien')",
      "fit": "One of: 'Best fit', 'Good fit', 'May not work'",
      "description": "1-2 sentences on why this option does or doesn't work for their situation"
    }
  ],
  "estimatedTimeline": "e.g., '2-4 weeks from first call to closing' or '30-60 days with probate'",
  "nextSteps": [
    "First concrete step they should take",
    "Second step",
    "Third step"
  ]
}

Include 3-4 options and exactly 3 next steps. Make the assessment genuinely useful — the kind of advice a good friend in real estate would give at 3am.`;

    const res = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${KEY}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [{ role: "user", parts: [{ text: prompt }] }],
          generationConfig: {
            responseMimeType: "application/json",
            maxOutputTokens: 4096,
          },
        }),
      }
    );

    if (!res.ok) {
      const errText = await res.text();
      console.error("Gemini error:", errText);
      return NextResponse.json({ error: "AI generation failed" }, { status: 500 });
    }

    const data = await res.json();

    // Handle Gemini 2.5 Flash thinking blocks
    const parts = data.candidates?.[0]?.content?.parts || [];
    let text = "";

    // Find the part that contains JSON (skip thinking parts)
    for (const part of parts) {
      if (part.text && part.text.trim().startsWith("{")) {
        text = part.text;
        break;
      }
    }
    // Fallback: use last text part
    if (!text) {
      for (let i = parts.length - 1; i >= 0; i--) {
        if (parts[i].text) {
          text = parts[i].text;
          break;
        }
      }
    }

    if (!text) {
      console.error("No text in Gemini response:", JSON.stringify(data));
      return NextResponse.json({ error: "Empty AI response" }, { status: 500 });
    }

    // Brace-depth JSON extraction (handles markdown fences, preamble, etc.)
    let cleaned = text.replace(/```json\n?/g, "").replace(/```\n?/g, "").trim();
    let depth = 0, start = -1, end = -1;
    for (let i = 0; i < cleaned.length; i++) {
      if (cleaned[i] === "{") { if (depth === 0) start = i; depth++; }
      if (cleaned[i] === "}") { depth--; if (depth === 0 && start >= 0) { end = i; break; } }
    }

    if (start === -1 || end === -1) {
      console.error("Could not extract JSON from:", text.substring(0, 500));
      return NextResponse.json({ error: "Failed to parse AI response" }, { status: 500 });
    }

    const assessment = JSON.parse(cleaned.substring(start, end + 1));

    // Log the lead
    console.log("=== ASSESSMENT LEAD ===");
    console.log(`Name: ${contact.name}`);
    console.log(`Phone: ${contact.phone}`);
    console.log(`Email: ${contact.email || "not provided"}`);
    console.log(`Score: ${scorePercent}% (${totalScore}/${maxScore})`);
    console.log(`Urgency: ${assessment.urgencyLabel}`);
    console.log("=======================");

    return NextResponse.json(assessment);
  } catch (error) {
    console.error("Assessment error:", error);
    return NextResponse.json({ error: "Assessment failed" }, { status: 500 });
  }
}
