// RegScan — mock data + stub API + view-model helpers.
// Shapes mirror the DVSA MOT History API + DVLA Vehicle Enquiry Service (VES)
// so this layer can be swapped for real server-side API calls with minimal change.
//
// PRODUCTION NOTE: replace fetchMotAndTaxByVRM with server-side calls:
//   MOT history -> GET https://history.mot.api.gov.uk/... (x-api-key)
//   Tax / due dates -> POST https://driver-vehicle-licensing.api.gov.uk/vehicle-enquiry/v1/vehicles
// Never expose API keys to the client.

export const mockVehicles = {
  AB12CDE: {
    vrm: "AB12 CDE",
    make: "VOLKSWAGEN",
    model: "GOLF SE TSI",
    monogram: "VW",
    year: 2018,
    colour: "Pearl White",
    fuel: "Petrol",
    engineCc: 1395,
    co2: 124,
    euroStatus: "Euro 6",
    bodyType: "Hatchback",
    doors: 5,
    previousKeepers: 2,
    wheelplan: "2 axle rigid body",
    motStatus: "valid",
    motExpiry: "2026-09-14",
    taxStatus: "valid",
    taxExpiry: "2026-08-31",
    taxClass: "Petrol car",
    firstRegistered: "2018-03-22",
    ulez: { chargeable: true, note: "£12.50 / day · inner London" },
    motTests: [
      {
        date: "2025-09-10",
        result: "pass",
        mileage: 64210,
        defects: [
          { type: "advisory", text: "Nearside front tyre worn close to legal limit (5.2.3 (e))" },
          { type: "advisory", text: "Front brake pads wearing thin (1.1.13 (a) (i))" },
        ],
      },
      {
        date: "2024-09-12",
        result: "pass",
        mileage: 56880,
        defects: [
          { type: "advisory", text: "Offside rear shock absorber light misting (5.3.2 (b))" },
        ],
      },
      {
        date: "2023-09-08",
        result: "fail",
        mileage: 49120,
        defects: [
          { type: "major", text: "Nearside front anti-roll bar linkage ball joint excessively worn (5.3.4 (a) (i))" },
          { type: "advisory", text: "Both front tyres approaching wear indicator (5.2.3 (e))" },
        ],
        retest: { date: "2023-09-12", result: "pass" },
      },
      { date: "2022-09-04", result: "pass", mileage: 41560, defects: [] },
      {
        date: "2021-09-01",
        result: "pass",
        mileage: 33890,
        defects: [
          { type: "advisory", text: "Slight oil leak from engine sump (6.1.1 (b) (ii))" },
        ],
      },
    ],
  },

  LF19XKM: {
    vrm: "LF19 XKM",
    make: "BMW",
    model: "3 SERIES 320d M SPORT",
    monogram: "BM",
    year: 2019,
    colour: "Mineral Grey",
    fuel: "Diesel",
    engineCc: 1995,
    co2: 138,
    euroStatus: "Euro 6",
    bodyType: "Saloon",
    doors: 4,
    previousKeepers: 1,
    wheelplan: "2 axle rigid body",
    motStatus: "due-soon",
    motExpiry: "2026-06-04",
    taxStatus: "valid",
    taxExpiry: "2026-10-31",
    taxClass: "Diesel car",
    firstRegistered: "2019-05-18",
    advisoryCount: 2,
    nickname: "Family car",
    reminders: { email: true, sms: false },
    ulez: { chargeable: false, note: "ULEZ compliant" },
    motTests: [
      {
        date: "2025-06-02",
        result: "pass",
        mileage: 78400,
        defects: [
          { type: "advisory", text: "Both rear brake discs wearing thin (1.1.14 (a) (ii))" },
          { type: "advisory", text: "Offside rear tyre worn close to legal limit (5.2.3 (e))" },
        ],
      },
      { date: "2024-06-04", result: "pass", mileage: 67100, defects: [] },
    ],
  },

  EV70RUN: {
    vrm: "EV70 RUN",
    make: "TESLA",
    model: "MODEL 3 LONG RANGE",
    monogram: "TE",
    year: 2020,
    colour: "Solid Black",
    fuel: "Electric",
    engineCc: null,
    co2: 0,
    euroStatus: "—",
    bodyType: "Saloon",
    doors: 4,
    previousKeepers: 1,
    wheelplan: "2 axle rigid body",
    motStatus: "valid",
    motExpiry: "2026-11-21",
    taxStatus: "valid",
    taxExpiry: "2027-01-31",
    taxClass: "Electric",
    firstRegistered: "2020-12-04",
    advisoryCount: 0,
    nickname: "Weekend EV",
    reminders: { email: true, sms: true },
    ulez: { chargeable: false, note: "ULEZ compliant" },
    motTests: [
      { date: "2025-11-18", result: "pass", mileage: 28110, defects: [] },
      { date: "2024-11-20", result: "pass", mileage: 19450, defects: [] },
    ],
  },

  VN64WRK: {
    vrm: "VN64 WRK",
    make: "FORD",
    model: "TRANSIT CUSTOM 290",
    monogram: "FO",
    year: 2014,
    colour: "Frozen White",
    fuel: "Diesel",
    engineCc: 2198,
    co2: 178,
    euroStatus: "Euro 5",
    bodyType: "Panel van",
    doors: 4,
    previousKeepers: 3,
    wheelplan: "2 axle rigid body",
    motStatus: "expired",
    motExpiry: "2026-02-14",
    taxStatus: "valid",
    taxExpiry: "2026-09-30",
    taxClass: "Diesel LCV",
    firstRegistered: "2014-11-02",
    advisoryCount: 3,
    nickname: "Work van",
    reminders: { email: true, sms: false },
    ulez: { chargeable: true, note: "£12.50 / day · inner London" },
    motTests: [
      {
        date: "2025-02-12",
        result: "pass",
        mileage: 142800,
        defects: [
          { type: "advisory", text: "Both front tyres worn close to legal limit (5.2.3 (e))" },
          { type: "advisory", text: "Nearside rear inner CV boot split (5.3.5 (b))" },
          { type: "advisory", text: "Exhaust noticeably louder than expected (6.1.2 (a))" },
        ],
      },
    ],
  },
};

