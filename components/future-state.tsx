"use client";

import { Card } from "@/components/ui/card";
import { CheckCircle2, TrendingDown, Shield, Zap, Target } from "lucide-react";
import { cn } from "@/lib/utils";

export function FutureState() {
    const benefits = [
        {
            icon: TrendingDown,
            title: "Optimized Infrastructure",
            description:
                "Right-sized resources that match actual usage patterns, eliminating waste while maintaining performance.",
            color: "text-emerald-400",
            bgColor: "bg-emerald-500/10",
            borderColor: "border-emerald-500/20",
        },
        {
            icon: CheckCircle2,
            title: "Clean Resource State",
            description:
                "No zombie droplets, unattached volumes, or inactive load balancers. Every resource serves a purpose.",
            color: "text-blue-400",
            bgColor: "bg-blue-500/10",
            borderColor: "border-blue-500/20",
        },
        {
            icon: Shield,
            title: "Cost-Effective Operations",
            description:
                "Infrastructure costs aligned with actual needs, freeing budget for growth and innovation.",
            color: "text-indigo-400",
            bgColor: "bg-indigo-500/10",
            borderColor: "border-indigo-500/20",
        },
        {
            icon: Target,
            title: "Continuous Optimization",
            description:
                "Ongoing visibility into infrastructure health, with actionable insights to prevent waste from accumulating.",
            color: "text-violet-400",
            bgColor: "bg-violet-500/10",
            borderColor: "border-violet-500/20",
        },
    ];

    return (
        <section
            id="future-state"
            className="py-20 sm:py-32 px-4 sm:px-6 relative overflow-hidden"
        >
            {/* Background Effects */}
            <div className="absolute inset-0 bg-linear-to-b from-emerald-950/10 via-transparent to-transparent pointer-events-none" />
            <div className="absolute top-0 left-0 w-96 h-96 bg-emerald-500/5 rounded-full blur-3xl -translate-y-1/2 -translate-x-1/2 pointer-events-none" />

            <div className="max-w-7xl mx-auto relative z-10">
                {/* Header */}
                <div className="text-center mb-12 sm:mb-16 space-y-4 sm:space-y-6">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-mono tracking-wider uppercase">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                        Optimized State
                    </div>
                    <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-medium tracking-tight text-white leading-[1.1]">
                        Where You <br />
                        <span className="text-transparent bg-clip-text bg-linear-to-r from-emerald-400 to-indigo-400">
                            Could Be
                        </span>
                    </h2>
                    <p className="text-lg sm:text-xl text-zinc-400 max-w-3xl mx-auto leading-relaxed font-light">
                        An infrastructure that runs efficiently, with every resource serving a clear
                        purpose. Costs aligned with actual needs, giving you visibility and control
                        over your cloud spending.
                    </p>
                </div>

                {/* Benefits Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
                    {benefits.map((benefit, index) => {
                        const Icon = benefit.icon;
                        return (
                            <Card
                                key={index}
                                className={cn(
                                    "p-6 sm:p-8 border transition-all duration-300 hover:-translate-y-1 hover:shadow-xl",
                                    benefit.bgColor,
                                    benefit.borderColor,
                                    "bg-white/2 backdrop-blur-sm"
                                )}
                            >
                                <div className="space-y-4">
                                    <div
                                        className={cn(
                                            "w-12 h-12 rounded-lg flex items-center justify-center border",
                                            benefit.bgColor,
                                            benefit.borderColor
                                        )}
                                    >
                                        <Icon className={cn("w-6 h-6", benefit.color)} />
                                    </div>
                                    <h3 className="text-xl sm:text-2xl font-medium text-white">
                                        {benefit.title}
                                    </h3>
                                    <p className="text-sm sm:text-base text-zinc-400 leading-relaxed">
                                        {benefit.description}
                                    </p>
                                </div>
                            </Card>
                        );
                    })}
                </div>

                {/* Bottom CTA */}
                <div className="mt-12 sm:mt-16 text-center">
                    <div className="inline-flex items-center gap-2 text-emerald-400 text-sm font-medium">
                        <Zap className="w-4 h-4" />
                        <span>
                            Achieve this state with clear, actionable recommendations tailored to your
                            infrastructure
                        </span>
                    </div>
                </div>
            </div>
        </section>
    );
}
