import { notFound } from "next/navigation";
import Link from "next/link";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { PostCard } from "@/components/PostCard";
import {
  getCategories,
  getPostsByCategory,
  cleanText,
  niceCategoryName,
  SITE_URL,
} from "@/lib/posts";

export const dynamicParams = false;

export function generateStaticParams() {
  return getCategories().map((c) => ({ slug: c.slug }));
}

export function generateMetadata({ params }) {
  const cat = getCategories().find((c) => c.slug === params.slug);
  if (!cat) return {};
  const name = niceCategoryName(cat.name);
  return {
    title: name,
    description: `${name} — guides and answers for UK drivers, checked against official DVSA and DVLA guidance.`,
    alternates: { canonical: `${SITE_URL}/category/${cat.slug}/` },
  };
}

export default function Page({ params }) {
  const cat = getCategories().find((c) => c.slug === params.slug);
  if (!cat) notFound();
  const name = niceCategoryName(cat.name);
  const posts = getPostsByCategory(params.slug);

  const breadcrumbLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: `${SITE_URL}/` },
      { "@type": "ListItem", position: 2, name: "Blog", item: `${SITE_URL}/blog/` },
      { "@type": "ListItem", position: 3, name, item: `${SITE_URL}/category/${cat.slug}/` },
    ],
  };
  const itemListLd = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name,
    url: `${SITE_URL}/category/${cat.slug}/`,
    mainEntity: {
      "@type": "ItemList",
      itemListElement: posts.map((p, i) => ({
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
            <Link href="/blog/">Blog</Link>
            <span>›</span>
            <span className="current">{name}</span>
          </nav>
          <span className="eyebrow">Guide topic</span>
          <h1>{name}</h1>
          <p className="lede">
            {posts.length} guide{posts.length === 1 ? "" : "s"} on {name.toLowerCase()} for UK drivers,
            checked against official DVSA &amp; DVLA guidance.
          </p>
        </div>
      </section>

      <main className="blog-wrap">
        <div className="container">
          <div className="blog-grid" style={{ marginTop: 36 }}>
            {posts.map((p) => (
              <PostCard key={p.slug} post={p} showCategory={false} />
            ))}
          </div>
        </div>
      </main>

      <Footer />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(itemListLd) }} />
    </>
  );
}
