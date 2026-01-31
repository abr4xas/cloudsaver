"use client";

import { Button } from "@/components/ui/button";
import { useEffect, useState, useRef, useCallback } from "react";
import { ArrowRight, ShieldCheck, Zap, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { useMousePosition } from "@/hooks/use-mouse-position";
import { useScrollToSection } from "@/hooks/use-scroll-to-section";

const PHRASES = [
    "Zombie Resources",
    "Idle Droplets",
    "Orphaned Volumes",
    "Over-Provisioned DBs",
    "Unused Snapshots",
    "Abandoned Load Balancers",
];

export function Hero() {
    const [isVisible, setIsVisible] = useState(false);
    const [currentPhraseIndex, setCurrentPhraseIndex] = useState(0);
    const [currentText, setCurrentText] = useState("");
    const [isDeleting, setIsDeleting] = useState(false);
    const containerRef = useRef<HTMLDivElement>(null);

    useMousePosition({
        containerRef,
        enabled: true,
    });

    const { scrollTo } = useScrollToSection();

    useEffect(() => {
        const raf = requestAnimationFrame(() => {
            setIsVisible(true);
        });
        return () => cancelAnimationFrame(raf);
    }, []);

    // Typewriter effect
    useEffect(() => {
        const currentPhrase = PHRASES[currentPhraseIndex];
        let timeout: NodeJS.Timeout;

        if (!isDeleting && currentText === currentPhrase) {
            // Pause at end of phrase
            timeout = setTimeout(() => setIsDeleting(true), 2000);
        } else if (isDeleting && currentText === "") {
            // Move to next phrase
            setIsDeleting(false);
            setCurrentPhraseIndex((prev) => (prev + 1) % PHRASES.length);
        } else {
            // Type or delete character
            const delay = isDeleting ? 50 : 100;
            timeout = setTimeout(() => {
                setCurrentText((prev) =>
                    isDeleting
                        ? currentPhrase.substring(0, prev.length - 1)
                        : currentPhrase.substring(0, prev.length + 1)
                );
            }, delay);
        }

        return () => clearTimeout(timeout);
    }, [currentText, isDeleting, currentPhraseIndex]);

    const scrollToAnalysis = useCallback(() => {
        scrollTo("#token-input");
    }, [scrollTo]);

    return (
        <section
            ref={containerRef}
            className="relative min-h-[90vh] flex items-center justify-center px-4 py-12 sm:py-20 overflow-hidden bg-black"
        >
            {/* Tech Grid Background using CSS patterns */}
            <div className="absolute inset-0 z-0">
                <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-size-[24px_24px]" />
                <div className="absolute left-0 right-0 top-0 -z-10 m-auto h-77.5 w-77.5 rounded-full bg-emerald-500 opacity-20 blur-[100px]" />
                <div className="absolute right-0 top-0 -z-10 h-77.5 w-77.5 rounded-full bg-indigo-500 opacity-20 blur-[100px]" />

                {/* Spotlight Overlay */}
                <div
                    className="pointer-events-none absolute -inset-px opacity-0 transition-opacity duration-300 group-hover:opacity-100"
                    style={{
                        background: `radial-gradient(600px circle at var(--mouse-x) var(--mouse-y), rgba(16, 185, 129, 0.06), transparent 40%)`,
                    }}
                />
            </div>

            <div className="max-w-7xl w-full mx-auto relative z-10">
                {/* Asymmetric Layout: 70% Content / 30% Visual */}
                <div className="grid grid-cols-1 lg:grid-cols-10 gap-12 items-center">
                    {/* Left: Content (70%) */}
                    <div
                        className={cn(
                            "lg:col-span-7 space-y-10 transition-[opacity,transform] duration-1000 text-center lg:text-left",
                            isVisible
                                ? "opacity-100 translate-y-0"
                                : "opacity-0 translate-y-10",
                        )}
                    >
                    {/* Badge */}
                    <div className="inline-flex flex-wrap items-center justify-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 backdrop-blur-md mb-8 hover:bg-white/10 transition-colors cursor-default">
                        <span className="relative flex h-2 w-2">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-yellow-500 opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-2 w-2 bg-yellow-500"></span>
                        </span>
                        <a
                            href="/changelog"
                            className="text-xs text-zinc-500 hover:text-zinc-300 flex items-center gap-1 transition-colors"
                        >
                            Read Changelog{" "}
                            <ChevronRight
                                className="w-3 h-3"
                                aria-hidden="true"
                            />
                        </a>
                    </div>

                    {/* Main Headline */}
                    <h1 className="text-3xl xs:text-4xl sm:text-5xl md:text-6xl lg:text-6xl xl:text-7xl font-bold tracking-tight leading-[1.15] sm:leading-[0.9] mx-auto lg:mx-0 max-w-full">
                        <span className="block text-white mb-2">
                            Stop Wasting Money on
                        </span>
                        <span className="block pb-2 min-h-[1.2em]">
                            <span className="inline-block text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-teal-400 to-indigo-500">
                                {currentText}
                                <span className="animate-pulse">|</span>
                            </span>
                        </span>
                    </h1>

                    <p className="text-lg sm:text-xl md:text-2xl text-zinc-400 max-w-4xl mx-auto lg:mx-0 leading-relaxed font-light px-4 lg:px-0">
                        <span className="text-white font-medium">
                            Find idle droplets, orphaned volumes, and over-provisioned resources in under 30 seconds.
                        </span>{" "}
                        Get a detailed report showing exactly how much you can save—with copy-paste commands to fix it.{" "}
                        <span className="text-emerald-400 font-medium">
                            Free. No sign-up. No card.
                        </span>
                    </p>

                    {/* CTA Group */}
                    <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 justify-center lg:justify-start items-center lg:items-start pt-6 sm:pt-8">
                        <Button
                            size="lg"
                            className="group relative overflow-hidden bg-white text-black hover:bg-zinc-200 text-base sm:text-lg px-6 sm:px-8 py-4 sm:py-6 h-auto rounded-full transition-all duration-300 hover:shadow-[0_0_20px_rgba(255,255,255,0.3)] w-full sm:w-auto min-w-0 sm:min-w-50"
                            onClick={scrollToAnalysis}
                        >
                            <span className="relative z-10 font-bold flex items-center gap-2">
                                See My Savings
                                <ArrowRight
                                    className="w-4 h-4 group-hover:translate-x-1 transition-transform"
                                    aria-hidden="true"
                                />
                            </span>
                        </Button>
                    </div>

                    {/* Social Proof */}
                    <div className="pt-6">
                        <p className="text-sm sm:text-base text-zinc-400">
                            Join{" "}
                            <span className="font-semibold text-emerald-400">
                                2,500+ teams
                            </span>{" "}
                            who've found{" "}
                            <span className="font-semibold text-emerald-400">
                                $450K+
                            </span>{" "}
                            in savings
                        </p>
                    </div>

                    {/* Trust Indicators */}
                    <div className="pt-12 sm:pt-16 flex flex-wrap justify-center lg:justify-start gap-x-6 sm:gap-x-12 gap-y-4 sm:gap-y-6 opacity-60 px-4 lg:px-0">
                        <div className="flex items-center gap-2 sm:gap-3">
                            <ShieldCheck
                                className="w-4 h-4 sm:w-5 sm:h-5 text-emerald-400"
                                aria-hidden="true"
                            />
                            <span className="text-xs sm:text-sm font-medium text-zinc-300">
                                Read-Only Access
                            </span>
                        </div>
                        <div className="flex items-center gap-2 sm:gap-3">
                            <Zap
                                className="w-4 h-4 sm:w-5 sm:h-5 text-indigo-400"
                                aria-hidden="true"
                            />
                            <span className="text-xs sm:text-sm font-medium text-zinc-300">
                                Report in under 30s
                            </span>
                        </div>
                        <div className="flex items-center gap-2 sm:gap-3">
                            <ShieldCheck
                                className="w-4 h-4 sm:w-5 sm:h-5 text-emerald-400"
                                aria-hidden="true"
                            />
                            <span className="text-xs sm:text-sm font-medium text-zinc-300">
                                We never store your token
                            </span>
                        </div>
                    </div>
                </div>

                {/* Right: 3D Visual (30%) */}
                <div className="lg:col-span-3 hidden lg:flex items-center justify-center">
                    <div className="relative w-full h-96">
                        {/* Floating savings cards with 3D effect - Centered vertically */}
                        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-64 animate-float-slow">
                            <div className="p-6 rounded-2xl bg-gradient-to-br from-emerald-500/20 to-teal-500/20 border border-emerald-500/30 backdrop-blur-md shadow-2xl transform rotate-3 hover:rotate-0 transition-transform duration-500">
                                <div className="text-xs text-emerald-400 font-mono mb-2">
                                    Monthly Savings
                                </div>
                                <div className="text-4xl font-bold text-white mb-1">
                                    $247
                                </div>
                                <div className="text-xs text-zinc-400">
                                    avg. per account
                                </div>
                            </div>
                        </div>

                        <div className="absolute bottom-1/4 left-1/2 -translate-x-1/2 w-56 animate-float-medium" style={{ animationDelay: '0.5s' }}>
                            <div className="p-5 rounded-2xl bg-gradient-to-br from-indigo-500/20 to-purple-500/20 border border-indigo-500/30 backdrop-blur-md shadow-2xl transform -rotate-6 hover:rotate-0 transition-transform duration-500">
                                <div className="text-xs text-indigo-400 font-mono mb-2">
                                    Resources Optimized
                                </div>
                                <div className="text-3xl font-bold text-white mb-1">
                                    27%
                                </div>
                                <div className="text-xs text-zinc-400">
                                    avg. reduction
                                </div>
                            </div>
                        </div>

                        {/* Decorative circles with parallax */}
                        <div className="absolute top-1/4 left-1/2 w-32 h-32 bg-emerald-500/10 rounded-full blur-2xl animate-pulse-slow" />
                        <div className="absolute bottom-1/4 left-1/2 w-24 h-24 bg-indigo-500/10 rounded-full blur-2xl animate-pulse-slow" style={{ animationDelay: '1s' }} />
                    </div>
                </div>
            </div>
            </div>
        </section>
    );
}
