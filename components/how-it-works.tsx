import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion";
import { FileKey, Cog, PiggyBank, ArrowRight } from "lucide-react";

export function HowItWorks() {
    const steps = [
        {
            id: "item-1",
            number: "01",
            title: "Paste Read-Only Token",
            description:
                "Generate a read-only API token from your DigitalOcean dashboard. This ensures we can only view your resources—we can never modify, delete, or create anything in your account.",
            icon: FileKey,
        },
        {
            id: "item-2",
            number: "02",
            title: "Instant Analysis",
            description:
                "We automatically analyze all your resources across all DigitalOcean regions—droplets, databases, volumes, snapshots, load balancers, IPs, and more. Your token is used once and immediately discarded. No storage, no logs—just comprehensive analysis and results in 30 seconds or less.",
            icon: Cog,
        },
        {
            id: "item-3",
            number: "03",
            title: "Review Results",
            description:
                "Get a complete report with recommendations for all 10 optimization types. Each recommendation includes a confidence level (High/Medium/Low), specific savings potential, and actionable steps. You decide what to implement. If your infrastructure is already optimized, you'll see a clean bill of health.",
            icon: PiggyBank,
        },
    ];

    return (
        <section
            id="how-it-works"
            className="py-20 sm:py-32 px-4 sm:px-6 relative overflow-hidden"
        >
            <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 sm:gap-16 items-start">
                {/* Left Column: Sticky Header */}
                <div className="lg:sticky lg:top-32 space-y-6 sm:space-y-8 px-4 lg:px-0">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-xs font-mono tracking-wider uppercase">
                        <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 animate-pulse" />
                        Process
                    </div>
                    <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-medium tracking-tight text-white leading-[1.1]">
                        How It <br />
                        <span className="text-zinc-500">Works</span>
                    </h2>
                    <p className="text-lg sm:text-xl text-zinc-400 max-w-md font-light leading-relaxed">
                        A simple three-step process to get actionable recommendations for optimizing your DigitalOcean infrastructure. Get results in 30 seconds or less.
                    </p>
                </div>

                {/* Right Column: Accordion */}
                <div className="w-full px-4 lg:px-0">
                    <Accordion
                        type="single"
                        collapsible
                        defaultValue="item-1"
                        className="w-full space-y-3 sm:space-y-4"
                    >
                        {steps.map((step) => (
                            <AccordionItem
                                key={step.id}
                                value={step.id}
                                className="border border-white/5 bg-white/2 rounded-lg px-4 sm:px-6 transition-all data-[state=open]:border-indigo-500/20 data-[state=open]:bg-indigo-500/3"
                            >
                                <AccordionTrigger className="hover:no-underline py-4 sm:py-6 group">
                                    <div className="flex items-center gap-4 sm:gap-6 text-left">
                                        <span className="text-xs font-mono text-zinc-600 group-data-[state=open]:text-indigo-500 transition-colors">
                                            {step.number}
                                        </span>
                                        <span className="text-lg sm:text-xl font-medium text-zinc-200 group-hover:text-white transition-colors">
                                            {step.title}
                                        </span>
                                    </div>
                                </AccordionTrigger>
                                <AccordionContent className="pb-4 sm:pb-6 pl-0 sm:pl-13">
                                    <p className="text-sm sm:text-base text-zinc-400 leading-relaxed mb-4 sm:mb-6">
                                        {step.description}
                                    </p>
                                    <div className="flex items-center gap-2 text-sm font-medium text-indigo-400 opacity-0 animate-fade-in group-data-[state=open]:opacity-100 transition-opacity">
                                        Learn more{" "}
                                        <ArrowRight className="w-4 h-4" />
                                    </div>
                                </AccordionContent>
                            </AccordionItem>
                        ))}
                    </Accordion>
                </div>
            </div>
        </section>
    );
}
