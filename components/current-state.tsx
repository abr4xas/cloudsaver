"use client";

import { Card } from "@/components/ui/card";
import { AlertTriangle, Server, Database, HardDrive, Zap } from "lucide-react";
import { cn } from "@/lib/utils";

export function CurrentState() {
    const problems = [
        {
            icon: Server,
            title: "Oversized Droplets",
            description:
                "Paying for CPU and RAM you rarely use. Right-sizing can cut the bill without touching performance.",
            color: "text-orange-400",
            bgColor: "bg-orange-500/10",
            borderColor: "border-orange-500/20",
        },
        {
            icon: AlertTriangle,
            title: "Zombie Resources",
            description:
                "Droplets turned off, volumes with no server attached, IPs nobody uses—still on the invoice every month.",
            color: "text-red-400",
            bgColor: "bg-red-500/10",
            borderColor: "border-red-500/20",
        },
        {
            icon: Database,
            title: "Databases Too Big",
            description:
                "Plans sized for spikes that never came. You pay for capacity you don't need.",
            color: "text-yellow-400",
            bgColor: "bg-yellow-500/10",
            borderColor: "border-yellow-500/20",
        },
        {
            icon: HardDrive,
            title: "Snapshots & Backups Piling Up",
            description:
                "Old snapshots and redundant backups add up. Storage you forgot about still costs money.",
            color: "text-purple-400",
            bgColor: "bg-purple-500/10",
            borderColor: "border-purple-500/20",
        },
    ];

    return (
        <section
            id="current-state"
            className="py-20 sm:py-32 px-4 sm:px-6 relative overflow-hidden"
        >
            {/* Background Effects */}
            <div className="absolute inset-0 bg-linear-to-b from-red-950/10 via-transparent to-transparent pointer-events-none" />
            <div className="absolute top-0 right-0 w-96 h-96 bg-red-500/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none" />

            <div className="max-w-7xl mx-auto relative z-10">
                {/* Header */}
                <div className="text-center mb-12 sm:mb-16 space-y-4 sm:space-y-6">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-500/10 border border-red-500/20 text-red-400 text-xs font-mono tracking-wider uppercase">
                        <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />
                        Current Reality
                    </div>
                    <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-medium tracking-tight text-white leading-[1.1]">
                        Paying for What <br />
                        <span className="text-zinc-500">You Don't Use?</span>
                    </h2>
                    <p className="text-lg sm:text-xl text-zinc-400 max-w-3xl mx-auto leading-relaxed font-light">
                        Droplets left off, snapshots you forgot, volumes nobody uses. Most accounts leak 15–30% of the bill without anyone noticing—until you look.
                    </p>
                </div>

                {/* Problems Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
                    {problems.map((problem, index) => {
                        const Icon = problem.icon;
                        return (
                            <Card
                                key={index}
                                className={cn(
                                    "p-6 sm:p-8 border transition-all duration-300 hover:-translate-y-1 hover:shadow-xl",
                                    problem.bgColor,
                                    problem.borderColor,
                                    "bg-white/2 backdrop-blur-sm"
                                )}
                            >
                                <div className="space-y-4">
                                    <div
                                        className={cn(
                                            "w-12 h-12 rounded-lg flex items-center justify-center border",
                                            problem.bgColor,
                                            problem.borderColor
                                        )}
                                    >
                                        <Icon className={cn("w-6 h-6", problem.color)} />
                                    </div>
                                    <h3 className="text-xl sm:text-2xl font-medium text-white">
                                        {problem.title}
                                    </h3>
                                    <p className="text-sm sm:text-base text-zinc-400 leading-relaxed">
                                        {problem.description}
                                    </p>
                                </div>
                            </Card>
                        );
                    })}
                </div>

                {/* Bottom CTA */}
                <div className="mt-12 sm:mt-16 text-center">
                    <div className="inline-flex items-center gap-2 text-zinc-500 text-sm">
                        <Zap className="w-4 h-4" />
                        <span>
                            The longer you wait, the more waste adds up—and the harder it is to spot.
                        </span>
                    </div>
                </div>
            </div>
        </section>
    );
}
