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
