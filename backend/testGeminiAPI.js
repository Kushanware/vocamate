import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: "AIzaSyDFtTBzic2f34ccV0S16QFKvF-0p0-k05w" });

async function testAPI() {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: "Test message",
    });
    console.log("API Response:", response.text);
  } catch (error) {
    console.error("API Error:", error.message);
  }
}

testAPI();
