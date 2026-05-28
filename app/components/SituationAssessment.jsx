// @ts-nocheck
"use client";
import { useState, useRef, useEffect } from "react";

const QUESTIONS = [
  {
    id: 1,
    question: "What's happening with this property?",
    options: [
      { text: "I inherited it and need to figure out what to do", weight: 3 },
      { text: "I'm going through a divorce and we need to sell", weight: 3 },
      { text: "I have tax liens or owe back taxes on it", weight: 4 },
      { text: "It has code violations or needs major repairs I can't afford", weight: 4 },
    ],
  },
  {
    id: 2,
    question: "How quickly do you need to resolve this?",
    options: [
      { text: "As fast as possible — days or weeks", weight: 4 },
      { text: "Within 1-2 months", weight: 3 },
      { text: "Within 3-6 months", weight: 2 },
      { text: "No rush — just exploring options", weight: 1 },
    ],
  },
  {
    id: 3,
    question: "What's the current condition of the property?",
    options: [
      { text: "Move-in ready — no major issues", weight: 1 },
      { text: "Needs some cosmetic updates (paint, carpet, etc.)", weight: 2 },
      { text: "Needs significant repairs (roof, HVAC, plumbing, etc.)", weight: 3 },
      { text: "Major structural issues or has been condemned/cited", weight: 4 },
    ],
  },
  {
    id: 4,
    question: "Is anyone currently living in the property?",
    options: [
      { text: "Yes — I live there", weight: 2 },
      { text: "Yes — tenants or family members live there", weight: 3 },
      { text: "No — it's vacant", weight: 2 },
      { text: "No — it's vacant and has been for a while", weight: 3 },
    ],
  },
  {
    id: 5,
    question: "Do you know roughly what the property is worth?",
    options: [
      { text: "Yes — I've had it appraised or looked at comps", weight: 1 },
      { text: "I have a rough idea from Zillow or similar", weight: 2 },
      { text: "Not really — it's been a while since I checked", weight: 3 },
      { text: "No idea — and I'm not sure about the mortgage balance either", weight: 4 },
    ],
  },
  {
    id: 6,
    question: "Are there any complications with ownership?",
    options: [
      { text: "No — I'm the sole owner with clear title", weight: 1 },
      { text: "Multiple heirs or co-owners involved", weight: 3 },
      { text: "Probate is pending or hasn't started yet", weight: 3 },
      { text: "There are liens, judgments, or title issues I know about", weight: 4 },
    ],
  },
  {
    id: 7,
    question: "Have you talked to anyone else about selling?",
    options: [
      { text: "Yes — a realtor, and I didn't love the experience", weight: 2 },
      { text: "Yes — another 'we buy houses' company, but the offer felt low", weight: 3 },
      { text: "No — I'm just starting to look into this", weight: 2 },
      { text: "No — I don't even know where to start", weight: 4 },
    ],
  },
  {
    id: 8,
    question: "What matters most to you right now?",
    options: [
      { text: "Getting the highest price, even if it takes longer", weight: 1 },
      { text: "Getting a fair price with a fast, guaranteed close", weight: 3 },
      { text: "Just getting this off my plate with zero hassle", weight: 4 },
      { text: "Understanding all my options before making a decision", weight: 2 },
    ],
  },
];

const LOADING_MESSAGES = [
  "Analyzing your situation...",
  "Reviewing Colorado-specific options...",
  "Calculating potential timelines...",
  "Building your personalized assessment...",
  "Almost ready...",
];

