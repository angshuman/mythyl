import Link from "next/link";
import { RajEssays } from "@/components/RajEssays";
import { RajMapLoader } from "@/components/RajMapLoader";
import { ViewSwitch } from "@/components/ViewSwitch";

export const metadata = {
  title: "A geography of force",
  description:
    "How the Company took the subcontinent, and how the Crown held it — conquest, revolt, famine, massacre, law. 1757 to 1947.",
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
        mythyl · company to crown · 1757 to 1947
      </footer>
    </main>
  );
}
