"use client";

import { useEffect, useState, useRef } from "react";
import { createPortal } from "react-dom";

interface SpotlightProps {
  targetSelector?: string;
  isActive: boolean;
  padding?: number;
  borderRadius?: number;
  onClickOutside?: () => void;
}

interface TargetRect {
  top: number;
  left: number;
  width: number;
  height: number;
}

export function Spotlight({
  targetSelector,
  isActive,
  padding = 12,
  borderRadius = 12,
  onClickOutside,
}: SpotlightProps) {
  const [targetRect, setTargetRect] = useState<TargetRect | null>(null);
  const [mounted, setMounted] = useState(false);
  const overlayRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setMounted(true);
    return () => setMounted(false);
  }, []);

  useEffect(() => {
    if (!isActive || !targetSelector) {
      setTargetRect(null);
      return;
    }

    const updatePosition = () => {
      const element = document.querySelector(targetSelector);
      if (element) {
        const rect = element.getBoundingClientRect();
        setTargetRect({
          top: rect.top - padding,
          left: rect.left - padding,
          width: rect.width + padding * 2,
          height: rect.height + padding * 2,
        });

        // Add highlight class to target element
        element.classList.add("walkthrough-target");
      } else {
        setTargetRect(null);
      }
    };

    // Initial position
    updatePosition();

    // Update on scroll and resize
    window.addEventListener("scroll", updatePosition, true);
    window.addEventListener("resize", updatePosition);

    // Observe DOM changes
    const observer = new MutationObserver(updatePosition);
    observer.observe(document.body, { childList: true, subtree: true });

    return () => {
      window.removeEventListener("scroll", updatePosition, true);
      window.removeEventListener("resize", updatePosition);
      observer.disconnect();

      // Remove highlight class
      if (targetSelector) {
        const element = document.querySelector(targetSelector);
        element?.classList.remove("walkthrough-target");
      }
    };
  }, [isActive, targetSelector, padding]);

  const handleOverlayClick = (e: React.MouseEvent) => {
    if (e.target === overlayRef.current && onClickOutside) {
      onClickOutside();
    }
  };

  if (!mounted || !isActive) return null;

  // Calculate the inset values for the rectangular cutout
  const getClipPath = () => {
    if (!targetRect) return "none";
    
    const { top, left, width, height } = targetRect;
    const right = left + width;
    const bottom = top + height;
    const r = borderRadius;
    
    // Create a rectangular cutout with rounded corners using polygon
    // This creates a full-screen overlay with a rectangular hole
    return `polygon(
      0% 0%, 
      0% 100%, 
      ${left}px 100%, 
      ${left}px ${bottom - r}px,
      ${left + r}px ${bottom}px,
      ${right - r}px ${bottom}px,
      ${right}px ${bottom - r}px,
      ${right}px ${top + r}px,
      ${right - r}px ${top}px,
      ${left + r}px ${top}px,
      ${left}px ${top + r}px,
      ${left}px 100%,
      100% 100%, 
      100% 0%
    )`;
  };

  const overlayContent = (
    <>
      {/* Dark overlay with rectangular cutout */}
      <div
        ref={overlayRef}
        className="fixed inset-0 z-[9998] transition-opacity duration-300 bg-black/75"
        onClick={handleOverlayClick}
        style={{
          clipPath: targetRect ? getClipPath() : "none",
        }}
      />

      {/* Spotlight border/glow effect - rectangular with rounded corners */}
      {targetRect && (
        <div
          className="fixed z-[9999] pointer-events-none border-2 border-purple-500"
          style={{
            top: targetRect.top,
            left: targetRect.left,
            width: targetRect.width,
            height: targetRect.height,
            borderRadius: borderRadius,
            boxShadow: "0 0 0 3px rgba(139, 92, 246, 0.6), 0 0 15px rgba(139, 92, 246, 0.4), inset 0 0 0 1px rgba(255, 255, 255, 0.1)",
            animation: "spotlight-pulse 2s ease-in-out infinite",
          }}
        />
      )}

      {/* Keyframes for pulse animation */}
      <style jsx global>{`
        @keyframes spotlight-pulse {
          0%, 100% {
            box-shadow: 0 0 0 3px rgba(139, 92, 246, 0.6), 0 0 15px rgba(139, 92, 246, 0.4), inset 0 0 0 1px rgba(255, 255, 255, 0.1);
          }
          50% {
            box-shadow: 0 0 0 5px rgba(139, 92, 246, 0.4), 0 0 25px rgba(139, 92, 246, 0.5), inset 0 0 0 1px rgba(255, 255, 255, 0.2);
          }
        }

        .walkthrough-target {
          position: relative;
          z-index: 9999 !important;
        }
      `}</style>
    </>
  );

  return createPortal(overlayContent, document.body);
}
