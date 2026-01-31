"use client";

import { useEffect, useState } from "react";

export function ScrollProgress() {
    const [scrollProgress, setScrollProgress] = useState(0);

    useEffect(() => {
        const updateScrollProgress = () => {
            const scrollPx = document.documentElement.scrollTop;
            const winHeightPx =
                document.documentElement.scrollHeight -
                document.documentElement.clientHeight;
            const scrolled = (scrollPx / winHeightPx) * 100;

            setScrollProgress(scrolled);
        };

        window.addEventListener("scroll", updateScrollProgress, { passive: true });
        updateScrollProgress();

        return () => {
            window.removeEventListener("scroll", updateScrollProgress);
        };
    }, []);

    // Color transitions based on scroll progress
    // 0-25%: Red (problem) → 25-75%: Purple (journey) → 75-100%: Emerald (solution)
    const getGradientColor = () => {
        if (scrollProgress < 25) {
            return "from-red-500 via-orange-500 to-yellow-500";
        } else if (scrollProgress < 75) {
            return "from-purple-500 via-indigo-500 to-blue-500";
        } else {
            return "from-emerald-500 via-teal-500 to-cyan-500";
        }
    };

    return (
        <>
            {/* Fixed scroll progress bar */}
            <div
                className="fixed top-0 left-0 right-0 h-1 z-[9999] pointer-events-none"
                role="progressbar"
                aria-label="Page scroll progress"
                aria-valuenow={Math.round(scrollProgress)}
                aria-valuemin={0}
                aria-valuemax={100}
            >
                <div
                    className={`h-full bg-gradient-to-r ${getGradientColor()} transition-all duration-300 ease-out`}
                    style={{
                        width: `${scrollProgress}%`,
                        boxShadow: `0 0 20px ${scrollProgress > 75 ? "rgba(16, 185, 129, 0.5)" : scrollProgress > 25 ? "rgba(99, 102, 241, 0.5)" : "rgba(239, 68, 68, 0.5)"}`,
                    }}
                />
            </div>

            {/* Floating CTA after 50% scroll */}
            {scrollProgress > 50 && scrollProgress < 90 && (
                <div className="fixed bottom-8 right-8 z-50 animate-in fade-in slide-in-from-bottom-4 duration-500">
                    <button
                        onClick={() => {
                            const input = document.querySelector("#token-input");
                            input?.scrollIntoView({
                                behavior: "smooth",
                                block: "center",
                            });
                        }}
                        className="group px-6 py-3 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold rounded-full shadow-2xl hover:shadow-indigo-500/50 transition-all duration-300 hover:-translate-y-1 flex items-center gap-2"
                        aria-label="Start your free analysis"
                    >
                        <span>Start Analysis</span>
                        <svg
                            className="w-4 h-4 group-hover:translate-x-1 transition-transform"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M13 7l5 5m0 0l-5 5m5-5H6"
                            />
                        </svg>
                    </button>
                </div>
            )}
        </>
    );
}
