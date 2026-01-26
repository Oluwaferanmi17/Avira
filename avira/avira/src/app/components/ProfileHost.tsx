"use client";
import { useRef, useState, useEffect } from "react";
import { FaCamera } from "react-icons/fa";
export default function HostProfileHeader() {
  const [profilePic, setProfilePic] = useState<string | null>(null);
  const [bannerPic, setBannerPic] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const profileInputRef = useRef<HTMLInputElement>(null);
  const bannerInputRef = useRef<HTMLInputElement>(null);
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await fetch("/api/user/me");
        const data = await res.json();
        if (data.user) {
          setProfilePic(data.user.profileImage || null);
          setBannerPic(data.user.bannerImage || null);
        }
      } catch (error) {
        console.error("Failed to load user:", error);
      }
    };
    fetchUser();
  }, []);
  const uploadImage = async (file: File, type: "profile" | "banner") => {
    setLoading(true);
    const formData = new FormData();
    formData.append("file", file);
    formData.append("type", type);

    try {
      const res = await fetch("/api/user/profile-upload", {
        method: "POST",
        body: formData,
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Upload failed");

      if (type === "profile") setProfilePic(data.user.profileImage);
      else setBannerPic(data.user.bannerImage);
    } catch (err) {
      console.error(err);
      alert("Error uploading image");
    } finally {
      setLoading(false);
    }
  };

  const handleImageUpload = async (
    event: React.ChangeEvent<HTMLInputElement>,
    setImage: React.Dispatch<React.SetStateAction<string | null>>,
    type: "profile" | "banner"
  ) => {
    const file = event.target.files?.[0];
    if (file) {
      // Local preview
      const imageUrl = URL.createObjectURL(file);
      setImage(imageUrl);

      // Upload to Cloudinary via API
      await uploadImage(file, type);
    }
  };

  return (
    <div className="w-full">
      {/* Banner Image */}
      <div className="relative h-48 bg-gray-200 rounded-xl overflow-hidden shadow">
        {bannerPic && (
          <img
            src={bannerPic}
            alt="Banner"
            className="w-full h-full object-cover"
          />
        )}
        <button
          onClick={() => bannerInputRef.current?.click()}
          disabled={loading}
          className="absolute top-2 right-2 bg-white p-2 rounded-full shadow hover:bg-gray-100 disabled:opacity-50"
        >
          <FaCamera />
        </button>
        <input
          type="file"
          accept="image/*"
          className="hidden"
          ref={bannerInputRef}
          onChange={(e) => handleImageUpload(e, setBannerPic, "banner")}
        />
      </div>

      {/* Profile Picture */}
      <div className="relative -mt-12 ml-6">
        <div className="relative w-24 h-24">
          <img
            src={profilePic || "/default-avatar.png"}
            alt="Profile"
            className="w-full h-full object-cover rounded-full border-4 border-white shadow-lg"
          />
          <button
            onClick={() => profileInputRef.current?.click()}
            disabled={loading}
            className="absolute bottom-0 right-0 bg-white p-1 rounded-full shadow hover:bg-gray-100 disabled:opacity-50"
          >
            <FaCamera className="w-4 h-4" />
          </button>
          <input
            type="file"
            accept="image/*"
            className="hidden"
            ref={profileInputRef}
            onChange={(e) => handleImageUpload(e, setProfilePic, "profile")}
          />
        </div>
      </div>
    </div>
  );
}
