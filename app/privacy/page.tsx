import { Metadata } from "next";
import { Footer } from "@/components/footer";
import { Navbar } from "@/components/navbar";
import { getSiteUrl } from "@/lib/env";
import { generateBreadcrumbSchema } from "@/lib/structured-data";

const siteUrl = getSiteUrl();

export const metadata: Metadata = {
  title: "Privacy Policy",
  description:
    "CloudSaver's Privacy Policy - Learn how we handle your data. We don't store your API tokens or analysis results. Privacy-first infrastructure analysis.",
  openGraph: {
    title: "Privacy Policy - CloudSaver",
    description:
      "CloudSaver's Privacy Policy - Learn how we handle your data. We don't store your API tokens or analysis results.",
    url: `${siteUrl}/privacy`,
    type: "website",
  },
  twitter: {
    card: "summary",
    title: "Privacy Policy - CloudSaver",
    description:
      "CloudSaver's Privacy Policy - Learn how we handle your data. We don't store your API tokens or analysis results.",
  },
  alternates: {
    canonical: "/privacy",
  },
};

export default function PrivacyPage() {
  const breadcrumbSchema = generateBreadcrumbSchema([
    { name: "Home", url: "/" },
    { name: "Privacy Policy", url: "/privacy" },
  ]);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(breadcrumbSchema),
        }}
      />
      <div className="relative min-h-screen grain-texture">
        <div className="mesh-gradient" />
        <Navbar />
        <div className="relative z-10 pt-16">
        <div className="max-w-4xl mx-auto px-4 py-20">
          <h1 className="text-4xl font-bold text-white mb-8">Privacy Policy</h1>

          <div className="prose prose-invert max-w-none space-y-6 text-zinc-400">
            <p className="text-sm text-zinc-500">Last updated: {new Date().toLocaleDateString()}</p>

            <section>
              <h2 className="text-2xl font-semibold text-white mt-8 mb-4">1. Information We Collect</h2>
              <p>
                CloudSaver is designed with privacy in mind. We process your DigitalOcean API token
                to analyze your infrastructure, but we do not store, log, or retain your token after
                analysis is complete. Your token is processed securely and immediately discarded.
                Analysis results are displayed to you and are not stored on our servers.
              </p>
              <p className="mt-3">
                We do not require you to create an account or provide any personal information to use
                the service. CloudSaver can be used completely anonymously.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-white mt-8 mb-4">2. How We Use Your Information</h2>
              <p>
                Your API token is used solely to fetch your DigitalOcean resources for analysis.
                The analysis results are displayed to you and are not stored on our servers. We do
                not use your information for any other purpose, and we do not share it with third parties.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-white mt-8 mb-4">3. Data Security</h2>
              <p>
                We use secure API processing to analyze your infrastructure. All data is transmitted
                over encrypted connections (HTTPS/TLS). Your token is never stored in our databases
                or logged in any form. Since we don't store any data, there's nothing to secure
                beyond the transmission itself.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-white mt-8 mb-4">4. Third-Party Services</h2>
              <p>
                We may use third-party analytics services to understand how our service is used.
                These services do not have access to your API tokens or analysis data.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-white mt-8 mb-4">5. Your Rights</h2>
              <p>
                Since we do not store your personal information or API tokens, there is no data to
                access, modify, or delete. Each analysis is independent and does not create a persistent
                record. You can use CloudSaver completely anonymously without providing any personal
                information.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-white mt-8 mb-4">6. Changes to This Policy</h2>
              <p>
                We may update this Privacy Policy from time to time. We will notify you of any
                changes by posting the new Privacy Policy on this page.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-white mt-8 mb-4">7. Contact Us</h2>
              <p>
                If you have any questions about this Privacy Policy, please contact us through
                our support channels.
              </p>
            </section>
          </div>
        </div>
        <Footer />
      </div>
    </div>
    </>
  );
}
