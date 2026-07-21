/**
 * Chart color roles. Two separate jobs, never mixed:
 *  - STATUS: reserved meaning (good/warning/critical/neutral) — mirrors StatusBadge.
 *  - CATEGORICAL: identity only (frameworks, risk categories) — CVD-validated order,
 *    deliberately excludes green/red so it never collides with STATUS in the same view.
 * Validated with scripts/validate_palette.js against this app's surface (#fafaf9):
 * all hard gates pass; three slots sit below 3:1 contrast on light surface (documented
 * relief: values are always direct-labeled, never color-only).
 */
export const STATUS = {
  good: "#1f6f43",
  warning: "#9c6b1f",
  critical: "#a8392a",
  neutral: "#6b6b67",
} as const;

export const STATUS_SOFT = {
  good: "#e5efe8",
  warning: "#f5ede0",
  critical: "#f4e6e3",
  neutral: "#ececea",
} as const;

/** Fixed order — never cycle past 6, never re-sort by rank. */
export const CATEGORICAL = [
  "#2a78d6", // blue
  "#e87ba4", // magenta
  "#eda100", // yellow
  "#1baf7a", // aqua
  "#eb6834", // orange
  "#4a3aa7", // violet
] as const;

export function categoricalColor(index: number): string {
  return CATEGORICAL[index % CATEGORICAL.length];
}

/** Sequential (single hue, light → dark) — magnitude only, e.g. heatmap cells. */
export const SEQUENTIAL = ["#eef4fc", "#cde2fb", "#9ec5f4", "#6da7ec", "#3987e5", "#1c5cab", "#0d366b"];

export function sequentialColor(ratio: number): string {
  const clamped = Math.max(0, Math.min(1, ratio));
  const idx = Math.round(clamped * (SEQUENTIAL.length - 1));
  return SEQUENTIAL[idx];
}
