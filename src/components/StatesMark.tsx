import { readFile } from "node:fs/promises";
import path from "node:path";
import { colorForImr, imrExtent, imrOf, STATES } from "@/lib/states";
import { LANDING_VIEW, projectLanding } from "@/lib/geo";

export async function StatesMark() {
  const svg = await readFile(
    path.join(process.cwd(), "public/geo/india-silhouette.svg"),
    "utf8",
  );
  const { min, max } = imrExtent(2020);

  return (
    <div className="states-mark" aria-hidden="true">
      <div className="states-mark-svg" dangerouslySetInnerHTML={{ __html: svg }} />
      <svg className="states-mark-dots" viewBox={`0 0 ${LANDING_VIEW.width} ${LANDING_VIEW.height}`}>
        {STATES.filter((state) => imrOf(state, 2020) != null).map((state, index) => {
          const { x, y } = projectLanding(state.center.longitude, state.center.latitude);
          const imr = imrOf(state, 2020) as number;
          return (
            <circle
              key={state.id}
              cx={x}
              cy={y}
              r={imr > 30 ? 4.2 : imr > 15 ? 3.2 : 2.4}
              fill={colorForImr(imr, min, max)}
              style={{ animationDelay: `${1.5 + index * 0.04}s` }}
            />
          );
        })}
      </svg>
    </div>
  );
}
