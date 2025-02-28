import { relations } from "drizzle-orm/relations";
import { usersInAuth, profiles, authUsers, projects } from "./schema";

export const profilesRelations = relations(profiles, ({one}) => ({
	usersInAuth: one(usersInAuth, {
		fields: [profiles.id],
		references: [usersInAuth.id]
	}),
}));

export const usersInAuthRelations = relations(usersInAuth, ({many}) => ({
	profiles: many(profiles),
}));

export const projectsRelations = relations(projects, ({one}) => ({
	authUser: one(authUsers, {
		fields: [projects.userId],
		references: [authUsers.id]
	}),
}));

export const authUsersRelations = relations(authUsers, ({many}) => ({
	projects: many(projects),
}));