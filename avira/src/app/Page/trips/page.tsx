"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import {
  MessageSquare,
  Star,
  MapPin,
  Calendar,
  AlertCircle,
} from "lucide-react";
import NavBar from "@/app/components/Home/NavBar";
import ReviewModal from "@/app/components/ReviewModal";

// --- Types ---
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
  hostName?: string;
  hostImage?: string;
}

// --- Main Page Component ---
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

  // Filter Logic
  const upcomingTrips = trips.filter(
    (t) => t.dateStart && new Date(t.dateStart) > today,
  );

  const currentTrips = trips.filter(
    (t) =>
      t.dateStart &&
      t.dateEnd &&
      new Date(t.dateStart) <= today &&
      new Date(t.dateEnd) >= today,
  );

  const pastTrips = trips.filter(
    (t) => t.dateEnd && new Date(t.dateEnd) < today,
  );

  const formatDate = (dateStr: string | null) =>
    dateStr
      ? new Date(dateStr).toLocaleDateString("en-US", {
          month: "short",
          day: "numeric",
          year: "numeric",
        })
      : "—";

  if (loading) return <TripsSkeleton />;

  return (
    <div className="min-h-screen bg-gray-50">
      <NavBar />
      <div className="max-w-6xl mx-auto px-4 py-10">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Trips</h1>
        <p className="text-gray-500 mb-8">
          Manage your upcoming and past getaways.
        </p>

        {trips.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-2xl border border-dashed border-gray-300">
            <div className="mx-auto w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
              <Calendar className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-medium text-gray-900">
              No trips booked yet
            </h3>
            <p className="text-gray-500 mt-1">Time to dust off your luggage!</p>
          </div>
        ) : (
          <div className="space-y-12">
            <TripSection
              title="Current Trips"
              trips={currentTrips}
              formatDate={formatDate}
              badgeColor="bg-emerald-100 text-emerald-800"
              statusLabel="Happening Now"
            />

            <TripSection
              title="Upcoming Trips"
              trips={upcomingTrips}
              formatDate={formatDate}
              badgeColor="bg-blue-100 text-blue-800"
            />

            <TripSection
              title="Past Trips"
              trips={pastTrips}
              formatDate={formatDate}
              showReviewBtn={true} // Only allow reviews for past trips
              badgeColor="bg-gray-100 text-gray-600"
            />
          </div>
        )}
      </div>
    </div>
  );
}

// --- Section Component ---
function TripSection({
  title,
  trips,
  formatDate,
  showReviewBtn = false,
  badgeColor,
  statusLabel,
}: {
  title: string;
  trips: Trip[];
  formatDate: (date: string | null) => string;
  showReviewBtn?: boolean;
  badgeColor: string;
  statusLabel?: string;
}) {
  const router = useRouter();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedTrip, setSelectedTrip] = useState<Trip | null>(null);
  const [contacting, setContacting] = useState<string | null>(null);

  const handleContactHost = async (hostId: string, tripId: string) => {
    try {
      setContacting(tripId);
      if (!hostId) return;

      const res = await fetch("/api/conversations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ receiverId: hostId }),
      });

      if (!res.ok) throw new Error("Failed to start chat");

      const conversation = await res.json();
      router.push(`/Page/messages?conversationId=${conversation.id}`);
    } catch (error) {
      console.error("Error starting conversation:", error);
      alert("Could not contact host at this time.");
    } finally {
      setContacting(null);
    }
  };

  if (trips.length === 0) return null;

  return (
    <div>
      <h2 className="text-xl font-bold text-gray-800 mb-5 flex items-center gap-2">
        {title}
        <span className="bg-gray-100 text-gray-600 text-xs font-medium px-2.5 py-0.5 rounded-full">
          {trips.length}
        </span>
      </h2>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {trips.map((trip) => (
          <div
            key={trip.id}
            className="group rounded-xl overflow-hidden border border-gray-200 bg-white hover:shadow-lg transition-all duration-300 flex flex-col h-full"
          >
            {/* Image Section */}
            <div className="relative h-48 w-full bg-gray-100">
              {trip.image ? (
                <Image
                  src={trip.image}
                  alt={trip.title}
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                />
              ) : (
                <div className="flex items-center justify-center h-full text-gray-400">
                  <Image
                    src="/placeholder-trip.jpg" // Ensure you have a placeholder or use an icon
                    alt="No Image"
                    width={50}
                    height={50}
                    className="opacity-50"
                  />
                </div>
              )}
              {/* Type Badge */}
              <div className="absolute top-3 left-3">
                <span
                  className={`px-3 py-1 rounded-full text-xs font-semibold shadow-sm uppercase tracking-wide ${badgeColor}`}
                >
                  {statusLabel || trip.type}
                </span>
              </div>
            </div>

            {/* Content Section */}
            <div className="p-5 flex flex-col grow">
              <div className="flex justify-between items-start mb-2">
                <h3 className="font-bold text-gray-900 line-clamp-1 text-lg">
                  {trip.title}
                </h3>
                <span className="text-sm font-medium text-gray-900 bg-gray-50 px-2 py-1 rounded">
                  {trip.price}
                </span>
              </div>

              <div className="space-y-2 mb-6">
                <div className="flex items-center text-sm text-gray-500">
                  <MapPin className="w-4 h-4 mr-2 text-gray-400" />
                  <span className="line-clamp-1">{trip.location}</span>
                </div>
                <div className="flex items-center text-sm text-gray-500">
                  <Calendar className="w-4 h-4 mr-2 text-gray-400" />
                  <span>
                    {formatDate(trip.dateStart)} - {formatDate(trip.dateEnd)}
                  </span>
                </div>
              </div>

              {/* Action Buttons - Pushed to bottom */}
              <div className="mt-auto grid grid-cols-1 gap-3">
                <button
                  onClick={() => handleContactHost(trip.hostId, trip.id)}
                  disabled={contacting === trip.id}
                  className="w-full flex items-center justify-center gap-2 border border-gray-300 rounded-lg px-4 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50 transition"
                >
                  {contacting === trip.id ? (
                    <span className="w-4 h-4 border-2 border-gray-600 border-t-transparent rounded-full animate-spin"></span>
                  ) : (
                    <MessageSquare className="w-4 h-4" />
                  )}
                  Message Host
                </button>

                {showReviewBtn && (
                  <button
                    onClick={() => {
                      setSelectedTrip(trip);
                      setIsModalOpen(true);
                    }}
                    className="w-full flex items-center justify-center gap-2 bg-black text-white rounded-lg px-4 py-2.5 text-sm font-medium hover:bg-gray-800 transition"
                  >
                    <Star className="w-4 h-4" />
                    Write a Review
                  </button>
                )}
              </div>
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
          onSuccess={() => {
            setIsModalOpen(false);
            // Optional: Add toast notification here
          }}
        />
      )}
    </div>
  );
}

// --- Skeleton Loader Component ---
function TripsSkeleton() {
  return (
    <div className="max-w-6xl mx-auto px-4 py-10">
      <div className="h-8 w-48 bg-gray-200 rounded mb-8 animate-pulse"></div>
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {[1, 2, 3].map((i) => (
          <div
            key={i}
            className="bg-white rounded-xl border border-gray-200 h-96 animate-pulse"
          >
            <div className="h-48 bg-gray-200 rounded-t-xl"></div>
            <div className="p-4 space-y-3">
              <div className="h-6 bg-gray-200 rounded w-3/4"></div>
              <div className="h-4 bg-gray-200 rounded w-1/2"></div>
              <div className="h-10 bg-gray-200 rounded w-full mt-6"></div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
