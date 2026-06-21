"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Icon } from "./Icon";
import { Header } from "./Header";
import { Footer } from "./Footer";
import { PlateInput, StatusBadge, FaqItem } from "./ui";
import { REMINDERS_ENABLED } from "@/lib/features";

export default function HomeView() {
  const router = useRouter();
  const [vrm, setVrm] = useState("");
  const [vtype, setVtype] = useState("car");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    if (e) e.preventDefault();
    const cleaned = vrm.replace(/\s+/g, "").toUpperCase();
    if (cleaned.length < 2) {
      setError("Enter a valid UK registration number.");
      return;
    }
    setBusy(true);
    setError(null);
    const params = new URLSearchParams({ vrm: cleaned, type: vtype });
    router.push(`/check/?${params.toString()}`);
  };

  return (
    <>
      <Header active="home" />

      {/* HERO */}
      <section className="hero">
        <div className="container">
          <div className="hero-grid">
            <div>
              <span className="badge badge-slate" style={{ fontWeight: 600, padding: "6px 11px" }}>
                <Icon name="shield-check" size={14} /> Official DVSA &amp; DVLA data
              </span>
              <h1 style={{ marginTop: 22 }}>
                Check your <span className="accent">MOT &amp; tax</span><br />in seconds.
              </h1>
              <p className="sub">
                Enter your registration to see live MOT status, full MOT history and current tax status — straight from UK government sources.{REMINDERS_ENABLED ? " Free reminders keep you road‑legal." : ""}
              </p>

              <form className="search-card" onSubmit={handleSubmit}>
                <div className="row">
                  <div>
                    <label className="label" htmlFor="vrm-input">Vehicle registration (VRM)</label>
                    <PlateInput value={vrm} onChange={setVrm} onSubmit={handleSubmit} autoFocus placeholder="AB12 CDE" />
                  </div>
                  <div>
                    <button type="submit" className="btn btn-primary" disabled={busy}>
                      <Icon name="search" size={16} /> {busy ? "Checking…" : "Check MOT & tax"}
                    </button>
                  </div>
                </div>
                {error && (
                  <div style={{ marginTop: 12, color: "var(--red)", fontSize: 14, display: "flex", alignItems: "center", gap: 8 }}>
                    <Icon name="alert-triangle" size={16} /> {error}
                  </div>
                )}
                <div className="meta">
                  <span style={{ display: "inline-flex", alignItems: "center", gap: 6 }}>
                    <Icon name="shield" size={14} /> Official UK data · Free to use
                  </span>
                  <a href="#how" style={{ color: "var(--blue)", fontSize: 13.5, fontWeight: 600 }}>
                    See what you’ll get →
                  </a>
                </div>
              </form>

              <div className="trust-row">
                <span className="pill"><Icon name="check" size={14} /> No card required</span>
                <span className="pill"><Icon name="check" size={14} /> 4.7★ on Trustpilot</span>
                <span className="pill"><Icon name="check" size={14} /> Used 1.2m+ times</span>
              </div>
            </div>

            <HeroDashboard />
          </div>
        </div>
      </section>

      {/* BENEFITS */}
      <section className="section" id="benefits">
        <div className="container">
          <span className="eyebrow">Why RegScan</span>
          <h2>Everything you need to keep your car road‑legal.</h2>
          <p className="lede">One simple check, official sources, and a calendar that nudges you before you’re caught out.</p>
          <div className="three-col">
            <div className="benefit-card featured">
              <div className="ico"><Icon name="list" size={22} /></div>
              <h3>MOT &amp; tax in one place</h3>
              <p>See MOT status, full MOT history and current tax status in a single check — no jumping between government sites.</p>
            </div>
            {REMINDERS_ENABLED ? (
              <div className="benefit-card">
                <div className="ico"><Icon name="bell" size={22} /></div>
                <h3>Never miss an MOT</h3>
                <p>Free email reminders before your MOT and tax fall due, with optional SMS coming soon for any vehicle in your garage.</p>
              </div>
            ) : (
              <div className="benefit-card">
                <div className="ico"><Icon name="shield-check" size={22} /></div>
                <h3>Official, free, no account</h3>
                <p>Straight from the DVSA and DVLA. Free to use with no sign‑up, no card and no catch — just enter a registration.</p>
              </div>
            )}
            <div className="benefit-card">
              <div className="ico"><Icon name="trending" size={22} /></div>
              <h3>Plan ahead with advisories</h3>
              <p>Spot recurring MOT advisories so you can budget for the brake pads, tyres and bushes you’ll need next service.</p>
            </div>
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section className="section" id="how" style={{ paddingTop: 0 }}>
        <div className="container">
          <span className="eyebrow">How it works</span>
          <h2>Three steps. About sixty seconds.</h2>
          <div className="steps">
            <div className="step">
              <span className="num">STEP 01</span>
              <h3>Enter your reg</h3>
              <p>Type your VRM into the yellow plate. We don’t need anything else — no signup, no card, no questions.</p>
              <div className="illust">
                <span className="plate plate-sm">AB12 CDE</span>
                <span style={{ color: "var(--ink-3)" }}>→ instant check</span>
              </div>
            </div>
            <div className="step">
              <span className="num">STEP 02</span>
              <h3>See your MOT, tax &amp; history</h3>
              <p>Status badges, next due dates, full pass/fail history with advisories, mileage and vehicle details.</p>
              <div className="illust" style={{ padding: 12, gap: 8 }}>
                <StatusBadge kind="green">MOT valid</StatusBadge>
                <StatusBadge kind="green">Tax valid</StatusBadge>
              </div>
            </div>
            <div className="step">
              <span className="num">STEP 03</span>
              <h3>Add it to your garage</h3>
              <p>Create a free account to save multiple vehicles{REMINDERS_ENABLED ? ", manage reminders," : ""} and track everyone’s MOTs from one place.</p>
              <div className="illust">
                <Icon name="garage" size={18} />
                <span style={{ color: "var(--ink-2)", fontWeight: 600 }}>Free account · Multiple vehicles</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* REMINDERS BAND */}
      {REMINDERS_ENABLED && (
      <section className="reminders-band" id="reminders">
        <div className="container">
          <div className="reminders-grid">
            <div>
              <span className="eyebrow">Reminders</span>
              <h2>Never forget your MOT or tax again.</h2>
              <p>Free email reminders for every vehicle in your garage. We nudge you at sensible intervals so you’ve got time to book — not after the fact.</p>
              <ul>
                <li><span className="check"><Icon name="check" size={14} /></span><span><strong>Email reminders</strong> at 30, 14, 7 and 1 day before MOT and tax due.</span></li>
                <li><span className="check"><Icon name="check" size={14} /></span><span><strong>SMS reminders</strong> for any UK number — coming soon.</span></li>
                <li><span className="check"><Icon name="check" size={14} /></span><span><strong>Manage multiple vehicles</strong> from one garage — family cars, vans, motorbikes.</span></li>
                <li><span className="check"><Icon name="check" size={14} /></span><span><strong>Unsubscribe anytime</strong> from a single click — no spam, no upsells in email.</span></li>
              </ul>
              <div style={{ display: "flex", gap: 10, marginTop: 22, flexWrap: "wrap" }}>
                <Link href="/garage/" className="btn btn-primary btn-lg"><Icon name="bell" size={18} /> Set up free reminders</Link>
                <Link href="/garage/" className="btn btn-secondary btn-lg">See an example garage</Link>
              </div>
            </div>

            <div className="reminder-mock" aria-hidden="true">
              <div className="head">
                <div>
                  <div style={{ fontWeight: 700 }}>Upcoming reminders</div>
                  <div style={{ fontSize: 13, color: "var(--ink-3)" }}>3 vehicles · email on</div>
                </div>
                <span className="badge badge-green"><span className="dot" />Active</span>
              </div>
              <div className="item">
                <div className="ico amber"><Icon name="calendar" size={18} /></div>
                <div>
                  <div style={{ fontWeight: 700, fontSize: 14.5 }}>Family car · MOT due</div>
                  <div style={{ fontSize: 13, color: "var(--ink-3)" }}>4 Jun 2026 — reminder in 9 days</div>
                </div>
                <span className="plate plate-sm">LF19 XKM</span>
              </div>
              <div className="item">
                <div className="ico"><Icon name="pound" size={18} /></div>
                <div>
                  <div style={{ fontWeight: 700, fontSize: 14.5 }}>Work van · Tax due</div>
                  <div style={{ fontSize: 13, color: "var(--ink-3)" }}>30 Sep 2026 — reminder in 4 mo</div>
                </div>
                <span className="plate plate-sm">VN64 WRK</span>
              </div>
              <div className="item">
                <div className="ico" style={{ background: "var(--green-tint)", color: "var(--green)" }}>
                  <Icon name="check-circle" size={18} />
                </div>
                <div>
                  <div style={{ fontWeight: 700, fontSize: 14.5 }}>Weekend EV · all good</div>
                  <div style={{ fontSize: 13, color: "var(--ink-3)" }}>No reminders due in the next 90 days</div>
                </div>
                <span className="plate plate-sm">EV70 RUN</span>
              </div>
            </div>
          </div>
        </div>
      </section>
      )}

      {/* UPSELL TILES */}
      <section className="section section-white" id="upsell">
        <div className="container">
          <span className="eyebrow">Plan your next move</span>
          <h2>Smart next steps from trusted partners.</h2>
          <p className="lede">Optional extras when you want them. Skip them when you don’t.</p>
          <div className="three-col">
            <div className="upsell-tile">
              <span className="partner-tag">Partner</span>
              <div className="ico"><Icon name="trending" size={22} /></div>
              <h3>Get an instant car valuation</h3>
              <p>Free market valuation in 30 seconds. See what your car is worth before you sell, trade in or remortgage.</p>
              <div className="row-foot">
                <span className="price">Free · Cap HPI</span>
                <a href="#" className="btn btn-secondary btn-sm">Get valuation <Icon name="arrow-right" size={14} /></a>
              </div>
            </div>
            <div className="upsell-tile">
              <span className="partner-tag">Sponsored</span>
              <div className="ico"><Icon name="shield" size={22} /></div>
              <h3>Compare insurance quotes</h3>
              <p>Use your VRM to pull instant quotes from 100+ UK insurers. Drivers save £200 on average at renewal.</p>
              <div className="row-foot">
                <span className="price">Free · Confused.com</span>
                <a href="#" className="btn btn-secondary btn-sm">Check insurance <Icon name="arrow-right" size={14} /></a>
              </div>
            </div>
            <div className="upsell-tile">
              <span className="partner-tag">Partner</span>
              <div className="ico"><Icon name="list" size={22} /></div>
              <h3>Full vehicle history check</h3>
              <p>Outstanding finance, write‑off, stolen, mileage anomalies and previous keepers. Essential before you buy.</p>
              <div className="row-foot">
                <span className="price">From £9.99 · HPI</span>
                <a href="#" className="btn btn-secondary btn-sm">View checks <Icon name="arrow-right" size={14} /></a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CONTENT / SEO */}
      <section className="section" id="content">
        <div className="container">
          <span className="eyebrow">The basics</span>
          <h2>Everything you need to know about MOT and tax.</h2>
          <div className="content-two-col">
            <div>
              <h3>What is an MOT and when is it due?</h3>
              <p>The MOT is the annual test that confirms your vehicle meets the UK’s road safety and environmental standards. Cars need their first MOT at three years old, then every year after. You can MOT a car up to one month (minus a day) before the current certificate expires and keep your renewal date.</p>
              <h3>What happens if you drive without a valid MOT?</h3>
              <p>You can be fined up to £1,000, and your insurance may be invalidated. The only journey you can legally make is to a pre‑booked MOT test, or to a garage for repairs that the MOT requires. Police ANPR cameras read plates and flag vehicles without a valid MOT, so it’s very easy to be caught.</p>
              <h3>How vehicle tax works in the UK</h3>
              <p>Vehicle Excise Duty (VED), commonly called road tax, is required for almost every vehicle used or kept on UK roads. You can pay monthly, every six months, or annually. If you’re not using the vehicle, you can declare it off‑road with a SORN — but it must be kept on private land.</p>
              <h3>What MOT advisories mean</h3>
              <p>Advisories are issues that didn’t fail the test but need attention soon. Watch for the same advisory repeating across years — that often means a worsening issue (tyres, brakes, suspension) that will become a fail next time. RegScan highlights these patterns automatically.</p>
              <h3>Buying a used car? How to use MOT history</h3>
              <p>Run the VRM through RegScan before you view. Compare mileage between tests — sudden drops or implausible jumps can signify a clock that’s been wound back. Repeat fails for the same item suggest deferred maintenance. A clean string of passes with low advisories is a strong signal of a well‑kept vehicle.</p>
            </div>

            <aside className="content-side">
              <h4>Quick reference</h4>
              <ul>
                <li><span className="bullet" /><span><strong>First MOT:</strong> 3 years from registration (most cars).</span></li>
                <li><span className="bullet" /><span><strong>MOT renewal window:</strong> up to 1 month before, no penalty.</span></li>
                <li><span className="bullet" /><span><strong>Tax bands:</strong> based on CO₂ for cars registered after 2017.</span></li>
                <li><span className="bullet" /><span><strong>SORN:</strong> required if vehicle is off public roads.</span></li>
                <li><span className="bullet" /><span><strong>Free advice:</strong> <a href="https://www.gov.uk/mot-reminder" target="_blank" rel="noreferrer">gov.uk/mot</a></span></li>
              </ul>
              <div className="divider" />
              <h4>Data sources</h4>
              <p style={{ fontSize: 14, color: "var(--ink-2)", marginTop: 8, lineHeight: 1.55 }}>
                MOT data: DVSA MOT History API. Vehicle &amp; tax data: DVLA Vehicle Enquiry Service. Updated continuously.
              </p>
            </aside>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="section section-bg2" id="faq">
        <div className="container">
          <span className="eyebrow">FAQs</span>
          <h2>Common questions.</h2>
          <div className="faq">
            <FaqItem q="Is the data official?">
              Yes. We use the DVSA MOT History API and the DVLA Vehicle Enquiry Service — the same data sources the gov.uk pages use. We don’t edit or interpret it; you see exactly what the government records show.
            </FaqItem>
            <FaqItem q="Do I need to pay to check my MOT or tax?">
              No. Running an MOT and tax check is free and unlimited. Some optional partner services (deeper history reports, insurance quotes, valuations) may have their own pricing and are clearly labelled.
            </FaqItem>
            {REMINDERS_ENABLED && (
              <FaqItem q="Do I need an account to get reminders?">
                You can ask for reminders for a single vehicle with just your email — no account needed. Create a free account to track multiple vehicles, edit reminder timings, and switch between email and (soon) SMS.
              </FaqItem>
            )}
            <FaqItem q="Can I add more than one vehicle?">
              Yes. Your garage supports an unlimited number of vehicles. Useful for families, fleet drivers, classic car owners, and anyone who has more than one set of plates to keep track of.
            </FaqItem>
            {REMINDERS_ENABLED && (
              <FaqItem q="How do I stop reminders?">
                Every reminder email contains a one‑click unsubscribe link for that vehicle, plus a “stop all reminders” link. Logged‑in users can also toggle reminders per vehicle from the garage at any time.
              </FaqItem>
            )}
            <FaqItem q="Is RegScan affiliated with the DVSA, DVLA or gov.uk?">
              No. RegScan is an independent service that consumes the official open APIs. We’re not part of any government body, and we don’t represent ourselves as such.
            </FaqItem>
          </div>
        </div>
      </section>

      <Footer />
    </>
  );
}

