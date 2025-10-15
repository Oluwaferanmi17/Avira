"use client";
import NavBar from "@/app/components/NavBar";
import { useEffect, useState } from "react";

export default function ProfileSettings() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    bio: "",
    profilePic: "",
    notifications: true,
    darkMode: false,
  });

  const [loading, setLoading] = useState(true);

  // 🟢 Fetch user data on mount
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await fetch("/api/profile");
        if (res.ok) {
          const data = await res.json();
          setForm({
            name: data.name || "",
            email: data.email || "",
            phone: data.phone || "",
            bio: data.bio || "",
            profilePic: data.profilePic || "",
            notifications: data.notifications ?? true,
            darkMode: data.darkMode ?? false,
          });
        }
      } catch (err) {
        console.error("Failed to load profile:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, []);

  // 🟡 Handle changes
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const target = e.target;
    const { name, value } = target;

    // If it's a checkbox input, use its `checked` property
    if (target instanceof HTMLInputElement && target.type === "checkbox") {
      setForm({
        ...form,
        [name]: target.checked,
      });
    } else {
      setForm({
        ...form,
        [name]: value,
      });
    }
  };

  // 🟠 Save changes
  const handleSave = async () => {
    try {
      const res = await fetch("/api/profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      if (!res.ok) throw new Error("Failed to save profile");
      alert("✅ Profile updated successfully!");
    } catch (err) {
      alert("❌ Failed to save profile");
      console.error(err);
    }
  };

  if (loading) return <p className="text-center mt-20">Loading profile...</p>;

  return (
    <div>
      <NavBar />
      <div className="max-w-3xl mx-auto mt-10 bg-white rounded-xl shadow p-6">
        <h1 className="text-2xl font-bold mb-6">Profile Settings</h1>

        {/* Profile Picture */}
        <div className="flex items-center gap-4 mb-6">
          <img
            src={
              form.profilePic ||
              `https://ui-avatars.com/api/?name=${encodeURIComponent(
                form.name || "User"
              )}&background=00b894&color=fff`
            }
            alt="Profile"
            className="w-20 h-20 rounded-full object-cover"
          />
          <div>
            <label className="block text-sm font-medium mb-1">
              Change Profile Picture
            </label>
            <input
              type="file"
              accept="image/*"
              className="text-sm"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) {
                  const reader = new FileReader();
                  reader.onload = () =>
                    setForm({ ...form, profilePic: reader.result as string });
                  reader.readAsDataURL(file);
                }
              }}
            />
          </div>
        </div>

        {/* Inputs */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
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
            disabled
            className="border rounded-lg px-3 py-2 w-full bg-gray-100 cursor-not-allowed"
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

        <div className="mb-6">
          <textarea
            name="bio"
            value={form.bio}
            onChange={handleChange}
            placeholder="Tell us about yourself..."
            className="w-full border rounded-lg px-3 py-2"
            rows={4}
          />
        </div>

        <div className="space-y-4 mb-6">
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              name="notifications"
              checked={form.notifications}
              onChange={handleChange}
              className="w-5 h-5"
            />
            Enable Email Notifications
          </label>
        </div>

        <button
          onClick={handleSave}
          className="bg-[#00b894] text-white px-6 py-3 rounded-lg font-semibold hover:bg-[#019a7a]"
        >
          Save Changes
        </button>
      </div>
    </div>
  );
}
