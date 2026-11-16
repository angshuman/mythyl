"use client";

import { type CSSProperties, type SetStateAction } from "react";
import {
  actorById,
  conflictById,
  conflictsInFamily,
  formatCasualtyLine,
  formatFuzzyDate,
  familyOf,
  formatSides,
  incidentAt,
  incidentsInFamily,
  reportsForConflict,
  spanEnd,
  spanStart,
  type Conflict,
  type Incident,
  type NewsReport,
} from "@/lib/conflicts";
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
  onOpenConflict?: (conflict: Conflict) => void;
  onHover?: (focus: SetStateAction<MapFocus | null>) => void;
  hovered?: MapFocus | null;
};

export function MapCard({
  focus,
  locked,
  onClose,
  onOpenIncident,
  onOpenConflict,
  onHover,
  hovered,
}: Props) {
  if (focus.type === "incident") {
    return (
      <IncidentBody
        incident={focus.incident}
        locked={locked}
        onClose={onClose}
        onOpenIncident={onOpenIncident}
        onOpenConflict={onOpenConflict}
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
      onOpenConflict={onOpenConflict}
      onHover={onHover}
      hovered={hovered}
    />
  );
}

function CampaignRail({
  campaign,
  activeId,
  onOpenIncident,
  onOpenConflict,
  onHover,
  hovered,
}: {
  campaign: Conflict;
  activeId?: string;
  onOpenIncident: (incident: Incident) => void;
  onOpenConflict?: (conflict: Conflict) => void;
  onHover?: (focus: SetStateAction<MapFocus | null>) => void;
  hovered?: MapFocus | null;
}) {
  const family = familyOf(campaign);
  const familyCampaigns = conflictsInFamily(campaign.family);
  const days = incidentsInFamily(campaign.family);
  const hoverIncidentId = hovered?.type === "incident" ? hovered.incident.id : null;
  const hoverConflictId =
    hovered?.type === "conflict"
      ? hovered.conflict.id
      : hovered?.type === "incident"
        ? hovered.incident.conflictId
        : null;
  const marks = [
    ...familyCampaigns.flatMap((row) => [spanStart(row.time), spanEnd(row.time)]),
    ...days.map((day) => incidentAt(day)),
  ];
  const min = Math.min(...marks);
  const max = Math.max(...marks);
  const pad = Math.max(0.35, (max - min) * 0.08);
  const from = min - pad;
  const to = max + pad <= from ? from + 1 : max + pad;
  const pct = (year: number) => ((year - from) / (to - from)) * 100;
  const color = family.color;
  const anyOngoing = familyCampaigns.some((row) => row.time.ongoing);
  const startYear = Math.round(min);
  const endYear = Math.round(max);
  const same = startYear === endYear && !anyOngoing;

  return (
    <div className="map-rail" aria-label={`${family.label} timeline`}>
      <div className="map-rail-scale">
        <span className="map-rail-year" data-edge="start" style={{ left: `${pct(min)}%` }}>
          {startYear}
        </span>
        {same ? null : (
          <span className="map-rail-year" data-edge="end" style={{ left: `${pct(max)}%` }}>
            {anyOngoing ? "now" : endYear}
          </span>
        )}
        <i className="map-rail-track" />
        {familyCampaigns.map((row) => {
          const start = spanStart(row.time);
          const end = spanEnd(row.time);
          const spanHot = hoverConflictId === row.id;
          const current = row.id === campaign.id;
          const dim = Boolean(hoverConflictId) && !spanHot;
          return (
            <b
              key={row.id}
              className={spanHot ? "map-rail-span map-rail-hot" : "map-rail-span"}
              data-hot={spanHot ? "true" : "false"}
              style={{
                left: `${pct(start)}%`,
                width: `${Math.max(0.9, pct(end) - pct(start))}%`,
                background: color,
                opacity: dim ? 0.18 : current ? 0.92 : 0.55,
                zIndex: spanHot ? 2 : current ? 1 : 0,
                boxShadow: spanHot
                  ? "0 0 0 1.5px #f0d24a, 0 0 12px rgba(240, 210, 74, 0.55)"
                  : undefined,
              }}
            />
          );
        })}
        {days.map((day) => {
          const dayHot =
            day.id === hoverIncidentId ||
            (!hoverIncidentId && hoverConflictId === day.conflictId);
          const dim = Boolean(hoverConflictId) && !dayHot;
          return (
            <button
              key={day.id}
              type="button"
              className={dayHot ? "map-rail-day map-rail-hot" : "map-rail-day"}
              data-on={day.id === activeId ? "true" : "false"}
              data-hot={dayHot ? "true" : "false"}
              aria-label={day.name}
              title={`${formatFuzzyDate(day.time)} · ${day.name}`}
              style={{
                left: `${pct(incidentAt(day))}%`,
                borderColor: color,
                background: dayHot ? "#f0d24a" : undefined,
                opacity: dim ? 0.22 : 1,
                zIndex: dayHot ? 3 : 1,
                boxShadow: dayHot
                  ? "0 0 0 1px #070806, 0 0 0 3px #f0d24a, 0 0 10px rgba(240, 210, 74, 0.55)"
                  : undefined,
                transform: dayHot
                  ? "translateX(-50%) rotate(45deg) scale(1.4)"
                  : "translateX(-50%) rotate(45deg)",
              }}
              onMouseEnter={() => onHover?.({ type: "incident", incident: day })}
              onMouseLeave={() =>
                onHover?.((currentHover) =>
                  currentHover?.type === "incident" && currentHover.incident.id === day.id
                    ? null
                    : currentHover,
                )
              }
              onClick={() => onOpenIncident(day)}
            />
          );
        })}
      </div>
      <div
        className="map-rail-chips"
        style={{ display: "flex", flexWrap: "wrap", gap: "0.28rem", width: "100%", minWidth: 0 }}
      >
        {familyCampaigns.map((row) => {
          const on = row.id === campaign.id;
          const hot = hoverConflictId === row.id;
          const year = row.time.start.year;
          const chipClass =
            on && hot
              ? "map-rail-chip map-rail-chip-on map-rail-hot"
              : on
                ? "map-rail-chip map-rail-chip-on"
                : hot
                  ? "map-rail-chip map-rail-hot"
                  : "map-rail-chip";
          return (
            <button
              key={row.id}
              type="button"
              className={chipClass}
              data-on={on ? "true" : "false"}
              data-hot={hot ? "true" : "false"}
              title={row.name}
              style={
                hot
                  ? {
                      color: "#070806",
                      background: "#f0d24a",
                      borderColor: "#f0d24a",
                    }
                  : on
                    ? { borderColor: color, color }
                    : undefined
              }
              onMouseEnter={() => onHover?.({ type: "conflict", conflict: row })}
              onMouseLeave={() =>
                onHover?.((currentHover) =>
                  currentHover?.type === "conflict" && currentHover.conflict.id === row.id
                    ? null
                    : currentHover,
                )
              }
              onClick={() => {
                if (onOpenConflict) {
                  onOpenConflict(row);
                  return;
                }
                const first = days.find((day) => day.conflictId === row.id);
                if (first) onOpenIncident(first);
              }}
            >
              {row.name}
              {year ? ` · ${year}` : ""}
            </button>
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
  kicker = "From the papers",
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
  onOpenConflict,
  onHover,
  hovered,
}: {
  conflict: Conflict;
  locked: boolean;
  onClose: () => void;
  onOpenIncident: (incident: Incident) => void;
  onOpenConflict?: (conflict: Conflict) => void;
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
            {conflict.northeast ? <span>northeast</span> : null}
            <span>{conflict.internalExternal}</span>
            {conflict.time.ongoing ? <span>ongoing</span> : null}
          </p>
          <h2>{conflict.name}</h2>
          <p className="card-years">
            {conflict.time.start.year}
            {conflict.time.ongoing ? " — ongoing" : conflict.time.end?.year ? ` — ${conflict.time.end.year}` : ""}
          </p>
        </div>
        <button type="button" className="card-close" onClick={onClose}>
          Close
        </button>
      </div>
      <CampaignRail
        campaign={conflict}
        onOpenIncident={onOpenIncident}
        onOpenConflict={onOpenConflict}
        onHover={onHover}
        hovered={hovered}
      />
      <p className="map-card-summary">{conflict.summary}</p>
      {killed ? (
        <p className={styles.killed}>
          {killed.best != null
            ? `about ${killed.best.toLocaleString("en-IN")} killed`
            : killed.min != null && killed.max != null
              ? `${killed.min.toLocaleString("en-IN")}–${killed.max.toLocaleString("en-IN")} killed`
              : "deaths contested"}
          {killed.contested ? " · figures contested" : ""}
        </p>
      ) : null}
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
  onOpenConflict,
  onHover,
  hovered,
}: {
  incident: Incident;
  locked: boolean;
  onClose: () => void;
  onOpenIncident: (incident: Incident) => void;
  onOpenConflict?: (conflict: Conflict) => void;
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
        <CampaignRail
          campaign={campaign}
          activeId={incident.id}
          onOpenIncident={onOpenIncident}
          onOpenConflict={onOpenConflict}
          onHover={onHover}
          hovered={hovered}
        />
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
