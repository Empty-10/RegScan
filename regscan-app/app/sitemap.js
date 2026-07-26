import { getAllPosts, getCategories, SITE_URL } from "@/lib/posts";

// Coerce any stored date (some WP-imported posts lack a timezone, e.g.
// "2024-12-08T17:52:12") into a valid W3C datetime Google will accept.
// Returns undefined for unparseable dates so <lastmod> is simply omitted.
function toValidDate(value) {
  if (!value) return undefined;
  const d = new Date(value);
  return Number.isNaN(d.getTime()) ? undefined : d;
}

// Generates /sitemap.xml from the migrated content + key static pages.
export default function sitemap() {
  const posts = getAllPosts();
  const categories = getCategories();

  const staticUrls = ["/", "/blog/", "/car-history/", "/car-details/"].map((p) => ({
    url: `${SITE_URL}${p}`,
    changeFrequency: "weekly",
    priority: p === "/" ? 1 : 0.7,
  }));

  const infoUrls = [
    "/about/",
    "/contact/",
    "/privacy-policy/",
    "/cookie-policy/",
    "/terms-of-use/",
  ].map((p) => ({
    url: `${SITE_URL}${p}`,
    changeFrequency: "yearly",
    priority: 0.3,
  }));

  const categoryUrls = categories.map((c) => ({
    url: `${SITE_URL}/category/${c.slug}/`,
    changeFrequency: "weekly",
    priority: 0.6,
  }));

  const postUrls = posts.map((p) => ({
    url: `${SITE_URL}${p.pathname}`,
    lastModified: toValidDate(p.modified || p.date),
    changeFrequency: "monthly",
    priority: 0.8,
  }));

  return [...staticUrls, ...infoUrls, ...categoryUrls, ...postUrls];
}
