"use client";

import { ArrowRight2 } from "iconsax-react";
import { Button } from "@/components/base/buttons/button";
import { useRouter } from "next/navigation";
import type { AssessmentContext } from "@/lib/walkthrough/types";

interface CompletionModalProps {
  isOpen: boolean;
  assessmentContext: AssessmentContext | null;
  onClose: () => void;
}

export function CompletionModal({
  isOpen,
  assessmentContext,
  onClose,
}: CompletionModalProps) {
  const router = useRouter();

  if (!isOpen) return null;

  const remainingSystems = Math.max(0, (assessmentContext?.totalSystems || 3) - 1);
  const daysUntilDeadline = assessmentContext?.daysUntilDeadline || 200;

  const handleAddAnotherSystem = () => {
    onClose();
    router.push("/ai-systems/new");
  };

  const handleGenerateDocument = () => {
    onClose();
    router.push("/documents");
  };

  const handleViewRequirements = () => {
    onClose();
    router.push("/requirements");
  };

  const handleStartUsing = () => {
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[10001] flex items-center justify-center">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />

      {/* Confetti effect */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {[...Array(50)].map((_, i) => (
          <div
            key={i}
            className="absolute animate-confetti"
            style={{
              left: `${Math.random() * 100}%`,
              top: `-10%`,
              animationDelay: `${Math.random() * 3}s`,
              animationDuration: `${3 + Math.random() * 2}s`,
            }}
          >
            <div
              className="w-2 h-2 rounded-sm"
              style={{
                backgroundColor: ['#8B5CF6', '#10B981', '#F59E0B', '#EF4444', '#3B82F6'][Math.floor(Math.random() * 5)],
                transform: `rotate(${Math.random() * 360}deg)`,
              }}
            />
          </div>
        ))}
      </div>

      {/* Modal */}
      <div className="relative w-full max-w-lg mx-4 animate-in fade-in zoom-in-95 duration-300">
        <div className="rounded-2xl bg-white dark:bg-gray-800 shadow-2xl overflow-hidden">
          {/* Header with celebration */}
          <div className="relative px-6 pt-8 pb-6 bg-gradient-to-br from-success-500 to-success-700 text-white text-center">
            <span className="text-5xl mb-3 block">🎉</span>
            <h2 className="text-2xl font-bold mb-2">You're All Set!</h2>
            <p className="text-success-100 text-sm">
              You've completed the Protectron walkthrough
            </p>
          </div>

          {/* Content */}
          <div className="px-6 py-6">
            {/* Accomplishments */}
            <div className="mb-6">
              <p className="text-sm text-tertiary dark:text-gray-400 mb-3">
                Here's what you accomplished:
              </p>
              <div className="space-y-2">
                <div className="flex items-center gap-3 p-2.5 rounded-lg bg-success-50 dark:bg-success-900/20 border border-success-200 dark:border-success-800">
                  <div className="flex h-6 w-6 items-center justify-center rounded-full bg-success-500">
                    <svg className="w-3.5 h-3.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <span className="text-sm font-medium text-success-700 dark:text-success-300">
                    Explored the dashboard and navigation
                  </span>
                </div>
                <div className="flex items-center gap-3 p-2.5 rounded-lg bg-success-50 dark:bg-success-900/20 border border-success-200 dark:border-success-800">
                  <div className="flex h-6 w-6 items-center justify-center rounded-full bg-success-500">
                    <svg className="w-3.5 h-3.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <span className="text-sm font-medium text-success-700 dark:text-success-300">
                    Created your first AI system
                  </span>
                </div>
                <div className="flex items-center gap-3 p-2.5 rounded-lg bg-success-50 dark:bg-success-900/20 border border-success-200 dark:border-success-800">
                  <div className="flex h-6 w-6 items-center justify-center rounded-full bg-success-500">
                    <svg className="w-3.5 h-3.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <span className="text-sm font-medium text-success-700 dark:text-success-300">
                    Viewed your auto-generated requirements
                  </span>
                </div>
              </div>
            </div>

            {/* Recommended Next Steps */}
            <div className="mb-6">
              <h3 className="text-sm font-semibold text-primary dark:text-white mb-3">
                RECOMMENDED NEXT STEPS
              </h3>
              <div className="space-y-2">
                <button
                  onClick={handleAddAnotherSystem}
                  className="w-full flex items-center gap-3 p-3 rounded-lg border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors text-left group"
                >
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-brand-600 text-white font-bold text-sm shrink-0">
                    1
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-primary dark:text-white">
                      Add your remaining AI systems
                    </p>
                    <p className="text-xs text-tertiary dark:text-gray-400">
                      {remainingSystems > 0 ? `${remainingSystems} more to add` : "Track all your AI systems"}
                    </p>
                  </div>
                  <ArrowRight2 size={16} className="text-tertiary group-hover:text-brand-600 transition-colors" />
                </button>

                <button
                  onClick={handleGenerateDocument}
                  className="w-full flex items-center gap-3 p-3 rounded-lg border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors text-left group"
                >
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-brand-600 text-white font-bold text-sm shrink-0">
                    2
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-primary dark:text-white">
                      Generate your first compliance document
                    </p>
                    <p className="text-xs text-tertiary dark:text-gray-400">
                      Start with a Risk Assessment
                    </p>
                  </div>
                  <ArrowRight2 size={16} className="text-tertiary group-hover:text-brand-600 transition-colors" />
                </button>

                <button
                  onClick={handleViewRequirements}
                  className="w-full flex items-center gap-3 p-3 rounded-lg border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors text-left group"
                >
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-brand-600 text-white font-bold text-sm shrink-0">
                    3
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-primary dark:text-white">
                      Complete your first requirement
                    </p>
                    <p className="text-xs text-tertiary dark:text-gray-400">
                      Mark a requirement as done
                    </p>
                  </div>
                  <ArrowRight2 size={16} className="text-tertiary group-hover:text-brand-600 transition-colors" />
                </button>
              </div>
            </div>

            {/* Tip */}
            <div className="p-3 rounded-lg bg-brand-50 dark:bg-brand-900/20 border border-brand-200 dark:border-brand-800 mb-6">
              <p className="text-xs text-brand-700 dark:text-brand-300">
                💡 <strong>Tip:</strong> You have {daysUntilDeadline} days until the August 2, 2026 deadline. 
                We recommend completing 1-2 requirements per day.
              </p>
            </div>

            {/* CTA */}
            <Button
              size="lg"
              className="w-full"
              onClick={handleStartUsing}
            >
              Start Using Protectron →
            </Button>

            {/* Support link */}
            <p className="text-center text-xs text-tertiary dark:text-gray-400 mt-4">
              Need help? Contact{" "}
              <a href="mailto:support@protectron.ai" className="text-brand-600 hover:underline">
                support@protectron.ai
              </a>
            </p>
          </div>
        </div>
      </div>

      {/* Confetti animation styles */}
      <style jsx global>{`
        @keyframes confetti {
          0% {
            transform: translateY(0) rotate(0deg);
            opacity: 1;
          }
          100% {
            transform: translateY(100vh) rotate(720deg);
            opacity: 0;
          }
        }
        .animate-confetti {
          animation: confetti linear forwards;
        }
      `}</style>
    </div>
  );
}
