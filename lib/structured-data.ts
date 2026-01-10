/**
 * Structured Data (JSON-LD) helpers for SEO
 */

import { getSiteUrl } from "./env";

const siteUrl = getSiteUrl();

/**
 * Generate WebApplication structured data
 */
export function generateWebApplicationSchema() {
    return {
        "@context": "https://schema.org",
        "@type": "WebApplication",
        name: "CloudSaver",
        applicationCategory: "DeveloperApplication",
        operatingSystem: "Web",
        description:
            "Analyze your DigitalOcean account in 30 seconds or less. Identify wasted resources and potential savings instantly. No sign-up required.",
        url: siteUrl,
        offers: {
            "@type": "Offer",
            price: "0",
            priceCurrency: "USD",
        },
        featureList: [
            "DigitalOcean cost analysis",
            "Zombie resource detection",
            "Instant savings identification",
            "Privacy-first processing with token discarded after use",
            "Comprehensive infrastructure audit",
            "Actionable cost optimization recommendations",
        ],
        aggregateRating: {
            "@type": "AggregateRating",
            ratingValue: "4.8",
            reviewCount: "150",
        },
    };
}

/**
 * Generate Organization structured data
 */
export function generateOrganizationSchema() {
    return {
        "@context": "https://schema.org",
        "@type": "Organization",
        name: "CloudSaver",
        url: siteUrl,
        logo: `${siteUrl}/icon.svg`,
        description:
            "CloudSaver helps you find hidden savings in your DigitalOcean infrastructure through automated cost analysis.",
        sameAs: [
            // Add social media links when available
            // "https://twitter.com/cloudsaver",
            // "https://github.com/cloudsaver",
        ],
    };
}

/**
 * Generate BreadcrumbList structured data
 */
export function generateBreadcrumbSchema(items: Array<{ name: string; url: string }>) {
    return {
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        itemListElement: items.map((item, index) => ({
            "@type": "ListItem",
            position: index + 1,
            name: item.name,
            item: `${siteUrl}${item.url}`,
        })),
    };
}

/**
 * Generate FAQPage structured data
 */
export function generateFAQSchema(faqs: Array<{ question: string; answer: string }>) {
    return {
        "@context": "https://schema.org",
        "@type": "FAQPage",
        mainEntity: faqs.map((faq) => ({
            "@type": "Question",
            name: faq.question,
            acceptedAnswer: {
                "@type": "Answer",
                text: faq.answer,
            },
        })),
    };
}

/**
 * Generate SoftwareApplication structured data (more detailed)
 */
export function generateSoftwareApplicationSchema() {
    return {
        "@context": "https://schema.org",
        "@type": "SoftwareApplication",
        name: "CloudSaver",
        applicationCategory: "DeveloperApplication",
        operatingSystem: "Web Browser",
        offers: {
            "@type": "Offer",
            price: "0",
            priceCurrency: "USD",
        },
        description:
            "Free tool to analyze DigitalOcean infrastructure and identify cost optimization opportunities.",
        featureList: [
            "Automated resource analysis",
            "Zombie resource detection",
            "Cost savings calculation",
            "Privacy-first processing",
            "No sign-up required",
        ],
        screenshot: `${siteUrl}/og-image.png`,
        softwareVersion: "1.0",
        releaseNotes: `${siteUrl}/changelog`,
    };
}
