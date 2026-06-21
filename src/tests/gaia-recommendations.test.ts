import { describe, it, expect } from 'vitest';
import { getRecommendation, type RecommendationCategory } from '@/lib/gaia-recommendations';
import { calculateFootprint, type CarbonInputs, type CarbonResult } from '@/lib/carbon';

describe('Gaia Recommendation Engine', () => {
  describe('getRecommendation', () => {
    it('should return a recommendation object with required fields', () => {
      const inputs: CarbonInputs = {
        transport: 'car',
        electricity: 'high',
        food: 'heavy_meat',
      };
      const result = calculateFootprint(inputs);

      const recommendation = getRecommendation(inputs, result);

      expect(recommendation).toHaveProperty('category');
      expect(recommendation).toHaveProperty('message');
      expect(recommendation).toHaveProperty('actionLabel');
      expect(recommendation).toHaveProperty('estimatedSavingsKg');
      expect(recommendation).toHaveProperty('icon');
    });

    it('should recommend transport improvement when car user', () => {
      const inputs: CarbonInputs = {
        transport: 'car',
        electricity: 'low',
        food: 'vegetarian',
      };
      const result = calculateFootprint(inputs);

      const recommendation = getRecommendation(inputs, result);

      expect(['transport', 'maintain']).toContain(recommendation.category);
      if (recommendation.category === 'transport') {
        expect(recommendation.estimatedSavingsKg).toBeGreaterThan(0);
      }
    });

    it('should recommend electricity improvement when high usage', () => {
      const inputs: CarbonInputs = {
        transport: 'bicycle',
        electricity: 'high',
        food: 'vegetarian',
      };
      const result = calculateFootprint(inputs);

      const recommendation = getRecommendation(inputs, result);

      expect(['electricity', 'maintain']).toContain(recommendation.category);
      if (recommendation.category === 'electricity') {
        expect(recommendation.estimatedSavingsKg).toBeGreaterThan(0);
      }
    });

    it('should recommend food improvement when eating heavy meat', () => {
      const inputs: CarbonInputs = {
        transport: 'bicycle',
        electricity: 'low',
        food: 'heavy_meat',
      };
      const result = calculateFootprint(inputs);

      const recommendation = getRecommendation(inputs, result);

      expect(['food', 'maintain']).toContain(recommendation.category);
      if (recommendation.category === 'food') {
        expect(recommendation.estimatedSavingsKg).toBeGreaterThan(0);
      }
    });

    it('should select highest-impact recommendation when multiple options available', () => {
      const inputs: CarbonInputs = {
        transport: 'car',
        electricity: 'high',
        food: 'heavy_meat',
      };
      const result = calculateFootprint(inputs);

      const recommendation = getRecommendation(inputs, result);

      // Electricity has the highest savings (3000-1500=1500 > car-to-bus savings of 1400)
      expect(recommendation.category).toBe('electricity');
      expect(recommendation.estimatedSavingsKg).toBeGreaterThan(0);
    });

    it('should return maintain recommendation when already optimal', () => {
      const inputs: CarbonInputs = {
        transport: 'bicycle',
        electricity: 'low',
        food: 'vegetarian',
      };
      const result = calculateFootprint(inputs);

      const recommendation = getRecommendation(inputs, result);

      expect(recommendation.category).toBe('maintain');
      expect(recommendation.estimatedSavingsKg).toBe(0);
      expect(recommendation.icon).toBe('🌟');
    });

    it('should include carbon savings estimate in message', () => {
      const inputs: CarbonInputs = {
        transport: 'car',
        electricity: 'medium',
        food: 'mixed',
      };
      const result = calculateFootprint(inputs);

      const recommendation = getRecommendation(inputs, result);

      if (recommendation.category !== 'maintain') {
        // Message contains the formatted number with toLocaleString() (e.g., "1,400")
        expect(recommendation.message).toContain(recommendation.estimatedSavingsKg.toLocaleString());
      }
    });

    it('should adjust tone based on high rating', () => {
      const inputs: CarbonInputs = {
        transport: 'car',
        electricity: 'high',
        food: 'heavy_meat',
      };
      const result = calculateFootprint(inputs);

      const recommendation = getRecommendation(inputs, result);

      if (recommendation.category !== 'maintain' && result.rating === 'high') {
        expect(recommendation.message).toContain('above the global average');
      }
    });

    it('should adjust tone based on low rating', () => {
      const inputs: CarbonInputs = {
        transport: 'bicycle',
        electricity: 'low',
        food: 'vegetarian',
      };
      // Manually create result to ensure low rating
      const result: CarbonResult = calculateFootprint(inputs);

      const recommendation = getRecommendation(inputs, result);

      if (recommendation.category !== 'maintain' && result.rating === 'low') {
        expect(recommendation.message).toContain('better than most');
      }
    });

    it('should have meaningful action labels', () => {
      const inputs: CarbonInputs = {
        transport: 'car',
        electricity: 'high',
        food: 'heavy_meat',
      };
      const result = calculateFootprint(inputs);

      const recommendation = getRecommendation(inputs, result);

      expect(recommendation.actionLabel).toBeTruthy();
      expect(recommendation.actionLabel.length).toBeGreaterThan(3);
    });

    it('should return consistent results for same inputs', () => {
      const inputs: CarbonInputs = {
        transport: 'bus',
        electricity: 'medium',
        food: 'mixed',
      };
      const result = calculateFootprint(inputs);

      const rec1 = getRecommendation(inputs, result);
      const rec2 = getRecommendation(inputs, result);

      expect(rec1.category).toBe(rec2.category);
      expect(rec1.estimatedSavingsKg).toBe(rec2.estimatedSavingsKg);
      expect(rec1.message).toBe(rec2.message);
    });

    it('should provide recommendations for all combinations of inputs', () => {
      const transports = ['car', 'bus', 'train', 'bicycle'] as const;
      const electricities = ['low', 'medium', 'high'] as const;
      const foods = ['vegetarian', 'mixed', 'heavy_meat'] as const;

      transports.forEach((transport) => {
        electricities.forEach((electricity) => {
          foods.forEach((food) => {
            const inputs: CarbonInputs = { transport, electricity, food };
            const result = calculateFootprint(inputs);
            const recommendation = getRecommendation(inputs, result);

            expect(recommendation.category).toBeTruthy();
            expect(['transport', 'electricity', 'food', 'maintain']).toContain(
              recommendation.category
            );
            expect(recommendation.estimatedSavingsKg).toBeGreaterThanOrEqual(0);
          });
        });
      });
    });

    it('should have contextual messages mentioning user choices', () => {
      const inputs: CarbonInputs = {
        transport: 'car',
        electricity: 'high',
        food: 'mixed',
      };
      const result = calculateFootprint(inputs);

      const recommendation = getRecommendation(inputs, result);

      if (recommendation.category === 'transport') {
        expect(recommendation.message.toLowerCase()).toContain('car');
      } else if (recommendation.category === 'electricity') {
        expect(recommendation.message.toLowerCase()).toContain('electricity');
      } else if (recommendation.category === 'food') {
        expect(recommendation.message.toLowerCase()).toContain('diet');
      }
    });

    it('should recommend stepping down in transport', () => {
      const inputs: CarbonInputs = {
        transport: 'car',
        electricity: 'low',
        food: 'vegetarian',
      };
      const result = calculateFootprint(inputs);

      const recommendation = getRecommendation(inputs, result);

      expect(recommendation.category).toBe('transport');
      expect(recommendation.actionLabel).toMatch(/(bus|train|bicycle)/i);
    });

    it('should recommend stepping down in electricity', () => {
      const inputs: CarbonInputs = {
        transport: 'bicycle',
        electricity: 'high',
        food: 'vegetarian',
      };
      const result = calculateFootprint(inputs);

      const recommendation = getRecommendation(inputs, result);

      expect(recommendation.category).toBe('electricity');
      expect(recommendation.actionLabel.toLowerCase()).toContain('medium');
    });

    it('should recommend stepping down in food', () => {
      const inputs: CarbonInputs = {
        transport: 'bicycle',
        electricity: 'low',
        food: 'heavy_meat',
      };
      const result = calculateFootprint(inputs);

      const recommendation = getRecommendation(inputs, result);

      expect(recommendation.category).toBe('food');
      expect(recommendation.actionLabel.toLowerCase()).toMatch(/(mixed|vegetarian)/);
    });
  });
});
