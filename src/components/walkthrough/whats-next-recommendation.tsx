"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { 
  Cpu, 
  DocumentText, 
  TickSquare, 
  FolderOpen, 
  ArrowRight2, 
  CloseCircle,
  Lamp,
  ArrowUp2,
  ArrowDown2
} from "iconsax-react";
import { Button } from "@/components/base/buttons/button";
import { cx } from "@/utils/cx";
import { createClient } from "@/lib/supabase/client";

interface Recommendation {
  id: string;
  title: string;
  description: string;
  detailedDescription: string;
  benefits: string[];
  timeEstimate: string;
  icon: typeof Cpu;
  iconColor: string;
  iconBg: string;
  href?: string;
  action?: string;
  priority: number;
}

interface WhatsNextRecommendationProps {
  className?: string;
  onAction?: (action: string) => void;
}

export function WhatsNextRecommendation({ 
  className,
  onAction 
}: WhatsNextRecommendationProps) {
  const router = useRouter();
  const [recommendation, setRecommendation] = useState<Recommendation | null>(null);
  const [isDismissed, setIsDismissed] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchRecommendation = async () => {
      try {
        const supabase = createClient();
        const { data: { user } } = await supabase.auth.getUser();
        
        if (!user) {
          setIsLoading(false);
          return;
        }

        const { data: profile } = await supabase
          .from("profiles")
          .select("organization_id")
          .eq("id", user.id)
          .single();

        if (!profile?.organization_id) {
          setIsLoading(false);
          return;
        }

        // Check various states to determine recommendation
        const { count: aiSystemsCount } = await supabase
          .from("ai_systems")
          .select("*", { count: "exact", head: true })
          .eq("organization_id", profile.organization_id);

        const { count: documentsCount } = await supabase
          .from("documents")
          .select("*", { count: "exact", head: true })
          .eq("organization_id", profile.organization_id);

        const { count: completedReqsCount } = await supabase
          .from("ai_system_requirements")
          .select("*", { count: "exact", head: true })
          .eq("status", "completed");

        const { count: evidenceCount } = await supabase
          .from("evidence")
          .select("*", { count: "exact", head: true })
          .eq("organization_id", profile.organization_id);

        // Determine the best recommendation based on current state
        const recommendations: Recommendation[] = [];

        if ((aiSystemsCount || 0) === 0) {
          recommendations.push({
            id: "add-ai-system",
            title: "Add Your First AI System",
            description: "Register an AI system to start tracking compliance requirements.",
            detailedDescription: "The EU AI Act requires organizations to maintain a comprehensive inventory of all AI systems in use. By registering your AI systems in Protectron, you'll automatically receive a tailored compliance checklist based on each system's risk classification. This is the foundation of your compliance journey.",
            benefits: [
              "Automatic risk classification based on your AI system's use case",
              "Personalized compliance requirements generated instantly",
              "Track progress across all your AI systems in one place",
              "Get notified about upcoming deadlines and required actions",
            ],
            timeEstimate: "2-3 minutes",
            icon: Cpu,
            iconColor: "text-brand-600",
            iconBg: "bg-brand-100 dark:bg-brand-900/30",
            href: "/ai-systems/new",
            priority: 1,
          });
        }

        if ((aiSystemsCount || 0) > 0 && (documentsCount || 0) === 0) {
          recommendations.push({
            id: "generate-document",
            title: "Generate a Risk Assessment",
            description: "Create your first AI-powered compliance document in minutes.",
            detailedDescription: "Article 9 of the EU AI Act requires a comprehensive risk management system for high-risk AI systems. Our AI-powered document generator will create a professional Risk Assessment document tailored to your specific AI system, saving you weeks of manual work.",
            benefits: [
              "AI-generated content based on your system's specifications",
              "Compliant with EU AI Act Article 9 requirements",
              "Export as PDF or Word document for auditors",
              "Easily update and version control your documents",
            ],
            timeEstimate: "10-15 minutes",
            icon: DocumentText,
            iconColor: "text-purple-600",
            iconBg: "bg-purple-100 dark:bg-purple-900/30",
            href: "/documents",
            action: "generate-document",
            priority: 2,
          });
        }

        if ((aiSystemsCount || 0) > 0 && (completedReqsCount || 0) === 0) {
          recommendations.push({
            id: "complete-requirement",
            title: "Complete Your First Requirement",
            description: "Mark a compliance requirement as done to track your progress.",
            detailedDescription: "Protectron has automatically generated a personalized checklist of EU AI Act requirements for your AI systems. Start by reviewing and completing your first requirement. Each completed requirement brings you closer to full compliance before the August 2026 deadline.",
            benefits: [
              "Track compliance progress with visual indicators",
              "Link evidence and documents to each requirement",
              "Get credit for work you've already done",
              "Prioritized list based on regulatory importance",
            ],
            timeEstimate: "5 minutes",
            icon: TickSquare,
            iconColor: "text-success-600",
            iconBg: "bg-success-100 dark:bg-success-900/30",
            href: "/requirements",
            priority: 3,
          });
        }

        if ((aiSystemsCount || 0) > 0 && (evidenceCount || 0) === 0) {
          recommendations.push({
            id: "upload-evidence",
            title: "Upload Compliance Evidence",
            description: "Add documents or screenshots as proof of compliance.",
            detailedDescription: "Auditors will require proof of your compliance efforts. Upload existing documentation, test results, screenshots, or any other evidence that demonstrates your AI systems meet EU AI Act requirements. Protectron organizes and links evidence to specific requirements automatically.",
            benefits: [
              "Centralized evidence repository for all AI systems",
              "Automatic linking to relevant requirements",
              "Track evidence freshness and expiration",
              "Generate evidence reports for auditors",
            ],
            timeEstimate: "5 minutes",
            icon: FolderOpen,
            iconColor: "text-warning-600",
            iconBg: "bg-warning-100 dark:bg-warning-900/30",
            href: "/evidence",
            action: "upload-evidence",
            priority: 4,
          });
        }

        // Sort by priority and pick the first one
        recommendations.sort((a, b) => a.priority - b.priority);
        setRecommendation(recommendations[0] || null);
      } catch (error) {
        console.error("Error fetching recommendation:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchRecommendation();
  }, []);

  const handleClick = () => {
    if (recommendation?.action && onAction) {
      onAction(recommendation.action);
    } else if (recommendation?.href) {
      router.push(recommendation.href);
    }
  };

  const handleDismiss = () => {
    setIsDismissed(true);
  };

  const handleRemindLater = () => {
    setIsDismissed(true);
    // Could store this preference in localStorage or database
  };

  if (isLoading || isDismissed || !recommendation) {
    return null;
  }

  const Icon = recommendation.icon;

  return (
    <div className={cx(
      "rounded-xl border border-secondary dark:border-gray-700 bg-white dark:bg-gray-800 overflow-hidden",
      className
    )}>
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 bg-gradient-to-r from-brand-50 to-brand-100 dark:from-brand-900/20 dark:to-brand-900/10 border-b border-brand-200 dark:border-brand-800">
        <div className="flex items-center gap-2">
          <Lamp size={16} className="text-brand-500" color="currentColor" variant="Bold" />
          <span className="text-sm font-semibold text-brand-700 dark:text-brand-300">
            Recommended Next Step
          </span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs text-brand-600 dark:text-brand-400">
            ⏱️ ~{recommendation.timeEstimate}
          </span>
          <button
            onClick={handleDismiss}
            className="text-tertiary hover:text-secondary transition-colors"
            aria-label="Dismiss"
          >
            <CloseCircle size={16} color="currentColor" />
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="p-4">
        {/* Title with Icon */}
        <div className="flex items-start gap-3 mb-3">
          <div className={cx(
            "flex h-10 w-10 shrink-0 items-center justify-center rounded-lg",
            recommendation.iconBg
          )}>
            <Icon size={20} className={recommendation.iconColor} color="currentColor" variant="Bold" />
          </div>
          <div>
            <h3 className="text-base font-semibold text-primary dark:text-white">
              {recommendation.title}
            </h3>
            <p className="text-sm text-tertiary dark:text-gray-400">
              {recommendation.description}
            </p>
          </div>
        </div>

        {/* Detailed Description */}
        <p className="text-sm text-secondary dark:text-gray-300 leading-relaxed mb-4">
          {recommendation.detailedDescription}
        </p>

        {/* Benefits */}
        <div className="mb-4">
          <p className="text-xs font-semibold text-tertiary dark:text-gray-400 uppercase tracking-wide mb-2">
            What you'll get:
          </p>
          <ul className="space-y-1.5">
            {recommendation.benefits.map((benefit, index) => (
              <li key={index} className="flex items-start gap-2 text-sm text-secondary dark:text-gray-300">
                <svg className="w-4 h-4 text-success-500 shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
                {benefit}
              </li>
            ))}
          </ul>
        </div>

        {/* Action Button */}
        <div className="flex items-center justify-between pt-3 border-t border-gray-200 dark:border-gray-700">
          <button
            onClick={handleRemindLater}
            className="text-sm text-tertiary hover:text-secondary transition-colors"
          >
            Remind Me Later
          </button>
          <button
            onClick={handleClick}
            className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-brand-600 hover:bg-brand-700 rounded-lg transition-colors whitespace-nowrap"
          >
            Get Started
            <ArrowRight2 size={16} color="currentColor" />
          </button>
        </div>
      </div>
    </div>
  );
}
