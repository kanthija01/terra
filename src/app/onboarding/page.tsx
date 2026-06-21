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

  const handleOptionKeyDown = (
    event: React.KeyboardEvent<HTMLButtonElement>,
    optionIndex: number,
    optionImpact: number
  ) => {
    const options = steps[step].options;
    const move = (offset: number) => {
      const nextIndex = (optionIndex + offset + options.length) % options.length;
      const nextOption = options[nextIndex];
      if (nextOption) {
        const nextButton = document.querySelector(
          `[data-option-value="${nextOption.value}"]`
        ) as HTMLButtonElement | null;
        nextButton?.focus();
      }
    };

    if (event.key === 'ArrowRight' || event.key === 'ArrowDown') {
      event.preventDefault();
      move(1);
      return;
    }

    if (event.key === 'ArrowLeft' || event.key === 'ArrowUp') {
      event.preventDefault();
      move(-1);
      return;
    }

    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      handleSelect(optionImpact);
    }
  };

  return (
    <main className="min-h-screen flex flex-col items-center justify-center p-6 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-terra-space-950 via-terra-space-900 to-terra-green-900/20" />

      {/* Progress */}
      <section className="relative z-10 w-full max-w-md mb-12" aria-label="Onboarding progress" role="region">
        <div className="flex gap-2" role="progressbar" aria-valuenow={step + 1} aria-valuemin={1} aria-valuemax={steps.length}>
          {steps.map((_, i) => (
            <div key={i} className="flex-1 h-1 rounded-full bg-terra-space-800 overflow-hidden" aria-hidden="true">
              <motion.div animate={{ width: i <= step ? '100%' : '0%' }} className="h-full bg-terra-green-400 rounded-full" />
            </div>
          ))}
        </div>
      </section>

      <AnimatePresence mode="wait">
        <motion.section
          key={step}
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -50 }}
          className="relative z-10 w-full max-w-md text-center"
          role="region"
          aria-label={`Question ${step + 1} of ${steps.length}`}
          aria-live="polite"
        >
          <motion.div initial={{ scale: 0.8 }} animate={{ scale: 1 }} className="text-6xl mb-6" aria-hidden="true">🌍</motion.div>
          <h1 className="text-3xl font-display font-bold mb-8">{steps[step].question}</h1>
          <div className="space-y-3" role="radiogroup" aria-label="Answer options">
            {steps[step].options.map((option, optionIndex) => (
              <motion.button
                key={option.value}
                type="button"
                role="radio"
                aria-label={option.label}
                aria-checked={false}
                data-option-value={option.value}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => handleSelect(option.impact)}
                onKeyDown={(event) => handleOptionKeyDown(event, optionIndex, option.impact)}
                className="w-full glass glass-hover p-4 text-left text-lg font-medium focus-visible:outline focus-visible:outline-2 focus-visible:outline-terra-green-400"
              >
                {option.label}
              </motion.button>
            ))}
          </div>
        </motion.section>
      </AnimatePresence>

      <motion.section className="relative z-10 mt-8 text-center" animate={{ opacity: step > 0 ? 1 : 0 }} aria-live="polite" aria-label="Earth health score">
        <div className="text-sm text-terra-space-400">Earth forming...</div>
        <div className="text-2xl font-mono font-bold text-terra-green-400" aria-label={`Current score: ${score} percent`}>{score}%</div>
      </motion.section>
    </main>
  );
}
