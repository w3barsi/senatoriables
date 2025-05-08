import { TRPCRouterRecord } from "@trpc/server";
import { protectedProcedure } from "~/server/trpc/init";

export const testRouter = {
  hello: protectedProcedure.query(() => {
    return {
      greeting: `hello from tRPC`,
    };
  }),
} satisfies TRPCRouterRecord;
