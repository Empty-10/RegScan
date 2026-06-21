"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { Icon } from "./Icon";
import { Header } from "./Header";
import { Footer } from "./Footer";
import { Toast, StatusBadge } from "./ui";
import { getVehicle, computeHealth, formatDate } from "@/lib/mockData";
import { chargeStatusNow } from "@/lib/charges";

const titleCase = (s) =>
  String(s || "").toLowerCase().replace(/\b\w/g, (c) => c.toUpperCase());

const monthYear = (iso) => {
  const d = new Date(iso);
  return d.toLocaleDateString("en-GB", { month: "short", year: "numeric" });
};

function buildModel(v) {
  const health = computeHealth(v);
  const latest = v.motTests && v.motTests[0];
  const openAdvisories = latest ? latest.defects.filter((d) => d.type === "advisory") : [];
  const roadLegal = v.motStatus !== "expired" && v.taxStatus !== "expired";

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
    { kind: "good", icon: "check", title: "Reminder enabled", meta: "30 days before MOT" },
  ];

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
    { k: "CO₂ emissions", v: v.co2 != null ? `${v.co2} g/km` : "—" },
    { k: "Euro emissions standard", v: v.euroStatus || "—" },
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
    return {
      date: formatDate(t.date),
      result: t.result,
      mileage: t.mileage != null ? t.mileage.toLocaleString() : "—",
      items: t.defects,
      detailLabel,
    };
  });

  return {
    vrm: v.vrm,
    monogram: v.monogram,
    name: `${titleCase(v.make)} ${v.model}`,
    meta,
    health,
    roadLegal,
    advisoryCount: openAdvisories.length,
    compliance,
    specs,
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

          {/* VEHICLE PROFILE — control centre */}
          <div className="vehicle-profile">
            <div className="vp-main">
              <div className="vp-identity">
                <div className="vp-plate-row">
                  <span className="vp-monogram" aria-hidden="true">{m.monogram}</span>
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
                <div className="vp-verdicts">
                  <span className={"vp-verdict " + (m.roadLegal ? "good" : "warn")}>
                    <Icon name={m.roadLegal ? "shield-check" : "alert-triangle"} size={15} stroke={2.25} />
                    {m.roadLegal ? "Road legal" : "Not road legal"}
                  </span>
                  {m.advisoryCount > 0 && (
                    <span className="vp-verdict warn">
                      <Icon name="alert-triangle" size={14} stroke={2.25} />
                      {m.advisoryCount} advisor{m.advisoryCount === 1 ? "y" : "ies"} due soon
                    </span>
                  )}
                  {m.recall && (
                    <span className="vp-verdict warn">
                      <Icon name="alert-triangle" size={14} stroke={2.25} />
                      Safety recall outstanding
                    </span>
                  )}
                </div>
              </div>

              <div className="vp-health">
                <HealthRing score={m.health.score} />
                <div className="vp-health-text">
                  <div className="vp-health-label">Vehicle health</div>
                  <div className="vp-health-state">
                    <span className="dotrow green" />{m.health.state}
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
              <button className="btn btn-primary" onClick={() => setToast("Saved to your garage")}>
                <Icon name="garage" size={16} /> Save to garage
              </button>
            </div>
          </div>

          {/* VEHICLE DETAILS */}
          <section className="results-section">
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

          {/* LONDON CHARGE ZONES & AIR QUALITY */}
          {(charges || airQuality) && (
            <section className="results-section">
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
                      London air quality{airQuality.band ? ` · ${airQuality.band}` : ""}
                    </span>
                    <span className="v">{airQuality.summary || "—"}</span>
                  </div>
                )}
              </div>
            </section>
          )}

          {/* ADVISORIES */}
          {m.advisories.length > 0 && (
            <section className="results-section">
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

          {/* MILEAGE HISTORY */}
          {m.mileage.length > 1 && (
            <section className="results-section">
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
          <section className="results-section">
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

        {/* REMINDERS CTA */}
        <section className="cta-band">
          <div className="container">
            <h2>Never miss an MOT or tax deadline</h2>
            <p>Free email reminders at 30, 14 and 1 day before. No account required.</p>
            <button className="btn btn-primary btn-lg" onClick={() => setToast("Reminder set — we'll email you")}>
              <Icon name="bell" size={18} /> Set free reminder
            </button>
          </div>
        </section>

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
  const color = score >= 80 ? "var(--green)" : score >= 50 ? "#E0A100" : "var(--red)";
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
