"use client";

import { useEffect, useState, useRef } from "react";
import { createPortal } from "react-dom";
import { ArrowLeft2, ArrowRight2 } from "iconsax-react";
import { cx } from "@/utils/cx";
import type { WalkthroughStep } from "@/lib/walkthrough/types";

interface WalkthroughTooltipProps {
  step: WalkthroughStep;
  currentStepNumber: number;
  totalSteps: number;
  targetSelector?: string;
  onNext: () => void;
  onPrevious: () => void;
  onSkip: () => void;
  isFirstStep?: boolean;
  isLastStep?: boolean;
  dynamicContent?: React.ReactNode;
}

type Position = "top" | "bottom" | "left" | "right" | "center";

interface TooltipPosition {
  top: number;
  left: number;
  arrowPosition: Position;
  arrowOffset?: number; // Offset from center for arrow positioning
}

export function WalkthroughTooltip({
  step,
  currentStepNumber,
  totalSteps,
  targetSelector,
  onNext,
  onPrevious,
  onSkip,
  isFirstStep = false,
  isLastStep = false,
  dynamicContent,
}: WalkthroughTooltipProps) {
  const [position, setPosition] = useState<TooltipPosition | null>(null);
  const [mounted, setMounted] = useState(false);
  const tooltipRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setMounted(true);
    return () => setMounted(false);
  }, []);

  useEffect(() => {
    if (!targetSelector) {
      // Center position for modals
      setPosition({
        top: window.innerHeight / 2,
        left: window.innerWidth / 2,
        arrowPosition: "bottom",
      });
      return;
    }

    const calculatePosition = () => {
      const target = document.querySelector(targetSelector);
      const tooltip = tooltipRef.current;

      if (!target || !tooltip) {
        return;
      }

      const targetRect = target.getBoundingClientRect();
      const tooltipRect = tooltip.getBoundingClientRect();
      const padding = 16;
      const arrowSize = 12;

      let top = 0;
      let left = 0;
      let arrowPosition: Position = step.position || "bottom";

      // Calculate position based on preferred position
      switch (step.position) {
        case "top":
          top = targetRect.top - tooltipRect.height - padding - arrowSize;
          left = targetRect.left + targetRect.width / 2 - tooltipRect.width / 2;
          arrowPosition = "bottom";
          break;
        case "bottom":
          top = targetRect.bottom + padding + arrowSize;
          left = targetRect.left + targetRect.width / 2 - tooltipRect.width / 2;
          arrowPosition = "top";
          break;
        case "left":
          top = targetRect.top + targetRect.height / 2 - tooltipRect.height / 2;
          left = targetRect.left - tooltipRect.width - padding - arrowSize;
          arrowPosition = "right";
          break;
        case "right":
          top = targetRect.top + targetRect.height / 2 - tooltipRect.height / 2;
          left = targetRect.right + padding + arrowSize;
          arrowPosition = "left";
          break;
        default:
          // Default to right of target
          top = targetRect.top + targetRect.height / 2 - tooltipRect.height / 2;
          left = targetRect.right + padding + arrowSize;
          arrowPosition = "left";
      }

      // Store original top before viewport adjustments
      const originalTop = top;
      
      // Ensure tooltip stays within viewport
      const viewportPadding = 20;
      if (left < viewportPadding) left = viewportPadding;
      if (left + tooltipRect.width > window.innerWidth - viewportPadding) {
        left = window.innerWidth - tooltipRect.width - viewportPadding;
      }
      if (top < viewportPadding) top = viewportPadding;
      if (top + tooltipRect.height > window.innerHeight - viewportPadding) {
        top = window.innerHeight - tooltipRect.height - viewportPadding;
      }

      // Calculate arrow offset to point at target center
      // This is the distance from the tooltip top to where the arrow should be
      const targetCenterY = targetRect.top + targetRect.height / 2;
      const arrowOffset = targetCenterY - top;

      setPosition({ top, left, arrowPosition, arrowOffset });
    };

    // Initial calculation
    setTimeout(calculatePosition, 100);

    // Recalculate on scroll and resize
    window.addEventListener("scroll", calculatePosition, true);
    window.addEventListener("resize", calculatePosition);

    return () => {
      window.removeEventListener("scroll", calculatePosition, true);
      window.removeEventListener("resize", calculatePosition);
    };
  }, [targetSelector, step.position]);

  if (!mounted) return null;

  const tooltipContent = (
    <div
      ref={tooltipRef}
      className={cx(
        "fixed z-[10000] w-[420px] max-w-[90vw] rounded-xl bg-white dark:bg-gray-800 shadow-2xl border border-gray-200 dark:border-gray-700",
        "animate-in fade-in slide-in-from-bottom-2 duration-300"
      )}
      style={{
        top: position?.top ?? "50%",
        left: position?.left ?? "50%",
        transform: !position ? "translate(-50%, -50%)" : undefined,
      }}
    >
      {/* Header */}
      <div className="flex items-center justify-between gap-3 px-4 py-3 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center gap-2 min-w-0">
          <span className="text-xl shrink-0">{step.icon}</span>
          <h3 className="text-base font-semibold text-primary dark:text-white truncate">
            {step.title}
          </h3>
        </div>
        <span className="text-xs font-medium text-tertiary dark:text-gray-400 bg-gray-100 dark:bg-gray-700 px-2.5 py-1 rounded-full whitespace-nowrap shrink-0">
          Step {currentStepNumber} of {totalSteps - 1}
        </span>
      </div>

      {/* Content */}
      <div className="px-4 py-4">
        <p className="text-sm text-secondary dark:text-gray-300 leading-relaxed">
          {step.description}
        </p>

        {/* Highlights */}
        {step.highlights && step.highlights.length > 0 && (
          <ul className="mt-3 space-y-1.5">
            {step.highlights.map((highlight, index) => (
              <li key={index} className="flex items-start gap-2 text-sm text-tertiary dark:text-gray-400">
                <span className="text-brand-500 mt-0.5">•</span>
                {highlight}
              </li>
            ))}
          </ul>
        )}

        {/* Tips */}
        {step.tips && step.tips.length > 0 && (
          <div className="mt-3 p-3 rounded-lg bg-brand-50 dark:bg-brand-900/20 border border-brand-200 dark:border-brand-800">
            {step.tips.map((tip, index) => (
              <p key={index} className="text-xs text-brand-700 dark:text-brand-300">
                💡 {tip}
              </p>
            ))}
          </div>
        )}

        {/* Dynamic content */}
        {dynamicContent && (
          <div className="mt-3">
            {dynamicContent}
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between px-4 py-3 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50 rounded-b-xl">
        <button
          onClick={onSkip}
          className="text-xs text-tertiary dark:text-gray-400 hover:text-secondary dark:hover:text-gray-300 transition-colors"
        >
          Skip Tour
        </button>
        <div className="flex items-center gap-2">
          {!isFirstStep && (
            <button
              onClick={onPrevious}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium text-secondary bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors"
            >
              <ArrowLeft2 size={14} color="currentColor" />
              Back
            </button>
          )}
          <button
            onClick={onNext}
            className="inline-flex items-center gap-1.5 px-4 py-1.5 text-sm font-medium text-white bg-brand-600 hover:bg-brand-700 rounded-lg transition-colors"
          >
            {isLastStep ? "Finish Tour" : "Next"}
            {!isLastStep && <ArrowRight2 size={14} color="currentColor" />}
          </button>
        </div>
      </div>

      {/* Arrow - positioned to point at target element */}
      {position && targetSelector && position.arrowPosition === "left" && (
        <div
          className="absolute w-3 h-3 bg-white dark:bg-gray-800 border-l border-b border-gray-200 dark:border-gray-700"
          style={{
            left: '-6px',
            top: position.arrowOffset ? `${Math.max(24, Math.min(position.arrowOffset, 280))}px` : '50%',
            transform: 'translateY(-50%) rotate(45deg)',
          }}
        />
      )}
      {position && targetSelector && position.arrowPosition === "right" && (
        <div
          className="absolute w-3 h-3 bg-white dark:bg-gray-800 border-r border-t border-gray-200 dark:border-gray-700"
          style={{
            right: '-6px',
            top: position.arrowOffset ? `${Math.max(24, Math.min(position.arrowOffset, 280))}px` : '50%',
            transform: 'translateY(-50%) rotate(45deg)',
          }}
        />
      )}
      {position && targetSelector && position.arrowPosition === "top" && (
        <div
          className="absolute w-3 h-3 bg-white dark:bg-gray-800 border-t border-l border-gray-200 dark:border-gray-700 -top-1.5 left-1/2 -translate-x-1/2 rotate-45"
        />
      )}
      {position && targetSelector && position.arrowPosition === "bottom" && (
        <div
          className="absolute w-3 h-3 bg-white dark:bg-gray-800 border-b border-r border-gray-200 dark:border-gray-700 -bottom-1.5 left-1/2 -translate-x-1/2 rotate-45"
        />
      )}
    </div>
  );

  return createPortal(tooltipContent, document.body);
}
