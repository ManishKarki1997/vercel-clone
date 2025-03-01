import { pgTable, uuid, varchar, timestamp, text, pgEnum } from "drizzle-orm/pg-core";
import { sql } from "drizzle-orm";
import * as t from "drizzle-orm/pg-core";

export const projectStatusEnums = pgEnum("status", ['Active', 'Archived'])

// Reference Supabase auth.users table
export const projects = pgTable("projects", {
  id: uuid("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: uuid("user_id")
    .notNull()
    .references(() => profiles.id, { onDelete: "cascade" }),
  name: varchar("name", { length: 255 }).notNull(),
  slug: varchar("slug", { length: 255 }).unique().notNull(),
  description: text("description"),
  gitUrl: varchar("git_url", { length: 500 }).notNull(),
  branch: varchar("branch", { length: 255 }).default("main"), // useful if i integrate github later
  status: projectStatusEnums("status").default("Active"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
},
  (table) => [
    t.uniqueIndex("name_idx").on(table.name),
    t.uniqueIndex("slug_idx").on(table.slug)
  ]);

export const profiles = pgTable("profiles", {
  id: uuid().primaryKey().notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true, mode: 'string' }),
  username: text(),
  fullName: text("full_name"),
  avatarUrl: text("avatar_url"),
  website: text(),
});
