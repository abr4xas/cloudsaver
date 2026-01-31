# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

CloudSaver is a Next.js 16 application that analyzes DigitalOcean infrastructure to identify cost optimization opportunities. Users paste their read-only API token and receive a comprehensive analysis in ~30 seconds showing potential savings across 11 different analyzers.

**Key Principle**: Privacy-first - tokens are never stored, only processed in-memory and immediately discarded.

## Development Commands

```bash
# Development
pnpm run dev              # Start dev server at http://localhost:3000

# Build & Production
pnpm run build           # Production build with standalone output
pnpm start               # Run production build

# Code Quality
pnpm run lint            # Run ESLint (TypeScript strict mode enabled)
```

## Architecture Overview

### Tech Stack
- **Framework**: Next.js 16 (App Router, React 19, TypeScript)
- **Styling**: Tailwind CSS 4 with OKLCH color system
- **UI Components**: shadcn/ui (Radix UI primitives)
- **Fonts**: Space Grotesk (primary), JetBrains Mono (terminal/code)
- **Analytics**: Vercel Analytics

### Directory Structure

```
app/
  ├── api/analyze/route.ts    # Main analysis endpoint (POST)
  ├── layout.tsx              # Root layout with fonts, metadata, ErrorBoundary
  ├── page.tsx                # Landing page with lazy-loaded sections
  └── globals.css             # Design system (OKLCH colors, gradients, typography)

components/
  ├── hero.tsx                # Hero section (60/40 asymmetric layout)
  ├── current-state.tsx       # Problem cards (2x2 grid)
  ├── future-state.tsx        # Solution cards (2x2 grid)
  ├── features.tsx            # Bento grid layout
  ├── faqs.tsx                # Accordion FAQs
  ├── cta-section.tsx         # CTA after FAQs
  ├── token-input/            # Token input flow components
  │   ├── token-input-form.tsx       # Input + modal with instructions
  │   └── analysis-progress.tsx      # Terminal-style progress UI
  ├── scroll-progress.tsx     # Scroll indicator + floating CTA
  ├── theme-toggle.tsx        # Dark/light mode switcher
  ├── money-rain.tsx          # Celebration animation (optional)
  └── custom-cursor.tsx       # Custom cursor (optional, desktop only)

lib/
  ├── services/
  │   ├── digitalocean/       # DigitalOcean API client + service
  │   ├── pricing/            # Pricing data (196+ size variants)
  │   └── analysis/           # Recommendation engine
  ├── recommendations/        # 11 cost analyzers
  ├── constants.ts            # Animation durations, chart colors, styles
  ├── rate-limit.ts           # Server-side rate limiting
  ├── client-rate-limit.ts    # Client-side rate limiting
  ├── cache.ts                # Server-side caching
  ├── client-cache.ts         # Client-side caching
  └── error-handler.ts        # Error handling utilities

styles/
  └── animations.css          # Microinteractions, parallax, mobile optimizations

hooks/
  └── use-*.ts                # Custom React hooks
```

### Key Architecture Patterns

#### 1. Analysis Flow (API Route)
```
POST /api/analyze
├── Rate limiting (per-IP)
├── Token validation (format check)
├── Demo token detection → return mock data
├── Real analysis:
│   ├── DigitalOceanService (fetch resources)
│   ├── PricingService (calculate costs)
│   └── RecommendationEngine (11 analyzers in parallel)
└── Response: { monthlyCost, potentialSavings, recommendations[] }
```

#### 2. Design System (OKLCH Color System)

**Light Mode**: Off-white backgrounds (`oklch(0.98)`), near-black text (`oklch(0.15)`)
**Dark Mode** (default): Deep space backgrounds (`oklch(0.05)`), white text (`oklch(0.98)`)

**Gradient System** (contextual meaning):
- `--gradient-hero`: Purple → Emerald (innovation)
- `--gradient-problem`: Red → Orange (urgency)
- `--gradient-solution`: Emerald → Cyan (success)

**Typography** (responsive with clamp):
- h1: `clamp(2.5rem, 8vw, 6rem)` with `-0.03em` kerning
- h2: `clamp(2rem, 5vw, 4.5rem)`
- Body: `clamp(1rem, 1.5vw, 1.25rem)` with improved line-height

#### 3. Performance Optimizations

- **Image optimization**: AVIF/WebP formats, responsive sizes
- **Code splitting**: Dynamic imports for Features, Footer, heavy components
- **Font loading**: `display: swap`, preload critical fonts
- **Package optimization**: Tree-shaking for lucide-react, recharts, Radix UI
- **Build output**: Standalone mode for optimal deployment
- **No source maps** in production

#### 4. Accessibility (WCAG AAA Target)

