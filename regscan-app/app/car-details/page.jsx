import { notFound } from "next/navigation";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { getPage, cleanText, excerptText, SITE_URL } from "@/lib/posts";

export function generateMetadata() {
  const page = getPage("car-details");
  if (!page) return {};
  return {
    title: cleanText(page.title),
    description: excerptText(page.excerpt || page.contentHtml),
    alternates: { canonical: `${SITE_URL}/car-details/` },
  };
}

export default function Page() {
  const page = getPage("car-details");
  if (!page) notFound();
  return (
    <>
      <Header />
      <main className="post-page">
        <div className="container container-narrow">
          <h1 className="post-title">{cleanText(page.title)}</h1>
          <div className="post-content" dangerouslySetInnerHTML={{ __html: page.contentHtml }} />
        </div>
      </main>
      <Footer />
    </>
  );
}
