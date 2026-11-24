"use client";

import { PARTY_COLOR, YEAR_MAX, YEAR_MIN, type IndianState, type StateEra, type StateEvent, type UnionTerm } from "@/lib/states";

function pct(year: number): number {
  return ((year - YEAR_MIN) / (YEAR_MAX - YEAR_MIN)) * 100;
}

export function StatesTimeline({
  events,
  union,
  era,
  selected,
  state,
  onSelect,
  onClose,
}: {
  events: StateEvent[];
  union: UnionTerm[];
  era: StateEra;
  selected: StateEvent | null;
  state: IndianState | null;
  onSelect: (event: StateEvent) => void;
  onClose: () => void;
}) {
  const ticks = [1950, 1960, 1970, 1980, 1990, 2000, 2010, 2020];
  return (
    <section className="years" id="years">
      <div className="years-head">
        <p className="years-kicker">Years</p>
        <p className="years-lede">
          Union cabinets, and the events that sit on the income and survival series
          {state ? ` · ${state.name}` : ""}.
        </p>
      </div>
      <div className="years-body state-years">
        <div className="years-lane">
          <button type="button" className="years-family on" disabled>
            Union
          </button>
          <div className="years-plot">
            {union.map((term) => {
              const end = term.end ?? YEAR_MAX;
              const left = pct(term.start);
              const width = Math.max(0.6, pct(end) - left);
              return (
                <span
                  key={`${term.name}-${term.start}`}
                  className="years-bar"
                  title={`${term.name} · ${term.party} · ${term.start}${term.end ? `–${term.end}` : "–"}`}
                  style={{
                    left: `${left}%`,
                    width: `${width}%`,
                    background: PARTY_COLOR[term.partyFamily],
                  }}
                />
              );
            })}
            {ticks.map((year) => (
              <span key={year} className="years-tick" style={{ left: `${pct(year)}%` }}>
                {year}
              </span>
            ))}
          </div>
        </div>
        {state && state.politics.length > 0 ? (
          <div className="years-lane">
            <button type="button" className="years-family on" disabled>
              {state.name}
            </button>
            <div className="years-plot">
              {state.politics.map((spell) => {
                const end = spell.end ?? YEAR_MAX;
                const left = pct(spell.start);
                const width = Math.max(0.6, pct(end) - left);
                return (
                  <span
                    key={`${spell.cm}-${spell.start}`}
                    className="years-bar"
                    title={`${spell.cm} · ${spell.party} · ${spell.start}${spell.end ? `–${spell.end}` : "–"}`}
                    style={{
                      left: `${left}%`,
                      width: `${width}%`,
                      background: PARTY_COLOR[spell.partyFamily],
                    }}
                  />
                );
              })}
            </div>
          </div>
        ) : null}
        <div className="years-lane">
          <button type="button" className="years-family on" disabled>
            Events
          </button>
          <div className="years-plot">
            {events.map((event) => {
              const on = selected?.id === event.id;
              const dim = era.year != null && selected && !on;
              return (
                <button
                  key={event.id}
                  type="button"
                  className="years-day"
                  data-hot={on ? "true" : "false"}
                  data-scale={event.scale}
                  title={`${event.name} · ${event.year} · ${event.scale}`}
                  style={{
                    left: `${pct(event.year)}%`,
                    opacity: dim ? 0.35 : 1,
                  }}
                  onClick={() => (on ? onClose() : onSelect(event))}
                />
              );
            })}
          </div>
        </div>
      </div>
      {selected ? (
        <div className="years-drawer" data-open="true">
          <div className="years-drawer-inner">
            <p className="map-kicker">
              {selected.scale} · {selected.kind} · {selected.year}
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
