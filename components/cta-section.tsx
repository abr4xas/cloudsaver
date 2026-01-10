"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ArrowRight, Mail, Check, Loader2, AlertCircle } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { useConfetti } from "@/hooks/use-confetti";

export function CtaSection() {
    const [email, setEmail] = useState("");
    const [status, setStatus] = useState<
        "idle" | "loading" | "success" | "error"
    >("idle");
    const [errorMessage, setErrorMessage] = useState("");
    const { trigger: triggerConfetti } = useConfetti();

    const handleSubscribe = async () => {
        setErrorMessage("");

        // Basic Validation
        if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
            setStatus("error");
            setErrorMessage("Please enter a valid email address.");
            return;
        }

        setStatus("loading");

        // Simulate API call
        setTimeout(() => {
            setStatus("success");
            // Success Confetti
            triggerConfetti({
                particleCount: 80,
                spread: 60,
                origin: { y: 0.8 },
                colors: ["#ffffff", "#6366f1"],
                scalar: 0.8,
            });
            setEmail("");
        }, 1500);
    };

    return (
        <section
            id="newsletter"
            className="py-20 sm:py-32 px-4 sm:px-6 relative overflow-hidden bg-linear-to-b from-indigo-950/20 to-black"
        >
            {/* Ambient Glow */}
            <div className="absolute inset-0 bg-indigo-500/5 pointer-events-none" />

            <div className="max-w-xl mx-auto text-center relative z-10 transition-all duration-700 animate-in fade-in slide-in-from-bottom-8 px-4">
                <div className="space-y-4 sm:space-y-6 mb-8 sm:mb-12">
                    <h2 className="text-3xl sm:text-4xl md:text-5xl font-medium tracking-tight text-white">
                        Stay ahead of cloud costs.
                    </h2>
                    <p className="text-base sm:text-lg text-zinc-400">
                        Get weekly insights on DigitalOcean optimization, discover opportunities to reduce costs,
                        and learn infrastructure best practices delivered to your inbox.{" "}
                        <span className="text-indigo-400 font-medium">(Coming soon)</span>
                    </p>
                </div>

                <div className="relative max-w-sm mx-auto w-full group">
                    <div className="absolute inset-0 bg-linear-to-r from-indigo-500/20 to-purple-500/20 rounded-xl blur-md opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                    <div
                        className={cn(
                            "relative flex items-center bg-[#0A0A0A] border rounded-xl p-1.5 shadow-2xl transition-all duration-300 transform group-hover:-translate-y-1",
                            status === "error"
                                ? "border-red-500/50 ring-1 ring-red-500/20"
                                : "border-white/10 focus-within:border-indigo-500/50 focus-within:ring-2 focus-within:ring-indigo-500/20"
                        )}
                    >
                        <div className="pl-3 text-zinc-500">
                            <Mail className="w-5 h-5" />
                        </div>
                        <Input
                            type="email"
                            placeholder="engineer@company.com"
                            value={email}
                            onChange={(e) => {
                                setEmail(e.target.value);
                                if (status === "error") setStatus("idle");
                            }}
                            onKeyDown={(e) =>
                                e.key === "Enter" && handleSubscribe()
                            }
                            disabled={
                                status === "loading" || status === "success"
                            }
                            aria-label="Email address"
                            className="border-0 bg-transparent text-white placeholder:text-zinc-600 focus-visible:ring-0 focus-visible:ring-offset-0 h-10 min-w-0"
                        />
                        <Button
                            size="sm"
                            onClick={handleSubscribe}
                            disabled={true}
                            className="font-medium px-4 h-9 ml-2 shrink-0 transition-all duration-300 min-w-25 bg-white/50 text-black/50 cursor-not-allowed opacity-75"
                        >
                            Coming Soon
                        </Button>
                    </div>

                    {/* Inline Validation Error */}
                    {status === "error" && (
                        <div className="absolute top-full left-0 w-full mt-2 text-red-500 text-sm flex items-center justify-center gap-1.5 animate-in fade-in slide-in-from-top-1">
                            <AlertCircle className="w-4 h-4" />
                            {errorMessage}
                        </div>
                    )}
                </div>

                <p className="mt-8 text-xs text-zinc-600">
                    No spam. Unsubscribe at any time.
                </p>
            </div>
        </section>
    );
}
