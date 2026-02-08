/**
 * Section 2 - How It Works
 *
 * Simple 3-step visual explaining the Quick Comply process.
 * Designed to make a non-technical user feel confident.
 */

import { MessageQuestion, DocumentText, ShieldTick } from "iconsax-react";
import type { Icon } from "iconsax-react";

interface Step {
  icon: Icon;
  title: string;
  description: string;
  iconBg: string;
  iconColor: string;
}

const STEPS: Step[] = [
  {
    icon: MessageQuestion,
    title: "Answer Questions",
    description:
      "Our AI guides you through simple questions about each AI system. No technical jargon — just plain language.",
    iconBg: "bg-brand-100",
    iconColor: "text-brand-600",
  },
  {
    icon: DocumentText,
    title: "Documents Generated",
    description:
      "All required compliance documents are created automatically from your answers. Nothing to write yourself.",
    iconBg: "bg-success-100",
    iconColor: "text-success-600",
  },
  {
    icon: ShieldTick,
    title: "You're Compliant",
    description:
      "Download your documents and your business is covered under the EU AI Act. It's that simple.",
    iconBg: "bg-amber-100 dark:bg-amber-900/30",
    iconColor: "text-amber-600 dark:text-amber-400",
  },
];

export function HowItWorks() {
  return (
    <div className="rounded-2xl border border-secondary bg-primary p-6 sm:p-8">
      <h2 className="text-sm font-semibold uppercase tracking-wider text-tertiary">
        How it works
      </h2>
      <div className="mt-5 grid gap-6 sm:grid-cols-3">
        {STEPS.map((step, i) => {
          const IconComp = step.icon;
          return (
            <div key={step.title} className="flex gap-3 sm:flex-col sm:gap-0">
              {/* Step number + icon */}
              <div className="flex shrink-0 items-start gap-3 sm:mb-3">
                <span className="flex h-6 w-6 items-center justify-center rounded-full bg-tertiary text-xs font-bold text-primary">
                  {i + 1}
                </span>
                <div
                  className={`flex h-10 w-10 items-center justify-center rounded-lg ${step.iconBg}`}
                >
                  <IconComp
                    size={20}
                    color="currentColor"
                    className={step.iconColor}
                    variant="Bold"
                  />
                </div>
              </div>
              {/* Text */}
              <div>
                <h3 className="text-sm font-semibold text-primary">
                  {step.title}
                </h3>
                <p className="mt-1 text-xs leading-relaxed text-tertiary">
                  {step.description}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
