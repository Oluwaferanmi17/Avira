import { Edit, Star, Trash, Plus, MapPin } from "lucide-react"; // Unified icons
import router from "next/router";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";

interface Stay {
  id: string;
  title: string;
  description?: string;
  photos?: string[];
  isPublished: boolean;
  address?: {
    city?: string;
    country?: string;
  };
  pricing?: {
    basePrice?: number;
  };
  bookings?: { id: string }[];
}

const Listing = () => {
  const [stays, setStays] = useState<Stay[]>([]);
  const [isLoading, setIsLoading] = useState(true); // Added loading state
  const [showModal, setShowModal] = useState(false);
  const [selectedStay, setSelectedStay] = useState<Stay | null>(null);

  // Form state
  const [forms, setForms] = useState({
    title: "",
    description: "",
    price: "",
  });

  const handleClick = () => {
    router.push("/host/stay");
  };

  const handleEdit = async () => {
    try {
      if (!selectedStay?.id) return toast.error("No stay selected");

      const payload = {
        ...forms,
        price: Number(forms.price), // Ensure price is sent as number
      };

      const res = await fetch(`/api/stays/${selectedStay.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) throw new Error("Failed to update stay");

      // OPTIMISTIC UPDATE: Update local state immediately without refresh
      setStays((prevStays) =>
        prevStays.map((stay) =>
          stay.id === selectedStay.id
            ? {
                ...stay,
                title: forms.title,
                description: forms.description,
                pricing: { ...stay.pricing, basePrice: Number(forms.price) },
              }
            : stay,
        ),
      );

      toast.success("Stay updated successfully!", { id: "update-stay" });
      setShowModal(false);
    } catch (error) {
      console.error(error);
      toast.error("Error updating stay", { id: "update-stay" });
    }
  };

  const openEditModal = (stay: Stay) => {
    setSelectedStay(stay);
    setForms({
      title: stay.title || "",
      description: stay.description || "",
      price: stay.pricing?.basePrice?.toString() || "",
    });
    setShowModal(true);
  };

  const handleDelete = async (id: string) => {
    const confirmDelete = confirm("Are you sure you want to delete this stay?");
    if (!confirmDelete) return;

    // Optimistic UI: Remove from list immediately, revert if API fails
    const originalStays = [...stays];
    setStays(stays.filter((stay) => stay.id !== id));

    try {
      const res = await fetch(`/api/stays/${id}`, { method: "DELETE" });
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || "Failed to delete");
      }
      toast.success("Stay deleted successfully!");
    } catch (error) {
      setStays(originalStays); // Revert on failure
      toast.error("Failed to delete stay");
      console.error(error);
    }
  };

  useEffect(() => {
    async function fetchData() {
      try {
        const res = await fetch("/api/my-stays");
        const data = await res.json();
        setStays(Array.isArray(data) ? data : []);
      } catch (error) {
        toast.error("Failed to load stays");
      } finally {
        setIsLoading(false);
      }
    }
    fetchData();
  }, []);

  if (isLoading) {
    return (
      <div className="p-8 text-center text-gray-500">
        Loading your listings...
      </div>
    );
  }

  return (
    <div>
      <div className="mt-4">
        <div className="flex justify-between items-center mb-6">
          {/* <h1 className="text-2xl font-bold">My Properties</h1> */}
          <button
            className="bg-[#00b894] hover:bg-[#00a383] text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
            onClick={handleClick}
          >
            <Plus className="w-4 h-4" /> Add New Stay
          </button>
        </div>

        {stays.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {stays.map((stay) => (
              <div
                key={stay.id}
                className="bg-white rounded-xl border shadow-sm hover:shadow-md transition-shadow overflow-hidden max-w-sm flex flex-col"
              >
                <div className="aspect-video bg-gray-100 relative">
                  {stay.photos && stay.photos.length > 0 ? (
                    <img
                      src={stay.photos[0]}
                      alt={stay.title}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-400">
                      No Image
                    </div>
                  )}
                  <div className="absolute top-2 right-2">
                    <span
                      className={`text-xs font-semibold px-2 py-1 rounded-full ${
                        stay.isPublished
                          ? "bg-green-100 text-green-800"
                          : "bg-gray-100 text-gray-800"
                      }`}
                    >
                      {stay.isPublished ? "Published" : "Draft"}
                    </span>
                  </div>
                </div>

                <div className="p-4 flex-1 flex flex-col">
                  <div className="flex justify-between items-start mb-2">
                    <h2
                      className="text-lg font-semibold text-gray-900 line-clamp-1"
                      title={stay.title}
                    >
                      {stay.title}
                    </h2>
                  </div>

                  <div className="text-gray-500 text-sm flex items-center gap-1 mb-4">
                    <MapPin className="w-3 h-3" />
                    {stay.address?.city || "Unknown City"},{" "}
                    {stay.address?.country || "Unknown Country"}
                  </div>

                  <div className="space-y-2 mb-4 mt-auto">
                    <div className="flex items-center justify-between text-sm">
                      <span className="font-medium text-gray-700">Price:</span>
                      <span className="font-semibold text-[#00b894]">
                        ₦{stay.pricing?.basePrice?.toLocaleString() || 0}
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-600">Bookings:</span>
                      <span className="bg-gray-100 px-2 py-0.5 rounded text-gray-700 text-xs font-medium">
                        {stay.bookings?.length ?? 0} total
                      </span>
                    </div>
                  </div>

                  <div className="flex gap-2 pt-2 border-t">
                    <button
                      className="flex-1 flex items-center justify-center gap-2 border border-gray-200 rounded-lg px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
                      onClick={() => openEditModal(stay)}
                    >
                      <Edit className="w-3 h-3" /> Edit
                    </button>
                    <button
                      className="flex-1 flex items-center justify-center gap-2 border border-red-200 rounded-lg px-3 py-2 text-sm font-medium text-red-600 hover:bg-red-50 transition-colors"
                      onClick={() => handleDelete(stay.id)}
                    >
                      <Trash className="w-3 h-3" /> Delete
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-white p-12 rounded-xl shadow border text-center flex flex-col items-center">
            <div className="bg-gray-100 p-4 rounded-full mb-4">
              <Plus className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-medium text-gray-900">
              No properties found
            </h3>
            <p className="text-gray-500 mt-1 mb-6">
              Get started by creating a new stay listing.
            </p>
            <button
              className="bg-[#00b894] text-white px-4 py-2 rounded-lg flex items-center gap-2"
              onClick={handleClick}
            >
              Create Listing
            </button>
          </div>
        )}

        {/* Modal - Could be extracted to a separate component */}
        {showModal && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl shadow-xl w-full max-w-md overflow-hidden">
              <div className="px-6 py-4 border-b">
                <h2 className="text-xl font-semibold">Edit Stay</h2>
              </div>

              <div className="p-6 space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-1 text-gray-700">
                    Title
                  </label>
                  <input
                    type="text"
                    value={forms.title}
                    onChange={(e) =>
                      setForms({ ...forms, title: e.target.value })
                    }
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-[#00b894] focus:border-transparent outline-none transition-all"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1 text-gray-700">
                    Description
                  </label>
                  <textarea
                    rows={3}
                    value={forms.description}
                    onChange={(e) =>
                      setForms({ ...forms, description: e.target.value })
                    }
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-[#00b894] focus:border-transparent outline-none transition-all"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1 text-gray-700">
                    Price (₦)
                  </label>
                  <input
                    type="number"
                    value={forms.price}
                    onChange={(e) =>
                      setForms({ ...forms, price: e.target.value })
                    }
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-[#00b894] focus:border-transparent outline-none transition-all"
                  />
                </div>
              </div>

              <div className="bg-gray-50 px-6 py-4 flex justify-end gap-3 border-t">
                <button
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-100 font-medium"
                >
                  Cancel
                </button>
                <button
                  onClick={handleEdit}
                  className="px-4 py-2 rounded-lg bg-[#00b894] text-white hover:bg-[#00a383] font-medium shadow-sm"
                >
                  Save Changes
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Listing;
