"use client";

import { useEffect, useState } from "react";
import {
  KINDS,
  YEAR_MAX,
  YEAR_MIN,
  commissionsOf,
  formatYears,
  kindColor,
  packSpans,
  spanEnd,
  spanStart,
  type WorkCommission,
  type WorkEra,
  type WorkKind,
  type WorkProject,
} from "@/lib/works";

const BAR_H = 5;
const TRACK_GAP = 7;
const LANE_PAD = 6;
const DAY = 6;

function pct(year: number): number {
  const span = YEAR_MAX - YEAR_MIN;
  return Math.min(99.4, Math.max(0, ((year - YEAR_MIN) / span) * 100));
}

export function WorksTimeline({
  projects,
  era,
  selected,
  hovered,
  onHover,
  onSelect,
  onClose,
  onFocusKind,
}: {
  projects: WorkProject[];
  era: WorkEra;
  selected: WorkProject | null;
  hovered: WorkProject | null;
  onHover: (project: WorkProject | null) => void;
  onSelect: (project: WorkProject) => void;
  onClose: () => void;
  onFocusKind: (kind: WorkKind) => void;
}) {
  const ticks = [1950, 1960, 1970, 1980, 1990, 2000, 2010, 2020];
  const [selectedCommission, setSelectedCommission] = useState<WorkCommission | null>(null);

  useEffect(() => {
    if (!selected) setSelectedCommission(null);
  }, [selected]);

  return (
    <section className="years" id="years">
      <div className="years-head">
        <p className="years-kicker">Years</p>
        <p className="years-lede">Bars run from first work to the latest public opening. Diamonds are later named stretches, lines, units, and terminals. Click either to fly to the site.</p>
      </div>
      <div className="years-body work-years">
        {KINDS.map((kind, kindIndex) => {
          const rows = projects.filter((project) => project.kind === kind.id);
          if (rows.length === 0) return null;
          const packed = packSpans(
            rows.map((project) => ({
              id: project.id,
              start: spanStart(project),
              end: spanEnd(project),
            })),
          );
          const trackCount = (packed.size === 0 ? 0 : Math.max(...packed.values())) + 1;
          const plotH = LANE_PAD * 2 + trackCount * (BAR_H + TRACK_GAP) - TRACK_GAP;
          return (
            <div className="years-lane" key={kind.id}>
              <button type="button" className="years-family on" onClick={() => onFocusKind(kind.id)}>
                <i className="swatch" style={{ background: kind.color }} />
                {kind.label}
              </button>
              <div className="years-plot" style={{ minHeight: plotH }}>
                {rows.map((project) => {
                  const start = spanStart(project);
                  const end = spanEnd(project);
                  const left = pct(start);
                  const width = Math.max(0.7, pct(Math.max(end, start + 1)) - left);
                  const hot = selected?.id === project.id || hovered?.id === project.id;
                  const inBand = era.id === "all" || (start <= era.end && end >= era.start);
                  const track = packed.get(project.id) ?? 0;
                  const top = LANE_PAD + track * (BAR_H + TRACK_GAP);
                  return (
                    <button
                      key={project.id}
                      type="button"
                      className="years-bar"
                      data-hot={hot ? "true" : "false"}
                      data-ongoing={project.status === "ongoing" ? "true" : "false"}
                      title={`${project.name} · ${formatYears(project)}`}
                      style={{
                        left: `${left}%`,
                        width: `${width}%`,
                        top,
                        height: BAR_H,
                        background: kindColor(project.kind),
                        opacity: inBand ? 1 : 0.28,
                        zIndex: hot ? 4 : 2,
                      }}
                      onMouseEnter={() => onHover(project)}
                      onMouseLeave={() => onHover(null)}
                      onClick={() => {
                        setSelectedCommission(null);
                        if (selected?.id === project.id) onClose();
                        else onSelect(project);
                      }}
                    />
                  );
                })}
                {rows.flatMap((project) => {
                  const seen = new Map<number, number>();
                  const track = packed.get(project.id) ?? 0;
                  const top = LANE_PAD + track * (BAR_H + TRACK_GAP) + (BAR_H - DAY) / 2;
                  const hotBar = selected?.id === project.id || hovered?.id === project.id;
                  const start = spanStart(project);
                  const end = spanEnd(project);
                  const inBand = era.id === "all" || (start <= era.end && end >= era.start);
                  return commissionsOf(project).map((commission) => {
                    const offset = seen.get(commission.year) ?? 0;
                    seen.set(commission.year, offset + 1);
                    const hotTick = hotBar && selectedCommission?.name === commission.name && selectedCommission.year === commission.year;
                    return (
                      <button
                        key={`${project.id}-${commission.year}-${commission.name}`}
                        type="button"
                        className="years-day"
                        data-hot={hotTick || (hotBar && !selectedCommission) ? "true" : "false"}
                        title={`${project.name} · ${commission.year} · ${commission.name}`}
                        style={{
                          left: `calc(${pct(commission.year + offset * 0.16)}% - ${DAY / 2}px)`,
                          top,
                          width: DAY,
                          height: DAY,
                          background: kindColor(project.kind),
                          opacity: inBand ? 1 : 0.28,
                          zIndex: hotTick ? 6 : 5,
                        }}
                        onMouseEnter={() => onHover(project)}
                        onMouseLeave={() => onHover(null)}
                        onClick={() => {
                          setSelectedCommission(commission);
                          onSelect(project);
                        }}
                      />
                    );
                  });
                })}
                {kindIndex === 0
                  ? ticks.map((year) => (
                      <span key={year} className="years-tick" style={{ left: `${pct(year)}%` }}>
                        {year}
                      </span>
                    ))
                  : null}
              </div>
            </div>
          );
        })}
      </div>
      {selected ? (
        <div className="years-drawer" data-open="true">
          <div className="years-drawer-inner">
            <p className="map-kicker">
              {selected.kind} · {selected.scale} · {selectedCommission ? selectedCommission.year : formatYears(selected)}
            </p>
            <h3>{selected.name}</h3>
            {selectedCommission ? <p>{selectedCommission.name}</p> : <p>{selected.summary}</p>}
            {commissionsOf(selected).length > 0 ? (
              <ol className="work-opens">
                {commissionsOf(selected).map((commission) => (
                  <li
                    key={`${commission.year}-${commission.name}`}
                    className={
                      selectedCommission?.year === commission.year && selectedCommission.name === commission.name
                        ? "work-opens-hot"
                        : undefined
                    }
                  >
                    <span>{commission.year}</span>
                    <span>{commission.name}</span>
                  </li>
                ))}
              </ol>
            ) : null}
            <ul className="map-card-sources">
              {(selectedCommission ? selectedCommission.sources : selected.sources).map((source) => (
                <li key={source.url} className="map-card-source">
                  <a className="map-card-source-link" href={source.url} target="_blank" rel="noreferrer">
                    {source.title} →
                  </a>
                </li>
              ))}
            </ul>
            <button type="button" className="card-close" onClick={onClose}>
              Close
            </button>
          </div>
        </div>
      ) : null}
    </section>
  );
}
