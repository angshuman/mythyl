import type { ReactNode } from "react";
import { MythylMark } from "@/components/MythylMark";

const G = {
  fill: "none" as const,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
};

function Frame({ children, title }: { children: ReactNode; title: string }) {
  return (
    <svg viewBox="0 0 100 100" role="img" aria-label={title} overflow="visible">
      <title>{title}</title>
      <g {...G}>{children}</g>
    </svg>
  );
}

function Bindu({ r = 6 }: { r?: number }) {
  return <circle className="mark-lac-fill" cx="50" cy="50" r={r} />;
}

function Pulli({ cx, cy }: { cx: number; cy: number }) {
  return <circle className="mark-metal-fill" cx={cx} cy={cy} r="2.2" />;
}

/** 1 — the first simple chowk */
function Chowk() {
  return (
    <Frame title="Chowk">
      <polygon className="mark-metal" points="50,6 94,50 50,94 6,50" strokeWidth="1.7" />
      <polygon className="mark-lac" points="50,26 74,50 50,74 26,50" strokeWidth="1.35" />
      <Pulli cx={50} cy={6} />
      <Pulli cx={94} cy={50} />
      <Pulli cx={50} cy={94} />
      <Pulli cx={6} cy={50} />
      <Bindu />
    </Frame>
  );
}

/** 2 — concentric mandala */
function Mandala() {
  return (
    <Frame title="Mandala">
      <circle className="mark-metal" cx="50" cy="50" r="42" strokeWidth="1.6" />
      <circle className="mark-metal" cx="50" cy="50" r="28" strokeWidth="1.15" />
      <circle className="mark-lac" cx="50" cy="50" r="16" strokeWidth="1.3" />
      <Pulli cx={50} cy={8} />
      <Pulli cx={92} cy={50} />
      <Pulli cx={50} cy={92} />
      <Pulli cx={8} cy={50} />
      <Bindu />
    </Frame>
  );
}

/** 3 — vastu square and diamond */
function Vastu() {
  return (
    <Frame title="Vastu">
      <rect className="mark-metal" x="18" y="18" width="64" height="64" strokeWidth="1.55" />
      <polygon className="mark-lac" points="50,14 86,50 50,86 14,50" strokeWidth="1.3" />
      <Bindu />
    </Frame>
  );
}

/** 4 — shatkona yantra */
function Yantra() {
  return (
    <Frame title="Yantra">
      <polygon className="mark-metal" points="50,14 82,72 18,72" strokeWidth="1.5" />
      <polygon className="mark-lac" points="50,86 18,28 82,28" strokeWidth="1.35" />
      <Bindu r={5.4} />
    </Frame>
  );
}

/** 5 — four-petal padma */
function Padma() {
  const petal = (rot: number) => (
    <path
      key={rot}
      className="mark-metal"
      transform={`rotate(${rot} 50 50)`}
      d="M50 18 C61 24 63 38 50 46 C37 38 39 24 50 18 Z"
      strokeWidth="1.25"
    />
  );
  return (
    <Frame title="Padma">
      {[0, 90, 180, 270].map(petal)}
      <Bindu />
    </Frame>
  );
}

/** 6 — a single peacock plume */
function Plume() {
  return (
    <Frame title="Plume">
      <path
        className="mark-metal"
        d="M50 90 C26 68 27 32 50 10 C73 32 74 68 50 90 Z"
        strokeWidth="1.5"
      />
      <path className="mark-metal" d="M39 34 Q50 18 61 34" strokeWidth="1.05" />
      <circle className="mark-lac" cx="50" cy="26" r="8.2" strokeWidth="1.3" />
      <circle className="mark-lac-fill" cx="50" cy="26" r="4.2" />
    </Frame>
  );
}

/** 7 — three-feather fan */
function Fan() {
  const feather = (rot: number) => (
    <g key={rot} transform={`rotate(${rot} 50 78)`}>
      <path
        className="mark-metal"
        d="M50 76 C38 58 38 28 50 14 C62 28 62 58 50 76 Z"
        strokeWidth="1.25"
      />
      <circle className="mark-lac-fill" cx="50" cy="26" r="3.1" />
    </g>
  );
  return (
    <Frame title="Fan">
      {[-32, 0, 32].map(feather)}
      <circle className="mark-lac-fill" cx="50" cy="80" r="4.2" />
    </Frame>
  );
}

/** 8 — chowk with peacock gates */
function Gates() {
  return (
    <Frame title="Gates">
      <polygon className="mark-metal" points="50,12 84,50 50,88 16,50" strokeWidth="1.55" />
      <polygon className="mark-lac" points="50,32 68,50 50,68 32,50" strokeWidth="1.25" />
      <path
        className="mark-metal"
        d="M82 50 C90 41 99 44 102 50 C99 56 90 59 82 50 Z"
        strokeWidth="1.2"
      />
      <path
        className="mark-metal"
        d="M18 50 C10 41 1 44 -2 50 C1 56 10 59 18 50 Z"
        strokeWidth="1.2"
      />
      <circle className="mark-lac-fill" cx="93.5" cy="50" r="1.9" />
      <circle className="mark-lac-fill" cx="6.5" cy="50" r="1.9" />
      <Bindu r={5.4} />
    </Frame>
  );
}

