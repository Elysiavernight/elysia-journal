import { Elysia, t } from "elysia";
import { jwt } from "@elysiajs/jwt";
import { db } from "../db";
import { users } from "../database/schema";
import { eq } from "drizzle-orm";

export const authRoutes = new Elysia()
  .use(
    jwt({
      name: "jwt",
      secret: process.env.JWT_SECRET!,
    }),
  )
  .post(
    "/signin",
    async ({ body, jwt, set }) => {
      const user = await db
        .select()
        .from(users)
        .where(eq(users.username, body.username))
        .get();

      if (!user || !(await Bun.password.verify(body.password, user.password))) {
        set.status = 401;
        return { error: "Invalid username or password" };
      }

      const token = await jwt.sign({ id: user.id, username: user.username });
      return { token, display_name: user.display_name };
    },
    {
      body: t.Object({
        username: t.String(),
        password: t.String(),
      }),
    },
  );
