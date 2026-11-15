import Link from "next/link";
import { ConflictEssays } from "@/components/ConflictEssays";
import { ConflictMapLoader } from "@/components/ConflictMapLoader";
import { ViewSwitch } from "@/components/ViewSwitch";

export const metadata = {
  title: "Conflicts in India",
  description:
    "A geographic reading of post-independence conflict in India — wars, insurgencies, riots — with a short essay for each kind.",
};

export default function ConflictsPage() {
  return (
    <main className="map-page">
      <div className="page-nav">
        <Link href="/" className="back-link">
          mythyl
        </Link>
        <ViewSwitch />
      </div>
      <ConflictMapLoader />
      <ConflictEssays />

      <footer className="site-footer">
        mythyl · conflicts in india · 1947 to now
      </footer>
    </main>
  );
}
