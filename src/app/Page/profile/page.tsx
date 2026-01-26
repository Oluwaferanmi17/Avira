"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { useEffect, useRef, useState } from "react";
import {
  User,
  Mail,
  Phone,
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

// --- Reusable Sub-Components ---

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

const ProfileSkeleton = () => (
  <div className="animate-pulse space-y-6 max-w-4xl mx-auto pt-8 px-4">
    <div className="h-8 bg-slate-200 rounded w-1/4 mb-4"></div>
    <div className="h-96 bg-slate-100 rounded-lg border border-slate-200"></div>
  </div>
);

// --- Styles ---
const labelClass = "block text-sm font-medium text-slate-700 mb-1.5";
const inputClass =
  "flex h-10 w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-600 focus:border-transparent disabled:cursor-not-allowed disabled:opacity-50 transition-all duration-200";
const buttonPrimaryClass =
  "inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-white transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-950 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-slate-900 text-slate-50 hover:bg-slate-900/90 h-10 px-4 py-2";

// --- Main Component ---

export default function ProfilePage() {
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
              data?.name || "User",
            )}`,
        });
      } catch (error) {
        console.error("Error fetching user profile:", error);
        toast.error("Could not load profile data");
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

      // Immediately save the avatar URL to the backend
      await fetch("/api/user/settings/profile", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ avatar: data.secure_url }),
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

  const handleSaveProfile = async () => {
    setIsSaving(true);
    setSaveMessage({ type: "", text: "" });

    try {
      const res = await fetch("/api/user/settings/profile", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(profile),
      });

      if (!res.ok) throw new Error("Failed to save");

      setSaveMessage({
        type: "success",
        text: "Profile updated successfully!",
      });
      toast.success("Profile updated");
    } catch (error) {
      console.error(error);
      setSaveMessage({ type: "error", text: "Failed to update profile." });
      toast.error("Failed to update profile");
    } finally {
      setIsSaving(false);
      setTimeout(() => setSaveMessage({ type: "", text: "" }), 3000);
    }
  };

  if (initialLoading) return <ProfileSkeleton />;

  return (
    <div className="min-h-screen flex flex-col bg-white text-slate-900">
      <NavBar />
      <main className="flex-1">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="max-w-4xl mx-auto">
            {/* Header */}
            <div className="mb-8">
              <Link href="/settings">
                <Button
                  variant="outline"
                  className="bg-transparent mb-4"
                  size="sm"
                >
                  <ChevronLeft className="h-4 w-4 mr-1" /> Back to Settings
                </Button>
              </Link>
              <h1 className="text-2xl sm:text-3xl font-semibold tracking-tight text-slate-900">
                Edit Profile
              </h1>
              <p className="text-slate-600 mt-2">
                Update your personal information and public profile
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
              {/* --- Profile Card --- */}
              <SettingsCard icon={User} title="Personal Information">
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

              {/* --- Action Bar --- */}
              <div className="flex justify-end pt-4">
                <button
                  onClick={handleSaveProfile}
                  disabled={isSaving || initialLoading}
                  className={`${buttonPrimaryClass} min-w-[140px] shadow-sm`}
                >
                  {isSaving ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Saving...
                    </>
                  ) : (
                    "Save Changes"
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
