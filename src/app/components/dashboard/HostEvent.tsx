import { Calendar, MapPin, Plus, Edit, Trash, Users } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";

// Define strict types for better safety
interface EventData {
  id: string;
  title: string;
  description?: string;
  photos?: string[];
  dateStart: string;
  dateEnd: string;
  venue?: string;
  city?: string;
  country?: string;
  price?: number;
  _count?: {
    bookings: number;
  };
}

const MyEvents = () => {
  const [events, setEvents] = useState<EventData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();
  // Modal & Form State
  const [showModal, setShowModal] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<EventData | null>(null);
  const [forms, setForms] = useState({
    title: "",
    description: "",
    venue: "",
    city: "",
    country: "",
    dateStart: "",
    dateEnd: "",
  });

  // Navigate to create page
  const handleCreate = () => {
    router.push("/host/event");
  };

  // 1. Fetch Events
  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const res = await fetch("/api/my-events", {
          method: "GET",
          // credentials: "include", // Uncomment if your API requires session cookies
        });
        if (!res.ok) throw new Error("Failed to fetch events");
        const data = await res.json();
        setEvents(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error(err);
        toast.error("Failed to load events");
      } finally {
        setIsLoading(false);
      }
    };
    fetchEvents();
  }, []);

  // 2. Delete Handler (Optimistic)
  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to cancel this event?")) return;

    const originalEvents = [...events];
    setEvents(events.filter((e) => e.id !== id)); // Remove immediately from UI

    try {
      const res = await fetch(`/api/events/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Failed to delete");
      toast.success("Event deleted successfully");
    } catch (error) {
      setEvents(originalEvents); // Revert if API fails
      toast.error("Failed to delete event");
    }
  };

  // 3. Open Edit Modal
  const openEditModal = (event: EventData) => {
    setSelectedEvent(event);

    // Format dates for HTML input (YYYY-MM-DDThh:mm)
    const formatForInput = (dateStr: string) => {
      if (!dateStr) return "";
      const date = new Date(dateStr);
      return date.toISOString().slice(0, 16); // Extract "YYYY-MM-DDThh:mm"
    };

    setForms({
      title: event.title,
      description: event.description || "",
      venue: event.venue || "",
      city: event.city || "",
      country: event.country || "",
      dateStart: formatForInput(event.dateStart),
      dateEnd: formatForInput(event.dateEnd),
    });
    setShowModal(true);
  };

  // 4. Submit Edit (Optimistic)
  const handleEditSubmit = async () => {
    if (!selectedEvent) return;

    try {
      const payload = { ...forms };

      const res = await fetch(`/api/events/${selectedEvent.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) throw new Error("Failed to update event");

      // Update local state
      setEvents((prev) =>
        prev.map((e) => (e.id === selectedEvent.id ? { ...e, ...payload } : e)),
      );

      toast.success("Event updated!");
      setShowModal(false);
    } catch (error) {
      console.error(error);
      toast.error("Failed to update event");
    }
  };

  if (isLoading) {
    return (
      <div className="p-8 text-center text-gray-500">
        Loading your events...
      </div>
    );
  }

  return (
    <div>
      <div className="mt-4">
        <div className="flex justify-between items-center mb-6">
          {/* <h1 className="text-2xl font-bold">My Events</h1> */}
          <button
            className="bg-[#00b894] hover:bg-[#00a383] text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
            onClick={handleCreate}
          >
            <Plus className="w-4 h-4" /> Host Event
          </button>
        </div>

        {events.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {events.map((event) => (
              <div
                key={event.id}
                className="bg-white rounded-xl border shadow-sm hover:shadow-md transition-shadow overflow-hidden flex flex-col"
              >
                {/* Image Section */}
                <div className="h-40 bg-gray-100 relative">
                  {event.photos && event.photos.length > 0 ? (
                    <img
                      src={event.photos[0]}
                      alt={event.title}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-400">
                      <Calendar className="w-8 h-8 opacity-20" />
                    </div>
                  )}
                  <div className="absolute top-2 right-2 bg-white/90 backdrop-blur px-2 py-1 rounded text-xs font-bold text-gray-700 shadow-sm">
                    {new Date(event.dateStart).toLocaleDateString(undefined, {
                      month: "short",
                      day: "numeric",
                    })}
                  </div>
                </div>

                {/* Content Section */}
                <div className="p-4 flex-1 flex flex-col space-y-3">
                  <div>
                    <h3
                      className="text-lg font-bold text-gray-900 line-clamp-1"
                      title={event.title}
                    >
                      {event.title}
                    </h3>
                    <p className="text-gray-500 text-sm line-clamp-2 mt-1">
                      {event.description}
                    </p>
                  </div>

                  <div className="space-y-2 text-sm text-gray-600 mt-auto">
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-[#00b894]" />
                      <span>
                        {new Date(event.dateStart).toLocaleTimeString([], {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                        {" - "}
                        {new Date(event.dateEnd).toLocaleTimeString([], {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <MapPin className="w-4 h-4 text-[#00b894]" />
                      <span className="line-clamp-1">
                        {event.venue}, {event.city}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Users className="w-4 h-4 text-[#00b894]" />
                      <span>{event._count?.bookings || 0} attendees</span>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex gap-2 pt-3 border-t mt-4">
                    <button
                      onClick={() => openEditModal(event)}
                      className="flex-1 flex items-center justify-center gap-2 border border-gray-200 rounded-lg px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
                    >
                      <Edit className="w-3 h-3" /> Edit
                    </button>
                    <button
                      onClick={() => handleDelete(event.id)}
                      className="flex-1 flex items-center justify-center gap-2 border border-red-200 rounded-lg px-3 py-2 text-sm font-medium text-red-600 hover:bg-red-50 transition-colors"
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
              <Calendar className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-medium text-gray-900">
              No events found
            </h3>
            <p className="text-gray-500 mt-1 mb-6">
              Start by hosting your first event.
            </p>
            <button
              className="bg-[#00b894] text-white px-4 py-2 rounded-lg flex items-center gap-2"
              onClick={handleCreate}
            >
              Host Event
            </button>
          </div>
        )}

        {/* Edit Modal */}
        {showModal && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl shadow-xl w-full max-w-lg overflow-hidden max-h-[90vh] flex flex-col">
              <div className="px-6 py-4 border-b">
                <h2 className="text-xl font-semibold">Edit Event</h2>
              </div>

              <div className="p-6 space-y-4 overflow-y-auto">
                <div>
                  <label className="block text-sm font-medium mb-1 text-gray-700">
                    Event Title
                  </label>
                  <input
                    type="text"
                    value={forms.title}
                    onChange={(e) =>
                      setForms({ ...forms, title: e.target.value })
                    }
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-[#00b894] focus:border-transparent outline-none"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-1 text-gray-700">
                      Start Date
                    </label>
                    <input
                      type="datetime-local"
                      value={forms.dateStart}
                      onChange={(e) =>
                        setForms({ ...forms, dateStart: e.target.value })
                      }
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-[#00b894] outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1 text-gray-700">
                      End Date
                    </label>
                    <input
                      type="datetime-local"
                      value={forms.dateEnd}
                      onChange={(e) =>
                        setForms({ ...forms, dateEnd: e.target.value })
                      }
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-[#00b894] outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1 text-gray-700">
                    Venue Name
                  </label>
                  <input
                    type="text"
                    value={forms.venue}
                    onChange={(e) =>
                      setForms({ ...forms, venue: e.target.value })
                    }
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-[#00b894] outline-none"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-1 text-gray-700">
                      City
                    </label>
                    <input
                      type="text"
                      value={forms.city}
                      onChange={(e) =>
                        setForms({ ...forms, city: e.target.value })
                      }
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-[#00b894] outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1 text-gray-700">
                      Country
                    </label>
                    <input
                      type="text"
                      value={forms.country}
                      onChange={(e) =>
                        setForms({ ...forms, country: e.target.value })
                      }
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-[#00b894] outline-none"
                    />
                  </div>
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
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-[#00b894] outline-none"
                  />
                </div>
              </div>

              <div className="bg-gray-50 px-6 py-4 flex justify-end gap-3 border-t mt-auto">
                <button
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-100 font-medium"
                >
                  Cancel
                </button>
                <button
                  onClick={handleEditSubmit}
                  className="px-4 py-2 rounded-lg bg-[#00b894] text-white hover:bg-[#00a383] font-medium"
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

export default MyEvents;
