"use client";

import { useState, useEffect } from "react";
import { WaterUsageForm } from "@/components/water-usage-form";
import { WaterUsageList } from "@/components/water-usage-list";
import type { WaterUsageLog } from "@/lib/data";
import { initialWaterUsageData } from "@/lib/data";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Lightbulb } from "lucide-react";

// ✅ Page metadata (social preview image + SEO)
export const metadata = {
  title: "HydroTrack Dashboard",
  description: "Track and understand your daily water usage habits with AquaChat AI.",
  openGraph: {
    title: "HydroTrack Dashboard",
    description: "Track and visualise your water usage to become more eco-conscious.",
    images: [
      {
        url: "https://i.imgur.com/NS5ch0A.png",
        width: 1200,
        height: 630,
        alt: "HydroTrack Dashboard Preview"
      }
    ],
  },
};

const aggregateUsageBySource = (logs: WaterUsageLog[]) => {
  const aggregated: { [key: string]: number } = {};
  logs.forEach(log => {
    if (aggregated[log.source]) {
      aggregated[log.source] += log.liters;
    } else {
      aggregated[log.source] = log.liters;
    }
  });
  return Object.entries(aggregated).map(([name, value]) => ({ name, liters: value }));
};

export default function DashboardPage() {
  const [usageLogs, setUsageLogs] = useState<WaterUsageLog[]>([]);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
    const storedLogs = localStorage.getItem("aquaChatUsageLogs");
    if (storedLogs) {
      setUsageLogs(JSON.parse(storedLogs));
    } else {
      setUsageLogs(initialWaterUsageData);
    }
  }, []);

  useEffect(() => {
    if (isClient) {
      localStorage.setItem("aquaChatUsageLogs", JSON.stringify(usageLogs));
    }
  }, [usageLogs, isClient]);

  const handleAddLog = (newLog: WaterUsageLog) => {
    setUsageLogs(prevLogs => [...prevLogs, newLog]);
  };

  const handleDeleteLog = (logId: string) => {
    setUsageLogs(prevLogs => prevLogs.filter(log => log.id !== logId));
  };

  const chartData = isClient ? aggregateUsageBySource(usageLogs) : [];
  const totalLiters = isClient ? usageLogs.reduce((sum, log) => sum + log.liters, 0) : 0;

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-8 text-center font-headline text-primary-foreground bg-primary p-4 rounded-lg shadow-md">
        HydroTrack Dashboard
      </h1>

      <Alert className="mb-8 border-accent bg-accent/10 text-accent-foreground">
        <Lightbulb className="h-5 w-5 text-accent" />
        <AlertTitle className="font-headline text-accent">Track Your Usage!</AlertTitle>
        <AlertDescription>
          Log your daily water activities to understand your consumption patterns and find ways to save.
        </AlertDescription>
      </Alert>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-1">
          <WaterUsageForm onSubmit={handleAddLog} />
        </div>
        <div className="lg:col-span-2">
          <WaterUsageList usageLogs={usageLogs} onDeleteLog={handleDeleteLog} />
        </div>
      </div>

      {isClient && usageLogs.length > 0 && (
        <Card className="mt-8 shadow-lg">
          <CardHeader>
            <CardTitle className="font-headline text-xl">Usage Summary</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="mb-4 text-lg">
              Total water used: <span className="font-bold text-primary">{totalLiters.toFixed(1)} Litres</span>
            </p>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis dataKey="name" stroke="hsl(var(--muted-foreground))" />
                  <YAxis stroke="hsl(var(--muted-foreground))" />
                  <Tooltip
                    contentStyle={{ backgroundColor: "hsl(var(--card))", border: "1px solid hsl(var(--border))" }}
                    labelStyle={{ color: "hsl(var(--card-foreground))" }}
                  />
                  <Legend wrapperStyle={{ color: "hsl(var(--muted-foreground))" }} />
                  <Bar dataKey="liters" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}