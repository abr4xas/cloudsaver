"use client";

import Image from "next/image";
import { Github, ExternalLink, Code2, Sparkles } from "lucide-react";
import { Card } from "@/components/ui/card";

export function AboutMe() {
    return (
        <section className="relative py-20 sm:py-32 px-4 sm:px-6 overflow-hidden">
            {/* Background Effects */}
            <div className="absolute inset-0 bg-linear-to-b from-indigo-950/10 via-transparent to-transparent pointer-events-none" />
            <div className="absolute top-1/2 left-0 w-96 h-96 bg-indigo-500/5 rounded-full blur-3xl -translate-y-1/2 -translate-x-1/2 pointer-events-none" />
            <div className="absolute bottom-0 right-0 w-96 h-96 bg-emerald-500/5 rounded-full blur-3xl translate-y-1/2 translate-x-1/2 pointer-events-none" />

            <div className="max-w-6xl mx-auto relative z-10">
                {/* Header */}
                <div className="text-center mb-12 sm:mb-16 space-y-4 sm:space-y-6">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-xs font-mono tracking-wider uppercase">
                        <Sparkles className="w-3 h-3" />
                        About the Creator
                    </div>
                    <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-medium tracking-tight text-white leading-[1.1]">
                        Built by a Developer <br />
                        <span className="text-zinc-500">For Developers</span>
                    </h2>
                </div>

                {/* Main Card */}
                <Card className="border-white/5 bg-white/2 backdrop-blur-sm p-8 sm:p-12 relative overflow-hidden group transition-all duration-300 hover:border-white/10 hover:-translate-y-1">
                    {/* Decorative Background Elements */}
                    <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-10 transition-opacity">
                        <Code2 className="w-48 h-48 text-white stroke-1" />
                    </div>
                    <div className="absolute bottom-0 left-0 p-8 opacity-5 group-hover:opacity-10 transition-opacity">
                        <Sparkles className="w-32 h-32 text-indigo-400" />
                    </div>

                    <div className="relative z-10">
                        <div className="flex flex-col lg:flex-row gap-8 lg:gap-12 items-start">
                            {/* Photo Section */}
                            <div className="shrink-0 mx-auto lg:mx-0">
                                <div className="relative group/photo">
                                    <div className="absolute -inset-1 bg-linear-to-r from-indigo-500/20 via-emerald-500/20 to-indigo-500/20 rounded-full blur-lg opacity-0 group-hover/photo:opacity-100 transition-opacity duration-300" />
                                    <div className="relative w-32 h-32 sm:w-40 sm:h-40 rounded-full overflow-hidden border-2 border-indigo-500/30 bg-indigo-500/10 p-1">
                                        <div className="relative w-full h-full rounded-full overflow-hidden">
                                            <Image
                                                src="/image/angel-cruz.png"
                                                alt="Angel Cruz"
                                                fill
                                                className="object-cover"
                                                priority
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Content Section */}
                            <div className="flex-1 space-y-6 text-center lg:text-left">
                                <div>
                                    <h3 className="text-2xl sm:text-3xl font-bold text-white mb-3">
                                        Angel Cruz
                                    </h3>
                                    <p className="text-lg sm:text-xl text-indigo-400 mb-4 font-medium">
                                        Experienced in PHP, Laravel, Javascript
                                        & API Development Solutions.
                                    </p>
                                    <p className="text-base sm:text-lg text-zinc-400 leading-relaxed mb-4">
                                        I transform complex concepts into fluid,
                                        scalable, and visually impactful digital
                                        experiences. Beyond syntax, I focus on
                                        creating architectures that last.
                                    </p>
                                    <p className="text-sm sm:text-base text-zinc-500 leading-relaxed">
                                        My philosophy is based on writing clean
                                        code, rigorous testing, and never
                                        stopping learning. From monolithic
                                        Laravel applications to Next.js
                                        microfrontends, I always seek the right
                                        tool for the right problem.
                                    </p>
                                </div>

                                {/* Stats/Highlights */}
                                <div className="grid grid-cols-2 gap-4 pt-4">
                                    <div className="p-4 rounded-xl bg-indigo-500/5 border border-indigo-500/10">
                                        <div className="text-2xl font-bold text-indigo-400 mb-1">
                                            20+
                                        </div>
                                        <div className="text-xs text-zinc-500 uppercase tracking-wide">
                                            Open Source Repos
                                        </div>
                                    </div>
                                    <div className="p-4 rounded-xl bg-emerald-500/5 border border-emerald-500/10">
                                        <div className="text-2xl font-bold text-emerald-400 mb-1">
                                            Laravel
                                        </div>
                                        <div className="text-xs text-zinc-500 uppercase tracking-wide">
                                            & Next.js Expert
                                        </div>
                                    </div>
                                </div>

                                {/* Links */}
                                <div className="flex flex-col sm:flex-row gap-4 pt-4">
                                    <a
                                        href="https://www.angelcruz.dev/?utm_source=cloudsaver&utm_medium=website&utm_campaign=about_me&utm_content=blog_link"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="group/link inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 hover:bg-indigo-500/20 hover:border-indigo-500/30 transition-all duration-300 hover:-translate-y-0.5 text-sm font-medium"
                                    >
                                        <ExternalLink className="w-4 h-4 group-hover/link:translate-x-0.5 transition-transform" />
                                        Visit My Blog
                                    </a>
                                    <a
                                        href="https://github.com/abr4xas"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="group/link inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-white/5 border border-white/10 text-zinc-300 hover:bg-white/10 hover:border-white/20 transition-all duration-300 hover:-translate-y-0.5 text-sm font-medium"
                                    >
                                        <Github className="w-4 h-4 group-hover/link:scale-110 transition-transform" />
                                        GitHub Profile
                                    </a>
                                </div>
                            </div>
                        </div>
                    </div>
                </Card>
            </div>
        </section>
    );
}
