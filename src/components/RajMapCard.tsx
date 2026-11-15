import type { CSSProperties } from "react";
import {
  actorById,
  conflictById,
  formatCasualtyLine,
  formatFuzzyDate,
  formatKilledEstimate,
  familyOf,
  formatSides,
  incidentsForConflict,
  reportsForConflict,
  type Conflict,
  type Incident,
  type NewsReport,
} from "@/lib/raj";
import styles from "./MapCard.module.css";

export type MapFocus =
  | { type: "conflict"; conflict: Conflict }
  | { type: "incident"; incident: Incident };

type Props = {
  focus: MapFocus;
  locked: boolean;
  dock?: "left" | "right";
  onClose: () => void;
  onOpenIncident: (incident: Incident) => void;
};

export function MapCard({ focus, locked, dock = "right", onClose, onOpenIncident }: Props) {
  if (focus.type === "incident") {
    return <IncidentBody incident={focus.incident} locked={locked} dock={dock} onClose={onClose} />;
  }
  return (
    <ConflictBody
      conflict={focus.conflict}
      locked={locked}
      dock={dock}
      onClose={onClose}
      onOpenIncident={onOpenIncident}
    />
  );
}

function storiesOf(reports: NewsReport[]): NewsReport[] {
  const seen = new Set<string>();
  const rows: NewsReport[] = [];
  for (const report of reports) {
    if (!report.excerpt && !report.headline) continue;
    const key = report.url || `${report.outlet}:${report.headline}`;
    if (seen.has(key)) continue;
    seen.add(key);
    rows.push(report);
  }
  return rows;
}

const CLIP: CSSProperties = {
  display: "block",
  padding: 0,
  overflow: "hidden",
  border: "1px solid #cbbfa6",
  borderLeft: "3px solid #8a3b32",
  borderRadius: "2px 8px 8px 2px",
  background: "#efe6d2",
  color: "#1c1810",
  textDecoration: "none",
  boxShadow: "0 10px 22px rgba(0, 0, 0, 0.32)",
};

function NewsStory({ report }: { report: NewsReport }) {
  const inner = (
    <>
      {report.imageUrl ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={report.imageUrl}
          alt=""
          style={{
            display: "block",
            width: "100%",
            height: "7.2rem",
            objectFit: "cover",
            borderBottom: "1px solid #d4c7ae",
            background: "#d9cdb6",
          }}
        />
      ) : null}
      <div style={{ padding: "0.7rem 0.8rem 0.85rem" }}>
        <p
          style={{
            margin: "0 0 0.28rem",
            fontSize: "0.6rem",
            letterSpacing: "0.18em",
            textTransform: "uppercase",
            color: "#8a3b32",
            fontWeight: 600,
          }}
        >
          {report.outlet}
          {report.year ? ` · ${report.year}` : ""}
        </p>
        {report.headline ? (
          <p
            style={{
              fontFamily: "var(--font-serif), ui-serif, Georgia, serif",
              fontSize: "1.02rem",
              lineHeight: 1.28,
              color: "#1c1810",
              margin: "0 0 0.35rem",
            }}
          >
            {report.headline}
          </p>
        ) : null}
        {report.excerpt ? (
          <p style={{ fontSize: "0.82rem", lineHeight: 1.42, color: "#3a3428", margin: 0 }}>
            {report.excerpt}
          </p>
        ) : null}
        {report.url ? (
          <span
            style={{
              display: "inline-block",
              marginTop: "0.5rem",
              fontSize: "0.7rem",
              letterSpacing: "0.08em",
              textTransform: "uppercase",
              textDecoration: "underline",
              textUnderlineOffset: "0.18em",
              color: "#8a3b32",
            }}
          >
            Open article →
          </span>
        ) : null}
      </div>
    </>
  );

  if (report.url) {
    return (
      <a className={styles.storyCard} href={report.url} target="_blank" rel="noreferrer" style={CLIP}>
        {inner}
      </a>
    );
  }
  return (
    <article className={styles.storyCard} style={CLIP}>
      {inner}
    </article>
  );
}

export function NewsList({
  reports,
  kicker = "From the record",
  layout = "stack",
}: {
  reports: NewsReport[];
  kicker?: string;
  layout?: "stack" | "row";
}) {
  const stories = storiesOf(reports);
  if (stories.length === 0) return null;
  const row = layout === "row";
  return (
    <div
      className={styles.stories}
      style={{
        marginTop: row ? 0 : "1.15rem",
        display: "flex",
        flexDirection: row ? "row" : "column",
        gap: row ? "1rem" : "1.2rem",
        overflowX: row ? "auto" : undefined,
        padding: row ? "0.15rem 0.15rem 0.85rem" : undefined,
      }}
    >
      {kicker && !row ? (
        <p className={styles.storiesHead} style={{ margin: 0, fontSize: "0.62rem", letterSpacing: "0.16em", textTransform: "uppercase", color: "var(--paper-dim)" }}>
          {kicker}
        </p>
      ) : null}
      {stories.map((report) => (
        <div
          key={report.url || `${report.outlet}:${report.headline}`}
          style={row ? { flex: "0 0 min(22rem, 78vw)", minWidth: "min(22rem, 78vw)" } : undefined}
        >
          <NewsStory report={report} />
        </div>
      ))}
    </div>
  );
}

