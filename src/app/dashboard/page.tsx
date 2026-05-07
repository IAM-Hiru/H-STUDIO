"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import Link from "next/link";
import { motion } from "framer-motion";
import { MessageSquare, Calculator, Code, History } from "lucide-react";

export default function Dashboard() {
  const [stats, setStats] = useState({
    chats: 0,
    projects: 0,
  });

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return;

        const { count: chatCount } = await supabase
          .from("chats")
          .select("*", { count: "exact", head: true })
          .eq("user_id", user.id);

        const { count: projectCount } = await supabase
          .from("projects")
          .select("*", { count: "exact", head: true })
          .eq("user_id", user.id);

        setStats({ 
          chats: chatCount || 0, 
          projects: projectCount || 0 
        });
      } catch (error) {
        console.error("Error fetching stats:", error);
      }
    };
    fetchStats();
  }, []);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Dashboard</h1>
        <p className="text-gray-600 dark:text-gray-400">Welcome to your AI control center.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard icon={<MessageSquare className="text-blue-500" />} label="Total Chats" value={stats.chats} />
        <StatCard icon={<Code className="text-green-500" />} label="Projects Generated" value={stats.projects} />
        <StatCard icon={<History className="text-purple-500" />} label="Saved Items" value={12} />
        <StatCard icon={<Calculator className="text-orange-500" />} label="Math Solved" value={8} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700">
          <h3 className="text-xl font-semibold mb-4 dark:text-white">Quick Actions</h3>
          <div className="grid grid-cols-2 gap-4">
            <QuickActionBtn 
              href="/dashboard/chat" 
              label="New Chat" 
              icon={<MessageSquare size={20} />} 
              color="bg-blue-600" 
            />
            <QuickActionBtn 
              href="/dashboard/project-generator" 
              label="Generate Project" 
              icon={<Code size={20} />} 
              color="bg-green-600" 
            />
            <QuickActionBtn 
              href="/dashboard/chat" 
              label="Solve Math" 
              icon={<Calculator size={20} />} 
              color="bg-orange-600" 
            />
            <QuickActionBtn 
              href="/dashboard/history" 
              label="View History" 
              icon={<History size={20} />} 
              color="bg-purple-600" 
            />
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700">
          <h3 className="text-xl font-semibold mb-4 dark:text-white">Recent Activity</h3>
          <div className="space-y-4 text-sm text-gray-600 dark:text-gray-400">
            <p>You solved an algebra equation 2 hours ago.</p>
            <p>Generated a React frontend project yesterday.</p>
            <p>Asked about SQL databases 2 days ago.</p>
          </div>
        </div>
      </div>
    </div>
  );
}

function StatCard({ icon, label, value }: { icon: React.ReactNode, label: string, value: number }) {
  return (
    <motion.div 
      whileHover={{ y: -5 }}
      className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 flex items-center space-x-4"
    >
      <div className="p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
        {icon}
      </div>
      <div>
        <p className="text-sm text-gray-500 dark:text-gray-400">{label}</p>
        <p className="text-2xl font-bold dark:text-white">{value}</p>
      </div>
    </motion.div>
  );
}

function QuickActionBtn({ href, label, icon, color }: { href: string, label: string, icon: React.ReactNode, color: string }) {
  return (
    <Link 
      href={href}
      className={`flex flex-col items-center justify-center p-4 rounded-xl text-white ${color} hover:opacity-90 transition-opacity`}
    >
      {icon}
      <span className="mt-2 text-sm font-medium">{label}</span>
    </Link>
  );
}
