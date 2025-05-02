export * from "./auth.schema";
// export your other schemas here
import { integer, sqliteTable, text, unique } from "drizzle-orm/sqlite-core";

export const decisionEnum = ["yes", "no", "maybe"] as const;
export const vote = sqliteTable(
  "vote",
  {
    id: integer({ mode: "number" }).primaryKey({ autoIncrement: true }),
    senatorId: text(), // uses: senatorLinkName
    userId: text(), // uses: user.shortId
    decision: text({ enum: decisionEnum }),
  },
  (t) => [unique().on(t.senatorId, t.userId)],
);
