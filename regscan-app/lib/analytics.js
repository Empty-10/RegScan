// Lightweight GA4 event helper.
// No-op on the server or before gtag has loaded. Consent Mode (configured in
// app/layout.jsx) governs whether events actually transmit, so callers don't
// need to check consent themselves - denied events simply aren't sent.
export function trackEvent(name, params = {}) {
  if (typeof window === "undefined" || typeof window.gtag !== "function") return;
  // Drop null/undefined values so we don't send empty params to GA4.
  const clean = Object.fromEntries(
    Object.entries(params).filter(([, v]) => v !== undefined && v !== null && v !== "")
  );
  window.gtag("event", name, clean);
}
