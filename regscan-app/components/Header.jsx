"use client";

import { useState } from "react";
import Link from "next/link";
import { Icon } from "./Icon";
import { REMINDERS_ENABLED } from "@/lib/features";

export function Header({ active }) {
  return (
    <header className="site-header">
      <div className="container">
        <div className="row">
          <Link href="/" className="brand" aria-label="RegScan home">
            <span className="brand-mark">R</span>
            <span>RegScan</span>
          </Link>
          <nav className="nav" aria-label="Primary">
            <Link href="/#how" className={"nav-link" + (active === "how" ? " active" : "")}>How it works</Link>
            {REMINDERS_ENABLED && (
              <Link href="/#reminders" className={"nav-link" + (active === "reminders" ? " active" : "")}>Reminders</Link>
            )}
            <Link href="/garage" className={"nav-link" + (active === "garage" ? " active" : "")}>My Garage</Link>
            <Link href="/#faq" className={"nav-link" + (active === "faq" ? " active" : "")}>FAQs</Link>
          </nav>
          <div className="header-cta">
            <Link href="/garage" className="btn btn-ghost btn-sm">Log in</Link>
            <Link href="/garage" className="btn btn-primary btn-sm">Sign up free</Link>
          </div>
        </div>
      </div>
    </header>
  );
}

export function GarageHeader() {
  const [menu, setMenu] = useState(false);
  return (
    <header className="site-header">
      <div className="container">
        <div className="row">
          <Link href="/" className="brand">
            <span className="brand-mark">R</span>
            <span>RegScan</span>
          </Link>
          <nav className="nav">
            <Link href="/" className="nav-link">Home</Link>
            <Link href="/garage" className="nav-link active">My Garage</Link>
            {REMINDERS_ENABLED && <Link href="/#reminders" className="nav-link">Reminders</Link>}
            <Link href="/#faq" className="nav-link">Help</Link>
          </nav>
          <div className="header-cta" style={{ position: "relative" }}>
            <button onClick={() => setMenu(!menu)} className="btn btn-ghost btn-sm" style={{ gap: 8 }}>
              <span style={{ width: 28, height: 28, borderRadius: "50%", background: "var(--blue-tint)", color: "var(--blue)", display: "inline-flex", alignItems: "center", justifyContent: "center", fontWeight: 700, fontSize: 13 }}>AT</span>
              <span style={{ fontWeight: 600 }}>alex.t@email.com</span>
              <Icon name="chevron-down" size={14} />
            </button>
            {menu && (
              <div onMouseLeave={() => setMenu(false)} style={{ position: "absolute", top: 48, right: 0, background: "#fff", border: "1px solid var(--line)", borderRadius: "var(--radius-lg)", boxShadow: "var(--shadow-lg)", minWidth: 220, padding: 6, zIndex: 100 }}>
                <a href="#" style={{ display: "flex", alignItems: "center", gap: 10, padding: "10px 12px", textDecoration: "none", color: "var(--ink)", borderRadius: 8, fontSize: 14 }}>
                  <Icon name="user" size={16} /> Account settings
                </a>
                {REMINDERS_ENABLED && (
                  <a href="#" style={{ display: "flex", alignItems: "center", gap: 10, padding: "10px 12px", textDecoration: "none", color: "var(--ink)", borderRadius: 8, fontSize: 14 }}>
                    <Icon name="bell" size={16} /> Reminder preferences
                  </a>
                )}
                <a href="#" style={{ display: "flex", alignItems: "center", gap: 10, padding: "10px 12px", textDecoration: "none", color: "var(--ink)", borderRadius: 8, fontSize: 14 }}>
                  <Icon name="settings" size={16} /> Privacy &amp; data
                </a>
                <div style={{ height: 1, background: "var(--line)", margin: "6px 0" }} />
                <Link href="/" style={{ display: "flex", alignItems: "center", gap: 10, padding: "10px 12px", textDecoration: "none", color: "var(--red)", borderRadius: 8, fontSize: 14, fontWeight: 600 }}>
                  <Icon name="log-out" size={16} /> Log out
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}

export default Header;
