import { pgTable, uuid, varchar, timestamp, text } from "drizzle-orm/pg-core";
import { sql } from "drizzle-orm";

// Reference Supabase auth.users table
export const projects = pgTable("projects", {
  id: uuid("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: uuid("user_id")
    .notNull()
    .references(() => profiles.id, { onDelete: "cascade" }),
  name: varchar("name", { length: 255 }).notNull(),
  description: text("description"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const profiles = pgTable("profiles", {
  id: uuid().primaryKey().notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true, mode: 'string' }),
  username: text(),
  fullName: text("full_name"),
  avatarUrl: text("avatar_url"),
  website: text(),
});
