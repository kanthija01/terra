'use client';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Stars } from '@react-three/drei';
import { Suspense, useEffect, useMemo, useState } from 'react';
import { Earth } from './Earth';
import { Atmosphere } from './Atmosphere';
import { Clouds } from './Clouds';

export function EarthScene() {
  const [isLowEndDevice, setIsLowEndDevice] = useState(false);

  useEffect(() => {
    if (typeof window === 'undefined') {
      return;
    }

    const deviceMemory = (navigator as Navigator & { deviceMemory?: number }).deviceMemory;
    const lowEnd =
      window.innerWidth < 640 ||
      (typeof navigator.hardwareConcurrency === 'number' && navigator.hardwareConcurrency <= 4) ||
      (typeof deviceMemory === 'number' && deviceMemory <= 4);

    setIsLowEndDevice(lowEnd);
  }, []);

  const shouldRenderScene = !isLowEndDevice;
  const dpr = useMemo(() => {
    if (typeof window === 'undefined') {
      return 1.2;
    }

    return window.innerWidth < 768 ? 1.1 : 1.3;
  }, []);

  if (!shouldRenderScene) {
    return (
      <div className="absolute inset-0 flex items-center justify-center bg-terra-space-950/80 px-6 text-center">
        <p className="max-w-xs text-sm text-terra-space-300">
          3D preview is hidden on this device to keep the page responsive. Use the score cards below for the latest Earth snapshot.
        </p>
      </div>
    );
  }

  return (
    <>
      <Canvas
        camera={{ position: [0, 0, 6], fov: 45 }}
        className="!absolute inset-0"
        dpr={dpr}
        gl={{ antialias: false, alpha: true, powerPreference: 'default' }}
        fallback={
          <div className="absolute inset-0 flex items-center justify-center bg-terra-space-950/80 px-6 text-center">
            <p className="max-w-xs text-sm text-terra-space-300">
              3D Earth preview is unavailable right now. Use the score cards below for the latest environmental snapshot.
            </p>
          </div>
        }
        aria-label="3D interactive Earth visualization showing planetary health and environmental status"
        role="img"
      >
        <Suspense fallback={null}>
          <ambientLight intensity={0.2} />
          <directionalLight position={[5, 3, 5]} intensity={1.2} />
          <pointLight position={[-5, -3, -5]} intensity={0.3} color="#4ade80" />
          <Stars radius={100} depth={50} count={1400} factor={3} fade />
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
