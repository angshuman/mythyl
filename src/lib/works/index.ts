import essayRows from "@/data/works/essays.json";
import kindRows from "@/data/works/kinds.json";
import metaRow from "@/data/works/meta.json";
import projectRows from "@/data/works/projects.json";
import type { KindDef, WorkCommission, WorkEssay, WorkKind, WorkProject, WorkScale, WorksMeta } from "./schema";

export * from "./schema";

export const PROJECTS = projectRows as WorkProject[];
export const KINDS = kindRows as KindDef[];
export const ESSAYS = essayRows as WorkEssay[];
export const META = metaRow as WorksMeta;

export const YEAR_MIN = 1947;
export const YEAR_MAX = new Date().getFullYear();

export const KIND_BY_ID = new Map(KINDS.map((kind) => [kind.id, kind]));

export type WorkEra = {
  id: string;
  label: string;
  start: number;
  end: number;
  hint: string;
};

export const ERAS: WorkEra[] = [
  { id: "all", label: "All years", start: 1947, end: 2100, hint: "Every project on the map" },
  { id: "nehru", label: "1947–64", start: 1947, end: 1964, hint: "River valleys, steel towns, first campuses" },
  { id: "plan", label: "1965–90", start: 1965, end: 1990, hint: "Heavy plants, nuclear, metros begin" },
  { id: "open", label: "1991–2004", start: 1991, end: 2004, hint: "Ports, Konkan Railway, first expressways" },
  { id: "now", label: "2005–now", start: 2005, end: 2100, hint: "Highways, metros, solar, Himalayan links" },
];

export const SCALE_LABEL: Record<WorkScale, string> = {
  landmark: "landmark",
  trunk: "trunk",
  civic: "civic",
};

export const SCALE_SIZE: Record<WorkScale, number> = {
  landmark: 18,
  trunk: 14,
  civic: 11,
};

export function allProjects(): WorkProject[] {
  return PROJECTS;
}

export function projectById(id: string): WorkProject | undefined {
  return PROJECTS.find((project) => project.id === id);
}

export function kindOf(project: WorkProject): KindDef {
  return KIND_BY_ID.get(project.kind) ?? { id: project.kind, label: project.kind, color: "#cbb89a" };
}

export function kindColor(kind: WorkKind): string {
  return KIND_BY_ID.get(kind)?.color ?? "#cbb89a";
}

export function yearOf(project: WorkProject): number {
  return project.opened ?? project.started ?? YEAR_MIN;
}

export function commissionsOf(project: WorkProject): WorkCommission[] {
  return project.commissions ?? [];
}

export function lastCommissionYear(project: WorkProject): number | undefined {
  const years = commissionsOf(project).map((row) => row.year);
  if (years.length === 0) return undefined;
  return Math.max(...years);
}

export function spanStart(project: WorkProject): number {
  return project.started ?? project.opened ?? YEAR_MIN;
}

export function spanEnd(project: WorkProject): number {
  if (project.status === "ongoing" || project.status === "stalled") return YEAR_MAX;
  const firstEnd = project.opened ?? spanStart(project);
  const last = lastCommissionYear(project);
  return last && last > firstEnd ? last : firstEnd;
}

export function packSpans(items: { id: string; start: number; end: number }[]): Map<string, number> {
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

export function inEra(project: WorkProject, era: WorkEra): boolean {
  if (era.id === "all") return true;
  return spanStart(project) <= era.end && spanEnd(project) >= era.start;
}

export function projectsForKind(kind: WorkKind): WorkProject[] {
  return PROJECTS.filter((project) => project.kind === kind).sort((a, b) => yearOf(a) - yearOf(b));
}

export function formatYears(project: WorkProject): string {
  const last = lastCommissionYear(project);
  if (project.started && project.opened && project.opened !== project.started) {
    if (last && last > project.opened) return `${project.started}–${project.opened} · ${last}`;
    return `${project.started}–${project.opened}`;
  }
  if (project.status === "ongoing") return `${project.started ?? project.opened ?? ""}–`;
  if (project.status === "stalled") return `${project.started ?? ""}–stalled`;
  const first = String(project.opened ?? project.started ?? "");
  if (last && project.opened && last > project.opened) return `${first} · ${last}`;
  return first;
}
