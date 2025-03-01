ALTER TABLE "deployments" ALTER COLUMN "commit_hash" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "deployments" ADD COLUMN "user_id" uuid NOT NULL;--> statement-breakpoint
ALTER TABLE "deployments" ADD CONSTRAINT "deployments_user_id_profiles_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."profiles"("id") ON DELETE cascade ON UPDATE no action;