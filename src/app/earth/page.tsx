'use client';
import { motion } from 'framer-motion';
import dynamic from 'next/dynamic';
import { GlassCard } from '@/components/ui/glass-card';
import { FloatingNav } from '@/components/ui/floating-nav';
import { useTerraStore } from '@/stores/terra-store';

const EarthScene = dynamic(
  () => import('@/components/three/EarthScene').then(m => ({ default: m.EarthScene })),
  { ssr: false }
);

const WEATHER_LABELS: Record<string, string> = {
  clear:  '☀️ Clear skies',
  aurora: '🌌 Aurora active',
  rain:   '🌧️ Healing rain',
};

export default function EarthPage() {
  const { score, missions, earthState } = useTerraStore();

  return (
    <div className="relative h-screen w-full overflow-hidden">

      <EarthScene />

      {/* TOP RIGHT: Weather + Earth Health */}
      <div className="absolute top-6 right-8 z-10 flex flex-col items-end gap-3">
        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
          <div className="glass px-3 py-1.5 rounded-full text-xs text-terra-space-400">
            {WEATHER_LABELS[earthState.weather] ?? null}
          </div>
        </motion.div>

        <motion.div initial={{ opacity: 0, scale: 0.92 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.15, duration: 0.4 }} className="text-right">
          <div className="text-6xl font-mono font-bold gradient-text leading-none">{score}</div>
          <div className="text-[10px] tracking-widest uppercase text-terra-space-400 mt-1">Earth Health</div>
        </motion.div>
      </div>

      {/* LEFT COLUMN: Missions top, Gaia bottom */}
      <div className="absolute top-8 bottom-28 left-6 z-10 flex flex-col justify-between">

        <motion.div initial={{ opacity: 0, x: -16 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.3, duration: 0.4 }} className="flex flex-col gap-3">
          {missions.map((mission, i) => (
            <GlassCard key={mission.id} className="w-44 p-4">
              <div className="text-2xl mb-2">{mission.icon}</div>
              <div className="text-sm font-semibold text-terra-space-200 leading-tight">{mission.name}</div>
              <div className="mt-3 h-1.5 rounded-full bg-terra-space-800 overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${(mission.progress / mission.target) * 100}%` }}
                  transition={{ delay: 0.6 + i * 0.1, duration: 0.7, ease: 'easeOut' }}
                  className="h-full rounded-full bg-gradient-to-r from-terra-green-500 to-terra-green-300"
                />
              </div>
              <div className="text-[11px] text-terra-space-500 mt-1.5">{mission.progress}/{mission.target}</div>
            </GlassCard>
          ))}
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.8, duration: 0.4 }} className="w-72">
          <GlassCard glow="aurora" className="flex items-start gap-3 p-5">
            <span className="text-xl mt-0.5 shrink-0">🌱</span>
            <div>
              <div className="text-[10px] font-semibold tracking-widest uppercase text-terra-aurora-purple mb-1.5">Gaia</div>
              <p className="text-sm text-terra-space-200 italic leading-relaxed">
                &quot;Your Earth is breathing easier today! That bike ride cleared the skies for hundreds.&quot;
              </p>
            </div>
          </GlassCard>
        </motion.div>

      </div>

      {/* BOTTOM RIGHT: Nav */}
      <div className="absolute bottom-6 right-8 z-50">
        <FloatingNav />
      </div>

    </div>
  );
}