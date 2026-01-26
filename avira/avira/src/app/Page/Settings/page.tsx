"use client";
import { useState } from "react";
// import NavBar from "../components/NavBar";
// import Footer from "../components/Footer";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../../../components/ui/card";
import { Button } from "../../../components/ui/button";
import { Input } from "../../../components/ui/input";
import { Label } from "../../../components/ui/label";
import { Textarea } from "../../../components/ui/textarea";
// import { Switch } from "../components/ui/switch";
// import { Separator } from "../components/ui/separator";
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
  AlertCircle,
} from "lucide-react";

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

/**
 * Settings
 * Main settings page component
 */
export default function Settings() {
  // Profile state
  const [profile, setProfile] = useState<UserProfile>({
    name: "Jane Doe",
    email: "jane@example.com",
    phone: "+234 800 000 0000",
    bio: "Travel enthusiast exploring Africa's hidden gems",
    avatar:
      "https://pub-cdn.sider.ai/u/U0W8H749A1J/web-coder/6896f83c14f019f2a83eb929/resource/d8ad689b-a547-42ac-8c17-b9e6fb16512c.jpg",
  });

  // Security state
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(false);

  // Notification preferences
  const [notifications, setNotifications] = useState<NotificationPreferences>({
    email: {
      bookingUpdates: true,
      promotions: false,
      securityAlerts: true,
    },
    sms: {
      bookingReminders: true,
      importantUpdates: false,
    },
    push: {
      newMessages: true,
      bookingActivity: true,
    },
  });

  // Payment methods
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([
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
  const [saveMessage, setSaveMessage] = useState("");

  /**
   * handleProfileUpdate
   * Updates profile information
   */
  const handleProfileUpdate = (field: keyof UserProfile, value: string) => {
    setProfile((prev) => ({ ...prev, [field]: value }));
  };

  /**
   * handleNotificationToggle
   * Toggles specific notification settings
   */
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

  /**
   * handlePrivacyToggle
   * Toggles privacy settings
   */
  const handlePrivacyToggle = (setting: keyof typeof privacy) => {
    setPrivacy((prev) => ({ ...prev, [setting]: !prev[setting] }));
  };

  /**
   * handleSaveSettings
   * Simulates saving settings to backend
   */
  const handleSaveSettings = async () => {
    setIsSaving(true);

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1500));

    setSaveMessage("Settings saved successfully!");
    setIsSaving(false);

    // Clear message after 3 seconds
    setTimeout(() => setSaveMessage(""), 3000);
  };

  /**
   * handleAvatarChange
   * Updates avatar URL
   */
  const handleAvatarChange = (url: string) => {
    setProfile((prev) => ({ ...prev, avatar: url }));
  };

  return (
    <div className="min-h-screen flex flex-col bg-white text-slate-900">
      {/* <NavBar /> */}
      <main className="flex-1">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="max-w-4xl mx-auto">
            {/* Header */}
            <div className="mb-8">
              <h1 className="text-2xl sm:text-3xl font-semibold tracking-tight">
                Settings
              </h1>
              <p className="text-slate-600 mt-2">
                Manage your account preferences and security settings
              </p>
            </div>

            {/* Save Message */}
            {saveMessage && (
              <div className="mb-6 rounded-lg border border-emerald-200 bg-emerald-50 p-4 text-sm text-emerald-800 inline-flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4" />
                {saveMessage}
              </div>
            )}

            <div className="space-y-6">
              {/* Profile Settings */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <User className="h-5 w-5 text-emerald-600" />
                    Profile Settings
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Avatar Section */}
                  <div className="flex items-start gap-6">
                    <div className="flex-shrink-0">
                      <div className="relative">
                        <img
                          src={profile.avatar}
                          alt="Profile"
                          className="h-20 w-20 rounded-full object-cover border-2 border-slate-200"
                        />
                        <button
                          className="absolute -bottom-1 -right-1 h-8 w-8 rounded-full bg-emerald-600 text-white flex items-center justify-center border-2 border-white"
                          onClick={() =>
                            handleAvatarChange(
                              "https://pub-cdn.sider.ai/u/U0W8H749A1J/web-coder/6896f83c14f019f2a83eb929/resource/d8ad689b-a547-42ac-8c17-b9e6fb16512c.jpg"
                            )
                          }
                        >
                          <Camera className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                    <div className="flex-1">
                      <Label
                        htmlFor="avatar-url"
                        className="text-sm font-medium"
                      >
                        Avatar URL
                      </Label>
                      <Input
                        id="avatar-url"
                        value={profile.avatar}
                        onChange={(e) => handleAvatarChange(e.target.value)}
                        placeholder="https://example.com/avatar.jpg"
                        className="mt-1"
                      />
                      <p className="text-xs text-slate-500 mt-1">
                        Paste an image URL to update your avatar
                      </p>
                    </div>
                  </div>

                  {/* Profile Form */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="name">Full Name</Label>
                      <Input
                        id="name"
                        value={profile.name}
                        onChange={(e) =>
                          handleProfileUpdate("name", e.target.value)
                        }
                        className="mt-1"
                      />
                    </div>
                    <div>
                      <Label
                        htmlFor="email"
                        className="flex items-center gap-2"
                      >
                        <Mail className="h-4 w-4 text-slate-400" />
                        Email Address
                      </Label>
                      <Input
                        id="email"
                        type="email"
                        value={profile.email}
                        onChange={(e) =>
                          handleProfileUpdate("email", e.target.value)
                        }
                        className="mt-1"
                      />
                    </div>
                    <div>
                      <Label
                        htmlFor="phone"
                        className="flex items-center gap-2"
                      >
                        <Phone className="h-4 w-4 text-slate-400" />
                        Phone Number
                      </Label>
                      <Input
                        id="phone"
                        value={profile.phone}
                        onChange={(e) =>
                          handleProfileUpdate("phone", e.target.value)
                        }
                        className="mt-1"
                      />
                    </div>
                    <div className="md:col-span-2">
                      <Label htmlFor="bio">Bio</Label>
                      <Textarea
                        id="bio"
                        value={profile.bio}
                        onChange={(e) =>
                          handleProfileUpdate("bio", e.target.value)
                        }
                        rows={3}
                        className="mt-1"
                        placeholder="Tell us a bit about yourself..."
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Account Security */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Lock className="h-5 w-5 text-emerald-600" />
                    Account Security
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Password Change */}
                  <div>
                    <h3 className="text-sm font-medium text-slate-900 mb-4">
                      Change Password
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="current-password">
                          Current Password
                        </Label>
                        <Input
                          id="current-password"
                          type="password"
                          value={currentPassword}
                          onChange={(e) => setCurrentPassword(e.target.value)}
                          className="mt-1"
                        />
                      </div>
                      <div>
                        <Label htmlFor="new-password">New Password</Label>
                        <Input
                          id="new-password"
                          type="password"
                          value={newPassword}
                          onChange={(e) => setNewPassword(e.target.value)}
                          className="mt-1"
                        />
                      </div>
                      <div>
                        <Label htmlFor="confirm-password">
                          Confirm New Password
                        </Label>
                        <Input
                          id="confirm-password"
                          type="password"
                          value={confirmPassword}
                          onChange={(e) => setConfirmPassword(e.target.value)}
                          className="mt-1"
                        />
                      </div>
                      <div className="flex items-end">
                        <Button variant="outline" className="bg-transparent">
                          Update Password
                        </Button>
                      </div>
                    </div>
                  </div>

                  {/* <Separator /> */}

                  {/* Two-Factor Authentication */}
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-sm font-medium text-slate-900">
                        Two-Factor Authentication
                      </h3>
                      <p className="text-sm text-slate-600 mt-1">
                        Add an extra layer of security to your account
                      </p>
                    </div>
                    {/* <Switch
                      checked={twoFactorEnabled}
                      onCheckedChange={setTwoFactorEnabled}
                    /> */}
                  </div>
                </CardContent>
              </Card>

              {/* Notification Preferences */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Bell className="h-5 w-5 text-emerald-600" />
                    Notification Preferences
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Email Notifications */}
                  <div>
                    <h3 className="text-sm font-medium text-slate-900 mb-3">
                      Email Notifications
                    </h3>
                    <div className="space-y-3">
                      {Object.entries(notifications.email).map(
                        ([key, value]) => (
                          <div
                            key={key}
                            className="flex items-center justify-between"
                          >
                            <Label
                              htmlFor={`email-${key}`}
                              className="text-sm text-slate-700 capitalize"
                            >
                              {key.replace(/([A-Z])/g, " $1").toLowerCase()}
                            </Label>
                            {/* <Switch
                              id={`email-${key}`}
                              checked={value}
                              onCheckedChange={() =>
                                handleNotificationToggle("email", key)
                              }
                            /> */}
                          </div>
                        )
                      )}
                    </div>
                  </div>

                  {/* <Separator /> */}

                  {/* SMS Notifications */}
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
                          <Label
                            htmlFor={`sms-${key}`}
                            className="text-sm text-slate-700 capitalize"
                          >
                            {key.replace(/([A-Z])/g, " $1").toLowerCase()}
                          </Label>
                          {/* <Switch
                            id={`sms-${key}`}
                            checked={value}
                            onCheckedChange={() =>
                              handleNotificationToggle("sms", key)
                            }
                          /> */}
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* <Separator /> */}

                  {/* Push Notifications */}
                  <div>
                    <h3 className="text-sm font-medium text-slate-900 mb-3">
                      Push Notifications
                    </h3>
                    <div className="space-y-3">
                      {Object.entries(notifications.push).map(
                        ([key, value]) => (
                          <div
                            key={key}
                            className="flex items-center justify-between"
                          >
                            <Label
                              htmlFor={`push-${key}`}
                              className="text-sm text-slate-700 capitalize"
                            >
                              {key.replace(/([A-Z])/g, " $1").toLowerCase()}
                            </Label>
                            {/* <Switch
                              id={`push-${key}`}
                              checked={value}
                              onCheckedChange={() =>
                                handleNotificationToggle("push", key)
                              }
                            /> */}
                          </div>
                        )
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Payment Methods */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <CreditCard className="h-5 w-5 text-emerald-600" />
                    Payment Methods
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {paymentMethods.map((method) => (
                      <div
                        key={method.id}
                        className="flex items-center justify-between p-4 border border-slate-200 rounded-lg"
                      >
                        <div className="flex items-center gap-3">
                          <CreditCard className="h-8 w-8 text-slate-400" />
                          <div>
                            <div className="font-medium">
                              {method.type === "card"
                                ? "Credit Card"
                                : "PayPal"}{" "}
                              •••• {method.last4}
                            </div>
                            {method.expiry && (
                              <div className="text-sm text-slate-600">
                                Expires {method.expiry}
                              </div>
                            )}
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          {method.isDefault && (
                            <span className="text-xs px-2 py-1 bg-emerald-100 text-emerald-800 rounded-full">
                              Default
                            </span>
                          )}
                          <Button
                            variant="outline"
                            size="sm"
                            className="bg-transparent"
                          >
                            Edit
                          </Button>
                        </div>
                      </div>
                    ))}
                    <Button variant="outline" className="bg-transparent w-full">
                      + Add Payment Method
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {/* Privacy Settings */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Shield className="h-5 w-5 text-emerald-600" />
                    Privacy Settings
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {Object.entries(privacy).map(([key, value]) => (
                    <div
                      key={key}
                      className="flex items-center justify-between"
                    >
                      <div>
                        <Label
                          htmlFor={`privacy-${key}`}
                          className="text-sm text-slate-700 capitalize"
                        >
                          {key.replace(/([A-Z])/g, " $1").toLowerCase()}
                        </Label>
                        <p className="text-xs text-slate-500 mt-1">
                          {key === "shareData" &&
                            "Allow us to use your data to improve services"}
                          {key === "marketingEmails" &&
                            "Receive marketing and promotional emails"}
                          {key === "locationServices" &&
                            "Use your location for personalized recommendations"}
                        </p>
                      </div>
                      {/* <Switch
                        id={`privacy-${key}`}
                        checked={value}
                        onCheckedChange={() =>
                          handlePrivacyToggle(key as keyof typeof privacy)
                        }
                      /> */}
                    </div>
                  ))}
                </CardContent>
              </Card>

              {/* Save Button */}
              <div className="flex justify-end">
                <Button
                  onClick={handleSaveSettings}
                  disabled={isSaving}
                  className="min-w-32"
                >
                  {isSaving ? "Saving..." : "Save Settings"}
                </Button>
              </div>
            </div>
          </div>
        </div>
      </main>
      {/* <Footer /> */}
    </div>
  );
}
