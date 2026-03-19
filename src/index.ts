import { Elysia, t } from "elysia";
import { db } from "./db";
import { journals } from "./database/schema";
import { authRoutes } from "./auth/auth";
import { jwt } from "@elysiajs/jwt";
import { explore } from "./routes/explore";
import { manage } from "./routes/manage";
import { ratelimit } from "./middleware/ratelimit";
import {cors} from "@elysiajs/cors"

const app = new Elysia()
  .use(cors())
  .use(ratelimit)
  .use(
    jwt({
      name: "jwt",
      secret: process.env.JWT_SECRET!,
    }),
  )
  .group("/api", (app) => app.use(authRoutes))
  .get("/", () => "Hello Elysia")
  .guard(
    {
      async beforeHandle({ jwt, set, headers: { authorization } }) {
        if (!authorization) {
          set.status = 401;
          return { error: "Unauthorized" };
        }
        const token = authorization.split(" ")[1];
        const user = await jwt.verify(token);
        if (!user) {
          set.status = 401;
          return { error: "Invalid token" };
        }
      },
    },
    (app) =>
      app.post(
        "/journal",
        async ({ body }) => {
          return await db
            .insert(journals)
            .values({
              user_id: body.user_id,
              date: body.date,
              topic: body.topic,
              content: body.content,
              is_public: body.is_public ? 1 : 0,
            })
            .returning();
        },
        {
          body: t.Object({
            user_id: t.Number(),
            date: t.String(),
            topic: t.String(),
            content: t.String(),
            is_public: t.Boolean(),
          }),
        },
      ),
  )
  .use(explore)
  .use(manage)
  .listen(7000);

console.log(
  `🦊 Elysia is running at ${app.server?.hostname}:${app.server?.port}`,
);
