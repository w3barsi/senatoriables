import { createTRPCRouter } from "~/lib/trpc/init";
import { testRouter } from "./routes/test";

export const trpcRouter = createTRPCRouter({
  test: testRouter,
});

export type TRPCRouter = typeof trpcRouter;
