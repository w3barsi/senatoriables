import { createFileRoute, Link } from "@tanstack/react-router";
import { Button } from "~/lib/components/ui/button";

export const Route = createFileRoute("/")({
  component: Home,
  loader: ({ context }) => {
    return { user: context.user };
  },
});

function Home() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-4 text-center">
      <div className="max-w-3xl space-y-8">
        <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl md:text-6xl">
          Senatoriables
        </h1>

        <div className="space-y-4">
          <p className="text-muted-foreground text-xl font-medium sm:text-2xl">
            Help each other figure out which 2025 Senator to vote for!
          </p>
          <p className="text-muted-foreground text-xl font-medium sm:text-2xl">
            Create groups to share with friends!
          </p>
        </div>

        <Button asChild size="lg" className="px-8 py-6 text-lg">
          <Link to="/getStarted">Get Started</Link>
        </Button>
      </div>
    </div>
  );
}
