"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function LeadCaptureModal({
  auditId,
  onClose,
}: {
  auditId: string;
  onClose: () => void;
}) {
  const [email, setEmail] = useState("");
  const [company, setCompany] = useState("");
  const [role, setRole] = useState("");
  const [teamSize, setTeamSize] = useState("");
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch("/api/lead", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          audit_id: auditId,
          email,
          company: company || null,
          role: role || null,
          team_size: teamSize ? parseInt(teamSize) : null,
        }),
      });
      if (!res.ok) throw new Error("Failed");
      setDone(true);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  if (done) {
    return (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
        <Card className="max-w-md w-full">
          <CardHeader>
            <CardTitle>Thanks! 🎉</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              We'll send you the full report and reach out if there are big
              savings opportunities.
            </p>
            <Button onClick={onClose} className="mt-4 w-full">
              Close
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <Card className="max-w-md w-full">
        <CardHeader>
          <CardTitle>Get Your Full Report</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              type="email"
              placeholder="you@company.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <Input
              placeholder="Company name (optional)"
              value={company}
              onChange={(e) => setCompany(e.target.value)}
            />
            <Input
              placeholder="Your role (optional)"
              value={role}
              onChange={(e) => setRole(e.target.value)}
            />
            <Input
              type="number"
              placeholder="Team size (optional)"
              value={teamSize}
              onChange={(e) => setTeamSize(e.target.value)}
            />
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? "Sending..." : "Send My Report"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
