# CloudSaver

> Find hidden savings in your DigitalOcean infrastructure

CloudSaver is a free, privacy-first tool that analyzes your DigitalOcean infrastructure to identify cost optimization opportunities. Get comprehensive insights in 30 seconds or less, with no sign-up required.

## 🚀 Features

-   **Comprehensive Analysis**: Analyzes all 10 types of DigitalOcean resources
-   **Privacy-First**: Tokens are processed and immediately discarded
-   **Read-Only Access**: Only requires read-only API tokens
-   **Instant Results**: Get analysis results in 30 seconds or less
-   **Actionable Insights**: Clear recommendations with confidence levels
-   **No Sign-Up Required**: Use completely anonymously

## 📋 Prerequisites

-   Node.js 18+
-   pnpm (recommended) or npm/yarn
-   DigitalOcean account with API token

## 🛠️ Installation

1. Clone the repository:

```bash
git clone https://github.com/yourusername/cloudsaver.git
cd cloudsaver
```

2. Install dependencies:

```bash
pnpm install
```

3. Set up environment variables:

```bash
cp .env.example .env.local
```

Edit `.env.local` and set:

```env
NEXT_PUBLIC_SITE_URL=https://cloudsaver.io
```

4. Run the development server:

```bash
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## 📦 Building for Production

```bash
pnpm build
pnpm start
```

## 🏗️ Project Structure

```
cloudsaver/
├── app/                    # Next.js App Router
│   ├── api/               # API routes
│   ├── actions/           # Server actions
│   └── [pages]/           # Page routes
├── components/            # React components
│   ├── ui/               # shadcn/ui components
│   └── [features]/       # Feature components
├── lib/                  # Utilities and services
│   ├── services/         # Business logic services
│   ├── types/            # TypeScript types
│   └── utils.ts          # Utility functions
├── hooks/                # React hooks
└── public/               # Static assets
```

## 🔧 Configuration

### Environment Variables

See `.env.example` for all available environment variables:

-   `NEXT_PUBLIC_SITE_URL` - Your site URL (required)
-   `RATE_LIMIT_MAX_REQUESTS` - Server-side backup limit (default: 100, very permissive)
-   `RATE_LIMIT_WINDOW_MS` - Rate limit window in ms (default: 60000)

**Note**: Primary rate limiting is done client-side using localStorage (10 requests/minute). Server-side limit is a backup safety net.

### Next.js Configuration

The project uses Next.js 16 with App Router. Key configurations:

-   Image optimization enabled
-   Package import optimization for `lucide-react` and `recharts`
-   Security headers configured
-   Standalone output for deployment

## 🧪 Development

### Running Tests

```bash
pnpm test
```

### Linting

```bash
pnpm lint
```

### Type Checking

```bash
pnpm type-check
```

**Rate Limiting:**

-   10 requests per minute per IP address
-   Headers: `X-RateLimit-Limit`, `X-RateLimit-Remaining`, `X-RateLimit-Reset`

## 🔒 Security

-   **Read-Only Tokens**: Only read-only API tokens are required
-   **No Storage**: Tokens and analysis results are not stored
-   **Rate Limiting**: Client-side rate limiting using localStorage (no server costs)
-   **Input Validation**: All inputs are validated before processing
-   **Error Handling**: Comprehensive error handling and logging
-   **Client-Side Protection**: Rate limiting enforced in browser to reduce server load

## 🎨 Tech Stack

-   **Framework**: Next.js 16 (App Router)
-   **React**: 19.2.3
-   **TypeScript**: 5.x
-   **Styling**: Tailwind CSS v4
-   **UI Components**: Radix UI + shadcn/ui
-   **Validation**: Zod
-   **Forms**: React Hook Form
-   **Analytics**: Vercel Analytics

## 🤝 Contributing

Contributions are welcome! Please read our contributing guidelines first.

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

For support, please open an issue on GitHub or contact us through our support channels.

---

Made with ❤️ for the DigitalOcean community
