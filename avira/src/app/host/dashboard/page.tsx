"use client";
import {
  FaHome,
  FaCalendarAlt,
  FaBook,
  FaStar,
  FaCog,
  FaPlus,
  FaEnvelope,
  FaChartBar,
  FaMoneyBillWave,
  // FaEdit,
  // FaTrash,
} from "react-icons/fa";
import ProfileHost from "../../components/ProfileHost";
import BookingCalendar from "../../components/BookingCalendar";
import {
  // Calendar,
  CalendarDays,
  Edit,
  Eye,
  MessageSquare,
  // Settings,
  Star,
  LayoutDashboard,
} from "lucide-react";
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
} from "recharts";
import Link from "next/link";
import { useSearchParams, useRouter } from "next/navigation";
import NavBar from "@/app/components/NavBar";
import { useState } from "react";
const navItems = [
  { name: "Dashboard", icon: <LayoutDashboard /> },
  { name: "My Listings", icon: <FaHome /> },
  { name: "My Events", icon: <FaCalendarAlt /> },
  { name: "Bookings", icon: <FaBook /> },
  { name: "Messages", icon: <FaEnvelope /> },
  { name: "Reviews", icon: <FaStar /> },
  { name: "Settings", icon: <FaCog /> },
  { name: "Analytics", icon: <FaChartBar /> },
  { name: "Payouts", icon: <FaMoneyBillWave /> },
];
const mockReviews = [
  {
    id: 1,
    guest: "John Doe",
    stay: "Cozy Apartment in Lagos",
    rating: 5,
    comment:
      "Amazing stay! The host was super friendly and the apartment was spotless.",
    date: "Aug 12, 2025",
  },
  {
    id: 2,
    guest: "Sarah Smith",
    stay: "Beach House in Calabar",
    rating: 4,
    comment: "Great location, loved the view. Only wish the Wi-Fi was faster.",
    date: "Jul 28, 2025",
  },
];
const earningsData = [
  { month: "Jan", earnings: 120000 },
  { month: "Feb", earnings: 95000 },
  { month: "Mar", earnings: 150000 },
  { month: "Apr", earnings: 180000 },
  { month: "May", earnings: 130000 },
  { month: "Jun", earnings: 200000 },
];

const bookingsData = [
  { name: "Stays", count: 28 },
  { name: "Events", count: 12 },
  { name: "Experiences", count: 18 },
];

