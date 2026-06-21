# Testing Guide

## Quick Start

### 1. Install Dependencies
```bash
npm install
```

### 2. Run Tests
```bash
npm test                  # Run all tests once
npm test -- --watch     # Watch mode for development
npm run test:ui         # Visual test dashboard
npm run test:coverage   # Generate coverage report
```

## Test Organization

### Carbon Footprint Calculations (`carbon.test.ts`)

Tests the core carbon calculation engine:

```typescript
// Input
{ transport: 'car', electricity: 'medium', food: 'mixed' }

// Output
{
  breakdown: { transport: 2300, electricity: 1500, food: 1800 },
  total: 5600,
  globalAverage: 4800,
  diff: 800,
  percentVsAverage: 117,
  rating: 'high',
  treesToOffset: 267
}
```

**Key Tests:**
- ✓ Total calculation accuracy
- ✓ Category breakdown correctness
- ✓ Rating classification (low/average/high)
- ✓ All input combinations supported
- ✓ Boundary conditions (0, 100 values)

### Gaia Recommendation Engine (`gaia-recommendations.test.ts`)

Tests the AI recommendation system:

```typescript
// Input
inputs: { transport: 'car', electricity: 'high', food: 'heavy_meat' }
result: { total: 6200, rating: 'high', ... }

// Output
{
  category: 'transport',
  message: "Your footprint is running well above...",
  actionLabel: "Try the bus",
  estimatedSavingsKg: 1400,
  icon: '🚌'
}
```

**Key Tests:**
- ✓ Highest-impact recommendation selection
- ✓ Tone adjustment based on rating
- ✓ Optimal state handling
- ✓ Contextual messaging
- ✓ All input/output combinations

### Zustand Stores

#### Footprint Store (`stores/footprint-store.test.ts`)

Tests carbon footprint input management:

```typescript
const { inputs, result, setTransport, calculate, reset } = useFootprintStore()

// Update inputs
setTransport('bicycle')
setElectricity('low')
setFood('vegetarian')

// Calculate result
calculate()

// Reset to defaults
reset()
```

**Key Tests:**
- ✓ State initialization
- ✓ Partial updates (one property doesn't affect others)
- ✓ Calculate function triggers computation
- ✓ Reset restores defaults
- ✓ Multiple sequential operations

#### Terra Store (`stores/terra-store.test.ts`)

Tests main game state:

```typescript
const {
  earthState,     // { health, vegetation, water, air, biodiversity, season, weather }
  score,          // 0-100
  missions,       // Array of missions with progress
  achievements,   // Array of unlocked achievements
  setEarthState,
  addScore,
  setGaiaMessage,
  unlockAchievement
} = useTerraStore()
```

**Key Tests:**
- ✓ State structure and types
- ✓ Bounds validation (0-100 for scores/metrics)
- ✓ Partial updates preserve other data
- ✓ Achievement system
- ✓ Full gameplay workflow

## Running Specific Tests

```bash
# Run only carbon tests
npm test -- carbon.test.ts

# Run only recommendation tests
npm test -- gaia-recommendations.test.ts

# Run only store tests
npm test -- stores/

# Run tests matching pattern
npm test -- --grep "calculate"

# Watch specific file
npm test -- carbon.test.ts --watch
```

## Reading Test Output

### Success
```
✓ Carbon Footprint Calculator (14)
  ✓ calculateFootprint (14)
    ✓ should calculate total footprint correctly
    ✓ should return correct breakdown by category
    ...
```

### Failure
```
✗ Carbon Footprint Calculator (1 failed)
  ✗ calculateFootprint > should calculate total correctly
    Error: expected 5600 to be 5500
    at carbon.test.ts:25
```

## Test Coverage

### What's Tested
- ✅ All pure functions (carbon calculations, recommendations)
- ✅ All Zustand store operations
- ✅ State initialization and defaults
- ✅ State mutations and updates
- ✅ Edge cases and boundaries
- ✅ Integration workflows

### What's Not Tested (by design)
- React components (requires React Testing Library with DOM)
- Firebase integration (requires mocking)
- Three.js rendering (requires WebGL mocking)
- Next.js routing (requires environment setup)

## Performance

```
$ npm test
  Pass  4 files
  Tests  112+ passed (112+)
  Duration  0.5s
```

**Why it's fast:**
- Pure function testing (no DOM)
- Minimal setup/teardown
- Parallel test execution
- No file I/O or network requests

## CI/CD Integration

### GitHub Actions Example

```yaml
name: Tests

on: [push, pull_request]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
      - run: npm ci
      - run: npm test
      - run: npm run test:coverage
```

## Debugging Tests

### Add Logging
```typescript
it('should calculate correctly', () => {
  const result = calculateFootprint(inputs);
  console.log('Result:', result);  // Logs during test run
  expect(result.total).toBe(5600);
});
```

### Run Single Test
```typescript
it.only('should calculate correctly', () => {
  // Only this test runs
});
```

### Skip Test
```typescript
it.skip('should calculate correctly', () => {
  // This test is skipped
});
```

### Debug in VSCode

Add to `.vscode/launch.json`:
```json
{
  "type": "node",
  "request": "launch",
  "program": "${workspaceFolder}/node_modules/vitest/vitest.mjs",
  "args": ["run"],
  "console": "integratedTerminal",
  "internalConsoleOptions": "neverOpen"
}
```

## Best Practices

✅ **Clear Names** - Test names should read like documentation
```typescript
it('should classify users with ≤85% average as low rating')
```

✅ **AAA Pattern** - Arrange, Act, Assert
```typescript
// Arrange
const inputs = { transport: 'car', electricity: 'medium', food: 'mixed' };
// Act
const result = calculateFootprint(inputs);
// Assert
expect(result.rating).toBe('average');
```

✅ **One Concept Per Test** - Focused assertions
```typescript
it('should calculate correct total', () => {
  expect(result.total).toBe(5600);
  // ONE assertion (or closely related)
});
```

✅ **Use beforeEach** - Setup common test data
```typescript
beforeEach(() => {
  store.reset();
  store.setTransport('car');
});
```

✅ **Meaningful Errors** - Expect messages should clarify failures
```typescript
expect(result.total, 'Total footprint calculation').toBe(5600);
```

## Troubleshooting

### Issue: Tests not running
**Solution:** Check file names end with `.test.ts` or `.spec.ts`

### Issue: Module not found
**Solution:** Verify `vitest.config.ts` path alias matches imports

### Issue: Tests timeout
**Solution:** Increase timeout:
```typescript
it('slow test', async () => {
  // ...
}, 10000); // 10 second timeout
```

### Issue: Store tests interfere with each other
**Solution:** Add `beforeEach` reset:
```typescript
beforeEach(() => {
  useFootprintStore.getState().reset();
});
```

## Next Steps

1. **Add component tests** - Use React Testing Library for UI components
2. **Add e2e tests** - Use Cypress or Playwright for workflows
3. **Improve coverage** - Aim for >80% coverage on critical paths
4. **Add benchmarks** - Compare performance across changes

---

See `/src/tests/README.md` for detailed documentation and examples.
