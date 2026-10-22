// Sitemap for redpointhomesolutions.com (served at /sitemap.xml by Next.js)
const BASE = "https://redpointhomesolutions.com";

export default function sitemap() {
  const now = new Date();
  const pages = [
    ["/", 1.0, "weekly"],
    ["/private-sale", 0.9, "monthly"],
    ["/about", 0.7, "monthly"],
    ["/contact", 0.7, "monthly"],
    ["/sell", 0.6, "monthly"],
    ["/situations/inherited-property", 0.8, "monthly"],
    ["/situations/divorce", 0.8, "monthly"],
    ["/situations/tax-liens", 0.8, "monthly"],
    ["/situations/code-violations", 0.8, "monthly"],
    ["/situations/forced-move", 0.8, "monthly"],
    ["/privacy-policy", 0.2, "yearly"],
    ["/terms", 0.2, "yearly"],
    ["/disclaimers", 0.2, "yearly"],
    ["/accessibility", 0.2, "yearly"],
  ];
  return pages.map(([path, priority, changeFrequency]) => ({
    url: `${BASE}${path}`,
    lastModified: now,
    changeFrequency,
    priority,
  }));
}
