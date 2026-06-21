// RegScan — mock data + stub API calls
// These mirror DVSA MOT History API + DVLA Vehicle Enquiry Service shapes
// so the UI is clearly ready to consume real responses.

window.RegScan = window.RegScan || {};

window.RegScan.mockVehicles = {
  // Hero / default demo vehicle — VW Golf, valid MOT, valid tax
  "AB12CDE": {
    vrm: "AB12 CDE",
    make: "VOLKSWAGEN",
    model: "GOLF SE TSI",
    year: 2018,
    colour: "Pearl White",
    fuel: "Petrol",
    engineCc: 1395,
    co2: 124,
    motStatus: "valid",            // valid | expired | due-soon | none
    motExpiry: "2026-09-14",
    taxStatus: "valid",            // valid | expired | sorn
    taxExpiry: "2026-08-31",
    taxClass: "Petrol car",
    firstRegistered: "2018-03-22",
    motTests: [
      { date: "2025-09-10", result: "pass", mileage: 64210, defects: [
        { type: "advisory", text: "Nearside front tyre worn close to legal limit (5.2.3 (e))" },
        { type: "advisory", text: "Front brake pads wearing thin (1.1.13 (a) (i))" },
      ]},
      { date: "2024-09-12", result: "pass", mileage: 56880, defects: [
        { type: "advisory", text: "Offside rear shock absorber light misting (5.3.2 (b))" },
      ]},
      { date: "2023-09-08", result: "fail", mileage: 49120, defects: [
        { type: "major", text: "Nearside front anti-roll bar linkage ball joint excessively worn (5.3.4 (a) (i))" },
        { type: "advisory", text: "Both front tyres approaching wear indicator (5.2.3 (e))" },
      ], retest: { date: "2023-09-12", result: "pass" }},
      { date: "2022-09-04", result: "pass", mileage: 41560, defects: [] },
      { date: "2021-09-01", result: "pass", mileage: 33890, defects: [
        { type: "advisory", text: "Slight oil leak from engine sump (6.1.1 (b) (ii))" },
      ]},
    ],
  },
  // Power user examples for garage
  "LF19XKM": {
    vrm: "LF19 XKM",
    make: "BMW",
    model: "3 SERIES 320d M SPORT",
    year: 2019,
    colour: "Mineral Grey",
    fuel: "Diesel",
    engineCc: 1995,
    co2: 138,
    motStatus: "due-soon",
    motExpiry: "2026-06-04",
    taxStatus: "valid",
    taxExpiry: "2026-10-31",
    taxClass: "Diesel car",
    firstRegistered: "2019-05-18",
    advisoryCount: 2,
    nickname: "Family car",
    reminders: { email: true, sms: false },
    motTests: [
      { date: "2025-06-02", result: "pass", mileage: 78400, defects: [
        { type: "advisory", text: "Both rear brake discs wearing thin (1.1.14 (a) (ii))" },
        { type: "advisory", text: "Offside rear tyre worn close to legal limit (5.2.3 (e))" },
      ]},
      { date: "2024-06-04", result: "pass", mileage: 67100, defects: [] },
    ],
  },
  "EV70RUN": {
    vrm: "EV70 RUN",
    make: "TESLA",
    model: "MODEL 3 LONG RANGE",
    year: 2020,
    colour: "Solid Black",
    fuel: "Electric",
    engineCc: null,
    co2: 0,
    motStatus: "valid",
    motExpiry: "2026-11-21",
    taxStatus: "valid",
    taxExpiry: "2027-01-31",
    taxClass: "Electric",
    firstRegistered: "2020-12-04",
    advisoryCount: 0,
    nickname: "Weekend EV",
    reminders: { email: true, sms: true },
    motTests: [
      { date: "2025-11-18", result: "pass", mileage: 28110, defects: [] },
      { date: "2024-11-20", result: "pass", mileage: 19450, defects: [] },
    ],
  },
  "VN64WRK": {
    vrm: "VN64 WRK",
    make: "FORD",
    model: "TRANSIT CUSTOM 290",
    year: 2014,
    colour: "Frozen White",
    fuel: "Diesel",
    engineCc: 2198,
    co2: 178,
    motStatus: "expired",
    motExpiry: "2026-02-14",
    taxStatus: "valid",
    taxExpiry: "2026-09-30",
    taxClass: "Diesel LCV",
    firstRegistered: "2014-11-02",
    advisoryCount: 3,
    nickname: "Work van",
    reminders: { email: true, sms: false },
    motTests: [
      { date: "2025-02-12", result: "pass", mileage: 142800, defects: [
        { type: "advisory", text: "Both front tyres worn close to legal limit (5.2.3 (e))" },
        { type: "advisory", text: "Nearside rear inner CV boot split (5.3.5 (b))" },
        { type: "advisory", text: "Exhaust noticeably louder than expected (6.1.2 (a))" },
      ]},
    ],
  },
};

// Stub API — would call DVSA MOT History API + DVLA Vehicle Enquiry Service
window.RegScan.fetchMotAndTaxByVRM = async function fetchMotAndTaxByVRM(vrm) {
  // TODO: replace with real DVSA + DVLA calls
  // const motResp = await fetch(`https://history.mot.api.gov.uk/v1/trade/vehicles/registration/${vrm}`, { headers: { 'x-api-key': KEY }})
  // const dvlaResp = await fetch('https://driver-vehicle-licensing.api.gov.uk/vehicle-enquiry/v1/vehicles', { method: 'POST', body: JSON.stringify({registrationNumber: vrm}), headers: { 'x-api-key': KEY }})
  await new Promise(r => setTimeout(r, 600));
  const key = String(vrm).replace(/\s+/g, "").toUpperCase();
  const v = window.RegScan.mockVehicles[key];
  if (!v) {
    return { ok: false, error: "not_found", message: "We couldn't find a vehicle with that registration." };
  }
  return { ok: true, data: v };
};

window.RegScan.formatDate = function(iso, opts) {
  if (!iso) return "—";
  const d = new Date(iso);
  return d.toLocaleDateString("en-GB", { day: "numeric", month: opts && opts.short ? "short" : "long", year: "numeric" });
};

window.RegScan.daysUntil = function(iso) {
  if (!iso) return null;
  const ms = new Date(iso).getTime() - Date.now();
  return Math.round(ms / (1000 * 60 * 60 * 24));
};
