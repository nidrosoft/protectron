"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { TickCircle, Award, Star1 } from "iconsax-react";
import { cx } from "@/utils/cx";

export type MilestoneType = 
  | "first_ai_system"
  | "first_document"
  | "first_requirement"
  | "first_evidence"
  | "25_percent"
  | "50_percent"
  | "75_percent"
  | "100_percent";

interface MilestoneConfig {
  title: string;
  message: string;
  icon: string;
  color: string;
}

const MILESTONE_CONFIGS: Record<MilestoneType, MilestoneConfig> = {
  first_ai_system: {
    title: "First AI System Added!",
    message: "Great start! You've registered your first AI system.",
    icon: "🤖",
    color: "from-brand-500 to-brand-600",
  },
  first_document: {
    title: "First Document Generated!",
    message: "You've created your first compliance document.",
    icon: "📄",
    color: "from-purple-500 to-purple-600",
  },
  first_requirement: {
    title: "First Requirement Complete!",
    message: "You're making progress on your compliance journey.",
    icon: "✅",
    color: "from-success-500 to-success-600",
  },
  first_evidence: {
    title: "Evidence Uploaded!",
    message: "You've added proof of compliance.",
    icon: "🗃️",
    color: "from-warning-500 to-warning-600",
  },
  "25_percent": {
    title: "25% Compliant!",
    message: "You're a quarter of the way there. Keep going!",
    icon: "🌟",
    color: "from-blue-500 to-blue-600",
  },
  "50_percent": {
    title: "Halfway There!",
    message: "50% compliance achieved. Great progress!",
    icon: "⭐",
    color: "from-brand-500 to-purple-600",
  },
  "75_percent": {
    title: "Almost There!",
    message: "75% compliant. The finish line is in sight!",
    icon: "🏆",
    color: "from-warning-500 to-warning-600",
  },
  "100_percent": {
    title: "Fully Compliant!",
    message: "Congratulations! You've achieved 100% compliance.",
    icon: "🎉",
    color: "from-success-500 to-success-600",
  },
};

interface MilestoneCelebrationProps {
  milestone: MilestoneType;
  isVisible: boolean;
  onClose: () => void;
  autoCloseDelay?: number;
}

export function MilestoneCelebration({
  milestone,
  isVisible,
  onClose,
  autoCloseDelay = 4000,
}: MilestoneCelebrationProps) {
  const [mounted, setMounted] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    setMounted(true);
    return () => setMounted(false);
  }, []);

  useEffect(() => {
    if (isVisible) {
      setIsAnimating(true);
      const timer = setTimeout(() => {
        setIsAnimating(false);
        setTimeout(onClose, 300);
      }, autoCloseDelay);
      return () => clearTimeout(timer);
    }
  }, [isVisible, autoCloseDelay, onClose]);

  if (!mounted || !isVisible) return null;

  const config = MILESTONE_CONFIGS[milestone];

  const content = (
    <>
      {/* Confetti particles */}
      <div className="fixed inset-0 pointer-events-none z-[10002] overflow-hidden">
        {[...Array(30)].map((_, i) => (
          <div
            key={i}
            className="absolute animate-confetti-fast"
            style={{
              left: `${Math.random() * 100}%`,
              top: `-5%`,
              animationDelay: `${Math.random() * 0.5}s`,
              animationDuration: `${1.5 + Math.random()}s`,
            }}
          >
            <div
              className="w-2 h-2 rounded-sm"
              style={{
                backgroundColor: ['#8B5CF6', '#10B981', '#F59E0B', '#EF4444', '#3B82F6', '#EC4899'][Math.floor(Math.random() * 6)],
                transform: `rotate(${Math.random() * 360}deg)`,
              }}
            />
          </div>
        ))}
      </div>

      {/* Toast notification */}
      <div 
        className={cx(
          "fixed top-6 right-6 z-[10003] transition-all duration-300",
          isAnimating 
            ? "opacity-100 translate-x-0" 
            : "opacity-0 translate-x-full"
        )}
      >
        <div className={cx(
          "flex items-center gap-4 px-5 py-4 rounded-xl shadow-2xl bg-gradient-to-r text-white min-w-[320px]",
          config.color
        )}>
          {/* Icon */}
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-white/20 text-2xl">
            {config.icon}
          </div>

          {/* Content */}
          <div className="flex-1">
            <h4 className="font-bold text-white">{config.title}</h4>
            <p className="text-sm text-white/90">{config.message}</p>
          </div>

          {/* Close button */}
          <button
            onClick={() => {
              setIsAnimating(false);
              setTimeout(onClose, 300);
            }}
            className="text-white/70 hover:text-white transition-colors"
          >
            ×
          </button>
        </div>
      </div>

      {/* Animation styles */}
      <style jsx global>{`
        @keyframes confetti-fast {
          0% {
            transform: translateY(0) rotate(0deg);
            opacity: 1;
          }
          100% {
            transform: translateY(100vh) rotate(720deg);
            opacity: 0;
          }
        }
        .animate-confetti-fast {
          animation: confetti-fast linear forwards;
        }
      `}</style>
    </>
  );

  return createPortal(content, document.body);
}

// Hook to trigger milestone celebrations
export function useMilestoneCelebration() {
  const [currentMilestone, setCurrentMilestone] = useState<MilestoneType | null>(null);

  const celebrate = (milestone: MilestoneType) => {
    // Check if this milestone was already celebrated (stored in localStorage)
    const celebratedKey = `milestone_celebrated_${milestone}`;
    if (localStorage.getItem(celebratedKey)) {
      return;
    }

    setCurrentMilestone(milestone);
    localStorage.setItem(celebratedKey, "true");
  };

  const closeCelebration = () => {
    setCurrentMilestone(null);
  };

  return {
    currentMilestone,
    celebrate,
    closeCelebration,
    CelebrationComponent: currentMilestone ? (
      <MilestoneCelebration
        milestone={currentMilestone}
        isVisible={true}
        onClose={closeCelebration}
      />
    ) : null,
  };
}
