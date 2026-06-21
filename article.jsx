// RegScan — Article template page

const ARTICLE = {
  category: "MOT Advice",
  title: "What Does an MOT Advisory Mean and How Long Can You Ignore It?",
  dek: "Advisories aren’t fails — but they aren’t nothing either. Here’s what they mean, how seriously to take them, and when you can safely wait.",
  author: "Jamie Fielding",
  authorInitials: "JF",
  published: "12 May 2026",
  updated: "30 May 2026",
  readTime: "6 min read",
};

// H2 sections — id drives both the anchor and the TOC scrollspy
const SECTIONS = [
  {
    id: "what-is-an-advisory",
    h2: "What is an MOT advisory?",
    paras: [
      "An MOT advisory is a note from the tester flagging something on your vehicle that is starting to wear or develop a fault, but isn’t yet bad enough to fail the test. Think of it as an early warning rather than a verdict — your car still passed, and it’s legal to drive. Common advisories cover things like brake pads getting thin, tyres approaching the legal tread limit, slight play in a suspension joint, or minor corrosion that hasn’t reached a structural area.",
      "Advisories are recorded against your vehicle on the official DVSA record, which means anyone running an MOT history check — including future buyers — can see them. They’re written in plain testing language and usually include the location and severity, so “nearside front tyre worn close to the legal limit” tells you exactly what to look at. The point is to give you time to plan a repair before it becomes a failure.",
    ],
  },
  {
    id: "how-serious",
    h2: "How serious is an MOT advisory?",
    paras: [
      "It depends entirely on what the advisory is for. Some are genuinely minor — a slightly perished wiper blade or a small stone chip — and can sit for months without any real risk. Others, like brakes or tyres nearing their limits, are safety-critical and should be dealt with quickly even though they technically passed on the day. The tester’s wording is your best guide: phrases like “close to the limit” or “excessively worn” signal that the clock is ticking.",
      "A useful rule of thumb is to separate advisories into “monitor” and “act soon” buckets. Anything affecting braking, steering, tyres or structural integrity belongs in the second group. Cosmetic or comfort items can usually wait until your next service. If you’re ever unsure, a quick inspection at a garage costs little and removes the guesswork — most will take a look at a specific advisory for free.",
    ],
  },
  {
    id: "how-long-can-you-drive",
    h2: "How long can you drive on an MOT advisory?",
    paras: [
      "Legally, an advisory doesn’t carry a deadline. Your MOT certificate remains valid for the full 12 months regardless of how many advisories it lists, and you won’t be breaking any law simply by driving with one. There’s no fine attached to the advisory itself, and it won’t invalidate your certificate.",
      "The practical answer is different. A worn component keeps wearing, so the real question is how long until it becomes dangerous or fails the next test. Brakes and tyres can deteriorate within weeks of heavy use; corrosion and suspension wear tend to progress over months. The safest approach is to book the repair while it’s still cheap, rather than waiting for it to turn into a failure — or worse, a breakdown.",
    ],
  },
  {
    id: "what-happens-if-it-worsens",
    h2: "What happens if an advisory gets worse?",
    paras: [
      "If you ignore an advisory long enough, two things tend to happen. First, the repair gets more expensive — a worn pad left too long can damage the disc, turning a cheap job into a costly one. Second, the item is very likely to become a straight fail at your next MOT, which means you can’t legally drive the car until it’s fixed, sometimes at short notice.",
      "There’s also a safety and legal dimension. If a component covered by an advisory fails and contributes to an incident, you could be considered to have known about a defect and done nothing — which can affect insurance claims and liability. Tracking your advisories year on year, as RegScan does automatically, makes it easy to spot the ones that keep reappearing and budget for them before they escalate.",
    ],
  },
];

const FAQS = [
  {
    q: "What is the difference between an advisory and a failure?",
    a: "A failure means your vehicle doesn’t meet the legal minimum standard and can’t be driven (except to a pre-booked repair or retest) until it’s fixed. An advisory means it passed, but the tester has noted something that will need attention before it becomes a failure. One stops you driving; the other is a heads-up.",
  },
  {
    q: "Can I drive with an MOT advisory?",
    a: "Yes. An advisory doesn’t affect the validity of your MOT certificate, so the vehicle remains road-legal for the full 12 months. That said, you’re still responsible for keeping the car roadworthy — if an advisory item deteriorates into a dangerous defect, driving on it could become an offence.",
  },
  {
    q: "Do advisories carry over to the next MOT?",
    a: "Advisories don’t automatically transfer, but they stay on your vehicle’s permanent MOT history record. At the next test the examiner will re-assess each item from scratch — so a previous advisory may clear, stay as an advisory, or become a failure depending on its condition on the day.",
  },
  {
    q: "How do I check my MOT advisories online?",
    a: "Enter your registration into RegScan and you’ll see your full MOT history, including every advisory and failure recorded against the vehicle, pulled directly from the official DVSA data. It’s free, and you can set a reminder so you never miss the renewal date.",
  },
  {
    q: "Will an advisory affect my insurance?",
    a: "An advisory on its own won’t change your premium — insurers don’t routinely price on them. However, if you knowingly leave a safety-related advisory unrepaired and it contributes to an accident, an insurer could question whether the vehicle was roadworthy, which may affect a claim.",
  },
];

