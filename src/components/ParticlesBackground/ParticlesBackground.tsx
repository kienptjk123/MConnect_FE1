"use client";

import React, { useEffect, useRef } from "react";

interface Particle {
  x: number;
  y: number;
  radius: number;
  color: string;
  dx: number;
  dy: number;
}

interface ParticlesBackgroundProps {
  colors?: string[];
  count?: number;
  size?: number;
  speed?: number;
  zIndex?: number;
  height?: string;
}

const ParticlesBackground: React.FC<ParticlesBackgroundProps> = ({
  colors = ["#00eaff", "#ff00f0", "#ff223e", "#ff7300", "#5d1eb2"],
  count = 60,
  size = 2.8,
  speed = 0.6,
  zIndex = 0,
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = canvas.offsetHeight;
    };
    resize();
    window.addEventListener("resize", resize);

    const particles: Particle[] = Array.from({ length: count }, () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      radius: Math.random() * size + 1,
      color: colors[Math.floor(Math.random() * colors.length)],
      dx: (Math.random() - 0.5) * speed,
      dy: (Math.random() - 0.5) * speed,
    }));

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      for (const p of particles) {
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fillStyle = p.color;
        ctx.shadowColor = p.color;
        ctx.shadowBlur = 8;
        ctx.fill();

        // update position
        p.x += p.dx;
        p.y += p.dy;

        // bounce back at edges
        if (p.x < 0 || p.x > canvas.width) p.dx *= -1;
        if (p.y < 0 || p.y > canvas.height) p.dy *= -1;
      }
      requestAnimationFrame(draw);
    };

    draw();
    return () => {
      window.removeEventListener("resize", resize);
    };
  }, [colors, count, size, speed]);

  return (
    <div
      style={{
        position: "absolute",
        top: 0,
        left: 0,
        width: "100%",
        height: "8000px",
        zIndex,
        overflow: "hidden",
        pointerEvents: "none",
      }}
    >
      <canvas ref={canvasRef} style={{ width: "100%", height: "100%" }} />
    </div>
  );
};

export default ParticlesBackground;
