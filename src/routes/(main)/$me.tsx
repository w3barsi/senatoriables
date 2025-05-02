import { useQuery } from "@tanstack/react-query";
import { createFileRoute, redirect } from "@tanstack/react-router";
import { NotFound } from "~/lib/components/NotFound";
import { Card, CardContent } from "~/lib/components/ui/card";
import { SENATOR_LIST } from "~/lib/constants/senators-list";
import { useTRPC } from "~/lib/trpc/react";
import { cn } from "~/lib/utils";
import { Container } from "../-components/container";

export const Route = createFileRoute("/(main)/$me")({
  component: RouteComponent,
  beforeLoad: ({ context }) => {
    if (!context.user) {
      throw redirect({ to: "/signin" });
    }
  },
  loader: async ({ context }) => {
    await context.queryClient.ensureQueryData(
      context.trpc.vote.getAllVotes.queryOptions(),
    );
  },
});

function RouteComponent() {
  const trpc = useTRPC();
  const { data } = useQuery(trpc.vote.getAllVotes.queryOptions());
  const yesses = data?.filter((v) => v.decision === "yes");
  const nos = data?.filter((v) => v.decision === "no");
  const maybes = data?.filter((v) => v.decision === "maybe");

  return (
    <Container className="pt-4">
      <div className="flex w-full flex-col gap-2 md:grid md:grid-cols-2">
        {yesses?.map((vote, idx) => {
          const sen = SENATOR_LIST.find((s) => s.linkName === vote.senatorId);
          if (!sen) {
            return <NotFound key={idx} />;
          }
          return (
            <Card className={cn("w-full border-green-800")} key={sen.id}>
              <CardContent>{sen.name}</CardContent>
            </Card>
          );
        })}
        {nos?.map((vote, idx) => {
          const sen = SENATOR_LIST.find((s) => s.linkName === vote.senatorId);
          if (!sen) {
            return <NotFound key={idx} />;
          }
          return (
            <Card className={cn("w-full border-red-800")} key={sen.id}>
              <CardContent>{sen.name}</CardContent>
            </Card>
          );
        })}
        {maybes?.map((vote, idx) => {
          const sen = SENATOR_LIST.find((s) => s.linkName === vote.senatorId);
          if (!sen) {
            return <NotFound key={idx} />;
          }
          return (
            <Card className={cn("w-full border-orange-300")} key={sen.id}>
              <CardContent>{sen.name}</CardContent>
            </Card>
          );
        })}
      </div>
    </Container>
  );
}
