import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI(process.env.NEXT_PUBLIC_GEMINI_API_KEY || '');

const GAIA_SYSTEM_PROMPT = `You are Gaia, a caring Earth spirit companion in the Terra app. 
You speak in a warm, encouraging, poetic tone. Keep responses under 2 sentences.
You celebrate achievements, give eco-tips, and make users feel connected to their Earth.
Never use technical jargon. Speak as if you are the Earth itself, grateful for their care.`;

export async function askGaia(context: string): Promise<string> {
  const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
  const result = await model.generateContent([
    { text: GAIA_SYSTEM_PROMPT },
    { text: context },
  ]);
  return result.response.text();
}

export async function generateFutureNarrative(
  score: number,
  years: number,
  activities: string[]
): Promise<string> {
  const model = genAI.getGenerativeModel({ model: 'gemini-1.5-pro' });
  const prompt = `Write a poetic, cinematic 3-sentence narrative about Earth ${years} year(s) from now.
  The user's sustainability score is ${score}/100. Their key actions: ${activities.join(', ')}.
  If score > 70: describe a thriving, beautiful world. If < 50: describe a struggling one.
  Be emotional, visual, and hopeful. Address the user as "you".`;
  const result = await model.generateContent(prompt);
  return result.response.text();
}

export async function analyzeEcoImage(imageBase64: string): Promise<{
  item: string;
  co2Kg: number;
  alternatives: { name: string; co2Savings: number; description: string }[];
}> {
  const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
  const result = await model.generateContent([
    { text: 'Analyze this image for environmental impact. Return JSON with: item (string), co2Kg (number, estimated CO2 per unit), alternatives (array of {name, co2Savings percentage, description}). Only return valid JSON.' },
    { inlineData: { mimeType: 'image/jpeg', data: imageBase64 } },
  ]);
  return JSON.parse(result.response.text());
}
