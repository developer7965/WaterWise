
"use client";

import React, { useState, useEffect, useRef } from 'react'; 
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Droplet, Trophy, BarChart3, UserCircle, Mail, Loader2, Pencil, Sparkles, HelpCircle, Sun } from "lucide-react"; // Added HelpCircle, Sun
import { 
  sampleUserProfile, 
  type Challenge as ChallengeType, 
  allAchievementBadges, 
  type AchievementBadgeDefinition,
  type WaterUsageLog,
  averageWeeklyUsageLiters // Import averageWeeklyUsageLiters
} from "@/lib/data"; 
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/hooks/use-auth';
import { useRouter } from 'next/navigation';
import { storage, auth } from '@/lib/firebase';
import { ref as storageRef, uploadBytes, getDownloadURL } from "firebase/storage";
import { updateProfile } from 'firebase/auth';
import { useToast } from '@/hooks/use-toast';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

interface ChallengeWithStatus extends ChallengeType {
  status: 'todo' | 'inprogress' | 'completed';
}

interface ProfilePageStats {
  uid?: string;
  name?: string | null;
  email?: string | null;
  photoURL?: string | null;
  waterSavedThisWeekLiters: number; // Renamed for clarity
  moneySavedThisWeek: number;     // Renamed for clarity
  challengesCompleted: number;
  currentStreakDays: number;
  totalPoints: number;
  aiChallengesCompleted: number;
  easyChallengesCompleted: number;
  mediumChallengesCompleted: number;
  hardChallengesCompleted: number;
  logsCount: number;
}

const MONEY_SAVED_PER_LITER = 0.02; // Define locally, consistent with Impact page

