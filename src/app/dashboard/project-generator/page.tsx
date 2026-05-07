"use client";

import { useState } from "react";
import { PlusCircle, FolderTree, Rocket, Loader2 } from "lucide-react";
import axios from "axios";
import ReactMarkdown from "react-markdown";

export default function ProjectGenerator() {
  const [prompt, setPrompt] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState("");

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!prompt.trim() || isLoading) return;

    setIsLoading(true);
    try {
      const fullPrompt = `Generate a full coding project for the following request. 
      Provide:
      1. Project Name
      2. File Structure
      3. Main Code Files
      4. Setup Instructions
      5. Deployment Steps
      
      Request: ${prompt}`;

      const response = await axios.post("/api/ai", {
        prompt: fullPrompt,
      });

      const generatedContent = response.data.text;
      setResult(generatedContent);

      // Save to projects table
      await axios.post("/api/project/save", {
        name: prompt.slice(0, 50),
        description: prompt,
        content: generatedContent,
      });
    } catch (error) {
      console.error("Generation Error:", error);
      setResult("Failed to generate project. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleReset = () => {
    setPrompt("");
    setResult("");
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-20">
      <div className="flex flex-col items-center text-center space-y-4">
        <div className="w-16 h-16 bg-indigo-100 dark:bg-indigo-900/30 rounded-2xl flex items-center justify-center text-indigo-600 dark:text-indigo-400">
          <Rocket size={32} />
        </div>
        <h1 className="text-3xl font-bold text-zinc-900 dark:text-zinc-100">Project Generator</h1>
        <p className="text-zinc-500 dark:text-zinc-400 max-w-lg">
          Describe the project you want to build, and H-STUDIO will generate the structure and code for you.
        </p>
      </div>

      <form onSubmit={handleGenerate} className="bg-white dark:bg-zinc-900 p-6 rounded-2xl border border-zinc-200 dark:border-zinc-800 shadow-sm space-y-4">
        <textarea
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder="e.g., A simple Todo app with React and Supabase..."
          className="w-full h-32 p-4 bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400 text-zinc-900 dark:text-zinc-100 transition-all"
        />
        <div className="flex gap-4">
          <button
            type="submit"
            disabled={!prompt.trim() || isLoading}
            className="flex-1 py-3 bg-indigo-600 hover:bg-indigo-700 disabled:bg-zinc-400 text-white font-semibold rounded-xl flex items-center justify-center gap-2 transition-all shadow-lg shadow-indigo-500/20"
          >
            {isLoading ? <Loader2 className="animate-spin" size={20} /> : <PlusCircle size={20} />}
            {isLoading ? "Generating Project..." : "Generate Project"}
          </button>
          
          {(prompt || result) && (
            <button
              type="button"
              onClick={handleReset}
              className="px-6 py-3 bg-zinc-100 dark:bg-zinc-800 hover:bg-zinc-200 dark:hover:bg-zinc-700 text-zinc-600 dark:text-zinc-400 font-semibold rounded-xl transition-all"
            >
              New Project
            </button>
          )}
        </div>
      </form>

      {result && (
        <div className="space-y-4">
          <div className="flex items-center justify-between px-2">
            <h2 className="text-xl font-bold text-zinc-900 dark:text-zinc-100 flex items-center gap-2">
              <FolderTree className="text-indigo-500" size={20} />
              Generated Project
            </h2>
          </div>
          <div className="bg-white dark:bg-zinc-900 p-8 rounded-2xl border border-zinc-200 dark:border-zinc-800 shadow-sm prose dark:prose-invert max-w-none">
            <ReactMarkdown>{result}</ReactMarkdown>
          </div>
        </div>
      )}
    </div>
  );
}
