import { ESSAYS, KINDS, projectsForKind, yearOf } from "@/lib/works";
import type { WorkKind } from "@/lib/works";

const MATCH: Record<string, WorkKind[]> = {
  plans: ["dam", "campus"],
  dams: ["dam", "irrigation", "water"],
  steel: ["steel", "plant", "port"],
  corridors: ["road", "rail", "metro", "bridge"],
  energy: ["nuclear", "power", "space"],
  after1991: ["airport", "city", "road"],
};

export function WorksEssays() {
  return (
    <div id="essays">
      {ESSAYS.map((essay) => {
        const kinds = MATCH[essay.id] ?? KINDS.map((k) => k.id);
        const rows = kinds.flatMap((kind) => projectsForKind(kind)).sort((a, b) => yearOf(a) - yearOf(b));
        return (
          <section key={essay.id} className="section" id={essay.id}>
            <div className="essay-grid">
              <div>
                <p className="map-kicker">
                  <i
                    style={{
                      display: "inline-block",
                      width: "0.48rem",
                      height: "0.48rem",
                      borderRadius: "99px",
                      background: essay.color,
                      marginRight: "0.45rem",
                      verticalAlign: "middle",
                    }}
                  />
                  {essay.kicker}
                </p>
                <h2>{essay.title}</h2>
                {essay.paragraphs.map((paragraph) => (
                  <p key={paragraph.slice(0, 48)}>{paragraph}</p>
                ))}
              </div>
              <ol className="essay-list">
                {rows.slice(0, 12).map((project) => (
                  <li key={project.id}>
                    <b>{project.name}</b>
                    <span>{project.opened ?? project.started ?? ""}</span>
                  </li>
                ))}
              </ol>
            </div>
          </section>
        );
      })}
    </div>
  );
}
