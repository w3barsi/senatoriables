import { TRPCRouterRecord } from "@trpc/server";
import { publicProcedure } from "~/lib/trpc/init";

export const testRouter = {
  hello: publicProcedure.query(() => {
    return {
      greeting: `hello from tRPC`,
    };
  }),
} satisfies TRPCRouterRecord;
