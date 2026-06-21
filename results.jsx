// RegScan — Results Page (linear layout)

const VEHICLE = {
  vrm: "AB12 CDE",
  make: "Volkswagen",
  model: "Golf SE TSI",
  monogram: "VW",
  meta: ["Pearl White", "Petrol", "2018", "1.4L", "Euro 6"],
};

const HEALTH = {
  score: 82,
  state: "Good standing",
  note: "1 advisory open · ULEZ chargeable",
};

const COMPLIANCE = [
  { kind: "good", icon: "check",          title: "MOT valid",          meta: "Expires 14 Mar 2026" },
  { kind: "good", icon: "check",          title: "Tax active",         meta: "Renews 01 Aug 2026" },
  { kind: "warn", icon: "alert-triangle", title: "ULEZ charges apply", meta: "£12.50 / day · inner London" },
  { kind: "good", icon: "check",          title: "Reminder enabled",   meta: "30 days before MOT" },
];

const VEHICLE_SPECS = [
  { k: "Fuel type", v: "Petrol" },
  { k: "Engine size", v: "1,395 cc" },
  { k: "CO₂ emissions", v: "118 g/km" },
  { k: "Euro emissions standard", v: "Euro 6" },
  { k: "Body type", v: "Hatchback" },
  { k: "Number of doors", v: "5" },
  { k: "Date first registered", v: "14 March 2018" },
  { k: "Previous keepers", v: "2" },
  { k: "Wheelplan", v: "2 axle rigid body" },
  { k: "Vehicle colour", v: "Pearl White" },
];

const MILEAGE_HISTORY = [
  { label: "Mar 2023", value: 24100 },
  { label: "Mar 2024", value: 32800 },
  { label: "Mar 2025", value: 41200 },
];

const ADVISORIES = [
  {
    title: "Rear brake discs",
    meta: "Noted at last MOT · 8,200 miles ago",
    body: "Typically need attention within 10,000 miles.",
    urgency: "Action soon",
    urgencyKind: "amber",
  },
  {
    title: "Front tyre wear",
    meta: "Noted at last MOT · 8,200 miles ago",
    body: "Monitor and replace before next MOT.",
    urgency: "Monitor",
    urgencyKind: "grey",
  },
];

const MOT_HISTORY = [
  {
    date: "14 Mar 2025",
    result: "pass",
    mileage: "41,200",
    advisories: 1,
    failures: 0,
    detailLabel: "1 advisory",
    items: [
      { type: "advisory", text: "Rear brake discs wearing thin (1.1.14 (a) (ii))" },
    ],
  },
  {
    date: "15 Mar 2024",
    result: "pass",
    mileage: "32,800",
    advisories: 0,
    failures: 0,
    detailLabel: "0 advisories",
    items: [],
  },
  {
    date: "12 Mar 2023",
    result: "fail",
    mileage: "24,100",
    advisories: 0,
    failures: 2,
    detailLabel: "2 failures",
    items: [
      { type: "major", text: "Nearside front brake disc excessively worn and pitted (1.1.14 (a) (ii))" },
      { type: "major", text: "Offside headlamp aim too high (4.1.2 (a))" },
    ],
  },
];

