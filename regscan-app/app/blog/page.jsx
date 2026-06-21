import Link from "next/link";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { getCategories, getPostsByCategory, cleanText, excerptText, SITE_URL } from "@/lib/posts";

export const metadata = {
  title: "Blog",
  description: "MOT and tax guides, checklists and explainers from RegScan.",
  alternates: { canonical: `${SITE_URL}/blog/` },
};

export default function Page() {
  const categories = getCategories();
  return (
    <>
      <Header />
      <main className="post-page">
        <div className="container container-narrow">
          <span className="eyebrow">Blog</span>
          <h1 className="post-title">MOT &amp; tax guides</h1>
          {categories.map((cat) => (
            <section key={cat.slug} className="blog-cat">
              <h2>
                <Link href={`/category/${cat.slug}/`}>{cat.name}</Link>
              </h2>
              <ul className="post-list">
                {getPostsByCategory(cat.slug).map((p) => (
                  <li key={p.slug}>
                    <Link href={p.pathname}>{cleanText(p.title)}</Link>
                    <p>{excerptText(p.excerpt || p.contentHtml, 140)}</p>
                  </li>
                ))}
              </ul>
            </section>
          ))}
        </div>
      </main>
      <Footer />
    </>
  );
}
