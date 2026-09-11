"use client";

import React, { useState, useRef } from "react";
import { cn } from "@/lib/utils";

export interface SpotlightCardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  spotlightColor?: string;
  className?: string;
}

export function SpotlightCard({
  children,
  spotlightColor = "rgba(16, 185, 129, 0.15)",
  className,
  ...props
}: SpotlightCardProps) {
  const divRef = useRef<HTMLDivElement>(null);
  const [position, setPosition] = useState<{ x: number; y: number }>({ x: -500, y: -500 });
  const [opacity, setOpacity] = useState<number>(0);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!divRef.current) return;
    const rect = divRef.current.getBoundingClientRect();
    setPosition({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    });
  };

  const handleMouseEnter = () => {
    setOpacity(1);
  };

  const handleMouseLeave = () => {
    setOpacity(0);
  };

  return (
    <div
      ref={divRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      className={cn(
        "relative overflow-hidden rounded-2xl border border-slate-200/90 dark:border-slate-800/90 bg-white/90 dark:bg-slate-900/90 shadow-xl backdrop-blur-md transition-all duration-300",
        className
      )}
      {...props}
    >
      {/* Top Glass Shimmer Line */}
      <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-emerald-500/40 to-transparent pointer-events-none" />

      {/* Floating Ambient Light Orbs at Corners */}
      <div className="absolute -top-12 -left-12 w-36 h-36 rounded-full bg-emerald-500/10 dark:bg-emerald-500/15 blur-2xl pointer-events-none animate-pulse" />
      <div className="absolute -bottom-12 -right-12 w-40 h-40 rounded-full bg-teal-500/10 dark:bg-teal-500/15 blur-2xl pointer-events-none animate-pulse" />

      {/* Interactive Cursor Tracking Spotlight */}
      <div
        className="pointer-events-none absolute inset-0 transition-opacity duration-500 ease-out"
        style={{
          opacity,
          background: `radial-gradient(550px circle at ${position.x}px ${position.y}px, ${spotlightColor}, transparent 75%)`,
        }}
      />

      {/* Interactive Border Glow Mask */}
      <div
        className="pointer-events-none absolute -inset-px rounded-2xl transition-opacity duration-500 ease-out"
        style={{
          opacity,
          background: `radial-gradient(400px circle at ${position.x}px ${position.y}px, rgba(16, 185, 129, 0.4), transparent 70%)`,
          maskImage: "linear-gradient(black, black) content-box, linear-gradient(black, black)",
          WebkitMaskImage: "linear-gradient(black, black) content-box, linear-gradient(black, black)",
          maskComposite: "exclude",
          WebkitMaskComposite: "xor",
          padding: "1.5px",
        }}
      />

      {/* Card Content */}
      <div className="relative z-10">{children}</div>
    </div>
  );
}
