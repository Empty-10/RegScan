import HomeView from "@/components/HomeView";
import { getCategories, getPillarPost, niceCategoryName, cleanText } from "@/lib/posts";

export default function Page() {
  // Pillar guides for the home page — flows topic-cluster authority from the
  // strongest page down to the category hubs and their comprehensive guides.
  const guides = getCategories().map((c) => {
    const pillar = getPillarPost(c.slug);
    return {
      slug: c.slug,
      name: niceCategoryName(c.name),
      count: c.count,
      href: pillar?.pathname || `/category/${c.slug}/`,
      pillarTitle: pillar ? cleanText(pillar.title) : niceCategoryName(c.name),
    };
  });

  return <HomeView guides={guides} />;
}
