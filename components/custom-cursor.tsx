"use client";

import { useEffect, useState } from "react";

export function CustomCursor() {
    const [position, setPosition] = useState({ x: 0, y: 0 });
    const [isPointer, setIsPointer] = useState(false);
    const [isHidden, setIsHidden] = useState(false);
    const [enabled, setEnabled] = useState(false);

    useEffect(() => {
        // Only enable on desktop (not touch devices)
        const isTouchDevice = window.matchMedia("(hover: none) and (pointer: coarse)").matches;
        const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
        const isDesktop = window.innerWidth >= 1024;

        if (!isTouchDevice && !prefersReducedMotion && isDesktop) {
            setEnabled(true);
        }

        if (!enabled) return;

        const updatePosition = (e: MouseEvent) => {
            setPosition({ x: e.clientX, y: e.clientY });

            // Check if hovering over interactive element
            const target = e.target as HTMLElement;
            const isInteractive = !!(
                target.tagName === "A" ||
                target.tagName === "BUTTON" ||
                target.closest("button") ||
                target.closest("a") ||
                target.classList.contains("cursor-pointer") ||
                window.getComputedStyle(target).cursor === "pointer"
            );

            setIsPointer(isInteractive);
        };

        const handleMouseLeave = () => {
            setIsHidden(true);
        };

        const handleMouseEnter = () => {
            setIsHidden(false);
        };

        window.addEventListener("mousemove", updatePosition);
        document.addEventListener("mouseleave", handleMouseLeave);
        document.addEventListener("mouseenter", handleMouseEnter);

        return () => {
            window.removeEventListener("mousemove", updatePosition);
            document.removeEventListener("mouseleave", handleMouseLeave);
            document.removeEventListener("mouseenter", handleMouseEnter);
        };
    }, [enabled]);

    if (!enabled || isHidden) return null;

    return (
        <>
            {/* Hide default cursor */}
            <style jsx global>{`
                * {
                    cursor: none !important;
                }
            `}</style>

            {/* Custom cursor dot */}
            <div
                className="fixed top-0 left-0 pointer-events-none z-[99999] mix-blend-difference"
                style={{
                    transform: `translate(${position.x}px, ${position.y}px)`,
                    transition: "transform 0.05s ease-out",
                }}
            >
                <div
                    className={`w-2 h-2 -translate-x-1/2 -translate-y-1/2 rounded-full bg-white transition-all duration-200 ${
                        isPointer ? "scale-150" : "scale-100"
                    }`}
                />
            </div>

            {/* Custom cursor circle */}
            <div
                className="fixed top-0 left-0 pointer-events-none z-[99999] mix-blend-difference"
                style={{
                    transform: `translate(${position.x}px, ${position.y}px)`,
                    transition: "transform 0.15s cubic-bezier(0.175, 0.885, 0.32, 1.275)",
                }}
            >
                <div
                    className={`w-8 h-8 -translate-x-1/2 -translate-y-1/2 rounded-full border border-white transition-all duration-300 ${
                        isPointer ? "scale-150 opacity-50" : "scale-100 opacity-30"
                    }`}
                />
            </div>

            {/* Trailing effect on certain sections */}
            <div
                className="fixed top-0 left-0 pointer-events-none z-[99998]"
                style={{
                    transform: `translate(${position.x}px, ${position.y}px)`,
                    transition: "transform 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)",
                }}
            >
                <div
                    className={`w-12 h-12 -translate-x-1/2 -translate-y-1/2 rounded-full transition-all duration-500 ${
                        isPointer
                            ? "bg-indigo-500/10 scale-100"
                            : "bg-transparent scale-0"
                    }`}
                />
            </div>
        </>
    );
}
