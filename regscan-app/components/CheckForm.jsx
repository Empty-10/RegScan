"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Icon } from "./Icon";
import { PlateInput } from "./ui";

// Standalone "enter your registration" form for /check/ when no reg is supplied.
export function CheckForm() {
  const router = useRouter();
  const [vrm, setVrm] = useState("");
  const [error, setError] = useState(null);

  const handleSubmit = (e) => {
    if (e) e.preventDefault();
    const cleaned = vrm.replace(/\s+/g, "").toUpperCase();
    if (cleaned.length < 2) {
      setError("Enter a valid UK registration number.");
      return;
    }
    setError(null);
    router.push(`/check/?vrm=${encodeURIComponent(cleaned)}&type=car`);
  };

  return (
    <form className="search-card check-form" onSubmit={handleSubmit} style={{ marginTop: 8 }}>
      <div className="row">
        <div>
          <label className="label" htmlFor="vrm-input">Vehicle registration (VRM)</label>
          <PlateInput value={vrm} onChange={setVrm} onSubmit={handleSubmit} autoFocus placeholder="AB12 CDE" />
        </div>
        <div>
          <button type="submit" className="btn btn-primary">
            <Icon name="search" size={16} /> Check MOT &amp; tax
          </button>
        </div>
      </div>
      {error && (
        <div style={{ marginTop: 12, color: "var(--red)", fontSize: 14, display: "flex", alignItems: "center", gap: 8 }}>
          <Icon name="alert-triangle" size={16} /> {error}
        </div>
      )}
      <div className="meta">
        <span style={{ display: "inline-flex", alignItems: "center", gap: 6 }}>
          <Icon name="shield" size={14} /> Official DVSA &amp; DVLA data · Free to use
        </span>
      </div>
    </form>
  );
}
