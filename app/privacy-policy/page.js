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
  lastUpdated: "May 28, 2026",
};

export const metadata = {
  title: `Privacy Policy | ${SITE.displayName}`,
  description: `Privacy Policy for ${SITE.legalEntity} and ${SITE.domain}, including how we collect, use, and protect personal information and phone numbers.`,
  robots: { index: true, follow: true },
  alternates: { canonical: `https://${SITE.domain}/privacy-policy` },
};

export default function PrivacyPolicy() {
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
            <h1>Privacy Policy</h1>
            <p>Last updated: {SITE.lastUpdated}</p>
          </div>
        </div>

        <main id="main-content">
          <div className="legal-container">

            <h2>Introduction</h2>
            <p>
              {SITE.legalEntity} (&ldquo;we,&rdquo; &ldquo;us,&rdquo; or &ldquo;our&rdquo;), doing business as {SITE.displayName}, operates the website
              {' '}{SITE.domain} and related services (collectively, the &ldquo;Services&rdquo;). This Privacy Policy
              explains how we collect, use, disclose, and safeguard your information when you use our Services.
            </p>

            <h2>Information We Collect</h2>
            <ul>
              <li><strong>Personal Information:</strong> Name, email, phone number, mailing address, and details about your property or investment interests when voluntarily provided through our forms or direct communication.</li>
              <li><strong>Property and Situation Information:</strong> Information you share about your property, ownership situation, timeline, and goals through our contact forms and Situation Assessment.</li>
              <li><strong>Usage Data:</strong> Information about how you interact with our Services, including pages visited, features used, and session duration.</li>
              <li><strong>Device Information:</strong> Browser type, operating system, IP address, and device identifiers collected automatically.</li>
            </ul>

            <h2>How We Use Your Information</h2>
            <ul>
              <li>Respond to inquiries and provide requested information about selling your property or about wholesale investment opportunities</li>
              <li>Deliver AI-generated Situation Assessments and follow-up materials</li>
              <li>Communicate with you about your specific request or transaction, including by phone, SMS, and email where you have provided consent</li>
              <li>Send opted-in subscribers notifications about new off-market wholesale deals</li>
              <li>Improve and maintain our Services</li>
              <li>Comply with legal obligations and enforce our Terms</li>
            </ul>

            <h2>SMS / Text Message Communications</h2>
            <p>
              We collect phone numbers through forms on this website and use them to communicate with you by phone and SMS where you have provided consent. We operate two distinct SMS use cases, and consent for one is not consent for the other:
            </p>
            <ul>
              <li><strong>Property Owner Communications.</strong> When a homeowner provides a phone number through the &ldquo;Contact&rdquo; form, Situation Assessment, or any other property-related inquiry on this site, the homeowner consents to receive follow-up calls and SMS messages from {SITE.displayName} regarding their property and selling options. These are typically one-to-one conversational messages from our team about a specific property situation.</li>
              <li><strong>Investor / Buyer Deal Notifications.</strong> Cash buyers and real estate investors who opt in through our investor signup form consent to receive SMS notifications from {SITE.displayName} about new off-market wholesale property deals matching their stated criteria. These are list-based marketing messages with variable frequency.</li>
            </ul>
            <p>
              <strong>For both use cases:</strong> Message and data rates may apply. Message frequency varies. You can opt out at any time by replying STOP to any message we send you. Reply HELP for assistance, or contact us at <a href={`mailto:${SITE.email}`}>{SITE.email}</a>. Opting out of one program does not opt you out of the other &mdash; reply STOP to each program separately, or contact us to be removed from all SMS communications.
            </p>
            <p>
              <strong>We do not share, sell, or rent your phone number or SMS opt-in data with any third party for their marketing purposes.</strong> Phone numbers and SMS consent data are used only by {SITE.legalEntity} and our service providers (such as our SMS delivery platform) strictly to deliver the communications you have consented to receive.
            </p>

            <h2>Data Sharing &amp; Disclosure</h2>
            <p>We do not sell your personal information. We may share information with:</p>
            <ul>
              <li><strong>Service Providers:</strong> Trusted vendors who assist in operating our Services (hosting, email delivery, SMS delivery, analytics, AI model providers), bound by confidentiality obligations and only authorized to use your information to provide their services to us.</li>
              <li><strong>Closing Professionals:</strong> If you and {SITE.displayName} reach an agreement to transact on a property, your contact and property information may be shared with the title company, escrow agent, attorneys, and other closing professionals needed to complete the transaction.</li>
              <li><strong>Legal Requirements:</strong> When required by law, subpoena, or legal process.</li>
              <li><strong>Business Transfers:</strong> In connection with a merger, acquisition, or sale of assets.</li>
              <li><strong>With Your Consent:</strong> When you explicitly authorize sharing.</li>
            </ul>

            <h2>AI Processing</h2>
            <p>
              Our Situation Assessment uses third-party AI systems (currently models provided by Google) to generate informational output based on your answers. Information you submit through the assessment is sent to the AI provider strictly to generate the requested output and is not used by them to train their public models. AI output is informational only &mdash; see our <Link href="/disclaimers">Disclaimers</Link> for important limitations.
            </p>

            <h2>Data Retention</h2>
            <p>
              We retain personal information only as long as necessary to provide our Services, complete transactions, fulfill the purposes described in this policy, or as required by law (including real estate transaction records, which Colorado law requires us to retain).
            </p>

            <h2>Data Security</h2>
            <p>
              We implement industry-standard security measures including encryption in transit (TLS/SSL), encrypted storage where applicable, and access controls. No method of electronic transmission or storage is 100% secure, and we cannot guarantee absolute security.
            </p>

            <h2>Your Rights</h2>
            <ul>
              <li>Access the personal information we hold about you</li>
              <li>Request correction of inaccurate information</li>
              <li>Request deletion of your personal information, subject to legal retention requirements</li>
              <li>Opt out of marketing communications at any time (reply STOP to SMS, click unsubscribe in emails, or contact us)</li>
              <li>Request a copy of your data in a portable format</li>
            </ul>

            <h2>Data Deletion</h2>
            <p>
              To request deletion, email us at <a href={`mailto:${SITE.email}`}>{SITE.email}</a> with the subject line &ldquo;Data Deletion Request.&rdquo; We will process your request within 30 days, subject to any legal retention requirements (for example, records of a completed real estate transaction must be retained for the period required by Colorado law).
            </p>

            <h2>Cookies &amp; Tracking</h2>
            <p>
              Our website may use cookies and similar technologies to enhance your browsing experience and analyze site traffic. You can control cookie preferences through your browser settings.
            </p>

            <h2>Children&apos;s Privacy</h2>
            <p>
              Our Services are not intended for individuals under 18. We do not knowingly collect personal information from children. If we learn we have, we will delete it promptly.
            </p>

            <h2>Changes to This Policy</h2>
            <p>
              We may update this Privacy Policy from time to time. Changes will be posted on this page with an updated &ldquo;Last updated&rdquo; date.
            </p>

            <h2>Contact Us</h2>
            <p>
              <strong>{SITE.legalEntity}</strong><br />
              {SITE.address1}<br />
              {SITE.cityStateZip}<br />
              Email: <a href={`mailto:${SITE.email}`}>{SITE.email}</a><br />
              Phone: {SITE.phone}
            </p>

          </div>
        </main>

        <SiteFooter />
      </div>
    </>
  );
}
