// Downloads make/manufacturer logos for common UK makes from the open
// car-logos-dataset into public/logos/<slug>.png, and writes lib/carLogos.json
// (the list of available slugs) so the app knows which logos exist.
//
// Run from the app dir:  node scripts/fetch-logos.mjs
import fs from "node:fs";
import path from "node:path";

const MANIFEST =
  "https://raw.githubusercontent.com/filippofilip95/car-logos-dataset/master/logos/data.json";
const OUT = path.join(process.cwd(), "public", "logos");

// Common makes seen on UK roads (dataset slugs). Anything missing falls back to
// the monogram, so this list just needs to cover the bulk of real-world makes.
const WANT = [
  "abarth", "alfa-romeo", "aston-martin", "audi", "bentley", "bmw", "byd",
  "citroen", "cupra", "dacia", "ds-automobiles", "ferrari", "fiat", "ford",
  "genesis", "honda", "hyundai", "jaguar", "jeep", "kia", "lamborghini",
  "land-rover", "lexus", "lotus", "maserati", "mazda", "mclaren",
  "mercedes-benz", "mg", "mini", "mitsubishi", "nissan", "peugeot", "polestar",
  "porsche", "renault", "rolls-royce", "seat", "skoda", "smart", "ssangyong",
  "subaru", "suzuki", "tesla", "toyota", "vauxhall", "volkswagen", "volvo",
];

const manifest = await (await fetch(MANIFEST)).json();
const bySlug = Object.fromEntries(manifest.map((e) => [e.slug, e]));

fs.rmSync(OUT, { recursive: true, force: true });
fs.mkdirSync(OUT, { recursive: true });

const saved = [];
for (const slug of WANT) {
  const entry = bySlug[slug];
  const url = entry?.image?.optimized || entry?.image?.source;
  if (!url) { console.log(`skip (not in dataset): ${slug}`); continue; }
  try {
    const res = await fetch(url);
    if (!res.ok) { console.log(`fail ${res.status}: ${slug}`); continue; }
    fs.writeFileSync(path.join(OUT, `${slug}.png`), Buffer.from(await res.arrayBuffer()));
    saved.push(slug);
  } catch (e) {
    console.log(`error: ${slug} — ${e.message}`);
  }
}

fs.writeFileSync(path.join(process.cwd(), "lib", "carLogos.json"), JSON.stringify(saved.sort(), null, 2));
console.log(`Saved ${saved.length}/${WANT.length} logos to public/logos/`);
