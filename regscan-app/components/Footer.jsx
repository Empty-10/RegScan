import Link from "next/link";
import { REMINDERS_ENABLED } from "@/lib/features";

export function Footer() {
  return (
    <footer className="site-footer">
      <div className="container">
        <div className="grid">
          <div>
            <Link href="/" className="brand" aria-label="RegScan home" style={{ marginBottom: 14 }}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img className="brand-logo" src="/images/Reg-Scan-Logo-400.png" alt="RegScan" width="120" height="30" />
            </Link>
            <p style={{ marginTop: 14, maxWidth: 320, color: "var(--ink-3)", fontSize: 14, lineHeight: 1.55 }}>
              Free, instant MOT and tax checks using official UK government data. Independent service — not affiliated with the DVSA or DVLA.
            </p>
          </div>
          <div>
            <h5>Product</h5>
            <ul>
              <li><Link href="/#how">How it works</Link></li>
              {REMINDERS_ENABLED && <li><Link href="/#reminders">Reminders</Link></li>}
              <li><Link href="/garage/">My Garage</Link></li>
              <li><Link href="/#upsell">Partner offers</Link></li>
            </ul>
          </div>
          <div>
            <h5>Resources</h5>
            <ul>
              <li><Link href="/blog/">Blog</Link></li>
              <li><Link href="/#content">About MOT &amp; tax</Link></li>
              <li><Link href="/#faq">FAQs</Link></li>
              <li><a href="#">Data sources (DVSA/DVLA)</a></li>
              <li><a href="#">Contact</a></li>
            </ul>
          </div>
          <div>
            <h5>Legal</h5>
            <ul>
              <li><a href="#">Privacy policy</a></li>
              <li><a href="#">Cookie policy</a></li>
              <li><a href="#">Terms of use</a></li>
              <li><a href="#">Advertising</a></li>
            </ul>
          </div>
        </div>
        <div className="legal">
          <span>© 2026 RegScan Ltd. Vehicle data from DVSA &amp; DVLA under the Open Government Licence v3.0. Partner offers from third parties.</span>
          <span>Made in the UK 🇬🇧</span>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
