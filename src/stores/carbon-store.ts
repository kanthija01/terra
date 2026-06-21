'use client';
import { create } from 'zustand';
import {
  calculateFootprint,
  type CarbonInputs,
  type CarbonResult,
  type TransportMode,
  type ElectricityUsage,
  type FoodHabit,
} from '@/lib/carbon';

interface FootprintStore {
  inputs: CarbonInputs;
  result: CarbonResult | null;
  setTransport: (transport: TransportMode) => void;
  setElectricity: (electricity: ElectricityUsage) => void;
  setFood: (food: FoodHabit) => void;
  calculate: () => void;
  reset: () => void;
}

const DEFAULT_INPUTS: CarbonInputs = {
  transport: 'car',
  electricity: 'medium',
  food: 'mixed',
};

export const useFootprintStore = create<FootprintStore>((set, get) => ({
  inputs: DEFAULT_INPUTS,
  result: null,
  setTransport: (transport) => set((s) => ({ inputs: { ...s.inputs, transport } })),
  setElectricity: (electricity) => set((s) => ({ inputs: { ...s.inputs, electricity } })),
  setFood: (food) => set((s) => ({ inputs: { ...s.inputs, food } })),
  calculate: () => set({ result: calculateFootprint(get().inputs) }),
  reset: () => set({ inputs: DEFAULT_INPUTS, result: null }),
}));
