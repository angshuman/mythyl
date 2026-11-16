import Link from "next/link";
import { IndiaMark } from "@/components/IndiaMark";
import { MythylMark } from "@/components/MythylMark";
import { RajMark } from "@/components/RajMark";
import { GALLERY, type GalleryPiece } from "@/lib/gallery";
import { allConflicts } from "@/lib/conflicts";
import { allConflicts as allRaj, allIncidents as rajDays } from "@/lib/raj";

export default async function Home() {
  const conflicts = allConflicts();
  const northeast = conflicts.filter((conflict) => conflict.northeast).length;
  const raj = allRaj();
  const days = rajDays().length;

  return (
    <main className="landing">
      <header className="landing-mast">
        <div className="brand">
          <MythylMark className="brand-mark" detail="compact" />
          <p className="wordmark">mythyl</p>
        </div>
        <p className="landing-kicker">infographics</p>
      </header>

      <section className="landing-hero">
        <h1>
          A subject,
          <br />
          made visible.
        </h1>
        <MythylMark className="landing-mark" />
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
                : piece.id === "raj"
                  ? [
                      { value: raj.length, label: "campaigns" },
                      { value: days, label: "days" },
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
    <Link className="piece" data-piece={piece.id} href={piece.href}>
      <div className="piece-stage">
        {piece.cover === "india-mark" ? <IndiaMark /> : null}
        {piece.cover === "raj-mark" ? <RajMark /> : null}
      </div>
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
