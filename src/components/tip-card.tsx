"use client";

import type { Tip } from "@/lib/data";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface TipCardProps {
  tip: Tip;
}

export function TipCard({ tip }: TipCardProps) {
  const Icon = tip.icon;
  return (
    <Card className="w-full shadow-md hover:shadow-lg transition-shadow duration-300 bg-card">
      <CardHeader className="flex flex-row items-center gap-4 pb-2">
        <Icon className="h-10 w-10 text-primary" />
        <div>
          <CardTitle className="font-headline text-lg">{tip.title}</CardTitle>
          <Badge variant="outline" className="mt-1 border-accent text-accent bg-accent/10">{tip.category}</Badge>
        </div>
      </CardHeader>
      <CardContent>
        <CardDescription className="text-sm text-foreground/80">{tip.description}</CardDescription>
      </CardContent>
    </Card>
  );
}
