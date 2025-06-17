"use server";

import { waterwiseChatbot, type WaterwiseChatbotInput } from "@/ai/flows/waterwise-chatbot";

export async function handleChatbotQueryAction(question: string): Promise<string> {
  try {
    const input: WaterwiseChatbotInput = { question };
    const result = await waterwiseChatbot(input);
    return result.answer;
  } catch (error) {
    console.error("Error in chatbot query:", error);
    return "I'm sorry, I encountered an issue while processing your question. Please try again.";
  }
}
