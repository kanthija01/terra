'use client';
import { motion } from 'framer-motion';
import { GlassCard } from '@/components/ui/glass-card';
import { FloatingNav } from '@/components/ui/floating-nav';

const members = [
  { name: 'You', score: 73, avatar: '🌍' },
  { name: 'Sarah', score: 82, avatar: '🌎' },
  { name: 'Alex', score: 67, avatar: '🌏' },
  { name: 'Maya', score: 91, avatar: '🌍' },
];

export default function VillagePage() {
  return (
    <main className="relative min-h-screen bg-terra-space-950 overflow-hidden">
      <motion.h1 initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="text-3xl font-display font-bold text-center mt-8 mb-1">Green Valley Village</motion.h1>
      <p className="text-center text-terra-space-400 mb-8 text-sm">4 members • 156 trees planted together</p>

      <motion.section initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="max-w-md mx-auto mb-6" aria-label="Community forest progress">
        <GlassCard glow="green" className="text-center py-8">
          <div className="text-5xl mb-3" aria-hidden="true">🌲🌳🌲🌳🌲</div>
          <h2 className="font-display font-semibold text-lg">Community Forest</h2>
          <div className="text-3xl font-mono font-bold text-terra-green-400 mt-2" aria-label="156 trees planted this month">156</div>
          <div className="text-xs text-terra-space-400">trees planted this month</div>
          <div className="mt-3 h-2 rounded-full bg-terra-space-800 max-w-[200px] mx-auto" role="progressbar" aria-valuenow={78} aria-valuemin={0} aria-valuemax={100}>
            <motion.div initial={{ width: 0 }} animate={{ width: '78%' }} transition={{ duration: 1, delay: 0.5 }} className="h-full rounded-full bg-gradient-to-r from-terra-green-600 to-terra-green-300" aria-hidden="true" />
          </div>
          <div className="text-[10px] text-terra-space-400 mt-1">156/200 monthly goal</div>
        </GlassCard>
      </motion.section>

      <section className="max-w-md mx-auto space-y-3 mb-6" role="region" aria-label="Village members and scores">
        <h2 className="text-sm font-semibold text-terra-space-400 uppercase tracking-widest">Villagers</h2>
        {members.map((m, i) => (
          <motion.div key={m.name} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.3 + i * 0.1 }} aria-label={`${m.name}, score ${m.score}`}>
            <GlassCard className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span className="text-2xl" aria-hidden="true">{m.avatar}</span>
                <span className="font-medium">{m.name}</span>
              </div>
              <div className="text-terra-green-400 font-mono font-bold" aria-label={`Score: ${m.score}`}>{m.score}</div>
            </GlassCard>
          </motion.div>
        ))}
      </section>

      <motion.section initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.7 }} className="max-w-md mx-auto" aria-label="This week's challenge event">
        <GlassCard glow="aurora" className="text-center">
          <h3 className="text-xs text-terra-aurora-purple font-semibold uppercase tracking-widest">This Week&apos;s Event</h3>
          <div className="text-xl font-display font-bold mt-2"><span aria-hidden="true">🌊</span> Ocean Week</div>
          <div className="text-sm text-terra-space-400 mt-1">Reduce single-use plastics • 3 days left</div>
          <motion.button 
            whileTap={{ scale: 0.95 }} 
            type="button"
            aria-label="Join Ocean Week challenge"
            className="mt-4 px-6 py-2 rounded-xl bg-gradient-aurora text-white text-sm font-semibold focus-visible:outline focus-visible:outline-2 focus-visible:outline-terra-green-400"
          >
            Join Challenge
          </motion.button>
        </GlassCard>
      </motion.section>

    <div className="fixed bottom-6 right-8 z-50">
        <FloatingNav />
      </div>
    </main>
  );
}
