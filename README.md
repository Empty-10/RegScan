# Handoff: RegScan — UK MOT & Tax Check Website

## Overview
RegScan is a free consumer website for checking a UK vehicle's MOT status, tax status, and full MOT history from official DVSA/DVLA data, and for setting free renewal reminders. A user enters a registration plate (VRM) on the home page, lands on a detailed vehicle results report, can save vehicles to a "garage", and read SEO content articles.

This bundle contains four page designs plus shared chrome:
- **Home** (`index.html` / `home.jsx`) — landing page with the reg-plate search.
- **Results** (`results.html` / `results.jsx`) — the vehicle report (the core product page).
- **Garage** (`garage.html` / `garage.jsx`) — saved vehicles + reminders dashboard.
- **Article** (`article.html` / `article.jsx`) — SEO content/article template with sticky TOC + schema.

## About the Design Files
The files in this bundle are **design references created in HTML** — working prototypes that show the intended look, layout, and behavior. They are **not** production code to copy verbatim. Each page is rendered with React 18 + Babel-in-the-browser via CDN `<script>` tags purely so the prototype runs from a static file; that is a prototyping convenience, not an architectural recommendation.

Your task is to **recreate these designs in the target codebase's environment** using its established patterns, build tooling, and component conventions. If there is no existing codebase yet, pick an appropriate modern framework (the markup is plain React + CSS, so Next.js / Vite + React maps over almost 1:1; Vue/Svelte/Astro are all fine too) and implement there. Replace the in-browser Babel transform with a real build step, and replace the mock data layer (`mock-data.js`) with real API calls (see **State / Data**).

## Fidelity
**High-fidelity (hifi).** These are pixel-level mockups with final colors, typography, spacing, shadows, and interaction states. Recreate the UI faithfully — the exact design tokens are in `styles.css` `:root` and reproduced under **Design Tokens** below. Don't re-style from scratch; lift the tokens.

---

## Shared Chrome (used on every page)

Defined in `components.jsx`, exported on `window` for the prototype. Recreate as shared layout components.

- **`Header`** — sticky top nav. Left: RegScan wordmark/logo. Center/right: nav links (Check a vehicle / How it works / Reminders / Resources) + a "My garage" action. Takes an `active` prop to highlight the current section. Sticky at top, white/translucent background over the cream page, bottom hairline border (`--line`).
- **`Footer`** — multi-column dark/cream footer with link groups, legal text, and a note that data comes from official DVSA & DVLA sources.
- **`Icon`** — inline-SVG icon set keyed by name (`check`, `alert-triangle`, `shield`, `shield-check`, `chevron-right`, `arrow-right`, `bell`, `plus`, `garage`, etc.). Recreate with your codebase's icon system (Lucide is a close match for most).
- **`cta-band`** — full-width dark slate section (`--slate`) with a heading, one line of subtext, and a yellow primary button. Reused as the footer CTA on multiple pages.
- **Reg plate** — `.plate` / `.plate-lg`: the UK number-plate styling — yellow (`--amber`) background, black `--font-plate` (Charles Wright with web fallbacks), rounded corners, bold tracking. This is a signature brand element; reproduce it carefully.

---

## Screens / Views

### 1. Home (`index.html` / `home.jsx`)
- **Purpose:** First touch. User types a VRM and starts a check.
- **Layout:** Centered single column within `.container` (max-width 1180px, 24px gutters). Hero with H1 + subhead, then a prominent search row (plate-style input + primary "Check vehicle" button), trust signals, "how it works" steps, a features grid of white cards, an FAQ accordion, and the dark CTA band before the footer.
- **Key components:** Reg-plate search input; primary amber button; white rounded feature cards (`--radius-lg`, `--shadow-sm`); FAQ `<details>` accordion rows; dark CTA band.
- **Behavior:** Typing a plate and submitting navigates to the results page. Input should accept/format a UK VRM (uppercase, spacing).

### 2. Results (`results.html` / `results.jsx`) — core page
The most important page. Linear stack of report sections inside `.container`.

