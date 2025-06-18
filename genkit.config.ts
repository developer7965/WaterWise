// genkit.config.ts
import { defineConfig } from '@genkit-ai/core';
import { googleAi } from '@genkit-ai/googleai';

import './src/ai/flows/waterwise-chatbot'; // Adjust path if needed

export default defineConfig({
  plugins: [googleAi()],
  flows: ['src/ai/flows/waterwise-chatbot'], // or wherever your flow lives
});

googleAi({
  apiKey: process.env.GOOGLE_AI_API_KEY!,
  // optionally set model defaults
})