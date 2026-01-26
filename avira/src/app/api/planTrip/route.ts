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
    // We fetch more items to give AI better choices
    const [stays, events, experiences] = await Promise.all([
      prisma.stay.findMany({
        where: {
          isPublished: true,
          address: { city: { contains: searchCity, mode: "insensitive" } },
        },
        include: { pricing: true },
        take: 10,
      }),
      prisma.event.findMany({
        where: {
          city: { contains: searchCity, mode: "insensitive" },
          dateStart: { gte: new Date() },
        },
        take: 10,
      }),
      prisma.experience.findMany({
        where: {
          city: { contains: searchCity, mode: "insensitive" },
        },
        take: 10,
      }),
    ]);

    // 3. Construct the Prompt with Real Data IDs
    const context = `
    You are an expert travel planner. Create a ${duration}-day trip to ${destination}.
    
    USER PREFERENCES:
    - Budget: ₦${budget}
    - Style: ${travelStyle}
    - Interests: ${interests?.join(", ") || "General"}
    - Description: ${description || "No specific details"}

    AVAILABLE REAL DATA (CRITICAL: If you recommend any of these, you MUST include their "databaseId" and "bookingType"):
    
    STAYS (category: "stay"):
    ${stays
      .map(
        (s) =>
          `- ${s.title} (Price: ₦${s.pricing?.basePrice || "Check Price"}, ID: ${s.id})`,
      )
      .join("\n")}

    EVENTS (category: "event"):
    ${events
      .map(
        (e) =>
          `- ${e.title} (Price: ₦${e.ticketPrice || "Check Price"}, ID: ${e.id})`,
      )
      .join("\n")}

    EXPERIENCES (category: "experience"):
    ${experiences
      .map(
        (e) =>
          `- ${e.title} (Price: ₦${e.price || "Check Price"}, ID: ${e.id})`,
      )
      .join("\n")}

    INSTRUCTIONS:
    1. Return ONLY valid JSON.
    2. "type" MUST be one of: "breakfast", "morning", "lunch", "afternoon", "evening", "dinner", "accommodation".
    3. For any "accommodation" or activities that match the REAL DATA provided above, you MUST include:
       - "bookingId": The ID provided in the list (as a string).
       - "bookingType": The category provided in the list ("stay", "event", or "experience").
    4. If an item is not from the real data list, do not include "bookingId" or "bookingType".
    5. Ensure the structure matches exactly below.

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
              "cost": 5000,
              "bookingId": "optional-id",
              "bookingType": "stay|event|experience"
            }
          ]
        }
      ]
    }
    `;

    // 4. Call Gemini with JSON Mode
    // 🤖 Generate itinerary
    const model = genAI.getGenerativeModel({
      model: "gemini-2.5-flash", // Using a more modern model name if possible, or sticking to provided one
      generationConfig: {
        responseMimeType: "application/json",
      },
    });

    let result;
    // 🛡️ RETRY LOGIC: Try 3 times if we get a "Too Many Requests" (429) error
    for (let attempt = 1; attempt <= 3; attempt++) {
      try {
        result = await model.generateContent(context);
        const responseText = result.response.text();
        if (responseText) break;
      } catch (error: any) {
        if (error.response?.status === 429 && attempt < 3) {
          console.log(
            `⚠️ Rate limit hit. Retrying in ${attempt * 2} seconds...`,
          );
          await new Promise((resolve) => setTimeout(resolve, attempt * 2000));
        } else {
          throw error;
        }
      }
    }

    if (!result) {
      throw new Error("Failed to get content from Gemini");
    }

    // Parse the result
    const itinerary = JSON.parse(result.response.text());

    return NextResponse.json({ itinerary });
  } catch (error: any) {
    console.error("❌ Failed to generate itinerary:", error);
    return NextResponse.json(
      { error: "Failed to generate itinerary", details: error.message },
      { status: 500 },
    );
  }
}
