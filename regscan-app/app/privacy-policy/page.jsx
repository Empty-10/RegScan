import Link from "next/link";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { SITE_URL } from "@/lib/posts";

export const metadata = {
  title: "Privacy policy",
  description: "How RegScan handles data: what we collect, the official sources we query, analytics consent, and your rights.",
  alternates: { canonical: `${SITE_URL}/privacy-policy/` },
};

export default function Page() {
  return (
    <>
      <Header />
      <main className="post-page">
        <div className="container container-narrow">
          <h1 className="post-title">Privacy policy</h1>
          <div className="post-content">
            <p>RegScan is a free UK MOT and tax checker. This policy explains, in plain English, what data we handle and why. It is written to describe our actual practices and is not legal advice.</p>

            <h2>What we collect</h2>
            <ul>
              <li><strong>No account.</strong> You don&apos;t sign up, and we don&apos;t ask for your name, email or payment details to run a check.</li>
              <li><strong>Registration lookups.</strong> When you enter a vehicle registration, we send it to official government services to fetch that vehicle&apos;s public record. We don&apos;t sell this or build a profile from it.</li>
              <li><strong>Your cookie choice.</strong> Your accept/reject decision is stored locally in your browser so we don&apos;t ask again. It is not a tracking cookie.</li>
              <li><strong>Analytics (only with consent).</strong> If you accept, we use Google Analytics to understand how the site is used. Until you accept, no analytics cookies are set. See our <Link href="/cookie-policy/">cookie policy</Link>.</li>
            </ul>

            <h2>Where the data comes from</h2>
            <p>Vehicle information is retrieved from the <strong>DVSA MOT History API</strong> and the <strong>DVLA Vehicle Enquiry Service</strong> - the same official records GOV.UK uses. RegScan does not own or alter these records; the authoritative source is the government.</p>

            <h2>Third parties</h2>
            <ul>
              <li><strong>DVSA and DVLA</strong> - official data sources queried when you run a check.</li>
              <li><strong>Google Analytics</strong> - usage measurement, only after you consent.</li>
              <li><strong>Hosting</strong> - the site is served by our hosting provider, which processes standard server logs.</li>
            </ul>

            <h2>Your rights</h2>
            <p>Under UK data protection law you have rights to access or request deletion of personal data held about you. Because RegScan doesn&apos;t require an account and doesn&apos;t store personal profiles, we hold very little personal data. To make a request or ask a question, <Link href="/contact/">contact us</Link>.</p>

            <h2>Changes</h2>
            <p>We may update this policy as the service evolves. Material changes will be reflected here.</p>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
