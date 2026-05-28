// @ts-nocheck
import Nav from "../components/Nav";
import Footer from "../components/Footer";
import FadeIn from "../components/FadeIn";
import ContactForm from "../components/ContactForm";
import Link from "next/link";

export const metadata = {
  title: "Contact Redpoint Home Solutions | Get Help With Your Denver Property",
  description: "Ready to talk about your situation? Fill out the form or call us. We respond within 24 hours — or talk to someone right now at (720) 738-7998.",
};

export default function ContactPage() {
  return (
    <>
      <Nav />

      <section style={{ paddingTop: 140, paddingBottom: 40, maxWidth: 700, margin: "0 auto", padding: "140px 24px 40px" }}>
        <FadeIn>
          <Link href="/" style={{ color: "var(--warm)", textDecoration: "none", fontSize: "0.85rem", fontWeight: 500, display: "inline-flex", alignItems: "center", gap: 6, marginBottom: 32 }}>
            ← Back to Home
          </Link>
          <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: "clamp(2rem, 4vw, 2.8rem)", fontWeight: 600, lineHeight: 1.15, letterSpacing: "-0.02em", margin: "0 0 16px" }}>
            Let's talk about{" "}
            <span style={{ color: "var(--warm)", fontStyle: "italic" }}>your situation.</span>
          </h1>
          <p style={{ fontSize: "1.05rem", lineHeight: 1.7, color: "rgba(232,226,214,0.65)", fontWeight: 300, maxWidth: 550, margin: "0 0 48px" }}>
            Fill out the form below and we'll reach out within 24 hours. Or if you'd rather talk right now — call us.
          </p>
        </FadeIn>
      </section>

      <section style={{ padding: "0 24px 80px", maxWidth: 700, margin: "0 auto" }}>
        <FadeIn delay={0.1}>
          <ContactForm />
        </FadeIn>

        <FadeIn delay={0.15}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginTop: 32 }}>
            <div style={{ background: "rgba(196,149,106,0.05)", borderRadius: 14, border: "1px solid rgba(196,149,106,0.1)", padding: "28px", textAlign: "center" }}>
              <div style={{ fontSize: "1.3rem", marginBottom: 8 }}>📞</div>
              <p style={{ fontSize: "0.85rem", color: "rgba(232,226,214,0.5)", margin: "0 0 6px" }}>Call us anytime</p>
              <a href="tel:+17207387998" style={{ fontFamily: "'Playfair Display', serif", fontSize: "1.2rem", fontWeight: 600, color: "var(--warm)", textDecoration: "none" }}>
                (720) 738-7998
              </a>
              <p style={{ fontSize: "0.75rem", color: "rgba(232,226,214,0.4)", margin: "6px 0 0" }}>Available 24/7</p>
            </div>
            <div style={{ background: "rgba(196,149,106,0.05)", borderRadius: 14, border: "1px solid rgba(196,149,106,0.1)", padding: "28px", textAlign: "center" }}>
              <div style={{ fontSize: "1.3rem", marginBottom: 8 }}>📧</div>
              <p style={{ fontSize: "0.85rem", color: "rgba(232,226,214,0.5)", margin: "0 0 6px" }}>Email us</p>
              <a href="mailto:mattgshepard@gmail.com" style={{ fontFamily: "'Playfair Display', serif", fontSize: "1rem", fontWeight: 600, color: "var(--warm)", textDecoration: "none" }}>
                mattgshepard@gmail.com
              </a>
              <p style={{ fontSize: "0.75rem", color: "rgba(232,226,214,0.4)", margin: "6px 0 0" }}>We respond within 24 hours</p>
            </div>
          </div>
        </FadeIn>
      </section>

      <Footer />
    </>
  );
}
