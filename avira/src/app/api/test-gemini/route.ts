import { NextResponse } from "next/server";
import genAI from "@/lib/gemini";

export async function GET() {
    try {
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
        const res = await model.generateContent("Say hi from Avira!");

        return NextResponse.json({ message: res.response.text() });
    } catch (error: any) {
        console.error(error);
        return NextResponse.json(
            { error: "Failed to connect to Gemini", details: error.message },
            { status: 500 }
        );
    }
}
