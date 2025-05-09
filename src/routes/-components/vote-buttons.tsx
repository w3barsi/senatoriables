import { useMutation, useQueryClient } from "@tanstack/react-query";
import { BugIcon, CheckIcon, XIcon } from "lucide-react";
import { ComponentProps } from "react";
import { Button } from "~/lib/components/ui/button";
import { useTRPC } from "~/lib/trpc/react";
import { cn } from "~/lib/utils";
import { DecisionOptions } from "~/types/ui";

export function VoteButtons({
  vote,
  senatorLinkName,
  me,
}: {
  vote: DecisionOptions;
  senatorLinkName: string;
  me: string;
}) {
  const trpc = useTRPC();
  const queryClient = useQueryClient();
  const { mutateAsync } = useMutation(
    trpc.vote.addVote.mutationOptions({
      onMutate: async ({ sway }) => {
        const getSenatorVoteQF = trpc.vote.getSenatorVote.queryFilter({
          senatorId: senatorLinkName,
        });

        await queryClient.cancelQueries(getSenatorVoteQF);
        const previousSenatorVote = queryClient.getQueryData(getSenatorVoteQF.queryKey);

        if (previousSenatorVote) {
          queryClient.setQueryData(getSenatorVoteQF.queryKey, {
            ...previousSenatorVote,
            decision: sway,
          });
        }

        // FIX: not working when navigating directly to /$me
        // Potential Solution: use "useQuery" instead of "useSuspenseQuery"
        // const getAllVotesQF = trpc.vote.getAllVotes.queryFilter({ userId });
        // await queryClient.cancelQueries(getAllVotesQF);
        // const previousAllVotes = queryClient.getQueryData(getAllVotesQF.queryKey);
        // if (previousAllVotes) {
        //   queryClient.setQueriesData(
        //     getAllVotesQF,
        //     previousAllVotes
        //       .map((v) => {
        //         if (v.senatorId === senatorLinkName) {
        //           return {
        //             ...v,
        //             decision: sway,
        //           };
        //         }
        //         return v;
        //       })
        //       .sort((a, b) => a.id - b.id),
        //   );
        // }
        //

        return { previousSenatorVote };
      },
      onSettled: async () => {
        if (queryClient.isMutating() === 1) {
          queryClient.invalidateQueries(trpc.vote.getSenatorVote.queryFilter());
          queryClient.invalidateQueries(trpc.vote.getAllVotes.queryFilter());
        }
      },
    }),
  );

  return (
    <div className="flex w-full flex-col gap-2">
      <div className="flex w-full flex-col gap-2 lg:flex-row">
        <TestButton
          choice="yes"
          vote={vote}
          onClick={() => mutateAsync({ senatorId: senatorLinkName, sway: "yes", me })}
        />
        <TestButton
          choice="no"
          vote={vote}
          onClick={() => mutateAsync({ senatorId: senatorLinkName, sway: "no", me })}
        />
        <TestButton
          choice="maybe"
          vote={vote}
          onClick={() => mutateAsync({ senatorId: senatorLinkName, sway: "maybe", me })}
        />
      </div>
      <div className="w-full text-center">
        {vote === null ? "You have not voted yet!" : null}
      </div>
    </div>
  );
}

const voteVariants = {
  yes: {
    icon: CheckIcon,
    text: "Yes",
    baseColor: "[--base-color:var(--color-green-500)]",
  },
  no: {
    icon: XIcon,
    text: "No",
    baseColor: "[--base-color:var(--color-red-500)]",
  },
  maybe: {
    icon: BugIcon,
    text: "Maybe",
    baseColor: "[--base-color:var(--color-orange-500)]",
  },
};

function TestButton({
  vote,
  choice,
  ...props
}: ComponentProps<"button"> & {
  choice: Exclude<DecisionOptions, null>;
  vote: DecisionOptions;
}) {
  const VoteIcon = voteVariants[choice].icon;
  return (
    <Button
      variant="outline"
      className={cn(
        voteVariants[choice].baseColor,
        "flex h-auto w-full justify-between gap-0 transition-colors hover:border-(--base-color)/80 hover:bg-(--base-color)/20",
        choice === vote &&
          "border-(--base-color)/80 bg-(--base-color)/20 dark:border-(--base-color)/80 dark:bg-(--base-color)/10 dark:hover:bg-(--base-color)/10",
      )}
      {...props}
    >
      <span
        className={cn(
          "flex size-12 items-center justify-center rounded-full bg-(--base-color)/20 transition-colors",
          choice === vote && "bg-(--base-color)/80 text-white",
        )}
      >
        <VoteIcon size={24} />
      </span>
      <span className="flex grow items-center justify-center">
        {voteVariants[choice].text}
      </span>
    </Button>
  );
}
