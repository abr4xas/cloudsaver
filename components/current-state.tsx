"use client";

import { Card } from "@/components/ui/card";
import { AlertTriangle, Server, Database, HardDrive, Zap } from "lucide-react";
import { cn } from "@/lib/utils";

export function CurrentState() {
    const problems = [
        {
            icon: Server,
            title: "Underutilized Servers",
            description:
                "Paying for servers running at minimal capacity, wasting resources and budget on oversized infrastructure.",
            color: "text-orange-400",
            bgColor: "bg-orange-500/10",
            borderColor: "border-orange-500/20",
        },
        {
            icon: AlertTriangle,
            title: "Zombie Resources",
            description:
                "Powered-off droplets, unattached volumes, and unused IPs still generating monthly costs without providing value.",
            color: "text-red-400",
            bgColor: "bg-red-500/10",
            borderColor: "border-red-500/20",
        },
        {
            icon: Database,
            title: "Over-Provisioned Databases",
            description:
                "Database plans sized for peak loads that rarely occur, resulting in unnecessary monthly expenses.",
            color: "text-yellow-400",
            bgColor: "bg-yellow-500/10",
            borderColor: "border-yellow-500/20",
        },
        {
            icon: HardDrive,
            title: "Accumulated Waste",
            description:
                "Old snapshots, redundant backups, and inactive load balancers consuming storage and budget month after month.",
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
                        Where You Are <br />
                        <span className="text-zinc-500">Right Now</span>
                    </h2>
                    <p className="text-lg sm:text-xl text-zinc-400 max-w-3xl mx-auto leading-relaxed font-light">
                        Most DigitalOcean accounts accumulate waste over time. Resources that seemed
                        necessary months ago now sit idle, consuming budget without delivering value.
                        Without visibility, these costs compound silently.
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
                            These problems compound over time, often unnoticed until costs become
                            significant
                        </span>
                    </div>
                </div>
            </div>
        </section>
    );
}
