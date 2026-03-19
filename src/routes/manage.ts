import { Elysia, t } from "elysia";
import { db } from "../db";
import { journals } from "../database/schema";
import { eq, and } from "drizzle-orm";
import { jwt } from "@elysiajs/jwt";

export const manage = new Elysia()
  .use(jwt({ name: "jwt", secret: process.env.JWT_SECRET! }))
  .derive(async ({ jwt, headers: { authorization }, set }) => {
    const token = authorization?.split(" ")[1];
    const user = await jwt.verify(token);
    if (!user) {
      set.status = 401;
      throw new Error("Unauthorized");
    }
    return { userId: Number(user.id) };
  })
  .patch(
    "/journal/:id",
    async ({ params: { id }, body, userId }) => {
      return await db
        .update(journals)
        .set({
          topic: body.topic,
          content: body.content,
          is_public: body.is_public ? 1 : 0,
        })
        .where(and(eq(journals.id, Number(id)), eq(journals.user_id, userId)))
        .returning();
    },
    {
      body: t.Object({
        topic: t.Optional(t.String()),
        content: t.Optional(t.String()),
        is_public: t.Optional(t.Boolean()),
      }),
    },
  )
  .delete("/journal/:id", async ({ params: { id }, set, userId }) => {
    const result = await db
      .delete(journals)
      .where(and(eq(journals.id, Number(id)), eq(journals.user_id, userId)))
      .returning();
    if (result.length === 0) {
      set.status = 403;
      return {
        message: `Forbidden! You don't own this entry`,
      };
    }
    return {
      message: `Succesfully removed`,
    };
  });
