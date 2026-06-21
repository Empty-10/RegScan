"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Icon } from "./Icon";
import { GarageHeader } from "./Header";
import { Footer } from "./Footer";
import { PlateInput, Toast, StatusBadge, statusForMot, statusForTax } from "./ui";
import { mockVehicles, daysUntil, formatDate } from "@/lib/mockData";

export default function GarageView() {
  const seed = ["LF19XKM", "EV70RUN", "VN64WRK"].map((k) => mockVehicles[k]).filter(Boolean);
  const [vehicles, setVehicles] = useState(seed);
  const [showAdd, setShowAdd] = useState(false);
  const [toast, setToast] = useState(null);

  const addVehicle = (vrm, nickname) => {
    const cleaned = vrm.replace(/\s+/g, "").toUpperCase();
    const existing = mockVehicles[cleaned];
    if (existing && !vehicles.find((v) => v.vrm.replace(/\s/g, "") === existing.vrm.replace(/\s/g, ""))) {
      setVehicles([...vehicles, { ...existing, nickname: nickname || existing.nickname || "" }]);
      setToast(`${existing.vrm} added to your garage`);
    } else if (!existing) {
      setVehicles([
        ...vehicles,
        {
          vrm: vrm.toUpperCase(),
          make: "Pending lookup",
          model: "—",
          year: "—",
          fuel: "—",
          motStatus: "valid",
          motExpiry: "2027-01-01",
          taxStatus: "valid",
          taxExpiry: "2027-01-01",
          nickname: nickname || "New vehicle",
          advisoryCount: 0,
          reminders: { email: true, sms: false },
          motTests: [],
        },
      ]);
      setToast(`${vrm.toUpperCase()} added to your garage`);
    } else {
      setToast("That vehicle is already in your garage");
    }
    setShowAdd(false);
  };

  const removeVehicle = (vrm) => {
    setVehicles(vehicles.filter((v) => v.vrm !== vrm));
    setToast(`${vrm} removed`);
  };

  const toggleReminder = (vrm, kind) => {
    setVehicles(
      vehicles.map((v) =>
        v.vrm === vrm ? { ...v, reminders: { ...v.reminders, [kind]: !v.reminders[kind] } } : v
      )
    );
  };

  const allOk = vehicles.filter((v) => v.motStatus === "valid" && v.taxStatus === "valid").length;
  const expiring = vehicles.filter(
    (v) => v.motStatus === "due-soon" || (v.motStatus === "valid" && daysUntil(v.motExpiry) <= 30)
  ).length;
  const expired = vehicles.filter((v) => v.motStatus === "expired" || v.taxStatus === "expired").length;

  return (
    <>
      <GarageHeader />

      <section className="garage-hero">
        <div className="container">
          <div className="row">
            <div>
              <span className="eyebrow"><Icon name="garage" size={14} /> My garage</span>
              <h1>Hello, Alex.</h1>
              <p>You&apos;ve got {vehicles.length} {vehicles.length === 1 ? "vehicle" : "vehicles"} in your RegScan garage. Here&apos;s how they&apos;re doing.</p>
            </div>
            <button onClick={() => setShowAdd(true)} className="btn btn-primary btn-lg">
              <Icon name="plus" size={18} /> Add a vehicle
            </button>
          </div>

          <div className="garage-stats">
            <div className="stat">
              <div className="k">All vehicles</div>
              <div className="v">{vehicles.length}</div>
              <div className="sub">In your garage</div>
            </div>
            <div className="stat">
              <div className="k">Road-legal</div>
              <div className="v" style={{ color: "var(--green)" }}>{allOk}</div>
              <div className="sub">MOT &amp; tax valid</div>
            </div>
            <div className="stat">
              <div className="k">Due in 30 days</div>
              <div className="v" style={{ color: "var(--amber-ink)" }}>{expiring}</div>
              <div className="sub">Reminders queued</div>
            </div>
            <div className="stat">
              <div className="k">Expired</div>
              <div className="v" style={{ color: expired ? "var(--red)" : "var(--ink-3)" }}>{expired}</div>
              <div className="sub">Needs attention</div>
            </div>
          </div>
        </div>
      </section>

      <main className="container" style={{ paddingBottom: 40 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "end", marginTop: 36, flexWrap: "wrap", gap: 12 }}>
          <h2 style={{ fontSize: 22, fontWeight: 800, letterSpacing: "-0.02em" }}>Your vehicles</h2>
          <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
            <select className="select" style={{ width: "auto", padding: "8px 12px", fontSize: 13, height: 36 }}>
              <option>Sort: Most urgent first</option>
              <option>Sort: A → Z</option>
              <option>Sort: Recently added</option>
            </select>
          </div>
        </div>

        <div className="garage-grid">
          {vehicles.map((v) => (
            <VehicleCard key={v.vrm} v={v} onRemove={removeVehicle} onToggleReminder={toggleReminder} />
          ))}
          <button className="add-vehicle" onClick={() => setShowAdd(true)} aria-label="Add a vehicle">
            <div className="ico"><Icon name="plus" size={22} /></div>
            <div style={{ fontWeight: 700, fontSize: 16, color: "var(--ink)" }}>Add another vehicle</div>
            <div style={{ fontSize: 13.5, color: "var(--ink-3)", marginTop: 4, maxWidth: 240 }}>Just the VRM and an optional nickname (e.g. &quot;Family car&quot;).</div>
          </button>
        </div>

        {/* Reminders explainer panel */}
        <div className="card" style={{ padding: 28, marginTop: 36, display: "grid", gridTemplateColumns: "1fr 1.4fr", gap: 32, alignItems: "center" }}>
          <div>
            <span className="eyebrow"><Icon name="bell" size={14} /> Reminder settings</span>
            <h3 style={{ fontSize: 20, fontWeight: 800, letterSpacing: "-0.01em" }}>How reminders work</h3>
            <p style={{ color: "var(--ink-2)", marginTop: 8, fontSize: 14.5, lineHeight: 1.6 }}>
              We email you at sensible intervals before your MOT or tax falls due. You can toggle email or (soon) SMS per vehicle from the card. One‑click unsubscribe lives in every email.
            </p>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 12 }}>
            <ReminderTimingTile day="30" label="First nudge" />
            <ReminderTimingTile day="14" label="Two-week" />
            <ReminderTimingTile day="7" label="One-week" />
            <ReminderTimingTile day="1" label="Final reminder" intense />
          </div>
        </div>
      </main>

      <Footer />

      {showAdd && <AddVehicleModal onClose={() => setShowAdd(false)} onAdd={addVehicle} />}
      {toast && <Toast onDone={() => setToast(null)}>{toast}</Toast>}
    </>
  );
}

