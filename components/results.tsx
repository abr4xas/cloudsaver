"use client";

import { useState, useMemo, memo } from "react";
import { useAnimatedNumbers } from "@/hooks/use-animated-numbers";
import { ResultsLoading } from "./results/results-loading";
import { ResultsEmpty } from "./results/results-empty";
import { ResultsHeader } from "./results/results-header";
import { ResultsMetrics } from "./results/results-metrics";
import { ResultsRecommendations } from "./results/results-recommendations";

interface ResultsProps {
    data: {
        monthlyCost: number;
        potentialSavings: number;
        savingsPercentage: number;
        resourcesFound: number;
        recommendations: Array<{
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
        }>;
    };
}

function ResultsComponent({ data }: ResultsProps) {
    const [expandedItems, setExpandedItems] = useState<number[]>([]);
    const [isLoading, _setIsLoading] = useState(false);
    // Feature gating: Demo mode always shows Pro tier
    const isPro = true;

    const animatedValues = useAnimatedNumbers({
        monthlyCost: data.monthlyCost,
        potentialSavings: data.potentialSavings,
        resourcesFound: data.resourcesFound,
    });

    const toggleExpand = (index: number) => {
        setExpandedItems(
            (prev) => (prev.includes(index) ? [] : [index]) // Close if already open, open only this one
        );
    };

    // Memoize highConfidenceCount to avoid recalculating on every render
    const highConfidenceCount = useMemo(
        () =>
            data.recommendations.filter((r) => r.confidence === "High").length,
        [data.recommendations]
    );

    if (isLoading) {
        return <ResultsLoading />;
    }

    if (data.recommendations.length === 0) {
        return <ResultsEmpty resourcesFound={data.resourcesFound} />;
    }

    return (
        <section
            className="py-20 px-4 relative overflow-hidden"
            id="results-section"
        >
            {/* Background Glow */}
            <div className="absolute top-1/4 right-0 w-125 h-125 bg-accent/5 rounded-full blur-[120px] pointer-events-none" />

            <div className="max-w-6xl mx-auto space-y-16 relative z-10 transition-all duration-700 animate-in fade-in slide-in-from-bottom-8">
                <ResultsHeader />

                <ResultsMetrics
                    monthlyCost={data.monthlyCost}
                    potentialSavings={data.potentialSavings}
                    savingsPercentage={data.savingsPercentage}
                    resourcesFound={data.resourcesFound}
                    recommendationsCount={data.recommendations.length}
                    highConfidenceCount={highConfidenceCount}
                    _animatedValues={animatedValues}
                />

                {/* Detailed Breakdown Section */}
                <div>
                    <ResultsRecommendations
                        recommendations={data.recommendations}
                        expandedItems={expandedItems}
                        onToggleExpand={toggleExpand}
                        isPro={isPro}
                    />
                </div>
            </div>
        </section>
    );
}

// Memoize Results component to prevent unnecessary re-renders
export const Results = memo(ResultsComponent);