export default function HostDashboard() {
  const [isOpen, setIsOpen] = useState(false);
  const [properties] = useState([
    {
      id: 1,
      name: "Luxury Apartment in Victoria Island",
      location: "Victoria Island, Lagos",
      price: "₦35,000/night",
      rating: 4.8,
      reviews: 24,
      bookings: 18,
      status: "Active",
      image: "/placeholder.svg",
    },
    {
      id: 2,
      name: "Cozy Studio in Lekki",
      location: "Lekki, Lagos",
      price: "₦22,000/night",
      rating: 4.6,
      reviews: 16,
      bookings: 12,
      status: "Active",
      image: "/placeholder.svg",
    },
    {
      id: 3,
      name: "Modern Loft in GRA",
      location: "GRA, Port Harcourt",
      price: "₦28,000/night",
      rating: 4.7,
      reviews: 19,
      bookings: 8,
      status: "Pending",
      image: "/placeholder.svg",
    },
  ]);
  const mockPayouts = [
    {
      id: 1,
      date: "Aug 30, 2025",
      amount: "₦150,000",
      status: "Paid",
    },
    {
      id: 2,
      date: "Aug 15, 2025",
      amount: "₦80,000",
      status: "Paid",
    },
    {
      id: 3,
      date: "Jul 30, 2025",
      amount: "₦200,000",
      status: "Paid",
    },
  ];
  const [bookings] = useState([
    {
      id: 1,
      guest: "John Adebayo",
      property: "Luxury Apartment in Victoria Island",
      checkIn: "Jan 15, 2025",
      checkOut: "Jan 18, 2025",
      amount: "₦105,000",
      status: "Confirmed",
    },
    {
      id: 2,
      guest: "Sarah Johnson",
      property: "Cozy Studio in Lekki",
      checkIn: "Jan 20, 2025",
      checkOut: "Jan 25, 2025",
      amount: "₦110,000",
      status: "Pending",
    },
    {
      id: 3,
      guest: "David Okafor",
      property: "Modern Loft in GRA",
      checkIn: "Jan 22, 2025",
      checkOut: "Jan 24, 2025",
      amount: "₦56,000",
      status: "Confirmed",
    },
  ]);
  const [form, setForm] = useState({
    name: "Jane Doe",
    email: "jane@example.com",
    phone: "+234 801 234 5678",
    payoutMethod: "Bank Transfer",
    bankName: "GTBank",
    accountNumber: "1234567890",
    notifications: true,
  });
  const searchParams = useSearchParams();
  const router = useRouter();
  const activeTab = searchParams.get("tab") || "Dashboard";
  const handleTabClick = (tabName: string) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("tab", tabName);
    router.push(`/host/dashboard?${params.toString()}`);
  };
  const [replies, setReplies] = useState<{ [key: number]: string }>({});
  const handleReply = (id: number, text: string) => {
    setReplies((prev) => ({ ...prev, [id]: text }));
  };
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value, type, checked } = e.target;
    setForm({
      ...form,
      [name]: type === "checkbox" ? checked : value,
    });
  };
  const handleSave = () => {
    alert("✅ Settings saved (mock)!");
  };
  return (
    <div>
      <NavBar />
      <div className="min-h-screen flex bg-white">
        <aside className="w-64 bg-white shadow-md px-4 py-6">
          <h2 className="text-2xl font-bold mb-8 text-[#00b894]">Avira Host</h2>
          <nav className="space-y-4">
            {navItems.map((item) => (
              <button
                key={item.name}
                onClick={() => handleTabClick(item.name)}
                className={`flex items-center w-full gap-3 px-3 py-2 rounded-lg ${
                  activeTab === item.name
                    ? "bg-[#00b894] text-white"
                    : "text-gray-700 hover:bg-gray-100"
                }`}
              >
                {item.icon}
                <span>{item.name}</span>
              </button>
            ))}
          </nav>
        </aside>
        <main className="flex-1 p-8">
          <h1 className="text-3xl font-semibold mb-6">{activeTab}</h1>
          {activeTab === "Dashboard" && (
            <>
              <ProfileHost />
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
                <div className="bg-white p-6 rounded-xl shadow">
                  <h3 className="text-sm text-gray-500">Total Bookings</h3>
                  <p className="text-2xl font-bold mt-2">28</p>
                </div>
                <div className="bg-white p-6 rounded-xl shadow">
                  <h3 className="text-sm text-gray-500">Earnings</h3>
                  <p className="text-2xl font-bold text-gray-900 mt-2">
                    ₦245,000
                  </p>
                </div>
                <div className="bg-white p-6 rounded-xl shadow">
                  <h3 className="text-sm text-gray-500">Views This Month</h3>
                  <p className="text-2xl font-bold mt-2">3,450</p>
                </div>
              </div>
            </>
          )}
          {activeTab === "My Listings" && (
            <div className="mt-4">
              <button className="mb-4 bg-[#00b894] text-white px-4 py-2 rounded-lg flex items-center gap-2">
                <FaPlus /> Add New Stay
              </button>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {properties.map((property) => (
                  <div
                    key={property.id}
                    className="bg-white rounded-xl border shadow-md overflow-hidden max-w-sm"
                  >
                    <div className="aspect-video bg-muted">
                      <img
                        src={property.image}
                        alt={property.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="p-3 space-y-3">
                      <div className="flex items-center justify-between">
                        <h2 className="text-lg font-semibold text-gray-900 line-clamp-1">
                          {property.name}
                        </h2>
                        <span className="text-xs font-semibold bg-gray-900 text-white px-2 py-0.5 rounded-full">
                          {property.status}
                        </span>
                      </div>
                      <div className="text-gray-500 text-sm">
                        {property.location}
                      </div>
                    </div>
                    <div className="text-sm space-y-1 p-4">
                      <div className="space-y-2 mb-4">
                        <div className="flex items-center justify-between text-sm">
                          <span className="font-medium text-gray-700">
                            Price:
                          </span>
                          <span className="font-semibold text-green-600">
                            {property.price}
                          </span>
                        </div>
                        <div className="flex items-center justify-between text-sm">
                          <span>Rating:</span>
                          <div className="flex items-center">
                            <Star className="w-3 h-3 fill-yellow-400 text-yellow-400 mr-1" />
                            <span>
                              {property.rating} ({property.reviews} reviews)
                            </span>
                          </div>
                        </div>
                        <div className="flex items-center justify-between text-sm">
                          <span>Bookings:</span>
                          <span>{property.bookings} total</span>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <button className="flex-1 flex items-center justify-center gap-2 border rounded-lg px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50">
                          <Eye className="w-3 h-3 mr-1" />
                          View
                        </button>
                        <button className="flex-1 flex items-center justify-center gap-2 border rounded-lg px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50">
                          <Edit className="w-3 h-3 mr-1" />
                          Edit
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              <div className="bg-white p-6 rounded-xl shadow">
                <p>No listings yet. Add a new stay!</p>
              </div>
            </div>
          )}
          {activeTab === "My Events" && (
            <div className="mt-4">
              <button className="mb-4 bg-[#00b894] text-white px-4 py-2 rounded-lg flex items-center gap-2">
                <FaPlus /> Host an Event
              </button>
              {/* Map over events */}
              <div className="bg-white p-6 rounded-xl shadow">
                <p>No events yet. Add your first one!</p>
              </div>
            </div>
          )}
          {activeTab === "Bookings" && (
            <div className="mt-4">
              <button
                onClick={() => setIsOpen(true)}
                className="ml-183 mb-4 flex items-center gap-2 px-4 py-2 border rounded-lg bg-gray-50 hover:bg-gray-100 transition"
              >
                <CalendarDays className="w-5 h-5 text-gray-800" />
                <span className="text-gray-800 font-medium">View Calendar</span>
              </button>
              {isOpen && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                  <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-lg">
                    <BookingCalendar />
                    <div className="mt-6 flex justify-end">
                      <button
                        onClick={() => setIsOpen(false)}
                        className="px-4 py-2 bg-[#00b894] text-white rounded-lg hover:bg-[#009f7a] transition"
                      >
                        Close
                      </button>
                    </div>
                  </div>
                </div>
              )}
              <div className="space-y-4">
                {bookings.map((booking) => (
                  <div
                    key={booking.id}
                    className="flex items-center justify-between border rounded-lg p-4 shadow-sm hover:shadow-md transition"
                  >
                    <div>
                      <h2 className="font-semibold text-lg">{booking.guest}</h2>
                      <p className="text-gray-500">{booking.property}</p>
                      <p className="text-sm text-gray-600">
                        {booking.checkIn} - {booking.checkOut}
                      </p>
                      <div className="flex gap-2 mt-3">
                        <button className="flex items-center gap-1 border rounded-md px-3 py-1 text-sm hover:bg-gray-100 transition">
                          <MessageSquare className="w-4 h-4" />
                          Contact Guest
                        </button>
                        <button className="border rounded-md px-3 py-1 text-sm hover:bg-gray-100 transition">
                          View Details
                        </button>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-green-600 font-semibold">
                        {booking.amount}
                      </p>
                      <span
                        className={`inline-block mt-1 px-3 py-1 text-sm rounded-full font-medium ${
                          booking.status === "Confirmed"
                            ? "bg-[#00b894] text-white"
                            : "bg-[#00b894]/20 text-black"
                        }`}
                      >
                        {booking.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
          {activeTab === "Messages" && (
            <div className="rounded-2xl shadow-md">
              <div className="p-4 flex flex-col items-center justify-center">
                <MessageSquare className="w-10 h-10 text-[#00b894] mb-2" />
                <h2 className="text-lg font-semibold">Messages</h2>
                <p className="text-sm text-gray-500 mb-3 text-center">
                  Communicate with guests and respond to inquiries.
                </p>
                <Link href="/host/messages">
                  <button className="px-4 py-2 bg-[#00b894] text-white rounded-lg hover:bg-[#00b894] transition">
                    Open Messages
                  </button>
                </Link>
              </div>
            </div>
          )}
          {activeTab === "Reviews" && (
            <div className="space-y-6">
              {mockReviews.map((review) => (
                <div key={review.id} className="bg-white shadow rounded-xl p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-semibold">{review.guest}</h3>
                      <p className="text-sm text-gray-500">{review.stay}</p>
                    </div>
                    <span className="text-xs text-gray-500">{review.date}</span>
                  </div>
                  <div className="flex items-center gap-1 mt-2">
                    {Array.from({ length: review.rating }).map((_, i) => (
                      <FaStar key={i} className="text-yellow-400" />
                    ))}
                    {Array.from({ length: 5 - review.rating }).map((_, i) => (
                      <FaStar key={i} className="text-gray-300" />
                    ))}
                  </div>
                  <p className="mt-3 text-gray-700">{review.comment}</p>
                  <div className="mt-4">
                    {replies[review.id] ? (
                      <div className="bg-green-50 text-green-800 p-3 rounded-lg text-sm">
                        <span className="font-semibold">Your Reply:</span>{" "}
                        {replies[review.id]}
                      </div>
                    ) : (
                      <div className="flex gap-2">
                        <input
                          type="text"
                          placeholder="Write a reply..."
                          className="flex-1 border rounded-lg px-3 py-2 text-sm outline-none"
                          onKeyDown={(e) => {
                            if (
                              e.key === "Enter" &&
                              e.currentTarget.value.trim()
                            ) {
                              handleReply(review.id, e.currentTarget.value);
                              e.currentTarget.value = "";
                            }
                          }}
                        />
                        <button
                          onClick={() => {
                            const input =
                              document.querySelector<HTMLInputElement>(
                                `#reply-${review.id}`
                              );
                            if (input && input.value.trim()) {
                              handleReply(review.id, input.value);
                              input.value = "";
                            }
                          }}
                          className="bg-[#00b894] text-white px-4 py-2 rounded-lg hover:bg-[#019a7a] text-sm"
                        >
                          Reply
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
          {activeTab === "Settings" && (
            <div className="space-y-6 bg-white p-6 rounded-xl shadow">
              <div>
                <h3 className="font-semibold mb-3">Profile Info</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <input
                    type="text"
                    name="name"
                    value={form.name}
                    onChange={handleChange}
                    placeholder="Full Name"
                    className="border rounded-lg px-3 py-2 w-full"
                  />
                  <input
                    type="email"
                    name="email"
                    value={form.email}
                    onChange={handleChange}
                    placeholder="Email Address"
                    className="border rounded-lg px-3 py-2 w-full"
                  />
                  <input
                    type="text"
                    name="phone"
                    value={form.phone}
                    onChange={handleChange}
                    placeholder="Phone Number"
                    className="border rounded-lg px-3 py-2 w-full"
                  />
                </div>
              </div>
              <div>
                <h3 className="font-semibold mb-3">Payout Info</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <select
                    name="payoutMethod"
                    value={form.payoutMethod}
                    onChange={handleChange}
                    className="border rounded-lg px-3 py-2 w-full"
                  >
                    <option>Bank Transfer</option>
                    <option>PayPal</option>
                    <option>Crypto (USDT)</option>
                  </select>
                  <input
                    type="text"
                    name="bankName"
                    value={form.bankName}
                    onChange={handleChange}
                    placeholder="Bank Name"
                    className="border rounded-lg px-3 py-2 w-full"
                  />
                  <input
                    type="text"
                    name="accountNumber"
                    value={form.accountNumber}
                    onChange={handleChange}
                    placeholder="Account Number"
                    className="border rounded-lg px-3 py-2 w-full"
                  />
                </div>
              </div>
              <div>
                <h3 className="font-semibold mb-3">Preferences</h3>
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    name="notifications"
                    checked={form.notifications}
                    onChange={handleChange}
                    className="w-5 h-5 text-[#00b894]"
                  />
                  Enable Email Notifications
                </label>
              </div>
              <div className="pt-4">
                <button
                  onClick={handleSave}
                  className="bg-[#00b894] text-white px-6 py-3 rounded-lg font-semibold hover:bg-[#019a7a] transition"
                >
                  Save Changes
                </button>
              </div>
            </div>
          )}
          {activeTab === "Analytics" && (
            <div className="space-y-10">
              <div className="bg-white p-6 rounded-xl shadow">
                <h2 className="text-xl font-semibold mb-4">
                  Earnings (Last 6 Months)
                </h2>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={earningsData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis tickFormatter={(val) => `₦${val / 1000}k`} />
                    <Tooltip formatter={(val) => `₦${val}`} />
                    <Line
                      type="monotone"
                      dataKey="earnings"
                      stroke="#00b894"
                      strokeWidth={3}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
              <div className="bg-white p-6 rounded-xl shadow">
                <h2 className="text-xl font-semibold mb-4">
                  Bookings Breakdown
                </h2>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={bookingsData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="count" fill="#00b894" radius={[6, 6, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          )}
          {activeTab === "Payouts" && (
            <div className="space-y-6">
              {/* Summary Card */}
              <div className="bg-white p-6 rounded-xl shadow flex justify-between items-center">
                <div>
                  <h2 className="text-lg font-semibold">
                    Next Scheduled Payout
                  </h2>
                  <p className="text-gray-600 text-sm">
                    Expected on Sep 15, 2025
                  </p>
                </div>
                <div className="flex items-center gap-2 text-[#00b894] text-xl font-bold">
                  <FaMoneyBillWave /> ₦120,000
                </div>
              </div>

              {/* Payout History */}
              <div className="bg-white p-6 rounded-xl shadow">
                <h2 className="text-lg font-semibold mb-4">Payout History</h2>
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b text-gray-600 text-sm">
                      <th className="py-2">Date</th>
                      <th className="py-2">Amount</th>
                      <th className="py-2">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {mockPayouts.map((payout) => (
                      <tr
                        key={payout.id}
                        className="border-b last:border-none hover:bg-gray-50"
                      >
                        <td className="py-2 flex items-center gap-2">
                          <FaCalendarAlt className="text-gray-400" />{" "}
                          {payout.date}
                        </td>
                        <td className="py-2 font-semibold">{payout.amount}</td>
                        <td
                          className={`py-2 font-medium ${
                            payout.status === "Paid"
                              ? "text-green-600"
                              : "text-yellow-600"
                          }`}
                        >
                          {payout.status}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
