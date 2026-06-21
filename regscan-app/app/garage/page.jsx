import GarageView from "@/components/GarageView";

export const metadata = {
  title: "My Garage",
  description: "Save your vehicles and track their MOT and tax status from one place.",
  robots: { index: false, follow: true },
};

export default function Page() {
  return <GarageView />;
}
