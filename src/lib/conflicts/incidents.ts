import incidentRows from "@/data/conflicts/incidents.json";
import naxalEvents from "@/data/conflicts/naxal-events.json";
import eastEvents from "@/data/conflicts/east-events.json";
import environmentEvents from "@/data/conflicts/environment-events.json";
import neEvents from "@/data/conflicts/ne-events.json";
import northEvents from "@/data/conflicts/north-events.json";
import southEvents from "@/data/conflicts/south-events.json";
import type { Incident } from "./schema";

/** Live day records. Research drops append without rewriting the main table. */
export const incidents = [
  ...incidentRows,
  ...naxalEvents,
  ...northEvents,
  ...southEvents,
  ...eastEvents,
  ...neEvents,
  ...environmentEvents,
] as Incident[];
