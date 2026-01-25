/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextResponse } from "next/server";
import prisma from "../../../lib/prismadb";
import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { destination, travelStyle, budget, duration, vibe } = body;

    if (!destination)
      return NextResponse.json(
        { error: "Destination is required" },
        { status: 400 }
      );

    // Split “Lagos, Nigeria” → ["Lagos", "Nigeria"]
    const [city, country] = destination.split(",").map((s: string) => s.trim());

    // 🏨 Fetch real stays from DB
    const stays = await prisma.stay.findMany({
      where: {
        isPublished: true,
        address: { city: { contains: city, mode: "insensitive" } },
      },
      include: { address: true, pricing: true },
      take: 5,
    });

    // 🎉 Fetch events from DB
    const events = await prisma.event.findMany({
      where: {
        city: { contains: city, mode: "insensitive" },
        dateStart: { gte: new Date() },
      },
      take: 5,
    });

    // 🧭 Fetch experiences from DB
    const experiences = await prisma.experience.findMany({
      where: {
        city: { contains: city, mode: "insensitive" },
      },
      take: 5,
    });

    // 🧩 Prepare structured input for Gemini
    const context = `
You are a travel planner AI. 
User wants a personalized itinerary for ${duration} days in ${destination}.
Travel style: ${travelStyle || "Not specified"}.
Budget: ₦${budget || "Flexible"}.
Vibe: ${vibe || "Not specified"}.

Here are real options from our database:

STAYS:
${stays
  .map(
    (s) =>
      `• ${s.title} (${s.address?.city}) - ${s.description.slice(0, 100)}...`
  )
  .join("\n")}

EVENTS:
${events
  .map(
    (e) =>
      `• ${e.title} - ${e.category} on ${new Date(e.dateStart).toDateString()}`
  )
  .join("\n")}

EXPERIENCES:
${experiences
  .map((x) => `• ${x.title} - ${x.category}, ₦${x.price}, lasts ${x.duration}`)
  .join("\n")}

Please generate a JSON itinerary structured as:
{
  "destination": "${destination}",
  "duration": ${duration},
  "totalCost": approximate total,
  "travelStyle": "${travelStyle}",
  "days": [
    {
      "day": 1,
      "summary": "short summary",
      "activities": [
        {
          "time": "9:00 AM",
          "title": "activity title",
          "type": "stay | event | experience | other",
          "details": "details here",
          "cost": 20000
        }
      ]
    }
  ]
}`;

    // 🤖 Generate itinerary using Gemini
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

    const result = await model.generateContent(context);

    const aiResponse = result.response.text();

    // Safely parse JSON output
    let itinerary;
    try {
      itinerary = JSON.parse(aiResponse);
    } catch {
      const jsonMatch = aiResponse.match(/\{[\s\S]*\}/);
      itinerary = jsonMatch ? JSON.parse(jsonMatch[0]) : null;
    }

    if (!itinerary)
      return NextResponse.json(
        { error: "AI could not generate a valid itinerary" },
        { status: 500 }
      );

    return NextResponse.json(itinerary);
  } catch (error: any) {
    console.error("❌ Failed to generate itinerary:", error);
    return NextResponse.json(
      { error: "Failed to generate itinerary" },
      { status: 500 }
    );
  }
}
