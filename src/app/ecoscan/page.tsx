'use client';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { GlassCard } from '@/components/ui/glass-card';
import { FloatingNav } from '@/components/ui/floating-nav';

type ScanState = 'idle' | 'scanning' | 'result';

export default function EcoScanPage() {
  const [state, setState] = useState<ScanState>('idle');

  const simulateScan = () => {
    setState('scanning');
    setTimeout(() => setState('result'), 2500);
  };

  return (
   <div className="relative min-h-screen bg-terra-space-950 overflow-hidden">
      <motion.h1 initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-3xl font-display font-bold text-center mt-8 mb-2">EcoScan AI</motion.h1>
      <p className="text-center text-terra-space-400 mb-8 text-sm">Scan anything. Know its impact.</p>

      <div className="max-w-md mx-auto">
        <AnimatePresence mode="wait">
          {state === 'idle' && (
            <motion.div key="idle" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="text-center">
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={simulateScan}
                className="glass w-64 h-64 mx-auto rounded-full flex flex-col items-center justify-center cursor-pointer border-2 border-dashed border-terra-space-600 hover:border-terra-green-500 transition-colors"
              >
                <span className="text-5xl mb-3">📸</span>
                <span className="text-sm text-terra-space-400">Tap to scan</span>
                <span className="text-xs text-terra-space-600 mt-1">Food • Receipt • Vehicle</span>
              </motion.div>
            </motion.div>
          )}

          {state === 'scanning' && (
            <motion.div key="scanning" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }} className="text-center">
              <div className="w-64 h-64 mx-auto relative">
                <motion.div animate={{ rotate: 360 }} transition={{ duration: 2, repeat: Infinity, ease: 'linear' }} className="absolute inset-0 rounded-full border-2 border-transparent border-t-terra-green-400" />
                <div className="absolute inset-4 rounded-full glass flex items-center justify-center">
                  <motion.span animate={{ opacity: [0.5, 1, 0.5] }} transition={{ duration: 1.5, repeat: Infinity }} className="text-lg text-terra-space-300">Analyzing impact...</motion.span>
                </div>
              </div>
            </motion.div>
          )}

          {state === 'result' && (
            <motion.div key="result" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
              <GlassCard className="text-center">
                <div className="text-4xl mb-2">🍔</div>
                <h3 className="font-display font-semibold text-lg">Beef Burger</h3>
                <div className="text-2xl font-mono font-bold text-terra-danger-500 mt-2">6.6 kg CO₂</div>
                <div className="text-xs text-terra-space-400">per serving</div>
              </GlassCard>

              <div className="text-sm text-terra-space-400 font-medium px-2">🌿 Greener alternatives</div>

              {[
                { name: 'Plant-based burger', co2: 0.9, saving: 86 },
                { name: 'Chicken wrap', co2: 2.1, saving: 68 },
                { name: 'Lentil bowl', co2: 0.4, saving: 94 },
              ].map((alt, i) => (
                <motion.div key={alt.name} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 + i * 0.1 }}>
                  <GlassCard className="flex items-center justify-between">
                    <div>
                      <div className="font-medium text-sm">{alt.name}</div>
                      <div className="text-xs text-terra-space-400">{alt.co2} kg CO₂</div>
                    </div>
                    <div className="text-terra-green-400 font-mono font-bold text-sm">↓{alt.saving}%</div>
                  </GlassCard>
                </motion.div>
              ))}

              <motion.button whileTap={{ scale: 0.95 }} onClick={() => setState('idle')} className="w-full py-3 glass text-center text-sm font-medium mt-4">Scan another item</motion.button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <div className="fixed bottom-6 right-8 z-50">
        <FloatingNav />
      </div>
    </div>
  );
}
