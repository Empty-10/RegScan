// Maps raw DVSA MOT History + DVLA VES payloads into the single vehicle
// view-model shape the UI consumes (see lib/mockData.js for the canonical shape).
import "server-only";

const titleCase = (s) =>
  String(s || "")
    .toLowerCase()
    .replace(/\b\w/g, (c) => c.toUpperCase());

const monogramFor = (make) =>
  String(make || "")
    .replace(/[^A-Za-z]/g, "")
    .slice(0, 2)
    .toUpperCase() || "??";

// "2018.03" / "2018-03" / "March 2018" -> ISO-ish "2018-03-01" where possible.
const toIsoDate = (value) => {
  if (!value) return null;
  // VES monthOfFirstRegistration is "YYYY-MM"; pad to a full date.
  if (/^\d{4}-\d{2}$/.test(value)) return `${value}-01`;
  return value; // already a full date string
};

const yearFrom = (value) => {
  const m = String(value || "").match(/(\d{4})/);
  return m ? Number(m[1]) : null;
};

const daysUntil = (iso) => {
  if (!iso) return null;
  return Math.round((new Date(iso).getTime() - Date.now()) / 86_400_000);
};

// DVSA defect type -> the app's {advisory|major|dangerous} buckets.
function mapDefectType(rfr) {
  const t = String(rfr.type || "").toUpperCase();
  if (t === "ADVISORY") return "advisory";
  if (t === "DANGEROUS") return "dangerous";
  if (t === "MAJOR" || t === "FAIL") return "major";
  if (t === "MINOR") return "advisory";
  return "advisory";
}

function mapMotTests(mot) {
  const tests = (mot?.motTests || []).map((t) => {
    const unit = String(t.odometerUnit || "mi").toLowerCase().startsWith("k") ? "km" : "mi";
    const readable = !t.odometerResultType || String(t.odometerResultType).toUpperCase() === "READ";
    return {
      date: (t.completedDate || "").slice(0, 10),
      result: String(t.testResult || "").toUpperCase() === "PASSED" ? "pass" : "fail",
      mileage: readable && t.odometerValue != null ? Number(t.odometerValue) : null,
      mileageUnit: unit,
      mileageReadable: readable,
      testNumber: t.motTestNumber || null,
      expiryDate: t.expiryDate || null,
      registrationAtTest: t.registrationAtTimeOfTest || null,
      // The current MOT History API uses `defects`; older payloads used
      // `rfrAndComments`. Support both.
      defects: (t.defects || t.rfrAndComments || [])
        .filter((r) => String(r.type || "").toUpperCase() !== "USER ENTERED")
        .map((r) => ({ type: mapDefectType(r), text: r.text })),
    };
  });
  // Newest first — the UI assumes motTests[0] is the latest.
  return tests.sort((a, b) => (a.date < b.date ? 1 : -1));
}

// Rough ULEZ heuristic from emissions standard + fuel. Flagged as an estimate;
// swap for a TfL ULEZ provider when available.
function deriveUlez(fuel, euroStatus) {
  const f = String(fuel || "").toLowerCase();
  const euro = parseInt(String(euroStatus || "").replace(/\D/g, ""), 10);
  if (f.includes("electric") || f.includes("hybrid")) {
    return { chargeable: false, note: "ULEZ compliant (estimated)" };
  }
  const compliant = f.includes("diesel") ? euro >= 6 : euro >= 4;
  return compliant
    ? { chargeable: false, note: "ULEZ compliant (estimated)" }
    : { chargeable: true, note: "£12.50 / day · estimated from emissions standard" };
}

function deriveMotStatus(motExpiry) {
  const d = daysUntil(motExpiry);
  if (d == null) return "unknown";
  if (d < 0) return "expired";
  if (d <= 30) return "due-soon";
  return "valid";
}

function deriveTaxStatus(vesStatus) {
  const s = String(vesStatus || "").toLowerCase();
  if (s.includes("sorn")) return "sorn";
  if (s.includes("untax")) return "expired";
  if (s.includes("tax")) return "valid";
  return "unknown";
}

// Build the unified vehicle object. Either source may be null.
export function normalizeVehicle({ vrm, ves, mot }) {
  const make = ves?.make || mot?.make || "Unknown";
  const motTests = mapMotTests(mot);
  const latestPass = motTests.find((t) => t.result === "pass");
  const motExpiry = latestPass?.expiryDate || ves?.motExpiryDate || null;
  const fuel = ves?.fuelType || mot?.fuelType || "—";
  const euroStatus = ves?.euroStatus || null;
  const latestRead = motTests.find((t) => t.mileage != null);

  // DVSA returns "Yes" | "No" | "Unknown" (or a boolean). Keep the tri-state so
  // the UI can stay silent when it's genuinely unknown.
  const rawRecall = mot?.hasOutstandingRecall;
  const recallStatus =
    rawRecall === true || String(rawRecall || "").toLowerCase() === "yes"
      ? "yes"
      : String(rawRecall || "").toLowerCase() === "no"
      ? "no"
      : "unknown";

  return {
    vrm,
    make: titleCase(make),
    model: titleCase(mot?.model || ""),
    monogram: monogramFor(make),
    // Fall back to DVSA's manufacture/first-used dates when DVLA VES is absent.
    year: ves?.yearOfManufacture ?? yearFrom(mot?.manufactureDate) ?? yearFrom(mot?.firstUsedDate),
    colour: titleCase(ves?.colour || mot?.primaryColour || ""),
    fuel,
    engineCc:
      ves?.engineCapacity ??
      (mot?.engineSize != null && mot?.engineSize !== "" ? Number(mot.engineSize) : null),
    co2: ves?.co2Emissions ?? null,
    euroStatus: euroStatus || "—",
    // bodyType/doors/previousKeepers are NOT provided by DVSA or DVLA VES —
    // they need a paid history provider. Null so the UI shows "—" honestly.
    bodyType: null,
    doors: null,
    previousKeepers: null,
    typeApproval: ves?.typeApproval || null,
    wheelplan: ves?.wheelplan || "—",
    revenueWeight: ves?.revenueWeight ?? null,
    realDrivingEmissions: ves?.realDrivingEmissions || null,
    markedForExport: ves?.markedForExport === true,
    v5cIssued: toIsoDate(ves?.dateOfLastV5CIssued) || null,
    hasOutstandingRecall: recallStatus === "yes",
    recallStatus,
    // Manufacture vs first-registration dates — a gap can indicate an import.
    manufactureDate: toIsoDate(mot?.manufactureDate) || null,
    registrationDate: toIsoDate(mot?.registrationDate) || null,
    motStatus: deriveMotStatus(motExpiry),
    motExpiry,
    taxStatus: deriveTaxStatus(ves?.taxStatus),
    taxExpiry: ves?.taxDueDate || null,
    taxArtEnd: ves?.artEndDate || null,
    taxClass: null,
    firstRegistered:
      toIsoDate(mot?.firstUsedDate) ||
      toIsoDate(mot?.registrationDate) ||
      toIsoDate(ves?.monthOfFirstRegistration),
    mileageUnit: latestRead?.mileageUnit || "mi",
    ulez: deriveUlez(fuel, euroStatus),
    motTests,
  };
}
