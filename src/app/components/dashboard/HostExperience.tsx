import {
  MapPin,
  Plus,
  Edit,
  Trash,
  Users,
  Clock,
  Star,
  X,
  ImageIcon,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";

// --- Types ---
interface ExperienceData {
  id: string;
  title: string;
  description?: string;
  photos?: string[];
  duration: string;
  price: number;
  rating?: number;
  venue?: string;
  city?: string;
  country?: string;
  availableDays?: string[];
  _count?: {
    bookings: number;
  };
}

interface ExperienceFormState {
  title: string;
  description: string;
  duration: string;
  price: string; // Keep as string for input handling, convert on submit
  venue: string;
  city: string;
  country: string;
}

const INITIAL_FORM: ExperienceFormState = {
  title: "",
  description: "",
  duration: "",
  price: "",
  venue: "",
  city: "",
  country: "",
};

const MyExperiences = () => {
  const router = useRouter();
  const [experiences, setExperiences] = useState<ExperienceData[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Modal & Form State
  const [showModal, setShowModal] = useState(false);
  const [selectedExperience, setSelectedExperience] =
    useState<ExperienceData | null>(null);
  const [formData, setFormData] = useState<ExperienceFormState>(INITIAL_FORM);
  const [isSaving, setIsSaving] = useState(false);

  // Navigate to create page
  const handleCreate = () => router.push("/host/experience");

  // 1. Fetch Experiences
  useEffect(() => {
    const fetchExperiences = async () => {
      try {
        const res = await fetch("/api/my-experience");
        if (!res.ok) throw new Error("Failed to fetch");
        const data = await res.json();
        setExperiences(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error(err);
        toast.error("Could not load your experiences");
      } finally {
        setIsLoading(false);
      }
    };
    fetchExperiences();
  }, []);

  // 2. Delete (Optimistic)
  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this experience?")) return;

    const original = [...experiences];
    // Optimistic update
    setExperiences((prev) => prev.filter((e) => e.id !== id));

    try {
      const res = await fetch(`/api/experiences/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Failed to delete");
      toast.success("Experience deleted");
    } catch {
      // Revert if failed
      setExperiences(original);
      toast.error("Failed to delete experience");
    }
  };

  // 3. Open Edit Modal
  const openEditModal = (experience: ExperienceData) => {
    setSelectedExperience(experience);
    setFormData({
      title: experience.title,
      description: experience.description || "",
      duration: experience.duration,
      price: experience.price.toString(),
      venue: experience.venue || "",
      city: experience.city || "",
      country: experience.country || "",
    });
    setShowModal(true);
  };

  // 4. Submit Edit
  const handleEditSubmit = async () => {
    if (!selectedExperience) return;
    setIsSaving(true);

    try {
      const payload = {
        ...formData,
        price: Number(formData.price), // Ensure number conversion
      };

      const res = await fetch(`/api/experiences/${selectedExperience.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) throw new Error("Failed to update");

      // Update local state
      setExperiences((prev) =>
        prev.map((e) =>
          e.id === selectedExperience.id ? { ...e, ...payload } : e,
        ),
      );

      toast.success("Experience updated successfully");
      setShowModal(false);
    } catch (err) {
      console.error(err);
      toast.error("Failed to update experience");
    } finally {
      setIsSaving(false);
    }
  };

  // --- Helper: Skeleton Loader ---
  if (isLoading) {
    return (
      <div className="mt-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-pulse">
        {[1, 2, 3].map((i) => (
          <div
            key={i}
            className="bg-gray-100 h-[350px] rounded-xl border-gray-200 border"
          />
        ))}
      </div>
    );
  }

  return (
    <div className="mt-4">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        {/* <h1 className="text-2xl font-bold text-gray-800">My Experiences</h1> */}
        <button
          onClick={handleCreate}
          className="bg-[#00b894] hover:bg-[#00a383] text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors shadow-sm"
        >
          <Plus className="w-4 h-4" /> Host Experience
        </button>
      </div>

      {/* Grid */}
      {experiences.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {experiences.map((exp) => (
            <div
              key={exp.id}
              className="bg-white group rounded-xl border border-gray-100 shadow-sm hover:shadow-lg transition duration-300 overflow-hidden flex flex-col"
            >
              {/* Image Area */}
              <div className="relative h-48 bg-gray-50 overflow-hidden">
                {exp.photos && exp.photos.length > 0 ? (
                  <img
                    src={exp.photos[0]}
                    alt={exp.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                    loading="lazy"
                  />
                ) : (
                  <div className="h-full flex flex-col items-center justify-center text-gray-300">
                    <ImageIcon className="w-10 h-10 mb-2" />
                    <span className="text-xs">No image uploaded</span>
                  </div>
                )}
                <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm px-2 py-1 rounded text-xs font-bold shadow-sm">
                  ★ {exp.rating || "New"}
                </div>
              </div>

              {/* Content */}
              <div className="p-5 flex-1 flex flex-col">
                <div className="mb-4">
                  <h3 className="text-lg font-bold text-gray-900 line-clamp-1 mb-1">
                    {exp.title}
                  </h3>
                  <p className="text-gray-500 text-sm line-clamp-2">
                    {exp.description || "No description provided."}
                  </p>
                </div>

                <div className="space-y-2 text-sm text-gray-600 mt-auto">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4 text-[#00b894]" />
                      <span>{exp.duration}</span>
                    </div>
                    <div className="font-bold text-[#00b894] bg-green-50 px-2 py-1 rounded">
                      ₦{exp.price.toLocaleString()}
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-gray-400" />
                    <span className="line-clamp-1">
                      {exp.venue}, {exp.city}
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <Users className="w-4 h-4 text-gray-400" />
                    <span>{exp._count?.bookings || 0} active bookings</span>
                  </div>
                </div>

                {/* Actions */}
                <div className="grid grid-cols-2 gap-3 pt-4 border-t mt-4">
                  <button
                    onClick={() => openEditModal(exp)}
                    className="flex items-center justify-center gap-2 border border-gray-200 rounded-lg px-3 py-2 text-sm font-medium hover:bg-gray-50 transition-colors"
                  >
                    <Edit className="w-3.5 h-3.5" /> Edit
                  </button>
                  <button
                    onClick={() => handleDelete(exp.id)}
                    className="flex items-center justify-center gap-2 border border-red-100 rounded-lg px-3 py-2 text-sm font-medium text-red-600 hover:bg-red-50 transition-colors"
                  >
                    <Trash className="w-3.5 h-3.5" /> Delete
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
            No experiences yet
          </h3>
          <p className="text-gray-500 mt-1 mb-6">
            Create your first experience to start receiving bookings from
            travelers.
          </p>
          <button
            className="bg-[#00b894] text-white px-4 py-2 rounded-lg flex items-center gap-2"
            onClick={handleCreate}
          >
            Create Experience
          </button>
        </div>
      )}

      {/* Edit Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden animate-in fade-in zoom-in duration-200">
            {/* Modal Header */}
            <div className="px-6 py-4 border-b flex justify-between items-center bg-gray-50">
              <h2 className="text-lg font-semibold text-gray-800">
                Edit Details
              </h2>
              <button
                onClick={() => setShowModal(false)}
                className="p-1 hover:bg-gray-200 rounded-full transition-colors"
              >
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 space-y-4 max-h-[70vh] overflow-y-auto">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Title
                </label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) =>
                    setFormData({ ...formData, title: e.target.value })
                  }
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-[#00b894] focus:border-transparent outline-none transition-all"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Price (₦)
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={formData.price}
                    onChange={(e) =>
                      setFormData({ ...formData, price: e.target.value })
                    }
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-[#00b894] focus:border-transparent outline-none transition-all"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Duration
                  </label>
                  <input
                    type="text"
                    value={formData.duration}
                    onChange={(e) =>
                      setFormData({ ...formData, duration: e.target.value })
                    }
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-[#00b894] focus:border-transparent outline-none transition-all"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Location
                </label>
                <div className="space-y-3">
                  <input
                    placeholder="Venue Name"
                    value={formData.venue}
                    onChange={(e) =>
                      setFormData({ ...formData, venue: e.target.value })
                    }
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm"
                  />
                  <div className="grid grid-cols-2 gap-4">
                    <input
                      placeholder="City"
                      value={formData.city}
                      onChange={(e) =>
                        setFormData({ ...formData, city: e.target.value })
                      }
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm"
                    />
                    <input
                      placeholder="Country"
                      value={formData.country}
                      onChange={(e) =>
                        setFormData({ ...formData, country: e.target.value })
                      }
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm"
                    />
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Description
                </label>
                <textarea
                  rows={4}
                  value={formData.description}
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-[#00b894] focus:border-transparent outline-none transition-all resize-none"
                />
              </div>
            </div>

            {/* Modal Footer */}
            <div className="px-6 py-4 bg-gray-50 border-t flex justify-end gap-3">
              <button
                onClick={() => setShowModal(false)}
                className="px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-200 rounded-lg transition-colors"
                disabled={isSaving}
              >
                Cancel
              </button>
              <button
                onClick={handleEditSubmit}
                disabled={isSaving}
                className="px-4 py-2 bg-[#00b894] hover:bg-[#00a383] text-white text-sm font-medium rounded-lg transition-colors disabled:opacity-50 flex items-center gap-2"
              >
                {isSaving ? "Saving..." : "Save Changes"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MyExperiences;
