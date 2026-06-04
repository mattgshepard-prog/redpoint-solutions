// app/sell/page.js
// Campaign landing page for the ChatGPT "Motivated Sellers — All Triggers" ad.
// Indexable (sellers are a public search audience), branded Redpoint Home
// Solutions, on the main domain. Hosts the conversational seller funnel.

import Nav from "../components/Nav";
import SiteFooter from "../components/SiteFooter";
import SellFunnelClient from "./SellFunnelClient";

export const metadata = {
  title: "Sell Your House — Any Situation | Redpoint Home Solutions",
  description:
    "Inherited a house, facing foreclosure, going through a divorce, or stuck with a property you can't fix? Talk through your real options — including ones that don't involve selling to us. No pressure, no obligation, no fees.",
  keywords:
    "sell house fast Denver, sell inherited house Colorado, foreclosure help Denver, divorce house sale Colorado, cash home buyer Denver, sell house as-is Denver, we buy houses Denver",
  alternates: { canonical: "https://redpointhomesolutions.com/sell" },
  openGraph: {
    title: "Talk Through Your Options — Redpoint Home Solutions",
    description:
      "A calm, no-pressure way to think through what to do with a property. Get an honest read on your real options — even the ones that don't involve selling to us.",
    url: "https://redpointhomesolutions.com/sell",
    type: "website",
    locale: "en_US",
    siteName: "Redpoint Home Solutions",
  },
};

export default function SellPage() {
  return (
    <>
      <Nav />
      <main id="main-content">
        <section
          style={{
            paddingTop: 120,
            paddingBottom: 60,
            paddingLeft: 24,
            paddingRight: 24,
          }}
        >
          <div style={{ maxWidth: 1200, margin: "0 auto" }}>
            <div className="sell-grid">
              {/* Left: copy */}
              <div className="sell-copy">
                <span
                  style={{
                    display: "inline-block",
                    fontSize: "0.72rem",
                    fontWeight: 700,
                    letterSpacing: "0.16em",
                    textTransform: "uppercase",
                    color: "var(--warm)",
                    marginBottom: 20,
                  }}
                >
                  No pressure · No obligation · No fees
                </span>
                <h1
                  style={{
                    fontFamily: "'Playfair Display', serif",
                    fontSize: "clamp(2.1rem, 5vw, 3.4rem)",
                    fontWeight: 600,
                    lineHeight: 1.1,
                    letterSpacing: "-0.02em",
                    color: "var(--cream)",
                    margin: "0 0 22px",
                  }}
                >
                  Not sure what to do with the house? Let's think it through.
                </h1>
                <p
                  style={{
                    fontSize: "1.08rem",
                    lineHeight: 1.7,
                    color: "rgba(232,226,214,0.72)",
                    fontWeight: 300,
                    margin: "0 0 28px",
                    maxWidth: 520,
                  }}
                >
                  Inherited a place you don't know what to do with. Behind on payments. Going
                  through a divorce. A house that needs more work than you can put into it.
                  Whatever it is — talk it through with us and get an honest read on your real
                  options. Sometimes that's a cash sale. Sometimes it's something else entirely,
                  and we'll tell you when it is.
                </p>
                <ul
                  style={{
                    listStyle: "none",
                    padding: 0,
                    margin: 0,
                    display: "grid",
                    gap: 14,
                    maxWidth: 480,
                  }}
                >
                  {[
                    "We lay out every option — list, keep, rent, sell, or get help — not just the one that's good for us.",
                    "No dollar figures or pressure from a bot. A real person follows up only if you want them to.",
                    "Built for tough situations: probate, liens, code violations, tired rentals, hard timelines.",
                  ].map((t, i) => (
                    <li key={i} style={{ display: "flex", gap: 12, alignItems: "flex-start" }}>
                      <span
                        aria-hidden="true"
                        style={{
                          flexShrink: 0,
                          width: 8,
                          height: 8,
                          marginTop: 8,
                          borderRadius: "50%",
                          background: "var(--warm)",
                          opacity: 0.6,
                        }}
                      />
                      <span
                        style={{
                          fontSize: "0.95rem",
                          lineHeight: 1.6,
                          color: "rgba(232,226,214,0.7)",
                          fontWeight: 300,
                        }}
                      >
                        {t}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Right: the conversational funnel */}
              <div className="sell-widget">
                <SellFunnelClient />
              </div>
            </div>
          </div>
        </section>
      </main>
      <SiteFooter />

      <style>{`
        .sell-grid {
          display: grid;
          grid-template-columns: 1fr;
          gap: 40px;
          align-items: start;
        }
        @media (min-width: 960px) {
          .sell-grid {
            grid-template-columns: 1fr 1fr;
            gap: clamp(40px, 5vw, 72px);
            align-items: center;
          }
          .sell-copy { padding-top: 8px; }
        }
      `}</style>
    </>
  );
}
