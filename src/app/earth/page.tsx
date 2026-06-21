'use client';
import React, { useEffect, useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import dynamic from 'next/dynamic';
import { useRouter } from 'next/navigation';
import { GlassCard } from '@/components/ui/glass-card';
import { FloatingNav } from '@/components/ui/floating-nav';
import { useTerraStore } from '@/stores/terra-store';
import { useFootprintStore } from '@/stores/carbon-store';
import { getRecommendation } from '@/lib/gaia-recommendations';
import { askGaia } from '@/lib/gemini';

const EarthScene = dynamic(
  () => import('@/components/three/EarthScene').then(m => ({ default: m.EarthScene })),
  {
    ssr: false,
    loading: () => (
      <div className="absolute inset-0 flex items-center justify-center bg-terra-space-950/60">
        <div className="text-sm text-terra-space-300">Loading Earth view…</div>
      </div>
    ),
  }
);

const WEATHER_LABELS: Record<string, string> = {
  clear:  '☀️ Clear skies',
  aurora: '🌌 Aurora active',
  rain:   '🌧️ Healing rain',
};

const DEFAULT_GAIA_MESSAGE = 'Your Earth is breathing easier today! That bike ride cleared the skies for hundreds.';

export default function EarthPage() {
  const router = useRouter();
  const { score, missions, earthState, gaiaMessage, setGaiaMessage } = useTerraStore();
  const { inputs, result } = useFootprintStore();
  const [isLoadingGaia, setIsLoadingGaia] = useState(false);

  // Gaia becomes context-aware once the user has run the footprint calculator;
  // until then she shows her original welcome message.
  const recommendation = useMemo(
    () => (result ? getRecommendation(inputs, result) : null),
    [inputs, result]
  );
  const activeGaiaMessage = useMemo(
    () => gaiaMessage ?? (recommendation ? recommendation.message : DEFAULT_GAIA_MESSAGE),
    [gaiaMessage, recommendation]
  );
  const gaiaIcon = recommendation && recommendation.category !== 'maintain' ? recommendation.icon : '🌱';

  useEffect(() => {
    if (!result || !recommendation) {
      return;
    }

    let cancelled = false;
    const context = `The user reports transport=${inputs.transport}, electricity=${inputs.electricity}, and food=${inputs.food}. Current footprint is ${result.total} kg CO₂e/year, rating=${result.rating}, and the best next action is ${recommendation.actionLabel}.`;

    setIsLoadingGaia(true);
    askGaia(context)
      .then((message) => {
        if (!cancelled) {
          setGaiaMessage(message);
        }
      })
      .catch(() => {
        if (!cancelled) {
          setGaiaMessage(recommendation.message);
        }
      })
      .finally(() => {
        if (!cancelled) {
          setIsLoadingGaia(false);
        }
      });

    return () => {
      cancelled = true;
    };
  }, [inputs, recommendation, result, setGaiaMessage]);

  return (
    <div className="relative h-screen w-full overflow-hidden">

      <EarthScene />

      {/* TOP RIGHT: Weather + Earth Health */}
      <aside className="absolute top-6 right-8 z-10 flex flex-col items-end gap-3" aria-label="Earth status">
        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
          <div className="glass px-3 py-1.5 rounded-full text-xs text-terra-space-400" aria-live="polite" aria-atomic="true">
            {WEATHER_LABELS[earthState.weather] ?? null}
          </div>
        </motion.div>

        <motion.div initial={{ opacity: 0, scale: 0.92 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.15, duration: 0.4 }} className="text-right">
          <div className="text-6xl font-mono font-bold gradient-text leading-none" aria-label={`Earth health score: ${score}`}>{score}</div>
          <div className="text-[10px] tracking-widest uppercase text-terra-space-400 mt-1">Earth Health</div>
        </motion.div>
      </aside>

      {/* LEFT COLUMN: Missions top, Gaia bottom */}
      <aside className="absolute top-8 bottom-28 left-6 z-10 flex flex-col justify-between" aria-label="Active missions and status">

        <motion.div 
          initial={{ opacity: 0, x: -16 }} 
          animate={{ opacity: 1, x: 0 }} 
          transition={{ delay: 0.3, duration: 0.4 }} 
          className="flex flex-col gap-3"
          role="region"
          aria-label="Active missions"
        >
          {missions.map((mission, i) => (
            <article key={mission.id} aria-label={`${mission.name}: ${mission.progress} out of ${mission.target} completed`}>
              <GlassCard className="w-44 p-4">
                <div className="text-2xl mb-2" aria-hidden="true">{mission.icon}</div>
                <h3 className="text-sm font-semibold text-terra-space-200 leading-tight">{mission.name}</h3>
                <div className="mt-3 h-1.5 rounded-full bg-terra-space-800 overflow-hidden" role="progressbar" aria-valuenow={Math.round((mission.progress / mission.target) * 100)} aria-valuemin={0} aria-valuemax={100}>
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${(mission.progress / mission.target) * 100}%` }}
                    transition={{ delay: 0.6 + i * 0.1, duration: 0.7, ease: 'easeOut' }}
                    className="h-full rounded-full bg-gradient-to-r from-terra-green-500 to-terra-green-300"
                    aria-hidden="true"
                  />
                </div>
                <div className="text-[11px] text-terra-space-500 mt-1.5">{mission.progress}/{mission.target}</div>
              </GlassCard>
            </article>
          ))}
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, y: 16 }} 
          animate={{ opacity: 1, y: 0 }} 
          transition={{ delay: 0.8, duration: 0.4 }} 
          className="w-72"
          role="region"
          aria-label="Gaia assistant message and recommendations"
        >
          <GlassCard glow="aurora" className="flex items-start gap-3 p-5">
            <span className="text-xl mt-0.5 shrink-0" aria-hidden="true">{gaiaIcon}</span>
            <div className="flex-1">
              <h2 className="text-[10px] font-semibold tracking-widest uppercase text-terra-aurora-purple mb-1.5">Gaia</h2>
              <p className="text-sm text-terra-space-200 italic leading-relaxed">
                &quot;{isLoadingGaia ? 'Thinking about your Earth…' : activeGaiaMessage}&quot;
              </p>
              {recommendation && recommendation.category !== 'maintain' && (
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={() => router.push('/footprint')}
                  type="button"
                  aria-label={`${recommendation.actionLabel} - Save ${recommendation.estimatedSavingsKg} kg CO2 per year`}
                  className="mt-3 w-full glass glass-hover px-3 py-2 rounded-xl flex items-center justify-between text-left focus-visible:outline focus-visible:outline-2 focus-visible:outline-terra-green-400"
                >
                  <span className="text-xs font-medium text-terra-space-200">{recommendation.actionLabel}</span>
                  <span className="text-[11px] font-mono font-bold text-terra-green-400 shrink-0 ml-2" aria-hidden="true">
                    −{recommendation.estimatedSavingsKg.toLocaleString()} kg/yr
                  </span>
                </motion.button>
              )}
              {!result && (
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={() => router.push('/footprint')}
                  type="button"
                  aria-label="Calculate your carbon footprint"
                  className="mt-3 w-full glass glass-hover px-3 py-2 rounded-xl text-left focus-visible:outline focus-visible:outline-2 focus-visible:outline-terra-green-400"
                >
                  <span className="text-xs font-medium text-terra-space-200"><span aria-hidden="true">🧮</span> Calculate your footprint</span>
                </motion.button>
              )}
            </div>
          </GlassCard>
        </motion.div>

      </aside>

      {/* BOTTOM RIGHT: Nav */}
      <div className="absolute bottom-6 right-8 z-50">
        <FloatingNav />
      </div>

    </div>
  );
}