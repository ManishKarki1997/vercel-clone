import { pgTable, foreignKey, unique, pgPolicy, check, uuid, timestamp, text, varchar } from "drizzle-orm/pg-core"
import { sql } from "drizzle-orm"



export const profiles = pgTable("profiles", {
	id: uuid().primaryKey().notNull(),
	updatedAt: timestamp("updated_at", { withTimezone: true, mode: 'string' }),
	username: text(),
	fullName: text("full_name"),
	avatarUrl: text("avatar_url"),
	website: text(),
}, (table) => [
	foreignKey({
			columns: [table.id],
			foreignColumns: [users.id],
			name: "profiles_id_fkey"
		}).onDelete("cascade"),
	unique("profiles_username_key").on(table.username),
	pgPolicy("Users can update own profile.", { as: "permissive", for: "update", to: ["public"], using: sql`(( SELECT auth.uid() AS uid) = id)` }),
	pgPolicy("Users can insert their own profile.", { as: "permissive", for: "insert", to: ["public"] }),
	pgPolicy("Public profiles are viewable by everyone.", { as: "permissive", for: "select", to: ["public"] }),
	check("username_length", sql`char_length(username) >= 3`),
]);

export const projects = pgTable("projects", {
	id: uuid().defaultRandom().primaryKey().notNull(),
	userId: uuid("user_id").notNull(),
	name: varchar({ length: 255 }).notNull(),
	description: text(),
	createdAt: timestamp("created_at", { mode: 'string' }).defaultNow().notNull(),
	updatedAt: timestamp("updated_at", { mode: 'string' }).defaultNow().notNull(),
}, (table) => [
	foreignKey({
			columns: [table.userId],
			foreignColumns: [authUsers.id],
			name: "projects_user_id_auth.users_id_fk"
		}).onDelete("cascade"),
]);

export const authUsers = pgTable("auth.users", {
	id: uuid().primaryKey().notNull(),
});
