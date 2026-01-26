"use client";
import {
  FaHome,
  FaCalendarAlt,
  FaBook,
  FaStar,
  FaCog,
  FaEnvelope,
  FaChartBar,
  FaMoneyBillWave,
  FaCompass,
} from "react-icons/fa";
import { LayoutDashboard } from "lucide-react";
import { useSearchParams, useRouter } from "next/navigation";
import NavBar from "@/app/components/Home/NavBar";
import Listing from "@/app/components/dashboard/Listing";
import Bookings from "@/app/components/dashboard/Bookings";
import Messages from "@/app/components/dashboard/Messages";
import Reviews from "@/app/components/dashboard/Reviews";
import Settings from "@/app/components/dashboard/Settings";
import Analytics from "@/app/components/dashboard/Analytics";
import Payouts from "@/app/components/dashboard/Payouts";
import Dashboard from "@/app/components/dashboard/Dashboard";
import HostEvent from "@/app/components/dashboard/HostEvent";
import HostExperience from "@/app/components/dashboard/HostExperience";

const navItems = [
  { name: "Dashboard", icon: <LayoutDashboard /> },
  { name: "My Listings", icon: <FaHome /> },
  { name: "My Events", icon: <FaCalendarAlt /> },
  { name: "My Experience", icon: <FaCompass /> },
  { name: "Bookings", icon: <FaBook /> },
  { name: "Messages", icon: <FaEnvelope /> },
  { name: "Reviews", icon: <FaStar /> },
  { name: "Settings", icon: <FaCog /> },
  { name: "Analytics", icon: <FaChartBar /> },
  { name: "Payouts", icon: <FaMoneyBillWave /> },
];

export default function HostDashboard() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const activeTab = searchParams.get("tab") || "Dashboard";

  const handleTabClick = (tabName: string) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("tab", tabName);
    router.push(`/host/dashboard?${params.toString()}`);
  };

  return (
    <div>
      <NavBar />
      <div className="min-h-screen flex bg-white">
        <aside className="w-64 bg-white shadow-md px-4 py-6 ">
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
          {activeTab === "Dashboard" && <Dashboard />}
          {activeTab === "My Listings" && <Listing />}
          {activeTab === "My Events" && <HostEvent />}
          {activeTab === "My Experience" && <HostExperience />}
          {activeTab === "Bookings" && <Bookings />}
          {activeTab === "Messages" && <Messages />}
          {activeTab === "Reviews" && <Reviews />}
          {activeTab === "Settings" && <Settings />}
          {activeTab === "Analytics" && <Analytics />}
          {activeTab === "Payouts" && <Payouts />}
        </main>
      </div>
    </div>
  );
}
