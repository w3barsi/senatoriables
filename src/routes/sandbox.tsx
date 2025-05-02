import { useQuery, useQueryClient } from "@tanstack/react-query";
import { createFileRoute, redirect } from "@tanstack/react-router";
import { Button } from "~/lib/components/ui/button";
import { useTRPC } from "~/lib/trpc/react";

export const Route = createFileRoute("/sandbox")({
  component: RouteComponent,
  beforeLoad: async () => {
    if (import.meta.env.MODE !== "development") {
      throw redirect({ to: "/" });
    }
  },
  loader: async ({ context }) => {
    context.queryClient.ensureQueryData(context.trpc.test.time.queryOptions());
    return {
      queryClient: context.queryClient,
    };
  },
});

function RouteComponent() {
  const trpc = useTRPC();
  const queryClient = useQueryClient();

  const query = useQuery(trpc.test.time.queryOptions());

  //t tesa
  return (
    <div className="flex w-full flex-col items-center justify-center gap-2">
      {query.data}
      <Button
        onClick={async () => {
          await queryClient.invalidateQueries(trpc.test.time.queryFilter());
        }}
      >
        Invalidate
      </Button>
    </div>
  );
}
