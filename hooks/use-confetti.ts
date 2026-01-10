import { useCallback } from "react";
import confetti from "canvas-confetti";

// Use any for confetti options as canvas-confetti types are not fully compatible
interface ConfettiOptions {
	particleCount?: number;
	spread?: number;
	origin?: { x?: number; y?: number };
	colors?: string[];
	scalar?: number;
	[key: string]: unknown;
}

interface UseConfettiOptions {
	defaultOptions?: Partial<ConfettiOptions>;
}

const DEFAULT_OPTIONS: Partial<ConfettiOptions> = {
	particleCount: 100,
	spread: 70,
	origin: { y: 0.6 },
};

export function useConfetti({ defaultOptions = {} }: UseConfettiOptions = {}) {
	const trigger = useCallback(
		(options?: Partial<ConfettiOptions>) => {
			const finalOptions = {
				...DEFAULT_OPTIONS,
				...defaultOptions,
				...options,
			};

			confetti(finalOptions as unknown as confetti.Options);
		},
		[defaultOptions]
	);

	return { trigger };
}
