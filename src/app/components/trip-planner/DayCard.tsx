import { Day } from "../../../types/trip-planner";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../../../components/ui/card";
import { Badge } from "../../../components/ui/badge";

interface DayCardProps {
  day: Day;
  dayNumber: number;
}

export default function DayCard({ day, dayNumber }: DayCardProps) {
  const getActivityColor = (type: string) => {
    const colors = {
      breakfast: "bg-orange-100 text-orange-800 border-orange-200",
      morning: "bg-blue-100 text-blue-800 border-blue-200",
      lunch: "bg-green-100 text-green-800 border-green-200",
      afternoon: "bg-purple-100 text-purple-800 border-purple-200",
      evening: "bg-indigo-100 text-indigo-800 border-indigo-200",
      accommodation: "bg-slate-100 text-slate-800 border-slate-200",
    };
    return (
      colors[type as keyof typeof colors] ||
      "bg-gray-100 text-gray-800 border-gray-200"
    );
  };

  const getActivityIcon = (type: string) => {
    const icons = {
      breakfast: "🍳",
      morning: "🌅",
      lunch: "🍽️",
      afternoon: "🏃",
      evening: "🌃",
      accommodation: "🏨",
    };
    return icons[type as keyof typeof icons] || "📍";
  };

  const dayCost = day.activities.reduce(
    (total, activity) => total + (activity.cost ?? 0),
    0
  );

  return (
    <Card className="border-slate-200">
      <CardHeader className="pb-4">
        <div className="flex justify-between items-center">
          <CardTitle className="text-xl flex items-center gap-2">
            <span className="w--8 h-8 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center text-sm font-semibold">
              {dayNumber}
            </span>
            Day {dayNumber} Itinerary
          </CardTitle>
          <Badge variant="secondary" className="bg-slate-100 text-slate-700">
            ₦{dayCost.toLocaleString()}
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {day.activities.map((activity, index) => (
          <div
            key={`${dayNumber}-${index}-${activity.title}`} // ✅ fixed key
            className={`flex gap-4 p-4 rounded-lg border ${
              index === 0
                ? "bg-gradient-to-r from-orange-50 to-orange-25 border-orange-200"
                : index === day.activities.length - 1
                ? "bg-gradient-to-r from-indigo-50 to-indigo-25 border-indigo-200"
                : "bg-white border-slate-200"
            }`}
          >
            {/* Time */}
            <div className="flex-shrink-0">
              <div className="w-16 text-center">
                <div className="text-sm font-semibold text-slate-900">
                  {activity.time}
                </div>
                <div className="text-xs text-slate-500">
                  {activity.duration}
                </div>
              </div>
            </div>

            {/* Icon */}
            <div className="flex-shrink-0">
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center text-lg ${getActivityColor(
                  activity.type
                )}`}
              >
                {getActivityIcon(activity.type)}
              </div>
            </div>

            {/* Content */}
            <div className="flex-1 min-w-0">
              <div className="flex items-start justify-between mb-1">
                <h4 className="font-semibold text-slate-900 text-sm">
                  {activity.title}
                </h4>
                <Badge
                  variant="secondary"
                  className="bg-white text-slate-700 border-slate-200 text-xs"
                >
                  ₦{activity.cost ? activity.cost.toLocaleString() : "0"}
                </Badge>
              </div>
              <p className="text-slate-600 text-sm mb-2">
                {activity.description}
              </p>

              {activity.location && (
                <div className="flex items-center gap-1 text-xs text-slate-500">
                  <svg
                    className="w-3 h-3"
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
        ))}

        {/* Day Summary */}
        <div className="bg-slate-50 rounded-lg p-4 border border-slate-200">
          <div className="flex justify-between items-center text-sm">
            <span className="font-medium text-slate-700">
              Day {dayNumber} Total:
            </span>
            <span className="font-semibold text-slate-900">
              ₦{dayCost.toLocaleString()}
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
