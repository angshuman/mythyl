import {
  yearOf,
  type CasualtyClaim,
  type Estimate,
  type FuzzyDate,
  type Incident,
  type IncidentSide,
} from "./schema";

function fmt(n: number): string {
  return n.toLocaleString("en-IN");
}

export function formatFuzzyDate(date: FuzzyDate): string {
  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  if (date.precision === "day" && date.year && date.month && date.day) {
    return `${date.day} ${months[date.month - 1]} ${date.year}`;
  }
  if ((date.precision === "month" || date.month) && date.year && date.month) {
    return `${months[date.month - 1]} ${date.year}`;
  }
  if (date.year) return String(date.year);
  return "";
}

export function formatCount(claim: CasualtyClaim): string | null {
  const { killedBest: best, killedMin: min, killedMax: max } = claim;
  if (best != null && min != null && max != null && min !== max) {
    return `about ${fmt(best)}`;
  }
  if (min != null && max != null) {
    if (min === max) return fmt(min);
    return `${fmt(min)}–${fmt(max)}`;
  }
  if (best != null) return fmt(best);
  if (min != null) return `${fmt(min)}+`;
  if (max != null) return `up to ${fmt(max)}`;
  return null;
}

export function formatCasualtyLine(claim: CasualtyClaim): string {
  const count = formatCount(claim);
  const who = claim.sideLabel;
  if (!count) return who;
  return `${count} killed · ${who}`;
}

export function formatSides(sides: IncidentSide[]): string {
  const attackers = sides.filter((side) => side.role === "attacker").map((side) => side.label);
  const targets = sides
    .filter((side) => side.role === "target" || side.role === "defender")
    .map((side) => side.label);
  if (attackers.length && targets.length) return `${attackers.join(", ")} → ${targets.join(", ")}`;
  return sides.map((side) => side.label).join(" · ");
}

export function incidentYear(incident: Incident): number | null {
  return yearOf(incident.time);
}

export function primaryReport(incident: Incident) {
  return incident.reports.find((report) => report.excerpt) ?? incident.reports[0];
}

export function formatKilledEstimate(killed: Estimate): string {
  const contested = killed.contested ? " · figures contested" : "";
  if (killed.best != null) {
    return `about ${killed.best.toLocaleString("en-IN")} killed${contested}`;
  }
  if (killed.min != null && killed.max != null) {
    return `${killed.min.toLocaleString("en-IN")}–${killed.max.toLocaleString("en-IN")} killed${contested}`;
  }
  if (killed.max != null) {
    return `traditional figure up to ${killed.max.toLocaleString("en-IN")} killed${contested}`;
  }
  if (killed.min != null) {
    return `${killed.min.toLocaleString("en-IN")}+ killed${contested}`;
  }
  return killed.contested ? "deaths contested" : "deaths uncounted";
}
