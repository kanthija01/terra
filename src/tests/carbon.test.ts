import { describe, it, expect } from 'vitest';
import {
  calculateFootprint,
  TRANSPORT_FACTORS,
  ELECTRICITY_FACTORS,
  FOOD_FACTORS,
  GLOBAL_AVERAGE_KG,
  type CarbonInputs,
} from '@/lib/carbon';

describe('Carbon Footprint Calculator', () => {
  describe('calculateFootprint', () => {
    it('should calculate total footprint correctly', () => {
      const inputs: CarbonInputs = {
        transport: 'car',
        electricity: 'medium',
        food: 'mixed',
      };

      const result = calculateFootprint(inputs);

      const expectedTotal =
        TRANSPORT_FACTORS.car +
        ELECTRICITY_FACTORS.medium +
        FOOD_FACTORS.mixed;

      expect(result.total).toBe(expectedTotal);
    });

    it('should return correct breakdown by category', () => {
      const inputs: CarbonInputs = {
        transport: 'bus',
        electricity: 'low',
        food: 'vegetarian',
      };

      const result = calculateFootprint(inputs);

      expect(result.breakdown.transport).toBe(TRANSPORT_FACTORS.bus);
      expect(result.breakdown.electricity).toBe(ELECTRICITY_FACTORS.low);
      expect(result.breakdown.food).toBe(FOOD_FACTORS.vegetarian);
    });

    it('should calculate diff from global average correctly', () => {
      const inputs: CarbonInputs = {
        transport: 'bicycle',
        electricity: 'low',
        food: 'vegetarian',
      };

      const result = calculateFootprint(inputs);
      const expectedDiff = result.total - GLOBAL_AVERAGE_KG;

      expect(result.diff).toBe(Math.round(expectedDiff));
    });

    it('should calculate percentVsAverage correctly', () => {
      const inputs: CarbonInputs = {
        transport: 'car',
        electricity: 'high',
        food: 'heavy_meat',
      };

      const result = calculateFootprint(inputs);
      const expectedPercent = Math.round((result.total / GLOBAL_AVERAGE_KG) * 100);

      expect(result.percentVsAverage).toBe(expectedPercent);
    });

    it('should classify low rating (≤85% of average)', () => {
      const inputs: CarbonInputs = {
        transport: 'bicycle',
        electricity: 'low',
        food: 'vegetarian',
      };

      const result = calculateFootprint(inputs);

      expect(result.rating).toBe('low');
      expect(result.percentVsAverage).toBeLessThanOrEqual(85);
    });

    it('should classify high rating (≥115% of average)', () => {
      const inputs: CarbonInputs = {
        transport: 'car',
        electricity: 'high',
        food: 'heavy_meat',
      };

      const result = calculateFootprint(inputs);

      expect(result.rating).toBe('high');
      expect(result.percentVsAverage).toBeGreaterThanOrEqual(115);
    });

    it('should classify average rating (between 85-115%)', () => {
      // Use bus instead of car to get a result in the average range
      // bus: 900, medium: 1500, mixed: 1800 = 4200 total
      // 4200 / 4800 = 87.5% (within average range)
      const inputs: CarbonInputs = {
        transport: 'bus',
        electricity: 'medium',
        food: 'mixed',
      };

      const result = calculateFootprint(inputs);

      expect(result.rating).toBe('average');
      expect(result.percentVsAverage).toBeGreaterThan(85);
      expect(result.percentVsAverage).toBeLessThan(115);
    });

    it('should calculate trees to offset correctly', () => {
      const inputs: CarbonInputs = {
        transport: 'car',
        electricity: 'medium',
        food: 'mixed',
      };

      const result = calculateFootprint(inputs);
      const KG_CO2_PER_TREE_PER_YEAR = 21;
      const expectedTrees = Math.ceil(result.total / KG_CO2_PER_TREE_PER_YEAR);

      expect(result.treesToOffset).toBe(expectedTrees);
    });

    it('should handle all transport modes', () => {
      const transportModes = ['car', 'bus', 'train', 'bicycle'] as const;

      transportModes.forEach((transport) => {
        const inputs: CarbonInputs = {
          transport,
          electricity: 'medium',
          food: 'mixed',
        };

        const result = calculateFootprint(inputs);

        expect(result.breakdown.transport).toBe(TRANSPORT_FACTORS[transport]);
        expect(result.total).toBeGreaterThan(0);
      });
    });

    it('should handle all electricity usage levels', () => {
      const electricityLevels = ['low', 'medium', 'high'] as const;

      electricityLevels.forEach((electricity) => {
        const inputs: CarbonInputs = {
          transport: 'car',
          electricity,
          food: 'mixed',
        };

        const result = calculateFootprint(inputs);

        expect(result.breakdown.electricity).toBe(ELECTRICITY_FACTORS[electricity]);
        expect(result.breakdown.electricity).toBeGreaterThan(0);
      });
    });

    it('should handle all food habits', () => {
      const foodHabits = ['vegetarian', 'mixed', 'heavy_meat'] as const;

      foodHabits.forEach((food) => {
        const inputs: CarbonInputs = {
          transport: 'car',
          electricity: 'medium',
          food,
        };

        const result = calculateFootprint(inputs);

        expect(result.breakdown.food).toBe(FOOD_FACTORS[food]);
        expect(result.breakdown.food).toBeGreaterThan(0);
      });
    });

    it('should return rounded values', () => {
      const inputs: CarbonInputs = {
        transport: 'car',
        electricity: 'medium',
        food: 'mixed',
      };

      const result = calculateFootprint(inputs);

      expect(Number.isInteger(result.total)).toBe(true);
      expect(Number.isInteger(result.diff)).toBe(true);
      expect(Number.isInteger(result.percentVsAverage)).toBe(true);
    });

    it('should produce lowest footprint with optimal choices', () => {
      const optimalInputs: CarbonInputs = {
        transport: 'bicycle',
        electricity: 'low',
        food: 'vegetarian',
      };

      const worstInputs: CarbonInputs = {
        transport: 'car',
        electricity: 'high',
        food: 'heavy_meat',
      };

      const optimalResult = calculateFootprint(optimalInputs);
      const worstResult = calculateFootprint(worstInputs);

      expect(optimalResult.total).toBeLessThan(worstResult.total);
      expect(optimalResult.rating).toBe('low');
      expect(worstResult.rating).toBe('high');
    });
  });
});
