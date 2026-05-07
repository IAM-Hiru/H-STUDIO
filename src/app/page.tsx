"use client";

import { motion } from "framer-motion";

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-indigo-100 via-purple-50 to-pink-100 dark:from-gray-900 dark:via-gray-800 dark:to-gray-700 font-sans">
      {/* Hero Section */}
      <section className="w-full max-w-4xl text-center py-24 px-8">
        <motion.h1
          className="text-5xl font-extrabold text-gray-900 dark:text-white mb-6"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          Welcome to H-STUDIO
        </motion.h1>
        <motion.p
          className="text-xl text-gray-700 dark:text-gray-300 mb-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.6 }}
        >
          Your personal AI assistant for math, tech Q&A, and instant code/project generation.
        </motion.p>
        <motion.div
          className="flex justify-center gap-4"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.6, duration: 0.5 }}
        >
          <a
            href="/login"
            className="rounded-md bg-indigo-600 px-6 py-3 text-sm font-medium text-white hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 transition-colors"
          >
            Get Started
          </a>
          <a
            href="https://github.com"
            className="rounded-md border border-indigo-600 bg-white px-6 py-3 text-sm font-medium text-indigo-600 hover:bg-indigo-50 dark:bg-gray-800 dark:text-indigo-400 dark:border-indigo-400 transition-colors"
          >
            GitHub
          </a>
        </motion.div>
      </section>

      {/* Features Section */}
      <section className="w-full max-w-5xl py-16 px-8">
        <h2 className="text-3xl font-semibold text-center text-gray-900 dark:text-white mb-12">
          What H-STUDIO Can Do
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <FeatureCard
            title="Math Solver"
            description="Accurate addition, subtraction, algebra, percentages and step-by-step explanations."
            icon="🧮"
          />
          <FeatureCard
            title="Tech Q&A"
            description="Instant answers for programming, AI, web development, databases and more."
            icon="💡"
          />
          <FeatureCard
            title="Code & Project Generator"
            description="Generate full-stack project scaffolds, file structures, and deployment steps."
            icon="⚙️"
          />
        </div>
      </section>

      {/* Footer */}
      <footer className="w-full py-8 text-center text-gray-600 dark:text-gray-400">
        © {new Date().getFullYear()} H-STUDIO. All rights reserved.
      </footer>
    </div>
  );
}

function FeatureCard({ title, description, icon }: { title: string; description: string; icon: string }) {
  return (
    <div className="flex flex-col items-center rounded-lg bg-white p-6 shadow-lg dark:bg-gray-800 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
      <div className="text-4xl mb-4">{icon}</div>
      <h3 className="text-xl font-medium text-gray-900 dark:text-white mb-2">{title}</h3>
      <p className="text-center text-gray-600 dark:text-gray-300">{description}</p>
    </div>
  );
}
