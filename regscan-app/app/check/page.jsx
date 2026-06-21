import ResultsView from "@/components/ResultsView";
import { getVehicleByVrm } from "@/lib/vehicleService";
import { fetchAirQuality } from "@/lib/providers/tfl";

export const metadata = {
  title: "Vehicle check",
  description: "Live MOT status, full MOT history and current tax status from official DVSA and DVLA data.",
  robots: { index: false, follow: true },
};

// Server component: the vehicle lookup runs here, server-side, so DVSA/DVLA keys
// stay out of the browser bundle. The normalized result is passed to the client view.
export default async function Page({ searchParams }) {
  const vrm = (searchParams && searchParams.vrm) || "AB12CDE";
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
