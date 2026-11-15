import essayRows from "@/data/conflicts/essays.json";
import { conflicts } from "./seed";
import { spanStart } from "./timeline";
import type { Conflict, ConflictFamily } from "./schema";

export type EssayMatch = { northeast: true } | { family: ConflictFamily };

export type ConflictEssay = {
  id: string;
  kicker: string;
  title: string;
  color: string;
  paragraphs: string[];
  match: EssayMatch;
};

export const ESSAYS = essayRows as ConflictEssay[];

export function essayConflicts(essay: ConflictEssay, list: Conflict[] = conflicts): Conflict[] {
  const match = essay.match;
  const rows =
    "family" in match
      ? list.filter((conflict) => conflict.family === match.family)
      : list.filter((conflict) => conflict.northeast);
  return [...rows].sort((a, b) => spanStart(a.time) - spanStart(b.time) || a.name.localeCompare(b.name));
}

export function essayYears(conflict: Conflict): string {
  const start = conflict.time.start.year;
  if (conflict.time.ongoing) return `${start}–`;
  if (conflict.time.end?.year) {
    return conflict.time.end.year === start ? `${start}` : `${start}–${conflict.time.end.year}`;
  }
  return `${start}`;
}
