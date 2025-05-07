import { createTRPCRouter } from "./init";
import { voteRouter } from "./routes/vote";

export const trpcRouter = createTRPCRouter({
  vote: voteRouter,
});

export type TRPCRouter = typeof trpcRouter;
