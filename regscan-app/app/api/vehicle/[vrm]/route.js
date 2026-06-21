import { NextResponse } from "next/server";
import { getVehicleByVrm } from "@/lib/vehicleService";

// GET /api/vehicle/AB12CDE -> normalized vehicle JSON.
// Runs server-side only, so API keys are never exposed to the browser.
export const dynamic = "force-dynamic";

export async function GET(_req, { params }) {
  const result = await getVehicleByVrm(params.vrm);
  const status = result.ok ? 200 : result.error === "not_found" ? 404 : 400;
  return NextResponse.json(result, { status });
}
