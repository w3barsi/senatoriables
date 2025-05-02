import { TRPCRouterRecord } from "@trpc/server";
import { z } from "zod";
import { publicProcedure } from "../init";

export const waitRouter = {
  waitThree: publicProcedure.input(z.object({ name: z.string() })).query(async () => {
    await new Promise((resolve) => setTimeout(resolve, 3000));
    return "three";
  }),
} satisfies TRPCRouterRecord;
