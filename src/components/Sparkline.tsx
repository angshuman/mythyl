type Point = { year: number; value: number };

export type SparkOptions = {
  points: Point[];
  invert?: boolean;
  fromZero?: boolean;
  color?: string;
  width?: number;
  height?: number;
  compact?: boolean;
  label?: string;
};

function geometry({
  points,
  invert = false,
  fromZero = true,
  width = 132,
  height = 44,
  compact = false,
}: SparkOptions) {
  const padL = compact ? 2 : 2;
  const padR = compact ? 2 : 2;
  const padT = compact ? 3 : 8;
  const padB = compact ? 3 : 14;
  const values = points.map((point) => point.value);
  const min = fromZero ? 0 : Math.min(...values);
  const max = Math.max(...values);
  const span = max - min || 1;
  const innerW = width - padL - padR;
  const innerH = height - padT - padB;
  const first = points[0];
  const last = points[points.length - 1];
  const xy = points.map((point) => {
    const t = last.year === first.year ? 0.5 : (point.year - first.year) / (last.year - first.year);
    const x = padL + t * innerW;
    const ratio = (point.value - min) / span;
    const y = padT + (invert ? ratio : 1 - ratio) * innerH;
    return { x, y, ...point };
  });
  const d = xy.map((p, i) => `${i === 0 ? "M" : "L"}${p.x.toFixed(1)} ${p.y.toFixed(1)}`).join(" ");
  return { padL, padR, padT, padB, first, last, xy, d, end: xy[xy.length - 1] };
}

export function Sparkline({
  points,
  invert = false,
  fromZero = true,
  color = "#e7dcc8",
  width = 132,
  height = 44,
  compact = false,
  label,
}: SparkOptions) {
  if (points.length === 0) {
    return <svg className="spark" width={width} height={height} aria-hidden="true" />;
  }
  const { padL, padR, xy, d, end, first, last } = geometry({
    points,
    invert,
    fromZero,
    width,
    height,
    compact,
  });
  return (
    <svg className="spark" width={width} height={height} viewBox={`0 0 ${width} ${height}`} aria-label={label}>
      <path
        d={d}
        fill="none"
        stroke={color}
        strokeWidth={compact ? 1.35 : 1.6}
        strokeLinejoin="round"
        strokeLinecap="round"
      />
      {compact
        ? null
        : xy.map((p) => <circle key={p.year} cx={p.x} cy={p.y} r="1.7" fill={color} />)}
      <circle cx={end.x} cy={end.y} r={compact ? 2.1 : 2.8} fill="none" stroke={color} strokeWidth="1.1" />
      {compact ? null : (
        <>
          <text x={padL} y={height - 2} className="spark-year">
            {first.year}
          </text>
          <text x={width - padR} y={height - 2} textAnchor="end" className="spark-year">
            {last.year}
          </text>
        </>
      )}
    </svg>
  );
}
