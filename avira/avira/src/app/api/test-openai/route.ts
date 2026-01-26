import { NextResponse } from "next/server";
import openai from "../../../lib/openai";

export async function GET() {
  try {
    const res = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [{ role: "user", content: "Say hi from Avira!" }],
    });

    return NextResponse.json({ message: res.choices[0].message });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Failed to connect to OpenAI" },
      { status: 500 }
    );
  }
}
