export type PricingPlan = {
  id: string;
  name: string;
  price: number;
  pricePeriod: "month" | "year";
  features: string[];
  isPopular?: boolean;
  ctaText: string;
  ctaHref?: string;
  description?: string;
};
