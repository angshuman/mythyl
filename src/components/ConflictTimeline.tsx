"use client";

import { useMemo, useRef, useState, type MouseEvent, type SetStateAction } from "react";
import {
  conflictById,
  densityByYear,
  FAMILIES,
  FAMILY_BY_ID,
  incidentAt,
  packTracks,
  reportsForConflict,
  spanEnd,
  spanStart,
  YEAR_MAX,
  YEAR_MIN,
  yearToPct,
  type Conflict,
  type ConflictFamily,
  type Era,
  type Incident,
  type NewsReport,
} from "@/lib/conflicts";
import { NewsList, type MapFocus } from "./MapCard";

const BAR_H = 4;
const TRACK_GAP = 3;
const LANE_PAD = 3;
const DAY = 6;
const DECADES = [1960, 1970, 1980, 1990, 2000, 2010];

type Cursor = { year: number; pct: number };

type Props = {
  campaigns: Conflict[];
  incidents: Incident[];
  era: Era;
  enabledFamilies: Record<ConflictFamily, boolean>;
  yearsSelected: MapFocus | null;
  hovered: MapFocus | null;
  onHover: (focus: SetStateAction<MapFocus | null>) => void;
  onSelect: (focus: MapFocus) => void;
  onClose: () => void;
  familySolo: ConflictFamily | null;
  familiesAllOn: boolean;
  onFocusFamily: (id: ConflictFamily, event: { altKey: boolean; metaKey: boolean }) => void;
};

