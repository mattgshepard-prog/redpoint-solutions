// @ts-nocheck
import Link from "next/link";
import Nav from "../components/Nav";
import SiteFooter from "../components/SiteFooter";

const SITE = {
  legalEntity: "Redpoint Consulting, LLC",
  displayName: "Redpoint Home Solutions",
  domain: "redpointhomesolutions.com",
  email: "mattgshepard@gmail.com",
  address1: "1104 McIntosh Ave",
  cityStateZip: "Broomfield, CO 80020",
  phone: "(720) 738-7998",
  phoneTel: "+17207387998",
  lastUpdated: "May 28, 2026",
};

export const metadata = {
  title: `Accessibility Statement | ${SITE.displayName}`,
  description: `${SITE.displayName} is committed to digital accessibility. We conform to WCAG 2.1 Level AA and provide accessible alternatives on request.`,
  robots: { index: true, follow: true },
  alternates: { canonical: `https://${SITE.domain}/accessibility` },
};

export default function Accessibility() {
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
          .legal-page code { background: rgba(196,149,106,0.08); padding: 1px 6px; border-radius: 4px; font-size: 0.85rem; color: var(--warm); }
        `}</style>

        <div className="legal-container">
          <div className="legal-header">
            <h1>Accessibility Statement</h1>
            <p>Last updated: {SITE.lastUpdated}</p>
          </div>
        </div>

        <main id="main-content">
          <div className="legal-container">

            <h2>Our Commitment</h2>
            <p>
              {SITE.legalEntity} is committed to ensuring digital accessibility for people with disabilities. We are continuously improving the user experience for everyone and applying relevant accessibility standards to {SITE.domain} and our related digital products.
            </p>

            <h2>Conformance Standard</h2>
            <p>
              We aim to conform to the{' '}
              <a href="https://www.w3.org/WAI/WCAG21/quickref/" target="_blank" rel="noopener noreferrer">
                Web Content Accessibility Guidelines (WCAG) 2.1 Level AA
              </a>
              . These guidelines explain how to make web content more accessible for people with a wide array of disabilities.
            </p>

            <h2>Measures We Take</h2>
            <ul>
              <li>Semantic HTML structure with proper heading hierarchy, landmarks, and ARIA labels</li>
              <li>Keyboard navigation support across interactive elements</li>
              <li>Visible focus indicators for keyboard users</li>
              <li>A &ldquo;skip to main content&rdquo; link at the top of each page</li>
              <li>Color contrast ratios that meet or exceed WCAG 2.1 AA thresholds</li>
              <li>Alt text on meaningful images and ARIA labels on icon-only controls</li>
              <li>Form fields with explicit labels and error messaging</li>
              <li>Responsive design that works at zoom levels up to 200% and across screen sizes</li>
              <li>Respect for <code>prefers-reduced-motion</code> system settings</li>
              <li>Regular review of new content and features for accessibility impact</li>
            </ul>

            <h2>Known Limitations</h2>
            <p>Despite our efforts, some parts of our site may not yet be fully accessible:</p>
            <ul>
              <li>Some third-party embedded content (analytics, video players) may not fully meet our standards; we are working with vendors to address this.</li>
              <li>AI-generated Situation Assessment output is plain text and not visually styled; it is readable by screen readers but may benefit from additional structure we are developing.</li>
            </ul>
            <p>
              If you encounter an accessibility barrier not listed above, please let us know &mdash; we treat each report as an opportunity to improve.
            </p>

            <h2>Alternative Formats and Assistance</h2>
            <p>
              If you need information from this site in an alternative format (large print, plain text email, an accessible document, or read aloud by phone) we are happy to provide it. We aim to respond within two business days and provide the requested format within five business days where reasonably possible.
            </p>

            <h2>Contact Us About Accessibility</h2>
            <p>
              <strong>{SITE.legalEntity} &mdash; Accessibility Coordinator</strong><br />
              Email:{' '}
              <a href={`mailto:${SITE.email}?subject=Accessibility%20Feedback`}>{SITE.email}</a><br />
              Phone: <a href={`tel:${SITE.phoneTel}`}>{SITE.phone}</a><br />
              Mail: {SITE.address1}, {SITE.cityStateZip}
            </p>
            <p>
              When contacting us, please describe the specific page or feature you had difficulty with, the assistive technology you were using (if any), and any error messages you encountered.
            </p>

            <h2>Enforcement</h2>
            <p>
              We are committed to resolving accessibility issues promptly. If you are not satisfied with our response to an accessibility concern, you may also contact the U.S. Department of Justice Civil Rights Division, which enforces the Americans with Disabilities Act (ADA).
            </p>

            <h2>Ongoing Effort</h2>
            <p>
              Accessibility is not a one-time task &mdash; it is an ongoing commitment. We review our site regularly, train our team on accessibility best practices, and incorporate accessibility considerations into every new page and feature we build.
            </p>

          </div>
        </main>

        <SiteFooter />
      </div>
    </>
  );
}
