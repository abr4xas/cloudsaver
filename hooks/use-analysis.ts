import { useState, useCallback } from "react";
import { useConfetti } from "./use-confetti";
import { ANIMATION_DURATIONS } from "@/lib/constants";
import type { AnalysisResult as ApiAnalysisResult, Recommendation } from "@/lib/types/api";
import { checkClientRateLimit } from "@/lib/client-rate-limit";

export type AnalysisState = "idle" | "analyzing" | "success" | "error" | "clean";

export interface AnalysisResult {
    monthlyCost: number;
    potentialSavings: number;
    savingsPercentage: number;
    resourcesFound: number;
    opportunities?: number;
    highConfidence?: number;
    recommendations?: Recommendation[];
    error?: string;
}

/**
 * Validate DigitalOcean API token format (client-side basic validation)
 */
function validateTokenFormat(token: string): boolean {
    if (!token || token.trim().length === 0) {
        return false;
    }

    // Basic format validation (alphanumeric, dashes, underscores, minimum length)
    if (token.length < 32) {
        return false;
    }

    // Check for basic format
    return /^[a-zA-Z0-9_-]+$/.test(token);
}

export interface CleanBillData {
    resourcesFound: number;
}

interface UseAnalysisOptions {
    onAnalysisComplete?: (data: AnalysisResult) => void;
}