**a) Vehicle Profile — "control centre" card** (`.vehicle-profile`)
A single unified white card that is the visual anchor of the page. Structure:
- **`.vp-main`** — two columns (`1fr auto`):
  - Left (`.vp-identity`): a row with a dark square **monogram** badge (`.vp-monogram`, 52×52, `--ink` bg, white text, e.g. "VW") next to the **large reg plate** (`.plate-lg`); below it the **vehicle name** H1 (`.vp-name`, clamp 27–36px, weight 800, e.g. "Volkswagen Golf SE TSI"); below that a **metadata row** (`.vp-meta`) with dot separators — `Pearl White · Petrol · 2018 · 1.4L · Euro 6`; then **verdict pills** (`.vp-verdict`) — a green "Road legal" and an amber "1 advisory due soon".
  - Right (`.vp-health`): a **Vehicle Health** module — a 124px SVG **ring gauge** (`HealthRing`) showing a 0–100 score (e.g. 82 / 100), with a label, state text ("Good standing"), and a one-line note. Ring color thresholds: ≥80 green (`--green`), ≥50 amber (`#E0A100`), else red (`--red`); track is `--line`, 11px stroke, rounded cap, starts at 12 o'clock (`rotate(-90)`).
- **`.vp-status`** — a 4-column compliance strip **inside the same card**, divided by hairlines. Each item: a round icon chip (green check / amber alert) + title + meta. Items: **MOT valid** (Expires 14 Mar 2026), **Tax active** (Renews 01 Aug 2026), **ULEZ charges apply** (£12.50 / day · inner London — amber/warn), **Reminder enabled** (30 days before MOT).
- **`.vp-footer`** — cream footer strip inside the card: left a data-source line ("Checked today · Official DVSA & DVLA data" with a shield icon), right the **"Save to garage"** primary button.

**b) Below the profile:** mileage history (line chart card, `.chart-card` / `.chart-line` / `.chart-dot` in amber), advisories list, and full MOT history timeline. These already-strong sections use the same white-card vocabulary.

**c) Breadcrumb** (`.results-breadcrumb`): subtle small row under the nav — `Home › … › current` with chevron separators; last crumb in `.current` (non-link, darker).

### 3. Garage (`garage.html` / `garage.jsx`)
- **Purpose:** Dashboard of saved vehicles with reminder management.
- **Layout:** Header + intro, then a list/grid of saved-vehicle cards, each showing the plate, vehicle identity, next MOT/tax due dates, and reminder toggle state. Empty state prompts the user to check a vehicle.

### 4. Article (`article.html` / `article.jsx`)
SEO content template. In source order:
- **Breadcrumb** (same `.results-breadcrumb` style): Home › Resources › title.
- **Article header** (`.article-header`) — a **white card** spanning the content width (border, `--radius-lg`, `--shadow-sm`) that reads as a distinct editorial zone over the cream page. Inner content centered, max-width 820px (`.article-header-inner`): yellow **category pill** (`.article-tag`) → **H1** (`.article-title`, clamp 32–52px, weight 800) → grey **dek/meta description** (`.article-dek`) → **byline row** (`.article-byline`) with author avatar + name · published · updated · read time, dot-separated.
- **Two-column layout** (`.article-layout`): `68fr 28fr`, 4% gap, top hairline border. Collapses to single column under 920px (TOC hidden).
  - **Left** (`.article-body`, max-width 720px): H2 sections (`scroll-margin-top: 96px` for anchor offset), body paragraphs (17px, line-height 1.7, `--ink-2`). A **mid-article CTA** (`.article-cta`) — soft amber gradient block with eyebrow, H3, and a primary button — sits between sections as a content block (not a banner). Ends with a **FAQ** accordion (`.article-faq`, reuses the homepage `<details>` pattern).
  - **Right** (`.article-aside`): **sticky Table of Contents** card (`.toc-card`, sticky `top: 92px`). Heading "In this article", anchor links (`.toc-link`) for each H2 that **scrollspy-highlight** (active = `.toc-link.active`, amber-tinted bg + left amber border), plus a reading **progress bar** (`.toc-progress`).
