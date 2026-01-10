"use client";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { PartyPopper } from "lucide-react";

interface ResultsEmptyProps {
    resourcesFound: number;
}

export function ResultsEmpty({ resourcesFound }: ResultsEmptyProps) {
    return (
        <section className="py-32 px-4 relative overflow-hidden flex items-center justify-center min-h-[50vh]">
            <div className="absolute inset-0 bg-emerald-500/5 pointer-events-none" />
            <Card className="max-w-xl w-full p-12 text-center space-y-8 bg-[#0A0A0A] border-emerald-500/30 shadow-[0_0_100px_-20px_rgba(16,185,129,0.2)]">
                <div className="mx-auto w-24 h-24 rounded-full bg-emerald-500/20 flex items-center justify-center border border-emerald-500/30 animate-pulse">
                    <PartyPopper className="w-12 h-12 text-emerald-400" />
                </div>
                <div className="space-y-4">
                    <h2 className="text-3xl font-bold text-white">
                        Clean Bill of Health!
                    </h2>
                    <p className="text-zinc-400 text-lg">
                        We analyzed {resourcesFound} resources and found{" "}
                        <span className="text-emerald-400 font-medium">
                            0 wasted items
                        </span>
                        .
                    </p>
                    <p className="text-zinc-500 text-sm">
                        Your infrastructure is fully optimized.
                    </p>
                </div>
                <Button
                    variant="outline"
                    className="border-emerald-500/30 hover:border-emerald-500/50 hover:bg-emerald-500/5 text-emerald-400"
                >
                    Run another audit
                </Button>
            </Card>
        </section>
    );
}
