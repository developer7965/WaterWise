// Summarize Water Savings Flow
'use server';

/**
 * @fileOverview Summarizes a user's water savings for the week and provides suggestions for improvement.
 *
 * - summarizeWaterSavings - A function that takes user's water usage data and returns a summary of their savings and suggestions for improvement.
 * - SummarizeWaterSavingsInput - The input type for the summarizeWaterSavings function.
 * - SummarizeWaterSavingsOutput - The return type for the summarizeWaterSavings function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SummarizeWaterSavingsInputSchema = z.object({
  weeklyUsage: z
    .number()
    .describe('The user\u0027s total water usage for the week in liters.'),
  averageWeeklyUsage: z
    .number()
    .describe(
      'The average water usage for users with similar profiles in liters.'
    ),
  tipsUsed: z
    .array(z.string())
    .describe('List of tips that the user has utilized during the week.'),
  challengesCompleted: z
    .number()
    .describe('Number of eco challenges completed by the user this week.'),
});
export type SummarizeWaterSavingsInput = z.infer<
  typeof SummarizeWaterSavingsInputSchema
>;

const SummarizeWaterSavingsOutputSchema = z.object({
  summary: z
    .string()
    .describe(
      'A summary of the user\u0027s water savings for the week, including comparisons to average users and the environmental impact.'
    ),
  suggestions: z
    .array(z.string())
    .describe(
      'A list of actionable suggestions for the user to further reduce their water usage.'
    ),
});
export type SummarizeWaterSavingsOutput = z.infer<
  typeof SummarizeWaterSavingsOutputSchema
>;

export async function summarizeWaterSavings(
  input: SummarizeWaterSavingsInput
): Promise<SummarizeWaterSavingsOutput> {
  return summarizeWaterSavingsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'summarizeWaterSavingsPrompt',
  input: {schema: SummarizeWaterSavingsInputSchema},
  output: {schema: SummarizeWaterSavingsOutputSchema},
  prompt: `You are a helpful chatbot that provides personalized water conservation summaries and suggestions.

  Here is the user's weekly water usage data:
  - Weekly Usage: {{{weeklyUsage}}} liters
  - Average Weekly Usage (similar users): {{{averageWeeklyUsage}}} liters
  - Tips Used: {{#if tipsUsed}}{{#each tipsUsed}} - {{{this}}}{{/each}}{{else}}None{{/if}}
  - Challenges Completed: {{{challengesCompleted}}}

  Generate a concise summary of the user's water savings this week, comparing their usage to the average and highlighting their progress.  Also, provide a few targeted and actionable suggestions for how they can further reduce their water consumption.

  Summary:
  Suggestions: `,
});

const summarizeWaterSavingsFlow = ai.defineFlow(
  {
    name: 'summarizeWaterSavingsFlow',
    inputSchema: SummarizeWaterSavingsInputSchema,
    outputSchema: SummarizeWaterSavingsOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
