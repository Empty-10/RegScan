import { notFound } from "next/navigation";
import Link from "next/link";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { getAllPosts, getPost, cleanText, excerptText, SITE_URL } from "@/lib/posts";

// Only the imported posts exist at this route; anything else 404s. Static routes
// (/check, /garage, /category, /blog, …) still take priority over this dynamic one.
export const dynamicParams = false;

export function generateStaticParams() {
  return getAllPosts().map((p) => ({ category: p.categorySlug, slug: p.slug }));
}

export function generateMetadata({ params }) {
  const post = getPost(params.category, params.slug);
  if (!post) return {};
  const title = cleanText(post.title);
  const description = excerptText(post.excerpt || post.contentHtml);
  const url = `${SITE_URL}${post.pathname}`;
  const images = post.featuredImage ? [`${SITE_URL}${post.featuredImage}`] : undefined;
  return {
    title,
    description,
    alternates: { canonical: url },
    openGraph: { title, description, url, type: "article", siteName: "RegScan", images },
  };
}

export default function Page({ params }) {
  const post = getPost(params.category, params.slug);
  if (!post) notFound();

  const title = cleanText(post.title);
  const url = `${SITE_URL}${post.pathname}`;
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: title,
    datePublished: post.date,
    dateModified: post.modified || post.date,
    mainEntityOfPage: url,
    image: post.featuredImage ? [`${SITE_URL}${post.featuredImage}`] : undefined,
    author: { "@type": "Organization", name: "RegScan" },
    publisher: { "@type": "Organization", name: "RegScan" },
  };

  return (
    <>
      <Header />
      <main className="post-page">
        <div className="container container-narrow">
          <nav className="results-breadcrumb" aria-label="Breadcrumb">
            <Link href="/blog/">Blog</Link>
            <span>›</span>
            <Link href={`/category/${post.categorySlug}/`}>{cleanText(post.categoryName)}</Link>
          </nav>
          <article>
            <h1 className="post-title">{title}</h1>
            {post.featuredImage && (
              /* eslint-disable-next-line @next/next/no-img-element */
              <img className="post-hero" src={post.featuredImage} alt={post.featuredAlt || title} />
            )}
            <div
              className="post-content"
              dangerouslySetInnerHTML={{ __html: post.contentHtml }}
            />
          </article>
        </div>
      </main>
      <Footer />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
    </>
  );
}
