import { TRPCRouterRecord } from "@trpc/server";
import { publicProcedure } from "../init";

export const userRouter = {
  ensureAuthed: publicProcedure.query(async ({ ctx }) => {
    if (!ctx.session?.id) return false;
  }),
} satisfies TRPCRouterRecord;
