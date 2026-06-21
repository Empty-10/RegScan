// One-off importer: pulls all published posts from the live WordPress REST API
// into local JSON content files, preserving body HTML and Yoast SEO metadata.
//
// Run from the app dir:  node scripts/import-wp.mjs
//
// Output: content/posts/<category-slug>/<post-slug>.json
// Each file carries the exact title tag, meta description and canonical Yoast
// produced, so the migrated pages keep identical on-page SEO signals.
import fs from "node:fs";
import path from "node:path";

const SITE = "https://www.regscan.co.uk";
const OUT = path.join(process.cwd(), "content", "posts");
const PUBLIC = path.join(process.cwd(), "public");
const IMG_HOSTS = ["www.regscan.co.uk", "regscan.co.uk"];

async function getJson(url) {
  const res = await fetch(url, { headers: { Accept: "application/json" } });
  if (!res.ok) throw new Error(`${res.status} for ${url}`);
  return res.json();
}

// --- image localisation ---------------------------------------------------
const seenImages = new Set();
let imgOk = 0, imgFail = 0;

function absolutise(url) {
  if (!url) return null;
  if (url.startsWith("//")) return "https:" + url;
  if (url.startsWith("/")) return SITE + url;
  if (url.startsWith("http")) return url;
  return null; // skip data: URIs etc.
}

// Download one of our own media files into /public at its original path; returns
// the root-relative path to use in the HTML, or null if it can't be localised.
async function downloadImage(rawUrl) {
  const abs = absolutise(rawUrl);
  if (!abs) return null;
  let u;
  try { u = new URL(abs); } catch { return null; }
  if (!IMG_HOSTS.includes(u.hostname)) return null;        // only our own media
  if (!u.pathname.startsWith("/wp-content/")) return null; // only the media library
  const dest = path.join(PUBLIC, u.pathname);
  if (!seenImages.has(u.pathname)) {
    seenImages.add(u.pathname);
    if (!fs.existsSync(dest)) {
      try {
        const res = await fetch(abs);
        if (res.ok) {
          fs.mkdirSync(path.dirname(dest), { recursive: true });
          fs.writeFileSync(dest, Buffer.from(await res.arrayBuffer()));
          imgOk++;
        } else { imgFail++; }
      } catch { imgFail++; }
    }
  }
  return u.pathname;
}

// Find every image URL in src/data-src/srcset, download it, and rewrite the HTML
// to the local path. Longest URLs first so size-suffixed variants don't clash.
async function localiseImages(html) {
  if (!html) return html;
  const urls = new Set();
  let m;
  const attrRe = /(?:src|data-src)=["']([^"']+)["']/gi;
  while ((m = attrRe.exec(html))) urls.add(m[1]);
  const srcsetRe = /srcset=["']([^"']+)["']/gi;
  while ((m = srcsetRe.exec(html))) {
    for (const part of m[1].split(",")) {
      const url = part.trim().split(/\s+/)[0];
      if (url) urls.add(url);
    }
  }
  for (const url of [...urls].sort((a, b) => b.length - a.length)) {
    const local = await downloadImage(url);
    if (local && local !== url) html = html.split(url).join(local);
  }
  return html;
}

// Yoast exposes yoast_head_json on each post; pull the fields we render.
function fromYoast(y = {}) {
  const og = (y.og_image && y.og_image[0] && y.og_image[0].url) || null;
  return {
    metaTitle: y.title || null,
    metaDescription: y.description || null,
    canonical: y.canonical || null,
    ogImage: og,
    robots: y.robots || null,
    articleModified: y.article_modified_time || null,
    articlePublished: y.article_published_time || null,
  };
}

async function main() {
  const cats = await getJson(`${SITE}/wp-json/wp/v2/categories?per_page=100&_fields=id,slug,name`);
  const catById = Object.fromEntries(cats.map((c) => [c.id, c]));

  // The /media collection is locked down (403), so we read the featured image
  // from each post's embedded wp:featuredmedia instead.
  const posts = await getJson(
    `${SITE}/wp-json/wp/v2/posts?per_page=100&_embed=wp:featuredmedia`
  );

  fs.rmSync(OUT, { recursive: true, force: true });
  fs.mkdirSync(OUT, { recursive: true });

  const index = [];
  for (const p of posts) {
    const cat = catById[(p.categories || [])[0]] || { slug: "uncategorized", name: "Uncategorized" };
    const fm = p._embedded?.["wp:featuredmedia"]?.[0];
    const featuredImage = fm?.source_url ? await downloadImage(fm.source_url) : null;
    const record = {
      slug: p.slug,
      categorySlug: cat.slug,
      categoryName: cat.name,
      title: p.title?.rendered || "",
      excerpt: p.excerpt?.rendered || "",
      date: p.date,
      modified: p.modified,
      sourceUrl: p.link,
      // Preserve the live path exactly (relative, trailing slash).
      pathname: new URL(p.link).pathname,
      featuredImage,
      featuredAlt: fm?.alt_text || "",
      ...fromYoast(p.yoast_head_json),
      contentHtml: await localiseImages(p.content?.rendered || ""),
    };
    const dir = path.join(OUT, cat.slug);
    fs.mkdirSync(dir, { recursive: true });
    fs.writeFileSync(path.join(dir, `${p.slug}.json`), JSON.stringify(record, null, 2));
    index.push({ slug: p.slug, categorySlug: cat.slug, title: record.title, pathname: record.pathname });
  }

  fs.writeFileSync(path.join(process.cwd(), "content", "index.json"), JSON.stringify(index, null, 2));
  console.log(`Imported ${posts.length} posts across ${new Set(index.map((i) => i.categorySlug)).size} categories.`);
  for (const i of index) console.log(`  ${i.pathname}`);

  // Content pages we keep at their existing URLs (car-history, car-details).
  const KEEP_PAGES = ["car-history", "car-details"];
  const pagesDir = path.join(process.cwd(), "content", "pages");
  fs.rmSync(pagesDir, { recursive: true, force: true });
  fs.mkdirSync(pagesDir, { recursive: true });
  const pages = await getJson(
    `${SITE}/wp-json/wp/v2/pages?per_page=100&_fields=id,slug,link,title,date,modified,content,excerpt`
  );
  for (const pg of pages.filter((p) => KEEP_PAGES.includes(p.slug))) {
    const rec = {
      slug: pg.slug,
      title: pg.title?.rendered || "",
      excerpt: pg.excerpt?.rendered || "",
      date: pg.date,
      modified: pg.modified,
      pathname: new URL(pg.link).pathname,
      contentHtml: await localiseImages(pg.content?.rendered || ""),
    };
    fs.writeFileSync(path.join(pagesDir, `${pg.slug}.json`), JSON.stringify(rec, null, 2));
    console.log(`  page ${rec.pathname}`);
  }

  console.log(`Images: downloaded ${imgOk}, failed ${imgFail}, total referenced ${seenImages.size}.`);
}

main().catch((e) => { console.error(e); process.exit(1); });
