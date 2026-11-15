import { conflictYears, yearOf, type Conflict, type Incident } from "./schema";

export type EraId = "all" | "founding" | "insurgencies" | "nineties" | "century";

export type Era = {
  id: EraId;
  label: string;
  hint: string;
  start: number;
  end: number;
};

const NOW = new Date().getFullYear();

export const ERAS: Era[] = [
  { id: "all", label: "All years", hint: "1947 to now", start: 1947, end: NOW },
  { id: "founding", label: "1947–62", hint: "Joining the map", start: 1947, end: 1962 },
  { id: "insurgencies", label: "1963–89", hint: "The long inside wars", start: 1963, end: 1989 },
  { id: "nineties", label: "1990–2001", hint: "After the Cold War", start: 1990, end: 2001 },
  { id: "century", label: "2002–now", hint: "This century", start: 2002, end: NOW },
];

/** Ongoing, or a start/end in this last decade, counts as recent on the map. */
export const RECENT_SINCE = 2014;

export function conflictInEra(conflict: Conflict, era: Era): boolean {
  const { start, end } = conflictYears(conflict);
  return start <= era.end && end >= era.start;
}

export function incidentInEra(incident: Incident, era: Era): boolean {
  const year = yearOf(incident.time);
  if (year == null) return era.id === "all";
  return year >= era.start && year <= era.end;
}

export function isRecentConflict(conflict: Conflict): boolean {
  if (conflict.time.ongoing) return true;
  const { start, end } = conflictYears(conflict);
  return end >= RECENT_SINCE || start >= RECENT_SINCE;
}

export function isRecentIncident(incident: Incident): boolean {
  const year = yearOf(incident.time);
  return year != null && year >= RECENT_SINCE;
}
