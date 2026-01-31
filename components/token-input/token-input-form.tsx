"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Terminal, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

interface TokenInputFormProps {
    token: string;
    onTokenChange: (token: string) => void;
    onAnalyze: () => void;
    isAnalyzing: boolean;
    isShaking: boolean;
    isFocused: boolean;
    onFocusChange: (focused: boolean) => void;
}

export function TokenInputForm({
    token,
    onTokenChange,
    onAnalyze,
    isAnalyzing,
    isShaking,
    isFocused,
    onFocusChange,
}: TokenInputFormProps) {
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
                    isShaking && "-translate-x-2.5 animate-shake",
                )}
                style={{
                    animation: isShaking
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
                            onFocus={() => onFocusChange(true)}
                            onBlur={() => onFocusChange(false)}
                            onKeyDown={(e) => {
                                if (e.key === "Enter") onAnalyze();
                            }}
                            className="pl-12 pr-20 sm:pr-28 h-12 sm:h-14 bg-transparent border-0 text-white placeholder:text-zinc-600 font-mono text-sm sm:text-base focus-visible:ring-0 focus-visible:ring-offset-0 transition-all relative z-0"
                            disabled={isAnalyzing}
                            spellCheck={false}
                            aria-invalid={isShaking}
                            aria-label="DigitalOcean API Token"
                        />
                        <div className="absolute right-2 top-1/2 -translate-y-1/2 z-10 px-2 sm:px-3 py-1 sm:py-1.5 bg-[#0A0A0A] border border-white/5 rounded text-[9px] sm:text-[10px] text-zinc-500 font-mono shadow-sm">
                            READ-ONLY
                        </div>
                    </div>

                    {/* Inline Error Message */}
                    {isShaking && (
                        <div className="absolute top-full left-0 mt-2 text-xs text-red-500 font-medium animate-in fade-in slide-in-from-top-1">
                            Token is required to proceed.
                        </div>
                    )}
                </div>
            </div>

            {/* Instructions & Help */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center w-full mt-6 px-1 gap-4 sm:gap-0">
                <Dialog>
                    <DialogTrigger asChild>
                        <button className="text-sm text-zinc-600 hover:text-zinc-400 transition-colors flex items-center gap-1.5 group focus-visible:ring-1 focus-visible:ring-zinc-500 focus-visible:outline-none rounded-sm">
                            <span className="border-b border-white/0 group-hover:border-zinc-500 transition-all">
                                Where is my token?
                            </span>
                        </button>
                    </DialogTrigger>
                    <DialogContent className="bg-zinc-950 border-zinc-800 p-0 overflow-hidden max-w-[95vw] sm:max-w-105 shadow-2xl mx-4 sm:mx-auto">
                        <div className="p-6 border-b border-white/5 bg-zinc-900/50">
                            <DialogTitle className="text-lg font-medium text-white">
                                Generate Access Token
                            </DialogTitle>
                            <DialogDescription className="text-zinc-500 mt-1">
                                Follow these steps to get your read-only token.
                            </DialogDescription>
                        </div>
                        <div className="p-6 space-y-4">
                            <div className="space-y-4 text-sm text-zinc-400">
                                <div className="flex gap-3">
                                    <div className="flex-none w-6 h-6 rounded bg-zinc-900 border border-white/10 flex items-center justify-center text-xs font-mono text-white">
                                        1
                                    </div>
                                    <p>
                                        Log in to DigitalOcean and go to{" "}
                                        <span className="text-white">API</span>{" "}
                                        settings.
                                    </p>
                                </div>
                                <div className="flex gap-3">
                                    <div className="flex-none w-6 h-6 rounded bg-zinc-900 border border-white/10 flex items-center justify-center text-xs font-mono text-white">
                                        2
                                    </div>
                                    <p>
                                        Click{" "}
                                        <span className="text-white">
                                            Generate New Token
                                        </span>
                                        .
                                    </p>
                                </div>
                                <div className="flex gap-3">
                                    <div className="flex-none w-6 h-6 rounded bg-zinc-900 border border-white/10 flex items-center justify-center text-xs font-mono text-white">
                                        3
                                    </div>
                                    <p>
                                        Name it anything, set expiration, and
                                        select{" "}
                                        <span className="font-mono text-red-400">
                                            Read Only
                                        </span>{" "}
                                        scope.
                                    </p>
                                </div>
                                <div className="flex gap-3">
                                    <div className="flex-none w-6 h-6 rounded bg-zinc-900 border border-white/10 flex items-center justify-center text-xs font-mono text-white">
                                        4
                                    </div>
                                    <p>
                                        Copy the generated token and paste it
                                        here.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </DialogContent>
                </Dialog>
                <Button
                    onClick={onAnalyze}
                    disabled={!token.trim() || isAnalyzing}
                    variant="ghost"
                    className={cn(
                        "group text-zinc-400 hover:text-white hover:bg-transparent px-0 transition-all",
                        token.trim() && "text-indigo-400 hover:text-indigo-300",
                    )}
                >
                    <span className="mr-2">Get my report</span>
                    <ChevronRight
                        className={cn(
                            "w-4 h-4 transition-transform",
                            "group-hover:translate-x-1",
                        )}
                        aria-hidden="true"
                    />
                </Button>
            </div>
        </>
    );
}
