import { readFile } from "node:fs/promises";
import path from "node:path";
import { conflicts, SCALE_COLOR } from "@/lib/conflicts";
import { LANDING_VIEW, projectLanding } from "@/lib/geo";

export async function IndiaMark() {
  const svg = await readFile(
    path.join(process.cwd(), "public/geo/india-silhouette.svg"),
    "utf8",
  );

  return (
    <div className="india-mark" aria-hidden="true">
      <div
        className="india-mark-svg"
        dangerouslySetInnerHTML={{ __html: svg }}
      />
      <svg
        className="india-mark-dots"
        viewBox={`0 0 ${LANDING_VIEW.width} ${LANDING_VIEW.height}`}
      >
        {conflicts.map((conflict, index) => {
          const { x, y } = projectLanding(
            conflict.primaryPoint.longitude,
            conflict.primaryPoint.latitude,
          );
          return (
            <circle
              key={conflict.id}
              cx={x}
              cy={y}
              r={conflict.scale === "large" ? 4.2 : conflict.scale === "medium" ? 3.2 : 2.4}
              fill={SCALE_COLOR[conflict.scale]}
              style={{ animationDelay: `${1.6 + index * 0.08}s` }}
            />
          );
        })}
      </svg>
    </div>
  );
}
