import { essayConflicts, essayYears, ESSAYS } from "@/lib/conflicts";

export function ConflictEssays() {
  return (
    <div id="essays">
      {ESSAYS.map((essay) => {
        const rows = essayConflicts(essay);
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
                {rows.map((conflict) => (
                  <li key={conflict.id}>
                    <b>{conflict.name}</b>
                    <span>{essayYears(conflict)}</span>
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
