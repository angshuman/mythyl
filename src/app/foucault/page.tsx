import Link from "next/link";
import { FoucaultLobes } from "@/components/FoucaultLobes";
import { FoucaultPlate } from "@/components/FoucaultPlate";
import { MythylMark } from "@/components/MythylMark";
import { FOUCAULT } from "@/lib/foucault";
import "./foucault.css";

export const metadata = {
  title: "Foucault",
  robots: { index: false, follow: false },
};

export default function FoucaultPage() {
  return (
    <main className="foucault-page">
      <header className="foucault-head">
        <Link href="/" className="foucault-brand">
          <MythylMark className="brand-mark" detail="compact" />
          <span className="back-link">mythyl</span>
        </Link>
        <p className="foucault-kicker">{FOUCAULT.kicker}</p>
      </header>
      <FoucaultLobes data={FOUCAULT} />
      <FoucaultPlate data={FOUCAULT} showOrigin={false} />
      <footer className="foucault-foot">mythyl · foucault · a decomposition</footer>
    </main>
  );
}
