import prisma from "@/lib/prismadb";
import { notFound } from "next/navigation";
import { CalendarDays, MapPin } from "lucide-react";
import { format } from "date-fns";

interface Props {
  params: { eventId: string };
}

export default async function EventPage({ params }: Props) {
  const event = await prisma.event.findUnique({
    where: { id: Number(params.eventId) }, // 🔴 IMPORTANT
  });

  if (!event) return notFound();

  return (
    <main className="min-h-screen bg-white">
      {/* Hero */}
      <div className="h-[45vh] relative">
        <img
          src={event.photos[0]}
          alt={event.title}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black/40" />
        <div className="absolute bottom-6 left-6 text-white">
          <h1 className="text-4xl font-bold">{event.title}</h1>
          <div className="flex gap-4 mt-2 text-sm">
            <span className="flex items-center gap-1">
              <MapPin size={16} /> {event.city}, {event.country}
            </span>
            <span className="flex items-center gap-1">
              <CalendarDays size={16} />
              {format(new Date(event.dateStart), "PPP")}
            </span>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-4 py-10">
        <h2 className="text-xl font-semibold mb-3">About this event</h2>
        <p className="text-gray-700">{event.description}</p>

        <div className="mt-8">
          <button className="bg-[#00b894] text-white px-6 py-3 rounded-md">
            Book Tickets
          </button>
        </div>
      </div>
    </main>
  );
}
