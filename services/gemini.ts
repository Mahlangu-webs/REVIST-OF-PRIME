
import { GoogleGenAI, GenerateContentResponse } from "@google/genai";
import { getSystemInstruction } from "../constants";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });

export const getChatResponse = async (
  messages: { role: 'user' | 'assistant', content: string }[],
  userName: string
) => {
  try {
    const response: GenerateContentResponse = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: messages.map(m => ({
        role: m.role === 'assistant' ? 'model' : 'user',
        parts: [{ text: m.content }]
      })),
      config: {
        systemInstruction: getSystemInstruction(userName),
        temperature: 0.7,
      },
    });

    return response.text || "I'm sorry, I couldn't process that request.";
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "An error occurred while connecting to the AI educator. Please try again.";
  }
};