/** 9 — Rajput jharokha, cusped arch */
function Jharokha() {
  return (
    <Frame title="Jharokha">
      <path className="mark-metal" d="M24 86 H76" strokeWidth="1.5" />
      <path className="mark-metal" d="M28 86 V54" strokeWidth="1.45" />
      <path className="mark-metal" d="M72 86 V54" strokeWidth="1.45" />
      <path
        className="mark-metal"
        d="M28 54 C28 40 36 32 44 30 C47 20 50 16 50 16 C53 16 53 20 56 30 C64 32 72 40 72 54"
        strokeWidth="1.45"
      />
      <path className="mark-lac" d="M34 86 V58 C34 44 50 38 50 38 C50 38 66 44 66 58 V86" strokeWidth="1.2" />
      <path className="mark-metal" d="M22 86 H78" strokeWidth="2.1" />
      <Bindu r={5.2} />
    </Frame>
  );
}

/** 10 — bandhani field of dots */
function Bandhani() {
  const dots: { cx: number; cy: number }[] = [];
  for (const r of [16, 26, 36]) {
    const n = r === 16 ? 8 : r === 26 ? 12 : 16;
    for (let i = 0; i < n; i++) {
      const a = (Math.PI * 2 * i) / n - Math.PI / 2;
      dots.push({ cx: 50 + r * Math.cos(a), cy: 50 + r * Math.sin(a) });
    }
  }
  return (
    <Frame title="Bandhani">
      <polygon className="mark-metal" points="50,8 92,50 50,92 8,50" strokeWidth="1.4" />
      {dots.map((d) => (
        <circle key={`${d.cx}-${d.cy}`} className="mark-metal-fill" cx={d.cx} cy={d.cy} r="1.55" />
      ))}
      <Bindu r={6.4} />
    </Frame>
  );
}

/** 11 — jali of four small diamonds */
function Jali() {
  const cell = (x: number, y: number) => (
    <polygon
      key={`${x}-${y}`}
      className="mark-metal"
      points={`${x},${y - 16} ${x + 16},${y} ${x},${y + 16} ${x - 16},${y}`}
      strokeWidth="1.2"
    />
  );
  return (
    <Frame title="Jali">
      <rect className="mark-lac" x="14" y="14" width="72" height="72" strokeWidth="1.4" />
      {cell(34, 34)}
      {cell(66, 34)}
      {cell(34, 66)}
      {cell(66, 66)}
      <Bindu r={4.6} />
    </Frame>
  );
}

/** 12 — baoli, stepwell in plan */
function Baoli() {
  return (
    <Frame title="Baoli">
      <polygon className="mark-metal" points="50,8 92,50 50,92 8,50" strokeWidth="1.45" />
      <polygon className="mark-metal" points="50,20 80,50 50,80 20,50" strokeWidth="1.15" />
      <polygon className="mark-lac" points="50,32 68,50 50,68 32,50" strokeWidth="1.25" />
      <path className="mark-metal" d="M42 86 H58" strokeWidth="1.1" />
      <path className="mark-metal" d="M38 90 H62" strokeWidth="1.1" />
      <Bindu r={5.2} />
    </Frame>
  );
}

/** 13 — Bengali alpana, four kalka */
function Alpana() {
  const kalka = (rot: number) => (
    <path
      key={rot}
      className="mark-metal"
      transform={`rotate(${rot} 50 50)`}
      d="M50 16 C64 18 70 32 58 42 C52 38 50 30 50 16 C50 30 48 38 42 42 C30 32 36 18 50 16 Z"
      strokeWidth="1.25"
    />
  );
  return (
    <Frame title="Alpana">
      {[0, 90, 180, 270].map(kalka)}
      <circle className="mark-lac" cx="50" cy="50" r="11" strokeWidth="1.2" />
      <Bindu r={5.6} />
    </Frame>
  );
}

/** 14 — kantha running stitch */
function Kantha() {
  return (
    <Frame title="Kantha">
      <polygon
        className="mark-metal"
        points="50,8 92,50 50,92 8,50"
        strokeWidth="1.55"
        strokeDasharray="3.2 2.4"
      />
      <polygon
        className="mark-lac"
        points="50,26 74,50 50,74 26,50"
        strokeWidth="1.25"
        strokeDasharray="2.6 2.1"
      />
      <Pulli cx={50} cy={8} />
      <Pulli cx={92} cy={50} />
      <Pulli cx={50} cy={92} />
      <Pulli cx={8} cy={50} />
      <Bindu />
    </Frame>
  );
}

/** 15 — live mark */
function Ashtadala() {
  return <MythylMark title="Ashtadala" />;
}

export const MARK_OPTIONS = [
  { id: 1, name: "Chowk", family: "kolam", node: <Chowk /> },
  { id: 2, name: "Mandala", family: "kolam", node: <Mandala /> },
  { id: 3, name: "Vastu", family: "kolam", node: <Vastu /> },
  { id: 4, name: "Yantra", family: "kolam", node: <Yantra /> },
  { id: 5, name: "Padma", family: "bengali", node: <Padma /> },
  { id: 6, name: "Plume", family: "peacock", node: <Plume /> },
  { id: 7, name: "Fan", family: "peacock", node: <Fan /> },
  { id: 8, name: "Gates", family: "peacock", node: <Gates /> },
  { id: 9, name: "Jharokha", family: "rajasthani", node: <Jharokha /> },
  { id: 10, name: "Bandhani", family: "rajasthani", node: <Bandhani /> },
  { id: 11, name: "Jali", family: "rajasthani", node: <Jali /> },
  { id: 12, name: "Baoli", family: "rajasthani", node: <Baoli /> },
  { id: 13, name: "Alpana", family: "bengali", node: <Alpana /> },
  { id: 14, name: "Kantha", family: "bengali", node: <Kantha /> },
  { id: 15, name: "Ashtadala", family: "bengali", node: <Ashtadala /> },
] as const;
