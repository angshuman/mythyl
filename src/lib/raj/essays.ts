import essayRows from "@/data/raj/essays.json";
import { conflicts } from "./seed";
import { spanStart } from "./timeline";
import type { Conflict, ConflictFamily } from "./schema";

export type EssayMatch = { family: ConflictFamily } | { families: ConflictFamily[] };

export type RajEssay = {
  id: string;
  kicker: string;
  title: string;
  color: string;
  paragraphs: string[];
  match: EssayMatch;
};

export const ESSAYS = essayRows as RajEssay[];

export function essayConflicts(essay: RajEssay, list: Conflict[] = conflicts): Conflict[] {
  const match = essay.match;
  const ids = "families" in match ? match.families : [match.family];
  const rows = list.filter((conflict) => ids.includes(conflict.family));
  return [...rows].sort((a, b) => spanStart(a.time) - spanStart(b.time) || a.name.localeCompare(b.name));
}

export function essayYears(conflict: Conflict): string {
  const start = conflict.time.start.year;
  if (conflict.time.end?.year) {
    return conflict.time.end.year === start ? `${start}` : `${start}–${conflict.time.end.year}`;
  }
  return `${start}`;
}
