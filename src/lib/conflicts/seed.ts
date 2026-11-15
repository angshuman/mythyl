import campaigns from "@/data/conflicts/campaigns.json";
import type { Conflict } from "./schema";

/** Live campaign records. Source of truth: src/data/conflicts/campaigns.json */
export const conflicts = campaigns as Conflict[];

export const YEAR_MIN = 1947;
export const YEAR_MAX = new Date().getFullYear();
