import { notFound } from "next/navigation";
import Link from "next/link";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { getCategories, getPostsByCategory, cleanText, excerptText, SITE_URL } from "@/lib/posts";

export const dynamicParams = false;

export function generateStaticParams() {
  return getCategories().map((c) => ({ slug: c.slug }));
}

export function generateMetadata({ params }) {
  const cat = getCategories().find((c) => c.slug === params.slug);
  if (!cat) return {};
  return {
    title: cat.name,
    description: `Guides and articles about ${cat.name.toLowerCase()} from RegScan.`,
    alternates: { canonical: `${SITE_URL}/category/${cat.slug}/` },
  };
}

export default function Page({ params }) {
  const cat = getCategories().find((c) => c.slug === params.slug);
  if (!cat) notFound();
  const posts = getPostsByCategory(params.slug);

  return (
    <>
      <Header />
      <main className="post-page">
        <div className="container container-narrow">
          <span className="eyebrow">Category</span>
          <h1 className="post-title">{cat.name}</h1>
          <ul className="post-list">
            {posts.map((p) => (
              <li key={p.slug}>
                <Link href={p.pathname}>{cleanText(p.title)}</Link>
                <p>{excerptText(p.excerpt || p.contentHtml, 140)}</p>
              </li>
            ))}
          </ul>
        </div>
      </main>
      <Footer />
    </>
  );
}
