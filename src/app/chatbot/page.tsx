
"use client";

import { ChatbotInterface } from "@/components/chatbot-interface";
import { handleChatbotQueryAction } from "./actions";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Lightbulb } from "lucide-react"; // Changed icon

export default function ChatbotPage() {
  const handleSendMessage = async (messageText: string): Promise<string> => {
    return handleChatbotQueryAction(messageText);
  };

  return (
    <div className="container mx-auto py-8 flex flex-col items-center">
      <h1 className="text-3xl font-bold mb-6 text-center font-headline text-primary-foreground bg-primary p-4 rounded-lg shadow-md">
        AquaChat AI
      </h1>
      <Alert className="mb-6 max-w-2xl w-full border-accent bg-accent/10">
        <Lightbulb className="h-5 w-5 text-accent" /> {/* Changed icon */}
        <AlertTitle className="font-headline text-accent">Ask Me Anything!</AlertTitle>
        <AlertDescription className="text-accent-foreground/80">
          I'm here to answer your questions about water conservation, tips, and how to use WaterWise effectively.
        </AlertDescription>
      </Alert>
      <ChatbotInterface 
        onSendMessage={handleSendMessage}
        botAvatar="https://placehold.co/40x40/a7dbd8/42675a.png?text=A"
        userAvatar="https://placehold.co/40x40/f0e68c/8c7f2d.png?text=U"
      />
    </div>
  );
}
