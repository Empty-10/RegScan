// DVSA MOT History API (server-side only).
// Auth: OAuth2 client_credentials -> Bearer token, plus an X-API-Key header.
// Docs: https://documentation.history.mot.api.gov.uk/
import "server-only";
import { dvsaMotConfig, isDvsaMotConfigured } from "./config";

// Module-level token cache. Reused across requests within a server instance until
// shortly before expiry, so we don't mint a new token on every lookup.
let cachedToken = null; // { accessToken, expiresAt }

async function getAccessToken() {
  if (cachedToken && cachedToken.expiresAt > Date.now() + 60_000) {
    return cachedToken.accessToken;
  }

  const body = new URLSearchParams({
    grant_type: "client_credentials",
    client_id: dvsaMotConfig.clientId,
    client_secret: dvsaMotConfig.clientSecret,
    scope: dvsaMotConfig.scope,
  });

  const res = await fetch(dvsaMotConfig.tokenUrl, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body,
    cache: "no-store",
  });

  if (!res.ok) {
    const detail = await res.text().catch(() => "");
    throw new Error(`DVSA token request failed (${res.status}): ${detail.slice(0, 200)}`);
  }

  const json = await res.json();
  cachedToken = {
    accessToken: json.access_token,
    expiresAt: Date.now() + (json.expires_in ?? 3600) * 1000,
  };
  return cachedToken.accessToken;
}

// Returns the raw DVSA MOT History payload for a registration, or null if 404.
export async function fetchMotHistory(registration) {
  if (!isDvsaMotConfigured()) {
    throw new Error("DVSA MOT History API is not configured");
  }

  const token = await getAccessToken();
  const url = `${dvsaMotConfig.baseUrl}/${encodeURIComponent(registration)}`;

  const res = await fetch(url, {
    headers: {
      Authorization: `Bearer ${token}`,
      "X-API-Key": dvsaMotConfig.apiKey,
      Accept: "application/json",
    },
    cache: "no-store",
  });

  if (res.status === 404) return null;
  if (!res.ok) {
    const detail = await res.text().catch(() => "");
    throw new Error(`DVSA MOT lookup failed (${res.status}): ${detail.slice(0, 200)}`);
  }

  const json = await res.json();
  // The API may return a single object or an array of one vehicle.
  return Array.isArray(json) ? json[0] ?? null : json;
}