- **Related articles** (`.related-section`): full-width section, 3-up grid of `.related-card` (category tag, title, one-line desc, "Read more →"); collapses to 1 column under 880px. Hover lifts the card (`translateY(-2px)` + shadow).
- **Footer CTA**: the shared dark `.cta-band` — "Never miss your MOT or tax deadline" / "Free reminders at 30, 14 and 1 day before. No account needed." / amber "Set free reminder →".

---

## Interactions & Behavior
- **Search → Results:** submitting the home search routes to the results page for that VRM.
- **Save to garage:** clicking shows a toast ("Saved to your garage") in the prototype; in production this persists the vehicle to the user's garage.
- **FAQ accordions:** native `<details>/<summary>`; the `+` icon should rotate/swap to `−` on open. Keep them keyboard-accessible.
- **Article scrollspy (TOC):** on scroll, the active section = the last H2 whose top crosses a trigger line at ~30% of viewport height; the matching TOC link gets `.active`, and a progress bar fills based on how far through the article body the user has scrolled. The TOC card is `position: sticky; top: 92px`. **Implementation note:** the active-section/progress update is driven by a real `scroll` listener (passive) + a `resize` listener, computed from `getBoundingClientRect()`. Prefer `IntersectionObserver` in production for the active-section logic.
- **Card hover states:** related-article cards lift; buttons have `:active { translateY(1px) }` and `:focus-visible` outline `3px solid #FFDD00`.
- **Transitions:** buttons/links ~0.15s ease on background/border/color; card hover 0.15s.
- **Responsive:** profile `.vp-main` and `.vp-status` reflow at 880px / 520px; article layout collapses (TOC hidden) at 920px; related grid 3→1 at 880px. Container gutters tighten to 18px under 640px.

## State / Data
The prototype uses `mock-data.js`, which intentionally mirrors the **DVSA MOT History API** and **DVLA Vehicle Enquiry Service (VES)** response shapes. In production:
- Fetch vehicle + MOT history from those official APIs (server-side; both require API keys/registration). Do **not** expose keys client-side.
- Map the response into: vehicle identity (make/model/colour/year/fuel/engine/Euro status), MOT status + expiry, tax status + due date, ULEZ/CAZ compliance, mileage readings (for the chart), and the advisory/failure history list.
- **Vehicle Health score** is a derived/computed value (the prototype hardcodes 82). Define the scoring inputs server-side — the design suggests: MOT status, tax status, open advisories, mileage consistency, ULEZ compliance, reminder status.
- **Garage + reminders** require user persistence (saved VRMs, reminder preferences at 30/14/1 days). The marketing copy says "No account needed", so reminders are likely email-based without a full account — confirm the intended auth model.

State variables seen in the prototype: search input value + vehicle type toggle (home), toast message (results "Save to garage"), TOC `activeId` + reading `progress` (article), FAQ open/closed (native).

---

## Design Tokens
Lifted from `styles.css` `:root`. Use these exact values.

**Colors**
| Token | Hex | Use |
|---|---|---|
| `--bg` | `#F4F1EA` | page background (warm stone / cream) |
| `--bg-2` | `#ECE7DB` | deeper stone contrast band |
| `--bg-card` | `#FFFFFF` | card background |
| `--bg-tint` | `#EAF2F8` | tinted info background |
| `--bg-band` | `#F0EBDF` | section band |
| `--ink` | `#0E1014` | primary near-black text |
| `--ink-2` | `#2C3138` | body text |
| `--ink-3` | `#5B626A` | muted/meta text |
| `--ink-4` | `#8A9099` | faint text |
| `--line` | `#DDD8CC` | hairline borders |
| `--line-2` | `#B6AFA0` | stronger borders |
| `--amber` | `#FFC627` | signature accent / primary button / plate |
| `--amber-2` | `#FFB814` | accent hover |
| `--amber-ink` | `#6A4400` | text on amber tint |
| `--amber-tint` | `#FFF2C4` | amber background tint |
| `--slate` | `#11161E` | inverted/dark sections |
| `--slate-2` | `#1B2230` | dark section layer |
| `--slate-3` | `#2B3548` | dark section layer |
| `--slate-ink` | `#E9ECF1` | text on dark |
| `--slate-ink-2` | `#A6ADB9` | muted text on dark |
| `--blue` | `#1D70B8` | links |
| `--blue-ink` | `#144D80` | link hover |
| `--blue-tint` | `#E6F0F8` | link/info tint |
| `--green` | `#007A3D` | success / valid |
| `--green-tint` | `#DCEFE2` | success background |
| `--red` | `#C0162A` | error / fail |
| `--red-tint` | `#FBE3E6` | error background |

