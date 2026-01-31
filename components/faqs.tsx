"use client";

import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion";
import { HelpCircle } from "lucide-react";

export function FAQs() {
    const faqs = [
        {
            id: "faq-1",
            question: "Is it safe to use CloudSaver?",
            answer:
                "Yes. CloudSaver only uses read-only API tokens, which means it cannot modify, delete, or create resources in your DigitalOcean account. Additionally, tokens are not stored permanently—they're used once and immediately discarded after analysis.",
        },
        {
            id: "faq-2",
            question: "How long does an analysis take?",
            answer:
                "Typically less than 30 seconds for accounts with up to 100 resources. The time may vary depending on the number of resources you have. CloudSaver analyzes historical metrics to generate more accurate recommendations.",
        },
        {
            id: "faq-3",
            question: "How much can I save?",
            answer:
                "It depends on your current infrastructure. Users typically find savings opportunities of 10-40% of their monthly cost. CloudSaver will show you exactly how much you can save after analyzing your account.",
        },
        {
            id: "faq-4",
            question: "Does CloudSaver modify my resources automatically?",
            answer:
                "No. CloudSaver only provides recommendations. You decide what to implement and when. CloudSaver provides you with the information and commands needed, but you have complete control.",
        },
        {
            id: "faq-5",
            question: "Do I need advanced technical knowledge?",
            answer:
                "No. CloudSaver is designed to be used by anyone who has a DigitalOcean account. Recommendations are clear and understandable, and if you need help with implementation, CloudSaver provides exact commands that you can copy and paste.",
        },
        {
            id: "faq-6",
            question: "Is CloudSaver really free?",
            answer:
                "Yes, CloudSaver is completely free. There are no hidden fees, no credit card required, and no subscription. You can analyze your DigitalOcean infrastructure as many times as you want at no cost.",
        },
        {
            id: "faq-7",
            question: "What if I don't agree with a recommendation?",
            answer:
                "No problem. CloudSaver provides recommendations based on automated analysis, but you decide what to implement. You can ignore any recommendation that you don't consider appropriate for your situation.",
        },
        {
            id: "faq-8",
            question: "Why do some recommendations have 'Low' confidence?",
            answer:
                "Recommendations with 'Low' confidence can occur when: real metrics are not available (monitoring not enabled in DigitalOcean), the analysis uses estimated data (as in the case of databases), or there's uncertainty about usage patterns. To get 'High' confidence recommendations, make sure you have monitoring enabled in DigitalOcean. This allows CloudSaver to analyze real usage metrics.",
        },
    ];

    return (
        <section
            id="faqs"
            className="py-20 sm:py-32 px-4 sm:px-6 relative overflow-hidden"
        >
            <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8 sm:gap-12 md:gap-16 items-start">
                {/* Left Column: Sticky Header */}
                <div className="md:sticky md:top-32 space-y-4 sm:space-y-6 md:space-y-8 px-4 md:px-0">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-mono tracking-wider uppercase">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                        Questions
                    </div>
                    <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-medium tracking-tight text-white leading-[1.1]">
                        Frequently <br />
                        <span className="text-zinc-500">Asked Questions</span>
                    </h2>
                    <p className="text-lg sm:text-xl text-zinc-400 max-w-md font-light leading-relaxed">
                        Common questions about safety, speed, savings, and what CloudSaver does—and doesn't do—with your account.
                    </p>
                </div>

                {/* Right Column: Accordion */}
                <div className="w-full px-4 lg:px-0">
                    <Accordion
                        type="single"
                        collapsible
                        className="w-full space-y-3 sm:space-y-4"
                    >
                        {faqs.map((faq) => (
                            <AccordionItem
                                key={faq.id}
                                value={faq.id}
                                className="border border-white/5 bg-white/2 rounded-lg px-4 sm:px-5 md:px-6 transition-all data-[state=open]:border-emerald-500/20 data-[state=open]:bg-emerald-500/3"
                            >
                                <AccordionTrigger className="hover:no-underline py-4 sm:py-6 group">
                                    <div className="flex items-start gap-4 sm:gap-6 text-left w-full">
                                        <div className="p-2 rounded-lg bg-emerald-500/10 border border-emerald-500/20 shrink-0 mt-0.5">
                                            <HelpCircle className="w-4 h-4 text-emerald-400" />
                                        </div>
                                        <span className="text-base sm:text-lg font-medium text-zinc-200 group-hover:text-white transition-colors flex-1">
                                            {faq.question}
                                        </span>
                                    </div>
                                </AccordionTrigger>
                                <AccordionContent className="pb-4 sm:pb-6 pl-0 sm:pl-12 md:pl-16">
                                    <p className="text-sm sm:text-base text-zinc-400 leading-relaxed">
                                        {faq.answer}
                                    </p>
                                </AccordionContent>
                            </AccordionItem>
                        ))}
                    </Accordion>
                </div>
            </div>
        </section>
    );
}
