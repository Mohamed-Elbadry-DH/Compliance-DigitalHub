export type Role = "Admin" | "ComplianceOfficer" | "DepartmentLead" | "Auditor" | "Executive";

export type Permission =
  | "controls.edit" | "risks.edit" | "evidence.upload"
  | "tasks.edit" | "users.manage" | "settings.view";

/** What each role can do. Drives both UI gating and (later) API authorization. */
const MATRIX: Record<Role, Permission[]> = {
  Admin:            ["controls.edit", "risks.edit", "evidence.upload", "tasks.edit", "users.manage", "settings.view"],
  ComplianceOfficer:["controls.edit", "risks.edit", "evidence.upload", "tasks.edit", "settings.view"],
  DepartmentLead:   ["evidence.upload", "tasks.edit"],
  Auditor:          ["settings.view"],           // read-only + can see the audit trail
  Executive:        [],                          // read-only dashboards
};

export const ALL_PERMISSIONS: Permission[] = [
  "controls.edit", "risks.edit", "evidence.upload", "tasks.edit", "users.manage", "settings.view",
];

export const PERMISSION_LABEL: Record<Permission, string> = {
  "controls.edit": "Edit controls",
  "risks.edit": "Edit risks",
  "evidence.upload": "Upload evidence",
  "tasks.edit": "Manage tasks",
  "users.manage": "Manage users",
  "settings.view": "View settings",
};

export const ROLE_LABEL: Record<Role, string> = {
  Admin: "Admin",
  ComplianceOfficer: "Compliance Officer",
  DepartmentLead: "Department Lead",
  Auditor: "Auditor",
  Executive: "Executive",
};

export function can(role: Role, p: Permission): boolean {
  return MATRIX[role].includes(p);
}
export function isReadOnly(role: Role): boolean {
  return role === "Executive" || role === "Auditor";
}
