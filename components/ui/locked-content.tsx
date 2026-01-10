"use client";

import { cn } from "@/lib/utils";
import { Lock } from "lucide-react";

interface LockedContentProps {
    isLocked: boolean;
    blurIntensity?: "sm" | "md" | "lg";
    showLockIcon?: boolean;
    ctaText?: string;
    className?: string;
    children: React.ReactNode;
}

const BLUR_CLASSES = {
    sm: "blur-[4px]",
    md: "blur-[8px]",
    lg: "blur-[12px]",
};

export function LockedContent({
    isLocked,
    blurIntensity = "md",
    showLockIcon = true,
    ctaText = "Upgrade to Pro",
    className,
    children,
}: LockedContentProps) {
    if (!isLocked) {
        return <>{children}</>;
    }

    return (
        <div className={cn("relative", className)}>
            {/* Blurred Content */}
            <div
                className={cn(
                    BLUR_CLASSES[blurIntensity],
                    "pointer-events-none select-none"
                )}
            >
                {children}
            </div>

            {/* Lock Overlay */}
            {showLockIcon && (
                <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/30 backdrop-blur-[2px] z-10 rounded-lg">
                    <div className="p-3 rounded-full bg-zinc-900/80 border border-white/10 mb-2">
                        <Lock className="w-5 h-5 text-zinc-400" />
                    </div>
                    <span className="text-sm text-zinc-400 font-medium">
                        🔒 {ctaText}
                    </span>
                </div>
            )}
        </div>
    );
}