export default function ProfilePage() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const { toast } = useToast();
  
  const [profileStats, setProfileStats] = useState<ProfilePageStats | null>(null);
  const [currentAvatarUrl, setCurrentAvatarUrl] = useState<string | null>(null);
  
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    if (!authLoading && !user && isClient) {
      router.push('/auth');
    }
  }, [user, authLoading, router, isClient]);

  useEffect(() => {
    if (user && isClient) {
      setCurrentAvatarUrl(user.photoURL);

      let localCompletedChallenges = 0;
      let localTotalPoints = 0;
      let localAiChallengesCompleted = 0;
      let localEasyChallengesCompleted = 0;
      let localMediumChallengesCompleted = 0;
      let localHardChallengesCompleted = 0;
      let localLogsCount = 0;
      let localWaterSavedThisWeek = 0;
      let localMoneySavedThisWeek = 0;

      try {
        const storedChallengesStr = localStorage.getItem("aquaChatChallenges");
        if (storedChallengesStr) {
          const storedChallenges: ChallengeWithStatus[] = JSON.parse(storedChallengesStr);
          const completed = storedChallenges.filter(c => c.status === 'completed');
          localCompletedChallenges = completed.length;
          localTotalPoints = completed.reduce((sum, c) => sum + c.points, 0);
          localAiChallengesCompleted = completed.filter(c => c.id.startsWith('ai-')).length;
          localEasyChallengesCompleted = completed.filter(c => c.difficulty === 'Easy').length;
          localMediumChallengesCompleted = completed.filter(c => c.difficulty === 'Medium').length;
          localHardChallengesCompleted = completed.filter(c => c.difficulty === 'Hard').length;
        }

        const storedLogsStr = localStorage.getItem("aquaChatUsageLogs");
        if (storedLogsStr) {
          const allLogs: WaterUsageLog[] = JSON.parse(storedLogsStr);
          localLogsCount = allLogs.length;

          const oneWeekAgo = new Date();
          oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
          const currentWeekLogs = allLogs.filter(log => new Date(log.date) >= oneWeekAgo);
          const currentWeeklyTotal = currentWeekLogs.reduce((sum, log) => sum + log.liters, 0);
          
          const saved = averageWeeklyUsageLiters - currentWeeklyTotal;
          localWaterSavedThisWeek = saved > 0 ? saved : 0;
          localMoneySavedThisWeek = saved > 0 ? saved * MONEY_SAVED_PER_LITER : 0;
        }
      } catch (e) {
        console.error("Failed to parse data from localStorage for profile stats", e);
      }
      
      setProfileStats({
        uid: user.uid,
        name: user.displayName,
        email: user.email,
        photoURL: user.photoURL,
        waterSavedThisWeekLiters: localWaterSavedThisWeek, 
        moneySavedThisWeek: localMoneySavedThisWeek, 
        challengesCompleted: localCompletedChallenges,
        currentStreakDays: sampleUserProfile.currentStreakDays, // This remains a placeholder
        totalPoints: localTotalPoints,
        aiChallengesCompleted: localAiChallengesCompleted,
        easyChallengesCompleted: localEasyChallengesCompleted,
        mediumChallengesCompleted: localMediumChallengesCompleted,
        hardChallengesCompleted: localHardChallengesCompleted,
        logsCount: localLogsCount,
      });
    }
  }, [user, isClient, authLoading]);

  const handleProfilePictureChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    if (!event.target.files || event.target.files.length === 0) {
      return;
    }
    if (!user || !auth.currentUser) { 
        toast({ title: "Error", description: "You must be logged in to change your profile picture.", variant: "destructive" });
        return;
    }

    const file = event.target.files[0];
    setIsUploading(true);

    try {
      const imageRef = storageRef(storage, `profile-pictures/${user.uid}/${file.name}`);
      await uploadBytes(imageRef, file);
      const downloadURL = await getDownloadURL(imageRef);
      
      await updateProfile(auth.currentUser, { photoURL: downloadURL });
      setCurrentAvatarUrl(downloadURL); 
      setProfileStats(prev => prev ? {...prev, photoURL: downloadURL} : null);
      
      toast({ title: "Success!", description: "Profile picture updated." });
    } catch (error: any) {
      console.error("Error uploading profile picture:", error);
      toast({ title: "Upload Failed", description: error.message || "Could not update profile picture.", variant: "destructive" });
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = ""; 
      }
    }
  };

  if (authLoading || !isClient || !user || !profileStats) {
    return (
      <div className="container mx-auto py-8 text-center">
        <Loader2 className="h-12 w-12 animate-spin text-primary mx-auto" />
        <p className="mt-4 text-muted-foreground">Loading profile...</p>
      </div>
    );
  }
  
  const safeProfileStats = profileStats;


  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-8 text-center font-headline text-primary-foreground bg-primary p-4 rounded-lg shadow-md">
        My Profile
      </h1>

      <Card className="w-full max-w-3xl mx-auto shadow-xl mb-8 bg-card">
        <CardHeader className="flex flex-col sm:flex-row items-center gap-6 text-center sm:text-left">
          <div className="relative">
            <Avatar className="h-24 w-24 border-4 border-primary">
              <AvatarImage src={currentAvatarUrl || undefined} alt={safeProfileStats.name || "User avatar"} />
              <AvatarFallback className="text-3xl bg-muted">
                {safeProfileStats.name ? safeProfileStats.name.substring(0, 1).toUpperCase() : <UserCircle className="h-12 w-12" />}
              </AvatarFallback>
            </Avatar>
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleProfilePictureChange}
              accept="image/*"
              className="hidden"
              disabled={isUploading}
            />
            <Button
              variant="outline"
              size="icon"
              className="absolute bottom-0 right-0 rounded-full h-8 w-8 bg-card hover:bg-muted border-primary/50"
              onClick={() => fileInputRef.current?.click()}
              disabled={isUploading}
              aria-label="Edit profile picture"
            >
              {isUploading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Pencil className="h-4 w-4 text-primary" />}
            </Button>
          </div>
          <div>
            <CardTitle className="text-3xl font-headline text-primary">{safeProfileStats.name || "Aqua User"}</CardTitle>
            <CardDescription className="text-lg text-muted-foreground flex items-center">
                <Mail className="mr-2 h-5 w-5 text-muted-foreground/70"/> {safeProfileStats.email || "No email provided"}
            </CardDescription>
          </div>
        </CardHeader>
        <CardContent className="grid grid-cols-2 gap-6 pt-6">
            <div className="flex items-center gap-3 p-4 bg-secondary/50 rounded-lg">
              <Droplet className="h-8 w-8 text-blue-500" />
              <div>
                <p className="text-sm text-muted-foreground">Water Saved (This Week)</p>
                <p className="text-xl font-semibold">{safeProfileStats.waterSavedThisWeekLiters.toFixed(1)} L</p>
              </div>
            </div>
            <div className="flex items-center gap-3 p-4 bg-secondary/50 rounded-lg">
              <BarChart3 className="h-8 w-8 text-green-500" />
              <div>
                <p className="text-sm text-muted-foreground">Money Saved (This Week)</p>
                <p className="text-xl font-semibold">{safeProfileStats.moneySavedThisWeek.toFixed(2)} AED</p>
              </div>
            </div>
            <div className="flex items-center gap-3 p-4 bg-secondary/50 rounded-lg">
              <Trophy className="h-8 w-8 text-amber-500" />
              <div>
                <p className="text-sm text-muted-foreground">Challenges Completed</p>
                <p className="text-xl font-semibold">{safeProfileStats.challengesCompleted}</p>
              </div>
            </div>
            <div className="flex items-center gap-3 p-4 bg-secondary/50 rounded-lg">
              <Sparkles className="h-8 w-8 text-red-500" />
              <div>
                <p className="text-sm text-muted-foreground">Points Earned</p>
                <p className="text-xl font-semibold">{safeProfileStats.totalPoints}</p>
              </div>
            </div>
        </CardContent>
      </Card>
      
      <Card className="w-full max-w-3xl mx-auto shadow-xl bg-card">
        <CardHeader>
          <CardTitle className="font-headline text-xl">Achievements & Badges</CardTitle>
          <CardDescription>Your milestones in water conservation. Hover over a badge to learn more!</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-wrap gap-4 justify-center">
          <TooltipProvider delayDuration={100}>
            {allAchievementBadges.map((badgeDef: AchievementBadgeDefinition) => {
              const isAchieved = badgeDef.criteria(safeProfileStats);
              let displayName = badgeDef.name;
              let displayDescription = badgeDef.description;
              let DisplayIcon = badgeDef.icon;
              let displayClasses = isAchieved ? badgeDef.achievedClasses : badgeDef.unachievedClasses;

              if (badgeDef.isSecret && !isAchieved) {
                displayName = badgeDef.secretName || "???";
                displayDescription = badgeDef.secretDescription || "🤫";
                DisplayIcon = badgeDef.secretIcon || HelpCircle;
              }
              
              return (
                <Tooltip key={badgeDef.id}>
                  <TooltipTrigger asChild>
                    <Badge
                      className={`text-sm px-3 py-1.5 flex items-center gap-2 transition-all duration-200 ease-in-out transform hover:scale-105 ${displayClasses}`}
                    >
                      <DisplayIcon className={`h-4 w-4 ${isAchieved || (badgeDef.isSecret && !isAchieved && DisplayIcon !== HelpCircle) ? '' : 'text-gray-500'}`} />
                      {displayName}
                    </Badge>
                  </TooltipTrigger>
                  <TooltipContent className="bg-background border-border shadow-lg rounded-md p-2 max-w-xs">
                    <p className="font-semibold text-sm text-foreground">{displayName}</p>
                    <p className="text-xs text-muted-foreground">{displayDescription}</p>
                  </TooltipContent>
                </Tooltip>
              );
            })}
          </TooltipProvider>
          {allAchievementBadges.every(b => !b.criteria(safeProfileStats)) && (
            <p className="text-muted-foreground">Complete challenges and save water to earn badges!</p>
          )}
        </CardContent>
      </Card>

    </div>
  );
}
    

    