export default function SituationAssessment() {
  const [step, setStep] = useState("landing"); // landing | contact | survey | loading | results | error
  const [contact, setContact] = useState({ name: "", email: "", phone: "" });
  const [currentQ, setCurrentQ] = useState(0);
  const [answers, setAnswers] = useState([]);
  const [results, setResults] = useState(null);
  const [loadingMsg, setLoadingMsg] = useState(0);
  const [errorMsg, setErrorMsg] = useState("");
  const containerRef = useRef(null);
  const isInitialMount = useRef(true);

  // Rotate loading messages
  useEffect(() => {
    if (step !== "loading") return;
    const interval = setInterval(() => {
      setLoadingMsg((prev) => (prev + 1) % LOADING_MESSAGES.length);
    }, 2800);
    return () => clearInterval(interval);
  }, [step]);

  // Scroll to top of widget on step change
  // Skip initial mount so the page doesn't auto-scroll to the widget on load
  useEffect(() => {
    if (isInitialMount.current) {
      isInitialMount.current = false;
      return;
    }
    if (containerRef.current) {
      containerRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }, [step, currentQ]);

  const handleContactSubmit = () => {
    if (!contact.name.trim()) return alert("Please enter your name.");
    if (!contact.phone.trim()) return alert("Please enter your phone number.");
    setStep("survey");
  };

  const handleAnswer = (option) => {
    const newAnswers = [...answers, { question: QUESTIONS[currentQ].question, answer: option.text, weight: option.weight }];
    setAnswers(newAnswers);

    if (currentQ < QUESTIONS.length - 1) {
      setCurrentQ(currentQ + 1);
    } else {
      // All questions answered — call AI
      submitAssessment(newAnswers);
    }
  };

  const submitAssessment = async (finalAnswers) => {
    setStep("loading");
    try {
      const res = await fetch("/api/generate-assessment", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ contact, answers: finalAnswers, questions: QUESTIONS }),
      });

      if (!res.ok) throw new Error("Assessment failed");
      const data = await res.json();
      setResults(data);
      setStep("results");

      // Fire off emails in background
      fetch("/api/send-emails", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ contact, results: data, answers: finalAnswers, type: "situation-assessment" }),
      }).catch(() => {});
    } catch (err) {
      console.error(err);
      setErrorMsg("We had trouble generating your assessment. Please try again or call us directly at (720) 738-7998.");
      setStep("error");
    }
  };

  const downloadPDF = () => {
    if (!results) return;
    const html = buildPDFHTML(contact, results, answers);
    const blob = new Blob([html], { type: "text/html" });
    const url = URL.createObjectURL(blob);
    const w = window.open(url, "_blank");
    setTimeout(() => { if (w) w.print(); }, 800);
  };

  const totalScore = answers.reduce((sum, a) => sum + a.weight, 0);
  const maxScore = QUESTIONS.length * 4;
  const progress = ((currentQ) / QUESTIONS.length) * 100;

  // === LANDING ===
  if (step === "landing") {
    return (
      <div ref={containerRef} id="assessment" style={widgetContainer}>
        <div style={{ textAlign: "center", padding: "8px 0" }}>
          <div style={{ fontSize: "0.72rem", fontWeight: 600, color: "var(--warm)", letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: 12 }}>Free Assessment</div>
          <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: "1.4rem", fontWeight: 600, marginBottom: 10, color: "var(--cream)", lineHeight: 1.25 }}>
            Not sure what to do?<br />
            <span style={{ color: "var(--warm)", fontStyle: "italic" }}>We'll help you figure it out.</span>
          </h3>
          <p style={{ fontSize: "0.88rem", color: "rgba(232,226,214,0.55)", lineHeight: 1.6, marginBottom: 24, fontWeight: 300 }}>
            Answer 8 quick questions about your situation. Our AI analyzes your specific circumstances and gives you a personalized breakdown of your options, timeline, and recommended next steps.
          </p>
          <button onClick={() => setStep("contact")} style={primaryBtn}>
            Start My Free Assessment
          </button>
          <p style={{ fontSize: "0.73rem", color: "rgba(232,226,214,0.35)", marginTop: 12, marginBottom: 0 }}>
            Takes 2 minutes &bull; No obligation &bull; Results emailed to you
          </p>
        </div>
      </div>
    );
  }

  // === CONTACT ===
  if (step === "contact") {
    return (
      <div ref={containerRef} style={widgetContainer}>
        <div style={{ fontSize: "0.72rem", fontWeight: 600, color: "var(--warm)", letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: 16, textAlign: "center" }}>Step 1 of 2</div>
        <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: "1.2rem", fontWeight: 600, marginBottom: 20, color: "var(--cream)", textAlign: "center" }}>
          First, tell us how to reach you.
        </h3>
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          <div>
            <label style={labelStyle}>YOUR NAME *</label>
            <input type="text" value={contact.name} onChange={(e) => setContact({ ...contact, name: e.target.value })} placeholder="Full name" style={inputStyle} />
          </div>
          <div>
            <label style={labelStyle}>PHONE *</label>
            <input type="tel" value={contact.phone} onChange={(e) => setContact({ ...contact, phone: e.target.value })} placeholder="(303) 555-0000" style={inputStyle} />
          </div>
          <div>
            <label style={labelStyle}>EMAIL (for your results)</label>
            <input type="email" value={contact.email} onChange={(e) => setContact({ ...contact, email: e.target.value })} placeholder="you@email.com" style={inputStyle} />
          </div>
          <button onClick={handleContactSubmit} style={{ ...primaryBtn, marginTop: 8 }}>
            Continue to Questions →
          </button>
        </div>
        <p style={{ fontSize: "0.73rem", color: "rgba(232,226,214,0.35)", textAlign: "center", marginTop: 12, marginBottom: 0 }}>
          Your information is never shared or sold.
        </p>
      </div>
    );
  }

  // === SURVEY ===
  if (step === "survey") {
    const q = QUESTIONS[currentQ];
    return (
      <div ref={containerRef} style={widgetContainer}>
        {/* Progress bar */}
        <div style={{ marginBottom: 24 }}>
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
            <span style={{ fontSize: "0.73rem", color: "var(--warm)", fontWeight: 600, letterSpacing: "0.05em" }}>
              QUESTION {currentQ + 1} OF {QUESTIONS.length}
            </span>
            <span style={{ fontSize: "0.73rem", color: "rgba(232,226,214,0.4)" }}>
              {Math.round(((currentQ + 1) / QUESTIONS.length) * 100)}%
            </span>
          </div>
          <div style={{ height: 4, background: "rgba(232,226,214,0.08)", borderRadius: 2, overflow: "hidden" }}>
            <div style={{ height: "100%", width: `${((currentQ + 1) / QUESTIONS.length) * 100}%`, background: "linear-gradient(90deg, var(--warm), var(--warm-dark))", borderRadius: 2, transition: "width 0.4s ease" }} />
          </div>
        </div>

        <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: "1.15rem", fontWeight: 600, color: "var(--cream)", marginBottom: 20, lineHeight: 1.35 }}>
          {q.question}
        </h3>

        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {q.options.map((opt, i) => (
            <button
              key={i}
              onClick={() => handleAnswer(opt)}
              style={{
                padding: "14px 18px",
                background: "rgba(232,226,214,0.04)",
                border: "1px solid rgba(232,226,214,0.1)",
                borderRadius: 10,
                color: "var(--cream)",
                fontSize: "0.9rem",
                fontFamily: "'DM Sans', sans-serif",
                fontWeight: 400,
                textAlign: "left",
                cursor: "pointer",
                transition: "all 0.2s ease",
                lineHeight: 1.5,
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = "var(--warm)";
                e.currentTarget.style.background = "rgba(196,149,106,0.08)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = "rgba(232,226,214,0.1)";
                e.currentTarget.style.background = "rgba(232,226,214,0.04)";
              }}
            >
              {opt.text}
            </button>
          ))}
        </div>
      </div>
    );
  }

  // === LOADING ===
  if (step === "loading") {
    return (
      <div ref={containerRef} style={{ ...widgetContainer, textAlign: "center", padding: "60px 24px" }}>
        <div style={{ width: 40, height: 40, border: "3px solid rgba(232,226,214,0.1)", borderTopColor: "var(--warm)", borderRadius: "50%", animation: "sw-spin 0.8s linear infinite", margin: "0 auto 24px" }} />
        <style>{`@keyframes sw-spin { to { transform: rotate(360deg); } } @keyframes sw-pulse { 0%,100% { opacity:1; } 50% { opacity:0.5; } }`}</style>
        <p style={{ fontSize: "1rem", fontWeight: 500, color: "var(--cream)", marginBottom: 8 }}>
          {LOADING_MESSAGES[loadingMsg]}
        </p>
        <p style={{ fontSize: "0.8rem", color: "rgba(232,226,214,0.4)", animation: "sw-pulse 2s ease-in-out infinite" }}>
          This usually takes 10-15 seconds
        </p>
      </div>
    );
  }

  // === ERROR ===
  if (step === "error") {
    return (
      <div ref={containerRef} style={{ ...widgetContainer, textAlign: "center", padding: "48px 24px" }}>
        <div style={{ fontSize: "2rem", marginBottom: 16 }}>⚠️</div>
        <p style={{ fontSize: "0.95rem", color: "var(--cream)", marginBottom: 16, lineHeight: 1.6 }}>{errorMsg}</p>
        <button onClick={() => { setStep("loading"); submitAssessment(answers); }} style={primaryBtn}>
          Try Again
        </button>
      </div>
    );
  }

  // === RESULTS ===
  if (step === "results" && results) {
    const scorePercent = Math.round((totalScore / maxScore) * 100);
    return (
      <div ref={containerRef} style={widgetContainer}>
        <div style={{ textAlign: "center", marginBottom: 28 }}>
          <div style={{ fontSize: "0.72rem", fontWeight: 600, color: "var(--warm)", letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: 8 }}>Your Assessment</div>
          <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: "1.3rem", fontWeight: 600, color: "var(--cream)", marginBottom: 6, lineHeight: 1.3 }}>
            {results.headline}
          </h3>
          <div style={{ display: "inline-block", padding: "4px 14px", background: "rgba(196,149,106,0.12)", borderRadius: 20, fontSize: "0.78rem", fontWeight: 600, color: "var(--warm)", marginBottom: 16 }}>
            {results.urgencyLabel}
          </div>
        </div>

        {/* Score bar */}
        <div style={{ marginBottom: 24 }}>
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
            <span style={{ fontSize: "0.75rem", color: "rgba(232,226,214,0.5)" }}>Situation complexity</span>
            <span style={{ fontSize: "0.75rem", color: "var(--warm)", fontWeight: 600 }}>{scorePercent}%</span>
          </div>
          <div style={{ height: 6, background: "rgba(232,226,214,0.08)", borderRadius: 3, overflow: "hidden" }}>
            <div style={{ height: "100%", width: `${scorePercent}%`, background: scorePercent > 70 ? "#c45c5c" : scorePercent > 45 ? "var(--warm)" : "#4A7C6F", borderRadius: 3, transition: "width 0.6s ease" }} />
          </div>
        </div>

        {/* Summary */}
        <div style={{ background: "rgba(232,226,214,0.03)", borderRadius: 10, padding: "18px 20px", marginBottom: 20, border: "1px solid rgba(232,226,214,0.06)" }}>
          <p style={{ fontSize: "0.9rem", lineHeight: 1.7, color: "rgba(232,226,214,0.7)", margin: 0, fontWeight: 300 }}>
            {results.summary}
          </p>
        </div>

        {/* Recommended path */}
        <div style={{ marginBottom: 20 }}>
          <h4 style={{ fontSize: "0.82rem", fontWeight: 600, color: "var(--warm)", letterSpacing: "0.05em", textTransform: "uppercase", marginBottom: 12 }}>
            Recommended Path
          </h4>
          <div style={{ fontSize: "0.9rem", lineHeight: 1.7, color: "rgba(232,226,214,0.7)", fontWeight: 300 }}>
            {results.recommendedPath}
          </div>
        </div>

        {/* Options breakdown */}
        {results.options && results.options.length > 0 && (
          <div style={{ marginBottom: 20 }}>
            <h4 style={{ fontSize: "0.82rem", fontWeight: 600, color: "var(--warm)", letterSpacing: "0.05em", textTransform: "uppercase", marginBottom: 12 }}>
              Your Options
            </h4>
            {results.options.map((opt, i) => (
              <div key={i} style={{ background: "rgba(232,226,214,0.03)", borderRadius: 8, padding: "14px 16px", marginBottom: 8, border: "1px solid rgba(232,226,214,0.06)" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 4 }}>
                  <span style={{ fontSize: "0.88rem", fontWeight: 600, color: "var(--cream)" }}>{opt.name}</span>
                  <span style={{ fontSize: "0.73rem", fontWeight: 500, color: opt.fit === "Best fit" ? "#4A7C6F" : opt.fit === "Good fit" ? "var(--warm)" : "rgba(232,226,214,0.4)", background: opt.fit === "Best fit" ? "rgba(74,124,111,0.15)" : opt.fit === "Good fit" ? "rgba(196,149,106,0.12)" : "rgba(232,226,214,0.06)", padding: "3px 10px", borderRadius: 4 }}>
                    {opt.fit}
                  </span>
                </div>
                <p style={{ fontSize: "0.82rem", lineHeight: 1.6, color: "rgba(232,226,214,0.55)", margin: 0 }}>{opt.description}</p>
              </div>
            ))}
          </div>
        )}

        {/* Timeline */}
        {results.estimatedTimeline && (
          <div style={{ background: "rgba(196,149,106,0.06)", borderRadius: 10, padding: "16px 20px", marginBottom: 20, border: "1px solid rgba(196,149,106,0.1)" }}>
            <div style={{ fontSize: "0.75rem", fontWeight: 600, color: "var(--warm)", letterSpacing: "0.05em", textTransform: "uppercase", marginBottom: 4 }}>Estimated Timeline</div>
            <div style={{ fontSize: "1.05rem", fontWeight: 600, color: "var(--cream)" }}>{results.estimatedTimeline}</div>
          </div>
        )}

        {/* Next steps */}
        {results.nextSteps && results.nextSteps.length > 0 && (
          <div style={{ marginBottom: 24 }}>
            <h4 style={{ fontSize: "0.82rem", fontWeight: 600, color: "var(--warm)", letterSpacing: "0.05em", textTransform: "uppercase", marginBottom: 12 }}>
              Your Next Steps
            </h4>
            {results.nextSteps.map((ns, i) => (
              <div key={i} style={{ display: "flex", gap: 12, marginBottom: 10 }}>
                <div style={{ width: 24, height: 24, minWidth: 24, background: "rgba(196,149,106,0.12)", borderRadius: 6, display: "flex", alignItems: "center", justifyContent: "center", fontSize: "0.72rem", fontWeight: 700, color: "var(--warm)", marginTop: 2 }}>
                  {i + 1}
                </div>
                <p style={{ fontSize: "0.88rem", lineHeight: 1.6, color: "rgba(232,226,214,0.65)", margin: 0, fontWeight: 300 }}>{ns}</p>
              </div>
            ))}
          </div>
        )}

        {/* Actions */}
        <div style={{ display: "flex", gap: 10, flexDirection: "column" }}>
          <button onClick={downloadPDF} style={primaryBtn}>
            Download PDF Report
          </button>
          <a href="tel:+17207387998" style={{ ...secondaryBtn, textDecoration: "none", textAlign: "center", display: "block" }}>
            Talk to Someone Now — (720) 738-7998
          </a>
        </div>

        <p style={{ fontSize: "0.73rem", color: "rgba(232,226,214,0.35)", textAlign: "center", marginTop: 14, marginBottom: 0 }}>
          {contact.email ? "Your full results have been emailed to you." : "Add your email next time to get results sent to you."}
        </p>
      </div>
    );
  }

  return null;
}

