export type WorkKind =
  | "dam"
  | "irrigation"
  | "steel"
  | "plant"
  | "port"
  | "road"
  | "rail"
  | "metro"
  | "power"
  | "nuclear"
  | "space"
  | "campus"
  | "bridge"
  | "airport"
  | "city"
  | "water";

export type WorkScale = "landmark" | "trunk" | "civic";

export type WorkStatus = "open" | "ongoing" | "stalled" | "closed";

export type SourceRef = {
  title: string;
  url: string;
  year?: number;
};

export type KindDef = {
  id: WorkKind;
  label: string;
  color: string;
};

export type WorkProject = {
  id: string;
  name: string;
  kind: WorkKind;
  scale: WorkScale;
  started?: number;
  opened?: number;
  status: WorkStatus;
  place: {
    longitude: number;
    latitude: number;
    label: string;
    precision: "site" | "city" | "district" | "corridor";
  };
  states: string[];
  path?: { longitude: number; latitude: number }[] | null;
  summary: string;
  displacement?: { note: string; sources: string[] };
  sources: SourceRef[];
};

export type WorkEssay = {
  id: string;
  title: string;
  kicker: string;
  color: string;
  paragraphs: [string, string];
};

export type WorksMeta = {
  span: string;
  attribution: string;
  comparability: string;
  sources: SourceRef[];
};
