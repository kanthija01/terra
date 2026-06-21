import { NextResponse } from 'next/server';
import { generateFutureNarrativeServer } from '@/lib/gemini-server';
import { checkRateLimit } from '@/lib/rate-limit';

const MAX_ACTIVITIES = 10;
const MAX_BODY_SIZE = 4096;
const JSON_CONTENT_TYPE = /^application\/([\w.+-]*\+)?json\b/i;

function getClientIdentifier(request: Request) {
  const forwarded = request.headers.get('x-forwarded-for');
  if (forwarded) return forwarded.split(',')[0]?.trim() || 'unknown';
  return request.headers.get('x-real-ip') || 'unknown';
}

function jsonError(message: string, status: number, headers?: Record<string, string>) {
  return NextResponse.json(
    { error: message },
    {
      status,
      headers: {
        'Cache-Control': 'no-store',
        ...headers,
      },
    }
  );
}

export async function POST(request: Request) {
  if (request.method !== 'POST') {
    return jsonError('Method not allowed.', 405);
  }

  const contentType = request.headers.get('content-type') || '';
  if (!JSON_CONTENT_TYPE.test(contentType)) {
    return jsonError('Request body must be valid JSON.', 415);
  }

  const identifier = getClientIdentifier(request);
  const rateLimit = checkRateLimit(identifier, 'future-narrative');
  if (!rateLimit.allowed) {
    return jsonError('Too many requests. Please try again shortly.', 429, {
      'Retry-After': String(Math.ceil((rateLimit.retryAfterMs ?? 0) / 1000)),
      'X-RateLimit-Remaining': '0',
    });
  }

  let rawBody: string;
  try {
    rawBody = await request.text();
  } catch {
    return jsonError('Request body could not be read.', 400);
  }

  if (rawBody.length === 0 || rawBody.length > MAX_BODY_SIZE) {
    return jsonError('Request body is missing or too large.', 400);
  }

  let body: { score?: unknown; years?: unknown; activities?: unknown };
  try {
    body = JSON.parse(rawBody) as { score?: unknown; years?: unknown; activities?: unknown };
  } catch {
    return jsonError('Request body must be valid JSON.', 400);
  }

  const { score, years, activities } = body;
  const activitiesValid =
    Array.isArray(activities) &&
    activities.length > 0 &&
    activities.length <= MAX_ACTIVITIES &&
    activities.every((activity) => typeof activity === 'string' && activity.trim().length > 0);

  if (typeof score !== 'number' || typeof years !== 'number' || !activitiesValid) {
    return jsonError(
      '"score" (number), "years" (number), and "activities" (string[]) are all required.',
      400
    );
  }

  try {
    const narrative = await generateFutureNarrativeServer(score, years, activities as string[]);
    return NextResponse.json(
      { narrative },
      {
        headers: {
          'Cache-Control': 'no-store',
          'X-RateLimit-Remaining': String(rateLimit.remaining),
        },
      }
    );
  } catch (error) {
    console.error('[api/future-narrative] Gemini request failed:', error);
    const isConfigError = error instanceof Error && error.message.includes('GEMINI_API_KEY');
    return jsonError(
      isConfigError
        ? 'The future-narrative service is not configured.'
        : 'Could not generate a future narrative right now. Please try again shortly.',
      isConfigError ? 500 : 502
    );
  }
}
