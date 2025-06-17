"use server";

import { summarizeWaterSavings, type SummarizeWaterSavingsInput, type SummarizeWaterSavingsOutput } from "@/ai/flows/summarize-water-savings";

export async function getImpactSummaryAction(input: SummarizeWaterSavingsInput): Promise<SummarizeWaterSavingsOutput | { error: string }> {
  try {
    const result = await summarizeWaterSavings(input);
    return result;
  } catch (error) {
    console.error("Error summarizing water savings:", error);
    return { error: "Failed to generate impact summary. Please try again." };
  }
}
