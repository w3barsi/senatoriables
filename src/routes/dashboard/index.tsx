import { useQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import authClient from "~/lib/auth-client";

export const Route = createFileRoute("/dashboard/")({
  component: DashboardIndex,
});

async function getUsers() {
  return await authClient.admin.listUsers({ query: { limit: 10 } });
}

function DashboardIndex() {
  const { data } = useQuery({ queryKey: ["users"], queryFn: getUsers });
  console.log(data);
  return (
    <div className="flex flex-col gap-1">
      Dashboard index page
      <pre className="bg-card text-card-foreground rounded-md border p-1">
        routes/dashboard/index.tsx
      </pre>
    </div>
  );
}
