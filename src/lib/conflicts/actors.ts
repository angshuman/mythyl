import actorRows from "@/data/conflicts/actors.json";
import actorsEast from "@/data/conflicts/actors-east.json";
import actorsEnvironment from "@/data/conflicts/actors-environment.json";
import actorsNe from "@/data/conflicts/actors-ne.json";
import actorsNorth from "@/data/conflicts/actors-north.json";
import actorsSouth from "@/data/conflicts/actors-south.json";
import type { Actor } from "./schema";

/** Live actor table. Research drops append without rewriting the main table. */
export const actors = [
  ...actorRows,
  ...actorsNorth,
  ...actorsSouth,
  ...actorsEast,
  ...actorsNe,
  ...actorsEnvironment,
] as Actor[];

export const actorById = new Map(actors.map((actor) => [actor.id, actor]));
