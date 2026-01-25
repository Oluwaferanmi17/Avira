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

interface TripFormProps {
  onSubmit: (preferences: TripPreferences) => void;
  isLoading: boolean;
}

/**
 * TripForm
 * Smart form for collecting trip preferences with natural language and structured inputs
 */
export default function TripForm({ onSubmit, isLoading }: TripFormProps) {
  const [formData, setFormData] = useState<Partial<TripPreferences>>({
    destination: "",
    budget: 100000,
    duration: 3,
    travelStyle: "couple",
    interests: [],
    description: "",
  });

  const travelStyles = [
    { value: "solo", label: "Solo Travel", emoji: "👤" },
    { value: "couple", label: "Couples", emoji: "💑" },
    { value: "family", label: "Family", emoji: "👨‍👩‍👧‍👦" },
    { value: "friends", label: "Friends", emoji: "👥" },
    { value: "business", label: "Business", emoji: "💼" },
  ];

  const interestOptions = [
    { value: "food", label: "Food & Dining", emoji: "🍴" },
    { value: "culture", label: "Culture & History", emoji: "🏛️" },
    { value: "adventure", label: "Adventure", emoji: "⛰️" },
    { value: "nightlife", label: "Nightlife", emoji: "🌃" },
    { value: "relaxation", label: "Relaxation", emoji: "🏖️" },
    { value: "shopping", label: "Shopping", emoji: "🛍️" },
    { value: "nature", label: "Nature", emoji: "🌳" },
    { value: "art", label: "Art & Museums", emoji: "🎨" },
  ];

  /**
   * Handle form submission
   */
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isFormValid()) {
      onSubmit(formData as TripPreferences);
    }
  };

  /**
   * Check if form is valid
   */
  const isFormValid = (): boolean => {
    return !!(
      formData.destination &&
      formData.budget &&
      formData.duration &&
      formData.travelStyle &&
      formData.interests &&
      formData.interests.length > 0
    );
  };

  /**
   * Toggle interest selection
   */
  const toggleInterest = (interest: string) => {
    setFormData((prev) => {
      const currentInterests = prev.interests || [];
      const newInterests = currentInterests.includes(interest)
        ? currentInterests.filter((i) => i !== interest)
        : [...currentInterests, interest];

      return { ...prev, interests: newInterests };
    });
  };

  /**
   * Update form field
   */
  const updateField = (field: keyof TripPreferences, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  return (
    <Card className="border-slate-200">
      <CardHeader className="pb-4">
        <CardTitle className="text-xl flex items-center gap-2">
          <span className="text-emerald-600">✨</span>
          Describe Your Trip Vibe
        </CardTitle>
        <p className="text-slate-600 text-sm">
          Tell us what you&apos;re looking for and we&apos;ll create the perfect
          itinerary
        </p>
      </CardHeader>

      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Natural Language Description */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-700">
              Describe your ideal trip in your own words
            </label>
            <Textarea
              placeholder="e.g., '3 days in Abuja, budget ₦100k, love food and culture'"
              value={formData.description}
              onChange={(e) => updateField("description", e.target.value)}
              className="min-h-[80px] resize-none"
            />
            <p className="text-xs text-slate-500">
              The more details you provide, the better we can personalize your
              experience
            </p>
          </div>

          {/* Destination */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-700">
              Destination
            </label>
            <Input
              placeholder="Where do you want to go? e.g., Lagos, Abuja, Calabar..."
              value={formData.destination}
              onChange={(e) => updateField("destination", e.target.value)}
              required
            />
          </div>

          {/* Budget & Duration */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-700">
                Budget (₦)
              </label>
              <Input
                type="number"
                placeholder="100000"
                value={formData.budget}
                onChange={(e) =>
                  updateField("budget", parseInt(e.target.value) || 0)
                }
                min="10000"
                required
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-700">
                Duration (days)
              </label>
              <Input
                type="number"
                placeholder="3"
                value={formData.duration}
                onChange={(e) =>
                  updateField("duration", parseInt(e.target.value) || 1)
                }
                min="1"
                max="14"
                required
              />
            </div>
          </div>

          {/* Travel Style */}
          <div className="space-y-3">
            <label className="text-sm font-medium text-slate-700">
              Travel Style
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {travelStyles.map((style) => (
                <button
                  key={style.value}
                  type="button"
                  onClick={() => updateField("travelStyle", style.value)}
                  className={`p-3 rounded-lg border text-sm transition-all ${
                    formData.travelStyle === style.value
                      ? "border-emerald-500 bg-emerald-50 text-emerald-700"
                      : "border-slate-200 bg-white text-slate-700 hover:border-slate-300"
                  }`}
                >
                  <div className="text-lg mb-1">{style.emoji}</div>
                  {style.label}
                </button>
              ))}
            </div>
          </div>

          {/* Interests */}
          <div className="space-y-3">
            <label className="text-sm font-medium text-slate-700">
              What are you interested in? (Select all that apply)
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {interestOptions.map((interest) => (
                <button
                  key={interest.value}
                  type="button"
                  onClick={() => toggleInterest(interest.value)}
                  className={`p-2 rounded-lg border text-xs transition-all ${
                    formData.interests?.includes(interest.value)
                      ? "border-blue-500 bg-blue-50 text-blue-700"
                      : "border-slate-200 bg-white text-slate-700 hover:border-slate-300"
                  }`}
                >
                  <div className="flex items-center gap-1">
                    <span>{interest.emoji}</span>
                    <span>{interest.label}</span>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Submit Button */}
          <Button
            type="submit"
            disabled={!isFormValid() || isLoading}
            className="w-full bg-gradient-to-r from-emerald-600 to-blue-600 hover:from-emerald-700 hover:to-blue-700"
            size="lg"
          >
            {isLoading ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                Planning Your Trip...
              </>
            ) : (
              <>
                <svg
                  className="w-4 h-4 mr-2"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M13 10V3L4 14h7v7l9-11h-7z"
                  />
                </svg>
                Generate My Itinerary
              </>
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
