// TfL Unified API — London air quality. Server-side only.
// Auth: subscription key passed as the `app_key` query param.
// Docs: https://api-portal.tfl.gov.uk/apis
import "server-only";
import { tflConfig, isTflConfigured } from "./config";

// Returns a small normalized air-quality summary, or null if unconfigured / failed.
// Never throws — air quality is a nice-to-have, so a failure must not break the page.
export async function fetchAirQuality() {
  if (!isTflConfigured()) return null;

  try {
    const url = `${tflConfig.baseUrl}/AirQuality?app_key=${encodeURIComponent(tflConfig.appKey)}`;
    const res = await fetch(url, {
      headers: { Accept: "application/json" },
      // Air quality changes slowly; cache for an hour to stay well under rate limits.
      next: { revalidate: 3600 },
    });
    if (!res.ok) return null;

    const json = await res.json();
    // Shape: { currentForecast: [ { forecastType, forecastBand, forecastSummary, ... } ] }
    const forecasts = json?.currentForecast || [];
    const current =
      forecasts.find((f) => /current/i.test(f.forecastType || "")) || forecasts[0];
    if (!current) return null;

    const future = forecasts.find((f) => /future/i.test(f.forecastType || ""));

    return {
      band: current.forecastBand || null, // e.g. "Low", "Moderate", "High"
      summary: current.forecastSummary || null,
      type: current.forecastType || null,
      future: future
        ? { band: future.forecastBand || null, summary: future.forecastSummary || null }
        : null,
    };
  } catch (e) {
    console.error("[tfl] AirQuality error:", e.message);
    return null;
  }
}
