import Link from "next/link";
import { ConflictMapLoader } from "@/components/ConflictMapLoader";
import { conflicts } from "@/lib/conflicts";

export const metadata = {
  title: "Conflicts in India",
  description:
    "A geographic reading of post-independence conflict in India — small, medium, and large — with a section on the Northeast.",
};

export default function ConflictsPage() {
  return (
    <main className="map-page">
      <Link href="/" className="back-link">
        mythyl
      </Link>
      <ConflictMapLoader />

      <section className="section" id="northeast">
        <div className="ne-grid">
          <div>
            <p className="map-kicker">The Northeast</p>
            <h2>The Northeast is not one conflict.</h2>
            <p>
              Eight states, many peoples, a border that is also a forest. When
              the Republic arrived in 1947 the Naga hills were already in an
              argument about belonging. Mizoram went to war after a famine and
              came back through an accord that held. Assam spent six years
              asking who counted as a citizen — and Nellie, in a morning, made
              that question lethal. Tripura’s indigenous majority became a
              minority. In Manipur in 2023 the valley and the hills split in
              practice.
            </p>
            <p>
              These fights are about land, census lists, who may enter a hill
              district, and who is a citizen. Religion is in some of them and
              beside the point in others. Neighbouring Myanmar and Bangladesh
              are part of the military geography; so is migration across the
              same ridges. Isolate the region on the map, then move through
              the years.
            </p>
          </div>
          <ol className="ne-list">
            {conflicts
              .filter((conflict) => conflict.northeast)
              .map((conflict) => (
                <li key={conflict.id}>
                  <b>{conflict.name}</b>
                  <span>
                    {conflict.time.start.year}
                    {conflict.time.ongoing ? "–" : conflict.time.end?.year ? `–${conflict.time.end.year}` : ""}
                  </span>
                </li>
              ))}
          </ol>
        </div>
      </section>

      <footer className="site-footer">
        mythyl · conflicts in india · 1947 to now
      </footer>
    </main>
  );
}
