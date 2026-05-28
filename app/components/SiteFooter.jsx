// @ts-nocheck
"use client";
import Link from "next/link";

/**
 * SiteFooter - shared footer with legal links, business address, and disclaimers.
 *
 * Drop-in shared footer for redpoint-solutions. Replaces the simple Footer
 * component. Adds legal page links, business address (required for TCR
 * Brand vetting), and the AI / results disclaimers.
 *
 * USAGE:
 *   import SiteFooter from "./components/SiteFooter";
 *   <SiteFooter />
 */

const BRAND = {
  legalEntity: "Redpoint Consulting, LLC",
  displayName: "Redpoint Home Solutions",
  address1: "1104 McIntosh Ave",
  cityStateZip: "Broomfield, CO 80020",
  email: "mattgshepard@gmail.com",
  phone: "(720) 738-7998",
  phoneTelHref: "tel:+17207387998",
};

export default function SiteFooter() {
  const year = new Date().getFullYear();

  return (
    <footer
      role="contentinfo"
      aria-label="Site footer"
      style={{
        borderTop: "1px solid rgba(232,226,214,0.06)",
        padding: "56px 0 40px",
        background: "transparent",
        marginTop: 40,
      }}
    >
      <div
        style={{
          maxWidth: 1100,
          margin: "0 auto",
          padding: "0 24px",
        }}
      >
        {/* Top row: brand block + legal links nav */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr",
            gap: 32,
            marginBottom: 32,
          }}
          className="site-footer-top-grid"
        >
          <div>
            <Link href="/" style={{ textDecoration: "none", color: "var(--cream)", display: "flex", alignItems: "center", gap: 10, marginBottom: 14 }}>
              <div
                style={{
                  width: 24,
                  height: 24,
                  background: "linear-gradient(135deg, var(--warm), var(--warm-dark))",
                  borderRadius: 5,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: 11,
                  fontWeight: 700,
                  color: "var(--bg)",
                }}
                aria-hidden="true"
              >
                R
              </div>
              <span style={{ fontFamily: "'Playfair Display', serif", fontSize: "1rem", fontWeight: 600 }}>
                {BRAND.displayName}
              </span>
            </Link>
            <p style={{ color: "var(--cream)", fontWeight: 600, fontSize: "0.85rem", margin: "0 0 6px" }}>
              {BRAND.legalEntity}
            </p>
            <p style={{ color: "rgba(232,226,214,0.55)", fontSize: "0.82rem", lineHeight: 1.8, margin: 0 }}>
              {BRAND.address1}
              <br />
              {BRAND.cityStateZip}
              <br />
              <a href={`mailto:${BRAND.email}`} style={{ color: "rgba(232,226,214,0.55)", textDecoration: "underline" }}>
                {BRAND.email}
              </a>
              <br />
              <a href={BRAND.phoneTelHref} style={{ color: "rgba(232,226,214,0.55)", textDecoration: "underline" }}>
                {BRAND.phone}
              </a>
            </p>
          </div>

          <nav aria-label="Legal and site information">
            <p
              style={{
                color: "var(--warm)",
                fontSize: "0.7rem",
                fontWeight: 600,
                letterSpacing: "0.12em",
                textTransform: "uppercase",
                marginBottom: 12,
              }}
            >
              Legal &amp; Info
            </p>
            <ul
              style={{
                listStyle: "none",
                padding: 0,
                margin: 0,
                display: "flex",
                flexWrap: "wrap",
                gap: "8px 20px",
                fontSize: "0.82rem",
              }}
            >
              <li>
                <Link href="/privacy-policy" style={{ color: "rgba(232,226,214,0.55)", textDecoration: "none" }}>
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/terms" style={{ color: "rgba(232,226,214,0.55)", textDecoration: "none" }}>
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link href="/disclaimers" style={{ color: "rgba(232,226,214,0.55)", textDecoration: "none" }}>
                  Disclaimers
                </Link>
              </li>
              <li>
                <Link href="/accessibility" style={{ color: "rgba(232,226,214,0.55)", textDecoration: "none" }}>
                  Accessibility
                </Link>
              </li>
            </ul>
          </nav>
        </div>

        {/* Disclaimer block */}
        <div
          style={{
            borderTop: "1px solid rgba(232,226,214,0.06)",
            paddingTop: 24,
            display: "grid",
            gap: 12,
          }}
        >
          <p style={{ color: "rgba(232,226,214,0.55)", fontSize: "0.75rem", lineHeight: 1.7, maxWidth: 900, margin: 0 }}>
            <strong style={{ color: "rgba(232,226,214,0.8)" }}>Results disclaimer.</strong> Case studies,
            testimonials, and timelines reflect specific transactions and are not guarantees of future
            results. Every property situation is different, and your outcome depends on the condition
            of the home, the market, and the choices you make.
          </p>
          <p style={{ color: "rgba(232,226,214,0.55)", fontSize: "0.75rem", lineHeight: 1.7, maxWidth: 900, margin: 0 }}>
            <strong style={{ color: "rgba(232,226,214,0.8)" }}>AI-generated content.</strong> The
            Situation Assessment on this site uses AI to generate informational output based on your
            answers. AI output may contain errors. Review it carefully and consult qualified
            professionals (attorney, accountant, real estate agent) before making material decisions
            about your property.
          </p>
          <p style={{ color: "rgba(232,226,214,0.4)", fontSize: "0.72rem", lineHeight: 1.6, marginTop: 12, margin: 0 }}>
            &copy; {year} {BRAND.legalEntity}. All rights reserved.
          </p>
        </div>
      </div>

      <style>{`
        @media (min-width: 720px) {
          .site-footer-top-grid {
            grid-template-columns: 1fr 1fr !important;
          }
        }
        footer a:hover { color: var(--cream) !important; }
        footer a:focus-visible {
          outline: 2px solid var(--warm);
          outline-offset: 2px;
          border-radius: 2px;
        }
      `}</style>
    </footer>
  );
}
