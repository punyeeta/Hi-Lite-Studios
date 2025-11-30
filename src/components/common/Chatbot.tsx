import { useState } from "react";
import { useChatbot } from "../../utils/useChatbot";
import ChatbotLogoImg from "@/assets/images/chatbotlogo.svg";
import SendButtonImg from "@/assets/images/Chatbot_send_button.png";

const SYSTEM_CONTEXT = `You are a helpful and professional assistant for Hi-Lite Studio, a photography and videography studio.

CRITICAL FORMATTING RULES:
- ABSOLUTELY NO asterisks (*) - never use them for any reason
- NO markdown formatting - no **bold**, no *italic*, no ***anything***
- NO bullet points with asterisks
- Use dashes (-) for bullet points only
- Use line breaks to separate ideas and sections
- Write plain text only - clean and simple
- No symbols, no special characters for formatting
- Just plain, readable text with natural spacing

RESPONSE FORMATTING GUIDELINES:
- Use line breaks naturally between ideas
- Use dashes (-) for lists, not asterisks
- Use line breaks to separate sections, not heading symbols
- Keep answers clean, organized, and easy to read
- Use a simple and professional tone
- Act like a real AI assistant - be conversational and natural
- Be friendly and helpful, not robotic
- Adapt your response format based on the question
- If a simple answer works better than formatting, just answer naturally
- Do not add extra decorations or emojis
- Keep responses concise but complete

ACTUAL WEBSITE NAVIGATION (Top Navbar):
LEFT SIDE:
- Works: Browse our portfolio and recent projects
- Services: Learn about our photography, videography, and creative services
- Magazine: Read our creative insights and industry articles

RIGHT SIDE:
- About Us: Learn about Hi-Lite Studio, our mission, and meet our team
- FAQs: Get answers to common questions
- Capture with Us: Book an appointment

LOGO CENTER: Clicking the logo takes you home


HOW TO FORMAT BOOKING TYPES:
When you see booking types like "indoor_studio_photography", convert them to user-friendly format:
- indoor_studio_photography → Indoor Studio Photography
- outdoor_event_photography → Outdoor Event Photography
- videography → Videography
Always present them in Title Case with spaces instead of underscores.


TONE & STYLE:
- Be friendly and conversational, yet professional
- Use casual language like you're talking to a friend
- Keep it natural and relatable
- Reference actual navbar elements
- Use color descriptions (red button) to help users find things
- Encourage exploration and booking
- Sound like a real person, not a template
- Answer questions directly and helpfully
- Write ONLY plain text - no asterisks, no markdown symbols whatsoever`;

interface ChatbotProps {
  onClose?: () => void;
}

export const Chatbot = ({ onClose }: ChatbotProps) => {
  const { messages, loading, error, sendMessage } = useChatbot();
  const [input, setInput] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    await sendMessage(input, SYSTEM_CONTEXT);
    setInput("");
  };

  return (
    <div className="flex flex-col h-[600px] border border-gray-200 rounded-lg bg-white shadow-lg overflow-hidden">
      {/* Header */}
      <div className="px-4 py-4 border-b border-gray-200 bg-white flex items-center gap-3">
        <img 
          src={ChatbotLogoImg} 
          alt="Litebot" 
          className="h-10 w-10 object-contain"
        />
        <div>
          <h3 className="m-0 text-base font-bold bg-linear-to-r from-[#291471] to-[#4E26D7] bg-clip-text text-transparent">Litebot</h3>
          <p className="m-0 text-xs text-gray-600">Your AI Chatbot Assistant</p>
        </div>
        <button onClick={onClose} className="ml-auto text-transparent hover:opacity-80 text-lg font-light leading-none p-1 bg-linear-to-r from-[#291471] to-[#4E26D7] bg-clip-text">×</button>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-6 flex flex-col gap-4 bg-gray-50">
        {messages.length === 0 && (
          <div className="flex flex-col items-center justify-center h-full gap-6">
            <img 
              src={ChatbotLogoImg} 
              alt="Litebot" 
              className="h-20 w-20 object-contain"
            />
            <p className="text-center text-gray-500 text-sm font-medium">
              Ask anything about Hi-Lite Studio!
            </p>
          </div>
        )}
        
        {messages.length > 0 && (
          <>
            {messages.map((msg, idx) => (
              <div
                key={idx}
                className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`px-4 py-3 rounded-lg text-sm max-w-xs wrap-break-word whitespace-pre-wrap ${
                    msg.role === "user"
                      ? "bg-purple-600 text-white rounded-br-none"
                      : "bg-gray-200 text-gray-900 rounded-bl-none"
                  }`}
                >
                  {msg.content}
                </div>
              </div>
            ))}
            
            {loading && (
              <div className="flex justify-start">
                <img 
                  src={ChatbotLogoImg} 
                  alt="Litebot Loading" 
                  className="h-6 w-6 object-contain animate-wave"
                />
              </div>
            )}
            
            {error && (
              <div className="flex justify-start">
                <div className="bg-red-100 text-red-900 px-4 py-3 rounded-lg text-sm rounded-bl-none">
                  ⚠️ Error: {error}
                </div>
              </div>
            )}
          </>
        )}
      </div>

      {/* Input */}
      <form onSubmit={handleSubmit} className="flex gap-3 p-4 border-t border-gray-200 bg-white">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Type your question here..."
          disabled={loading}
          className="flex-1 px-4 py-3 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent disabled:bg-gray-100 placeholder-gray-400"
        />
        <button
          type="submit"
          disabled={loading}
          className="px-4 py-3 bg-transparent hover:opacity-80 disabled:opacity-50 disabled:cursor-not-allowed transition-opacity flex items-center justify-center border-none"
        >
          <img 
            src={SendButtonImg} 
            alt="Send" 
            className="h-6 w-6 object-contain"
          />
        </button>
      </form>
    </div>
  );
};
