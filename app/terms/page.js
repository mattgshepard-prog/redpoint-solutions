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
  governingState: "Colorado",
  venueCounty: "Broomfield County or the City and County of Denver, Colorado",
  liabilityCap: "ONE HUNDRED U.S. DOLLARS (US$100)",
  lastUpdated: "May 28, 2026",
};

export const metadata = {
  title: `Terms of Service | ${SITE.displayName}`,
  description: `Terms of Service for ${SITE.legalEntity} and ${SITE.domain}.`,
  robots: { index: true, follow: true },
  alternates: { canonical: `https://${SITE.domain}/terms` },
};

export default function Terms() {
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
            <h1>Terms of Service</h1>
            <p>Last updated: {SITE.lastUpdated}</p>
          </div>
        </div>

        <main id="main-content">
          <div className="legal-container">

            <h2>1. Agreement to Terms</h2>
            <p>
              These Terms of Service (&ldquo;Terms&rdquo;) govern your access to and use of the website {SITE.domain} and any related applications, tools, assessments, or services (collectively, the &ldquo;Services&rdquo;) operated by {SITE.legalEntity} (&ldquo;we,&rdquo; &ldquo;us,&rdquo; or &ldquo;our&rdquo;), doing business as {SITE.displayName}. By accessing or using the Services, you agree to be bound by these Terms and our <Link href="/privacy-policy">Privacy Policy</Link>. If you do not agree, do not use the Services.
            </p>

            <h2>2. Description of Services</h2>
            <p>
              {SITE.displayName} provides informational content, an AI-powered Situation Assessment, contact forms, and a real estate acquisitions and dispositions service. The Services include but are not limited to the website, blog posts, AI-powered assessments, contact forms, opt-in buyer notification programs, and any purchase agreements, assignment agreements, or other transactional documents executed separately between {SITE.legalEntity} and a counterparty.
            </p>

            <h2>3. Not Legal, Financial, Tax, or Real Estate Brokerage Advice</h2>
            <p>
              <strong>{SITE.displayName} is not a law firm, accounting firm, tax advisor, financial advisor, or licensed real estate broker.</strong> Content on this site is provided for informational and educational purposes only. It does not constitute legal, financial, tax, accounting, investment, or real estate brokerage advice, and should not be relied upon as a substitute for consultation with a qualified licensed professional in your jurisdiction.
            </p>
            <p>
              No attorney-client, broker-client, fiduciary, or other professional relationship is created by your use of the Services, by submitting a contact form or assessment, or by receiving informational materials from us. A transactional relationship with {SITE.displayName} is established only through a separately executed written agreement (such as a purchase agreement or assignment) signed by both parties.
            </p>

            <h2>4. AI-Generated Content</h2>
            <p>
              Our Situation Assessment is powered by third-party artificial-intelligence systems. You acknowledge and agree that:
            </p>
            <ul>
              <li>AI-generated output is produced by automated systems and is not reviewed line-by-line by a human before delivery.</li>
              <li>AI output may contain factual inaccuracies, outdated information, fabricated details, or recommendations not appropriate for your specific situation.</li>
              <li>You are solely responsible for independently verifying any AI-generated recommendation before acting on it.</li>
              <li>AI output is informational only and does not constitute professional advice of any kind.</li>
              <li>{SITE.displayName} does not guarantee the accuracy, completeness, timeliness, or fitness for any particular purpose of any AI-generated content.</li>
            </ul>

            <h2>5. Acceptable Use</h2>
            <p>You agree not to use the Services to:</p>
            <ul>
              <li>Violate any applicable law, regulation, or third-party right</li>
              <li>Submit false, misleading, or fraudulent information through any form</li>
              <li>Reverse-engineer, scrape, or attempt to extract source code or training data from our Services or integrated AI systems</li>
              <li>Use automated systems to access the Services without written permission</li>
              <li>Interfere with, disrupt, or attempt to gain unauthorized access to any portion of the Services</li>
              <li>Transmit malware, viruses, or other harmful code</li>
              <li>Impersonate any person or entity or misrepresent your affiliation</li>
              <li>Use the Services to send unsolicited marketing messages, spam, or harassment</li>
            </ul>

            <h2>6. Intellectual Property</h2>
            <p>
              All content on the Services is the property of {SITE.legalEntity} or its licensors and is protected by United States and international copyright, trademark, and other intellectual property laws. You may view and download content for personal, non-commercial use only. Any other use requires our prior written consent.
            </p>

            <h2>7. User Submissions</h2>
            <p>
              When you submit information through contact forms, assessments, or other interactive features, you represent that the information is accurate and that you have the right to submit it. You grant {SITE.displayName} a non-exclusive, royalty-free, worldwide license to use, reproduce, and process the information for the purpose of operating the Services and responding to your inquiry, consistent with our <Link href="/privacy-policy">Privacy Policy</Link>.
            </p>

            <h2>8. SMS Program Terms</h2>
            <p>
              If you opt in to receive SMS messages from {SITE.displayName} (whether as a property owner or as an investor receiving deal notifications), the following terms apply. Message and data rates may apply. Message frequency varies. You can opt out at any time by replying STOP to any message. Reply HELP for assistance. Carriers are not liable for delayed or undelivered messages. For full details about how we handle phone numbers and SMS consent, see the SMS section of our <Link href="/privacy-policy">Privacy Policy</Link>.
            </p>

            <h2>9. Real Estate Transactions</h2>
            <p>
              Any purchase, assignment, or other real estate transaction between you and {SITE.legalEntity} will be governed by a separately executed written agreement signed by both parties. In the event of a conflict between these Terms and such a transaction agreement, the signed transaction agreement controls with respect to that specific transaction. Nothing on this website constitutes a binding offer to purchase or sell real estate &mdash; an offer is made only through a signed written purchase or assignment agreement.
            </p>

            <h2>10. Third-Party Services and Links</h2>
            <p>
              The Services may contain links to third-party websites, tools, or services (including title companies, closing attorneys, and real estate platforms). We do not control and are not responsible for the content, privacy practices, or terms of any third-party service. Your use of third-party services is governed by their own terms.
            </p>

            <h2>11. No Warranties</h2>
            <p>
              THE SERVICES ARE PROVIDED ON AN &ldquo;AS IS&rdquo; AND &ldquo;AS AVAILABLE&rdquo; BASIS. TO THE FULLEST EXTENT PERMITTED BY LAW, {SITE.displayName.toUpperCase()} DISCLAIMS ALL WARRANTIES, EXPRESS OR IMPLIED, INCLUDING WITHOUT LIMITATION WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE, NON-INFRINGEMENT, ACCURACY, AND UNINTERRUPTED OPERATION.
            </p>

            <h2>12. Limitation of Liability</h2>
            <p>
              TO THE FULLEST EXTENT PERMITTED BY LAW, {SITE.legalEntity.toUpperCase()} AND ITS OFFICERS, EMPLOYEES, CONTRACTORS, AND AGENTS SHALL NOT BE LIABLE FOR ANY INDIRECT, INCIDENTAL, SPECIAL, CONSEQUENTIAL, OR PUNITIVE DAMAGES ARISING OUT OF OR RELATED TO YOUR USE OF THE SERVICES.
            </p>
            <p>
              OUR TOTAL CUMULATIVE LIABILITY FOR ALL CLAIMS ARISING OUT OF OR RELATED TO THE SERVICES OR THESE TERMS SHALL NOT EXCEED {SITE.liabilityCap}. This limitation does not apply to liability under a separately executed real estate purchase or assignment agreement, which is governed by its own terms.
            </p>

            <h2>13. Indemnification</h2>
            <p>
              You agree to indemnify, defend, and hold harmless {SITE.legalEntity} and its officers, employees, contractors, and agents from any claims, damages, losses, liabilities, and expenses (including reasonable attorneys&apos; fees) arising from (a) your use of the Services, (b) your violation of these Terms, (c) your violation of any third-party right, or (d) any content or information you submit through the Services.
            </p>

            <h2>14. Governing Law and Dispute Resolution</h2>
            <p>
              These Terms are governed by the laws of the State of {SITE.governingState}, without regard to conflict-of-law principles. Any dispute arising out of or relating to these Terms or the Services shall be resolved exclusively in the state or federal courts located in {SITE.venueCounty}, and you consent to personal jurisdiction in those courts.
            </p>

            <h2>15. Changes to These Terms</h2>
            <p>
              We may update these Terms from time to time. Changes will be posted on this page with an updated &ldquo;Last updated&rdquo; date. Your continued use of the Services after changes are posted constitutes acceptance of the updated Terms.
            </p>

            <h2>16. Termination</h2>
            <p>
              We may suspend or terminate your access to the Services at any time, with or without cause or notice, including for any suspected violation of these Terms.
            </p>

            <h2>17. Contact</h2>
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
