import Link from "next/link";
import { IndiaMark } from "@/components/IndiaMark";
import { GALLERY, type GalleryPiece } from "@/lib/gallery";
import { allConflicts } from "@/lib/conflicts";

export default async function Home() {
  const conflicts = allConflicts();
  const northeast = conflicts.filter((conflict) => conflict.northeast).length;

  return (
    <main className="landing">
      <header className="landing-mast">
        <p className="wordmark">mythyl</p>
        <p className="landing-kicker">pictures that stay</p>
      </header>

      <section className="landing-hero">
        <h1>
          The after,
          <br />
          drawn.
        </h1>
        <p className="landing-lede">
          Maps and infographics for things that are usually a speech.
        </p>
      </section>

      <section className="gallery" aria-label="Works">
        {GALLERY.map((piece) => (
          <PieceCard
            key={piece.id}
            piece={piece}
            stats={
              piece.id === "conflicts"
                ? [
                    { value: conflicts.length, label: "campaigns" },
                    { value: northeast, label: "in the Northeast" },
                  ]
                : []
            }
          />
        ))}
      </section>
    </main>
  );
}

function PieceCard({
  piece,
  stats,
}: {
  piece: GalleryPiece;
  stats: { value: number; label: string }[];
}) {
  return (
    <Link className="piece" href={piece.href}>
      <div className="piece-stage">{piece.cover === "india-mark" ? <IndiaMark /> : null}</div>
      <div className="piece-copy">
        <p className="piece-kicker">
          {piece.kind}
          <span aria-hidden="true"> · </span>
          {piece.span}
        </p>
        <h2>{piece.title}</h2>
        <p>{piece.lede}</p>
        {stats.length > 0 ? (
          <div className="piece-meta">
            {stats.map((stat) => (
              <span key={stat.label}>
                <b>{stat.value}</b> {stat.label}
              </span>
            ))}
          </div>
        ) : null}
        <span className="piece-go">
          Open <i>→</i>
        </span>
      </div>
    </Link>
  );
}
