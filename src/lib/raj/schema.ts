/**
 * Ontology for Company-to-Crown force on the subcontinent, 1757–1947.
 * Nested on purpose. Counts are ranges with sources. Nothing required
 * except id, name, time, and at least one location.
 */

export type DatePrecision = "day" | "month" | "year" | "decade" | "unknown";

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
export type ViolenceDirection = "two-sided" | "one-sided" | "multi-sided" | "unclear";
export type InternalExternal = "internal" | "external" | "mixed" | "transnational";
export type ReligiousDimension = "central" | "present" | "absent" | "contested" | "unknown";
export type Rule = "company" | "crown";

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
  | "conquest"
  | "annexation"
  | "revolt"
  | "tribal"
  | "peasant"
  | "massacre"
  | "agitation"
  | "famine"
  | "penal";

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
  | "colonial-war"
  | "annexation"
  | "peasant-rising"
  | "tribal-rising"
  | "mutiny"
  | "massacre"
  | "famine"
  | "penal"
  | "agitation-with-violence"
  | "military-operation"
  | "one-sided-violence"
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
  bbox?: [number, number, number, number];
  admin?: AdminRef;
  disputed?: boolean;
  disputedBy?: string[];
  note?: string;
};

export type Actor = {
  id: string;
  name: string;
  aliases?: string[];
  kind: ActorKind;
  parentId?: string;
  ideology?: string[];
  religion?: string[];
  ethnicity?: string[];
  tribes?: string[];
  language?: string[];
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
  | "execution"
  | "mutiny"
  | "famine"
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

export type CasualtyOf = "civilian" | "state-forces" | "insurgent" | "militia" | "unknown" | "mixed";

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
  family: ConflictFamily;
  theaters: string[];
  northeast: boolean;
  rule: Rule;
  internalExternal: InternalExternal;
  direction: ViolenceDirection;
  religiousDimension: ReligiousDimension;
  identityDimensions: IdentityDimension[];
  resources: ResourceRef[];
  time: TimeSpan;
  locations: GeoLocation[];
  primaryPoint: {
    longitude: number;
    latitude: number;
    precision: GeoPrecision;
  };
  parties: Party[];
  peoples: PeopleRef[];
  legalRegimes?: LegalRegime[];
  harm?: Harm;
  relations?: Relation[];
  historiography?: HistoriographyNote[];
  sources: SourceRef[];
  confidence: Confidence;
  visualization?: Visualization;
  status: RecordStatus;
};

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
  const start = yearOf(conflict.time.start) ?? 1757;
  const end = conflict.time.ongoing
    ? 1947
    : yearOf(conflict.time.end ?? undefined) ?? start;
  return { start, end };
}
