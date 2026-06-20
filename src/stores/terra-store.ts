'use client';
import { create } from 'zustand';

interface EarthState {
  health: number;
  vegetation: number;
  water: number;
  air: number;
  biodiversity: number;
  season: 'spring' | 'summer' | 'autumn' | 'winter';
  weather: 'clear' | 'cloudy' | 'rain' | 'aurora' | 'storm';
}

interface Mission {
  id: string;
  name: string;
  icon: string;
  progress: number;
  target: number;
  reward: string;
}

interface TerraStore {
  earthState: EarthState;
  score: number;
  streak: number;
  missions: Mission[];
  achievements: string[];
  gaiaMessage: string | null;
  setEarthState: (state: Partial<EarthState>) => void;
  addScore: (delta: number) => void;
  setGaiaMessage: (msg: string | null) => void;
  unlockAchievement: (id: string) => void;
}

export const useTerraStore = create<TerraStore>((set) => ({
  earthState: {
    health: 65,
    vegetation: 60,
    water: 70,
    air: 55,
    biodiversity: 40,
    season: 'spring',
    weather: 'clear',
  },
  score: 65,
  streak: 3,
  missions: [
    { id: '1', name: 'Plastic Slayer', icon: '🦋', progress: 4, target: 7, reward: 'butterfly' },
    { id: '2', name: 'Bike Hero', icon: '🚴', progress: 6, target: 7, reward: 'bird' },
    { id: '3', name: 'Energy Wizard', icon: '⚡', progress: 2, target: 5, reward: 'firefly' },
  ],
  achievements: ['butterfly', 'tree'],
  gaiaMessage: null,
  setEarthState: (state) => set((s) => ({ earthState: { ...s.earthState, ...state } })),
  addScore: (delta) => set((s) => ({ score: Math.min(100, Math.max(0, s.score + delta)) })),
  setGaiaMessage: (msg) => set({ gaiaMessage: msg }),
  unlockAchievement: (id) => set((s) => ({ achievements: [...s.achievements, id] })),
}));
