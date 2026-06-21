// Reads the imported WordPress content (content/posts, content/pages) at build time.
import "server-only";
import fs from "node:fs";
import path from "node:path";

const POSTS_DIR = path.join(process.cwd(), "content", "posts");
const PAGES_DIR = path.join(process.cwd(), "content", "pages");
const SUMMARIES = path.join(process.cwd(), "content", "summaries.json");

export const SITE_URL = "https://www.regscan.co.uk";

const readJson = (p) => JSON.parse(fs.readFileSync(p, "utf8"));

// Hand-written answer-first summaries (slug -> text), merged onto each post.
const summaries = fs.existsSync(SUMMARIES) ? readJson(SUMMARIES) : {};
const withSummary = (post) => (post ? { ...post, summary: summaries[post.slug] || null } : post);

export function getAllPosts() {
  if (!fs.existsSync(POSTS_DIR)) return [];
  const posts = [];
  for (const cat of fs.readdirSync(POSTS_DIR)) {
    const dir = path.join(POSTS_DIR, cat);
    if (!fs.statSync(dir).isDirectory()) continue;
    for (const file of fs.readdirSync(dir).filter((f) => f.endsWith(".json"))) {
      posts.push(withSummary(readJson(path.join(dir, file))));
    }
  }
  return posts.sort((a, b) => (a.date < b.date ? 1 : -1)); // newest first
}

export function getPost(categorySlug, slug) {
  const p = path.join(POSTS_DIR, categorySlug, `${slug}.json`);
  return fs.existsSync(p) ? withSummary(readJson(p)) : null;
}

export function getPostsByCategory(categorySlug) {
  return getAllPosts().filter((p) => p.categorySlug === categorySlug);
}

export function getCategories() {
  const map = new Map();
  for (const p of getAllPosts()) {
    if (!map.has(p.categorySlug)) {
      map.set(p.categorySlug, { slug: p.categorySlug, name: cleanText(p.categoryName), count: 0 });
    }
    map.get(p.categorySlug).count++;
  }
  return [...map.values()];
}

export function getPage(slug) {
  const p = path.join(PAGES_DIR, `${slug}.json`);
  return fs.existsSync(p) ? readJson(p) : null;
}

const ENTITIES = {
  "&amp;": "&", "&#038;": "&", "&lt;": "<", "&gt;": ">",
  "&quot;": '"', "&#34;": '"', "&#039;": "'", "&#39;": "'",
  "&#8217;": "’", "&#8216;": "‘", "&#8220;": "“", "&#8221;": "”",
  "&#8211;": "–", "&#8212;": "—", "&hellip;": "…", "&nbsp;": " ",
};

// Strip tags + decode the HTML entities WordPress emits in titles/excerpts.
export function cleanText(html) {
  let s = String(html || "").replace(/<[^>]+>/g, "");
  for (const [k, v] of Object.entries(ENTITIES)) s = s.split(k).join(v);
  return s.replace(/\s+/g, " ").trim();
}

export function excerptText(html, max = 155) {
  const t = cleanText(html);
  return t.length > max ? t.slice(0, max - 1).trimEnd() + "…" : t;
}

// Display-friendly category name: title-case but keep "MOT"/"DVLA" etc. uppercase.
export function niceCategoryName(name) {
  return cleanText(name)
    .split(" ")
    .map((w) => (/^(mot|dvla|dvsa|ni|uk)$/i.test(w) ? w.toUpperCase() : w.charAt(0).toUpperCase() + w.slice(1)))
    .join(" ");
}

// Extracts FAQ question/answer pairs from a post body (an "h2 Frequently Asked
// Questions" section followed by h3 question + paragraph answers) for FAQPage schema.
export function extractFaq(html) {
  if (!html) return [];
  const start = html.search(/<h2[^>]*>(?:(?!<\/h2>)[\s\S])*frequently asked questions[\s\S]*?<\/h2>/i);
  if (start === -1) return [];
  let section = html.slice(start);
  const next = section.slice(1).search(/<h2[^>]/i); // stop at the next h2
  if (next !== -1) section = section.slice(0, next + 1);

  const faqs = [];
  for (const block of section.split(/<h3[^>]*>/i).slice(1)) {
    const end = block.search(/<\/h3>/i);
    if (end === -1) continue;
    const question = cleanText(block.slice(0, end));
    const answer = cleanText(block.slice(end + 5));
    if (question && answer) faqs.push({ question, answer });
  }
  return faqs;
}

// Picks the "pillar" post for a category: prefers a slug matching the category
// or one that reads like a comprehensive guide; falls back to the newest.
export function getPillarPost(categorySlug) {
  const posts = getPostsByCategory(categorySlug);
  return (
    posts.find((p) => p.slug === categorySlug || p.slug.startsWith(categorySlug)) ||
    posts.find((p) => /(complete|ultimate|comprehensive|guide)/i.test(p.slug)) ||
    posts[0] ||
    null
  );
}
