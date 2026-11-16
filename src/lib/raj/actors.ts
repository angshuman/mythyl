import actorRows from "@/data/raj/actors.json";
import actorsWars from "@/data/raj/actors-wars.json";
import actorsTribal from "@/data/raj/actors-tribal.json";
import actorsFamine from "@/data/raj/actors-famine.json";
import actorsEndgame from "@/data/raj/actors-endgame.json";
import actorsRevolution from "@/data/raj/actors-revolution.json";
import type { Actor } from "./schema";

export const actors = [
  ...actorRows,
  ...actorsWars,
  ...actorsTribal,
  ...actorsFamine,
  ...actorsEndgame,
  ...actorsRevolution,
] as Actor[];
export const actorById = new Map(actors.map((actor) => [actor.id, actor]));
