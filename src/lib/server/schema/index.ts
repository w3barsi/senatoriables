export * from "./auth.schema";
// export your other schemas here
import { integer, sqliteTable, text } from "drizzle-orm/sqlite-core";

export const vote = sqliteTable("vote", {
  id: integer({ mode: "number" }).primaryKey({ autoIncrement: true }),
  senatorId: integer({ mode: "number" }),
  userId: text(),
  decision: text({ enum: ["yes", "no", "maybe"] }),
});
