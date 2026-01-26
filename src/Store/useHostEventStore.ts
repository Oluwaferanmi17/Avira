/* eslint-disable @typescript-eslint/no-explicit-any */
import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
export interface EventLocation {
  country: string;
  city: string;
  venue: string;
}
export type EventCategory =
  | "Festival"
  | "Music"
  | "Art"
  | "Film"
  | "Culture"
  | "";
export interface EventSchedule {
  dates: Date[];
  currency: "USD" | "NGN" | "KES" | "GHS" | "ZAR";
  ticketPrice: number;
  capacity: number;
}
export interface EventDraft {
  title: string;
  description: string;
  category: EventCategory;
  location: EventLocation;
  photos: string[];
  schedule: EventSchedule;
}
interface HostEventState {
  draft: EventDraft;
  reset: () => void;
  setBasic: (
    v: Partial<Pick<EventDraft, "title" | "description" | "category">>
  ) => void;
  setLocation: (v: Partial<EventLocation>) => void;
  addPhotos: (urls: string[]) => void;
  removePhoto: (url: string) => void;
  setSchedule: (v: Partial<EventSchedule>) => void;
}
function getInitialDraft(): EventDraft {
  return {
    title: "",
    description: "",
    category: "",
    location: { country: "", city: "", venue: "" },
    photos: [],
    schedule: {
      dates: [],
      currency: "USD",
      ticketPrice: 20,
      capacity: 100,
    },
  };
}
function reviveDates(draft: EventDraft): EventDraft {
  const dates = Array.isArray(draft?.schedule?.dates)
    ? draft.schedule.dates.map((d: any) =>
        typeof d === "string" ? new Date(d) : d
      )
    : [];
  return { ...draft, schedule: { ...draft.schedule, dates } };
}
export const useHostEventStore = create<HostEventState>()(
  persist(
    (set, get) => ({
      draft: getInitialDraft(),

      reset: () => set({ draft: getInitialDraft() }),

      setBasic: (v) =>
        set((s) => ({
          draft: { ...s.draft, ...v },
        })),

      setLocation: (v) =>
        set((s) => ({
          draft: { ...s.draft, location: { ...s.draft.location, ...v } },
        })),

      addPhotos: (urls: string[] | string) =>
        set((s) => {
          const list = Array.isArray(urls) ? urls : [urls]; // ensure array
          return {
            draft: {
              ...s.draft,
              photos: [
                ...s.draft.photos,
                ...list.filter((u) => !s.draft.photos.includes(u)),
              ],
            },
          };
        }),

      removePhoto: (url) =>
        set((s) => ({
          draft: {
            ...s.draft,
            photos: s.draft.photos.filter((p) => p !== url),
          },
        })),

      setSchedule: (v) =>
        set((s) => ({
          draft: { ...s.draft, schedule: { ...s.draft.schedule, ...v } },
        })),
    }),
    {
      name: "host-event-draft-v1",
      storage: createJSONStorage(() => localStorage),
      migrate: (persisted: any) => {
        const draft = (persisted?.draft as EventDraft) || getInitialDraft();
        return { ...persisted, draft: reviveDates(draft) };
      },
      onRehydrateStorage: () => (state) => {
        if (state) state.draft = reviveDates(state.draft);
      },
      partialize: (s) => ({ draft: s.draft }),
    }
  )
);
