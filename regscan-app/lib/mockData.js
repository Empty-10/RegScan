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

const norm = (vrm) => String(vrm || "").replace(/\s+/g, "").toUpperCase();

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

// Transparent, defensible Vehicle Health score (replaces the prototype's hardcoded 82).
// Starts at 100 and deducts for real, explainable factors so the number can always be justified.
export function computeHealth(v) {
  let score = 100;
  const reasons = [];
  if (v.motStatus === "expired") { score -= 45; reasons.push("MOT expired"); }
  else if (v.motStatus === "due-soon") { score -= 12; reasons.push("MOT due soon"); }
  if (v.taxStatus === "expired") { score -= 25; reasons.push("Tax expired"); }
  else if (v.taxStatus === "sorn") { score -= 5; reasons.push("Declared SORN"); }

  const latest = v.motTests && v.motTests[0];
  const openAdvisories = latest ? latest.defects.filter((d) => d.type === "advisory").length : 0;
  if (openAdvisories) { score -= Math.min(openAdvisories * 6, 24); reasons.push(`${openAdvisories} open advisory${openAdvisories > 1 ? "ies" : ""}`); }

  const everFailed = (v.motTests || []).some((t) => t.result === "fail");
  if (everFailed) { score -= 4; reasons.push("Past MOT failure"); }

  if (v.ulez && v.ulez.chargeable) { score -= 3; reasons.push("ULEZ chargeable"); }

  if (v.hasOutstandingRecall) { score -= 15; reasons.push("Outstanding safety recall"); }

  score = Math.max(0, Math.min(100, Math.round(score)));
  const state = score >= 80 ? "Good standing" : score >= 50 ? "Needs attention" : "Action required";
  return { score, state, note: reasons.length ? reasons.join(" · ") : "No issues found" };
}