import carLogos from "./carLogos.json";

const norm = (vrm) => String(vrm || "").replace(/\s+/g, "").toUpperCase();

// Resolve a make name to a self-hosted logo path, or null to fall back to the
// monogram. Normalises e.g. "MERCEDES-BENZ" / "Land Rover" -> slug.
export function makeLogoSrc(make) {
  const slug = String(make || "").toLowerCase().trim().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");
  return slug && carLogos.includes(slug) ? `/logos/${slug}.png` : null;
}

// Stub API — mirrors a server-side DVSA + DVLA lookup.
export async function fetchMotAndTaxByVRM(vrm) {
  await new Promise((r) => setTimeout(r, 400));
  const v = mockVehicles[norm(vrm)];
  if (!v) {
    return { ok: false, error: "not_found", message: "We couldn't find a vehicle with that registration." };
  }
  return { ok: true, data: v };
}

export function getVehicle(vrm) {
  return mockVehicles[norm(vrm)] || null;
}

export function formatDate(iso, opts) {
  if (!iso) return "—";
  const d = new Date(iso);
  return d.toLocaleDateString("en-GB", {
    day: "numeric",
    month: opts && opts.short ? "short" : "long",
    year: "numeric",
  });
}

export function daysUntil(iso) {
  if (!iso) return null;
  const ms = new Date(iso).getTime() - Date.now();
  return Math.round(ms / (1000 * 60 * 60 * 24));
}

// A stable signature for a defect, used to detect the same issue recurring across
// tests. Prefers the MOT manual rule code (e.g. "5.2.3"); falls back to the first
// few normalized words of the text.
function defectSignature(text) {
  if (!text) return null;
  const code = String(text).match(/\b\d+\.\d+(?:\.\d+)?\b/);
  if (code) return code[0];
  return String(text).toLowerCase().replace(/[^a-z]+/g, " ").trim().split(" ").slice(0, 5).join(" ");
}

// Map a defect to a human problem-area using its MOT manual rule code.
export function defectCategory(text) {
  const m = String(text || "").match(/\b(\d+)\.(\d+)/);
  if (!m) return "Other";
  const major = m[1];
  const sub = `${m[1]}.${m[2]}`;
  if (major === "5") {
    if (sub === "5.2") return "Tyres & wheels";
    if (sub === "5.3") return "Suspension";
    return "Axles & suspension";
  }
  return (
    {
      "1": "Brakes",
      "2": "Steering",
      "3": "Visibility",
      "4": "Lights & electrical",
      "6": "Body & structure",
      "7": "Seatbelts & equipment",
      "8": "Emissions & exhaust",
    }[major] || "Other"
  );
}

// Count defect categories across all MOT tests, most common first.
export function problemAreas(v) {
  const counts = {};
  (v.motTests || []).forEach((t) =>
    (t.defects || []).forEach((d) => {
      const c = defectCategory(d.text);
      counts[c] = (counts[c] || 0) + 1;
    })
  );
  return Object.entries(counts).map(([category, count]) => ({ category, count })).sort((a, b) => b.count - a.count);
}

// Odometer consistency: flags a reading that fell vs a previous test (rollback)
// and any tests where the odometer was unreadable.
export function mileageCheck(v) {
  const tests = (v.motTests || []).filter((t) => t.date).slice().sort((a, b) => (a.date < b.date ? -1 : 1));
  const issues = [];
  const unreadable = [];
  let prev = null;
  for (const t of tests) {
    if (t.mileageReadable === false) { unreadable.push((t.date || "").slice(0, 4)); continue; }
    if (t.mileage == null) continue;
    if (prev && t.mileage < prev.mileage) {
      issues.push({ fromYear: (prev.date || "").slice(0, 4), from: prev.mileage, toYear: (t.date || "").slice(0, 4), to: t.mileage });
    }
    prev = t;
  }
  return { ok: issues.length === 0, issues, unreadable };
}

