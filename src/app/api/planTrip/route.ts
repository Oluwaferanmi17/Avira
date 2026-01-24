/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextResponse } from "next/server";
import prisma from "../../../lib/prismadb";
import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

export async function POST(req: Request) {
  try {
    const body = await req.json();
    // Frontend sends 'interests' and 'description' but we access 'vibe' here.
    // Let's normalize it.
    const {
      destination,
      travelStyle,
      budget,
      duration,
      description,
      interests,
    } = body;

    if (!destination) {
      return NextResponse.json(
        { error: "Destination is required" },
        { status: 400 },
      );
    }

    // 1. Better City Extraction (Handles "Lagos", "Lagos, Nigeria", "Lagos Nigeria")
    const searchCity = destination.split(/,| /)[0].trim();

    // 2. Fetch Real Data (RAG)
    // We use Promise.all to fetch everything in parallel for speed
    const [stays, events, experiences] = await Promise.all([
      prisma.stay.findMany({
        where: {
          isPublished: true,
          address: { city: { contains: searchCity, mode: "insensitive" } },
        },
        take: 3, // Reduce context window usage
      }),
      prisma.event.findMany({
        where: {
          city: { contains: searchCity, mode: "insensitive" },
          dateStart: { gte: new Date() },
        },
        take: 3,
      }),
      prisma.experience.findMany({
        where: {
          city: { contains: searchCity, mode: "insensitive" },
        },
        take: 3,
      }),
    ]);

    // 3. Construct the Prompt
    const context = `
    You are an expert travel planner. Create a ${duration}-day trip to ${destination}.
    
    USER PREFERENCES:
    - Budget: ₦${budget}
    - Style: ${travelStyle}
    - Interests: ${interests?.join(", ") || "General"}
    - Description: ${description || "No specific details"}

    AVAILABLE REAL DATA (Prioritize these if they fit the vibe):
    - STAYS: ${stays
      .map((s) => `${s.title} (₦${(s as any).price || "N/A"})`)
      .join(", ")}
    - EVENTS: ${events.map((e) => `${e.title} (${e.category})`).join(", ")}
    - EXPERIENCES: ${experiences
      .map((e) => `${e.title} (₦${(e as any).price || "N/A"})`)
      .join(", ")}

    INSTRUCTIONS:
    1. Return ONLY valid JSON.
    2. "type" MUST be one of: "breakfast", "morning", "lunch", "afternoon", "evening", "dinner", "accommodation".
    3. Ensure the structure matches exactly below.

    JSON STRUCTURE:
    {
      "destination": "${destination}",
      "duration": ${duration},
      "budget": ${budget},
      "travelStyle": "${travelStyle}",
      "days": [
        {
          "day": 1,
          "activities": [
            {
              "time": "09:00 AM",
              "duration": "1 hour",
              "type": "breakfast", 
              "title": "Name of place or activity",
              "description": "Why this fits the vibe",
              "location": "Address or City area",
              "cost": 5000
            }
          ]
        }
      ]
    }
    `;

    // 4. Call Gemini with JSON Mode
    // 🤖 Generate itinerary
    // We use "gemini-flash-latest" because it was explicitly in your allowed list
    const model = genAI.getGenerativeModel({
      model: "gemini-flash-latest",
      generationConfig: {
        responseMimeType: "application/json",
      },
    });

    let result;
    // 🛡️ RETRY LOGIC: Try 3 times if we get a "Too Many Requests" (429) error
    for (let attempt = 1; attempt <= 3; attempt++) {
      try {
        result = await model.generateContent(context);
        break; // Success! Exit the loop
      } catch (error: any) {
        if (error.response?.status === 429 && attempt < 3) {
          console.log(
            `⚠️ Rate limit hit. Retrying in ${attempt * 2} seconds...`,
          );
          await new Promise((resolve) => setTimeout(resolve, attempt * 2000));
        } else {
          throw error; // If it's not a 429, or we're out of retries, crash.
        }
      }
    }

    // Parse the result
    const itinerary = JSON.parse(result.response.text());

    return NextResponse.json({ itinerary });

    return NextResponse.json({ itinerary });
  } catch (error: any) {
    console.error("❌ Failed to generate itinerary:", error);
    return NextResponse.json(
      { error: "Failed to generate itinerary" },
      { status: 500 },
    );
  }
}
