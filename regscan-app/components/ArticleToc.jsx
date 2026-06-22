"use client";

import { useEffect, useState } from "react";

// Sticky "On this page" rail with scroll-spy. Highlights the section currently
// in view and smooth-scrolls (offset for the sticky header) on click.
export function ArticleToc({ items }) {
  const [active, setActive] = useState(items[0]?.id);

  useEffect(() => {
    const onScroll = () => {
      let current = items[0]?.id;
      for (const it of items) {
        const el = document.getElementById(it.id);
        if (el && el.getBoundingClientRect().top <= 120) current = it.id;
      }
      setActive(current);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [items]);

  const go = (e, id) => {
    e.preventDefault();
    const el = document.getElementById(id);
    if (el) {
      window.scrollTo({ top: el.getBoundingClientRect().top + window.scrollY - 90, behavior: "smooth" });
    }
  };

  return (
    <aside className="article-toc" aria-label="Table of contents">
      <div className="toc-card">
        <h4>On this page</h4>
        <ul>
          {items.map((it) => (
            <li key={it.id} className={it.level === 3 ? "toc-sub" : ""}>
              <a href={`#${it.id}`} className={active === it.id ? "active" : ""} onClick={(e) => go(e, it.id)}>
                {it.text}
              </a>
            </li>
          ))}
        </ul>
      </div>
    </aside>
  );
}
