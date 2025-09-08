"use client";
import { useRef, useState } from "react";
import { FaCamera } from "react-icons/fa";
export default function HostProfileHeader() {
  const [profilePic, setProfilePic] = useState<string | null>(null);
  const [bannerPic, setBannerPic] = useState<string | null>(null);

  const profileInputRef = useRef<HTMLInputElement>(null);
  const bannerInputRef = useRef<HTMLInputElement>(null);

  const handleImageUpload = (
    event: React.ChangeEvent<HTMLInputElement>,
    setImage: React.Dispatch<React.SetStateAction<string | null>>
  ) => {
    const file = event.target.files?.[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setImage(imageUrl);
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
          className="absolute top-2 right-2 bg-white p-2 rounded-full shadow hover:bg-gray-100"
        >
          <FaCamera />
        </button>
        <input
          type="file"
          accept="image/*"
          className="hidden"
          ref={bannerInputRef}
          onChange={(e) => handleImageUpload(e, setBannerPic)}
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
            className="absolute bottom-0 right-0 bg-white p-1 rounded-full shadow hover:bg-gray-100"
          >
            <FaCamera className="w-4 h-4" />
          </button>
          <input
            type="file"
            accept="image/*"
            className="hidden"
            ref={profileInputRef}
            onChange={(e) => handleImageUpload(e, setProfilePic)}
          />
        </div>
        {/* <h2 className="text-lg font-semibold mt-2">Hello, Host 👋</h2>
        <p className="text-sm text-gray-500">
          Edit your profile & manage listings
        </p> */}
      </div>
    </div>
  );
}
