/**
 * Permissive conflict schema for post-independence India.
 *
 * Nested on purpose: a "conflict" can be a war, a forty-year insurgency,
 * a three-day riot, or a single incident. Events live under campaigns.
 * Dates and coordinates carry precision. Counts are ranges with sources.
 * Nothing required except id, name, time, and at least one location.
 */

export type DatePrecision =
  | "day"
  | "month"
  | "year"
  | "decade"
  | "unknown";

export type GeoPrecision =
  | "building"
  | "village"
  | "block"
  | "district"
  | "city"
  | "state"
  | "region"
  | "country"
  | "theater"
  | "unknown";

export type Scale = "small" | "medium" | "large";

export type Confidence = "high" | "medium" | "low";

export type RecordStatus = "draft" | "reviewed" | "published";

export type ViolenceDirection =
  | "two-sided"
  | "one-sided"
  | "multi-sided"
  | "unclear";

export type InternalExternal =
  | "internal"
  | "external"
  | "mixed"
  | "transnational";

export type ReligiousDimension =
  | "central"
  | "present"
  | "absent"
  | "contested"
  | "unknown";

export type IdentityDimension =
  | "religion"
  | "ethnicity"
  | "tribe"
  | "caste"
  | "language"
  | "nation"
  | "ideology"
  | "class"
  | "citizenship"
  | "region"
  | "migration";

export type ConflictFamily =
  | "interstate"
  | "integration"
  | "naxal"
  | "naga"
  | "bodo"
  | "northeast"
  | "kashmir"
  | "punjab"
  | "communal"
  | "environment"
  | "external";

export type FamilyDef = {
  id: ConflictFamily;
  label: string;
  color: string;
  hint: string;
  group?: string;
};

export type FamilyGroupDef = {
  id: string;
  label: string;
  color: string;
  hint: string;
};

export type ConflictType =
  | "interstate-war"
  | "border-skirmish"
  | "secessionist-insurgency"
  | "revolutionary-insurgency"
  | "communal-riot"
  | "pogrom"
  | "ethnic-clash"
  | "military-operation"
  | "state-integration"
  | "terrorism"
  | "one-sided-violence"
  | "peace-operation"
  | "agitation-with-violence"
  | "resource-conflict"
  | "other";

export type ResourceStake =
  | "land"
  | "forest"
  | "water"
  | "minerals"
  | "oil-gas"
  | "opium"
  | "tea"
  | "grazing"
  | "trade-route"
  | "border"
  | "citizenship"
  | "autonomy"
  | "language"
  | "religion"
  | "identity"
  | "migration"
  | "jobs"
  | "political-power"
  | "taxation"
  | "other";

export type ActorKind =
  | "state"
  | "state-agency"
  | "military"
  | "paramilitary"
  | "police"
  | "insurgent-group"
  | "militia"
  | "political-party"
  | "foreign-state"
  | "foreign-agency"
  | "tribe"
  | "ethnic-group"
  | "religious-community"
  | "caste-group"
  | "linguistic-group"
  | "civilian-crowd"
  | "corporation"
  | "peace-force"
  | "unknown";

export type ActorRole =
  | "state"
  | "insurgent"
  | "civilian-target"
  | "militia"
  | "mediator"
  | "sponsor"
  | "ally"
  | "splinter"
  | "accused"
  | "victim-community";

export type RelationKind =
  | "previous"
  | "next"
  | "related"
  | "parent"
  | "child"
  | "splinter"
  | "merge"
  | "cause"
  | "consequence"
  | "same-campaign"
  | "ceasefire"
  | "accord"
  | "revenge"
  | "overlapping";

export type SupportKind =
  | "sanctuary"
  | "arms"
  | "training"
  | "funds"
  | "diplomacy"
  | "troops"
  | "intelligence"
  | "alleged"
  | "denied";

export type FuzzyDate = {
  date?: string;
  year?: number;
  month?: number;
  day?: number;
  precision: DatePrecision;
  circa?: boolean;
  note?: string;
};

export type TimeSpan = {
  start: FuzzyDate;
  end?: FuzzyDate | null;
  ongoing?: boolean;
};

export type SourceRef = {
  title: string;
  creator?: string;
  year?: number;
  url?: string;
  dataset?: string;
  page?: string;
  note?: string;
};

export type Estimate = {
  min?: number;
  max?: number;
  best?: number;
  unit: "persons" | "households" | "villages";
  asOf?: FuzzyDate;
  of?: "all" | "civilian" | "combatant" | "security-forces" | "unknown";
  sources: SourceRef[];
  contested: boolean;
  note?: string;
};

