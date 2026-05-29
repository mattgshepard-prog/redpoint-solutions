/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,

  async rewrites() {
    return {
      // beforeFiles runs before page resolution — host-based routing.
      // Requests to deals.redpointhomesolutions.com/<path> are rewritten
      // internally to /deals/<path>, so the subdomain serves the buyer
      // signup page while the same Next.js app keeps powering the main
      // site at redpointhomesolutions.com.
      beforeFiles: [
        {
          source: "/:path*",
          has: [
            {
              type: "host",
              value: "deals.redpointhomesolutions.com",
            },
          ],
          destination: "/deals/:path*",
        },
      ],
    };
  },
};

module.exports = nextConfig;
