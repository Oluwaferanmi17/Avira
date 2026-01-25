export interface TripPreferences {
  destination: string;
  budget: number;
  duration: number;
  travelStyle: "solo" | "couple" | "family" | "friends" | "business";
  interests: string[];
  description: string;
}
interface Activity {
  id?: string;
  bookingId?: string; // ID of the real Stay, Event, or Experience
  bookingType?: "stay" | "event" | "experience"; // The type of real data
  type:
  | "breakfast"
  | "morning"
  | "lunch"
  | "afternoon"
  | "evening"
  | "accommodation";
  time?: string;
  title: string;
  description: string;
  cost: number;
  duration?: string;
  location?: string;
}
export interface Day {
  day: number;
  activities: Activity[];
}
export interface Itinerary {
  id?: string;
  destination: string;
  duration: number;
  budget: number;
  travelStyle: string;
  days: Day[];
  totalCost: number;
  createdAt?: Date;
  itinerarySummary?: string;
}
