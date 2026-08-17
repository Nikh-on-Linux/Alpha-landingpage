"use client";
import React, { useEffect, useRef } from "react";

class Neuron {
  x: number;
  y: number;
  vx: number;
  vy: number;
  baseVx: number;
  baseVy: number;
  radius: number;
  connections: Neuron[];

  constructor(width: number, height: number) {
    this.x = Math.random() * width;
    this.y = Math.random() * height;
    // Reduced motion for elegance
    this.baseVx = (Math.random() - 0.5) * 0.15;
    this.baseVy = (Math.random() - 0.5) * 0.15;
    this.vx = this.baseVx;
    this.vy = this.baseVy;
    this.radius = Math.random() * 1.5 + 1.0; 
    this.connections = [];
  }

  update(width: number, height: number) {
    this.x += this.vx;
    this.y += this.vy;

    // Smooth return to slow base velocity
    this.vx += (this.baseVx - this.vx) * 0.05;
    this.vy += (this.baseVy - this.vy) * 0.05;

    // Wrap around instead of bouncing for a more seamless infinite feel
    if (this.x < -10) this.x = width + 10;
    if (this.x > width + 10) this.x = -10;
    if (this.y < -10) this.y = height + 10;
    if (this.y > height + 10) this.y = -10;
  }

  draw(ctx: CanvasRenderingContext2D) {
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
    // Base neurons are dim to make signals pop
    ctx.fillStyle = "rgba(120, 200, 255, 0.4)";
    ctx.fill();
    
    // Bloom effect
    ctx.shadowBlur = 12;
    ctx.shadowColor = "rgba(100, 200, 255, 0.6)";
    ctx.fill();
    ctx.shadowBlur = 0;
  }
}

class Signal {
  from: Neuron;
  to: Neuron;
  progress: number;
  speed: number;
  intensity: number;

  constructor(from: Neuron, to: Neuron, initialIntensity: number = 1) {
    this.from = from;
    this.to = to;
    this.progress = 0;
    // Speed varies slightly
    this.speed = 0.015 + Math.random() * 0.015;
    this.intensity = initialIntensity;
  }

  update(): boolean {
    this.progress += this.speed;
    return this.progress >= 1; // Returns true when arrived
  }

  draw(ctx: CanvasRenderingContext2D) {
    const x = this.from.x + (this.to.x - this.from.x) * this.progress;
    const y = this.from.y + (this.to.y - this.from.y) * this.progress;

    ctx.beginPath();
    ctx.arc(x, y, 1.5, 0, Math.PI * 2);
    ctx.fillStyle = `rgba(255, 255, 255, ${this.intensity})`;
    ctx.fill();

    // High bloom for the moving signal light
    ctx.shadowBlur = 15;
    ctx.shadowColor = "rgba(200, 240, 255, 1)";
    ctx.fill();
    ctx.shadowBlur = 0;
  }
}

