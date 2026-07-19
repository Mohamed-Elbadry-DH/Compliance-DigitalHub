import raw from "./digitalhub.json";
import type { ControlDto, ControlStatus } from "./controls";

/**
 * Demo mode. With no backend running, the app serves the Digital Hub
 * dataset so you can present a full, believable demo. Flip VITE_DEMO=false
 * (or set it in .env) to talk to the real .NET API instead.
 */
export const DEMO = (import.meta.env.VITE_DEMO ?? "true") !== "false";

export const demo = raw as typeof raw;

export function demoControls(filter: { framework?: string; status?: ControlStatus } = {}): ControlDto[] {
  return demo.controls
    .filter((c) => !filter.framework || c.framework === filter.framework)
    .filter((c) => !filter.status || c.status === filter.status)
    .map((c, i) => ({
      id: `${c.framework}-${c.code}-${i}`,
      frameworkId: c.framework,
      frameworkSlug: c.framework,
      code: c.code,
      title: c.title,
      domain: c.domain,
      owner: c.owner,
      status: c.status as ControlStatus,
      lastReview: c.lastReview,
      nextReview: c.nextReview,
      evidenceCount: c.evidence,
    }));
}
