import essayRows from "@/data/works/essays.json";
import kindRows from "@/data/works/kinds.json";
import metaRow from "@/data/works/meta.json";
import projectRows from "@/data/works/projects.json";
import type { KindDef, WorkEssay, WorkKind, WorkProject, WorkScale, WorksMeta } from "./schema";

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

export function inEra(project: WorkProject, era: WorkEra): boolean {
  if (era.id === "all") return true;
  const start = project.started ?? project.opened ?? YEAR_MIN;
  const end = project.status === "ongoing" || project.status === "stalled" ? YEAR_MAX : (project.opened ?? start);
  return start <= era.end && end >= era.start;
}

export function projectsForKind(kind: WorkKind): WorkProject[] {
  return PROJECTS.filter((project) => project.kind === kind).sort((a, b) => yearOf(a) - yearOf(b));
}

export function formatYears(project: WorkProject): string {
  if (project.started && project.opened && project.opened !== project.started) {
    return `${project.started}–${project.opened}`;
  }
  if (project.status === "ongoing") return `${project.started ?? project.opened ?? ""}–`;
  if (project.status === "stalled") return `${project.started ?? ""}–stalled`;
  return String(project.opened ?? project.started ?? "");
}