// === STYLES ===
const widgetContainer = {
  background: "var(--card-bg)",
  borderRadius: 18,
  padding: "32px 28px",
  border: "1px solid rgba(232,226,214,0.06)",
};

const primaryBtn = {
  width: "100%",
  padding: "14px",
  background: "linear-gradient(135deg, var(--warm), var(--warm-dark))",
  color: "var(--bg)",
  border: "none",
  borderRadius: 10,
  fontSize: "0.92rem",
  fontWeight: 700,
  fontFamily: "'DM Sans', sans-serif",
  cursor: "pointer",
  letterSpacing: "0.02em",
};

const secondaryBtn = {
  width: "100%",
  padding: "14px",
  background: "transparent",
  color: "var(--cream)",
  border: "1.5px solid rgba(196,149,106,0.3)",
  borderRadius: 10,
  fontSize: "0.92rem",
  fontWeight: 500,
  fontFamily: "'DM Sans', sans-serif",
  cursor: "pointer",
};

const labelStyle = {
  display: "block",
  fontSize: "0.75rem",
  fontWeight: 500,
  color: "rgba(232,226,214,0.5)",
  marginBottom: 6,
  letterSpacing: "0.04em",
};

const inputStyle = {
  width: "100%",
  padding: "12px 14px",
  background: "rgba(232,226,214,0.04)",
  border: "1px solid rgba(232,226,214,0.1)",
  borderRadius: 8,
  color: "var(--cream)",
  fontSize: "0.92rem",
  fontFamily: "'DM Sans', sans-serif",
  outline: "none",
};

