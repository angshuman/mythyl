"use client";

import { KINDS, YEAR_MAX, YEAR_MIN, formatYears, kindColor, type WorkEra, type WorkKind, type WorkProject } from "@/lib/works";

function pct(year: number): number {
  return ((year - YEAR_MIN) / (YEAR_MAX - YEAR_MIN)) * 100;
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
  return (
    <section className="years" id="years">
      <div className="years-head">
        <p className="years-kicker">Years</p>
        <p className="years-lede">Commissioning dates by kind. Click a bar to fly to the site.</p>
      </div>
      <div className="years-body work-years">
        {KINDS.map((kind) => {
          const rows = projects.filter((project) => project.kind === kind.id);
          if (rows.length === 0) return null;
          return (
            <div className="years-lane" key={kind.id}>
              <button type="button" className="years-family on" onClick={() => onFocusKind(kind.id)}>
                <i className="swatch" style={{ background: kind.color }} />
                {kind.label}
              </button>
              <div className="years-plot">
                {rows.map((project) => {
                  const start = project.started ?? project.opened ?? YEAR_MIN;
                  const end = project.opened ?? (project.status === "ongoing" || project.status === "stalled" ? YEAR_MAX : start);
                  const left = pct(start);
                  const width = Math.max(0.7, pct(Math.max(end, start + 1)) - left);
                  const hot = selected?.id === project.id || hovered?.id === project.id;
                  const inBand = era.id === "all" || (start <= era.end && end >= era.start);
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
                        background: kindColor(project.kind),
                        opacity: inBand ? 1 : 0.28,
                      }}
                      onMouseEnter={() => onHover(project)}
                      onMouseLeave={() => onHover(null)}
                      onClick={() => (selected?.id === project.id ? onClose() : onSelect(project))}
                    />
                  );
                })}
                {kind.id === KINDS[0].id
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
              {selected.kind} · {selected.scale} · {formatYears(selected)}
            </p>
            <h3>{selected.name}</h3>
            <p>{selected.summary}</p>
            <ul className="map-card-sources">
              {selected.sources.map((source) => (
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
