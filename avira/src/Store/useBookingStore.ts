import { create } from "zustand";
import { persist } from "zustand/middleware";

type BookingType = "stay" | "event" | "experience";

interface BaseItem {
  id?: string;
  title: string;
  location?: string;
  price?: number;
  pricePerNight?: number;
}

interface Cost {
  subtotal: number;
  cleaning?: number;
  service?: number;
  total: number;
}

interface BookingState {
  reservationId: string;
  dbId?: string;

  // Optional depending on type
  stay?: {
    id: string;
    title: string;
    description: string;
    photos: string[];
    amenities: string[];
    pricePerNight: number;
    address?: { city: string; country: string; line1: string };
  };

  event?: {
    id: string;
    title: string;
    location: string;
    dateStart: string;
    dateEnd: string;
    image: string;
  };

  experience?: {
    id: string;
    title: string;
    location: string;
    duration: string;
    price: number;
    image: string;
  };

  type: BookingType;
  item: BaseItem; // ✅ shared across all types

  // Dates (stays), Schedule (events), Participants (experiences)
  dates?: { checkIn: string; checkOut: string; nights: number };
  schedule?: { date: string };
  guests?: number;
  tickets?: number;
  participants?: number;

  cost: Cost;
  createdAt: string;
  note?: string;
}

interface BookingStore {
  booking: BookingState | null;
  setBooking: (data: BookingState) => void;
  clearBooking: () => void;
}

export const useBookingStore = create<BookingStore>()(
  persist(
    (set) => ({
      booking: null,
      setBooking: (data) => set({ booking: data }),
      clearBooking: () => set({ booking: null }),
    }),
    { name: "avira-booking" }
  )
);
