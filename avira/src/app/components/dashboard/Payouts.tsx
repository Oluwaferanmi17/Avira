import React, { useEffect, useState } from "react";
import {
  FaCalendarAlt,
  FaMoneyBillWave,
  FaDownload,
  FaExclamationCircle,
} from "react-icons/fa";
import { Download, TrendingUp } from "lucide-react"; // Mixing icons for best UI

// 1. Strict Typing
interface Payout {
  id: string;
  date: string;
  amount: number;
  status: "Paid" | "Pending" | "Failed";
  reference?: string;
}

interface PayoutSummary {
  nextPayoutDate: string | null;
  nextPayoutAmount: number;
  totalEarnings: number;
}

const Payouts = () => {
  const [payouts, setPayouts] = useState<Payout[]>([]);
  const [summary, setSummary] = useState<PayoutSummary>({
    nextPayoutDate: null,
    nextPayoutAmount: 0,
    totalEarnings: 0,
  });
  const [loading, setLoading] = useState(true);

  // 2. Currency Formatter (NGN)
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-NG", {
      style: "currency",
      currency: "NGN",
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString("en-GB", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Simulating an API call - Replace with your actual endpoints
        // const res = await fetch("/api/payouts");
        // const data = await res.json();

        // Mocking response for demonstration
        setTimeout(() => {
          setPayouts([
            {
              id: "1",
              date: "2025-08-30",
              amount: 150000,
              status: "Paid",
              reference: "REF-001",
            },
            {
              id: "2",
              date: "2025-08-15",
              amount: 80000,
              status: "Paid",
              reference: "REF-002",
            },
            {
              id: "3",
              date: "2025-09-15",
              amount: 120000,
              status: "Pending",
              reference: "REF-003",
            },
          ]);
          setSummary({
            nextPayoutDate: "2025-09-15",
            nextPayoutAmount: 120000,
            totalEarnings: 450000,
          });
          setLoading(false);
        }, 1000);
      } catch (err) {
        console.error("Failed to load payouts", err);
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // 3. Status Badge Helper
  const getStatusColor = (status: string) => {
    switch (status) {
      case "Paid":
        return "bg-green-100 text-green-700 border-green-200";
      case "Pending":
        return "bg-yellow-100 text-yellow-700 border-yellow-200";
      case "Failed":
        return "bg-red-100 text-red-700 border-red-200";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  if (loading) {
    return (
      <div className="space-y-6 animate-pulse">
        <div className="h-24 bg-gray-200 rounded-xl w-full"></div>
        <div className="h-64 bg-gray-200 rounded-xl w-full"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* 4. Enhanced Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Next Payout Card */}
        <div className="bg-white p-6 rounded-xl shadow border border-gray-100 flex justify-between items-center relative overflow-hidden">
          <div className="relative z-10">
            <h2 className="text-sm font-medium text-gray-500 uppercase tracking-wide">
              Next Payout
            </h2>
            <div className="flex items-baseline gap-2 mt-1">
              <span className="text-2xl font-bold text-gray-900">
                {formatCurrency(summary.nextPayoutAmount)}
              </span>
            </div>
            <p className="text-xs text-gray-500 mt-2 flex items-center gap-1">
              <FaCalendarAlt /> Expected: {formatDate(summary.nextPayoutDate!)}
            </p>
          </div>
          <div className="p-3 bg-[#00b894]/10 rounded-full text-[#00b894]">
            <FaMoneyBillWave className="w-6 h-6" />
          </div>
        </div>

        {/* Total Earnings Card */}
        <div className="bg-white p-6 rounded-xl shadow border border-gray-100 flex justify-between items-center">
          <div>
            <h2 className="text-sm font-medium text-gray-500 uppercase tracking-wide">
              Total Earnings
            </h2>
            <p className="text-2xl font-bold text-gray-900 mt-1">
              {formatCurrency(summary.totalEarnings)}
            </p>
            <p className="text-xs text-green-600 mt-2 flex items-center gap-1 font-medium">
              <TrendingUp className="w-3 h-3" /> All time
            </p>
          </div>
          <div className="p-3 bg-blue-50 rounded-full text-blue-600">
            <TrendingUp className="w-6 h-6" />
          </div>
        </div>
      </div>

      {/* 5. Payout History Table */}
      <div className="bg-white rounded-xl shadow border border-gray-100 overflow-hidden">
        <div className="p-6 border-b border-gray-100 flex justify-between items-center">
          <h2 className="text-lg font-bold text-gray-800">Payout History</h2>
          <button className="flex items-center gap-2 text-sm text-gray-500 hover:text-[#00b894] transition">
            <Download className="w-4 h-4" /> Export CSV
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-gray-50 text-gray-500 text-xs uppercase font-medium">
              <tr>
                <th className="px-6 py-4">Date</th>
                <th className="px-6 py-4">Amount</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4 text-right">Invoice</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {payouts.length > 0 ? (
                payouts.map((payout) => (
                  <tr
                    key={payout.id}
                    className="hover:bg-gray-50 transition-colors"
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-gray-100 rounded-lg text-gray-500">
                          <FaCalendarAlt />
                        </div>
                        <span className="text-sm font-medium text-gray-700">
                          {formatDate(payout.date)}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 font-semibold text-gray-900">
                      {formatCurrency(payout.amount)}
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-semibold border ${getStatusColor(payout.status)}`}
                      >
                        {payout.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button className="text-gray-400 hover:text-gray-600">
                        <FaDownload />
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan={4}
                    className="px-6 py-12 text-center text-gray-500"
                  >
                    <div className="flex flex-col items-center justify-center">
                      <FaExclamationCircle className="w-8 h-8 text-gray-300 mb-2" />
                      <p>No payout history found.</p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Payouts;
