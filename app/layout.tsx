import type React from "react"
import type { Metadata } from "next"
import { Space_Grotesk, JetBrains_Mono } from "next/font/google"
import { Analytics } from "@vercel/analytics/next"
import { ErrorBoundary } from "@/components/error-boundary"
import { getSiteUrl } from "@/lib/env"
import "./globals.css"
import "../styles/animations.css"

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-space-grotesk",
  display: "swap",
  preload: true,
})

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-jetbrains-mono",
  display: "swap",
  preload: false,
})

const siteUrl = getSiteUrl()

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "CloudSaver - Find Hidden Savings in Your DigitalOcean Infrastructure",
    template: "%s | CloudSaver",
  },
  description:
    "Get a comprehensive one-time analysis of your DigitalOcean infrastructure. Automatically identify optimization opportunities across all 10 types of resources. Discover opportunities to reduce costs with actionable insights.",
  keywords: [
    "DigitalOcean",
    "cloud cost optimization",
    "infrastructure analysis",
    "cost savings",
    "cloud infrastructure",
    "droplet optimization",
    "zombie resources",
    "cloud waste",
    "infrastructure audit",
  ],
  authors: [{ name: "CloudSaver" }],
  creator: "CloudSaver",
  publisher: "CloudSaver",
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: siteUrl,
    siteName: "CloudSaver",
    title: "CloudSaver - Find Hidden Savings in Your DigitalOcean Infrastructure",
    description:
      "Get a comprehensive one-time analysis of your DigitalOcean infrastructure. Automatically identify optimization opportunities and discover ways to reduce costs.",
    images: [
      {
        url: `${siteUrl}/og-image.png`,
        width: 1200,
        height: 630,
        alt: "CloudSaver - DigitalOcean Cost Optimization",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "CloudSaver - Find Hidden Savings in Your DigitalOcean Infrastructure",
    description:
      "Get a comprehensive one-time analysis of your DigitalOcean infrastructure. Automatically identify optimization opportunities and discover ways to reduce costs.",
    images: [`${siteUrl}/twitter-card.png`],
    creator: "@cloudsaver",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  icons: {
    icon: [
      {
        url: "/icon-light-32x32.png",
        media: "(prefers-color-scheme: light)",
      },
      {
        url: "/icon-dark-32x32.png",
        media: "(prefers-color-scheme: dark)",
      },
      {
        url: "/icon.svg",
        type: "image/svg+xml",
      },
    ],
    apple: "/apple-icon.png",
  },
  verification: {
    // Add Google Search Console verification if needed
    // google: "your-verification-code",
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className="dark" style={{ scrollBehavior: "smooth" }}>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      </head>
      <body className={`${spaceGrotesk.variable} ${jetbrainsMono.variable} font-sans antialiased`}>
        <ErrorBoundary>
          {children}
        </ErrorBoundary>
        <Analytics />
      </body>
    </html>
  )
}
