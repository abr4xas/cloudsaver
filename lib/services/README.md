# Services Layer

This directory contains all business logic services for CloudSaver, organized by domain.

## Structure

```
lib/services/
├── digitalocean/          # DigitalOcean API integration services
│   ├── api-client.ts      # Base HTTP client for DO API
│   ├── resource-fetcher.ts # Fetches all resources concurrently
│   ├── metrics-fetcher.ts  # Fetches metrics for droplets
│   ├── metrics-calculator.ts # Calculates metrics (CPU, memory, etc.)
│   └── pagination-handler.ts # Handles API pagination
├── pricing/               # Pricing calculation services
│   └── pricing-service.ts # Calculates costs for all resource types
├── analysis/              # Analysis and recommendation services
│   ├── recommendation-engine.ts # Orchestrates all analyzers
│   └── analyzers/         # Individual resource analyzers
└── types/                 # TypeScript types and interfaces
    ├── digitalocean.ts    # DO API types
    ├── pricing.ts         # Pricing types
    └── analysis.ts        # Analysis result types
```

## Design Principles

1. **Separation of Concerns**: Each service has a single, well-defined responsibility
2. **Type Safety**: All services use TypeScript with strict typing
3. **Error Handling**: Services handle errors gracefully and provide meaningful error messages
4. **Concurrency**: Services use parallel requests where possible for performance
5. **Documentation**: All public methods are documented with JSDoc

## Usage

Services should be imported and used in API routes or server actions:

```typescript
import { DigitalOceanService } from '@/lib/services/digitalocean/digitalocean-service';
import { RecommendationEngine } from '@/lib/services/analysis/recommendation-engine';
import { PricingService } from '@/lib/services/pricing/pricing-service';

// Initialize services
const doService = new DigitalOceanService();
const pricingService = new PricingService();
const engine = new RecommendationEngine(doService, pricingService);

// Use services
const resources = await doService.fetchAllResources(token);
const recommendations = await engine.analyze(token);
```

## Testing

Each service should have corresponding tests in `__tests__/services/` directory.

## Migration from Laravel

These services replicate the functionality from `app/Services/` in the Laravel backend, adapted for Next.js/TypeScript.

## Progress

### ✅ Completed Services

- **ApiClient** - Base HTTP client with authentication and error handling
- **PaginationHandler** - Handles paginated API responses
- **ResourceFetcher** - Fetches all resources concurrently (6 parallel requests)
- **MetricsFetcher** - Fetches droplet metrics (CPU, memory, load average, bandwidth)
- **MetricsCalculator** - Calculates averages and percentiles from metrics
- **DigitalOceanService** - Main service orchestrating all DO operations
- **PricingService** - Calculates costs for all resource types
- **RecommendationEngine** - Orchestrates analyzers and generates recommendations

### 📝 Next Steps

- Integration with existing analyzers in `lib/recommendations/`
- Update API routes to use new services
- Add comprehensive error handling and logging
- Add unit tests for each service
