"use server";

import { waterwiseChatbot, type WaterwiseChatbotInput } from "@/ai/flows/waterwise-chatbot";

export async function handleChatbotQueryAction(question: string): Promise<string> {
  try {
    const input: WaterwiseChatbotInput = { question };
    const result = await waterwiseChatbot(input);
    return result.answer;
  } catch (error: any) {
    let detailedErrorMessage = "An unexpected error occurred.";

    if (error instanceof Error) {
      detailedErrorMessage = error.message;
      console.error("Chatbot Action Error (Instance of Error):", error.message);
      if (error.stack) {
        console.error("Stack Trace:", error.stack);
      }
    } else if (typeof error === 'string') {
      detailedErrorMessage = error;
      console.error("Chatbot Action Error (String):", error);
    } else {
      try {
        detailedErrorMessage = JSON.stringify(error);
        console.error("Chatbot Action Error (Object, stringified):", detailedErrorMessage);
      } catch (e) {
        console.error("Chatbot Action Error (Unstringifiable Object):", error);
        detailedErrorMessage = "Error object could not be stringified.";
      }
    }

    // Log the raw error object for full context
    console.error("Raw error object in chatbot action:", error);

    return "I'm sorry, I encountered an issue while processing your question. Please try again.";
  }
}
