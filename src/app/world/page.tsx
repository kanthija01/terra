'use client';
import { motion } from 'framer-motion';
import { GlassCard } from '@/components/ui/glass-card';
import { FloatingNav } from '@/components/ui/floating-nav';

const creatures = [
  { id: 'butterfly', emoji: '🦋', name: 'Monarch Butterfly', unlocked: true },
  { id: 'bird', emoji: '🐦', name: 'Songbird', unlocked: true },
  { id: 'deer', emoji: '🦌', name: 'Forest Deer', unlocked: false },
  { id: 'whale', emoji: '🐋', name: 'Blue Whale', unlocked: false },
  { id: 'fox', emoji: '🦊', name: 'Red Fox', unlocked: false },
  { id: 'owl', emoji: '🦉', name: 'Snowy Owl', unlocked: false },
];

const worldFeatures = [
  { emoji: '🌈', name: 'Rainbow', unlocked: true },
  { emoji: '🌊', name: 'Waterfall', unlocked: false },
  { emoji: '🌸', name: 'Cherry Blossoms', unlocked: false },
  { emoji: '🌌', name: 'Aurora Skies', unlocked: false },
  { emoji: '✨', name: 'Fireflies', unlocked: true },
];

export default function WorldPage() {
  return (
    <div className="min-h-screen p-6 pb-24 bg-terra-space-950">
      <motion.h1 initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="text-3xl font-display font-bold text-center mt-8 mb-1">My World</motion.h1>
      <p className="text-center text-terra-space-400 mb-8 text-sm">Your world grows with every choice</p>

      <section className="max-w-md mx-auto mb-8">
        <h2 className="text-sm font-semibold text-terra-space-400 uppercase tracking-widest mb-3">Creatures</h2>
        <div className="grid grid-cols-3 gap-3">
          {creatures.map((c, i) => (
            <motion.div key={c.id} initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: i * 0.05 }}>
              <GlassCard className={`text-center ${!c.unlocked && 'opacity-40'}`}>
                <div className="text-3xl mb-1">{c.unlocked ? c.emoji : '🔒'}</div>
                <div className="text-[10px] text-terra-space-400">{c.name}</div>
              </GlassCard>
            </motion.div>
          ))}
        </div>
      </section>

      <section className="max-w-md mx-auto mb-8">
        <h2 className="text-sm font-semibold text-terra-space-400 uppercase tracking-widest mb-3">World Features</h2>
        <div className="grid grid-cols-3 gap-3">
          {worldFeatures.map((f, i) => (
            <motion.div key={f.name} initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.3 + i * 0.05 }}>
              <GlassCard className={`text-center ${!f.unlocked && 'opacity-40'}`}>
                <div className="text-3xl mb-1">{f.unlocked ? f.emoji : '🔒'}</div>
                <div className="text-[10px] text-terra-space-400">{f.name}</div>
              </GlassCard>
            </motion.div>
          ))}
        </div>
      </section>

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }} className="max-w-md mx-auto">
        <GlassCard glow="green" className="text-center cursor-pointer">
          <div className="text-4xl mb-2">🌺</div>
          <div className="font-display font-semibold">Memory Garden</div>
          <div className="text-xs text-terra-space-400 mt-1">12 flowers planted • Growing since March</div>
        </GlassCard>
      </motion.div>

      <FloatingNav />
    </div>
  );
}
