"use client";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useState } from "react";
import { Menu, X, Zap } from "lucide-react";
import { useScrollPosition } from "@/hooks/use-scroll-position";
import { useScrollToSection } from "@/hooks/use-scroll-to-section";

const navLinks = [
    { label: "Current State", href: "#current-state" },
    { label: "Future State", href: "#future-state" },
    { label: "How It Works", href: "#how-it-works" },
    { label: "Features", href: "#features" },
];

export function Navbar() {
    const isScrolled = useScrollPosition({ threshold: 20 });
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const { scrollTo } = useScrollToSection({
        onScrollComplete: () => setIsMobileMenuOpen(false),
    });

    const scrollToSection = (href: string) => {
        scrollTo(href);
        setIsMobileMenuOpen(false);
    };

    return (
        <nav
            className={cn(
                "fixed top-0 left-0 right-0 z-50 transition-all duration-300",
                isScrolled
                    ? "bg-zinc-950/80 backdrop-blur-xl border-b border-white/5 shadow-lg"
                    : "bg-transparent"
            )}
        >
            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-14 sm:h-16">
                    {/* Logo */}
                    <button
                        onClick={() =>
                            window.scrollTo({ top: 0, behavior: "smooth" })
                        }
                        className="flex items-center gap-2 group"
                    >
                        <div className="w-8 h-8 rounded-lg bg-indigo-500/20 border border-indigo-500/30 flex items-center justify-center group-hover:bg-indigo-500/30 transition-colors">
                            <Zap className="w-4 h-4 text-indigo-400" />
                        </div>
                        <span className="font-semibold text-white text-base sm:text-lg tracking-tight">
                            CloudSaver
                        </span>
                    </button>

                    {/* Desktop Navigation */}
                    <div className="hidden md:flex items-center gap-1">
                        {navLinks.map((link) => (
                            <button
                                key={link.href}
                                onClick={() => scrollToSection(link.href)}
                                className="px-4 py-2 text-sm text-zinc-400 hover:text-white transition-colors rounded-lg hover:bg-white/5"
                            >
                                {link.label}
                            </button>
                        ))}
                    </div>

                    {/* CTA Button */}
                    <div className="hidden md:flex items-center gap-4">
                        <Button
                            onClick={() => scrollToSection("#token-input")}
                            className="bg-indigo-600 hover:bg-indigo-500 text-white rounded-full px-6"
                        >
                            Start Audit
                        </Button>
                    </div>

                    {/* Mobile Menu Button */}
                    <button
                        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                        className="md:hidden p-2 text-zinc-400 hover:text-white transition-colors"
                    >
                        {isMobileMenuOpen ? (
                            <X className="w-6 h-6" />
                        ) : (
                            <Menu className="w-6 h-6" />
                        )}
                    </button>
                </div>

                {/* Mobile Menu */}
                <div
                    className={cn(
                        "md:hidden overflow-hidden transition-all duration-300",
                        isMobileMenuOpen ? "max-h-80 pb-4" : "max-h-0"
                    )}
                >
                    <div className="flex flex-col gap-1 pt-2">
                        {navLinks.map((link) => (
                            <button
                                key={link.href}
                                onClick={() => scrollToSection(link.href)}
                                className="px-4 py-3 text-left text-sm text-zinc-400 hover:text-white hover:bg-white/5 rounded-lg transition-colors"
                            >
                                {link.label}
                            </button>
                        ))}
                        <Button
                            onClick={() => scrollToSection("#token-input")}
                            className="mt-2 bg-indigo-600 hover:bg-indigo-500 text-white"
                        >
                            Start Audit
                        </Button>
                    </div>
                </div>
            </div>
        </nav>
    );
}
