import Link from "next/link";
import { MARK_OPTIONS } from "@/components/MarkOptions";
import "./marks.css";

export const metadata = {
  title: "Marks",
  robots: { index: false, follow: false },
};

export default function MarksPage() {
  return (
    <main className="marks-page">
      <header className="marks-head">
        <Link href="/" className="back-link">
          mythyl
        </Link>
        <p>Fifteen marks. Same two colours. Say the number.</p>
      </header>
      <ol className="marks-grid">
        {MARK_OPTIONS.map((mark) => (
          <li key={mark.id} className="marks-card">
            <span className="marks-num">{String(mark.id).padStart(2, "0")}</span>
            <div className="marks-svg">{mark.node}</div>
            <p>
              {mark.name}
              <em>{mark.family}</em>
            </p>
          </li>
        ))}
      </ol>
    </main>
  );
}
