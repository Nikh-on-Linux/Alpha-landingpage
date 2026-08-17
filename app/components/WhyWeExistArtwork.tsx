"use client";
import React, { useEffect, useRef, useState } from "react";

interface WhyWeExistArtworkProps {
  className?: string;
  interactive?: boolean;
}

export default function WhyWeExistArtwork({
  className = "",
  interactive = true,
}: WhyWeExistArtworkProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const svgRef = useRef<SVGSVGElement>(null);
  
  // Refs for animation targets
  const centerParticlesRef = useRef<SVGGElement>(null);
  const orbitalLinesRef = useRef<SVGGElement>(null);
  const topHandRef = useRef<SVGGElement>(null);
  const bottomHandRef = useRef<SVGGElement>(null);
  const particleTransferRef = useRef<SVGGElement>(null);
  
  const [isVisible, setIsVisible] = useState(false);
  
  // Track mouse position for parallax (normalized -1 to 1)
  const mouseRef = useRef({ x: 0, y: 0, targetX: 0, targetY: 0 });

  // Generate particle data once
  const PARTICLE_COUNT = 300;
  const particles = useRef(
    Array.from({ length: PARTICLE_COUNT }).map(() => {
      // Create a spherical distribution
      const theta = Math.random() * 2 * Math.PI;
      const phi = Math.acos((Math.random() * 2) - 1);
      const r = 30 + Math.random() * 60; // radius between 30 and 90
      
      const x = r * Math.sin(phi) * Math.cos(theta);
      const y = r * Math.sin(phi) * Math.sin(theta);
      const z = r * Math.cos(phi);
      
      return {
        baseX: x,
        baseY: y,
        z: z, // For parallax and sizing
        size: 0.5 + Math.random() * 1.5,
        speed: 0.2 + Math.random() * 0.8,
        angle: Math.random() * Math.PI * 2,
        opacity: 0.2 + Math.random() * 0.8,
        color: Math.random() > 0.7 ? '#4fd1c5' : (Math.random() > 0.5 ? '#90cdf4' : '#ffffff'), // Teal, Cyan, White
      };
    })
  );

  // Transfer particles (between hands and center)
  const TRANSFER_COUNT = 15;
  const transferParticles = useRef(
    Array.from({ length: TRANSFER_COUNT }).map(() => ({
      x: 0,
      y: 0,
      progress: Math.random(), // 0 to 1
      speed: 0.002 + Math.random() * 0.003,
      direction: Math.random() > 0.5 ? 1 : -1, // 1: top to bottom, -1: bottom to top
      size: 1 + Math.random(),
      opacity: 0,
      delay: Math.random() * 5, // random delay before starting
    }))
  );

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          setIsVisible(entry.isIntersecting);
        });
      },
      { threshold: 0.1 }
    );

    if (containerRef.current) {
      observer.observe(containerRef.current);
    }

    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!interactive) return;

    const handleMouseMove = (e: MouseEvent) => {
      if (!containerRef.current) return;
      
      const rect = containerRef.current.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;
      
      // Calculate distance from center, normalized -1 to 1
      // Only react if mouse is somewhat nearby (within 2-3x the width)
      const dist = Math.sqrt(Math.pow(e.clientX - centerX, 2) + Math.pow(e.clientY - centerY, 2));
      const maxDist = 800;
      
      if (dist < maxDist) {
        const influence = 1 - (dist / maxDist);
        mouseRef.current.targetX = ((e.clientX - centerX) / (rect.width / 2)) * influence;
        mouseRef.current.targetY = ((e.clientY - centerY) / (rect.height / 2)) * influence;
      } else {
        mouseRef.current.targetX = 0;
        mouseRef.current.targetY = 0;
      }
    };

    const handleMouseLeave = () => {
      mouseRef.current.targetX = 0;
      mouseRef.current.targetY = 0;
    };

    window.addEventListener("mousemove", handleMouseMove);
    containerRef.current?.addEventListener("mouseleave", handleMouseLeave);
    
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      containerRef.current?.removeEventListener("mouseleave", handleMouseLeave);
    };
  }, [interactive]);

  // Main animation loop
  useEffect(() => {
    if (!isVisible) return;

    let animationFrameId: number;
    let time = 0;

    const render = () => {
      time += 0.01;
      
      // Smoothly interpolate mouse position
      mouseRef.current.x += (mouseRef.current.targetX - mouseRef.current.x) * 0.05;
      mouseRef.current.y += (mouseRef.current.targetY - mouseRef.current.y) * 0.05;
      
      const mx = mouseRef.current.x;
      const my = mouseRef.current.y;

      // Animate center particles
      if (centerParticlesRef.current) {
        const children = centerParticlesRef.current.children;
        const pData = particles.current;
        
        for (let i = 0; i < pData.length; i++) {
          const p = pData[i];
          const node = children[i] as SVGCircleElement;
          
          if (!node) continue;
          
          // Organic drift
          const driftX = Math.sin(time * p.speed + p.angle) * 10;
          const driftY = Math.cos(time * p.speed * 0.8 + p.angle) * 10;
          
          // Mouse parallax based on Z-depth
          const parallaxFactor = (p.z + 100) / 200; // 0 to 1
          const pmx = mx * 30 * parallaxFactor;
          const pmy = my * 30 * parallaxFactor;
          
          const x = p.baseX + driftX + pmx;
          const y = p.baseY + driftY + pmy;
          
          node.setAttribute("cx", x.toFixed(2));
          node.setAttribute("cy", y.toFixed(2));
          
          // Subtle opacity pulsing
          const pulse = (Math.sin(time * 2 + p.angle) + 1) / 2; // 0 to 1
          node.setAttribute("opacity", (p.opacity * (0.5 + pulse * 0.5)).toFixed(2));
        }
        
        // Group parallax
        centerParticlesRef.current.setAttribute(
          "transform",
          `translate(200, 400) rotate(${time * 5})`
        );
      }
      
      // Animate orbital lines
      if (orbitalLinesRef.current) {
        orbitalLinesRef.current.setAttribute(
          "transform",
          `translate(200, 400) rotate(${-time * 2}) scale(${1 + mx * 0.05}, ${1 + my * 0.05})`
        );
      }
      
      // Animate Hands (Subtle parallax)
      if (topHandRef.current) {
        topHandRef.current.setAttribute(
          "transform",
          `translate(${mx * -10}, ${Math.sin(time) * 5 + my * -10})`
        );
      }
      if (bottomHandRef.current) {
        bottomHandRef.current.setAttribute(
          "transform",
          `translate(${mx * 10}, ${Math.sin(time + Math.PI) * 5 + my * 10})`
        );
      }
      
      // Animate transfer particles
      if (particleTransferRef.current) {
        const children = particleTransferRef.current.children;
        const tData = transferParticles.current;
        
        for (let i = 0; i < tData.length; i++) {
          const t = tData[i];
          const node = children[i] as SVGCircleElement;
          
          if (!node) continue;
          
          if (t.delay > 0) {
            t.delay -= 0.01;
            continue;
          }
          
          t.progress += t.speed;
          if (t.progress >= 1) {
            t.progress = 0;
            t.delay = Math.random() * 3;
            t.direction = Math.random() > 0.5 ? 1 : -1;
          }
          
          // Path: from top hand (y=200) to bottom hand (y=600)
          // Add some horizontal wandering
          const startY = t.direction === 1 ? 150 : 650;
          const endY = t.direction === 1 ? 650 : 150;
          
          // Ease in out
          const easeProgress = t.progress < 0.5 
            ? 2 * t.progress * t.progress 
            : 1 - Math.pow(-2 * t.progress + 2, 2) / 2;
            
          const y = startY + (endY - startY) * easeProgress;
          
          // X wanders towards center then away
          const xOffset = Math.sin(t.progress * Math.PI) * (Math.sin(time + i) * 30);
          const x = 200 + xOffset;
          
          // Fade in and out at ends
          let opacity = 0;
          if (t.progress > 0.1 && t.progress < 0.9) {
            opacity = Math.sin((t.progress - 0.1) * (1/0.8) * Math.PI) * 0.8;
          }
          
          node.setAttribute("cx", x.toFixed(2));
          node.setAttribute("cy", y.toFixed(2));
          node.setAttribute("opacity", opacity.toFixed(2));
        }
      }

      animationFrameId = requestAnimationFrame(render);
    };

    animationFrameId = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(animationFrameId);
    };
  }, [isVisible]);

  // SVG Paths for Hands (Stylized, elegant contours)
  // Top hand descending
  const topHandPath = "M 220,-20 C 210,80 180,150 140,220 C 130,240 115,260 105,280 C 100,290 110,300 120,290 C 135,270 155,230 170,200 C 160,250 145,290 135,320 C 130,330 140,340 150,330 C 165,300 180,250 190,210 C 185,260 175,300 165,330 C 160,340 170,350 180,340 C 200,300 215,250 220,190 C 225,230 220,260 210,290 C 205,300 215,310 225,300 C 240,260 250,200 250,150 C 250,100 240,50 240,-20";
  
  // Bottom hand ascending
  const bottomHandPath = "M 180,820 C 190,720 220,650 260,580 C 270,560 285,540 295,520 C 300,510 290,500 280,510 C 265,530 245,570 230,600 C 240,550 255,510 265,480 C 270,470 260,460 250,470 C 235,500 220,550 210,590 C 215,540 225,500 235,470 C 240,460 230,450 220,460 C 200,500 185,550 180,610 C 175,570 180,540 190,510 C 195,500 185,490 175,500 C 160,540 150,600 150,650 C 150,700 160,750 160,820";

  return (
    <div
      ref={containerRef}
      className={`relative w-full h-full flex items-center justify-center overflow-visible ${className}`}
      style={{
        opacity: isVisible ? 1 : 0,
        transition: "opacity 1.5s cubic-bezier(0.22, 1, 0.36, 1)",
      }}
    >
      <svg
        ref={svgRef}
        viewBox="0 0 400 800"
        className="w-full h-auto max-h-[800px] overflow-visible"
        style={{ filter: "drop-shadow(0 0 40px rgba(79, 209, 197, 0.1))" }}
      >
        <defs>
          <radialGradient id="centerGlow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="rgba(79, 209, 197, 0.4)" />
            <stop offset="40%" stopColor="rgba(79, 209, 197, 0.1)" />
            <stop offset="100%" stopColor="rgba(0, 0, 0, 0)" />
          </radialGradient>
          
          <linearGradient id="topHandGrad" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="rgba(255, 255, 255, 0.05)" />
            <stop offset="70%" stopColor="rgba(255, 255, 255, 0.3)" />
            <stop offset="100%" stopColor="rgba(144, 205, 244, 0.6)" />
          </linearGradient>

          <linearGradient id="bottomHandGrad" x1="0%" y1="100%" x2="0%" y2="0%">
            <stop offset="0%" stopColor="rgba(255, 255, 255, 0.05)" />
            <stop offset="70%" stopColor="rgba(255, 255, 255, 0.3)" />
            <stop offset="100%" stopColor="rgba(144, 205, 244, 0.6)" />
          </linearGradient>

          <filter id="glow">
            <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
            <feMerge>
              <feMergeNode in="coloredBlur"/>
              <feMergeNode in="SourceGraphic"/>
            </feMerge>
          </filter>
        </defs>

        {/* Central Glow Background */}
        <circle cx="200" cy="400" r="150" fill="url(#centerGlow)" className="transition-opacity duration-1000" style={{ opacity: isVisible ? 1 : 0 }} />

        {/* Top Hand */}
        <g ref={topHandRef} className="transition-transform duration-1000 ease-out" style={{ transform: isVisible ? 'translateY(0)' : 'translateY(-40px)' }}>
          {/* Multiple stroked paths slightly offset to simulate the dot mesh */}
          <path d={topHandPath} fill="none" stroke="url(#topHandGrad)" strokeWidth="1" strokeDasharray="1 6" strokeLinecap="round" opacity="0.8" />
          <path d={topHandPath} fill="none" stroke="url(#topHandGrad)" strokeWidth="0.5" strokeDasharray="1 8" strokeLinecap="round" opacity="0.5" transform="translate(-2, 0)" />
          <path d={topHandPath} fill="none" stroke="url(#topHandGrad)" strokeWidth="0.5" strokeDasharray="1 8" strokeLinecap="round" opacity="0.5" transform="translate(2, 0)" />
          <path d={topHandPath} fill="none" stroke="url(#topHandGrad)" strokeWidth="0.5" strokeDasharray="1 10" strokeLinecap="round" opacity="0.3" transform="scale(0.98) translate(4, 4)" />
        </g>

        {/* Bottom Hand */}
        <g ref={bottomHandRef} className="transition-transform duration-1000 ease-out" style={{ transform: isVisible ? 'translateY(0)' : 'translateY(40px)' }}>
          <path d={bottomHandPath} fill="none" stroke="url(#bottomHandGrad)" strokeWidth="1" strokeDasharray="1 6" strokeLinecap="round" opacity="0.8" />
          <path d={bottomHandPath} fill="none" stroke="url(#bottomHandGrad)" strokeWidth="0.5" strokeDasharray="1 8" strokeLinecap="round" opacity="0.5" transform="translate(2, 0)" />
          <path d={bottomHandPath} fill="none" stroke="url(#bottomHandGrad)" strokeWidth="0.5" strokeDasharray="1 8" strokeLinecap="round" opacity="0.5" transform="translate(-2, 0)" />
          <path d={bottomHandPath} fill="none" stroke="url(#bottomHandGrad)" strokeWidth="0.5" strokeDasharray="1 10" strokeLinecap="round" opacity="0.3" transform="scale(0.98) translate(4, -4)" />
        </g>

        {/* Orbital Lines */}
        <g ref={orbitalLinesRef} className="opacity-40" stroke="rgba(144, 205, 244, 0.3)" strokeWidth="0.5" fill="none">
          <ellipse cx="0" cy="0" rx="90" ry="30" transform="rotate(20)" strokeDasharray="4 8" />
          <ellipse cx="0" cy="0" rx="110" ry="40" transform="rotate(-40)" strokeDasharray="2 12" />
          <ellipse cx="0" cy="0" rx="70" ry="120" transform="rotate(70)" strokeDasharray="1 6" />
        </g>

        {/* Central Particle Object */}
        <g ref={centerParticlesRef}>
          {particles.current.map((p, i) => (
            <circle
              key={i}
              cx={p.baseX}
              cy={p.baseY}
              r={p.size}
              fill={p.color}
              opacity={p.opacity}
            />
          ))}
        </g>

        {/* Transfer Particles (flowing between hands) */}
        <g ref={particleTransferRef} filter="url(#glow)">
          {transferParticles.current.map((_, i) => (
            <circle
              key={`t-${i}`}
              cx="200"
              cy="400"
              r="2"
              fill="#4fd1c5" // teal
              opacity="0"
            />
          ))}
        </g>
      </svg>
    </div>
  );
}
