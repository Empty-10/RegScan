import GarageView from "@/components/GarageView";

export const metadata = {
  title: "My Garage",
  description: "Save vehicles and manage free MOT and tax reminders from one place.",
  robots: { index: false, follow: true },
};

export default function Page() {
  return <GarageView />;
}
