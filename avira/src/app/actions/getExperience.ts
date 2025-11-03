export async function getExperience() {
  try {
    const res = await fetch("/api/experiences");
    if (!res.ok) throw new Error("Failed to fetch experiences");
    return await res.json();
  } catch (err) {
    console.error("GET_EXPERIENCE_ERROR", err);
    return [];
  }
}
