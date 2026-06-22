import { notFound } from "next/navigation";
import Link from "next/link";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { ArticleToc } from "@/components/ArticleToc";
import {
  getAllPosts,
  getPost,
  getPostsByCategory,
  cleanText,
  excerptText,
  extractFaq,
  processArticle,
  niceCategoryName,
  SITE_URL,
} from "@/lib/posts";

// Only the imported posts exist at this route; anything else 404s. Static routes
// (/check, /garage, /category, /blog, …) still take priority over this dynamic one.
export const dynamicParams = false;

const fmtDate = (iso) =>
  iso
    ? new Date(iso).toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" })
    : null;

export function generateStaticParams() {
  return getAllPosts().map((p) => ({ category: p.categorySlug, slug: p.slug }));
}

export function generateMetadata({ params }) {
  const post = getPost(params.category, params.slug);
  if (!post) return {};
  const title = cleanText(post.title);
  // Prefer the hand-written answer-first summary for the meta description.
  const description = post.summary ? excerptText(post.summary, 160) : excerptText(post.excerpt || post.contentHtml);
  const url = `${SITE_URL}${post.pathname}`;
  const images = post.featuredImage ? [`${SITE_URL}${post.featuredImage}`] : undefined;
  return {
    title,
    description,
    alternates: { canonical: url },
    openGraph: {
      title,
      description,
      url,
      type: "article",
      siteName: "RegScan",
      images,
      publishedTime: post.date,
      modifiedTime: post.modified || post.date,
    },
  };
}

export default function Page({ params }) {
  const post = getPost(params.category, params.slug);
  if (!post) notFound();

  const title = cleanText(post.title);
  const categoryName = niceCategoryName(post.categoryName);
  const url = `${SITE_URL}${post.pathname}`;
  const related = getPostsByCategory(post.categorySlug).filter((p) => p.slug !== post.slug).slice(0, 4);
  const faqs = extractFaq(post.contentHtml);

  // Anchor the headings + build the table of contents.
  const { html: bodyHtml, toc } = processArticle(post.contentHtml);
  const h2s = toc.filter((t) => t.level === 2);
  const tocItems = h2s.length >= 2 ? h2s : toc; // top-level when possible, else all
  const showToc = tocItems.length >= 3;

  const faqLd = faqs.length
    ? {
        "@context": "https://schema.org",
        "@type": "FAQPage",
        mainEntity: faqs.map((f) => ({
          "@type": "Question",
          name: f.question,
          acceptedAnswer: { "@type": "Answer", text: f.answer },
        })),
      }
    : null;

  const articleLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: title,
    datePublished: post.date,
    dateModified: post.modified || post.date,
    mainEntityOfPage: url,
    image: post.featuredImage ? [`${SITE_URL}${post.featuredImage}`] : undefined,
    author: { "@type": "Organization", name: "RegScan", url: `${SITE_URL}/` },
    publisher: {
      "@type": "Organization",
      name: "RegScan",
      url: `${SITE_URL}/`,
      logo: { "@type": "ImageObject", url: `${SITE_URL}/icon.svg` },
    },
  };

  const breadcrumbLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: `${SITE_URL}/` },
      { "@type": "ListItem", position: 2, name: "Blog", item: `${SITE_URL}/blog/` },
      { "@type": "ListItem", position: 3, name: categoryName, item: `${SITE_URL}/category/${post.categorySlug}/` },
      { "@type": "ListItem", position: 4, name: title, item: url },
    ],
  };

  return (
    <>
      <Header active="blog" />
      <main className="post-page">
        <div className="container">
         <div className="post-shell">
          <nav className="results-breadcrumb" aria-label="Breadcrumb">
            <Link href="/">Home</Link>
            <span>›</span>
            <Link href="/blog/">Blog</Link>
            <span>›</span>
            <Link href={`/category/${post.categorySlug}/`}>{categoryName}</Link>
          </nav>
          <div className={"post-layout" + (showToc ? "" : " no-toc")}>
           <article className="post-main">
            <h1 className="post-title">{title}</h1>
            <div className="post-meta">
              <span className="post-byline">By the RegScan team</span>
              <span> · Published {fmtDate(post.date)}</span>
              {post.modified && post.modified !== post.date && (
                <span> · Updated {fmtDate(post.modified)}</span>
              )}
            </div>
            <div className="post-trust">Checked against official DVSA &amp; DVLA guidance</div>
            {post.summary && (
              <div className="post-answer">
                <span className="post-answer-label">Quick answer</span>
                <p>{post.summary}</p>
              </div>
            )}
            {post.featuredImage && (
              /* eslint-disable-next-line @next/next/no-img-element */
              <img className="post-hero" src={post.featuredImage} alt={post.featuredAlt || title} />
            )}
            <div className="post-content" dangerouslySetInnerHTML={{ __html: bodyHtml }} />

            {/* CTA back to the core tool */}
            <aside className="post-cta">
              <div>
                <span className="cta-eyebrow">Free check</span>
                <h3>Check your vehicle’s MOT &amp; tax in seconds</h3>
                <p>Live status, full MOT history and advisories from official DVSA &amp; DVLA data.</p>
              </div>
              <Link href="/check/" className="btn btn-primary btn-lg">Check a vehicle</Link>
            </aside>

            {related.length > 0 && (
              <section className="post-related" aria-label="Related guides">
                <h2>More on {categoryName.toLowerCase()}</h2>
                <ul className="post-list">
                  {related.map((p) => (
                    <li key={p.slug}>
                      <Link href={p.pathname}>{cleanText(p.title)}</Link>
                    </li>
                  ))}
                </ul>
              </section>
            )}
           </article>

           {showToc && <ArticleToc items={tocItems} />}
          </div>
         </div>
        </div>
      </main>
      <Footer />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(articleLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd) }} />
      {faqLd && (
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqLd) }} />
      )}
    </>
  );
}
