import { TRPCRouterRecord } from "@trpc/server";
import { protectedProcedure, publicProcedure } from "../init";

export const testRouter = {
  protectedFn: protectedProcedure.query(async ({ ctx }) => {
    await new Promise((resolve) => setTimeout(resolve, 3000));
    return "test";
  }),
  testFn: publicProcedure.query(async ({ ctx }) => {
    return "unprotected data";
  }),
  longFn: publicProcedure.query(async () => {
    await new Promise((resolve) => setTimeout(resolve, 3000));
    return "long function";
  }),
  longerFn: publicProcedure.query(async () => {
    await new Promise((resolve) => setTimeout(resolve, 6000));
    return "longer function";
  }),
  time: publicProcedure.query(async () => {
    return Date.now();
  }),
} satisfies TRPCRouterRecord;
