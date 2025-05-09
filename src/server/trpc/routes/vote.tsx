import { TRPCError, TRPCRouterRecord } from "@trpc/server";
import { and, eq } from "drizzle-orm";
import { z } from "zod";
import { decisionEnum, reasonDecisionEnum, reasons, vote } from "~/server/db/schema";
import { protectedProcedure } from "../init";

export const voteRouter = {
  addVote: protectedProcedure
    .input(
      z.object({ senatorId: z.string(), sway: z.enum(decisionEnum), me: z.string() }),
    )
    .mutation(async ({ ctx, input }) => {
      if (ctx.session.user.shortId !== input.me) {
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: "You can only vote on your behalf!",
        });
      }
      await ctx.db
        .insert(vote)
        .values({
          decision: input.sway,
          senatorId: input.senatorId,
          userId: ctx.session.user.shortId,
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
      return senVote
        ? senVote
        : {
            id: 0,
            senatorId: input.senatorId,
            userId: ctx.session.user.shortId,
            decision: null,
          };
    }),
  getAllVotes: protectedProcedure
    .input(z.object({ userId: z.string() }))
    .query(async ({ ctx }) => {
      return await ctx.db
        .select()
        .from(vote)
        .where(eq(vote.userId, ctx.session.user.shortId))
        .orderBy(vote.decision);
    }),
  addReason: protectedProcedure
    .input(
      z.object({
        senatorId: z.string(),
        decision: z.enum(reasonDecisionEnum),
        reason: z.string(),
        source: z.string(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      await ctx.db.insert(reasons).values({
        senatorId: input.senatorId,
        userId: ctx.session.user.shortId,
        decision: input.decision,
        reason: input.reason,
        source: input.source,
      });
    }),
  getAllReasons: protectedProcedure
    .input(z.object({ userId: z.string(), senatorId: z.string() }))
    .query(async ({ ctx, input }) => {
      return await ctx.db
        .select()
        .from(reasons)
        .where(
          and(eq(reasons.userId, input.userId), eq(reasons.senatorId, input.senatorId)),
        )
        .orderBy(reasons.createdAt);
    }),
} satisfies TRPCRouterRecord;
