'use client';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTerraStore } from '@/stores/terra-store';
import { useRouter } from 'next/navigation';

const steps = [
  {
    question: 'How do you get around?',
    options: [
      { label: '🚶 Walk / Bike', value: 'walk', impact: 20 },
      { label: '🚌 Public Transit', value: 'transit', impact: 10 },
      { label: '🚗 Car', value: 'car', impact: -10 },
      { label: '🔀 Mix of all', value: 'mix', impact: 5 },
    ],
  },
  {
    question: 'What do you eat most?',
    options: [
      { label: '🌱 Plant-based', value: 'plant', impact: 20 },
      { label: '🍽️ Balanced mix', value: 'mixed', impact: 5 },
      { label: '🥩 Meat-heavy', value: 'meat', impact: -15 },
    ],
  },
  {
    question: 'Your home energy?',
    options: [
      { label: '☀️ Renewable', value: 'renewable', impact: 20 },
      { label: '🔌 Standard grid', value: 'grid', impact: 0 },
      { label: '⚡ Heavy usage', value: 'heavy', impact: -15 },
    ],
  },
];

export default function OnboardingPage() {
  const [step, setStep] = useState(0);
  const [score, setScore] = useState(50);
  const { setEarthState, addScore } = useTerraStore();
  const router = useRouter();

  const handleSelect = (impact: number) => {
    const newScore = Math.min(100, Math.max(0, score + impact));
    setScore(newScore);
    if (step < steps.length - 1) {
      setStep((s) => s + 1);
    } else {
      setEarthState({ health: newScore, vegetation: newScore * 0.8, water: newScore * 0.9, air: newScore * 0.7 });
      addScore(newScore - 65);
      router.push('/earth');
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-terra-space-950 via-terra-space-900 to-terra-green-900/20" />

      {/* Progress */}
      <div className="relative z-10 w-full max-w-md mb-12">
        <div className="flex gap-2">
          {steps.map((_, i) => (
            <div key={i} className="flex-1 h-1 rounded-full bg-terra-space-800 overflow-hidden">
              <motion.div animate={{ width: i <= step ? '100%' : '0%' }} className="h-full bg-terra-green-400 rounded-full" />
            </div>
          ))}
        </div>
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={step}
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -50 }}
          className="relative z-10 w-full max-w-md text-center"
        >
          <motion.div initial={{ scale: 0.8 }} animate={{ scale: 1 }} className="text-6xl mb-6">🌍</motion.div>
          <h1 className="text-3xl font-display font-bold mb-8">{steps[step].question}</h1>
          <div className="space-y-3">
            {steps[step].options.map((option) => (
              <motion.button
                key={option.value}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => handleSelect(option.impact)}
                className="w-full glass glass-hover p-4 text-left text-lg font-medium"
              >
                {option.label}
              </motion.button>
            ))}
          </div>
        </motion.div>
      </AnimatePresence>

      <motion.div className="relative z-10 mt-8 text-center" animate={{ opacity: step > 0 ? 1 : 0 }}>
        <div className="text-sm text-terra-space-400">Earth forming...</div>
        <div className="text-2xl font-mono font-bold text-terra-green-400">{score}%</div>
      </motion.div>
    </div>
  );
}
