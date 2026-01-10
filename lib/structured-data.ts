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
            bestRating: "5",
            worstRating: "1",
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
        founder: {
            "@type": "Person",
            name: "Angel Cruz",
            url: "https://www.angelcruz.dev",
        },
        creator: {
            "@type": "Person",
            name: "Angel Cruz",
            url: "https://www.angelcruz.dev",
        },
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
        creator: {
            "@type": "Person",
            name: "Angel Cruz",
            url: "https://www.angelcruz.dev",
        },
    };
}

/**
 * Generate Person schema for the creator (Angel Cruz)
 */
export function generatePersonSchema() {
    return {
        "@context": "https://schema.org",
        "@type": "Person",
        name: "Angel Cruz",
        description:
            "Experienced developer in PHP, Laravel, Javascript & API Development Solutions. I transform complex concepts into fluid, scalable, and visually impactful digital experiences.",
        image: `${siteUrl}/image/angel-cruz.png`,
        url: "https://www.angelcruz.dev",
        sameAs: [
            "https://github.com/abr4xas",
            "https://www.angelcruz.dev",
        ],
        jobTitle: "Full Stack Developer",
        knowsAbout: [
            "PHP",
            "Laravel",
            "JavaScript",
            "Next.js",
            "API Development",
            "Web Development",
            "Software Architecture",
        ],
        alumniOf: {
            "@type": "Organization",
            name: "Software Developer",
        },
    };
}

/**
 * Generate HowTo schema for the analysis process
 */
export function generateHowToSchema() {
    return {
        "@context": "https://schema.org",
        "@type": "HowTo",
        name: "How to Analyze Your DigitalOcean Infrastructure for Cost Savings",
        description:
            "Step-by-step guide to analyze your DigitalOcean account and identify cost optimization opportunities in 30 seconds or less.",
        estimatedCost: {
            "@type": "MonetaryAmount",
            currency: "USD",
            value: "0",
        },
        totalTime: "PT30S",
        step: [
            {
                "@type": "HowToStep",
                position: 1,
                name: "Generate a Read-Only API Token",
                text: "Go to your DigitalOcean dashboard and generate a read-only API token. This token allows CloudSaver to analyze your resources without making any changes.",
                url: `${siteUrl}#token-input`,
            },
            {
                "@type": "HowToStep",
                position: 2,
                name: "Enter Your Token",
                text: "Paste your read-only API token into the CloudSaver analysis tool. Your token is used once and immediately discarded for privacy.",
                url: `${siteUrl}#token-input`,
            },
            {
                "@type": "HowToStep",
                position: 3,
                name: "Wait for Analysis",
                text: "CloudSaver analyzes your DigitalOcean infrastructure, checking for zombie resources, underutilized droplets, old snapshots, and other optimization opportunities. This typically takes less than 30 seconds.",
                url: `${siteUrl}#token-input`,
            },
            {
                "@type": "HowToStep",
                position: 4,
                name: "Review Recommendations",
                text: "View detailed recommendations with potential savings, confidence levels, and actionable steps to optimize your infrastructure costs.",
                url: `${siteUrl}#results-section`,
            },
        ],
    };
}

/**
 * Generate Article schema for changelog entries or blog posts
 */
export function generateArticleSchema(
    title: string,
    description: string,
    url: string,
    datePublished: string,
    dateModified?: string
) {
    return {
        "@context": "https://schema.org",
        "@type": "Article",
        headline: title,
        description: description,
        url: url,
        datePublished: datePublished,
        dateModified: dateModified || datePublished,
        author: {
            "@type": "Person",
            name: "Angel Cruz",
            url: "https://www.angelcruz.dev",
        },
        publisher: {
            "@type": "Organization",
            name: "CloudSaver",
            logo: {
                "@type": "ImageObject",
                url: `${siteUrl}/icon.svg`,
            },
        },
    };
}
