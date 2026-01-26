import { getAnalytics } from "@/app/actions/getAnalytics";
import ProfileHost from "@/app/components/ProfileHost";
// import //   ResponsiveContainer,
// //   BarChart,
// //   Bar,
// //   XAxis,
// //   YAxis,
// //   CartesianGrid,
// //   Tooltip,
// "recharts";

export default async function HostDashboard() {
  const analytics = await getAnalytics();

  if (!analytics) {
    return (
      <p className="text-center text-gray-500 mt-10">
        Unable to load analytics
      </p>
    );
  }

  return (
    <>
      <ProfileHost />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
        <div className="bg-white p-6 rounded-xl shadow">
          <h3 className="text-sm text-gray-500">Total Bookings</h3>
          <p className="text-2xl font-bold mt-2">{analytics.totalBookings}</p>
        </div>
        <div className="bg-white p-6 rounded-xl shadow">
          <h3 className="text-sm text-gray-500">Earnings</h3>
          <p className="text-2xl font-bold text-gray-900 mt-2">
            ₦{analytics.totalEarnings.toLocaleString()}
          </p>
        </div>
        <div className="bg-white p-6 rounded-xl shadow">
          <h3 className="text-sm text-gray-500">Views This Month</h3>
          {/* <p className="text-2xl font-bold mt-2">{analytics.totalViews}</p> */}
          <p className="text-2xl font-bold mt-2">3,450</p>
        </div>
      </div>

      {/* Analytics Chart */}
      {/* <div className="bg-white p-6 rounded-xl shadow mt-6">
        <h2 className="text-xl font-semibold mb-4">Bookings Breakdown</h2>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={analytics.breakdown}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="count" fill="#00b894" radius={[6, 6, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div> */}
    </>
  );
}
