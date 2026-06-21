'use client';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Stars } from '@react-three/drei';
import { Suspense } from 'react';
import { Earth } from './Earth';
import { Atmosphere } from './Atmosphere';
import { Clouds } from './Clouds';

export function EarthScene() {
  return (
    <>
      <Canvas 
        camera={{ position: [0, 0, 6], fov: 45 }} 
        className="!absolute inset-0" 
        dpr={[1, 2]}
        aria-label="3D interactive Earth visualization showing planetary health and environmental status"
        role="img"
      >
        <Suspense fallback={null}>
          <ambientLight intensity={0.2} />
          <directionalLight position={[5, 3, 5]} intensity={1.2} />
          <pointLight position={[-5, -3, -5]} intensity={0.3} color="#4ade80" />
          <Stars radius={100} depth={50} count={3000} factor={4} fade />
          <Earth />
          <Atmosphere />
          <Clouds />
          <OrbitControls enablePan={false} enableZoom={false} minPolarAngle={Math.PI / 4} maxPolarAngle={Math.PI * 3 / 4} rotateSpeed={0.5} />
        </Suspense>
      </Canvas>
      <div className="sr-only" role="status" aria-live="polite" aria-atomic="true">
        Interactive 3D Earth visualization. The Earth rotates to show current environmental status. Use visual indicators in the top right for Earth health score and weather conditions.
      </div>
    </>
  );
}
