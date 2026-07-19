import { create } from "zustand";
import type { Role } from "@/auth/permissions";
import { setAccessToken } from "@/api/client";

export interface SessionUser {
  name: string;
  email: string;
  role: Role;
  title: string;
}

interface AuthState {
  user: SessionUser | null;
  login: (u: SessionUser) => void;
  logout: () => void;
}

/** Session state. In real mode the JWT is attached via setAccessToken (see api/auth). */
export const useAuth = create<AuthState>((set) => ({
  user: null,
  login: (user) => set({ user }),
  logout: () => { setAccessToken(null); set({ user: null }); },
}));
