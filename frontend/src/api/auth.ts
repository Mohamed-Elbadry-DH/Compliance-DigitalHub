import { api, setAccessToken } from "./client";
import type { Role } from "@/auth/permissions";

export interface AuthResult {
  token: string;
  name: string;
  email: string;
  role: Role;
  title?: string;
  tenantId: string;
}

/** Real login against the .NET API (POST /api/auth/login). */
export async function apiLogin(email: string, password: string): Promise<AuthResult> {
  const { data } = await api.post<AuthResult>("/auth/login", { email, password });
  setAccessToken(data.token);         // attach JWT to all subsequent requests
  return data;
}

export function apiLogout() {
  setAccessToken(null);
}
