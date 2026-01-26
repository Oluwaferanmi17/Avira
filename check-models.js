import { GoogleGenerativeAI } from "@google/generative-ai";
import "dotenv/config"; // Loads .env file

async function check() {
  const key = process.env.GEMINI_API_KEY;
  
  if (!key) {
    console.error("❌ No GEMINI_API_KEY found. Make sure you have a .env file with this key.");
    console.error("   (If you use .env.local, copy the key to a .env file just for this test)");
    return;
  }

  console.log(`🔑 Found API Key: ${key.substring(0, 5)}...`);

  try {
    console.log("... Pinging Google to list available models ...");
    
    // We use the REST API directly to list models because the SDK helper 
    // sometimes hides models it thinks are incompatible.
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models?key=${key}`
    );
    
    if (!response.ok) {
      throw new Error(`API Error: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    const models = data.models || [];

    console.log("\n✅ SUCCESS! You have access to these models:");
    console.log("---------------------------------------------");
    
    const validModels = models
      .filter(m => m.supportedGenerationMethods.includes("generateContent"))
      .map(m => m.name.replace("models/", ""));

    validModels.forEach(m => console.log(`• ${m}`));
    
    console.log("---------------------------------------------");
    console.log("👉 Use one of the names above in your route.ts file.");

  } catch (error) {
    console.error("❌ FAILED:", error.message);
  }
}

check();