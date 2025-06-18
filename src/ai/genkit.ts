import { genkit } from 'genkit';
import { googleAI } from '@genkit-ai/googleai';

// Ensure you have GEMINI_API_KEY set in your environment variables
const apiKey = process.env.GEMINI_API_KEY;

if (!apiKey) {
  console.warn(
    'GEMINI_API_KEY is not set. AI features may not work. ' +
    'Please set GEMINI_API_KEY in your environment variables.'
  );
}

export const ai = genkit({
  plugins: [googleAI(apiKey ? { apiKey } : undefined)],
  model: 'googleai/gemini-2.0-flash',
});
