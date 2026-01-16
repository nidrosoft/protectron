"use client";

import { cx } from "@/utils/cx";
import { Cpu, TickCircle, Crown, Flash, Building, Star1 } from "iconsax-react";

interface PricingRecommendationProps {
  totalSystems: number;
  hasHighRisk: boolean;
  onGoToDashboard: () => void;
}

interface PricingTier {
  id: string;
  name: string;
  price: number;
  currency: string;
  maxSystems: number;
  description: string;
  icon: typeof Flash;
  color: string;
  bgColor: string;
  borderColor: string;
  features: string[];
}

const PRICING_TIERS: PricingTier[] = [
  {
    id: "free",
    name: "Free",
    price: 0,
    currency: "€",
    maxSystems: 2,
    description: "Perfect for exploring and small projects",
    icon: Star1,
    color: "text-gray-600",
    bgColor: "bg-gray-100 dark:bg-gray-800",
    borderColor: "border-gray-300 dark:border-gray-600",
    features: [
      "Up to 2 AI systems",
      "Basic compliance tracking",
      "Document templates",
      "Email support",
    ],
  },
  {
    id: "professional",
    name: "Professional",
    price: 99,
    currency: "€",
    maxSystems: 3,
    description: "For solo founders and early startups",
    icon: Flash,
    color: "text-blue-600",
    bgColor: "bg-blue-100 dark:bg-blue-900/30",
    borderColor: "border-blue-300 dark:border-blue-700",
    features: [
      "Up to 3 AI systems",
      "AI-powered document generation",
      "10,000 events/month",
      "Email support",
    ],
  },
  {
    id: "growth",
    name: "Growth",
    price: 299,
    currency: "€",
    maxSystems: 10,
    description: "For growing organizations",
    icon: Crown,
    color: "text-brand-600",
    bgColor: "bg-brand-100 dark:bg-brand-900/30",
    borderColor: "border-brand-300 dark:border-brand-700",
    features: [
      "Up to 10 AI systems",
      "SDK integration",
      "Audit trail & HITL",
      "100,000 events/month",
      "Email + Chat support",
    ],
  },
  {
    id: "scale",
    name: "Scale",
    price: 999,
    currency: "€",
    maxSystems: 25,
    description: "For enterprises with advanced needs",
    icon: Building,
    color: "text-purple-600",
    bgColor: "bg-purple-100 dark:bg-purple-900/30",
    borderColor: "border-purple-300 dark:border-purple-700",
    features: [
      "Up to 25 AI systems",
      "Certification badges",
      "12-month log retention",
      "500,000 events/month",
      "Priority support",
    ],
  },
];

function getRecommendedTier(systemCount: number): PricingTier {
  if (systemCount <= 2) return PRICING_TIERS[0]; // Free
  if (systemCount <= 3) return PRICING_TIERS[1]; // Professional
  if (systemCount <= 10) return PRICING_TIERS[2]; // Growth
  if (systemCount <= 25) return PRICING_TIERS[3]; // Scale
  return PRICING_TIERS[3]; // Scale (with enterprise note)
}

function getTierIndex(systemCount: number): number {
  if (systemCount <= 2) return 0;
  if (systemCount <= 3) return 1;
  if (systemCount <= 10) return 2;
  return 3;
}

