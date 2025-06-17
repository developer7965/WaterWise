
"use client";

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { waterUsageFacts, challengeIconsMap } from "@/lib/data"; // Re-using challengeIconsMap for convenience
import { Lightbulb } from "lucide-react"; // Using Lightbulb for the alert

export default function InfoPage() {
  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-8 text-center font-headline text-primary-foreground bg-primary p-4 rounded-lg shadow-md flex items-center justify-center">
        Water Usage Facts
      </h1>

      <Alert className="mb-8 border-accent bg-accent/10">
        <Lightbulb className="h-5 w-5 text-accent" />
        <AlertTitle className="font-headline text-accent">Did You Know?</AlertTitle>
        <AlertDescription className="text-accent-foreground/80">
          Understanding common water usage can help you make impactful changes and conserve this precious resource.
        </AlertDescription>
      </Alert>

      {waterUsageFacts.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {waterUsageFacts.map((fact) => {
            const IconComponent = challengeIconsMap[fact.iconName] || Lightbulb; // Fallback to Lightbulb
            return (
              <Card key={fact.id} className="shadow-md hover:shadow-lg transition-shadow duration-300 bg-card flex flex-col">
                <CardHeader className="flex flex-row items-center gap-4 pb-3">
                  <IconComponent className="h-10 w-10 text-primary flex-shrink-0" />
                  <CardTitle className="font-headline text-lg">{fact.title}</CardTitle>
                </CardHeader>
                <CardContent className="flex-grow">
                  <CardDescription className="text-sm text-foreground/80">{fact.description}</CardDescription>
                </CardContent>
              </Card>
            );
          })}
        </div>
      ) : (
        <p className="text-center text-muted-foreground mt-10">No information available at the moment.</p>
      )}
    </div>
  );
}
