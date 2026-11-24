import Link from "next/link";
import { WorksEssays } from "@/components/WorksEssays";
import { WorksMapLoader } from "@/components/WorksMapLoader";
import { ViewSwitch } from "@/components/ViewSwitch";
import "./works.css";

export const metadata = {
  title: "Public works in India, 1947–now",
  description:
    "Dams, steel towns, ports, highways, metros, nuclear stations, space centres and new towns built in India after independence.",
};

export default function WorksPage() {
  return (
    <main className="map-page" data-atlas="works">
      <div className="page-nav">
        <Link href="/" className="back-link">
          mythyl
        </Link>
        <ViewSwitch />
      </div>
      <WorksMapLoader />
      <WorksEssays />

      <footer className="site-footer">
        mythyl · public works in india · 1947 to now
      </footer>
    </main>
  );
}