function ResultsPage() {
  const [toast, setToast] = React.useState(null);
  return (
    <>
      <Header active="home" />

      <main className="results-page">
        <div className="container">
          <nav className="results-breadcrumb" aria-label="Breadcrumb">
            <a href="index.html">Home</a>
            <Icon name="chevron-right" size={14} />
            <span className="current">Vehicle check</span>
          </nav>

          {/* 1 — VEHICLE PROFILE — control centre */}
          <div className="vehicle-profile">
            <div className="vp-main">
              <div className="vp-identity">
                <div className="vp-plate-row">
                  <span className="vp-monogram" aria-hidden="true">{VEHICLE.monogram}</span>
                  <span className="plate plate-lg">{VEHICLE.vrm}</span>
                </div>
                <h1 className="vp-name">{VEHICLE.make} {VEHICLE.model}</h1>
                <div className="vp-meta">
                  {VEHICLE.meta.map((m, i) => (
                    <React.Fragment key={i}>
                      {i > 0 && <span className="dot-sep" aria-hidden="true" />}
                      <span>{m}</span>
                    </React.Fragment>
                  ))}
                </div>
                <div className="vp-verdicts">
                  <span className="vp-verdict good">
                    <Icon name="shield-check" size={15} stroke={2.25} /> Road legal
                  </span>
                  <span className="vp-verdict warn">
                    <Icon name="alert-triangle" size={14} stroke={2.25} /> 1 advisory due soon
                  </span>
                </div>
              </div>

              <div className="vp-health">
                <HealthRing score={HEALTH.score} />
                <div className="vp-health-text">
                  <div className="vp-health-label">Vehicle health</div>
                  <div className="vp-health-state">
                    <span className="dotrow green" />{HEALTH.state}
                  </div>
                  <div className="vp-health-note">{HEALTH.note}</div>
                </div>
              </div>
            </div>

            <div className="vp-status">
              {COMPLIANCE.map((c, i) => (
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

          {/* 2b — VEHICLE DETAILS */}
          <section className="results-section">
            <h2>Vehicle details</h2>
            <div className="spec-card">
              {VEHICLE_SPECS.map((s, i) => (
                <div className="spec-row" key={i}>
                  <span className="k">{s.k}</span>
                  <span className="v">{s.v}</span>
                </div>
              ))}
            </div>
          </section>

          {/* 3 — ADVISORIES */}
          <section className="results-section">
            <h2>Advisories from last MOT</h2>
            <div className="advisory-list">
              {ADVISORIES.map((a, i) => (
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

          {/* 4 — MILEAGE HISTORY */}
          <section className="results-section">
            <h2>Mileage history</h2>
            <div className="chart-card">
              <MileageChart data={MILEAGE_HISTORY} />
              <p className="chart-note">
                Mileage recorded at each MOT test. Inconsistent readings may indicate odometer tampering.
              </p>
            </div>
          </section>

          {/* 5 — MOT HISTORY TIMELINE */}
          <section className="results-section">
            <h2>MOT history</h2>
            <div className="timeline-card" style={{marginTop: 20}}>
              <div className="timeline">
                {MOT_HISTORY.map((t, i) => (
                  <MotRow key={i} test={t} defaultOpen={i === 0} />
                ))}
              </div>
            </div>
          </section>
        </div>

        {/* 5 — REMINDERS CTA */}
        <section className="cta-band">
          <div className="container">
            <h2>Never miss an MOT or tax deadline</h2>
            <p>Free email reminders at 30, 14 and 1 day before. No account required.</p>
            <button className="btn btn-primary btn-lg" onClick={() => setToast("Reminder set — we'll email you")}>
              <Icon name="bell" size={18} /> Set free reminder
            </button>
          </div>
        </section>

        {/* 6 — SMART NEXT STEPS */}
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
                  <span className="price">Free · Car.com</span>
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

function MotRow({ test, defaultOpen }) {
  const [open, setOpen] = React.useState(!!defaultOpen);
  const isPass = test.result === "pass";
  return (
    <div className={"tl-item " + (isPass ? "" : "fail") + (open ? " expanded" : "")}>
      <div className="marker">
        <Icon name={isPass ? "check" : "x"} size={12} stroke={3} />
      </div>
      <div className="top" onClick={() => setOpen((o) => !o)}>
        <div>
          <div className="date">{test.date}</div>
          <div style={{fontSize: 13, color: "var(--ink-3)", marginTop: 4}}>
            {test.mileage} miles · {test.detailLabel}
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
            <div style={{fontSize: 14, color: "var(--ink-3)"}}>No advisories or defects recorded. Clean pass.</div>
          ) : (
            <div className="defects">
              {test.items.map((d, j) => (
                <div key={j} className={"defect " + (d.type === "major" ? "major" : "")}>
                  <span className="dot" />
                  <span>{d.text}</span>
                  <span className="tag">{d.type === "major" ? "Failure" : "Advisory"}</span>
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
  const yMin = 20000, yMax = 50000;
  const gridVals = [50000, 40000, 30000, 20000];
  const span = data.length > 1 ? (plotW - innerPad * 2) / (data.length - 1) : 0;
  const xFor = (i) => data.length > 1 ? padL + innerPad + i * span : padL + plotW / 2;
  const yFor = (v) => padT + ((yMax - v) / (yMax - yMin)) * plotH;
  const pts = data.map((d, i) => `${xFor(i)},${yFor(d.value)}`).join(" ");

  return (
    <svg viewBox={`0 0 ${W} ${H}`} role="img" aria-label="Mileage recorded at each MOT test over time">
      {gridVals.map((gv) => {
        const y = yFor(gv);
        return (
          <g key={gv}>
            <line className="chart-gridline" x1={padL} y1={y} x2={W - padR} y2={y} />
            <text className="chart-axislabel" x={padL - 12} y={y + 4} textAnchor="end">{gv / 1000}k</text>
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

ReactDOM.createRoot(document.getElementById("root")).render(<ResultsPage />);
