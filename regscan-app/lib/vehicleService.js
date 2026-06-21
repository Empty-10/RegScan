// Server-side orchestration: given a VRM, fetch from every configured provider in
// parallel, normalize + merge, and fall back to mock data when nothing is configured
// or a lookup yields no live data. This is the single entry point the app calls.
import "server-only";
import { fetchMotHistory } from "./providers/dvsaMot";
import { fetchVesVehicle } from "./providers/dvlaVes";
import { normalizeVehicle } from "./providers/normalize";
import { isDvsaMotConfigured, isDvlaVesConfigured } from "./providers/config";
import { fetchMotAndTaxByVRM } from "./mockData";

const normVrm = (vrm) => String(vrm || "").replace(/\s+/g, "").toUpperCase();

export async function getVehicleByVrm(rawVrm) {
  const vrm = normVrm(rawVrm);
  if (!vrm) {
    return { ok: false, error: "invalid", message: "Enter a registration to check." };
  }

  const liveConfigured = isDvsaMotConfigured() || isDvlaVesConfigured();

  // No real providers configured yet — use the mock so the app stays runnable.
  if (!liveConfigured) {
    const mock = await fetchMotAndTaxByVRM(vrm);
    return mock.ok
      ? { ...mock, source: "mock" }
      : { ...mock, source: "mock" };
  }

  // Hit configured providers concurrently; a single failure shouldn't sink the lookup.
  const [mot, ves] = await Promise.all([
    isDvsaMotConfigured()
      ? fetchMotHistory(vrm).catch((e) => {
          console.error("[vehicleService] DVSA MOT error:", e.message);
          return null;
        })
      : Promise.resolve(null),
    isDvlaVesConfigured()
      ? fetchVesVehicle(vrm).catch((e) => {
          console.error("[vehicleService] DVLA VES error:", e.message);
          return null;
        })
      : Promise.resolve(null),
  ]);

  if (!mot && !ves) {
    return {
      ok: false,
      error: "not_found",
      message: "We couldn't find a vehicle with that registration.",
      source: "live",
    };
  }

  const data = normalizeVehicle({ vrm: formatVrmDisplay(vrm), ves, mot });
  return { ok: true, data, source: "live" };
}

// "AB12CDE" -> "AB12 CDE" for display, matching the mock data convention.
function formatVrmDisplay(vrm) {
  const m = vrm.match(/^([A-Z]{2}\d{2})([A-Z]{3})$/);
  return m ? `${m[1]} ${m[2]}` : vrm;
}
