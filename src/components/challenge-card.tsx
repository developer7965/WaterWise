
"use client";

import type { Challenge } from "@/lib/data";
import { challengeIconsMap } from "@/lib/data";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, Circle, Zap } from "lucide-react";

export type ChallengeStatus = 'todo' | 'inprogress' | 'completed';

interface ChallengeCardProps {
  challenge: Challenge;
  status: ChallengeStatus;
  onStatusChange: (challengeId: string, newStatus: ChallengeStatus) => void;
}

const statusConfig = {
  todo: { label: "Start Challenge", icon: Circle, next: 'inprogress', buttonVariant: 'default' as const, buttonClass: "bg-primary text-primary-foreground hover:bg-primary/90" },
  inprogress: { label: "Mark as Complete", icon: Zap, next: 'completed', buttonVariant: 'outline' as const, buttonClass: "border-accent text-accent hover:bg-accent/10" },
  completed: { label: "Completed!", icon: CheckCircle, next: null, buttonVariant: 'ghost' as const, buttonClass: "text-green-600 hover:bg-green-500/10" },
};


export function ChallengeCard({ challenge, status, onStatusChange }: ChallengeCardProps) {
  const IconComponent = challengeIconsMap[challenge.iconName] || challengeIconsMap.Trophy; // Fallback to Trophy
  const currentStatusConfig = statusConfig[status];
  const StatusIcon = currentStatusConfig.icon;

  const handleButtonClick = () => {
    if (currentStatusConfig.next) {
      onStatusChange(challenge.id, currentStatusConfig.next as ChallengeStatus);
    }
  };

  return (
    <Card className={`w-full shadow-md hover:shadow-lg transition-shadow duration-300 ${status === 'completed' ? 'bg-green-500/5 border-green-500/30' : 'bg-card'}`}>
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <IconComponent className={`h-10 w-10 ${status === 'completed' ? 'text-green-600' : 'text-primary'}`} />
            <CardTitle className="font-headline text-lg">{challenge.title}</CardTitle>
          </div>
          <Badge variant={status === 'completed' ? 'default' : 'secondary'} className={`${status === 'completed' ? 'bg-green-600 text-white' : ''}`}>
            {challenge.difficulty}
          </Badge>
        </div>
        <CardDescription className="pt-1 text-sm text-foreground/80">{challenge.description}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-2">
        <p className="text-xs text-muted-foreground">Duration: {challenge.duration}</p>
        <p className="text-xs text-muted-foreground">Points: <span className="font-semibold text-accent">{challenge.points}</span></p>
      </CardContent>
      <CardFooter>
        <Button 
          onClick={handleButtonClick} 
          disabled={status === 'completed'}
          className={`w-full ${currentStatusConfig.buttonClass}`}
          variant={currentStatusConfig.buttonVariant}
        >
          <StatusIcon className="mr-2 h-4 w-4" />
          {currentStatusConfig.label}
        </Button>
      </CardFooter>
    </Card>
  );
}
