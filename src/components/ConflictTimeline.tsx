"use client";

import { useMemo, useRef, useState, type MouseEvent, type SetStateAction } from "react";
import {
  densityByYear,
  FAMILIES,
  FAMILY_BY_ID,
  incidentAt,
  packTracks,
  spanEnd,
  spanStart,
  YEAR_MAX,
  YEAR_MIN,
  yearToPct,
  type Conflict,
  type ConflictFamily,
  type Era,
  type Incident,
} from "@/lib/conflicts";
import { MapCard, type MapFocus } from "./MapCard";

const BAR_H = 7;
const TRACK_GAP = 16;
const LANE_PAD = 14;
const DAY = 8;
const DECADES = [1960, 1970, 1980, 1990, 2000, 2010];

type Cursor = { year: number; pct: number };

type Props = {
  campaigns: Conflict[];
  incidents: Incident[];
  era: Era;
  enabledFamilies: Record<ConflictFamily, boolean>;
  selected: MapFocus | null;
  hovered: MapFocus | null;
  onHover: (focus: SetStateAction<MapFocus | null>) => void;
  onSelect: (focus: MapFocus) => void;
  onClose: () => void;
  onOpenIncident: (incident: Incident) => void;
};

export function ConflictTimeline({
  campaigns,
  incidents,
  era,
  enabledFamilies,
  selected,
  hovered,
  onHover,
  onSelect,
  onClose,
  onOpenIncident,
}: Props) {
  const plotRef = useRef<HTMLDivElement>(null);
  const [cursor, setCursor] = useState<Cursor | null>(null);

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
      densityByYear(incidents, (id) => {
        const campaign = campaigns.find((row) => row.id === id);
        return campaign?.family;
      }),
    [incidents, campaigns],
  );

  const panel = hovered ?? selected;
  const hotConflictId =
    panel?.type === "conflict" ? panel.conflict.id : panel?.type === "incident" ? panel.incident.conflictId : null;
  const hotIncidentId = panel?.type === "incident" ? panel.incident.id : null;

  const cursorYear = cursor ? Math.round(cursor.year) : null;
  const nearDays = useMemo(() => {
    if (cursorYear == null) return [];
    return incidents
      .filter((incident) => incident.time.year === cursorYear)
      .slice(0, 4);
  }, [incidents, cursorYear]);

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
      <div className="years-head">
        <p className="map-kicker">The years</p>
        <h2>A republic, scored</h2>
        <p>
          A bar is a campaign that lasted. A square is a day — the same mark as
          on the map. Colour is still the kind of conflict. The ridge is the
          pulse of those days.
        </p>
      </div>

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
              viewBox={`0 0 ${YEAR_MAX - YEAR_MIN + 1} 40`}
              preserveAspectRatio="none"
              role="img"
              aria-label="Days per year, stacked by kind of conflict"
            >
              {ridge.rows.map((row, index) => {
                let y = 40;
                const unit = 36 / ridge.peak;
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
            <div className="years-readout" style={{ height: "2.6rem" }} />
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
                    <em style={{ top: "0.55rem", left: cursor.pct > 78 ? "auto" : "0.5rem", right: cursor.pct > 78 ? "0.5rem" : "auto" }}>
                      {nearDays.map((day) => day.name).join(" · ")}
                    </em>
                  ) : null}
                </span>
              ) : null}
            </div>
            {byFamily.map(({ family, rows, packed, tracks }) => {
              const on = enabledFamilies[family.id];
              const height = LANE_PAD * 2 + tracks * BAR_H + (tracks - 1) * TRACK_GAP;
              return (
                <div
                  key={family.id}
                  className={on ? "years-lane" : "years-lane years-lane-off"}
                  style={{ minHeight: height + 8 }}
                >
                  <p className="years-rail-label years-family" title={family.hint}>
                    <i style={{ background: family.color }} />
                    {family.label}
                  </p>
                  <div className="years-plot">
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
                          aria-label={campaign.name}
                          title={campaign.name}
                          style={{
                            left: `${left}%`,
                            width: `${width}%`,
                            top,
                            height: BAR_H,
                            background: family.color,
                            opacity: dim ? 0.22 : hot ? 1 : 0.9,
                            boxShadow: hot ? `0 0 0 1px #e7dcc8, 0 0 16px ${family.color}66` : "none",
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
                        const hot = hotIncidentId === incident.id;
                        const dim = Boolean(hotConflictId) && campaign?.id !== hotConflictId;
                        return (
                          <button
                            key={incident.id}
                            type="button"
                            className="years-day"
                            data-day={incident.id}
                            aria-label={incident.name}
                            title={`${incident.name} · ${incident.time.year}`}
                            style={{
                              left: `calc(${left}% - ${DAY / 2}px)`,
                              top,
                              width: DAY,
                              height: DAY,
                              background: family.color,
                              opacity: dim ? 0.2 : 1,
                              boxShadow: hot
                                ? "0 0 0 1px #070806, 0 0 0 3px #e7dcc8"
                                : "0 0 0 1px #070806",
                              zIndex: hot ? 6 : 5,
                              transform: hot ? "rotate(45deg) scale(1.28)" : "rotate(45deg)",
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
                              onSelect({ type: "incident", incident });
                            }}
                          />
                        );
                      })}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="years-dock">
          {panel ? (
            <MapCard
              focus={panel}
              locked={Boolean(selected)}
              onClose={onClose}
              onOpenIncident={onOpenIncident}
              docked
            />
          ) : (
            <div className="years-idle">
              <p className="map-kicker">Read a year</p>
              <p>
                Slide across the score. A bar is a war that took years. A
                square is a morning. Click either, and the map flies there.
              </p>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
