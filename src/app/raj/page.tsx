import Link from "next/link";
import { RajEssays } from "@/components/RajEssays";
import { RajMapLoader } from "@/components/RajMapLoader";
import { ViewSwitch } from "@/components/ViewSwitch";

export const metadata = {
  title: "Colonial violence in India",
  description:
    "Wars of conquest, annexation, famine, colonial massacre, and resistance under the East India Company and the British Crown, 1757–1947.",
};

export default function RajPage() {
  return (
    <main className="map-page" data-atlas="raj">
      <div className="page-nav">
        <Link href="/" className="back-link">
          mythyl
        </Link>
        <ViewSwitch />
      </div>
      <RajMapLoader />
      <RajEssays />

      <footer className="site-footer">
        mythyl · colonial violence in india · 1757 to 1947
      </footer>
    </main>
  );
}