function VehicleCard({ v, onRemove, onToggleReminder }) {
  const motS = statusForMot(v);
  const taxS = statusForTax(v);
  const motDays = daysUntil(v.motExpiry);
  const taxDays = daysUntil(v.taxExpiry);
  const isUrgent = motS.kind === "red" || taxS.kind === "red" || motS.kind === "amber";

  return (
    <div className="vehicle-card" style={isUrgent ? { borderColor: "#EFBEC3" } : null}>
      <div className="head">
        <div>
          <div className="name">{v.nickname || "Unnamed"}</div>
          <div className="model">{v.make} {v.model}</div>
          <div style={{ marginTop: 12, display: "flex", gap: 10, alignItems: "center", flexWrap: "wrap" }}>
            <span className="plate">{v.vrm}</span>
            <span style={{ fontSize: 13, color: "var(--ink-3)" }}>
              {v.year} · {v.fuel}{v.engineCc ? ` · ${(v.engineCc / 1000).toFixed(1)}L` : ""}
            </span>
          </div>
        </div>
        <button onClick={() => onRemove(v.vrm)} title="Remove from garage" aria-label="Remove" style={{ background: "transparent", border: "none", cursor: "pointer", padding: 6, borderRadius: 6, color: "var(--ink-3)" }}>
          <Icon name="x" size={18} />
        </button>
      </div>

      <div className="stats">
        <div>
          <div className="k">MOT</div>
          <div className="v"><StatusBadge kind={motS.kind}>{motS.text}</StatusBadge></div>
          <div style={{ fontSize: 12.5, color: "var(--ink-3)", marginTop: 4 }}>
            {v.motExpiry ? `${formatDate(v.motExpiry, { short: true })}${motDays != null ? ` · ${motDays > 0 ? `in ${motDays}d` : `${-motDays}d ago`}` : ""}` : "—"}
          </div>
        </div>
        <div>
          <div className="k">Tax</div>
          <div className="v"><StatusBadge kind={taxS.kind}>{taxS.text}</StatusBadge></div>
          <div style={{ fontSize: 12.5, color: "var(--ink-3)", marginTop: 4 }}>
            {v.taxExpiry ? `${formatDate(v.taxExpiry, { short: true })}${taxDays != null ? ` · ${taxDays > 0 ? `in ${taxDays}d` : `${-taxDays}d ago`}` : ""}` : "—"}
          </div>
        </div>
      </div>

      <div className="advis">
        {v.advisoryCount > 0 ? (
          <span style={{ display: "inline-flex", alignItems: "center", gap: 6 }}>
            <Icon name="info" size={14} /> {v.advisoryCount} {v.advisoryCount === 1 ? "advisory" : "advisories"} on last MOT
          </span>
        ) : (
          <span style={{ display: "inline-flex", alignItems: "center", gap: 6, color: "var(--green)" }}>
            <Icon name="check-circle" size={14} /> No advisories on last MOT
          </span>
        )}
      </div>

      <div className="tags">
        <button
          onClick={() => onToggleReminder(v.vrm, "email")}
          className="badge"
          style={{ cursor: "pointer", border: "1px solid", background: v.reminders?.email ? "var(--green-tint)" : "#F0F1F2", color: v.reminders?.email ? "var(--green)" : "var(--ink-3)", borderColor: v.reminders?.email ? "#BDE3CD" : "#E0E2E4" }}
        >
          <Icon name="mail" size={11} /> Email {v.reminders?.email ? "on" : "off"}
        </button>
        <button
          onClick={() => onToggleReminder(v.vrm, "sms")}
          className="badge"
          style={{ cursor: "pointer", border: "1px solid", background: v.reminders?.sms ? "var(--green-tint)" : "#F0F1F2", color: v.reminders?.sms ? "var(--green)" : "var(--ink-3)", borderColor: v.reminders?.sms ? "#BDE3CD" : "#E0E2E4" }}
        >
          <Icon name="phone" size={11} /> SMS {v.reminders?.sms ? "on" : "off (soon)"}
        </button>
      </div>

      <div className="actions">
        <div className="l">
          <Link href={`/check?vrm=${v.vrm.replace(/\s/g, "")}&type=car`} className="btn btn-blue btn-sm">View details</Link>
          <button className="btn btn-secondary btn-sm">
            <Icon name="bell" size={14} /> Manage reminders
          </button>
        </div>
        <button className="btn btn-ghost btn-sm" style={{ color: "var(--ink-3)" }}>
          <Icon name="edit" size={14} />
        </button>
      </div>
    </div>
  );
}

