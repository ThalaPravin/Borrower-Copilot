"use client";

import React, { useEffect, useRef } from "react";
import { useTheme } from "next-themes";

interface Particle {
  x0: number;
  y0: number;
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
}

interface RippleRing {
  x: number;
  y: number;
  radius: number;
  maxRadius: number;
  alpha: number;
  color: string;
}

export function WaterRippleBackground() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const { resolvedTheme } = useTheme();

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationFrameId: number;
    let width = 0;
    let height = 0;
    let particles: Particle[] = [];
    let ripples: RippleRing[] = [];
    let mouse = { x: -1000, y: -1000, lastX: -1000, lastY: -1000, active: false };

    const GRID_SPACING = 36; // spacing between grid nodes
    const REPEL_RADIUS = 140; // radius within which mouse repels liquid nodes
    const REPEL_STRENGTH = 18; // force of repulsion
    const SPRING_K = 0.04; // tension returning nodes to base grid
    const DAMPING = 0.88; // velocity dampening

    const handleResize = () => {
      width = window.innerWidth;
      height = window.innerHeight;
      const dpr = window.devicePixelRatio || 1;
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      ctx.scale(dpr, dpr);

      // Re-initialize particles
      particles = [];
      const cols = Math.ceil(width / GRID_SPACING) + 1;
      const rows = Math.ceil(height / GRID_SPACING) + 1;

      for (let i = 0; i < cols; i++) {
        for (let j = 0; j < rows; j++) {
          const x0 = i * GRID_SPACING;
          const y0 = j * GRID_SPACING;
          particles.push({
            x0,
            y0,
            x: x0,
            y: y0,
            vx: 0,
            vy: 0,
            radius: 1.5,
          });
        }
      }
    };

    handleResize();
    window.addEventListener("resize", handleResize);

    const handleMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      const newX = e.clientX - rect.left;
      const newY = e.clientY - rect.top;

      // Spawn ripple ring if mouse moved significantly
      const distMoved = Math.hypot(newX - mouse.lastX, newY - mouse.lastY);
      if (distMoved > 20) {
        mouse.lastX = newX;
        mouse.lastY = newY;

        const isDark = resolvedTheme === "dark" || !resolvedTheme;
        ripples.push({
          x: newX,
          y: newY,
          radius: 4,
          maxRadius: 80 + Math.min(distMoved * 1.2, 70),
          alpha: 0.45,
          color: isDark ? "16, 185, 129" : "13, 148, 136", // Emerald / Teal RGB
        });
      }

      mouse.x = newX;
      mouse.y = newY;
      mouse.active = true;
    };

    const handleMouseLeave = () => {
      mouse.active = false;
      mouse.x = -1000;
      mouse.y = -1000;
    };

    window.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseleave", handleMouseLeave);

    const render = () => {
      ctx.clearRect(0, 0, width, height);

      const isDark = resolvedTheme === "dark" || !resolvedTheme;

      // Color scheme according to theme
      const dotColor = isDark ? "rgba(52, 211, 153, 0.18)" : "rgba(13, 148, 136, 0.18)";
      const dotRepelledColor = isDark ? "rgba(52, 211, 153, 0.75)" : "rgba(16, 185, 129, 0.75)";
      const lineColor = isDark ? "rgba(16, 185, 129, 0.05)" : "rgba(13, 148, 136, 0.06)";

      // Update & render ripple rings
      for (let i = ripples.length - 1; i >= 0; i--) {
        const r = ripples[i];
        r.radius += 2.2;
        r.alpha -= 0.012;

        if (r.alpha <= 0 || r.radius >= r.maxRadius) {
          ripples.splice(i, 1);
          continue;
        }

        ctx.save();
        ctx.beginPath();
        ctx.arc(r.x, r.y, r.radius, 0, Math.PI * 2);
        ctx.strokeStyle = `rgba(${r.color}, ${Math.max(0, r.alpha)})`;
        ctx.lineWidth = 1.8;
        ctx.stroke();
        ctx.restore();
      }

      // Update particle physics (repel & spring return)
      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];

        if (mouse.active) {
          const dx = p.x - mouse.x;
          const dy = p.y - mouse.y;
          const dist = Math.hypot(dx, dy);

          if (dist < REPEL_RADIUS && dist > 0) {
            const force = (1 - dist / REPEL_RADIUS) ** 2 * REPEL_STRENGTH;
            const angle = Math.atan2(dy, dx);
            p.vx += Math.cos(angle) * force;
            p.vy += Math.sin(angle) * force;
          }
        }

        // Spring acceleration back to origin
        const ax = (p.x0 - p.x) * SPRING_K;
        const ay = (p.y0 - p.y) * SPRING_K;

        p.vx = (p.vx + ax) * DAMPING;
        p.vy = (p.vy + ay) * DAMPING;

        p.x += p.vx;
        p.y += p.vy;
      }

      // Draw light connecting grid lines
      ctx.beginPath();
      ctx.strokeStyle = lineColor;
      ctx.lineWidth = 0.8;
      const cols = Math.ceil(width / GRID_SPACING) + 1;
      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];
        // Connect to right neighbor
        if ((i + 1) % cols !== 0 && i + 1 < particles.length) {
          const rightP = particles[i + 1];
          ctx.moveTo(p.x, p.y);
          ctx.lineTo(rightP.x, rightP.y);
        }
        // Connect to bottom neighbor
        if (i + cols < particles.length) {
          const bottomP = particles[i + cols];
          ctx.moveTo(p.x, p.y);
          ctx.lineTo(bottomP.x, bottomP.y);
        }
      }
      ctx.stroke();

      // Render grid dots
      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];
        const disp = Math.hypot(p.x - p.x0, p.y - p.y0);

        ctx.beginPath();
        const drawRadius = p.radius + Math.min(disp * 0.1, 2.5);
        ctx.arc(p.x, p.y, drawRadius, 0, Math.PI * 2);

        if (disp > 2) {
          ctx.fillStyle = dotRepelledColor;
        } else {
          ctx.fillStyle = dotColor;
        }
        ctx.fill();
      }

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseleave", handleMouseLeave);
      cancelAnimationFrame(animationFrameId);
    };
  }, [resolvedTheme]);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-[-1] transition-opacity duration-500"
      style={{ opacity: 0.85 }}
    />
  );
}