function HeroDashboard() {
  const notifications = [
    REMINDERS_ENABLED
      ? { tone: "green", label: "MOT reminder scheduled", meta: "AB12 CDE" }
      : { tone: "green", label: "MOT valid", meta: "AB12 CDE" },
    { tone: "amber", label: "ULEZ charges apply", meta: "ZE14 ABX" },
    { tone: "red", label: "Advisory flagged", meta: "rear brake wear" },
  ];
  const [idx, setIdx] = useState(0);
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    let active = true;
    const tick = () => {
      if (!active) return;
      setVisible(false);
      setTimeout(() => {
        if (!active) return;
        setIdx((i) => (i + 1) % notifications.length);
        setVisible(true);
      }, 400);
    };
    const id = setInterval(tick, 4000);
    return () => { active = false; clearInterval(id); };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const n = notifications[idx];

  return (
    <div className="hero-floats" aria-hidden="true">
      <div className="hf-card hf-card--mot">
        <span className="dotrow green" />
        <div>
          <div className="hf-card__title">MOT valid</div>
          <div className="hf-card__meta">expires 14 Mar 2026</div>
        </div>
      </div>
      <div className="hf-card hf-card--tax">
        <span className="dotrow green" />
        <div>
          <div className="hf-card__title">Tax active</div>
          <div className="hf-card__meta">due 01 Aug 2026</div>
        </div>
      </div>
      <div className="hf-card hf-card--ulez">
        <span className="dotrow amber" />
        <div>
          <div className="hf-card__title">ULEZ charges apply</div>
          <div className="hf-card__meta">£12.50 / day · inner London</div>
        </div>
      </div>
      {REMINDERS_ENABLED && (
        <div className="hf-card hf-card--reminder">
          <span className="dotrow green" />
          <div>
            <div className="hf-card__title">Reminder set</div>
            <div className="hf-card__meta">30 days before</div>
          </div>
        </div>
      )}
      <div className="hf-advisory">
        <div className="hf-advisory__head">
          <span className="hf-advisory__chip"><Icon name="alert-triangle" size={13} /> Advisory</span>
          <span className="hf-advisory__plate plate plate-sm">AB12 CDE</span>
        </div>
        <div className="hf-advisory__title">Rear brake discs</div>
        <div className="hf-advisory__body">
          Noted at last MOT · 8,200 miles ago. Typically need attention within 10,000 miles.
        </div>
      </div>
      <div className={"hf-notif " + (visible ? "is-visible" : "")}>
        <span className={"dotrow " + n.tone} />
        <span className="hf-notif__label">{n.label}</span>
        <span className="hf-notif__meta">{n.meta}</span>
      </div>
    </div>
  );
}
