"use client";

import { useEffect, useState, useCallback } from "react";
import { supabase } from "@/lib/supabase";
import Link from "next/link";
import { MessageSquare, Trash2, Calendar, ExternalLink } from "lucide-react";
import { motion } from "framer-motion";

export default function HistoryPage() {
  const [chats, setChats] = useState<{ id: string; title: string; created_at: string }[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchHistory = useCallback(async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data, error } = await supabase
        .from("chats")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });

      if (error) throw error;
      setChats(data || []);
    } catch (error) {
      console.error("Error fetching history:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchHistory();
  }, [fetchHistory]);

  const deleteChat = async (id: string) => {
    if (!confirm("Are you sure you want to delete this chat?")) return;
    try {
      const { error } = await supabase.from("chats").delete().eq("id", id);
      if (error) throw error;
      setChats(chats.filter(c => c.id !== id));
    } catch {
      alert("Failed to delete chat");
    }
  };

  if (loading) return <div>Loading history...</div>;

  return (
    <div className="max-w-5xl mx-auto space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-zinc-900 dark:text-white">Activity History</h1>
          <p className="text-zinc-500 dark:text-zinc-400">Review your past conversations and generated projects.</p>
        </div>
      </div>

      <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-200 dark:border-zinc-800 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-zinc-50 dark:bg-zinc-800/50 text-zinc-500 dark:text-zinc-400 text-sm uppercase">
              <tr>
                <th className="px-6 py-4 font-semibold">Title</th>
                <th className="px-6 py-4 font-semibold">Type</th>
                <th className="px-6 py-4 font-semibold">Date</th>
                <th className="px-6 py-4 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-100 dark:divide-zinc-800">
              {chats.length === 0 ? (
                <tr>
                  <td colSpan={4} className="px-6 py-12 text-center text-zinc-500">
                    No history found. Start a new chat to see it here!
                  </td>
                </tr>
              ) : (
                chats.map((chat) => (
                  <motion.tr 
                    key={chat.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="hover:bg-zinc-50 dark:hover:bg-zinc-800/30 transition-colors"
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 rounded-lg">
                          <MessageSquare size={18} />
                        </div>
                        <span className="font-medium text-zinc-900 dark:text-white truncate max-w-xs">
                          {chat.title}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="px-2 py-1 bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 text-xs rounded-md">
                        Chat
                      </span>
                    </td>
                    <td className="px-6 py-4 text-zinc-500 dark:text-zinc-400 text-sm">
                      <div className="flex items-center gap-2">
                        <Calendar size={14} />
                        {new Date(chat.created_at).toLocaleDateString()}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Link 
                          href={`/dashboard/chat/${chat.id}`}
                          className="p-2 text-zinc-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
                          title="Open Chat"
                        >
                          <ExternalLink size={18} />
                        </Link>
                        <button 
                          onClick={() => deleteChat(chat.id)}
                          className="p-2 text-zinc-400 hover:text-red-500 transition-colors"
                          title="Delete"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </td>
                  </motion.tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
