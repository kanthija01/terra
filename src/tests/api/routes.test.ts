import { beforeEach, describe, expect, it, vi } from 'vitest';
import { POST as postGaia } from '@/app/api/gaia/route';
import { POST as postFuture } from '@/app/api/future-narrative/route';
import { POST as postEcoScan } from '@/app/api/ecoscan/route';
import * as geminiServer from '@/lib/gemini-server';

vi.mock('@/lib/gemini-server', () => ({
  askGaiaServer: vi.fn(),
  generateFutureNarrativeServer: vi.fn(),
  analyzeEcoImageServer: vi.fn(),
}));

const mockedGemini = vi.mocked(geminiServer);

function makeRequest(
  body: unknown,
  headers: Record<string, string> = {},
  method = 'POST'
) {
  return new Request('http://localhost', {
    method,
    headers: {
      'content-type': 'application/json',
      ...headers,
    },
    body: JSON.stringify(body),
  });
}

function makeTextRequest(
  body: string,
  headers: Record<string, string> = {},
  method = 'POST'
) {
  return new Request('http://localhost', {
    method,
    headers: {
      'content-type': 'text/plain',
      ...headers,
    },
    body,
  });
}

async function readJson(response: Response) {
  return response.json();
}

describe('API route integration', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('/api/gaia', () => {
    it('returns a Gaia message for valid input', async () => {
      mockedGemini.askGaiaServer.mockResolvedValueOnce('Earth is smiling');

      const response = await postGaia(
        makeRequest({ context: 'The user chose a bike today.' }, { 'x-real-ip': 'gaia-success' })
      );
      const payload = await readJson(response);

      expect(response.status).toBe(200);
      expect(payload).toEqual({ message: 'Earth is smiling' });
      expect(mockedGemini.askGaiaServer).toHaveBeenCalledWith('The user chose a bike today.');
    });

    it('rejects requests that do not send JSON content', async () => {
      const response = await postGaia(
        makeTextRequest('not-json', { 'x-real-ip': 'gaia-invalid-content-type' })
      );
      const payload = await readJson(response);

      expect(response.status).toBe(415);
      expect(payload.error).toContain('JSON');
    });

    it('rejects missing or empty context values', async () => {
      const response = await postGaia(
        makeRequest({ context: '' }, { 'x-real-ip': 'gaia-validation' })
      );
      const payload = await readJson(response);

      expect(response.status).toBe(400);
      expect(payload.error).toContain('context');
    });

    it('returns a server error when the Gemini integration fails because the key is missing', async () => {
      mockedGemini.askGaiaServer.mockRejectedValueOnce(
        new Error('GEMINI_API_KEY is not set. Add it to .env.local')
      );

      const response = await postGaia(
        makeRequest({ context: 'The user is trying to improve.' }, { 'x-real-ip': 'gaia-config-error' })
      );
      const payload = await readJson(response);

      expect(response.status).toBe(500);
      expect(payload.error).toContain('temporarily unavailable');
    });

    it('returns 429 after the request limit is reached for the same client', async () => {
      const ip = 'gaia-rate-limit';
      mockedGemini.askGaiaServer.mockResolvedValue('steady');

      let rateLimited = false;
      for (let i = 0; i < 21; i += 1) {
        const response = await postGaia(
          makeRequest({ context: `request-${i}` }, { 'x-real-ip': ip })
        );
        if (response.status === 429) {
          rateLimited = true;
          const payload = await readJson(response);
          expect(payload.error).toContain('Too many requests');
          break;
        }
      }

      expect(rateLimited).toBe(true);
    });
  });

  describe('/api/future-narrative', () => {
    it('returns a narrative for valid input', async () => {
      mockedGemini.generateFutureNarrativeServer.mockResolvedValueOnce('A brighter tomorrow');

      const response = await postFuture(
        makeRequest(
          {
            score: 80,
            years: 5,
            activities: ['bike commute', 'solar home'],
          },
          { 'x-real-ip': 'future-success' }
        )
      );
      const payload = await readJson(response);

      expect(response.status).toBe(200);
      expect(payload).toEqual({ narrative: 'A brighter tomorrow' });
      expect(mockedGemini.generateFutureNarrativeServer).toHaveBeenCalledWith(
        80,
        5,
        ['bike commute', 'solar home']
      );
    });

    it('rejects invalid activities payloads', async () => {
      const response = await postFuture(
        makeRequest(
          {
            score: 80,
            years: 5,
            activities: [],
          },
          { 'x-real-ip': 'future-validation' }
        )
      );
      const payload = await readJson(response);

      expect(response.status).toBe(400);
      expect(payload.error).toContain('activities');
    });

    it('returns a 502 error when the upstream generation fails generically', async () => {
      mockedGemini.generateFutureNarrativeServer.mockRejectedValueOnce(
        new Error('upstream timeout')
      );

      const response = await postFuture(
        makeRequest(
          {
            score: 80,
            years: 5,
            activities: ['daily care'],
          },
          { 'x-real-ip': 'future-generic-error' }
        )
      );
      const payload = await readJson(response);

      expect(response.status).toBe(502);
      expect(payload.error).toContain('Could not generate');
    });

    it('returns 429 after the request limit is reached for the same client', async () => {
      const ip = 'future-rate-limit';
      mockedGemini.generateFutureNarrativeServer.mockResolvedValue('future');

      let rateLimited = false;
      for (let i = 0; i < 21; i += 1) {
        const response = await postFuture(
          makeRequest(
            {
              score: 75,
              years: 1,
              activities: ['habit'],
            },
            { 'x-real-ip': ip }
          )
        );
        if (response.status === 429) {
          rateLimited = true;
          const payload = await readJson(response);
          expect(payload.error).toContain('Too many requests');
          break;
        }
      }

      expect(rateLimited).toBe(true);
    });
  });

  describe('/api/ecoscan', () => {
    it('returns analysis for a valid image payload', async () => {
      mockedGemini.analyzeEcoImageServer.mockResolvedValueOnce({
        item: 'Reusable Bottle',
        co2Kg: 0.4,
        alternatives: [{ name: 'Steel bottle', co2Savings: 60, description: 'Less waste' }],
      });

      const response = await postEcoScan(
        makeRequest(
          {
            imageBase64: 'aGVsbG8=',
          },
          { 'x-real-ip': 'eco-success' }
        )
      );
      const payload = await readJson(response);

      expect(response.status).toBe(200);
      expect(payload).toEqual({
        item: 'Reusable Bottle',
        co2Kg: 0.4,
        alternatives: [{ name: 'Steel bottle', co2Savings: 60, description: 'Less waste' }],
      });
      expect(mockedGemini.analyzeEcoImageServer).toHaveBeenCalledWith('aGVsbG8=');
    });

    it('rejects missing image payloads', async () => {
      const response = await postEcoScan(
        makeRequest(
          {
            imageBase64: '',
          },
          { 'x-real-ip': 'eco-validation' }
        )
      );
      const payload = await readJson(response);

      expect(response.status).toBe(400);
      expect(payload.error).toContain('imageBase64');
    });

    it('rejects image payloads that are not valid base64', async () => {
      const response = await postEcoScan(
        makeRequest(
          {
            imageBase64: 'not-valid-base64!!',
          },
          { 'x-real-ip': 'eco-invalid-base64' }
        )
      );
      const payload = await readJson(response);

      expect(response.status).toBe(400);
      expect(payload.error).toContain('base64');
    });

    it('returns 413 when the uploaded payload is too large', async () => {
      const response = await postEcoScan(
        makeRequest(
          {
            imageBase64: 'A'.repeat(5_000_004),
          },
          { 'x-real-ip': 'eco-too-large' }
        )
      );
      const payload = await readJson(response);

      expect(response.status).toBe(413);
      expect(payload.error).toContain('too large');
    });

    it('returns a 500 error when the Gemini service is not configured', async () => {
      mockedGemini.analyzeEcoImageServer.mockRejectedValueOnce(
        new Error('GEMINI_API_KEY is not set. Add it to .env.local')
      );

      const response = await postEcoScan(
        makeRequest(
          {
            imageBase64: 'aGVsbG8=',
          },
          { 'x-real-ip': 'eco-config-error' }
        )
      );
      const payload = await readJson(response);

      expect(response.status).toBe(500);
      expect(payload.error).toContain('temporarily unavailable');
    });

    it('returns 429 after the request limit is reached for the same client', async () => {
      const ip = 'eco-rate-limit';
      mockedGemini.analyzeEcoImageServer.mockResolvedValue({
        item: 'Item',
        co2Kg: 1,
        alternatives: [],
      });

      let rateLimited = false;
      for (let i = 0; i < 21; i += 1) {
        const response = await postEcoScan(
          makeRequest(
            {
              imageBase64: 'aGVsbG8=',
            },
            { 'x-real-ip': ip }
          )
        );
        if (response.status === 429) {
          rateLimited = true;
          const payload = await readJson(response);
          expect(payload.error).toContain('Too many requests');
          break;
        }
      }

      expect(rateLimited).toBe(true);
    });
  });
});
