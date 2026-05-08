import { SpendForm } from "@/components/spend-form";

export default function Home() {
  return (
    <main className="min-h-screen bg-background py-12 px-4">
      <div className="max-w-4xl mx-auto space-y-8">
        <div className="text-center space-y-4">
          <h1 className="text-5xl font-extrabold text-primary">
            AI Spend Audit
          </h1>
          <p className="text-xl text-muted-foreground">
            Find out how much you could save on AI tools in 2 minutes.
          </p>
        </div>
        <SpendForm />
      </div>
    </main>
  );
}
