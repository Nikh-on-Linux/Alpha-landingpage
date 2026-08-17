"use client";
import React, { useRef, useMemo } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";

const fragmentShader = `
  varying vec3 vColor;
  void main() {
    float d = distance(gl_PointCoord, vec2(0.5));
    if (d > 0.5) discard;
    // Soft particle edge
    float alpha = smoothstep(0.5, 0.1, d);
    gl_FragColor = vec4(vColor, alpha * 0.8);
  }
`;

const vertexShader = `
  uniform float uTime;
  uniform vec3 uMouse;
  varying vec3 vColor;
  
  void main() {
    vec3 pos = position;
    
    // Abstract Medical/DNA organic movement
    pos.x += sin(uTime * 0.3 + pos.y * 0.5) * 0.3;
    pos.z += cos(uTime * 0.3 + pos.x * 0.5) * 0.3;
    
    // Distance to mouse for interaction
    float dist = distance(pos, uMouse);
    
    // Radius of influence
    float influence = 1.0 - smoothstep(0.0, 4.0, dist);
    
    // Magnetic repulsion effect
    pos += normalize(pos - uMouse) * influence * 1.5;
    
    // Color shift: from subtle off-white/grey to bright medical teal
    vec3 baseColor = vec3(0.6, 0.6, 0.65);
    vec3 hoverColor = vec3(0.1, 0.9, 0.8); 
    
    vColor = mix(baseColor, hoverColor, influence * 1.5);
    
    vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);
    
    // Points get larger when hovered
    gl_PointSize = (20.0 + influence * 40.0) * (1.0 / -mvPosition.z);
    gl_Position = projectionMatrix * mvPosition;
  }
`;

const ParticleCloud = () => {
  const pointsRef = useRef<THREE.Points>(null!);
  const materialRef = useRef<THREE.ShaderMaterial>(null!);
  const count = 6000; // Increased count for better shape definition
  
  const positions = useMemo(() => {
    const pos = new Float32Array(count * 3);
    
    // Distribute particles to form the Caduceus symbol
    const staffCount = Math.floor(count * 0.15);
    const snakeCount = Math.floor(count * 0.45); // For two snakes
    const wingCount = count - staffCount - snakeCount; // For two wings
    
    let idx = 0;
    
    // 1. Staff (central pillar)
    for (let i = 0; i < staffCount; i++) {
      const y = (Math.random() - 0.5) * 20; // -10 to 10
      const radius = Math.random() * 0.4;
      const theta = Math.random() * Math.PI * 2;
      pos[idx++] = Math.cos(theta) * radius;
      pos[idx++] = y;
      pos[idx++] = Math.sin(theta) * radius;
    }
    
    // 2. Twin Snakes (intertwining helix)
    for (let i = 0; i < snakeCount; i++) {
      const y = (Math.random() * 16) - 8; // -8 to +8
      // Taper the snakes at the top and bottom
      const taper = Math.sin(((y + 8) / 16) * Math.PI);
      const radius = 2.5 * taper + (Math.random() * 0.4); 
      const phase = (i % 2 === 0) ? 0 : Math.PI; // Two opposite snakes
      const theta = y * 1.2 + phase; 
      
      pos[idx++] = Math.cos(theta) * radius;
      pos[idx++] = y;
      pos[idx++] = Math.sin(theta) * radius;
    }
    
    // 3. Wings (spreading out from the top)
    for (let i = 0; i < wingCount; i++) {
      const side = (i % 2 === 0) ? 1 : -1; // Left or Right wing
      const t = Math.random(); // 0 to 1 along the wing
      const spread = t * 8.0; // How far the wing extends sideways
      const arch = Math.sin(t * Math.PI) * 3.0; // The curve of the wing
      
      const x = side * (spread + Math.random() * 1.5);
      const y = 6.0 + arch + (Math.random() * 2.0 - 1.0);
      const z = (Math.random() - 0.5) * 1.0; // Relatively flat
      
      pos[idx++] = x;
      pos[idx++] = y;
      pos[idx++] = z;
    }
    
    return pos;
  }, [count]);

  const uniforms = useMemo(() => ({
    uTime: { value: 0 },
    uMouse: { value: new THREE.Vector3(-1000, -1000, -1000) }
  }), []);

  const { pointer, viewport } = useThree();

  useFrame((state) => {
    if (materialRef.current) {
      materialRef.current.uniforms.uTime.value = state.clock.elapsedTime;
      
      materialRef.current.uniforms.uMouse.value.set(
        (pointer.x * viewport.width) / 2,
        (pointer.y * viewport.height) / 2,
        0
      );
    }
    if (pointsRef.current) {
      // Gentle floating rotation to show off the 3D shape
      pointsRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.2) * 0.2;
    }
  });

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          args={[positions, 3]}
          count={count}
        />
      </bufferGeometry>
      <shaderMaterial
        ref={materialRef}
        vertexShader={vertexShader}
        fragmentShader={fragmentShader}
        uniforms={uniforms}
        transparent
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
};

export default function MedicalParticles() {
  return (
    <div className="absolute inset-0 z-0 pointer-events-auto">
      <Canvas camera={{ position: [0, 0, 18], fov: 45 }}>
        <ParticleCloud />
      </Canvas>
    </div>
  );
}
