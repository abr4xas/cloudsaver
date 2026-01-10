"use client";

import { Button } from "@/components/ui/button";
import { Sparkles } from "lucide-react";
import type { CleanBillData } from "@/hooks/use-analysis";

interface CleanBillCardProps {
    cleanBillData: CleanBillData;
    onReset: () => void;
}

export function CleanBillCard({
    cleanBillData,
    onReset,
}: CleanBillCardProps) {
    return (
        <div className="w-full mt-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
            <div className="relative bg-[#0A0A0A] rounded-2xl p-8 text-center space-y-6 border border-indigo-500/30 shadow-[0_0_80px_-20px_rgba(99,102,241,0.3)]">
                {/* Glow effect */}
                <div className="absolute inset-0 bg-indigo-500/5 rounded-2xl pointer-events-none" />

                <div className="relative z-10 space-y-6">
                    <div className="mx-auto w-20 h-20 rounded-full bg-indigo-500/20 flex items-center justify-center border border-indigo-500/30">
                        <Sparkles className="w-10 h-10 text-indigo-400" />
                    </div>

                    <div className="space-y-3">
                        <h3 className="text-2xl font-bold text-white">
                            All Systems Optimal
                        </h3>
                        <p className="text-zinc-400">
                            Analyzed{" "}
                            <span className="text-indigo-400 font-medium">
                                {cleanBillData.resourcesFound} resources
                            </span>{" "}
                            and found{" "}
                            <span className="text-indigo-400 font-medium">
                                0 wasted items
                            </span>
                            .
                        </p>
                        <p className="text-zinc-600 text-sm">
                            Your infrastructure is fully optimized.
                        </p>
                    </div>

                    <Button
                        onClick={onReset}
                        variant="outline"
                        className="border-indigo-500/30 hover:border-indigo-500/50 hover:bg-indigo-500/10 text-indigo-400 hover:text-white"
                    >
                        Run another audit
                    </Button>
                </div>
            </div>
        </div>
    );
}
