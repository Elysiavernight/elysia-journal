import { drizzle } from "drizzle-orm/bun-sqlite";
import { Database } from "bun:sqlite";
import * as schema from "./database/schema";

const sqilite = new Database("journal.db");
export const db = drizzle(sqilite, { schema });
