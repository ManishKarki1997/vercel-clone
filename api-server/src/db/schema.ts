import { pgTable, uuid, varchar, timestamp, text, pgEnum } from "drizzle-orm/pg-core";
import { sql } from "drizzle-orm";
import * as t from "drizzle-orm/pg-core";

export const projectStatusEnums = pgEnum("status", ['Active', 'Archived'])
export const projectDeploymentStatusEnums = pgEnum("deployment_status", ['Started', 'Running', 'Completed', 'Failed'])

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
  deploymentUrl: text("deployment_url"), // latest deployment url. in this format `https://${projectSlug}:${reverseProxyUrl}.com
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


export const deployments = pgTable("deployments", {
  id: uuid("id").primaryKey().default(sql`gen_random_uuid()`),
  projectId: uuid("project_id")
    .notNull()
    .references(() => projects.id, { onDelete: "cascade" }),
  status: projectDeploymentStatusEnums("status").default("Started"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  completedAt: timestamp("completed_at"),
  userId: uuid("user_id")
    .notNull()
    .references(() => profiles.id, { onDelete: "cascade" }),
  deploymentUrl: text("deployment_url"), // in this format `https://${projectSlug}:${reverseProxyUrl}.com

  // could be optional if github integration isn't present
  commitHash: varchar("commit_hash", { length: 50 }),
  commitMessage: text("commit_message"),
});

export const projectEnvVariables = pgTable("project_env_variables", {
  id: uuid("id").primaryKey().default(sql`gen_random_uuid()`),
  projectId: uuid("project_id")
    .notNull()
    .references(() => projects.id, { onDelete: "cascade" }),
  userId: uuid("user_id")
    .notNull()
    .references(() => profiles.id, { onDelete: "cascade" }),
  name: varchar("name", { length: 255 }).notNull(),
  value: text("value").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
}, (table) => {
  return {
    uniqueProjectVar: t.unique().on(table.projectId, table.name),
  };
});

export const deploymentLogs = pgTable("deployment_logs", {
  id: uuid("id").primaryKey().default(sql`gen_random_uuid()`),
  projectId: uuid("project_id")
    .notNull()
    .references(() => projects.id, { onDelete: "cascade" }),
  userId: uuid("user_id")
    .notNull()
    .references(() => profiles.id, { onDelete: "cascade" }),
  log: varchar("name",).notNull(),
  timestamp: timestamp("timestamp"),
  deploymentId: uuid("deployment_id")
    .notNull()
    .references(() => deployments.id, { onDelete: "cascade" }),
},
  (table) => [
    t.index("user_deployment_id_idx").on(table.userId, table.deploymentId),
  ]);