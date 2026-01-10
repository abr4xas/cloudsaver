import { Metadata } from "next";
import { Footer } from "@/components/footer";
import { Navbar } from "@/components/navbar";
import { Badge } from "@/components/ui/badge";
import { Calendar, Sparkles, Zap, Shield } from "lucide-react";
import { getSiteUrl } from "@/lib/env";

const siteUrl = getSiteUrl();

export const metadata: Metadata = {
  title: "Changelog",
  description:
    "Latest updates and improvements to CloudSaver. Track new features, analysis types, and optimizations for DigitalOcean infrastructure cost reduction.",
  openGraph: {
    title: "Changelog - CloudSaver",
    description:
      "Latest updates and improvements to CloudSaver. Track new features and optimizations.",
    url: `${siteUrl}/changelog`,
    type: "website",
  },
  twitter: {
    card: "summary",
    title: "Changelog - CloudSaver",
    description:
      "Latest updates and improvements to CloudSaver. Track new features and optimizations.",
  },
  alternates: {
    canonical: "/changelog",
  },
};

const changelogEntries = [
  {
    version: "v0.0.1",
    date: "January 2026",
    type: "current",
    icon: Zap,
    changes: [
      {
        category: "Initial Release",
        items: [
          "Comprehensive one-time analysis of DigitalOcean infrastructure",
          "Analysis of all 10 types of optimization opportunities",
          "Detection of underutilized servers, zombie droplets, and unused resources",
          "Identification of over-provisioned databases and consolidation opportunities",
          "Recommendations with confidence levels (High/Medium/Low) for each opportunity",
          "Actionable insights with specific savings potential",
          "Results delivered in 30 seconds or less",
        ],
      },
      {
        category: "Analysis Types",
        items: [
          "Underutilized servers (droplets)",
          "Zombie droplets (powered-off servers)",
          "Zombie volumes (unattached storage)",
          "Old snapshots (backups older than 6 months)",
          "Underutilized databases",
          "Redundant backup strategies",
          "Server consolidation opportunities",
          "Unused IP addresses",
          "Inactive load balancers",
          "Region optimization suggestions",
        ],
      },
      {
        category: "Security & Privacy",
        items: [
          "Read-only API token access (no write permissions required)",
          "Token processed and immediately discarded after analysis",
          "No permanent storage of tokens or sensitive data",
          "Secure API processing",
        ],
      },
    ],
  },
];

export default function ChangelogPage() {
  return (
    <div className="relative min-h-screen grain-texture">
      <div className="mesh-gradient" />
      <Navbar />
      <div className="relative z-10 pt-16">
        <div className="max-w-4xl mx-auto px-4 py-20">
          <div className="mb-12">
            <h1 className="text-4xl sm:text-5xl font-bold text-white mb-4">
              Changelog
            </h1>
            <p className="text-lg text-zinc-400">
              Track the latest updates and improvements to CloudSaver as we continue
              to help you identify optimization opportunities in your DigitalOcean infrastructure.
            </p>
          </div>

          <div className="space-y-12">
            {changelogEntries.map((entry, index) => {
              const Icon = entry.icon;
              return (
                <div
                  key={index}
                  className="relative border border-white/5 bg-white/2 rounded-2xl p-8 backdrop-blur-sm"
                >
                  {/* Version Header */}
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8 pb-6 border-b border-white/5">
                    <div className="flex items-center gap-4">
                      <div
                        className={`p-3 rounded-xl ${
                          entry.type === "upcoming"
                            ? "bg-yellow-500/10 border border-yellow-500/20"
                            : "bg-indigo-500/10 border border-indigo-500/20"
                        }`}
                      >
                        <Icon
                          className={`w-6 h-6 ${
                            entry.type === "upcoming"
                              ? "text-yellow-400"
                              : "text-indigo-400"
                          }`}
                        />
                      </div>
                      <div>
                        <div className="flex items-center gap-3 mb-1">
                          <h2 className="text-2xl font-bold text-white">
                            {entry.version}
                          </h2>
                          {entry.type === "upcoming" && (
                            <Badge
                              variant="outline"
                              className="border-yellow-500/40 bg-yellow-500/10 text-yellow-400"
                            >
                              Coming Soon
                            </Badge>
                          )}
                        </div>
                        <div className="flex items-center gap-2 text-sm text-zinc-500">
                          <Calendar className="w-4 h-4" />
                          <span>{entry.date}</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Changes */}
                  <div className="space-y-6">
                    {entry.changes.map((changeGroup, groupIndex) => (
                      <div key={groupIndex}>
                        <h3 className="text-lg font-semibold text-white mb-3">
                          {changeGroup.category}
                        </h3>
                        <ul className="space-y-2 list-none pl-0">
                          {changeGroup.items.map((item, itemIndex) => (
                            <li
                              key={itemIndex}
                              className="text-zinc-400 flex items-start gap-3"
                            >
                              <span className="text-emerald-400 mt-1 shrink-0 w-2">
                                •
                              </span>
                              <span className="flex-1">{item}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Footer Note */}
          <div className="mt-12 p-6 bg-zinc-900/50 rounded-xl border border-white/5">
            <div className="flex items-start gap-3">
              <Shield className="w-5 h-5 text-indigo-400 shrink-0 mt-0.5" />
              <div>
                <h3 className="text-sm font-semibold text-white mb-1">
                  Privacy First
                </h3>
                <p className="text-sm text-zinc-400">
                  All updates are designed with your privacy in mind. We
                  continue to prioritize secure processing and data protection
                  in every release.
                </p>
              </div>
            </div>
          </div>
        </div>
        <Footer />
      </div>
    </div>
  );
}
