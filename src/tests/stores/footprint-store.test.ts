import { describe, it, expect, beforeEach } from 'vitest';
import { useFootprintStore } from '@/stores/carbon-store';

describe('Footprint Store (Zustand)', () => {
  beforeEach(() => {
    // Reset store state before each test
    const { reset } = useFootprintStore.getState();
    reset();
  });

  describe('initial state', () => {
    it('should have default inputs', () => {
      const { inputs } = useFootprintStore.getState();

      expect(inputs.transport).toBe('car');
      expect(inputs.electricity).toBe('medium');
      expect(inputs.food).toBe('mixed');
    });

    it('should have null result initially', () => {
      const { result } = useFootprintStore.getState();

      expect(result).toBeNull();
    });
  });

  describe('setTransport', () => {
    it('should update transport mode', () => {
      const { setTransport } = useFootprintStore.getState();

      setTransport('bicycle');

      const { inputs } = useFootprintStore.getState();
      expect(inputs.transport).toBe('bicycle');
    });

    it('should preserve other inputs when updating transport', () => {
      const store = useFootprintStore.getState();
      const originalElectricity = store.inputs.electricity;
      const originalFood = store.inputs.food;

      store.setTransport('train');

      const { inputs } = useFootprintStore.getState();
      expect(inputs.electricity).toBe(originalElectricity);
      expect(inputs.food).toBe(originalFood);
    });

    it('should handle all transport modes', () => {
      const { setTransport } = useFootprintStore.getState();
      const modes = ['car', 'bus', 'train', 'bicycle'] as const;

      modes.forEach((mode) => {
        setTransport(mode);
        const { inputs } = useFootprintStore.getState();
        expect(inputs.transport).toBe(mode);
      });
    });
  });

  describe('setElectricity', () => {
    it('should update electricity usage', () => {
      const { setElectricity } = useFootprintStore.getState();

      setElectricity('high');

      const { inputs } = useFootprintStore.getState();
      expect(inputs.electricity).toBe('high');
    });

    it('should preserve other inputs when updating electricity', () => {
      const store = useFootprintStore.getState();
      const originalTransport = store.inputs.transport;
      const originalFood = store.inputs.food;

      store.setElectricity('low');

      const { inputs } = useFootprintStore.getState();
      expect(inputs.transport).toBe(originalTransport);
      expect(inputs.food).toBe(originalFood);
    });

    it('should handle all electricity levels', () => {
      const { setElectricity } = useFootprintStore.getState();
      const levels = ['low', 'medium', 'high'] as const;

      levels.forEach((level) => {
        setElectricity(level);
        const { inputs } = useFootprintStore.getState();
        expect(inputs.electricity).toBe(level);
      });
    });
  });

  describe('setFood', () => {
    it('should update food habit', () => {
      const { setFood } = useFootprintStore.getState();

      setFood('vegetarian');

      const { inputs } = useFootprintStore.getState();
      expect(inputs.food).toBe('vegetarian');
    });

    it('should preserve other inputs when updating food', () => {
      const store = useFootprintStore.getState();
      const originalTransport = store.inputs.transport;
      const originalElectricity = store.inputs.electricity;

      store.setFood('heavy_meat');

      const { inputs } = useFootprintStore.getState();
      expect(inputs.transport).toBe(originalTransport);
      expect(inputs.electricity).toBe(originalElectricity);
    });

    it('should handle all food habits', () => {
      const { setFood } = useFootprintStore.getState();
      const habits = ['vegetarian', 'mixed', 'heavy_meat'] as const;

      habits.forEach((habit) => {
        setFood(habit);
        const { inputs } = useFootprintStore.getState();
        expect(inputs.food).toBe(habit);
      });
    });
  });

  describe('calculate', () => {
    it('should calculate footprint result', () => {
      const { calculate } = useFootprintStore.getState();

      calculate();

      const { result } = useFootprintStore.getState();
      expect(result).not.toBeNull();
    });

    it('should include breakdown by category in result', () => {
      const { calculate } = useFootprintStore.getState();

      calculate();

      const { result } = useFootprintStore.getState();
      expect(result?.breakdown).toHaveProperty('transport');
      expect(result?.breakdown).toHaveProperty('electricity');
      expect(result?.breakdown).toHaveProperty('food');
    });

    it('should calculate based on current inputs', () => {
      const { setTransport, setElectricity, setFood, calculate } = useFootprintStore.getState();

      setTransport('bicycle');
      setElectricity('low');
      setFood('vegetarian');
      calculate();

      const { result } = useFootprintStore.getState();
      expect(result?.breakdown.transport).toBe(50); // bicycle
      expect(result?.breakdown.electricity).toBe(600); // low
      expect(result?.breakdown.food).toBe(1000); // vegetarian
    });

    it('should update result when inputs change before calculate', () => {
      const { setTransport, calculate } = useFootprintStore.getState();

      calculate();
      const result1 = useFootprintStore.getState().result;

      // Change to a different transport mode (default is 'car', so set to 'bus')
      setTransport('bus');
      calculate();
      const result2 = useFootprintStore.getState().result;

      expect(result1?.total).not.toBe(result2?.total);
      expect(result2?.total).toBeLessThan(result1!.total);
    });

    it('should include global average in result', () => {
      const { calculate } = useFootprintStore.getState();

      calculate();

      const { result } = useFootprintStore.getState();
      expect(result?.globalAverage).toBe(4800);
    });

    it('should include rating in result', () => {
      const { calculate } = useFootprintStore.getState();

      calculate();

      const { result } = useFootprintStore.getState();
      expect(['low', 'average', 'high']).toContain(result?.rating);
    });
  });

  describe('reset', () => {
    it('should reset inputs to defaults', () => {
      const { setTransport, setElectricity, setFood, reset } = useFootprintStore.getState();

      setTransport('bicycle');
      setElectricity('high');
      setFood('vegetarian');

      reset();

      const { inputs } = useFootprintStore.getState();
      expect(inputs.transport).toBe('car');
      expect(inputs.electricity).toBe('medium');
      expect(inputs.food).toBe('mixed');
    });

    it('should clear result on reset', () => {
      const { calculate, reset } = useFootprintStore.getState();

      calculate();
      expect(useFootprintStore.getState().result).not.toBeNull();

      reset();

      const { result } = useFootprintStore.getState();
      expect(result).toBeNull();
    });

    it('should restore to initial state completely', () => {
      const { setTransport, setElectricity, setFood, calculate, reset } =
        useFootprintStore.getState();

      setTransport('train');
      setElectricity('high');
      setFood('heavy_meat');
      calculate();

      reset();

      const state = useFootprintStore.getState();
      expect(state.inputs.transport).toBe('car');
      expect(state.inputs.electricity).toBe('medium');
      expect(state.inputs.food).toBe('mixed');
      expect(state.result).toBeNull();
    });
  });

  describe('state isolation', () => {
    it('should maintain independent state across multiple accesses', () => {
      const store1 = useFootprintStore.getState();
      const store2 = useFootprintStore.getState();

      expect(store1).toBe(store2); // Same store instance
    });

    it('should handle rapid sequential updates', () => {
      const { setTransport, setElectricity, setFood, calculate } = useFootprintStore.getState();

      setTransport('bus');
      setElectricity('low');
      setFood('vegetarian');
      calculate();

      const result1 = useFootprintStore.getState().result;

      setTransport('car');
      setElectricity('high');
      setFood('heavy_meat');
      calculate();

      const result2 = useFootprintStore.getState().result;

      expect(result1?.total).not.toBe(result2?.total);
      expect(useFootprintStore.getState().inputs.transport).toBe('car');
    });
  });

  describe('integration', () => {
    it('should complete full workflow: select inputs -> calculate -> reset', () => {
      const store = useFootprintStore.getState();

      // Initial state
      expect(store.result).toBeNull();

      // Update inputs
      store.setTransport('bus');
      store.setElectricity('medium');
      store.setFood('vegetarian');

      // Calculate
      store.calculate();
      const result = useFootprintStore.getState().result;
      expect(result).not.toBeNull();
      expect(result?.total).toBeGreaterThan(0);

      // Reset
      store.reset();
      const resetState = useFootprintStore.getState();
      expect(resetState.inputs.transport).toBe('car');
      expect(resetState.result).toBeNull();
    });

    it('should allow multiple calculations with different inputs', () => {
      const { setTransport, calculate, reset } = useFootprintStore.getState();

      const results = [];

      for (const transport of ['car', 'bus', 'train', 'bicycle'] as const) {
        setTransport(transport);
        calculate();
        results.push(useFootprintStore.getState().result);
        reset();
      }

      expect(results.length).toBe(4);
      expect(results[0]!.total).toBeGreaterThan(results[1]!.total);
      expect(results[1]!.total).toBeGreaterThan(results[2]!.total);
      expect(results[2]!.total).toBeGreaterThan(results[3]!.total);
    });
  });
});
