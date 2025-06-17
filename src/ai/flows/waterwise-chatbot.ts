'use server';

/**
 * @fileOverview A chatbot for answering questions about water conservation tips.
 *
 * - waterwiseChatbot - A function that handles the chatbot interactions.
 * - WaterwiseChatbotInput - The input type for the waterwiseChatbot function.
 * - WaterwiseChatbotOutput - The return type for the waterwiseChatbot function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const WaterwiseChatbotInputSchema = z.object({
  question: z.string().describe('The user question about water conservation.'),
});
export type WaterwiseChatbotInput = z.infer<typeof WaterwiseChatbotInputSchema>;

const WaterwiseChatbotOutputSchema = z.object({
  answer: z.string().describe('The chatbot answer to the user question.'),
});
export type WaterwiseChatbotOutput = z.infer<typeof WaterwiseChatbotOutputSchema>;

export async function waterwiseChatbot(input: WaterwiseChatbotInput): Promise<WaterwiseChatbotOutput> {
  return waterwiseChatbotFlow(input);
}

const prompt = ai.definePrompt({
  name: 'waterwiseChatbotPrompt',
  input: {schema: WaterwiseChatbotInputSchema},
  output: {schema: WaterwiseChatbotOutputSchema},
  prompt: `You are a chatbot designed to answer questions about water conservation tips.

  User Question: {{{question}}}

  Please provide a helpful and informative answer.`,
});

const waterwiseChatbotFlow = ai.defineFlow(
  {
    name: 'waterwiseChatbotFlow',
    inputSchema: WaterwiseChatbotInputSchema,
    outputSchema: WaterwiseChatbotOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
