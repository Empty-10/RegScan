"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Icon } from "./Icon";
import { Header } from "./Header";
import { Footer } from "./Footer";
import { FaqItem } from "./ui";
import { ARTICLE, SECTIONS, FAQS, RELATED } from "@/lib/articleData";

function ArticleByline() {
  return (
    <div className="article-byline">
      <span className="author">
        <span className="avatar">{ARTICLE.authorInitials}</span>
        {ARTICLE.author}
      </span>
      <span className="dot-sep" aria-hidden="true" />
      <span>Published {ARTICLE.published}</span>
      <span className="dot-sep" aria-hidden="true" />
      <span>Updated {ARTICLE.updated}</span>
      <span className="dot-sep" aria-hidden="true" />
      <span>{ARTICLE.readTime}</span>
    </div>
  );
}

function TableOfContents({ activeId, progress }) {
  return (
    <aside className="article-aside">
      <div className="toc-card">
        <h4>In this article</h4>
        <ul className="toc-list">
          {SECTIONS.map((s) => (
            <li key={s.id}>
              <a
                href={"#" + s.id}
                className={"toc-link" + (activeId === s.id ? " active" : "")}
                onClick={(e) => {
                  e.preventDefault();
                  const el = document.getElementById(s.id);
                  if (el) {
                    const y = el.getBoundingClientRect().top + window.scrollY - 88;
                    window.scrollTo({ top: y, behavior: "smooth" });
                  }
                }}
              >
                {s.h2}
              </a>
            </li>
          ))}
        </ul>
        <div className="toc-progress">
          <span className="bar"><span style={{ width: progress + "%" }} /></span>
          <span>{progress}%</span>
        </div>
      </div>
    </aside>
  );
}

export default function ArticleView() {
  const [activeId, setActiveId] = useState(SECTIONS[0].id);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const onScroll = () => {
      const body = document.getElementById("article-body");
      if (body) {
        const rect = body.getBoundingClientRect();
        const total = rect.height - window.innerHeight;
        const scrolled = Math.min(Math.max(-rect.top, 0), Math.max(total, 1));
        setProgress(Math.round((scrolled / Math.max(total, 1)) * 100));
      }
      const trigger = window.innerHeight * 0.3;
      let current = SECTIONS[0].id;
      for (const s of SECTIONS) {
        const el = document.getElementById(s.id);
        if (el && el.getBoundingClientRect().top <= trigger) current = s.id;
      }
      setActiveId(current);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);

  return (
    <>
      <Header active="resources" />

      <div className="container">
        <div className="article-page">
          <nav className="results-breadcrumb" aria-label="Breadcrumb">
            <Link href="/">Home</Link>
            <Icon name="chevron-right" size={14} />
            <Link href="/#content">Resources</Link>
            <Icon name="chevron-right" size={14} />
            <span className="current">MOT advisories explained</span>
          </nav>

          <header className="article-header">
            <div className="article-header-inner">
              <span className="article-tag">{ARTICLE.category}</span>
              <h1 className="article-title">{ARTICLE.title}</h1>
              <p className="article-dek">{ARTICLE.dek}</p>
              <ArticleByline />
            </div>
          </header>

          <div className="article-layout">
            <article className="article-body" id="article-body">
              <h2 id={SECTIONS[0].id}>{SECTIONS[0].h2}</h2>
              {SECTIONS[0].paras.map((p, i) => <p key={i}>{p}</p>)}

              <h2 id={SECTIONS[1].id}>{SECTIONS[1].h2}</h2>
              {SECTIONS[1].paras.map((p, i) => <p key={i}>{p}</p>)}

              <div className="article-cta">
                <div className="cta-copy">
                  <span className="cta-eyebrow">Free check</span>
                  <h3>Check your vehicle’s MOT history and advisories free</h3>
                </div>
                <Link href="/" className="btn btn-primary btn-lg">
                  Check my vehicle <Icon name="arrow-right" size={16} />
                </Link>
              </div>

              <h2 id={SECTIONS[2].id}>{SECTIONS[2].h2}</h2>
              {SECTIONS[2].paras.map((p, i) => <p key={i}>{p}</p>)}

              <h2 id={SECTIONS[3].id}>{SECTIONS[3].h2}</h2>
              {SECTIONS[3].paras.map((p, i) => <p key={i}>{p}</p>)}

              <section className="article-faq" aria-label="Common questions">
                <h2>Common questions</h2>
                <div className="faq">
                  {FAQS.map((f, i) => (
                    <FaqItem key={i} q={f.q}>{f.a}</FaqItem>
                  ))}
                </div>
              </section>
            </article>

            <TableOfContents activeId={activeId} progress={progress} />
          </div>
        </div>
      </div>

      <section className="related-section">
        <div className="container">
          <div className="related-head">
            <h2>Related articles</h2>
          </div>
          <div className="related-grid">
            {RELATED.map((r, i) => (
              <a className="related-card" href={r.href} key={i}>
                <span className="r-tag">{r.tag}</span>
                <h3>{r.title}</h3>
                <p>{r.desc}</p>
                <span className="r-more">Read more <Icon name="arrow-right" size={14} /></span>
              </a>
            ))}
          </div>
        </div>
      </section>

      <section className="cta-band">
        <div className="container">
          <h2>Never miss your MOT or tax deadline</h2>
          <p>Free reminders at 30, 14 and 1 day before. No account needed.</p>
          <Link href="/garage" className="btn btn-primary btn-lg">
            <Icon name="bell" size={18} /> Set free reminder <Icon name="arrow-right" size={16} />
          </Link>
        </div>
      </section>

      <Footer />
    </>
  );
}
