import { Metadata } from "next";
import { Footer } from "@/components/footer";
import { Navbar } from "@/components/navbar";
import { getSiteUrl } from "@/lib/env";

const siteUrl = getSiteUrl();

export const metadata: Metadata = {
  title: "Cookie Policy",
  description:
    "Cookie Policy for CloudSaver - Learn about how we use cookies for analytics and website functionality. We don't use cookies to track personal information.",
  openGraph: {
    title: "Cookie Policy - CloudSaver",
    description:
      "Cookie Policy for CloudSaver - Learn about how we use cookies for analytics and website functionality.",
    url: `${siteUrl}/cookie-policy`,
    type: "website",
  },
  twitter: {
    card: "summary",
    title: "Cookie Policy - CloudSaver",
    description:
      "Cookie Policy for CloudSaver - Learn about how we use cookies for analytics and website functionality.",
  },
  alternates: {
    canonical: "/cookie-policy",
  },
};

export default function CookiePolicyPage() {
  return (
    <div className="relative min-h-screen grain-texture">
      <div className="mesh-gradient" />
      <Navbar />
      <div className="relative z-10 pt-16">
        <div className="max-w-4xl mx-auto px-4 py-20">
          <h1 className="text-4xl font-bold text-white mb-8">Cookie Policy</h1>

          <div className="prose prose-invert max-w-none space-y-6 text-zinc-400">
            <p className="text-sm text-zinc-500">Last updated: {new Date().toLocaleDateString()}</p>

            <section>
              <h2 className="text-2xl font-semibold text-white mt-8 mb-4">1. What Are Cookies</h2>
              <p>
                Cookies are small text files that are placed on your device when you visit a website.
                They are widely used to make websites work more efficiently and provide information
                to website owners.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-white mt-8 mb-4">2. How We Use Cookies</h2>
              <p>
                CloudSaver uses cookies primarily for analytics purposes to understand how our service
                is used and to improve user experience. We do not use cookies to track your personal
                information or API tokens.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-white mt-8 mb-4">3. Types of Cookies We Use</h2>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>
                  <strong className="text-white">Analytics Cookies:</strong> These help us understand
                  how visitors interact with our website by collecting and reporting information anonymously.
                </li>
                <li>
                  <strong className="text-white">Functional Cookies:</strong> These enable enhanced
                  functionality and personalization, such as remembering your preferences.
                </li>
              </ul>
              <p className="mt-3">
                We do not use authentication cookies, preference cookies, or security cookies since
                CloudSaver does not require user accounts or login sessions.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-white mt-8 mb-4">4. Third-Party Cookies</h2>
              <p>
                We may use third-party analytics services that set their own cookies. These services
                help us analyze website traffic and usage patterns. We do not control these third-party
                cookies.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-white mt-8 mb-4">5. Managing Cookies</h2>
              <p>
                You can control and manage cookies through your browser settings. Most browsers allow
                you to refuse or delete cookies. However, disabling cookies may affect the functionality
                of our service.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-white mt-8 mb-4">6. Changes to This Policy</h2>
              <p>
                We may update this Cookie Policy from time to time. We will notify you of any changes
                by posting the new Cookie Policy on this page.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-white mt-8 mb-4">7. Contact Us</h2>
              <p>
                If you have questions about our use of cookies, please contact us through our
                support channels.
              </p>
            </section>
          </div>
        </div>
        <Footer />
      </div>
    </div>
  );
}
