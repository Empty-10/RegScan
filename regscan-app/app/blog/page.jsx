import Link from "next/link";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { PostCard } from "@/components/PostCard";
import {
  getAllPosts,
  getCategories,
  getPostsByCategory,
  cleanText,
  excerptText,
  niceCategoryName,
  SITE_URL,
} from "@/lib/posts";

export const metadata = {
  title: "MOT & tax guides",
  description:
    "Clear, up-to-date UK MOT and tax guides — checklists, rules, penalties and how-tos, all checked against official DVSA and DVLA guidance.",
  alternates: { canonical: `${SITE_URL}/blog/` },
};

export default function Page() {
  const all = getAllPosts();
  const featured = all[0];
  const categories = getCategories();

  const breadcrumbLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: `${SITE_URL}/` },
      { "@type": "ListItem", position: 2, name: "Blog", item: `${SITE_URL}/blog/` },
    ],
  };

  // Structured list of every guide — gives search + AI engines a parseable index.
  const itemListLd = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: "MOT & tax guides",
    url: `${SITE_URL}/blog/`,
    mainEntity: {
      "@type": "ItemList",
      itemListElement: all.map((p, i) => ({
        "@type": "ListItem",
        position: i + 1,
        url: `${SITE_URL}${p.pathname}`,
        name: cleanText(p.title),
      })),
    },
  };

  return (
    <>
      <Header active="blog" />

      <section className="blog-hero">
        <div className="container">
          <nav className="results-breadcrumb" aria-label="Breadcrumb">
            <Link href="/">Home</Link>
            <span>›</span>
            <span className="current">Blog</span>
          </nav>
          <span className="eyebrow">RegScan blog</span>
          <h1>MOT &amp; tax guides</h1>
          <p className="lede">
            Clear, practical guidance on MOT rules, tax, penalties and how to pass first time —
            written for UK drivers and checked against official DVSA &amp; DVLA sources.
          </p>
        </div>
      </section>

      <main className="blog-wrap">
        <div className="container">
          {featured && (
            <Link href={featured.pathname} className="blog-feature">
              {featured.featuredImage && (
                /* eslint-disable-next-line @next/next/no-img-element */
                <img src={featured.featuredImage} alt={featured.featuredAlt || cleanText(featured.title)} />
              )}
              <div className="bf-body">
                <span className="blog-tag">Latest · {niceCategoryName(featured.categoryName)}</span>
                <h2>{cleanText(featured.title)}</h2>
                <p>{excerptText(featured.summary || featured.excerpt || featured.contentHtml, 180)}</p>
                <span className="bf-cta">Read the guide →</span>
              </div>
            </Link>
          )}

          {categories.map((cat) => {
            const posts = getPostsByCategory(cat.slug).filter((p) => p.slug !== featured?.slug);
            if (!posts.length) return null;
            return (
              <section key={cat.slug} className="blog-section">
                <div className="blog-section-head">
                  <h2>{niceCategoryName(cat.name)}</h2>
                  <Link href={`/category/${cat.slug}/`}>View all {cat.count} →</Link>
                </div>
                <div className="blog-grid">
                  {posts.map((p) => (
                    <PostCard key={p.slug} post={p} />
                  ))}
                </div>
              </section>
            );
          })}
        </div>
      </main>

      <Footer />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(itemListLd) }} />
    </>
  );
}
