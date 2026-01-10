"use client";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { TrendingDown, Sparkles, ArrowRight } from "lucide-react";
import type { AnalysisResult } from "@/hooks/use-analysis";

interface ResultsPreviewProps {
    resultsData: AnalysisResult;
    onReset: () => void;
    showPremiumCta?: boolean;
}

export function ResultsPreview({
    resultsData,
    onReset,
    showPremiumCta = true,
}: ResultsPreviewProps) {
    return (
        <div className="w-full max-w-6xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-700 relative z-10 space-y-8 sm:space-y-12 px-4 sm:px-6">
            {/* Header */}
            <div className="text-center space-y-3 sm:space-y-4">
                <Badge
                    variant="outline"
                    className="px-3 sm:px-4 py-1 sm:py-1.5 border-emerald-500/40 bg-emerald-500/10 text-emerald-400 mb-3 sm:mb-4 animate-pulse text-xs sm:text-sm"
                >
                    <span className="mr-2">✨</span>
                    Your Analysis Complete
                </Badge>
                <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight bg-linear-to-r from-white via-white to-zinc-400 bg-clip-text text-transparent">
                    Here's your snapshot
                </h2>
                <p className="text-lg sm:text-xl text-zinc-400 max-w-2xl mx-auto">
                    Your personalized cost analysis is ready. View detailed
                    recommendations and priority actions below.
                </p>
            </div>

            {/* Preview Cards Grid */}
            <div className="grid grid-cols-1 gap-4 sm:gap-6">
                {/* Potential Monthly Savings Card */}
                <Card className="md:col-span-2 p-6 sm:p-8 relative overflow-hidden border-emerald-500/30 bg-linear-to-br from-emerald-950/40 via-zinc-950 to-zinc-950 backdrop-blur-xl group hover:border-emerald-500/50 hover:shadow-[0_0_80px_-12px_rgba(16,185,129,0.4)] transition-all duration-500">
                    <div className="absolute inset-0 bg-linear-to-br from-emerald-500/5 to-transparent opacity-60 group-hover:opacity-100 transition-opacity duration-500" />
                    <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 group-hover:bg-emerald-500/20 transition-colors duration-500" />
                    <div className="relative z-10 space-y-4 sm:space-y-6">
                        {/* Header */}
                        <div className="flex items-center gap-2 sm:gap-3 text-emerald-400">
                            <div className="p-2 sm:p-2.5 rounded-xl bg-emerald-500/20 border border-emerald-500/30">
                                <TrendingDown className="w-4 h-4 sm:w-5 sm:h-5" />
                            </div>
                            <span className="font-semibold tracking-wide uppercase text-xs sm:text-sm">
                                Potential Monthly Savings
                            </span>
                        </div>

                        {/* Main Content Grid */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                            {/* Left Side - Savings Amount */}
                            <div className="space-y-2 sm:space-y-3">
                                <div className="text-4xl sm:text-5xl md:text-6xl font-bold tracking-tighter bg-linear-to-b from-emerald-300 via-emerald-400 to-emerald-600 bg-clip-text text-transparent drop-shadow-lg">
                                    ${resultsData.potentialSavings.toFixed(2)}
                                </div>
                                <div className="flex items-center gap-2 flex-wrap">
                                    {resultsData.potentialSavings > 0 && (
                                        <span className="bg-emerald-500/20 px-2 sm:px-2.5 py-1 rounded-lg text-xs sm:text-sm border border-emerald-500/30 text-emerald-400 font-medium">
                                            -{resultsData.savingsPercentage}%
                                            reduction
                                        </span>
                                    )}
                                </div>
                            </div>

                            {/* Right Side - Comparison */}
                            <div className="space-y-3 sm:space-y-4">
                                {/* Before/After */}
                                <div className="grid grid-cols-2 gap-3 sm:gap-4">
                                    <div className="bg-zinc-900/50 rounded-lg p-2.5 sm:p-3 border border-white/5">
                                        <div className="text-[10px] sm:text-xs text-zinc-500 uppercase tracking-wider mb-1">
                                            Current
                                        </div>
                                        <div className="text-base sm:text-lg font-semibold text-zinc-300">
                                            $
                                            {resultsData.monthlyCost.toFixed(2)}
                                        </div>
                                        <div className="text-[10px] sm:text-xs text-zinc-500">
                                            per month
                                        </div>
                                    </div>
                                    <div className="bg-emerald-500/10 rounded-lg p-2.5 sm:p-3 border border-emerald-500/20">
                                        <div className="text-[10px] sm:text-xs text-emerald-500/80 uppercase tracking-wider mb-1">
                                            Optimized
                                        </div>
                                        <div className="text-base sm:text-lg font-semibold text-emerald-400">
                                            $
                                            {(
                                                resultsData.monthlyCost -
                                                resultsData.potentialSavings
                                            ).toFixed(2)}
                                        </div>
                                        <div className="text-xs text-emerald-500/60">
                                            per month
                                        </div>
                                    </div>
                                </div>

                                {/* Annual Savings */}
                                {resultsData.potentialSavings > 0 && (
                                    <div className="bg-zinc-900/50 rounded-lg p-2.5 sm:p-3 border border-white/5">
                                        <div className="flex items-center justify-between">
                                            <div className="text-[10px] sm:text-xs text-zinc-500 uppercase tracking-wider">
                                                Annual Savings
                                            </div>
                                            <div className="text-sm sm:text-base font-bold text-white">
                                                $
                                                {(
                                                    resultsData.potentialSavings *
                                                    12
                                                ).toFixed(2)}
                                            </div>
                                        </div>
                                        <div className="mt-2 h-1.5 bg-zinc-800 rounded-full overflow-hidden">
                                            <div
                                                className="h-full bg-linear-to-r from-emerald-500 to-emerald-400 rounded-full transition-all duration-1000"
                                                style={{
                                                    width: `${Math.min(
                                                        resultsData.savingsPercentage,
                                                        100
                                                    )}%`,
                                                }}
                                            />
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Bottom Stats */}
                        <div className="pt-4 border-t border-white/5 grid grid-cols-3 gap-3 sm:gap-4">
                            <div className="text-center">
                                <div className="text-xl sm:text-2xl font-bold text-white">
                                    {resultsData.opportunities ?? 0}
                                </div>
                                <div className="text-[10px] sm:text-xs text-zinc-500">
                                    Opportunities
                                </div>
                            </div>
                            <div className="text-center">
                                <div className="text-xl sm:text-2xl font-bold text-emerald-400">
                                    {resultsData.highConfidence ?? 0}
                                </div>
                                <div className="text-[10px] sm:text-xs text-zinc-500">
                                    High Confidence
                                </div>
                            </div>
                            <div className="text-center">
                                <div className="text-xl sm:text-2xl font-bold text-white">
                                    {resultsData.resourcesFound}
                                </div>
                                <div className="text-[10px] sm:text-xs text-zinc-500">
                                    Resources Scanned
                                </div>
                            </div>
                        </div>
                    </div>
                </Card>

                {/* Stats Column */}
                {/* <div className="space-y-4 sm:space-y-6">
                    <Card className="flex-1 p-5 sm:p-6 flex flex-col justify-center bg-zinc-950 border-indigo-500/20 hover:border-indigo-500/40 transition-all hover:shadow-[0_0_40px_-12px_rgba(99,102,241,0.3)]">
                        <div className="flex items-center justify-between mb-3 sm:mb-4">
                            <div className="text-xs sm:text-sm text-zinc-400 uppercase tracking-wider">
                                Investigated Cost
                            </div>
                            <div className="p-1.5 sm:p-2 rounded-lg bg-indigo-500/20 border border-indigo-500/30">
                                <DollarSign className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-indigo-400" />
                            </div>
                        </div>
                        <div className="text-3xl sm:text-4xl font-bold text-white">
                            ${resultsData.monthlyCost.toFixed(1)}
                        </div>
                        <div className="text-[10px] sm:text-xs text-zinc-500 mt-2">
                            Based on current run rate
                        </div>
                    </Card>

                    <Card className="flex-1 p-5 sm:p-6 flex flex-col justify-center bg-zinc-950 border-blue-500/20 hover:border-blue-500/40 transition-all hover:shadow-[0_0_40px_-12px_rgba(59,130,246,0.3)]">
                        <div className="flex items-center justify-between mb-3 sm:mb-4">
                            <div className="text-xs sm:text-sm text-zinc-400 uppercase tracking-wider">
                                Resources Scanned
                            </div>
                            <div className="p-1.5 sm:p-2 rounded-lg bg-blue-500/20 border border-blue-500/30">
                                <Package className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-blue-400" />
                            </div>
                        </div>
                        <div className="text-3xl sm:text-4xl font-bold text-white">
                            {resultsData.resourcesFound}
                        </div>
                        <div className="text-[10px] sm:text-xs text-zinc-500 mt-2">
                            across all regions
                        </div>
                    </Card>
                </div> */}
            </div>

            {/* Premium CTA */}
            {showPremiumCta && (
                <Card className="p-6 sm:p-8 bg-linear-to-br from-violet-950/50 via-zinc-950 to-zinc-950 border-violet-500/30 relative overflow-hidden">
                    {/* Background Glow */}
                    <div className="absolute top-0 right-0 w-64 h-64 bg-violet-500/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none" />

                    <div className="relative z-10 space-y-4 sm:space-y-6">
                        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 sm:gap-6">
                            <div className="flex items-start gap-3 sm:gap-4">
                                <div className="p-2 sm:p-3 rounded-xl bg-violet-500/20 border border-violet-500/30 shrink-0">
                                    <Sparkles className="w-5 h-5 sm:w-6 sm:h-6 text-violet-400" />
                                </div>
                                <div className="space-y-2">
                                    <h3 className="text-xl sm:text-2xl font-bold text-white">
                                        Want the full breakdown?
                                    </h3>
                                    <p className="text-sm sm:text-base text-zinc-400 max-w-2xl">
                                        Upgrade to Premium to see detailed
                                        recommendations, priority actions, cost
                                        distribution charts, and continuous
                                        monitoring.{" "}
                                        <span className="text-violet-400 font-medium">
                                            (Coming soon)
                                        </span>
                                    </p>
                                </div>
                            </div>
                            <Button
                                className="bg-violet-600 hover:bg-violet-500 text-white gap-2 text-base sm:text-lg px-6 sm:px-8 py-5 sm:py-6 shrink-0 opacity-75 cursor-not-allowed w-full md:w-auto"
                                size="lg"
                                disabled
                            >
                                Coming Soon
                                <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5" />
                            </Button>
                        </div>

                        <div className="flex justify-center pt-4">
                            <Button
                                onClick={onReset}
                                variant="ghost"
                                className="text-zinc-500 hover:text-zinc-300"
                            >
                                Run another audit
                            </Button>
                        </div>
                    </div>
                </Card>
            )}
        </div>
    );
}
