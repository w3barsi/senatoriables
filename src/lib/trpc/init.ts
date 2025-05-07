import { initTRPC, TRPCError } from "@trpc/server";
import pc from "picocolors";
import superjson from "superjson";
import { ZodError } from "zod";
import { auth } from "../auth";
import { db } from "../server/db";

export const createContext = async (opts: { headers: Headers; req: Request }) => {
  const session = await auth.api.getSession({
    headers: opts.headers,
  });

  return {
    db,
    session,
    ...opts,
  };
};

type Context = Awaited<ReturnType<typeof createContext>>;

const t = initTRPC.context<Context>().create({
  transformer: superjson,
  errorFormatter({ shape, error }) {
    return {
      ...shape,
      data: {
        ...shape.data,
        zodError: error.cause instanceof ZodError ? error.cause.flatten() : null,
      },
    };
  },
});

export const createTRPCRouter = t.router;

const timingMiddleware = t.middleware(async ({ next, path }) => {
  const start = Date.now();
  // if (t._config.isDev) {
  //   // artificial delay in dev
  //   const waitMs = Math.floor(Math.random() * 400) + 100;
  //   await new Promise((resolve) => setTimeout(resolve, waitMs));
  // }
  const result = await next();
  const end = Date.now();
  console.log(
    `${pc.bgBlue(` [tRPC] `)}${pc.bgRed(pc.black(` ${path} `))} took ${end - start}ms to execute`,
  );

  return result;
});

export const publicProcedure = t.procedure.use(timingMiddleware);

export const protectedProcedure = t.procedure.use(({ ctx, next }) => {
  if (ctx.session === null || ctx.session?.user.id === undefined) {
    throw new TRPCError({ code: "UNAUTHORIZED" });
  }
  return next({
    ctx: {
      // infers the `session` as non-nullable
      session: { ...ctx.session },
    },
  });
});
