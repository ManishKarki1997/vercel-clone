ALTER TABLE "auth_users" RENAME TO "auth.users";--> statement-breakpoint
ALTER TABLE "projects" DROP CONSTRAINT "projects_user_id_auth_users_id_fk";
--> statement-breakpoint
ALTER TABLE "projects" ADD CONSTRAINT "projects_user_id_auth.users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."auth.users"("id") ON DELETE cascade ON UPDATE no action;