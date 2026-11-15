/** Match the landing SVG projection so dots sit on the silhouette. */
export const LANDING_VIEW = {
  minLon: 68,
  minLat: 6.7,
  maxLon: 97.5,
  maxLat: 37.2,
  width: 520,
  height: 620,
  pad: 16,
};

export function projectLanding(lon: number, lat: number): { x: number; y: number } {
  const { minLon, minLat, maxLon, maxLat, width, height, pad } = LANDING_VIEW;
  const x = ((lon - minLon) / (maxLon - minLon)) * (width - 2 * pad) + pad;
  const y = ((maxLat - lat) / (maxLat - minLat)) * (height - 2 * pad) + pad;
  return { x, y };
}

export const NORTHEAST_BOUNDS: [[number, number], [number, number]] = [
  [89.6, 21.7],
  [97.6, 29.6],
];

export const INDIA_CENTER: [number, number] = [82.8, 22.2];

export const INDIA_BOUNDS: [[number, number], [number, number]] = [
  [68.0, 6.5],
  [97.6, 37.3],
];

export const INDIA_FIT_PADDING = { top: 80, bottom: 96, left: 40, right: 40 };
