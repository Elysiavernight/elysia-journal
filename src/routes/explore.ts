import { Elysia, t } from "elysia";
import { eq, desc } from "drizzle-orm";
import { journals } from "../database/schema";
import { db } from "../db";
import { users } from "../database/schema";

export const explore = new Elysia().get("/explore", async () => {
  return await db
    .select({
      id: journals.id,
      topic: journals.topic,
      date: journals.date,
      content: journals.content,
      created: journals.created,
      display_name: users.display_name,
    })
    .from(journals)
    .innerJoin(users, eq(journals.user_id, users.id))
    .where(eq(journals.is_public, 1))
    .orderBy(desc(journals.created));
});
