import ResultsView from "@/components/ResultsView";
import { CheckForm } from "@/components/CheckForm";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { getVehicleByVrm } from "@/lib/vehicleService";
import { fetchAirQuality } from "@/lib/providers/tfl";

export const metadata = {
  title: "Vehicle check",
  description: "Live MOT status, full MOT history and current tax status from official DVSA and DVLA data.",
  robots: { index: false, follow: true },
};

// Server component: the vehicle lookup runs here, server-side, so DVSA/DVLA keys
// stay out of the browser bundle. With no registration supplied, show an entry
// form instead of defaulting to a placeholder vehicle.
export default async function Page({ searchParams }) {
  const vrm = searchParams && searchParams.vrm ? String(searchParams.vrm) : "";

  if (!vrm) {
    return (
      <>
        <Header active="check" />
        <main className="post-page">
          <div className="container container-narrow" style={{ textAlign: "center" }}>
            <span className="eyebrow" style={{ justifyContent: "center" }}>Free vehicle check</span>
            <h1 className="post-title">Check any vehicle’s MOT &amp; tax</h1>
            <p className="lede" style={{ margin: "0 auto 8px", maxWidth: 560 }}>
              Enter a UK registration to see live MOT status, full MOT history, advisories and
              current tax status — straight from official DVSA &amp; DVLA data.
            </p>
            <div style={{ maxWidth: 560, margin: "0 auto" }}>
              <CheckForm />
            </div>
          </div>
        </main>
        <Footer />
      </>
    );
  }

  const [result, airQuality] = await Promise.all([
    getVehicleByVrm(vrm),
    fetchAirQuality(),
  ]);

  return (
    <ResultsView
      vehicle={result.ok ? result.data : null}
      vrm={vrm}
      notFound={!result.ok}
      airQuality={airQuality}
    />
  );
}