export function useAnalysis({ onAnalysisComplete }: UseAnalysisOptions = {}) {
    const [token, setToken] = useState("");
    const [state, setState] = useState<AnalysisState>("idle");
    const [isShaking, setIsShaking] = useState(false);
    const [resultsData, setResultsData] = useState<AnalysisResult | null>(null);
    const [cleanBillData, setCleanBillData] = useState<CleanBillData | null>(null);
    const { trigger: triggerConfetti } = useConfetti();

    const triggerShake = useCallback(() => {
        setIsShaking(true);
        setTimeout(() => setIsShaking(false), ANIMATION_DURATIONS.SHAKE);
    }, []);

    const callAnalyzeAPI = useCallback(
        async (token: string): Promise<AnalysisResult> => {
            // Check client-side rate limit first
            const rateLimitCheck = checkClientRateLimit();
            if (!rateLimitCheck.allowed) {
                const resetInSeconds = Math.ceil((rateLimitCheck.resetAt - Date.now()) / 1000);
                return {
                    monthlyCost: 0,
                    potentialSavings: 0,
                    savingsPercentage: 0,
                    resourcesFound: 0,
                    recommendations: [],
                    error: `Rate limit exceeded. Please wait ${resetInSeconds} seconds before trying again.`,
                };
            }

            try {
                const response = await fetch("/api/analyze", {
                    method: "POST",
                    headers: {
                        "X-DOP-Token": token,
                        "Accept": "application/json",
                    },
                });

                if (!response.ok) {
                    let errorMessage = "Failed to analyze account";

                    try {
                        const errorText = await response.text();
                        if (errorText) {
                            const errorData = JSON.parse(errorText);
                            errorMessage =
                                errorData.message ||
                                errorData.error ||
                                errorMessage;
                        } else {
                            errorMessage = response.statusText || errorMessage;
                        }
                    } catch {
                        // If response is not JSON, use status text
                        errorMessage = response.statusText || errorMessage;
                    }

                    return {
                        monthlyCost: 0,
                        potentialSavings: 0,
                        savingsPercentage: 0,
                        resourcesFound: 0,
                        recommendations: [],
                        error: errorMessage,
                    };
                }

                const json = await response.json();

                // Check for error in response
                if (json.error) {
                    return {
                        monthlyCost: 0,
                        potentialSavings: 0,
                        savingsPercentage: 0,
                        resourcesFound: 0,
                        recommendations: [],
                        error: json.error || "Failed to analyze account",
                    };
                }

                const apiData = json.data || json;

                return {
                    monthlyCost: apiData.monthlyCost ?? 0,
                    potentialSavings: apiData.potentialSavings ?? 0,
                    savingsPercentage: apiData.savingsPercentage ?? 0,
                    resourcesFound: apiData.resourcesFound ?? 0,
                    opportunities: apiData.opportunities ?? 0,
                    highConfidence: apiData.highConfidence ?? 0,
                    recommendations: (apiData.recommendations || []) as Recommendation[],
                };
            } catch (err: unknown) {
                // Handle network errors, fetch failures, etc.
                console.error("API call failed:", err);
                const errorMessage = err instanceof Error
                    ? err.message
                    : "Network error: Unable to connect to the server";

                return {
                    monthlyCost: 0,
                    potentialSavings: 0,
                    savingsPercentage: 0,
                    resourcesFound: 0,
                    recommendations: [],
                    error: errorMessage,
                };
            }
        },
        []
    );

    const analyze = useCallback(
        async (
            tokenToAnalyze: string,
            startAnimation: (minDuration: number) => Promise<void>,
            completeAll: () => void
        ) => {
            // Validate token format before sending
            if (!tokenToAnalyze.trim()) {
                triggerShake();
                return;
            }

            if (!validateTokenFormat(tokenToAnalyze)) {
                triggerShake();
                setState("error");
                setResultsData({
                    monthlyCost: 0,
                    potentialSavings: 0,
                    savingsPercentage: 0,
                    resourcesFound: 0,
                    recommendations: [],
                    error: "Invalid token format. Please check your token and try again.",
                });
                return;
            }

            setState("analyzing");
            setResultsData(null);
            setCleanBillData(null);

            try {
                // Start timing the API call
                const startTime = Date.now();

                // Start the animation with a reasonable estimated duration
                // This gives enough time for most API calls while still showing progress
                const estimatedDuration = ANIMATION_DURATIONS.ANALYSIS_ESTIMATED;
                const animationPromise = startAnimation(estimatedDuration);

                // Perform API call in parallel
                const apiPromise = callAnalyzeAPI(tokenToAnalyze);

                // Wait for API to complete
                const data = await apiPromise;

                // Calculate actual API duration
                const apiDuration = Date.now() - startTime;

                // If API finished faster than estimated, wait a bit for animation to progress
                // If API took longer, the animation will continue naturally
                if (apiDuration < estimatedDuration) {
                    // Wait for animation to reach a reasonable point
                    const minWaitTime = estimatedDuration * ANIMATION_DURATIONS.ANALYSIS_MIN_WAIT_PERCENT;
                    const remainingTime = Math.max(0, minWaitTime - apiDuration);
                    if (remainingTime > 0) {
                        await new Promise((resolve) =>
                            setTimeout(resolve, remainingTime)
                        );
                    }
                }

                // Complete all remaining steps smoothly when API finishes
                if (completeAll) {
                    completeAll();
                }

                // Wait a beat for the last checkmark to be seen
                await new Promise((resolve) =>
                    setTimeout(resolve, ANIMATION_DURATIONS.ANALYSIS_COMPLETE_DELAY)
                );

                if (data.error) {
                    console.error(data.error);
                    triggerShake();
                    setState("error");
                    return;
                }

                // Check if there are opportunities
                const hasOpportunities = (data.opportunities ?? 0) > 0;

                if (!hasOpportunities) {
                    // Clean bill of health - no opportunities found
                    setResultsData(null);
                    setCleanBillData({
                        resourcesFound: data.resourcesFound || 0,
                    });
                    setState("clean");
                    triggerConfetti({
                        colors: ["#8b5cf6", "#6366f1", "#818cf8"],
                    });
                } else {
                    // Show ResultsPreview with metrics and Pro CTA
                    setCleanBillData(null);
                    setResultsData(data);
                    setState("success");
                    triggerConfetti({
                        colors: ["#8b5cf6", "#3b82f6", "#10b981"],
                    });
                    onAnalysisComplete?.(data);
                }
            } catch (err) {
                console.error(err);
                triggerShake();
                setState("error");
            }
        },
        [onAnalysisComplete, triggerShake, callAnalyzeAPI, triggerConfetti]
    );

    const reset = useCallback(() => {
        setCleanBillData(null);
        setResultsData(null);
        setToken("");
        setState("idle");
    }, []);

    return {
        token,
        setToken,
        state,
        isAnalyzing: state === "analyzing",
        isShaking,
        resultsData,
        cleanBillData,
        analyze,
        reset,
    };
}
