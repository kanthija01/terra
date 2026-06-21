/**
 * Client-safe Gaia/Gemini service layer.
 *
 * This file is safe to import from any component, including 'use client'
 * components. It never touches GEMINI_API_KEY directly — every call is
 * proxied through a Next.js API route (src/app/api/gaia, /future-narrative,
 * /ecoscan), which holds the real key server-side only, in
 * src/lib/gemini-server.ts.
 *
 * Function names and signatures intentionally match the original service
 * layer described in the README (askGaia, generateFutureNarrative,
 * analyzeEcoImage), so wiring this into the Gaia UI, Future Memories, or
 * EcoScan pages works exactly as documented — only the implementation
 * underneath moved, not the public API.
 */

import type { EcoScanResult } from './gemini-server';

async function postJson<TResponse>(url: string, body: unknown): Promise<TResponse> {
  let response: Response;
  try {
    response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });
  } catch (networkError) {
    throw new Error(
      `Could not reach ${url}. Check your network connection. (${
        networkError instanceof Error ? networkError.message : 'unknown error'
      })`
    );
  }

  let payload: unknown;
  try {
    payload = await response.json();
  } catch {
    throw new Error(`${url} returned a non-JSON response (status ${response.status}).`);
  }

  if (!response.ok) {
    const message =
      payload && typeof payload === 'object' && payload !== null && 'error' in payload
        ? String((payload as { error: unknown }).error)
        : `Request to ${url} failed with status ${response.status}.`;
    throw new Error(message);
  }

  return payload as TResponse;
}

/**
 * Ask Gaia for a short, in-character message about the given context
 * (e.g. the user's latest footprint result or a milestone they hit).
 */
export async function askGaia(context: string): Promise<string> {
  const { message } = await postJson<{ message: string }>('/api/gaia', { context });
  return message;
}

/**
 * Generate a cinematic narrative about the user's Earth N years from now,
 * based on their current sustainability score and recent activities.
 */
export async function generateFutureNarrative(
  score: number,
  years: number,
  activities: string[]
): Promise<string> {
  const { narrative } = await postJson<{ narrative: string }>('/api/future-narrative', {
    score,
    years,
    activities,
  });
  return narrative;
}

/**
 * Analyze a base64-encoded image (e.g. from EcoScan) for environmental
 * impact and lower-impact alternatives.
 */
export async function analyzeEcoImage(imageBase64: string): Promise<EcoScanResult> {
  return postJson<EcoScanResult>('/api/ecoscan', { imageBase64 });
}