export type Harm = {
  killed?: Estimate;
  injured?: Estimate;
  missing?: Estimate;
  displaced?: Estimate;
  refugees?: Estimate;
  sexualViolenceReported?: boolean;
  infrastructure?: string;
  note?: string;
};

export type AdminRef = {
  country?: string;
  countryCode?: string;
  state?: string;
  stateCode?: string;
  district?: string;
  subdivision?: string;
  village?: string;
};

export type GeoLocation = {
  id: string;
  name: string;
  nameLocal?: string;
  kind: "point" | "polygon" | "multipolygon" | "line" | "admin-unit" | "area-approx";
  precision: GeoPrecision;
  longitude?: number;
  latitude?: number;
  geometry?: {
    type: string;
    coordinates: unknown;
  };
  bbox?: [number, number, number, number];
  admin?: AdminRef;
  disputed?: boolean;
  disputedBy?: string[];
  northeast?: boolean;
  note?: string;
};

export type ExternalSupport = {
  actorId?: string;
  state?: string;
  kind: SupportKind;
  period?: TimeSpan;
  contested?: boolean;
  sources?: SourceRef[];
  note?: string;
};

export type Actor = {
  id: string;
  name: string;
  aliases?: string[];
  kind: ActorKind;
  parentId?: string;
  splinterOf?: string[];
  mergedInto?: string;
  ideology?: string[];
  religion?: string[];
  ethnicity?: string[];
  tribes?: string[];
  language?: string[];
  externalSupport?: ExternalSupport[];
  active?: TimeSpan;
};

export type Party = {
  actorId: string;
  role: ActorRole;
  note?: string;
};

export type PeopleRef = {
  name: string;
  kind: "tribe" | "ethnicity" | "religion" | "caste" | "language" | "nationality";
  role?: string;
  note?: string;
};

export type ResourceRef = {
  kind: ResourceStake;
  centrality: "core" | "contributing" | "peripheral";
  note?: string;
};

export type LegalRegime = {
  name: string;
  time?: TimeSpan;
  places?: string[];
  note?: string;
};

export type Accord = {
  name: string;
  date?: FuzzyDate;
  parties: string[];
  outcome?: string;
  sources?: SourceRef[];
};

export type HistoriographyNote = {
  claim: string;
  heldBy?: string;
  sources?: SourceRef[];
};

export type Relation = {
  kind: RelationKind;
  targetId: string;
  note?: string;
};

export type ConflictEvent = {
  id: string;
  name: string;
  time: TimeSpan | FuzzyDate;
  location: GeoLocation;
  types?: ConflictType[];
  summary?: string;
  harm?: Harm;
  actorIds?: string[];
  sources?: SourceRef[];
};

/** A single day or raid inside a campaign — what the map hover is for. */
export type IncidentKind =
  | "attack"
  | "ambush"
  | "bombing"
  | "raid"
  | "massacre"
  | "riot"
  | "air-strike"
  | "operation"
  | "assassination"
  | "clash"
  | "siege"
  | "kidnapping"
  | "other";

export type SideKind =
  | "state-forces"
  | "insurgent"
  | "militia"
  | "civilian"
  | "foreign-forces"
  | "unknown";

export type SideRole = "attacker" | "defender" | "target" | "unclear";

export type IncidentSide = {
  label: string;
  role: SideRole;
  kind: SideKind;
  actorId?: string;
};

export type CasualtyOf =
  | "civilian"
  | "state-forces"
  | "insurgent"
  | "militia"
  | "unknown"
  | "mixed";

export type CasualtyClaim = {
  killedMin?: number;
  killedMax?: number;
  killedBest?: number;
  injuredBest?: number;
  of: CasualtyOf;
  sideLabel: string;
  claimedBy?: string;
  contested: boolean;
  note?: string;
};

export type NewsReport = {
  outlet: string;
  headline: string;
  year?: number;
  url?: string;
  /** Optional article image (og:image). A full clipping is not required. */
  imageUrl?: string;
  excerpt: string;
  stance?: "state" | "insurgent" | "victim" | "independent" | "unknown";
};

export type Incident = {
  id: string;
  conflictId: string;
  name: string;
  kind: IncidentKind;
  time: FuzzyDate;
  place: {
    name: string;
    longitude: number;
    latitude: number;
    precision: GeoPrecision;
    admin?: AdminRef;
  };
  summary: string;
  story?: string;
  sides: IncidentSide[];
  casualties: CasualtyClaim[];
  reports: NewsReport[];
  sources?: SourceRef[];
  confidence: Confidence;
};

