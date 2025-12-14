"use client";

import { useEffect, useState } from "react";
import { cx } from "@/utils/cx";

// Animated counter hook
function useAnimatedCounter(end: number, duration: number = 2000, delay: number = 0) {
  const [count, setCount] = useState(0);
  
  useEffect(() => {
    const timeout = setTimeout(() => {
      let startTime: number;
      const animate = (currentTime: number) => {
        if (!startTime) startTime = currentTime;
        const progress = Math.min((currentTime - startTime) / duration, 1);
        const easeOut = 1 - Math.pow(1 - progress, 3);
        setCount(Math.floor(easeOut * end));
        if (progress < 1) {
          requestAnimationFrame(animate);
        }
      };
      requestAnimationFrame(animate);
    }, delay);
    return () => clearTimeout(timeout);
  }, [end, duration, delay]);
  
  return count;
}

interface ProgressRingProps {
  progress: number;
  size?: number;
  strokeWidth?: number;
  color: string;
}

export const ProgressRing = ({ progress, size = 200, strokeWidth = 16, color }: ProgressRingProps) => {
  const [animatedProgress, setAnimatedProgress] = useState(0);
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const offset = circumference - (animatedProgress / 100) * circumference;
  const animatedCount = useAnimatedCounter(progress, 2000, 500);

  useEffect(() => {
    const timeout = setTimeout(() => {
      setAnimatedProgress(progress);
    }, 500);
    return () => clearTimeout(timeout);
  }, [progress]);

  return (
    <div className="relative" style={{ width: size, height: size }}>
      <svg className="transform -rotate-90" width={size} height={size}>
        <circle
          className="text-gray-100"
          strokeWidth={strokeWidth}
          stroke="currentColor"
          fill="transparent"
          r={radius}
          cx={size / 2}
          cy={size / 2}
        />
        <circle
          className={cx("transition-all duration-[2000ms] ease-out", color)}
          strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
          stroke="currentColor"
          fill="transparent"
          r={radius}
          cx={size / 2}
          cy={size / 2}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className={cx("text-5xl font-bold", color.replace("-500", "-600"))}>
          {animatedCount}%
        </span>
        <span className="text-sm text-tertiary mt-1">Compliance Score</span>
      </div>
    </div>
  );
};

export default ProgressRing;
