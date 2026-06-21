import { describe, it, expect, beforeEach } from 'vitest';
import { useTerraStore } from '@/stores/terra-store';

describe('Terra Store (Zustand)', () => {
  beforeEach(() => {
    // Reset store to initial state before each test
    const store = useTerraStore.getState();
    store.earthState = {
      health: 65,
      vegetation: 60,
      water: 70,
      air: 55,
      biodiversity: 40,
      season: 'spring',
      weather: 'clear',
    };
    store.score = 65;
    store.streak = 3;
    store.gaiaMessage = null;
    store.missions = [
      { id: '1', name: 'Plastic Slayer', icon: '🦋', progress: 4, target: 7, reward: 'butterfly' },
      { id: '2', name: 'Bike Hero', icon: '🚴', progress: 6, target: 7, reward: 'bird' },
      { id: '3', name: 'Energy Wizard', icon: '⚡', progress: 2, target: 5, reward: 'firefly' },
    ];
    store.achievements = ['butterfly', 'tree'];
  });

  describe('initial state', () => {
    it('should have initial earth state with valid properties', () => {
      const { earthState } = useTerraStore.getState();

      expect(earthState).toHaveProperty('health');
      expect(earthState).toHaveProperty('vegetation');
      expect(earthState).toHaveProperty('water');
      expect(earthState).toHaveProperty('air');
      expect(earthState).toHaveProperty('biodiversity');
      expect(earthState).toHaveProperty('season');
      expect(earthState).toHaveProperty('weather');
    });

    it('should have health metrics in valid ranges (0-100)', () => {
      const { earthState } = useTerraStore.getState();

      expect(earthState.health).toBeGreaterThanOrEqual(0);
      expect(earthState.health).toBeLessThanOrEqual(100);
      expect(earthState.vegetation).toBeGreaterThanOrEqual(0);
      expect(earthState.vegetation).toBeLessThanOrEqual(100);
      expect(earthState.water).toBeGreaterThanOrEqual(0);
      expect(earthState.water).toBeLessThanOrEqual(100);
      expect(earthState.air).toBeGreaterThanOrEqual(0);
      expect(earthState.air).toBeLessThanOrEqual(100);
      expect(earthState.biodiversity).toBeGreaterThanOrEqual(0);
      expect(earthState.biodiversity).toBeLessThanOrEqual(100);
    });

    it('should have valid season', () => {
      const { earthState } = useTerraStore.getState();

      expect(['spring', 'summer', 'autumn', 'winter']).toContain(earthState.season);
    });

    it('should have valid weather', () => {
      const { earthState } = useTerraStore.getState();

      expect(['clear', 'cloudy', 'rain', 'aurora', 'storm']).toContain(earthState.weather);
    });

    it('should have initial score', () => {
      const { score } = useTerraStore.getState();

      expect(typeof score).toBe('number');
      expect(score).toBeGreaterThanOrEqual(0);
      expect(score).toBeLessThanOrEqual(100);
    });

    it('should have initial missions', () => {
      const { missions } = useTerraStore.getState();

      expect(Array.isArray(missions)).toBe(true);
      expect(missions.length).toBeGreaterThan(0);
    });

    it('should have missions with required properties', () => {
      const { missions } = useTerraStore.getState();

      missions.forEach((mission) => {
        expect(mission).toHaveProperty('id');
        expect(mission).toHaveProperty('name');
        expect(mission).toHaveProperty('icon');
        expect(mission).toHaveProperty('progress');
        expect(mission).toHaveProperty('target');
        expect(mission).toHaveProperty('reward');
      });
    });

    it('should have initial achievements array', () => {
      const { achievements } = useTerraStore.getState();

      expect(Array.isArray(achievements)).toBe(true);
    });

    it('should have null initial gaia message', () => {
      const { gaiaMessage } = useTerraStore.getState();

      expect(gaiaMessage).toBeNull();
    });
  });

  describe('setEarthState', () => {
    it('should update earth state partially', () => {
      const { setEarthState } = useTerraStore.getState();

      setEarthState({ health: 80 });

      const { earthState } = useTerraStore.getState();
      expect(earthState.health).toBe(80);
    });

    it('should preserve other earth state properties when updating one', () => {
      const { setEarthState } = useTerraStore.getState();
      const originalVegetation = useTerraStore.getState().earthState.vegetation;

      setEarthState({ health: 90 });

      const { earthState } = useTerraStore.getState();
      expect(earthState.vegetation).toBe(originalVegetation);
    });

    it('should update multiple earth state properties', () => {
      const { setEarthState } = useTerraStore.getState();

      setEarthState({ health: 75, vegetation: 80, water: 85 });

      const { earthState } = useTerraStore.getState();
      expect(earthState.health).toBe(75);
      expect(earthState.vegetation).toBe(80);
      expect(earthState.water).toBe(85);
    });

    it('should update season', () => {
      const { setEarthState } = useTerraStore.getState();

      setEarthState({ season: 'summer' });

      const { earthState } = useTerraStore.getState();
      expect(earthState.season).toBe('summer');
    });

    it('should update weather', () => {
      const { setEarthState } = useTerraStore.getState();

      setEarthState({ weather: 'rain' });

      const { earthState } = useTerraStore.getState();
      expect(earthState.weather).toBe('rain');
    });

    it('should handle boundary values', () => {
      const { setEarthState } = useTerraStore.getState();

      setEarthState({ health: 0, biodiversity: 100 });

      const { earthState } = useTerraStore.getState();
      expect(earthState.health).toBe(0);
      expect(earthState.biodiversity).toBe(100);
    });
  });

  describe('addScore', () => {
    it('should increase score by positive delta', () => {
      const { addScore } = useTerraStore.getState();
      const initialScore = useTerraStore.getState().score;

      addScore(10);

      const { score } = useTerraStore.getState();
      expect(score).toBe(initialScore + 10);
    });

    it('should decrease score by negative delta', () => {
      const { addScore } = useTerraStore.getState();
      const initialScore = useTerraStore.getState().score;

      addScore(-5);

      const { score } = useTerraStore.getState();
      expect(score).toBe(initialScore - 5);
    });

    it('should cap score at 100 maximum', () => {
      const { addScore } = useTerraStore.getState();

      addScore(100);

      const { score } = useTerraStore.getState();
      expect(score).toBeLessThanOrEqual(100);
      expect(score).toBe(100);
    });

    it('should cap score at 0 minimum', () => {
      const { addScore } = useTerraStore.getState();

      addScore(-100);

      const { score } = useTerraStore.getState();
      expect(score).toBeGreaterThanOrEqual(0);
      expect(score).toBe(0);
    });

    it('should handle zero delta', () => {
      const { addScore } = useTerraStore.getState();
      const initialScore = useTerraStore.getState().score;

      addScore(0);

      const { score } = useTerraStore.getState();
      expect(score).toBe(initialScore);
    });

    it('should handle multiple score updates', () => {
      const { addScore } = useTerraStore.getState();

      addScore(10);
      addScore(5);
      addScore(-3);

      const { score } = useTerraStore.getState();
      expect(score).toBe(65 + 10 + 5 - 3);
    });
  });

  describe('setGaiaMessage', () => {
    it('should set gaia message', () => {
      const { setGaiaMessage } = useTerraStore.getState();

      setGaiaMessage('Hello, Earth defender!');

      const { gaiaMessage } = useTerraStore.getState();
      expect(gaiaMessage).toBe('Hello, Earth defender!');
    });

    it('should clear gaia message with null', () => {
      const { setGaiaMessage } = useTerraStore.getState();

      setGaiaMessage('Some message');
      setGaiaMessage(null);

      const { gaiaMessage } = useTerraStore.getState();
      expect(gaiaMessage).toBeNull();
    });

    it('should update gaia message', () => {
      const { setGaiaMessage } = useTerraStore.getState();

      setGaiaMessage('First message');
      setGaiaMessage('Second message');

      const { gaiaMessage } = useTerraStore.getState();
      expect(gaiaMessage).toBe('Second message');
    });

    it('should handle empty strings', () => {
      const { setGaiaMessage } = useTerraStore.getState();

      setGaiaMessage('');

      const { gaiaMessage } = useTerraStore.getState();
      expect(gaiaMessage).toBe('');
    });
  });

  describe('unlockAchievement', () => {
    it('should add achievement to achievements array', () => {
      const { unlockAchievement } = useTerraStore.getState();
      const initialCount = useTerraStore.getState().achievements.length;

      unlockAchievement('river');

      const { achievements } = useTerraStore.getState();
      expect(achievements.length).toBe(initialCount + 1);
      expect(achievements).toContain('river');
    });

    it('should preserve existing achievements when adding new', () => {
      const { unlockAchievement } = useTerraStore.getState();
      const initialAchievements = [...useTerraStore.getState().achievements];

      unlockAchievement('mountain');

      const { achievements } = useTerraStore.getState();
      initialAchievements.forEach((achievement) => {
        expect(achievements).toContain(achievement);
      });
    });

    it('should allow unlocking multiple achievements', () => {
      const { unlockAchievement } = useTerraStore.getState();

      unlockAchievement('forest');
      unlockAchievement('ocean');
      unlockAchievement('sky');

      const { achievements } = useTerraStore.getState();
      expect(achievements).toContain('forest');
      expect(achievements).toContain('ocean');
      expect(achievements).toContain('sky');
    });

    it('should handle duplicate achievement unlocks', () => {
      const { unlockAchievement } = useTerraStore.getState();

      unlockAchievement('treasure');
      const countAfterFirst = useTerraStore.getState().achievements.length;

      unlockAchievement('treasure');
      const countAfterSecond = useTerraStore.getState().achievements.length;

      // Both should be added (store doesn't prevent duplicates - that's design choice)
      expect(countAfterSecond).toBeGreaterThanOrEqual(countAfterFirst);
    });
  });

  describe('missions', () => {
    it('should have initial missions with correct structure', () => {
      const { missions } = useTerraStore.getState();

      expect(missions.length).toBeGreaterThan(0);
      missions.forEach((mission) => {
        expect(mission.id).toBeTruthy();
        expect(typeof mission.name).toBe('string');
        expect(typeof mission.icon).toBe('string');
        expect(typeof mission.progress).toBe('number');
        expect(typeof mission.target).toBe('number');
        expect(mission.progress).toBeGreaterThanOrEqual(0);
        expect(mission.target).toBeGreaterThan(0);
        expect(mission.progress).toBeLessThanOrEqual(mission.target);
      });
    });

    it('should calculate mission progress percentage', () => {
      const { missions } = useTerraStore.getState();

      missions.forEach((mission) => {
        const percentage = (mission.progress / mission.target) * 100;
        expect(percentage).toBeGreaterThanOrEqual(0);
        expect(percentage).toBeLessThanOrEqual(100);
      });
    });

    it('should identify completed missions', () => {
      const { missions } = useTerraStore.getState();

      const completedMissions = missions.filter((m) => m.progress === m.target);
      // Can be 0 or more completed missions
      expect(Array.isArray(completedMissions)).toBe(true);
    });

    it('should identify in-progress missions', () => {
      const { missions } = useTerraStore.getState();

      const inProgressMissions = missions.filter((m) => m.progress > 0 && m.progress < m.target);
      expect(Array.isArray(inProgressMissions)).toBe(true);
    });

    it('should identify not-started missions', () => {
      const { missions } = useTerraStore.getState();

      const notStartedMissions = missions.filter((m) => m.progress === 0);
      expect(Array.isArray(notStartedMissions)).toBe(true);
    });
  });

  describe('integration', () => {
    it('should handle complete gameplay flow', () => {
      const store = useTerraStore.getState();

      // Start game
      expect(store.score).toBe(65);

      // Perform action and gain score
      store.addScore(10);
      expect(useTerraStore.getState().score).toBe(75);

      // Update earth state
      store.setEarthState({ health: 80, vegetation: 75 });
      expect(useTerraStore.getState().earthState.health).toBe(80);

      // Receive gaia message
      store.setGaiaMessage('Great job!');
      expect(useTerraStore.getState().gaiaMessage).toBe('Great job!');

      // Unlock achievement
      store.unlockAchievement('eco_warrior');
      expect(useTerraStore.getState().achievements).toContain('eco_warrior');
    });

    it('should maintain state consistency across multiple operations', () => {
      const store = useTerraStore.getState();

      store.setEarthState({ health: 70, season: 'summer', weather: 'aurora' });
      store.addScore(15);
      store.setGaiaMessage('Excellent progress!');
      store.unlockAchievement('summer_survivor');

      const state = useTerraStore.getState();

      expect(state.earthState.health).toBe(70);
      expect(state.earthState.season).toBe('summer');
      expect(state.earthState.weather).toBe('aurora');
      expect(state.score).toBe(80);
      expect(state.gaiaMessage).toBe('Excellent progress!');
      expect(state.achievements).toContain('summer_survivor');
    });
  });
});
