// POST /api/seller-chat
//
// The brain of the seller funnel. Per the spec (section 3):
//   1. Heuristic floor (no model call): crisis keywords → force Opus.
//   2. Triage (Haiku) → simple | standard | complex, + on_topic.
//   3. Route to Haiku / Sonnet / Opus. Bias-to-escalate on uncertainty.
//   4. The final options analysis is ALWAYS Opus, runs once near the end.
//   5. A <LEAD_DATA> block in the analysis is stripped server-side and
//      returned separately so the client can ship it to /api/seller-lead.
//
// The SAME master conversation prompt is sent regardless of tier — only the
// model changes, never the agent's identity (keeps the voice seamless).

import {
  MASTER_CONVERSATION_PROMPT,
  TRIAGE_PROMPT,
  OPTIONS_ANALYSIS_PROMPT,
  LEAD_STRUCTURE_PROMPT,
} from "./prompts";

export const runtime = "nodejs";

const ANTHROPIC_URL = "https://api.anthropic.com/v1/messages";
const ANTHROPIC_VERSION = "2023-06-01";

// Model strings. Kept here so a future swap is one edit.
const MODELS = {
  haiku: "claude-haiku-4-5-20251001",
  sonnet: "claude-sonnet-4-6",
  opus: "claude-opus-4-8",
};

// Token-ceiling guardrail (configurable). Caps approximate spend per session
// by estimating tokens from the running transcript length. On exceeding it we
// inject a wrap-up instruction rather than hard-cutting.
const TOKEN_CEILING = parseInt(process.env.SELLER_SESSION_TOKEN_CEILING || "120000", 10);

// ---- Heuristic floor: crisis / advice patterns that force Opus -------------
const FLOOR_PATTERNS = [
  /foreclos/i, /\bauction\b/i, /\blien/i, /probate/i, /inherit/i,
  /passed away/i, /\bdied\b/i, /\bdeath\b/i, /divorce/i, /bankrupt/i,
  /lawsuit/i, /eviction/i, /behind on payment/i, /underwater/i,
  /owe more than/i,
  /what should i do/i, /what are my options/i, /what would you recommend/i,
];

function hitsFloor(text) {
  if (!text) return false;
  return FLOOR_PATTERNS.some((re) => re.test(text));
}

// Rough token estimate (chars/4) for the guardrail. Intentionally cheap.
function estimateTokens(messages) {
  const chars = messages.reduce((n, m) => n + (m.content ? String(m.content).length : 0), 0);
  return Math.ceil(chars / 4);
}

async function callAnthropic({ apiKey, model, system, messages, maxTokens, temperature }) {
  const res = await fetch(ANTHROPIC_URL, {
    method: "POST",
    headers: {
      "content-type": "application/json",
      "x-api-key": apiKey,
      "anthropic-version": ANTHROPIC_VERSION,
    },
    body: JSON.stringify({
      model,
      max_tokens: maxTokens,
      ...(temperature != null ? { temperature } : {}),
      ...(system ? { system } : {}),
      messages,
    }),
  });

  if (!res.ok) {
    const errText = await res.text().catch(() => "");
    throw new Error(`Anthropic ${res.status}: ${errText.slice(0, 400)}`);
  }
  const data = await res.json();
  const text = Array.isArray(data.content)
    ? data.content.filter((b) => b.type === "text").map((b) => b.text).join("\n").trim()
    : "";
  return { text, raw: data };
}

// Triage call. Returns { tier, on_topic }. Fails safe to standard/complex.
async function triage({ apiKey, latest, shortContext }) {
  try {
    const { text } = await callAnthropic({
      apiKey,
      model: MODELS.haiku,
      system: TRIAGE_PROMPT,
      messages: [
        {
          role: "user",
          content: `USER MESSAGE\n${latest}\n\nRECENT CONTEXT\n${shortContext}`,
        },
      ],
      maxTokens: 60,
      temperature: 0,
    });
    const match = text.match(/\{[\s\S]*\}/);
    const parsed = match ? JSON.parse(match[0]) : {};
    const tier = ["simple", "standard", "complex"].includes(parsed.tier) ? parsed.tier : "standard";
    const on_topic = parsed.on_topic !== false; // default true
    return { tier, on_topic };
  } catch (e) {
    // Bias to escalate: if triage breaks, treat as standard (never under-route
    // below standard) so we don't drop a real conversation to the cheap tier.
    console.warn("[seller-chat] triage failed, defaulting to standard:", e.message);
    return { tier: "standard", on_topic: true };
  }
}

function tierToModel(tier) {
  if (tier === "complex") return MODELS.opus;
  if (tier === "standard") return MODELS.sonnet;
  return MODELS.haiku;
}

