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
// interface Dates {
//   checkIn?: string;
//   checkOut?: string;
//   nights?: number;
// }
interface Cost {
  subtotal: number;
  cleaning?: number;
  service?: number;
  total: number;
}
interface BaseItem {
  id?: string;
  title: string;
  location?: string;
  price?: number;
  pricePerNight?: number;
}
interface BookingState {
  reservationId: string;
  type: BookingType;
  item: BaseItem; // ✅ unified
  dates?: { checkIn: string; checkOut: string; nights: number };
  schedule?: { date: string };
  guests?: number;
  tickets?: number;
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
