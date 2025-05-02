import { TRPCRouterRecord } from "@trpc/server";
import { eq } from "drizzle-orm";
import { z } from "zod";
import { decisionEnum, vote } from "~/lib/server/schema";
import { protectedProcedure } from "../init";

export const voteRouter = {
  addVote: protectedProcedure
    .input(z.object({ senatorId: z.string(), sway: z.enum(decisionEnum) }))
    .mutation(async ({ ctx, input }) => {
      await ctx.db
        .insert(vote)
        .values({
          decision: input.sway,
          senatorId: input.senatorId,
          userId: ctx.session.shortId,
        })
        .onConflictDoUpdate({
          target: [vote.userId, vote.senatorId],
          set: {
            decision: input.sway,
          },
        });
    }),
  getSenatorVote: protectedProcedure
    .input(z.object({ senatorId: z.string() }))
    .query(async ({ ctx, input }) => {
      const [senVote] = await ctx.db
        .select()
        .from(vote)
        .where(eq(vote.senatorId, input.senatorId));
      return senVote ? senVote : null;
    }),
  getAllVotes: protectedProcedure.query(async ({ ctx }) => {
    return await ctx.db
      .select()
      .from(vote)
      .where(eq(vote.userId, ctx.session.shortId))
      .orderBy(vote.decision);
  }),
} satisfies TRPCRouterRecord;
