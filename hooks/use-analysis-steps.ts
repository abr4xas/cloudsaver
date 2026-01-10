import { useState, useEffect, useRef, useCallback } from "react";

export interface AnalysisStep {
	label: string;
	duration: number;
}

const DEFAULT_STEPS: AnalysisStep[] = [
	{ label: "Establishing Secure Connection...", duration: 800 },
	{ label: "Auditing Droplets & Volumes...", duration: 1200 },
	{ label: "Calculating Usage Metrics...", duration: 1500 },
	{ label: "Generating Recommendations...", duration: 500 },
];

interface UseAnalysisStepsOptions {
	steps?: AnalysisStep[];
	isAnalyzing: boolean;
}

export function useAnalysisSteps({
	steps = DEFAULT_STEPS,
	isAnalyzing,
}: UseAnalysisStepsOptions) {
	const [analysisStep, setAnalysisStep] = useState(-1); // -1: idle
	const [completedSteps, setCompletedSteps] = useState<number[]>([]);
	const timersRef = useRef<NodeJS.Timeout[]>([]);
	const completeAllRef = useRef<(() => void) | null>(null);

	const startAnimation = useCallback(
		(minDuration: number = 0): Promise<void> => {
			// Clear any existing timers
			timersRef.current.forEach((timer) => clearTimeout(timer));
			timersRef.current = [];
			setAnalysisStep(0);
			setCompletedSteps([]);

			// Calculate total duration of all steps
			const totalStepDuration = steps.reduce(
				(sum, step) => sum + step.duration,
				0
			);

			// Use the longer of minDuration or totalStepDuration
			const actualDuration = Math.max(minDuration, totalStepDuration);

			// Calculate proportional durations for each step
			const stepProportions = steps.map(
				(step) => step.duration / totalStepDuration
			);

			// Start animation/progress simulation
			let currentDelay = 0;
			const animationPromises = steps.map((step, i) => {
				const stepDuration = actualDuration * stepProportions[i];
				const stepPromise = new Promise<void>((resolve) => {
					const timer = setTimeout(() => {
						setAnalysisStep(i);
						if (i > 0) {
							setCompletedSteps((prev) => [...prev, i - 1]);
						}
						resolve();
					}, currentDelay);
					timersRef.current.push(timer);
				});
				currentDelay += stepDuration;
				return stepPromise;
			});

			// Store function to complete all steps immediately
			completeAllRef.current = () => {
				timersRef.current.forEach((timer) => clearTimeout(timer));
				timersRef.current = [];
				setAnalysisStep(steps.length - 1);
				setCompletedSteps(steps.map((_, i) => i));
			};

			// Return promise that resolves when all animations complete + 500ms delay
			return Promise.all(animationPromises).then(() => {
				// Finalize checkmarks
				setCompletedSteps((prev) => [...prev, steps.length - 1]);
				// Wait a beat for the last checkmark to be seen
				return new Promise<void>((resolve) => {
					setTimeout(resolve, 500);
				});
			});
		},
		[steps]
	);

	const completeAll = useCallback(() => {
		if (completeAllRef.current) {
			completeAllRef.current();
		}
	}, []);

	// Reset state during render if we're not analyzing (avoids cascading renders from useEffect)
	if (!isAnalyzing && analysisStep !== -1) {
		setAnalysisStep(-1);
		setCompletedSteps([]);
	}

	useEffect(() => {
		if (!isAnalyzing) {
			// Clear any pending timers
			timersRef.current.forEach((timer) => clearTimeout(timer));
			timersRef.current = [];
		}
	}, [isAnalyzing]);

	useEffect(() => {
		return () => {
			// Cleanup timers on unmount
			timersRef.current.forEach((timer) => clearTimeout(timer));
			timersRef.current = [];
		};
	}, []);

	return {
		analysisStep,
		completedSteps,
		steps,
		startAnimation,
		completeAll,
	};
}
