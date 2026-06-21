/**
 * Gaia recommendation engine.
 *
 * Turns the user's current footprint inputs + computed result into a
 * single "next best action": the category with the largest realistic
 * carbon saving, paired with a tone-appropriate message from Gaia and
 * an estimated kg CO2/year saving if the user takes that action.
 *
 * Pure functions only — no React, no store access — so this can be
 * unit-tested and reused from any component or store.
 */

import {
  TRANSPORT_FACTORS,
  ELECTRICITY_FACTORS,
  FOOD_FACTORS,
  TRANSPORT_LABELS,
  FOOD_LABELS,
  type CarbonInputs,
  type CarbonResult,
  type TransportMode,
  type ElectricityUsage,
  type FoodHabit,
} from './carbon';

export type RecommendationCategory = 'transport' | 'electricity' | 'food' | 'maintain';

export interface Recommendation {
  category: RecommendationCategory;
  /** Gaia's spoken message, in character, referencing the user's actual habits. */
  message: string;
  /** Short label for a CTA chip, e.g. "Try the train" */
  actionLabel: string;
  /** Estimated kg CO2e/year saved by taking the suggested next step. */
  estimatedSavingsKg: number;
  /** Icon for the recommendation card. */
  icon: string;
}

// --- Step-down paths: each category's options ordered from highest to lowest impact ---
const TRANSPORT_STEPS: TransportMode[] = ['car', 'bus', 'train', 'bicycle'];
const ELECTRICITY_STEPS: ElectricityUsage[] = ['high', 'medium', 'low'];
const FOOD_STEPS: FoodHabit[] = ['heavy_meat', 'mixed', 'vegetarian'];

function nextStep<T>(steps: T[], current: T): T | null {
  const idx = steps.indexOf(current);
  if (idx === -1 || idx === steps.length - 1) return null; // already at the best option
  return steps[idx + 1];
}

function transportSavings(current: TransportMode): { next: TransportMode; savings: number } | null {
  const next = nextStep(TRANSPORT_STEPS, current);
  if (!next) return null;
  return { next, savings: TRANSPORT_FACTORS[current] - TRANSPORT_FACTORS[next] };
}

function electricitySavings(current: ElectricityUsage): { next: ElectricityUsage; savings: number } | null {
  const next = nextStep(ELECTRICITY_STEPS, current);
  if (!next) return null;
  return { next, savings: ELECTRICITY_FACTORS[current] - ELECTRICITY_FACTORS[next] };
}

function foodSavings(current: FoodHabit): { next: FoodHabit; savings: number } | null {
  const next = nextStep(FOOD_STEPS, current);
  if (!next) return null;
  return { next, savings: FOOD_FACTORS[current] - FOOD_FACTORS[next] };
}

const ELECTRICITY_NEXT_LABEL: Record<ElectricityUsage, string> = {
  high: 'medium',
  medium: 'low',
  low: 'low',
};

/**
 * Core recommendation engine.
 *
 * Looks at all three categories, finds the one with the biggest available
 * carbon saving, and returns a single context-aware recommendation.
 * If the user is already optimal everywhere, returns an encouragement
 * to maintain their habits instead.
 */
export function getRecommendation(inputs: CarbonInputs, result: CarbonResult): Recommendation {
  const candidates: Array<{
    category: RecommendationCategory;
    savings: number;
    actionLabel: string;
    message: string;
    icon: string;
  }> = [];

  const t = transportSavings(inputs.transport);
  if (t && t.savings > 0) {
    candidates.push({
      category: 'transport',
      savings: t.savings,
      actionLabel: `Try the ${TRANSPORT_LABELS[t.next].label.toLowerCase()}`,
      icon: TRANSPORT_LABELS[t.next].icon,
      message: `Switching from ${TRANSPORT_LABELS[inputs.transport].label.toLowerCase()} to ${TRANSPORT_LABELS[t.next].label.toLowerCase()} could save you about ${Math.round(t.savings).toLocaleString()} kg of CO₂ a year.`,
    });
  }

  const e = electricitySavings(inputs.electricity);
  if (e && e.savings > 0) {
    candidates.push({
      category: 'electricity',
      savings: e.savings,
      actionLabel: `Cut electricity to ${ELECTRICITY_NEXT_LABEL[inputs.electricity]}`,
      icon: '⚡',
      message: `Trimming your electricity use from ${inputs.electricity} to ${e.next} could save roughly ${Math.round(e.savings).toLocaleString()} kg of CO₂ a year.`,
    });
  }

  const f = foodSavings(inputs.food);
  if (f && f.savings > 0) {
    candidates.push({
      category: 'food',
      savings: f.savings,
      actionLabel: `Shift toward ${FOOD_LABELS[f.next].label.toLowerCase()}`,
      icon: FOOD_LABELS[f.next].icon,
      message: `Moving your diet from ${FOOD_LABELS[inputs.food].label.toLowerCase()} to ${FOOD_LABELS[f.next].label.toLowerCase()} could save around ${Math.round(f.savings).toLocaleString()} kg of CO₂ a year.`,
    });
  }

  if (candidates.length === 0) {
    return {
      category: 'maintain',
      message: `You're already at the lowest-impact choice in every category I track. Your footprint of ${result.total.toLocaleString()} kg CO₂e a year is about as light as it gets — keep it up!`,
      actionLabel: 'Keep it up',
      estimatedSavingsKg: 0,
      icon: '🌟',
    };
  }

  // Pick the single highest-impact lever.
  candidates.sort((a, b) => b.savings - a.savings);
  const best = candidates[0];

  // Adjust tone based on overall rating, without changing the underlying numbers.
  let toneMessage = best.message;
  if (result.rating === 'high') {
    toneMessage = `Your footprint is running well above the global average right now. ${best.message}`;
  } else if (result.rating === 'low') {
    toneMessage = `You're already doing better than most! One more easy win: ${best.message.charAt(0).toLowerCase()}${best.message.slice(1)}`;
  }

  return {
    category: best.category,
    message: toneMessage,
    actionLabel: best.actionLabel,
    estimatedSavingsKg: Math.round(best.savings),
    icon: best.icon,
  };
}

/**
 * Convenience helper: compute the recommendation directly from raw inputs,
 * without requiring the caller to have already run calculateFootprint.
 */
export function getRecommendationFromInputs(
  inputs: CarbonInputs,
  calculateFootprint: (i: CarbonInputs) => CarbonResult
): Recommendation {
  return getRecommendation(inputs, calculateFootprint(inputs));
}
