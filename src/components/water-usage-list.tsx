"use client";

import type { WaterUsageLog } from "@/lib/data";
import { waterSourcesIcons } from "@/lib/data";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { format } from "date-fns";
import { Button } from "./ui/button";
import { Trash2 } from "lucide-react";

interface WaterUsageListProps {
  usageLogs: WaterUsageLog[];
  onDeleteLog: (logId: string) => void;
}

export function WaterUsageList({ usageLogs, onDeleteLog }: WaterUsageListProps) {
  if (usageLogs.length === 0) {
    return (
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="font-headline text-xl">Recent Usage</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">No water usage logged yet. Add some entries using the form!</p>
        </CardContent>
      </Card>
    );
  }

  const sortedLogs = [...usageLogs].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  return (
    <Card className="shadow-lg">
      <CardHeader>
        <CardTitle className="font-headline text-xl">Recent Water Usage</CardTitle>
        <CardDescription>Your latest logged water activities.</CardDescription>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[300px] pr-4">
          <ul className="space-y-3">
            {sortedLogs.map((log) => {
              const Icon = waterSourcesIcons[log.source] || waterSourcesIcons.Other;
              return (
                <li key={log.id} className="flex items-center justify-between rounded-md border p-3 hover:bg-secondary/50 transition-colors">
                  <div className="flex items-center gap-3">
                    <Icon className="h-6 w-6 text-primary" />
                    <div>
                      <p className="font-semibold">{log.source} - {log.liters} L</p>
                      <p className="text-sm text-muted-foreground">
                        {format(new Date(log.date), "PPP")}
                        {log.durationMinutes && ` (${log.durationMinutes} min)`}
                      </p>
                      {log.notes && <p className="text-xs text-muted-foreground italic mt-1">{log.notes}</p>}
                    </div>
                  </div>
                  <Button variant="ghost" size="icon" onClick={() => onDeleteLog(log.id)} aria-label="Delete log entry">
                    <Trash2 className="h-4 w-4 text-destructive/70 hover:text-destructive" />
                  </Button>
                </li>
              );
            })}
          </ul>
        </ScrollArea>
      </CardContent>
    </Card>
  );
}
