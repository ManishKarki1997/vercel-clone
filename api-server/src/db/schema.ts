import { pgTable, uuid, varchar, timestamp, text } from "drizzle-orm/pg-core";
import { sql } from "drizzle-orm";

// Reference Supabase auth.users table
export const projects = pgTable("projects", {
  id: uuid("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: uuid("user_id").notNull().references(() => authUsers.id, { onDelete: "cascade" }),
  name: varchar("name", { length: 255 }).notNull(),
  description: text("description"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// Assuming you have an auth users table reference
export const authUsers = pgTable("auth_users", {
  id: uuid("id").primaryKey(),
});
