// robots.txt for redpointhomesolutions.com (served at /robots.txt by Next.js)
export default function robots() {
  return {
    rules: [{ userAgent: "*", allow: "/", disallow: ["/api/"] }],
    sitemap: "https://redpointhomesolutions.com/sitemap.xml",
  };
}
