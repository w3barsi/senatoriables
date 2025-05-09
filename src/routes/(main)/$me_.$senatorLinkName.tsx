import { useMutation, useQueryClient, useSuspenseQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { HelpCircleIcon, ThumbsDownIcon, ThumbsUpIcon } from "lucide-react";
import { Suspense, useState } from "react";
import { useHotkeys } from "react-hotkeys-hook";
import { NotFound } from "~/lib/components/NotFound";
import { Button } from "~/lib/components/ui/button";
import { Card, CardContent } from "~/lib/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "~/lib/components/ui/dialog";
import { Input } from "~/lib/components/ui/input";
import { Label } from "~/lib/components/ui/label";
import { Separator } from "~/lib/components/ui/separator";
import { Tabs, TabsList, TabsTrigger } from "~/lib/components/ui/tabs";
import { Textarea } from "~/lib/components/ui/textarea";
import { SENATOR_LIST } from "~/lib/senators-list";
import { useTRPC } from "~/lib/trpc/react";
import { cn } from "~/lib/utils";
import { ReasonOptions } from "~/types/ui";
import { Container } from "../-components/container";
import { VoteButtons } from "../-components/vote-buttons";
import { MeSenatorCardAccordion } from "./-components/me-senator-accordion";
import { MeSenatorCard } from "./-components/me-senator-cards";
import { ReasonItem } from "./-components/reason-item";

export const Route = createFileRoute("/(main)/$me_/$senatorLinkName")({
  component: RouteComponent,
  loader: async ({ context, params }) => {
    await context.queryClient.ensureQueryData(
      context.trpc.vote.getSenatorVote.queryOptions({
        senatorId: params.senatorLinkName,
      }),
    );

    await context.queryClient.ensureQueryData(
      context.trpc.vote.getAllReasons.queryOptions({
        senatorId: params.senatorLinkName,
        userId: params.me,
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
    <Container className="flex flex-col gap-4 p-4">
      <MeSenatorCard sen={sen} />
      <MeSenatorCardAccordion sen={sen} />
      <VoteCard />
    </Container>
  );
}

function VoteCard() {
  const params = Route.useParams();
  const context = Route.useRouteContext();
  return (
    <Card className="w-full">
      <CardContent className="flex flex-col">
        <Suspense fallback={<div>Loading...</div>}>
          <VoteCardContent />
        </Suspense>
        <div className="flex justify-between pt-4">
          <h2 className="text-xl font-bold">Your Reason/s</h2>
          {context.user.shortId === params.me ? <AddReasonDialog /> : null}
        </div>
        <ReasonsSection />
      </CardContent>
    </Card>
  );
}

function ReasonsSection() {
  const { senatorLinkName, me } = Route.useParams();
  const trpc = useTRPC();
  const { data } = useSuspenseQuery(
    trpc.vote.getAllReasons.queryOptions({ senatorId: senatorLinkName, userId: me }),
  );
  const positive = data.filter((r) => r.decision === "positive");
  const negative = data.filter((r) => r.decision === "negative");
  const uncertain = data.filter((r) => r.decision === "uncertain");

  return (
    <div className="flex flex-col gap-4">
      {data.length === 0 ? (
        <div className="text-center text-xl font-bold">
          <p className="">No reasons yet</p>
        </div>
      ) : null}
      {positive.length > 0 ? (
        <div className={cn("flex flex-col gap-4", positive.length === 0 && "hidden")}>
          <h3> Positive Reasons</h3>
          <div className="flex flex-col gap-2">
            {positive.map((r) => (
              <ReasonItem key={r.id} reason={r} />
            ))}
          </div>
        </div>
      ) : null}

      {negative.length > 0 ? (
        <>
          <Separator />
          <div className={cn("flex flex-col gap-4", negative.length === 0 && "hidden")}>
            <h3> Negative Reasons</h3>
            <div className="flex flex-col gap-2">
              {negative.map((r) => (
                <ReasonItem key={r.id} reason={r} />
              ))}
            </div>
          </div>
        </>
      ) : null}

      {uncertain.length > 0 ? (
        <>
          <Separator />
          <div className={cn("flex flex-col gap-4", uncertain.length === 0 && "hidden")}>
            <h3> Uncertain Reasons</h3>
            <div className="flex flex-col gap-2">
              {uncertain.map((r) => (
                <ReasonItem key={r.id} reason={r} />
              ))}
            </div>
          </div>
        </>
      ) : null}
    </div>
  );
}

const tagCn = {
  positive: "text-green-600",
  negative: "text-red-600",
  uncertain: "text-orange-300",
};

export function AddReasonDialog() {
  const queryClient = useQueryClient();
  const { senatorLinkName } = Route.useParams();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const trpc = useTRPC();
  const { mutateAsync } = useMutation(
    trpc.vote.addReason.mutationOptions({
      onSettled: () => {
        setIsDialogOpen(false);
        setReason("");
        setSource("");
        if (queryClient.isMutating() === 1) {
          queryClient.invalidateQueries(trpc.vote.getAllReasons.queryFilter());
        }
      },
    }),
  );

  const [tags, setTags] = useState<ReasonOptions>("positive");
  const [reason, setReason] = useState("");
  const [source, setSource] = useState("");

  useHotkeys(
    "ctrl+enter",
    (e) => {
      e.preventDefault();
      if (reason.trim()) {
        mutateAsync({ reason, source, senatorId: senatorLinkName, decision: tags });
      }
    },
    { enableOnFormTags: ["INPUT", "TEXTAREA"] },
  );

  const handleAddReason = () => {
    mutateAsync({ reason, source, senatorId: senatorLinkName, decision: tags });
  };

  return (
    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
      <DialogTrigger asChild>
        <Button size="lg">Add Reason</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>
            Add{" "}
            <span className={tags !== null ? tagCn[tags] : ""}>
              {tags?.toUpperCase()}
            </span>{" "}
            Reason
          </DialogTitle>
          <DialogDescription>
            Share your thoughts about this senator and provide sources if available.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <Tabs>
            <TabsList className="grid w-full grid-cols-3 rounded-[5px] bg-neutral-200 p-[3px] dark:bg-neutral-700">
              <TabsTrigger
                value="positive"
                className="flex items-center gap-1 rounded-xs dark:data-[state=active]:bg-neutral-800"
                onClick={() => setTags("positive")}
              >
                <ThumbsUpIcon size={16} /> Positive
              </TabsTrigger>
              <TabsTrigger
                value="negative"
                className="flex items-center gap-1 rounded-xs dark:data-[state=active]:bg-neutral-800"
                onClick={() => setTags("negative")}
              >
                <ThumbsDownIcon size={16} /> Negative
              </TabsTrigger>
              <TabsTrigger
                value="uncertain"
                className="flex items-center gap-1 rounded-xs dark:data-[state=active]:bg-neutral-800"
                onClick={() => setTags("uncertain")}
              >
                <HelpCircleIcon size={16} /> Uncertain
              </TabsTrigger>
            </TabsList>
          </Tabs>

          <div>
            <Label htmlFor="reason" className="dark:text-neutral-200">
              Your reason
            </Label>
            <Textarea
              id="reason"
              placeholder="Enter your reason here..."
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              className="mt-2 dark:border-neutral-600 dark:bg-neutral-700 dark:placeholder:text-neutral-400"
            />
          </div>
          <div>
            <Label htmlFor="source" className="dark:text-neutral-200">
              Source (optional)
            </Label>
            <Input
              id="source"
              placeholder="Enter source URL or reference..."
              value={source}
              onChange={(e) => setSource(e.target.value)}
              className="mt-2 dark:border-neutral-600 dark:bg-neutral-700 dark:placeholder:text-neutral-400"
            />
          </div>
        </div>
        <DialogFooter className="items-center text-center">
          <span className="text-foreground/50">Ctrl+Enter to submit</span>
          <Button
            variant="outline"
            onClick={() => setIsDialogOpen(false)}
            className="dark:border-neutral-600 dark:text-neutral-200 dark:hover:bg-neutral-700"
          >
            Cancel
          </Button>
          <Button onClick={handleAddReason} disabled={!reason.trim()}>
            Add Reason
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

function VoteCardContent() {
  const { senatorLinkName, me } = Route.useParams();
  const trpc = useTRPC();
  const { data } = useSuspenseQuery(
    trpc.vote.getSenatorVote.queryOptions({ senatorId: senatorLinkName }),
  );

  return (
    <>
      <h3 className="mb-6 text-center text-xl font-medium">How would you vote?</h3>
      <VoteButtons vote={data?.decision} senatorLinkName={senatorLinkName} me={me} />
    </>
  );
}
