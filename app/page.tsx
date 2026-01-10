import dynamic from "next/dynamic";
import { Suspense } from "react";
import type { Metadata } from "next";
import { Navbar } from "@/components/navbar";
import { Hero } from "@/components/hero";
import { CurrentState } from "@/components/current-state";
import { FutureState } from "@/components/future-state";
import { HowItWorks } from "@/components/how-it-works";
import { TokenInputSkeleton } from "@/components/token-input-skeleton";
import { ResultsSkeleton } from "@/components/results-skeleton";
import { FAQs } from "@/components/faqs";
import {
    generateWebApplicationSchema,
    generateOrganizationSchema,
    generateSoftwareApplicationSchema,
    generateFAQSchema,
} from "@/lib/structured-data";
import { getSiteUrl } from "@/lib/env";

// Lazy load components that are not critical for initial render
const TokenInput = dynamic(
    () => import("@/components/token-input").then((mod) => ({ default: mod.TokenInput })),
    {
        loading: () => <TokenInputSkeleton />,
    }
);

const Results = dynamic(
    () => import("@/components/results").then((mod) => ({ default: mod.Results })),
    {
        loading: () => <ResultsSkeleton />,
    }
);

const Features = dynamic(
    () => import("@/components/features").then((mod) => ({ default: mod.Features })),
    {
        loading: () => (
            <section className="py-32 px-4">
                <div className="max-w-7xl mx-auto space-y-20">
                    <div className="h-16 w-3/4 mx-auto bg-zinc-800 rounded-xl animate-pulse" />
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                        {[1, 2, 3, 4, 5].map((i) => (
                            <div
                                key={i}
                                className="h-64 bg-zinc-800 rounded-2xl animate-pulse"
                            />
                        ))}
                    </div>
                </div>
            </section>
        ),
    }
);

const CtaSection = dynamic(
    () => import("@/components/cta-section").then((mod) => ({ default: mod.CtaSection })),
    {
        loading: () => (
            <section className="py-32 px-4">
                <div className="max-w-xl mx-auto space-y-6">
                    <div className="h-12 w-3/4 mx-auto bg-zinc-800 rounded-xl animate-pulse" />
                    <div className="h-14 w-full bg-zinc-800 rounded-xl animate-pulse" />
                </div>
            </section>
        ),
    }
);

// Lazy load Footer as it's not critical for initial render
const Footer = dynamic(
    () => import("@/components/footer").then((mod) => ({ default: mod.Footer })),
    {
        ssr: true, // Keep SSR for SEO
    }
);

// Page metadata
export const metadata: Metadata = {
    title: "Find Hidden Savings in Your DigitalOcean Infrastructure",
    description:
        "Analyze your DigitalOcean account in 30 seconds or less. Identify wasted resources and potential savings instantly. No sign-up required. Privacy-first processing.",
    keywords: [
        "DigitalOcean",
        "cloud cost optimization",
        "infrastructure analysis",
        "cost savings",
        "zombie resources",
        "cloud waste",
    ],
    openGraph: {
        title: "CloudSaver - Find Hidden Savings in Your DigitalOcean Infrastructure",
        description:
            "Analyze your DigitalOcean account in 30 seconds. Identify wasted resources and potential savings instantly.",
        type: "website",
    },
    twitter: {
        card: "summary_large_image",
        title: "CloudSaver - Find Hidden Savings in Your DigitalOcean Infrastructure",
        description:
            "Analyze your DigitalOcean account in 30 seconds. Identify wasted resources and potential savings instantly.",
    },
};

export default function Page() {
    const siteUrl = getSiteUrl();

    // FAQ data for structured data
    const faqs = [
        {
            question: "Is it safe to use CloudSaver?",
            answer:
                "Yes. CloudSaver only uses read-only API tokens, which means it cannot modify, delete, or create resources in your DigitalOcean account. Additionally, tokens are not stored permanently—they're used once and immediately discarded after analysis.",
        },
        {
            question: "How long does an analysis take?",
            answer:
                "Typically less than 30 seconds for accounts with up to 100 resources. The time may vary depending on the number of resources you have. CloudSaver analyzes historical metrics to generate more accurate recommendations.",
        },
        {
            question: "How much can I save?",
            answer:
                "It depends on your current infrastructure. Users typically find savings opportunities of 10-40% of their monthly cost. CloudSaver will show you exactly how much you can save after analyzing your account.",
        },
        {
            question: "Does CloudSaver modify my resources automatically?",
            answer:
                "No. CloudSaver only provides recommendations. You decide what to implement and when. CloudSaver provides you with the information and commands needed, but you have complete control.",
        },
        {
            question: "Do I need advanced technical knowledge?",
            answer:
                "No. CloudSaver is designed to be used by anyone who has a DigitalOcean account. Recommendations are clear and understandable, and if you need help with implementation, CloudSaver provides exact commands that you can copy and paste.",
        },
        {
            question: "Is CloudSaver really free?",
            answer:
                "Yes, CloudSaver is completely free. There are no hidden fees, no credit card required, and no subscription. You can analyze your DigitalOcean infrastructure as many times as you want at no cost.",
        },
    ];

    // Generate structured data
    const webAppSchema = generateWebApplicationSchema();
    const organizationSchema = generateOrganizationSchema();
    const softwareAppSchema = generateSoftwareApplicationSchema();
    const faqSchema = generateFAQSchema(faqs);

    return (
        <>
            {/* Structured Data for SEO */}
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{
                    __html: JSON.stringify(webAppSchema),
                }}
            />
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{
                    __html: JSON.stringify(organizationSchema),
                }}
            />
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{
                    __html: JSON.stringify(softwareAppSchema),
                }}
            />
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{
                    __html: JSON.stringify(faqSchema),
                }}
            />
            <div className="relative min-h-screen grain-texture">
                <div className="mesh-gradient" />
                <Navbar />
                <div className="relative z-10 pt-16">
                    {/* 1. Hero Promise - What we're going to change */}
                    <Hero />

                    {/* 2. Current Plan - Where they are now */}
                    <CurrentState />

                    {/* 3. Future State - Where they could be */}
                    <FutureState />

                    {/* 4. How It Works - Bridge */}
                    <HowItWorks />

                    {/* Interactive Token Input */}
                    <Suspense fallback={<TokenInputSkeleton />}>
                        <TokenInput />
                    </Suspense>

                    {/* Features and Stats */}
                    <Suspense
                        fallback={
                            <section className="py-32 px-4">
                                <div className="max-w-7xl mx-auto space-y-20">
                                    <div className="h-16 w-3/4 mx-auto bg-zinc-800 rounded-xl animate-pulse" />
                                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                                        {[1, 2, 3, 4, 5].map((i) => (
                                            <div
                                                key={i}
                                                className="h-64 bg-zinc-800 rounded-2xl animate-pulse"
                                            />
                                        ))}
                                    </div>
                                </div>
                            </section>
                        }
                    >
                        <Features />
                    </Suspense>

                    {/* FAQs Section */}
                    <FAQs />

                    {/* 5. Clear CTA - What happens next */}
                    {/* <Suspense
                        fallback={
                            <section className="py-32 px-4">
                                <div className="max-w-xl mx-auto space-y-6">
                                    <div className="h-12 w-3/4 mx-auto bg-zinc-800 rounded-xl animate-pulse" />
                                    <div className="h-14 w-full bg-zinc-800 rounded-xl animate-pulse" />
                                </div>
                            </section>
                        }
                    >
                        <CtaSection />
                    </Suspense> */}
                    <Footer />
                </div>
            </div>
        </>
    );
}
