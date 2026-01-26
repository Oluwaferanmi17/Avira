import { useEffect, useState } from "react";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Area,
  AreaChart, // Switched to AreaChart for a better "dashboard" look
} from "recharts";

// 1. Better Number Formatting using Intl API (Robust for currency)
const formatCurrency = (value) =>
  new Intl.NumberFormat("en-NG", {
    style: "currency",
    currency: "NGN",
    maximumSignificantDigits: 3,
  }).format(value);

const earningsData = [
  { month: "Jan", earnings: 120000 },
  { month: "Feb", earnings: 95000 },
  { month: "Mar", earnings: 150000 },
  { month: "Apr", earnings: 180000 },
  { month: "May", earnings: 130000 },
  { month: "Jun", earnings: 200000 },
];

const Analytics = () => {
  const [bookingsData, setBookingsData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null); // Added error state

  useEffect(() => {
    async function fetchData() {
      try {
        // Simulating API delay for demo purposes
        // Remove setTimeout in production
        const res = await fetch("/api/analytics");

        if (!res.ok) throw new Error("Failed to fetch data");

        const data = await res.json();
        setBookingsData(data);
      } catch (err) {
        console.error("Error fetching analytics:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  // 2. Handle Loading State
  if (loading) {
    return (
      <div className="flex h-64 items-center justify-center bg-white rounded-xl shadow">
        <div className="animate-pulse flex flex-col items-center">
          <div className="h-4 w-32 bg-gray-200 rounded mb-4"></div>
          <p className="text-gray-400">Loading Analytics...</p>
        </div>
      </div>
    );
  }

  // 3. Handle Error State
  if (error) {
    return (
      <div className="p-6 bg-red-50 text-red-600 rounded-xl border border-red-200">
        Error loading data: {error}
      </div>
    );
  }

  return (
    <div>
      <div className="space-y-10">
        {/* EARNINGS CHART */}
        <div className="bg-white p-6 rounded-xl shadow border border-gray-100">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold text-gray-800">Earnings</h2>
            <span className="text-sm text-gray-500 bg-gray-100 px-2 py-1 rounded">
              Last 6 Months
            </span>
          </div>

          <ResponsiveContainer width="100%" height={300}>
            {/* Switched to AreaChart for a modern gradient look */}
            <AreaChart data={earningsData}>
              <defs>
                <linearGradient id="colorEarnings" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#00b894" stopOpacity={0.2} />
                  <stop offset="95%" stopColor="#00b894" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid
                strokeDasharray="3 3"
                vertical={false}
                stroke="#eee"
              />
              <XAxis
                dataKey="month"
                axisLine={false}
                tickLine={false}
                tick={{ fill: "#6b7280", fontSize: 12 }}
                dy={10}
              />
              <YAxis
                axisLine={false}
                tickLine={false}
                tickFormatter={(val) => `₦${val / 1000}k`}
                tick={{ fill: "#6b7280", fontSize: 12 }}
              />
              <Tooltip
                formatter={(val) => formatCurrency(val)}
                contentStyle={{
                  borderRadius: "8px",
                  border: "none",
                  boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
                }}
              />
              <Area
                type="monotone"
                dataKey="earnings"
                stroke="#00b894"
                strokeWidth={3}
                fillOpacity={1}
                fill="url(#colorEarnings)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* BOOKINGS BREAKDOWN */}
        <div className="bg-white p-6 rounded-xl shadow border border-gray-100">
          <h2 className="text-xl font-bold text-gray-800 mb-6">
            Bookings Breakdown
          </h2>

          {bookingsData.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={bookingsData} barSize={40}>
                <CartesianGrid
                  strokeDasharray="3 3"
                  vertical={false}
                  stroke="#eee"
                />
                <XAxis
                  dataKey="name"
                  axisLine={false}
                  tickLine={false}
                  dy={10}
                />
                <YAxis axisLine={false} tickLine={false} />
                <Tooltip
                  cursor={{ fill: "transparent" }}
                  contentStyle={{
                    borderRadius: "8px",
                    border: "none",
                    boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
                  }}
                />
                <Bar
                  dataKey="count"
                  fill="#00b894"
                  radius={[6, 6, 0, 0]}
                  animationDuration={1500}
                />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-64 flex items-center justify-center text-gray-400 bg-gray-50 rounded-lg">
              No booking data available
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Analytics;
