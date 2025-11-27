import { useState, useCallback } from "react";

interface ChatMessage {
  role: "user" | "bot";
  content: string;
  timestamp: string;
}

export const useChatbot = () => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const sendMessage = useCallback(
    async (userMessage: string, systemContext?: string) => {
      try {
        setError(null);
        setLoading(true);

        // Add user message
        const userMsg: ChatMessage = {
          role: "user",
          content: userMessage,
          timestamp: new Date().toISOString(),
        };
        setMessages((prev) => [...prev, userMsg]);

        // Call Edge Function (no auth required)
        const response = await fetch(
          "https://stglfgeppzkbxveznmpk.supabase.co/functions/v1/chatbot",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              message: userMessage,
              systemContext,
            }),
          }
        );

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || "Failed to get response");
        }

        const data_response = await response.json();

        // Add bot message
        const botMsg: ChatMessage = {
          role: "bot",
          content: data_response.message,
          timestamp: data_response.timestamp,
        };
        setMessages((prev) => [...prev, botMsg]);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Unknown error");
      } finally {
        setLoading(false);
      }
    },
    []
  );

  return { messages, loading, error, sendMessage };
};
