"use client";

import { useEffect, useId, useMemo, useState } from "react";
import {
  categoryGravity,
  syllabusGravity,
  type FoucaultCategory,
  type FoucaultMark,
  type FoucaultTaxonomy,
} from "@/lib/foucault";

const SHORT: Record<string, string> = {
  power: "Power",
  knowledge: "Knowledge",
  body: "Body",
  discourse: "Discourse",
  history: "History",
  sex: "Sex",
  self: "Self",
  citation: "Citation",
};

const STROKES = ["#cbb89a", "#8f5a4a", "#b79a72", "#7f4540", "#d4c3a5", "#6b5344", "#b9896a", "#9a7d5c"];

const CX = 800;
const Y0 = 28;
const Y1 = 792;
const SPLIT = 200;
const LEAF = 418;
const VB_W = 1600;
const VB_H = 820;

type Fiber = {
  mark: FoucaultMark;
  path: string;
  width: number;
  x: number;
  y: number;
  side: 1 | -1;
};

type Bundle = {
  category: FoucaultCategory;
  color: string;
  trunk: string;
  trunkWidth: number;
  labelX: number;
  labelY: number;
  fibers: Fiber[];
};

function clipLine(line: string, max = 46): string {
  if (line.length <= max) return line;
  const slice = line.slice(0, max - 1);
  const cut = slice.lastIndexOf(" ");
  return `${slice.slice(0, cut > 28 ? cut : max - 1)}…`;
}

function layoutBundles(categories: FoucaultCategory[]): Bundle[] {
  const mid = Math.ceil(categories.length / 2);
  const sides: { rows: FoucaultCategory[]; side: 1 | -1 }[] = [
    { rows: categories.slice(0, mid), side: -1 },
    { rows: categories.slice(mid), side: 1 },
  ];
  const bundles: Bundle[] = [];
  const gap = 22;

  for (const { rows, side } of sides) {
    const weights = rows.map((row) => categoryGravity(row));
    const total = weights.reduce((sum, value) => sum + value, 0);
    const span = Y1 - Y0 - gap * Math.max(0, rows.length - 1);
    let cursor = Y0;
    rows.forEach((row, index) => {
      const height = (weights[index] / total) * span;
      const yTop = cursor;
      const yBot = cursor + height;
      const yC = (yTop + yBot) / 2;
      cursor += height + gap;

      const color = STROKES[categories.indexOf(row)] ?? STROKES[0];
      const fibers: Fiber[] = [];
      const inner = height - 6;
      const markGap = inner / Math.max(1, row.marks.length);
      const originY = (Y0 + Y1) / 2;
      const x0 = CX + side * 8;
      const xSplit = CX + side * SPLIT;
      const xLeaf = CX + side * LEAF;

      row.marks.forEach((mark, markIndex) => {
        const yLeaf = yTop + 4 + markGap * (markIndex + 0.5);
        const t = row.marks.length === 1 ? 0.5 : markIndex / (row.marks.length - 1);
        const bulge = 40 + Math.abs(t - 0.5) * 110;
        const c2x = xLeaf - side * 64;
        const c1y = yC + (yLeaf - yC) * 0.05;
        const path = `M${xSplit.toFixed(1)} ${yC.toFixed(1)} C${(xSplit + side * bulge).toFixed(1)} ${c1y.toFixed(1)}, ${c2x.toFixed(1)} ${yLeaf.toFixed(1)}, ${xLeaf.toFixed(1)} ${yLeaf.toFixed(1)}`;
        fibers.push({
          mark,
          path,
          width: 0.9 + syllabusGravity(mark) * 1.35,
          x: xLeaf,
          y: yLeaf,
          side,
        });
      });

      const trunkWidth = fibers.reduce((sum, fiber) => sum + fiber.width, 0) * 0.55;
      const trunk = `M${x0.toFixed(1)} ${originY.toFixed(1)} C${(CX + side * 56).toFixed(1)} ${(originY + (yC - originY) * 0.18).toFixed(1)}, ${(CX + side * 128).toFixed(1)} ${yC.toFixed(1)}, ${xSplit.toFixed(1)} ${yC.toFixed(1)}`;

      bundles.push({
        category: row,
        color,
        trunk,
        trunkWidth: Math.max(5.5, trunkWidth),
        labelX: CX + side * (SPLIT - 4),
        labelY: yC - 14,
        fibers,
      });
    });
  }
  return bundles;
}

