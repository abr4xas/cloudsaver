"use client";

import { CheckCircle2, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
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
    return (
        <div className="w-full mt-8 space-y-3 pl-4 animate-in fade-in slide-in-from-top-4 duration-500">
            {steps.map((step, index) => {
                const isActive = index === analysisStep;
                const isCompleted = completedSteps.includes(index);

                return (
                    <div
                        key={index}
                        className={cn(
                            "flex items-center gap-3 text-sm font-mono transition-all duration-300",
                            isActive || isCompleted
                                ? "opacity-100 translate-x-0"
                                : "opacity-30 -translate-x-2.5",
                            isActive && "text-indigo-400",
                            isCompleted && "text-emerald-400",
                            !isActive && !isCompleted && "text-zinc-500"
                        )}
                    >
                        {isCompleted ? (
                            <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                        ) : isActive ? (
                            <Loader2 className="w-4 h-4 animate-spin text-indigo-500" />
                        ) : (
                            <div className="w-4 h-4 rounded-full border border-zinc-800 bg-zinc-900" />
                        )}
                        <span>{step.label}</span>
                    </div>
                );
            })}
        </div>
    );
}
