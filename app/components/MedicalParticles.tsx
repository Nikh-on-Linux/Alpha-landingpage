"use client";
import React, { useRef, useMemo, useState, useEffect } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";
import { SVGLoader } from "three-stdlib";
import { MeshSurfaceSampler } from "three/examples/jsm/math/MeshSurfaceSampler.js";

const fragmentShader = `
  varying vec3 vColor;
  void main() {
    float d = distance(gl_PointCoord, vec2(0.5));
    if (d > 0.5) discard;
    float alpha = smoothstep(0.5, 0.1, d);
    gl_FragColor = vec4(vColor, alpha * 0.9);
  }
`;

const vertexShader = `
  uniform float uTime;
  uniform vec3 uMouse;
  varying vec3 vColor;
  
  void main() {
    vec3 pos = position;
    
    // Slight organic pulse
    pos.y += sin(uTime * 2.0 + pos.x * 0.5) * 2.0;
    
    // Calculate distance to mouse for neural firing
    float dist = distance(pos, uMouse);
    float firing = 1.0 - smoothstep(0.0, 60.0, dist);
    
    // Neurons pulse bright cyan when firing, otherwise soft teal
    vec3 baseColor = vec3(0.05, 0.4, 0.5); 
    vec3 fireColor = vec3(0.4, 1.0, 1.0); 
    
    vColor = mix(baseColor, fireColor, firing * 2.0);
    
    vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);
    
    // Firing neurons swell in size
    gl_PointSize = (10.0 + firing * 30.0) * (200.0 / -mvPosition.z);
    gl_Position = projectionMatrix * mvPosition;
  }
`;

// A highly recognizable side-profile SVG of a brain
const brainSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
  <path d="M208 0c-29.9 0-54.7 20.5-61.8 48.2-.8 0-1.4-.2-2.2-.2-35.3 0-64 28.7-64 64 0 4.8 .5 9.5 1.5 14C52.8 138 32 166.6 32 200c0 12.6 3.2 24.3 8.3 34.9C16.3 243.4 0 269.7 0 304c0 34.3 16.3 60.6 40.3 69.1-5.1 10.6-8.3 22.3-8.3 34.9 0 33.4 20.8 62 50.1 74-1 4.5-1.5 9.2-1.5 14 0 35.3 28.7 64 64 64 8.7 0 17.1-1.7 24.8-4.8 11.2 26 36.3 44.8 65.2 44.8s54-18.8 65.2-44.8c7.7 3.1 16.1 4.8 24.8 4.8 35.3 0 64-28.7 64-64 0-4.8-.5-9.5-1.5-14 29.3-12 50.1-40.6 50.1-74 0-12.6-3.2-24.3-8.3-34.9C495.7 364.6 512 338.3 512 304c0-34.3-16.3-60.6-40.3-69.1 5.1-10.6 8.3-22.3 8.3-34.9 0-33.4-20.8-62-50.1-74 1-4.5 1.5-9.2 1.5-14 0-35.3-28.7-64-64-64-8.7 0-17.1 1.7-24.8 4.8C351.4 18.8 326.3 0 297.4 0s-54 18.8-65.2 44.8C224.5 41.7 216.1 40 207.4 40c-.5 0-1 .1-1.5 .1C205.1 17.5 188.7 0 168 0z"/>
</svg>`;

const ParticleCloud = () => {
  const pointsRef = useRef<THREE.Points>(null!);
  const materialRef = useRef<THREE.ShaderMaterial>(null!);
  const count = 10000;
  
  const [positions, setPositions] = useState<Float32Array | null>(null);

  useEffect(() => {
    // 1. Parse SVG
    const loader = new SVGLoader();
    const svgData = loader.parse(brainSvg);
    
    const shapes: THREE.Shape[] = [];
    svgData.paths.forEach((path) => {
      shapes.push(...path.toShapes());
    });

    // 2. Extrude SVG to 3D
    const geometry = new THREE.ExtrudeGeometry(shapes, {
      depth: 120, // Thickness of the brain
      bevelEnabled: true,
      bevelThickness: 10,
      bevelSize: 5,
      bevelSegments: 3,
      curveSegments: 12
    });

    // Center and flip the geometry
    geometry.center();
    // SVG coordinates are flipped on Y axis
    geometry.scale(1, -1, 1);
    
    // Create a temporary mesh to sample from
    const mesh = new THREE.Mesh(geometry, new THREE.MeshBasicMaterial());
    
    // 3. Sample Points on the Surface
    const sampler = new MeshSurfaceSampler(mesh).build();
    const pos = new Float32Array(count * 3);
    const tempPosition = new THREE.Vector3();
    
    for (let i = 0; i < count; i++) {
      sampler.sample(tempPosition);
      pos[i * 3] = tempPosition.x;
      pos[i * 3 + 1] = tempPosition.y;
      pos[i * 3 + 2] = tempPosition.z;
    }
    
    setPositions(pos);
  }, []);

  const uniforms = useMemo(() => ({
    uTime: { value: 0 },
    uMouse: { value: new THREE.Vector3(-10000, -10000, -10000) }
  }), []);

  const { pointer, viewport, camera } = useThree();
  const raycaster = useMemo(() => new THREE.Raycaster(), []);
  const mousePlane = useMemo(() => new THREE.Plane(new THREE.Vector3(0, 0, 1), 0), []);
  const intersectPoint = useMemo(() => new THREE.Vector3(), []);

  useFrame((state) => {
    if (materialRef.current) {
      materialRef.current.uniforms.uTime.value = state.clock.elapsedTime;
      
      // Raycast to find mouse position in 3D space
      raycaster.setFromCamera(pointer, camera);
      raycaster.ray.intersectPlane(mousePlane, intersectPoint);
      
      materialRef.current.uniforms.uMouse.value.lerp(intersectPoint, 0.1);
    }
    if (pointsRef.current) {
      // Gentle floating rotation
      pointsRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.2) * 0.2;
    }
  });

  if (!positions) return null;

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
      {/* Set a wide FOV and zoom out to fit the SVG coordinates */}
      <Canvas camera={{ position: [0, 0, 800], fov: 45 }}>
        <ParticleCloud />
      </Canvas>
    </div>
  );
}
