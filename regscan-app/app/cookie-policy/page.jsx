import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { SITE_URL } from "@/lib/posts";

export const metadata = {
  title: "Cookie policy",
  description: "How RegScan uses cookies and analytics.",
  alternates: { canonical: `${SITE_URL}/cookie-policy/` },
};

export default function Page() {
  return (
    <>
      <Header />
      <main className="post-page">
        <div className="container container-narrow">
          <h1 className="post-title">Cookie policy</h1>
          <div className="post-content">
            <p>
              RegScan keeps cookies to a minimum. We don’t use advertising or
              cross-site tracking cookies.
            </p>

            <h2>Your choice</h2>
            <p>
              When you first visit, we ask whether you’ll allow analytics cookies. Your
              choice is stored locally in your browser (not a tracking cookie) so we
              don’t ask again. Until you accept, no analytics cookies are set.
            </p>

            <h2>Analytics (only after you accept)</h2>
            <p>
              If you accept, we use <strong>Google Analytics 4</strong> to understand how
              the site is used so we can improve it. It sets cookies such as{" "}
              <code>_ga</code> to measure visits and pages viewed. We use Google Consent
              Mode, so these cookies are only set once you’ve consented. We don’t use this
              data to identify you personally.
            </p>

            <h2>Changing your mind</h2>
            <p>
              To withdraw consent, clear this site’s data in your browser settings (which
              removes the stored choice and analytics cookies); you’ll then be asked again
              on your next visit.
            </p>

            <p>
              Questions? Contact us and we’ll be happy to help.
            </p>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
