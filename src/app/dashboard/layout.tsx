"use client";

import { useEffect, useState, useCallback } from "react";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { type User } from "@supabase/supabase-js";
import { 
  LayoutDashboard, 
  MessageSquare, 
  PlusCircle, 
  Settings, 
  LogOut,
  Menu,
  X
} from "lucide-react";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [user, setUser] = useState<User | null>(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [recentChats, setRecentChats] = useState<{ id: string; title: string }[]>([]);
  const router = useRouter();

  const fetchRecentChats = useCallback(async () => {
    try {
      const { data, error } = await supabase
        .from("chats")
        .select("*")
        .order("created_at", { ascending: false })
        .limit(5);
      
      if (!error) {
        setRecentChats(data || []);
      }
    } catch (error) {
      console.error("Error fetching chats:", error);
    }
  }, []);

  useEffect(() => {
    const checkUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        router.push("/login");
      } else {
        setUser(user);
        fetchRecentChats();
      }
    };
    checkUser();
  }, [router, fetchRecentChats]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push("/");
  };

  if (!user) return <div className="flex h-screen items-center justify-center">Loading...</div>;

  return (
    <div className="flex h-screen bg-gray-50 dark:bg-gray-900 overflow-hidden">
      {/* Sidebar */}
      <aside className={`
        fixed inset-y-0 left-0 z-50 w-64 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 transform transition-transform duration-300 ease-in-out
        ${isSidebarOpen ? "translate-x-0" : "-translate-x-full"}
        lg:relative lg:translate-x-0
      `}>
        <div className="flex flex-col h-full p-4">
          <div className="flex items-center justify-between mb-8 px-2">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-black dark:bg-white rounded-lg flex items-center justify-center font-bold text-white dark:text-black">
                HS
              </div>
              <span className="text-xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100">
                STUDIO
              </span>
            </div>
            <button onClick={() => setIsSidebarOpen(false)} className="lg:hidden text-gray-500">
              <X size={20} />
            </button>
          </div>

          <nav className="flex-1 space-y-1">
            <SidebarLink href="/dashboard" icon={<LayoutDashboard size={20} />} label="Dashboard" />
            <SidebarLink href="/dashboard/chat" icon={<MessageSquare size={20} />} label="New Chat" />
            <SidebarLink href="/dashboard/project-generator" icon={<PlusCircle size={20} />} label="Project Generator" />
          </nav>

          {recentChats.length > 0 && (
            <div className="mt-8">
              <h3 className="px-4 text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
                Recent Chats
              </h3>
              <div className="space-y-1">
                {recentChats.map((chat) => (
                  <Link
                    key={chat.id}
                    href={`/dashboard/chat/${chat.id}`}
                    className="flex items-center px-4 py-2 text-sm font-medium text-gray-600 dark:text-gray-400 hover:bg-indigo-50 dark:hover:bg-indigo-900/20 hover:text-indigo-600 transition-colors rounded-lg truncate"
                  >
                    <MessageSquare size={16} className="mr-3 flex-shrink-0" />
                    <span className="truncate">{chat.title}</span>
                  </Link>
                ))}
              </div>
            </div>
          )}


          <div className="mt-auto pt-4 border-t border-gray-200 dark:border-gray-700">
            <SidebarLink href="/dashboard/settings" icon={<Settings size={20} />} label="Settings" />
            <button 
              onClick={handleLogout}
              className="flex items-center w-full px-4 py-2 text-sm font-medium text-gray-600 dark:text-gray-400 hover:bg-red-50 dark:hover:bg-red-900/20 hover:text-red-600 transition-colors rounded-lg"
            >
              <LogOut size={20} className="mr-3" />
              Logout
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 relative overflow-y-auto focus:outline-none">
        <header className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 lg:hidden">
          <div className="px-4 py-3 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-black dark:bg-white rounded-lg flex items-center justify-center font-bold text-white dark:text-black">
                HS
              </div>
              <span className="text-lg font-bold tracking-tight text-zinc-900 dark:text-zinc-100">
                STUDIO
              </span>
            </div>
            <button onClick={() => setIsSidebarOpen(true)} className="text-gray-500">
              <Menu size={24} />
            </button>
          </div>
        </header>
        <div className="p-6 lg:p-8">
          {children}
        </div>
      </main>
    </div>
  );
}

function SidebarLink({ href, icon, label }: { href: string; icon: React.ReactNode; label: string }) {
  return (
    <Link 
      href={href}
      className="flex items-center px-4 py-2 text-sm font-medium text-gray-600 dark:text-gray-400 hover:bg-indigo-50 dark:hover:bg-indigo-900/20 hover:text-indigo-600 transition-colors rounded-lg"
    >
      <span className="mr-3">{icon}</span>
      {label}
    </Link>
  );
}
