import { getAllPosts, getCategories, SITE_URL } from "@/lib/posts";

// Generates /sitemap.xml from the migrated content + key static pages.
export default function sitemap() {
  const posts = getAllPosts();
  const categories = getCategories();

  const staticUrls = ["/", "/blog/", "/car-history/", "/car-details/"].map((p) => ({
    url: `${SITE_URL}${p}`,
    changeFrequency: "weekly",
    priority: p === "/" ? 1 : 0.7,
  }));

  const categoryUrls = categories.map((c) => ({
    url: `${SITE_URL}/category/${c.slug}/`,
    changeFrequency: "weekly",
    priority: 0.6,
  }));

  const postUrls = posts.map((p) => ({
    url: `${SITE_URL}${p.pathname}`,
    lastModified: p.modified || p.date,
    changeFrequency: "monthly",
    priority: 0.8,
  }));

  return [...staticUrls, ...categoryUrls, ...postUrls];
}
