import { redirect } from "next/navigation";
import GarageView from "@/components/GarageView";
import { GARAGE_ENABLED } from "@/lib/features";

export const metadata = {
  title: "My Garage",
  description: "Save your vehicles and track their MOT and tax status from one place.",
  robots: { index: false, follow: true },
};

export default function Page() {
  // Garage is a later feature — send direct visitors home until it's enabled.
  if (!GARAGE_ENABLED) redirect("/");
  return <GarageView />;
}
