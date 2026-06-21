'use client';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { GlassCard } from '@/components/ui/glass-card';
import { FloatingNav } from '@/components/ui/floating-nav';

const scenarios = [
  { id: 'plastic', question: 'Stop using plastic bottles', co2: 340, trees: 12, icon: '🧴' },
  { id: 'transit', question: 'Use public transport daily', co2: 1200, trees: 42, icon: '🚌' },
  { id: 'veg', question: 'Eat vegetarian 2x/week', co2: 520, trees: 18, icon: '🥗' },
  { id: 'energy', question: 'Switch to LED bulbs', co2: 180, trees: 6, icon: '💡' },
  { id: 'local', question: 'Buy local produce only', co2: 290, trees: 10, icon: '🌽' },
];

export default function SimulatorPage() {
  const [selected, setSelected] = useState<string | null>(null);
  const active = scenarios.find((s) => s.id === selected);

  return (
    <main className="relative min-h-screen p-6 pb-24 bg-terra-space-950">
      <motion.h1 initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="text-3xl font-display font-bold text-center mt-8 mb-2">
        What If...?
      </motion.h1>
      <p className="text-center text-terra-space-400 mb-8 text-sm">See how one change transforms your world</p>

      <section className="space-y-3 max-w-md mx-auto" role="region" aria-label="Scenario options">
        {scenarios.map((scenario, i) => (
          <motion.div key={scenario.id} initial={{ opacity: 0, x: -30 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.1 }}>
            <button
              type="button"
              onClick={() => setSelected(scenario.id)}
              aria-pressed={selected === scenario.id}
              aria-label={`${scenario.question}. ${selected === scenario.id ? 'Selected' : ''}`}
              className={`w-full text-left focus-visible:outline focus-visible:outline-2 focus-visible:outline-terra-green-400 rounded-2xl ${selected === scenario.id ? 'border-terra-green-500/50' : ''}`}
            >
              <GlassCard
                className={selected === scenario.id ? 'border-terra-green-500/50' : ''}
                glow={selected === scenario.id ? 'green' : 'none'}
              >
                <div className="flex items-center gap-3">
                  <span className="text-2xl" aria-hidden="true">{scenario.icon}</span>
                  <span className="font-medium">{scenario.question}</span>
                </div>
              </GlassCard>
            </button>
          </motion.div>
        ))}
      </section>

      <AnimatePresence>
        {active && (
          <motion.div 
            initial={{ opacity: 0, y: 30, scale: 0.95 }} 
            animate={{ opacity: 1, y: 0, scale: 1 }} 
            exit={{ opacity: 0, y: 30 }} 
            className="mt-8 max-w-md mx-auto"
            role="region"
            aria-live="polite"
            aria-label="Impact summary"
          >
            <GlassCard glow="aurora" className="text-center">
              <h2 className="text-lg font-display font-semibold mb-4">Your Impact in 1 Year</h2>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <motion.div key={active.co2} initial={{ scale: 0 }} animate={{ scale: 1 }} className="text-3xl font-mono font-bold text-terra-green-400" aria-label={`Save ${active.co2} kilograms of CO2 per year`}>{active.co2}</motion.div>
                  <div className="text-xs text-terra-space-400 mt-1">kg CO₂ saved/year</div>
                </div>
                <div>
                  <motion.div key={active.trees} initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 0.1 }} className="text-3xl font-mono font-bold text-terra-green-400" aria-label={`Equivalent to ${active.trees} trees`}><span aria-hidden="true">🌳</span> {active.trees}</motion.div>
                  <div className="text-xs text-terra-space-400 mt-1">trees equivalent</div>
                </div>
              </div>
              <motion.button 
                whileHover={{ scale: 1.05 }} 
                whileTap={{ scale: 0.95 }} 
                type="button"
                aria-label={`Start this change: ${active.question}`}
                className="mt-6 w-full py-3 rounded-xl bg-gradient-earth text-white font-semibold text-sm tracking-wide focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-terra-green-400"
              >
                START THIS CHANGE →
              </motion.button>
            </GlassCard>
          </motion.div>
        )}
      </AnimatePresence>

    <div className="absolute bottom-6 right-8 z-50">
        <FloatingNav />
      </div>
    </main>
  );
}
