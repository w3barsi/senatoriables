import { createTRPCRouter } from "~/server/trpc/init";
import { testRouter } from "./routes/test";
import { voteRouter } from "./routes/vote";

export const trpcRouter = createTRPCRouter({
  test: testRouter,
  vote: voteRouter,
});

export type TRPCRouter = typeof trpcRouter;
