import { TRPCRouterRecord } from "@trpc/server";
import { z } from "zod";
import { decisionEnum, vote } from "~/lib/server/schema";
import { protectedProcedure } from "../init";

export const voteRouter = {
  addVote: protectedProcedure
    .input(z.object({ senatorId: z.string(), sway: z.enum(decisionEnum) }))
    .mutation(async ({ ctx, input }) => {
      return await ctx.db.insert(vote).values({
        decision: input.sway,
        senatorId: input.senatorId,
        userId: ctx.session.shortId,
      });
    }),
} satisfies TRPCRouterRecord;
