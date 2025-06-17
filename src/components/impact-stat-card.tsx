"use client";

import type { LucideIcon } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface ImpactStatCardProps {
  title: string;
  value: string | number;
  unit?: string;
  icon: LucideIcon;
  colorClass?: string; // e.g. "text-blue-500"
  description?: string;
}

export function ImpactStatCard({ title, value, unit, icon: Icon, colorClass = "text-primary", description }: ImpactStatCardProps) {
  return (
    <Card className="shadow-md hover:shadow-lg transition-shadow duration-300 bg-card">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium font-headline text-muted-foreground">{title}</CardTitle>
        <Icon className={`h-6 w-6 ${colorClass}`} />
      </CardHeader>
      <CardContent>
        <div className={`text-3xl font-bold ${colorClass}`}>
          {value}
          {unit && <span className="text-xl font-medium"> {unit}</span>}
        </div>
        {description && <p className="text-xs text-muted-foreground pt-1">{description}</p>}
      </CardContent>
    </Card>
  );
}
