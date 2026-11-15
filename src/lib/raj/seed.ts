import campaignsConquest from "@/data/raj/campaigns-conquest.json";
import campaignsRevolt from "@/data/raj/campaigns-revolt.json";
import campaignsAgitation from "@/data/raj/campaigns-agitation.json";
import type { Conflict } from "./schema";

export const conflicts = [
  ...campaignsConquest,
  ...campaignsRevolt,
  ...campaignsAgitation,
] as Conflict[];

export const YEAR_MIN = 1757;
export const YEAR_MAX = 1947;
