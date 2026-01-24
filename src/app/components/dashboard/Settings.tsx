import {
  Bell,
  Building2,
  Clock,
  CreditCard,
  DollarSign,
  Globe,
  Mail,
  MapPin,
  Phone,
  User,
} from "lucide-react";
import { useState } from "react";

const Settings = () => {
  const [defaultPrice, setDefaultPrice] = useState("85");
  const [currency, setCurrency] = useState("USD ($)");
  const [cancellationPolicy, setCancellationPolicy] = useState("Moderate");
  const [checkIn, setCheckIn] = useState("14:00");
  const [checkOut, setCheckOut] = useState("11:00");
  const [instantBooking, setInstantBooking] = useState(true);
  const [minNights, setMinNights] = useState("1");
  const [maxNights, setMaxNights] = useState("30");
  const [houseRules, setHouseRules] = useState([
    "No smoking",
    "No parties",
    "Pets allowed with approval",
  ]);
  const [newRule, setNewRule] = useState("");
  const addRule = () => {
    if (newRule.trim()) {
      setHouseRules([...houseRules, newRule.trim()]);
      setNewRule("");
    }
  };

  const removeRule = (rule: string) => {
    setHouseRules(houseRules.filter((r) => r !== rule));
  };
  const [payoutMethod, setPayoutMethod] = useState("Bank Transfer");
  const [payoutSchedule, setPayoutSchedule] = useState("Weekly");
  const [bankName, setBankName] = useState("First Bank Nigeria");
  const [accountNumber, setAccountNumber] = useState("****1234");
  const [taxId, setTaxId] = useState("");
  const [notifications, setNotifications] = useState({
    bookingRequests: true,
    guestMessages: true,
    newReviews: true,
    payoutUpdates: false,
    maintenanceAlerts: true,
    marketingTips: false,
  });
  const toggleNotification = (key: keyof typeof notifications) => {
    setNotifications((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  const handleSave = () => {
    console.log("Saved settings:", notifications);
    alert("Host settings saved successfully!");
  };
  return (
    <div>
      <section>
        <div className="max-w-3xl mx-auto bg-white border border-gray-200 rounded-2xl shadow-sm p-8">
          {/* Header */}
          <div className="flex items-center gap-2 mb-6">
            <User className="w-5 h-5 text-green-600" />
            <h2 className="text-lg font-semibold text-gray-800">
              Host Profile
            </h2>
          </div>

          <form className="space-y-6">
            {/* Business Name */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Business Name
              </label>
              <input
                type="text"
                placeholder="Sunrise Stays"
                className="w-full border border-gray-300 rounded-md p-2.5 focus:ring-2 focus:ring-green-500 focus:outline-none"
              />
            </div>

            {/* Business Description */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Business Description
              </label>
              <textarea
                rows={3}
                placeholder="Providing comfortable and authentic accommodations across Africa"
                className="w-full border border-gray-300 rounded-md p-2.5 focus:ring-2 focus:ring-green-500 focus:outline-none"
              ></textarea>
            </div>

            {/* Phone + Email */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-1">
                  <Phone className="w-4 h-4 text-gray-500" />
                  Business Phone
                </label>
                <input
                  type="text"
                  placeholder="+234 800 123 4567"
                  className="w-full border border-gray-300 rounded-md p-2.5 focus:ring-2 focus:ring-green-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-1">
                  <Mail className="w-4 h-4 text-gray-500" />
                  Business Email
                </label>
                <input
                  type="email"
                  placeholder="host@sunrisestays.com"
                  className="w-full border border-gray-300 rounded-md p-2.5 focus:ring-2 focus:ring-green-500 focus:outline-none"
                />
              </div>
            </div>

            {/* Business Address */}
            <div>
              <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-1">
                <MapPin className="w-4 h-4 text-gray-500" />
                Business Address
              </label>
              <input
                type="text"
                placeholder="123 Business Avenue, Victoria Island, Lagos, Nigeria"
                className="w-full border border-gray-300 rounded-md p-2.5 focus:ring-2 focus:ring-green-500 focus:outline-none"
              />
            </div>

            {/* Website (Optional) */}
            <div>
              <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-1">
                <Globe className="w-4 h-4 text-gray-500" />
                Website (Optional)
              </label>
              <input
                type="url"
                placeholder="www.sunrisestays.com"
                className="w-full border border-gray-300 rounded-md p-2.5 focus:ring-2 focus:ring-green-500 focus:outline-none"
              />
            </div>

            {/* Submit Button */}
            {/* <div className="pt-4">
                      <button
                        type="submit"
                        className="w-full bg-green-600 hover:bg-green-700 text-white font-medium py-2.5 rounded-lg transition-all duration-300"
                      >
                        Save Profile
                      </button>
                    </div> */}
          </form>
        </div>
        <div className="bg-white shadow border border-gray-200 rounded-xl p-6 max-w-3xl mx-auto">
          <h2 className="flex items-center text-lg font-semibold mb-4">
            <Building2 className="w-5 h-5 mr-2 text-emerald-600" />
            Listing Preferences
          </h2>

          {/* Price, Currency, Policy */}
          <div className="grid md:grid-cols-3 gap-4">
            <div>
              <label className="text-sm font-medium text-gray-600">
                Default Price
              </label>
              <div className="relative mt-1">
                <DollarSign className="absolute left-2 top-2.5 w-4 h-4 text-gray-400" />
                <input
                  type="number"
                  className="pl-7 w-full border rounded-md py-2 px-3 text-gray-800 focus:ring-2 focus:ring-emerald-400"
                  value={defaultPrice}
                  onChange={(e) => setDefaultPrice(e.target.value)}
                />
              </div>
            </div>

            <div>
              <label className="text-sm font-medium text-gray-600">
                Currency
              </label>
              <select
                value={currency}
                onChange={(e) => setCurrency(e.target.value)}
                className="mt-1 w-full border rounded-md py-2 px-3 focus:ring-2 focus:ring-emerald-400"
              >
                <option>USD ($)</option>
                <option>NGN (₦)</option>
                <option>EUR (€)</option>
              </select>
            </div>

            <div>
              <label className="text-sm font-medium text-gray-600">
                Cancellation Policy
              </label>
              <select
                value={cancellationPolicy}
                onChange={(e) => setCancellationPolicy(e.target.value)}
                className="mt-1 w-full border rounded-md py-2 px-3 focus:ring-2 focus:ring-emerald-400"
              >
                <option>Flexible</option>
                <option>Moderate</option>
                <option>Strict</option>
              </select>
            </div>
          </div>

          <hr className="my-6 border-gray-200" />

          {/* Check-in / Check-out */}
          <div className="grid md:grid-cols-3 gap-4 items-end">
            <div>
              <label className="text-sm font-medium text-gray-600 flex items-center">
                <Clock className="w-4 h-4 mr-1 text-gray-500" /> Check-in Time
              </label>
              <input
                type="time"
                className="mt-1 w-full border rounded-md py-2 px-3 focus:ring-2 focus:ring-emerald-400"
                value={checkIn}
                onChange={(e) => setCheckIn(e.target.value)}
              />
            </div>

            <div>
              <label className="text-sm font-medium text-gray-600 flex items-center">
                <Clock className="w-4 h-4 mr-1 text-gray-500" /> Check-out Time
              </label>
              <input
                type="time"
                className="mt-1 w-full border rounded-md py-2 px-3 focus:ring-2 focus:ring-emerald-400"
                value={checkOut}
                onChange={(e) => setCheckOut(e.target.value)}
              />
            </div>

            <div className="flex items-center space-x-2 mt-6">
              <label className="text-sm font-medium text-gray-600">
                Instant Booking
              </label>
              <button
                onClick={() => setInstantBooking(!instantBooking)}
                className={`w-10 h-5 flex items-center rounded-full transition-colors ${
                  instantBooking ? "bg-emerald-500" : "bg-gray-300"
                }`}
              >
                <span
                  className={`w-4 h-4 bg-white rounded-full shadow transform transition-transform ${
                    instantBooking ? "translate-x-5" : "translate-x-1"
                  }`}
                />
              </button>
            </div>
          </div>

          <hr className="my-6 border-gray-200" />

          {/* Nights */}
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium text-gray-600">
                Minimum Nights
              </label>
              <input
                type="number"
                className="mt-1 w-full border rounded-md py-2 px-3 focus:ring-2 focus:ring-emerald-400"
                value={minNights}
                onChange={(e) => setMinNights(e.target.value)}
              />
            </div>

            <div>
              <label className="text-sm font-medium text-gray-600">
                Maximum Nights
              </label>
              <input
                type="number"
                className="mt-1 w-full border rounded-md py-2 px-3 focus:ring-2 focus:ring-emerald-400"
                value={maxNights}
                onChange={(e) => setMaxNights(e.target.value)}
              />
            </div>
          </div>

          <hr className="my-6 border-gray-200" />

          {/* House Rules */}
          <div>
            <h3 className="text-sm font-medium text-gray-600 mb-2">
              House Rules
            </h3>
            <div className="space-y-2">
              {houseRules.map((rule, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between border rounded-md py-2 px-3"
                >
                  <span>{rule}</span>
                  <button
                    onClick={() => removeRule(rule)}
                    className="text-sm text-red-500 hover:text-red-600"
                  >
                    Remove
                  </button>
                </div>
              ))}
            </div>

            <div className="flex mt-3 space-x-2">
              <input
                type="text"
                placeholder="Add a new house rule..."
                className="flex-1 border rounded-md py-2 px-3 focus:ring-2 focus:ring-emerald-400"
                value={newRule}
                onChange={(e) => setNewRule(e.target.value)}
              />
              <button
                onClick={addRule}
                className="bg-emerald-500 text-white px-4 py-2 rounded-md hover:bg-emerald-600"
              >
                Add
              </button>
            </div>
          </div>
        </div>
        <div className="bg-white shadow border border-gray-200 rounded-xl p-6 max-w-3xl mx-auto">
          {/* Title */}
          <h2 className="flex items-center text-lg font-semibold mb-4">
            <CreditCard className="w-5 h-5 mr-2 text-emerald-600" />
            Payment & Payout
          </h2>

          {/* Payout Method & Schedule */}
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium text-gray-600">
                Payout Method
              </label>
              <select
                value={payoutMethod}
                onChange={(e) => setPayoutMethod(e.target.value)}
                className="mt-1 w-full border rounded-md py-2 px-3 focus:ring-2 focus:ring-emerald-400"
              >
                <option>Bank Transfer</option>
                <option>PayPal</option>
                <option>Crypto Wallet</option>
              </select>
            </div>

            <div>
              <label className="text-sm font-medium text-gray-600">
                Payout Schedule
              </label>
              <select
                value={payoutSchedule}
                onChange={(e) => setPayoutSchedule(e.target.value)}
                className="mt-1 w-full border rounded-md py-2 px-3 focus:ring-2 focus:ring-emerald-400"
              >
                <option>Daily</option>
                <option>Weekly</option>
                <option>Monthly</option>
              </select>
            </div>
          </div>

          <hr className="my-6 border-gray-200" />

          {/* Bank Details */}
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium text-gray-600">
                Bank Name
              </label>
              <input
                type="text"
                value={bankName}
                onChange={(e) => setBankName(e.target.value)}
                className="mt-1 w-full border rounded-md py-2 px-3 focus:ring-2 focus:ring-emerald-400"
              />
            </div>

            <div>
              <label className="text-sm font-medium text-gray-600">
                Account Number
              </label>
              <input
                type="text"
                value={accountNumber}
                onChange={(e) => setAccountNumber(e.target.value)}
                className="mt-1 w-full border rounded-md py-2 px-3 focus:ring-2 focus:ring-emerald-400"
              />
            </div>
          </div>

          <hr className="my-6 border-gray-200" />

          {/* Tax ID */}
          <div>
            <label className="text-sm font-medium text-gray-600">
              Tax ID (Optional)
            </label>
            <input
              type="text"
              value={taxId}
              onChange={(e) => setTaxId(e.target.value)}
              placeholder="For tax reporting purposes"
              className="mt-1 w-full border rounded-md py-2 px-3 focus:ring-2 focus:ring-emerald-400"
            />
          </div>
        </div>
        <div className="bg-white shadow border border-gray-200 rounded-xl p-6 max-w-3xl mx-auto">
          {/* Header */}
          <h2 className="flex items-center text-lg font-semibold mb-4">
            <Bell className="w-5 h-5 mr-2 text-emerald-600" />
            Host Notifications
          </h2>

          {/* Notification List */}
          <div className="space-y-5">
            {[
              {
                key: "bookingRequests",
                title: "Booking Requests",
                desc: "Get notified when guests request to book",
              },
              {
                key: "guestMessages",
                title: "Guest Messages",
                desc: "Receive alerts for new guest messages",
              },
              {
                key: "newReviews",
                title: "New Reviews",
                desc: "Be notified when you receive new reviews",
              },
              {
                key: "payoutUpdates",
                title: "Payout Updates",
                desc: "Get updates about your payouts and earnings",
              },
              {
                key: "maintenanceAlerts",
                title: "Maintenance Alerts",
                desc: "Receive maintenance and system alerts",
              },
              {
                key: "marketingTips",
                title: "Marketing Tips",
                desc: "Get hosting tips and marketing suggestions",
              },
            ].map(({ key, title, desc }) => (
              <div
                key={key}
                className="flex items-center justify-between border-b border-gray-100 pb-3 last:border-0"
              >
                <div>
                  <p className="font-medium text-gray-800">{title}</p>
                  <p className="text-sm text-gray-500">{desc}</p>
                </div>
                <button
                  onClick={() =>
                    toggleNotification(key as keyof typeof notifications)
                  }
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition ${
                    notifications[key as keyof typeof notifications]
                      ? "bg-emerald-500"
                      : "bg-gray-300"
                  }`}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition ${
                      notifications[key as keyof typeof notifications]
                        ? "translate-x-6"
                        : "translate-x-1"
                    }`}
                  />
                </button>
              </div>
            ))}
          </div>

          {/* Save Button */}
          <div className="flex justify-end mt-6">
            <button
              onClick={handleSave}
              className="bg-emerald-600 text-white font-medium px-4 py-2 rounded-md hover:bg-emerald-700"
            >
              Save Host Settings
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Settings;
