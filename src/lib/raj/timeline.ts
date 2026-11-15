import { yearOf, type FuzzyDate, type Incident, type TimeSpan } from "./schema";
import { YEAR_MAX, YEAR_MIN } from "./seed";

export function fractionalYear(date: FuzzyDate | undefined | null, edge: "start" | "end"): number {
  const year = yearOf(date);
  if (year == null) return edge === "start" ? YEAR_MIN : YEAR_MAX;
  if (date?.precision === "day" || date?.precision === "month") {
    const month = date.month ?? (edge === "end" ? 12 : 1);
    const day = date.day ?? (edge === "end" ? 28 : 1);
    return year + (month - 1) / 12 + (day - 1) / 365.25;
  }
  return edge === "end" ? year + 0.92 : year;
}

export function spanStart(span: TimeSpan): number {
  return fractionalYear(span.start, "start");
}

export function spanEnd(span: TimeSpan): number {
  if (span.ongoing) return YEAR_MAX + 0.18;
  if (span.end) return fractionalYear(span.end, "end");
  return fractionalYear(span.start, "end");
}

export function incidentAt(incident: Incident): number {
  return fractionalYear(incident.time, "start");
}

export function yearToPct(year: number): number {
  const span = YEAR_MAX + 0.2 - YEAR_MIN;
  return ((year - YEAR_MIN) / span) * 100;
}

export function pctToYear(pct: number): number {
  const span = YEAR_MAX + 0.2 - YEAR_MIN;
  return YEAR_MIN + (pct / 100) * span;
}

export function packTracks(items: { id: string; start: number; end: number }[]): Map<string, number> {
  const sorted = [...items].sort((a, b) => a.start - b.start || a.end - b.end);
  const trackEnds: number[] = [];
  const tracks = new Map<string, number>();
  const gap = 0.4;
  for (const item of sorted) {
    let track = trackEnds.findIndex((end) => item.start >= end + gap);
    if (track === -1) {
      track = trackEnds.length;
      trackEnds.push(item.end);
    } else {
      trackEnds[track] = item.end;
    }
    tracks.set(item.id, track);
  }
  return tracks;
}

export function densityByYear(incidents: Incident[], familyOf: (id: string) => string | undefined) {
  const years = YEAR_MAX - YEAR_MIN + 1;
  const rows: { year: number; stacks: { family: string; count: number }[] }[] = [];
  let peak = 1;
  for (let i = 0; i < years; i += 1) {
    const year = YEAR_MIN + i;
    const counts = new Map<string, number>();
    for (const incident of incidents) {
      if (incident.time.year !== year) continue;
      const family = familyOf(incident.conflictId) ?? "unknown";
      counts.set(family, (counts.get(family) ?? 0) + 1);
    }
    const stacks = [...counts.entries()].map(([family, count]) => ({ family, count }));
    const total = stacks.reduce((sum, row) => row.count + sum, 0);
    peak = Math.max(peak, total);
    rows.push({ year, stacks });
  }
  return { rows, peak };
}
