import familyRows from "@/data/raj/families.json";
import familyGroupRows from "@/data/raj/family-groups.json";
import { conflicts } from "./seed";
import { incidents } from "./incidents";
import {
  conflictYears,
  spanActiveInYear,
  yearOf,
  type Conflict,
  type ConflictFamily,
  type FamilyDef,
  type FamilyGroupDef,
  type Incident,
  type NewsReport,
  type Scale,
} from "./schema";

export const FAMILIES = familyRows as FamilyDef[];
export const FAMILY_BY_ID = new Map(FAMILIES.map((family) => [family.id, family]));
export const FAMILY_GROUPS = familyGroupRows as FamilyGroupDef[];

export function membersOfGroup(groupId: string): FamilyDef[] {
  return FAMILIES.filter((family) => family.group === groupId);
}

export function isolateFamilies(ids: readonly ConflictFamily[]): Record<ConflictFamily, boolean> {
  const set = new Set(ids);
  return Object.fromEntries(FAMILIES.map((family) => [family.id, set.has(family.id)])) as Record<
    ConflictFamily,
    boolean
  >;
}

export function familyOf(conflict: Conflict): FamilyDef {
  return (
    FAMILY_BY_ID.get(conflict.family) ?? {
      id: conflict.family,
      label: conflict.family,
      color: "#c4a06a",
      hint: "",
    }
  );
}

export function familyColor(conflict: Conflict): string {
  return familyOf(conflict).color;
}

export * from "./schema";
export * from "./seed";
export * from "./actors";
export * from "./incidents";
export * from "./format";
export * from "./eras";
export * from "./timeline";
export * from "./essays";

export const SCALE_COLOR: Record<Scale, string> = {
  small: "#c4a06a",
  medium: "#c9a227",
  large: "#b54a3a",
};

export const SCALE_RADIUS: Record<Scale, number> = {
  small: 6,
  medium: 9,
  large: 13,
};

export function allConflicts(): Conflict[] {
  return conflicts;
}

export function allIncidents(): Incident[] {
  return incidents;
}

export function incidentsForConflict(conflictId: string): Incident[] {
  return allIncidents().filter((incident) => incident.conflictId === conflictId);
}

export function incidentsInYear(year: number, list: Incident[] = allIncidents()): Incident[] {
  return list.filter((incident) => yearOf(incident.time) === year);
}

export function conflictById(id: string): Conflict | undefined {
  return allConflicts().find((conflict) => conflict.id === id);
}

export function conflictBySlug(slug: string): Conflict | undefined {
  return allConflicts().find((conflict) => conflict.slug === slug);
}

export function reportsForConflict(conflictId: string) {
  const seen = new Set<string>();
  const rows: { incident: Incident; report: NewsReport }[] = [];
  for (const incident of incidentsForConflict(conflictId)) {
    for (const report of incident.reports) {
      if (!report.excerpt && !report.headline) continue;
      const key = report.url || `${report.outlet}:${report.headline}`;
      if (seen.has(key)) continue;
      seen.add(key);
      rows.push({ incident, report });
    }
  }
  return rows.slice(0, 6);
}

export function yearExtent(list: Conflict[] = allConflicts()): { min: number; max: number } {
  let min = 1757;
  let max = 1947;
  for (const conflict of list) {
    const years = conflictYears(conflict);
    min = Math.min(min, years.start);
    max = Math.max(max, years.end);
  }
  return { min, max };
}

export function conflictsVisibleInYear(year: number, list: Conflict[] = conflicts): Conflict[] {
  return list.filter((conflict) => spanActiveInYear(conflict.time, year));
}
