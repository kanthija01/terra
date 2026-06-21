import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import FootprintPage from '@/app/footprint/page';

describe('FootprintPage', () => {
  it('calculates and displays the footprint results after clicking the calculate button', async () => {
    render(<FootprintPage />);

    fireEvent.click(screen.getByRole('button', { name: /calculate your carbon footprint/i }));

    await waitFor(() => {
      expect(screen.getByLabelText(/your annual carbon footprint is/i)).toBeInTheDocument();
    });

    expect(screen.getByText(/kg co₂e per year/i)).toBeInTheDocument();
    expect(screen.getByText(/breakdown by category/i)).toBeInTheDocument();
  });

  it('shows recommendation content once a result is computed', async () => {
    render(<FootprintPage />);

    fireEvent.click(screen.getByRole('button', { name: /calculate your carbon footprint/i }));

    await waitFor(() => {
      expect(screen.getByLabelText(/gaia's recommendation/i)).toBeInTheDocument();
    });

    expect(screen.getByText(/gaia's recommendation/i)).toBeInTheDocument();
  });
});
