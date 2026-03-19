import {sqliteTable, text, integer} from "drizzle-orm/sqlite-core"

export const users = sqliteTable("users", {
    id : integer("id").primaryKey({autoIncrement: true}),
    username : text("username").notNull().unique(),
    password :  text("password").notNull(),
    display_name : text("display_name")
})


export const journals = sqliteTable("journals",{
    id : integer("id").primaryKey({autoIncrement : true}),
    user_id : integer("user_id").references(()=>users.id),
    topic : text("text").notNull(),
    date : text("date").notNull(),
    content : text("content").notNull(),
    is_public : integer("is_public").default(0),
    created : text("created").notNull().$defaultFn(() => new Date().toISOString())
    

})