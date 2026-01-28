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
  Save,
  Plus,
  Trash2,
} from "lucide-react";
import { useState } from "react";

// --- Types ---
type ProfileData = {
  businessName: string;
  description: string;
  phone: string;
  email: string;
  address: string;
  website: string;
};

type ListingData = {
  defaultPrice: string;
  currency: string;
  cancellationPolicy: string;
  checkIn: string;
  checkOut: string;
  instantBooking: boolean;
  minNights: string;
  maxNights: string;
  houseRules: string[];
};

type PaymentData = {
  method: string;
  schedule: string;
  bankName: string;
  accountNumber: string;
  taxId: string;
};

type NotificationsData = {
  bookingRequests: boolean;
  guestMessages: boolean;
  newReviews: boolean;
  payoutUpdates: boolean;
  maintenanceAlerts: boolean;
  marketingTips: boolean;
};

// --- Sub-Components ---

const SectionCard = ({
  icon: Icon,
  title,
  children,
}: {
  icon: any;
  title: string;
  children: React.ReactNode;
}) => (
  <div className="bg-white border border-gray-200 rounded-2xl shadow-sm overflow-hidden">
    <div className="px-6 py-4 border-b border-gray-100 flex items-center gap-2 bg-gray-50/50">
      <div className="p-2 bg-emerald-100 rounded-lg">
        <Icon className="w-5 h-5 text-emerald-600" />
      </div>
      <h2 className="text-lg font-semibold text-gray-800">{title}</h2>
    </div>
    <div className="p-6">{children}</div>
  </div>
);

const InputGroup = ({
  label,
  icon: Icon,
  children,
}: {
  label: string;
  icon?: any;
  children: React.ReactNode;
}) => (
  <div>
    <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-1.5">
      {Icon && <Icon className="w-4 h-4 text-gray-500" />}
      {label}
    </label>
    {children}
  </div>
);

// --- Main Settings Component ---

