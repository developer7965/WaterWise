
"use client";

import { useState, useEffect, useTransition } from "react";
import { ChallengeCard, type ChallengeStatus } from "@/components/challenge-card";
import type { Challenge } from "@/lib/data";
import { sampleChallenges, sampleUserProfile } from "@/lib/data"; // Using profile for past usage context
import { Button } from "@/components/ui/button";
import { Sparkles, Loader2, Trophy } from "lucide-react";
import { suggestNewChallengeAction } from "./actions";
import { useToast } from "@/hooks/use-toast";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

type ChallengeWithStatus = Challenge & { status: ChallengeStatus };

export default function ChallengesPage() {
  const [challenges, setChallenges] = useState<ChallengeWithStatus[]>([]);
  const [isPending, startTransition] = useTransition();
  const { toast } = useToast();
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
    const storedChallenges = localStorage.getItem("aquaChatChallenges");
    if (storedChallenges) {
      setChallenges(JSON.parse(storedChallenges));
    } else {
      setChallenges(sampleChallenges.map(c => ({ ...c, status: 'todo' })));
    }
  }, []);

  useEffect(() => {
    if (isClient) {
      localStorage.setItem("aquaChatChallenges", JSON.stringify(challenges));
    }
  }, [challenges, isClient]);

  const handleStatusChange = (challengeId: string, newStatus: ChallengeStatus) => {
    setChallenges(prev =>
      prev.map(c => (c.id === challengeId ? { ...c, status: newStatus } : c))
    );
  };

  const handleSuggestChallenge = () => {
    startTransition(async () => {
      // Example past usage, in a real app this would be dynamic
      const pastUsageContext = `User ${sampleUserProfile.name} has saved ${sampleUserProfile.waterSavedThisMonthLiters}L this month and completed ${sampleUserProfile.challengesCompleted} challenges. Focus on indoor water saving.`;
      const result = await suggestNewChallengeAction(pastUsageContext);
      if ("error" in result) {
        toast({
          title: "Error",
          description: result.error,
          variant: "destructive",
        });
      } else {
        setChallenges(prev => [{ ...result, status: 'todo' }, ...prev]);
        toast({
          title: "New Challenge Suggested!",
          description: `"${result.title}" has been added to your challenges.`,
        });
      }
    });
  };
  
  if (!isClient) {
    return (
      <div className="container mx-auto py-8 text-center">
        <Loader2 className="h-12 w-12 animate-spin text-primary mx-auto" />
        <p className="mt-4 text-muted-foreground">Loading challenges...</p>
      </div>
    );
  }


  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-8 text-center font-headline text-primary-foreground bg-primary p-4 rounded-lg shadow-md">
        HydroTrack Challenges
      </h1>

      <Alert className="mb-6 border-accent bg-accent/10">
        <Trophy className="h-5 w-5 text-accent" />
        <AlertTitle className="font-headline text-accent">Challenge Yourself!</AlertTitle>
        <AlertDescription className="text-accent-foreground/80">
          Take on weekly challenges to save water and earn points. Small changes make a big impact!
        </AlertDescription>
      </Alert>
      
      <div className="mb-8 text-center">
        <Button onClick={handleSuggestChallenge} disabled={isPending} size="lg" className="bg-accent text-accent-foreground hover:bg-accent/90">
          {isPending ? (
            <Loader2 className="mr-2 h-5 w-5 animate-spin" />
          ) : (
            <Sparkles className="mr-2 h-5 w-5" />
          )}
          Suggest a New Challenge (AI)
        </Button>
      </div>

      {challenges.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {challenges.map((challenge) => (
            <ChallengeCard
              key={challenge.id}
              challenge={challenge}
              status={challenge.status}
              onStatusChange={handleStatusChange}
            />
          ))}
        </div>
      ) : (
         <p className="text-center text-muted-foreground mt-10">No challenges available at the moment. Try suggesting one!</p>
      )}
    </div>
  );
}
