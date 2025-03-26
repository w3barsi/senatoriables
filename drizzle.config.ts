import type { Config } from "drizzle-kit";

export default {
  out: "./drizzle",
  schema: "./src/lib/server/schema/index.ts",
  breakpoints: true,
  verbose: true,
  strict: true,
  dialect: "turso",
  casing: "snake_case",
  dbCredentials: {
    url: process.env.DATABASE_URL as string,
    authToken: process.env.DATABASE_AUTH_TOKEN as string,
  },
} satisfies Config;
