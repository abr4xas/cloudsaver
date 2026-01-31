"use client";

import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { ExternalLink } from "lucide-react";

interface TokenInstructionsDialogProps {
    children: React.ReactNode;
}

export function TokenInstructionsDialog({
    children,
}: TokenInstructionsDialogProps) {
    return (
        <Dialog>
            <DialogTrigger asChild>{children}</DialogTrigger>
            <DialogContent className="bg-zinc-950 border-zinc-800 p-0 overflow-hidden max-w-[95vw] sm:max-w-105 shadow-2xl mx-4 sm:mx-auto md:rounded-xl">
                {/* Swipe indicator for mobile */}
                <div className="swipe-indicator md:hidden" />
                <div className="p-6 border-b border-white/5 bg-zinc-900/50">
                    <DialogTitle className="text-lg font-medium text-white">
                        Generate Access Token
                    </DialogTitle>
                    <DialogDescription className="text-zinc-500 mt-1">
                        Follow these steps to get your read-only token.
                    </DialogDescription>
                </div>
                <div className="p-6 space-y-6">
                    {/* Primary Action - Direct Link */}
                    <div className="space-y-3">
                        <a
                            href="https://cloud.digitalocean.com/account/api/tokens"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center justify-center gap-2 w-full px-6 py-4 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold rounded-lg transition-all duration-200 hover:shadow-lg hover:shadow-indigo-500/25 group"
                        >
                            Open DigitalOcean API Settings
                            <ExternalLink
                                className="w-4 h-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform"
                                aria-hidden="true"
                            />
                        </a>
                        <p className="text-xs text-zinc-500 text-center">
                            This will open DigitalOcean in a new tab
                        </p>
                    </div>

                    {/* Divider */}
                    <div className="relative">
                        <div className="absolute inset-0 flex items-center">
                            <div className="w-full border-t border-white/10"></div>
                        </div>
                        <div className="relative flex justify-center text-xs">
                            <span className="px-2 bg-zinc-950 text-zinc-500">
                                Then follow these steps
                            </span>
                        </div>
                    </div>

                    <div className="space-y-4 text-sm text-zinc-400">
                        <div className="flex gap-3 items-start">
                            <div className="flex-none w-6 h-6 rounded bg-zinc-900 border border-white/10 flex items-center justify-center text-xs font-mono text-white mt-0.5">
                                1
                            </div>
                            <p className="flex-1 pt-0.5">
                                Click{" "}
                                <span className="text-white font-medium">
                                    Generate New Token
                                </span>
                            </p>
                        </div>
                        <div className="flex gap-3 items-start">
                            <div className="flex-none w-6 h-6 rounded bg-zinc-900 border border-white/10 flex items-center justify-center text-xs font-mono text-white mt-0.5">
                                2
                            </div>
                            <p className="flex-1 pt-0.5">
                                Set a name and expiration, then select{" "}
                                <span className="font-mono text-emerald-400 font-medium">
                                    Read Only
                                </span>{" "}
                                scope
                            </p>
                        </div>
                        <div className="flex gap-3 items-start">
                            <div className="flex-none w-6 h-6 rounded bg-zinc-900 border border-white/10 flex items-center justify-center text-xs font-mono text-white mt-0.5">
                                3
                            </div>
                            <p className="flex-1 pt-0.5">
                                Copy the generated token and paste it above
                            </p>
                        </div>

                        {/* Security Note */}
                        <div className="mt-6 p-3 bg-emerald-500/5 border border-emerald-500/20 rounded-lg">
                            <p className="text-xs text-emerald-400/80">
                                <span className="font-medium">Important:</span>{" "}
                                Make sure to select &quot;Read Only&quot; scope. This
                                ensures we can only view your resources, never modify
                                them.
                            </p>
                        </div>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
}
