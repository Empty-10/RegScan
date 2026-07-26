import Link from "next/link";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { SITE_URL } from "@/lib/posts";

export const metadata = {
  title: "Contact",
  description: "Get in touch with RegScan - questions, feedback, or data queries about our free UK MOT and tax checker.",
  alternates: { canonical: `${SITE_URL}/contact/` },
};

export default function Page() {
  return (
    <>
      <Header />
      <main className="post-page">
        <div className="container container-narrow">
          <h1 className="post-title">Contact RegScan</h1>
          <div className="post-content">
            <p>
              Questions, feedback, or something not looking right? We&apos;d like to hear from you.
            </p>

            <h2>Email</h2>
            <p>
              Email us at <a href="mailto:hello@regscan.co.uk">hello@regscan.co.uk</a> and we&apos;ll
              get back to you as soon as we can.
            </p>

            <h2>Data queries</h2>
            <p>
              RegScan shows official records from the DVSA (MOT) and DVLA (tax and vehicle details).
              If a result looks wrong, it usually reflects the underlying government record - the
              authoritative source is GOV.UK. For anything about how we use data, see our{" "}
              <Link href="/privacy-policy/">privacy policy</Link> and{" "}
              <Link href="/cookie-policy/">cookie policy</Link>.
            </p>

            <p>
              Want to check a vehicle? <Link href="/check/">Run a free check</Link>.
            </p>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
