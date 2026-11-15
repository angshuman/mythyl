import incidentsConquest from "@/data/raj/incidents-conquest.json";
import incidentsRevolt from "@/data/raj/incidents-revolt.json";
import incidentsAgitation from "@/data/raj/incidents-agitation.json";
import type { Incident } from "./schema";

export const incidents = [
  ...incidentsConquest,
  ...incidentsRevolt,
  ...incidentsAgitation,
] as Incident[];
