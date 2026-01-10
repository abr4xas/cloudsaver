# CloudSaver

> Find hidden savings in your DigitalOcean infrastructure

CloudSaver is a free, privacy-first tool that analyzes your DigitalOcean infrastructure to identify cost optimization opportunities. Get comprehensive insights in 30 seconds or less, with no sign-up required.

## 🎯 Why CloudSaver?

Are you paying for resources you're not using? CloudSaver scans your entire DigitalOcean infrastructure and finds opportunities to reduce costs—often saving 15-30% of your monthly bill. No sign-up, no tracking, just instant insights.

## ✨ Key Features

-   **🔍 Comprehensive Analysis**: Analyzes all DigitalOcean resources (Droplets, Volumes, Snapshots, Databases, Load Balancers, Reserved IPs)
-   **💰 11 Cost Optimization Analyzers**: Identifies everything from zombie droplets to duplicate snapshots
-   **🔒 Privacy-First**: Your API token is processed and immediately discarded—we don't store anything
-   **⚡ Instant Results**: Get a complete analysis in 30 seconds or less
-   **📊 Actionable Insights**: Each recommendation includes confidence levels, savings estimates, and remediation commands
-   **🚫 No Sign-Up Required**: Use completely anonymously—just enter your token and get results
-   **📈 Up-to-Date Pricing**: Includes all 196+ DigitalOcean size variants (AMD, Intel, custom disk sizes) for accurate cost calculations

## 💡 How It Works

1. **Enter Your Token**: Provide a read-only DigitalOcean API token (we only need read access)
2. **Analysis**: CloudSaver fetches all your resources and runs 11 specialized analyzers in parallel
3. **Get Results**: Receive a comprehensive report with:
   - Total monthly cost breakdown
   - Potential savings opportunities with dollar amounts
   - Detailed recommendations with confidence levels
   - Ready-to-use remediation commands for each issue

### Example Results

```
Monthly Cost: $949.15
Potential Savings: $163.75 (17.25%)

Recommendations:
1. [High] 4 Powered Off Droplets -> Save $64.00
2. [Medium] 29 Old Snapshots -> Save $83.75
3. [Medium] 2 Duplicate Snapshots -> Save $16.00
```

## 📊 What We Analyze

CloudSaver includes 11 specialized analyzers to identify cost savings:

1. **Zombie Droplets** - Detects powered-off droplets still being charged
2. **Zombie Volumes** - Finds unattached block storage volumes wasting money
3. **Old Snapshots** - Identifies snapshots older than 30 days
4. **Duplicate Snapshots** - Finds redundant snapshots of the same resource
5. **Redundant Backups** - Detects unnecessary backup configurations
6. **Droplet Downgrade** - Suggests right-sizing based on actual usage metrics
7. **Database Optimization** - Recommends database size adjustments
8. **Consolidate Droplets** - Identifies opportunities to merge resources
9. **Region Optimization** - Suggests moving resources to cheaper regions
10. **Idle Load Balancers** - Finds empty or underutilized load balancers
11. **Large Unused Volumes** - Detects large volumes on powered-off droplets

Each recommendation includes:
- 💵 **Savings estimate** in USD/month
- 🎯 **Confidence level** (High/Medium/Low)
- ⚠️ **Impact assessment** (High/Medium/Low)
- 🔔 **Warnings** about potential risks
- 💻 **Remediation commands** to fix the issue immediately

## 🔒 Privacy & Security

-   **Read-Only Tokens**: Only read-only API tokens are required—we can't modify anything
-   **No Storage**: Tokens and analysis results are never stored
-   **No Tracking**: We don't track you, we don't store your data, we don't sell anything
-   **Client-Side Rate Limiting**: Smart rate limiting to protect both you and our servers
-   **Input Validation**: All inputs are validated before processing

## 🚀 Get Started

Simply visit the website, enter your DigitalOcean API token, and get instant insights. No installation, no setup, no hassle.

## 🤝 Contributing

Contributions are welcome! Whether it's a bug fix, new analyzer, or documentation improvement, we'd love to have your help.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🙏 Acknowledgments

-   Built with [Next.js](https://nextjs.org/)
-   UI components from [shadcn/ui](https://ui.shadcn.com/)
-   Icons from [Lucide](https://lucide.dev/)

## 📧 Support

For support, please open an issue on GitHub.

---

Made with ❤️ for the DigitalOcean community
