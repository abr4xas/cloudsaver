import { Metadata } from "next";
import { Footer } from "@/components/footer";
import { Navbar } from "@/components/navbar";
import { getSiteUrl } from "@/lib/env";

const siteUrl = getSiteUrl();

export const metadata: Metadata = {
  title: "Terms of Service",
  description:
    "Terms of Service for CloudSaver - Free DigitalOcean cost optimization tool. Learn about our service terms, API token usage, and liability limitations.",
  openGraph: {
    title: "Terms of Service - CloudSaver",
    description:
      "Terms of Service for CloudSaver - Free DigitalOcean cost optimization tool.",
    url: `${siteUrl}/terms`,
    type: "website",
  },
  twitter: {
    card: "summary",
    title: "Terms of Service - CloudSaver",
    description:
      "Terms of Service for CloudSaver - Free DigitalOcean cost optimization tool.",
  },
  alternates: {
    canonical: "/terms",
  },
};

export default function TermsPage() {
  return (
    <div className="relative min-h-screen grain-texture">
      <div className="mesh-gradient" />
      <Navbar />
      <div className="relative z-10 pt-16">
        <div className="max-w-4xl mx-auto px-4 py-20">
          <h1 className="text-4xl font-bold text-white mb-8">Terms of Service</h1>

          <div className="prose prose-invert max-w-none space-y-6 text-zinc-400">
            <p className="text-sm text-zinc-500">Last updated: {new Date().toLocaleDateString()}</p>

            <section>
              <h2 className="text-2xl font-semibold text-white mt-8 mb-4">1. Acceptance of Terms</h2>
              <p>
                By using CloudSaver, you agree to be bound by these Terms of Service. If you
                do not agree to these terms, please do not use our service.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-white mt-8 mb-4">2. Description of Service</h2>
              <p>
                CloudSaver is a completely free service that analyzes your DigitalOcean infrastructure
                to identify potential cost savings. We do not store any data, including your API tokens
                or analysis results. The service is provided "as is" without warranties of any kind.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-white mt-8 mb-4">3. Use of API Tokens</h2>
              <p>
                You are responsible for the security of your DigitalOcean API tokens. We recommend
                using read-only tokens with minimal permissions. CloudSaver processes your token
                securely and discards it immediately after analysis. Your token is never stored,
                logged, or retained in any form.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-white mt-8 mb-4">4. No Account Required</h2>
              <p>
                CloudSaver does not require you to create an account or provide any personal information.
                The service is completely free and can be used anonymously. Simply provide your
                DigitalOcean API token to receive your analysis results.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-white mt-8 mb-4">5. Limitation of Liability</h2>
              <p>
                CloudSaver is provided for informational purposes only. We are not responsible
                for any decisions made based on the analysis results. You are solely responsible
                for any changes made to your DigitalOcean infrastructure.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-white mt-8 mb-4">6. Prohibited Uses</h2>
              <p>
                You may not use CloudSaver for any unlawful purpose or to violate any laws.
                You may not attempt to gain unauthorized access to our systems or interfere
                with the service's operation.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-white mt-8 mb-4">7. Changes to Terms</h2>
              <p>
                We reserve the right to modify these terms at any time. Continued use of the
                service after changes constitutes acceptance of the new terms.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-white mt-8 mb-4">8. Contact</h2>
              <p>
                If you have questions about these Terms of Service, please contact us through
                our support channels.
              </p>
            </section>
          </div>
        </div>
        <Footer />
      </div>
    </div>
  );
}
