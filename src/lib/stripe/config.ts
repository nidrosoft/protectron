// Stripe configuration
export const STRIPE_CONFIG = {
  // These will be set via environment variables
  publishableKey: process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || "",
  secretKey: process.env.STRIPE_SECRET_KEY || "",
  webhookSecret: process.env.STRIPE_WEBHOOK_SECRET || "",
  
  // Currency
  currency: "eur",
  
  // Pricing (in cents - EUR)
  plans: {
    free: {
      name: "Free",
      priceMonthly: 0,
      priceYearly: 0,
    },
    professional: {
      name: "Professional",
      priceMonthly: 9900, // €99/month
      priceYearly: 99000, // €990/year
    },
    growth: {
      name: "Growth",
      priceMonthly: 29900, // €299/month
      priceYearly: 299000, // €2,990/year
    },
    scale: {
      name: "Scale",
      priceMonthly: 99900, // €999/month
      priceYearly: 999000, // €9,990/year
    },
    enterprise: {
      name: "Enterprise",
      priceMonthly: 0, // Custom pricing
      priceYearly: 0,
    },
  },
  
  // Feature limits by plan (from PRD)
  limits: {
    free: {
      aiSystems: 0,
      teamMembers: 1,
      storageGb: 0,
      auditReportsPerMonth: 0,
      documentGeneration: false,
      apiAccess: false,
      prioritySupport: false,
      customBranding: false,
      sso: false,
    },
    professional: {
      aiSystems: 3,
      teamMembers: 2,
      storageGb: 1,
      auditReportsPerMonth: 2,
      documentGeneration: true, // basic templates
      apiAccess: false,
      prioritySupport: false,
      customBranding: false,
      sso: false,
    },
    growth: {
      aiSystems: 10,
      teamMembers: 5,
      storageGb: 5,
      auditReportsPerMonth: 10,
      documentGeneration: true, // all templates
      apiAccess: true,
      prioritySupport: true,
      customBranding: false,
      sso: false,
    },
    scale: {
      aiSystems: 50,
      teamMembers: 15,
      storageGb: 25,
      auditReportsPerMonth: -1, // unlimited
      documentGeneration: true, // custom templates
      apiAccess: true,
      prioritySupport: true,
      customBranding: true,
      sso: false,
    },
    enterprise: {
      aiSystems: -1, // Unlimited
      teamMembers: -1,
      storageGb: -1,
      auditReportsPerMonth: -1,
      documentGeneration: true,
      apiAccess: true,
      prioritySupport: true,
      customBranding: true,
      sso: true,
    },
  },
} as const;

export type PlanSlug = keyof typeof STRIPE_CONFIG.plans;
export type PlanLimits = typeof STRIPE_CONFIG.limits[PlanSlug];
