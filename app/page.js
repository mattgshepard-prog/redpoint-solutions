// @ts-nocheck
"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import Nav from "./components/Nav";
import SiteFooter from "./components/SiteFooter";
import FadeIn from "./components/FadeIn";
import ContactForm from "./components/ContactForm";
import SituationAssessment from "./components/SituationAssessment";

const SITUATIONS = [
  { icon: "🏠", title: "Inherited a Property", slug: "inherited-property", subtitle: "Probate, shared ownership, out-of-state headaches", description: "You didn't ask for this. Maybe the house needs work, maybe there's a mortgage, maybe other family members are involved. We'll help you understand every option — not just the ones that benefit us.", color: "#4A7C6F", stats: "Average timeline: 2-6 weeks" },
  { icon: "⚖️", title: "Going Through Divorce", slug: "divorce", subtitle: "Need to divide assets or sell fast", description: "When you need to move forward, the house can feel like an anchor. We help both parties reach a fair resolution quickly, with zero drama and complete discretion.", color: "#6B5B7B", stats: "Average timeline: 1-3 weeks" },
  { icon: "📋", title: "Tax Liens or Back Taxes", slug: "tax-liens", subtitle: "Facing penalties, auctions, or mounting debt", description: "Tax problems compound fast. Before the county takes action, you have options. We'll walk you through what's possible and help you keep as much equity as you can.", color: "#7B5B5B", stats: "Average timeline: 2-4 weeks" },
  { icon: "🔧", title: "Code Violations or Major Repairs", slug: "code-violations", subtitle: "Can't afford to fix it, can't sell it as-is", description: "Fines piling up. Contractors want $80K. Traditional buyers won't touch it. We buy houses in any condition — we're a licensed general contractor, so we actually know what the repairs cost.", color: "#5B6B7B", stats: "We handle ALL repairs" },
  { icon: "✈️", title: "Need to Move Fast", slug: "forced-move", subtitle: "Job relocation, family emergency, life change", description: "Your job says 'be in Dallas in 30 days.' Your mom needs you across the country. Life doesn't wait for a 90-day listing. We close on your timeline so you can focus on what actually matters.", color: "#5B7B6B", stats: "Close in as little as 7 days" },
];

const TESTIMONIALS = [
  { text: "I inherited my mom's house and had no idea where to start. They walked me through probate, explained every option, and never pressured me. Closed in 3 weeks.", name: "Sarah M.", situation: "Inherited Property" },
  { text: "The house had $40K in code violations and I was getting fined monthly. They made me a fair offer and handled everything. I wish I'd called sooner.", name: "David R.", situation: "Code Violations" },
  { text: "Going through a divorce is hard enough. They made selling the house the easiest part. Professional, fast, and fair to both of us.", name: "Jennifer L.", situation: "Divorce Sale" },
  { text: "Got transferred to Austin with 3 weeks notice. They closed in 11 days and I didn't have to deal with a single showing. Lifesaver.", name: "Marcus T.", situation: "Job Relocation" },
];

const FAQ = [
  { q: "Do I have to pay anything?", a: "No. There are zero fees, zero commissions, and zero closing costs on your end. We cover everything." },
  { q: "What condition does my house need to be in?", a: "Any condition. We're a licensed general contractor — we've seen it all and we buy it all. Mold, fire damage, foundation issues, hoarding situations — nothing scares us off." },
  { q: "How fast can you close?", a: "As fast as 7 days if you need to move quickly, or on your timeline if you need more time. You pick the closing date." },
  { q: "Is this a lowball cash offer company?", a: "No. We make fair offers based on actual repair costs (we're contractors, remember) and current market value. We'll show you exactly how we arrived at our number." },
  { q: "What if I just want information and I'm not ready to sell?", a: "That's exactly what this site is for. Browse our guides, use the situation assessment, or call us just to talk through your options. Zero pressure, ever." },
];

