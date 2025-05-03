import { useSuspenseQuery } from "@tanstack/react-query";
import { createFileRoute, redirect } from "@tanstack/react-router";
import { Suspense } from "react";
import { NotFound } from "~/lib/components/NotFound";
import { Card, CardContent } from "~/lib/components/ui/card";
import { SENATOR_LIST } from "~/lib/constants/senators-list";
import { useTRPC } from "~/lib/trpc/react";
import { Senator } from "~/types/senators";
import { Container } from "../-components/container";
import { VoteButtons } from "../-components/vote-buttons";
import { SenatorCard, SenatorCardAccordion } from "./-components/senator-cards";

// type ReasonType = "positive" | "negative" | "uncertain";
// type Reason = {
//   id: string;
//   text: string;
//   source: string;
//   type: ReasonType;
// };
//
export const Route = createFileRoute("/(main)/$me_/$senatorLinkName")({
  component: RouteComponent,
  beforeLoad: ({ context }) => {
    if (!context.user) {
      throw redirect({ to: "/signin" });
    }
  },
  loader: async ({ context, params }) => {
    await context.queryClient.ensureQueryData(
      context.trpc.vote.getSenatorVote.queryOptions({
        senatorId: params.senatorLinkName,
      }),
    );
  },
});

function RouteComponent() {
  const { senatorLinkName } = Route.useParams();
  const sen = SENATOR_LIST.find((s) => s.linkName === senatorLinkName);

  if (!sen) {
    return <NotFound />;
  }

  return (
    <Container className="flex flex-col gap-4 pt-4">
      <SenatorCard sen={sen} />
      <SenatorCardAccordion sen={sen} />
      <VoteCard sen={sen} />
    </Container>
  );
}

function VoteCard({ sen }: { sen: Senator }) {
  return (
    <Card className="w-full">
      <CardContent className="">
        <Suspense fallback={<div>Loading...</div>}>
          <VoteCardContent />
        </Suspense>
      </CardContent>
    </Card>
  );
}

function VoteCardContent() {
  const { senatorLinkName } = Route.useParams();
  const trpc = useTRPC();
  const { data } = useSuspenseQuery(
    trpc.vote.getSenatorVote.queryOptions({ senatorId: senatorLinkName }),
  );

  return (
    <>
      <h3 className="mb-6 text-center text-xl font-medium">How would you vote?</h3>
      <VoteButtons vote={data?.decision} senatorLinkName={senatorLinkName} />
    </>
  );
}
