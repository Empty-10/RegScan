/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // WordPress used trailing slashes; preserve them so migrated URLs match exactly
  // (e.g. /how-long-is-an-mot-valid-for/<slug>/) and we don't trigger redirects.
  trailingSlash: true,
  images: {
    // Allow the existing WordPress media library to serve images during migration.
    remotePatterns: [{ protocol: "https", hostname: "www.regscan.co.uk" }],
  },
  async redirects() {
    return [
      // SEO: consolidate the "when is my MOT due" cannibalisation onto the pillar.
      {
        source: "/when-does-my-mot-run-out/when-does-my-mot-run-out/",
        destination: "/how-long-is-an-mot-valid-for/how-long-is-an-mot-valid-for-a-complete-guide/",
        permanent: true,
      },
      // SEO: the Vercel production alias serves a full duplicate of the site and
      // was polluting analytics. Send it to the canonical www domain. Hashed
      // preview deploys (reg-scan-<hash>.vercel.app) are unaffected.
      {
        source: "/:path*",
        has: [{ type: "host", value: "reg-scan.vercel.app" }],
        destination: "https://www.regscan.co.uk/:path*",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