- Skip-to-content link (hidden until focused)
- Enhanced focus indicators (3px outline, 3px offset)
- `prefers-reduced-motion` support (all animations respect it)
- Semantic HTML (`<main>`, `<section>`, proper headings)
- ARIA labels on interactive elements
- 7:1 contrast ratio for AAA compliance

#### 5. Responsive Design

- **Breakpoints**: xs (360px), sm (640px), md (768px), lg (1024px), xl (1536px)
- **Touch targets**: Minimum 48px on mobile
- **Bottom sheets**: Mobile modals with swipe indicators
- **Tablet optimization**: 2-column layouts (768-1024px)

## Important Implementation Details

### Token Input Flow
1. User pastes token in terminal-style input
2. "Where is my token?" modal opens with:
   - Primary CTA: "Open DigitalOcean API Settings" button (indigo-600)
   - 3-step instructions with aligned number badges
   - Security note emphasizing "Read Only" scope
3. On submit: client-side rate limiting → API call → terminal progress UI
4. Results displayed with grouped recommendations

### Animation System
- **Microinteractions**: Magnetic buttons, card tilt (3D), scroll-triggered reveals
- **Terminal progress**: ASCII-style with typewriter effect, color-coded steps
- **Money rain**: Celebration effect (30 particles, 3s duration, respects motion preference)
- **Scroll progress**: Bar changes color based on section (red → purple → emerald)
- **All animations**: GPU-accelerated (transform/opacity only), 60fps target

### Theme Toggle
- System preference detection on mount
- LocalStorage persistence
- Smooth sun/moon icon morph (500ms rotate transition)
- Full OKLCH palette swap

### Modal Design Pattern
Used in token input instructions:
- Swipe indicator on mobile (`<div class="swipe-indicator" />`)
- Bottom sheet animation on mobile (slides up from bottom)
- Standard centered modal on desktop
- Always include visual dividers for step separation

## Common Patterns to Follow

### Component Structure
```tsx
// Always use "use client" for interactive components
"use client";

import { ComponentProps } from "ui-library";
import { cn } from "@/lib/utils"; // For className merging

export function MyComponent() {
  // Use hooks at top
  // Event handlers as const
  // Render with proper ARIA labels
}
```

### Styling Conventions
- Use `cn()` utility for conditional classes
- Prefer Tailwind utilities over custom CSS
- Use OKLCH colors from CSS variables
- Responsive: mobile-first with sm/md/lg breakpoints
- Animations: Always add `@media (prefers-reduced-motion: reduce)` fallback

### Error Handling
- Use `ValidationError` for client input errors
- Use `DigitalOceanApiException` for API errors
- Use `handleApiError()` utility in API routes
- Always include user-friendly error messages

### Rate Limiting
- **Server**: `withRateLimit()` wrapper on API routes
- **Client**: `ClientRateLimiter` class with per-endpoint limits
- Demo tokens bypass rate limiting

## Configuration Files

### next.config.mjs
- TypeScript errors NOT ignored (strict mode)
- Standalone output for deployment
- Security headers configured
- Package import optimization for bundle size

### app/globals.css
- Design system foundation (colors, gradients, typography)
- Light/dark mode variants
- Responsive utilities
- WCAG AAA focus indicators

### styles/animations.css
- Microinteractions (magnetic, parallax, tilt)
- Mobile optimizations (bottom sheets, swipe)
- GPU-accelerated animations only

## Testing & Validation

**Demo Token**: Use `"demo"` as token to test UI flow with mock data (bypasses API calls).

**Rate Limit Testing**: Client-side limits are configurable in `lib/client-rate-limit.ts`.

**Accessibility Testing**:
- Keyboard navigation (Tab, Enter, Esc)
- Screen reader compatibility
- Contrast validation (aim for 7:1 ratio)

## Environment Variables

Required variables are defined in `lib/env.ts`. The app uses `getSiteUrl()` for canonical URLs and metadata.

## Design Philosophy

1. **Privacy-first**: Never store tokens or results
2. **Performance**: 95+ Lighthouse score target
3. **Accessibility**: WCAG AAA compliance
4. **Simplicity**: Minimal UI, maximum clarity
5. **No dark patterns**: Transparent, honest UX

## iF DESIGN AWARD 2026 Criteria

This landing page is designed for award submission:
- **Idea** (20%): Free instant analysis, terminal aesthetic, transparency
- **Form** (20%): Premium typography, sophisticated gradients, asymmetric layouts
- **Function** (20%): Optimized CRO flow, WCAG AAA, 95+ Lighthouse
- **Differentiation** (20%): Terminal progress, money rain, scroll narrative
- **Sustainability** (20%): Performance-first, accessibility built-in, respects user preferences
