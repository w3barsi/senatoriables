import { TRPCRouterRecord } from "@trpc/server";
import { publicProcedure } from "../init";

export const testRouter = {
  testFn: publicProcedure.query(async () => {
    return "test";
  }),
} satisfies TRPCRouterRecord;
