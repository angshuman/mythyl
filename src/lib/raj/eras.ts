import { conflictYears, yearOf, type Conflict, type Incident } from "./schema";

export type EraId = "all" | "company" | "after" | "swadeshi" | "movement" | "endgame";

export type Era = {
  id: EraId;
  label: string;
  hint: string;
  start: number;
  end: number;
};

export const ERAS: Era[] = [
  { id: "all", label: "All years", hint: "1757 to 1947", start: 1757, end: 1947 },
  { id: "company", label: "Company", hint: "Plassey to the revolt", start: 1757, end: 1857 },
  { id: "after", label: "After 1857", hint: "The Crown’s India", start: 1858, end: 1904 },
  { id: "swadeshi", label: "Swadeshi years", hint: "Partition, jail, war", start: 1905, end: 1918 },
  { id: "movement", label: "Mass movement", hint: "Bagh to Dandi", start: 1919, end: 1941 },
  { id: "endgame", label: "Endgame", hint: "Quit India to the Navy", start: 1942, end: 1947 },
];

export function conflictInEra(conflict: Conflict, era: Era): boolean {
  const { start, end } = conflictYears(conflict);
  return start <= era.end && end >= era.start;
}

export function incidentInEra(incident: Incident, era: Era): boolean {
  const year = yearOf(incident.time);
  if (year == null) return era.id === "all";
  return year >= era.start && year <= era.end;
}

/** Infamous days keep a ring. There is no “recent” on a closed empire. */
export function isWeightyConflict(conflict: Conflict): boolean {
  return conflict.family === "massacre" || conflict.family === "famine" || conflict.family === "revolt";
}

export function isWeightyIncident(incident: Incident): boolean {
  return incident.kind === "massacre" || incident.kind === "execution";
}
