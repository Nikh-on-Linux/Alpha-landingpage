"use client";
import React, { useRef, useState, useEffect, useCallback, useMemo } from "react";
import styles from "./PhilosophyGraph.module.css";

// ─── Data ──────────────────────────────────────────────────────────

interface PhilosophyNode {
  id: string;
  title: string;
  subtitle: string;
  text: string;
  /** Position as fraction of viewport (0-1) */
  x: number;
  y: number;
  radius: number;
  isPrimary: boolean;
}

interface Edge {
  from: string;
  to: string;
}

const PRIMARY_NODES: PhilosophyNode[] = [
  {
    id: "believe",
    title: "We Believe",
    subtitle: "Doctors need to be empowered by AI, not replaced.",
    text: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Itaque asperiores nam, a, porro nisi fugit est nesciunt magnam laudantium laborum ex. Praesentium dolorem earum molestiae adipisci voluptas veniam quia blanditiis, temporibus, reiciendis neque asperiores consectetur itaque atque magni saepe reprehenderit accusamus? Libero expedita asperiores quibusdam neque consequuntur saepe ex earum tempora veritatis omnis!",
    x: 0.25,
    y: 0.3,
    radius: 6,
    isPrimary: true,
  },
  {
    id: "culture",
    title: "SLM Culture",
    subtitle: "Accuracy does not demand large models.",
    text: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Itaque asperiores nam, a, porro nisi fugit est nesciunt magnam laudantium laborum ex. Praesentium dolorem earum molestiae adipisci voluptas veniam quia blanditiis, temporibus, reiciendis neque asperiores consectetur itaque atque magni saepe reprehenderit accusamus? Quidem necessitatibus ducimus reprehenderit voluptas et modi iure deleniti harum rem dolores itaque explicabo.",
    x: 0.72,
    y: 0.35,
    radius: 6,
    isPrimary: true,
  },
  {
    id: "opinion",
    title: "Quick 2nd Opinion",
    subtitle: "Second opinion has the potential to deliver efficient medicare.",
    text: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Itaque asperiores nam, a, porro nisi fugit est nesciunt magnam laudantium laborum ex. Praesentium dolorem earum molestiae adipisci voluptas veniam quia blanditiis, temporibus, reiciendis neque asperiores consectetur itaque atque magni saepe reprehenderit accusamus? Est sint voluptas delectus, tempore architecto, iure velit incidunt quaerat unde molestiae.",
    x: 0.48,
    y: 0.72,
    radius: 6,
    isPrimary: true,
  },
];

// Decorative sub-nodes that fill the constellation
const SUB_NODES: PhilosophyNode[] = [
  { id: "s1", title: "", subtitle: "", text: "", x: 0.12, y: 0.18, radius: 2, isPrimary: false },
  { id: "s2", title: "", subtitle: "", text: "", x: 0.38, y: 0.15, radius: 2.5, isPrimary: false },
  { id: "s3", title: "", subtitle: "", text: "", x: 0.58, y: 0.18, radius: 1.5, isPrimary: false },
  { id: "s4", title: "", subtitle: "", text: "", x: 0.85, y: 0.25, radius: 2, isPrimary: false },
  { id: "s5", title: "", subtitle: "", text: "", x: 0.15, y: 0.52, radius: 1.5, isPrimary: false },
  { id: "s6", title: "", subtitle: "", text: "", x: 0.48, y: 0.45, radius: 3, isPrimary: false },
  { id: "s7", title: "", subtitle: "", text: "", x: 0.82, y: 0.55, radius: 2, isPrimary: false },
  { id: "s8", title: "", subtitle: "", text: "", x: 0.3, y: 0.62, radius: 1.5, isPrimary: false },
  { id: "s9", title: "", subtitle: "", text: "", x: 0.68, y: 0.68, radius: 2, isPrimary: false },
  { id: "s10", title: "", subtitle: "", text: "", x: 0.2, y: 0.82, radius: 1.5, isPrimary: false },
  { id: "s11", title: "", subtitle: "", text: "", x: 0.75, y: 0.85, radius: 2, isPrimary: false },
  { id: "s12", title: "", subtitle: "", text: "", x: 0.55, y: 0.9, radius: 1.5, isPrimary: false },
  { id: "s13", title: "", subtitle: "", text: "", x: 0.9, y: 0.42, radius: 1.5, isPrimary: false },
  { id: "s14", title: "", subtitle: "", text: "", x: 0.08, y: 0.38, radius: 1.5, isPrimary: false },
  { id: "s15", title: "", subtitle: "", text: "", x: 0.42, y: 0.85, radius: 2, isPrimary: false },
];

