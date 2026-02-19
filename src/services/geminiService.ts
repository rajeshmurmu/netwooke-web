import { GoogleGenAI, Type } from "@google/genai";

/**
 * Content moderation using Gemini API
 */
export async function moderateContent(
  text: string,
): Promise<{ isSafe: boolean; reason?: string }> {
  // Fix: Create a new instance right before making an API call to ensure it always uses the most up-to-date API key.
  // Use process.env.API_KEY directly.
  const ai = new GoogleGenAI({ apiKey: "" });

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `Analyze the following content for a positive growth-focused social platform. Detect bullying, hate speech, toxic roasting, or inappropriate content for young men. 
      Content: "${text}"`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            isSafe: { type: Type.BOOLEAN },
            reason: {
              type: Type.STRING,
              description: "Reason for rejection if not safe",
            },
          },
          required: ["isSafe"],
        },
      },
    });

    // Fix: Access the .text property directly (it is not a method).
    const textOutput = response.text?.trim();
    if (!textOutput) return { isSafe: true };

    return JSON.parse(textOutput);
  } catch (error) {
    console.error("Moderation error:", error);
    return { isSafe: true }; // Graceful failure
  }
}

/**
 * Generates a reflection prompt for the user's daily diary
 */
export async function generateReflectionPrompt(): Promise<string> {
  // Fix: Create a new instance right before making an API call to ensure it always uses the most up-to-date API key.
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents:
        "Generate a single, thoughtful reflection prompt for a young man (16-30) focused on personal growth, mindset, or resilience. One sentence only.",
    });
    // Fix: Access the .text property directly.
    return (
      response.text?.trim() ||
      "What challenged you today and how did you respond?"
    );
  } catch (error) {
    console.error("Reflection prompt error:", error);
    return "What challenged you today and how did you respond?";
  }
}
