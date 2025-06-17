
"use client";

import { useState, useEffect, useTransition } from "react";
import { ImpactStatCard } from "@/components/impact-stat-card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Droplet, TreePine, CircleDollarSign, Zap, Loader2, RefreshCw } from "lucide-react";
import { averageWeeklyUsageLiters, sampleUserProfile, type WaterUsageLog } from "@/lib/data"; // Using profile for example data
import type { SummarizeWaterSavingsInput, SummarizeWaterSavingsOutput } from "@/ai/flows/summarize-water-savings";
import { getImpactSummaryAction } from "./actions";
import { useToast } from "@/hooks/use-toast";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

// Simplified calculations for demonstration
const MONEY_SAVED_PER_LITER = 0.02; // Example: 0.02 AED per liter (adjust as needed)
const LITERS_PER_TREE_WATERED_PER_WEEK = 75; // Example: 75 liters waters a tree for a week

export default function ImpactPage() {
  const [isClient, setIsClient] = useState(false);
  const [weeklyUsage, setWeeklyUsage] = useState(0);
  const [waterSaved, setWaterSaved] = useState(0);
  const [moneySaved, setMoneySaved] = useState(0);
  const [treesWatered, setTreesWatered] = useState(0);
  const [aiSummary, setAiSummary] = useState<SummarizeWaterSavingsOutput | null>(null);
  const [isSummaryLoading, startSummaryTransition] = useTransition();
  const { toast } = useToast();

  useEffect(() => {
    setIsClient(true);
    // Load usage data from localStorage (similar to dashboard)
    const storedLogs = localStorage.getItem("aquaChatUsageLogs");
    let currentWeekLogs: WaterUsageLog[] = [];
    if (storedLogs) {
      const allLogs: WaterUsageLog[] = JSON.parse(storedLogs);
      const oneWeekAgo = new Date();
      oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
      currentWeekLogs = allLogs.filter(log => new Date(log.date) >= oneWeekAgo);
    }
    
    const currentWeeklyTotal = currentWeekLogs.reduce((sum, log) => sum + log.liters, 0);
    setWeeklyUsage(currentWeeklyTotal);

    const saved = averageWeeklyUsageLiters - currentWeeklyTotal;
    setWaterSaved(saved > 0 ? saved : 0);
    setMoneySaved(saved > 0 ? saved * MONEY_SAVED_PER_LITER : 0);
    setTreesWatered(saved > 0 ? Math.floor(saved / LITERS_PER_TREE_WATERED_PER_WEEK) : 0);
  }, [isClient]);

  const fetchAiSummary = () => {
    startSummaryTransition(async () => {
      const input: SummarizeWaterSavingsInput = {
        weeklyUsage: weeklyUsage,
        averageWeeklyUsage: averageWeeklyUsageLiters,
        tipsUsed: ["Shorter Showers", "Fix Leaks"], // Example data
        challengesCompleted: sampleUserProfile.challengesCompleted, // Example data
      };
      const result = await getImpactSummaryAction(input);
      if ("error" in result) {
        toast({ title: "Error", description: result.error, variant: "destructive" });
        setAiSummary(null);
      } else {
        setAiSummary(result);
      }
    });
  };
  
  useEffect(() => {
    if (isClient && weeklyUsage > 0) { // Fetch summary once on load if data exists
        fetchAiSummary();
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isClient, weeklyUsage]); // Only re-run if isClient or weeklyUsage changes significantly

  if (!isClient) {
     return (
      <div className="container mx-auto py-8 text-center">
        <Loader2 className="h-12 w-12 animate-spin text-primary mx-auto" />
        <p className="mt-4 text-muted-foreground">Loading impact data...</p>
      </div>
    );
  }

  const progressPercentage = (weeklyUsage / averageWeeklyUsageLiters) * 100;


  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-8 text-center font-headline text-primary-foreground bg-primary p-4 rounded-lg shadow-md">
        Your Impact Tracker
      </h1>

      <Alert className="mb-6 border-accent bg-accent/10">
        <Zap className="h-5 w-5 text-accent" />
        <AlertTitle className="font-headline text-accent">Make a Difference!</AlertTitle>
        <AlertDescription className="text-accent-foreground/80">
          See how your water-saving efforts contribute to a healthier planet and save you money.
        </AlertDescription>
      </Alert>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        <ImpactStatCard title="Water Saved This Week" value={waterSaved.toFixed(1)} unit="Liters" icon={Droplet} colorClass="text-blue-500" description={`Compared to average of ${averageWeeklyUsageLiters} L`} />
        <ImpactStatCard title="Money Saved This Week" value={moneySaved.toFixed(2)} unit="AED" icon={CircleDollarSign} colorClass="text-green-500" />
        <ImpactStatCard title="Trees Watered Equivalent" value={treesWatered} unit="Trees" icon={TreePine} colorClass="text-emerald-600" />
      </div>

      <Card className="mb-8 shadow-lg">
        <CardHeader>
          <CardTitle className="font-headline">Weekly Usage vs. Average</CardTitle>
          <CardDescription>Your current weekly usage is {weeklyUsage.toFixed(1)}L. The average is {averageWeeklyUsageLiters}L.</CardDescription>
        </CardHeader>
        <CardContent>
          <Progress value={progressPercentage > 100 ? 100 : progressPercentage} className="w-full h-4" />
          <p className="text-sm text-muted-foreground mt-2">
            {progressPercentage <= 100 
              ? `You're using ${ (100 - progressPercentage).toFixed(1) }% less than average!` 
              : `You're using ${ (progressPercentage - 100).toFixed(1) }% more than average.`}
          </p>
        </CardContent>
      </Card>

      <Card className="shadow-lg">
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle className="font-headline">AI Water Savings Summary</CardTitle>
            <CardDescription>Personalized insights and tips based on your progress.</CardDescription>
          </div>
          <Button onClick={fetchAiSummary} variant="outline" size="sm" disabled={isSummaryLoading}>
            {isSummaryLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <RefreshCw className="h-4 w-4" />}
            <span className="ml-2 hidden sm:inline">Refresh Summary</span>
          </Button>
        </CardHeader>
        <CardContent>
          {isSummaryLoading && !aiSummary ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
              <p className="ml-3 text-muted-foreground">Generating your personalized summary...</p>
            </div>
          ) : aiSummary ? (
            <div className="space-y-4">
              <div>
                <h3 className="font-semibold text-lg text-primary">Summary:</h3>
                <p className="text-foreground/90">{aiSummary.summary}</p>
              </div>
              <div>
                <h3 className="font-semibold text-lg text-primary">Suggestions:</h3>
                <ul className="list-disc list-inside space-y-1 text-foreground/90">
                  {aiSummary.suggestions.map((suggestion, index) => (
                    <li key={index}>{suggestion}</li>
                  ))}
                </ul>
              </div>
            </div>
          ) : (
            <p className="text-muted-foreground">Click "Refresh Summary" to get your personalized insights.</p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
