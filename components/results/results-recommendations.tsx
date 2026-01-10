"use client";

import { memo } from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { LockedContent } from "@/components/ui/locked-content";
import {
    DollarSign,
    ChevronDown,
    ChevronUp,
    Lock,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { CONFIDENCE_STYLES } from "@/lib/constants";

interface Recommendation {
    type: string;
    subtype: string;
    title: string;
    description: string;
    savings: number;
    confidence: string;
    impact?: string;
    warnings?: string[];
    data?: {
        count?: number;
        recommendations?: Array<{
            subtype: string;
            title: string;
            resourceName: string | null;
            savings: number;
        }>;
        snapshotCount?: number;
        totalSizeGB?: number;
        ageMonths?: number;
        snapshotIds?: string[];
    };
}

interface ResultsRecommendationsProps {
    recommendations: Recommendation[];
    expandedItems: number[];
    onToggleExpand: (index: number) => void;
    isPro: boolean;
}

// Memoize getConfidenceStyle outside component to avoid recreation
function getConfidenceStyle(confidence: string) {
    switch (confidence) {
        case "High":
            return CONFIDENCE_STYLES.HIGH;
        case "Medium":
            return CONFIDENCE_STYLES.MEDIUM;
        default:
            return CONFIDENCE_STYLES.LOW;
    }
}

function ResultsRecommendationsComponent({
    recommendations,
    expandedItems,
    onToggleExpand,
    isPro,
}: ResultsRecommendationsProps) {
    return (
        <div className="space-y-6 results-recommendations">
            <h3 className="text-2xl font-bold">Priority Recommendations</h3>

            <div className="space-y-4">
                {recommendations.map((rec, index) => (
                    <Card
                        key={index}
                        className="group p-0 overflow-hidden border-white/5 bg-white/5 hover:bg-white/10 transition-all duration-300"
                    >
                        <div
                            className={cn(
                                "p-6",
                                isPro ? "cursor-pointer" : "cursor-default"
                            )}
                            onClick={() => isPro && onToggleExpand(index)}
                            title={
                                !isPro
                                    ? "Upgrade to Pro to see details"
                                    : undefined
                            }
                        >
                            <div className="flex items-start gap-4">
                                <div
                                    className={cn(
                                        "p-3 rounded-xl",
                                        isPro
                                            ? getConfidenceStyle(rec.confidence)
                                            : "bg-zinc-800/50 border border-white/10"
                                    )}
                                >
                                    <DollarSign className="w-6 h-6" />
                                </div>

                                <div className="flex-1 min-w-0">
                                    <div className="flex items-center justify-between gap-4 mb-1">
                                        <h4 className="text-lg font-semibold truncate group-hover:text-primary transition-colors">
                                            {rec.title}
                                        </h4>
                                        <LockedContent
                                            isLocked={!isPro}
                                            blurIntensity="sm"
                                            showLockIcon={false}
                                        >
                                            <div className="text-sm font-bold text-accent whitespace-nowrap">
                                                {rec.savings > 0 ? (
                                                    <span className="bg-emerald-500/20 px-2 py-1 rounded text-emerald-400 border border-emerald-500/30">
                                                        ${rec.savings.toFixed(2)}/mo
                                                    </span>
                                                ) : (
                                                    <span className="text-muted-foreground">
                                                        Optimized
                                                    </span>
                                                )}
                                            </div>
                                        </LockedContent>
                                    </div>
                                    <LockedContent
                                        isLocked={!isPro}
                                        blurIntensity="sm"
                                        showLockIcon={false}
                                    >
                                        <p className="text-muted-foreground text-sm">
                                            {rec.description}
                                        </p>
                                    </LockedContent>
                                </div>

                                <div className="pt-1">
                                    {!isPro ? (
                                        <Lock className="w-5 h-5 text-zinc-500" />
                                    ) : expandedItems.includes(index) ? (
                                        <ChevronUp className="w-5 h-5 text-muted-foreground" />
                                    ) : (
                                        <ChevronDown className="w-5 h-5 text-muted-foreground" />
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Expandable Details */}
                        {isPro && (
                            <div
                                className={cn(
                                    "bg-black/20 border-t border-white/5 overflow-hidden transition-all duration-300 ease-in-out",
                                    expandedItems.includes(index)
                                        ? "max-h-none opacity-100"
                                        : "max-h-0 opacity-0"
                                )}
                            >
                                <div className="p-6 pt-4 pb-8 space-y-6">
                                    <div className="flex items-center gap-2">
                                        <Badge
                                            variant="outline"
                                            className={getConfidenceStyle(
                                                rec.confidence
                                            )}
                                        >
                                            {rec.confidence} Confidence
                                        </Badge>
                                        <Badge
                                            variant="outline"
                                            className="border-white/10 text-muted-foreground"
                                        >
                                            {rec.type.toUpperCase()}
                                        </Badge>
                                    </div>

                                    {/* Nested recommendations */}
                                    {rec.data?.recommendations && (
                                        <div className="space-y-3">
                                            <p className="text-sm font-medium text-foreground">
                                                Breakdown ({rec.data.count}{" "}
                                                items):
                                            </p>
                                            <div className="space-y-2">
                                                {rec.data.recommendations.map(
                                                    (subRec: any, subIndex: number) => (
                                                        <div
                                                            key={subIndex}
                                                            className="bg-zinc-900/50 rounded-lg p-3 border border-white/5"
                                                        >
                                                            <div className="flex items-start justify-between gap-3">
                                                                <div className="flex-1 min-w-0">
                                                                    <div className="text-sm text-zinc-300 mb-1">
                                                                        {
                                                                            subRec.title
                                                                        }
                                                                    </div>
                                                                    {subRec.resourceName && (
                                                                        <div className="text-xs font-mono text-zinc-500">
                                                                            Resource:{" "}
                                                                            {
                                                                                subRec.resourceName
                                                                            }
                                                                        </div>
                                                                    )}
                                                                </div>
                                                                <div className="text-xs font-semibold text-emerald-400 whitespace-nowrap">
                                                                    {subRec.savings > 0 ? (
                                                                        <span className="bg-emerald-500/20 px-2 py-0.5 rounded border border-emerald-500/30">
                                                                            ${subRec.savings.toFixed(2)}/mo
                                                                        </span>
                                                                    ) : (
                                                                        "Optimized"
                                                                    )}
                                                                </div>
                                                            </div>
                                                        </div>
                                                    )
                                                )}
                                            </div>
                                        </div>
                                    )}

                                    {/* Snapshot details */}
                                    {rec.data?.snapshotCount && (
                                        <div className="bg-zinc-900/50 rounded-lg p-4 border border-white/5 space-y-2">
                                            <div className="grid grid-cols-2 gap-3 text-sm">
                                                <div>
                                                    <div className="text-xs text-zinc-500 uppercase mb-1">
                                                        Snapshots
                                                    </div>
                                                    <div className="text-zinc-300 font-semibold">
                                                        {rec.data.snapshotCount}
                                                    </div>
                                                </div>
                                                <div>
                                                    <div className="text-xs text-zinc-500 uppercase mb-1">
                                                        Total Size
                                                    </div>
                                                    <div className="text-zinc-300 font-semibold">
                                                        {rec.data.totalSizeGB} GB
                                                    </div>
                                                </div>
                                                <div>
                                                    <div className="text-xs text-zinc-500 uppercase mb-1">
                                                        Age
                                                    </div>
                                                    <div className="text-zinc-300 font-semibold">
                                                        {rec.data.ageMonths}{" "}
                                                        months+
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    )}

                                    {/* Warnings */}
                                    {rec.warnings && rec.warnings.length > 0 && (
                                        <div className="space-y-2">
                                            <p className="text-sm font-medium text-amber-400">
                                                ⚠️ Important Warnings:
                                            </p>
                                            <div className="grid gap-2">
                                                {rec.warnings.map(
                                                    (
                                                        warning: string,
                                                        i: number
                                                    ) => (
                                                        <div
                                                            key={i}
                                                            className="flex items-start gap-2 text-sm text-zinc-400 bg-amber-500/5 border border-amber-500/20 rounded-lg p-2"
                                                        >
                                                            {warning}
                                                        </div>
                                                    )
                                                )}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}
                    </Card>
                ))}
            </div>
        </div>
    );
}

// Memoize ResultsRecommendations to prevent unnecessary re-renders
export const ResultsRecommendations = memo(ResultsRecommendationsComponent);
