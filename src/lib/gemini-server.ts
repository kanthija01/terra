/**
 * Server-only Gemini service layer.
 *
 * This file must only ever be imported by Next.js Route Handlers
 * (src/app/api/*\/route.ts). Route Handlers always run on the server,
 * so the GEMINI_API_KEY used here is never sent to the browser or
 * included in any client JavaScript bundle.
 *
 * Do NOT import this file from a 'use client' component or from
 * src/lib/gemini.ts (the client-safe wrapper) — that would defeat the
 * point of moving the key server-side.
 */

import { GoogleGenerativeAI } from '@google/generative-ai';

const GAIA_SYSTEM_PROMPT = `You are Gaia, a caring Earth spirit companion in the Terra app. 
You speak in a warm, encouraging, poetic tone. Keep responses under 2 sentences.
You celebrate achievements, give eco-tips, and make users feel connected to their Earth.
Never use technical jargon. Speak as if you are the Earth itself, grateful for their care.`;

export interface EcoScanResult {
  item: string;
  co2Kg: number;
  alternatives: { name: string; co2Savings: number; description: string }[];
}

/**
 * Lazily creates the Gemini client on each call rather than at module
 * load time. This means a missing key produces a clear, catchable error
 * at request time instead of a confusing failure the moment any route
 * file is loaded.
 */
function getClient(): GoogleGenerativeAI {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error(
      'GEMINI_API_KEY is not set. Add it to .env.local (server-only, no NEXT_PUBLIC_ prefix).'
    );
  }
  return new GoogleGenerativeAI(apiKey);
}

/**
 * Gemini sometimes wraps JSON responses in markdown code fences
 * (```json ... ```) even when explicitly asked not to. Strip them
 * before attempting to parse.
 */
function stripCodeFences(text: string): string {
  return text
    .trim()
    .replace(/^```(?:json)?\s*/i, '')
    .replace(/```\s*$/i, '')
    .trim();
}

export async function askGaiaServer(context: string): Promise<string> {
  if (typeof context !== 'string' || context.trim().length === 0) {
    throw new Error('askGaiaServer requires a non-empty "context" string.');
  }

  const genAI = getClient();
  const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

  const result = await model.generateContent([
    { text: GAIA_SYSTEM_PROMPT },
    { text: context },
  ]);

  const text = result.response.text();
  if (!text) {
    throw new Error('Gemini returned an empty response for askGaia.');
  }
  return text;
}

export async function generateFutureNarrativeServer(
  score: number,
  years: number,
  activities: string[]
): Promise<string> {
  if (
    typeof score !== 'number' ||
    typeof years !== 'number' ||
    !Array.isArray(activities) ||
    !activities.every((activity) => typeof activity === 'string')
  ) {
    throw new Error(
      'generateFutureNarrativeServer requires a numeric score, numeric years, and a string[] of activities.'
    );
  }

  const genAI = getClient();
  const model = genAI.getGenerativeModel({ model: 'gemini-1.5-pro' });
  const prompt = `Write a poetic, cinematic 3-sentence narrative about Earth ${years} year(s) from now.
  The user's sustainability score is ${score}/100. Their key actions: ${activities.join(', ')}.
  If score > 70: describe a thriving, beautiful world. If < 50: describe a struggling one.
  Be emotional, visual, and hopeful. Address the user as "you".`;

  const result = await model.generateContent(prompt);
  const text = result.response.text();
  if (!text) {
    throw new Error('Gemini returned an empty response for generateFutureNarrative.');
  }
  return text;
}

export async function analyzeEcoImageServer(imageBase64: string): Promise<EcoScanResult> {
  if (typeof imageBase64 !== 'string' || imageBase64.trim().length === 0) {
    throw new Error('analyzeEcoImageServer requires a non-empty base64 "imageBase64" string.');
  }

  const genAI = getClient();
  const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

  const result = await model.generateContent([
    {
      text:
        'Analyze this image for environmental impact. Return JSON with: item (string), co2Kg (number, estimated CO2 per unit), alternatives (array of {name, co2Savings percentage, description}). Only return valid JSON.',
    },
    { inlineData: { mimeType: 'image/jpeg', data: imageBase64 } },
  ]);

  const rawText = result.response.text();
  const cleaned = stripCodeFences(rawText);

  let parsed: unknown;
  try {
    parsed = JSON.parse(cleaned);
  } catch {
    throw new Error(
      'Gemini returned a response that could not be parsed as JSON for analyzeEcoImage.'
    );
  }

  const candidate = parsed as Partial<EcoScanResult> | null;
  if (
    !candidate ||
    typeof candidate.item !== 'string' ||
    typeof candidate.co2Kg !== 'number' ||
    !Array.isArray(candidate.alternatives)
  ) {
    throw new Error('Gemini returned JSON with an unexpected shape for analyzeEcoImage.');
  }

  return candidate as EcoScanResult;
}
