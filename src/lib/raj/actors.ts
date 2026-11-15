import actorRows from "@/data/raj/actors.json";
import type { Actor } from "./schema";

export const actors = actorRows as Actor[];
export const actorById = new Map(actors.map((actor) => [actor.id, actor]));
