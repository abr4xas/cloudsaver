/// <reference types="node" />

declare namespace NodeJS {
  interface ProcessEnv {
    // Site Configuration
    NEXT_PUBLIC_SITE_URL?: string;

    // Analytics and Monitoring
    NEXT_PUBLIC_VERCEL_ANALYTICS_ID?: string;
    SENTRY_DSN?: string;

    // Email Service
    RESEND_API_KEY?: string;
    NEWSLETTER_API_KEY?: string;

    // Rate Limiting
    RATE_LIMIT_MAX_REQUESTS?: string;
    RATE_LIMIT_WINDOW_MS?: string;

    // Node Environment
    NODE_ENV: 'development' | 'production' | 'test';
  }
}
