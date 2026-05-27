"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "@/hooks/useTheme";

export default function ThemeToggle() {
  const [mounted, setMounted] = useState(false);
  const { theme, setTheme, resolvedTheme } = useTheme();

  useEffect(() => {
    setMounted(true);
  }, []);

  const activeTheme = theme === "system" ? resolvedTheme : theme;
  const isDark = activeTheme === "dark";

  if (!mounted) {
    return (
      <div className="h-12 w-12 rounded-full bg-slate-200 dark:bg-slate-700" />
    );
  }

  return (
    <motion.button
      onClick={() => setTheme(isDark ? "light" : "dark")}
      className={`flex h-12 w-12 items-center justify-center rounded-full transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-sky-500/50 ${
        isDark
          ? "bg-gradient-to-br from-slate-700 to-slate-900 shadow-lg shadow-slate-900/30"
          : "bg-gradient-to-br from-sky-400 to-sky-600 shadow-lg shadow-sky-500/30"
      }`}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      aria-label={`Switch to ${isDark ? "light" : "dark"} mode`}
    >
      <motion.div
        initial={false}
        animate={{
          rotate: isDark ? 0 : 180,
        }}
        transition={{ duration: 0.4, ease: "easeInOut" }}
      >
        {isDark ? (
          <Moon className="h-5 w-5 text-amber-400" />
        ) : (
          <Sun className="h-5 w-5 text-white" />
        )}
      </motion.div>
    </motion.button>
  );
}