// Strip the <LEAD_DATA>...</LEAD_DATA> block out of the analysis text and
// parse it. Returns { visible, leadData }.
function extractLeadData(text) {
  const m = text.match(/<LEAD_DATA>([\s\S]*?)<\/LEAD_DATA>/);
  if (!m) return { visible: text.trim(), leadData: null };
  const visible = text.replace(/<LEAD_DATA>[\s\S]*?<\/LEAD_DATA>/, "").trim();
  let leadData = null;
  try {
    const jsonMatch = m[1].match(/\{[\s\S]*\}/);
    if (jsonMatch) leadData = JSON.parse(jsonMatch[0]);
  } catch (e) {
    console.warn("[seller-chat] LEAD_DATA parse failed:", e.message);
  }
  return { visible, leadData };
}

export async function POST(request) {
  try {
    const body = await request.json();
    const {
      messages = [],          // [{role:'user'|'assistant', content:string}]
      mode = "chat",          // "chat" | "analysis" | "structure"
    } = body || {};

    const apiKey = process.env.ANTHROPIC_API_KEY;
    if (!apiKey) {
      return Response.json(
        { ok: false, error: "ANTHROPIC_API_KEY not configured" },
        { status: 500 }
      );
    }

    if (!Array.isArray(messages) || messages.length === 0) {
      return Response.json({ ok: false, error: "messages required" }, { status: 400 });
    }

    // ---- MODE: structure (Haiku) — build enrichment JSON from transcript ----
    if (mode === "structure") {
      const transcript = messages
        .map((m) => `${m.role === "user" ? "Seller" : "Assistant"}: ${m.content}`)
        .join("\n");
      const { text } = await callAnthropic({
        apiKey,
        model: MODELS.haiku,
        system: LEAD_STRUCTURE_PROMPT,
        messages: [{ role: "user", content: transcript }],
        maxTokens: 700,
        temperature: 0,
      });
      let structured = null;
      try {
        const jm = text.match(/\{[\s\S]*\}/);
        structured = jm ? JSON.parse(jm[0]) : null;
      } catch (e) {
        console.warn("[seller-chat] structure parse failed:", e.message);
      }
      return Response.json({ ok: true, structured });
    }

    // ---- MODE: analysis (ALWAYS Opus) — the trust-earning options payoff ----
    if (mode === "analysis") {
      const transcript = messages
        .map((m) => `${m.role === "user" ? "Seller" : "Assistant"}: ${m.content}`)
        .join("\n");
      const { text } = await callAnthropic({
        apiKey,
        model: MODELS.opus,
        system: OPTIONS_ANALYSIS_PROMPT,
        messages: [
          { role: "user", content: `THEIR SITUATION (everything gathered)\n${transcript}` },
        ],
        maxTokens: 1600,
        temperature: 0.4,
      });
      const { visible, leadData } = extractLeadData(text);
      return Response.json({ ok: true, reply: visible, leadData, model: "opus", tier: "analysis" });
    }

    // ---- MODE: chat — heuristic floor → triage → tiered routing -------------
    const latest = [...messages].reverse().find((m) => m.role === "user");
    const latestText = latest ? String(latest.content) : "";

    // Token-ceiling guardrail: if the session is very long, wrap up warmly.
    const est = estimateTokens(messages);
    const wrapUp = est > TOKEN_CEILING;

    let tier, on_topic, model;
    if (hitsFloor(latestText)) {
      tier = "complex";
      on_topic = true;
      model = MODELS.opus;
    } else {
      const shortContext = messages.slice(-4).map((m) => `${m.role}: ${m.content}`).join("\n");
      const t = await triage({ apiKey, latest: latestText, shortContext });
      tier = t.tier;
      on_topic = t.on_topic;
      // Off-topic gets cheaply redirected on the cheap tier (spec §4).
      if (!on_topic) tier = "simple";
      model = tierToModel(tier);
    }

    // Build the system prompt; append a wrap-up nudge if over the ceiling.
    let system = MASTER_CONVERSATION_PROMPT;
    if (wrapUp) {
      system +=
        "\n\nSESSION NOTE: This conversation has run long. Begin gently wrapping up — " +
        "summarize where things stand, make sure they have what they came for, and close " +
        "warmly. Do not cut off abruptly.";
    }

    const { text } = await callAnthropic({
      apiKey,
      model,
      system,
      messages: messages.map((m) => ({ role: m.role, content: String(m.content) })),
      maxTokens: tier === "complex" ? 1200 : 700,
      temperature: 0.6,
    });

    // The master prompt may emit [SHOW_CONTACT_FORM] to reveal the consent gate.
    const showContactForm = /\[SHOW_CONTACT_FORM\]/.test(text);
    const reply = text.replace(/\[SHOW_CONTACT_FORM\]/g, "").trim();

    return Response.json({
      ok: true,
      reply,
      showContactForm,
      model: tier === "complex" ? "opus" : tier === "standard" ? "sonnet" : "haiku",
      tier,
      on_topic,
      wrapUp,
    });
  } catch (err) {
    console.error("[seller-chat] error:", err);
    return Response.json(
      { ok: false, error: "Something went wrong on our end. Please try again." },
      { status: 500 }
    );
  }
}
