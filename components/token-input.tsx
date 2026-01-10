"use client";

import { useState, useCallback } from "react";
import { cn } from "@/lib/utils";
import { useAnalysis } from "@/hooks/use-analysis";
import { useAnalysisSteps } from "@/hooks/use-analysis-steps";
import { TokenInputForm } from "./token-input/token-input-form";
import { AnalysisProgress } from "./token-input/analysis-progress";
import { CleanBillCard } from "./token-input/clean-bill-card";
import { Results } from "./results";
import { ShieldCheck, Lock, Cpu } from "lucide-react";

interface TokenInputProps {
    onAnalysisComplete?: (data: unknown) => void;
    _showPremiumCta?: boolean;
}

export function TokenInput({
    onAnalysisComplete,
    _showPremiumCta = true,
}: TokenInputProps) {
    const [isFocused, setIsFocused] = useState(false);

    const {
        token,
        setToken,
        state: _state,
        isAnalyzing,
        isShaking,
        resultsData,
        cleanBillData,
        analyze,
        reset,
    } = useAnalysis({ onAnalysisComplete });

    const { analysisStep, completedSteps, steps, startAnimation, completeAll } =
        useAnalysisSteps({
            isAnalyzing,
        });

    const handleAnalyze = useCallback(() => {
        analyze(token, startAnimation, completeAll);
    }, [analyze, token, startAnimation, completeAll]);

    const handleReset = useCallback(() => {
        reset();
    }, [reset]);

    return (
        <section
            id="token-input"
            className={cn(
                "px-4 relative flex flex-col items-center perspective-1000",
                resultsData ? "py-16" : "py-32"
            )}
        >
            {/* Background Dimmer for Focus (Theater Mode) */}
            <div
                className={cn(
                    "fixed inset-0 bg-black/60 backdrop-blur-[2px] pointer-events-none transition-opacity duration-500 z-0",
                    isFocused || isAnalyzing ? "opacity-100" : "opacity-0"
                )}
            />

            {!resultsData && (
                <div className="max-w-xl w-full relative z-10 flex flex-col items-center">
                    {/* Show form only when not showing clean bill */}
                    {!cleanBillData && (
                        <TokenInputForm
                            token={token}
                            onTokenChange={setToken}
                            onAnalyze={handleAnalyze}
                            isAnalyzing={isAnalyzing}
                            isShaking={isShaking}
                            isFocused={isFocused}
                            onFocusChange={setIsFocused}
                        />
                    )}

                    {/* Progress Steps List (Visible only when Analyzing) */}
                    {isAnalyzing && (
                        <AnalysisProgress
                            steps={steps}
                            analysisStep={analysisStep}
                            completedSteps={completedSteps}
                        />
                    )}

                    {/* Clean Bill of Health */}
                    {cleanBillData && (
                        <CleanBillCard
                            cleanBillData={cleanBillData}
                            onReset={handleReset}
                        />
                    )}

                    {/* Aria-live region for accessibility */}
                    <div className="sr-only" aria-live="polite">
                        {isAnalyzing && steps[analysisStep]?.label}
                    </div>

                    {/* Footer Status Line (Hide when analyzing or showing results) */}
                    <div
                        className={cn(
                            "mt-12 sm:mt-16 pt-6 sm:pt-8 border-t border-white/5 w-full flex flex-wrap justify-center gap-4 sm:gap-8 text-xs text-zinc-600 font-mono tracking-wide uppercase transition-all duration-500 px-4",
                            isAnalyzing || cleanBillData || resultsData
                                ? "opacity-0 translate-y-4"
                                : "opacity-100 translate-y-0"
                        )}
                    >
                        <div className="flex items-center gap-2">
                            <ShieldCheck className="w-3 h-3" />
                            <span>Secure API</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <Lock className="w-3 h-3" />
                            <span>Token Discarded</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <Cpu className="w-3 h-3" />
                            <span>No Storage</span>
                        </div>
                    </div>
                </div>
            )}

            {/* Full Results */}
            {resultsData &&
                resultsData.recommendations &&
                resultsData.recommendations.length > 0 && (
                    <Results
                        data={{
                            monthlyCost: resultsData.monthlyCost,
                            potentialSavings: resultsData.potentialSavings,
                            savingsPercentage: resultsData.savingsPercentage,
                            resourcesFound: resultsData.resourcesFound,
                            recommendations: resultsData.recommendations || [],
                        }}
                    />
                )}
        </section>
    );
}
