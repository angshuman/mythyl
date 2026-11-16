type Props = {
  className?: string;
  title?: string;
  detail?: "compact" | "full";
};

/** Kolam diamond and bindu. Full detail adds a kalasha, vimana lines, and feathers. */
export function MythylMark({ className, title = "mythyl", detail = "full" }: Props) {
  return (
    <svg
      className={className}
      viewBox="0 0 100 100"
      role="img"
      aria-label={title}
    >
      <title>{title}</title>
      <g
        fill="none"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        {/* Outer chowk, double moulding like a temple plinth */}
        <polygon className="mark-metal" points="50,14 88,50 50,86 12,50" strokeWidth="1.55" />
        <polygon className="mark-metal" points="50,18 84,50 50,82 16,50" strokeWidth="0.9" />
        {/* Garbhagriha */}
        <polygon className="mark-lac" points="50,34 66,50 50,66 34,50" strokeWidth="1.25" />

        {detail === "full" ? (
          <>
            {/* Vimana cornices — receding storeys */}
            <path className="mark-metal" d="M38 30 L50 16 L62 30" strokeWidth="1.15" />
            <path className="mark-metal" d="M41.5 26.5 L50 16 L58.5 26.5" strokeWidth="1.05" />
            <path className="mark-metal" d="M44.5 22.5 L50 16 L55.5 22.5" strokeWidth="0.95" />
            {/* Adhisthana steps at the south */}
            <path className="mark-metal" d="M42 72h16" strokeWidth="1.05" />
            <path className="mark-metal" d="M39 76h22" strokeWidth="1.05" />
            <path className="mark-metal" d="M36 80h28" strokeWidth="1.05" />
            {/* Peacock feathers at the east and west gates */}
            <g className="mark-metal" strokeWidth="1.12">
              <path d="M85 50 C91.5 41.5 99 44.5 102 50 C99 55.5 91.5 58.5 85 50 Z" />
              <path d="M87 46.2 Q91 44.5 95 42.5" />
              <path d="M87 53.8 Q91 55.5 95 57.5" />
              <path d="M88.2 48.1 Q92.5 47.2 96.5 46.2" />
              <path d="M88.2 51.9 Q92.5 52.8 96.5 53.8" />
              <path d="M15 50 C8.5 41.5 1 44.5 -2 50 C1 55.5 8.5 58.5 15 50 Z" />
              <path d="M13 46.2 Q9 44.5 5 42.5" />
              <path d="M13 53.8 Q9 55.5 5 57.5" />
              <path d="M11.8 48.1 Q7.5 47.2 3.5 46.2" />
              <path d="M11.8 51.9 Q7.5 52.8 3.5 53.8" />
            </g>
            <circle className="mark-lac-fill" cx="94.4" cy="50" r="1.8" />
            <circle className="mark-lac-fill" cx="5.6" cy="50" r="1.8" />
            {/* Kalasha finial */}
            <path className="mark-metal" d="M50 14 V9.1" strokeWidth="1.1" />
            <ellipse className="mark-metal" cx="50" cy="8.6" rx="3.7" ry="1.25" strokeWidth="1.05" />
            <ellipse className="mark-metal" cx="50" cy="5.6" rx="2.55" ry="3.05" strokeWidth="1.1" />
            <circle className="mark-lac-fill" cx="50" cy="1.7" r="1.2" />
          </>
        ) : (
          <>
            <circle className="mark-metal-fill" cx="50" cy="14" r="2.1" />
            <circle className="mark-metal-fill" cx="88" cy="50" r="2.1" />
            <circle className="mark-metal-fill" cx="50" cy="86" r="2.1" />
            <circle className="mark-metal-fill" cx="12" cy="50" r="2.1" />
          </>
        )}
      </g>
      <circle className="mark-lac-fill" cx="50" cy="50" r="5.4" />
    </svg>
  );
}
