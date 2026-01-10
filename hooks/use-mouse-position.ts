import { useEffect, useState, useRef, RefObject } from "react";

interface MousePosition {
    x: number;
    y: number;
}

interface UseMousePositionOptions {
    containerRef: RefObject<HTMLElement | null>;
    enabled?: boolean;
}

export function useMousePosition({
    containerRef,
    enabled = true,
}: UseMousePositionOptions) {
    const [mousePosition, setMousePosition] = useState<MousePosition>({ x: 0, y: 0 });
    const rafIdRef = useRef<number | null>(null);

    useEffect(() => {
        if (!enabled) return;

        // Check for reduced motion preference
        const prefersReducedMotion = window.matchMedia(
            "(prefers-reduced-motion: reduce)"
        ).matches;

        if (prefersReducedMotion) return;

        const handleMouseMove = (e: MouseEvent) => {
            if (!containerRef.current) return;

            // Cancel previous animation frame if exists
            if (rafIdRef.current !== null) {
                cancelAnimationFrame(rafIdRef.current);
            }

            // Use requestAnimationFrame for smooth updates
            rafIdRef.current = requestAnimationFrame(() => {
                if (!containerRef.current) return;

                const rect = containerRef.current.getBoundingClientRect();
                const x = e.clientX - rect.left;
                const y = e.clientY - rect.top;

                // Normalize for parallax (-1 to 1)
                const nX = (e.clientX / window.innerWidth) * 2 - 1;
                const nY = (e.clientY / window.innerHeight) * 2 - 1;

                // Update CSS custom properties
                containerRef.current.style.setProperty("--mouse-x", `${x}px`);
                containerRef.current.style.setProperty("--mouse-y", `${y}px`);

                // Update normalized position state
                setMousePosition({ x: nX, y: nY });
            });
        };

        window.addEventListener("mousemove", handleMouseMove, { passive: true });

        return () => {
            window.removeEventListener("mousemove", handleMouseMove);
            if (rafIdRef.current !== null) {
                cancelAnimationFrame(rafIdRef.current);
            }
        };
    }, [containerRef, enabled]);

    return mousePosition;
}