// Environmental impact rating from fuel + CO2.
export function environmentRating(v) {
  const f = String(v.fuel || "").toLowerCase();
  if (f.includes("electric")) return { label: "Very low", kind: "good" };
  const c = v.co2;
  if (c == null) return null;
  if (c === 0) return { label: "Very low", kind: "good" };
  if (c < 110) return { label: "Low", kind: "good" };
  if (c < 150) return { label: "Moderate", kind: "good" };
  if (c < 190) return { label: "High", kind: "warn" };
  return { label: "Very high", kind: "bad" };
}

// Distinct defects that recur across 2+ MOT tests (matched by rule code / text).
// Returns the representative (most recent) text, how many tests it appeared at,
// and the years — newest first. motTests are assumed newest-first.
export function recurringAdvisories(v) {
  const groups = {};
  (v.motTests || []).forEach((t) => {
    const seen = new Set();
    (t.defects || []).forEach((d) => {
      const sig = defectSignature(d.text);
      if (!sig || seen.has(sig)) return;
      seen.add(sig);
      if (!groups[sig]) groups[sig] = { text: d.text, type: d.type, dates: [] };
      groups[sig].dates.push(t.date);
    });
  });
  return Object.values(groups)
    .filter((g) => g.dates.length >= 2)
    .map((g) => ({ ...g, count: g.dates.length }))
    .sort((a, b) => b.count - a.count);
}

export function recurringAdvisoryCount(v) {
  return recurringAdvisories(v).length;
}

// Transparent, defensible Vehicle Health score (replaces the prototype's hardcoded 82).
// Starts at 100 and deducts across four capped categories so the number can always
// be justified, with each deduction producing a plain-English reason:
//   1) legal & safety status   2) current condition (latest test, severity-weighted)
//   3) failure track record (recency-decayed)   4) patterns (recurring + mileage)
export function computeHealth(v) {
  let score = 100;
  const reasons = [];
  const tests = v.motTests || [];

  // --- 1. Legal & safety status ---
  if (v.motStatus === "expired") { score -= 35; reasons.push("MOT expired"); }
  else if (v.motStatus === "due-soon") { score -= 10; reasons.push("MOT due soon"); }

  if (v.taxStatus === "expired") { score -= 20; reasons.push("Untaxed"); }
  else if (v.taxStatus === "sorn") { score -= 5; reasons.push("Declared SORN"); }

  if (v.hasOutstandingRecall) { score -= 15; reasons.push("Outstanding safety recall"); }

  // --- 2. Current condition: defects on the latest test, weighted by severity ---
  const latest = tests[0];
  if (latest && latest.defects && latest.defects.length) {
    const n = (type) => latest.defects.filter((d) => d.type === type).length;
    const dangerous = n("dangerous"), major = n("major"), advisory = n("advisory");
    const current = Math.min(
      Math.min(dangerous * 12, 36) + Math.min(major * 7, 28) + Math.min(advisory * 3, 15),
      40
    );
    if (current > 0) {
      score -= current;
      const parts = [];
      if (dangerous) parts.push(`${dangerous} dangerous`);
      if (major) parts.push(`${major} major`);
      if (advisory) parts.push(`${advisory} advisory`);
      reasons.push(`${parts.join(", ")} at last test`);
    }
  }

  // --- 3. Failure track record: recency-decayed, excluding the latest test ---
  const now = Date.now();
  const YEAR = 365.25 * 24 * 60 * 60 * 1000;
  let historyDed = 0;
  tests.forEach((t, i) => {
    if (i === 0 || t.result !== "fail" || !t.date) return; // latest already in (2)
    const yearsAgo = (now - new Date(t.date).getTime()) / YEAR;
    historyDed += 8 * Math.max(0.15, 1 - yearsAgo / 7);
  });
  historyDed = Math.min(historyDed, 20);
  if (historyDed >= 1) {
    score -= historyDed;
    const failCount = tests.filter((t) => t.result === "fail").length;
    reasons.push(`Past MOT failure${failCount > 1 ? "s" : ""}`);
  }
  if (tests.slice(0, 3).filter((t) => t.result === "fail").length >= 2) {
    score -= 5;
    reasons.push("Repeated recent failures");
  }

  // --- 4. Patterns: recurring advisories + mileage integrity ---
  const recurring = recurringAdvisoryCount(v);
  if (recurring) {
    score -= Math.min(recurring * 4, 12);
    reasons.push(`${recurring} recurring advisor${recurring > 1 ? "ies" : "y"}`);
  }

  const readings = tests.filter((t) => t.mileage != null).map((t) => t.mileage).reverse();
  let mileageIssue = tests.some((t) => t.mileageReadable === false);
  for (let i = 1; i < readings.length && !mileageIssue; i++) {
    if (readings[i] < readings[i - 1]) mileageIssue = true;
  }
  if (mileageIssue) { score -= 10; reasons.push("Mileage inconsistency"); }

  // --- finalize ---
  score = Math.max(0, Math.min(100, Math.round(score)));
  const state =
    score >= 80 ? "Good standing" :
    score >= 60 ? "Fair" :
    score >= 40 ? "Needs attention" : "Action required";
  return { score, state, note: reasons.length ? reasons.join(" · ") : "No issues found" };
}
