// @ts-nocheck
import Nav from "../components/Nav";
import Footer from "../components/Footer";
import FadeIn from "../components/FadeIn";
import Link from "next/link";

export const metadata = {
  title: "About Redpoint Home Solutions | Licensed Contractor + Real Estate Investor",
  description: "We're not just another 'we buy houses' company. We're licensed contractors with 15+ years in Colorado, which means fairer offers based on real repair costs.",
};

export default function AboutPage() {
  return (
    <>
      <Nav />

      <section style={{ paddingTop: 140, paddingBottom: 80, maxWidth: 800, margin: "0 auto", padding: "140px 24px 80px" }}>
        <FadeIn>
          <Link href="/" style={{ color: "var(--warm)", textDecoration: "none", fontSize: "0.85rem", fontWeight: 500, display: "inline-flex", alignItems: "center", gap: 6, marginBottom: 32 }}>
            ← Back to Home
          </Link>
          <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: "clamp(2rem, 4vw, 3rem)", fontWeight: 600, lineHeight: 1.15, letterSpacing: "-0.02em", margin: "0 0 24px" }}>
            We're not flippers.{" "}
            <span style={{ color: "var(--warm)", fontStyle: "italic" }}>We're builders.</span>
          </h1>
        </FadeIn>

        <FadeIn delay={0.1}>
          <div className="situation-content">
            <p>
              Redpoint Home Solutions exists because we saw an industry full of people who don't understand what they're buying. Most "we buy houses" companies are marketing operations — they generate leads, make lowball offers using rough estimates, and either flip the contract to another investor or overpay for repairs because they don't know what they're doing.
            </p>
            <p>
              We come from the other side. Onsight Construction LLC has been building and renovating homes in Colorado since 2021, but our team's experience goes back 15+ years. We've gut-renovated Victorians in Boulder, converted basements in Broomfield, and rebuilt fire-damaged structures in the mountains.
            </p>
            <p>
              That construction DNA is what makes our offers different. When we walk through your house, we don't see problems — we see a scope of work. We know the difference between a $3,000 drywall repair and a $30,000 foundation issue. We know which subcontractors to call and what materials cost this month, not last year.
            </p>

            <h2>What that means for you</h2>
            <p>
              It means our offers are based on real numbers. We don't need to pad our margin to account for unknown repair costs because the costs aren't unknown to us. That translates directly into a fairer offer for you.
            </p>
            <p>
              It also means we actually close. We don't tie up your property with a contract and then try to wholesale it to someone else. We buy the house, we renovate it with our own crew, and we either sell it or add it to our rental portfolio. What we tell you is what happens.
            </p>

            <h2>Our approach</h2>
            <p>
              We built this website because we believe people in difficult situations deserve real information, not a sales pitch. Every guide on this site was written to help you understand your options — including options that don't involve selling to us.
            </p>
            <p>
              If listing with a realtor is your best move, we'll tell you. If paying off a tax lien makes more sense than selling, we'll walk you through that. Our reputation matters more than any single deal, and treating people right is how we've built a business that lasts.
            </p>

            <div className="callout">
              <p><strong>Our rule:</strong> If we wouldn't want our grandmother treated this way, we don't do it. Simple as that.</p>
            </div>

            <h2>The team</h2>
            <p>
              Redpoint Home Solutions is a division of Redpoint Consulting (M G Enterprises LLC), focused on helping homeowners in the Denver metro area navigate difficult property situations. We're backed by Onsight Construction LLC for renovation work and work with a network of trusted attorneys, title companies, and real estate professionals across Colorado.
            </p>
            <p>
              When you call us, you talk to a real person who lives in your community and understands your local market — not a call center.
            </p>

            <h2>Ready to talk?</h2>
            <p>
              Whether you're ready to sell or just want to understand your options, we're here. No pressure, no obligation, no time limit on the conversation.
            </p>
          </div>
        </FadeIn>

        <FadeIn delay={0.15}>
          <div style={{ display: "flex", gap: 16, marginTop: 40, flexWrap: "wrap" }}>
            <Link
              href="/contact"
              style={{
                background: "linear-gradient(135deg, var(--warm), var(--warm-dark))",
                color: "var(--bg)",
                padding: "14px 30px",
                borderRadius: 10,
                textDecoration: "none",
                fontWeight: 600,
                fontSize: "0.95rem",
              }}
            >
              Get in Touch
            </Link>
            <a
              href="tel:+17207649112"
              style={{
                border: "1.5px solid rgba(196,149,106,0.35)",
                color: "var(--cream)",
                padding: "14px 30px",
                borderRadius: 10,
                textDecoration: "none",
                fontWeight: 500,
                fontSize: "0.95rem",
              }}
            >
              Call (720) 764-9112
            </a>
          </div>
        </FadeIn>
      </section>

      <Footer />
    </>
  );
}
