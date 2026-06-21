import ResultsView from "@/components/ResultsView";

export const metadata = {
  title: "Vehicle check",
  description: "Live MOT status, full MOT history and current tax status from official DVSA and DVLA data.",
  robots: { index: false, follow: true },
};

export default function Page({ searchParams }) {
  const vrm = (searchParams && searchParams.vrm) || "AB12CDE";
  return <ResultsView vrm={vrm} />;
}
