import { Elysia, t } from "elysia";
import { db } from "../db";
import { eq, desc } from "drizzle-orm";
import { jwt } from "@elysiajs/jwt";
import { journals } from "../database/schema";

export const myJournal = new Elysia()
  .use(jwt({ name: "jwt", secret: process.env.JWT_SECRET! }))
  .get("/myjournal", async ({ jwt, headers: { authorization }, set }) => {
    if (!authorization) {
      set.status = 401;
      return { message: "unauthorized" };
    }

    const token = authorization.split(" ")[1];
    const payload = await jwt.verify(token);

    if (!payload || !payload.id) {
      set.status = 401;
      return { message: "Invalid or expired token" };
    }

    return await db
      .select()
      .from(journals)
      .where(eq(journals.user_id, Number(payload.id)))
      .orderBy(desc(journals.created));
  });
