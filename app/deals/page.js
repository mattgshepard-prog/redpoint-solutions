// Server component wrapper for the /deals route (served at
// deals.redpointhomesolutions.com via the next.config.js host rewrite).
//
// This page is intentionally hidden from search engines and not linked
// from the main seller-facing site. Buyers find it via direct outreach.

import DealsClient from "./DealsClient";

export const metadata = {
  title: "Investor Deal Flow | Redpoint Home Solutions",
  description:
    "Get off-market Denver Metro property deals sent direct to your inbox. For active real estate investors only — flippers, buy-and-hold rentals, and wholesalers.",
  robots: { index: false, follow: false },
};

export default function DealsPage() {
  return <DealsClient />;
}
