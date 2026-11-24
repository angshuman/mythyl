import type { WorkKind } from "@/lib/works";

export function workGlyphSvg(kind: WorkKind, color: string, size = 18): string {
  const s = size;
  const c = color;
  const body = glyph(kind, c);
  return `<svg viewBox="0 0 24 24" width="${s}" height="${s}" aria-hidden="true">${body}</svg>`;
}

function glyph(kind: WorkKind, c: string): string {
  switch (kind) {
    case "dam":
      return `<path d="M3 18 L8 6 H16 L21 18 Z" fill="none" stroke="${c}" stroke-width="1.7" />
        <path d="M7 18 Q12 13 17 18" fill="none" stroke="${c}" stroke-width="1.3" />`;
    case "irrigation":
      return `<path d="M3 8 Q7 4 11 8 T19 8" fill="none" stroke="${c}" stroke-width="1.6" />
        <path d="M3 14 Q7 10 11 14 T19 14" fill="none" stroke="${c}" stroke-width="1.6" />
        <path d="M3 20 Q7 16 11 20 T19 20" fill="none" stroke="${c}" stroke-width="1.6" />`;
    case "steel":
      return `<rect x="4" y="10" width="16" height="8" fill="none" stroke="${c}" stroke-width="1.6" />
        <path d="M7 10 V5 M12 10 V3 M17 10 V6" stroke="${c}" stroke-width="1.6" />
        <path d="M6 5 H8 M11 3 H13 M16 6 H18" stroke="${c}" stroke-width="1.4" />`;
    case "plant":
      return `<rect x="4" y="9" width="12" height="9" fill="none" stroke="${c}" stroke-width="1.6" />
        <path d="M16 14 H20 V18 H16" fill="none" stroke="${c}" stroke-width="1.5" />
        <circle cx="10" cy="13.5" r="2" fill="none" stroke="${c}" stroke-width="1.3" />`;
    case "port":
      return `<path d="M5 16 A7 7 0 0 1 19 16" fill="none" stroke="${c}" stroke-width="1.7" />
        <path d="M12 16 V6 M12 6 L16 9" stroke="${c}" stroke-width="1.6" />
        <circle cx="12" cy="16" r="1.5" fill="${c}" />`;
    case "road":
      return `<path d="M6 20 L10 4 H14 L18 20" fill="none" stroke="${c}" stroke-width="1.6" />
        <path d="M12 6 V8 M12 11 V13 M12 16 V18" stroke="${c}" stroke-width="1.5" />`;
    case "rail":
      return `<path d="M4 8 H20 M4 16 H20" stroke="${c}" stroke-width="1.7" />
        <path d="M7 8 V16 M11 8 V16 M15 8 V16 M19 8 V16" stroke="${c}" stroke-width="1.3" />`;
    case "metro":
      return `<circle cx="12" cy="12" r="7.2" fill="none" stroke="${c}" stroke-width="1.7" />
        <circle cx="12" cy="12" r="2.2" fill="${c}" />`;
    case "power":
      return `<path d="M13 3 L6 13 H12 L10 21 L18 10 H13 Z" fill="none" stroke="${c}" stroke-width="1.6" stroke-linejoin="round" />`;
    case "nuclear":
      return `<circle cx="12" cy="12" r="2" fill="${c}" />
        <ellipse cx="12" cy="12" rx="8" ry="3.2" fill="none" stroke="${c}" stroke-width="1.4" transform="rotate(0 12 12)" />
        <ellipse cx="12" cy="12" rx="8" ry="3.2" fill="none" stroke="${c}" stroke-width="1.4" transform="rotate(60 12 12)" />
        <ellipse cx="12" cy="12" rx="8" ry="3.2" fill="none" stroke="${c}" stroke-width="1.4" transform="rotate(120 12 12)" />`;
    case "space":
      return `<path d="M12 3 L15 14 H9 Z" fill="none" stroke="${c}" stroke-width="1.6" />
        <path d="M9 16 H15 M10 19 H14" stroke="${c}" stroke-width="1.5" />`;
    case "campus":
      return `<rect x="5" y="6" width="14" height="12" fill="none" stroke="${c}" stroke-width="1.6" />
        <path d="M5 10 H19 M12 6 V18" stroke="${c}" stroke-width="1.3" />`;
    case "bridge":
      return `<path d="M3 16 H21" stroke="${c}" stroke-width="1.6" />
        <path d="M5 16 Q12 5 19 16" fill="none" stroke="${c}" stroke-width="1.7" />
        <path d="M8 16 V12 M12 16 V8 M16 16 V12" stroke="${c}" stroke-width="1.2" />`;
    case "airport":
      return `<path d="M12 4 L14 11 L21 12 L14 13 L12 20 L10 13 L3 12 L10 11 Z" fill="none" stroke="${c}" stroke-width="1.5" stroke-linejoin="round" />`;
    case "city":
      return `<rect x="4" y="4" width="16" height="16" fill="none" stroke="${c}" stroke-width="1.5" />
        <path d="M12 7 V17 M7 12 H17" stroke="${c}" stroke-width="1.6" />`;
    case "water":
      return `<path d="M12 4 C12 4 5 12 5 16 A7 7 0 0 0 19 16 C19 12 12 4 12 4 Z" fill="none" stroke="${c}" stroke-width="1.6" />`;
    default:
      return `<circle cx="12" cy="12" r="6" fill="none" stroke="${c}" stroke-width="1.6" />`;
  }
}
