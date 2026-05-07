"use client";

import { useState, useRef, useEffect } from "react";
import ChatMessage from "./ChatMessage";
import { Send, Loader2, Eraser } from "lucide-react";
import axios from "axios";

interface Message {
  role: "user" | "assistant";
  content: string;
}

interface ChatInterfaceProps {
  initialChatId?: string;
  initialMessages?: Message[];
}

export default function ChatInterface({ initialChatId, initialMessages = [] }: ChatInterfaceProps) {
  const [messages, setMessages] = useState<Message[]>(initialMessages);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [chatId, setChatId] = useState<string | null>(initialChatId || null);
  const scrollRef = useRef<HTMLDivElement>(null);

  const saveMessage = async (cId: string, role: string, content: string) => {
    try {
      await axios.post("/api/chat/message", { chatId: cId, role, content });
    } catch (error) {
      console.error("Error saving message:", error);
    }
  };

  const createChat = async (title: string) => {
    try {
      const response = await axios.post("/api/chat/create", { title });
      return response.data.id;
    } catch (error) {
      console.error("Error creating chat:", error);
      return null;
    }
  };

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage: Message = { role: "user", content: input };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);

    let currentChatId = chatId;
    if (!currentChatId) {
      currentChatId = await createChat(input.slice(0, 30) + "...");
      setChatId(currentChatId);
    }

    if (currentChatId) {
      await saveMessage(currentChatId, "user", input);
    }

    try {
      const response = await axios.post("/api/ai", {
        prompt: input,
        history: messages,
      });

      const assistantMessage: Message = {
        role: "assistant",
        content: response.data.text,
      };
      setMessages((prev) => [...prev, assistantMessage]);

      if (currentChatId) {
        await saveMessage(currentChatId, "assistant", response.data.text);
      }
    } catch (error) {
      console.error("AI Error:", error);
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: "Sorry, I encountered an error. Please try again.",
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const clearChat = () => {
    setMessages([]);
  };

  return (
    <div className="flex flex-col h-full max-w-5xl mx-auto border border-zinc-200 dark:border-zinc-800 rounded-2xl bg-white dark:bg-zinc-900 shadow-xl overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between px-6 py-4 border-b border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900/50">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
          <h2 className="font-semibold text-zinc-900 dark:text-zinc-100">H-STUDIO AI</h2>
        </div>
        <button
          onClick={clearChat}
          className="p-2 text-zinc-500 hover:text-red-500 hover:bg-red-50/50 dark:hover:bg-red-950/20 rounded-lg transition-all"
          title="Clear Chat"
        >
          <Eraser size={20} />
        </button>
      </div>

      {/* Messages */}
      <div
        ref={scrollRef}
        className="flex-1 overflow-y-auto p-4 space-y-2 scrollbar-thin scrollbar-thumb-zinc-300 dark:scrollbar-thumb-zinc-700"
      >
        {messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center p-8 space-y-4">
            <div className="w-16 h-16 bg-indigo-100 dark:bg-indigo-900/30 rounded-2xl flex items-center justify-center text-indigo-600 dark:text-indigo-400">
              <Send size={32} />
            </div>
            <div>
              <h3 className="text-xl font-bold text-zinc-900 dark:text-zinc-100">Welcome to H-STUDIO</h3>
              <p className="text-zinc-500 dark:text-zinc-400 max-w-xs">
                Ask me anything! I can help with math, programming, or generate full projects for you.
              </p>
            </div>
          </div>
        ) : (
          messages.map((msg, i) => <ChatMessage key={i} {...msg} />)
        )}
        {isLoading && (
          <div className="flex items-center gap-2 p-4 text-zinc-500 italic">
            <Loader2 className="animate-spin" size={18} />
            <span>H-STUDIO is thinking...</span>
          </div>
        )}
      </div>

      {/* Input */}
      <form
        onSubmit={handleSubmit}
        className="p-4 border-t border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900/50"
      >
        <div className="relative flex items-center">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Type your message..."
            className="w-full pl-4 pr-12 py-3 bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400 text-zinc-900 dark:text-zinc-100 transition-all shadow-sm"
          />
          <button
            type="submit"
            disabled={!input.trim() || isLoading}
            className="absolute right-2 p-2 bg-indigo-600 hover:bg-indigo-700 disabled:bg-zinc-400 text-white rounded-lg transition-all"
          >
            {isLoading ? <Loader2 className="animate-spin" size={20} /> : <Send size={20} />}
          </button>
        </div>
        <p className="mt-2 text-center text-xs text-zinc-400">
          Tip: You can ask for step-by-step math solutions or project file structures.
        </p>
      </form>
    </div>
  );
}
