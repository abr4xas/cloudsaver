"use client";

import { useEffect, useState } from "react";

interface MoneyRainProps {
    enabled?: boolean;
    duration?: number;
}

export function MoneyRain({ enabled = true, duration = 3000 }: MoneyRainProps) {
    const [particles, setParticles] = useState<Array<{ id: number; left: number; delay: number; duration: number }>>([]);
    const [isAnimating, setIsAnimating] = useState(false);

    useEffect(() => {
        // Check if user prefers reduced motion
        const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
        if (prefersReducedMotion || !enabled) return;

        setIsAnimating(true);

        // Generate particles
        const particleCount = 30;
        const newParticles = Array.from({ length: particleCount }, (_, i) => ({
            id: i,
            left: Math.random() * 100,
            delay: Math.random() * 500,
            duration: 2000 + Math.random() * 1000,
        }));

        setParticles(newParticles);

        // Auto cleanup after duration
        const timeout = setTimeout(() => {
            setIsAnimating(false);
            setParticles([]);
        }, duration);

        return () => clearTimeout(timeout);
    }, [enabled, duration]);

    if (!isAnimating || particles.length === 0) return null;

    return (
        <div
            className="fixed inset-0 pointer-events-none z-[9998] overflow-hidden"
            role="presentation"
            aria-hidden="true"
        >
            {particles.map((particle) => (
                <div
                    key={particle.id}
                    className="absolute -top-10 animate-fall"
                    style={{
                        left: `${particle.left}%`,
                        animationDelay: `${particle.delay}ms`,
                        animationDuration: `${particle.duration}ms`,
                    }}
                >
                    {/* Abstract money particle - emerald color */}
                    <div className="relative">
                        <svg
                            width="24"
                            height="24"
                            viewBox="0 0 24 24"
                            fill="none"
                            className="text-emerald-400 opacity-80"
                        >
                            {/* Dollar sign */}
                            <path
                                d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                            />
                        </svg>
                        {/* Glow effect */}
                        <div className="absolute inset-0 blur-sm bg-emerald-500/30 rounded-full" />
                    </div>
                </div>
            ))}
        </div>
    );
}

// Add this to your global CSS or animations.css
/*
@keyframes fall {
    0% {
        transform: translateY(0) rotate(0deg);
        opacity: 0;
    }
    10% {
        opacity: 1;
    }
    90% {
        opacity: 1;
    }
    100% {
        transform: translateY(100vh) rotate(360deg);
        opacity: 0;
    }
}

.animate-fall {
    animation: fall 2s ease-in forwards;
}
*/
