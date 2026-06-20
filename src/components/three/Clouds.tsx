'use client';
import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

export function Clouds() {
  const ref = useRef<THREE.Mesh>(null);

  useFrame((_, delta) => {
    if (ref.current) ref.current.rotation.y += delta * 0.02;
  });

  return (
    <mesh ref={ref} scale={[1.02, 1.02, 1.02]}>
      <sphereGeometry args={[2, 32, 32]} />
      <meshStandardMaterial transparent opacity={0.3} color="#ffffff" depthWrite={false} />
    </mesh>
  );
}
