"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import { useRef } from "react";

function OrbitalField() {
  const ref = useRef(null);

  useFrame((state) => {
    if (!ref.current) return;
    ref.current.rotation.y = state.pointer.x * 0.35 + state.clock.elapsedTime * 0.08;
    ref.current.rotation.x = state.pointer.y * 0.2;
  });

  const points = Array.from({ length: 90 }, (_, index) => {
    const angle = (index / 90) * Math.PI * 2;
    const radius = 2.4 + (index % 7) * 0.18;
    return [Math.cos(angle) * radius, Math.sin(angle * 1.5) * 0.7, Math.sin(angle) * radius];
  });

  return (
    <group ref={ref}>
      {points.map((position, index) => (
        <mesh key={index} position={position}>
          <sphereGeometry args={[0.035 + (index % 4) * 0.01, 16, 16]} />
          <meshStandardMaterial color={index % 5 === 0 ? "#fb923c" : "#67e8f9"} emissive="#0ea5e9" emissiveIntensity={0.8} />
        </mesh>
      ))}
      <mesh>
        <torusKnotGeometry args={[1.25, 0.28, 160, 24]} />
        <meshStandardMaterial color="#dbeafe" wireframe opacity={0.35} transparent />
      </mesh>
    </group>
  );
}

export function HeroCanvas() {
  return (
    <div className="absolute inset-0">
      <Canvas camera={{ position: [0, 0, 5.8], fov: 45 }}>
        <ambientLight intensity={0.7} />
        <pointLight position={[4, 4, 4]} intensity={22} color="#67e8f9" />
        <pointLight position={[-4, -1, 3]} intensity={16} color="#fb923c" />
        <OrbitalField />
      </Canvas>
    </div>
  );
}
