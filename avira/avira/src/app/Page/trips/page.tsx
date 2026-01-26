"use client";
import { useEffect, useState } from "react";
import Image from "next/image";
import NavBar from "@/app/components/Home/NavBar";
interface Trip {
  id: string;
  type: "stay" | "event" | "experience";
  title: string;
  location: string;
  dateStart: string | null;
  dateEnd: string | null;
  price: string;
  image: string | null;
  createdAt: string;
  hostId: string;
  hostName?: string; // optional, if you want to show it later
  hostImage?: string; // optional
}
import { useRouter } from "next/navigation";
import { MessageSquare } from "lucide-react";
import ReviewModal from "@/app/components/ReviewModal";
export default function TripsPage() {
  const [trips, setTrips] = useState<Trip[]>([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    const fetchTrips = async () => {
      try {
        const res = await fetch("/api/trips");
        if (!res.ok) throw new Error("Failed to load trips");
        const data = await res.json();
        setTrips(data);
      } catch (error) {
        console.error("Error fetching trips:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchTrips();
  }, []);
  const today = new Date();
  const upcomingTrips = trips.filter(
    (t) => t.dateStart && new Date(t.dateStart) > today
  );
  const currentTrips = trips.filter(
    (t) =>
      t.dateStart &&
      t.dateEnd &&
      new Date(t.dateStart) <= today &&
      new Date(t.dateEnd) >= today
  );
  const pastTrips = trips.filter(
    (t) => t.dateEnd && new Date(t.dateEnd) < today
  );
  const formatDate = (dateStr: string | null) =>
    dateStr
      ? new Date(dateStr).toLocaleDateString("en-US", {
          month: "short",
          day: "numeric",
          year: "numeric",
        })
      : "—";

  if (loading)
    return (
      <div className="text-center mt-10 text-gray-500">
        Loading your trips...
      </div>
    );
  return (
    <div>
      <NavBar />
      <div className="max-w-6xl mx-auto px-4 py-10">
        <h1 className="text-3xl font-bold text-emerald-700 mb-6">Your Trips</h1>
        <TripSection
          title="Upcoming Trips"
          trips={upcomingTrips}
          formatDate={formatDate}
        />
        <TripSection
          title="Ongoing Trips"
          trips={currentTrips}
          formatDate={formatDate}
        />
        <TripSection
          title="Past Trips"
          trips={pastTrips}
          formatDate={formatDate}
        />
      </div>
    </div>
  );
}
function TripSection({
  title,
  trips,
  formatDate,
}: {
  title: string;
  trips: Trip[];
  formatDate: (date: string | null) => string;
}) {
  const router = useRouter();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedTrip, setSelectedTrip] = useState<Trip | null>(null);
  const handleContactHost = async (hostId: string) => {
    try {
      if (!hostId) {
        console.error("Host ID missing");
        return;
      }

      // ✅ Create or fetch existing conversation
      const res = await fetch("/api/conversations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ receiverId: hostId }),
      });

      if (!res.ok) {
        const err = await res.json();
        console.error("Failed to start conversation:", err);
        return;
      }

      const conversation = await res.json();

      // ✅ Redirect guest to messages page
      router.push(`/Page/messages?conversationId=${conversation.id}`);
    } catch (error) {
      console.error("Error starting conversation:", error);
    }
  };
  if (trips.length === 0) return null;
  return (
    <div className="mb-10">
      <h2 className="text-xl font-semibold text-gray-800 mb-4">{title}</h2>
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {trips.map((trip) => (
          <div
            key={trip.id}
            className="rounded-2xl overflow-hidden shadow-md hover:shadow-lg transition bg-white"
          >
            {trip.image ? (
              <div className="relative h-48 w-full">
                <Image
                  src={trip.image}
                  alt={trip.title}
                  fill
                  className="object-cover"
                />
              </div>
            ) : (
              <div className="h-48 bg-gray-200 flex items-center justify-center text-gray-400">
                No Image
              </div>
            )}
            <div className="p-4">
              <div className="flex justify-between items-center mb-2">
                <span className="text-xs uppercase tracking-wide text-emerald-600 font-medium">
                  {trip.type}
                </span>
                <span className="text-sm text-gray-500">{trip.price}</span>
              </div>
              <h3 className="font-semibold text-gray-800 line-clamp-1">
                {trip.title}
              </h3>
              <p className="text-sm text-gray-500 line-clamp-1">
                {trip.location}
              </p>
              <p className="text-xs text-gray-400 mt-2">
                {formatDate(trip.dateStart)} - {formatDate(trip.dateEnd)}
              </p>
              <button
                onClick={() => handleContactHost(trip.hostId)}
                className="flex items-center gap-2 border rounded-md px-4 py-2 text-sm hover:bg-gray-100 transition ml-45"
              >
                <MessageSquare className="w-4 h-4" />
                Contact Host
              </button>
              <button
                onClick={() => {
                  setSelectedTrip(trip);
                  setIsModalOpen(true);
                }}
                className="bg-black text-white px-4 py-2 rounded-lg"
              >
                Leave a Review
              </button>
            </div>
          </div>
        ))}
      </div>
      {selectedTrip && (
        <ReviewModal
          isOpen={isModalOpen}
          onClose={() => {
            setIsModalOpen(false);
            setSelectedTrip(null);
          }}
          stayId={selectedTrip.type === "stay" ? selectedTrip.id : undefined}
          eventId={selectedTrip.type === "event" ? selectedTrip.id : undefined}
          experienceId={
            selectedTrip.type === "experience" ? selectedTrip.id : undefined
          }
          onSuccess={() => console.log("Review submitted successfully")}
        />
      )}
    </div>
  );
}
