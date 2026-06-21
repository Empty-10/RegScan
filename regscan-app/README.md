# RegScan — Next.js app

Production rebuild of the RegScan design prototypes as a real Next.js (App Router) site. Faithful port of the four page designs using the original design tokens in `app/globals.css`. Runs on mock data today; the data layer is shaped to swap straight in for the official DVSA/DVLA APIs.

## Run it

```bash
npm install
npm run dev      # http://localhost:3000
```

Build for production:

```bash
npm run build
npm start
```

## Routes

| Route | Page | Notes |
|---|---|---|
| `/` | Home + reg search | Submitting a plate routes to `/check?vrm=…` |
| `/check?vrm=AB12CDE` | Vehicle report | Looks the VRM up in mock data; falls back to the demo car. Try `LF19XKM`, `EV70RUN`, `VN64WRK`. Noindex. |
| `/garage` | Saved vehicles + reminders | Add/remove vehicles, toggle reminders (in-memory). Noindex. |
| `/resources/mot-advisory-explained` | SEO article | Sticky TOC scrollspy, reading progress, FAQ. Article + FAQPage + BreadcrumbList JSON-LD rendered server-side. |

## Structure

```
app/
  layout.jsx          Root layout, metadata, global CSS, font @import
  globals.css         The full design system (ported verbatim from the prototype)
  page.jsx            Home
  check/page.jsx      Results (reads ?vrm)
  garage/page.jsx     Garage
  resources/mot-advisory-explained/page.jsx   Article + JSON-LD
components/
  Icon, Header (+GarageHeader), Footer   Shared chrome
  ui.jsx              PlateInput, Toast, StatusBadge, FaqItem, status helpers
  HomeView / ResultsView / GarageView / ArticleView   The four screens (client)
lib/
  mockData.js         Mock vehicles + helpers (formatDate, daysUntil, computeHealth, fetchMotAndTaxByVRM)
  articleData.js      Sample article content (would become MDX/CMS)
```

## Mock → real data (next step)

`lib/mockData.js` mirrors the **DVSA MOT History API** and **DVLA Vehicle Enquiry Service (VES)** response shapes. To go live:

1. Move `fetchMotAndTaxByVRM` to a **server route** (e.g. `app/api/vehicle/route.js`) so API keys stay server-side — never expose keys to the client.
2. Call VES (tax/MOT due dates) and MOT History (full test history); map the responses into the same fields the views already consume.
3. The **Vehicle Health score** is computed transparently in `computeHealth()` (replacing the prototype's hardcoded 82) so the number is always explainable — tune the weights as you like.

## Notes

- **Fonts:** Plus Jakarta Sans is loaded via `@import` in `globals.css` (matches the prototype). For production, self-host it and the Charles Wright plate font to remove the external request and license the plate typeface.
- **ULEZ/CAZ** data is mock-only — it isn't in the VES or MOT APIs and needs a separate source (e.g. TfL) before launch.
- `/check` and `/garage` are set to `noindex` (user-specific/utility pages); the home and resource pages are indexable.
