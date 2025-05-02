import { useMutation, useQueryClient } from "@tanstack/react-query";
import { BugIcon, CheckIcon, XIcon } from "lucide-react";
import { ComponentProps } from "react";
import { Button } from "~/lib/components/ui/button";
import { useTRPC } from "~/lib/trpc/react";
import { cn } from "~/lib/utils";
import { VoteOptions } from "~/types/ui";

export function VoteButtons({
  vote,
  senatorLinkName,
}: {
  vote: VoteOptions;
  senatorLinkName: string;
}) {
  const trpc = useTRPC();
  const queryClient = useQueryClient();
  const { mutateAsync } = useMutation(
    trpc.vote.addVote.mutationOptions({
      onMutate: async ({ sway }) => {
        const qf = trpc.vote.getSenatorVote.queryFilter({ senatorId: senatorLinkName });
        console.log(qf.queryKey);

        await queryClient.cancelQueries(qf);
        const previousSenatorVote = queryClient.getQueryData(qf.queryKey);

        if (previousSenatorVote) {
          queryClient.setQueryData(qf.queryKey, {
            ...previousSenatorVote,
            decision: sway,
          });
        }

        return { previousSenatorVote };
      },
      onSettled: () => {
        queryClient.invalidateQueries(trpc.vote.getSenatorVote.queryFilter());
      },
    }),
  );

  return (
    <div className="flex w-full flex-row gap-2">
      <TestButton
        choice="yes"
        vote={vote}
        baseColor="green"
        onClick={() => mutateAsync({ senatorId: senatorLinkName, sway: "yes" })}
      />
      <TestButton
        choice="no"
        vote={vote}
        baseColor="red"
        onClick={() => mutateAsync({ senatorId: senatorLinkName, sway: "no" })}
      />
      <TestButton
        choice="maybe"
        vote={vote}
        baseColor="orange"
        onClick={() => mutateAsync({ senatorId: senatorLinkName, sway: "maybe" })}
      />
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
  baseColor,
  choice,
  ...props
}: ComponentProps<"button"> & {
  choice: Exclude<VoteOptions, null>;
  vote: VoteOptions;
  baseColor: string;
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
          "flex size-12 items-center justify-center rounded-full bg-(--base-color)/20",
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
