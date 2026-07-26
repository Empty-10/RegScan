import Link from "next/link";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { SITE_URL } from "@/lib/posts";

export const metadata = {
  title: "About RegScan",
  description:
    "RegScan is a free UK MOT and tax checker built on official DVSA and DVLA data. Independent, no sign-up, no card - and it flags recurring MOT advisories automatically.",
  alternates: { canonical: `${SITE_URL}/about/` },
};

export default function Page() {
  return (
    <>
      <Header />
      <main className="post-page">
        <div className="container container-narrow">
          <h1 className="post-title">About RegScan</h1>
          <div className="post-content">
            <p>
              RegScan is a free tool for checking a UK vehicle&apos;s MOT and tax status from its
              registration. Enter a reg and you get live MOT status, the full MOT history with
              advisories, and current tax status - on one page, in seconds.
            </p>

            <h2>Official data, presented plainly</h2>
            <p>
              The information comes straight from two government sources: the <strong>DVSA MOT
              History API</strong> for MOT results, and the <strong>DVLA Vehicle Enquiry
              Service</strong> for tax and vehicle details. We don&apos;t edit or interpret the
              records - you see exactly what the government holds, just combined and made easier to
              read.
            </p>

            <h2>What makes RegScan different</h2>
            <ul>
              <li><strong>Recurring-advisory detection.</strong> We group a car&apos;s advisories across every MOT and flag the ones that keep coming back - often a sign of a worsening fault most checkers don&apos;t surface.</li>
              <li><strong>Genuinely free.</strong> No sign-up, no card, unlimited checks.</li>
              <li><strong>MOT and tax together.</strong> One lookup instead of two separate government pages.</li>
            </ul>

            <h2>Independent</h2>
            <p>
              RegScan is an independent service that uses the official open government APIs. We are
              not part of, or affiliated with, the DVSA, DVLA or GOV.UK, and we don&apos;t represent
              ourselves as such.
            </p>

            <p>
              Ready to try it? <Link href="/check/">Check a vehicle</Link> or browse our{" "}
              <Link href="/blog/">MOT &amp; tax guides</Link>.
            </p>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
