import ArticleView from "@/components/ArticleView";
import { ARTICLE, FAQS } from "@/lib/articleData";

const url = `https://regscan.co.uk/resources/${ARTICLE.slug}`;

export const metadata = {
  title: ARTICLE.metaTitle,
  description: ARTICLE.metaDescription,
  alternates: { canonical: `/resources/${ARTICLE.slug}` },
  openGraph: {
    type: "article",
    title: ARTICLE.title,
    description: ARTICLE.metaDescription,
    url,
    siteName: "RegScan",
  },
};

function jsonLd() {
  const article = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: ARTICLE.title,
    description: ARTICLE.metaDescription,
    author: { "@type": "Person", name: ARTICLE.author },
    datePublished: ARTICLE.publishedISO,
    dateModified: ARTICLE.updatedISO,
    publisher: {
      "@type": "Organization",
      name: "RegScan",
      logo: { "@type": "ImageObject", url: "https://regscan.co.uk/logo.png" },
    },
    mainEntityOfPage: { "@type": "WebPage", "@id": url },
  };
  const faq = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: FAQS.map((f) => ({
      "@type": "Question",
      name: f.q,
      acceptedAnswer: { "@type": "Answer", text: f.a },
    })),
  };
  const breadcrumb = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: "https://regscan.co.uk/" },
      { "@type": "ListItem", position: 2, name: "Resources", item: "https://regscan.co.uk/resources" },
      { "@type": "ListItem", position: 3, name: ARTICLE.title, item: url },
    ],
  };
  return [article, faq, breadcrumb];
}

export default function Page() {
  return (
    <>
      {jsonLd().map((block, i) => (
        <script
          key={i}
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(block) }}
        />
      ))}
      <ArticleView />
    </>
  );
}
