// @ts-nocheck
import Link from "next/link";
import Nav from "../components/Nav";
import SiteFooter from "../components/SiteFooter";

const SITE = {
  legalEntity: "Redpoint Consulting, LLC",
  displayName: "Redpoint Home Solutions",
  domain: "redpointhomesolutions.com",
  email: "matt@shepardconsulting.ai",
  address1: "1104 McIntosh Ave",
  cityStateZip: "Broomfield, CO 80020",
  phone: "(720) 738-7998",
  phoneTel: "+17207387998",
  lastUpdated: "May 28, 2026",
};

export const metadata = {
  title: `Disclaimers | ${SITE.displayName}`,
  description: `Important disclaimers regarding AI-generated content, real estate transactions, testimonials, and informational content on ${SITE.domain}.`,
  robots: { index: true, follow: true },
  alternates: { canonical: `https://${SITE.domain}/disclaimers` },
};

export default function Disclaimers() {
  return (
    <>
      <Nav />

      <div className="legal-page">
        <style>{`
          .legal-page { padding-top: 120px; }
          .legal-page .legal-container { max-width: 820px; margin: 0 auto; padding: 0 24px; }
          .legal-page .legal-header { padding: 24px 0 32px; border-bottom: 1px solid rgba(232,226,214,0.08); margin-bottom: 32px; }
          .legal-page .legal-header h1 { font-family: 'Playfair Display', serif; font-size: clamp(2rem, 4vw, 2.6rem); font-weight: 600; letter-spacing: -0.02em; color: var(--cream); margin: 0 0 10px; }
          .legal-page .legal-header p { color: rgba(232,226,214,0.5); font-size: 0.88rem; margin: 0; }
          .legal-page h2 { font-family: 'Playfair Display', serif; font-size: 1.3rem; font-weight: 600; letter-spacing: -0.01em; color: var(--cream); margin: 40px 0 14px; padding-bottom: 10px; border-bottom: 1px solid rgba(232,226,214,0.08); }
          .legal-page h2:first-of-type { margin-top: 0; }
          .legal-page p { color: rgba(232,226,214,0.72); font-size: 0.95rem; line-height: 1.8; margin: 0 0 14px; font-weight: 300; }
          .legal-page ul { list-style: none; margin: 0 0 14px; padding: 0; }
          .legal-page ul li { color: rgba(232,226,214,0.72); font-size: 0.95rem; line-height: 1.8; padding: 4px 0 4px 24px; position: relative; font-weight: 300; }
          .legal-page ul li::before { content: ''; position: absolute; left: 0; top: 16px; width: 8px; height: 8px; border-radius: 50%; background: var(--warm); opacity: 0.5; }
          .legal-page strong { color: var(--cream); font-weight: 600; }
          .legal-page a { color: var(--warm); text-decoration: underline; }
          .legal-page a:hover { opacity: 0.85; }
          .legal-page a:focus-visible { outline: 2px solid var(--warm); outline-offset: 2px; border-radius: 2px; }
        `}</style>

        <div className="legal-container">
          <div className="legal-header">
            <h1>Disclaimers</h1>
            <p>Last updated: {SITE.lastUpdated}</p>
          </div>
        </div>

        <main id="main-content">
          <div className="legal-container">

            <h2>General Informational Content</h2>
            <p>
              The information provided on {SITE.domain} is for general informational and educational purposes only. It is not intended to be and should not be construed as legal, financial, tax, accounting, investment, or real estate brokerage advice. Always seek the advice of a qualified licensed professional regarding your specific situation.
            </p>

            <h2>Not a Real Estate Broker; Cash Buyer / Wholesaler</h2>
            <p>
              <strong>{SITE.legalEntity} is not a licensed real estate broker or agent.</strong> We are a real estate investor that purchases properties directly and, in some cases, assigns purchase contracts to other investors. We do not represent buyers or sellers as their agent, and we owe no fiduciary duty to any counterparty. If you want a fiduciary representative, hire a licensed Colorado real estate broker.
            </p>
            <p>
              When we make an offer to purchase your property, we are doing so as the prospective buyer, not as your agent. Our interests are not aligned with yours &mdash; we are negotiating for the best terms for ourselves. You are encouraged to seek independent counsel before signing any agreement.
            </p>

            <h2>AI-Generated Content</h2>
            <p>
              Our Situation Assessment uses third-party generative AI systems to produce written recommendations based on your answers. Important limitations:
            </p>
            <ul>
              <li>AI output is produced by an automated system and is <strong>not individually reviewed by a human</strong> before being delivered to you.</li>
              <li>AI systems can produce confident-sounding output that is factually incorrect, outdated, incomplete, or not suited to your specific situation.</li>
              <li>AI recommendations about real estate options, timelines, and legal processes are generalized starting points, not bespoke professional guidance for your property.</li>
              <li>You are responsible for independently verifying any recommendation, cost estimate, or strategy before acting on it.</li>
              <li>{SITE.displayName} does not warrant the accuracy, completeness, timeliness, or fitness for any particular purpose of any AI-generated content.</li>
              <li>Do not submit confidential or sensitive third-party information through any AI-powered form on this site.</li>
            </ul>

            <h2>Testimonials, Case Studies, and Timelines</h2>
            <p>
              Any testimonials, case studies, transaction timelines, and offer amounts referenced on this site reflect specific historical transactions and are presented for illustrative purposes. <strong>They are not guarantees, promises, or predictions of the results you will achieve.</strong>
            </p>
            <p>Individual results depend on many factors outside of {SITE.displayName}&apos;s control:</p>
            <ul>
              <li>The specific condition, location, and characteristics of your property</li>
              <li>The state of the local real estate market at the time</li>
              <li>Title status, liens, and any encumbrances on the property</li>
              <li>Probate, divorce, or other legal proceedings affecting the property</li>
              <li>Your timeline, flexibility, and goals</li>
              <li>The choices you make about offers, counter-offers, and closing terms</li>
            </ul>

            <h2>Property Value Estimates</h2>
            <p>
              Any property value or repair cost estimates we provide or discuss are informal and reflect our internal analysis at a particular point in time. They are not a formal appraisal and should not be relied on as one. For a formal property valuation, retain a licensed Colorado appraiser.
            </p>

            <h2>&ldquo;Cash&rdquo; Offers</h2>
            <p>
              When we describe an offer as a &ldquo;cash offer,&rdquo; we mean that the purchase will not be contingent on the buyer obtaining mortgage financing from a third-party lender. Funds for the purchase may come from {SITE.displayName}&apos;s own capital, capital partners, private lenders, or transactional / hard-money lending sources. The closing process and timing of funds are governed by the executed purchase agreement.
            </p>

            <h2>Forward-Looking Statements</h2>
            <p>
              Some content on this site contains forward-looking statements about the real estate market, mortgage rates, property values, and transaction timelines. These are subject to risks, uncertainties, and changes in circumstances. Actual outcomes may differ materially.
            </p>

            <h2>Third-Party Tools, Platforms, and Links</h2>
            <p>
              Mention of a third-party product, service, title company, attorney, or lender is not an endorsement and does not imply a sponsorship, partnership, or affiliation unless explicitly stated. We are not responsible for the availability, content, pricing, data practices, or policies of any third-party service.
            </p>

            <h2>No Professional Relationship from Informational Content</h2>
            <p>
              Reading this site, subscribing to emails or SMS, downloading a resource, completing the Situation Assessment, or submitting a contact form does <strong>not</strong> create a brokerage, advisory, fiduciary, or any other professional relationship. A transactional relationship with {SITE.displayName} is established only through a separately executed written agreement signed by both parties.
            </p>

            <h2>No Warranty of Accuracy</h2>
            <p>
              Real estate law, tax law, mortgage rates, property condition, and market conditions change rapidly. We make no warranty that information on this site is complete, accurate, or up-to-date as of any particular moment. Verify any specific fact, number, or recommendation before relying on it.
            </p>

            <h2>Privacy, Data, and Terms</h2>
            <p>
              Your use of the Services is also governed by our <Link href="/privacy-policy">Privacy Policy</Link> and our <Link href="/terms">Terms of Service</Link>.
            </p>

            <h2>Contact</h2>
            <p>
              <strong>{SITE.legalEntity}</strong><br />
              {SITE.address1}<br />
              {SITE.cityStateZip}<br />
              Email: <a href={`mailto:${SITE.email}`}>{SITE.email}</a><br />
              Phone: <a href={`tel:${SITE.phoneTel}`}>{SITE.phone}</a>
            </p>

          </div>
        </main>

        <SiteFooter />
      </div>
    </>
  );
}
