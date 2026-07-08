"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { Icon } from "./Icon";
import { Header } from "./Header";
import { Footer } from "./Footer";
import { Toast, StatusBadge } from "./ui";
import { getVehicle, computeHealth, formatDate, makeLogoSrc, recurringAdvisories } from "@/lib/mockData";
import { chargeStatusNow } from "@/lib/charges";
import { REMINDERS_ENABLED, GARAGE_ENABLED } from "@/lib/features";

const titleCase = (s) =>
  String(s || "").toLowerCase().replace(/\b\w/g, (c) => c.toUpperCase());

const monthYear = (iso) => {
  const d = new Date(iso);
  return d.toLocaleDateString("en-GB", { month: "short", year: "numeric" });
};

// Interpreted ratings for the metric cards.
const ageRating = (y) =>
  y == null ? null : y <= 3 ? { label: "New", kind: "good" } : y <= 7 ? { label: "Average", kind: "good" } : y <= 12 ? { label: "Getting on", kind: "warn" } : { label: "Old", kind: "bad" };
const yearlyRating = (m) =>
  m == null ? null : m < 6000 ? { label: "Low", kind: "good" } : m < 10000 ? { label: "Average", kind: "good" } : m < 15000 ? { label: "High", kind: "warn" } : { label: "Very high", kind: "bad" };
const mileageRating = (actual, expected) =>
  actual == null || !expected ? null : actual < expected * 0.6 ? { label: "Low", kind: "good" } : actual < expected * 1.1 ? { label: "Average", kind: "good" } : actual < expected * 1.5 ? { label: "High", kind: "warn" } : { label: "Very high", kind: "bad" };
const co2Rating = (g) =>
  g == null ? null : g === 0 ? { label: "Zero", kind: "good" } : g < 100 ? { label: "Low", kind: "good" } : g < 150 ? { label: "Average", kind: "good" } : g < 190 ? { label: "High", kind: "warn" } : { label: "Very high", kind: "bad" };
const daysBetween = (iso) => (iso ? Math.round((new Date(iso).getTime() - Date.now()) / 86_400_000) : null);

