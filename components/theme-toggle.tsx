"use client";

import { Moon, Sun } from "lucide-react";
import { useEffect, useState } from "react";

export function ThemeToggle() {
    const [theme, setTheme] = useState<"dark" | "light">("dark");
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
        // Check system preference or localStorage
        const savedTheme = localStorage.getItem("theme") as "dark" | "light" | null;
        const systemPreference = window.matchMedia("(prefers-color-scheme: dark)").matches
            ? "dark"
            : "light";
        const initialTheme = savedTheme || systemPreference;
        setTheme(initialTheme);
        document.documentElement.classList.toggle("light", initialTheme === "light");
    }, []);

    const toggleTheme = () => {
        const newTheme = theme === "dark" ? "light" : "dark";
        setTheme(newTheme);
        localStorage.setItem("theme", newTheme);
        document.documentElement.classList.toggle("light", newTheme === "light");
    };

    if (!mounted) return null;

    return (
        <button
            onClick={toggleTheme}
            className="relative p-2 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 transition-all duration-300 group"
            aria-label={`Switch to ${theme === "dark" ? "light" : "dark"} mode`}
        >
            <div className="relative w-5 h-5">
                {/* Sun Icon */}
                <Sun
                    className={`absolute inset-0 w-5 h-5 text-yellow-500 transition-all duration-500 ${
                        theme === "light"
                            ? "rotate-0 scale-100 opacity-100"
                            : "rotate-90 scale-0 opacity-0"
                    }`}
                />
                {/* Moon Icon */}
                <Moon
                    className={`absolute inset-0 w-5 h-5 text-indigo-400 transition-all duration-500 ${
                        theme === "dark"
                            ? "rotate-0 scale-100 opacity-100"
                            : "-rotate-90 scale-0 opacity-0"
                    }`}
                />
            </div>
        </button>
    );
}
