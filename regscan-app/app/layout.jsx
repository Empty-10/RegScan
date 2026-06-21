import "./globals.css";

export const metadata = {
  metadataBase: new URL("https://regscan.co.uk"),
  title: {
    default: "RegScan — Check your MOT & tax in seconds",
    template: "%s | RegScan",
  },
  description:
    "Free instant MOT and tax checks using official UK DVSA and DVLA data. Set free reminders so you never miss an MOT or tax due date.",
  openGraph: {
    type: "website",
    siteName: "RegScan",
    locale: "en_GB",
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
