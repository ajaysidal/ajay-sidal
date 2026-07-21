'use client';

import { Canvas } from '@react-three/fiber';
import { Float, MeshDistortMaterial, Environment } from '@react-three/drei';
import { Suspense } from 'react';

function RotatingShape() {
  return (
    <Float speed={3} rotationIntensity={2} floatIntensity={1.5}>
      <mesh scale={1.2}>
        <icosahedronGeometry args={[1, 0]} />
        <MeshDistortMaterial
          color="#22d3ee"
          attach="material"
          distort={0.3}
          speed={2}
          roughness={0.1}
          metalness={0.8}
        />
      </mesh>
    </Float>
  );
}

export default function SpatialCanvas() {
  return (
    <div className="absolute inset-0">
      <Canvas camera={{ position: [0, 0, 4], fov: 50 }}>
        <Suspense fallback={null}>
          <ambientLight intensity={0.5} />
          <directionalLight position={[5, 5, 5]} intensity={1} />
          <RotatingShape />
          <Environment preset="city" />
        </Suspense>
      </Canvas>
    </div>
  );
}