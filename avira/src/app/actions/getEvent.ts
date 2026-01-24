import prisma from "../../lib/prismadb";
export async function getEvents() {
  try {
    const res = await fetch("/api/events");
    if (!res.ok) throw new Error("Failed to fetch events");
    return await res.json();
  } catch (err) {
    console.error("GET_EVENTS_ERROR", err);
    return [];
  }
}
export async function getEventById(id: number) {
  try {
    const event = await prisma.event.findUnique({
      where: {
        id: id,
      },
    });

    if (!event) return null;

    // Convert dates to strings to avoid "Client Component" errors
    return {
      ...event,
      createdAt: event.createdAt.toISOString(),
      updatedAt: event.updatedAt.toISOString(),
      dateStart: event.dateStart.toISOString(),
      dateEnd: event.dateEnd.toISOString(),
    };
  } catch (error) {
    console.error("Error fetching event:", error);
    return null;
  }
}
