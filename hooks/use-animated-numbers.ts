import { useState, useEffect, useRef } from "react";
import { ANIMATION_DURATIONS } from "@/lib/constants";

interface AnimatedNumbersValues {
    monthlyCost: number;
    potentialSavings: number;
    resourcesFound: number;
}

interface UseAnimatedNumbersOptions {
    monthlyCost: number;
    potentialSavings: number;
    resourcesFound: number;
    duration?: number;
}

export function useAnimatedNumbers({
    monthlyCost,
    potentialSavings,
    resourcesFound,
    duration = ANIMATION_DURATIONS.NUMBER_ANIMATION,
}: UseAnimatedNumbersOptions): AnimatedNumbersValues {
    const [animatedValues, setAnimatedValues] = useState<AnimatedNumbersValues>({
        monthlyCost: 0,
        potentialSavings: 0,
        resourcesFound: 0,
    });

    const rafIdRef = useRef<number | null>(null);
    const startTimeRef = useRef<number | null>(null);

    useEffect(() => {
        // Reset values when inputs change
        setAnimatedValues({
            monthlyCost: 0,
            potentialSavings: 0,
            resourcesFound: 0,
        });

        startTimeRef.current = null;

        const animate = (currentTime: number) => {
            if (startTimeRef.current === null) {
                startTimeRef.current = currentTime;
            }

            const elapsed = currentTime - startTimeRef.current;
            const progress = Math.min(elapsed / duration, 1);

            // Ease out cubic function for smooth animation
            const ease = 1 - Math.pow(1 - progress, 3);

            setAnimatedValues({
                monthlyCost: Math.floor(monthlyCost * ease),
                potentialSavings: Math.floor(potentialSavings * ease),
                resourcesFound: Math.floor(resourcesFound * ease),
            });

            if (progress < 1) {
                rafIdRef.current = requestAnimationFrame(animate);
            } else {
                // Ensure final values are exact
                setAnimatedValues({
                    monthlyCost,
                    potentialSavings,
                    resourcesFound,
                });
            }
        };

        rafIdRef.current = requestAnimationFrame(animate);

        return () => {
            if (rafIdRef.current !== null) {
                cancelAnimationFrame(rafIdRef.current);
            }
        };
    }, [monthlyCost, potentialSavings, resourcesFound, duration]);

    return animatedValues;
}