function ReminderTimingTile({ day, label, intense }) {
  return (
    <div style={{
      background: intense ? "var(--amber-tint)" : "var(--bg)",
      border: "1px solid " + (intense ? "#ECCF92" : "var(--line)"),
      borderRadius: 10,
      padding: "14px 12px",
      textAlign: "center",
    }}>
      <div style={{ fontSize: 24, fontWeight: 800, letterSpacing: "-0.02em", color: intense ? "var(--amber-ink)" : "var(--ink)" }}>{day}d</div>
      <div style={{ fontSize: 12, color: "var(--ink-3)", marginTop: 2 }}>{label}</div>
    </div>
  );
}

function AddVehicleModal({ onClose, onAdd }) {
  const [vrm, setVrm] = useState("");
  const [nickname, setNickname] = useState("");
  const submit = (e) => {
    e.preventDefault();
    if (vrm.replace(/\s/g, "").length < 2) return;
    onAdd(vrm, nickname);
  };
  useEffect(() => {
    const h = (e) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", h);
    return () => window.removeEventListener("keydown", h);
  }, [onClose]);

  return (
    <div className="modal-backdrop" onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}>
      <div className="modal" role="dialog" aria-modal="true" aria-label="Add a vehicle">
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
          <div>
            <h3>Add a vehicle</h3>
            <p>Enter the registration. We&apos;ll fetch MOT &amp; tax data automatically.</p>
          </div>
          <button onClick={onClose} aria-label="Close" style={{ background: "transparent", border: "none", cursor: "pointer", padding: 6, color: "var(--ink-3)" }}>
            <Icon name="x" size={20} />
          </button>
        </div>
        <form onSubmit={submit}>
          <div className="field">
            <label className="label" htmlFor="add-vrm">Vehicle registration (VRM)</label>
            <PlateInput value={vrm} onChange={setVrm} autoFocus placeholder="AB12 CDE" />
            <div style={{ fontSize: 12, color: "var(--ink-3)", marginTop: 6 }}>
              Tip: try <button type="button" onClick={() => setVrm("LF19XKM")} className="kbd" style={{ cursor: "pointer" }}>LF19 XKM</button> or <button type="button" onClick={() => setVrm("EV70RUN")} className="kbd" style={{ cursor: "pointer" }}>EV70 RUN</button>
            </div>
          </div>
          <div className="field">
            <label className="label" htmlFor="add-nick">Nickname (optional)</label>
            <input id="add-nick" className="input" type="text" placeholder="Family car, Mum's, Weekend toy…" value={nickname} onChange={(e) => setNickname(e.target.value)} maxLength={40} />
          </div>
          <div className="row">
            <button type="button" onClick={onClose} className="btn btn-secondary">Cancel</button>
            <button type="submit" className="btn btn-primary">
              <Icon name="plus" size={16} /> Add to garage
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
