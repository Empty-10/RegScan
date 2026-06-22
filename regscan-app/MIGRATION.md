# RegScan — deployment & WordPress cutover runbook

## Vercel project settings (one-time)
The Next.js app lives in the **`regscan-app/`** subdirectory of this repo, so:

- **Settings → Build and Deployment → Root Directory = `regscan-app`**
  (Without this, Vercel builds the empty repo root and every route 404s.)
- **Framework Preset** must be **Next.js** (auto-detected once Root Directory is set;
  if it shows "Other", set it manually).
- A correct build log shows `Detected Next.js`, runs `npm install` + `next build`,
  and takes ~60s — **not** a 19ms "Build Completed".

### Environment variables (Settings → Environment Variables, mark as *Sensitive*)
Copy values from local `regscan-app/.env.local`:
- `DVSA_MOT_CLIENT_ID`, `DVSA_MOT_CLIENT_SECRET`, `DVSA_MOT_API_KEY`,
  `DVSA_MOT_TOKEN_URL`, `DVSA_MOT_SCOPE`, `DVSA_MOT_BASE_URL`
- `TFL_APP_KEY`, `TFL_BASE_URL`
- `DVLA_VES_API_KEY`, `DVLA_VES_BASE_URL` (once DVLA approves access)

Redeploy after changing settings/env (or push a commit to trigger a fresh build).

## WordPress → Next.js cutover (regscan.co.uk)
Same domain, so this is a re-platform, not a domain move — keep URLs identical.

1. Deploy to the Vercel URL first; confirm it renders (home, /blog, /check, a post).
2. Re-run the content import if posts changed in WP: `node scripts/import-wp.mjs`.
3. Crawl the Vercel preview and diff URLs against the live WordPress sitemap;
   every `/<category>/<slug>/` and `/category/<slug>/` must resolve (trailing slash).
4. Point DNS (regscan.co.uk) from WordPress to Vercel — one platform at a time.
5. In Google Search Console: submit `https://www.regscan.co.uk/sitemap.xml` and
   watch Coverage for 2–4 weeks.

## Notes
- Featured images are stored locally in `public/wp-content/uploads/` so they
  survive WordPress being switched off.
- Reminder/email feature is gated off via `lib/features.js` (`REMINDERS_ENABLED`)
  until ICO registration — flip to `true` to re-enable.
