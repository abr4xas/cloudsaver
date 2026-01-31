"use client";

import { Button } from "@/components/ui/button";
import { useEffect, useState, useRef, useCallback } from "react";
import { ArrowRight, ShieldCheck, Zap, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { useTypewriter } from "@/hooks/use-typewriter";
import { useMousePosition } from "@/hooks/use-mouse-position";
import { useScrollToSection } from "@/hooks/use-scroll-to-section";

export function Hero() {
    const [isVisible, setIsVisible] = useState(false);
    const containerRef = useRef<HTMLDivElement>(null);

    const phrases = [
        "Unused Resources",
        "Zombie Droplets",
        "Wasted Infrastructure",
        "Idle Servers",
        "Over-Provisioned VMs",
    ];

    const { currentText } = useTypewriter({
        phrases,
        typingSpeed: 150,
        deletingSpeed: 50,
        pauseDuration: 2000,
    });

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

    const scrollToAnalysis = useCallback(() => {
        scrollTo("#token-input");
    }, [scrollTo]);

    return (
        <section
            ref={containerRef}
            className="relative min-h-[90vh] flex items-center justify-center px-4 py-20 overflow-hidden bg-black"
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

            <div className="max-w-7xl w-full mx-auto text-center relative z-10">
                <div
                    className={cn(
                        "space-y-10 transition-[opacity,transform] duration-1000",
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
                    <h1 className="text-4xl sm:text-6xl md:text-6xl lg:text-7xl xl:text-8xl font-bold tracking-tight leading-[1.1] sm:leading-[0.9]  mx-auto text-balance">
                        <span className="block text-white mb-2">
                            Find Hidden Savings in Your DigitalOcean Account for
                        </span>
                        <span className="block pb-2 min-h-[1.1em]">
                            <span className="inline text-transparent bg-clip-text bg-linear-to-r from-emerald-400 via-teal-400 to-indigo-500 animate-gradient-x wrap-break-word hyphens-none">
                                {currentText}
                            </span>
                            <span className="animate-pulse text-emerald-400 ml-1 inline align-baseline">
                                _
                            </span>
                        </span>
                    </h1>

                    <p className="text-lg sm:text-xl md:text-2xl text-zinc-400 max-w-4xl mx-auto leading-relaxed font-light px-4">
                        <span className="text-white font-medium">
                            Paste your DigitalOcean token. Get a free report in under 30 seconds.
                        </span>{" "}
                        We scan droplets, volumes, snapshots, and more—then show you exactly where you can cut costs.{" "}
                        <span className="text-emerald-400 font-medium">
                            Free. No sign-up. No card.
                        </span>
                    </p>

                    {/* CTA Group */}
                    <div className="flex flex-col sm:flex-row gap-6 justify-center items-center pt-8">
                        <Button
                            size="lg"
                            className="group relative overflow-hidden bg-white text-black hover:bg-zinc-200 text-base sm:text-lg px-6 sm:px-8 py-5 sm:py-6 h-auto rounded-full transition-all duration-300 hover:shadow-[0_0_20px_rgba(255,255,255,0.3)] w-full sm:w-auto min-w-0 sm:min-w-50"
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

                    {/* Trust Indicators */}
                    <div className="pt-12 sm:pt-16 flex flex-wrap justify-center gap-x-6 sm:gap-x-12 gap-y-4 sm:gap-y-6 opacity-60 px-4">
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
            </div>
        </section>
    );
}
