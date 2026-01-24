"use client";
import NavBar from "@/app/components/Home/NavBar";
import { useEffect, useState } from "react";

export default function ProfileSettings() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    bio: "",
    profileImage: "",
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
            profileImage: data.profileImage || "",
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
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
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
              form.profileImage ||
              `https://ui-avatars.com/api/?name=${encodeURIComponent(
                form.name || "User",
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
                    setForm({ ...form, profileImage: reader.result as string });
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

// import { useEffect, useRef, useState } from "react";
// import {
//   User,
//   Mail,
//   Phone,
//   Lock,
//   Bell,
//   CreditCard,
//   Shield,
//   Camera,
//   CheckCircle2,
//   ChevronLeft,
//   AlertCircle,
//   Loader2,
//   type LucideIcon,
// } from "lucide-react";
// import toast from "react-hot-toast";
// const SettingsCard = ({
//   icon: Icon,
//   title,
//   children,
// }: {
//   icon: LucideIcon;
//   title: string;
//   children: React.ReactNode;
// }) => (
//   <div className="bg-white rounded-lg border border-slate-200 shadow-sm overflow-hidden">
//     <div className="px-6 py-4 border-b border-slate-100">
//       <h3 className="text-lg font-semibold text-slate-900 flex items-center gap-2">
//         <Icon className="h-5 w-5 text-emerald-600" />
//         {title}
//       </h3>
//     </div>
//     <div className="p-6 space-y-6">{children}</div>
//   </div>
// );
// const labelClass = "block text-sm font-medium text-slate-700 mb-1.5";
// const inputClass =
//   "flex h-10 w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-600 focus:border-transparent disabled:cursor-not-allowed disabled:opacity-50 transition-all duration-200";
// const page = () => {
//   const [profile, setProfile] = useState<UserProfile>({
//     name: "",
//     email: "",
//     phone: "",
//     bio: "",
//     avatar: "/default-avatar.png",
//   });
//   const [imageUploading, setImageUploading] = useState(false);
//   const profileInputRef = useRef<HTMLInputElement>(null);
//   useEffect(() => {
//     const fetchUser = async () => {
//       try {
//         const res = await fetch("/api/user/settings/me", {
//           credentials: "include",
//         });

//         if (!res.ok) throw new Error("Failed to fetch user");

//         const data = await res.json();

//         setProfile({
//           name: data?.name ?? "",
//           email: data?.email ?? "",
//           phone: data?.phone ?? "",
//           bio: data?.bio ?? "",
//           avatar:
//             data?.profileImage ??
//             `https://ui-avatars.com/api/?name=${encodeURIComponent(
//               data?.name || "User",
//             )}`,
//         });

//         // If your API returns these settings, map them here.
//         // Otherwise, we keep local defaults.
//         if (data?.notifications) setNotifications(data.notifications);
//         if (data?.privacy) setPrivacy(data.privacy);
//       } catch (error) {
//         console.error("Error fetching user settings:", error);
//         toast.error("Could not load user data");
//       } finally {
//         setInitialLoading(false);
//       }
//     };

//     fetchUser();
//   }, []);

//   // --- Handlers ---

//   const uploadImage = async (file: File) => {
//     try {
//       setImageUploading(true);

//       const formData = new FormData();
//       formData.append("file", file);

//       const res = await fetch("/api/upload", {
//         method: "POST",
//         body: formData,
//       });

//       const data = await res.json();

//       if (!data.secure_url) {
//         throw new Error("Upload failed");
//       }

//       // Add timestamp to force cache refresh
//       const imageUrl = `${data.secure_url}?t=${Date.now()}`;

//       setProfile((prev) => ({
//         ...prev,
//         avatar: imageUrl,
//       }));

//       // Optional: Immediately save the avatar URL to the backend profile
//       await fetch("/api/user/settings/profile", {
//         method: "PATCH",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({ avatar: data.secure_url }), // Send clean URL without timestamp
//       });

//       toast.success("Profile photo updated!");
//     } catch (err) {
//       console.error(err);
//       toast.error("Failed to upload image");
//     } finally {
//       setImageUploading(false);
//     }
//   };

//   const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
//     const file = event.target.files?.[0];
//     if (file) uploadImage(file);
//   };

//   const handleProfileUpdate = (field: keyof UserProfile, value: string) => {
//     setProfile((prev) => ({ ...prev, [field]: value }));
//   };
//   return (
//     <div>
//       <SettingsCard icon={User} title="Profile Settings">
//         {/* Avatar Section */}
//         <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6 mb-6">
//           <div className="relative group">
//             <div className="w-24 h-24 rounded-full overflow-hidden border-4 border-slate-100 shadow-md">
//               <img
//                 src={profile.avatar || "/default-avatar.png"}
//                 alt="Profile"
//                 className="w-full h-full object-cover"
//               />
//             </div>
//             <button
//               onClick={() => profileInputRef.current?.click()}
//               disabled={imageUploading}
//               className="absolute bottom-0 right-0 bg-white p-2 rounded-full shadow-md border border-slate-200 hover:bg-slate-50 transition-colors disabled:opacity-50"
//               title="Change Profile Photo"
//             >
//               {imageUploading ? (
//                 <Loader2 className="w-4 h-4 animate-spin text-emerald-600" />
//               ) : (
//                 <Camera className="w-4 h-4 text-slate-700" />
//               )}
//             </button>
//             <input
//               type="file"
//               ref={profileInputRef}
//               onChange={handleImageUpload}
//               accept="image/*"
//               className="hidden"
//             />
//           </div>
//           <div>
//             <h4 className="text-sm font-medium text-slate-900">
//               Profile Photo
//             </h4>
//             <p className="text-xs text-slate-500 mt-1 max-w-xs">
//               Supports JPG, PNG or GIF. Max file size 5MB.
//             </p>
//           </div>
//         </div>

//         {/* Profile Form */}
//         <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//           <div>
//             <label htmlFor="name" className={labelClass}>
//               Full Name
//             </label>
//             <input
//               id="name"
//               value={profile.name}
//               onChange={(e) => handleProfileUpdate("name", e.target.value)}
//               className={inputClass}
//             />
//           </div>
//           <div>
//             <label
//               htmlFor="email"
//               className={`${labelClass} flex items-center gap-2`}
//             >
//               <Mail className="h-3.5 w-3.5 text-slate-400" /> Email
//             </label>
//             <input
//               id="email"
//               type="email"
//               value={profile.email}
//               onChange={(e) => handleProfileUpdate("email", e.target.value)}
//               className={inputClass}
//             />
//           </div>
//           <div>
//             <label
//               htmlFor="phone"
//               className={`${labelClass} flex items-center gap-2`}
//             >
//               <Phone className="h-3.5 w-3.5 text-slate-400" /> Phone
//             </label>
//             <input
//               id="phone"
//               value={profile.phone}
//               onChange={(e) => handleProfileUpdate("phone", e.target.value)}
//               className={inputClass}
//             />
//           </div>
//           <div className="md:col-span-2">
//             <label htmlFor="bio" className={labelClass}>
//               Bio
//             </label>
//             <textarea
//               id="bio"
//               value={profile.bio}
//               onChange={(e) => handleProfileUpdate("bio", e.target.value)}
//               rows={3}
//               className={`${inputClass} h-auto min-h-[80px] py-3`}
//               placeholder="Tell us a bit about yourself..."
//             />
//           </div>
//         </div>
//       </SettingsCard>
//       ;
//     </div>
//   );
// };

// export default page;
