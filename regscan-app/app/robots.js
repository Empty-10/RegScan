import { SITE_URL } from "@/lib/posts";

export default function robots() {
  return {
    rules: [{ userAgent: "*", allow: "/", disallow: ["/garage", "/check"] }],
    sitemap: `${SITE_URL}/sitemap.xml`,
    host: SITE_URL,
  };
}
