import { readFile } from "node:fs/promises";
import path from "node:path";
import { kindColor, PROJECTS } from "@/lib/works";
import { LANDING_VIEW, projectLanding } from "@/lib/geo";

const SHOW = new Set([
  "bhakra-nangal",
  "hirakud",
  "bhilai-steel",
  "tarapur",
  "golden-quadrilateral",
  "delhi-metro",
  "konkan-railway",
  "sriharikota",
  "iit-kharagpur",
  "chandigarh",
  "jnpt",
  "sardar-sarovar",
  "chenab-bridge",
  "bhadla-solar",
  "igi-t3",
  "bogibeel",
]);

export async function WorksMark() {
  const svg = await readFile(
    path.join(process.cwd(), "public/geo/india-silhouette.svg"),
    "utf8",
  );

  return (
    <div className="works-mark" aria-hidden="true">
      <div className="works-mark-svg" dangerouslySetInnerHTML={{ __html: svg }} />
      <svg className="works-mark-dots" viewBox={`0 0 ${LANDING_VIEW.width} ${LANDING_VIEW.height}`}>
        {PROJECTS.filter((project) => SHOW.has(project.id)).map((project, index) => {
          const { x, y } = projectLanding(project.place.longitude, project.place.latitude);
          const r = project.scale === "landmark" ? 4.4 : project.scale === "trunk" ? 3.2 : 2.4;
          return (
            <circle
              key={project.id}
              cx={x}
              cy={y}
              r={r}
              fill={kindColor(project.kind)}
              style={{ animationDelay: `${1.45 + index * 0.07}s` }}
            />
          );
        })}
      </svg>
    </div>
  );
}
