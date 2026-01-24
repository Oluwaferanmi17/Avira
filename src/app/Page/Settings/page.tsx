"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { useEffect, useRef, useState } from "react";
import {
  User,
  Mail,
  Phone,
  Lock,
  Bell,
  CreditCard,
  Shield,
  Camera,
  CheckCircle2,
  ChevronLeft,
  AlertCircle,
  Loader2,
  type LucideIcon,
} from "lucide-react";
import toast from "react-hot-toast";
import NavBar from "@/app/components/Home/NavBar";

// --- Interfaces ---
interface UserProfile {
  name: string;
  email: string;
  phone: string;
  bio: string;
  avatar: string;
}

interface NotificationPreferences {
  email: {
    bookingUpdates: boolean;
    promotions: boolean;
    securityAlerts: boolean;
  };
  sms: {
    bookingReminders: boolean;
    importantUpdates: boolean;
  };
  push: {
    newMessages: boolean;
    bookingActivity: boolean;
  };
}

interface PaymentMethod {
  id: string;
  type: "card" | "paypal";
  last4: string;
  expiry?: string;
  isDefault: boolean;
}

// --- Reusable Sub-Components ---

const Toggle = ({
  checked,
  onChange,
  id,
}: {
  checked: boolean;
  onChange: (checked: boolean) => void;
  id?: string;
}) => (
  <button
    id={id}
    type="button"
    role="switch"
    aria-checked={checked}
    onClick={() => onChange(!checked)}
    className={`
      relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent 
      transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-emerald-600 focus:ring-offset-2
      ${checked ? "bg-emerald-600" : "bg-slate-200"}
    `}
  >
    <span
      className={`
        pointer-events-none block h-5 w-5 rounded-full bg-white shadow ring-0 
        transition-transform duration-200 ease-in-out
        ${checked ? "translate-x-5" : "translate-x-0"}
      `}
    />
  </button>
);

const SettingsCard = ({
  icon: Icon,
  title,
  children,
}: {
  icon: LucideIcon;
  title: string;
  children: React.ReactNode;
}) => (
  <div className="bg-white rounded-lg border border-slate-200 shadow-sm overflow-hidden">
    <div className="px-6 py-4 border-b border-slate-100">
      <h3 className="text-lg font-semibold text-slate-900 flex items-center gap-2">
        <Icon className="h-5 w-5 text-emerald-600" />
        {title}
      </h3>
    </div>
    <div className="p-6 space-y-6">{children}</div>
  </div>
);

const SettingsSkeleton = () => (
  <div className="animate-pulse space-y-6 max-w-4xl mx-auto pt-8 px-4">
    <div className="h-8 bg-slate-200 rounded w-1/4 mb-4"></div>
    <div className="h-64 bg-slate-100 rounded-lg border border-slate-200"></div>
    <div className="h-64 bg-slate-100 rounded-lg border border-slate-200"></div>
  </div>
);

// --- Styles ---
const labelClass = "block text-sm font-medium text-slate-700 mb-1.5";
const inputClass =
  "flex h-10 w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-600 focus:border-transparent disabled:cursor-not-allowed disabled:opacity-50 transition-all duration-200";
const buttonPrimaryClass =
  "inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-white transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-950 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-slate-900 text-slate-50 hover:bg-slate-900/90 h-10 px-4 py-2";
const buttonOutlineClass =
  "inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-white transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-950 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-slate-200 bg-transparent hover:bg-slate-100 hover:text-slate-900 h-10 px-4 py-2";

// --- Main Component ---

