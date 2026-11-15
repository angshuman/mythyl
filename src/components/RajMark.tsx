import { readFile } from "node:fs/promises";
import path from "node:path";
import { conflicts, familyColor } from "@/lib/raj";
import { RAJ_LANDING_VIEW, projectRajLanding } from "@/lib/geo";

export async function RajMark() {
  const svg = await readFile(
    path.join(process.cwd(), "public/geo/south-asia-silhouette.svg"),
    "utf8",
  );

  return (
    <div className="raj-mark" aria-hidden="true">
      <div className="raj-mark-svg" dangerouslySetInnerHTML={{ __html: svg }} />
      <svg
        className="raj-mark-dots"
        viewBox={`0 0 ${RAJ_LANDING_VIEW.width} ${RAJ_LANDING_VIEW.height}`}
      >
        {conflicts.map((conflict, index) => {
          const { x, y } = projectRajLanding(
            conflict.primaryPoint.longitude,
            conflict.primaryPoint.latitude,
          );
          const color = familyColor(conflict);
          const famine = conflict.family === "famine";
          const r = famine
            ? conflict.scale === "large"
              ? 7.2
              : 5.4
            : conflict.scale === "large"
              ? 4.4
              : conflict.scale === "medium"
                ? 3.2
                : 2.4;
          return (
            <circle
              key={conflict.id}
              cx={x}
              cy={y}
              r={r}
              fill={famine ? "none" : color}
              stroke={famine ? color : "none"}
              strokeWidth={famine ? 1.5 : 0}
              style={{ animationDelay: `${1.4 + index * 0.06}s` }}
            />
          );
        })}
      </svg>
    </div>
  );
}
