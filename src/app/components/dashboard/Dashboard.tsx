import React, { useEffect, useState } from "react";
import ProfileHost from "../ProfileHost";
import { CreditCard, CalendarCheck, Eye, TrendingUp } from "lucide-react";

// 1. Strict Typing
interface AnalyticsOverview {
  totalBookings: number;
  totalEarnings: number;
  totalViews: number;
}

const Dashboard = () => {
  const [overview, setOverview] = useState<AnalyticsOverview>({
    totalBookings: 0,
    totalEarnings: 0,
    totalViews: 0,
  });
  const [loading, setLoading] = useState(true);

  // 2. Safe Currency Formatting Helper
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-NG", {
      style: "currency",
      currency: "NGN",
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const formatNumber = (num: number) => {
    return new Intl.NumberFormat("en-US").format(num);
  };

  useEffect(() => {
    async function fetchData() {
      try {
        const res = await fetch("/api/analytics/overview");

        // Handle non-200 responses
        if (!res.ok) throw new Error("Failed to fetch");

        const data = await res.json();

        // 3. Fallback to 0 if API returns null/undefined
        setOverview({
          totalBookings: data.totalBookings || 0,
          totalEarnings: data.totalEarnings || 0,
          totalViews: data.totalViews || 0,
        });
      } catch (err) {
        console.error("Error fetching analytics:", err);
        // Optional: Set an error state here if you want to show an alert
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  return (
    <div>
      <ProfileHost />

      {/* 4. Skeleton Loading State */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="bg-white p-6 rounded-xl shadow border border-gray-100 animate-pulse"
            >
              <div className="flex justify-between items-start">
                <div className="space-y-3">
                  <div className="h-4 w-24 bg-gray-200 rounded"></div>
                  <div className="h-8 w-32 bg-gray-200 rounded"></div>
                </div>
                <div className="h-10 w-10 bg-gray-200 rounded-full"></div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
          {/* CARD 1: BOOKINGS */}
          <div className="bg-white p-6 rounded-xl shadow border border-gray-100 hover:shadow-md transition-shadow">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="text-sm font-medium text-gray-500">
                  Total Bookings
                </h3>
                <p className="text-3xl font-bold text-gray-900 mt-2">
                  {formatNumber(overview.totalBookings)}
                </p>
                <span className="text-xs font-medium text-green-600 flex items-center gap-1 mt-1">
                  <TrendingUp className="w-3 h-3" /> +12% from last month
                </span>
              </div>
              <div className="p-3 bg-blue-50 rounded-lg">
                <CalendarCheck className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </div>

          {/* CARD 2: EARNINGS */}
          <div className="bg-white p-6 rounded-xl shadow border border-gray-100 hover:shadow-md transition-shadow">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="text-sm font-medium text-gray-500">
                  Total Earnings
                </h3>
                <p className="text-3xl font-bold text-[#00b894] mt-2">
                  {formatCurrency(overview.totalEarnings)}
                </p>
                <span className="text-xs text-gray-400 mt-1 block">
                  Available for withdrawal
                </span>
              </div>
              <div className="p-3 bg-green-50 rounded-lg">
                <CreditCard className="w-6 h-6 text-[#00b894]" />
              </div>
            </div>
          </div>

          {/* CARD 3: VIEWS */}
          <div className="bg-white p-6 rounded-xl shadow border border-gray-100 hover:shadow-md transition-shadow">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="text-sm font-medium text-gray-500">
                  Views This Month
                </h3>
                <p className="text-3xl font-bold text-gray-900 mt-2">
                  {formatNumber(overview.totalViews)}
                </p>
                <span className="text-xs text-gray-400 mt-1 block">
                  Global visits
                </span>
              </div>
              <div className="p-3 bg-purple-50 rounded-lg">
                <Eye className="w-6 h-6 text-purple-600" />
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
