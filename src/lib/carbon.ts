/**
 * Carbon footprint calculation engine.
 *
 * All factors are simplified, illustrative annual averages (kg CO2e/year)
 * commonly cited in consumer-facing footprint calculators. They are meant
 * to give people a directional sense of their impact, not a scientifically
 * precise audit.
 */

export type TransportMode = 'car' | 'bus' | 'train' | 'bicycle';
export type ElectricityUsage = 'low' | 'medium' | 'high';
export type FoodHabit = 'vegetarian' | 'mixed' | 'heavy_meat';

export interface CarbonInputs {
  transport: TransportMode;
  electricity: ElectricityUsage;
  food: FoodHabit;
}

export interface CategoryBreakdown {
  transport: number;
  electricity: number;
  food: number;
}

export interface CarbonResult {
  breakdown: CategoryBreakdown;
  total: number;
  globalAverage: number;
  diff: number; // total - globalAverage (negative = below average)
  percentVsAverage: number; // total / globalAverage * 100
  rating: 'low' | 'average' | 'high';
  treesToOffset: number;
}

// kg CO2e per year, based on typical commute-distance assumptions.
export const TRANSPORT_FACTORS: Record<TransportMode, number> = {
  car: 2300,
  bus: 900,
  train: 600,
  bicycle: 50,
};

// kg CO2e per year, based on household electricity consumption tiers.
export const ELECTRICITY_FACTORS: Record<ElectricityUsage, number> = {
  low: 600,
  medium: 1500,
  high: 3000,
};

// kg CO2e per year, based on dietary pattern.
export const FOOD_FACTORS: Record<FoodHabit, number> = {
  vegetarian: 1000,
  mixed: 1800,
  heavy_meat: 2900,
};

// Commonly cited global average annual personal carbon footprint (kg CO2e/year).
export const GLOBAL_AVERAGE_KG = 4800;

// Roughly how much CO2 a single mature tree absorbs per year (kg CO2/year).
const KG_CO2_PER_TREE_PER_YEAR = 21;

export const TRANSPORT_LABELS: Record<TransportMode, { label: string; icon: string }> = {
  car: { label: 'Car', icon: '🚗' },
  bus: { label: 'Bus', icon: '🚌' },
  train: { label: 'Train', icon: '🚆' },
  bicycle: { label: 'Bicycle', icon: '🚴' },
};

export const ELECTRICITY_LABELS: Record<ElectricityUsage, { label: string; icon: string }> = {
  low: { label: 'Low', icon: '🔋' },
  medium: { label: 'Medium', icon: '⚡' },
  high: { label: 'High', icon: '🔥' },
};

export const FOOD_LABELS: Record<FoodHabit, { label: string; icon: string }> = {
  vegetarian: { label: 'Vegetarian', icon: '🥗' },
  mixed: { label: 'Mixed', icon: '🍽️' },
  heavy_meat: { label: 'Heavy Meat', icon: '🥩' },
};

function round(n: number) {
  return Math.round(n);
}

export function calculateFootprint(inputs: CarbonInputs): CarbonResult {
  const transport = TRANSPORT_FACTORS[inputs.transport];
  const electricity = ELECTRICITY_FACTORS[inputs.electricity];
  const food = FOOD_FACTORS[inputs.food];

  const total = transport + electricity + food;
  const diff = total - GLOBAL_AVERAGE_KG;
  const percentVsAverage = (total / GLOBAL_AVERAGE_KG) * 100;

  let rating: CarbonResult['rating'] = 'average';
  if (percentVsAverage <= 85) rating = 'low';
  else if (percentVsAverage >= 115) rating = 'high';

  return {
    breakdown: { transport, electricity, food },
    total: round(total),
    globalAverage: GLOBAL_AVERAGE_KG,
    diff: round(diff),
    percentVsAverage: Math.round(percentVsAverage),
    rating,
    treesToOffset: Math.ceil(total / KG_CO2_PER_TREE_PER_YEAR),
  };
}
