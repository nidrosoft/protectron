/**
 * Stripe Configuration
 *
 * Pricing and feature limits for Stripe integration.
 * Prices are in EUR cents. Plan slugs match subscription tier names.
 *
 * IMPORTANT: After changing prices here, you must also update
 * the corresponding Products and Prices in your Stripe Dashboard.
 */

export const STRIPE_CONFIG = {
  // Keys from environment variables
  publishableKey: process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || "",
  secretKey: process.env.STRIPE_SECRET_KEY || "",
  webhookSecret: process.env.STRIPE_WEBHOOK_SECRET || "",

  // Currency
  currency: "eur",

  // Pricing (in EUR cents)
  plans: {
    free: {
      name: "Free",
      slug: "free",
      priceMonthly: 0,
      priceYearly: 0,
    },
    starter: {
      name: "Starter",
      slug: "starter",
      priceMonthly: 9900, // €99/month
      priceYearly: 94800, // €948/year (€79/mo)
    },
    professional: {
      name: "Professional",
      slug: "professional",
      priceMonthly: 29900, // €299/month
      priceYearly: 298800, // €2,988/year (€249/mo)
    },
    business: {
      name: "Business",
      slug: "business",
      priceMonthly: 69900, // €699/month
      priceYearly: 718800, // €7,188/year (€599/mo)
    },
    enterprise: {
      name: "Enterprise",
      slug: "enterprise",
      priceMonthly: 0, // Custom pricing
      priceYearly: 0,
    },
  },

  // Feature limits by plan
  limits: {
    free: {
      aiSystems: 1,
      teamMembers: 1,
      documentsPerMonth: 2,
      quickComplySessions: 1,
      documentGeneration: true,
      exportPdf: false,
      apiAccess: false,
      auditTrail: false,
      certificationBadges: false,
      customBranding: false,
      prioritySupport: false,
      sso: false,
    },
    starter: {
      aiSystems: 3,
      teamMembers: 2,
      documentsPerMonth: 10,
      quickComplySessions: 5,
      documentGeneration: true,
      exportPdf: true,
      apiAccess: false,
      auditTrail: false,
      certificationBadges: false,
      customBranding: false,
      prioritySupport: false,
      sso: false,
    },
    professional: {
      aiSystems: 10,
      teamMembers: 5,
      documentsPerMonth: -1, // Unlimited
      quickComplySessions: 25,
      documentGeneration: true,
      exportPdf: true,
      apiAccess: true,
      auditTrail: true,
      certificationBadges: false,
      customBranding: false,
      prioritySupport: false,
      sso: false,
    },
    business: {
      aiSystems: 30,
      teamMembers: 15,
      documentsPerMonth: -1,
      quickComplySessions: -1, // Unlimited
      documentGeneration: true,
      exportPdf: true,
      apiAccess: true,
      auditTrail: true,
      certificationBadges: true,
      customBranding: true,
      prioritySupport: true,
      sso: false,
    },
    enterprise: {
      aiSystems: -1, // Unlimited
      teamMembers: -1,
      documentsPerMonth: -1,
      quickComplySessions: -1,
      documentGeneration: true,
      exportPdf: true,
      apiAccess: true,
      auditTrail: true,
      certificationBadges: true,
      customBranding: true,
      prioritySupport: true,
      sso: true,
    },
  },
} as const;

export type PlanSlug = keyof typeof STRIPE_CONFIG.plans;
export type PlanLimits = (typeof STRIPE_CONFIG.limits)[PlanSlug];
