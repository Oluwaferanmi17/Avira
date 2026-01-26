import { create } from "zustand";

/* ================= TYPES ================= */

export interface ExperienceDraft {
  title: string;
  description: string;
  category: string;
  duration: string;
  highlights: string[];
  photos: string[];
  location: {
    country: string;
    city: string;
    venue: string;
  };
  schedule: {
    availableDays: WeekDay[];
    price: number;
  };
}

export type WeekDay =
  | "MONDAY"
  | "TUESDAY"
  | "WEDNESDAY"
  | "THURSDAY"
  | "FRIDAY"
  | "SATURDAY"
  | "SUNDAY";

interface HostExperienceStore {
  draft: ExperienceDraft;

  setBasic: (
    data: Partial<Pick<ExperienceDraft, "title" | "description" | "category">>,
  ) => void;

  setDetails: (
    data: Partial<{ duration: string; highlights: string[] }>,
  ) => void;

  setLocation: (data: Partial<ExperienceDraft["location"]>) => void;

  addPhotos: (photos: string[]) => void;
  removePhoto: (index: number) => void;

  setSchedule: (data: Partial<ExperienceDraft["schedule"]>) => void;

  reset: () => void;
}

/* ================= INITIAL STATE ================= */

const initialDraft: ExperienceDraft = {
  title: "",
  description: "",
  category: "",
  duration: "",
  highlights: [],
  photos: [],
  location: {
    country: "",
    city: "",
    venue: "",
  },
  schedule: {
    availableDays: [], // ✅ EMPTY ARRAY, NOT WeekDay[]
    price: 0, // ✅ NUMBER VALUE, NOT number
  },
};

/* ================= STORE ================= */

export const useHostExperienceStore = create<HostExperienceStore>((set) => ({
  draft: initialDraft,

  setBasic: (data) =>
    set((state) => ({
      draft: { ...state.draft, ...data },
    })),

  setDetails: (data) =>
    set((state) => ({
      draft: {
        ...state.draft,
        ...data,
      },
    })),

  setLocation: (data) =>
    set((state) => ({
      draft: {
        ...state.draft,
        location: { ...state.draft.location, ...data },
      },
    })),

  addPhotos: (photos) =>
    set((state) => ({
      draft: {
        ...state.draft,
        photos: [...state.draft.photos, ...photos],
      },
    })),

  removePhoto: (index) =>
    set((state) => ({
      draft: {
        ...state.draft,
        photos: state.draft.photos.filter((_, i) => i !== index),
      },
    })),

  setSchedule: (data) =>
    set((state) => ({
      draft: {
        ...state.draft,
        schedule: { ...state.draft.schedule, ...data },
      },
    })),

  reset: () => set({ draft: initialDraft }),
}));
