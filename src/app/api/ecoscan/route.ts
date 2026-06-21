import { NextResponse } from 'next/server';
import { analyzeEcoImageServer } from '@/lib/gemini-server';
import { checkRateLimit } from '@/lib/rate-limit';

const MAX_IMAGE_SIZE = 5_000_000;
const MAX_BODY_SIZE = 6_000_000;
const JSON_CONTENT_TYPE = /^application\/([\w.+-]*\+)?json\b/i;
const BASE64_RE = /^[A-Za-z0-9+/=_-]+={0,2}$/;

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

function isBase64Like(value: string) {
  const normalized = value.replace(/\s+/g, '');
  if (!normalized || !BASE64_RE.test(normalized)) {
    return false;
  }

  const padded =
    normalized.length % 4 === 0
      ? normalized
      : normalized + '='.repeat((4 - (normalized.length % 4)) % 4);

  try {
    const decoded = Buffer.from(padded, 'base64');
    if (decoded.length === 0 && normalized.length > 0) {
      return false;
    }
    return decoded.toString('base64').replace(/=+$/, '') === padded.replace(/=+$/, '');
  } catch {
    return false;
  }
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
  const rateLimit = checkRateLimit(identifier, 'ecoscan');
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

  let body: { imageBase64?: unknown };
  try {
    body = JSON.parse(rawBody) as { imageBase64?: unknown };
  } catch {
    return jsonError('Request body must be valid JSON.', 400);
  }

  const { imageBase64 } = body;
  if (typeof imageBase64 !== 'string' || imageBase64.trim().length === 0) {
    return jsonError(
      '"imageBase64" is required and must be a non-empty base64-encoded string.',
      400
    );
  }

  if (imageBase64.length > MAX_IMAGE_SIZE) {
    return jsonError('The uploaded image is too large.', 413);
  }

  if (!isBase64Like(imageBase64)) {
    return jsonError('"imageBase64" must be valid base64 data.', 400);
  }

  try {
    const result = await analyzeEcoImageServer(imageBase64);
    return NextResponse.json(result, {
      headers: {
        'Cache-Control': 'no-store',
        'X-RateLimit-Remaining': String(rateLimit.remaining),
      },
    });
  } catch (error) {
    console.error('[api/ecoscan] Gemini request failed:', error);
    const isConfigError = error instanceof Error && error.message.includes('GEMINI_API_KEY');
    return jsonError(
      isConfigError
        ? 'EcoScan is temporarily unavailable: the AI service is not configured.'
        : 'Could not analyze this image right now. Please try again shortly.',
      isConfigError ? 500 : 502
    );
  }
}
