import type { CSSProperties, SetStateAction } from "react";
import {
  actorById,
  conflictById,
  formatCasualtyLine,
  formatFuzzyDate,
  formatKilledEstimate,
  familyOf,
  formatSides,
  incidentAt,
  incidentsForConflict,
  reportsForConflict,
  spanEnd,
  spanStart,
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
  onHover?: (focus: SetStateAction<MapFocus | null>) => void;
  hovered?: MapFocus | null;
};

export function MapCard({ focus, locked, onClose, onOpenIncident, onHover, hovered }: Props) {
  if (focus.type === "incident") {
    return (
      <IncidentBody
        incident={focus.incident}
        locked={locked}
        onClose={onClose}
        onOpenIncident={onOpenIncident}
        onHover={onHover}
        hovered={hovered}
      />
    );
  }
  return (
    <ConflictBody
      conflict={focus.conflict}
      locked={locked}
      onClose={onClose}
      onOpenIncident={onOpenIncident}
      onHover={onHover}
      hovered={hovered}
    />
  );
}

function CampaignRail({
  campaign,
  activeId,
  onOpenIncident,
  onHover,
  hovered,
}: {
  campaign: Conflict;
  activeId?: string;
  onOpenIncident: (incident: Incident) => void;
  onHover?: (focus: SetStateAction<MapFocus | null>) => void;
  hovered?: MapFocus | null;
}) {
  const hoverIncidentId = hovered?.type === "incident" ? hovered.incident.id : null;
  const hoverConflictId =
    hovered?.type === "conflict"
      ? hovered.conflict.id
      : hovered?.type === "incident"
        ? hovered.incident.conflictId
        : null;
  const spanHot = hoverConflictId === campaign.id;
  const days = incidentsForConflict(campaign.id);
  const start = spanStart(campaign.time);
  const end = spanEnd(campaign.time);
  const marks = [start, end, ...days.map((day) => incidentAt(day))];
  const min = Math.min(...marks);
  const max = Math.max(...marks);
  const pad = Math.max(0.35, (max - min) * 0.08);
  const from = min - pad;
  const to = max + pad <= from ? from + 1 : max + pad;
  const pct = (year: number) => ((year - from) / (to - from)) * 100;
  const color = familyOf(campaign).color;
  const startYear = Math.round(start);
  const endYear = Math.round(end);
  const same = startYear === endYear && !campaign.time.ongoing;

  return (
    <div className="map-rail" aria-label={`${campaign.name} timeline`}>
      <div className="map-rail-scale">
        <span className="map-rail-year" data-edge="start" style={{ left: `${pct(start)}%` }}>
          {startYear}
        </span>
        {same ? null : (
          <span className="map-rail-year" data-edge="end" style={{ left: `${pct(end)}%` }}>
            {endYear}
          </span>
        )}
        <i className="map-rail-track" />
        <b
          className={spanHot ? "map-rail-span map-rail-hot" : "map-rail-span"}
          data-hot={spanHot ? "true" : "false"}
          style={{
            left: `${pct(start)}%`,
            width: `${Math.max(0.9, pct(end) - pct(start))}%`,
            background: color,
            opacity: hoverConflictId && !spanHot ? 0.22 : 0.88,
            boxShadow: spanHot
              ? "0 0 0 1.5px #f0d24a, 0 0 12px rgba(240, 210, 74, 0.55)"
              : undefined,
          }}
        />
        {days.map((day) => {
          const hot =
            day.id === hoverIncidentId || (!hoverIncidentId && spanHot);
          const dim = Boolean(hoverConflictId) && !hot;
          return (
            <button
              key={day.id}
              type="button"
              className={hot ? "map-rail-day map-rail-hot" : "map-rail-day"}
              data-on={day.id === activeId ? "true" : "false"}
              data-hot={hot ? "true" : "false"}
              aria-label={day.name}
              title={`${formatFuzzyDate(day.time)} · ${day.name}`}
              style={{
                left: `${pct(incidentAt(day))}%`,
                borderColor: color,
                background: hot ? "#f0d24a" : undefined,
                opacity: dim ? 0.22 : 1,
                zIndex: hot ? 2 : 1,
                boxShadow: hot
                  ? "0 0 0 1px #070806, 0 0 0 3px #f0d24a, 0 0 10px rgba(240, 210, 74, 0.55)"
                  : undefined,
                transform: hot
                  ? "translateX(-50%) rotate(45deg) scale(1.4)"
                  : "translateX(-50%) rotate(45deg)",
              }}
              onMouseEnter={() => onHover?.({ type: "incident", incident: day })}
              onMouseLeave={() =>
                onHover?.((current) =>
                  current?.type === "incident" && current.incident.id === day.id ? null : current,
                )
              }
              onClick={() => onOpenIncident(day)}
            />
          );
        })}
      </div>
    </div>
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
  onClose,
  onOpenIncident,
  onHover,
  hovered,
}: {
  conflict: Conflict;
  locked: boolean;
  onClose: () => void;
  onOpenIncident: (incident: Incident) => void;
  onHover?: (focus: SetStateAction<MapFocus | null>) => void;
  hovered?: MapFocus | null;
}) {
  const papers = reportsForConflict(conflict.id);
  const killed = conflict.harm?.killed;

  return (
    <aside className="map-card" aria-live="polite" data-locked={locked ? "true" : "false"}>
      <div className="map-strip-head">
        <div className="map-strip-copy">
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
        </div>
        <button type="button" className="card-close" onClick={onClose}>
          Close
        </button>
      </div>
      <CampaignRail campaign={conflict} onOpenIncident={onOpenIncident} onHover={onHover} hovered={hovered} />
      <p className="map-card-summary">{conflict.summary}</p>
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
      <NewsList reports={papers.map((row) => row.report)} layout="row" />
    </aside>
  );
}

