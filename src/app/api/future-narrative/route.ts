import { NextResponse } from 'next/server';
import { generateFutureNarrativeServer } from '@/lib/gemini-server';

export async function POST(request: Request) {
  let body: { score?: unknown; years?: unknown; activities?: unknown };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: 'Request body must be valid JSON.' }, { status: 400 });
  }

  const { score, years, activities } = body;
  const activitiesValid =
    Array.isArray(activities) && activities.every((activity) => typeof activity === 'string');

  if (typeof score !== 'number' || typeof years !== 'number' || !activitiesValid) {
    return NextResponse.json(
      {
        error:
          '"score" (number), "years" (number), and "activities" (string[]) are all required.',
      },
      { status: 400 }
    );
  }

  try {
    const narrative = await generateFutureNarrativeServer(score, years, activities as string[]);
    return NextResponse.json({ narrative });
  } catch (error) {
    console.error('[api/future-narrative] Gemini request failed:', error);
    const isConfigError = error instanceof Error && error.message.includes('GEMINI_API_KEY');
    return NextResponse.json(
      {
        error: isConfigError
          ? 'The future-narrative service is not configured.'
          : 'Could not generate a future narrative right now. Please try again shortly.',
      },
      { status: isConfigError ? 500 : 502 }
    );
  }
}
