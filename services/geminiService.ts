
import { GoogleGenAI, Type } from "@google/genai";
import { CropData, PredictionResult } from "../types";

const parseGeminiResponse = (text: string): PredictionResult => {
  try {
    const cleanText = text.replace(/```json/g, '').replace(/```/g, '').trim();
    return JSON.parse(cleanText);
  } catch (e) {
    console.error("Failed to parse Gemini response", e);
    return {
      predictedPrice: 0,
      confidence: 0,
      reasoning: "Analysis failed. Please try again.",
      factors: [],
      trend: 'STABLE'
    };
  }
};

export const getPricePrediction = async (
  crop: string,
  district: string,
  market: string,
  history: CropData[]
): Promise<PredictionResult> => {
  if (!process.env.API_KEY) {
    throw new Error("API Key is missing. Please check your configuration.");
  }

  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  
  // Context window
  const recentHistory = history.slice(-14);
  const latestData = recentHistory[recentHistory.length - 1];

  const prompt = `
    You are an expert Agricultural Economist specializing in Tamil Nadu, India.
    
    Task: Predict the fair market price for ${crop} in ${district} District for tomorrow.
    
    User Context:
    The user is looking for an overall price prediction for the district of ${district}. 
    While the reference market provided is "${market}", please consider the trends across all major markets in ${district} (e.g., Wholesale Mandis, Uzhavar Sandhais, and Retail centers) to provide a weighted, comprehensive "Fair Price".
    
    Reference Data (Last 14 days in ${market}):
    ${JSON.stringify(recentHistory)}

    Context:
    - Tamil Nadu monsoon season and local weather affects supply.
    - High rainfall spikes prices of perishables (Tomato, Onion).
    - If the district is a major producer (e.g., Nilgiris for Carrot, Dharmapuri for Tomato), prices might be lower than the state average.

    Return the response strictly in this JSON format:
    {
      "predictedPrice": number (The overall fair predicted price for the district),
      "confidence": number (0-100),
      "reasoning": "string (max 2 sentences, explicitly mentioning that this is an overall estimate for ${district} considering multiple markets)",
      "factors": ["string", "string", "string"],
      "trend": "UP" | "DOWN" | "STABLE"
    }
  `;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            predictedPrice: { type: Type.NUMBER },
            confidence: { type: Type.NUMBER },
            reasoning: { type: Type.STRING },
            factors: { type: Type.ARRAY, items: { type: Type.STRING } },
            trend: { type: Type.STRING, enum: ["UP", "DOWN", "STABLE"] }
          },
          required: ["predictedPrice", "confidence", "reasoning", "factors", "trend"]
        }
      }
    });

    const text = response.text;
    if (!text) throw new Error("No response from AI");

    return parseGeminiResponse(text);

  } catch (error) {
    console.error("Gemini API Error:", error);
    const lastPrice = latestData.price;
    return {
      predictedPrice: lastPrice,
      confidence: 10,
      reasoning: "AI Service unavailable. Showing last known price.",
      factors: ["Service Outage"],
      trend: 'STABLE'
    };
  }
};
