import { useSuspenseQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { NotFound } from "~/lib/components/NotFound";
import { CardContent, LinkCard } from "~/lib/components/ui/card";
import { Separator } from "~/lib/components/ui/separator";
import { SENATOR_LIST } from "~/lib/senators-list";
import { useTRPC } from "~/lib/trpc/react";
import { cn } from "~/lib/utils";
import { Container } from "../-components/container";

export const Route = createFileRoute("/(main)/$me")({
  component: RouteComponent,
  loader: async ({ context: { queryClient, trpc }, params }) => {
    await queryClient.prefetchQuery(
      trpc.vote.getAllVotes.queryOptions({ userId: params.me }),
    );
  },
});

function RouteComponent() {
  const trpc = useTRPC();
  const params = Route.useParams();
  const { me: userId } = Route.useParams();
  const { data } = useSuspenseQuery(
    trpc.vote.getAllVotes.queryOptions({ userId: params.me }),
  );
  const yesses = data.filter((v) => v.decision === "yes");
  const nos = data.filter((v) => v.decision === "no");
  const maybes = data.filter((v) => v.decision === "maybe");

  console.log("rerender");

  return (
    <Container className="flex flex-col gap-4 pt-4">
      <h3 className="text-xl font-bold">Will Vote</h3>
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
              className={cn("w-full border-green-800 py-4")}
              key={sen.id}
            >
              <CardContent className="flex items-center gap-4">
                <img src={sen.image} alt="" className="h-12 w-12 rounded-full" />

                <p className="font-semibold">{sen.id}</p>
                <p>{sen.name}</p>
              </CardContent>
            </LinkCard>
          );
        })}
      </div>

      <Separator />

      <h3 className="text-xl font-bold">Might Vote</h3>
      <div className="flex w-full flex-col gap-2 md:grid md:grid-cols-2">
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
              className={cn("w-full border-orange-300 py-4")}
              key={sen.id}
            >
              <CardContent className="flex items-center gap-4">
                <img src={sen.image} alt="" className="h-12 w-12 rounded-full" />
                <p>{sen.name}</p>
              </CardContent>
            </LinkCard>
          );
        })}
      </div>

      <Separator />
      <h3 className="text-xl font-bold">Wont Vote</h3>
      <div className="flex w-full flex-col gap-2 md:grid md:grid-cols-2">
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
              className={cn("w-full border-red-800 py-4")}
              key={sen.id}
            >
              <CardContent className="flex items-center gap-4">
                <img src={sen.image} alt="" className="h-12 w-12 rounded-full" />
                <p>{sen.name}</p>
              </CardContent>
            </LinkCard>
          );
        })}
      </div>
    </Container>
  );
}