function buildModel(v) {
  const health = computeHealth(v);
  const latest = v.motTests && v.motTests[0];
  const openAdvisories = latest ? latest.defects.filter((d) => d.type === "advisory") : [];
  const roadLegal = v.motStatus !== "expired" && v.taxStatus !== "expired";

  // At-a-glance verdict chips — positive (green) when good, amber when not.
  const hasHistory = (v.motTests || []).length > 0;
  const totalTests = (v.motTests || []).length;
  const recurringList = recurringAdvisories(v).map((g) => ({
    text: g.text,
    count: g.count,
    total: totalTests,
    years: [...new Set(g.dates.map((d) => (d || "").slice(0, 4)).filter(Boolean))].sort(),
  }));
  const recurring = recurringList.length;

  // --- Positives / Negatives summary (good vs needs-attention) ---
  const positives = [];
  const negatives = [];
  if (v.motStatus === "valid") positives.push({ text: "MOT valid" });
  else if (v.motStatus === "due-soon") negatives.push({ text: "MOT due soon" });
  else if (v.motStatus === "expired") negatives.push({ text: "MOT expired" });
  if (v.taxStatus === "valid") positives.push({ text: "Tax active" });
  else if (v.taxStatus === "expired") negatives.push({ text: "Untaxed" });
  else if (v.taxStatus === "sorn") negatives.push({ text: "Declared SORN" });
  if (v.hasOutstandingRecall) negatives.push({ text: "Outstanding safety recall" });
  else positives.push({ text: "No outstanding recalls" });
  if (hasHistory) {
    if (openAdvisories.length) negatives.push({ text: `${openAdvisories.length} advisor${openAdvisories.length === 1 ? "y" : "ies"} at last MOT`, scrollId: "advisories" });
    else positives.push({ text: "No advisories at last MOT" });
    if (recurring) negatives.push({ text: `${recurring} recurring advisor${recurring === 1 ? "y" : "ies"}`, scrollId: "recurring-issues" });
    else positives.push({ text: "No recurring faults" });
    if ((v.motTests || []).some((t) => t.result === "fail")) negatives.push({ text: "Has failed an MOT before" });
    else positives.push({ text: "Never failed an MOT" });
  }
  if (v.ulez && v.ulez.chargeable) negatives.push({ text: "ULEZ charges apply" });
  else positives.push({ text: "ULEZ compliant" });
  if (v.markedForExport) negatives.push({ text: "Marked for export" });

  // --- Metric cards with interpreted ratings ---
  const ageYears = v.year ? new Date().getFullYear() - v.year : null;
  const latestMileage = (v.motTests || []).map((t) => t.mileage).find((mi) => mi != null) ?? null;
  const unit = v.mileageUnit === "km" ? "km" : "mi";
  const perYear = latestMileage != null && ageYears ? Math.round(latestMileage / ageYears) : null;
  const passes = (v.motTests || []).filter((t) => t.result === "pass").length;
  const mRating = mileageRating(latestMileage, ageYears ? ageYears * 7500 : null);
  if (mRating && (mRating.kind === "warn" || mRating.kind === "bad")) negatives.push({ text: "High mileage for its age" });

  // Tax card (now that DVLA is live) with a due-date countdown.
  const taxDays = daysBetween(v.taxExpiry);
  let taxCard = null;
  if (v.taxStatus === "valid") {
    taxCard = { icon: "pound", label: "Tax", value: "Taxed", rating: taxDays != null ? { label: taxDays >= 0 ? `${taxDays}d left` : "Due", kind: taxDays > 30 ? "good" : "warn" } : { label: "Valid", kind: "good" } };
  } else if (v.taxStatus === "expired") {
    taxCard = { icon: "pound", label: "Tax", value: "Untaxed", rating: { label: "Overdue", kind: "bad" } };
  } else if (v.taxStatus === "sorn") {
    taxCard = { icon: "pound", label: "Tax", value: "SORN", rating: { label: "Off-road", kind: "warn" } };
  }

  const metrics = [];
  if (taxCard) metrics.push(taxCard);
  if (ageYears != null) metrics.push({ icon: "calendar", label: "Age", value: `${ageYears} yr${ageYears === 1 ? "" : "s"}`, rating: ageRating(ageYears) });
  if (latestMileage != null) metrics.push({ icon: "trending", label: "Mileage", value: `${latestMileage.toLocaleString()} ${unit}`, rating: mRating });
  if (perYear != null) metrics.push({ icon: "trending", label: "Yearly mileage", value: `${perYear.toLocaleString()} ${unit}`, rating: yearlyRating(perYear) });
  if (v.co2 != null) metrics.push({ icon: "trending", label: "CO₂ emissions", value: `${v.co2} g/km`, rating: co2Rating(v.co2) });
  if (totalTests) {
    const pct = Math.round((passes / totalTests) * 100);
    metrics.push({ icon: "check-circle", label: "MOT pass rate", value: `${pct}%`, rating: pct >= 80 ? { label: "Good", kind: "good" } : pct >= 60 ? { label: "Mixed", kind: "warn" } : { label: "Poor", kind: "bad" } });
  }

  const emissions = {
    fuel: v.fuel && v.fuel !== "—" ? titleCase(v.fuel) : "—",
    co2: v.co2 != null ? `${v.co2} g/km` : "—",
    co2Rating: co2Rating(v.co2),
    euro: v.euroStatus && v.euroStatus !== "—" ? v.euroStatus : "—",
    rde: v.realDrivingEmissions || null,
  };

  const meta = [
    v.colour,
    v.fuel && v.fuel !== "—" ? titleCase(v.fuel) : null,
    v.year != null ? String(v.year) : null,
    v.engineCc ? `${(v.engineCc / 1000).toFixed(1)}L` : null,
    v.euroStatus && v.euroStatus !== "—" ? v.euroStatus : null,
  ].filter(Boolean);

  const motCompliance = {
    expired: { kind: "warn", icon: "alert-triangle", title: "MOT expired", meta: `Expired ${formatDate(v.motExpiry, { short: true })}` },
    "due-soon": { kind: "warn", icon: "alert-triangle", title: "MOT due soon", meta: `Expires ${formatDate(v.motExpiry, { short: true })}` },
    valid: { kind: "good", icon: "check", title: "MOT valid", meta: `Expires ${formatDate(v.motExpiry, { short: true })}` },
    unknown: { kind: "warn", icon: "alert-triangle", title: "MOT status unknown", meta: "No MOT history found" },
  };
  const taxCompliance = {
    expired: { kind: "warn", icon: "alert-triangle", title: "Untaxed", meta: `Expired ${formatDate(v.taxExpiry, { short: true })}` },
    sorn: { kind: "warn", icon: "alert-triangle", title: "SORN declared", meta: "Off the road" },
    valid: { kind: "good", icon: "check", title: "Tax active", meta: `Renews ${formatDate(v.taxExpiry, { short: true })}` },
    unknown: { kind: "warn", icon: "alert-triangle", title: "Tax status unknown", meta: "DVLA data unavailable" },
  };

  const compliance = [
    motCompliance[v.motStatus] || motCompliance.unknown,
    taxCompliance[v.taxStatus] || taxCompliance.unknown,
    v.ulez && v.ulez.chargeable
      ? { kind: "warn", icon: "alert-triangle", title: "ULEZ charges apply", meta: v.ulez.note }
      : { kind: "good", icon: "check", title: "ULEZ compliant", meta: "No daily charge" },
  ];
  if (REMINDERS_ENABLED) {
    compliance.push({ kind: "good", icon: "check", title: "Reminder enabled", meta: "30 days before MOT" });
  }

  if (v.hasOutstandingRecall) {
    compliance.unshift({
      kind: "warn",
      icon: "alert-triangle",
      title: "Safety recall outstanding",
      meta: "Manufacturer recall not yet resolved",
    });
  }

  const specs = [
    { k: "Fuel type", v: titleCase(v.fuel) },
    { k: "Engine size", v: v.engineCc ? `${v.engineCc.toLocaleString()} cc` : "—" },
    { k: "Type approval category", v: v.typeApproval || "—" },
    { k: "Body type", v: v.bodyType || "—" },
    { k: "Number of doors", v: v.doors != null ? String(v.doors) : "—" },
    { k: "Date first registered", v: formatDate(v.firstRegistered) },
    { k: "V5C (log book) last issued", v: v.v5cIssued ? formatDate(v.v5cIssued) : "—" },
    { k: "Previous keepers", v: v.previousKeepers != null ? String(v.previousKeepers) : "—" },
    { k: "Wheelplan", v: v.wheelplan || "—" },
    { k: "Vehicle colour", v: v.colour || "—" },
  ];
  if (v.markedForExport) specs.push({ k: "Marked for export", v: "Yes" });
  // Optional DVLA VES extras — only shown when present, to avoid clutter.
  if (v.realDrivingEmissions) specs.push({ k: "Real Driving Emissions (RDE)", v: String(v.realDrivingEmissions) });
  if (v.revenueWeight) specs.push({ k: "Revenue weight", v: `${v.revenueWeight.toLocaleString()} kg` });
  if (v.taxArtEnd) specs.push({ k: "Additional-rate tax until", v: formatDate(v.taxArtEnd) });

  // Trust signal: surface any registration the car carried at a past MOT that
  // differs from its current plate (private-plate transfer, or a possible clone).
  const curPlate = String(v.vrm || "").replace(/\s+/g, "").toUpperCase();
  const priorPlates = [
    ...new Set(
      (v.motTests || [])
        .map((t) => String(t.registrationAtTest || "").replace(/\s+/g, "").toUpperCase())
        .filter((p) => p && p !== curPlate)
    ),
  ];
  if (priorPlates.length) {
    specs.push({ k: "Previous registration", v: priorPlates.join(", ") });
  }

  const mileage = (v.motTests || [])
    .filter((t) => t.mileage != null)
    .slice()
    .reverse()
    .map((t) => ({ label: monthYear(t.date), value: t.mileage }));

  const advisories = openAdvisories.map((d) => {
    const safety = /brake|tyre|tire|steering|suspension/i.test(d.text);
    return {
      title: d.text,
      meta: `Noted at last MOT · ${formatDate(latest.date, { short: true })}`,
      body: safety ? "Safety-related — book in soon to avoid a future failure." : "Monitor and replace before next MOT.",
      urgency: safety ? "Action soon" : "Monitor",
      urgencyKind: safety ? "amber" : "grey",
    };
  });

  const history = (v.motTests || []).map((t) => {
    const adv = t.defects.filter((d) => d.type === "advisory").length;
    const fails = t.defects.filter((d) => d.type === "major" || d.type === "dangerous").length;
    const detailLabel =
      t.result === "fail"
        ? `${fails} ${fails === 1 ? "failure" : "failures"}`
        : `${adv} ${adv === 1 ? "advisory" : "advisories"}`;
    const plateAtTest = String(t.registrationAtTest || "").replace(/\s+/g, "").toUpperCase();
    return {
      date: formatDate(t.date),
      result: t.result,
      mileage: t.mileage != null ? t.mileage.toLocaleString() : "—",
      items: t.defects,
      detailLabel,
      testNumber: t.testNumber || null,
      expiry: t.expiryDate ? formatDate(t.expiryDate, { short: true }) : null,
      plateAtTest: plateAtTest && plateAtTest !== curPlate ? t.registrationAtTest : null,
    };
  });

  return {
    vrm: v.vrm,
    monogram: v.monogram,
    logoSrc: makeLogoSrc(v.make),
    positives,
    negatives,
    metrics,
    emissions,
    recurring: recurringList,
    name: `${titleCase(v.make)} ${v.model}`,
    meta,
    health,
    roadLegal,
    advisoryCount: openAdvisories.length,
    compliance,
    // Hide rows we have no data for (e.g. body type, doors, previous keepers —
    // not available from DVSA/DVLA) so the card only shows real values.
    specs: specs.filter((s) => s.v != null && s.v !== "—"),
    mileage,
    mileageUnit: v.mileageUnit || "mi",
    recall: !!v.hasOutstandingRecall,
    advisories,
    history,
  };
}

