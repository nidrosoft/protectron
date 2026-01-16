"use client";

import { cx } from "@/utils/cx";
import { DocumentDownload, ArrowRight, TickCircle, Clock } from "iconsax-react";

interface CTASectionProps {
  onDownloadReport: () => void;
  onGoToDashboard: () => void;
  isDownloading: boolean;
  isSaving: boolean;
}

export function CTASection({
  onDownloadReport,
  onGoToDashboard,
  isDownloading,
  isSaving,
}: CTASectionProps) {
  return (
    <section className="mb-8 sm:mb-12">
      {/* Main CTA Card */}
      <div className="rounded-xl bg-gradient-to-br from-brand-600 to-brand-700 dark:from-brand-700 dark:to-brand-800 p-5 text-white shadow-xl sm:rounded-2xl sm:p-8">
        <div className="flex flex-col items-center gap-6">
          {/* Text Content */}
          <div className="text-center">
            <h2 className="text-xl font-bold mb-2 sm:text-2xl">
              🚀 Start Your Compliance Journey
            </h2>
            <p className="text-sm text-brand-100 sm:text-base max-w-xl mx-auto">
              You now have a complete picture of your EU AI Act obligations. 
              Here's what you can do next:
            </p>
          </div>

          {/* CTA Buttons - Now below description */}
          <div className="flex flex-col gap-3 w-full sm:flex-row sm:w-auto sm:justify-center">
            {/* Download Report Button */}
            <button
              onClick={onDownloadReport}
              disabled={isDownloading}
              className={cx(
                "inline-flex items-center justify-center gap-2 rounded-lg border border-white/30 bg-white/10 px-5 py-3 text-sm font-semibold text-white transition-all hover:bg-white/20 disabled:opacity-50 disabled:cursor-not-allowed",
                "sm:px-6 sm:py-3.5"
              )}
            >
              <span className="text-white"><DocumentDownload size={18} color="currentColor" variant="Bold" /></span>
              <span>{isDownloading ? "Generating..." : "Download Report"}</span>
            </button>

            {/* Go to Dashboard Button */}
            <button
              onClick={onGoToDashboard}
              disabled={isSaving}
              className={cx(
                "inline-flex items-center justify-center gap-2 rounded-lg bg-white px-5 py-3 text-sm font-semibold text-brand-700 transition-all hover:bg-brand-50 disabled:opacity-50 disabled:cursor-not-allowed",
                "sm:px-6 sm:py-3.5",
                !isSaving && "animate-pulse-subtle"
              )}
            >
              <span>{isSaving ? "Saving..." : "Take Me to Dashboard"}</span>
              {!isSaving && <span className="text-brand-700"><ArrowRight size={18} color="currentColor" variant="Bold" /></span>}
            </button>
          </div>
        </div>

        {/* Feature List */}
        <div className="mt-6 pt-6 border-t border-white/20">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <FeatureItem icon={TickCircle} text="Track requirements" />
            <FeatureItem icon={TickCircle} text="Generate documents" />
            <FeatureItem icon={TickCircle} text="Upload evidence" />
            <FeatureItem icon={TickCircle} text="Monitor progress" />
          </div>
        </div>
      </div>

      {/* Secondary Info Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
        {/* Download Report Card */}
        <div className="rounded-xl border border-secondary dark:border-gray-700 bg-white dark:bg-gray-800 p-4 sm:p-5">
          <div className="flex items-start gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400">
              <DocumentDownload size={20} color="currentColor" variant="Bold" />
            </div>
            <div>
              <h3 className="text-sm font-semibold text-primary dark:text-white mb-1">
                Download Report
              </h3>
              <p className="text-xs text-tertiary dark:text-gray-400 mb-2">
                Get a comprehensive PDF of this entire analysis to share with your team.
              </p>
              <ul className="space-y-1">
                <li className="text-xs text-tertiary dark:text-gray-400 flex items-center gap-1.5">
                  <span className="flex h-1 w-1 rounded-full bg-gray-400" />
                  All identified gaps
                </li>
                <li className="text-xs text-tertiary dark:text-gray-400 flex items-center gap-1.5">
                  <span className="flex h-1 w-1 rounded-full bg-gray-400" />
                  Article breakdowns
                </li>
                <li className="text-xs text-tertiary dark:text-gray-400 flex items-center gap-1.5">
                  <span className="flex h-1 w-1 rounded-full bg-gray-400" />
                  Full action roadmap
                </li>
                <li className="text-xs text-tertiary dark:text-gray-400 flex items-center gap-1.5">
                  <span className="flex h-1 w-1 rounded-full bg-gray-400" />
                  Timeline & deadlines
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Dashboard Card */}
        <div className="rounded-xl border-2 border-brand-200 dark:border-brand-800 bg-brand-50 dark:bg-brand-900/20 p-4 sm:p-5">
          <div className="flex items-start gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-brand-100 dark:bg-brand-900/30 text-brand-600">
              <ArrowRight size={20} color="currentColor" variant="Bold" />
            </div>
            <div>
              <h3 className="text-sm font-semibold text-brand-900 dark:text-brand-100 mb-1">
                Go to Dashboard
              </h3>
              <p className="text-xs text-brand-700 dark:text-brand-300 mb-2">
                Start implementing your compliance roadmap today.
              </p>
              <ul className="space-y-1">
                <li className="text-xs text-brand-700 dark:text-brand-300 flex items-center gap-1.5">
                  <span className="text-brand-500"><TickCircle size={10} color="currentColor" variant="Bold" /></span>
                  Start free with 2 AI systems
                </li>
                <li className="text-xs text-brand-700 dark:text-brand-300 flex items-center gap-1.5">
                  <span className="text-brand-500"><TickCircle size={10} color="currentColor" variant="Bold" /></span>
                  No credit card required
                </li>
                <li className="text-xs text-brand-700 dark:text-brand-300 flex items-center gap-1.5">
                  <span className="text-brand-500"><TickCircle size={10} color="currentColor" variant="Bold" /></span>
                  AI-powered document generation
                </li>
                <li className="text-xs text-brand-700 dark:text-brand-300 flex items-center gap-1.5">
                  <span className="text-brand-500"><TickCircle size={10} color="currentColor" variant="Bold" /></span>
                  Assessment data auto-imported
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Contact Info */}
      <div className="mt-4 text-center">
        <p className="text-sm text-tertiary dark:text-gray-400">
          💬 Questions? Contact us at{" "}
          <a href="mailto:hello@protectron.ai" className="text-brand-600 dark:text-brand-400 hover:underline">
            hello@protectron.ai
          </a>
        </p>
      </div>

      {/* Animation Styles */}
      <style jsx>{`
        @keyframes pulseSubtle {
          0%, 100% {
            box-shadow: 0 0 0 0 rgba(255, 255, 255, 0.4);
          }
          50% {
            box-shadow: 0 0 0 8px rgba(255, 255, 255, 0);
          }
        }
        :global(.animate-pulse-subtle) {
          animation: pulseSubtle 2s ease-in-out infinite;
        }
      `}</style>
    </section>
  );
}

interface FeatureItemProps {
  icon: typeof TickCircle;
  text: string;
}

function FeatureItem({ icon: Icon, text }: FeatureItemProps) {
  return (
    <div className="flex items-center gap-2 text-brand-200">
      <Icon size={16} color="currentColor" variant="Bold" />
      <span className="text-sm text-brand-100">{text}</span>
    </div>
  );
}
