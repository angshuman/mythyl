export type PartyFamily =
  | "congress"
  | "janata"
  | "nda"
  | "upa"
  | "left"
  | "regional"
  | "other";

export type StateRegion =
  | "north"
  | "hindi-belt"
  | "west"
  | "south"
  | "east"
  | "northeast"
  | "islands";

export type EventScale = "union" | "state" | "local";

export type EventKind =
  | "policy"
  | "reform"
  | "famine"
  | "epidemic"
  | "disaster"
  | "movement"
  | "fiscal"
  | "demographic";

export type SourceRef = {
  title: string;
  url: string;
  year?: number;
};

export type SeriesPoint = {
  year: number;
  perCapitaRs?: number;
  gsdpCr?: number;
  price?: "current" | "2011-12";
  imr?: number;
  u5mr?: number;
  incomeSource?: string;
  mortalitySource?: string;
};

export type CmSpell = {
  start: number;
  end?: number | null;
  cm: string;
  party: string;
  partyFamily: PartyFamily;
};

export type IndianState = {
  id: string;
  name: string;
  geoName: string;
  region: StateRegion;
  formed?: number;
  note?: string;
  center: { longitude: number; latitude: number };
  series: SeriesPoint[];
  politics: CmSpell[];
  split?: { id: string; from: number; label: string; series: SeriesPoint[] }[];
};

export type UnionTerm = {
  start: number;
  end?: number | null;
  name: string;
  party: string;
  partyFamily: PartyFamily;
};

export type StateEvent = {
  id: string;
  name: string;
  year: number;
  scale: EventScale;
  kind: EventKind;
  states: string[];
  summary: string;
  sources: SourceRef[];
};

export type StateEssay = {
  id: string;
  title: string;
  kicker: string;
  color: string;
  paragraphs: [string, string];
};

export type StatesMeta = {
  span: string;
  attribution: string;
  comparability: string;
  years: number[];
  sources: SourceRef[];
};
