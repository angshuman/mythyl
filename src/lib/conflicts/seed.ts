import campaigns from "@/data/conflicts/campaigns.json";
import campaignsEast from "@/data/conflicts/campaigns-east.json";
import campaignsNe from "@/data/conflicts/campaigns-ne.json";
import campaignsNorth from "@/data/conflicts/campaigns-north.json";
import campaignsSouth from "@/data/conflicts/campaigns-south.json";
import type { Conflict } from "./schema";

/** Live campaign records. Research drops append without rewriting the main table. */
export const conflicts = [
  ...campaigns,
  ...campaignsNorth,
  ...campaignsSouth,
  ...campaignsEast,
  ...campaignsNe,
] as Conflict[];

export const YEAR_MIN = 1947;
export const YEAR_MAX = new Date().getFullYear();
