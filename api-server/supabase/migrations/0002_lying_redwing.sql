--> statement-breakpoint
ALTER TABLE "auth.users" DISABLE ROW LEVEL SECURITY;--> statement-breakpoint
DROP TABLE "auth.users" CASCADE;--> statement-breakpoint
--> statement-breakpoint
ALTER TABLE "projects" ADD CONSTRAINT "projects_user_id_profiles_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."profiles"("id") ON DELETE cascade ON UPDATE no action;