import { GoogleGenAI, Chat } from "@google/genai";

if (!process.env.API_KEY) {
  throw new Error("API_KEY environment variable not set");
}

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

let chat: Chat | null = null;
let currentSystemInstruction: string | null = null;

// This function maintains a chat instance. If the system instruction changes,
// it creates a new chat instance to reflect the new character personality.
function getChatInstance(systemInstruction: string): Chat {
  if (!chat || currentSystemInstruction !== systemInstruction) {
    console.log("Creating new chat instance with new system instruction.");
    chat = ai.chats.create({
      model: 'gemini-2.5-flash',
      config: {
        systemInstruction: systemInstruction,
      },
    });
    currentSystemInstruction = systemInstruction;
  }
  return chat;
}

export const getChatResponse = async (message: string, systemInstruction: string): Promise<string> => {
  try {
    const chatInstance = getChatInstance(systemInstruction);
    const response = await chatInstance.sendMessage({ message });
    return response.text;
  } catch (error) {
    console.error("Error getting chat response:", error);
    return "申し訳ありません、エラーが発生しました。もう一度試してください。";
  }
};
