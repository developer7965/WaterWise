// This file is machine-generated - edit with care!

'use server';

/**
 * @fileOverview An AI agent that suggests personalized Eco Challenges to users based on their past water usage.
 *
 * - generateEcoChallenge - A function that suggests an Eco Challenge.
 * - GenerateEcoChallengeInput - The input type for the generateEcoChallenge function.
 * - GenerateEcoChallengeOutput - The return type for the generateEcoChallenge function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateEcoChallengeInputSchema = z.object({
  pastWaterUsage: z
    .string()
    .describe(
      'A description of the user\'s past water usage, including sources and amounts.'
    ),
});
export type GenerateEcoChallengeInput = z.infer<typeof GenerateEcoChallengeInputSchema>;

const GenerateEcoChallengeOutputSchema = z.object({
  title: z
    .string()
    .describe(
      'A very short and catchy title for the Eco Challenge (e.g., "Kitchen Drip Detective", "Garden Hydration Hero", "Appliance Audit"). Aim for 3-5 words maximum.'
    ),
  description: z
    .string()
    .describe(
      'A concise explanation of *what the user needs to do* for this challenge (e.g., "Check all kitchen taps for drips and ensure your dishwasher is run with full loads only for a week.", "Install a water butt to collect rainwater for your garden.", "Review the water efficiency ratings of your washing machine and dishwasher."). Aim for 1-2 sentences and keep it direct and actionable.'
    ),
  reasoning: z
    .string()
    .describe(
      'A brief (1 sentence) explanation of why this specific challenge is relevant and beneficial for the user, based on their past water usage. This explains the "why this challenge for you".'
    ),
});
export type GenerateEcoChallengeOutput = z.infer<typeof GenerateEcoChallengeOutputSchema>;

export async function generateEcoChallenge(
  input: GenerateEcoChallengeInput
): Promise<GenerateEcoChallengeOutput> {
  return generateEcoChallengeFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateEcoChallengePrompt',
  input: {schema: GenerateEcoChallengeInputSchema},
  output: {schema: GenerateEcoChallengeOutputSchema},
  prompt: `You are an AI assistant specializing in water conservation. Your task is to suggest a personalized and DIVERSE Eco Challenge to the user based on their past water usage. Aim for variety in the type of challenges, covering areas like bathroom, kitchen, outdoor use, general habits, or appliance usage.

User's Past Water Usage Context:
{{pastWaterUsage}}

Based on this information, and aiming for a diverse suggestion that might not be directly related to the *most obvious* past usage if it means providing variety, generate the following:
1.  \`title\`: A very short and catchy title for the Eco Challenge. Aim for 3-5 words maximum (e.g., "Kitchen Drip Detective", "Garden Hydration Hero", "Appliance Audit", "Shower Sprint Star").
2.  \`description\`: A concise explanation of *what the user needs to do* for this challenge. This should be direct and actionable, detailing the task. Aim for 1-2 sentences (e.g., "Check all kitchen taps for drips and ensure your dishwasher is run with full loads only for a week.", "Install a water butt to collect rainwater for your garden.", "Review the water efficiency ratings of your washing machine and dishwasher.", "Try to limit your daily shower to 3 minutes for the next 5 days.").
3.  \`reasoning\`: A brief, 1-sentence explanation of *why* this specific challenge is relevant and beneficial for the user, connecting it to their past water usage patterns or general conservation goals. (e.g., "Even small kitchen leaks add up, and efficient appliance use makes a big difference.", "Harvesting rainwater reduces reliance on tap water for outdoor needs.", "Understanding appliance efficiency can lead to long-term savings.", "Reducing shower time is a high-impact way to save water daily.").

Ensure the \`title\` and \`description\` are motivating and easy to understand.
The \`description\` MUST focus on the task itself, not the rationale for suggesting it. The \`reasoning\` field covers the rationale.
When suggesting a challenge, try to pick a category (e.g., kitchen, outdoor, appliance, bathroom, behavioral) that you haven't suggested recently if possible, or that seems underrepresented in common water saving advice, while still being relevant to the user if possible. Do not always suggest shower related challenges; ensure variety.`,
});

const generateEcoChallengeFlow = ai.defineFlow(
  {
    name: 'generateEcoChallengeFlow',
    inputSchema: GenerateEcoChallengeInputSchema,
    outputSchema: GenerateEcoChallengeOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
