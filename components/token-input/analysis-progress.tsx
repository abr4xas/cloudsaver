"use client";

import { CheckCircle2, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { useEffect, useState } from "react";
import type { AnalysisStep } from "@/hooks/use-analysis-steps";

interface AnalysisProgressProps {
    steps: AnalysisStep[];
    analysisStep: number;
    completedSteps: number[];
}

export function AnalysisProgress({
    steps,
    analysisStep,
    completedSteps,
}: AnalysisProgressProps) {
    const [typewriterText, setTypewriterText] = useState("");
    const currentStep = steps[analysisStep];

    // Typewriter effect for active step
    useEffect(() => {
        if (!currentStep) return;

        let currentIndex = 0;
        const text = currentStep.label;
        setTypewriterText("");

        const interval = setInterval(() => {
            if (currentIndex <= text.length) {
                setTypewriterText(text.slice(0, currentIndex));
                currentIndex++;
            } else {
                clearInterval(interval);
            }
        }, 30);

        return () => clearInterval(interval);
    }, [currentStep]);

    // Calculate progress percentage
    const progressPercent = Math.round((completedSteps.length / steps.length) * 100);

    return (
        <div className="w-full mt-8 animate-in fade-in slide-in-from-top-4 duration-500">
            {/* Terminal Header */}
            <div className="bg-zinc-900 border border-zinc-800 rounded-t-lg p-3 flex items-center gap-2">
                <div className="flex gap-1.5">
                    <div className="w-3 h-3 rounded-full bg-red-500/80" />
                    <div className="w-3 h-3 rounded-full bg-yellow-500/80" />
                    <div className="w-3 h-3 rounded-full bg-emerald-500/80" />
                </div>
                <span className="text-xs font-mono text-zinc-500 ml-2">
                    CloudSaver Analysis Terminal
                </span>
            </div>

            {/* Terminal Body */}
            <div className="bg-black border-x border-b border-zinc-800 rounded-b-lg p-6 font-mono text-sm">
                {/* Command Line */}
                <div className="mb-4">
                    <span className="text-emerald-400">$</span>
                    <span className="text-white ml-2">cloudsaver analyze --token dop_v1_***</span>
                </div>

                {/* Progress Steps */}
                <div className="space-y-2">
                    {steps.map((step, index) => {
                        const isActive = index === analysisStep;
                        const isCompleted = completedSteps.includes(index);
                        const isPending = index > analysisStep;

                        return (
                            <div
                                key={index}
                                className={cn(
                                    "flex items-start gap-3 transition-all duration-300",
                                    isActive || isCompleted
                                        ? "opacity-100"
                                        : "opacity-40"
                                )}
                            >
                                {isCompleted ? (
                                    <span className="text-emerald-400 shrink-0">✓</span>
                                ) : isActive ? (
                                    <span className="text-indigo-400 shrink-0 animate-pulse">→</span>
                                ) : (
                                    <span className="text-zinc-700 shrink-0">○</span>
                                )}
                                <span
                                    className={cn(
                                        isActive && "text-indigo-300",
                                        isCompleted && "text-emerald-400",
                                        isPending && "text-zinc-600"
                                    )}
                                >
                                    {isActive ? typewriterText : step.label}
                                    {isActive && (
                                        <span className="inline-block w-2 h-4 bg-indigo-400 ml-1 animate-pulse" />
                                    )}
                                </span>
                            </div>
                        );
                    })}
                </div>

                {/* Progress Bar */}
                {progressPercent > 0 && (
                    <div className="mt-6 pt-4 border-t border-zinc-800">
                        <div className="flex items-center gap-3">
                            <div className="flex-1 h-2 bg-zinc-900 rounded-full overflow-hidden">
                                <div
                                    className="h-full bg-gradient-to-r from-indigo-500 to-emerald-500 transition-all duration-500 ease-out"
                                    style={{ width: `${progressPercent}%` }}
                                />
                            </div>
                            <span className="text-xs text-zinc-500 tabular-nums">
                                {progressPercent}%
                            </span>
                        </div>
                    </div>
                )}

                {/* Final Message */}
                {completedSteps.length === steps.length && (
                    <div className="mt-4 pt-4 border-t border-zinc-800">
                        <div className="text-emerald-400 flex items-center gap-2">
                            <span>✓</span>
                            <span>Analysis complete</span>
                        </div>
                        <div className="text-zinc-500 mt-2 text-xs">
                            ╰─ Generating report...
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
