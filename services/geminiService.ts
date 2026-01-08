
import { GoogleGenAI, Type } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });

export const generateStreamAids = async (topic: string) => {
  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: `Suggest 3 viral stream titles, 5 relevant tags, and a 2-sentence SEO description for a stream about: ${topic}`,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          titles: {
            type: Type.ARRAY,
            items: { type: Type.STRING }
          },
          tags: {
            type: Type.ARRAY,
            items: { type: Type.STRING }
          },
          description: { type: Type.STRING }
        },
        required: ["titles", "tags", "description"]
      }
    }
  });

  return JSON.parse(response.text);
};

export const analyzeChatSentiment = async (messages: string[]) => {
  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: `Analyze the overall mood of these chat messages and give a summary: ${messages.join(' | ')}`,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          mood: { type: Type.STRING, description: 'Single word mood like positive, toxic, hyped, curious' },
          summary: { type: Type.STRING }
        },
        required: ["mood", "summary"]
      }
    }
  });

  return JSON.parse(response.text);
};
