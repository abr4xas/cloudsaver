import { Github, Disc } from "lucide-react";

export function Footer() {
    return (
        <footer className="bg-black pt-16 sm:pt-20 pb-8 sm:pb-10 -mt-px relative z-10">
            <div className="max-w-7xl mx-auto px-4 sm:px-6">
                {/* Top Grid: Columns */}
                <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-8 sm:gap-10 mb-12 sm:mb-20">
                    {/* Column 1: Brand (Span 2) */}
                    <div className="col-span-2 lg:col-span-2 space-y-4 sm:space-y-6">
                        <div className="flex items-center gap-2">
                            <div className="w-8 h-8 rounded-lg bg-indigo-500/20 flex items-center justify-center border border-indigo-500/30">
                                <Disc className="w-4 h-4 text-indigo-400 animate-spin-slow" />
                            </div>
                            <span className="text-lg sm:text-xl font-bold bg-clip-text text-transparent bg-linear-to-r from-white to-zinc-400">
                                CloudSaver
                            </span>
                        </div>
                        <p className="text-zinc-500 text-xs sm:text-sm leading-relaxed max-w-xs">
                            Free tool to find savings in your DigitalOcean account. Read-only access, no storage, report in under 30 seconds.
                        </p>
                        <div className="flex gap-4">
                            <a
                                href="https://github.com/abr4xas/cloudsaver"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-zinc-500 hover:text-white transition-colors"
                            >
                                <Github className="w-5 h-5" />
                            </a>
                        </div>
                    </div>

                    {/* Column 2: Product */}
                    <div className="space-y-4">
                        <h4 className="text-sm font-semibold text-white tracking-wide">
                            Product
                        </h4>
                        <ul className="space-y-3 text-sm text-zinc-500">
                            <li>
                                <a
                                    href="#current-state"
                                    className="hover:text-indigo-400 transition-colors"
                                >
                                    Current State
                                </a>
                            </li>
                            <li>
                                <a
                                    href="#future-state"
                                    className="hover:text-indigo-400 transition-colors"
                                >
                                    Future State
                                </a>
                            </li>
                            <li>
                                <a
                                    href="#how-it-works"
                                    className="hover:text-indigo-400 transition-colors"
                                >
                                    How It Works
                                </a>
                            </li>
                            <li>
                                <a
                                    href="#features"
                                    className="hover:text-indigo-400 transition-colors"
                                >
                                    Features
                                </a>
                            </li>
                        </ul>
                    </div>

                    {/* Column 4: Legal */}
                    <div className="space-y-4">
                        <h4 className="text-sm font-semibold text-white tracking-wide">
                            Legal
                        </h4>
                        <ul className="space-y-3 text-sm text-zinc-500">
                            <li>
                                <a
                                    href="/privacy"
                                    className="hover:text-indigo-400 transition-colors"
                                >
                                    Privacy
                                </a>
                            </li>
                            <li>
                                <a
                                    href="/terms"
                                    className="hover:text-indigo-400 transition-colors"
                                >
                                    Terms
                                </a>
                            </li>
                        </ul>
                    </div>
                </div>

                {/* Bottom Bar */}
                <div className="pt-8 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-6">
                    <p className="text-xs text-zinc-600">
                        © 2026 CloudSaver Inc. All rights reserved.
                    </p>

                    <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-zinc-900 border border-zinc-800">
                        <span className="relative flex h-2 w-2">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                        </span>
                        <span className="text-xs font-mono text-zinc-400">
                            All Systems Operational
                        </span>
                    </div>
                </div>
            </div>
        </footer>
    );
}
