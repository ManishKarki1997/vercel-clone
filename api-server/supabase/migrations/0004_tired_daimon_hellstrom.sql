CREATE TYPE "public"."deployment_status" AS ENUM('Running', 'Completed', 'Failed');--> statement-breakpoint
CREATE TABLE "deployments" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"project_id" uuid NOT NULL,
	"status" "deployment_status" DEFAULT 'Running',
	"created_at" timestamp DEFAULT now() NOT NULL,
	"commit_hash" varchar(50) NOT NULL,
	"commit_message" text
);
--> statement-breakpoint
ALTER TABLE "deployments" ADD CONSTRAINT "deployments_project_id_projects_id_fk" FOREIGN KEY ("project_id") REFERENCES "public"."projects"("id") ON DELETE cascade ON UPDATE no action;