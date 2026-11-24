type Point = { year: number; value: number };

export function Sparkline({
  points,
  invert = false,
  color = "#e7dcc8",
  width = 132,
  height = 36,
  label,
}: {
  points: Point[];
  invert?: boolean;
  color?: string;
  width?: number;
  height?: number;
  label?: string;
}) {
  if (points.length === 0) {
    return <svg className="spark" width={width} height={height} aria-hidden="true" />;
  }
  const pad = 3;
  const values = points.map((point) => point.value);
  const min = Math.min(...values);
  const max = Math.max(...values);
  const span = max - min || 1;
  const innerW = width - pad * 2;
  const innerH = height - pad * 2;
  const xy = points.map((point, index) => {
    const x = pad + (points.length === 1 ? innerW / 2 : (index / (points.length - 1)) * innerW);
    const ratio = (point.value - min) / span;
    const y = pad + (invert ? ratio : 1 - ratio) * innerH;
    return { x, y, ...point };
  });
  const d = xy.map((p, i) => `${i === 0 ? "M" : "L"}${p.x.toFixed(1)} ${p.y.toFixed(1)}`).join(" ");
  const last = xy[xy.length - 1];
  return (
    <svg className="spark" width={width} height={height} viewBox={`0 0 ${width} ${height}`} aria-label={label}>
      <path d={d} fill="none" stroke={color} strokeWidth="1.6" strokeLinejoin="round" strokeLinecap="round" />
      {xy.map((p) => (
        <circle key={p.year} cx={p.x} cy={p.y} r="2.1" fill={color} />
      ))}
      <circle cx={last.x} cy={last.y} r="3.1" fill="none" stroke={color} strokeWidth="1.1" />
    </svg>
  );
}
