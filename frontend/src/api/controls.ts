import { api } from "./client";
import { DEMO, demoControls } from "./demo";

export type ControlStatus = "Compliant" | "InProgress" | "Gap" | "NotApplicable";

export interface ControlDto {
  id: string;
  frameworkId: string;
  frameworkSlug: string;
  code: string;
  title: string;
  domain: string;
  owner?: string;
  status: ControlStatus;
  lastReview?: string;
  nextReview?: string;
  evidenceCount: number;
}

export async function getControls(params: { framework?: string; status?: ControlStatus } = {}) {
  if (DEMO) return Promise.resolve(demoControls(params));
  const { data } = await api.get<ControlDto[]>("/controls", { params });
  return data;
}

export async function updateControl(id: string, body: Partial<ControlDto> & { status: ControlStatus }) {
  if (DEMO) return Promise.resolve();
  await api.put(`/controls/${id}`, { id, ...body });
}
