import { create } from "zustand";
export interface DateRange {
  /** Start date */
  from?: Date;
  /** End date */
  to?: Date;
}
export type SortKey = "relevance" | "price-asc" | "price-desc" | "name-asc";

interface BrowseState {
  query: string;
  dateRange: DateRange;
  sort: SortKey;
  favorites: Record<string, boolean>;
  setQuery: (q: string) => void;
  setDateRange: (r: DateRange) => void;
  setSort: (s: SortKey) => void;
  toggleFavorite: (id: string) => void;
  isFavorite: (id: string) => boolean;
  clear: () => void;
}
export const useBrowseStore = create<BrowseState>((set, get) => ({
  query: "",
  dateRange: {},
  sort: "relevance",
  favorites: {},
  setQuery: (q) => set({ query: q }),
  setDateRange: (r) => set({ dateRange: r }),
  setSort: (s) => set({ sort: s }),
  toggleFavorite: (id) =>
    set((state) => ({
      favorites: { ...state.favorites, [id]: !state.favorites[id] },
    })),
  isFavorite: (id) => !!get().favorites[id],
  clear: () => set({ query: "", dateRange: {}, sort: "relevance" }),
}));
