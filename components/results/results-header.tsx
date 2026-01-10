"use client";

import { Badge } from "@/components/ui/badge";

export function ResultsHeader() {
    return (
        <div className="text-center space-y-4">
            <Badge
                variant="outline"
                className="px-4 py-1.5 border-emerald-500/40 bg-emerald-500/10 text-emerald-400 mb-4 animate-pulse"
            >
                <span className="mr-2">✨</span>
                Analysis Complete
            </Badge>
            <h2 className="text-4xl sm:text-6xl font-bold tracking-tight bg-linear-to-r from-white via-white to-zinc-400 bg-clip-text text-transparent">
                Here's what we found
            </h2>
            <p className="text-xl text-zinc-400">
                Actionable insights to reduce your monthly bill immediately.
            </p>
        </div>
    );
}
