import incidentRows from "@/data/conflicts/incidents.json";
import naxalEvents from "@/data/conflicts/naxal-events.json";
import type { Incident } from "./schema";

/** Live day records. Research drops (naxal-events.json) append without rewriting the main table. */
export const incidents = [...incidentRows, ...naxalEvents] as Incident[];
