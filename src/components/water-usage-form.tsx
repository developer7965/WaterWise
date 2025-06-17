
"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Pipette, ShowerHead, WashingMachine, Droplet, CalendarIcon } from "lucide-react";
import type { WaterUsageLog } from "@/lib/data";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import { Calendar } from "./ui/calendar";
import { format } from "date-fns";
import { cn } from "@/lib/utils";

const waterUsageFormSchema = z.object({
  date: z.date({
    required_error: "A date for the usage log is required.",
  }),
  source: z.enum(["Shower", "Laundry", "Tap", "Dishwasher", "Toilet", "Outdoor", "Other"], {
    required_error: "Please select a water source.",
  }),
  liters: z.coerce.number().min(0.1, "Liters must be a positive number."),
  durationMinutes: z.coerce.number().optional(),
  notes: z.string().optional(),
});

type WaterUsageFormValues = z.infer<typeof waterUsageFormSchema>;

interface WaterUsageFormProps {
  onSubmit: (data: WaterUsageLog) => void;
}

const waterSourceOptions = [
  { value: "Shower", label: "Shower", icon: ShowerHead },
  { value: "Laundry", label: "Laundry", icon: WashingMachine },
  { value: "Tap", label: "Tap / Faucet", icon: Pipette },
  { value: "Dishwasher", label: "Dishwasher", icon: Droplet },
  { value: "Toilet", label: "Toilet", icon: Droplet },
  { value: "Outdoor", label: "Outdoor (e.g. watering plants)", icon: Droplet },
  { value: "Other", label: "Other", icon: Droplet },
];

export function WaterUsageForm({ onSubmit }: WaterUsageFormProps) {
  const form = useForm<WaterUsageFormValues>({
    resolver: zodResolver(waterUsageFormSchema),
    defaultValues: {
      date: new Date(),
      liters: 0,
      notes: "",
    },
  });

  function handleSubmit(data: WaterUsageFormValues) {
    const newLog: WaterUsageLog = {
      id: crypto.randomUUID(),
      date: data.date.toISOString(),
      source: data.source,
      liters: data.liters,
      durationMinutes: data.durationMinutes,
      notes: data.notes,
    };
    onSubmit(newLog);
    form.reset({date: new Date(), liters: 0, notes: ""}); // Reset form with current date
  }

  return (
    <Card className="w-full max-w-lg shadow-lg">
      <CardHeader>
        <CardTitle className="font-headline text-2xl">Log Water Usage</CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="date"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>Date</FormLabel>
                  <Popover>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant={"outline"}
                          className={cn(
                            "w-full pl-3 text-left font-normal",
                            !field.value && "text-muted-foreground"
                          )}
                        >
                          {field.value ? (
                            format(field.value, "PPP")
                          ) : (
                            <span>Pick a date</span>
                          )}
                          <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={field.value}
                        onSelect={field.onChange}
                        disabled={(date) =>
                          date > new Date() || date < new Date("1900-01-01")
                        }
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="source"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Water Source</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a water source" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {waterSourceOptions.map((option) => (
                        <SelectItem key={option.value} value={option.value}>
                          <div className="flex items-center">
                            <option.icon className="mr-2 h-4 w-4" />
                            {option.label}
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="liters"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Liters Used</FormLabel>
                  <FormControl>
                    <Input type="number" placeholder="e.g., 50" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="durationMinutes"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Duration (Minutes, optional)</FormLabel>
                  <FormControl>
                    <Input type="number" placeholder="e.g., 5 for a shower" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="notes"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Notes (Optional)</FormLabel>
                  <FormControl>
                    <Textarea placeholder="Any additional details..." {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" className="w-full bg-accent text-accent-foreground hover:bg-accent/90">
              Log Usage
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
