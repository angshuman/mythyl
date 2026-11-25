import essayRows from "@/data/states/essays.json";
import eventRows from "@/data/states/events.json";
import metaRow from "@/data/states/meta.json";
import stateRows from "@/data/states/states.json";
import unionRows from "@/data/states/union.json";
import type {
  EventScale,
  IndianState,
  PartyFamily,
  SeriesPoint,
  StateEssay,
  StateEvent,
  StatesMeta,
  UnionTerm,
} from "./schema";

export * from "./schema";

export const STATES = stateRows as IndianState[];
export const EVENTS = eventRows as StateEvent[];
export const UNION = unionRows as UnionTerm[];
export const ESSAYS = essayRows as StateEssay[];
export const META = metaRow as StatesMeta;

export const YEAR_MIN = 1947;
export const YEAR_MAX = 2025;
export const SERIES_YEARS = (META.years?.length ? META.years : [1971, 1981, 1991, 2001, 2011, 2016, 2019, 2021, 2023]) as number[];
export const ALL_INDIA_NNI = (META.allIndiaNni ?? [])
  .filter((row) => row.perCapitaRs != null)
  .map((row) => ({ year: row.year, value: row.perCapitaRs as number }));

export const STATE_BY_ID = new Map(STATES.map((state) => [state.id, state]));
export const STATE_BY_GEO = new Map(STATES.map((state) => [state.geoName, state]));

export type Metric = "income" | "survival";

export type StateEra = {
  id: string;
  label: string;
  year: number | null;
  hint: string;
};

export const ERAS: StateEra[] = [
  { id: "all", label: "All years", year: null, hint: "Every political event on the map" },
  ...SERIES_YEARS.map((year) => ({
    id: String(year),
    label: String(year),
    year,
    hint:
      year >= 2011
        ? `SRS infant mortality and per-capita NSDP at 2011–12 prices, ${year}`
        : `SRS infant mortality and current-price per-capita income, ${year}`,
  })),
];

export const PARTY_COLOR: Record<PartyFamily, string> = {
  congress: "#6b8cce",
  janata: "#c9a227",
  nda: "#c47a3a",
  upa: "#7eb8a0",
  left: "#b54a3a",
  regional: "#8fd0b2",
  other: "#9a937e",
};

export const SCALE_LABEL: Record<EventScale, string> = {
  union: "union",
  state: "state",
  local: "local",
};

export function stateById(id: string): IndianState | undefined {
  return STATE_BY_ID.get(id);
}

export function stateByGeo(name: string): IndianState | undefined {
  return STATE_BY_GEO.get(name);
}

export function allStates(): IndianState[] {
  return STATES;
}

export function allEvents(): StateEvent[] {
  return EVENTS;
}

function nearest(points: SeriesPoint[], year: number, key: "imr" | "perCapitaRs"): SeriesPoint | null {
  let best: SeriesPoint | null = null;
  let dist = Infinity;
  for (const point of points) {
    if (point[key] == null) continue;
    const gap = Math.abs(point.year - year);
    if (gap < dist) {
      best = point;
      dist = gap;
    }
  }
  return best;
}

export function imrOf(state: IndianState, year: number): number | null {
  const point = nearest(state.series, year, "imr");
  return point?.imr ?? null;
}

export function incomeOf(state: IndianState, year?: number): number | null {
  if (year == null) {
    const point = [...state.series].reverse().find((row) => row.perCapitaRs != null);
    return point?.perCapitaRs ?? null;
  }
  const point = nearest(state.series, year, "perCapitaRs");
  return point?.perCapitaRs ?? null;
}

export function incomePrice(state: IndianState, year?: number): "current" | "2011-12" | null {
  const target = year ?? SERIES_YEARS[SERIES_YEARS.length - 1];
  const point = nearest(state.series, target, "perCapitaRs");
  return point?.price ?? null;
}

export function sparkImr(state: IndianState): { year: number; value: number }[] {
  return state.series
    .filter((row) => row.imr != null)
    .map((row) => ({ year: row.year, value: row.imr as number }));
}

export function sparkIncome(state: IndianState): { year: number; value: number }[] {
  return state.series
    .filter((row) => row.perCapitaRs != null && row.price === "2011-12")
    .map((row) => ({ year: row.year, value: row.perCapitaRs as number }));
}

export function eventsForState(state: IndianState): StateEvent[] {
  return EVENTS.filter(
    (event) => event.states.includes("*") || event.states.includes(state.name) || event.states.includes(state.geoName),
  ).sort((a, b) => a.year - b.year);
}

export function unionAt(year: number): UnionTerm | undefined {
  return UNION.find((term) => term.start <= year && (term.end == null || term.end >= year));
}

export function cmAt(state: IndianState, year: number) {
  return state.politics.find((spell) => spell.start <= year && (spell.end == null || spell.end >= year));
}

export function incomeExtent(year?: number): { min: number; max: number } {
  const values = STATES.map((state) => incomeOf(state, year)).filter((value): value is number => value != null);
  return { min: Math.min(...values), max: Math.max(...values) };
}

export function imrExtent(year: number): { min: number; max: number } {
  const values = STATES.map((state) => imrOf(state, year)).filter((value): value is number => value != null);
  return { min: Math.min(...values), max: Math.max(...values) };
}

function lerpColor(a: string, b: string, t: number): string {
  const pa = parseInt(a.slice(1), 16);
  const pb = parseInt(b.slice(1), 16);
  const mix = (shift: number) => {
    const ca = (pa >> shift) & 255;
    const cb = (pb >> shift) & 255;
    return Math.round(ca + (cb - ca) * t);
  };
  const hex = (n: number) => n.toString(16).padStart(2, "0");
  return `#${hex(mix(16))}${hex(mix(8))}${hex(mix(0))}`;
}

/** Low income is dark umber; high income is paper-gold. */
export function colorForIncome(value: number, min: number, max: number): string {
  const t = max === min ? 0.5 : Math.max(0, Math.min(1, (Math.log(value) - Math.log(min)) / (Math.log(max) - Math.log(min))));
  if (t < 0.5) return lerpColor("#241c16", "#7a5a38", t * 2);
  return lerpColor("#7a5a38", "#e6d3a4", (t - 0.5) * 2);
}

/** Low IMR (better survival) is deep teal; high IMR is lac. */
export function colorForImr(value: number, min: number, max: number): string {
  const t = max === min ? 0.5 : Math.max(0, Math.min(1, (value - min) / (max - min)));
  if (t < 0.5) return lerpColor("#2a4a44", "#8a9a62", t * 2);
  return lerpColor("#8a9a62", "#7f4540", (t - 0.5) * 2);
}

export function formatRupees(value: number): string {
  return `₹${Math.round(value).toLocaleString("en-IN")}`;
}

export function formatAxisRupees(value: number): string {
  if (value >= 100000) {
    const lakh = value / 100000;
    return Number.isInteger(lakh) ? `₹${lakh}L` : `₹${lakh.toFixed(1)}L`;
  }
  if (value >= 1000) return `₹${Math.round(value / 1000)}k`;
  return `₹${Math.round(value)}`;
}

export function formatImr(value: number): string {
  return `${value} / 1,000`;
}

export function eventInEra(event: StateEvent, era: StateEra): boolean {
  if (era.year == null) return true;
  return event.year <= era.year;
}
