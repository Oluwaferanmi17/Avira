/* eslint-disable @typescript-eslint/no-explicit-any */
import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
export interface Address {
  country: string;
  city: string;
  line1: string;
  lat?: number;
  lng?: number;
}
export interface Pricing {
  currency: "USD" | "NGN" | "KES" | "GHS" | "ZAR";
  basePrice: number;
  cleaningFee: number;
  serviceFee: number;
}
export interface Availability {
  unavailable: Date[];
}
export interface Capacity {
  guests: number;
  bedrooms: number;
  beds: number;
  baths: number;
}
export interface HostDraft {
  title: string;
  description: string;
  homeType: "" | "entire" | "private" | "shared" | "boutique";
  photos: string[];
  address: Address;
  pricing: Pricing;
  availability: Availability;
  amenities: string[];
  capacity: Capacity;
  rules: string[];
  additionalRules: string;
}
interface HostCreateState {
  draft: HostDraft;
  reset: () => void;
  setBasic: (v: {
    title?: string;
    description?: string;
    homeType?: HostDraft["homeType"];
  }) => void;
  addPhoto: (url: string) => void;
  removePhoto: (url: string) => void;
  setAddress: (v: Partial<Address>) => void;
  setPricing: (v: Partial<Pricing>) => void;
  setAvailability: (dates: Date[]) => void;
  toggleAmenity: (amenity: string) => void;
  setCapacity: (v: Partial<Capacity>) => void;
  toggleRule: (rule: string) => void;
  setAdditionalRules: (text: string) => void;
}
function getInitialDraft(): HostDraft {
  return {
    title: "",
    description: "",
    homeType: "",
    photos: [],
    address: {
      country: "",
      city: "",
      line1: "",
      lat: undefined,
      lng: undefined,
    },
    pricing: { currency: "USD", basePrice: 50, cleaningFee: 0, serviceFee: 0 },
    availability: { unavailable: [] },
    amenities: [],
    capacity: { guests: 2, bedrooms: 1, beds: 1, baths: 1 },
    rules: [],
    additionalRules: "",
  };
}
function reviveDates(draft: HostDraft): HostDraft {
  const revived: Date[] = Array.isArray(draft.availability?.unavailable)
    ? draft.availability.unavailable.map((d: any) =>
        typeof d === "string" ? new Date(d) : d
      )
    : [];
  return {
    ...draft,
    availability: { unavailable: revived },
  };
}
export const useHostCreateStore = create<HostCreateState>()(
  persist(
    (set, get) => ({
      draft: getInitialDraft(),
      reset: () => set({ draft: getInitialDraft() }),
      setBasic: (v) =>
        set((s) => ({
          draft: { ...s.draft, ...v },
        })),
      addPhoto: (url) =>
        set((s) => ({
          draft: s.draft.photos.includes(url)
            ? s.draft
            : { ...s.draft, photos: [...s.draft.photos, url] },
        })),
      removePhoto: (url) =>
        set((s) => ({
          draft: {
            ...s.draft,
            photos: s.draft.photos.filter((p) => p !== url),
          },
        })),
      setAddress: (v) =>
        set((s) => ({
          draft: { ...s.draft, address: { ...s.draft.address, ...v } },
        })),
      setPricing: (v) =>
        set((s) => ({
          draft: { ...s.draft, pricing: { ...s.draft.pricing, ...v } },
        })),
      setAvailability: (dates) =>
        set((s) => ({
          draft: { ...s.draft, availability: { unavailable: dates } },
        })),
      toggleAmenity: (amenity) =>
        set((s) => {
          const exists = s.draft.amenities.includes(amenity);
          return {
            draft: {
              ...s.draft,
              amenities: exists
                ? s.draft.amenities.filter((a) => a !== amenity)
                : [...s.draft.amenities, amenity],
            },
          };
        }),
      setCapacity: (v) =>
        set((s) => ({
          draft: { ...s.draft, capacity: { ...s.draft.capacity, ...v } },
        })),
      toggleRule: (rule) =>
        set((s) => {
          const exists = s.draft.rules.includes(rule);
          return {
            draft: {
              ...s.draft,
              rules: exists
                ? s.draft.rules.filter((r) => r !== rule)
                : [...s.draft.rules, rule],
            },
          };
        }),

      setAdditionalRules: (text) =>
        set((s) => ({
          draft: { ...s.draft, additionalRules: text },
        })),
    }),
    {
      name: "host-create-draft-v2",
      version: 2,
      storage: createJSONStorage(() => localStorage),
      migrate: (persisted: any, version) => {
        if (!persisted || typeof persisted !== "object")
          return { draft: getInitialDraft() };
        const prevDraft = (persisted.draft || getInitialDraft()) as HostDraft;
        const withDefaults: HostDraft = {
          ...prevDraft,
          capacity: prevDraft.capacity || {
            guests: 2,
            bedrooms: 1,
            beds: 1,
            baths: 1,
          },
          rules: prevDraft.rules || [],
          additionalRules: prevDraft.additionalRules || "",
        };
        const revived = reviveDates(withDefaults);
        return { ...persisted, draft: revived };
      },
      onRehydrateStorage: () => (state) => {
        if (state) {
          state.draft = reviveDates(state.draft);
        }
      },
      partialize: (s) => ({ draft: s.draft }),
    }
  )
);
