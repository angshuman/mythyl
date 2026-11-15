import actorRows from "@/data/conflicts/actors.json";
import type { Actor } from "./schema";

/** Live actor table. Source of truth: src/data/conflicts/actors.json */
export const actors = actorRows as Actor[];

export const actorById = new Map(actors.map((actor) => [actor.id, actor]));