// === PDF Builder ===
function buildPDFHTML(contact, results, answers) {
  const scorePercent = Math.round((answers.reduce((s, a) => s + a.weight, 0) / (answers.length * 4)) * 100);
  const optionsHTML = (results.options || []).map((o) => `
    <div style="background:#f8f6f2;border-radius:8px;padding:14px 16px;margin-bottom:8px;">
      <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:4px;">
        <strong>${o.name}</strong>
        <span style="font-size:0.8rem;color:${o.fit === "Best fit" ? "#4A7C6F" : "#A07A55"};font-weight:600;">${o.fit}</span>
      </div>
      <p style="font-size:0.85rem;color:#555;margin:0;">${o.description}</p>
    </div>
  `).join("");

  const stepsHTML = (results.nextSteps || []).map((s, i) => `
    <div style="display:flex;gap:10px;margin-bottom:10px;">
      <div style="width:22px;height:22px;min-width:22px;background:#C4956A;border-radius:5px;display:flex;align-items:center;justify-content:center;color:white;font-size:0.7rem;font-weight:700;">${i + 1}</div>
      <p style="margin:0;font-size:0.88rem;color:#444;line-height:1.5;">${s}</p>
    </div>
  `).join("");

  return `<!DOCTYPE html><html><head><meta charset="utf-8"><title>Property Situation Assessment — ${contact.name}</title>
<style>
  body { font-family: 'Segoe UI', sans-serif; max-width: 700px; margin: 0 auto; padding: 40px 24px; color: #222; }
  h1 { color: #1A1814; font-size: 1.6rem; margin-bottom: 4px; }
  h2 { color: #C4956A; font-size: 1.1rem; margin-top: 28px; margin-bottom: 12px; text-transform: uppercase; letter-spacing: 0.05em; font-size: 0.85rem; }
  .header { border-bottom: 2px solid #C4956A; padding-bottom: 16px; margin-bottom: 24px; }
  .score-bar { height: 8px; background: #eee; border-radius: 4px; margin: 12px 0 24px; overflow: hidden; }
  .score-fill { height: 100%; border-radius: 4px; background: ${scorePercent > 70 ? "#c45c5c" : scorePercent > 45 ? "#C4956A" : "#4A7C6F"}; width: ${scorePercent}%; }
  .summary { background: #f8f6f2; border-radius: 8px; padding: 18px 20px; margin-bottom: 20px; line-height: 1.7; color: #444; }
  .footer { margin-top: 32px; padding-top: 16px; border-top: 1px solid #ddd; font-size: 0.8rem; color: #888; text-align: center; }
  @media print { body { padding: 20px; } }
</style></head><body>
  <div class="header">
    <h1>Property Situation Assessment</h1>
    <p style="color:#888;margin:4px 0 0;">Prepared for <strong>${contact.name}</strong> &bull; ${new Date().toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}</p>
  </div>

  <div style="display:flex;justify-content:space-between;align-items:center;">
    <span style="font-weight:600;">${results.headline}</span>
    <span style="background:rgba(196,149,106,0.15);color:#A07A55;padding:3px 12px;border-radius:12px;font-size:0.8rem;font-weight:600;">${results.urgencyLabel}</span>
  </div>
  <div style="display:flex;justify-content:space-between;font-size:0.8rem;color:#888;margin-top:8px;">
    <span>Situation complexity</span><span style="color:#C4956A;font-weight:600;">${scorePercent}%</span>
  </div>
  <div class="score-bar"><div class="score-fill"></div></div>

  <div class="summary">${results.summary}</div>

  <h2>Recommended Path</h2>
  <p style="line-height:1.7;color:#444;">${results.recommendedPath}</p>

  ${(results.options && results.options.length) ? `<h2>Your Options</h2>${optionsHTML}` : ""}

  ${results.estimatedTimeline ? `<div style="background:rgba(196,149,106,0.08);border-radius:8px;padding:14px 18px;margin:20px 0;border:1px solid rgba(196,149,106,0.15);"><div style="font-size:0.75rem;color:#A07A55;font-weight:600;text-transform:uppercase;letter-spacing:0.05em;margin-bottom:4px;">Estimated Timeline</div><div style="font-size:1.05rem;font-weight:600;">${results.estimatedTimeline}</div></div>` : ""}

  ${(results.nextSteps && results.nextSteps.length) ? `<h2>Next Steps</h2>${stepsHTML}` : ""}

  <div class="footer">
    <p><strong>Redpoint Home Solutions</strong> &bull; A Redpoint Consulting Company</p>
    <p>(720) 738-7998 &bull; redpointhomesolutions.com</p>
    <p>Denver Metro, Colorado</p>
  </div>
</body></html>`;
}