const RELATED = [
  {
    tag: "MOT Advice",
    title: "How to Read Your Full MOT History Like a Mechanic",
    desc: "Spot the patterns that reveal a well-kept car — or a problem in the making.",
    href: "#",
  },
  {
    tag: "Buying a Car",
    title: "Using MOT Data to Avoid a Bad Used Car",
    desc: "Mileage gaps, repeat fails and clocked odometers — what to watch for.",
    href: "#",
  },
  {
    tag: "Tax & VED",
    title: "Car Tax Explained: Bands, SORN and Renewal Dates",
    desc: "A plain-English guide to how UK vehicle tax actually works in 2026.",
    href: "#",
  },
];

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

function ArticlePage() {
  const [activeId, setActiveId] = React.useState(SECTIONS[0].id);
  const [progress, setProgress] = React.useState(0);

  React.useEffect(() => {
    const onScroll = () => {
      // Reading progress across the article body
      const body = document.getElementById("article-body");
      if (body) {
        const rect = body.getBoundingClientRect();
        const total = rect.height - window.innerHeight;
        const scrolled = Math.min(Math.max(-rect.top, 0), Math.max(total, 1));
        setProgress(Math.round((scrolled / Math.max(total, 1)) * 100));
      }
      // Active section — last heading whose top is above the trigger line
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
          {/* Breadcrumb */}
          <nav className="results-breadcrumb" aria-label="Breadcrumb">
            <a href="index.html">Home</a>
            <Icon name="chevron-right" size={14} />
            <a href="index.html#content">Resources</a>
            <Icon name="chevron-right" size={14} />
            <span className="current">MOT advisories explained</span>
          </nav>

          {/* Header */}
          <header className="article-header">
            <div className="article-header-inner">
              <span className="article-tag">{ARTICLE.category}</span>
              <h1 className="article-title">{ARTICLE.title}</h1>
              <p className="article-dek">{ARTICLE.dek}</p>
              <ArticleByline />
            </div>
          </header>

          {/* Two-column layout */}
          <div className="article-layout">
            <article className="article-body" id="article-body">
              {/* Section 1 */}
              <h2 id={SECTIONS[0].id}>{SECTIONS[0].h2}</h2>
              {SECTIONS[0].paras.map((p, i) => <p key={i}>{p}</p>)}

              {/* Section 2 */}
              <h2 id={SECTIONS[1].id}>{SECTIONS[1].h2}</h2>
              {SECTIONS[1].paras.map((p, i) => <p key={i}>{p}</p>)}

              {/* Mid-article CTA */}
              <div className="article-cta">
                <div className="cta-copy">
                  <span className="cta-eyebrow">Free check</span>
                  <h3>Check your vehicle’s MOT history and advisories free</h3>
                </div>
                <a href="index.html" className="btn btn-primary btn-lg">
                  Check my vehicle <Icon name="arrow-right" size={16} />
                </a>
              </div>

              {/* Section 3 */}
              <h2 id={SECTIONS[2].id}>{SECTIONS[2].h2}</h2>
              {SECTIONS[2].paras.map((p, i) => <p key={i}>{p}</p>)}

              {/* Section 4 */}
              <h2 id={SECTIONS[3].id}>{SECTIONS[3].h2}</h2>
              {SECTIONS[3].paras.map((p, i) => <p key={i}>{p}</p>)}

              {/* FAQ */}
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

      {/* Related articles */}
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

      {/* Footer CTA — dark band */}
      <section className="cta-band">
        <div className="container">
          <h2>Never miss your MOT or tax deadline</h2>
          <p>Free reminders at 30, 14 and 1 day before. No account needed.</p>
          <a href="garage.html" className="btn btn-primary btn-lg">
            <Icon name="bell" size={18} /> Set free reminder <Icon name="arrow-right" size={16} />
          </a>
        </div>
      </section>

      <Footer />
    </>
  );
}

// Reuse the homepage FAQ accordion pattern
function FaqItem({ q, children }) {
  return (
    <details className="faq-item">
      <summary>
        <span>{q}</span>
        <span className="icon"><Icon name="plus" size={16} /></span>
      </summary>
      <div className="answer">{children}</div>
    </details>
  );
}

ReactDOM.createRoot(document.getElementById("root")).render(<ArticlePage />);
