// @ts-nocheck
"use client";
import Link from "next/link";
import Nav from "./Nav";
import Footer from "./Footer";
import FadeIn from "./FadeIn";
import ContactForm from "./ContactForm";

const ALL_SITUATIONS = [
  { icon: "🏠", title: "Inherited a Property", slug: "inherited-property" },
  { icon: "⚖️", title: "Going Through Divorce", slug: "divorce" },
  { icon: "📋", title: "Tax Liens or Back Taxes", slug: "tax-liens" },
  { icon: "🔧", title: "Code Violations or Major Repairs", slug: "code-violations" },
  { icon: "✈️", title: "Need to Move Fast", slug: "forced-move" },
];

export default function SituationLayout({ icon, title, subtitle, color, formSituation, children }) {
  return (
    <>
      <Nav />

      {/* Hero */}
      <section style={{ paddingTop: 140, paddingBottom: 60, position: "relative", overflow: "hidden" }}>
        <div style={{ position: "absolute", top: "-20%", right: "-10%", width: "50vw", height: "50vw", background: `radial-gradient(circle, ${color}08 0%, transparent 70%)`, pointerEvents: "none" }} />
        <div style={{ maxWidth: 800, margin: "0 auto", padding: "0 24px" }}>
          <FadeIn>
            <Link href="/" style={{ color: "var(--warm)", textDecoration: "none", fontSize: "0.85rem", fontWeight: 500, display: "inline-flex", alignItems: "center", gap: 6, marginBottom: 32 }}>
              ← Back to Home
            </Link>
            <div style={{ fontSize: "3rem", marginBottom: 16 }}>{icon}</div>
            <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: "clamp(2rem, 4vw, 3rem)", fontWeight: 600, lineHeight: 1.15, letterSpacing: "-0.02em", margin: "0 0 16px" }}>
              {title}
            </h1>
            <p style={{ fontSize: "1.15rem", lineHeight: 1.7, color: "rgba(232,226,214,0.65)", fontWeight: 300, maxWidth: 600, margin: 0 }}>
              {subtitle}
            </p>
          </FadeIn>
        </div>
      </section>

      {/* Content */}
      <section style={{ padding: "0 24px 80px" }}>
        <div style={{ maxWidth: 800, margin: "0 auto" }}>
          <FadeIn delay={0.1}>
            <div className="situation-content">
              {children}
            </div>
          </FadeIn>
        </div>
      </section>

      {/* CTA */}
      <section style={{ padding: "80px 24px", background: "rgba(196,149,106,0.03)", borderTop: "1px solid rgba(196,149,106,0.06)" }}>
        <div style={{ maxWidth: 700, margin: "0 auto" }}>
          <FadeIn>
            <div style={{ textAlign: "center", marginBottom: 40 }}>
              <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: "clamp(1.6rem, 3vw, 2.2rem)", fontWeight: 600, marginBottom: 12, letterSpacing: "-0.02em" }}>
                Ready to explore your options?
              </h2>
              <p style={{ fontSize: "0.95rem", color: "rgba(232,226,214,0.6)", lineHeight: 1.7, fontWeight: 300, margin: 0 }}>
                Tell us about your situation. No obligation, no pressure — just real answers.
              </p>
            </div>
          </FadeIn>
          <FadeIn delay={0.1}>
            <ContactForm preselectedSituation={formSituation} />
          </FadeIn>
          <FadeIn delay={0.15}>
            <div style={{ textAlign: "center", marginTop: 32, padding: 24, background: "rgba(196,149,106,0.05)", borderRadius: 12, border: "1px solid rgba(196,149,106,0.1)" }}>
              <p style={{ fontSize: "0.9rem", color: "rgba(232,226,214,0.6)", margin: "0 0 6px" }}>Want to talk right now?</p>
              <a href="tel:+17207387998" style={{ fontFamily: "'Playfair Display', serif", fontSize: "1.3rem", fontWeight: 600, color: "var(--warm)", textDecoration: "none" }}>(720) 738-7998</a>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* Other situations */}
      <section style={{ padding: "80px 24px" }}>
        <div style={{ maxWidth: 800, margin: "0 auto" }}>
          <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: "1.3rem", fontWeight: 600, textAlign: "center", marginBottom: 28 }}>
            Other situations we help with
          </h3>
          <div style={{ display: "flex", gap: 12, flexWrap: "wrap", justifyContent: "center" }}>
            {ALL_SITUATIONS.filter((s) => s.slug !== formSituation.toLowerCase().replace(/ /g, "-").replace("need-to-move-fast", "forced-move")).map((s) => (
              <Link
                key={s.slug}
                href={`/situations/${s.slug}`}
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 8,
                  padding: "10px 18px",
                  background: "var(--card-bg)",
                  border: "1px solid rgba(232,226,214,0.08)",
                  borderRadius: 10,
                  textDecoration: "none",
                  color: "var(--cream)",
                  fontSize: "0.88rem",
                  fontWeight: 500,
                  transition: "all 0.2s ease",
                }}
              >
                <span>{s.icon}</span> {s.title}
              </Link>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </>
  );
}
