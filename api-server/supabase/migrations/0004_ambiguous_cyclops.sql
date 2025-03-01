CREATE TYPE "public"."status" AS ENUM('Active', 'Archived');--> statement-breakpoint
ALTER TABLE "projects" ADD COLUMN "status" "status" DEFAULT 'Active';--> statement-breakpoint
CREATE UNIQUE INDEX "name_idx" ON "projects" USING btree ("name");--> statement-breakpoint
CREATE UNIQUE INDEX "slug_idx" ON "projects" USING btree ("slug");