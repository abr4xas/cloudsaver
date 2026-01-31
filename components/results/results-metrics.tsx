"use client";

import { memo, useMemo } from "react";
import { Card } from "@/components/ui/card";
import { TrendingDown } from "lucide-react";

interface ResultsMetricsProps {
    monthlyCost: number;
    potentialSavings: number;
    savingsPercentage: number;
    resourcesFound: number;
    recommendationsCount: number;
    highConfidenceCount: number;
    _animatedValues: {
        monthlyCost: number;
        potentialSavings: number;
        resourcesFound: number;
    };
}

function ResultsMetricsComponent({
    monthlyCost,
    potentialSavings,
    savingsPercentage,
    resourcesFound,
    recommendationsCount,
    highConfidenceCount,
    _animatedValues,
}: ResultsMetricsProps) {
    // Memoize calculations to avoid recalculating on every render
    const optimizedCost = useMemo(
        () => monthlyCost - potentialSavings,
        [monthlyCost, potentialSavings]
    );

    const annualSavings = useMemo(
        () => potentialSavings * 12,
        [potentialSavings]
    );

    return (
        <div className="max-w-6xl mx-auto">
            <Card className="p-5 sm:p-8 md:p-10 relative overflow-hidden border-emerald-500/20 bg-gradient-to-br from-emerald-950/30 via-zinc-950 to-zinc-950 backdrop-blur-xl">
                {/* Subtle background glow */}
                <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/5 to-transparent opacity-60" />
                <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-500/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />

                <div className="relative z-10">
                    {/* Hero Metric - Potential Savings */}
                    <div className="mb-8 pb-8 border-b border-white/5">
                        <div className="flex items-center gap-2 mb-4">
                            <div className="p-2 rounded-lg bg-emerald-500/10 border border-emerald-500/20">
                                <TrendingDown className="w-4 h-4 text-emerald-400" />
                            </div>
                            <span className="text-sm font-medium text-emerald-400 uppercase tracking-wide">
                                Potential Monthly Savings
                            </span>
                        </div>

                        <div className="flex items-baseline gap-3 sm:gap-4 flex-wrap">
                            <div className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-bold tracking-tighter bg-gradient-to-b from-emerald-300 via-emerald-400 to-emerald-600 bg-clip-text text-transparent">
                                ${potentialSavings.toFixed(2)}
                            </div>
                            <div className="flex items-center gap-3">
                                <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 font-medium text-sm">
                                    {savingsPercentage}% less
                                </span>
                                <span className="text-zinc-500 text-lg">
                                    ${annualSavings.toFixed(2)}/year
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* Cost Comparison with Visual Bars */}
                    <div className="space-y-8">
                        {/* Current Cost Bar */}
                        <div className="space-y-3">
                            <div className="flex items-center justify-between">
                                <span className="text-sm text-zinc-400 uppercase tracking-wider">
                                    Current Monthly Cost
                                </span>
                                <span className="text-2xl font-bold text-white">
                                    ${monthlyCost.toFixed(2)}
                                </span>
                            </div>
                            <div className="relative h-12 bg-zinc-900/50 rounded-lg overflow-hidden border border-white/5">
                                <div
                                    className="absolute inset-y-0 left-0 bg-gradient-to-r from-zinc-700 to-zinc-600"
                                    style={{ width: '100%' }}
                                />
                            </div>
                        </div>

                        {/* Optimized Cost Bar */}
                        <div className="space-y-3">
                            <div className="flex items-center justify-between">
                                <span className="text-sm text-emerald-400 uppercase tracking-wider">
                                    Optimized Monthly Cost
                                </span>
                                <span className="text-2xl font-bold text-emerald-400">
                                    ${optimizedCost.toFixed(2)}
                                </span>
                            </div>
                            <div className="relative h-12 bg-emerald-950/30 rounded-lg overflow-hidden border border-emerald-500/20">
                                <div
                                    className="absolute inset-y-0 left-0 bg-gradient-to-r from-emerald-500 to-emerald-600 transition-all duration-1000 ease-out"
                                    style={{ width: `${(optimizedCost / monthlyCost) * 100}%` }}
                                />
                            </div>
                        </div>

                        {/* Stats Row */}
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4 pt-4 border-t border-white/5">
                            <div className="text-center p-3 sm:p-4 bg-white/5 rounded-lg border border-white/5">
                                <div className="text-xl sm:text-2xl font-bold text-white mb-1">
                                    {resourcesFound}
                                </div>
                                <div className="text-xs text-zinc-500 uppercase tracking-wider">
                                    Resources Analyzed
                                </div>
                            </div>
                            <div className="text-center p-3 sm:p-4 bg-white/5 rounded-lg border border-white/5">
                                <div className="text-xl sm:text-2xl font-bold text-white mb-1">
                                    {recommendationsCount}
                                </div>
                                <div className="text-xs text-zinc-500 uppercase tracking-wider">
                                    Opportunities Found
                                </div>
                            </div>
                            <div className="text-center p-3 sm:p-4 bg-emerald-500/5 rounded-lg border border-emerald-500/20">
                                <div className="text-xl sm:text-2xl font-bold text-emerald-400 mb-1">
                                    {highConfidenceCount}
                                </div>
                                <div className="text-xs text-emerald-400/70 uppercase tracking-wider">
                                    High Confidence
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </Card>
        </div>
    );
}

// Memoize ResultsMetrics to prevent unnecessary re-renders
export const ResultsMetrics = memo(ResultsMetricsComponent);
