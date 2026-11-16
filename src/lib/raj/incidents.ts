import incidentsConquest from "@/data/raj/incidents-conquest.json";
import incidentsRevolt from "@/data/raj/incidents-revolt.json";
import incidentsAgitation from "@/data/raj/incidents-agitation.json";
import incidentsWars from "@/data/raj/incidents-wars.json";
import incidentsTribal from "@/data/raj/incidents-tribal.json";
import incidentsFamine from "@/data/raj/incidents-famine.json";
import incidentsEndgame from "@/data/raj/incidents-endgame.json";
import incidentsRevolution from "@/data/raj/incidents-revolution.json";
import type { Incident } from "./schema";

export const incidents = [
  ...incidentsConquest,
  ...incidentsRevolt,
  ...incidentsAgitation,
  ...incidentsWars,
  ...incidentsTribal,
  ...incidentsFamine,
  ...incidentsEndgame,
  ...incidentsRevolution,
] as Incident[];
