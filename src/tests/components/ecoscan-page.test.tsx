import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import EcoScanPage from '@/app/ecoscan/page';

vi.mock('@/lib/gemini', () => ({
  analyzeEcoImage: vi.fn().mockResolvedValue({
    item: 'Reusable Bottle',
    co2Kg: 0.4,
    alternatives: [
      { name: 'Steel bottle', co2Savings: 60, description: 'Less waste over time' },
    ],
  }),
}));

describe('EcoScanPage', () => {
  it('shows the scan prompt and action button on first load', () => {
    render(<EcoScanPage />);

    expect(screen.getByText(/scan anything/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /tap camera to scan item/i })).toBeInTheDocument();
  });

  it('keeps the scan action accessible for repeated use', () => {
    render(<EcoScanPage />);

    const button = screen.getByRole('button', { name: /tap camera to scan item/i });
    fireEvent.click(button);

    expect(screen.getByRole('button', { name: /tap camera to scan item/i })).toBeInTheDocument();
  });
});
