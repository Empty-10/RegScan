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
};

export default nextConfig;
