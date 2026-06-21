// Reads the imported WordPress content (content/posts, content/pages) at build time.
import "server-only";
import fs from "node:fs";
import path from "node:path";

const POSTS_DIR = path.join(process.cwd(), "content", "posts");
const PAGES_DIR = path.join(process.cwd(), "content", "pages");

export const SITE_URL = "https://www.regscan.co.uk";

const readJson = (p) => JSON.parse(fs.readFileSync(p, "utf8"));

export function getAllPosts() {
  if (!fs.existsSync(POSTS_DIR)) return [];
  const posts = [];
  for (const cat of fs.readdirSync(POSTS_DIR)) {
    const dir = path.join(POSTS_DIR, cat);
    if (!fs.statSync(dir).isDirectory()) continue;
    for (const file of fs.readdirSync(dir).filter((f) => f.endsWith(".json"))) {
      posts.push(readJson(path.join(dir, file)));
    }
  }
  return posts.sort((a, b) => (a.date < b.date ? 1 : -1)); // newest first
}

export function getPost(categorySlug, slug) {
  const p = path.join(POSTS_DIR, categorySlug, `${slug}.json`);
  return fs.existsSync(p) ? readJson(p) : null;
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
