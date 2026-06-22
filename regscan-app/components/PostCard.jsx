import Link from "next/link";
import { cleanText, excerptText, niceCategoryName } from "@/lib/posts";

const fmtDate = (iso) =>
  iso ? new Date(iso).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" }) : null;

// Shared blog/category card with thumbnail, category tag, title, summary and date.
export function PostCard({ post, showCategory = true }) {
  return (
    <Link href={post.pathname} className="blog-card">
      {post.featuredImage && (
        /* eslint-disable-next-line @next/next/no-img-element */
        <img className="blog-card-thumb" src={post.featuredImage} alt={post.featuredAlt || cleanText(post.title)} />
      )}
      <div className="blog-card-body">
        {showCategory && <span className="blog-tag">{niceCategoryName(post.categoryName)}</span>}
        <h3>{cleanText(post.title)}</h3>
        <p>{excerptText(post.summary || post.excerpt || post.contentHtml, 115)}</p>
        <span className="bc-meta">{fmtDate(post.date)}</span>
      </div>
    </Link>
  );
}
