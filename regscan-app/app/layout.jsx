import "./globals.css";

const SITE = "https://www.regscan.co.uk";

export const metadata = {
  // Must match the canonical host (www) so OG/relative URLs resolve consistently.
  metadataBase: new URL(SITE),
  title: {
    default: "RegScan — Check your MOT & tax in seconds",
    template: "%s | RegScan",
  },
  description:
    "Free instant MOT and tax checks using official UK DVSA and DVLA data. See live MOT status, full MOT history and current tax status in seconds.",
  openGraph: {
    type: "website",
    siteName: "RegScan",
    locale: "en_GB",
  },
};

// Site-wide Organization + WebSite structured data (helps Google's knowledge
// graph and gives AI answer engines a clean entity to cite).
const orgJsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Organization",
      "@id": `${SITE}/#organization`,
      name: "RegScan",
      url: SITE,
      description: "Free UK MOT and tax checks using official DVSA and DVLA data.",
      areaServed: "GB",
    },
    {
      "@type": "WebSite",
      "@id": `${SITE}/#website`,
      url: SITE,
      name: "RegScan",
      publisher: { "@id": `${SITE}/#organization` },
      inLanguage: "en-GB",
    },
  ],
};

export default function RootLayout({ children }) {
  return (
    <html lang="en-GB">
      <body>
        {children}
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(orgJsonLd) }} />
      </body>
    </html>
  );
}
