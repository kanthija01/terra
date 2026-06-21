import { NextResponse } from 'next/server';
import { askGaiaServer } from '@/lib/gemini-server';
import { checkRateLimit } from '@/lib/rate-limit';

const MAX_CONTEXT_LENGTH = 2000;
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
  const rateLimit = checkRateLimit(identifier, 'gaia');
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

  let body: { context?: unknown };
  try {
    body = JSON.parse(rawBody) as { context?: unknown };
  } catch {
    return jsonError('Request body must be valid JSON.', 400);
  }

  const { context } = body;
  if (typeof context !== 'string' || context.trim().length === 0) {
    return jsonError('"context" is required and must be a non-empty string.', 400);
  }

  if (context.length > MAX_CONTEXT_LENGTH) {
    return jsonError('The provided context is too long.', 413);
  }

  try {
    const message = await askGaiaServer(context);
    return NextResponse.json(
      { message },
      {
        headers: {
          'Cache-Control': 'no-store',
          'X-RateLimit-Remaining': String(rateLimit.remaining),
        },
      }
    );
  } catch (error) {
    console.error('[api/gaia] Gemini request failed:', error);
    const isConfigError = error instanceof Error && error.message.includes('GEMINI_API_KEY');
    return jsonError(
      isConfigError
        ? 'Gaia is temporarily unavailable: the AI service is not configured.'
        : 'Gaia could not respond right now. Please try again shortly.',
      isConfigError ? 500 : 502
    );
  }
}
