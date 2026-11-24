import Link from "next/link";
import { StatesEssays } from "@/components/StatesEssays";
import { StatesMapLoader } from "@/components/StatesMapLoader";
import { ViewSwitch } from "@/components/ViewSwitch";
import "./states.css";

export const metadata = {
  title: "Income, survival, and power",
  description:
    "Per-capita NSDP and infant mortality of Indian states, with Union and state political timelines and sourced events.",
};

export default function StatesPage() {
  return (
    <main className="map-page" data-atlas="states">
      <div className="page-nav">
        <Link href="/" className="back-link">
          mythyl
        </Link>
        <ViewSwitch />
      </div>
      <StatesMapLoader />
      <StatesEssays />

      <footer className="site-footer">
        mythyl · income, survival, and power · indian states
      </footer>
    </main>
  );
}
