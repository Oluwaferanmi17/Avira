import { create } from "zustand";
import { persist } from "zustand/middleware";
interface WishlistStay {
  id: string;
  title: string;
  photos?: string[];
  address?: {
    city: string;
    country: string;
  } | null;
  pricing?: {
    basePrice: number;
    cleaningFee: number;
    serviceFee: number;
  } | null;
}
interface WishlistState {
  favourites: WishlistStay[];
  toggleFavourite: (stay: WishlistStay) => void;
  isFavourite: (id: string) => boolean;
}
export const useWishlistStore = create<WishlistState>()(
  persist(
    (set, get) => ({
      favourites: [],
      toggleFavourite: (stay) => {
        const { favourites } = get();
        const exists = favourites.find((s) => s.id === stay.id);
        if (exists) {
          set({ favourites: favourites.filter((s) => s.id !== stay.id) });
        } else {
          set({ favourites: [...favourites, stay] });
        }
      },
      isFavourite: (id) => get().favourites.some((s) => s.id === id),
    }),
    { name: "wishlist-storage" }
  )
);
