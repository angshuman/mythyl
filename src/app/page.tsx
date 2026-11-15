import Link from "next/link";
import { IndiaMark } from "@/components/IndiaMark";
import { allConflicts } from "@/lib/conflicts";

export default async function Home() {
  const conflicts = allConflicts();
  const northeast = conflicts.filter((conflict) => conflict.northeast).length;

  return (
    <main className="landing">
      <section className="landing-copy">
        <p className="wordmark">mythyl</p>
        <h1>Maps that hold still long enough to look.</h1>
        <p className="landing-lede">
          Infographics for things that are usually a speech. The first essay is a
          geography of conflict in India after 1947 — wars, insurgencies, riots —
          with the Northeast as a proper region, not a footnote.
        </p>
        <Link className="landing-cta" href="/conflicts">
          Conflicts in India <i>→</i>
        </Link>
        <div className="landing-meta">
          <span>
            <b>{conflicts.length}</b> conflicts
          </span>
          <span>
            <b>{northeast}</b> in the Northeast
          </span>
          <span>
            <b>1947–now</b>
          </span>
        </div>
      </section>
      <div className="landing-stage">
        <IndiaMark />
      </div>
    </main>
  );
}
