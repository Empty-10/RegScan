import Link from "next/link";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { SITE_URL } from "@/lib/posts";

export const metadata = {
  title: "Terms of use",
  description: "The terms for using RegScan, a free UK MOT and tax checker: acceptable use, the as-is nature of official vehicle data, and liability.",
  alternates: { canonical: `${SITE_URL}/terms-of-use/` },
};

export default function Page() {
  return (
    <>
      <Header />
      <main className="post-page">
        <div className="container container-narrow">
          <h1 className="post-title">Terms of use</h1>
          <div className="post-content">
            <p>These terms govern your use of RegScan (the &quot;site&quot;), a free UK MOT and tax checker. By using the site you agree to these terms. If you do not agree, please do not use the site. This is a plain-English summary of our terms and is not legal advice.</p>

            <h2>What RegScan is</h2>
            <p>RegScan lets you look up a vehicle&apos;s public record - MOT history, tax status and related details - using its registration. The information is retrieved from official government sources, chiefly the <strong>DVSA MOT History API</strong> and the <strong>DVLA Vehicle Enquiry Service</strong>. RegScan is an independent service and is not affiliated with, endorsed by, or operated on behalf of the DVSA, DVLA or any government body.</p>

            <h2>Data is provided &quot;as is&quot;</h2>
            <p>The vehicle data shown is supplied by third-party government services and is presented as-is, without warranty of any kind. RegScan does not own, verify or alter these records and cannot guarantee they are accurate, complete or up to date. Records can be delayed, incomplete or contain errors at source.</p>
            <p><strong>Always confirm anything important against the official record on GOV.UK</strong> - for example before driving a vehicle, buying one, or relying on an MOT or tax status. Do not treat RegScan as the definitive legal source.</p>

            <h2>Acceptable use</h2>
            <p>You agree to use the site lawfully and only for genuine, personal or business vehicle checks. You must not:</p>
            <ul>
              <li>scrape, harvest, bulk-download or systematically extract data from the site;</li>
              <li>resell, redistribute or republish the data as your own service;</li>
              <li>use the site to harass, stalk or identify individuals, or for any unlawful purpose;</li>
              <li>attempt to disrupt, overload, probe or gain unauthorised access to the site or its underlying services;</li>
              <li>use automated tools or bots to access the site except well-behaved search-engine crawlers.</li>
            </ul>

            <h2>Intellectual property</h2>
            <p>The RegScan name, branding, design, written guides and other original content are owned by us and protected by law. You may not copy or reuse them without permission. The underlying vehicle records remain the property of their respective government sources.</p>

            <h2>Limitation of liability</h2>
            <p>To the fullest extent permitted by law, RegScan is not liable for any loss or damage arising from your use of, or reliance on, the site or the data it displays - including decisions made about buying, selling, taxing or driving a vehicle. The site is provided free of charge and on an as-available basis; we do not guarantee it will be uninterrupted or error-free. Nothing in these terms excludes liability that cannot lawfully be excluded.</p>

            <h2>Links and third parties</h2>
            <p>The site may link to external sites (such as GOV.UK) and relies on third-party services to function. We are not responsible for the content, availability or practices of those third parties.</p>

            <h2>Changes</h2>
            <p>We may update these terms as the service evolves. Continued use of the site after changes means you accept the updated terms.</p>

            <h2>Governing law</h2>
            <p>These terms are governed by the laws of England and Wales, and any disputes are subject to the exclusive jurisdiction of the courts of England and Wales.</p>

            <h2>Contact</h2>
            <p>Questions about these terms? <Link href="/contact/">Contact us</Link>. See also our <Link href="/privacy-policy/">privacy policy</Link> and <Link href="/cookie-policy/">cookie policy</Link>.</p>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
