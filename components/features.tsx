"use client";

import { Card } from "@/components/ui/card";
import {
    Shield,
    Zap,
    Lock,
    Activity,
    Globe,
    Server,
    Code2,
} from "lucide-react";

export function Features() {
    return (
        <section
            id="features"
            className="py-20 sm:py-32 px-4 sm:px-6 relative overflow-hidden"
        >
            {/* Background Grain/Noise */}
            <div className="absolute inset-0 opacity-[0.03] pointer-events-none bg-[url('https://grainy-gradients.vercel.app/noise.svg')] brightness-100 contrast-150 mix-blend-overlay"></div>

            <div className="max-w-7xl mx-auto space-y-12 sm:space-y-20 relative z-10">
                <div className="text-center space-y-4 sm:space-y-6 max-w-3xl mx-auto px-4">
                    <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-medium tracking-tight text-white">
                        One Report. Every Resource. Real Savings.
                    </h2>
                    <p className="text-lg sm:text-xl text-zinc-400 leading-relaxed font-light">
                        We scan droplets, volumes, snapshots, databases, load balancers, and more—then show you where you're overpaying and how much you can save. Free. No sign-up. No card.
                    </p>
                </div>

                {/*
                  Strict Grid Layout
                  Desktop: 4 columns, 280px rows
                  Tablet: 2 columns
                  Mobile: 1 column
                */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 auto-rows-[minmax(240px,auto)] md:auto-rows-[280px]">
                    {/* Item 1: Secure Processing (Wide: 2x1) */}
                    <Card className="col-span-1 md:col-span-2 row-span-1 bg-[#0A0A0A] border-white/5 p-6 sm:p-8 flex flex-col justify-between group relative overflow-hidden transition-all duration-300 hover:border-white/10 hover:-translate-y-1">
                        <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:opacity-20 transition-opacity">
                            <Code2 className="w-32 h-32 text-white stroke-1" />
                        </div>
                        <div className="relative z-10">
                            <div className="w-10 h-10 rounded-lg bg-white/5 flex items-center justify-center mb-6 border border-white/10">
                                <Shield className="w-5 h-5 text-white" />
                            </div>
                            <h3 className="text-xl sm:text-2xl font-medium text-white mb-2">
                                We Can't Touch Your Account
                            </h3>
                            <p className="text-sm sm:text-base text-zinc-400 max-w-md">
                                Read-only token. We scan, then discard it. We don't store tokens or results. Your data never leaves your control.
                            </p>
                        </div>
                    </Card>

                    {/* Item 2: Instant Results (Tall: 1x2) */}
                    <Card className="col-span-1 md:col-span-1 row-span-1 md:row-span-2 bg-[#0A0A0A] border-white/5 p-6 sm:p-8 flex flex-col relative overflow-hidden group transition-all duration-300 hover:border-white/10 hover:-translate-y-1">
                        <div className="absolute inset-0 bg-linear-to-b from-transparent to-zinc-950/80 pointer-events-none" />

                        <div className="relative z-10 flex flex-col h-full">
                            <div className="w-10 h-10 rounded-lg bg-indigo-500/10 flex items-center justify-center mb-6 border border-indigo-500/20">
                                <Zap className="w-5 h-5 text-indigo-400" />
                            </div>
                            <h3 className="text-xl sm:text-2xl font-medium text-white mb-2">
                                Report in Under 30 Seconds
                            </h3>
                            <p className="text-sm sm:text-base text-zinc-400 mb-6 sm:mb-8">
                                Full report with dollar amounts and copy-paste commands. Each item has a confidence level so you know how solid the recommendation is.
                            </p>

                            {/* Abstract Visualization */}
                            <div className="mt-auto relative w-full h-50">
                                <div className="absolute inset-0 flex items-end justify-between px-4 pb-0 opacity-50">
                                    {[40, 70, 45, 90, 60, 80, 50, 95].map(
                                        (h, i) => (
                                            <div
                                                key={i}
                                                className="w-[10%] bg-indigo-500/30 hover:bg-indigo-500/50 transition-colors rounded-t-sm"
                                                style={{ height: `${h}%` }}
                                            />
                                        )
                                    )}
                                </div>
                            </div>
                        </div>
                    </Card>

                    {/* Item 3: Read-Only (Small: 1x1) */}
                    <Card className="col-span-1 row-span-1 bg-[#0A0A0A] border-white/5 p-8 flex flex-col justify-between group transition-all duration-300 hover:border-white/10 hover:bg-white/2 hover:-translate-y-1">
                        <div>
                            <div className="w-10 h-10 rounded-lg bg-emerald-500/10 flex items-center justify-center mb-6 border border-emerald-500/20">
                                <Lock className="w-5 h-5 text-emerald-400" />
                            </div>
                            <h3 className="text-lg sm:text-xl font-medium text-white mb-1">
                                Read-Only Access
                            </h3>
                            <p className="text-xs sm:text-sm text-zinc-500">
                                We never need write access.
                            </p>
                        </div>
                    </Card>

                    {/* Item 4: Zombie Hunting (Small: 1x1) using Multi-Region slot for flow?
                        Wait, in 4 cols:
                        Row 1: [Item 1 (2)] [Item 2 (1, span 2)] [Item 3 (1)]  -> Total 4 cols. Correct.
                        Row 2: [Item 5 (2)] [ (Item 2 continued) ] [Item 4 (1)] -> Total 4 cols. Correct.
                    */}

                    {/* Item 5: Multi-Region (Wide: 2x1) */}
                    <Card className="col-span-1 md:col-span-2 row-span-1 bg-[#0A0A0A] border-white/5 p-6 sm:p-8 flex flex-col justify-between group overflow-hidden transition-all duration-300 hover:border-white/10 hover:-translate-y-1 relative">
                        <div className="relative z-10">
                            <div className="w-10 h-10 rounded-lg bg-orange-500/10 flex items-center justify-center mb-6 border border-orange-500/20">
                                <Globe className="w-5 h-5 text-orange-400" />
                            </div>
                            <h3 className="text-xl sm:text-2xl font-medium text-white mb-2">
                                Every Region, Every Resource Type
                            </h3>
                            <p className="text-sm sm:text-base text-zinc-400 max-w-sm">
                                11 checks across your whole account: zombie droplets, old snapshots, oversized databases, idle load balancers, and more. Nothing skipped.
                            </p>
                        </div>
                        {/* Map Abstract */}
                        <div className="absolute top-1/2 right-8 -translate-y-1/2 opacity-20 group-hover:opacity-40 transition-opacity">
                            <Server className="w-32 h-32 text-orange-500/20 mt-4" />
                        </div>
                    </Card>

                    {/* Item 4: Placed last in DOM to fit grid hole in Row 2, Col 4 */}
                    <Card className="col-span-1 row-span-1 bg-[#0A0A0A] border-white/5 p-6 sm:p-8 flex flex-col justify-between group transition-all duration-300 hover:border-white/10 hover:bg-white/2 hover:-translate-y-1">
                        <div>
                            <div className="w-10 h-10 rounded-lg bg-pink-500/10 flex items-center justify-center mb-6 border border-pink-500/20">
                                <Activity className="w-5 h-5 text-pink-400" />
                            </div>
                            <h3 className="text-lg sm:text-xl font-medium text-white mb-1">
                                Finds What's Bleeding Money
                            </h3>
                            <p className="text-xs sm:text-sm text-zinc-500">
                                Off droplets, orphan volumes, unused IPs, idle load balancers, forgotten snapshots.
                            </p>
                        </div>
                    </Card>
                </div>
            </div>
        </section>
    );
}
