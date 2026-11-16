import campaignsConquest from "@/data/raj/campaigns-conquest.json";
import campaignsRevolt from "@/data/raj/campaigns-revolt.json";
import campaignsAgitation from "@/data/raj/campaigns-agitation.json";
import campaignsWars from "@/data/raj/campaigns-wars.json";
import campaignsTribal from "@/data/raj/campaigns-tribal.json";
import campaignsFamine from "@/data/raj/campaigns-famine.json";
import campaignsEndgame from "@/data/raj/campaigns-endgame.json";
import campaignsRevolution from "@/data/raj/campaigns-revolution.json";
import type { Conflict } from "./schema";

export const conflicts = [
  ...campaignsConquest,
  ...campaignsRevolt,
  ...campaignsAgitation,
  ...campaignsWars,
  ...campaignsTribal,
  ...campaignsFamine,
  ...campaignsEndgame,
  ...campaignsRevolution,
] as Conflict[];

export const YEAR_MIN = 1757;
export const YEAR_MAX = 1947;