export function FoucaultLobes({ data }: { data: FoucaultTaxonomy }) {
  const trayId = useId();
  const [ready, setReady] = useState(false);
  const [hot, setHot] = useState<string | null>(null);
  const [pinned, setPinned] = useState<string | null>(null);
  const bundles = useMemo(() => layoutBundles(data.categories), [data.categories]);

  useEffect(() => {
    const frame = requestAnimationFrame(() => setReady(true));
    return () => cancelAnimationFrame(frame);
  }, []);

  const currentId = pinned ?? hot;
  let current: { category: FoucaultCategory; mark: FoucaultMark } | null = null;
  for (const bundle of bundles) {
    const mark = bundle.fibers.find((fiber) => fiber.mark.id === currentId)?.mark;
    if (mark) {
      current = { category: bundle.category, mark };
      break;
    }
    if (currentId === bundle.category.id) {
      current = { category: bundle.category, mark: bundle.category.marks[0] };
      break;
    }
  }

  return (
    <section
      className="foucault-lobes"
      data-ready={ready ? "true" : "false"}
      data-filled={current ? "true" : "false"}
      onMouseLeave={() => setHot(null)}
    >
      <header className="foucault-origin">
        <span className="foucault-bindu" aria-hidden="true" />
        <p className="foucault-span">{data.span}</p>
        <h1 className="foucault-thesis">{data.origin}</h1>
        <p className="foucault-gravity-note">
          Stroke weight is syllabus gravity: how much of the public Foucault the line has to carry.
          Discipline and Punish and History of Sexuality I run thick. The late ethics, thinner. The
          panopticon still takes more ink than it earned in brick.
        </p>
      </header>

      <svg
        className="foucault-lobes-svg"
        viewBox={`0 0 ${VB_W} ${VB_H}`}
        role="img"
        aria-label="Foucault’s thought as weighted curves leaving a spine and bunching into eight groups"
      >
        <line className="foucault-spine-line" x1={CX} y1={Y0 - 8} x2={CX} y2={Y1 + 8} />

        {bundles.map((bundle) => {
          const groupHot =
            current?.category.id === bundle.category.id || hot === bundle.category.id;
          const dim = Boolean(current) && !groupHot;
          return (
            <g
              key={bundle.category.id}
              className="foucault-bundle"
              data-hot={groupHot ? "true" : "false"}
              data-dim={dim ? "true" : "false"}
            >
              <path
                className="foucault-trunk"
                d={bundle.trunk}
                stroke={bundle.color}
                strokeWidth={bundle.trunkWidth}
                pathLength={1}
                tabIndex={0}
              >
                <title>{bundle.category.title}</title>
              </path>
              <path
                className="foucault-fiber-hit"
                d={bundle.trunk}
                onMouseEnter={() => setHot(bundle.category.id)}
                onFocus={() => setHot(bundle.category.id)}
                onClick={() =>
                  setPinned((prev) => (prev === bundle.category.id ? null : bundle.category.id))
                }
              />
              {bundle.fibers.map((fiber, index) => {
                const isHot = fiber.mark.id === currentId;
                return (
                  <g
                    key={fiber.mark.id}
                    onMouseEnter={() => setHot(fiber.mark.id)}
                    onClick={() =>
                      setPinned((prev) => (prev === fiber.mark.id ? null : fiber.mark.id))
                    }
                  >
                    <path
                      className="foucault-fiber"
                      d={fiber.path}
                      stroke={bundle.color}
                      strokeWidth={fiber.width}
                      pathLength={1}
                      data-hot={isHot ? "true" : "false"}
                      style={{ transitionDelay: `${0.28 + index * 0.035}s` }}
                      tabIndex={0}
                      onFocus={() => setHot(fiber.mark.id)}
                    >
                      <title>{fiber.mark.line}</title>
                    </path>
                    <path className="foucault-fiber-hit" d={fiber.path} />
                    <circle
                      className="foucault-leaf-dot"
                      cx={fiber.x}
                      cy={fiber.y}
                      r={isHot ? 3.2 : 2.1}
                      fill={bundle.color}
                    />
                    <text
                      className="foucault-leaf-label"
                      x={fiber.x + fiber.side * 10}
                      y={fiber.y + 1}
                      textAnchor={fiber.side === 1 ? "start" : "end"}
                      dominantBaseline="middle"
                      data-hot={isHot ? "true" : "false"}
                    >
                      {clipLine(fiber.mark.line)}
                    </text>
                  </g>
                );
              })}
              <text
                className="foucault-group-label"
                x={bundle.labelX}
                y={bundle.labelY}
                textAnchor="middle"
              >
                {SHORT[bundle.category.id] ?? bundle.category.title}
              </text>
            </g>
          );
        })}
        <circle className="foucault-sketch-bindu" cx={CX} cy={(Y0 + Y1) / 2} r="8" />
      </svg>

      <aside
        className="foucault-tray"
        id={trayId}
        data-filled={current ? "true" : "false"}
        aria-live="polite"
      >
        {current ? (
          <>
            <p className="foucault-tray-cat">{current.category.title}</p>
            <p className="foucault-tray-line">{current.mark.line}</p>
            <p className="foucault-tray-gloss">{current.mark.gloss}</p>
            <p className="foucault-tray-source">{current.mark.source}</p>
          </>
        ) : (
          <p className="foucault-tray-empty">Hover a line. Thickness is the load.</p>
        )}
      </aside>
    </section>
  );
}
