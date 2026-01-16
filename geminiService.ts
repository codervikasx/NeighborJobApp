
import { GoogleGenAI, Type } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const refineJobDescription = async (rawTitle: string, rawDesc: string) => {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `Refine this hyper-local job posting to be professional and clear for a neighborhood app.
      Title: ${rawTitle}
      Description: ${rawDesc}
      Return a JSON object with 'refinedTitle', 'refinedDescription', and 'suggestedPriceRange' (as a string).`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            refinedTitle: { type: Type.STRING },
            refinedDescription: { type: Type.STRING },
            suggestedPriceRange: { type: Type.STRING },
          },
          required: ["refinedTitle", "refinedDescription", "suggestedPriceRange"],
        }
      },
    });

    return JSON.parse(response.text);
  } catch (error) {
    console.error("AI Refinement failed", error);
    return null;
  }
};

export const getMatchingAdvice = async (jobDescription: string) => {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `Provide 3 quick tips for a service provider looking to complete this job safely and efficiently: ${jobDescription}`,
    });
    return response.text;
  } catch (error) {
    return "Ensure you have the right tools and communicate clearly with the neighbor.";
  }
};