export default function ResultsView({ vehicle, vrm, notFound, airQuality }) {
  // Prefer server-fetched data; fall back to the mock so the app runs without keys.
  const v = vehicle || getVehicle(vrm) || (notFound ? null : getVehicle("AB12CDE"));
  const m = useMemo(() => (v ? buildModel(v) : null), [v]);
  const [toast, setToast] = useState(null);
  // Charge status depends on the current time, so compute on the client after mount
  // to keep it accurate and avoid a server/client hydration mismatch.
  const [charges, setCharges] = useState(null);
  useEffect(() => setCharges(chargeStatusNow()), []);

  const scrollToId = (id) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  if (!m) {
    return (
      <>
        <Header active="home" />
        <main className="results-page">
          <div className="container">
            <div className="vehicle-profile" style={{ textAlign: "center", padding: "48px 24px" }}>
              <h1 className="vp-name">No vehicle found</h1>
              <p style={{ color: "var(--ink-3)", marginTop: 8 }}>
                We couldn&apos;t find a vehicle with the registration{" "}
                <strong>{vrm}</strong>. Check the plate and try again.
              </p>
              <div style={{ marginTop: 20 }}>
                <Link href="/" className="btn btn-primary">Back to search</Link>
              </div>
            </div>
          </div>
        </main>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Header active="home" />

      <main className="results-page">
        <div className="container">
          <nav className="results-breadcrumb" aria-label="Breadcrumb">
            <Link href="/">Home</Link>
            <Icon name="chevron-right" size={14} />
            <span className="current">Vehicle check</span>
          </nav>

          <div className="results-layout">
            <ResultsNav />
            <div className="results-main">

          {/* VEHICLE PROFILE — control centre */}
          <div className="vehicle-profile" id="overview" data-nav="Overview">
            <div className="vp-main">
              <div className="vp-identity">
                <div className="vp-plate-row">
                  {m.logoSrc ? (
                    /* eslint-disable-next-line @next/next/no-img-element */
                    <img className="vp-logo" src={m.logoSrc} alt={`${m.name.split(" ")[0]} logo`} />
                  ) : (
                    <span className="vp-monogram" aria-hidden="true">{m.monogram}</span>
                  )}
                  <span className="plate plate-lg">{m.vrm}</span>
                </div>
                <h1 className="vp-name">{m.name}</h1>
                <div className="vp-meta">
                  {m.meta.map((x, i) => (
                    <span key={i} style={{ display: "contents" }}>
                      {i > 0 && <span className="dot-sep" aria-hidden="true" />}
                      <span>{x}</span>
                    </span>
                  ))}
                </div>
                <div className="vp-pn">
                  <div className="vp-pn-col">
                    <div className="vp-pn-head">
                      Positives <span className="vp-pn-count pos">{m.positives.length}</span>
                    </div>
                    <ul>
                      {m.positives.length === 0 && <li className="vp-pn-none">Nothing notable</li>}
                      {m.positives.map((p, i) => (
                        <li key={i}><span className="vp-pn-arrow pos">↑</span>{p.text}</li>
                      ))}
                    </ul>
                  </div>
                  <div className="vp-pn-col">
                    <div className="vp-pn-head">
                      Negatives <span className="vp-pn-count neg">{m.negatives.length}</span>
                    </div>
                    <ul>
                      {m.negatives.length === 0 && <li className="vp-pn-none">Nothing flagged</li>}
                      {m.negatives.map((n, i) => (
                        <li key={i}>
                          <span className="vp-pn-arrow neg">↓</span>
                          {n.scrollId ? (
                            <button type="button" className="vp-pn-link" onClick={() => scrollToId(n.scrollId)}>{n.text}</button>
                          ) : (
                            n.text
                          )}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>

              <div className="vp-health">
                <HealthRing score={m.health.score} />
                <div className="vp-health-text">
                  <div className="vp-health-label">Vehicle health</div>
                  <div className="vp-health-state">
                    <span className={"dotrow " + (m.health.score >= 80 ? "green" : m.health.score >= 40 ? "amber" : "red")} />{m.health.state}
                  </div>
                  <div className="vp-health-note">{m.health.note}</div>
                </div>
              </div>
            </div>

            <div className="vp-status">
              {m.compliance.map((c, i) => (
                <div className="vp-status-item" key={i}>
                  <span className={"vp-status-ico " + c.kind}>
                    <Icon name={c.icon} size={16} stroke={2.5} />
                  </span>
                  <div>
                    <div className="t">{c.title}</div>
                    <div className="m">{c.meta}</div>
                  </div>
                </div>
              ))}
            </div>

            <div className="vp-footer">
              <span className="vp-footer-meta">
                <Icon name="shield" size={15} /> Checked today · Official DVSA &amp; DVLA data
              </span>
              {GARAGE_ENABLED && (
                <button className="btn btn-primary" onClick={() => setToast("Saved to your garage")}>
                  <Icon name="garage" size={16} /> Save to garage
                </button>
              )}
            </div>
          </div>

          {/* AT A GLANCE — metric cards with ratings */}
          {m.metrics.length > 0 && (
            <section className="results-section" id="at-a-glance" data-nav="At a glance">
              <h2>At a glance</h2>
              <div className="metric-grid">
                {m.metrics.map((mc, i) => (
                  <div className="metric-card" key={i}>
                    <div className="metric-top">
                      <span className="metric-label"><Icon name={mc.icon} size={16} /> {mc.label}</span>
                      {mc.rating && <span className={"metric-badge " + mc.rating.kind}>{mc.rating.label}</span>}
                    </div>
                    <div className="metric-value">{mc.value}</div>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* VEHICLE DETAILS */}
          <section className="results-section" id="details" data-nav="Vehicle details">
            <h2>Vehicle details</h2>
            <div className="spec-card">
              {m.specs.map((s, i) => (
                <div className="spec-row" key={i}>
                  <span className="k">{s.k}</span>
                  <span className="v">{s.v}</span>
                </div>
              ))}
            </div>
          </section>

          {/* EMISSIONS & ENVIRONMENT */}
          <section className="results-section" id="emissions" data-nav="Emissions">
            <h2>Emissions &amp; environment</h2>
            <div className="spec-card">
              <div className="spec-row">
                <span className="k">CO₂ emissions</span>
                <span className="v">
                  {m.emissions.co2}
                  {m.emissions.co2Rating && (
                    <span className={"metric-badge " + m.emissions.co2Rating.kind} style={{ marginLeft: 8 }}>
                      {m.emissions.co2Rating.label}
                    </span>
                  )}
                </span>
              </div>
              <div className="spec-row">
                <span className="k">Euro emissions standard</span>
                <span className="v">{m.emissions.euro}</span>
              </div>
              {m.emissions.rde && (
                <div className="spec-row">
                  <span className="k">Real Driving Emissions (RDE)</span>
                  <span className="v">{m.emissions.rde}</span>
                </div>
              )}
            </div>
          </section>

          {/* LONDON CHARGE ZONES & AIR QUALITY */}
          {(charges || airQuality) && (
            <section className="results-section" id="charges" data-nav="Charges & air">
              <h2>London charge zones &amp; air quality</h2>
              <div className="spec-card">
                {charges && (
                  <>
                    <div className="spec-row">
                      <span className="k">Congestion Charge</span>
                      <span className="v">{charges.congestion.note}</span>
                    </div>
                    <div className="spec-row">
                      <span className="k">ULEZ</span>
                      <span className="v">{charges.ulez.note}</span>
                    </div>
                  </>
                )}
                {airQuality && (
                  <div className="spec-row">
                    <span className="k">
                      London air quality today{airQuality.band ? ` · ${airQuality.band}` : ""}
                    </span>
                    <span className="v">{airQuality.summary || "—"}</span>
                  </div>
                )}
                {airQuality && airQuality.future && (
                  <div className="spec-row">
                    <span className="k">
                      Air quality forecast{airQuality.future.band ? ` · ${airQuality.future.band}` : ""}
                    </span>
                    <span className="v">{airQuality.future.summary || "—"}</span>
                  </div>
                )}
              </div>
            </section>
          )}

          {/* ADVISORIES */}
          {m.advisories.length > 0 && (
            <section className="results-section" id="advisories" data-nav="Advisories">
              <h2>Advisories from last MOT</h2>
              <div className="advisory-list">
                {m.advisories.map((a, i) => (
                  <div className="advisory-row" key={i}>
                    <div>
                      <div className="adv-title">{a.title}</div>
                      <div className="adv-meta">{a.meta}</div>
                      <div className="adv-body">{a.body}</div>
                    </div>
                    <span className={"badge badge-" + a.urgencyKind + " adv-urgency"}>
                      <span className="dot" />{a.urgency}
                    </span>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* RECURRING ISSUES */}
          {m.recurring.length > 0 && (
            <section className="results-section" id="recurring-issues" data-nav="Recurring issues">
              <h2>Recurring issues</h2>
              <p style={{ fontSize: 14, color: "var(--ink-3)", margin: "-4px 0 16px", maxWidth: 640 }}>
                The same fault flagged at more than one MOT. A repeat advisory can mean a problem
                that hasn’t been fully resolved — worth getting checked.
              </p>
              <div className="advisory-list">
                {m.recurring.map((r, i) => (
                  <div className="advisory-row" key={i}>
                    <div>
                      <div className="adv-title">{r.text}</div>
                      <div className="adv-meta">
                        Flagged at {r.count} of {r.total} MOTs · {r.years.join(", ")}
                      </div>
                    </div>
                    <span className="badge badge-amber adv-urgency">
                      <span className="dot" />×{r.count}
                    </span>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* MILEAGE HISTORY */}
          {m.mileage.length > 1 && (
            <section className="results-section" id="mileage" data-nav="Mileage">
              <h2>Mileage history</h2>
              <div className="chart-card">
                <MileageChart data={m.mileage} />
                <p className="chart-note">
                  Mileage recorded at each MOT test. Inconsistent readings may indicate odometer tampering.
                </p>
              </div>
            </section>
          )}

          {/* MOT HISTORY TIMELINE */}
          <section className="results-section" id="mot-history" data-nav="MOT history">
            <h2>MOT history</h2>
            <div className="timeline-card" style={{ marginTop: 20 }}>
              <div className="timeline">
                {m.history.map((t, i) => (
                  <MotRow key={i} test={t} unit={m.mileageUnit} defaultOpen={i === 0} />
                ))}
              </div>
            </div>
          </section>
            </div>
          </div>
        </div>

        {/* REMINDERS CTA */}
        {REMINDERS_ENABLED && (
          <section className="cta-band">
            <div className="container">
              <h2>Never miss an MOT or tax deadline</h2>
              <p>Free email reminders at 30, 14 and 1 day before. No account required.</p>
              <button className="btn btn-primary btn-lg" onClick={() => setToast("Reminder set — we'll email you")}>
                <Icon name="bell" size={18} /> Set free reminder
              </button>
            </div>
          </section>
        )}

        {/* SMART NEXT STEPS */}
        <section className="section section-white">
          <div className="container">
            <span className="eyebrow">Plan your next move</span>
            <h2>Smart next steps from trusted partners.</h2>
            <p className="lede">Optional extras when you want them. Skip them when you don’t.</p>
            <div className="three-col">
              <div className="upsell-tile">
                <span className="partner-tag">Partner</span>
                <div className="ico"><Icon name="trending" size={22} /></div>
                <h3>Get an instant car valuation</h3>
                <p>Free market valuation in 30 seconds. See what your car is worth before you sell or trade in.</p>
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
                  <a href="#" className="btn btn-secondary btn-sm">Compare quotes <Icon name="arrow-right" size={14} /></a>
                </div>
              </div>
              <div className="upsell-tile">
                <span className="partner-tag">Partner</span>
                <div className="ico"><Icon name="list" size={22} /></div>
                <h3>Full vehicle history check</h3>
                <p>Outstanding finance, write‑off, stolen, mileage anomalies and previous keepers. Essential before you buy.</p>
                <div className="row-foot">
                  <span className="price">From £9.99 · Provenance</span>
                  <a href="#" className="btn btn-secondary btn-sm">View checks <Icon name="arrow-right" size={14} /></a>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
      {toast && <Toast onDone={() => setToast(null)}>{toast}</Toast>}
    </>
  );
}

// Sticky section nav for the results page. Builds itself from [data-nav]
// sections in the DOM (so it auto-syncs with whatever sections render) and
// highlights the section currently in view.
function ResultsNav() {
  const [items, setItems] = useState([]);
  const [active, setActive] = useState(null);
  useEffect(() => {
    const els = Array.from(document.querySelectorAll("[data-nav]"));
    const list = els.map((el) => ({ id: el.id, label: el.getAttribute("data-nav") }));
    setItems(list);
    const onScroll = () => {
      let cur = list[0]?.id;
      for (const it of list) {
        const el = document.getElementById(it.id);
        if (el && el.getBoundingClientRect().top <= 120) cur = it.id;
      }
      setActive(cur);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const go = (e, id) => {
    e.preventDefault();
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <aside className="results-nav">
      <nav className="results-nav-inner" aria-label="Sections">
        {items.map((it) => (
          <a key={it.id} href={`#${it.id}`} className={active === it.id ? "active" : ""} onClick={(e) => go(e, it.id)}>
            {it.label}
          </a>
        ))}
      </nav>
    </aside>
  );
}

function MotRow({ test, unit, defaultOpen }) {
  const [open, setOpen] = useState(!!defaultOpen);
  const isPass = test.result === "pass";
  const unitLabel = unit === "km" ? "km" : "miles";
  return (
    <div className={"tl-item " + (isPass ? "" : "fail") + (open ? " expanded" : "")}>
      <div className="marker">
        <Icon name={isPass ? "check" : "x"} size={12} stroke={3} />
      </div>
      <div className="top" onClick={() => setOpen((o) => !o)}>
        <div>
          <div className="date">{test.date}</div>
          <div style={{ fontSize: 13, color: "var(--ink-3)", marginTop: 4 }}>
            {test.mileage}{test.mileage !== "—" ? ` ${unitLabel}` : ""} · {test.detailLabel}
          </div>
        </div>
        <div className="stat">
          <StatusBadge kind={isPass ? "green" : "red"}>{isPass ? "Pass" : "Fail"}</StatusBadge>
          <span className="chev"><Icon name="chevron-down" size={18} /></span>
        </div>
      </div>
      {open && (
        <div className="body">
          {test.items.length === 0 ? (
            <div style={{ fontSize: 14, color: "var(--ink-3)" }}>
              {isPass
                ? "No advisories or defects recorded. Clean pass."
                : "This test failed, but no defect details were recorded against it."}
            </div>
          ) : (
            <div className="defects">
              {test.items.map((d, j) => (
                <div key={j} className={"defect " + (d.type === "major" || d.type === "dangerous" ? "major" : "")}>
                  <span className="dot" />
                  <span>{d.text}</span>
                  <span className="tag">{d.type === "advisory" ? "Advisory" : "Failure"}</span>
                </div>
              ))}
            </div>
          )}
          {(test.testNumber || test.expiry || test.plateAtTest) && (
            <div style={{ fontSize: 12.5, color: "var(--ink-3)", marginTop: 12, display: "flex", flexWrap: "wrap", gap: "4px 10px" }}>
              {test.testNumber && <span>Certificate {test.testNumber}</span>}
              {isPass && test.expiry && <span>· MOT valid to {test.expiry}</span>}
              {test.plateAtTest && <span>· Tested as {test.plateAtTest}</span>}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

function HealthRing({ score }) {
  const r = 54;
  const c = 2 * Math.PI * r;
  const pct = Math.max(0, Math.min(100, score)) / 100;
  const dash = c * pct;
  const color = score >= 80 ? "var(--green)" : score >= 40 ? "#E0A100" : "var(--red)";
  return (
    <div className="vp-health-ring">
      <svg width="124" height="124" viewBox="0 0 124 124" role="img" aria-label={`Vehicle health ${score} out of 100`}>
        <circle cx="62" cy="62" r={r} fill="none" stroke="var(--line)" strokeWidth="11" />
        <circle
          cx="62" cy="62" r={r} fill="none"
          stroke={color} strokeWidth="11" strokeLinecap="round"
          strokeDasharray={`${dash} ${c - dash}`}
          transform="rotate(-90 62 62)"
        />
      </svg>
      <div className="vp-health-center">
        <span className="num">{score}</span>
        <span className="denom">/ 100</span>
      </div>
    </div>
  );
}

function MileageChart({ data }) {
  const W = 760, H = 300;
  const padL = 64, padR = 28, padT = 28, padB = 44;
  const innerPad = 40;
  const plotW = W - padL - padR;
  const plotH = H - padT - padB;

  const values = data.map((d) => d.value);
  const rawMin = Math.min(...values);
  const rawMax = Math.max(...values);
  const span = rawMax - rawMin || 1;
  const yMin = Math.max(0, Math.floor((rawMin - span * 0.15) / 1000) * 1000);
  const yMax = Math.ceil((rawMax + span * 0.15) / 1000) * 1000;

  const gridCount = 4;
  const gridVals = Array.from({ length: gridCount }, (_, i) =>
    Math.round(yMax - ((yMax - yMin) / (gridCount - 1)) * i)
  );

  const step = data.length > 1 ? (plotW - innerPad * 2) / (data.length - 1) : 0;
  const xFor = (i) => (data.length > 1 ? padL + innerPad + i * step : padL + plotW / 2);
  const yFor = (v) => padT + ((yMax - v) / (yMax - yMin || 1)) * plotH;
  const pts = data.map((d, i) => `${xFor(i)},${yFor(d.value)}`).join(" ");

  return (
    <svg viewBox={`0 0 ${W} ${H}`} role="img" aria-label="Mileage recorded at each MOT test over time">
      {gridVals.map((gv) => {
        const y = yFor(gv);
        return (
          <g key={gv}>
            <line className="chart-gridline" x1={padL} y1={y} x2={W - padR} y2={y} />
            <text className="chart-axislabel" x={padL - 12} y={y + 4} textAnchor="end">{Math.round(gv / 1000)}k</text>
          </g>
        );
      })}
      <polyline className="chart-line" points={pts} />
      {data.map((d, i) => {
        const x = xFor(i), y = yFor(d.value);
        return (
          <g key={i}>
            <circle className="chart-dot" cx={x} cy={y} r={5} />
            <text className="chart-pointlabel" x={x} y={y - 16} textAnchor="middle">{d.value.toLocaleString()}</text>
            <text className="chart-xlabel" x={x} y={H - 14} textAnchor="middle">{d.label}</text>
          </g>
        );
      })}
    </svg>
  );
}
