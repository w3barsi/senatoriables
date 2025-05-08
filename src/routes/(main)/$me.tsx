import { useQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { useTRPC } from "~/lib/trpc/react";

export const Route = createFileRoute("/(main)/$me")({
  component: RouteComponent,
});

function RouteComponent() {
  const trpc = useTRPC();
  const test = useQuery(trpc.test.hello.queryOptions());
  return <div>{test.data?.greeting}</div>;
}
