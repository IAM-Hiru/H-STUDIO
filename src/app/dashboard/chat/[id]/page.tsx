"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import ChatInterface from "@/components/chat/ChatInterface";
import { supabase } from "@/lib/supabase";

export default function ChatHistoryPage() {
  const { id } = useParams();
  const [initialMessages, setInitialMessages] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const { data, error } = await supabase
          .from("messages")
          .select("*")
          .eq("chat_id", id)
          .order("created_at", { ascending: true });

        if (error) throw error;
        setInitialMessages(data.map((m: any) => ({ role: m.role, content: m.content })));
      } catch (error) {
        console.error("Error loading chat:", error);
      } finally {
        setLoading(false);
      }
    };

    if (id) fetchMessages();
  }, [id]);

  if (loading) return <div>Loading chat...</div>;

  return (
    <div className="flex flex-col h-[calc(100vh-10rem)]">
      <ChatInterface initialChatId={id as string} initialMessages={initialMessages} />
    </div>
  );
}