**Radii:** `--radius-sm` 6px · `--radius` 10px · `--radius-lg` 14px · `--radius-xl` 20px · pills 999px.

**Shadows:**
- `--shadow-sm`: `0 1px 0 rgba(14,16,20,.04), 0 1px 2px rgba(14,16,20,.05)`
- `--shadow`: `0 1px 2px rgba(14,16,20,.05), 0 10px 28px -14px rgba(14,16,20,.14)`
- `--shadow-lg`: `0 2px 4px rgba(14,16,20,.06), 0 28px 60px -24px rgba(14,16,20,.28)`
- `--shadow-hero`: `0 1px 0 rgba(14,16,20,.04), 0 30px 60px -30px rgba(14,16,20,.35), 0 12px 24px -12px rgba(14,16,20,.18)`

**Typography:**
- UI font: **Plus Jakarta Sans** (weights 400/500/600/700/800), via Google Fonts. Stack: `"Plus Jakarta Sans", ui-sans-serif, system-ui, -apple-system, "Segoe UI", Roboto, sans-serif`.
- Plate font: `"Charles Wright", "UK Number Plate", "Plus Jakarta Sans", sans-serif` (Charles Wright is the UK plate typeface; bundle/license it or fall back).
- Headings: negative tracking (`letter-spacing: -0.012em` base, tighter on large display, e.g. `-0.028em`), weight 800 for H1/display.
- Body: 17px / line-height 1.7 in articles; 1.55 default.
- Layout container: max-width **1180px**, 24px gutters (18px under 640px).

**Buttons:** `.btn-primary` = amber bg, `#1A1300` text, `#C99C13` border, inset highlight + subtle drop shadow, weight 700, radius `--radius`, padding 13×18px; hover → `--amber-2`. `.btn-secondary` = white, `--ink` text, `--line-2` border. `.btn-dark` = slate. Focus ring `3px solid #FFDD00`.

## Assets
- **Fonts:** Plus Jakarta Sans (Google Fonts CDN in the prototype — self-host in production). Charles Wright for plates (license/self-host; the prototype falls back to the UI font if unavailable).
- **Icons:** all inline SVG in `components.jsx` (`Icon`). No external icon files. Lucide covers close equivalents.
- **Images:** none — the design is fully typographic + SVG (charts, health ring, icons are all drawn in code). No raster assets to migrate.
- **No third-party brand assets** are used; RegScan branding is original (wordmark + the amber plate motif).

## Files
All paths are at the root of this handoff bundle.

| File | Role |
|---|---|
| `styles.css` | **Single source of truth for all tokens, components, and layout.** Start here. |
| `components.jsx` | Shared `Header`, `Footer`, `Icon`, CTA band, plate. |
| `mock-data.js` | Mock DVSA/DVLA-shaped data + stub API calls — replace with real APIs. |
| `index.html` / `home.jsx` | Home / landing + search. |
| `results.html` / `results.jsx` | Vehicle report (core page) — profile control-centre, health ring, compliance strip, mileage chart, MOT history. |
| `garage.html` / `garage.jsx` | Saved vehicles + reminders dashboard. |
| `article.html` / `article.jsx` | SEO article template — sticky TOC scrollspy, mid-article CTA, FAQ, related, JSON-LD schema. |

**SEO note:** `article.html` includes meta title/description, Open Graph tags, and three JSON-LD blocks (Article, FAQPage, BreadcrumbList). Reproduce these as server-rendered metadata in production (e.g. Next.js metadata API), keeping the schema in sync with the visible content.

## How to run the prototype
Serve the folder over any static HTTP server (e.g. `npx serve .`) and open `index.html` — opening via `file://` will block the Babel/JSX `<script>` fetches in some browsers. The pages link to each other via relative `.html` paths.
