'use client';
import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { GlassCard } from '@/components/ui/glass-card';
import { FloatingNav } from '@/components/ui/floating-nav';
import { AnimatedCounter } from '@/components/ui/animated-counter';
import { useFootprintStore } from '@/stores/carbon-store';
import { getRecommendation } from '@/lib/gaia-recommendations';
import {
  TRANSPORT_LABELS,
  ELECTRICITY_LABELS,
  FOOD_LABELS,
  type TransportMode,
  type ElectricityUsage,
  type FoodHabit,
} from '@/lib/carbon';

const TRANSPORT_OPTIONS = Object.keys(TRANSPORT_LABELS) as TransportMode[];
const ELECTRICITY_OPTIONS = Object.keys(ELECTRICITY_LABELS) as ElectricityUsage[];
const FOOD_OPTIONS = Object.keys(FOOD_LABELS) as FoodHabit[];

const RATING_COPY: Record<string, { title: string; color: string; glow: 'green' | 'aurora' | 'none' }> = {
  low: { title: '🌿 Lighter than average', color: 'text-terra-green-400', glow: 'green' },
  average: { title: '🌍 Close to average', color: 'text-terra-warm-300', glow: 'aurora' },
  high: { title: '🔥 Above average', color: 'text-terra-danger-500', glow: 'none' },
};

function OptionGrid<T extends string>({
  options,
  labels,
  selected,
  onSelect,
}: {
  options: T[];
  labels: Record<T, { label: string; icon: string }>;
  selected: T;
  onSelect: (value: T) => void;
}) {
  const handleKeyDown = (event: React.KeyboardEvent<HTMLButtonElement>, option: T) => {
    const currentIndex = options.indexOf(option);
    if (currentIndex === -1) return;

    const move = (offset: number) => {
      const nextIndex = (currentIndex + offset + options.length) % options.length;
      onSelect(options[nextIndex]);
    };

    if (event.key === 'ArrowRight' || event.key === 'ArrowDown') {
      event.preventDefault();
      move(1);
      return;
    }

    if (event.key === 'ArrowLeft' || event.key === 'ArrowUp') {
      event.preventDefault();
      move(-1);
    }
  };

  return (
    <div className="grid grid-cols-2 gap-2" role="radiogroup" aria-label="Carbon footprint options">
      {options.map((opt) => {
        const active = opt === selected;
        return (
          <motion.button
            key={opt}
            type="button"
            role="radio"
            aria-checked={active}
            aria-label={labels[opt].label}
            aria-pressed={active}
            tabIndex={active ? 0 : -1}
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            onClick={() => onSelect(opt)}
            onKeyDown={(event) => handleKeyDown(event, opt)}
            className={`glass glass-hover flex flex-col items-center gap-1 py-3 rounded-xl border transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-terra-green-400 ${
              active ? 'border-terra-green-500/60 bg-terra-green-500/10' : 'border-white/10'
            }`}
          >
            <span className="text-xl" aria-hidden="true">{labels[opt].icon}</span>
            <span className="text-xs font-medium text-terra-space-200">{labels[opt].label}</span>
          </motion.button>
        );
      })}
    </div>
  );
}

