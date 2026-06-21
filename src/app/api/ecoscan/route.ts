import { NextResponse } from 'next/server';
import { analyzeEcoImageServer } from '@/lib/gemini-server';

export async function POST(request: Request) {
  let body: { imageBase64?: unknown };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: 'Request body must be valid JSON.' }, { status: 400 });
  }

  const { imageBase64 } = body;
  if (typeof imageBase64 !== 'string' || imageBase64.trim().length === 0) {
    return NextResponse.json(
      { error: '"imageBase64" is required and must be a non-empty base64-encoded string.' },
      { status: 400 }
    );
  }

  try {
    const result = await analyzeEcoImageServer(imageBase64);
    return NextResponse.json(result);
  } catch (error) {
    console.error('[api/ecoscan] Gemini request failed:', error);
    const isConfigError = error instanceof Error && error.message.includes('GEMINI_API_KEY');
    return NextResponse.json(
      {
        error: isConfigError
          ? 'EcoScan is temporarily unavailable: the AI service is not configured.'
          : 'Could not analyze this image right now. Please try again shortly.',
      },
      { status: isConfigError ? 500 : 502 }
    );
  }
}
