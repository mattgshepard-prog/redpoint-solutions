// @ts-nocheck
import Nav from "../components/Nav";
import SiteFooter from "../components/SiteFooter";
import FadeIn from "../components/FadeIn";
import Link from "next/link";

export const metadata = {
  title: "Sell Your Home Privately in Broomfield | Redpoint Home Solutions",
  description:
    "A private sale for Broomfield homeowners who are open to the right offer. No sign in the yard, no showings, no repairs, and you choose the closing date.",
  alternates: { canonical: "https://redpointhomesolutions.com/private-sale" },
};

const EMAIL = "mattgshepard@gmail.com";

const card = {
  background: "rgba(196,149,106,0.05)",
  border: "1px solid rgba(196,149,106,0.12)",
  borderRadius: 14,
  padding: "22px 24px",
};

export default function PrivateSalePage() {
  return (
    <>
      <Nav />

      <section style={{ maxWidth: 800, margin: "0 auto", padding: "140px 24px 40px" }}>
        <FadeIn>
          <p style={{ color: "var(--warm)", fontSize: "0.75rem", fontWeight: 600, letterSpacing: "0.12em", textTransform: "uppercase", margin: "0 0 16px" }}>
            Private sale
          </p>
          <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: "clamp(2rem, 4vw, 3rem)", fontWeight: 600, lineHeight: 1.15, letterSpacing: "-0.02em", margin: "0 0 20px" }}>
            Sell your home privately,{" "}
            <span style={{ color: "var(--warm)", fontStyle: "italic" }}>on your own timeline.</span>
          </h1>
          <p style={{ fontSize: "1.1rem", lineHeight: 1.75, color: "rgba(232,226,214,0.75)", fontWeight: 300, margin: 0, maxWidth: 640 }}>
            Some homes rarely come up for sale. When they do, the owner usually didn&rsquo;t need to sell. They were simply open to the right offer.
            If you heard from us about your home, that&rsquo;s why. Nothing is wrong with your house. We&rsquo;d like to buy it.
          </p>
        </FadeIn>
      </section>

      <section style={{ maxWidth: 800, margin: "0 auto", padding: "0 24px 24px" }}>
        <FadeIn delay={0.05}>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(170px, 1fr))", gap: 14 }}>
            {[
              ["No sign in the yard", "Your neighbors won’t know unless you tell them."],
              ["No showings", "No strangers walking through, no keeping the house staged."],
              ["No repairs", "We buy the home as it is today."],
              ["Your closing date", "Next month or next summer. You pick it."],
            ].map(([t, d]) => (
              <div key={t} style={card}>
                <p style={{ fontFamily: "'Playfair Display', serif", fontSize: "1.05rem", fontWeight: 600, color: "var(--cream)", margin: "0 0 6px" }}>{t}</p>
                <p style={{ fontSize: "0.88rem", lineHeight: 1.6, color: "rgba(232,226,214,0.6)", margin: 0 }}>{d}</p>
              </div>
            ))}
          </div>
        </FadeIn>
      </section>

      <section style={{ maxWidth: 800, margin: "0 auto", padding: "24px 24px 40px" }}>
        <FadeIn delay={0.1}>
          <div className="situation-content">
            <h2>How it works</h2>
            <p><strong>1. You reply.</strong> A short email is all it takes. Tell us a little about the home and what you&rsquo;d want from a sale. There&rsquo;s no obligation, and a &ldquo;not right now&rdquo; is a perfectly good answer.</p>
            <p><strong>2. We take a look.</strong> One visit, at a time that suits you. We&rsquo;re builders, so we know what a home is worth and what it would take to bring it to its best, without guessing.</p>
            <p><strong>3. You get a written offer.</strong> A clear number and plain terms, in writing. Take whatever time you need, and talk it over with anyone you like, including your own attorney or agent.</p>
            <p><strong>4. You choose the date.</strong> If the offer works for you, we close through a Colorado title company on the date you pick. If it doesn&rsquo;t, we part as neighbors.</p>

            <h2>Who we are</h2>
            <p>
              Redpoint Home Solutions is the brand of Redpoint Consulting, LLC, based in Broomfield. We work alongside Onsight Construction LLC, a licensed general contractor, and we live here too.
              We are not real estate agents and we don&rsquo;t charge commissions. We buy homes directly.
            </p>

            <h2>Straight answers</h2>
            <p><strong>Will you buy the home yourselves?</strong> We buy as the purchaser on the contract. In some cases we may assign that purchase contract to another buyer before closing, for example a buyer looking for exactly your kind of home. If that could happen with your home, we&rsquo;ll tell you in writing before you sign anything, and your price and terms don&rsquo;t change.</p>
            <p><strong>Is this a low offer because you think I have to sell?</strong> No. We contact owners of homes that are in demand and rarely for sale. You don&rsquo;t have to sell, and the offer has to make sense to you or it doesn&rsquo;t happen.</p>
            <p><strong>Do I need an agent?</strong> You&rsquo;re welcome to have one, or an attorney, review anything we send. Many owners do.</p>
            <p><strong>What if I&rsquo;d rather not hear from you again?</strong> Reply &ldquo;remove&rdquo; to any email and you won&rsquo;t.</p>
          </div>
        </FadeIn>

        <FadeIn delay={0.15}>
          <div style={{ ...card, marginTop: 36, padding: "30px 28px" }}>
            <p style={{ fontFamily: "'Playfair Display', serif", fontSize: "1.3rem", fontWeight: 600, color: "var(--cream)", margin: "0 0 10px" }}>
              Open to a conversation?
            </p>
            <p style={{ fontSize: "0.95rem", lineHeight: 1.7, color: "rgba(232,226,214,0.65)", margin: "0 0 20px" }}>
              Email is the best and fastest way to reach me. If you received a note from me about your home, just reply to it.
            </p>
            <a
              href={`mailto:${EMAIL}?subject=Private%20sale`}
              style={{
                display: "inline-block",
                background: "linear-gradient(135deg, var(--warm), var(--warm-dark))",
                color: "var(--bg)",
                padding: "14px 30px",
                borderRadius: 10,
                textDecoration: "none",
                fontWeight: 600,
                fontSize: "0.95rem",
              }}
            >
              Email Matt Shepard
            </a>
            <p style={{ fontSize: "0.8rem", color: "rgba(232,226,214,0.45)", margin: "14px 0 0" }}>{EMAIL}</p>
          </div>
        </FadeIn>
      </section>

      <SiteFooter />
    </>
  );
}
