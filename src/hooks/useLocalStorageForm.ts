"use client";
import { useEffect } from "react";
import { useForm, type UseFormReturn } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { auditInputSchema, type AuditInput } from "@/lib/engine/type";
import { tools } from "@/lib/pricing";

const STORAGE_KEY = "audit-form";

// Pre‑populate all tools with enabled false
const defaultTools = Object.keys(tools).map((slug) => ({
  tool: slug,
  enabled: false,
  plan: undefined,
  monthlySpend: 0,
  seats: 1,
}));

const defaultValues: AuditInput = {
  tools: defaultTools,
  teamSize: 1,
  useCase: "coding",
};

export function useLocalStorageForm(): UseFormReturn<AuditInput> {
  const form = useForm<AuditInput>({
    resolver: zodResolver(auditInputSchema),
    defaultValues,
  });

  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        form.reset({ ...defaultValues, ...parsed } as AuditInput);
      } catch {}
    }
  }, [form]);

  const values = form.watch();
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(values));
  }, [values]);

  return form;
}
