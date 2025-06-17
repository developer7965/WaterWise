
"use server";

import { generateEcoChallenge, type GenerateEcoChallengeInput, type GenerateEcoChallengeOutput } from "@/ai/flows/generate-eco-challenge";
import type { Challenge, ChallengeIconName } from "@/lib/data";


export async function suggestNewChallengeAction(pastWaterUsage: string): Promise<Challenge | { error: string }> {
  try {
    const input: GenerateEcoChallengeInput = { pastWaterUsage };
    const result: GenerateEcoChallengeOutput = await generateEcoChallenge(input);
    
    const newChallenge: Challenge = {
      id: `ai-${crypto.randomUUID()}`,
      title: result.title,
      description: result.description, 
      duration: "Varies", 
      difficulty: "Medium", 
      iconName: "Trophy" as ChallengeIconName, // Default icon name, AI could suggest this in future
      points: 50 // Default points, AI could suggest this in future
    };
    // The result.reasoning is available here if you want to log it or store it elsewhere,
    // but it's not directly used for the Challenge object's description field for the card.
    return newChallenge;
  } catch (error) {
    console.error("Error generating eco challenge:", error);
    return { error: "Failed to generate a new challenge. Please try again." };
  }
}