export function ConflictTimeline({
  campaigns,
  incidents,
  era,
  enabledFamilies,
  yearsSelected,
  hovered,
  onHover,
  onSelect,
  onClose,
  familySolo,
  familiesAllOn,
  onFocusFamily,
}: Props) {
  const plotRef = useRef<HTMLDivElement>(null);
  const [cursor, setCursor] = useState<Cursor | null>(null);
  const [held, setHeld] = useState<Partial<Record<ConflictFamily, { title: string; papers: NewsReport[] }>>>({});

  const byFamily = useMemo(() => {
    return FAMILIES.map((family) => {
      const rows = campaigns.filter((campaign) => campaign.family === family.id);
      const packed = packTracks(
        rows.map((campaign) => ({
          id: campaign.id,
          start: spanStart(campaign.time),
          end: spanEnd(campaign.time),
        })),
      );
      const tracks = rows.length === 0 ? 1 : Math.max(1, ...rows.map((row) => (packed.get(row.id) ?? 0) + 1));
      return { family, rows, packed, tracks };
    });
  }, [campaigns]);

  const ridge = useMemo(
    () =>
      densityByYear(
        incidents.filter((incident) => {
          const campaign = campaigns.find((row) => row.id === incident.conflictId);
          return !campaign || enabledFamilies[campaign.family];
        }),
        (id) => {
          const campaign = campaigns.find((row) => row.id === id);
          return campaign?.family;
        },
      ),
    [incidents, campaigns, enabledFamilies],
  );

  const hotConflictId =
    hovered?.type === "conflict"
      ? hovered.conflict.id
      : hovered?.type === "incident"
        ? hovered.incident.conflictId
        : null;
  const hotIncidentId = hovered?.type === "incident" ? hovered.incident.id : null;
  const openFamily =
    yearsSelected?.type === "conflict"
      ? yearsSelected.conflict.family
      : yearsSelected?.type === "incident"
        ? (campaigns.find((row) => row.id === yearsSelected.incident.conflictId)?.family ??
          conflictById(yearsSelected.incident.conflictId)?.family ??
          null)
        : null;
  const openPapers =
    yearsSelected?.type === "incident"
      ? yearsSelected.incident.reports
      : yearsSelected?.type === "conflict"
        ? reportsForConflict(yearsSelected.conflict.id).map((row) => row.report)
        : [];
  const openTitle =
    yearsSelected?.type === "incident"
      ? yearsSelected.incident.name
      : yearsSelected?.type === "conflict"
        ? yearsSelected.conflict.name
        : null;
  if (openFamily && openTitle && held[openFamily]?.title !== openTitle) {
    setHeld({ ...held, [openFamily]: { title: openTitle, papers: openPapers } });
  }

  const cursorYear = cursor ? Math.round(cursor.year) : null;
  const nearDays = useMemo(() => {
    if (cursorYear == null) return [];
    return incidents
      .filter((incident) => incident.time.year === cursorYear)
      .filter((incident) => {
        const campaign = campaigns.find((row) => row.id === incident.conflictId);
        return !campaign || enabledFamilies[campaign.family];
      })
      .slice(0, 4);
  }, [incidents, campaigns, enabledFamilies, cursorYear]);

  const eraLeft = yearToPct(era.start);
  const eraRight = yearToPct(era.id === "all" ? YEAR_MAX + 0.2 : era.end + 0.92);

  function readPct(event: { clientX: number }): number | null {
    const plot = plotRef.current;
    if (!plot) return null;
    const box = plot.getBoundingClientRect();
    if (box.width <= 0) return null;
    return Math.min(1, Math.max(0, (event.clientX - box.left) / box.width)) * 100;
  }

  function onPlotMove(event: MouseEvent<HTMLDivElement>) {
    const pct = readPct(event);
    if (pct == null) return;
    const span = YEAR_MAX + 0.2 - YEAR_MIN;
    setCursor({ pct, year: YEAR_MIN + (pct / 100) * span });
  }

  return (
    <section className="years" id="years">
      <header className="years-head">
        <p className="years-kicker">Years</p>
      </header>
      <div className="years-body">
        <div
          className="years-stage"
          onMouseMove={onPlotMove}
          onMouseLeave={() => {
            setCursor(null);
            onHover(null);
          }}
        >
          {cursorYear != null ? (
            <div className="years-ghost" aria-hidden="true">
              {cursorYear}
            </div>
          ) : null}

          <div className="years-ridge-row">
            <span className="years-rail-label">Pulse</span>
            <svg
              className="years-ridge"
              viewBox={`0 0 ${YEAR_MAX - YEAR_MIN + 1} 24`}
              preserveAspectRatio="none"
              role="img"
              aria-label="Days per year, stacked by kind of conflict"
            >
              {ridge.rows.map((row, index) => {
                let y = 24;
                const unit = 22 / ridge.peak;
                return row.stacks.map((stack) => {
                  const h = stack.count * unit;
                  y -= h;
                  const color = FAMILY_BY_ID.get(stack.family as ConflictFamily)?.color ?? "#e7dcc8";
                  const rect = (
                    <rect
                      key={`${row.year}-${stack.family}`}
                      x={index + 0.12}
                      y={y}
                      width={0.76}
                      height={h}
                      rx={0.12}
                      fill={color}
                      opacity={0.92}
                    />
                  );
                  return rect;
                });
              })}
            </svg>
          </div>

          <div className="years-axis-row">
            <span className="years-rail-label" />
            <div className="years-axis">
              <span className="years-tick" style={{ left: `${yearToPct(YEAR_MIN)}%` }}>
                1947
              </span>
              {DECADES.map((year) => (
                <span key={year} className="years-tick" style={{ left: `${yearToPct(year)}%` }}>
                  {year}
                </span>
              ))}
              <span className="years-tick years-tick-now" style={{ left: `${yearToPct(YEAR_MAX)}%` }}>
                now
              </span>
            </div>
          </div>

          <div className="years-lanes">
            <div className="years-readout" />
            <div className="years-overlay" ref={plotRef} aria-hidden="true">
              {era.id !== "all" ? (
                <>
                  <div className="years-veil" style={{ left: 0, width: `${eraLeft}%` }} />
                  <div
                    className="years-veil"
                    style={{ left: `${eraRight}%`, width: `${Math.max(0, 100 - eraRight)}%` }}
                  />
                  <div
                    className="years-aperture"
                    style={{ left: `${eraLeft}%`, width: `${Math.max(0, eraRight - eraLeft)}%` }}
                  />
                </>
              ) : null}
              {DECADES.map((year) => (
                <span key={year} className="years-hair" style={{ left: `${yearToPct(year)}%` }} />
              ))}
              <span className="years-now-line" style={{ left: `${yearToPct(YEAR_MAX)}%` }} />
              {cursor ? (
                <span
                  className="years-playhead"
                  data-end={cursor.pct > 78 ? "true" : "false"}
                  style={{ left: `${cursor.pct}%` }}
                >
                  {nearDays.length ? (
                    <em style={{ top: "0.15rem", left: cursor.pct > 78 ? "auto" : "0.5rem", right: cursor.pct > 78 ? "0.5rem" : "auto" }}>
                      {nearDays.map((day) => day.name).join(" · ")}
                    </em>
                  ) : null}
                </span>
              ) : null}
            </div>
            {byFamily.map(({ family, rows, packed, tracks }) => {
              const on = enabledFamilies[family.id];
              const packedHeight = LANE_PAD * 2 + tracks * BAR_H + (tracks - 1) * TRACK_GAP;
              const height = on ? packedHeight : Math.min(packedHeight, 16);
              const drawerOpen = openFamily === family.id && Boolean(yearsSelected);
              const bits = held[family.id];
              return (
                <div
                  key={family.id}
                  className={on ? "years-lane" : "years-lane years-lane-off"}
                  data-open={drawerOpen ? "true" : "false"}
                >
                  <button
                    type="button"
                    className="years-rail-label years-family"
                    data-solo={familySolo === family.id ? "true" : "false"}
                    data-focus={!familiesAllOn && on ? "true" : "false"}
                    title={`${family.hint}. Click to show only this. Click another kind to add it. Click again to drop it.`}
                    onClick={(event) => {
                      event.stopPropagation();
                      onFocusFamily(family.id, event);
                    }}
                  >
                    <i style={{ background: family.color }} />
                    {family.label}
                  </button>
                  <div className="years-plot" style={{ minHeight: height + 4 }}>
                    {Array.from({ length: tracks }, (_, track) => (
                      <span
                        key={`stave-${family.id}-${track}`}
                        className="years-stave"
                        style={{ top: LANE_PAD + track * (BAR_H + TRACK_GAP) + BAR_H / 2 }}
                      />
                    ))}
                    {rows.map((campaign) => {
                      const start = spanStart(campaign.time);
                      const end = spanEnd(campaign.time);
                      const left = yearToPct(start);
                      const width = Math.max(yearToPct(end) - left, 0.85);
                      const daysHere = incidents.filter((incident) => incident.conflictId === campaign.id);
                      const short = width < 2.6 && daysHere.length > 0;
                      if (short) return null;
                      const track = packed.get(campaign.id) ?? 0;
                      const top = LANE_PAD + track * (BAR_H + TRACK_GAP);
                      const hot = hotConflictId === campaign.id;
                      const dim = Boolean(hotConflictId) && !hot;
                      return (
                        <button
                          key={campaign.id}
                          type="button"
                          className="years-bar"
                          data-ongoing={campaign.time.ongoing ? "true" : "false"}
                          data-conflict={campaign.id}
                          data-hot={hot ? "true" : "false"}
                          aria-label={campaign.name}
                          title={campaign.name}
                          style={{
                            left: `${left}%`,
                            width: `${width}%`,
                            top,
                            height: BAR_H,
                            background: family.color,
                            opacity: dim ? 0.22 : hot ? 1 : 0.9,
                            zIndex: hot ? 4 : 2,
                          }}
                          onMouseEnter={() => onHover({ type: "conflict", conflict: campaign })}
                          onMouseLeave={() =>
                            onHover((current) =>
                              current?.type === "conflict" && current.conflict.id === campaign.id ? null : current,
                            )
                          }
                          onClick={(event) => {
                            event.stopPropagation();
                            if (yearsSelected?.type === "conflict" && yearsSelected.conflict.id === campaign.id) {
                              onClose();
                              return;
                            }
                            onSelect({ type: "conflict", conflict: campaign });
                          }}
                        />
                      );
                    })}
                    {incidents
                      .filter((incident) => rows.some((row) => row.id === incident.conflictId))
                      .map((incident) => {
                        const campaign = rows.find((row) => row.id === incident.conflictId);
                        const track = campaign ? packed.get(campaign.id) ?? 0 : 0;
                        const top = LANE_PAD + track * (BAR_H + TRACK_GAP) + (BAR_H - DAY) / 2;
                        const left = yearToPct(incidentAt(incident));
                        const hot =
                          hotIncidentId === incident.id ||
                          (!hotIncidentId && hotConflictId === campaign?.id);
                        const dim = Boolean(hotConflictId) && campaign?.id !== hotConflictId;
                        return (
                          <button
                            key={incident.id}
                            type="button"
                            className="years-day"
                            data-day={incident.id}
                            data-hot={hot ? "true" : "false"}
                            aria-label={incident.name}
                            title={`${incident.name} · ${incident.time.year}`}
                            style={{
                              left: `calc(${left}% - ${DAY / 2}px)`,
                              top,
                              width: DAY,
                              height: DAY,
                              background: family.color,
                              opacity: dim ? 0.2 : 1,
                              zIndex: hot ? 6 : 5,
                            }}
                            onMouseEnter={() => onHover({ type: "incident", incident })}
                            onMouseLeave={() =>
                              onHover((current) =>
                                current?.type === "incident" && current.incident.id === incident.id
                                  ? null
                                  : current,
                              )
                            }
                            onClick={(event) => {
                              event.stopPropagation();
                              if (yearsSelected?.type === "incident" && yearsSelected.incident.id === incident.id) {
                                onClose();
                                return;
                              }
                              onSelect({ type: "incident", incident });
                            }}
                          />
                        );
                      })}
                  </div>
                  <div
                    className="years-drawer"
                    data-open={drawerOpen ? "true" : "false"}
                    data-drawer-family={family.id}
                    aria-hidden={!drawerOpen}
                  >
                    <div className="years-drawer-inner">
                      {bits ? (
                        <>
                          <div className="years-drawer-head">
                            <p className="map-kicker">From the papers</p>
                            <h3>{bits.title}</h3>
                            <button type="button" className="card-close" onClick={onClose}>
                              Close
                            </button>
                          </div>
                          {bits.papers.length ? (
                            <NewsList reports={bits.papers} layout="row" />
                          ) : (
                            <p className="years-drawer-empty">No clippings on file yet.</p>
                          )}
                        </>
                      ) : null}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
