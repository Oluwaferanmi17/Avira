"use client";
import { useState } from "react";
export default function ProfileSettings() {
  const [form, setForm] = useState({
    name: "John Doe",
    email: "john@example.com",
    phone: "+234 801 234 5678",
    bio: "Traveler, foodie, and adventure seeker 🌍",
    profilePic: "",
    notifications: true,
    darkMode: false,
  });
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value, type, checked } = e.target;
    setForm({
      ...form,
      [name]: type === "checkbox" ? checked : value,
    });
  };
  const handleSave = () => {
    alert("✅ Profile settings saved (mock)!");
  };
  return (
    <div className="max-w-3xl mx-auto mt-10 bg-white rounded-xl shadow p-6">
      <h1 className="text-2xl font-bold mb-6">Profile Settings</h1>
      <div className="flex items-center gap-4 mb-6">
        <img
          src={
            form.profilePic ||
            "https://ui-avatars.com/api/?name=" +
              encodeURIComponent(form.name) +
              "&background=00b894&color=fff"
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
          onChange={handleChange}
          placeholder="Email"
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
  );
}