function FAQItem({ item, isOpen, toggle }) {
  return (
    <div style={{ borderBottom: "1px solid rgba(255,255,255,0.08)", cursor: "pointer" }} onClick={toggle}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "20px 0" }}>
        <span style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "1.05rem", color: "var(--cream)", fontWeight: 500 }}>{item.q}</span>
        <span style={{ color: "var(--warm)", fontSize: "1.4rem", fontWeight: 300, transition: "transform 0.3s ease", transform: isOpen ? "rotate(45deg)" : "rotate(0deg)", flexShrink: 0, marginLeft: 16 }}>+</span>
      </div>
      <div style={{ maxHeight: isOpen ? 200 : 0, overflow: "hidden", transition: "max-height 0.4s ease" }}>
        <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "0.95rem", lineHeight: 1.7, color: "rgba(232,226,214,0.7)", paddingBottom: 20, margin: 0 }}>{item.a}</p>
      </div>
    </div>
  );
}

export default function HomePage() {
  const [openFaq, setOpenFaq] = useState(null);
  const [hoveredCard, setHoveredCard] = useState(null);

  return (
    <>
      <Nav />

      {/* HERO */}
      <section style={{ minHeight: "100vh", display: "flex", alignItems: "center", position: "relative", overflow: "hidden" }}>
        <div style={{ position: "absolute", top: "-20%", right: "-10%", width: "60vw", height: "60vw", background: "radial-gradient(circle, rgba(196,149,106,0.03) 0%, transparent 70%)", animation: "rp-glow 6s ease-in-out infinite", pointerEvents: "none" }} />
        <div style={{ position: "absolute", bottom: "-30%", left: "-15%", width: "50vw", height: "50vw", background: "radial-gradient(circle, rgba(74,124,111,0.03) 0%, transparent 70%)", animation: "rp-glow 8s ease-in-out infinite 2s", pointerEvents: "none" }} />

        <div style={{ maxWidth: 1200, margin: "0 auto", padding: "140px 24px 80px", width: "100%", display: "grid", gridTemplateColumns: "1.1fr 0.9fr", gap: "clamp(40px, 6vw, 80px)", alignItems: "center" }}>
          <div>
            <div style={{ display: "inline-block", padding: "6px 14px", background: "rgba(196,149,106,0.1)", borderRadius: 20, fontSize: "0.78rem", fontWeight: 600, color: "var(--warm)", letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: 28, border: "1px solid rgba(196,149,106,0.15)" }}>
              Denver Metro &bull; Colorado
            </div>
            <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: "clamp(2.4rem, 4.5vw, 3.6rem)", fontWeight: 600, lineHeight: 1.15, letterSpacing: "-0.02em", margin: "0 0 24px" }}>
              Your house is a problem.<br />
              <span style={{ color: "var(--warm)", fontStyle: "italic" }}>Let's solve it together.</span>
            </h1>
            <p style={{ fontSize: "1.12rem", lineHeight: 1.75, color: "rgba(232,226,214,0.72)", maxWidth: 520, margin: "0 0 36px", fontWeight: 300 }}>
              Whether you inherited a property, are going through a divorce, owe back taxes, or are staring down expensive repairs — you have options. We'll help you understand every single one.
            </p>
            <div style={{ display: "flex", gap: 14, flexWrap: "wrap" }}>
              <a href="#situations" style={{ background: "linear-gradient(135deg, var(--warm), var(--warm-dark))", color: "var(--bg)", padding: "14px 30px", borderRadius: 10, textDecoration: "none", fontWeight: 600, fontSize: "0.95rem", letterSpacing: "0.02em", display: "inline-block" }}>
                Find Your Situation
              </a>
              <Link href="/contact" style={{ border: "1.5px solid rgba(196,149,106,0.35)", color: "var(--cream)", padding: "14px 30px", borderRadius: 10, textDecoration: "none", fontWeight: 500, fontSize: "0.95rem", display: "inline-block", background: "transparent" }}>
                Talk to Someone Now
              </Link>
            </div>

            <div style={{ display: "flex", gap: 40, marginTop: 52, paddingTop: 32, borderTop: "1px solid rgba(232,226,214,0.08)" }}>
              {[["Zero Fees", "No commissions or closing costs"], ["Any Condition", "Licensed GC — we've seen it all"], ["Your Timeline", "Close in 7 days or 3 months"]].map(([label, sub]) => (
                <div key={label}>
                  <div style={{ fontSize: "0.9rem", fontWeight: 600, color: "var(--warm)", marginBottom: 4 }}>{label}</div>
                  <div style={{ fontSize: "0.78rem", color: "rgba(232,226,214,0.5)", fontWeight: 400 }}>{sub}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Situation quick links */}
          <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
            {SITUATIONS.map((s, i) => (
              <Link key={s.slug} href={`/situations/${s.slug}`} style={{ textDecoration: "none", color: "var(--cream)" }}>
                <div
                  onMouseEnter={() => setHoveredCard(i)}
                  onMouseLeave={() => setHoveredCard(null)}
                  style={{
                    background: hoveredCard === i ? `${s.color}18` : "var(--card-bg)",
                    border: `1px solid ${hoveredCard === i ? `${s.color}40` : "rgba(232,226,214,0.06)"}`,
                    borderRadius: 14,
                    padding: "22px 26px",
                    cursor: "pointer",
                    transition: "all 0.35s ease",
                    transform: hoveredCard === i ? "translateX(-6px)" : "none",
                  }}
                >
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
                      <span style={{ fontSize: "1.5rem" }}>{s.icon}</span>
                      <div>
                        <div style={{ fontWeight: 600, fontSize: "1rem", marginBottom: 2 }}>{s.title}</div>
                        <div style={{ fontSize: "0.8rem", color: "rgba(232,226,214,0.5)", fontWeight: 400 }}>{s.subtitle}</div>
                      </div>
                    </div>
                    <span style={{ color: "var(--warm)", fontSize: "1.2rem", opacity: hoveredCard === i ? 1 : 0.4, transition: "all 0.3s ease", transform: hoveredCard === i ? "translateX(4px)" : "none" }}>→</span>
                  </div>
                </div>
              </Link>
            ))}
            <div style={{ textAlign: "center", padding: "12px 0 0", fontSize: "0.82rem", color: "rgba(232,226,214,0.4)", fontStyle: "italic" }}>
              Not sure which applies? Take our <a href="#assessment" style={{ color: "var(--warm)", textDecoration: "underline" }}>free situation assessment</a>
            </div>
          </div>
        </div>
      </section>

      {/* SITUATIONS DEEP DIVE */}
      <section id="situations" style={{ padding: "100px 24px", maxWidth: 1200, margin: "0 auto" }}>
        <FadeIn>
          <div style={{ textAlign: "center", marginBottom: 64 }}>
            <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: "clamp(1.8rem, 3vw, 2.6rem)", fontWeight: 600, marginBottom: 16, letterSpacing: "-0.02em" }}>
              Every situation is different.<br />
              <span style={{ color: "var(--warm)", fontStyle: "italic" }}>Here's what yours looks like.</span>
            </h2>
            <p style={{ fontSize: "1.05rem", color: "rgba(232,226,214,0.6)", maxWidth: 580, margin: "0 auto", lineHeight: 1.7, fontWeight: 300 }}>
              Click into your situation below. We'll explain what's going on, what your real options are, and how we can help — with zero pressure and zero obligation.
            </p>
          </div>
        </FadeIn>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 24 }}>
          {SITUATIONS.map((s, i) => (
            <FadeIn key={s.slug} delay={i * 0.1} style={i >= 3 ? { gridColumn: i === 3 ? "1 / 2" : "2 / 3" } : {}}>
              <Link href={`/situations/${s.slug}`} style={{ textDecoration: "none", color: "var(--cream)", display: "block", height: "100%" }}>
                <div
                  onMouseEnter={() => setHoveredCard(100 + i)}
                  onMouseLeave={() => setHoveredCard(null)}
                  style={{
                    background: "var(--card-bg)",
                    borderRadius: 18,
                    padding: "36px 32px",
                    border: `1px solid ${hoveredCard === 100 + i ? `${s.color}40` : "rgba(232,226,214,0.06)"}`,
                    transition: "all 0.4s ease",
                    cursor: "pointer",
                    position: "relative",
                    overflow: "hidden",
                    height: "100%",
                  }}
                >
                  <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 3, background: `linear-gradient(90deg, ${s.color}, transparent)`, opacity: hoveredCard === 100 + i ? 1 : 0, transition: "opacity 0.4s ease" }} />
                  <span style={{ fontSize: "2rem", marginBottom: 16, display: "block" }}>{s.icon}</span>
                  <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: "1.35rem", fontWeight: 600, marginBottom: 8 }}>{s.title}</h3>
                  <p style={{ fontSize: "0.92rem", lineHeight: 1.7, color: "rgba(232,226,214,0.6)", marginBottom: 20, fontWeight: 300 }}>{s.description}</p>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <span style={{ fontSize: "0.78rem", color: s.color, fontWeight: 500, background: `${s.color}15`, padding: "5px 12px", borderRadius: 6 }}>{s.stats}</span>
                    <span style={{ color: "var(--warm)", fontSize: "0.88rem", fontWeight: 500, display: "flex", alignItems: "center", gap: 6 }}>
                      Read the guide <span style={{ transition: "transform 0.3s ease", display: "inline-block", transform: hoveredCard === 100 + i ? "translateX(4px)" : "none" }}>→</span>
                    </span>
                  </div>
                </div>
              </Link>
            </FadeIn>
          ))}
        </div>
      </section>

      {/* ABOUT / TRUST */}
      <section id="about" style={{ padding: "100px 24px", background: "rgba(196,149,106,0.03)", borderTop: "1px solid rgba(196,149,106,0.06)", borderBottom: "1px solid rgba(196,149,106,0.06)" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto", display: "grid", gridTemplateColumns: "1fr 1fr", gap: "clamp(40px, 6vw, 80px)", alignItems: "center" }}>
          <FadeIn>
            <div>
              <div style={{ fontSize: "0.78rem", fontWeight: 600, color: "var(--warm)", letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: 16 }}>Why We're Different</div>
              <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: "clamp(1.8rem, 3vw, 2.4rem)", fontWeight: 600, marginBottom: 24, lineHeight: 1.2, letterSpacing: "-0.02em" }}>
                We're not flippers.<br /><span style={{ color: "var(--warm)", fontStyle: "italic" }}>We're builders.</span>
              </h2>
              <div style={{ display: "flex", flexDirection: "column", gap: 16, fontSize: "0.95rem", lineHeight: 1.75, color: "rgba(232,226,214,0.7)", fontWeight: 300 }}>
                <p style={{ margin: 0 }}>Most "we buy houses" companies have never swung a hammer. They guess at repair costs, lowball you, then flip the contract to someone else. We're different.</p>
                <p style={{ margin: 0 }}>Redpoint Home Solutions is backed by Onsight Construction — a licensed general contractor with 15+ years in Colorado. When we look at your house, we know exactly what it needs because we've built and renovated hundreds of homes.</p>
                <p style={{ margin: 0 }}>That means our offers are based on real numbers, not guesses. And it means we can often pay more than other buyers because we don't need to pad our margins for the unknown.</p>
              </div>
            </div>
          </FadeIn>
          <FadeIn delay={0.15}>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
              {[{ num: "15+", label: "Years in Colorado Construction", icon: "🏗️" }, { num: "500+", label: "Homes Renovated or Built", icon: "🏠" }, { num: "$0", label: "Fees to You — Ever", icon: "💰" }, { num: "24hr", label: "Offer Turnaround", icon: "⚡" }].map((stat) => (
                <div key={stat.label} style={{ background: "var(--card-bg)", borderRadius: 14, padding: "28px 22px", border: "1px solid rgba(232,226,214,0.06)", textAlign: "center" }}>
                  <div style={{ fontSize: "1.6rem", marginBottom: 10 }}>{stat.icon}</div>
                  <div style={{ fontFamily: "'Playfair Display', serif", fontSize: "1.8rem", fontWeight: 700, color: "var(--warm)", marginBottom: 6 }}>{stat.num}</div>
                  <div style={{ fontSize: "0.78rem", color: "rgba(232,226,214,0.5)", lineHeight: 1.4 }}>{stat.label}</div>
                </div>
              ))}
            </div>
          </FadeIn>
        </div>
      </section>

      {/* TESTIMONIALS */}
      <section style={{ padding: "100px 24px", maxWidth: 1200, margin: "0 auto" }}>
        <FadeIn>
          <div style={{ textAlign: "center", marginBottom: 56 }}>
            <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: "clamp(1.8rem, 3vw, 2.4rem)", fontWeight: 600, letterSpacing: "-0.02em" }}>
              People in your <span style={{ color: "var(--warm)", fontStyle: "italic" }}>exact situation</span>
            </h2>
          </div>
        </FadeIn>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24 }}>
          {TESTIMONIALS.map((t, i) => (
            <FadeIn key={i} delay={i * 0.1}>
              <div style={{ background: "var(--card-bg)", borderRadius: 16, padding: "32px 28px", border: "1px solid rgba(232,226,214,0.06)", display: "flex", flexDirection: "column", height: "100%" }}>
                <div style={{ fontSize: "2rem", color: "var(--warm)", opacity: 0.3, fontFamily: "'Playfair Display', serif", marginBottom: 12, lineHeight: 1 }}>"</div>
                <p style={{ fontSize: "0.92rem", lineHeight: 1.75, color: "rgba(232,226,214,0.7)", fontWeight: 300, fontStyle: "italic", flex: 1, margin: 0 }}>{t.text}</p>
                <div style={{ marginTop: 20, paddingTop: 16, borderTop: "1px solid rgba(232,226,214,0.06)", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <span style={{ fontWeight: 600, fontSize: "0.9rem" }}>{t.name}</span>
                  <span style={{ fontSize: "0.75rem", color: "var(--warm)", background: "rgba(196,149,106,0.07)", padding: "4px 10px", borderRadius: 5 }}>{t.situation}</span>
                </div>
              </div>
            </FadeIn>
          ))}
        </div>
      </section>

      {/* AI SITUATION ASSESSMENT */}
      <section id="assessment" style={{ padding: "100px 24px" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto", display: "grid", gridTemplateColumns: "1fr 1fr", gap: "clamp(40px, 6vw, 80px)", alignItems: "start" }}>
          <FadeIn>
            <div style={{ position: "sticky", top: 120 }}>
              <div style={{ fontSize: "0.78rem", fontWeight: 600, color: "var(--warm)", letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: 16 }}>AI-Powered Assessment</div>
              <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: "clamp(1.8rem, 3vw, 2.4rem)", fontWeight: 600, marginBottom: 20, lineHeight: 1.2, letterSpacing: "-0.02em" }}>
                Not sure where to start?<br />
                <span style={{ color: "var(--warm)", fontStyle: "italic" }}>Let us analyze your situation.</span>
              </h2>
              <p style={{ fontSize: "0.95rem", lineHeight: 1.75, color: "rgba(232,226,214,0.65)", fontWeight: 300, marginBottom: 24 }}>
                Answer 8 quick questions about your property and circumstances. Our AI analyzes your specific situation against Colorado law, Denver metro market conditions, and our 15+ years of experience — then gives you a personalized breakdown of your options, timeline, and recommended next steps.
              </p>
              <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                {[["Personalized to you", "Not a generic quiz — the AI considers your specific answers together"], ["Colorado-specific", "Probate timelines, tax lien rules, and market data specific to your area"], ["Honest options", "We'll tell you if listing with a realtor is your best move"], ["Instant results", "Get your assessment in under 2 minutes with a downloadable PDF"]].map(([title, desc]) => (
                  <div key={title} style={{ display: "flex", gap: 12 }}>
                    <div style={{ width: 6, minWidth: 6, borderRadius: 3, background: "var(--warm)", opacity: 0.4, marginTop: 4, height: 36 }} />
                    <div>
                      <div style={{ fontSize: "0.88rem", fontWeight: 600, color: "var(--cream)", marginBottom: 2 }}>{title}</div>
                      <div style={{ fontSize: "0.8rem", color: "rgba(232,226,214,0.45)", fontWeight: 300 }}>{desc}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </FadeIn>
          <FadeIn delay={0.15}>
            <SituationAssessment />
          </FadeIn>
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" style={{ padding: "100px 24px", background: "rgba(196,149,106,0.03)", borderTop: "1px solid rgba(196,149,106,0.06)" }}>
        <div style={{ maxWidth: 720, margin: "0 auto" }}>
          <FadeIn>
            <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: "clamp(1.8rem, 3vw, 2.4rem)", fontWeight: 600, textAlign: "center", marginBottom: 48, letterSpacing: "-0.02em" }}>
              Questions you're probably <span style={{ color: "var(--warm)", fontStyle: "italic" }}>asking at 3am</span>
            </h2>
          </FadeIn>
          {FAQ.map((item, i) => (
            <FadeIn key={i} delay={i * 0.06}>
              <FAQItem item={item} isOpen={openFaq === i} toggle={() => setOpenFaq(openFaq === i ? null : i)} />
            </FadeIn>
          ))}
        </div>
      </section>

      {/* CONTACT */}
      <section id="contact" style={{ padding: "100px 24px", maxWidth: 800, margin: "0 auto" }}>
        <FadeIn>
          <div style={{ textAlign: "center", marginBottom: 48 }}>
            <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: "clamp(1.8rem, 3vw, 2.4rem)", fontWeight: 600, marginBottom: 16, letterSpacing: "-0.02em" }}>
              Ready to talk? <span style={{ color: "var(--warm)", fontStyle: "italic" }}>No pressure.</span>
            </h2>
            <p style={{ fontSize: "1rem", color: "rgba(232,226,214,0.6)", maxWidth: 480, margin: "0 auto", lineHeight: 1.7, fontWeight: 300 }}>
              Tell us a little about your situation. We'll reach out within 24 hours with some options — or call us right now.
            </p>
          </div>
        </FadeIn>
        <FadeIn delay={0.1}>
          <ContactForm />
        </FadeIn>
        <FadeIn delay={0.2}>
          <div style={{ textAlign: "center", marginTop: 40, padding: "28px", background: "rgba(196,149,106,0.05)", borderRadius: 14, border: "1px solid rgba(196,149,106,0.1)" }}>
            <p style={{ fontSize: "0.92rem", color: "rgba(232,226,214,0.6)", margin: "0 0 8px" }}>Prefer to talk to someone right now?</p>
            <a href="tel:+17207387998" style={{ fontFamily: "'Playfair Display', serif", fontSize: "1.5rem", fontWeight: 600, color: "var(--warm)", textDecoration: "none" }}>(720) 738-7998</a>
            <p style={{ fontSize: "0.78rem", color: "rgba(232,226,214,0.4)", margin: "8px 0 0" }}>Available 24/7 — talk to a real person, not a robot</p>
          </div>
        </FadeIn>
      </section>

      <SiteFooter />
    </>
  );
}
