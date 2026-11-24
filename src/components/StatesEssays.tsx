import { ESSAYS, EVENTS, STATES } from "@/lib/states";

export function StatesEssays() {
  return (
    <div id="essays">
      {ESSAYS.map((essay) => {
        const rows =
          essay.id === "income"
            ? [...STATES].filter((s) => s.series.some((p) => p.perCapitaRs != null)).sort((a, b) => (b.series.find((p) => p.perCapitaRs)?.perCapitaRs ?? 0) - (a.series.find((p) => p.perCapitaRs)?.perCapitaRs ?? 0)).slice(0, 8)
            : essay.id === "survival"
              ? [...STATES].filter((s) => s.series.some((p) => p.imr != null)).sort((a, b) => (b.series.find((p) => p.year === 2020 && p.imr != null)?.imr ?? 0) - (a.series.find((p) => p.year === 2020 && p.imr != null)?.imr ?? 0)).slice(0, 8)
              : EVENTS.filter((event) =>
                  essay.id === "reorganisation"
                    ? event.kind === "demographic" || event.id.includes("reorgan") || event.id.includes("telangana") || event.id.includes("jk")
                    : essay.id === "politics"
                      ? event.scale === "union"
                      : true,
                ).slice(0, 10);
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
                {rows.map((row) =>
                  "geoName" in row ? (
                    <li key={row.id}>
                      <b>{row.name}</b>
                      <span>{row.formed ?? ""}</span>
                    </li>
                  ) : (
                    <li key={row.id}>
                      <b>{row.name}</b>
                      <span>{row.year}</span>
                    </li>
                  ),
                )}
              </ol>
            </div>
          </section>
        );
      })}
    </div>
  );
}
