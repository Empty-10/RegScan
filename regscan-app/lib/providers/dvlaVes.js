// DVLA Vehicle Enquiry Service (VES) — tax status, make, colour, CO2, etc.
// Auth: simple x-api-key header. Server-side only.
// Docs: https://developer-portal.driver-vehicle-licensing.api.gov.uk/
import "server-only";
import { dvlaVesConfig, isDvlaVesConfigured } from "./config";

// Returns the raw DVLA VES payload for a registration, or null if 404.
export async function fetchVesVehicle(registration) {
  if (!isDvlaVesConfigured()) {
    throw new Error("DVLA VES API is not configured");
  }

  const res = await fetch(dvlaVesConfig.baseUrl, {
    method: "POST",
    headers: {
      "x-api-key": dvlaVesConfig.apiKey,
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify({ registrationNumber: registration }),
    cache: "no-store",
  });

  if (res.status === 404) return null;
  if (!res.ok) {
    const detail = await res.text().catch(() => "");
    throw new Error(`DVLA VES lookup failed (${res.status}): ${detail.slice(0, 200)}`);
  }

  return res.json();
}
