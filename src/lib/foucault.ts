import taxonomy from "@/data/foucault/taxonomy.json";

export type FoucaultMark = {
  id: string;
  line: string;
  /** Short theory label for the diagram leaf. Falls back to a clipped line. */
  label?: string;
  source: string;
  gloss: string;
};

export type FoucaultCategory = {
  id: string;
  title: string;
  marks: FoucaultMark[];
};

export type FoucaultTaxonomy = {
  origin: string;
  span: string;
  kicker: string;
  categories: FoucaultCategory[];
};

export const FOUCAULT = taxonomy as FoucaultTaxonomy;

/** How much of the public Foucault this line has to carry. */
export function syllabusGravity(mark: FoucaultMark): number {
  const src = mark.source;
  let weight = 1.4;
  if (/Discipline and Punish/.test(src)) weight = 3;
  else if (/History of Sexuality I.III/.test(src)) weight = 1.7;
  else if (/History of Sexuality I/.test(src)) weight = 3;
  else if (/Archaeology of Knowledge/.test(src)) weight = 2.2;
  else if (/Order of Things/.test(src)) weight = 2.2;
  else if (/Order of Discourse/.test(src)) weight = 2.1;
  else if (/What Is an Author/.test(src)) weight = 2;
  else if (/Birth of the Clinic|History of Madness/.test(src)) weight = 2;
  else if (/Society Must Be Defended|Security, Territory|Birth of Biopolitics/.test(src)) weight = 2;
  else if (/Nietzsche, Genealogy/.test(src)) weight = 1.9;
  else if (/Power\/Knowledge/.test(src)) weight = 2.4;
  else if (/Times Higher|industrialised/.test(src)) weight = 1.9;
  else if (/Groupe d’information|History of Systems of Thought|Collège de France/.test(src)) weight = 1.8;
  else if (/Care of the Self|Use of Pleasure|Hermeneutics|Courage of Truth|Subject and Power/.test(src))
    weight = 1.35;
  else if (/Iranians|1978/.test(src)) weight = 1.55;
  else if (/Infamous Men|University of Tunis|Paris-VIII/.test(src)) weight = 1.45;

  if (
    /panopticon|body-visible|cite-pk|cite-the|sex-repress|disc-face|disc-sand|power-yes|power-makes|know-episteme/.test(
      mark.id,
    )
  ) {
    weight += 0.55;
  }
  return weight;
}

export function categoryGravity(category: FoucaultCategory): number {
  return category.marks.reduce((sum, mark) => sum + syllabusGravity(mark), 0);
}
