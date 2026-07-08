"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

const KEY = "regscan-consent";

// Cookie-consent banner wired to Google Consent Mode v2. Shows until the user
// chooses; Analytics only gets consent (and sets cookies) after "Accept".
export function ConsentBanner() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    try {
      if (!localStorage.getItem(KEY)) setShow(true);
    } catch (e) {
      setShow(true);
    }
  }, []);

  const choose = (granted) => {
    try {
      localStorage.setItem(KEY, granted ? "granted" : "denied");
    } catch (e) {}
    if (typeof window !== "undefined" && typeof window.gtag === "function") {
      window.gtag("consent", "update", { analytics_storage: granted ? "granted" : "denied" });
    }
    setShow(false);
  };

  if (!show) return null;

  return (
    <div className="consent" role="dialog" aria-label="Cookie consent" aria-live="polite">
      <div className="consent-inner">
        <p className="consent-text">
          We use cookies to measure site traffic with Google Analytics and improve RegScan.
          You can accept, or continue with essential cookies only.{" "}
          <Link href="/cookie-policy/">Cookie policy</Link>
        </p>
        <div className="consent-actions">
          <button type="button" className="btn btn-secondary btn-sm" onClick={() => choose(false)}>
            Reject
          </button>
          <button type="button" className="btn btn-primary btn-sm" onClick={() => choose(true)}>
            Accept
          </button>
        </div>
      </div>
    </div>
  );
}
