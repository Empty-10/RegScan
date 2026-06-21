"use client";

import { useEffect, useRef } from "react";
import { Icon } from "./Icon";
import { daysUntil } from "@/lib/mockData";

// VRM input — uppercase, no spaces beyond formatting, max 8 chars (UK plate-ish)
export function PlateInput({ value, onChange, onSubmit, autoFocus, size = "lg", placeholder = "AB12 CDE" }) {
  const ref = useRef(null);
  useEffect(() => {
    if (autoFocus && ref.current) ref.current.focus();
  }, [autoFocus]);
  const handle = (e) => {
    const raw = e.target.value.toUpperCase().replace(/[^A-Z0-9 ]/g, "").slice(0, 8);
    onChange(raw);
  };
  const handleKey = (e) => {
    if (e.key === "Enter" && onSubmit) onSubmit();
  };
  return (
    <div className="plate-input">
      <input
        ref={ref}
        className={size === "sm" ? "plate-input-sm" : ""}
        type="text"
        inputMode="text"
        autoComplete="off"
        spellCheck={false}
        value={value}
        onChange={handle}
        onKeyDown={handleKey}
        placeholder={placeholder}
        aria-label="Vehicle registration"
      />
    </div>
  );
}

export function VehicleTypeSelect({ value, onChange }) {
  return (
    <select className="select" value={value} onChange={(e) => onChange(e.target.value)} aria-label="Vehicle type">
      <option value="car">Car</option>
      <option value="van">Van</option>
      <option value="motorcycle">Motorcycle</option>
    </select>
  );
}

export function Toast({ children, onDone, duration = 2400 }) {
  useEffect(() => {
    const t = setTimeout(() => onDone && onDone(), duration);
    return () => clearTimeout(t);
  }, [onDone, duration]);
  return (
    <div className="toast" role="status" aria-live="polite">
      <Icon name="check-circle" size={18} />
      {children}
    </div>
  );
}

export function statusForMot(v) {
  if (!v) return { kind: "grey", text: "Unknown" };
  if (v.motStatus === "valid") {
    const days = daysUntil(v.motExpiry);
    if (days != null && days <= 30) return { kind: "amber", text: `MOT due in ${days}d` };
    return { kind: "green", text: "MOT valid" };
  }
  if (v.motStatus === "due-soon") return { kind: "amber", text: "MOT due soon" };
  if (v.motStatus === "expired") return { kind: "red", text: "MOT expired" };
  if (v.motStatus === "none") return { kind: "grey", text: "No MOT yet" };
  return { kind: "grey", text: "Unknown" };
}

export function statusForTax(v) {
  if (!v) return { kind: "grey", text: "Unknown" };
  if (v.taxStatus === "valid") return { kind: "green", text: "Tax valid" };
  if (v.taxStatus === "expired") return { kind: "red", text: "Tax expired" };
  if (v.taxStatus === "sorn") return { kind: "blue", text: "SORN" };
  return { kind: "grey", text: "Unknown" };
}

export function StatusBadge({ kind, children }) {
  const cls = "badge badge-" + (kind || "grey");
  return (
    <span className={cls}>
      <span className="dot" />
      {children}
    </span>
  );
}

export function FaqItem({ q, children }) {
  return (
    <details className="faq-item">
      <summary>
        <span>{q}</span>
        <span className="icon"><Icon name="plus" size={16} /></span>
      </summary>
      <div className="answer">{children}</div>
    </details>
  );
}