export type Phase = {
  id: string;
  name: string;
  time: TimeSpan;
  summary?: string;
  harm?: Harm;
};

export type Visualization = {
  color?: string;
  pulse?: boolean;
  hideUntilZoom?: number;
};

export type Conflict = {
  id: string;
  slug: string;
  name: string;
  aliases?: string[];
  summary: string;
  narrative?: string;
  scale: Scale;
  scaleRationale: string;
  types: ConflictType[];
  /** Larger legend type. Color on the map comes from families.json. */
  family: ConflictFamily;
  theaters: string[];
  northeast: boolean;
  internalExternal: InternalExternal;
  direction: ViolenceDirection;
  religiousDimension: ReligiousDimension;
  identityDimensions: IdentityDimension[];
  resources: ResourceRef[];
  time: TimeSpan;
  phases?: Phase[];
  events?: ConflictEvent[];
  locations: GeoLocation[];
  primaryPoint: {
    longitude: number;
    latitude: number;
    precision: GeoPrecision;
  };
  parties: Party[];
  peoples: PeopleRef[];
  legalRegimes?: LegalRegime[];
  accords?: Accord[];
  harm?: Harm;
  relations?: Relation[];
  historiography?: HistoriographyNote[];
  sources: SourceRef[];
  confidence: Confidence;
  visualization?: Visualization;
  status: RecordStatus;
};

export const THEATERS = [
  "interstate",
  "kashmir",
  "punjab",
  "naxal",
  "northeast",
  "communal",
  "environment",
  "integration",
  "west-india",
  "south-india",
] as const;

export const NORTHEAST_STATES = [
  "Arunachal Pradesh",
  "Assam",
  "Manipur",
  "Meghalaya",
  "Mizoram",
  "Nagaland",
  "Tripura",
  "Sikkim",
] as const;

export const SCALE_GUIDE: Record<Scale, string> = {
  small:
    "Local or short: a district or town, days to months, or a contained militant campaign. Fatalities typically under the low hundreds, or unknown but geographically tight.",
  medium:
    "Multi-district or multi-year: a state-level insurgency phase, a major riot sequence, or a war measured in weeks. Hundreds of deaths, or displacement at scale.",
  large:
    "Theater-defining: interstate war, a national political rupture, or an insurgency spanning decades and multiple states. Often 1,000+ deaths or a peace accord that redrew a map.",
};

