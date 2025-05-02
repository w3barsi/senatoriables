import { createTRPCRouter } from "./init";
import { testRouter } from "./routes/test";
import { userRouter } from "./routes/user";
import { voteRouter } from "./routes/vote";
import { waitRouter } from "./routes/wait";

export const trpcRouter = createTRPCRouter({
  test: testRouter,
  user: userRouter,
  vote: voteRouter,
  wait: waitRouter,
});

export type TRPCRouter = typeof trpcRouter;
