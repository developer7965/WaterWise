import {genkit} from 'genkit';
import {googleAI} from '@genkit-ai/googleai';

export const ai = genkit({
  plugins: [googleAI()],
  model: 'googleai/gemini-2.0-flash',
});
import {genkit} from 'genkit';
import {googleAI} from '@genkit-ai/googleai';

// Ensure you have GEMINI_API_KEY set in your Vercel environment variables
// (and in your .env file for local development, e.g., .env.local or .env)
const apiKey = process.env.GEMINI_API_KEY;

if (!apiKey) {
  console.warn(
    'GEMINI_API_KEY is not set. AI features may not work. ' +
    'Please set GEMINI_API_KEY in your environment variables.'
  );
}

export const ai = genkit({
  plugins: [googleAI(apiKey ? {apiKey} : undefined)],
  model: 'googleai/gemini-2.0-flash',
});