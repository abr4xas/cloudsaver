"use client";

import { memo, Suspense } from "react";
import dynamic from "next/dynamic";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
// Optimized imports - Next.js optimizePackageImports handles tree-shaking
import { Terminal, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

// Lazy load dialog component to reduce initial bundle size
const TokenInstructionsDialog = dynamic(
    () =>
        import("./token-instructions-dialog").then(
            (mod) => mod.TokenInstructionsDialog,
        ),
    { ssr: false },
);

// Discriminated union for component state - avoids boolean prop proliferation
export type TokenInputState =
    | { status: "idle" }
    | { status: "focused" }
    | { status: "analyzing" }
    | { status: "error"; message?: string };

interface TokenInputFormProps {
    token: string;
    onTokenChange: (token: string) => void;
    onAnalyze: () => void;
    state: TokenInputState;
    onFocus: () => void;
    onBlur: () => void;
}

export const TokenInputForm = memo(function TokenInputForm({
    token,
    onTokenChange,
    onAnalyze,
    state,
    onFocus,
    onBlur,
}: TokenInputFormProps) {
    // Derive flags from discriminated union state
    const isAnalyzing = state.status === "analyzing";
    const isShaking = state.status === "error";
    const isFocused = state.status === "focused";

    return (
        <>
            {/* Minimalist Header */}
            <div className="text-center space-y-4 sm:space-y-6 mb-8 sm:mb-12 px-4">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-xs font-mono text-muted-foreground">
                    <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 animate-pulse" />
                    Read-only · No storage
                </div>
                <h2 className="text-3xl sm:text-4xl text-white font-medium tracking-tight">
                    Paste your token. Get your report in under 30 seconds.
                </h2>
                <p className="text-zinc-400 text-base sm:text-lg">
                    Paste your read-only token below. We never store it.
                </p>
            </div>

            {/* The "Terminal" Input */}
            <div
                className={cn(
                    "w-full relative group transition-transform duration-100",
                    state.status === "error" && "-translate-x-2.5 animate-shake",
                )}
                style={{
                    animation:
                        state.status === "error"
                            ? "shake 0.5s cubic-bezier(.36,.07,.19,.97) both"
                            : undefined,
                }}
            >
                {/* Focus Glow - Theater Mode Spotlight */}
                <div
                    className={cn(
                        "absolute -inset-1 bg-linear-to-r from-indigo-500/20 via-purple-500/20 to-indigo-500/20 rounded-2xl blur-xl transition-opacity duration-700 pointer-events-none",
                        isFocused || isAnalyzing ? "opacity-100" : "opacity-0",
                    )}
                />

                <div
                    className={cn(
                        "relative bg-[#0A0A0A] rounded-xl p-2 transition-[box-shadow,background-color,ring] duration-300",
                        isFocused || isAnalyzing
                            ? "shadow-2xl ring-1 ring-indigo-500/50"
                            : "shadow-lg border border-white/5",
                    )}
                >
                    <div className="relative flex items-center">
                        <div className="absolute left-4 text-zinc-600 transition-colors group-focus-within:text-zinc-400">
                            <Terminal className="w-5 h-5" aria-hidden="true" />
                        </div>
                        <Input
                            type="password"
                            placeholder="dop_v1_..."
                            value={token}
                            onChange={(e) => onTokenChange(e.target.value)}
                            onFocus={onFocus}
                            onBlur={onBlur}
                            onKeyDown={(e) => {
                                if (e.key === "Enter") onAnalyze();
                            }}
                            className="pl-10 sm:pl-12 pr-16 sm:pr-20 md:pr-28 h-11 sm:h-12 md:h-14 bg-transparent border-0 text-white placeholder:text-zinc-600 font-mono text-xs sm:text-sm md:text-base focus-visible:ring-0 focus-visible:ring-offset-0 transition-all relative z-0"
                            disabled={isAnalyzing}
                            spellCheck={false}
                            aria-invalid={isShaking}
                            aria-label="DigitalOcean API Token"
                        />
                        <div className="absolute right-1.5 sm:right-2 top-1/2 -translate-y-1/2 z-10 px-1.5 sm:px-2 md:px-3 py-0.5 sm:py-1 md:py-1.5 bg-[#0A0A0A] border border-white/5 rounded text-[8px] sm:text-[9px] md:text-[10px] text-zinc-500 font-mono shadow-sm">
                            READ-ONLY
                        </div>
                    </div>

                    {/* Inline Error Message */}
                    {state.status === "error" && (
                        <div className="absolute top-full left-0 mt-2 text-xs text-red-500 font-medium animate-in fade-in slide-in-from-top-1">
                            {state.message || "Token is required to proceed."}
                        </div>
                    )}
                </div>
            </div>

            {/* Instructions & Help */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center w-full mt-6 px-1 gap-4 sm:gap-0">
                <Suspense fallback={null}>
                    <TokenInstructionsDialog>
                        <button className="text-sm text-zinc-600 hover:text-zinc-400 transition-colors flex items-center gap-1.5 group focus-visible:ring-1 focus-visible:ring-zinc-500 focus-visible:outline-none rounded-sm">
                            <span className="border-b border-white/0 group-hover:border-zinc-500 transition-all">
                                Where is my token?
                            </span>
                        </button>
                    </TokenInstructionsDialog>
                </Suspense>
                <Button
                    onClick={onAnalyze}
                    disabled={!token.trim() || isAnalyzing}
                    size="lg"
                    className={cn(
                        "group bg-indigo-600 hover:bg-indigo-500 text-white font-semibold px-8 py-4 rounded-full shadow-lg hover:shadow-xl transition-all hover:-translate-y-0.5",
                        token.trim() && !isAnalyzing && "animate-pulse-slow",
                        (!token.trim() || isAnalyzing) && "opacity-50 cursor-not-allowed animate-none",
                    )}
                >
                    <span className="mr-2">Analyze My Account</span>
                    <ChevronRight
                        className={cn(
                            "w-5 h-5 transition-transform",
                            "group-hover:translate-x-1",
                        )}
                        aria-hidden="true"
                    />
                </Button>
            </div>
        </>
    );
});
