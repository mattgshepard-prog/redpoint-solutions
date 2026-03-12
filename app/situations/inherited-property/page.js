// @ts-nocheck
import SituationLayout from "../../components/SituationLayout";

export const metadata = {
  title: "Inherited a House in Colorado? Here Are Your Real Options | Redpoint Solutions",
  description: "You inherited a property and don't know what to do. We explain probate, your options for selling, and how to handle shared ownership — all specific to Colorado law.",
};

export default function InheritedPropertyPage() {
  return (
    <SituationLayout
      icon="🏠"
      title="You inherited a property."
      subtitle="You didn't ask for this. Here's everything you need to know about what happens next — and what your real options are."
      color="#4A7C6F"
      formSituation="Inherited Property"
    >
      <h2>First things first: you're not alone</h2>
      <p>
        Every year, thousands of Colorado families inherit property they didn't plan for. Maybe it's your parents' house. Maybe it's a relative's place across town — or across the country. Either way, you're now responsible for a property that comes with a mortgage, taxes, insurance, and maintenance.
      </p>
      <p>
        It's overwhelming, especially when you're grieving. Take a breath. You have time, and you have options.
      </p>

      <h2>Understanding probate in Colorado</h2>
      <p>
        Before you can sell an inherited property, it typically needs to go through probate — the legal process of transferring ownership from the deceased to the heirs. Here's what that looks like in Colorado:
      </p>
      <ul>
        <li><strong>If there's a will:</strong> The named executor files with the county court. Colorado has a simplified "informal probate" process that's faster than most states — often 6-8 weeks.</li>
        <li><strong>If there's no will:</strong> Colorado intestacy laws determine who inherits. A personal representative is appointed by the court. This can take 3-6 months.</li>
        <li><strong>Small estates:</strong> If the property and total estate are valued under $80,000, you may qualify for a simplified affidavit process that skips formal probate entirely.</li>
        <li><strong>Transfer on Death Deed:</strong> If the owner filed a TOD deed (increasingly common in Colorado), the property transfers automatically without probate.</li>
      </ul>

      <div className="callout">
        <p><strong>Pro tip:</strong> Don't wait for probate to finish before reaching out to us. We can make you an offer contingent on probate completion, which gives you a plan and timeline while the legal process plays out.</p>
      </div>

      <h2>Your real options</h2>
      <p>We're going to be straight with you — selling to us is one option, but it's not the only one. Here are all your choices:</p>

      <h3>Option 1: Keep the property</h3>
      <p>
        If the house is in good shape and in a location that makes sense, you could move in or rent it out. Consider the carrying costs: mortgage payments, property taxes (Denver metro averages 0.5-0.7% of assessed value), insurance, and maintenance. If there are multiple heirs, everyone needs to agree.
      </p>

      <h3>Option 2: List it with a realtor</h3>
      <p>
        If the house is in sellable condition and you have time to wait, a traditional listing will likely get you the highest price. Expect 5-6% in commissions, possible repair negotiations with buyers, and 60-90 days on market in current conditions. This works well if the house doesn't need major work.
      </p>

      <h3>Option 3: Sell it to us</h3>
      <p>
        This is where we come in — and where we're different from other cash buyers. Because we're backed by a licensed general contractor (Onsight Construction), we know exactly what a house needs. We don't guess at repair costs, which means we can often offer more than other investors.
      </p>
      <p>
        We handle everything: closing costs, cleanouts, repairs, title issues. You pick the closing date. And if you're dealing with multiple heirs, we have experience navigating those conversations.
      </p>

      <h3>Option 4: Do nothing (for now)</h3>
      <p>
        You don't have to make a decision today. But know that carrying costs add up, and vacant homes deteriorate. At minimum, make sure the property is insured, the utilities are managed (especially in Colorado winters), and someone is checking on it periodically.
      </p>

      <h2>Common complications we've seen</h2>
      <ul>
        <li><strong>Multiple heirs who disagree:</strong> One sibling wants to sell, another wants to keep it. We've helped families navigate this more times than we can count.</li>
        <li><strong>Out-of-state property:</strong> You're in Denver but the house is in Pueblo. We buy throughout Colorado and can handle everything remotely.</li>
        <li><strong>Deferred maintenance:</strong> Mom stopped maintaining the house years ago. The roof leaks, the furnace is shot, there's stuff in every room. We buy as-is — truly as-is.</li>
        <li><strong>Title issues:</strong> The deed is still in your grandfather's name from 1987. We work with title companies that specialize in clearing these complications.</li>
        <li><strong>Existing mortgage:</strong> There's still a balance owed. We'll help you understand if there's equity and what your net proceeds would be.</li>
      </ul>

      <h2>What happens when you call us</h2>
      <p>
        Here's exactly what to expect — no surprises:
      </p>
      <ul>
        <li><strong>A conversation, not a pitch.</strong> We ask about your situation, the property, and your timeline. We answer every question you have.</li>
        <li><strong>A property assessment.</strong> We look at the house (in person or virtually) and assess what it needs. Because we're contractors, this takes us about 30 minutes, not guesswork.</li>
        <li><strong>A transparent offer.</strong> We show you exactly how we calculated our number — the after-repair value, the repair costs, and our margin. No hidden math.</li>
        <li><strong>Your choice.</strong> You say yes, you say no, you think about it. Zero pressure. We mean it.</li>
      </ul>
    </SituationLayout>
  );
}
