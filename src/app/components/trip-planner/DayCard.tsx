import { useMemo } from "react";
import { Day } from "../../../types/trip-planner";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../../../components/ui/card";
import { Badge } from "../../../components/ui/badge";

// 1. Config moved outside component for performance & cleaner code
const ACTIVITY_STYLES: Record<
  string,
  { bg: string; text: string; icon: string }
> = {
  breakfast: { bg: "bg-orange-100", text: "text-orange-700", icon: "🍳" },
  morning: { bg: "bg-blue-100", text: "text-blue-700", icon: "🌅" },
  lunch: { bg: "bg-green-100", text: "text-green-700", icon: "🍽️" },
  afternoon: { bg: "bg-amber-100", text: "text-amber-700", icon: "☀️" },
  evening: { bg: "bg-indigo-100", text: "text-indigo-700", icon: "🌙" },
  dinner: { bg: "bg-rose-100", text: "text-rose-700", icon: "🍷" },
  nightlife: { bg: "bg-purple-100", text: "text-purple-700", icon: "🎉" },
  accommodation: { bg: "bg-slate-100", text: "text-slate-700", icon: "🛏️" },
};

const DEFAULT_STYLE = {
  bg: "bg-slate-100",
  text: "text-slate-700",
  icon: "📍",
};

interface DayCardProps {
  day: Day;
  dayNumber: number;
}

export default function DayCard({ day, dayNumber }: DayCardProps) {
  // 2. Memoize costly calculations
  const dayCost = useMemo(() => {
    return day.activities.reduce((total, act) => total + (act.cost ?? 0), 0);
  }, [day.activities]);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-NG", {
      style: "currency",
      currency: "NGN",
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const getStyle = (type: string) => {
    // Normalize type to lowercase to ensure matching
    const normalizedType = type.toLowerCase();
    // Partial match check (e.g., "morning_visit" matches "morning")
    const key = Object.keys(ACTIVITY_STYLES).find((k) =>
      normalizedType.includes(k),
    );
    return key ? ACTIVITY_STYLES[key] : DEFAULT_STYLE;
  };

  return (
    <Card className="border-slate-200 shadow-sm bg-white">
      <CardHeader className="pb-6 border-b border-slate-100 bg-slate-50/50 rounded-t-xl">
        <div className="flex justify-between items-center">
          <CardTitle className="text-xl flex items-center gap-3">
            <div className="w-10 h-10 bg-emerald-600 text-white rounded-xl flex items-center justify-center text-lg font-bold shadow-sm">
              {dayNumber}
            </div>
            <div>
              <span className="block text-slate-900">Day {dayNumber}</span>
              <span className="block text-xs font-normal text-slate-500 uppercase tracking-wider mt-0.5">
                {day.activities.length} Activities Planned
              </span>
            </div>
          </CardTitle>
          <div className="text-right">
            <p className="text-xs text-slate-500 uppercase font-bold">
              Est. Cost
            </p>
            <p className="text-lg font-bold text-emerald-700">
              {formatCurrency(dayCost)}
            </p>
          </div>
        </div>
      </CardHeader>

      <CardContent className="pt-8 pb-6">
        <div className="relative">
          {/* 3. The Vertical Timeline Line */}
          <div
            className="absolute left-4 top-2 bottom-6 w-0.5 bg-slate-200"
            aria-hidden="true"
          />

          <div className="space-y-8">
            {day.activities.map((activity, index) => {
              const style = getStyle(activity.type);

              return (
                <div
                  key={`${dayNumber}-${index}`}
                  className="relative pl-12 sm:pl-16 group"
                >
                  {/* Timeline Dot/Icon */}
                  <div
                    className={`absolute left-0 w-8 h-8 rounded-full border-2 border-white shadow-sm flex items-center justify-center z-10 ${style.bg} ${style.text}`}
                    title={activity.type}
                  >
                    <span className="text-sm">{style.icon}</span>
                  </div>

                  {/* Activity Card */}
                  <div className="flex flex-col sm:flex-row gap-3 sm:items-start group-hover:bg-slate-50 rounded-lg p-2 -ml-2 transition-colors">
                    {/* Time Column */}
                    <div className="min-w-[80px] pt-0.5">
                      <p className="text-sm font-bold text-slate-900">
                        {activity.time}
                      </p>
                      <p className="text-xs text-slate-500">
                        {activity.duration}
                      </p>
                    </div>

                    {/* Content Column */}
                    <div className="flex-1 space-y-1.5">
                      <div className="flex justify-between items-start gap-2">
                        <h4 className="font-semibold text-slate-900 text-base leading-tight">
                          {activity.title}
                        </h4>
                        {activity.cost && activity.cost > 0 && (
                          <Badge
                            variant="outline"
                            className="shrink-0 text-slate-600 bg-white border-slate-200"
                          >
                            {formatCurrency(activity.cost)}
                          </Badge>
                        )}
                      </div>

                      <p className="text-sm text-slate-600 leading-relaxed">
                        {activity.description}
                      </p>

                      {/* Location Chip */}
                      {activity.location && (
                        <div className="flex items-center gap-1.5 text-xs text-emerald-600 font-medium mt-2">
                          <svg
                            className="w-3.5 h-3.5"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                            />
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                            />
                          </svg>
                          {activity.location}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
