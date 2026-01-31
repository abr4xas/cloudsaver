"use client";

import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

export function CtaSection() {
    const scrollToAnalysis = () => {
        const input = document.querySelector('#token-input');
        input?.scrollIntoView({ behavior: 'smooth', block: 'center' });
    };

    return (
        <section className="py-16 sm:py-20 px-4 sm:px-6">
            <div className="max-w-4xl mx-auto text-center space-y-8">
                <div className="space-y-4">
                    <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white">
                        See Where You're Overpaying
                    </h2>
                    <p className="text-lg sm:text-xl text-zinc-400 max-w-2xl mx-auto">
                        Free analysis in under 30 seconds. No sign-up, no credit card.
                    </p>
                </div>

                <Button
                    onClick={scrollToAnalysis}
                    size="lg"
                    className="bg-indigo-600 hover:bg-indigo-500 text-white font-semibold px-8 py-6 h-auto text-lg rounded-full shadow-lg hover:shadow-xl transition-all hover:-translate-y-0.5 group"
                >
                    Start Free Analysis
                    <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                </Button>
            </div>
        </section>
    );
}