function IncidentBody({
  incident,
  locked,
  onClose,
  onOpenIncident,
  onHover,
  hovered,
}: {
  incident: Incident;
  locked: boolean;
  onClose: () => void;
  onOpenIncident: (incident: Incident) => void;
  onHover?: (focus: SetStateAction<MapFocus | null>) => void;
  hovered?: MapFocus | null;
}) {
  const campaign = conflictById(incident.conflictId);
  const papers = incident.reports;

  return (
    <aside
      className="map-card map-card-day"
      aria-live="polite"
      data-locked={locked ? "true" : "false"}
    >
      <div className="map-strip-head">
        <div className="map-strip-copy">
          <p className="card-meta">
            <span>{incident.kind.replace("-", " ")}</span>
            {campaign ? <span>{campaign.name}</span> : null}
          </p>
          <h2>{incident.name}</h2>
          <p className="card-years">
            {formatFuzzyDate(incident.time)}
            {incident.place.name ? ` · ${incident.place.name}` : ""}
          </p>
        </div>
        <button type="button" className="card-close" onClick={onClose}>
          Close
        </button>
      </div>
      {campaign ? (
        <CampaignRail campaign={campaign} activeId={incident.id} onOpenIncident={onOpenIncident} onHover={onHover} hovered={hovered} />
      ) : null}
      <p className="map-card-summary">{incident.summary}</p>
      {incident.sides.length > 0 ? <p className={styles.sides}>{formatSides(incident.sides)}</p> : null}
      {incident.casualties.length > 0 ? (
        <ul className={styles.toll}>
          {incident.casualties.map((claim, index) => (
            <li key={`${incident.id}-c-${index}`}>{formatCasualtyLine(claim)}</li>
          ))}
        </ul>
      ) : null}
      {incident.story ? <p className={styles.story}>{incident.story}</p> : null}
      <NewsList reports={papers} layout="row" />
    </aside>
  );
}