export default function Settings() {
  const [initialLoading, setInitialLoading] = useState(true);

  // Profile state
  const [profile, setProfile] = useState<UserProfile>({
    name: "",
    email: "",
    phone: "",
    bio: "",
    avatar: "/default-avatar.png",
  });

  const [imageUploading, setImageUploading] = useState(false);
  const profileInputRef = useRef<HTMLInputElement>(null);

  // Security state
  const [passwords, setPasswords] = useState({
    current: "",
    new: "",
    confirm: "",
  });
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(false);
  const [passwordError, setPasswordError] = useState("");

  // Notification preferences
  const [notifications, setNotifications] = useState<NotificationPreferences>({
    email: { bookingUpdates: true, promotions: false, securityAlerts: true },
    sms: { bookingReminders: true, importantUpdates: false },
    push: { newMessages: true, bookingActivity: true },
  });

  // Payment methods
  const [paymentMethods] = useState<PaymentMethod[]>([
    { id: "1", type: "card", last4: "4242", expiry: "12/25", isDefault: true },
    { id: "2", type: "card", last4: "8888", expiry: "08/24", isDefault: false },
  ]);

  // Privacy settings
  const [privacy, setPrivacy] = useState({
    shareData: false,
    marketingEmails: false,
    locationServices: true,
  });

  // Form states
  const [isSaving, setIsSaving] = useState(false);
  const [saveMessage, setSaveMessage] = useState({ type: "", text: "" });

  // --- Effects ---
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await fetch("/api/user/settings/me", {
          credentials: "include",
        });

        if (!res.ok) throw new Error("Failed to fetch user");

        const data = await res.json();

        setProfile({
          name: data?.name ?? "",
          email: data?.email ?? "",
          phone: data?.phone ?? "",
          bio: data?.bio ?? "",
          avatar:
            data?.profileImage ??
            `https://ui-avatars.com/api/?name=${encodeURIComponent(
              data?.name || "User"
            )}`,
        });

        // If your API returns these settings, map them here.
        // Otherwise, we keep local defaults.
        if (data?.notifications) setNotifications(data.notifications);
        if (data?.privacy) setPrivacy(data.privacy);
      } catch (error) {
        console.error("Error fetching user settings:", error);
        toast.error("Could not load user data");
      } finally {
        setInitialLoading(false);
      }
    };

    fetchUser();
  }, []);

  // --- Handlers ---

  const uploadImage = async (file: File) => {
    try {
      setImageUploading(true);

      const formData = new FormData();
      formData.append("file", file);

      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();

      if (!data.secure_url) {
        throw new Error("Upload failed");
      }

      // Add timestamp to force cache refresh
      const imageUrl = `${data.secure_url}?t=${Date.now()}`;

      setProfile((prev) => ({
        ...prev,
        avatar: imageUrl,
      }));

      // Optional: Immediately save the avatar URL to the backend profile
      await fetch("/api/user/settings/profile", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ avatar: data.secure_url }), // Send clean URL without timestamp
      });

      toast.success("Profile photo updated!");
    } catch (err) {
      console.error(err);
      toast.error("Failed to upload image");
    } finally {
      setImageUploading(false);
    }
  };

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) uploadImage(file);
  };

  const handleProfileUpdate = (field: keyof UserProfile, value: string) => {
    setProfile((prev) => ({ ...prev, [field]: value }));
  };

  const handlePasswordChange = (
    field: keyof typeof passwords,
    value: string
  ) => {
    setPasswords((prev) => ({ ...prev, [field]: value }));
    // Clear error when user types
    if (passwordError) setPasswordError("");
  };

  const handleNotificationToggle = (
    category: keyof NotificationPreferences,
    setting: string
  ) => {
    setNotifications((prev) => ({
      ...prev,
      [category]: {
        ...prev[category],
        [setting]:
          !prev[category][setting as keyof (typeof prev)[typeof category]],
      },
    }));
  };

  const handlePrivacyToggle = (setting: keyof typeof privacy) => {
    setPrivacy((prev) => ({ ...prev, [setting]: !prev[setting] }));
  };

  const handlePasswordUpdate = async () => {
    if (passwords.new !== passwords.confirm) {
      setPasswordError("New passwords do not match");
      return;
    }
    if (passwords.new.length < 8) {
      setPasswordError("Password must be at least 8 characters");
      return;
    }

    try {
      // Simulate API call
      // await fetch('/api/user/password', ...)
      setSaveMessage({
        type: "success",
        text: "Password updated successfully",
      });
      setPasswords({ current: "", new: "", confirm: "" });
    } catch (error) {
      setSaveMessage({ type: "error", text: "Failed to update password" });
    } finally {
      setTimeout(() => setSaveMessage({ type: "", text: "" }), 3000);
    }
  };

  const handleSaveSettings = async () => {
    setIsSaving(true);
    setSaveMessage({ type: "", text: "" });

    try {
      // Use Promise.all to run these in parallel for better performance
      await Promise.all([
        fetch("/api/user/settings/profile", {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(profile),
        }),
        fetch("/api/user/notifications", {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(notifications),
        }),
        fetch("/api/user/privacy", {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(privacy),
        }),
      ]);

      setSaveMessage({
        type: "success",
        text: "All settings saved successfully!",
      });
      toast.success("Settings saved successfully");
    } catch (error) {
      console.error(error);
      setSaveMessage({ type: "error", text: "Failed to save settings." });
      toast.error("Failed to save settings");
    } finally {
      setIsSaving(false);
      setTimeout(() => setSaveMessage({ type: "", text: "" }), 3000);
    }
  };

  if (initialLoading) return <SettingsSkeleton />;

  return (
    <div className="min-h-screen flex flex-col bg-white text-slate-900">
      <NavBar />
      <main className="flex-1">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="max-w-4xl mx-auto">
            {/* Header */}
            <div className="mb-8">
              <Link href="/">
                <Button
                  variant="outline"
                  className="bg-transparent mb-4"
                  size="sm"
                >
                  <ChevronLeft className="h-4 w-4 mr-1" /> Back
                </Button>
              </Link>
              <h1 className="text-2xl sm:text-3xl font-semibold tracking-tight text-slate-900">
                Settings
              </h1>
              <p className="text-slate-600 mt-2">
                Manage your account preferences and security settings
              </p>
            </div>

            {/* Global Message Toast (Inline) */}
            {saveMessage.text && (
              <div
                className={`mb-6 rounded-lg border p-4 text-sm inline-flex items-center gap-2 w-full animate-in fade-in slide-in-from-top-2
                ${
                  saveMessage.type === "error"
                    ? "border-red-200 bg-red-50 text-red-800"
                    : "border-emerald-200 bg-emerald-50 text-emerald-800"
                }`}
              >
                {saveMessage.type === "error" ? (
                  <AlertCircle className="h-4 w-4" />
                ) : (
                  <CheckCircle2 className="h-4 w-4" />
                )}
                {saveMessage.text}
              </div>
            )}

            <div className="space-y-6">
              {/* --- Profile Settings --- */}
              <SettingsCard icon={User} title="Profile Settings">
                {/* Avatar Section */}
                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6 mb-6">
                  <div className="relative group">
                    <div className="w-24 h-24 rounded-full overflow-hidden border-4 border-slate-100 shadow-md">
                      <img
                        src={profile.avatar || "/default-avatar.png"}
                        alt="Profile"
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <button
                      onClick={() => profileInputRef.current?.click()}
                      disabled={imageUploading}
                      className="absolute bottom-0 right-0 bg-white p-2 rounded-full shadow-md border border-slate-200 hover:bg-slate-50 transition-colors disabled:opacity-50"
                      title="Change Profile Photo"
                    >
                      {imageUploading ? (
                        <Loader2 className="w-4 h-4 animate-spin text-emerald-600" />
                      ) : (
                        <Camera className="w-4 h-4 text-slate-700" />
                      )}
                    </button>
                    <input
                      type="file"
                      ref={profileInputRef}
                      onChange={handleImageUpload}
                      accept="image/*"
                      className="hidden"
                    />
                  </div>
                  <div>
                    <h4 className="text-sm font-medium text-slate-900">
                      Profile Photo
                    </h4>
                    <p className="text-xs text-slate-500 mt-1 max-w-xs">
                      Supports JPG, PNG or GIF. Max file size 5MB.
                    </p>
                  </div>
                </div>

                {/* Profile Form */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="name" className={labelClass}>
                      Full Name
                    </label>
                    <input
                      id="name"
                      value={profile.name}
                      onChange={(e) =>
                        handleProfileUpdate("name", e.target.value)
                      }
                      className={inputClass}
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="email"
                      className={`${labelClass} flex items-center gap-2`}
                    >
                      <Mail className="h-3.5 w-3.5 text-slate-400" /> Email
                    </label>
                    <input
                      id="email"
                      type="email"
                      value={profile.email}
                      onChange={(e) =>
                        handleProfileUpdate("email", e.target.value)
                      }
                      className={inputClass}
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="phone"
                      className={`${labelClass} flex items-center gap-2`}
                    >
                      <Phone className="h-3.5 w-3.5 text-slate-400" /> Phone
                    </label>
                    <input
                      id="phone"
                      value={profile.phone}
                      onChange={(e) =>
                        handleProfileUpdate("phone", e.target.value)
                      }
                      className={inputClass}
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label htmlFor="bio" className={labelClass}>
                      Bio
                    </label>
                    <textarea
                      id="bio"
                      value={profile.bio}
                      onChange={(e) =>
                        handleProfileUpdate("bio", e.target.value)
                      }
                      rows={3}
                      className={`${inputClass} h-auto min-h-[80px] py-3`}
                      placeholder="Tell us a bit about yourself..."
                    />
                  </div>
                </div>
              </SettingsCard>

              {/* --- Account Security --- */}
              <SettingsCard icon={Lock} title="Account Security">
                <div>
                  <h3 className="text-sm font-medium text-slate-900 mb-4">
                    Change Password
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="current-password" className={labelClass}>
                        Current Password
                      </label>
                      <input
                        id="current-password"
                        type="password"
                        value={passwords.current}
                        onChange={(e) =>
                          handlePasswordChange("current", e.target.value)
                        }
                        className={inputClass}
                      />
                    </div>
                    <div className="hidden md:block" />
                    <div>
                      <label htmlFor="new-password" className={labelClass}>
                        New Password
                      </label>
                      <input
                        id="new-password"
                        type="password"
                        value={passwords.new}
                        onChange={(e) =>
                          handlePasswordChange("new", e.target.value)
                        }
                        className={inputClass}
                      />
                    </div>
                    <div>
                      <label htmlFor="confirm-password" className={labelClass}>
                        Confirm New Password
                      </label>
                      <input
                        id="confirm-password"
                        type="password"
                        value={passwords.confirm}
                        onChange={(e) =>
                          handlePasswordChange("confirm", e.target.value)
                        }
                        className={`${inputClass} ${
                          passwordError
                            ? "border-red-300 focus:ring-red-200"
                            : ""
                        }`}
                      />
                      {passwordError && (
                        <p className="text-xs text-red-600 mt-1">
                          {passwordError}
                        </p>
                      )}
                    </div>
                    <div className="flex items-end">
                      <button
                        onClick={handlePasswordUpdate}
                        disabled={
                          !passwords.current ||
                          !passwords.new ||
                          !passwords.confirm
                        }
                        className={buttonOutlineClass}
                      >
                        Update Password
                      </button>
                    </div>
                  </div>
                </div>

                <div className="h-px bg-slate-200 w-full" />

                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-sm font-medium text-slate-900">
                      Two-Factor Authentication
                    </h3>
                    <p className="text-sm text-slate-600 mt-1">
                      Add an extra layer of security to your account
                    </p>
                  </div>
                  <Toggle
                    checked={twoFactorEnabled}
                    onChange={setTwoFactorEnabled}
                  />
                </div>
              </SettingsCard>

              {/* --- Notification Preferences --- */}
              <SettingsCard icon={Bell} title="Notification Preferences">
                {/* Email */}
                <div>
                  <h3 className="text-sm font-medium text-slate-900 mb-3">
                    Email Notifications
                  </h3>
                  <div className="space-y-3">
                    {Object.entries(notifications.email).map(([key, value]) => (
                      <div
                        key={key}
                        className="flex items-center justify-between"
                      >
                        <label
                          htmlFor={`email-${key}`}
                          className="text-sm text-slate-700 capitalize cursor-pointer"
                        >
                          {key.replace(/([A-Z])/g, " $1").toLowerCase()}
                        </label>
                        <Toggle
                          id={`email-${key}`}
                          checked={value}
                          onChange={() =>
                            handleNotificationToggle("email", key)
                          }
                        />
                      </div>
                    ))}
                  </div>
                </div>

                <div className="h-px bg-slate-200 w-full" />

                {/* SMS */}
                <div>
                  <h3 className="text-sm font-medium text-slate-900 mb-3">
                    SMS Notifications
                  </h3>
                  <div className="space-y-3">
                    {Object.entries(notifications.sms).map(([key, value]) => (
                      <div
                        key={key}
                        className="flex items-center justify-between"
                      >
                        <label
                          htmlFor={`sms-${key}`}
                          className="text-sm text-slate-700 capitalize cursor-pointer"
                        >
                          {key.replace(/([A-Z])/g, " $1").toLowerCase()}
                        </label>
                        <Toggle
                          id={`sms-${key}`}
                          checked={value}
                          onChange={() => handleNotificationToggle("sms", key)}
                        />
                      </div>
                    ))}
                  </div>
                </div>

                <div className="h-px bg-slate-200 w-full" />

                {/* Push */}
                <div>
                  <h3 className="text-sm font-medium text-slate-900 mb-3">
                    Push Notifications
                  </h3>
                  <div className="space-y-3">
                    {Object.entries(notifications.push).map(([key, value]) => (
                      <div
                        key={key}
                        className="flex items-center justify-between"
                      >
                        <label
                          htmlFor={`push-${key}`}
                          className="text-sm text-slate-700 capitalize cursor-pointer"
                        >
                          {key.replace(/([A-Z])/g, " $1").toLowerCase()}
                        </label>
                        <Toggle
                          id={`push-${key}`}
                          checked={value}
                          onChange={() => handleNotificationToggle("push", key)}
                        />
                      </div>
                    ))}
                  </div>
                </div>
              </SettingsCard>

              {/* --- Payment Methods --- */}
              <SettingsCard icon={CreditCard} title="Payment Methods">
                <div className="space-y-4">
                  {paymentMethods.map((method) => (
                    <div
                      key={method.id}
                      className="flex items-center justify-between p-4 border border-slate-200 rounded-lg hover:border-slate-300 transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <div className="bg-slate-100 p-2 rounded">
                          <CreditCard className="h-6 w-6 text-slate-500" />
                        </div>
                        <div>
                          <div className="font-medium text-slate-900">
                            {method.type === "card" ? "Credit Card" : "PayPal"}{" "}
                            •••• {method.last4}
                          </div>
                          {method.expiry && (
                            <div className="text-sm text-slate-500">
                              Expires {method.expiry}
                            </div>
                          )}
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        {method.isDefault && (
                          <span className="text-xs px-2.5 py-1 bg-emerald-100 text-emerald-800 rounded-full font-medium">
                            Default
                          </span>
                        )}
                        <button
                          className={`${buttonOutlineClass} h-8 px-3 text-xs`}
                        >
                          Edit
                        </button>
                      </div>
                    </div>
                  ))}
                  <button
                    className={`${buttonOutlineClass} w-full border-dashed border-slate-300 text-slate-600 hover:border-slate-400`}
                  >
                    + Add Payment Method
                  </button>
                </div>
              </SettingsCard>

              {/* --- Privacy Settings --- */}
              <SettingsCard icon={Shield} title="Privacy Settings">
                <div className="space-y-4">
                  {Object.entries(privacy).map(([key, value]) => (
                    <div
                      key={key}
                      className="flex items-center justify-between"
                    >
                      <div>
                        <label
                          htmlFor={`privacy-${key}`}
                          className="text-sm font-medium text-slate-700 capitalize cursor-pointer"
                        >
                          {key.replace(/([A-Z])/g, " $1").toLowerCase()}
                        </label>
                        <p className="text-xs text-slate-500 mt-0.5">
                          {key === "shareData" &&
                            "Allow us to use your data to improve services"}
                          {key === "marketingEmails" &&
                            "Receive marketing and promotional emails"}
                          {key === "locationServices" &&
                            "Use your location for personalized recommendations"}
                        </p>
                      </div>
                      <Toggle
                        id={`privacy-${key}`}
                        checked={value as boolean}
                        onChange={() =>
                          handlePrivacyToggle(key as keyof typeof privacy)
                        }
                      />
                    </div>
                  ))}
                </div>
              </SettingsCard>

              {/* --- Action Bar --- */}
              <div className="sticky bottom-4 z-10 flex justify-end">
                <div className="bg-white/80 backdrop-blur-sm p-2 rounded-lg shadow-lg border border-slate-200">
                  <button
                    onClick={handleSaveSettings}
                    disabled={isSaving || initialLoading}
                    className={`${buttonPrimaryClass} min-w-[160px] shadow-sm`}
                  >
                    {isSaving ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Saving...
                      </>
                    ) : (
                      "Save All Changes"
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
