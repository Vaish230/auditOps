/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useLocalStorageForm } from "@/hooks/useLocalStorageForm";
import { tools } from "@/lib/pricing";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { useRouter } from "next/navigation";
import { useState } from "react";

export function SpendForm() {
  const form = useLocalStorageForm();
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function onSubmit(values: any) {
    // Only send enabled tools
    const enabledTools = values.tools
      .filter((t: any) => t.enabled)
      .map((t: any) => ({
        tool: t.tool,
        plan: t.plan,
        monthlySpend: t.monthlySpend,
        seats: t.seats,
      }));
    const payload = { ...values, tools: enabledTools };
    setLoading(true);
    try {
      const res = await fetch("/api/audit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) throw new Error("Audit failed");
      const { id } = await res.json();
      router.push(`/audit/${id}`);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  const allTools = Object.values(tools);

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <div className="grid gap-6 md:grid-cols-3 items-start">
          {allTools.map((tool, index) => {
            const isEnabled = form.watch(`tools.${index}.enabled`);
            return (
              <Card
                key={index}
                className={isEnabled ? "border-primary/50" : "border-border"}
              >
                <CardHeader>
                  <CardTitle className="flex justify-between items-center">
                    <span>{tool.name}</span>
                    {/* Toggle enabled */}
                    <FormField
                      control={form.control}
                      name={`tools.${index}.enabled`}
                      render={({ field }) => (
                        <input
                          type="checkbox"
                          checked={field.value || false}
                          onChange={(e) => field.onChange(e.target.checked)}
                          className="h-4 w-4 accent-primary"
                        />
                      )}
                    />
                  </CardTitle>
                </CardHeader>

                <CardContent className="space-y-4">
                  <FormField
                    control={form.control}
                    name={`tools.${index}.plan`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Plan</FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          value={field.value || ""}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select plan" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {tool.plans.map((plan) => (
                              <SelectItem key={plan.name} value={plan.name}>
                                {plan.name} — ${plan.monthlyPricePerSeat}/seat
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
                    name={`tools.${index}.monthlySpend`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Monthly Spend ($)</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            min={0}
                            {...field}
                            onChange={(e) =>
                              field.onChange(parseFloat(e.target.value) || 0)
                            }
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name={`tools.${index}.seats`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Seats</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            min={1}
                            {...field}
                            onChange={(e) =>
                              field.onChange(parseInt(e.target.value) || 1)
                            }
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Team size & use case */}
        <div className="grid gap-4 md:grid-cols-2">
          <FormField
            control={form.control}
            name="teamSize"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Team Size</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    min={1}
                    {...field}
                    onChange={(e) =>
                      field.onChange(parseInt(e.target.value) || 1)
                    }
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="useCase"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Primary Use Case</FormLabel>
                <Select onValueChange={field.onChange} value={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {["coding", "writing", "data", "research", "mixed"].map(
                      (uc) => (
                        <SelectItem key={uc} value={uc}>
                          {uc}
                        </SelectItem>
                      ),
                    )}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <Button
          type="submit"
          size="lg"
          className="w-full bg-primary text-primary-foreground"
          disabled={loading}
        >
          {loading ? "Analyzing..." : "Run Free Audit"}
        </Button>
      </form>
    </Form>
  );
}