export function PricingRecommendation({ 
  totalSystems, 
  hasHighRisk,
  onGoToDashboard 
}: PricingRecommendationProps) {
  const recommendedTier = getRecommendedTier(totalSystems);
  const recommendedIndex = getTierIndex(totalSystems);
  const isFree = recommendedTier.id === "free";
  const needsEnterprise = totalSystems > 25;

  return (
    <section className="mb-8 sm:mb-12">
      {/* Section Header */}
      <div className="flex items-center gap-3 mb-6">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand-100 dark:bg-brand-900/30 text-brand-600">
          <Crown size={20} color="currentColor" variant="Bold" />
        </div>
        <div>
          <h2 className="text-lg font-semibold text-primary dark:text-white sm:text-xl">
            Your Recommended Plan
          </h2>
          <p className="text-sm text-tertiary dark:text-gray-400">
            Based on your {totalSystems} AI system{totalSystems !== 1 ? "s" : ""}
          </p>
        </div>
      </div>

      {/* Recommendation Card */}
      <div className={cx(
        "rounded-xl border-2 p-5 sm:p-6 mb-4",
        recommendedTier.borderColor,
        isFree 
          ? "bg-gradient-to-r from-success-50 to-success-100 dark:from-success-900/20 dark:to-success-900/10" 
          : "bg-gradient-to-r from-brand-50 to-brand-100 dark:from-brand-900/20 dark:to-brand-900/10"
      )}>
        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
          {/* Left: Recommendation Info */}
          <div className="flex items-start gap-4">
            <div className={cx(
              "flex h-14 w-14 shrink-0 items-center justify-center rounded-xl",
              recommendedTier.bgColor,
              recommendedTier.color
            )}>
              <recommendedTier.icon size={28} color="currentColor" variant="Bold" />
            </div>
            <div>
              <div className="flex items-center gap-2 mb-1">
                <h3 className="text-xl font-bold text-primary dark:text-white">
                  {recommendedTier.name} Plan
                </h3>
                {isFree && (
                  <span className="px-2 py-0.5 rounded-full bg-success-200 dark:bg-success-800 text-xs font-semibold text-success-700 dark:text-success-300">
                    FREE
                  </span>
                )}
                {!isFree && recommendedTier.id === "growth" && (
                  <span className="px-2 py-0.5 rounded-full bg-brand-200 dark:bg-brand-800 text-xs font-semibold text-brand-700 dark:text-brand-300">
                    MOST POPULAR
                  </span>
                )}
              </div>
              <p className="text-sm text-tertiary dark:text-gray-400 mb-2">
                {recommendedTier.description}
              </p>
              <div className="flex items-baseline gap-1">
                <span className="text-3xl font-bold text-primary dark:text-white">
                  {recommendedTier.currency}{recommendedTier.price}
                </span>
                <span className="text-sm text-tertiary dark:text-gray-400">/month</span>
              </div>
            </div>
          </div>

          {/* Right: System Count Badge */}
          <div className="flex flex-col items-center sm:items-end gap-2">
            <div className={cx(
              "flex items-center gap-2 px-4 py-2 rounded-lg",
              isFree 
                ? "bg-success-200 dark:bg-success-800" 
                : "bg-brand-200 dark:bg-brand-800"
            )}>
              <span className={isFree ? "text-success-700 dark:text-success-300" : "text-brand-700 dark:text-brand-300"}><Cpu size={18} color="currentColor" variant="Bold" /></span>
              <span className={cx(
                "text-sm font-semibold",
                isFree ? "text-success-700 dark:text-success-300" : "text-brand-700 dark:text-brand-300"
              )}>
                {totalSystems} of {recommendedTier.maxSystems} AI systems
              </span>
            </div>
            <p className="text-xs text-tertiary dark:text-gray-400 text-center sm:text-right">
              {isFree 
                ? "You qualify for our free tier!" 
                : `Covers all ${totalSystems} detected systems`
              }
            </p>
          </div>
        </div>

        {/* Features */}
        <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {recommendedTier.features.map((feature, index) => (
              <div key={index} className="flex items-center gap-2">
                <span className="text-success-500 shrink-0"><TickCircle size={14} color="currentColor" variant="Bold" /></span>
                <span className="text-xs text-tertiary dark:text-gray-400">{feature}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Pricing Tiers Visual */}
      <div className="rounded-xl border border-secondary dark:border-gray-700 bg-white dark:bg-gray-800 p-4 sm:p-5">
        <h3 className="text-sm font-semibold text-primary dark:text-white mb-4">
          All Plans at a Glance
        </h3>
        
        {/* Visual Tier Indicator */}
        <div className="relative mb-6">
          {/* Progress Bar Background */}
          <div className="h-3 rounded-full bg-gray-200 dark:bg-gray-700 overflow-hidden">
            {/* Filled portion based on recommended tier */}
            <div 
              className={cx(
                "h-full rounded-full transition-all duration-500",
                isFree 
                  ? "bg-success-500" 
                  : "bg-gradient-to-r from-brand-400 to-brand-600"
              )}
              style={{ width: `${((recommendedIndex + 1) / PRICING_TIERS.length) * 100}%` }}
            />
          </div>
          
          {/* Tier Markers */}
          <div className="flex justify-between mt-2">
            {PRICING_TIERS.map((tier, index) => {
              const isRecommended = index === recommendedIndex;
              const isPast = index < recommendedIndex;
              const Icon = tier.icon;
              
              return (
                <div 
                  key={tier.id}
                  className={cx(
                    "flex flex-col items-center",
                    index === 0 && "items-start",
                    index === PRICING_TIERS.length - 1 && "items-end"
                  )}
                >
                  <div className={cx(
                    "flex h-8 w-8 items-center justify-center rounded-full border-2 transition-all",
                    isRecommended 
                      ? `${tier.bgColor} ${tier.borderColor} ring-2 ring-offset-2 ring-offset-white dark:ring-offset-gray-800 ${tier.id === "free" ? "ring-success-500" : "ring-brand-500"}`
                      : isPast
                        ? "bg-gray-100 dark:bg-gray-700 border-gray-300 dark:border-gray-600"
                        : "bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700"
                  )}>
                    <Icon 
                      size={14} 
                      className={cx(
                        isRecommended ? tier.color : "text-gray-400 dark:text-gray-500"
                      )} 
                      variant="Bold" 
                    />
                  </div>
                  <div className="mt-2 text-center">
                    <p className={cx(
                      "text-xs font-semibold",
                      isRecommended 
                        ? "text-primary dark:text-white" 
                        : "text-tertiary dark:text-gray-400"
                    )}>
                      {tier.name}
                    </p>
                    <p className={cx(
                      "text-xs",
                      isRecommended 
                        ? "text-brand-600 dark:text-brand-400 font-medium" 
                        : "text-quaternary dark:text-gray-500"
                    )}>
                      {tier.price === 0 ? "Free" : `€${tier.price}/mo`}
                    </p>
                    <p className="text-[10px] text-quaternary dark:text-gray-500">
                      ≤{tier.maxSystems} systems
                    </p>
                  </div>
                  {isRecommended && (
                    <span className="mt-1 px-2 py-0.5 rounded text-[10px] font-semibold bg-brand-100 dark:bg-brand-900/30 text-brand-600">
                      YOU
                    </span>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Message based on tier */}
        <div className={cx(
          "rounded-lg p-4 text-center",
          isFree 
            ? "bg-success-50 dark:bg-success-900/20 border border-success-200 dark:border-success-800"
            : "bg-brand-50 dark:bg-brand-900/20 border border-brand-200 dark:border-brand-800"
        )}>
          {isFree ? (
            <>
              <p className="text-sm font-semibold text-success-800 dark:text-success-200 mb-1">
                🎉 Great news! You qualify for our Free plan
              </p>
              <p className="text-xs text-success-700 dark:text-success-300">
                With {totalSystems} AI system{totalSystems !== 1 ? "s" : ""}, you can get started at no cost. 
                Upgrade anytime as you add more systems.
              </p>
            </>
          ) : (
            <>
              <p className="text-sm font-semibold text-brand-800 dark:text-brand-200 mb-1">
                📊 Based on your {totalSystems} AI systems, you need the {recommendedTier.name} plan
              </p>
              <p className="text-xs text-brand-700 dark:text-brand-300">
                This plan covers all your detected systems with room to grow. 
                {hasHighRisk && " Includes all features needed for high-risk AI compliance."}
              </p>
            </>
          )}
        </div>

        {/* Enterprise Note */}
        {needsEnterprise && (
          <div className="mt-4 rounded-lg bg-purple-50 dark:bg-purple-900/20 border border-purple-200 dark:border-purple-800 p-4">
            <div className="flex items-start gap-3">
              <Building size={20} className="text-purple-600 shrink-0 mt-0.5" variant="Bold" />
              <div>
                <p className="text-sm font-semibold text-purple-800 dark:text-purple-200">
                  Need more than 25 AI systems?
                </p>
                <p className="text-xs text-purple-700 dark:text-purple-300 mt-1">
                  Contact our sales team for custom enterprise pricing with unlimited AI systems, 
                  dedicated support, and custom integrations.
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
