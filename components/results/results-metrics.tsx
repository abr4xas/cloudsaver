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
            <Card className="p-8 relative overflow-hidden border-emerald-500/30 bg-linear-to-br from-emerald-950/40 via-zinc-950 to-zinc-950 backdrop-blur-xl group hover:border-emerald-500/50 transition-all duration-500">
                <div className="absolute inset-0 bg-linear-to-br from-emerald-500/5 to-transparent opacity-60 group-hover:opacity-100 transition-opacity duration-500" />
                <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 group-hover:bg-emerald-500/20 transition-colors duration-500" />
                <div className="relative z-10">
                    {/* Grid 2x2 Layout */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        {/* Top Left - Potential Monthly Savings */}
                        <div className="space-y-4">
                            <div className="flex items-center gap-3 text-emerald-400">
                                <div className="p-2 rounded-lg bg-emerald-500/20 border border-emerald-500/30">
                                    <TrendingDown className="w-5 h-5" />
                                </div>
                                <span className="font-semibold tracking-wide uppercase text-sm">
                                    Potential Monthly Savings
                                </span>
                            </div>
                            <div className="text-6xl sm:text-7xl font-bold tracking-tighter bg-linear-to-b from-emerald-300 via-emerald-400 to-emerald-600 bg-clip-text text-transparent">
                                ${potentialSavings.toFixed(2)}
                            </div>
                            <div>
                                <span className="bg-emerald-500/20 px-3 py-1.5 rounded-full text-sm border border-emerald-500/30 text-emerald-400 font-medium">
                                    -{savingsPercentage}% reduction
                                </span>
                            </div>
                        </div>

                        {/* Top Right - Annual Savings */}
                        <div className="space-y-4">
                            <div className="text-xs text-zinc-500 uppercase tracking-wider">
                                Annual Savings
                            </div>
                            <div className="text-4xl sm:text-5xl font-bold text-white">
                                ${annualSavings.toFixed(2)}
                            </div>
                            <div className="h-2 bg-zinc-800 rounded-full overflow-hidden mt-4">
                                <div
                                    className="h-full bg-linear-to-r from-emerald-500 to-emerald-400 rounded-full transition-all duration-1000"
                                    style={{
                                        width: `${savingsPercentage}%`,
                                    }}
                                />
                            </div>
                        </div>

                        {/* Bottom Left - Current vs Optimized */}
                        <div className="grid grid-cols-2 gap-4">
                            <div className="bg-zinc-900/50 rounded-lg p-4 border border-white/5">
                                <div className="text-xs text-zinc-500 uppercase tracking-wider mb-2">
                                    Current
                                </div>
                                <div className="text-2xl font-semibold text-zinc-300">
                                    ${monthlyCost.toFixed(2)}
                                </div>
                                <div className="text-xs text-zinc-500 mt-1">
                                    per month
                                </div>
                            </div>
                            <div className="bg-emerald-500/10 rounded-lg p-4 border border-emerald-500/20">
                                <div className="text-xs text-emerald-500/80 uppercase tracking-wider mb-2">
                                    Optimized
                                </div>
                                <div className="text-2xl font-semibold text-emerald-400">
                                    ${optimizedCost.toFixed(2)}
                                </div>
                                <div className="text-xs text-emerald-500/60 mt-1">
                                    per month
                                </div>
                            </div>
                        </div>

                        {/* Bottom Right - Key Metrics (3 metrics horizontal) */}
                        <div className="grid grid-cols-3 gap-4">
                            <div className="text-center">
                                <div className="text-4xl font-bold text-white mb-2">
                                    {recommendationsCount}
                                </div>
                                <div className="text-xs text-zinc-500 uppercase tracking-wider">
                                    Opportunities
                                </div>
                            </div>
                            <div className="text-center">
                                <div className="text-4xl font-bold text-emerald-400 mb-2">
                                    {highConfidenceCount}
                                </div>
                                <div className="text-xs text-zinc-500 uppercase tracking-wider">
                                    High Confidence
                                </div>
                            </div>
                            <div className="text-center">
                                <div className="text-4xl font-bold text-white mb-2">
                                    {resourcesFound}
                                </div>
                                <div className="text-xs text-zinc-500 uppercase tracking-wider">
                                    Resources Scanned
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
