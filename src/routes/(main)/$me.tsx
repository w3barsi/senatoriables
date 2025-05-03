import { useQuery } from "@tanstack/react-query";
import { createFileRoute, redirect } from "@tanstack/react-router";
import { NotFound } from "~/lib/components/NotFound";
import { CardContent, LinkCard } from "~/lib/components/ui/card";
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

    return { user: context.user };
  },
  loader: async ({ context, params }) => {
    const a = await context.queryClient.ensureQueryData(
      context.trpc.vote.getAllVotes.queryOptions({ userId: params.me }),
    );
    console.log(a);

    return { userId: context.user.shortId };
  },
});

function RouteComponent() {
  const params = Route.useParams();
  const trpc = useTRPC();
  const { userId } = Route.useLoaderData();
  const { data } = useQuery(trpc.vote.getAllVotes.queryOptions({ userId: params.me }));
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
            <LinkCard
              linkOptions={{
                to: "/$me/$senatorLinkName",
                params: { senatorLinkName: sen.linkName, me: userId },
              }}
              className={cn("w-full border-green-800")}
              key={sen.id}
            >
              <CardContent>{sen.name}</CardContent>
            </LinkCard>
          );
        })}
        {nos?.map((vote, idx) => {
          const sen = SENATOR_LIST.find((s) => s.linkName === vote.senatorId);
          if (!sen) {
            return <NotFound key={idx} />;
          }
          return (
            <LinkCard
              linkOptions={{
                to: "/$me/$senatorLinkName",
                params: { senatorLinkName: sen.linkName, me: userId },
              }}
              className={cn("w-full border-red-800")}
              key={sen.id}
            >
              <CardContent>{sen.name}</CardContent>
            </LinkCard>
          );
        })}
        {maybes?.map((vote, idx) => {
          const sen = SENATOR_LIST.find((s) => s.linkName === vote.senatorId);
          if (!sen) {
            return <NotFound key={idx} />;
          }
          return (
            <LinkCard
              linkOptions={{
                to: "/$me/$senatorLinkName",
                params: { senatorLinkName: sen.linkName, me: userId },
              }}
              className={cn("w-full border-orange-300")}
              key={sen.id}
            >
              <CardContent>{sen.name}</CardContent>
            </LinkCard>
          );
        })}
      </div>
    </Container>
  );
}