export default function DNAHelix() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationFrameId: number;
    let neurons: Neuron[] = [];
    let signals: Signal[] = [];
    const connectionDistance = 140; 

    const resizeCanvas = () => {
      const parent = canvas.parentElement;
      if (parent) {
        canvas.width = parent.clientWidth;
        canvas.height = parent.clientHeight;
        initNeurons();
      }
    };

    const initNeurons = () => {
      neurons = [];
      signals = [];
      const area = canvas.width * canvas.height;
      const count = Math.floor(area / 9000); 
      for (let i = 0; i < count; i++) {
        neurons.push(new Neuron(canvas.width, canvas.height));
      }
    };

    const animate = () => {
      // Clear canvas
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      // Use lighter composition for beautiful blooming overlapping lights
      ctx.globalCompositeOperation = "lighter";

      // 1. Establish connections
      // Reset connections
      for (const neuron of neurons) {
        neuron.connections = [];
      }

      for (let i = 0; i < neurons.length; i++) {
        for (let j = i + 1; j < neurons.length; j++) {
          const dx = neurons[i].x - neurons[j].x;
          const dy = neurons[i].y - neurons[j].y;
          const distSq = dx * dx + dy * dy;

          if (distSq < connectionDistance * connectionDistance) {
            neurons[i].connections.push(neurons[j]);
            neurons[j].connections.push(neurons[i]);
            
            const dist = Math.sqrt(distSq);
            // Thin, elegant, low-opacity lines
            const alpha = (1 - dist / connectionDistance) * 0.25;
            
            ctx.beginPath();
            ctx.moveTo(neurons[i].x, neurons[i].y);
            ctx.lineTo(neurons[j].x, neurons[j].y);
            ctx.strokeStyle = `rgba(100, 180, 255, ${alpha})`;
            ctx.lineWidth = 0.8;
            ctx.stroke();
          }
        }
      }

      // 2. Update and draw signals
      for (let i = signals.length - 1; i >= 0; i--) {
        const signal = signals[i];
        const arrived = signal.update();
        signal.draw(ctx);

        if (arrived) {
          // Chance to propagate the signal to a random neighbor to keep the network alive
          if (signal.intensity > 0.3 && signal.to.connections.length > 0) {
            // Pick a random neighbor that wasn't the sender
            const validNeighbors = signal.to.connections.filter(n => n !== signal.from);
            if (validNeighbors.length > 0) {
              const nextTarget = validNeighbors[Math.floor(Math.random() * validNeighbors.length)];
              // Fade intensity with each hop
              signals.push(new Signal(signal.to, nextTarget, signal.intensity * 0.7));
            }
          }
          signals.splice(i, 1);
        }
      }

      // 3. Update and draw neurons
      for (const neuron of neurons) {
        neuron.update(canvas.width, canvas.height);
        neuron.draw(ctx);
      }

      // Occasional random ambient signal to make it feel alive without interaction
      if (Math.random() < 0.02 && neurons.length > 0) {
        const startNeuron = neurons[Math.floor(Math.random() * neurons.length)];
        if (startNeuron.connections.length > 0) {
          const target = startNeuron.connections[Math.floor(Math.random() * startNeuron.connections.length)];
          signals.push(new Signal(startNeuron, target, 0.6));
        }
      }

      ctx.globalCompositeOperation = "source-over"; // reset

      animationFrameId = requestAnimationFrame(animate);
    };

    // Interaction: Shoot patterns and gentle push on click
    const handleClick = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      const clickX = e.clientX - rect.left;
      const clickY = e.clientY - rect.top;

      let closestNeuron: Neuron | null = null;
      let minSq = Infinity;

      for (const neuron of neurons) {
        const dx = neuron.x - clickX;
        const dy = neuron.y - clickY;
        const distSq = dx * dx + dy * dy;
        
        // Gentle push
        if (distSq < 40000) { // 200 radius
          const dist = Math.sqrt(distSq);
          const force = (1 - dist / 200) * 8; // Gentle spread
          neuron.vx += (dx / dist) * force;
          neuron.vy += (dy / dist) * force;
        }

        // Find closest
        if (distSq < minSq) {
          minSq = distSq;
          closestNeuron = neuron;
        }
      }

      // Shoot intense signals from the closest neuron to all its connections
      if (closestNeuron && minSq < 90000) {
        for (const target of closestNeuron.connections) {
          signals.push(new Signal(closestNeuron, target, 1.2)); // High intensity burst
        }
      }
    };

    // Subtle mouse repulsion
    const handleMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      const mouseX = e.clientX - rect.left;
      const mouseY = e.clientY - rect.top;
      
      for (const neuron of neurons) {
        const dx = neuron.x - mouseX;
        const dy = neuron.y - mouseY;
        const distSq = dx * dx + dy * dy;

        if (distSq < 10000) { // 100 radius
          const dist = Math.sqrt(distSq);
          const force = (1 - dist / 100) * 0.3;
          neuron.vx += (dx / dist) * force;
          neuron.vy += (dy / dist) * force;
        }
      }
    };

    window.addEventListener("resize", resizeCanvas);
    canvas.addEventListener("click", handleClick);
    canvas.addEventListener("mousemove", handleMouseMove);
    
    resizeCanvas();
    animate();

    return () => {
      window.removeEventListener("resize", resizeCanvas);
      canvas.removeEventListener("click", handleClick);
      canvas.removeEventListener("mousemove", handleMouseMove);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <div className="absolute inset-0 z-0 bg-transparent">
      <canvas
        ref={canvasRef}
        className="w-full h-full block"
      />
    </div>
  );
}
