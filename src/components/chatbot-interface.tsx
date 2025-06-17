"use client";

import { useState, useRef, useEffect, useTransition } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Send, User, Bot, Loader2 } from "lucide-react";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";

interface Message {
  id: string;
  text: string;
  sender: "user" | "bot";
  avatar?: string;
}

interface ChatbotInterfaceProps {
  onSendMessage: (messageText: string) => Promise<string>; // Returns bot's response
  botAvatar: string;
  userAvatar: string;
}

export function ChatbotInterface({ onSendMessage, botAvatar, userAvatar }: ChatbotInterfaceProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState("");
  const [isBotTyping, startBotTypingTransition] = useTransition();
  const scrollAreaRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    if (scrollAreaRef.current) {
      const scrollViewport = scrollAreaRef.current.querySelector('div[style*="overflow: scroll"]');
      if (scrollViewport) {
        scrollViewport.scrollTop = scrollViewport.scrollHeight;
      }
    }
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(event.target.value);
  };

  const handleSendMessage = async () => {
    if (inputValue.trim() === "") return;

    const userMessage: Message = {
      id: crypto.randomUUID(),
      text: inputValue,
      sender: "user",
      avatar: userAvatar,
    };
    setMessages((prevMessages) => [...prevMessages, userMessage]);
    setInputValue("");

    startBotTypingTransition(async () => {
      try {
        const botResponseText = await onSendMessage(userMessage.text);
        const botMessage: Message = {
          id: crypto.randomUUID(),
          text: botResponseText,
          sender: "bot",
          avatar: botAvatar,
        };
        setMessages((prevMessages) => [...prevMessages, botMessage]);
      } catch (error) {
        console.error("Chatbot error:", error);
        const errorMessage: Message = {
          id: crypto.randomUUID(),
          text: "Sorry, I encountered an error. Please try again.",
          sender: "bot",
          avatar: botAvatar,
        };
        setMessages((prevMessages) => [...prevMessages, errorMessage]);
      }
    });
  };

  const handleKeyPress = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <Card className="w-full max-w-2xl mx-auto shadow-xl flex flex-col h-[70vh]">
      <CardHeader>
        <CardTitle className="font-headline text-2xl flex items-center">
          <Bot className="mr-2 h-7 w-7 text-primary" /> AquaChat Bot
        </CardTitle>
      </CardHeader>
      <CardContent className="flex-grow overflow-hidden p-0">
        <ScrollArea className="h-full p-4" ref={scrollAreaRef}>
          <div className="space-y-4">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex items-end gap-2 ${
                  message.sender === "user" ? "justify-end" : "justify-start"
                }`}
              >
                {message.sender === "bot" && (
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={message.avatar} alt="Bot Avatar" data-ai-hint="robot water" />
                    <AvatarFallback><Bot /></AvatarFallback>
                  </Avatar>
                )}
                <div
                  className={`max-w-[70%] rounded-lg px-4 py-2 shadow ${
                    message.sender === "user"
                      ? "bg-primary text-primary-foreground"
                      : "bg-muted text-muted-foreground"
                  }`}
                >
                  <p className="text-sm whitespace-pre-wrap">{message.text}</p>
                </div>
                {message.sender === "user" && (
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={message.avatar} alt="User Avatar" data-ai-hint="person water" />
                    <AvatarFallback><User /></AvatarFallback>
                  </Avatar>
                )}
              </div>
            ))}
            {isBotTyping && (
              <div className="flex items-end gap-2 justify-start">
                <Avatar className="h-8 w-8">
                  <AvatarImage src={botAvatar} alt="Bot Avatar" data-ai-hint="robot water" />
                  <AvatarFallback><Bot /></AvatarFallback>
                </Avatar>
                <div className="max-w-[70%] rounded-lg px-4 py-2 shadow bg-muted text-muted-foreground">
                  <div className="flex items-center space-x-1">
                    <span className="text-sm">AquaBot is typing</span>
                    <div className="h-1.5 w-1.5 bg-muted-foreground rounded-full animate-bounce [animation-delay:-0.3s]"></div>
                    <div className="h-1.5 w-1.5 bg-muted-foreground rounded-full animate-bounce [animation-delay:-0.15s]"></div>
                    <div className="h-1.5 w-1.5 bg-muted-foreground rounded-full animate-bounce"></div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </ScrollArea>
      </CardContent>
      <CardFooter className="p-4 border-t">
        <div className="flex w-full items-center space-x-2">
          <Input
            type="text"
            placeholder="Ask about water conservation..."
            value={inputValue}
            onChange={handleInputChange}
            onKeyPress={handleKeyPress}
            className="flex-1"
            disabled={isBotTyping}
          />
          <Button type="submit" onClick={handleSendMessage} disabled={isBotTyping || inputValue.trim() === ""} className="bg-accent text-accent-foreground hover:bg-accent/90">
            {isBotTyping ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
            <span className="sr-only">Send message</span>
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
}