const ALL_NODES = [...PRIMARY_NODES, ...SUB_NODES];

// Edges: connect primaries to each other and to nearby sub-nodes
const EDGES: Edge[] = [
  // Primary connections (triangle)
  { from: "believe", to: "culture" },
  { from: "culture", to: "opinion" },
  { from: "opinion", to: "believe" },
  // Primary → sub connections
  { from: "believe", to: "s1" },
  { from: "believe", to: "s2" },
  { from: "believe", to: "s5" },
  { from: "believe", to: "s14" },
  { from: "culture", to: "s3" },
  { from: "culture", to: "s4" },
  { from: "culture", to: "s7" },
  { from: "culture", to: "s13" },
  { from: "opinion", to: "s8" },
  { from: "opinion", to: "s9" },
  { from: "opinion", to: "s10" },
  { from: "opinion", to: "s11" },
  { from: "opinion", to: "s15" },
  // Sub → sub (sparse, for constellation feel)
  { from: "s6", to: "believe" },
  { from: "s6", to: "culture" },
  { from: "s6", to: "opinion" },
  { from: "s2", to: "s3" },
  { from: "s12", to: "s15" },
  { from: "s10", to: "s8" },
  { from: "s11", to: "s12" },
  { from: "s1", to: "s14" },
  { from: "s4", to: "s13" },
];

// ─── Edge particles ────────────────────────────────────────────────

interface EdgeParticle {
  edgeIndex: number;
  progress: number; // 0-1 along the edge
  speed: number;
  size: number;
  opacity: number;
}

function createEdgeParticles(count: number): EdgeParticle[] {
  return Array.from({ length: count }, () => ({
    edgeIndex: Math.floor(Math.random() * EDGES.length),
    progress: Math.random(),
    speed: 0.0005 + Math.random() * 0.002,
    size: 1 + Math.random() * 1.5,
    opacity: 0.15 + Math.random() * 0.4,
  }));
}

// ─── Component ─────────────────────────────────────────────────────

