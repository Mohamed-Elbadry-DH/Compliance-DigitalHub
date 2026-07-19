import { create } from "zustand";

interface UiState {
  activeFramework: string | null;
  setActiveFramework: (slug: string | null) => void;
}

/** Light global UI state (framework filter, later: sidebar, theme). */
export const useUiStore = create<UiState>((set) => ({
  activeFramework: null,
  setActiveFramework: (slug) => set({ activeFramework: slug }),
}));
