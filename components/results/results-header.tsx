"use client";

import { useEffect, useState } from "react";
import { CheckCircle2 } from "lucide-react";

export function ResultsHeader() {
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        // Trigger animation after mount
        const timer = setTimeout(() => setIsVisible(true), 100);
        return () => clearTimeout(timer);
    }, []);

    return (
        <div className="text-center space-y-6">
            {/* Success Badge - Animates once */}
            <div
                className={`inline-flex items-center gap-2 px-4 py-2 rounded-full border border-emerald-500/30 bg-emerald-500/10 transition-all duration-700 ${
                    isVisible
                        ? "opacity-100 translate-y-0 scale-100"
                        : "opacity-0 translate-y-4 scale-95"
                }`}
            >
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span className="text-sm font-medium text-emerald-400">
                    Analysis Complete
                </span>
            </div>

            {/* Main Headline */}
            <div className="space-y-3">
                <h2
                    className={`text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight transition-all duration-700 delay-150 ${
                        isVisible
                            ? "opacity-100 translate-y-0"
                            : "opacity-0 translate-y-4"
                    }`}
                >
                    <span className="text-white">You Could Save </span>
                    <span className="bg-gradient-to-r from-emerald-400 via-teal-400 to-emerald-500 bg-clip-text text-transparent">
                        Money
                    </span>
                </h2>
                <p
                    className={`text-lg sm:text-xl text-zinc-400 max-w-2xl mx-auto leading-relaxed transition-all duration-700 delay-300 ${
                        isVisible
                            ? "opacity-100 translate-y-0"
                            : "opacity-0 translate-y-4"
                    }`}
                >
                    Here's your personalized optimization report with actionable recommendations
                </p>
            </div>
        </div>
    );
}
