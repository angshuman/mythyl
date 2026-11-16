type Props = {
  className?: string;
  title?: string;
  detail?: "compact" | "full";
};

const PETALS = [0, 45, 90, 135, 180, 225, 270, 315];

/** Ashtadala — eight-petal alpana lotus. Compact thickens the line for the mast. */
export function MythylMark({ className, title = "mythyl", detail = "full" }: Props) {
  const compact = detail === "compact";
  return (
    <svg
      className={className}
      viewBox="0 0 100 100"
      role="img"
      aria-label={title}
      overflow="visible"
    >
      <title>{title}</title>
      <g fill="none" strokeLinecap="round" strokeLinejoin="round">
        {PETALS.map((rot) => (
          <path
            key={rot}
            className="mark-metal"
            transform={`rotate(${rot} 50 50)`}
            d="M50 14 C56 22 56 32 50 40 C44 32 44 22 50 14 Z"
            strokeWidth={compact ? 1.55 : 1.15}
          />
        ))}
        <circle
          className="mark-lac"
          cx="50"
          cy="50"
          r="10"
          strokeWidth={compact ? 1.45 : 1.2}
        />
      </g>
      <circle className="mark-lac-fill" cx="50" cy="50" r={compact ? 5.8 : 5.2} />
    </svg>
  );
}
