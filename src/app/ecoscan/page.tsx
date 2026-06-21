'use client';
import React, { useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { GlassCard } from '@/components/ui/glass-card';
import { FloatingNav } from '@/components/ui/floating-nav';
import { analyzeEcoImage } from '@/lib/gemini';
import type { EcoScanResult } from '@/lib/gemini-server';

type ScanState = 'idle' | 'scanning' | 'result';

const toDataUrl = (file: File) =>
  new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result || ''));
    reader.onerror = () => reject(new Error('Could not read the selected image.'));
    reader.readAsDataURL(file);
  });

const toJpegBase64 = async (file: File) => {
  const dataUrl = await toDataUrl(file);

  return new Promise<string>((resolve, reject) => {
    const image = new Image();
    image.onload = () => {
      const canvas = document.createElement('canvas');
      canvas.width = image.naturalWidth;
      canvas.height = image.naturalHeight;
      const context = canvas.getContext('2d');
      if (!context) {
        reject(new Error('Could not create a canvas context.'));
        return;
      }
      context.drawImage(image, 0, 0);
      resolve(canvas.toDataURL('image/jpeg', 0.9).split(',')[1] || '');
    };
    image.onerror = () => reject(new Error('Could not load the selected image.'));
    image.src = dataUrl;
  });
};

export default function EcoScanPage() {
  const [state, setState] = useState<ScanState>('idle');
  const [result, setResult] = useState<EcoScanResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleScan = async (file: File) => {
    setState('scanning');
    setError(null);
    try {
      const imageBase64 = await toJpegBase64(file);
      const analysis = await analyzeEcoImage(imageBase64);
      setResult(analysis);
      setState('result');
} catch (error) {
        const message =
          error instanceof Error && error.message.includes('timed out')
            ? 'The scan took too long. Please try again with a smaller image.'
            : 'We could not analyze this image right now. Please try another photo.';
        setError(message);
      setState('idle');
    }
  };

  return (
   <main className="relative min-h-screen bg-terra-space-950 overflow-hidden">
      <motion.h1 initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-3xl font-display font-bold text-center mt-8 mb-2">EcoScan AI</motion.h1>
      <p className="text-center text-terra-space-400 mb-8 text-sm">Scan anything. Know its impact.</p>

      <div className="max-w-md mx-auto">
        <AnimatePresence mode="wait">
          {state === 'idle' && (
            <motion.section key="idle" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="text-center" aria-label="EcoScan camera interface">
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(event) => {
                  const file = event.target.files?.[0];
                  if (file) {
                    void handleScan(file);
                  }
                }}
              />
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => fileInputRef.current?.click()}
                type="button"
                aria-label="Tap camera to scan item"
                className="glass w-64 h-64 mx-auto rounded-full flex flex-col items-center justify-center cursor-pointer border-2 border-dashed border-terra-space-600 hover:border-terra-green-500 transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-terra-green-400"
              >
                <span className="text-5xl mb-3" aria-hidden="true">📸</span>
                <span className="text-sm text-terra-space-400">Tap to scan</span>
                <span className="text-xs text-terra-space-600 mt-1">Food • Receipt • Vehicle</span>
              </motion.button>
            </motion.section>
          )}

          {state === 'scanning' && (
            <motion.section key="scanning" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }} className="text-center" aria-label="Scanning in progress" aria-busy="true">
              <div className="w-64 h-64 mx-auto relative">
                <motion.div animate={{ rotate: 360 }} transition={{ duration: 2, repeat: Infinity, ease: 'linear' }} className="absolute inset-0 rounded-full border-2 border-transparent border-t-terra-green-400" aria-hidden="true" />
                <div className="absolute inset-4 rounded-full glass flex items-center justify-center">
                  <motion.span animate={{ opacity: [0.5, 1, 0.5] }} transition={{ duration: 1.5, repeat: Infinity }} className="text-lg text-terra-space-300">Analyzing impact...</motion.span>
                </div>
              </div>
            </motion.section>
          )}

          {state === 'result' && result && (
            <motion.section key="result" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-4" role="region" aria-live="polite" aria-label="Scan results">
              <GlassCard className="text-center">
                <div className="text-4xl mb-2" aria-hidden="true">📦</div>
                <h2 className="font-display font-semibold text-lg">{result.item}</h2>
                <div className="text-2xl font-mono font-bold text-terra-danger-500 mt-2" aria-label={`${result.co2Kg} kilograms CO2 per serving`}>{result.co2Kg.toFixed(1)} kg CO₂</div>
                <div className="text-xs text-terra-space-400">estimated impact</div>
              </GlassCard>

              <div className="text-sm text-terra-space-400 font-medium px-2"><span aria-hidden="true">🌿</span> Greener alternatives</div>

              {result.alternatives.map((alt, i) => (
                <motion.div key={alt.name} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 + i * 0.1 }}>
                  <GlassCard>
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="font-medium text-sm">{alt.name}</div>
                        <div className="text-xs text-terra-space-400">{alt.description}</div>
                      </div>
                      <div className="text-terra-green-400 font-mono font-bold text-sm" aria-label={`Reduces impact by ${alt.co2Savings} percent`}>↓{alt.co2Savings}%</div>
                    </div>
                  </GlassCard>
                </motion.div>
              ))}

              <motion.button 
                whileTap={{ scale: 0.95 }} 
                onClick={() => {
                  setResult(null);
                  setState('idle');
                  setError(null);
                }} 
                type="button"
                aria-label="Scan another item"
                className="w-full py-3 glass text-center text-sm font-medium mt-4 focus-visible:outline focus-visible:outline-2 focus-visible:outline-terra-green-400"
              >
                Scan another item
              </motion.button>
            </motion.section>
          )}

          {error && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mt-4 space-y-3">
              <p className="text-center text-sm text-terra-danger-500" role="alert">
                {error}
              </p>
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="mx-auto block rounded-xl border border-terra-green-400/40 px-4 py-2 text-sm font-medium text-terra-green-300 focus-visible:outline focus-visible:outline-2 focus-visible:outline-terra-green-400"
              >
                Try again
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <div className="fixed bottom-6 right-8 z-50">
        <FloatingNav />
      </div>
    </main>
  );
}