const Settings = () => {
  // 1. Grouped State Management
  const [profile, setProfile] = useState<ProfileData>({
    businessName: "",
    description: "",
    phone: "",
    email: "",
    address: "",
    website: "",
  });

  const [listing, setListing] = useState<ListingData>({
    defaultPrice: "85",
    currency: "USD ($)",
    cancellationPolicy: "Moderate",
    checkIn: "14:00",
    checkOut: "11:00",
    instantBooking: true,
    minNights: "1",
    maxNights: "30",
    houseRules: ["No smoking", "No parties", "Pets allowed with approval"],
  });

  const [payment, setPayment] = useState<PaymentData>({
    method: "Bank Transfer",
    schedule: "Weekly",
    bankName: "First Bank Nigeria",
    accountNumber: "****1234",
    taxId: "",
  });

  const [notifications, setNotifications] = useState<NotificationsData>({
    bookingRequests: true,
    guestMessages: true,
    newReviews: true,
    payoutUpdates: false,
    maintenanceAlerts: true,
    marketingTips: false,
  });

  const [newRule, setNewRule] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  // Handlers
  const handleProfileChange = (field: keyof ProfileData, value: string) => {
    setProfile((prev) => ({ ...prev, [field]: value }));
  };

  const handleListingChange = (
    field: keyof ListingData,
    value: string | boolean | string[],
  ) => {
    setListing((prev) => ({ ...prev, [field]: value }));
  };

  const handlePaymentChange = (field: keyof PaymentData, value: string) => {
    setPayment((prev) => ({ ...prev, [field]: value }));
  };

  const toggleNotification = (key: keyof NotificationsData) => {
    setNotifications((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const addRule = () => {
    if (newRule.trim()) {
      handleListingChange("houseRules", [
        ...listing.houseRules,
        newRule.trim(),
      ]);
      setNewRule("");
    }
  };

  const removeRule = (ruleToRemove: string) => {
    handleListingChange(
      "houseRules",
      listing.houseRules.filter((r) => r !== ruleToRemove),
    );
  };

  const handleSaveAll = () => {
    setIsSaving(true);
    // Simulate API call
    setTimeout(() => {
      console.log("Full Save Payload:", {
        profile,
        listing,
        payment,
        notifications,
      });
      setIsSaving(false);
      alert("All settings saved successfully!");
    }, 800);
  };

  const inputClass =
    "w-full border border-gray-300 rounded-lg p-2.5 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 focus:outline-none transition-all";

  return (
    <div className="min-h-screen bg-gray-50/50 pb-12">
      <div className="max-w-3xl mx-auto space-y-8 pt-8 px-4">
        {/* Header */}
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Host Settings</h1>
          <p className="text-gray-500">
            Manage your profile, listing preferences, and payouts.
          </p>
        </div>

        {/* 1. Host Profile Section */}
        <SectionCard icon={User} title="Host Profile">
          <div className="space-y-5">
            <InputGroup label="Business Name">
              <input
                type="text"
                value={profile.businessName}
                onChange={(e) =>
                  handleProfileChange("businessName", e.target.value)
                }
                placeholder="Sunrise Stays"
                className={inputClass}
              />
            </InputGroup>

            <InputGroup label="Business Description">
              <textarea
                rows={3}
                value={profile.description}
                onChange={(e) =>
                  handleProfileChange("description", e.target.value)
                }
                placeholder="Describe your hosting business..."
                className={inputClass}
              />
            </InputGroup>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <InputGroup label="Business Phone" icon={Phone}>
                <input
                  type="text"
                  value={profile.phone}
                  onChange={(e) => handleProfileChange("phone", e.target.value)}
                  placeholder="+234 800 123 4567"
                  className={inputClass}
                />
              </InputGroup>
              <InputGroup label="Business Email" icon={Mail}>
                <input
                  type="email"
                  value={profile.email}
                  onChange={(e) => handleProfileChange("email", e.target.value)}
                  placeholder="host@sunrisestays.com"
                  className={inputClass}
                />
              </InputGroup>
            </div>

            <InputGroup label="Business Address" icon={MapPin}>
              <input
                type="text"
                value={profile.address}
                onChange={(e) => handleProfileChange("address", e.target.value)}
                className={inputClass}
              />
            </InputGroup>

            <InputGroup label="Website (Optional)" icon={Globe}>
              <input
                type="url"
                value={profile.website}
                onChange={(e) => handleProfileChange("website", e.target.value)}
                className={inputClass}
              />
            </InputGroup>
          </div>
        </SectionCard>

        {/* 2. Listing Preferences Section */}
        <SectionCard icon={Building2} title="Listing Preferences">
          <div className="space-y-6">
            <div className="grid md:grid-cols-3 gap-5">
              <InputGroup label="Default Price">
                <div className="relative">
                  <DollarSign className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
                  <input
                    type="number"
                    value={listing.defaultPrice}
                    onChange={(e) =>
                      handleListingChange("defaultPrice", e.target.value)
                    }
                    className={`${inputClass} pl-9`}
                  />
                </div>
              </InputGroup>

              <InputGroup label="Currency">
                <select
                  value={listing.currency}
                  onChange={(e) =>
                    handleListingChange("currency", e.target.value)
                  }
                  className={inputClass}
                >
                  <option>USD ($)</option>
                  <option>NGN (₦)</option>
                  <option>EUR (€)</option>
                </select>
              </InputGroup>

              <InputGroup label="Cancellation Policy">
                <select
                  value={listing.cancellationPolicy}
                  onChange={(e) =>
                    handleListingChange("cancellationPolicy", e.target.value)
                  }
                  className={inputClass}
                >
                  <option>Flexible</option>
                  <option>Moderate</option>
                  <option>Strict</option>
                </select>
              </InputGroup>
            </div>

            <div className="grid md:grid-cols-3 gap-5">
              <InputGroup label="Check-in Time" icon={Clock}>
                <input
                  type="time"
                  value={listing.checkIn}
                  onChange={(e) =>
                    handleListingChange("checkIn", e.target.value)
                  }
                  className={inputClass}
                />
              </InputGroup>
              <InputGroup label="Check-out Time" icon={Clock}>
                <input
                  type="time"
                  value={listing.checkOut}
                  onChange={(e) =>
                    handleListingChange("checkOut", e.target.value)
                  }
                  className={inputClass}
                />
              </InputGroup>

              <div className="flex flex-col justify-center">
                <label className="text-sm font-medium text-gray-700 mb-2">
                  Instant Booking
                </label>
                <button
                  onClick={() =>
                    handleListingChange(
                      "instantBooking",
                      !listing.instantBooking,
                    )
                  }
                  className={`w-12 h-6 flex items-center rounded-full transition-colors duration-300 ${
                    listing.instantBooking ? "bg-emerald-500" : "bg-gray-200"
                  }`}
                >
                  <span
                    className={`w-5 h-5 bg-white rounded-full shadow transform transition-transform duration-300 ${
                      listing.instantBooking
                        ? "translate-x-6"
                        : "translate-x-0.5"
                    }`}
                  />
                </button>
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-5">
              <InputGroup label="Min Nights">
                <input
                  type="number"
                  value={listing.minNights}
                  onChange={(e) =>
                    handleListingChange("minNights", e.target.value)
                  }
                  className={inputClass}
                />
              </InputGroup>
              <InputGroup label="Max Nights">
                <input
                  type="number"
                  value={listing.maxNights}
                  onChange={(e) =>
                    handleListingChange("maxNights", e.target.value)
                  }
                  className={inputClass}
                />
              </InputGroup>
            </div>

            <div className="bg-gray-50 p-4 rounded-xl border border-gray-200">
              <h3 className="text-sm font-medium text-gray-700 mb-3">
                House Rules
              </h3>
              <div className="space-y-2 mb-3">
                {listing.houseRules.map((rule, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between bg-white border border-gray-200 rounded-lg py-2 px-3 text-sm"
                  >
                    <span className="text-gray-700">{rule}</span>
                    <button
                      onClick={() => removeRule(rule)}
                      className="text-gray-400 hover:text-red-500 transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="Add a rule..."
                  className={inputClass}
                  value={newRule}
                  onChange={(e) => setNewRule(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && addRule()}
                />
                <button
                  onClick={addRule}
                  className="bg-emerald-600 text-white px-4 rounded-lg hover:bg-emerald-700 transition-colors"
                >
                  <Plus className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>
        </SectionCard>

        {/* 3. Payment Section */}
        <SectionCard icon={CreditCard} title="Payment & Payout">
          <div className="space-y-5">
            <div className="grid md:grid-cols-2 gap-5">
              <InputGroup label="Payout Method">
                <select
                  value={payment.method}
                  onChange={(e) =>
                    handlePaymentChange("method", e.target.value)
                  }
                  className={inputClass}
                >
                  <option>Bank Transfer</option>
                  <option>PayPal</option>
                  <option>Crypto Wallet</option>
                </select>
              </InputGroup>
              <InputGroup label="Payout Schedule">
                <select
                  value={payment.schedule}
                  onChange={(e) =>
                    handlePaymentChange("schedule", e.target.value)
                  }
                  className={inputClass}
                >
                  <option>Daily</option>
                  <option>Weekly</option>
                  <option>Monthly</option>
                </select>
              </InputGroup>
            </div>

            <div className="grid md:grid-cols-2 gap-5">
              <InputGroup label="Bank Name">
                <input
                  type="text"
                  value={payment.bankName}
                  onChange={(e) =>
                    handlePaymentChange("bankName", e.target.value)
                  }
                  className={inputClass}
                />
              </InputGroup>
              <InputGroup label="Account Number">
                <input
                  type="text"
                  value={payment.accountNumber}
                  onChange={(e) =>
                    handlePaymentChange("accountNumber", e.target.value)
                  }
                  className={inputClass}
                />
              </InputGroup>
            </div>

            <InputGroup label="Tax ID (Optional)">
              <input
                type="text"
                value={payment.taxId}
                onChange={(e) => handlePaymentChange("taxId", e.target.value)}
                placeholder="Tax reporting ID"
                className={inputClass}
              />
            </InputGroup>
          </div>
        </SectionCard>

        {/* 4. Notifications Section */}
        <SectionCard icon={Bell} title="Notifications">
          <div className="divide-y divide-gray-100">
            {Object.entries({
              bookingRequests: {
                title: "Booking Requests",
                desc: "Alerts for new bookings",
              },
              guestMessages: {
                title: "Guest Messages",
                desc: "New messages from guests",
              },
              newReviews: {
                title: "New Reviews",
                desc: "When a guest leaves a review",
              },
              payoutUpdates: {
                title: "Payout Updates",
                desc: "Funds transferred alerts",
              },
              maintenanceAlerts: {
                title: "System Alerts",
                desc: "Maintenance & warnings",
              },
              marketingTips: {
                title: "Marketing Tips",
                desc: "Promotional insights",
              },
            }).map(([key, info]) => (
              <div
                key={key}
                className="flex items-center justify-between py-4 first:pt-0 last:pb-0"
              >
                <div>
                  <p className="font-medium text-gray-800">{info.title}</p>
                  <p className="text-sm text-gray-500">{info.desc}</p>
                </div>
                <button
                  onClick={() =>
                    toggleNotification(key as keyof NotificationsData)
                  }
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-200 ${
                    notifications[key as keyof NotificationsData]
                      ? "bg-emerald-500"
                      : "bg-gray-200"
                  }`}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform duration-200 ${
                      notifications[key as keyof NotificationsData]
                        ? "translate-x-6"
                        : "translate-x-1"
                    }`}
                  />
                </button>
              </div>
            ))}
          </div>
        </SectionCard>

        {/* Action Buttons (Inline at bottom) */}
        <div className="flex items-center justify-end gap-4 pt-4 border-t border-gray-200">
          <button
            type="button"
            className="px-6 py-2.5 rounded-lg text-gray-700 font-medium hover:bg-gray-100 transition-colors"
            onClick={() => window.location.reload()}
          >
            Cancel
          </button>
          <button
            onClick={handleSaveAll}
            disabled={isSaving}
            className="flex items-center justify-center gap-2 px-8 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-medium rounded-lg shadow-sm transition-all active:scale-95 disabled:opacity-70 disabled:active:scale-100"
          >
            {isSaving ? (
              "Saving..."
            ) : (
              <>
                <Save className="w-4 h-4" />
                Save Changes
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Settings;