function ConflictBody({
  conflict,
  locked,
  dock,
  onClose,
  onOpenIncident,
}: {
  conflict: Conflict;
  locked: boolean;
  dock: "left" | "right";
  onClose: () => void;
  onOpenIncident: (incident: Incident) => void;
}) {
  const related = incidentsForConflict(conflict.id).slice(0, 5);
  const papers = reportsForConflict(conflict.id);
  const killed = conflict.harm?.killed;

  return (
    <aside
      className="map-card"
      aria-live="polite"
      data-locked={locked ? "true" : "false"}
      data-dock={dock}
    >
      <p className="card-meta">
        <span data-scale={conflict.scale}>{conflict.scale}</span>
        <span style={{ borderColor: familyOf(conflict).color, color: familyOf(conflict).color }}>
          {familyOf(conflict).label}
        </span>
        <span>{conflict.rule === "company" ? "Company" : "Crown"}</span>
      </p>
      <h2>{conflict.name}</h2>
      <p className="card-years">
        {conflict.time.start.year}
        {conflict.time.end?.year ? ` — ${conflict.time.end.year}` : ""}
      </p>
      <p>{conflict.summary}</p>
      {killed ? <p className={styles.killed}>{formatKilledEstimate(killed)}</p> : null}
      {conflict.peoples.length > 0 ? (
        <p className="card-peoples">{conflict.peoples.map((people) => people.name).join(" · ")}</p>
      ) : null}
      {conflict.parties.length > 0 ? (
        <p className="card-peoples">
          {conflict.parties
            .map((party) => actorById.get(party.actorId)?.name ?? party.actorId)
            .join(" · ")}
        </p>
      ) : null}
      <NewsList reports={papers.map((row) => row.report)} />
      {related.length > 0 ? (
        <ul
          className={styles.days}
          style={{
            listStyle: "none",
            margin: "1.05rem 0 0",
            padding: "0.75rem 0 0",
            borderTop: "1px solid var(--rule)",
          }}
        >
          {related.map((incident) => (
            <li key={incident.id}>
              <button
                type="button"
                onClick={() => onOpenIncident(incident)}
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "flex-start",
                  gap: "0.12rem",
                  width: "100%",
                  padding: "0.35rem 0",
                  border: 0,
                  background: "transparent",
                  color: "inherit",
                  textAlign: "left",
                  cursor: "pointer",
                }}
              >
                <span
                  style={{
                    display: "block",
                    fontSize: "0.68rem",
                    letterSpacing: "0.1em",
                    textTransform: "uppercase",
                    color: "var(--paper-dim)",
                    fontWeight: 500,
                  }}
                >
                  {formatFuzzyDate(incident.time)}
                </span>
                <span style={{ display: "block", marginTop: "0.14rem", fontSize: "0.88rem" }}>
                  {incident.name}
                </span>
              </button>
            </li>
          ))}
        </ul>
      ) : null}
      {locked ? (
        <button type="button" className="card-close" onClick={onClose}>
          Close
        </button>
      ) : (
        <p className="card-hint">Click to lock · hover a square for a day</p>
      )}
    </aside>
  );
}

function IncidentBody({
  incident,
  locked,
  dock,
  onClose,
}: {
  incident: Incident;
  locked: boolean;
  dock: "left" | "right";
  onClose: () => void;
}) {
  const campaign = conflictById(incident.conflictId);
  const papers = incident.reports;

  return (
    <aside
      className="map-card map-card-day"
      aria-live="polite"
      data-locked={locked ? "true" : "false"}
      data-dock={dock}
    >
      <p className="card-meta">
        <span>{incident.kind.replace("-", " ")}</span>
        {campaign ? <span>{campaign.name}</span> : null}
      </p>
      <h2>{incident.name}</h2>
      <p className="card-years">
        {formatFuzzyDate(incident.time)}
        {incident.place.name ? ` · ${incident.place.name}` : ""}
      </p>
      <p>{incident.summary}</p>
      {incident.sides.length > 0 ? <p className={styles.sides}>{formatSides(incident.sides)}</p> : null}
      {incident.casualties.length > 0 ? (
        <ul className={styles.toll}>
          {incident.casualties.map((claim, index) => (
            <li key={`${incident.id}-c-${index}`}>{formatCasualtyLine(claim)}</li>
          ))}
        </ul>
      ) : null}
      {incident.story ? <p className={styles.story}>{incident.story}</p> : null}
      <NewsList reports={papers} />
      {locked ? (
        <button type="button" className="card-close" onClick={onClose}>
          Close
        </button>
      ) : (
        <p className="card-hint">Click to lock this day</p>
      )}
    </aside>
  );
}
