"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { User, Shield, Bell, Moon, Sun, Save, Loader2 } from "lucide-react";

export default function SettingsPage() {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [name, setName] = useState("");

  useEffect(() => {
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);
      setName(user?.user_metadata?.full_name || "");
      setLoading(false);
    };
    getUser();
  }, []);

  const handleSave = async () => {
    setSaving(true);
    try {
      const { error } = await supabase.auth.updateUser({
        data: { full_name: name }
      });
      if (error) throw error;
      alert("Settings saved!");
    } catch (error: any) {
      alert(error.message);
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div>Loading settings...</div>;

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-zinc-900 dark:text-white">Settings</h1>
        <p className="text-zinc-500 dark:text-zinc-400">Manage your account and application preferences.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Sidebar Nav */}
        <div className="lg:col-span-1 space-y-2">
          <SettingsNavBtn icon={<User size={18} />} label="Profile" active />
          <SettingsNavBtn icon={<Shield size={18} />} label="Security" />
          <SettingsNavBtn icon={<Bell size={18} />} label="Notifications" />
          <SettingsNavBtn icon={<Moon size={18} />} label="Appearance" />
        </div>

        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white dark:bg-zinc-900 p-6 rounded-2xl border border-zinc-200 dark:border-zinc-800 shadow-sm space-y-6">
            <h3 className="text-xl font-semibold dark:text-white">Profile Information</h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1">
                  Email Address
                </label>
                <input
                  type="email"
                  value={user?.email}
                  disabled
                  className="w-full px-4 py-2 bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-lg text-zinc-500 cursor-not-allowed"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1">
                  Full Name
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="John Doe"
                  className="w-full px-4 py-2 bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none transition-all dark:text-white"
                />
              </div>
            </div>

            <div className="pt-4 border-t border-zinc-100 dark:border-zinc-800 flex justify-end">
              <button
                onClick={handleSave}
                disabled={saving}
                className="px-6 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-lg flex items-center gap-2 transition-all disabled:opacity-50"
              >
                {saving ? <Loader2 className="animate-spin" size={18} /> : <Save size={18} />}
                Save Changes
              </button>
            </div>
          </div>

          <div className="bg-white dark:bg-zinc-900 p-6 rounded-2xl border border-zinc-200 dark:border-zinc-800 shadow-sm space-y-6">
            <h3 className="text-xl font-semibold dark:text-white">Appearance</h3>
            <div className="flex items-center justify-between p-4 bg-zinc-50 dark:bg-zinc-800 rounded-xl">
              <div className="flex items-center gap-3 text-zinc-700 dark:text-zinc-300">
                <Moon size={20} />
                <span>Dark Mode</span>
              </div>
              <button className="w-12 h-6 bg-indigo-600 rounded-full relative">
                <div className="absolute right-1 top-1 w-4 h-4 bg-white rounded-full shadow-sm" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function SettingsNavBtn({ icon, label, active = false }: { icon: React.ReactNode, label: string, active?: boolean }) {
  return (
    <button className={`w-full flex items-center gap-3 px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
      active 
        ? "bg-indigo-50 dark:bg-indigo-900/20 text-indigo-600 dark:text-indigo-400" 
        : "text-zinc-600 dark:text-zinc-400 hover:bg-zinc-50 dark:hover:bg-zinc-800"
    }`}>
      {icon}
      {label}
    </button>
  );
}
