'use client';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { GlassCard } from '@/components/ui/glass-card';
import { FloatingNav } from '@/components/ui/floating-nav';
import { useTerraStore } from '@/stores/terra-store';

const timePoints = [
  { year: 0, label: 'Now', emoji: '📍' },
  { year: 1, label: '1 Year', emoji: '🌱' },
  { year: 5, label: '5 Years', emoji: '🌳' },
  { year: 10, label: '10 Years', emoji: '🌍' },
];

const narratives: Record<number, string> = {
  0: 'This is your Earth today. Every choice you make echoes forward through time.',
  1: 'One year from now, your daily choices have already begun to heal. Small forests grow where bare earth once lay. The air tastes cleaner with each breath.',
  5: 'Five years of care. Your Earth has transformed — waterfalls cascade through lush valleys, birds return in flocks, and the oceans shimmer with renewed life.',
  10: 'A decade of love. Whales sing in crystal waters. Aurora lights dance nightly. Your children will inherit not ruins, but a paradise you chose to build.',
};

export default function FutureMemoriesPage() {
  const [activeYear, setActiveYear] = useState(0);
  const { score } = useTerraStore();

  const getHealthForYear = (year: number) => {
    const growth = score > 50 ? year * 3 : -year * 2;
    return Math.min(100, Math.max(0, score + growth));
  };

  return (
   <main className="relative min-h-screen bg-terra-space-950 overflow-hidden">
      <motion.div
        animate={{
          background: activeYear === 0
            ? 'radial-gradient(ellipse at center, #0a0f1a 0%, #030712 100%)'
            : activeYear <= 1
            ? 'radial-gradient(ellipse at center, rgba(6,78,59,0.13) 0%, #030712 100%)'
            : 'radial-gradient(ellipse at center, #059669 0%, #030712 80%)',
        }}
        transition={{ duration: 1.5 }}
        className="absolute inset-0"
      />

      <div className="relative z-10 p-6 pb-24">
        <motion.h1 initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="text-3xl font-display font-bold text-center mt-8 mb-2">Future Memories</motion.h1>
        <p className="text-center text-terra-space-400 mb-12 text-sm italic">Travel through time. See what your choices create.</p>

        <motion.div
          animate={{ scale: 1 + activeYear * 0.02, filter: `brightness(${0.7 + getHealthForYear(timePoints[activeYear].year) * 0.005})` }}
          transition={{ duration: 1.5, ease: 'easeInOut' }}
          className="w-48 h-48 mx-auto mb-12 rounded-full bg-gradient-to-br from-terra-green-700 via-terra-blue-600 to-terra-green-500 flex items-center justify-center shadow-glow-green"
        >
          <motion.span key={activeYear} initial={{ scale: 0, rotate: -180 }} animate={{ scale: 1, rotate: 0 }} className="text-6xl">{timePoints[activeYear].emoji}</motion.span>
        </motion.div>

        {/* Timeline */}
        <nav className="max-w-md mx-auto mb-8" aria-label="Time travel navigation">
          <div className="flex items-center justify-between relative" role="tablist">
            <div className="absolute top-1/2 left-0 right-0 h-0.5 bg-terra-space-800" aria-hidden="true" />
            <motion.div animate={{ width: `${(activeYear / 3) * 100}%` }} className="absolute top-1/2 left-0 h-0.5 bg-terra-green-500" aria-hidden="true" />
            {timePoints.map((point, i) => (
              <motion.button
                key={point.year}
                type="button"
                role="tab"
                aria-selected={i === activeYear}
                aria-label={`${point.label} from now`}
                whileHover={{ scale: 1.2 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => setActiveYear(i)}
                className={`relative z-10 w-10 h-10 rounded-full flex items-center justify-center text-xs font-bold transition-all focus-visible:outline focus-visible:outline-2 focus-visible:outline-terra-green-400 ${i <= activeYear ? 'bg-terra-green-500 text-white shadow-glow-green' : 'bg-terra-space-800 text-terra-space-400'}`}
              >
                {point.label.split(' ')[0]}
              </motion.button>
            ))}
          </div>
        </nav>

        <AnimatePresence mode="wait">
          <motion.section key={activeYear} initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} transition={{ duration: 0.6 }} className="max-w-md mx-auto" role="region" aria-live="polite" aria-label="Future vision">
            <GlassCard glow={activeYear > 2 ? 'aurora' : 'none'}>
              <article className="text-center">
                <h2 className="text-xs text-terra-aurora-purple font-semibold uppercase tracking-widest mb-3">{timePoints[activeYear].label} from now</h2>
                <p className="text-terra-space-200 italic leading-relaxed">&quot;{narratives[timePoints[activeYear].year]}&quot;</p>
                <div className="mt-4 flex justify-center gap-4 text-xs text-terra-space-400">
                  <span aria-label={`${Math.round(getHealthForYear(timePoints[activeYear].year) * 0.8)} forests`}><span aria-hidden="true">🌳</span> {Math.round(getHealthForYear(timePoints[activeYear].year) * 0.8)} forests</span>
                  <span aria-label={`${Math.round(getHealthForYear(timePoints[activeYear].year) * 0.5)} species`}><span aria-hidden="true">🐦</span> {Math.round(getHealthForYear(timePoints[activeYear].year) * 0.5)} species</span>
                  <span aria-label={`${getHealthForYear(timePoints[activeYear].year)} percent clean`}><span aria-hidden="true">💨</span> {getHealthForYear(timePoints[activeYear].year)}% clean</span>
                </div>
              </article>
            </GlassCard>
          </motion.section>
        </AnimatePresence>

        {activeYear === 3 && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }} className="max-w-md mx-auto mt-6 text-center">
            <button type="button" aria-label="Read a letter from your future Earth" className="w-full focus-visible:outline focus-visible:outline-2 focus-visible:outline-terra-green-400 rounded-2xl">
              <GlassCard glow="aurora" className="text-left">
                <div className="text-2xl mb-2" aria-hidden="true">✉️</div>
                <div className="text-sm font-semibold">A letter from your future Earth</div>
                <div className="text-xs text-terra-space-400 mt-1 italic">&quot;Thank you for choosing me...&quot;</div>
              </GlassCard>
            </button>
          </motion.div>
        )}
      </div>
<div className="fixed bottom-6 right-8 z-50">
        <FloatingNav />
      </div>
    </main>
  );
}
