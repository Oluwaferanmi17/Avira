/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from "react";
import { Button } from "../../../components/ui/button";
import { Input } from "../../../components/ui/input";
import { Textarea } from "../../../components/ui/textarea";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../../../components/ui/card";
import { TripPreferences } from "../../../types/trip-planner";

// 1. Static data moved outside to prevent re-creation on render
const TRAVEL_STYLES = [
  { value: "solo", label: "Solo Travel", emoji: "👤" },
  { value: "couple", label: "Couples", emoji: "💑" },
  { value: "family", label: "Family", emoji: "👨‍👩‍👧‍👦" },
  { value: "friends", label: "Friends", emoji: "👥" },
  { value: "business", label: "Business", emoji: "💼" },
] as const;

const INTEREST_OPTIONS = [
  { value: "food", label: "Food & Dining", emoji: "🍴" },
  { value: "culture", label: "Culture & History", emoji: "🏛️" },
  { value: "adventure", label: "Adventure", emoji: "⛰️" },
  { value: "nightlife", label: "Nightlife", emoji: "🌃" },
  { value: "relaxation", label: "Relaxation", emoji: "🏖️" },
  { value: "shopping", label: "Shopping", emoji: "🛍️" },
  { value: "nature", label: "Nature", emoji: "🌳" },
  { value: "art", label: "Art & Museums", emoji: "🎨" },
] as const;

interface TripFormProps {
  onSubmit: (preferences: TripPreferences) => void;
  isLoading: boolean;
}

export default function TripForm({ onSubmit, isLoading }: TripFormProps) {
  const [formData, setFormData] = useState<TripPreferences>({
    destination: "",
    budget: 100000,
    duration: 3,
    travelStyle: "couple",
    interests: [],
    description: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isFormValid) {
      onSubmit(formData);
    }
  };

  // Memo-like check (calculated on every render is fine for this size)
  const isFormValid =
    formData.destination.trim().length > 0 &&
    formData.budget > 0 &&
    formData.duration > 0 &&
    formData.travelStyle &&
    formData.interests.length > 0;

  const toggleInterest = (interest: string) => {
    setFormData((prev) => {
      const current = prev.interests || [];
      const updated = current.includes(interest)
        ? current.filter((i) => i !== interest)
        : [...current, interest];
      return { ...prev, interests: updated };
    });
  };

  // 2. Type-safe field updater
  const updateField = <K extends keyof TripPreferences>(
    field: K,
    value: TripPreferences[K],
  ) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  // Helper to format currency for display only
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-NG", {
      style: "currency",
      currency: "NGN",
      maximumFractionDigits: 0,
    }).format(amount);
  };

  return (
    <Card className="border-slate-200 shadow-sm">
      <CardHeader className="pb-4">
        <CardTitle className="text-xl flex items-center gap-2">
          <span className="text-emerald-600">✨</span>
          Describe Your Trip Vibe
        </CardTitle>
        <p className="text-slate-600 text-sm">
          Tell us what you&apos;re looking for and we&apos;ll create the perfect
          itinerary.
        </p>
      </CardHeader>

      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Natural Language Description */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-700">
              Describe your ideal trip (Optional)
            </label>
            <Textarea
              placeholder="e.g., '3 days in Abuja, budget ₦100k, love food and culture'"
              value={formData.description}
              onChange={(e) => updateField("description", e.target.value)}
              className="min-h-[80px] resize-none focus-visible:ring-emerald-500"
            />
          </div>

          {/* Destination */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-700">
              Destination <span className="text-red-500">*</span>
            </label>
            <Input
              placeholder="Where do you want to go?"
              value={formData.destination}
              onChange={(e) => updateField("destination", e.target.value)}
              className="focus-visible:ring-emerald-500"
              required
            />
          </div>

          {/* Budget & Duration */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-700">
                Budget (₦) <span className="text-red-500">*</span>
              </label>
              <Input
                type="number"
                placeholder="100000"
                value={formData.budget}
                onChange={(e) => updateField("budget", Number(e.target.value))}
                min={10000}
                required
                className="focus-visible:ring-emerald-500"
              />
              {/* UX Helper: Shows formatted currency */}
              <p className="text-xs text-emerald-600 font-medium text-right">
                {formatCurrency(formData.budget)}
              </p>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-700">
                Duration (days) <span className="text-red-500">*</span>
              </label>
              <Input
                type="number"
                value={formData.duration}
                onChange={(e) =>
                  updateField("duration", Number(e.target.value))
                }
                min={1}
                max={14}
                required
                className="focus-visible:ring-emerald-500"
              />
            </div>
          </div>

          {/* Travel Style */}
          <div className="space-y-3">
            <label className="text-sm font-medium text-slate-700">
              Travel Style <span className="text-red-500">*</span>
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {TRAVEL_STYLES.map((style) => (
                <button
                  key={style.value}
                  type="button"
                  aria-pressed={formData.travelStyle === style.value}
                  onClick={() => updateField("travelStyle", style.value)}
                  className={`p-3 rounded-lg border text-sm transition-all flex flex-col items-center justify-center gap-1
                    ${
                      formData.travelStyle === style.value
                        ? "border-emerald-500 bg-emerald-50 text-emerald-700 ring-1 ring-emerald-500"
                        : "border-slate-200 bg-white text-slate-700 hover:border-slate-300 hover:bg-slate-50"
                    }`}
                >
                  <span className="text-lg">{style.emoji}</span>
                  <span>{style.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Interests */}
          <div className="space-y-3">
            <label className="text-sm font-medium text-slate-700">
              Interests <span className="text-red-500">*</span>
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {INTEREST_OPTIONS.map((interest) => {
                const isSelected = formData.interests.includes(interest.value);
                return (
                  <button
                    key={interest.value}
                    type="button"
                    aria-pressed={isSelected}
                    onClick={() => toggleInterest(interest.value)}
                    className={`p-2 rounded-lg border text-xs transition-all flex items-center justify-center gap-1.5
                      ${
                        isSelected
                          ? "border-blue-500 bg-blue-50 text-blue-700 ring-1 ring-blue-500"
                          : "border-slate-200 bg-white text-slate-700 hover:border-slate-300 hover:bg-slate-50"
                      }`}
                  >
                    <span>{interest.emoji}</span>
                    <span>{interest.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Submit Button */}
          <Button
            type="submit"
            disabled={!isFormValid || isLoading}
            className="w-full bg-gradient-to-r from-emerald-600 to-blue-600 hover:from-emerald-700 hover:to-blue-700 transition-all duration-300 shadow-md hover:shadow-lg"
            size="lg"
          >
            {isLoading ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                Planning Your Trip...
              </>
            ) : (
              <>
                <span className="mr-2">🚀</span> Generate My Itinerary
              </>
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
