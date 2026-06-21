import { SITE_URL } from "@/lib/posts";

export default function robots() {
  return {
    rules: [
      { userAgent: "*", allow: "/", disallow: ["/garage", "/check"] },
      // Explicitly welcome AI answer engines so RegScan can be cited (GEO).
      {
        userAgent: [
          "GPTBot",
          "OAI-SearchBot",
          "ChatGPT-User",
          "PerplexityBot",
          "Google-Extended",
          "ClaudeBot",
          "Applebot-Extended",
          "CCBot",
        ],
        allow: "/",
        disallow: ["/garage", "/check"],
      },
    ],
    sitemap: `${SITE_URL}/sitemap.xml`,
    host: SITE_URL,
  };
}