/** Internal. Not rendered on the public site. */
export const FIELD_GROUPS: {
  id: string;
  title: string;
  why: string;
  fields: { name: string; need: string }[];
}[] = [
  {
    id: "identity",
    title: "Identity of the record",
    why: "Conflicts are named differently by the state, by militants, and by later scholarship.",
    fields: [
      { name: "id / slug", need: "Stable keys for relations and URLs." },
      { name: "name / aliases", need: "Operation Polo and Hyderabad 1948 are the same event." },
      { name: "summary / narrative", need: "One line for the map; longer text for the panel." },
      { name: "status / confidence", need: "Draft vs reviewed; how sure we are." },
    ],
  },
  {
    id: "scale-type",
    title: "Scale and type",
    why: "UCDP's 25-death war threshold misses Nellie and 1984. We keep a visual scale beside scholarly types.",
    fields: [
      { name: "scale (small / medium / large)", need: "Map encoding. Recodable; rationale is stored." },
      { name: "types[]", need: "War, insurgency, riot, pogrom, operation, terror attack can stack." },
      { name: "family", need: "Legend type and map color: naxal, naga, bodo, northeast, kashmir, punjab, communal, external, interstate, integration." },
      { name: "theaters[]", need: "kashmir, northeast, naxal, communal, interstate…" },
      { name: "northeast", need: "Fast filter for the Northeast section." },
      { name: "direction", need: "Two-sided war vs one-sided killing vs a crowd." },
      { name: "internalExternal", need: "Internal, external, mixed, transnational sanctuary." },
    ],
  },
  {
    id: "time",
    title: "Time",
    why: "Naga independence is claimed in 1947; AFSPA in 1958; ceasefires in the 1990s. Starts are fought over.",
    fields: [
      { name: "time.start / time.end", need: "FuzzyDate with day, month, year, or decade precision." },
      { name: "time.ongoing", need: "Insurgencies that have not formally ended." },
      { name: "circa / note", need: "Contested chronology lives next to the date." },
      { name: "phases[]", need: "A campaign is not one blob of time." },
      { name: "events[]", need: "Thin nested timestamps on the campaign record." },
      { name: "incidents[] (separate table)", need: "Days, raids, massacres: place, sides, killed-by-side, news excerpt. Map hover." },
    ],
  },
  {
    id: "geo",
    title: "Place",
    why: "Zoom to a village when we have it; sit at state centroid when we do not. Never fake precision.",
    fields: [
      { name: "primaryPoint lon/lat", need: "Map marker. Precision field says how seriously to take it." },
      { name: "locations[]", need: "Points, polygons, districts, approximate areas." },
      { name: "geo precision", need: "building → theater. Controls marker size and zoom reveal." },
      { name: "admin hierarchy", need: "Country, state, district, village." },
      { name: "disputed / disputedBy", need: "Kashmir, Aksai Chin, and some border villages." },
      { name: "bbox / geometry", need: "Future polygon overlays and exact zoom." },
    ],
  },
  {
    id: "actors",
    title: "Actors",
    why: "NSCN splits, state agencies, and foreign patrons are first-class, not a sentence.",
    fields: [
      { name: "parties[] (actor + role)", need: "Who fought, who mediated, who was targeted." },
      { name: "actor.kind", need: "State, military, insurgent, tribe, party, foreign state…" },
      { name: "splinterOf / mergedInto / parent", need: "Group genealogy." },
      { name: "externalSupport[]", need: "Sanctuary, arms, training, funds — marked contested when alleged." },
    ],
  },
  {
    id: "peoples",
    title: "Peoples and identity",
    why: "Northeast conflicts are often tribal, linguistic, and about migration at once. Religion is a flag, not the whole story.",
    fields: [
      { name: "peoples[]", need: "Tribe, ethnicity, religion, caste, language, nationality." },
      { name: "identityDimensions[]", need: "Which axes actually matter for this record." },
      { name: "religiousDimension", need: "central / present / absent / contested / unknown." },
    ],
  },
  {
    id: "stakes",
    title: "Stakes and law",
    why: "Land, forest, citizenship, autonomy, and minerals are coded separately from slogans.",
    fields: [
      { name: "resources[] + centrality", need: "What the fight was over, and how core it was." },
      { name: "legalRegimes[]", need: "AFSPA, Disturbed Areas, TADA, POTA, UAPA, Inner Line." },
      { name: "accords[]", need: "Shillong, Mizo, Bodo, Assam Accord, peace deals." },
    ],
  },
  {
    id: "harm",
    title: "Harm",
    why: "A single death count is a political object. Store ranges, who was counted, and who published it.",
    fields: [
      { name: "killed / injured / missing", need: "min, max, best, civilian vs combatant." },
      { name: "displaced / refugees", need: "Often larger than deaths, rarely in war datasets." },
      { name: "contested + sources[]", need: "Every number points at a source." },
      { name: "incident.casualties[]", need: "Who died, which side, who published the figure." },
      { name: "incident.sides[]", need: "Attacker / defender / target, labelled in public language." },
      { name: "incident.reports[]", need: "News or commission excerpt for the hover." },
    ],
  },
  {
    id: "relations",
    title: "Relations",
    why: "Nellie is inside the Assam Movement; 1984 Delhi follows Blue Star; ULFA talks to other valleys.",
    fields: [
      { name: "previous / next", need: "Sequence." },
      { name: "parent / child", need: "Campaign vs incident." },
      { name: "related / overlapping / revenge", need: "Same space, later spark." },
      { name: "ceasefire / accord", need: "Links to deals." },
    ],
  },
  {
    id: "narrative",
    title: "Sources and disagreement",
    why: "Infotainment still has to show that the state, insurgents, and human-rights groups tell different stories.",
    fields: [
      { name: "sources[]", need: "UCDP, ACLED, SATP, books, commissions." },
      { name: "historiography[]", need: "Competing claims, attributed." },
    ],
  },
];

export function yearOf(date: FuzzyDate | undefined | null): number | null {
  if (!date) return null;
  if (typeof date.year === "number") return date.year;
  if (date.date) {
    const y = Number(date.date.slice(0, 4));
    return Number.isFinite(y) ? y : null;
  }
  return null;
}

export function spanActiveInYear(span: TimeSpan, year: number): boolean {
  const start = yearOf(span.start);
  if (start != null && year < start) return false;
  if (span.ongoing) return start == null || year >= start;
  const end = yearOf(span.end ?? undefined);
  if (end == null) return start == null || year >= start;
  return year <= end;
}

export function conflictYears(conflict: Conflict): { start: number; end: number } {
  const start = yearOf(conflict.time.start) ?? 1947;
  const end = conflict.time.ongoing
    ? new Date().getFullYear()
    : yearOf(conflict.time.end ?? undefined) ?? start;
  return { start, end };
}