export default function PhilosophyGraph() {
  const containerRef = useRef<HTMLDivElement>(null);
  const svgRef = useRef<SVGSVGElement>(null);
  const edgeParticleGroupRef = useRef<SVGGElement>(null);
  const nodeGroupRef = useRef<SVGGElement>(null);

  const [selectedNode, setSelectedNode] = useState<PhilosophyNode | null>(null);
  const [isVisible, setIsVisible] = useState(false);
  const [dims, setDims] = useState({ w: 1200, h: 800 });

  const mouseRef = useRef({ x: 0.5, y: 0.5, tx: 0.5, ty: 0.5 });
  const hoveredRef = useRef<string | null>(null);
  const edgeParticlesRef = useRef<EdgeParticle[]>(createEdgeParticles(50));
  const prefersReducedMotion = useRef(false);

  // Check for reduced motion
  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    prefersReducedMotion.current = mq.matches;
    const handler = (e: MediaQueryListEvent) => {
      prefersReducedMotion.current = e.matches;
    };
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, []);

  // Observe visibility
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => setIsVisible(entry.isIntersecting),
      { threshold: 0.05 }
    );
    if (containerRef.current) observer.observe(containerRef.current);
    return () => observer.disconnect();
  }, []);

  // Track dimensions
  useEffect(() => {
    const update = () => {
      if (containerRef.current) {
        const { clientWidth, clientHeight } = containerRef.current;
        setDims({ w: clientWidth, h: clientHeight });
      }
    };
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);

  // Mouse tracking
  useEffect(() => {
    const handleMove = (e: MouseEvent) => {
      if (!containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      mouseRef.current.tx = (e.clientX - rect.left) / rect.width;
      mouseRef.current.ty = (e.clientY - rect.top) / rect.height;
    };
    window.addEventListener("mousemove", handleMove);
    return () => window.removeEventListener("mousemove", handleMove);
  }, []);

  // Resolve node positions in px
  const nodePositions = useMemo(() => {
    const map: Record<string, { x: number; y: number }> = {};
    ALL_NODES.forEach((n) => {
      map[n.id] = { x: n.x * dims.w, y: n.y * dims.h };
    });
    return map;
  }, [dims]);

  // ─── Animation Loop ──────────────────────────────────────────────
  useEffect(() => {
    if (!isVisible || prefersReducedMotion.current) return;

    let raf: number;
    let t = 0;

    const tick = () => {
      t += 0.005;

      // Smooth mouse
      mouseRef.current.x += (mouseRef.current.tx - mouseRef.current.x) * 0.04;
      mouseRef.current.y += (mouseRef.current.ty - mouseRef.current.y) * 0.04;

      const mx = mouseRef.current.x;
      const my = mouseRef.current.y;

      // ── Animate edge particles ──
      const epGroup = edgeParticleGroupRef.current;
      if (epGroup) {
        const particles = edgeParticlesRef.current;
        const children = epGroup.children;
        for (let i = 0; i < particles.length; i++) {
          const p = particles[i];
          const el = children[i] as SVGCircleElement;
          if (!el) continue;

          p.progress += p.speed;
          if (p.progress > 1) {
            p.progress = 0;
            p.edgeIndex = Math.floor(Math.random() * EDGES.length);
          }

          const edge = EDGES[p.edgeIndex];
          const fromPos = nodePositions[edge.from];
          const toPos = nodePositions[edge.to];
          if (!fromPos || !toPos) continue;

          const px = fromPos.x + (toPos.x - fromPos.x) * p.progress;
          const py = fromPos.y + (toPos.y - fromPos.y) * p.progress;

          el.setAttribute("cx", px.toFixed(1));
          el.setAttribute("cy", py.toFixed(1));

          // Fade at edges
          const fade = Math.sin(p.progress * Math.PI);
          el.setAttribute("opacity", (p.opacity * fade).toFixed(2));
        }
      }

      // ── Animate nodes (breathing + parallax) ──
      const nGroup = nodeGroupRef.current;
      if (nGroup) {
        const children = nGroup.children;
        for (let i = 0; i < ALL_NODES.length; i++) {
          const node = ALL_NODES[i];
          const el = children[i] as SVGCircleElement;
          if (!el) continue;

          const baseX = node.x * dims.w;
          const baseY = node.y * dims.h;

          // Parallax: primary nodes move more
          const parallaxStrength = node.isPrimary ? 12 : 6;
          const px = baseX + (mx - 0.5) * parallaxStrength;
          const py = baseY + (my - 0.5) * parallaxStrength;

          el.setAttribute("cx", px.toFixed(1));
          el.setAttribute("cy", py.toFixed(1));

          // Breathing
          if (node.isPrimary) {
            const breathe = 1 + Math.sin(t * 2 + i) * 0.15;
            el.setAttribute("r", (node.radius * breathe).toFixed(2));
          }
        }
      }

      raf = requestAnimationFrame(tick);
    };

    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [isVisible, dims, nodePositions]);

  // ─── Handlers ────────────────────────────────────────────────────
  const handleNodeClick = useCallback((node: PhilosophyNode) => {
    if (node.isPrimary) setSelectedNode(node);
  }, []);

  const handleClose = useCallback(() => setSelectedNode(null), []);

  // ESC to close
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setSelectedNode(null);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  // ─── Render ──────────────────────────────────────────────────────
  const selectedIndex = selectedNode
    ? PRIMARY_NODES.findIndex((n) => n.id === selectedNode.id)
    : -1;

  return (
    <div ref={containerRef} className={styles.graphContainer}>
      <svg
        ref={svgRef}
        viewBox={`0 0 ${dims.w} ${dims.h}`}
        preserveAspectRatio="xMidYMid slice"
        style={{ width: "100%", height: "100%", display: "block" }}
      >
        <defs>
          {/* Glow for primary nodes */}
          <radialGradient id="pgNodeGlow">
            <stop offset="0%" stopColor="rgba(79,209,197,0.6)" />
            <stop offset="60%" stopColor="rgba(79,209,197,0.15)" />
            <stop offset="100%" stopColor="rgba(79,209,197,0)" />
          </radialGradient>
          <radialGradient id="pgNodeGlowHover">
            <stop offset="0%" stopColor="rgba(79,209,197,0.9)" />
            <stop offset="50%" stopColor="rgba(79,209,197,0.3)" />
            <stop offset="100%" stopColor="rgba(79,209,197,0)" />
          </radialGradient>
          <filter id="pgSoftGlow">
            <feGaussianBlur stdDeviation="4" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* ── Edges ── */}
        <g>
          {EDGES.map((edge, i) => {
            const f = nodePositions[edge.from];
            const tPos = nodePositions[edge.to];
            if (!f || !tPos) return null;

            // Is this edge connected to the hovered node?
            const isHighlighted =
              hoveredRef.current === edge.from || hoveredRef.current === edge.to;

            return (
              <line
                key={`edge-${i}`}
                x1={f.x}
                y1={f.y}
                x2={tPos.x}
                y2={tPos.y}
                stroke={
                  isHighlighted
                    ? "rgba(79,209,197,0.25)"
                    : "rgba(255,255,255,0.06)"
                }
                strokeWidth={isHighlighted ? 1 : 0.5}
                style={{ transition: "stroke 0.5s ease, stroke-width 0.5s ease" }}
              />
            );
          })}
        </g>

        {/* ── Edge particles ── */}
        <g ref={edgeParticleGroupRef}>
          {edgeParticlesRef.current.map((p, i) => (
            <circle
              key={`ep-${i}`}
              cx={0}
              cy={0}
              r={p.size}
              fill="#4fd1c5"
              opacity={0}
            />
          ))}
        </g>

        {/* ── Node halos (glow behind primary nodes) ── */}
        <g>
          {PRIMARY_NODES.map((node) => {
            const pos = nodePositions[node.id];
            if (!pos) return null;
            return (
              <circle
                key={`halo-${node.id}`}
                cx={pos.x}
                cy={pos.y}
                r={35}
                fill="url(#pgNodeGlow)"
                style={{
                  opacity: isVisible ? 0.7 : 0,
                  transition: "opacity 1.5s ease",
                }}
              />
            );
          })}
        </g>

        {/* ── Nodes ── */}
        <g ref={nodeGroupRef}>
          {ALL_NODES.map((node) => {
            const pos = nodePositions[node.id];
            if (!pos) return null;
            return (
              <circle
                key={`node-${node.id}`}
                cx={pos.x}
                cy={pos.y}
                r={node.radius}
                fill={node.isPrimary ? "#4fd1c5" : "rgba(255,255,255,0.25)"}
                style={{
                  cursor: node.isPrimary ? "pointer" : "default",
                  transition: "r 0.4s ease, fill 0.4s ease",
                  opacity: isVisible ? 1 : 0,
                }}
                filter={node.isPrimary ? "url(#pgSoftGlow)" : undefined}
                onMouseEnter={() => {
                  hoveredRef.current = node.id;
                }}
                onMouseLeave={() => {
                  hoveredRef.current = null;
                }}
                onClick={() => handleNodeClick(node)}
              />
            );
          })}
        </g>
      </svg>

      {/* ── Node labels (HTML overlaid on SVG) ── */}
      {PRIMARY_NODES.map((node) => {
        const pos = nodePositions[node.id];
        if (!pos) return null;
        return (
          <div
            key={`label-${node.id}`}
            className={styles.nodeLabel}
            style={{
              left: pos.x,
              top: pos.y + 24,
              opacity: isVisible ? 1 : 0,
            }}
          >
            <span
              className={`${styles.nodeLabelTitle} ${
                selectedNode?.id === node.id ? styles.active : ""
              }`}
            >
              {node.title}
            </span>
          </div>
        );
      })}

      {/* ── Hint ── */}
      {!selectedNode && (
        <div className={styles.hint}>Select a node to explore</div>
      )}

      {/* ── Card Overlay ── */}
      <div
        className={`${styles.cardOverlay} ${
          selectedNode ? styles.visible : ""
        }`}
        onClick={(e) => {
          if (e.target === e.currentTarget) handleClose();
        }}
      >
        {selectedNode && (
          <div className={styles.card}>
            <button
              className={styles.cardClose}
              onClick={handleClose}
              aria-label="Close card"
            >
              ✕
            </button>
            <div className={styles.cardIndex}>
              {String(selectedIndex + 1).padStart(2, "0")} / {String(PRIMARY_NODES.length).padStart(2, "0")}
            </div>
            <h2 className={styles.cardTitle}>{selectedNode.title}</h2>
            <div className={styles.cardDivider} />
            <h3 className={styles.cardSubtitle}>{selectedNode.subtitle}</h3>
            <p className={styles.cardText}>{selectedNode.text}</p>
          </div>
        )}
      </div>
    </div>
  );
}
