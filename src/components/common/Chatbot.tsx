import { useState } from "react";
import { useChatbot } from "../../utils/useChatbot";

const SYSTEM_CONTEXT = `You are a helpful and professional assistant for Hi-Lite Studios, a photography and videography studio.

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
- About Us: Learn about Hi-Lite Studios, our mission, and meet our team
- FAQs: Get answers to common questions
- Capture with Us: Book an appointment

LOGO CENTER: Clicking the logo takes you home

BOOKING:
- Users book via the "Capture with Us" button (red button on navbar)
- This takes them to the appointment/booking page at /appointment
- OR users can click the "Capture with Us" button in the hero section on the home page

HOW TO FORMAT BOOKING TYPES:
When you see booking types like "indoor_studio_photography", convert them to user-friendly format:
- indoor_studio_photography → Indoor Studio Photography
- outdoor_event_photography → Outdoor Event Photography
- videography → Videography
Always present them in Title Case with spaces instead of underscores.

HOW TO GUIDE USERS:
1. "Where is About Us?" → "Click 'About Us' in the top navbar"
2. "How do I book?" → "Click the red 'Capture with Us' button in the navbar"
3. "Where's the booking page?" → "Click 'Capture with Us' button - it's the red button on the right side of the navbar"
4. "Tell me about services" → "Click 'Services' in the navbar to learn more"
5. "Where can I see your work?" → "Click 'Works' in the navbar to browse our portfolio"

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

export const Chatbot = () => {
  const { messages, loading, error, sendMessage } = useChatbot();
  const [input, setInput] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    await sendMessage(input, SYSTEM_CONTEXT);
    setInput("");
  };

  return (
    <div className="flex flex-col h-[500px] border border-gray-300 rounded-lg bg-white shadow-md overflow-hidden">
      {/* Header */}
      <div className="px-4 py-3 border-b border-gray-300 bg-gray-100">
        <h3 className="m-0 text-base text-gray-800 font-semibold">Hi-Lite Studios Chatbot</h3>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-2">
        {messages.length === 0 && (
          <div className="flex">
            <p className="bg-blue-100 text-blue-900 px-4 py-2 rounded-lg text-sm">
              👋 Hello! Ask me anything about Hi-Lite Studios...
            </p>
          </div>
        )}
        
        {messages.map((msg, idx) => (
          <div
            key={idx}
            className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
          >
            <div
              className={`px-4 py-2 rounded-lg text-sm max-w-md wrap-break-word whitespace-pre-wrap ${
                msg.role === "user"
                  ? "bg-blue-600 text-white"
                  : "bg-gray-200 text-gray-900"
              }`}
            >
              {msg.content}
            </div>
          </div>
        ))}
        
        {loading && (
          <div className="flex">
            <p className="bg-gray-200 text-gray-600 px-4 py-2 rounded-lg text-sm italic">
              Typing...
            </p>
          </div>
        )}
        
        {error && (
          <div className="flex">
            <p className="bg-red-100 text-red-900 px-4 py-2 rounded-lg text-sm">
              ❌ Error: {error}
            </p>
          </div>
        )}
      </div>

      {/* Input */}
      <form onSubmit={handleSubmit} className="flex gap-2 p-4 border-t border-gray-300 bg-gray-50">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask me anything..."
          disabled={loading}
          className="flex-1 px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
        />
        <button
          type="submit"
          disabled={loading}
          className="px-5 py-2 bg-blue-600 text-white rounded-md font-semibold text-sm hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
        >
          {loading ? "..." : "Send"}
        </button>
      </form>
    </div>
  );
};
