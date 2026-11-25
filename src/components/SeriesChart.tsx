"use client";

import { useMemo, useState } from "react";

export type ChartPoint = { year: number; value: number };
export type ChartMark = {
  year: number;
  label: string;
  color?: string;
  summary?: string;
  scale?: string;
};

type PlacedMark = ChartMark & { x: number; y: number };

function niceMax(value: number): number {
  if (value <= 0) return 1;
  const exp = 10 ** Math.floor(Math.log10(value));
  const f = value / exp;
  const nice = f <= 1 ? 1 : f <= 2 ? 2 : f <= 5 ? 5 : 10;
  return nice * exp;
}

function pathOf(
  points: ChartPoint[],
  xOf: (year: number) => number,
  yOf: (value: number) => number,
): string {
  return points
    .map((point, index) => `${index === 0 ? "M" : "L"}${xOf(point.year).toFixed(1)} ${yOf(point.value).toFixed(1)}`)
    .join(" ");
}

function markKey(mark: ChartMark): string {
  return `${mark.year}-${mark.label}`;
}

export function SeriesChart({
  points,
  compare,
  compareLabel,
  marks = [],
  highlightYear,
  fromZero = true,
  color = "#e6d3a4",
  compareColor = "#7eb8a0",
  yFormat,
  readoutFormat,
  yLabel,
  height = 176,
}: {
  points: ChartPoint[];
  compare?: ChartPoint[];
  compareLabel?: string;
  marks?: ChartMark[];
  highlightYear?: number | null;
  fromZero?: boolean;
  color?: string;
  compareColor?: string;
  yFormat: (value: number) => string;
  readoutFormat?: (value: number) => string;
  yLabel?: string;
  height?: number;
}) {
  const [hot, setHot] = useState<ChartPoint | null>(null);
  const [hotMark, setHotMark] = useState<ChartMark | null>(null);
  const [pinnedMark, setPinnedMark] = useState<ChartMark | null>(null);
  const width = 420;
  const padLeft = 44;
  const padRight = 14;
  const padTop = 12;
  const padBottom = marks.length ? 42 : 24;

  const geometry = useMemo(() => {
    const years = points.map((p) => p.year);
    const compareYears = compare?.map((p) => p.year) ?? [];
    const minYear = Math.min(...years, ...compareYears);
    const maxYear = Math.max(...years, ...compareYears);
    const values = points.map((p) => p.value);
    const compareValues = compare?.map((p) => p.value) ?? [];
    const lo = fromZero ? 0 : Math.min(...values, ...compareValues);
    const hi = niceMax(Math.max(...values, ...compareValues, 1) * 1.04);
    const innerW = width - padLeft - padRight;
    const innerH = height - padTop - padBottom;
    const span = Math.max(1, maxYear - minYear);
    const xOf = (year: number) => padLeft + ((year - minYear) / span) * innerW;
    const yOf = (value: number) => padTop + (1 - (value - lo) / (hi - lo || 1)) * innerH;
    const yTicks = [0, 0.25, 0.5, 0.75, 1].map((t) => lo + (hi - lo) * t);
    const yearSpan = maxYear - minYear;
    const step = yearSpan > 20 ? 10 : yearSpan > 10 ? 3 : yearSpan > 6 ? 2 : 1;
    const xTicks: number[] = [];
    for (let year = minYear; year <= maxYear; year += step) xTicks.push(year);
    if (xTicks[xTicks.length - 1] !== maxYear) {
      if (maxYear - xTicks[xTicks.length - 1] >= step * 0.6) xTicks.push(maxYear);
      else xTicks[xTicks.length - 1] = maxYear;
    }
    return { minYear, maxYear, lo, hi, innerW, innerH, xOf, yOf, yTicks, xTicks };
  }, [points, compare, fromZero, height, padLeft, padRight, padTop, padBottom]);

  const placedMarks = useMemo(() => {
    const inRange = marks.filter(
      (mark) => mark.year >= geometry.minYear && mark.year <= geometry.maxYear,
    );
    const groups = new Map<number, ChartMark[]>();
    for (const mark of inRange) {
      const group = groups.get(mark.year) ?? [];
      group.push(mark);
      groups.set(mark.year, group);
    }
    const placed: PlacedMark[] = [];
    const y = padTop + geometry.innerH + 7;
    for (const [year, group] of groups) {
      group.forEach((mark, index) => {
        const spread = (index - (group.length - 1) / 2) * 9;
        placed.push({ ...mark, x: geometry.xOf(year) + spread, y });
      });
    }
    return placed;
  }, [marks, geometry, padTop]);

  const markYears = useMemo(() => [...new Set(placedMarks.map((mark) => mark.year))], [placedMarks]);

  if (points.length === 0) return null;

  const { xOf, yOf, yTicks, xTicks, innerH } = geometry;
  const line = pathOf(points, xOf, yOf);
  const last = points[points.length - 1];
  const first = points[0];
  const area = `${line} L${xOf(last.year).toFixed(1)} ${(padTop + innerH).toFixed(1)} L${xOf(first.year).toFixed(1)} ${(padTop + innerH).toFixed(1)} Z`;
  const compareLine = compare && compare.length > 1 ? pathOf(compare, xOf, yOf) : null;
  const focusMark = hotMark ?? pinnedMark;
  const shown = focusMark
    ? points.reduce(
        (best, point) =>
          Math.abs(point.year - focusMark.year) < Math.abs(best.year - focusMark.year) ? point : best,
        points[0],
      )
    : (hot ?? last);
  const activeMark =
    focusMark ?? (hot ? placedMarks.find((mark) => mark.year === shown.year) ?? null : null);
  const guideYear = activeMark?.year ?? highlightYear ?? null;

  const nearest = (clientX: number, clientY: number, target: SVGSVGElement) => {
    const box = target.getBoundingClientRect();
    const x = ((clientX - box.left) / box.width) * width;
    const y = ((clientY - box.top) / box.height) * height;
    let best = points[0];
    let dist = Infinity;
    for (const point of points) {
      const gap = Math.abs(xOf(point.year) - x);
      if (gap < dist) {
        best = point;
        dist = gap;
      }
    }
    setHot(best);

    let nextMark: PlacedMark | null = null;
    let markDist = 16;
    for (const mark of placedMarks) {
      const dx = Math.abs(mark.x - x);
      const dy = Math.abs(mark.y - y);
      const nearDiamond = Math.hypot(dx, dy) <= 16;
      const nearYear = y >= padTop && y <= padTop + innerH + 20 && dx <= 16;
      if (!nearDiamond && !nearYear) continue;
      const score = nearDiamond ? Math.hypot(dx, dy) : dx;
      if (score < markDist) {
        markDist = score;
        nextMark = mark;
      }
    }
    setHotMark(nextMark);
    return nextMark;
  };

  const isActive = (mark: ChartMark) => {
    if (focusMark) return markKey(mark) === markKey(focusMark);
    return activeMark != null && mark.year === activeMark.year;
  };

  return (
    <figure className="state-chart">
      {yLabel ? <figcaption className="state-chart-label">{yLabel}</figcaption> : null}
      <svg
        className="state-chart-svg"
        viewBox={`0 0 ${width} ${height}`}
        role="img"
        aria-label={yLabel}
        onMouseMove={(event) => nearest(event.clientX, event.clientY, event.currentTarget)}
        onMouseLeave={() => {
          setHot(null);
          setHotMark(null);
        }}
        onClick={(event) => {
          const mark = nearest(event.clientX, event.clientY, event.currentTarget);
          setPinnedMark((current) =>
            mark && current && markKey(current) === markKey(mark) ? null : mark,
          );
        }}
      >
        {yTicks.map((tick) => (
          <g key={tick}>
            <line
              x1={padLeft}
              x2={width - padRight}
              y1={yOf(tick)}
              y2={yOf(tick)}
              stroke="rgba(231,220,200,0.12)"
              strokeWidth="1"
            />
            <text x={padLeft - 6} y={yOf(tick) + 3} textAnchor="end" className="state-chart-tick">
              {yFormat(tick)}
            </text>
          </g>
        ))}
        {xTicks.map((year) => (
          <text key={year} x={xOf(year)} y={height - 5} textAnchor="middle" className="state-chart-tick">
            {year}
          </text>
        ))}
        {markYears.map((year) => (
          <line
            key={`mark-${year}`}
            x1={xOf(year)}
            x2={xOf(year)}
            y1={padTop}
            y2={padTop + innerH}
            stroke={guideYear === year ? "rgba(242,230,204,0.5)" : "rgba(242,230,204,0.16)"}
            strokeDasharray="3 4"
            strokeWidth={guideYear === year ? 1.3 : 1}
          />
        ))}
        {guideYear != null &&
        guideYear >= geometry.minYear &&
        guideYear <= geometry.maxYear &&
        !markYears.includes(guideYear) ? (
          <line
            x1={xOf(guideYear)}
            x2={xOf(guideYear)}
            y1={padTop}
            y2={padTop + innerH}
            stroke="rgba(242,230,204,0.45)"
            strokeDasharray="3 4"
            strokeWidth="1.2"
          />
        ) : null}
        <path d={area} fill={color} opacity="0.12" />
        {compareLine ? (
          <path d={compareLine} fill="none" stroke={compareColor} strokeWidth="1.4" strokeDasharray="4 3" strokeLinejoin="round" />
        ) : null}
        <path d={line} fill="none" stroke={color} strokeWidth="2" strokeLinejoin="round" strokeLinecap="round" />
        {points.map((point) => (
          <circle
            key={point.year}
            cx={xOf(point.year)}
            cy={yOf(point.value)}
            r={shown.year === point.year ? 3.4 : 2}
            fill={color}
          />
        ))}
        {placedMarks.map((mark) => (
          <g key={markKey(mark)}>
            <circle className="state-chart-hit" cx={mark.x} cy={mark.y} r="11" fill="transparent" />
            <rect
              x={mark.x - (isActive(mark) ? 3.8 : 3.2)}
              y={mark.y - (isActive(mark) ? 3.8 : 3.2)}
              width={isActive(mark) ? 7.6 : 6.4}
              height={isActive(mark) ? 7.6 : 6.4}
              transform={`rotate(45 ${mark.x} ${mark.y})`}
              fill={mark.color ?? "#c9a227"}
              stroke={isActive(mark) ? "#f2e6cc" : "none"}
              strokeWidth="1.1"
            />
          </g>
        ))}
      </svg>
      <p className="state-chart-readout">
        <b>{shown.year}</b> {(readoutFormat ?? yFormat)(shown.value)}
        {compareLabel && compareLine ? <span> · dashed {compareLabel}</span> : null}
      </p>
      {placedMarks.length > 0 ? (
        <>
          <ul className="state-chart-events" aria-label="Events on this series">
            {placedMarks.map((mark) => {
              const on = isActive(mark);
              return (
                <li key={markKey(mark)}>
                  <button
                    type="button"
                    className={on ? "state-chart-event state-chart-event-on" : "state-chart-event"}
                    onMouseEnter={() => {
                      setHotMark(mark);
                      const match = points.reduce(
                        (best, point) =>
                          Math.abs(point.year - mark.year) < Math.abs(best.year - mark.year) ? point : best,
                        points[0],
                      );
                      setHot(match);
                    }}
                    onMouseLeave={() =>
                      setHotMark((current) => (current && markKey(current) === markKey(mark) ? null : current))
                    }
                    onClick={() =>
                      setPinnedMark((current) =>
                        current && markKey(current) === markKey(mark) ? null : mark,
                      )
                    }
                  >
                    <i className="state-chart-swatch" style={{ background: mark.color ?? "#c9a227" }} />
                    <span>
                      <b>{mark.year}</b> {mark.label}
                    </span>
                  </button>
                </li>
              );
            })}
          </ul>
          <div className="state-chart-detail">
            {activeMark ? (
              <>
                <p className="state-chart-note">
                  <b>{activeMark.year}</b> {activeMark.label}
                  {activeMark.scale ? <span> · {activeMark.scale}</span> : null}
                </p>
                {activeMark.summary ? <p className="state-chart-summary">{activeMark.summary}</p> : null}
              </>
            ) : null}
          </div>
        </>
      ) : null}
    </figure>
  );
}