export default function FootprintPage() {
  const { inputs, result, setTransport, setElectricity, setFood, calculate, reset } = useFootprintStore();

  const ratingCopy = result ? RATING_COPY[result.rating] : null;
  const recommendation = result ? getRecommendation(inputs, result) : null;

  return (
    <main className="relative min-h-screen p-6 pb-24 bg-terra-space-950">
      <motion.h1
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-3xl font-display font-bold text-center mt-8 mb-2"
      >
        Carbon Footprint Calculator
      </motion.h1>
      <p className="text-center text-terra-space-400 mb-8 text-sm">
        Estimate your annual CO₂ impact in three steps
      </p>

      <div className="max-w-md mx-auto space-y-5">
        <motion.section initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.1 }} aria-labelledby="transport-heading">
          <GlassCard>
            <h2 id="transport-heading" className="text-sm font-semibold text-terra-space-200 mb-3"><span aria-hidden="true">🚦</span> Transportation</h2>
            <OptionGrid options={TRANSPORT_OPTIONS} labels={TRANSPORT_LABELS} selected={inputs.transport} onSelect={setTransport} />
          </GlassCard>
        </motion.section>

        <motion.section initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 }} aria-labelledby="electricity-heading">
          <GlassCard>
            <h2 id="electricity-heading" className="text-sm font-semibold text-terra-space-200 mb-3"><span aria-hidden="true">⚡</span> Electricity Usage</h2>
            <OptionGrid options={ELECTRICITY_OPTIONS} labels={ELECTRICITY_LABELS} selected={inputs.electricity} onSelect={setElectricity} />
          </GlassCard>
        </motion.section>

        <motion.section initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.3 }} aria-labelledby="food-heading">
          <GlassCard>
            <h2 id="food-heading" className="text-sm font-semibold text-terra-space-200 mb-3"><span aria-hidden="true">🍽️</span> Food Habits</h2>
            <OptionGrid options={FOOD_OPTIONS} labels={FOOD_LABELS} selected={inputs.food} onSelect={setFood} />
          </GlassCard>
        </motion.section>

        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.97 }}
          onClick={calculate}
          type="button"
          aria-label="Calculate your carbon footprint"
          className="w-full py-3 rounded-xl bg-gradient-earth text-white font-semibold text-sm tracking-wide focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-terra-green-400"
        >
          CALCULATE MY FOOTPRINT →
        </motion.button>
      </div>

      <AnimatePresence>
        {result && ratingCopy && (
          <motion.div
            initial={{ opacity: 0, y: 30, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 30 }}
            className="mt-8 max-w-md mx-auto space-y-4"
            role="region"
            aria-live="polite"
            aria-label="Your carbon footprint results"
          >
            <GlassCard glow={ratingCopy.glow} className="text-center">
              <div className={`text-xs font-semibold uppercase tracking-widest mb-1 ${ratingCopy.color}`}>
                {ratingCopy.title}
              </div>
              <div className="text-4xl font-mono font-bold gradient-text mt-2" aria-label={`Your annual carbon footprint is ${result.total} kilograms of CO2 equivalent`}>
                <AnimatedCounter value={result.total} />
              </div>
              <div className="text-xs text-terra-space-400 mt-1">kg CO₂e per year</div>

              <div className="mt-5 h-2 rounded-full bg-terra-space-800 overflow-hidden relative" role="progressbar" aria-valuenow={result.percentVsAverage} aria-valuemin={0} aria-valuemax={200} aria-label={`Your footprint is ${result.percentVsAverage}% of the global average`}>
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${Math.min(100, result.percentVsAverage)}%` }}
                  transition={{ duration: 0.8, ease: 'easeOut' }}
                  className={`h-full rounded-full ${
                    result.rating === 'high'
                      ? 'bg-gradient-to-r from-terra-danger-700 to-terra-danger-500'
                      : 'bg-gradient-to-r from-terra-green-600 to-terra-green-300'
                  }`}
                  aria-hidden="true"
                />
                <div className="absolute top-0 left-1/2 w-px h-full bg-white/40" aria-label="Global average marker" />
              </div>
              <div className="text-[11px] text-terra-space-500 mt-1.5">
                {result.percentVsAverage}% of the global average ({result.globalAverage.toLocaleString()} kg/yr)
              </div>

              <div className="text-sm text-terra-space-300 mt-3">
                {result.diff <= 0 ? (
                  <span>
                    That&apos;s <span className="text-terra-green-400 font-semibold">{Math.abs(result.diff).toLocaleString()} kg</span> below the global average 🎉
                  </span>
                ) : (
                  <span>
                    That&apos;s <span className="text-terra-danger-500 font-semibold">{result.diff.toLocaleString()} kg</span> above the global average
                  </span>
                )}
              </div>
            </GlassCard>

            <GlassCard>
              <h3 className="text-xs font-semibold text-terra-space-400 uppercase tracking-widest mb-3">Breakdown by category</h3>
              <div className="space-y-3">
                {[
                  { key: 'transport', icon: TRANSPORT_LABELS[inputs.transport].icon, label: 'Transportation', value: result.breakdown.transport },
                  { key: 'electricity', icon: ELECTRICITY_LABELS[inputs.electricity].icon, label: 'Electricity', value: result.breakdown.electricity },
                  { key: 'food', icon: FOOD_LABELS[inputs.food].icon, label: 'Food', value: result.breakdown.food },
                ].map((row, i) => (
                  <div key={row.key}>
                    <div className="flex items-center justify-between text-sm mb-1">
                      <span className="flex items-center gap-2 text-terra-space-200">
                        <span aria-hidden="true">{row.icon}</span> <span>{row.label}: {row.value.toLocaleString()} kg</span>
                      </span>
                      <span className="font-mono text-terra-space-300" aria-hidden="true">{row.value.toLocaleString()} kg</span>
                    </div>
                    <div className="h-1.5 rounded-full bg-terra-space-800 overflow-hidden" role="progressbar" aria-valuenow={Math.round((row.value / result.total) * 100)} aria-valuemin={0} aria-valuemax={100} aria-label={`${row.label} is ${Math.round((row.value / result.total) * 100)}% of your total`}>
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${(row.value / result.total) * 100}%` }}
                        transition={{ delay: 0.2 + i * 0.1, duration: 0.7, ease: 'easeOut' }}
                        className="h-full rounded-full bg-gradient-to-r from-terra-blue-600 to-terra-blue-300"
                        aria-hidden="true"
                      />
                    </div>
                  </div>
                ))}
              </div>
            </GlassCard>

            {recommendation && (
              <GlassCard glow="aurora" className="flex items-start gap-3 p-5" role="region" aria-label="Gaia's recommendation">
                <span className="text-xl mt-0.5 shrink-0" aria-hidden="true">{recommendation.category === 'maintain' ? '🌟' : recommendation.icon}</span>
                <div className="flex-1">
                  <h3 className="text-[10px] font-semibold tracking-widest uppercase text-terra-aurora-purple mb-1.5">
                    Gaia&apos;s recommendation
                  </h3>
                  <p className="text-sm text-terra-space-200 italic leading-relaxed">
                    &quot;{recommendation.message}&quot;
                  </p>
                  {recommendation.category !== 'maintain' && (
                    <motion.button
                      type="button"
                      className="mt-3 w-full glass px-3 py-2 rounded-xl flex items-center justify-between focus-visible:outline focus-visible:outline-2 focus-visible:outline-terra-green-400"
                      aria-label={`${recommendation.actionLabel} - Save ${recommendation.estimatedSavingsKg} kg CO2 per year`}
                      whileTap={{ scale: 0.97 }}
                    >
                      <span className="text-xs font-medium text-terra-space-200">{recommendation.actionLabel}</span>
                      <span className="text-[11px] font-mono font-bold text-terra-green-400 shrink-0 ml-2" aria-hidden="true">
                        −{recommendation.estimatedSavingsKg.toLocaleString()} kg/yr
                      </span>
                    </motion.button>
                  )}
                </div>
              </GlassCard>
            )}

            <GlassCard glow="green" className="flex items-center justify-between">
              <div>
                <div className="text-xs text-terra-space-400">To offset this footprint, you&apos;d need</div>
                <div className="text-lg font-display font-semibold mt-0.5"><span aria-hidden="true">🌳</span> {result.treesToOffset.toLocaleString()} trees/year</div>
              </div>
              <motion.button
                type="button"
                whileTap={{ scale: 0.95 }}
                onClick={reset}
                aria-label="Reset calculator"
                className="px-4 py-2 rounded-xl glass text-xs font-medium text-terra-space-300 hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-terra-green-400"
              >
                Reset
              </motion.button>
            </GlassCard>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="fixed bottom-6 right-8 z-50">
        <FloatingNav />
      </div>
    </main>
  );
}
