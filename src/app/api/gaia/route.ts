import { NextResponse } from 'next/server';
import { askGaiaServer } from '@/lib/gemini-server';

export async function POST(request: Request) {
  let body: { context?: unknown };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: 'Request body must be valid JSON.' }, { status: 400 });
  }

  const { context } = body;
  if (typeof context !== 'string' || context.trim().length === 0) {
    return NextResponse.json(
      { error: '"context" is required and must be a non-empty string.' },
      { status: 400 }
    );
  }

  try {
    const message = await askGaiaServer(context);
    return NextResponse.json({ message });
  } catch (error) {
    console.error('[api/gaia] Gemini request failed:', error);
    const isConfigError = error instanceof Error && error.message.includes('GEMINI_API_KEY');
    return NextResponse.json(
      {
        error: isConfigError
          ? 'Gaia is temporarily unavailable: the AI service is not configured.'
          : 'Gaia could not respond right now. Please try again shortly.',
      },
      { status: isConfigError ? 500 : 502 }
    );
  }
}
